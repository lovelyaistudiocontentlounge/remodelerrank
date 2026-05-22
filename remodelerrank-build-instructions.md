# RemodelerRank — Claude Code Build Instructions
## Complete Updated Specification — May 2026
*Hand this to Claude Code at the start of each session. Supersedes all previous session briefs.*

---

## IMMEDIATE UPDATES (do before anything else)

### 1. Replace City List in scraper.js

Replace existing city list with this complete 57-city target:

```javascript
const searchCities = [
  // Contra Costa County
  'Walnut Creek CA', 'Concord CA', 'Pleasant Hill CA', 'Lafayette CA',
  'Orinda CA', 'Moraga CA', 'Alamo CA', 'Danville CA', 'San Ramon CA',
  'Dublin CA', 'Pleasanton CA', 'Livermore CA', 'Brentwood CA',
  'Antioch CA', 'Pittsburg CA', 'Martinez CA', 'Clayton CA',
  'Hercules CA', 'Pinole CA', 'El Cerrito CA',

  // Alameda County
  'Fremont CA', 'Newark CA', 'Union City CA', 'Hayward CA',
  'Castro Valley CA', 'San Leandro CA', 'Oakland CA', 'Berkeley CA',
  'Alameda CA', 'Emeryville CA',

  // Solano County
  'Vacaville CA', 'Fairfield CA', 'Vallejo CA', 'Benicia CA',
  'Dixon CA', 'Suisun City CA', 'Rio Vista CA',

  // Marin County
  'San Rafael CA', 'Novato CA', 'Mill Valley CA', 'Corte Madera CA',
  'Larkspur CA', 'Tiburon CA', 'Sausalito CA',

  // Yolo County
  'Davis CA', 'Woodland CA', 'West Sacramento CA',

  // Santa Clara (northern)
  'Milpitas CA', 'Santa Clara CA', 'Sunnyvale CA', 'Mountain View CA',

  // San Mateo (northern)
  'San Mateo CA', 'Redwood City CA', 'San Carlos CA', 'Belmont CA',
  'Foster City CA', 'Burlingame CA'
];
```

### 2. Replace Search Terms in scraper.js

```javascript
const searchTerms = [
  'kitchen remodeling contractor',
  'bathroom remodeling contractor',
  'home remodeling contractor',
  'general contractor remodeling',
  'kitchen and bath contractor',
  'home renovation contractor',
  'ADU contractor',
  'room addition contractor',
  'whole home remodel',
  'kitchen renovation company',
  'bathroom renovation company',
  'residential remodeling contractor',
  'home improvement contractor',
  'design build contractor',
  'custom home remodeling',
  'licensed remodeling contractor'
];
```

**Rotation logic:** Each nightly run picks 20 random city+term combinations. Track which combinations have run in SQLite to avoid repeats. Full cycle = 912 combinations, cycles every ~46 nights.

### 3. Add Apollo.io Enrichment to enricher.js

After Outscraper data is retrieved, run a second enrichment pass via Apollo.io to find owner name and email.

```javascript
// Apollo enrichment — add to enricher.js
async function enrichWithApollo(domain) {
  if (!domain) return { ownerName: null, email: null };
  
  const response = await fetch('https://api.apollo.io/v1/people/match', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': process.env.APOLLO_API_KEY
    },
    body: JSON.stringify({
      domain: domain,
      reveal_personal_emails: false,
      reveal_phone_number: false
    })
  });
  
  const data = await response.json();
  return {
    ownerName: data?.person?.name || null,
    email: data?.person?.email || null
  };
}
```

If Apollo returns no result, set both fields to null and flag `email_found: false`. Do not block the lead — phone is primary for contractors.

Add to .env:
```
APOLLO_API_KEY=
```

### 4. Add Findability Scoring to enricher.js

After base enrichment, check each of these and score:

