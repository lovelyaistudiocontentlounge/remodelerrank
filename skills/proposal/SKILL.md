# Proposal Generator Skill

Read this file completely before writing a single word of proposal copy.

## What this skill does

Generates a complete, client-specific proposal document for a remodeling contractor prospect. Output is clean formatted text ready to paste into GHL, Assembly, Google Docs, or any proposal tool. Not an HTML file — platform-agnostic content only.

Paired with: `skills/proposal/agreement-template.md` (service agreement) and the grader report at `audits/[slug].html`.

---

## How to invoke

Jennifer will say something like:
> "Read skills/proposal/SKILL.md then build a proposal for [Business Name]."

She may also provide:
- Contact first name (the person you are addressing)
- Grader URL (remodelerrank.com/audits/[slug].html)
- Any details not in the grader (owner name, phone, how they connected)

If grader data is available, read `audits/[slug].html` to extract scores before writing. If not, ask Jennifer for the key audit findings before starting.

---

## Step 1 — Gather inputs

Collect or confirm all of these before writing:

| Field | Source |
|---|---|
| Contact first name | Jennifer provides |
| Business name | Grader or Jennifer |
| Grade (e.g. C+) | Grader header |
| Overall score (e.g. 6/10) | Grader |
| Findability score (e.g. 5/10) | Grader stats strip |
| Google rating + review count | Grader stats strip |
| Portfolio situation (buried / missing / present) | Grader or best hook |
| Best hook (the one specific true observation) | Grader or Jennifer |
| Website platform (WordPress / Wix / etc.) | Grader |
| Monthly search estimate | Grader revenue section |
| Grader URL | Jennifer provides or construct from slug |
| Engagement type | Default: 3-month pro bono starter unless Jennifer says otherwise |
| Calendly link | Default: calendly.com/hey-remodelerrank/free-website-audit |

If any field is missing and Jennifer has not provided it, write `[PLACEHOLDER — fill before sending]` in red caps so it is impossible to miss.

---

## Step 2 — Write the proposal

Use this exact structure. Every section is required. Do not add sections or reorder.

---

### SECTION 1: Opening (personal, direct — 3-4 sentences max)

Address by first name. Acknowledge the connection briefly (how they connected or that Jennifer reviewed their presence). Name the core problem in one sentence — use their situation specifically, not a generic statement. End with a forward-looking statement: "Here is what I found and what I am proposing."

**Tone:** Warm but direct. No flattery. No em dashes. No "I hope this email finds you well" language.

**Example pattern:**
> Hey [Name],
>
> Thanks for taking the time to connect. I have been working with NorCal contractors for a while now and the same story keeps coming up — great work, invisible online. After reviewing [Business Name]'s current presence, I can see that is exactly what is happening here, and it is fixable.
>
> Here is what I found and what I am proposing.

---

### SECTION 2: What the Audit Showed

A 5-6 row table using actual data from the grader. No invented or rounded numbers.

| Area | Finding |
|---|---|
| Overall Grade | [Grade from grader — e.g. C+] |
| Findability | [Score]/10 — [one-line description of the gap] |
| Google Rating | [Stars] stars, [count] reviews — [observation: strong/weak/not being used] |
| Portfolio | [Buried / Missing / Present] — [one sentence on impact] |
| Website | [Platform] — [one specific true finding from grader] |
| Missed opportunity | ~[search estimate] searches/month you are not capturing |

Close the table with one sentence that names the real problem without being harsh:
> The gap is not your work quality. It is that your online presence is not showing homeowners what you are actually capable of — before they ever call.

---

### SECTION 3: What I Am Proposing

Open with one sentence naming the engagement type and duration.

Then list deliverables by month. Use the standard 3-month structure unless Jennifer instructs otherwise:

**Month 1 — Foundation**
- Google Business Profile full audit, cleanup, and optimization
- Photo rescue — download and archive all existing project photos from your website and profiles
- Photo tagging — identify which photos are real [Business Name] work vs. web builder placeholders
- Website technical audit — written findings on speed, mobile, conversion, and SEO gaps
- Onboarding call to walk through access and priorities

**Month 2 — Content**
- 2 project pages built on your website (before/after, project story, SEO-optimized for [region] cities)
- 4 Google Business Profile posts
- Review request system set up — simple process to turn happy clients into visible proof
- Basic on-page SEO: city pages, service pages, meta descriptions

**Month 3 — Visibility**
- 2 more project pages
- 4 more GBP posts
- Monthly performance report showing before/after on key metrics
- Strategy call — what is working, what is next, whether paid traffic makes sense

Close Month 3 with one sentence on the 90-day outcome:
> At the end of 3 months, you will have a digital presence that actually shows what you build — and a clear picture of what is working.

---

### SECTION 4: How This Works

A clean table. No bullet points in this section.

| | |
|---|---|
| Investment | No charge for 3 months |
| What I need from you | Access to your accounts (GBP, website, domain) + 30 min/month of your time |
| What you own | Everything we build — all content, pages, and assets stay yours |
| After 3 months | Option to continue on a paid monthly retainer — no pressure, your call |
| Term | Month-to-month after the initial period |

---

### SECTION 5: Why I Am Doing This

2-3 sentences, honest. No overselling. This is where Jennifer explains the trade:
- She is building the agency on NorCal contractor results
- She needs real case studies more than she needs revenue right now
- The business is a good fit because [name one specific thing — reviews, established portfolio, long tenure, etc.]
- The trade: if it works, she would love a reference

**Do not use the word "leverage." Do not say "synergy," "partnership," or "ecosystem."**

---

### SECTION 6: Next Steps

Three numbered steps. Keep them short and concrete.

1. Reply to this or book a [duration]-minute kickoff call: [Calendly link]
2. I will send a one-page agreement to sign — no legalese, just clear on scope
3. I will send the access grant doc — takes about 20 minutes, I can walk you through it on a screen share

Close with one sentence: "Happy to answer any questions before you decide. This is a low-risk way to see what is possible."

Sign off: Jennifer's name, RemodelerRank, hey@remodelerrank.com, 925-940-9484

---

## Step 3 — Output format

Output the full proposal as clean markdown. Use:
- `## ` for section headers
- Tables where specified
- Plain paragraphs elsewhere
- No em dashes (use plain hyphens or rewrite)
- No emoji
- No bold on random phrases — bold only for table headers and section titles

After the proposal, output a second block labeled **SEND CHECKLIST** with these items:

```
SEND CHECKLIST — complete before this leaves your drafts
[ ] Contact first name confirmed (not a placeholder)
[ ] Grader URL in the email body (not in the proposal doc — separate line)
[ ] All table data pulled from actual grader, not estimated
[ ] Calendly link points to correct meeting type (30-min audit, not 15-min review)
[ ] Jennifer's last name added (or removed if not using)
[ ] Reviewed for em dashes — none allowed
[ ] Agreement template ready to attach or follow in next email
```

---

## What NOT to do

- Do not invent scores, ratings, or data not found in the grader
- Do not use the word "passionate" or "excited"
- Do not say "game-changer," "dominate," or "crush it"
- Do not write "I would love to help you" — show the help, do not announce it
- Do not mention RemodelerRank's pricing tiers in the proposal — this is a pro bono starter, pricing comes after month 3
- Do not send — this is a draft for Jennifer's review first
