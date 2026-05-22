const { google } = require('googleapis');
const config = require('./config');

// Column order A-AF (32 columns) — must match header exactly
const COLUMNS = [
  'date_added',            // A
  'lead_score',            // B
  'findability_score',     // C
  'priority',              // D
  'name',                  // E
  'owner_name',            // F
  'phone',                 // G
  'email',                 // H
  'email_found',           // I
  'website',               // J
  'website_platform',      // K
  'city',                  // L
  'county',                // M
  'rating',                // N
  'review_count',          // O
  'gbp_score',             // P
  'cslb_license',          // Q
  'license_status',        // R
  'portfolio_buried',      // S
  'best_hook',             // T
  'findability_breakdown', // U
  'status',                // V
  'email_d0_sent',         // W
  'email_d3_sent',         // X
  'email_d7_sent',         // Y
  'text_d0_sent',          // Z
  'text_d4_sent',          // AA
  'reply_received',        // AB
  'audit_url',             // AC
  'grader_generated',      // AD
  'notes',                 // AE
  'place_id',              // AF
];

const HEADER_ROW = [
  'Date Added', 'Lead Score', 'Findability Score', 'Priority',
  'Business Name', 'Owner Name', 'Phone', 'Email', 'Email Found',
  'Website URL', 'Platform', 'City', 'County',
  'Google Rating', 'Review Count', 'GBP Score',
  'CSLB License', 'License Status', 'Portfolio Buried',
  'Best Hook', 'Findability Breakdown', 'Status',
  'Email D0 Sent', 'Email D3 Sent', 'Email D7 Sent',
  'Text D0 Sent', 'Text D4 Sent', 'Reply Received',
  'Audit URL', 'Grader Generated', 'Notes', 'Place ID',
];

const LAST_COL = 'AF';
const NUMERIC_COLS = new Set(['lead_score', 'findability_score', 'rating', 'review_count', 'gbp_score', 'photo_count']);

function getAuth() {
  const auth = new google.auth.OAuth2(
    config.GOOGLE_OAUTH_CLIENT_ID,
    config.GOOGLE_OAUTH_CLIENT_SECRET,
  );
  auth.setCredentials({ refresh_token: config.GOOGLE_OAUTH_REFRESH_TOKEN });
  return auth;
}

function getSheets() {
  return google.sheets({ version: 'v4', auth: getAuth() });
}

async function ensureHeader() {
  const sheets = getSheets();
  const range = `${config.SHEET_TAB_NAME}!A1:${LAST_COL}1`;
  const res = await sheets.spreadsheets.values.get({ spreadsheetId: config.GOOGLE_SHEETS_ID, range });
  const existing = res.data.values?.[0];
  if (!existing || existing[0] !== 'Date Added') {
    await sheets.spreadsheets.values.update({
      spreadsheetId: config.GOOGLE_SHEETS_ID,
      range,
      valueInputOption: 'RAW',
      requestBody: { values: [HEADER_ROW] },
    });
  }
}

function leadToRow(lead) {
  const today = new Date().toISOString().slice(0, 10);
  return COLUMNS.map(col => {
    if (col === 'date_added') return today;
    if (col === 'status') return lead.status || 'New';
    if (col === 'email_found') return lead.email ? true : false;
    if (col === 'findability_breakdown') {
      const v = lead.findability_breakdown;
      return v ? JSON.stringify(v) : '';
    }
    const val = lead[col];
    if (val === null || val === undefined || val === '') return '';
    if (NUMERIC_COLS.has(col)) return Number(val) || 0;
    return String(val);
  });
}

async function appendLeads(leads) {
  if (!leads.length) return 0;
  await ensureHeader();
  const rows = leads.map(leadToRow);
  const sheets = getSheets();
  await sheets.spreadsheets.values.append({
    spreadsheetId: config.GOOGLE_SHEETS_ID,
    range: `${config.SHEET_TAB_NAME}!A:${LAST_COL}`,
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values: rows },
  });
  return rows.length;
}

// Read all place_ids from column AF
async function getExistingPlaceIds() {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: config.GOOGLE_SHEETS_ID,
    range: `${config.SHEET_TAB_NAME}!${LAST_COL}:${LAST_COL}`,
  });
  const rows = res.data.values || [];
  return new Set(rows.flat().filter(id => id && id !== 'Place ID'));
}

// Returns leads where Status (col V) = "Approved"
async function getApprovedLeads() {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: config.GOOGLE_SHEETS_ID,
    range: `${config.SHEET_TAB_NAME}!A:${LAST_COL}`,
  });
  const [, ...rows] = res.data.values || [];
  return rows
    .map(row => Object.fromEntries(COLUMNS.map((col, i) => [col, row[i] || ''])))
    .filter(lead => lead.status === 'Approved');
}

