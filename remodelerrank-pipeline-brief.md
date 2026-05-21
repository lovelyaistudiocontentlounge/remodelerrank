# RemodelerRank — Lead Pipeline System
## Claude Code Project Brief

---

## What This Builds

A fully automated overnight lead generation and enrichment pipeline for RemodelerRank. Every night at 2am, the system scrapes 120+ remodeling contractors from the East Bay and Solano County, enriches each lead with scoring data, and writes results to a Google Sheet. Each morning Jennifer reviews, approves leads, and approved leads automatically get a drafted site audit report and staged outreach email in Gmail.

---

## System Overview

```
[CRON 2am nightly]
        ↓
[Scraper] → Google Places API → 120 contractor records
        ↓
[Enricher] → website check + GBP analysis + CSLB lookup + Claude scoring
        ↓
[Google Sheet] → color-coded leads ready for morning review
        ↓
[Jennifer approves in sheet]
        ↓
[Trigger] → Claude drafts audit report + Gmail draft created
        ↓
[Next morning] → Jennifer reviews drafts → sends
```

---

## Phase 1 — Nightly Scraper (Build First)

### Goal
Pull 120 remodeling contractors per night from target geography. Write to Google Sheet. No duplicates.

### Search Targets (rotate nightly)
```javascript
const searchQueries = [
  "kitchen remodeling contractor Dublin CA",
  "bathroom remodeler Danville CA",
  "home remodeling contractor Walnut Creek CA",
  "kitchen remodel San Ramon CA",
  "general contractor Pleasanton CA",
  "remodeling contractor Livermore CA",
  "kitchen bathroom remodel Concord CA",
  "home renovation contractor Lafayette CA",
  "remodeling contractor Vacaville CA",
  "kitchen remodel Fairfield CA",
  "bathroom contractor Vallejo CA",
  "whole home remodel Brentwood CA",
  "remodeling contractor Antioch CA",
  "kitchen contractor Alamo CA",
  "remodeling contractor Orinda CA"
];
```

Rotate through 8–10 queries per night to hit 120 results. Track which queries ran each night to avoid repetition.

### Google Places API Call
```javascript
// Use Places API Text Search
// Endpoint: https://maps.googleapis.com/maps/api/place/textsearch/json
// Then Places Details for each result

const fields = [
  'name',
  'formatted_address', 
  'formatted_phone_number',
  'website',
  'rating',
  'user_ratings_total',
  'business_status',
  'opening_hours',
  'types',
  'place_id'
];
```

### Deduplication
- Store all seen `place_id` values in a local SQLite database
- Skip any place_id already in the database
- Never write the same contractor twice

---

## Phase 2 — Lead Enrichment

For each scraped lead, run the following enrichment checks:

### 2a. Website Analysis
```javascript
// Check if website exists
// If yes: detect platform (Wix/GoDaddy/Squarespace/WordPress/custom)
// Check mobile responsiveness (simple viewport meta check)
// Check if site has contact form
// Check approximate last-updated signal (footer copyright year)
// Check page count (rough proxy for SEO effort)
```

Platform detection strings to check for:
- GoDaddy: `godaddy`, `secureserver`
- Wix: `wix.com`, `wixstatic`
- Squarespace: `squarespace`
- Weebly: `weebly`
- WordPress: `wp-content`, `wp-includes`
- No website: flag as highest priority lead

### 2b. Google Business Profile Completeness
From Places API data, score GBP 1–10:
- Has phone: +1
- Has website: +1
- Has hours: +1
- Rating exists: +1
- Rating 4.0+: +1
- Review count 10+: +1
- Review count 50+: +1
- Has photos (user_ratings_total proxy): +1
- Business status OPERATIONAL: +1
- Description present: +1

### 2c. CSLB License Check
```
// California State License Board public lookup
// URL: https://www.cslb.ca.gov/OnlineServices/CheckLicenseII/CheckLicense.aspx
// Check: license active/inactive, license class, expiration date
// Flag unlicensed contractors (do not contact)
// Store: license number, class (B = General Building), status, expiration
```

### 2d. Claude Scoring
Call Claude API with this prompt for each lead:

```javascript
const scoringPrompt = `
You are scoring a remodeling contractor as a sales lead for a marketing agency 
that serves East Bay and Solano County remodelers.

