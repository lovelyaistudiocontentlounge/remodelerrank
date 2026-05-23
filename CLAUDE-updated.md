# RemodelerRank Lead Pipeline
## CLAUDE.md — Authoritative Operating Manual
*Last updated: May 2026 — reflects actual build status + all session decisions*

---

## What This Project Is

Automated overnight lead generation, scoring, and outreach pipeline for **RemodelerRank**, a marketing agency serving remodeling contractors in the East Bay and surrounding California counties.

**Owner:** Jennifer
**Email:** hey@remodelerrank.com
**Phone:** 925-940-9484
**Site:** remodelerrank.com (separate repo: Desktop/RemodelerRank)
**Calendly:** https://calendly.com/hey-remodelerrank/review-meeting-15-minutes

---

## Two Separate Repos — Know Which One You Are In

```
Desktop/RemodelerRank/          <- WEBSITE REPO (Netlify)
  index.html                    <- homepage
  checklist.html                <- daily ops checklist
  thank-you.html                <- form confirmation page
  audits/                       <- client grader reports
  images/                       <- jennifer.png + other site images
  CONTENT/                      <- content calendar assets

Desktop/RemodelerRank/remodelerrank/   <- THIS REPO (pipeline)
  scraper.js, enricher.js, etc.
```

Never mix files between repos. Site files go in the website repo. Pipeline code stays here.

---

## Actual File Structure (verified May 22 2026)

```
/remodelerrank/
  CLAUDE.md                     <- this file
  .env                          <- secrets (never commit)
  .gitignore
  config.js                     <- all env vars, constants, city list, search terms
  database.js                   <- SQLite dedup + query rotation tracking
  ecosystem.config.js           <- PM2 config
  enricher.js                   <- website, GBP, CSLB, Apollo, findability, Claude score
  get-token.js                  <- Google OAuth helper
  gmail.js                      <- Gmail draft creation (never auto-send)
  index.js                      <- scheduler + nightly scrape + approval watcher
  leads.db                      <- SQLite database
  logger.js                     <- file logger -> logs/pipeline.log
  package.json
  prompts.js                    <- ALL Claude prompts + email templates D0/D3/D7
  reports.js                    <- HTML audit report generation + Drive upload
  scraper.js                    <- Outscraper API calls
  server.js                     <- morning web app (Session 6) + Watch/Skip/AddLead + OpenPhone text modal (Session 9)
  sheets.js                     <- Google Sheets read/write (32 columns A-AF)
  remodelerrank-build-instructions.md  <- session build specs

  /automations/
    grader-completion.md        <- step-by-step grader completion flow (Session 8)

  openphone.js                  <- OpenPhone SMS module (Session 9)

  /automations/
    grader-completion.md        <- step-by-step grader completion flow (Session 8)

  /skills/
    /mini-site/
      SKILL.md                  <- prospect mockup builder skill (Session 7)
    /photo-filename-protection/
      SKILL.md                  <- MANDATORY: never rename image files in HTML (Session 9)
    /photo-pipeline/
      SKILL.md                  <- photo naming, sizing, WebP conversion (Session 9)
    /seo-build/
      SKILL.md                  <- post-approval SEO layer (Session 9)
    /pre-launch/
      SKILL.md                  <- 36-item pre-launch checklist (Session 9)
    /onboarding/
      SKILL.md                  <- client intake process (Session 9)

  /templates/
    client-deliverable-system.md  <- master data collection + platform buildout checklist (Session 9)
    content-calendar.md           <- 6-week launch content schedule (Session 9)
    email-d0.md                   <- Day 0 outreach template (Session 9)
    email-d3.md                   <- Day 3 follow-up template (Session 9)
    email-d7.md                   <- Day 7 close template (Session 9)

  /logs/                        <- pipeline.log lives here
```

---

## Files Still To Build

```
/skills/
  /monthly-report/
    SKILL.md                    <- monthly report generation (TO BUILD - Session 10)
```

---

## Environment Variables (.env)

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
REPORTS_DRIVE_FOLDER_ID=1sLwrl43xmfZUT9m1Da3jQLrI8D9zmL_o

# Gmail
GMAIL_FROM=hey@remodelerrank.com

# OpenPhone
OPENPHONE_API_KEY=
OPENPHONE_NUMBER_ID=PNkSJ6WM4F  # Jennifer's OpenPhone number - confirmed May 2026
JENNIFER_PHONE=9259409484

