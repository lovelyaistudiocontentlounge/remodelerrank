# Onboarding Skill

Client intake process. Runs after a prospect says yes and pays the deposit.

This skill covers everything from the signed contract through the end of the first call. The output is a completed data collection doc that both Jennifer and the client have confirmed in writing.

---

## When This Triggers

A lead moves to "Client" status in the sheet. Jennifer says:
> "Start the onboarding for [Business Name]."

Do not start building anything until Phase 1 of this skill is complete and the client has signed off on the data collection doc.

---

## Phase 1 - Before the Kick-off Call

### 1.1 - Send the Pre-Call Questionnaire

Send within 24 hours of deposit. Jennifer sends from hey@remodelerrank.com.

**Subject:** [Business Name] - a few questions before our call

```
Hi [First Name],

Looking forward to our kick-off call. Before we meet, can you answer these questions? 
It saves us time on the call and means I come prepared.

Takes about 10 minutes.

1. What is the legal name on your CSLB license? (I want to match it exactly everywhere.)
2. What is your CSLB license number?
3. What is your primary business address? (The one you want on Google.)
4. What phone number should homeowners call?
5. What are your business hours?
6. List every service you want on the site. Be specific - "kitchen remodeling" and "ADU" are 
   different services.
7. What cities and counties do you serve?
8. How long have you been in business?
9. Approximately how many projects have you completed?
10. What do most remodeling contractors get wrong that you do differently?
11. What do clients always compliment you on after a project?
12. Who is your ideal client? (One sentence.)
13. Do you have a Yelp listing? A GBP? A Houzz profile? (Links if you have them.)
14. Do you have a Google Analytics account we should connect?

For photos: please send at minimum 10 project photos - finished work only. iPhone photos are 
fine. The more the better.

For your logo: please send the file (SVG or PNG preferred).

Jennifer
RemodelerRank
925-940-9484
```

### 1.2 - Create the Client Folder

```
/clients/[slug]/
  logo.png          <- placeholder until received
  photos/           <- empty until received
  mockup/           <- built in Session 7 skill
  audit/            <- before/after screenshots
```

Slug format: `[city]-[business-name]` lowercased, hyphens. Example: `walnut-creek-apex-renovation`.

### 1.3 - Pull What We Already Have

From the lead record in the sheet:
- Business name, phone, email, website
- CSLB license number and status (verified)
- GBP score and findability breakdown
- Best hook and score reason from the audit

Pre-populate the data collection doc with these values. Flag any that need client confirmation.

---

## Phase 2 - Kick-off Call (30 minutes)

### Agenda

```
0:00 - 0:03   Introductions, confirm they got the questionnaire answers reviewed
0:03 - 0:12   Walk through NAP - confirm name, address, phone exactly as they want it everywhere
0:12 - 0:20   Services and service area - confirm every service they want, confirm city list
0:20 - 0:25   Brand voice - ask the 3 questions below if questionnaire answers were thin
0:25 - 0:28   Photo and asset handoff - confirm what they are sending and by when
0:28 - 0:30   Timeline - give them the 3 milestones and confirm the review date
```

### Brand Voice Questions (ask if questionnaire answers were generic)

1. "Tell me about a project you were most proud of. What made it stand out?"
2. "What is the one thing you would never want a homeowner to say about working with you?"
3. "If a homeowner is choosing between you and another contractor, what tips it your way?"

Record the answers verbatim. These exact words will appear in the site copy.

### Timeline to Give the Client

- **Day 1-3:** Asset collection (photos, logo, access)
- **Day 7:** Mockup delivered for review
- **Day 14:** Full site delivered for review
- **Day 21:** Launch (after approval and DNS transfer)

Adjust based on asset delivery speed. If photos take longer, everything slides. Be honest about this on the call.

---

## Phase 3 - Data Collection Doc

After the call, compile everything into the data collection doc using the template at:
`templates/client-deliverable-system.md` (Phase 1 section)

Send the doc to the client within 24 hours of the kick-off call.

**Subject:** [Business Name] - details to confirm before we build

```
Hi [First Name],

Great call. Here is everything I have on record for [Business Name].

[attach the completed data collection doc as PDF or share a Google Doc link]

Please review and confirm:
1. The NAP section - this is what will appear everywhere (Google, Yelp, Houzz, the site)
2. The services list - anything missing or incorrect?
3. The service area - any cities to add or remove?

Reply with "confirmed" or with any corrections. I will not start building until I hear back from you.

Once confirmed, I will send you the mockup within 7 days.

Jennifer
RemodelerRank
925-940-9484
```

**Do not start building the site until the client replies with confirmation.**

Golden rule 5: Get the details verification signed before building anything.

---

## Phase 4 - Asset Collection

Track receipt of each item. Do not follow up more than once per item per week.

| Asset | Received | Notes |
|---|---|---|
| Logo (SVG or PNG) | | |
| Project photos (10+) | | |
| Owner/team photo | | |
| GBP owner access (hey@remodelerrank.com) | | |
| Domain registrar access or transfer | | |
| Existing GA4 property (if any) | | |

### Photo Processing After Receipt

1. Rename according to photo-pipeline/SKILL.md naming convention
2. Convert to WebP at correct sizes
3. Save to /clients/[slug]/photos/
4. Do not delete originals until site is live and approved

### Login / Access Rules

- Never store passwords in this repo, in any doc, or in email
- Use 1Password for all client credentials
- GBP: request owner-level access for hey@remodelerrank.com - do not ask for their Google password
- Domain: prefer transfer to Netlify DNS - do not log into their registrar yourself unless they cannot do it

---

## Phase 5 - Handoff to Build

Once data collection doc is confirmed and assets are received:

1. Mark client as "Build" status in the sheet
2. Open client-deliverable-system.md (Phase 2)
3. Build the mockup using mini-site/SKILL.md
4. Run seo-build/SKILL.md before launch
5. Run pre-launch/SKILL.md before DNS switch

---

## Communication Rules

- All client communication from hey@remodelerrank.com
- Response time: same business day for anything before 3pm, next morning otherwise
- Never promise a launch date - promise a milestone date ("mockup in 7 days") and adjust if assets are late
- If a client ghosts on asset delivery: one follow-up after 5 days, then wait. Do not chase.
- Status updates: send one email per milestone (mockup ready, site ready, launched)