```javascript
async function scoreFindability(lead) {
  const checks = {
    gbp_claimed: false,        // GBP exists and is claimed — 3pts
    gbp_complete: false,       // Has hours, photos, services — bonus
    yelp_active: false,        // Yelp listing exists with reviews — 2pts
    houzz_profile: false,      // Houzz profile exists — 1pt
    bbb_accredited: false,     // BBB accreditation — 1pt
    buildzoom_active: false,   // BuildZoom profile — 1pt
    facebook_page: false,      // Facebook business page — 1pt
    apple_maps: false,         // Apple Maps listing — 1pt
  };

  // GBP: already in Outscraper data — if rating exists, GBP is claimed
  checks.gbp_claimed = lead.rating > 0;
  checks.gbp_complete = lead.rating > 0 && lead.reviews > 5;

  // Yelp: search yelp.com/biz/[slug]
  // Houzz: search houzz.com/professionals
  // BBB: search bbb.org
  // BuildZoom: search buildzoom.com/contractor
  // Facebook: search facebook.com/[businessname]
  // Apple Maps: check via Apple Maps Connect API or skip if too complex

  const score =
    (checks.gbp_claimed ? 3 : 0) +
    (checks.yelp_active ? 2 : 0) +
    (checks.houzz_profile ? 1 : 0) +
    (checks.bbb_accredited ? 1 : 0) +
    (checks.buildzoom_active ? 1 : 0) +
    (checks.facebook_page ? 1 : 0) +
    (checks.apple_maps ? 1 : 0);

  return {
    findability_score: score,      // out of 10
    findability_breakdown: checks
  };
}
```

If a check is too complex or rate-limited, skip it and note `checked: false` rather than blocking the pipeline.

### 5. Remove PDF Generation — Replace with HTML

In reports.js:
- Remove all PDFKit code
- Remove PDFKit from package.json
- Replace with HTML report generation using `templates/client-docs/grader-report.html`
- On approval, generate HTML file with all data fields populated
- Before/after image slots remain as styled placeholders (see template)
- Save to Google Drive: `RemodelerRank/Audits/[BusinessName]-[YYYY-MM-DD].html`
- Link to the Drive file in the Gmail draft (not attached — linked)

### 6. Add Calendly Link to All Email Templates

Add to config.js:
```javascript
CALENDLY_URL: 'https://calendly.com/hey-remodelerrank/review-meeting-15-minutes'
```

Every email draft must include this link. Every follow-up. Every reply template.

### 7. Add OpenPhone Text Drafts

OpenPhone has an API. On approval, create a text draft alongside the Gmail draft.

```javascript
// Day 0 text
const textD0 = `Hi ${firstName}, Jennifer from RemodelerRank here. Sent you an email about ${businessName}'s web presence. Worth a 2-minute look when you get a chance.`;

// Day 4 text (sent if no email reply by day 4)
const textD4 = `Hey ${firstName}, following up on my email. Do you have capacity for new kitchen projects right now?`;
```

Add to .env:
```
OPENPHONE_API_KEY=
JENNIFER_PHONE=9259409484
```

Text drafts go into a `text_drafts` tab in the Google Sheet — same row as the lead, same status tracking.

---

## UPDATED OUTREACH FLOW

### Scoring Tiers — What Gets Generated

```
Score 8-10 (HOT):
  - Full HTML grader generated (placeholder images)
  - Gmail draft created with audit link placeholder + Calendly
  - OpenPhone text draft created
  - Jennifer reviews → sends email + text same day

Score 6-7 (WARM):
  - Full HTML grader generated (placeholder images)
  - Gmail draft created
  - OpenPhone text draft created
  - Jennifer reviews → sends

Score 4-5 (MEDIUM):
  - Generic email draft only (no grader)
  - Wait for reply before investing grader time

Score under 4:
  - Nothing generated
  - Flagged as Skip in sheet
```

### Email Sequence — 3 Touches

**Email D0 — Initial outreach**
Subject: `[Business Name] — quick question`

```
Hi [First Name],

Do you have capacity for a kitchen remodel right now, or are you booked out?

I ask because I put together a quick audit of [Business Name]'s web presence and found something worth sharing. [BEST_HOOK from scoring].

I put together a free report showing exactly what I found and what I'd fix. Worth a look?

Jennifer
RemodelerRank
925-940-9484
https://calendly.com/hey-remodelerrank/review-meeting-15-minutes
```

**Email D3 — Follow-up**
Subject: `Re: [Business Name] — quick question`

```
Hi [First Name],

Just bumping this up in case it got buried.

The report is ready whenever you want it. Takes about 3 minutes to read and shows exactly where [Business Name] is losing homeowners before they ever call.

Jennifer
925-940-9484
https://calendly.com/hey-remodelerrank/review-meeting-15-minutes
```

**Email D7 — Close**
Subject: `Re: [Business Name] — quick question`

```
Hi [First Name],

Last follow up from me.

I work with a small number of East Bay remodelers at a time and wanted to give [Business Name] first look before I move on. If timing is not right, no hard feelings at all.

If it ever makes sense to talk, you know where to find me.

