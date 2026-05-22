const http = require('http');
const fs = require('fs');
const path = require('path');
const config = require('./config');
const log = require('./logger');
const { getApprovedLeads, updateLeadField } = require('./sheets');
const { generateReport } = require('./reports');
const { createDraft } = require('./gmail');

const PORT = config.PORT || 3000;

// ─── Read all New leads sorted HOT -> WARM -> COLD ────────────────────────────

const { google } = require('googleapis');

function getAuth() {
  const auth = new google.auth.OAuth2(
    config.GOOGLE_OAUTH_CLIENT_ID,
    config.GOOGLE_OAUTH_CLIENT_SECRET,
  );
  auth.setCredentials({ refresh_token: config.GOOGLE_OAUTH_REFRESH_TOKEN });
  return auth;
}

// Read the sheet header row and return a flexible column getter.
// This works with any schema version - old 19-col or new 32-col.
async function readSheet() {
  const sheets = google.sheets({ version: 'v4', auth: getAuth() });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: config.GOOGLE_SHEETS_ID,
    range: `${config.SHEET_TAB_NAME}!A:AF`,
  });
  const [headerRow, ...rows] = res.data.values || [];
  if (!headerRow) return { rows: [], col: () => '' };

  const hIdx = {};
  headerRow.forEach((h, i) => { hIdx[h.trim()] = i; });

  // Try multiple header name variants (handles old + new schema)
  const col = (row, ...names) => {
    for (const n of names) {
      if (hIdx[n] !== undefined && row[hIdx[n]]) return row[hIdx[n]];
    }
    return '';
  };

  return { rows, col, hIdx };
}

function rowToLead(row, col) {
  return {
    name:                  col(row, 'Business Name'),
    lead_score:            col(row, 'Lead Score'),
    findability_score:     col(row, 'Findability Score'),
    priority:              col(row, 'Priority'),
    owner_name:            col(row, 'Owner Name'),
    phone:                 col(row, 'Phone'),
    email:                 col(row, 'Email'),
    website:               col(row, 'Website URL', 'Website'),
    website_platform:      col(row, 'Platform', 'Website Platform'),
    city:                  col(row, 'City'),
    county:                col(row, 'County'),
    rating:                col(row, 'Google Rating'),
    review_count:          col(row, 'Review Count'),
    gbp_score:             col(row, 'GBP Score'),
    cslb_license:          col(row, 'CSLB License'),
    license_status:        col(row, 'License Status'),
    portfolio_buried:      col(row, 'Portfolio Buried'),
    best_hook:             col(row, 'Best Hook'),
    findability_breakdown: col(row, 'Findability Breakdown'),
    status:                col(row, 'Status'),
    email_d0_sent:         col(row, 'Email D0 Sent'),
    email_d3_sent:         col(row, 'Email D3 Sent'),
    email_d7_sent:         col(row, 'Email D7 Sent'),
    audit_url:             col(row, 'Audit URL'),
    grader_generated:      col(row, 'Grader Generated'),
    notes:                 col(row, 'Notes'),
    place_id:              col(row, 'Place ID'),
  };
}

async function getNewLeads() {
  const { rows, col } = await readSheet();
  const expired = new Set(['Expired', 'Inactive']);

  const leads = rows
    .map(row => rowToLead(row, col))
    .filter(lead =>
      lead.status === 'New' &&
      Number(lead.lead_score) >= 3 &&
      !expired.has(lead.license_status)
    );

  const priority = { hot: 0, warm: 1, cold: 2 };
  leads.sort((a, b) => {
    const pa = priority[a.priority?.toLowerCase()] ?? 3;
    const pb = priority[b.priority?.toLowerCase()] ?? 3;
    if (pa !== pb) return pa - pb;
    return Number(b.lead_score) - Number(a.lead_score);
  });

  return leads;
}

async function getDueFollowUps() {
  const { rows, col } = await readSheet();
  const today = new Date().toISOString().slice(0, 10);
  const dueD3 = [];
  const dueD7 = [];

  rows.forEach(row => {
    const lead = rowToLead(row, col);
    if (lead.status !== 'Contacted') return;
    if (lead.email_d0_sent && !lead.email_d3_sent) {
      const diff = Math.floor((new Date(today) - new Date(lead.email_d0_sent)) / 86400000);
      if (diff >= 3) dueD3.push(lead);
    }
    if (lead.email_d3_sent && !lead.email_d7_sent) {
      const diff = Math.floor((new Date(today) - new Date(lead.email_d3_sent)) / 86400000);
      if (diff >= 4) dueD7.push(lead);
    }
  });

  return { dueD3, dueD7 };
}

