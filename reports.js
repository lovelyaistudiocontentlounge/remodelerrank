const { google } = require('googleapis');
const { Readable } = require('stream');
const Anthropic = require('@anthropic-ai/sdk');
const config = require('./config');
const { reportPrompt } = require('./prompts');

const client = new Anthropic({ apiKey: config.ANTHROPIC_API_KEY });

// ─── Grade system ─────────────────────────────────────────────────────────────

function scoreToGrade(score) {
  if (score >= 8) return { letter: 'A', color: '#55c490', label: 'Strong opportunity' };
  if (score >= 6) return { letter: 'B', color: '#8BC48A', label: 'Good opportunity' };
  if (score >= 5) return { letter: 'C', color: '#C9963A', label: 'Moderate opportunity' };
  if (score >= 3) return { letter: 'D', color: '#c0601a', label: 'Low opportunity' };
  return             { letter: 'F', color: '#c0392b', label: 'Not recommended' };
}

// ─── Revenue math ─────────────────────────────────────────────────────────────

function revenueBlock(lead) {
  const avgProject = 18000;
  const missedPerMonth = lead.review_count < 20 ? 2 : lead.review_count < 50 ? 1 : 0;
  if (!missedPerMonth) return null;
  const annual = (missedPerMonth * avgProject * 12).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  return { missedPerMonth, annual, city: lead.city || 'your area' };
}

// ─── Claude audit content ─────────────────────────────────────────────────────

async function generateAuditContent(lead) {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 600,
    messages: [{ role: 'user', content: reportPrompt(lead) }],
  });
  return message.content[0].text.trim();
}

// ─── HTML report builder ──────────────────────────────────────────────────────

