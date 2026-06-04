#!/usr/bin/env node
/**
 * scripts/fix-gbp-scores.js
 *
 * One-time correction for the gbp_claimed bug.
 *
 * Bug: enricher used `rating > 0` to determine GBP presence.
 *      Every Outscraper result already IS a Google Maps listing,
 *      so businesses with 0 reviews were incorrectly scored as
 *      having no GBP, losing 3 findability points each.
 *
 * Fix: gbp_claimed = !!place_id (AF column)
 *
 * Run dry-run first to see what will change:
 *   node scripts/fix-gbp-scores.js --dry-run
 *
 * Then apply:
 *   node scripts/fix-gbp-scores.js
 */

require('dotenv').config();
const { google } = require('googleapis');
const config = require('../config');

// 0-based column indices matching COLUMNS array in sheets.js
const COL = {
  lead_score:            1,   // B
  findability_score:     2,   // C
  name:                  4,   // E
  rating:                13,  // N
  review_count:          14,  // O
  findability_breakdown: 20,  // U
  notes:                 30,  // AE
  place_id:              31,  // AF
  yelp_url:              32,  // AG
  houzz_url:             33,  // AH
  bbb_url:               34,  // AI
  buildzoom_url:         35,  // AJ
};

function getSheets() {
  const auth = new google.auth.OAuth2(
    config.GOOGLE_OAUTH_CLIENT_ID,
    config.GOOGLE_OAUTH_CLIENT_SECRET,
  );
  auth.setCredentials({ refresh_token: config.GOOGLE_OAUTH_REFRESH_TOKEN });
  return google.sheets({ version: 'v4', auth });
}

// The ONLY wrong rows are those where place_id is present but rating is 0.
// Those rows had gbp_claimed=false (worth 3 pts) when it should be true.
// We add 3 to their existing score — don't touch anything else.
function needsCorrection(row) {
  const placeId = row[COL.place_id] || '';
  const rating  = parseFloat(row[COL.rating]) || 0;
  return !!placeId && rating === 0;
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  if (dryRun) console.log('DRY RUN — nothing will be written\n');

  const sheets  = getSheets();
  const tab     = config.SHEET_TAB_NAME;
  const sheetId = config.GOOGLE_SHEETS_ID;

  console.log('Reading sheet...');
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${tab}!A:AJ`,
  });

  const [, ...rows] = res.data.values || [];
  console.log(`  ${rows.length} data rows\n`);

  const batchData = [];
  let changed = 0, skipped = 0, noPlaceId = 0;

  for (let i = 0; i < rows.length; i++) {
    const row    = rows[i];
    const rowNum = i + 2; // +1 for header, +1 for 1-index
    const name     = row[COL.name]              || 'Unknown';
    const oldScore = parseInt(row[COL.findability_score]) || 0;
    const placeId  = row[COL.place_id]          || '';

    if (!placeId) { noPlaceId++; continue; }

    if (!needsCorrection(row)) { skipped++; continue; }

    // Only change: gbp_claimed was false (rating=0), now true (+3 pts)
    const newScore = oldScore + 3;
    console.log(`Row ${rowNum}: ${name}`);
    console.log(`  Findability: ${oldScore} → ${newScore} (+3) | had GBP, 0 reviews`);
    changed++;

    if (!dryRun) {
      batchData.push({ range: `${tab}!C${rowNum}`, values: [[newScore]] });

      // Notes — append tag without overwriting
      const existing = row[COL.notes] || '';
      if (!existing.includes('GBP-corrected')) {
        batchData.push({
          range: `${tab}!AE${rowNum}`,
          values: [[existing ? `${existing} | GBP-corrected` : 'GBP-corrected']],
        });
      }
    }
  }

  console.log('\n─── Summary ──────────────────────────────────');
  console.log(`  Total rows:          ${rows.length}`);
  console.log(`  No place_id (skip):  ${noPlaceId}`);
  console.log(`  Already correct:     ${skipped}`);
  console.log(`  Need correction:     ${changed}`);

  if (dryRun || !batchData.length) {
    if (dryRun) console.log('\nDry run done. Run without --dry-run to apply.');
    else console.log('\nNothing to update.');
    return;
  }

  console.log(`\nWriting ${batchData.length} cell updates in one batch...`);
  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId: sheetId,
    requestBody: { valueInputOption: 'RAW', data: batchData },
  });

  console.log('\nDone. Sheet updated.');
  console.log('\nNext steps:');
  console.log('  1. Filter col AE for "GBP-corrected" to see changed rows.');
  console.log('  2. Leads that gained 3+ findability points may need lead score review.');
  console.log('  3. Some "cold" leads may now qualify as warm — check manually.');
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
