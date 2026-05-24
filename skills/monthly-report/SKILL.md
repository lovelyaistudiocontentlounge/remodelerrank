# Monthly Report Skill

Primary churn prevention tool and sales asset. Sends on the 1st of every month. Shows the client exactly what changed, what moved, and what is coming next. A client who sees clear progress does not cancel.

This report also serves as a proof-of-concept for prospects. It answers "what would I actually get from RemodelerRank?" before they sign.

---

## When This Triggers

Jennifer will say:
> "Run monthly-report for [Business Name]."

Or: "Build the [Month] report for [Business Name]."

---

## What You Need Before Starting

Gather all of this before writing a single line of the report. Numbers without context are useless. Month-over-month comparisons are what make the report land.

### From Google Analytics 4

Pull for the report month AND the previous month (for comparison):

- Total sessions
- Organic search sessions
- New users
- Avg. engagement time
- Top 5 landing pages by sessions
- Top 5 cities by sessions
- Form completions (if GA4 goals are set up)

If GA4 access is not set up yet: flag it and note "Data pending - GA4 connection in progress."

### From Google Business Profile (GBP Insights)

Pull for the report month AND previous month:

- Business profile views (search + maps)
- Calls from GBP
- Direction requests
- Website clicks from GBP
- Photo views
- Review count and current rating

GBP Insights are available in the GBP dashboard under "Performance."

### From the Client Data Collection Doc

- Services offered (to contextualize wins)
- Service area (to contextualize local rankings)
- Launch date (to calculate "months live" for newer clients)
- Tier (Presence / Active / Growth) - determines which sections apply

### What Jennifer Tracks Manually

Ask Jennifer for:
- New leads or inquiries this month (calls, texts, referrals)
- Any projects booked that she knows came from the website or GBP
- Any significant events: new photos added, GBP posts published, reviews received
- Open items from last month's report (did the client do anything on their end?)

---

## Report Structure

Build as a standalone HTML file. Deliver path: `/clients/[slug]/reports/[YYYY-MM]-monthly-report.html`

Use the RemodelerRank sage palette. This is our report, our brand. Client's logo appears once in the header. The rest is RemodelerRank presentation.

---

### Section 1 - Header

```html
<!-- RemodelerRank logo (reversed, charcoal bg) -->
<!-- Month and year: "May 2026 Performance Report" -->
<!-- Client business name below the month -->
<!-- Months active badge: "Month 3 of your partnership" -->
```