function buildHTML(lead, auditText) {
  const grade = scoreToGrade(lead.lead_score || 0);
  const rev = revenueBlock(lead);
  const date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const findability = lead.findability_breakdown || {};

  const checkItem = (label, val) =>
    `<span class="check ${val ? 'yes' : 'no'}">${val ? '&#10003;' : '&#10007;'} ${label}</span>`;

  const revenueSection = rev ? `
    <div class="revenue-block">
      <div class="revenue-label">Estimated Revenue Impact</div>
      <div class="revenue-number">~${rev.annual}/year in unrealized revenue</div>
      <div class="revenue-sub">Based on ~${rev.missedPerMonth} missed project${rev.missedPerMonth > 1 ? 's' : ''}/month vs. top competitors in ${rev.city}. Avg. remodeling project value $18,000.</div>
    </div>` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Web Presence Audit - ${lead.name}</title>
<style>
  :root {
    --sage: #4A7C6F;
    --sage-light: #EEF2EF;
    --amber: #C9963A;
    --charcoal: #2C2C2C;
    --text: #3A3A3A;
    --border: #DDE6E1;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Karla', sans-serif; background: #F5F7F5; color: var(--text); }
  @import url('https://fonts.googleapis.com/css2?family=Lora:wght@600&family=Karla:wght@400;500;700&display=swap');
  .header { background: var(--sage); color: white; padding: 24px 40px; display: flex; justify-content: space-between; align-items: center; }
  .header h1 { font-family: 'Lora', serif; font-size: 22px; font-weight: 600; }
  .header .date { font-size: 13px; opacity: 0.8; }
  .container { max-width: 780px; margin: 32px auto; padding: 0 20px; }
  .card { background: white; border-radius: 8px; border: 1px solid var(--border); padding: 32px; margin-bottom: 20px; }
  .top-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
  .biz-name { font-family: 'Lora', serif; font-size: 26px; color: var(--charcoal); }
  .biz-sub { color: #6E7E78; font-size: 14px; margin-top: 4px; }
  .grade-badge { text-align: center; padding: 12px 20px; border-radius: 8px; color: white; min-width: 80px; }
  .grade-badge .letter { font-family: 'Lora', serif; font-size: 36px; line-height: 1; }
  .grade-badge .label { font-size: 11px; opacity: 0.9; margin-top: 4px; }
  .data-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 32px; margin-bottom: 24px; }
  .data-item label { font-size: 11px; color: #8BA89A; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 2px; }
  .data-item span { font-size: 14px; font-weight: 500; color: var(--charcoal); }
  .divider { border: none; border-top: 1px solid var(--border); margin: 20px 0; }
  .section-title { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: var(--sage); font-weight: 700; margin-bottom: 12px; }
  .findability-checks { display: flex; flex-wrap: wrap; gap: 8px; }
  .check { font-size: 13px; padding: 4px 10px; border-radius: 20px; font-weight: 500; }
  .check.yes { background: #EEF7F2; color: #2D7A4F; }
  .check.no  { background: #FDF0EE; color: #c0601a; }
  .revenue-block { background: #FFF8ED; border: 1px solid #C9963A; border-radius: 8px; padding: 20px; margin: 20px 0; }
  .revenue-label { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: var(--amber); font-weight: 700; }
  .revenue-number { font-family: 'Lora', serif; font-size: 24px; color: var(--charcoal); margin: 6px 0; }
  .revenue-sub { font-size: 12px; color: #8B7355; }
  .audit-text { font-size: 15px; line-height: 1.7; color: var(--text); white-space: pre-wrap; }
  .before-after { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 20px 0; }
  .img-slot { background: var(--sage-light); border: 2px dashed var(--border); border-radius: 8px; padding: 40px 20px; text-align: center; color: #8BA89A; font-size: 13px; }
  .img-slot img { width: 100%; height: auto; border-radius: 4px; display: block; }
  .img-slot.placeholder { display: flex; align-items: center; justify-content: center; min-height: 160px; flex-direction: column; gap: 8px; }
  .footer { background: var(--sage); color: white; text-align: center; padding: 16px; font-size: 12px; margin-top: 40px; }
  .score-row { display: flex; gap: 24px; margin-bottom: 20px; }
  .score-pill { flex: 1; background: var(--sage-light); border-radius: 8px; padding: 14px 16px; }
  .score-pill .score-num { font-family: 'Lora', serif; font-size: 28px; color: var(--charcoal); }
  .score-pill .score-label { font-size: 11px; color: #8BA89A; text-transform: uppercase; letter-spacing: 0.5px; }
</style>
</head>
<body>

<div class="header">
  <h1>Web Presence Audit</h1>
  <div class="date">Prepared ${date}</div>
</div>

<div class="container">
  <div class="card">
    <div class="top-row">
      <div>
        <div class="biz-name">${lead.name}</div>
        <div class="biz-sub">${[lead.city, lead.county].filter(Boolean).join(', ')} &middot; ${lead.phone || 'No phone listed'}</div>
      </div>
      <div class="grade-badge" style="background:${grade.color}">
        <div class="letter">${grade.letter}</div>
        <div class="label">${grade.label}</div>
      </div>
    </div>

    <div class="score-row">
      <div class="score-pill">
        <div class="score-label">Lead Score</div>
        <div class="score-num">${lead.lead_score || 0}<span style="font-size:16px;color:#8BA89A">/10</span></div>
      </div>
      <div class="score-pill">
        <div class="score-label">GBP Score</div>
        <div class="score-num">${lead.gbp_score || 0}<span style="font-size:16px;color:#8BA89A">/10</span></div>
      </div>
      <div class="score-pill">
        <div class="score-label">Findability</div>
        <div class="score-num">${lead.findability_score || 0}<span style="font-size:16px;color:#8BA89A">/10</span></div>
      </div>
    </div>

    <div class="data-grid">
      <div class="data-item"><label>Website</label><span>${lead.website || 'None'}</span></div>
      <div class="data-item"><label>Platform</label><span>${lead.website_platform || 'N/A'}</span></div>
      <div class="data-item"><label>Google Rating</label><span>${lead.rating ? `${lead.rating} (${lead.review_count} reviews)` : 'N/A'}</span></div>
      <div class="data-item"><label>CSLB License</label><span>${lead.cslb_license ? `${lead.cslb_license} - ${lead.license_status}` : lead.license_status || 'N/A'}</span></div>
      <div class="data-item"><label>Email</label><span>${lead.email || 'Not found'}</span></div>
      <div class="data-item"><label>Portfolio Buried</label><span>${lead.portfolio_buried ? 'Yes' : 'No'}</span></div>
    </div>

    <hr class="divider">
    <div class="section-title">Findability Breakdown</div>
    <div class="findability-checks">
      ${checkItem('GBP Claimed', findability.gbp_claimed)}
      ${checkItem('GBP Complete', findability.gbp_complete)}
      ${checkItem('Yelp Active', findability.yelp_active)}
      ${checkItem('Houzz', findability.houzz_profile)}
      ${checkItem('BBB', findability.bbb_accredited)}
      ${checkItem('BuildZoom', findability.buildzoom_active)}
    </div>
  </div>

  ${revenueSection}

  <div class="card">
    <div class="section-title">Before / After</div>
    <div class="before-after">
      <div class="img-slot placeholder">
        <span>BEFORE</span>
        <span style="font-size:11px">Screenshot current site at 1280px wide, top 900px.<br>Save as before.png and embed as base64 src.</span>
      </div>
      <div class="img-slot placeholder">
        <span>AFTER</span>
        <span style="font-size:11px">Screenshot mini-site mockup at 1280px wide, top 900px.<br>Save as after.png and embed as base64 src.</span>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="section-title">Audit Findings</div>
    <div class="audit-text">${auditText}</div>
  </div>
</div>

<div class="footer">
  RemodelerRank &middot; hey@remodelerrank.com &middot; 925-940-9484 &middot; Confidential
</div>

</body>
</html>`;
}

// ─── Upload HTML to Google Drive ──────────────────────────────────────────────

function getAuth() {
  const auth = new google.auth.OAuth2(config.GOOGLE_OAUTH_CLIENT_ID, config.GOOGLE_OAUTH_CLIENT_SECRET);
  auth.setCredentials({ refresh_token: config.GOOGLE_OAUTH_REFRESH_TOKEN });
  return auth;
}

async function uploadToDrive(htmlContent, filename) {
  const drive = google.drive({ version: 'v3', auth: getAuth() });
  const readable = Readable.from(Buffer.from(htmlContent, 'utf8'));
  const res = await drive.files.create({
    requestBody: {
      name: filename,
      mimeType: 'text/html',
      ...(config.REPORTS_DRIVE_FOLDER_ID && { parents: [config.REPORTS_DRIVE_FOLDER_ID] }),
    },
    media: { mimeType: 'text/html', body: readable },
    fields: 'id, webViewLink',
  });
  return { fileId: res.data.id, driveLink: res.data.webViewLink };
}

// ─── Main entry ───────────────────────────────────────────────────────────────

async function generateReport(lead) {
  const auditText = await generateAuditContent(lead);
  const html = buildHTML(lead, auditText);
  const safeName = lead.name.replace(/[^a-z0-9]/gi, '-').toLowerCase();
  const date = new Date().toISOString().slice(0, 10);
  const filename = `${safeName}-audit-${date}.html`;
  const { fileId, driveLink } = await uploadToDrive(html, filename);
  return { html, filename, fileId, driveLink };
}

module.exports = { generateReport, scoreToGrade };