# App
PORT=3000
```

---

## Geography — 57 Target Cities

Full list lives in config.js SEARCH_CITIES. Counties covered:
- Contra Costa (20 cities)
- Alameda (10 cities)
- Solano (7 cities)
- Marin (7 cities)
- Yolo (3 cities)
- Santa Clara northern edge (4 cities)
- San Mateo northern (6 cities)

---

## Search Terms — 16 Rotating

Full list in config.js SEARCH_TERMS. Includes:
kitchen remodeling contractor, bathroom remodeling contractor, home remodeling contractor,
general contractor remodeling, kitchen and bath contractor, home renovation contractor,
ADU contractor, room addition contractor, whole home remodel, kitchen renovation company,
bathroom renovation company, residential remodeling contractor, home improvement contractor,
design build contractor, custom home remodeling, licensed remodeling contractor

**Rotation:** 20 city+term combos per night. 912 total combinations. Full cycle every ~46 nights.

---

## Google Sheet Columns (A-AF, 32 columns)

```
A=Date Added, B=Lead Score, C=Findability Score, D=Priority,
E=Business Name, F=Owner Name, G=Phone, H=Email, I=Email Found,
J=Website URL, K=Platform, L=City, M=County, N=Google Rating,
O=Review Count, P=GBP Score, Q=CSLB License, R=License Status,
S=Portfolio Buried, T=Best Hook, U=Findability Breakdown, V=Status,
W=Email D0 Sent, X=Email D3 Sent, Y=Email D7 Sent,
Z=Text D0 Sent, AA=Text D4 Sent, AB=Reply Received,
AC=Audit URL, AD=Grader Generated, AE=Notes, AF=Place ID
```

Status values: New -> Approved -> Watch -> Skipped -> Contacted -> Replied -> Meeting -> Client

**Watch** = flagged for later review. Stays in the sheet, removed from the daily queue. Use for prospects that look interesting but need more research or timing isn't right.

---

## Outreach Score Tiers

```
Score 8-10 (HOT):   HTML grader + Gmail draft + Calendly link
Score 6-7 (WARM):   HTML grader + Gmail draft + Calendly link
Score 4-5 (MEDIUM): Generic Gmail draft only, no grader
Score < 4:          Nothing generated, flagged Skip
```

---

## Scoring Rules (in prompts.js)

- Score honestly. A WordPress site with real project photos, BBB accreditation, and an active CSLB license is a C+, not a D. Reserve F grades for zero schema, zero reviews, or no website.
- `portfolio_buried: true` when project photos only exist on a secondary nav page (Gallery, Portfolio), not visible on homepage
- When `portfolio_buried` is true, best_hook = "Your project photos are impressive - they are just buried where most homeowners never find them."
- No emoji anywhere in any scored output field
- No em dashes anywhere - use plain hyphen or rewrite

**Scoring prompt must return:**
```json
{
  "score": 7,
  "grade": "C+",
  "score_reason": "one sentence",
  "priority": "hot|warm|cold",
  "best_hook": "one specific true observation",
  "portfolio_buried": true,
  "platform": "WordPress|Wix|GoDaddy|Squarespace|Custom|None"
}
```

---

## Grader Report Design (RemodelerRank sage palette)

All grader reports use RemodelerRank's own branding - NOT the client's brand.

**CSS variables (required in every report):**
```css
:root {
  --white: #FFFFFF; --off-white: #FAFAF8; --warm-sage-tint: #EEF2EF;
  --sage: #8BA89A; --sage-dark: #6E8E7E; --sage-deeper: #4A6E5E;
  --charcoal: #2C2C2C; --body-text: #4A4A4A;
  --muted-sage: #7A8A80; --faint-sage: #B0BDB5; --border: #DDE6E1;
  --red: #C0392B; --amber: #D4801A; --green: #2D7A4F;
}
```

**Grade colors:** A=#55c490, B=#8BC48A, C=#D4801A, D=#c0601a, F=#C0392B

**Typography:** Lora (serif headlines) + Karla (body) - load from Google Fonts

**Required sections in order:**
1. Header (RemodelerRank branding + business name + grade badge)
2. Stats strip (6 data pills with colored dots)
3. Revenue banner (missed revenue estimate + math block)
4. Before/after comparison (screenshot placeholders - filled manually)
5. 14-point score grid (2-column)
6. 3 priority wins (urgent/medium/quick)
7. CTA section (charcoal bg, Calendly link)
8. Footer

---

## RemodelerRank Brand Assets — Logo Files

Logo files live in the **website repo** at `Desktop/RemodelerRank/images/`.

| File | Dimensions | Use when |
|---|---|---|
| `logo.svg` | 340x60 | Light/white surfaces - white background rect baked in |
| `logo-reversed.svg` | 340x60 | Dark surfaces - transparent bg, white text. Use in nav and footer. |
| `logo-icon.svg` | 100x100 | Icon-only contexts - charcoal square with "RR" in white + sage underline |

**Usage rules:**
- Nav (dark bg) and footer (dark bg): always `logo-reversed.svg`
- Article header, light-bg sections, email: `logo.svg`
- Favicon contexts (PWA, social): `logo-icon.svg` is the source for all PNG exports
- SVG preferred over PNG - no quality loss at any size
- `img` tag: `<img src="images/logo-reversed.svg" alt="RemodelerRank" height="30" width="auto">` (or `height="26"` in footer)
- Never inline or modify the SVG source. Reference as external file.

**Favicon files** (website repo root - added May 2026):
```
favicon.ico, favicon.svg, favicon-96x96.png, apple-touch-icon.png,
web-app-manifest-192x192.png, web-app-manifest-512x512.png, site.webmanifest
```

**Standard favicon link block** (paste into every new HTML page):
```html
<link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="shortcut icon" href="/favicon.ico">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<meta name="apple-mobile-web-app-title" content="RR">
<link rel="manifest" href="/site.webmanifest">
```

---

## Mini-Site Mockups (Client's Brand, NOT RemodelerRank)

The mini-site skill (skills/mini-site/SKILL.md) builds mockups in the PROSPECT'S palette.

Key rules from the skill:
- Extract dominant colors from their logo + site screenshot
- If bright yellow-gold: shift to muted brass #C9A96E
- Builder Funnel structure: Info bar -> Nav -> Hero -> Trust bar -> Pain -> Services -> Process -> Reviews -> Mid CTA -> Areas -> Final CTA -> Footer
- No emoji anywhere - use typographic markers (rules, numbered lists, dashes)
- Logo as img tag with onerror fallback - SVG preferred, PNG fallback
- Save to /clients/[slug]/mockup/index.html
- After generating: tell Jennifer to screenshot at 1280px wide, top 900px

**Mockup protection:** Never deploy mockups to Netlify or create public URLs without explicit instruction. Screenshots only for the grader report.

---

## Before/After Images — Always Manual

Never attempt to auto-screenshot. The process:
1. Jennifer screenshots prospect's current site
2. Claude Code generates mini-site mockup
3. Jennifer screenshots the mockup
4. Both embedded as base64 in the grader HTML
5. Grader pushed to remodelerrank.com/audits/[slug].html

See automations/grader-completion.md for the full step-by-step (target: under 20 min per prospect).

---

## Photo Filename Rule — MANDATORY

**Never rename, modify, or guess image filenames when writing HTML.**

If Jennifer says the file is jennifer.png - use jennifer.png exactly.
If a UUID filename exists - keep the UUID exactly.
If filename is unknown - use REPLACE_WITH_ACTUAL_FILENAME.jpg and ask.

This rule exists because renaming a file in code breaks the image silently and wastes significant time debugging.

Full rules in: skills/photo-filename-protection/SKILL.md (add to repo)

---

## Email Rules

- No em dashes ANYWHERE - not in subjects, bodies, prompts, code comments, or reports
- No emoji in any prospect-facing output
- Never auto-send - always stage as Gmail drafts only
- Calendly link in every email draft
- Subject format: "[Business Name] - quick question" (plain hyphen)
- Sequence: D0, D3, D7 - all templates in prompts.js

---

## Content System (New - Added May 2026)

RemodelerRank has a 6-pillar content framework. Files in /templates/content-calendar.md.

**6 Pillars:**
1. Projects as Content Goldmines - "I have great photos, now what?"
2. Better Leads Not More Leads - "I'm sick of tire kickers"
3. The Google Gap - "My competitor shows up and I don't"
4. Trust Before the Estimate - "Homeowners need to trust me before they call"
5. The Referral Bridge - "Referrals are great but drying up"
6. The AI-Ready Contractor - "What even is AI search?"

**Key content pieces (high virality):**
- "Great projects, bad photos? 5-minute cleanup" reel (Week 1 Day 3)
- DIY trap carousel - give the Claude prompt, show why it still won't rank (Week 3 Day 4)

**Visual rule:** Always pair content with beautiful project photography. Sage is the frame, the project is the hero. Never solid green backgrounds alone.

---

## Client Deliverable System (New - Added May 2026)

Full spec in /templates/client-deliverable-system.md.

Three phases:
1. Data Collection (verified NAP, services, brand voice, assets)
2. Build + Approval (site built, client approves)
3. Launch + Platform Buildout (GBP, Yelp, Houzz, Apple Maps, Facebook, Instagram, BuildZoom)

**Critical rule:** All platform data (GBP, Yelp, Houzz, etc.) must be copy-pasted from the verified data collection doc - never retyped from memory. NAP consistency is non-negotiable.

---

## Skills Status

| Skill | Status | Location |
|---|---|---|
| mini-site | Built | skills/mini-site/SKILL.md |
| photo-filename-protection | Built | skills/photo-filename-protection/SKILL.md |
| photo-pipeline | Built | skills/photo-pipeline/SKILL.md |
| seo-build | Built | skills/seo-build/SKILL.md |
| pre-launch | Built | skills/pre-launch/SKILL.md |
| onboarding | Built | skills/onboarding/SKILL.md |
| monthly-report | TO BUILD | Session 10 |

---

## Build Status (Actual - Verified May 22 2026)

- [x] Session 1: scraper.js - Outscraper API
- [x] Session 2: database.js + sheets.js
- [x] Session 3: enricher.js - website, GBP, CSLB, Apollo, findability, Claude scoring
- [x] Session 4: reports.js + gmail.js
- [x] Session 5: Scheduling + PM2 (ecosystem.config.js)
- [x] Immediate updates: 57 cities, 16 terms, Apollo, findability, HTML reports, score tiers, email templates
- [x] Session 6: Morning web app - server.js (localhost:3000, npm run morning)
- [x] Session 7 partial: mini-site/SKILL.md written, OpenPhone config PENDING
- [x] Session 8: automations/grader-completion.md
- [x] Session 9: openphone.js + config update + /api/send-text in server.js; all 5 skills added; all 5 templates added

**Next session (Session 10):**
- Build monthly-report/SKILL.md
- Wire text D4 follow-up (openphone.js has textD4() ready, needs scheduler in index.js)
- Review scoring prompt against real leads after first nightly run

---

## Decision Authority

**Claude Code can act autonomously on:**
- Reading and analyzing websites and data
- Generating draft content (reports, emails, copy, code)
- Creating files in /clients/ and /templates/
- Populating templates with prospect data
- Running site audits and scoring

**Claude Code must STOP and ask before:**
- Sending any email or message
- Modifying or deleting any existing client file
- Making any API call that costs money
- Taking any action that affects a live site
- Anything involving credentials or login info

---

## Golden Rules (All 14)

1. Never touch a live site without a backup.
2. Never store passwords in repo or Drive. Use environment variables.
3. Never send to a prospect without Jennifer's review. Drafts only.
4. Domain ownership stays with the client. Always.
5. Get the details verification signed before building anything.
6. Preserve existing URL structure. Generate redirect map if URLs change.
7. Photos first. No remodeling site ranks or converts without project photography.
8. Brand voice runs before any copy is written. No exceptions.
9. Cold outreach only from sending domain, never from hey@remodelerrank.com.
10. Pre-launch SEO checklist must be completed before every DNS switch.
11. Monthly reports send on the 1st. Primary churn prevention tool.
12. No emoji anywhere in any prospect-facing output. Premium product.
13. Honest grades. Decent site with real flaws = C+, not a D. Never manufacture urgency.
14. Before/after images are always manual. Never attempt to auto-screenshot.

---

## Pricing (May 2026)

| Tier | Site Build | Monthly | Notes |
|---|---|---|---|
| Launch | $2,500 once | $0 | Website + GBP + listings, no retainer |
| Presence | $2,500 once | $497/mo | 3-month min, then month-to-month |
| Active | $2,500 once | $897/mo | Most popular |
| Growth | $2,500 once | $1,497/mo | Full domination |