Score this lead 1-10 based on likelihood they need and can afford marketing services.
Higher score = better lead.

Scoring criteria:
- No website or bad website (GoDaddy/Wix): +3 points
- Low review count (<20): +2 points  
- Low GBP completeness (<6/10): +2 points
- In target cities (Dublin/San Ramon/Danville/WC/Pleasanton): +2 points
- Licensed and active: required (0 if not)
- Rating 3.5-4.5 (room to improve but not failing): +1 point

Lead data:
${JSON.stringify(leadData)}

Respond with JSON only:
{
  "score": 8,
  "score_reason": "One sentence explaining the score",
  "priority": "hot|warm|cold",
  "best_hook": "One specific observation to use in outreach email"
}
`;
```

---

## Phase 3 — Google Sheet Output

### Sheet Structure
One row per lead. Columns:

| Col | Field | Notes |
|-----|-------|-------|
| A | Date Added | Auto |
| B | Lead Score | 1–10, color coded |
| C | Priority | HOT/WARM/COLD |
| D | Business Name | |
| E | Owner Name | From Places if available |
| F | Phone | |
| G | Email | From website scrape if found |
| H | Website | URL or "NONE" |
| I | Website Platform | GoDaddy/Wix/WP/None/etc |
| J | City | |
| K | Google Rating | |
| L | Review Count | |
| M | GBP Score | /10 |
| N | CSLB License | Number |
| O | License Status | Active/Inactive/None |
| P | Best Hook | Claude-generated outreach line |
| Q | Status | New/Approved/Skipped/Contacted/Responded |
| R | Notes | Jennifer fills manually |
| S | Place ID | For deduplication |

### Color Coding (conditional formatting)
- Score 8–10: Green background
- Score 5–7: Yellow background  
- Score 1–4: Gray background
- Status = Contacted: Blue background
- Status = Responded: Purple background

### Jennifer's Workflow
1. Open sheet each morning
2. Filter by "New" status
3. Review green rows first
4. Change Status column to "Approved" or "Skipped"
5. Approved rows trigger Phase 4

---

## Phase 4 — Approval Triggers

### Watch for Approvals
A separate process polls the sheet every 15 minutes for rows where Status = "Approved" and Report_Generated = blank.

### On Approval: Generate Audit Report
Call Claude API with lead data to generate a 1-page site audit:

```javascript
const reportPrompt = `
Generate a brief website audit report for a remodeling contractor.
This will be sent to them as a free value-add before a sales call.

Format: Plain text, 3 sections max, conversational not corporate.

Sections:
1. What we found (2-3 specific observations about their web presence)
2. What it's costing them (1-2 sentences on the business impact)
3. What good looks like (2-3 specific recommendations)

Tone: Peer, not salesperson. Direct. Specific to their business.
Do not mention RemodelerRank by name in the report body.

Lead data: ${JSON.stringify(leadData)}
`;
```

Save report as PDF in Google Drive folder: `RemodelerRank/Prospects/Audits/[BusinessName]-audit.pdf`

### On Approval: Stage Gmail Draft
```javascript
// Create Gmail draft using Gmail API
// To: lead email (if found) — otherwise leave blank for Jennifer to fill
// Subject: [BusinessName] — your website audit
// Body: personalized outreach email using the lead's best_hook + audit attached

const emailTemplate = `
Hi [FirstName],

[BEST_HOOK from Claude scoring]

I put together a quick audit of your web presence — attached. 
No fluff, just what I found and what I'd fix.

Worth a 15-minute call this week?

Jennifer
RemodelerRank
925-940-9484
hey@remodelerrank.com
`;
```

---

## Phase 5 — Scheduling

### Cron Jobs (node-cron)
```javascript
// Nightly scrape: 2:00am
cron.schedule('0 2 * * *', runNightlyScrape);

// Approval watcher: every 15 minutes, 7am-7pm
cron.schedule('*/15 7-19 * * *', checkApprovals);

// Weekly dedup cleanup: Sundays 3am
cron.schedule('0 3 * * 0', cleanupDuplicates);
```

---

## Tech Stack

