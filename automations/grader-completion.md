# Completing a Grader Report

**Goal:** Turn an approved lead into a finished, published grader report and a sent email in under 20 minutes.

---

## When to run this

- A HOT or WARM lead replied to your D0 email, OR
- You decide to finish a HOT lead proactively before they reply

Do not run this for MEDIUM leads (score 4-5) unless they have already replied.

---

## What you need before starting

- The lead's row in the Google Sheet (status: Approved or Contacted)
- Their website URL (in the sheet)
- A hero photo - ideally from their own website or Google Maps photos. Save it as `hero.jpg`.
- A project folder at `/clients/[business-slug]/`

The business slug is the name lowercased, spaces replaced with hyphens.
Example: Urban Edge Construction -> `urban-edge-construction`

---

## Step 1 - Create the client folder

```
/clients/[slug]/
```

You will put all files for this prospect here.

---

## Step 2 - Get their logo

1. Open their website in Chrome
2. Right-click their logo image -> Save Image As
3. Save it as `logo.png` inside `/clients/[slug]/`

If they have no logo, skip this. The mockup will hide the broken image automatically.

---

## Step 3 - Screenshot their current site (BEFORE image)

1. Open their website in Chrome
2. Set the window to exactly 1280px wide (use Chrome DevTools device toolbar if needed)
3. Screenshot the top 900px - just the above-the-fold view, no scrolling
4. Save as `before.png` inside `/clients/[slug]/`

This becomes the BEFORE image in the grader report.

---

## Step 4 - Save a hero photo

Find a strong project photo from their site, their Google Maps listing, or their Houzz profile.
- Kitchen or bathroom remodel preferred
- Good lighting, clear subject
- Save as `hero.jpg` inside `/clients/[slug]/`

---

## Step 5 - Build the mockup (Claude Code)

Open Claude Code and say:

> "Read skills/mini-site/SKILL.md then build a mockup for [Business Name]. Logo is at /clients/[slug]/logo.png. Screenshot is at /clients/[slug]/before.png. Hero photo is at /clients/[slug]/hero.jpg"

Claude Code will:
- Read the skill instructions
- Extract brand colors from the logo and screenshot
- Build a full Builder Funnel mockup
- Save it to `/clients/[slug]/mockup/index.html`

**Time: about 3-5 minutes**

---

## Step 6 - Screenshot the mockup (AFTER image)

1. Open `/clients/[slug]/mockup/index.html` in Chrome
2. Set the window to 1280px wide
3. Screenshot the top 900px
4. Drag the screenshot back into the Claude Code chat

Claude Code will embed both the BEFORE and AFTER screenshots as base64 images directly in the grader HTML, then save the finished grader to:

```
/clients/[slug]/grader/index.html
```

**Time: about 2 minutes**

---

## Step 7 - Review the grader

Open `/clients/[slug]/grader/index.html` in Chrome. Check:

- Business name is correct
- Score, grade badge, and revenue block look right
- BEFORE and AFTER images are both visible
- Audit findings section reads well (Claude-generated - edit if needed)
- No em dashes anywhere
- No typos in the contact info at the bottom

Make any edits directly in the HTML file.

---

## Step 8 - Publish to Netlify

Copy the grader HTML to the audits folder in the repo:

```
/audits/[slug].html
```

Then commit and push:

```
git add audits/[slug].html
git commit -m "add [business name] grader"
git push
```

The page goes live in about 30 seconds at:
```
https://remodelerrank.com/audits/[slug].html
```

Copy that URL - you will need it in the next step.

---

## Step 9 - Update the Gmail draft

1. Open Gmail Drafts
2. Find the draft for this prospect (subject: "[Business Name] - quick question")
3. The draft body contains a Drive preview link - replace it with the live Netlify URL
4. Read the full draft one more time before sending
5. Send

---

## Step 10 - Update the Google Sheet

In the lead's row:

| Column | What to enter |
|---|---|
| V - Status | Contacted |
| AC - Audit URL | paste the live Netlify URL |
| W - Email D0 Sent | today's date (YYYY-MM-DD) |
| AD - Grader Generated | today's date (YYYY-MM-DD) |

---

## Follow-up schedule

The morning review app will surface these automatically:

| Day | Action |
|---|---|
| D0 | Email sent today (Step 9 above) |
| D3 | Send the D3 follow-up (already drafted in prompts.js) |
| D7 | Send the D7 close (last touch) |

When you send D3 or D7, update columns X or Y in the sheet with today's date.

---

## Timing targets

| Step | Target time |
|---|---|
| Steps 1-4 (folder, logo, screenshots) | 8 minutes |
| Steps 5-6 (mockup + embed) | 5 minutes |
| Steps 7-8 (review + publish) | 4 minutes |
| Steps 9-10 (send + update sheet) | 3 minutes |
| **Total** | **under 20 minutes** |

---

## File structure reference

```
/clients/
  [slug]/
    logo.png          <- their logo
    before.png        <- screenshot of their current site
    hero.jpg          <- project photo for the mockup
    mockup/
      index.html      <- the AFTER mockup (Claude-generated)
    grader/
      index.html      <- the finished grader report (Claude-generated)

/audits/
  [slug].html         <- copy of grader deployed to Netlify
```