// Update a single cell for a lead row looked up by place_id.
// Reads the actual header row so it works with any schema version.
async function updateLeadField(place_id, field, value) {
  const sheets = getSheets();

  // Get actual header row
  const headerRes = await sheets.spreadsheets.values.get({
    spreadsheetId: config.GOOGLE_SHEETS_ID,
    range: `${config.SHEET_TAB_NAME}!1:1`,
  });
  const headerRow = headerRes.data.values?.[0] || [];
  const hIdx = {};
  headerRow.forEach((h, i) => { hIdx[h.trim()] = i; });

  // Map field key to human-readable header name
  const colKeyIdx = COLUMNS.indexOf(field);
  if (colKeyIdx === -1) throw new Error(`Unknown field: ${field}`);
  const headerName = HEADER_ROW[colKeyIdx];
  const targetIdx = hIdx[headerName];
  if (targetIdx === undefined) return false; // column doesn't exist in this schema version

  const toLetter = i => i < 26
    ? String.fromCharCode(65 + i)
    : 'A' + String.fromCharCode(65 + (i - 26));

  const colLetter = toLetter(targetIdx);

  // Find Place ID column and look up the row
  const placeIdIdx = hIdx['Place ID'];
  if (placeIdIdx === undefined) throw new Error('Place ID column not found in sheet');
  const placeIdCol = toLetter(placeIdIdx);

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: config.GOOGLE_SHEETS_ID,
    range: `${config.SHEET_TAB_NAME}!${placeIdCol}:${placeIdCol}`,
  });

  const rows = res.data.values || [];
  const rowIndex = rows.findIndex(r => r[0] === place_id);
  if (rowIndex === -1) return false;

  await sheets.spreadsheets.values.update({
    spreadsheetId: config.GOOGLE_SHEETS_ID,
    range: `${config.SHEET_TAB_NAME}!${colLetter}${rowIndex + 1}`,
    valueInputOption: 'RAW',
    requestBody: { values: [[value]] },
  });
  return true;
}

async function applyConditionalFormatting() {
  const sheets = getSheets();
  const meta = await sheets.spreadsheets.get({ spreadsheetId: config.GOOGLE_SHEETS_ID });
  const tab = meta.data.sheets.find(s => s.properties.title === config.SHEET_TAB_NAME);
  if (!tab) throw new Error(`Tab "${config.SHEET_TAB_NAME}" not found`);
  const tabId = tab.properties.sheetId;

  // B = lead score (index 1), V = status (index 21)
  const scoreRange  = { sheetId: tabId, startRowIndex: 1, endRowIndex: 5000, startColumnIndex: 1,  endColumnIndex: 2  };
  const statusRange = { sheetId: tabId, startRowIndex: 1, endRowIndex: 5000, startColumnIndex: 21, endColumnIndex: 22 };

  const green  = { red: 0.714, green: 0.843, blue: 0.659 };
  const yellow = { red: 1,     green: 0.949, blue: 0.8   };
  const gray   = { red: 0.85,  green: 0.85,  blue: 0.85  };
  const blue   = { red: 0.643, green: 0.761, blue: 0.957 };
  const purple = { red: 0.816, green: 0.698, blue: 0.957 };

  function numRule(range, type, values, color) {
    return { addConditionalFormatRule: { rule: { ranges: [range], booleanRule: {
      condition: { type, values: values.map(v => ({ userEnteredValue: String(v) })) },
      format: { backgroundColor: color },
    }}, index: 0 }};
  }
  function textRule(range, text, color) {
    return { addConditionalFormatRule: { rule: { ranges: [range], booleanRule: {
      condition: { type: 'TEXT_EQ', values: [{ userEnteredValue: text }] },
      format: { backgroundColor: color },
    }}, index: 0 }};
  }

  // Clear existing rules
  const existingTab = meta.data.sheets.find(s => s.properties.sheetId === tabId);
  const clearRequests = (existingTab?.conditionalFormats || []).map(() => ({
    deleteConditionalFormatRule: { sheetId: tabId, index: 0 },
  }));
  if (clearRequests.length) {
    await sheets.spreadsheets.batchUpdate({ spreadsheetId: config.GOOGLE_SHEETS_ID, requestBody: { requests: clearRequests } });
  }

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: config.GOOGLE_SHEETS_ID,
    requestBody: { requests: [
      numRule(scoreRange, 'NUMBER_BETWEEN',      [8, 10], green),
      numRule(scoreRange, 'NUMBER_BETWEEN',      [5, 7],  yellow),
      numRule(scoreRange, 'NUMBER_LESS_THAN_EQ', [4],     gray),
      textRule(statusRange, 'Contacted', blue),
      textRule(statusRange, 'Responded', purple),
    ]},
  });

  console.log('Conditional formatting applied.');
}

async function writeTestRow() {
  const testLead = {
    name: 'TEST - Delete Me', phone: '(925) 555-0000', website: 'https://example.com',
    website_platform: 'WordPress', city: 'Dublin', rating: 4.2, review_count: 18,
    gbp_score: 7, findability_score: 5, cslb_license: 'B-123456', license_status: 'Active',
    lead_score: 8, priority: 'HOT', best_hook: 'Outdated Wix site with only 18 reviews.',
    status: 'New', place_id: 'TEST_PLACE_ID_001',
  };
  const written = await appendLeads([testLead]);
  console.log(`Test row written (${written} row). Check your Google Sheet.`);
}

if (require.main === module) {
  writeTestRow().catch(err => { console.error('Sheets error:', err.message); process.exit(1); });
}

module.exports = {
  appendLeads, writeTestRow, getExistingPlaceIds, getApprovedLeads,
  ensureHeader, applyConditionalFormatting, updateLeadField, COLUMNS,
};
