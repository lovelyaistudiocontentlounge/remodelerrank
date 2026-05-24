const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const config = require('./config');
const log = require('./logger');
const { searchOutscraper, normaliseRecord, buildQuery } = require('./scraper');
const { filterNew, markSeen, pickCombinations, markQueryRan } = require('./database');
const { appendLeads, getApprovedLeads, updateLeadField } = require('./sheets');
const { enrichBatch } = require('./enricher');
const { generateReport } = require('./reports');
const { createDraft } = require('./gmail');

const LAST_SCRAPE_FILE = path.join(__dirname, '.last-scrape');

// ─── Concurrent run guards ─────────────────────────────────────────────────────

let scrapeRunning = false;
let approvalsRunning = false;

// ─── Nightly scrape ───────────────────────────────────────────────────────────

async function runNightlyScrape() {
  if (scrapeRunning) {
    log.warn('Nightly scrape already running - skipping this trigger');
    return;
  }
  scrapeRunning = true;

  try {
    const combos = pickCombinations(config.SEARCH_CITIES, config.SEARCH_TERMS, config.QUERIES_PER_NIGHT);
    log.info(`Starting nightly scrape - ${combos.length} queries`);
    let totalNew = 0;

    for (const { city, term } of combos) {
      const query = buildQuery(city, term);
      log.info(`Query: "${query}"`);
      let raw;
      try {
        raw = await searchOutscraper(query);
        markQueryRan(city, term);
      } catch (err) {
        log.error(`Failed to fetch "${query}": ${err.message}`);
        continue;
      }

      const records = raw.map(normaliseRecord);
      const newRecords = filterNew(records);
      log.info(`${records.length} results, ${newRecords.length} new after dedup`);

      if (!newRecords.length) continue;

      try {
        log.info(`Enriching ${newRecords.length} leads...`);
        const enriched = await enrichBatch(newRecords);
        await appendLeads(enriched);
        for (const r of enriched) markSeen(r.place_id, r.name);
        totalNew += enriched.length;
      } catch (err) {
        log.error(`Failed to enrich/write: ${err.message}`);
      }
    }

    fs.writeFileSync(LAST_SCRAPE_FILE, new Date().toISOString(), 'utf8');
    log.done(`Nightly scrape complete - ${totalNew} new leads written`);
  } finally {
    scrapeRunning = false;
  }
}

// ─── Approval watcher ─────────────────────────────────────────────────────────

async function checkApprovals() {
  if (approvalsRunning) {
    log.info('Approval check already in progress - skipping');
    return;
  }
  approvalsRunning = true;

  try {
    log.info('Checking for approved leads...');
    let approved;
    try {
      approved = await getApprovedLeads();
    } catch (err) {
      log.error(`Failed to read sheet: ${err.message}`);
      return;
    }

    if (!approved.length) {
      log.info('No approved leads found.');
      return;
    }

    log.info(`Found ${approved.length} approved lead(s).`);

    for (const lead of approved) {
      const score = Number(lead.lead_score) || 0;
      log.info(`Processing: ${lead.name} (score ${score})`);

      try {
        let driveLink = null;

        if (score >= 6) {
          const report = await generateReport(lead);
          driveLink = report.driveLink;
          log.info(`Report uploaded: ${driveLink}`);
          await updateLeadField(lead.place_id, 'grader_generated', new Date().toISOString().slice(0, 10));
          await updateLeadField(lead.place_id, 'audit_url', driveLink);
        }

        if (score >= 4) {
          const draft = await createDraft(lead, driveLink);
          if (draft) log.info(`Draft created: "${draft.subject}"`);
        }

        await updateLeadField(lead.place_id, 'status', 'Contacted');
        log.done(`${lead.name} - processed`);
      } catch (err) {
        log.error(`Failed to process ${lead.name}: ${err.message}`);
      }
    }
  } finally {
    approvalsRunning = false;
  }
}

// ─── Startup catch-up ─────────────────────────────────────────────────────────
// If the machine slept through the 2am cron, run a catch-up scrape on startup.

async function catchUpIfMissed() {
  try {
    if (!fs.existsSync(LAST_SCRAPE_FILE)) {
      log.info('No prior scrape on record - running catch-up scrape now');
      await runNightlyScrape();
      return;
    }
    const lastRun = new Date(fs.readFileSync(LAST_SCRAPE_FILE, 'utf8').trim());
    const hoursSince = (Date.now() - lastRun.getTime()) / (1000 * 60 * 60);
    if (hoursSince > 22) {
      log.info(`Last scrape was ${Math.round(hoursSince)}h ago - running catch-up scrape now`);
      await runNightlyScrape();
    } else {
      log.info(`Last scrape was ${Math.round(hoursSince)}h ago - no catch-up needed`);
    }
  } catch (err) {
    log.error(`Catch-up check failed: ${err.message}`);
  }
}

// ─── Scheduling ───────────────────────────────────────────────────────────────

function startScheduler() {
  cron.schedule('0 2 * * *', runNightlyScrape);
  log.info('Scheduled: nightly scrape at 2:00am');

  cron.schedule('*/15 7-19 * * *', checkApprovals);
  log.info('Scheduled: approval watcher every 15min (7am-7pm)');

  log.info('Scheduler running. Press Ctrl+C to stop.');

  // Check on every startup whether last night's scrape was missed
  catchUpIfMissed();
}

// ─── Entry point ──────────────────────────────────────────────────────────────

if (require.main === module) {
  const arg = process.argv[2];
  if (arg === '--schedule') {
    startScheduler();
  } else if (arg === '--check-approvals') {
    checkApprovals().catch(err => { log.error(err.message); process.exit(1); });
  } else {
    runNightlyScrape().catch(err => { log.error(err.message); process.exit(1); });
  }
}

module.exports = { runNightlyScrape, checkApprovals, startScheduler };
