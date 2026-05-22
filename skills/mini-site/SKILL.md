# Mini-Site Mockup Skill

Read this file completely before writing a single line of HTML.

## What this skill does

Builds a single-page HTML mockup of what a remodeling contractor's new site could look like. This is used as the "AFTER" image in a grader report. Jennifer screenshots it and embeds it manually.

## How to invoke

Jennifer will say something like:
> "Read skills/mini-site/SKILL.md then build a mockup for [Business Name]. Logo is at /clients/[slug]/logo.png. Screenshot is at /clients/[slug]/before.png. Hero photo is at /clients/[slug]/hero.jpg"

Use the business name, slug, and file paths she provides. Do not guess or invent them.

---

## Step 1 - Identify the brand palette

Read the logo file and the before screenshot she provides. Extract:
- **Primary color** - used in nav background and CTA buttons. Usually the dominant logo color.
- **Accent color** - used for highlights and borders. Usually a secondary logo color.
- **Background** - lightest color found. Default to #FAFAF8 if unclear.

**Muted accent rule:** If the extracted accent is a bright or saturated yellow-gold (hue 40-55, saturation above 70%), shift it to muted brass `#C9A96E`. Let the photography lead - do not let a loud accent color fight the hero image.

If the logo and screenshot have no detectable brand colors (e.g., just text on white), use these defaults:
- Primary: `#2C4A3E` (deep sage)
- Accent: `#C9A96E` (brass)
- Background: `#FAFAF8`

---

## Step 2 - Choose typography

Match the typography to the prospect's brand personality:

| Brand feel | Heading font | Body font |
|---|---|---|
| Traditional / established | Playfair Display | DM Sans |
| Modern / clean | Lora | Karla |
| Bold / direct | Fraunces | Karla |

Default to **Playfair Display + DM Sans** for most remodeling contractors. Load both from Google Fonts.

---

## Step 3 - Build the page

Use this exact section order. Do not skip sections or reorder them.

### Section order (mandatory)

1. **Info bar** - one line at the very top. Address, hours, phone. Small text, muted background.
2. **Nav** - logo left, navigation links center, CTA button right. Sticky. Logo: `<img src="logo.png" alt="[Business Name]" style="height:44px; width:auto;" onerror="this.style.display='none'">`. Tell Jennifer to save their logo as `logo.png` in the same folder as the HTML.
3. **Hero** - full-bleed project photo as background. Use the hero image she provides. Gradient overlay: `linear-gradient(to top, rgba(10,20,40,0.90) 0%, rgba(10,20,40,0.40) 50%, transparent 100%)`. White headline (Playfair/Lora), white subhead, two CTA buttons (primary filled, secondary outlined).
4. **Trust bar** - horizontal strip with 3-4 trust signals: CSLB license number, years in business, number of projects, a quality statement. Icons as simple SVG or Unicode symbols only - no emoji.
5. **Pain section** - headline like "Most homeowners run into the same problems." Four pain points in a 2x2 grid. Each has a short label and one sentence. End with a callout box: "There is a better way."
6. **Services** - headline, then 6 cards in a 3x2 grid. Common services: Kitchen Remodeling, Bathroom Remodeling, ADU / In-Law Suite, Room Addition, Whole-Home Renovation, Outdoor Living. Use the prospect's actual services if known.
7. **Process** - "How it works." Four numbered steps in a horizontal row: Free Consultation, Design & Planning, Expert Build, Final Walkthrough. One sentence each.
8. **Results / Reviews** - 2-4 testimonial cards. Use placeholder names and realistic copy. Format: quote, name, city, project type. Do not fabricate specific details like project cost or address.
9. **Mid CTA** - full-width band in primary color. Bold headline. One CTA button.
10. **Service areas** - "We serve homeowners across [region]." City names as pill badges. Use the cities from the lead's geography.
11. **Final CTA** - simple section, headline, short copy, one button. Above the footer.
12. **Footer** - logo, tagline, nav links, phone, email, license number, copyright. Background: dark (near-black or deep primary).

---

## Step 4 - Copy rules

- Headline style: short, direct, benefit-led. "Kitchen remodels that finish on time." Not "Welcome to our website."
- No em dashes anywhere. Use plain hyphens or rewrite.
- No emoji anywhere. Use typographic markers: thin rules (2px solid), numbered lists, a simple `*` or `-` accent if needed.
- Do not mention RemodelerRank anywhere in the mockup.
- Do not use the prospect's real reviews - use placeholder copy.
- Do not invent specific claims (awards, exact years in business) unless Jennifer provides them.

---

## Step 5 - Save location

Save to:
```
/clients/[business-slug]/mockup/index.html
```

where `[business-slug]` is the business name lowercased with spaces replaced by hyphens. Example: Urban Edge Construction -> `urban-edge-construction`.

---

## Step 6 - Tell Jennifer what to do next

After generating, say exactly this:

> Open `/clients/[slug]/mockup/index.html` in Chrome. Set the window to 1280px wide. Screenshot the top 900px. Drag the screenshot back into this chat and I will embed it in the grader report.

---

## What NOT to do

- Do not deploy this to Netlify or any public URL. Mockups stay local.
- Do not attempt to screenshot the page yourself.
- Do not use PDFKit or any PDF library.
- Do not reference the grader report template - this skill outputs only the mockup HTML.
- Do not add a "powered by" or agency footer to the mockup.
- Do not use frameworks (React, Vue, etc.) - vanilla HTML, CSS, and minimal JS only.