// ─── Approval handler ─────────────────────────────────────────────────────────

async function handleApprove(lead, notes) {
  const score = Number(lead.lead_score) || 0;
  let driveLink = null;
  const warnings = [];

  if (notes) await updateLeadField(lead.place_id, 'notes', notes);

  if (score >= 6) {
    try {
      const report = await generateReport(lead);
      driveLink = report.driveLink;
      await updateLeadField(lead.place_id, 'audit_url', driveLink);
      await updateLeadField(lead.place_id, 'grader_generated', new Date().toISOString().slice(0, 10));
    } catch (err) {
      warnings.push(`Report generation failed: ${err.message}`);
      log.error(`Report generation failed for ${lead.name}: ${err.message}`);
    }
  }

  if (score >= 4) {
    try {
      await createDraft(lead, driveLink);
    } catch (err) {
      warnings.push(`Draft creation failed: ${err.message}`);
      log.error(`Draft creation failed for ${lead.name}: ${err.message}`);
    }
  }

  await updateLeadField(lead.place_id, 'status', 'Contacted');
  return { driveLink, warnings };
}

// ─── Request router ───────────────────────────────────────────────────────────

async function handleRequest(req, res) {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (req.method === 'GET' && url.pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(buildAppHTML());
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/leads') {
    try {
      const leads = await getNewLeads();
      const { dueD3, dueD7 } = await getDueFollowUps();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ leads, dueD3, dueD7 }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/approve') {
    let body = '';
    req.on('data', d => { body += d; });
    req.on('end', async () => {
      try {
        const { lead, notes } = JSON.parse(body);
        const result = await handleApprove(lead, notes);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, ...result }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/skip') {
    let body = '';
    req.on('data', d => { body += d; });
    req.on('end', async () => {
      try {
        const { place_id, notes } = JSON.parse(body);
        if (notes) await updateLeadField(place_id, 'notes', notes);
        await updateLeadField(place_id, 'status', 'Skipped');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end('Not found');
}

// ─── HTML app ─────────────────────────────────────────────────────────────────

function buildAppHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>RemodelerRank - Morning Review</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Lora:wght@600&family=Karla:wght@400;500;700&display=swap" rel="stylesheet">
<style>
:root {
  --bg: #F5F7F5;
  --surface: #FFFFFF;
  --sage: #8BA89A;
  --sage-light: #EEF2EF;
  --sage-dark: #4A7C6F;
  --charcoal: #2C2C2C;
  --text: #3A3A3A;
  --text-light: #6E7E78;
  --border: #DDE6E1;
  --hot: #C0392B;
  --warm: #D4801A;
  --cold: #8BA89A;
  --approve-green: #2D7A4F;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Karla', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; }

.header {
  background: var(--sage-dark);
  color: white;
  padding: 14px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 10;
}
.header-brand { font-family: 'Lora', serif; font-size: 18px; }
.header-stats { display: flex; gap: 20px; font-size: 13px; }
.stat { opacity: 0.85; }
.stat strong { font-weight: 700; opacity: 1; }
.stat.hot strong { color: #FFAAAA; }
.stat.warm strong { color: #FFD088; }

.followup-bar {
  background: #FFF8ED;
  border-bottom: 1px solid #C9963A;
  padding: 10px 32px;
  font-size: 13px;
  color: #7A5B20;
  cursor: pointer;
  display: none;
}
.followup-bar.has-items { display: flex; align-items: center; gap: 12px; }
.followup-panel {
  background: #FFFBF2;
  border-bottom: 1px solid #DDD0B0;
  padding: 16px 32px;
  display: none;
}
.followup-panel.open { display: block; }
.followup-section { margin-bottom: 12px; }
.followup-section h4 { font-size: 12px; text-transform: uppercase; letter-spacing: 0.8px; color: #C9963A; margin-bottom: 6px; }
.followup-item { font-size: 13px; color: var(--text); padding: 4px 0; }

.main { display: flex; justify-content: center; padding: 32px 20px; }

.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  width: 100%;
  max-width: 680px;
  padding: 28px 32px;
}
.card-empty {
  text-align: center;
  padding: 60px 32px;
  color: var(--text-light);
  font-size: 15px;
}
.card-empty p { margin-top: 8px; font-size: 13px; }

.card-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; }
.priority-badge {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  padding: 4px 10px;
  border-radius: 20px;
  text-transform: uppercase;
}
.priority-badge.hot { background: #FDECEA; color: var(--hot); }
.priority-badge.warm { background: #FEF3E2; color: var(--warm); }
.priority-badge.cold { background: var(--sage-light); color: var(--cold); }

.scores { display: flex; gap: 16px; align-items: center; }
.score-item { text-align: right; }
.score-item .num { font-family: 'Lora', serif; font-size: 22px; color: var(--charcoal); }
.score-item .num span { font-size: 13px; color: var(--text-light); font-family: 'Karla', sans-serif; }
.score-item .lbl { font-size: 10px; text-transform: uppercase; letter-spacing: 0.6px; color: var(--text-light); }

.biz-name { font-family: 'Lora', serif; font-size: 24px; color: var(--charcoal); }
.biz-location { font-size: 13px; color: var(--text-light); margin-top: 3px; }

.divider { border: none; border-top: 1px solid var(--border); margin: 18px 0; }

.data-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px 16px; }
.data-item label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; color: var(--sage); display: block; margin-bottom: 2px; }
.data-item .val { font-size: 13px; font-weight: 500; color: var(--charcoal); }
.data-item .val a { color: var(--sage-dark); text-decoration: none; }
.data-item .val a:hover { text-decoration: underline; }

.findability-row { display: flex; flex-wrap: wrap; gap: 8px; margin: 4px 0; }
.fi-check { font-size: 12px; padding: 3px 10px; border-radius: 20px; font-weight: 500; }
.fi-check.yes { background: #EEF7F2; color: #2D7A4F; }
.fi-check.no  { background: #FDF0EE; color: #c0601a; }

.hook-box { background: var(--sage-light); border-radius: 8px; padding: 14px 16px; font-size: 14px; line-height: 1.6; color: var(--charcoal); font-style: italic; }

.notes-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px; color: var(--sage); margin-bottom: 6px; display: block; }
.notes-input {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 8px 12px;
  font-family: 'Karla', sans-serif;
  font-size: 13px;
  color: var(--text);
  background: var(--bg);
  resize: vertical;
  min-height: 56px;
}
.notes-input:focus { outline: 2px solid var(--sage); outline-offset: 1px; }

.action-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}
.nav-info { font-size: 12px; color: var(--text-light); }

.btn-skip {
  background: none;
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 10px 20px;
  font-family: 'Karla', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-light);
  cursor: pointer;
  transition: all 0.15s;
}
.btn-skip:hover { border-color: #C0392B; color: #C0392B; }

.btn-approve {
  background: var(--approve-green);
  border: none;
  border-radius: 6px;
  padding: 10px 24px;
  font-family: 'Karla', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: white;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-approve:hover { background: #235F3C; }
.btn-approve:disabled { background: var(--sage); cursor: default; }

.kbd-hint { font-size: 11px; color: var(--text-light); text-align: center; margin-top: 12px; }
kbd { background: #EEE; border: 1px solid #CCC; border-radius: 3px; padding: 1px 5px; font-size: 11px; font-family: monospace; }

.toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%) translateY(20px);
  background: var(--charcoal);
  color: white;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 13px;
  opacity: 0;
  transition: all 0.2s;
  pointer-events: none;
}
.toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

.loading { text-align: center; padding: 60px; color: var(--text-light); }
</style>
</head>
<body>

<div class="header">
  <div class="header-brand">RemodelerRank</div>
  <div class="header-stats">
    <div class="stat">New: <strong id="stat-total">-</strong></div>
    <div class="stat hot">HOT: <strong id="stat-hot">-</strong></div>
    <div class="stat warm">WARM: <strong id="stat-warm">-</strong></div>
  </div>
</div>

<div class="followup-bar" id="followup-bar" onclick="toggleFollowups()">
  <span id="followup-summary"></span>
  <span style="margin-left:auto; font-size:11px; opacity:0.7;">click to expand</span>
</div>
<div class="followup-panel" id="followup-panel">
  <div id="followup-content"></div>
</div>

<div class="main">
  <div id="app-root"><div class="loading">Loading leads...</div></div>
</div>

<div class="toast" id="toast"></div>

<script>
let leads = [];
let currentIndex = 0;

async function init() {
  try {
    const res = await fetch('/api/leads');
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    leads = data.leads;
    renderFollowUps(data.dueD3, data.dueD7);
    updateStats();
    renderCard();
  } catch (err) {
    document.getElementById('app-root').innerHTML =
      '<div class="card card-empty">Failed to load leads: ' + err.message + '</div>';
  }
}

function updateStats() {
  const hot  = leads.filter(l => l.priority?.toLowerCase() === 'hot').length;
  const warm = leads.filter(l => l.priority?.toLowerCase() === 'warm').length;
  document.getElementById('stat-total').textContent = leads.length;
  document.getElementById('stat-hot').textContent   = hot;
  document.getElementById('stat-warm').textContent  = warm;
}

function renderFollowUps(dueD3, dueD7) {
  const bar = document.getElementById('followup-bar');
  const content = document.getElementById('followup-content');
  if (!dueD3.length && !dueD7.length) return;

  const total = dueD3.length + dueD7.length;
  document.getElementById('followup-summary').textContent =
    total + ' follow-up' + (total > 1 ? 's' : '') + ' due today';
  bar.classList.add('has-items');

  let html = '';
  if (dueD3.length) {
    html += '<div class="followup-section"><h4>Day 3 follow-ups (' + dueD3.length + ')</h4>';
    dueD3.forEach(l => { html += '<div class="followup-item">' + l.name + ' - send D3 today</div>'; });
    html += '</div>';
  }
  if (dueD7.length) {
    html += '<div class="followup-section"><h4>Day 7 closes (' + dueD7.length + ')</h4>';
    dueD7.forEach(l => { html += '<div class="followup-item">' + l.name + ' - last follow-up today</div>'; });
    html += '</div>';
  }
  content.innerHTML = html;
}

function toggleFollowups() {
  const panel = document.getElementById('followup-panel');
  panel.classList.toggle('open');
}

function renderCard() {
  const root = document.getElementById('app-root');

  if (!leads.length || currentIndex >= leads.length) {
    root.innerHTML = '<div class="card card-empty"><strong>All caught up.</strong><p>No new leads to review. Check back after the next nightly run.</p></div>';
    return;
  }

  const lead = leads[currentIndex];
  const priorityClass = lead.priority?.toLowerCase() || 'cold';
  const fb = parseFindability(lead.findability_breakdown);

  const websiteDisplay = lead.website
    ? '<a href="' + escHtml(lead.website) + '" target="_blank" rel="noopener">' + escHtml(lead.website.replace(/^https?:\\/\\//, '').slice(0, 30)) + ' &nearr;</a>'
    : 'None';

  const cslbDisplay = lead.cslb_license
    ? escHtml(lead.cslb_license) + ' - ' + escHtml(lead.license_status)
    : escHtml(lead.license_status || 'N/A');

  root.innerHTML = \`
    <div class="card">
      <div class="card-top">
        <span class="priority-badge \${priorityClass}">\${escHtml(lead.priority || 'cold')}</span>
        <div class="scores">
          <div class="score-item">
            <div class="lbl">Lead Score</div>
            <div class="num">\${lead.lead_score || 0}<span>/10</span></div>
          </div>
          <div class="score-item">
            <div class="lbl">Findability</div>
            <div class="num">\${lead.findability_score || 0}<span>/10</span></div>
          </div>
        </div>
      </div>

      <div class="biz-name">\${escHtml(lead.name)}</div>
      <div class="biz-location">\${[lead.city, lead.county].filter(Boolean).map(escHtml).join(', ')}</div>

      <hr class="divider">

      <div class="data-grid">
        <div class="data-item"><label>Phone</label><div class="val">\${escHtml(lead.phone || 'None')}</div></div>
        <div class="data-item"><label>Email</label><div class="val">\${escHtml(lead.email || 'Not found')}</div></div>
        <div class="data-item"><label>Website</label><div class="val">\${websiteDisplay}</div></div>
        <div class="data-item"><label>Platform</label><div class="val">\${escHtml(lead.website_platform || 'N/A')}</div></div>
        <div class="data-item"><label>GBP Score</label><div class="val">\${lead.gbp_score || 0}/10</div></div>
        <div class="data-item"><label>CSLB</label><div class="val">\${cslbDisplay}</div></div>
        <div class="data-item"><label>Rating</label><div class="val">\${lead.rating ? lead.rating + ' (' + lead.review_count + ' reviews)' : 'N/A'}</div></div>
        <div class="data-item"><label>Portfolio Buried</label><div class="val">\${lead.portfolio_buried === 'true' || lead.portfolio_buried === true ? 'Yes' : 'No'}</div></div>
        <div class="data-item"><label>Owner</label><div class="val">\${escHtml(lead.owner_name || 'Unknown')}</div></div>
      </div>

      <hr class="divider">

      <div style="margin-bottom:10px; font-size:11px; text-transform:uppercase; letter-spacing:0.8px; color:var(--sage);">Findability</div>
      <div class="findability-row">
        \${fiCheck('GBP', fb.gbp_claimed)}
        \${fiCheck('GBP Complete', fb.gbp_complete)}
        \${fiCheck('Yelp', fb.yelp_active)}
        \${fiCheck('Houzz', fb.houzz_profile)}
        \${fiCheck('BBB', fb.bbb_accredited)}
        \${fiCheck('BuildZoom', fb.buildzoom_active)}
      </div>

      <hr class="divider">

      \${lead.best_hook ? '<div class="hook-box">' + escHtml(lead.best_hook) + '</div><hr class="divider">' : ''}

      <label class="notes-label">Notes (optional)</label>
      <textarea class="notes-input" id="notes-input" placeholder="Add notes before approving or skipping..."></textarea>

      <div class="action-row">
        <button class="btn-skip" onclick="skipLead()">Skip &rarr;</button>
        <div class="nav-info">\${currentIndex + 1} of \${leads.length}</div>
        <button class="btn-approve" id="btn-approve" onclick="approveLead()">Approve + Generate</button>
      </div>
      <div class="kbd-hint"><kbd>A</kbd> Approve &nbsp; <kbd>S</kbd> Skip &nbsp; <kbd>O</kbd> Open site &nbsp; <kbd>&larr;</kbd><kbd>&rarr;</kbd> Navigate</div>
    </div>
  \`;
}

function fiCheck(label, val) {
  const yes = val === true || val === 'true';
  return '<span class="fi-check ' + (yes ? 'yes' : 'no') + '">' + (yes ? '&#10003;' : '&#10007;') + ' ' + label + '</span>';
}

function parseFindability(raw) {
  if (!raw) return {};
  if (typeof raw === 'object') return raw;
  try { return JSON.parse(raw); } catch { return {}; }
}

function escHtml(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function getNotes() {
  const el = document.getElementById('notes-input');
  return el ? el.value.trim() : '';
}

function openSite() {
  const lead = leads[currentIndex];
  if (lead && lead.website) window.open(lead.website, '_blank');
}

async function approveLead() {
  const lead = leads[currentIndex];
  const notes = getNotes();
  const btn = document.getElementById('btn-approve');
  if (btn) { btn.disabled = true; btn.textContent = 'Generating...'; }

  try {
    const res = await fetch('/api/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lead, notes }),
    });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || 'Unknown error');
    showToast('Approved. Draft + report generated.');
    leads.splice(currentIndex, 1);
    if (currentIndex >= leads.length && currentIndex > 0) currentIndex--;
    updateStats();
    renderCard();
  } catch (err) {
    showToast('Error: ' + err.message);
    if (btn) { btn.disabled = false; btn.textContent = 'Approve + Generate'; }
  }
}

async function skipLead() {
  const lead = leads[currentIndex];
  const notes = getNotes();

  try {
    await fetch('/api/skip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ place_id: lead.place_id, notes }),
    });
    showToast('Skipped.');
    leads.splice(currentIndex, 1);
    if (currentIndex >= leads.length && currentIndex > 0) currentIndex--;
    updateStats();
    renderCard();
  } catch (err) {
    showToast('Error: ' + err.message);
  }
}

function navigate(dir) {
  currentIndex = Math.max(0, Math.min(leads.length - 1, currentIndex + dir));
  renderCard();
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

document.addEventListener('keydown', e => {
  if (e.target.tagName === 'TEXTAREA') return;
  if (e.key === 'a' || e.key === 'A') approveLead();
  if (e.key === 's' || e.key === 'S') skipLead();
  if (e.key === 'o' || e.key === 'O') openSite();
  if (e.key === 'ArrowLeft')  navigate(-1);
  if (e.key === 'ArrowRight') navigate(1);
});

init();
</script>
</body>
</html>`;
}

// ─── Start server ─────────────────────────────────────────────────────────────

const server = http.createServer(async (req, res) => {
  try {
    await handleRequest(req, res);
  } catch (err) {
    log.error(`Server error: ${err.message}`);
    res.writeHead(500);
    res.end('Internal server error');
  }
});

server.listen(PORT, () => {
  log.info(`Morning review app running at http://localhost:${PORT}`);
  console.log(`\nOpen http://localhost:${PORT} in your browser.\n`);
});