Jennifer
RemodelerRank
925-940-9484
https://calendly.com/hey-remodelerrank/review-meeting-15-minutes
```

**No em dashes anywhere in any email template. Use plain punctuation only.**

### Sequence Tracking in Google Sheet

Add these columns to the Leads sheet:

| Column | Field | Values |
|---|---|---|
| T | Email D0 Sent | date or blank |
| U | Email D3 Sent | date or blank |
| V | Email D7 Sent | date or blank |
| W | Text D0 Sent | date or blank |
| X | Text D4 Sent | date or blank |
| Y | Reply Received | date or blank |
| Z | Audit URL | live Netlify URL when published |
| AA | Grader Generated | date or blank |

---

## UPDATED GOOGLE SHEET COLUMNS

Full column order — update sheets.js to match:

```
A: Date Added
B: Lead Score (1-10)
C: Findability Score (1-10)
D: Priority (HOT/WARM/COLD)
E: Business Name
F: Owner Name (from Apollo)
G: Phone
H: Email (from Apollo)
I: Email Found (true/false)
J: Website URL
K: Platform (WordPress/Wix/GoDaddy/None/etc)
L: City
M: County
N: Google Rating
O: Review Count
P: GBP Score (1-10)
Q: CSLB License Number
R: License Status (Active/Inactive/None)
S: Portfolio Buried (true/false)
T: Best Hook (Claude-generated)
U: Findability Breakdown (JSON string)
V: Status (New/Approved/Skipped/Contacted/Replied/Meeting/Client)
W: Email D0 Sent
X: Email D3 Sent
Y: Email D7 Sent
Z: Text D0 Sent
AA: Text D4 Sent
AB: Reply Received
AC: Audit URL
AD: Grader Generated
AE: Notes
AF: Place ID (for dedup)
```

---

## SESSION 6 — Morning Review Web App

### Design Spec

**Style:** Light, clean, sage palette. Lighter than the RemodelerRank homepage header. Think warm off-white background with sage accents. Not dark. Not corporate. Something Jennifer enjoys opening every morning.

**Colors:**
```css
:root {
  --bg: #F5F7F5;           /* very light sage-tinted white */
  --surface: #FFFFFF;
  --sage: #8BA89A;
  --sage-light: #EEF2EF;
  --sage-dark: #6E8E7E;
  --charcoal: #2C2C2C;
  --text: #3A3A3A;
  --text-light: #6E7E78;
  --border: #DDE6E1;
  --hot: #C0392B;
  --warm: #D4801A;
  --cold: #8BA89A;
  --approve-green: #2D7A4F;
}
```

**Typography:** Lora (serif) for business name + score. Karla for all other text. Load from Google Fonts.

### Layout — Single Lead Card

```
┌─── Header bar (sage bg, light) ──────────────────────────┐
│  RemodelerRank    [14 of 47 new]  [HOT 8]  [WARM 12]     │
└───────────────────────────────────────────────────────────┘

┌─── Lead Card (white, centered, max-width 680px) ──────────┐
│                                                            │
│  PRIORITY BADGE    LEAD SCORE     FINDABILITY SCORE       │
│  [HOT]             8 / 10         Findability: 4 / 10     │
│                                                            │
│  Business Name (Lora serif, large)                         │
│  City, County                                              │
│                                                            │
│  ─────────────────────────────────────────────────        │
│                                                            │
│  Phone        Email              Website                   │
│  [number]     [found/not found]  [URL] [Open site ↗]      │
│                                                            │
│  Platform     GBP Score          CSLB                      │
│  WordPress    6 / 10             Active #1065555           │
│                                                            │
│  Reviews      Rating             Portfolio Buried           │
│  14           4.2                Yes                       │
│                                                            │
│  ─────────────────────────────────────────────────        │
│                                                            │
│  Findability breakdown:                                    │
│  GBP ✓   Yelp ✓   Houzz ✗   BBB ✗   BuildZoom ✓          │
│                                                            │
│  ─────────────────────────────────────────────────        │
│                                                            │
│  Hook:                                                     │
│  "Your project photos are impressive — they are buried     │
│  where most homeowners never find them."                   │
│                                                            │
│  Notes: [optional text input]                              │
│                                                            │
│  ─────────────────────────────────────────────────        │
│                                                            │
│  [Skip →]                          [Approve + Generate]   │
│                                                            │
└───────────────────────────────────────────────────────────┘

  A = Approve   S = Skip   O = Open site   ← → = Navigate