Background: `--charcoal` (#2C2C2C)
Logo: `logo-reversed.svg` at height 28px
Month label: Lora italic, 14px, `--faint-sage`
Client name: Karla 700, 32px, white
Months active: small pill, `--sage` bg, white text, Karla 400 12px

---

### Section 2 - Executive Summary (3 Wins)

Three specific wins from this month. These must be real and true - never manufacture progress.

Format: three horizontal cards on charcoal-tinted bg (`--warm-sage-tint`).

Each card:
- Large number or stat (Lora, 48px, `--sage-deeper`)
- One-line description (Karla 400, 14px, `--body-text`)
- Direction indicator: up arrow (green #2D7A4F) or down arrow (#C0392B) with % change vs last month

Examples of good win cards:
- "312 website visits - up 24% from last month"
- "18 calls from Google - up 6 from April"
- "4.9 stars - 3 new reviews this month"

If a metric went down, do not hide it. Show it honestly and explain why in the section below. A client who catches you hiding a bad month loses trust permanently.

---

### Section 3 - Website Traffic

Two-column layout: left = current month, right = previous month for each metric.

| Metric | This Month | Last Month | Change |
|---|---|---|---|
| Total Sessions | | | |
| Organic Sessions | | | |
| New Users | | | |
| Avg. Engagement Time | | | |

Below the table: one short paragraph (2-3 sentences) interpreting what the numbers mean. Examples:

- "Organic traffic is up 24%. Your homepage is now ranking on page one for 'kitchen remodeling Walnut Creek' - that is driving most of the new visits."
- "Traffic is flat this month. April and May are typically lower for home improvement searches - this is seasonal and expected."

**Top Pages this month** - simple ranked list, sessions next to each:
1. Homepage - 180 sessions
2. Kitchen Remodeling - 54 sessions
3. Contact - 38 sessions

---

### Section 4 - Google Business Profile

Same two-column layout as traffic.

| Metric | This Month | Last Month | Change |
|---|---|---|---|
| Profile Views | | | |
| Calls | | | |
| Direction Requests | | | |
| Website Clicks | | | |
| Photo Views | | | |
| Review Count | | | |
| Avg. Rating | | | |

Below the table: one short interpretive paragraph.

**Reviews received this month** - if any, show them:

> "Great company to work with. Finished our kitchen remodel on time and on budget." - Google Review, May 2026

If zero reviews this month: "No new reviews this month. See Next Month section for the review ask strategy."

---

### Section 5 - Local Rankings

This section only applies if Jennifer has been doing manual rank checks or if a rank tracking tool is in use.

Simple keyword table:

| Keyword | Position | Change | Notes |
|---|---|---|---|
| kitchen remodeling walnut creek | 4 | +3 | Moved from 7 to 4 |
| bathroom remodeling contractor concord | 12 | new | First time tracking |

If rank data is not available: "Rankings tracked manually - data for this month not yet captured. Adding to next month's report."

Do not invent rankings. Leave the section blank with that note rather than guess.

---

### Section 6 - Leads and Revenue Impact

This is the most important section for retention. Connect the website activity to real business outcomes.

**Verified leads this month:**

| Lead Source | Count | Notes |
|---|---|---|
| Website form | 3 | |
| GBP call | 18 | |
| GBP direction request | 7 | |
| Direct referral (attributed to site) | 2 | client mentioned |

**Estimated revenue impact:**

Use the $85K/year missed revenue figure as the baseline reference point only when the contractor has not yet converted leads. For active clients showing results, calculate actual:

- If avg. project value is known: multiply by closed jobs attributed to online presence
- If not known: use "At your average project value, [X] qualified leads from organic sources this month represents significant pipeline activity."

Do not fabricate dollar amounts. Use ranges or estimates clearly labeled as estimates.

---

### Section 7 - What We Did This Month

Bullet list of RemodelerRank's actual work this month. Be specific and concrete.

Examples:
- Published 2 GBP posts (project photos with captions)
- Added 6 new project photos to the website gallery
- Responded to 2 new Google reviews on your behalf
- Updated your GBP service list to include "room additions"
- Fixed a broken link on the kitchen remodeling page
- Submitted your listing to Houzz (citation building)

This section exists to answer the unspoken question every retainer client has: "What am I actually paying for?" Show the work.

---

### Section 8 - Next Month Priorities

Three items max. Prioritize by impact.

Format: numbered list, one sentence each.

Examples:
1. Publish a before/after project post on GBP targeting "bathroom remodel Concord"
2. Add your ADU project photos to the portfolio page - we have them, they just need to go live
3. Send review request to the Patel family (job closed in April - timing is right now)

If a client action is needed, call it out explicitly:
> "Client action needed: Please send 3-4 photos from the Pleasanton kitchen project. We will have them live within 48 hours of receipt."

---

### Section 9 - CTA Footer

Charcoal background, centered.

```
Questions about this report?
Book a 15-minute call: [Calendly link]
hey@remodelerrank.com | 925-940-9484
```

RemodelerRank logo (reversed) at bottom, 24px height.

---

## HTML Design Spec

### CSS Variables (required)

```css
:root {
  --white: #FFFFFF;
  --off-white: #FAFAF8;
  --warm-sage-tint: #EEF2EF;
  --sage: #8BA89A;
  --sage-dark: #6E8E7E;
  --sage-deeper: #4A6E5E;
  --charcoal: #2C2C2C;
  --body-text: #4A4A4A;
  --muted-sage: #7A8A80;
  --faint-sage: #B0BDB5;
  --border: #DDE6E1;
  --green: #2D7A4F;
  --red: #C0392B;
  --amber: #D4801A;
}
```

### Typography

```html
<link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Karla:wght@400;500;700&display=swap" rel="stylesheet">
```

- Section headlines: Lora 600, `--charcoal`
- Body text: Karla 400, `--body-text`
- Large stat numbers: Lora 400 or 700, `--sage-deeper`
- Labels/captions: Karla 400, `--muted-sage`, 13px
- Up change: `--green` with arrow ↑
- Down change: `--red` with arrow ↓
- Flat/new: `--muted-sage` with dash -

### Layout

- Max width: 720px, centered, white bg
- Section padding: 48px 40px
- Alternating section bg: white / `--off-white` / `--warm-sage-tint`
- Header and footer: `--charcoal`
- Border between sections: 1px solid `--border`
- Mobile: single column, padding 24px 20px

### Tables

```css
table { width: 100%; border-collapse: collapse; font-family: 'Karla', sans-serif; }
th { background: var(--warm-sage-tint); color: var(--sage-deeper); font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; padding: 10px 14px; text-align: left; }
td { padding: 12px 14px; border-bottom: 1px solid var(--border); color: var(--body-text); font-size: 15px; }
tr:last-child td { border-bottom: none; }
```

---

## Delivery

1. Save HTML to `/clients/[slug]/reports/[YYYY-MM]-monthly-report.html`
2. Open in browser, verify all sections look correct at 720px width
3. Upload to the client's Reports Drive folder (REPORTS_DRIVE_FOLDER_ID in .env) using the same Drive upload pattern as audit reports in reports.js
4. Email Jennifer the Drive link with the subject: `[Business Name] - [Month] report ready for review`
5. Jennifer reviews, makes any edits, then forwards to the client from hey@remodelerrank.com

**Never send directly to the client.** Jennifer reviews every report first.

Subject line for client send (Jennifer uses this):
`[Business Name] - your [Month] performance summary`

---

## Report Rules

- No em dashes anywhere in the report
- No emoji anywhere in the report
- No manufactured progress - if numbers are flat or down, say so and explain why
- Never delete or overwrite a previous month's report - keep all in /reports/
- If GA4 or GBP data is unavailable for any reason, note it clearly and move on. Do not delay the report.
- Months active counter starts at Month 1 for the launch month, increments each 1st

---

## Using This Report as a Sales Tool

When Jennifer wants to show a prospect what they would receive as a client:

1. Use the Kitchen Solutions report (or any anonymized client report) as a sample
2. Reference the report during the audit presentation: "Every month you get a report like this that shows exactly what is working and what we are doing about it."
3. The report format itself is the sales pitch - it demonstrates professionalism, transparency, and accountability

Do not show a real client's report to a prospect. Either anonymize the data (replace names and specific numbers) or reference it by description only.

---

## What This Skill Does Not Cover

- GBP post creation (covered in client-deliverable-system.md)
- Review response drafting (Jennifer handles or Claude Code drafts on request)
- Ad campaign reporting (not yet a service)
- Rank tracking setup (manual process - Jennifer checks via incognito search by city)
