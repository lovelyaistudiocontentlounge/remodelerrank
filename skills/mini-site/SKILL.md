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
2. **Nav** - logo left, navigation links center, CTA button right. Sticky. Logo: `<img src="logo.svg" alt="[Business Name]" style="height:44px; width:auto;" onerror="this.style.display='none'">`. SVG is the preferred format - tell Jennifer to save their logo as `logo.svg` in the same folder as the HTML. If only a PNG/JPG is available, use `logo.png` instead and note the format in your reply.
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

## Step 3b - Mobile Requirements (MANDATORY)

**Every mockup must work on a 375px wide phone screen.** Contractors and their homeowner clients live on mobile. A mockup that only looks good at 1280px is not finished.

Include these media queries at the end of every `<style>` block:

```css
@media (max-width: 768px) {
  /* Info bar - hide on mobile, too cluttered */
  .info-bar { display: none; }

  /* Nav - hide desktop links, keep logo and CTA only */
  .nav { padding: 0 20px; height: 64px; }
  .nav-links { display: none; }
  .nav-cta { font-size: 13px; padding: 9px 16px; }

  /* Hero - shorter, tighter copy */
  .hero { height: 480px; }
  .hero-content { padding: 0 24px 40px; max-width: 100%; }
  .hero h1 { font-size: 32px; }
  .hero-sub { font-size: 15px; }
  .hero-btns { flex-direction: column; gap: 10px; }
  .btn-primary, .btn-outline { width: 100%; text-align: center; padding: 14px 20px; }

  /* Trust bar - wrap into 2x2 */
  .trust-bar { padding: 20px; gap: 16px; justify-content: center; }
  .trust-divider { display: none; }
  .trust-item { min-width: 44%; }

  /* All sections - tighter padding */
  .section { padding: 48px 24px; }
  .section-title { font-size: 28px; }

  /* All grids - single column */
  .pain-grid { grid-template-columns: 1fr; }
  .services-grid { grid-template-columns: 1fr; }
  .reviews-grid { grid-template-columns: 1fr; }
  .wins-grid { grid-template-columns: 1fr; }
  .comparison-grid { grid-template-columns: 1fr; }

  /* Process - 2 columns on mobile */
  .process-steps { grid-template-columns: 1fr 1fr; }
  .process-step { border-left: none; border-top: 1px solid rgba(255,255,255,0.12); padding: 20px 16px; }
  .process-step:first-child { border-top: none; }

  /* Mid CTA */
  .mid-cta { padding: 48px 24px; }
  .mid-cta h2 { font-size: 26px; }
  .btn-white { width: 100%; text-align: center; display: block; }

  /* Areas - smaller pills */
  .area-pill { font-size: 12px; padding: 6px 14px; }

  /* Final CTA - stack vertically */
  .final-cta-section { flex-direction: column; padding: 48px 24px; text-align: center; }
  .final-cta-copy h2 { font-size: 26px; }
  .final-cta-phone { font-size: 22px; }
  .btn-primary { width: 100%; text-align: center; }

  /* Footer - single column */
  .footer { padding: 40px 24px 24px; }
  .footer-top { grid-template-columns: 1fr; gap: 28px; }
  .footer-bottom { flex-direction: column; gap: 6px; text-align: center; }

  /* Pain callout - stack */
  .pain-callout { flex-direction: column; text-align: center; }
  .pain-callout a { width: 100%; text-align: center; padding: 12px 20px; display: block; }
}
```

**Tap target rule:** All buttons and links must be at least 44px tall on mobile. Never make a CTA button smaller than this.

**Test at 375px** (iPhone SE - the smallest common screen) before reporting the mockup as done.

---

## Step 4 - Copy rules

- Headline style: short, direct, benefit-led. "Kitchen remodels that finish on time." Not "Welcome to our website."
- No em dashes anywhere. Use plain hyphens or rewrite.
- No emoji anywhere. Use typographic markers: thin rules (2px solid), numbered lists, a simple `*` or `-` accent if needed.
- Do not mention RemodelerRank anywhere in the mockup.
- Do not use the prospect's real reviews - use placeholder copy.
- Do not invent specific claims (awards, exact years in business) unless Jennifer provides them.

Every section of copy must address why it matters to the homeowner OR why it matters to the contractor owner who hired us. For contractor clients, use the five pain points documented in /skills/ad-creative/SKILL.md (Contractor Pain Language section) to inform every headline, subhead, and CTA. Never describe a feature without naming what it costs them if that feature is missing.

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