```

### Behavior

- Loads all "New" leads from Google Sheet on open, sorted HOT first then WARM then COLD
- Shows one lead at a time
- "Open site" opens their URL in a new tab
- "Approve + Generate" triggers: status → Approved, grader HTML generated, Gmail draft created, text draft created
- "Skip" sets status → Skipped and moves to next
- Notes field saves to the Notes column in sheet
- Header shows count of new leads, HOT count, WARM count
- Sequence status bar below header: "3 Day-3 follow-ups due today" — clickable to see them
- No authentication needed — runs locally on Jennifer's machine

### Follow-up Alert Section

Below the main card, a collapsible section:

```
┌─── Due Today ─────────────────────────────────────────────┐
│  Day 3 follow-ups (2)                                      │
│  > Elevate Construction — send by today                    │
│  > D1 Renovations — send by today                         │
│                                                            │
│  Day 7 closes (1)                                          │
│  > Peace of Mind Remodels — last chance today              │
└───────────────────────────────────────────────────────────┘
```

Clicking a name opens that lead's Gmail draft.

### Tech Stack for Web App

- Single HTML file with vanilla JS (no framework needed)
- Reads Google Sheet via Sheets API
- Writes status updates back to sheet
- Triggers report generation via a local Node.js endpoint (POST /approve)
- Runs on localhost:3000
- Start with: `npm run morning` in package.json

---

## SESSION 7 — Mini-Site Skill + Sequence Wiring

### Write skills/mini-site/SKILL.md

This skill builds a single-page HTML mockup of a prospect's potential new site. It runs when Jennifer provides: logo file, homepage screenshot, best project photo.

**The skill must cover:**

1. **Color extraction** — pull dominant colors from logo and screenshot. Primary = nav/button color. Secondary = accent. Background = lightest color.

2. **Muted accent rule** — if extracted accent is bright/saturated yellow-gold (hue 40-55, saturation above 70%), shift to muted brass `#C9A96E`. Let photography lead.

3. **Builder Funnel structure — mandatory section order:**
   - Info bar (address, hours, phone)
   - Nav (logo left, links center, CTA button right)
   - Hero (full-bleed project photo, headline, subhead, 2 CTAs)
   - Trust bar (credentials, license, years in business)
   - Pain (4 items, callout box)
   - Services (6-card grid)
   - Process (4 steps)
   - Results/Reviews (2-4 testimonial cards)
   - Mid CTA (full-width band)
   - Service areas (city pills)
   - Final CTA
   - Footer

4. **Logo handling:**
   ```html
   <img src="logo.png" alt="[Business Name]"
     style="height:44px; width:auto;"
     onerror="this.style.display='none'">
   ```
   Tell Jennifer: save logo file as `logo.png` in same folder as HTML.

5. **No emoji anywhere.** Use typographic markers: thin rules (2px solid), numbered lists, `✦` accent marks with CSS color only.

6. **Typography — use prospect's style:**
   - Traditional/established brand: Playfair Display + DM Sans
   - Modern/clean brand: Lora + Karla
   - Bold/direct brand: Fraunces + Karla
   Default to Playfair Display + DM Sans for contractors.

7. **Hero image:** Use provided project photo as full-bleed hero. Gradient overlay: `linear-gradient(to top, rgba(10,20,40,0.90) 0%, rgba(10,20,40,0.40) 50%, transparent 100%)`.

8. **Save location:** `/clients/[business-slug]/mockup/index.html`

9. **After generating, tell Jennifer:**
   > "Open `/clients/[slug]/mockup/index.html` in your browser at 1280px wide. Screenshot the top 900px. Drag the screenshot back into this chat."

10. **Mock-up protection — screenshot only.** Do not deploy mockups to Netlify or create public URLs without Jennifer's explicit instruction. Mockups stay local.

### Wire OpenPhone API

Add `openphone.js` to pipeline:

```javascript
async function createTextDraft(lead, message) {
  const response = await fetch('https://api.openphone.com/v1/messages', {
    method: 'POST',
    headers: {
      'Authorization': process.env.OPENPHONE_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: process.env.JENNIFER_PHONE,
      to: lead.phone,
      text: message,
      status: 'draft'
    })
  });
  return response.json();
}
```

If OpenPhone API does not support drafts, write the text content to a `text_drafts` tab in the Google Sheet with columns: Business Name, Phone, Message, Day, Status, Date Due.

### Complete Email Templates

Update all three email templates in `/templates/emails/` with:
- Calendly link in every email
- No em dashes (use plain dash or reword)
- `[BEST_HOOK]` placeholder populated from scoring output
- `[AUDIT_URL]` placeholder — filled when Jennifer publishes to Netlify
- Signature: Jennifer / RemodelerRank / 925-940-9484

---

## SESSION 8 — Grader Completion Flow

### Document the Full Process

Create `/automations/grader-completion.md` with these steps:

```markdown
# Completing a Grader Report

## Trigger
Lead replied to email OR you decide to finish a HOT lead proactively.

## Step 1 — Get their logo
Right-click their logo on their website → Save as logo.png
Save to /clients/[slug]/

## Step 2 — Screenshot their current site
Open their site in Chrome at 1280px wide
Screenshot the top 900px (just above the fold)
Save as before.png to /clients/[slug]/

## Step 3 — Build the mockup (Claude Code)
Say: "Read skills/mini-site/SKILL.md then build a mockup for
[Business Name]. Logo is at /clients/[slug]/logo.png.
Screenshot is at /clients/[slug]/before.png.
Hero photo is at /clients/[slug]/hero.jpg"

Claude Code generates /clients/[slug]/mockup/index.html

## Step 4 — Screenshot the mockup
Open /clients/[slug]/mockup/index.html in Chrome at 1280px
Screenshot the top 900px
Drag the screenshot into Claude Code chat

## Step 5 — Embed images in grader
Claude Code embeds both screenshots as base64 in the grader HTML.
Grader saved to /clients/[slug]/grader/index.html

## Step 6 — Publish to Netlify
Copy grader HTML to /audits/[slug].html in the repo
Commit: "add [business name] grader"
Push → live in 30 seconds at remodelerrank.com/audits/[slug].html

## Step 7 — Update the Gmail draft
Open the Gmail draft
Replace [AUDIT_URL] with the live Netlify URL
Review and send

## Step 8 — Update the sheet
Status → Contacted
Audit URL column → paste the URL
Email D0 Sent → today's date
```

### Timing Goals

- Steps 1-4: 10 minutes
- Steps 5-6: 5 minutes
- Steps 7-8: 2 minutes
- **Total per prospect: under 20 minutes**

---

## .env.example — Complete

```bash
# Agency
AGENCY_NAME=RemodelerRank
AGENCY_EMAIL=hey@remodelerrank.com
AGENCY_PHONE=9259409484
AGENCY_SITE=remodelerrank.com
CALENDLY_URL=https://calendly.com/hey-remodelerrank/review-meeting-15-minutes

# Anthropic
ANTHROPIC_API_KEY=

# Outscraper
OUTSCRAPER_API_KEY=
LEADS_PER_NIGHT=120
QUERIES_PER_NIGHT=20

# Apollo (owner name + email enrichment)
APOLLO_API_KEY=

# Google
GOOGLE_SHEETS_ID=1wftfFfXnUcRJCGfn59RphyU5dYnPs4mojzBv5V9fdUE
GOOGLE_OAUTH_CLIENT_ID=
GOOGLE_OAUTH_CLIENT_SECRET=
GOOGLE_OAUTH_REFRESH_TOKEN=
SHEET_TAB_NAME=Leads
REPORTS_DRIVE_FOLDER_ID=

# Gmail
GMAIL_FROM=hey@remodelerrank.com

# OpenPhone
OPENPHONE_API_KEY=
JENNIFER_PHONE=9259409484

# App
PORT=3000
```

---

## Golden Rules (updated — 14 total)

1. Never touch a live site without a backup.
2. Never store passwords in the repo or Drive. Use environment variables.
3. Never send to a prospect without Jennifer's review. Generate drafts only.
4. Domain ownership stays with the client. Always.
5. Get the details verification signed before building anything.
6. Preserve existing URL structure. Generate redirect map if URLs change.
7. Photos first. No remodeling site ranks or converts without project photography.
8. Brand voice runs before any copy is written. No exceptions.
9. Cold outreach only from sending domain, never from hey@remodelerrank.com.
10. Pre-launch SEO checklist must be completed before every DNS switch.
11. Monthly reports send on the 1st. This is the primary churn prevention tool.
12. No emoji anywhere in any prospect-facing output. This is a premium product.
13. Honest grades. A decent site with real flaws is a C+, not a D. Never manufacture urgency.
14. Before/after images are always manual. Never attempt to auto-screenshot.

---

## Current Build Status

- [x] Session 1: scraper.js — Outscraper API
- [x] Session 2: database.js + sheets.js
- [x] Session 3: enricher.js — website, GBP, CSLB, Claude scoring
- [x] Session 4: reports.js + gmail.js
- [x] Session 5: Scheduling + cron
- [ ] **Immediate:** Apply all updates above before Session 6
- [ ] Session 6: Morning review web app
- [ ] Session 7: mini-site/SKILL.md + OpenPhone + email sequence wiring
- [ ] Session 8: Grader completion flow documentation + testing