```
Runtime:        Node.js 20+
Scraping:       Google Places API (Text Search + Place Details)
Website check:  Axios + Cheerio
CSLB:           Puppeteer (form submission scrape)
AI scoring:     Anthropic API (claude-sonnet-4-20250514)
Storage:        SQLite (local dedup database)
Sheet:          Google Sheets API v4
Email:          Gmail API
Reports:        PDFKit (Node PDF generation)
Drive:          Google Drive API v3
Scheduling:     node-cron
Config:         .env file
```

---

## Environment Variables Needed

```bash
# .env
ANTHROPIC_API_KEY=
GOOGLE_PLACES_API_KEY=
GOOGLE_SHEETS_ID=
GOOGLE_OAUTH_CLIENT_ID=
GOOGLE_OAUTH_CLIENT_SECRET=
GOOGLE_OAUTH_REFRESH_TOKEN=
GMAIL_FROM=hey@remodelerrank.com
SHEET_TAB_NAME=Leads
LEADS_PER_NIGHT=120
REPORTS_DRIVE_FOLDER_ID=
```

---

## File Structure

```
remodelerrank-pipeline/
  index.js              ← main entry, starts cron jobs
  scraper.js            ← Google Places scrape
  enricher.js           ← website + GBP + CSLB + Claude scoring
  sheets.js             ← read/write Google Sheets
  reports.js            ← generate PDF audit
  gmail.js              ← create Gmail drafts
  database.js           ← SQLite dedup store
  prompts.js            ← all Claude API prompts in one place
  config.js             ← loads .env, exports constants
  CLAUDE.md             ← context for Claude Code sessions
  .env                  ← secrets (gitignored)
  .gitignore
  package.json
```

---

## CLAUDE.md (for Claude Code sessions)

```markdown
# RemodelerRank Lead Pipeline

## What this is
Automated overnight lead scraping system for RemodelerRank, a marketing agency 
serving East Bay + Solano County remodeling contractors.

## Owner
Jennifer | hey@remodelerrank.com | 925-940-9484

## What it does
Scrapes 120 remodeling contractors nightly via Google Places API,
enriches with website analysis + CSLB license check + Claude scoring,
writes to Google Sheet. Approved leads get auto-generated audit PDF 
and staged Gmail draft.

## Target geography
East Bay + Solano County, CA
Cities: Dublin, San Ramon, Danville, Walnut Creek, Pleasanton, 
        Livermore, Concord, Lafayette, Vacaville, Fairfield, Vallejo

## Current phase
[Update as you build: Phase 1 / Phase 2 / Phase 3 / Phase 4 / Phase 5]

## APIs in use
- Google Places API (scraping)
- Google Sheets API v4 (output)
- Gmail API (draft creation)
- Google Drive API (report storage)
- Anthropic API (scoring + report generation)

## Key files
- scraper.js: Google Places queries and pagination
- enricher.js: website analysis, GBP scoring, CSLB check, Claude score
- sheets.js: all read/write operations
- prompts.js: all Claude prompts — edit here, not inline

## Never do
- Contact unlicensed contractors
- Write duplicate place_ids to sheet
- Send emails automatically — always stage as drafts only
- Run scraper between 6am-1am (respects API rate limits)
```

---

## Build Order for Claude Code Sessions

**Session 1 (start here):**
- Set up project structure
- Install dependencies
- Build `scraper.js` — Google Places API, one query, console output
- Test with single search query, verify data shape

**Session 2:**
- Build `database.js` — SQLite dedup
- Build `sheets.js` — write test row to Google Sheet
- Connect scraper → dedup → sheet

**Session 3:**
- Build `enricher.js` — website platform detection + GBP scoring
- Add Claude scoring via `prompts.js`
- Full enrichment pipeline end to end

**Session 4:**
- Build `reports.js` — PDF audit generation
- Build `gmail.js` — Gmail draft creation
- Build approval watcher

**Session 5:**
- Add `node-cron` scheduling
- Test full overnight run
- Error handling + logging

---

## Success Metrics

- 120 new leads in sheet each morning
- Zero duplicates across nights
- Lead score accuracy: spot-check 10 leads/week manually
- Approval-to-draft time: under 5 minutes after Jennifer approves
- Target: 100 outreaches sent per day by week 5
