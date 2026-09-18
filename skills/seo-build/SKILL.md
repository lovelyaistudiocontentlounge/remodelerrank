# SEO Build Skill

Post-approval SEO layer. Runs after the site is built and client-approved, before DNS switch.

This skill does not replace the pre-launch checklist (pre-launch/SKILL.md). It runs first, feeding into it. Pre-launch verifies. This skill builds.

---

## When This Triggers

Jennifer will say something like:
> "Run seo-build for [Business Name]. Site is at /clients/[slug]/."

Read the client data collection doc first. Every optimization in this skill must use verified NAP data - never retype from memory.

---

## Step 1 - LocalBusiness Schema

Add to the `<head>` of the homepage (and any page that has contact info). Type is JSON-LD.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "[Exact business name from NAP doc]",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "[Street address]",
    "addressLocality": "[City]",
    "addressRegion": "CA",
    "postalCode": "[ZIP]",
    "addressCountry": "US"
  },
  "telephone": "[Phone in +1XXXXXXXXXX format]",
  "url": "[Final site URL]",
  "image": "[URL to hero image or logo]",
  "description": "[150-200 char description - primary service + city]",
  "areaServed": [
    "[City 1]", "[City 2]", "[County] County"
  ],
  "serviceType": [
    "[Service 1]", "[Service 2]"
  ],
  "hasCredential": {
    "@type": "EducationalOccupationalCredential",
    "credentialCategory": "license",
    "name": "CSLB License [number]"
  },
  "priceRange": "$$-$$$"
}
</script>
```

Required fields: name, address, telephone, url, areaServed.
Validate at: schema.org/validator - fix all errors before moving on.

---

## Step 2 - Meta Titles

Formula: `[Primary Keyword] in [City], CA | [Business Name]`

- Max 60 characters - count carefully
- Primary keyword first (that is what Google reads first)
- City in the title (critical for local)
- Business name at the end

Examples:
- `Kitchen Remodeling in Walnut Creek, CA | Apex Renovation`
- `Bathroom Remodeling Contractor - Danville, CA | Urban Edge`
- `ADU Contractor in Concord, CA | Bay Area Remodeling Co.`

If the title goes over 60 characters, drop "in" or abbreviate the business name, but never drop the city or primary keyword.

### Service Pages

Each service page gets its own unique meta title:
- `Kitchen Remodeling in [City], CA | [Business Name]`
- `Bathroom Remodeling in [City], CA | [Business Name]`
- `ADU Contractor in [City], CA | [Business Name]`

---

## Step 3 - Meta Descriptions

Formula: `[City] homeowners trust [Business Name] for [service]. [Differentiator]. Free estimate. Call [phone] or book online.`

- 140-160 characters
- Includes city, primary service, differentiator, CTA
- Do not keyword-stuff. Write for the human first.

Examples:
- `Walnut Creek homeowners trust Apex Renovation for kitchen and bathroom remodels. Licensed, insured, CSLB #1234567. Free estimate - call 925-555-1234.`
- `Bay Area Remodeling Co. builds ADUs and room additions in Concord and Contra Costa County. Over 200 projects completed. Book a free consult online.`

---

## Step 4 - Header Tag Hierarchy

### Homepage H1

One H1 per page. Contains the primary keyword and city.

Good: `Kitchen and Bathroom Remodeling in Walnut Creek`
Good: `Northern California Remodeling Contractor - Licensed and Local`
Bad: `Welcome to Our Website`
Bad: `Quality Work You Can Trust` (no keyword, no city)

### H2 and H3

H2: section headings (Services, Our Process, Service Area, Reviews)
H3: subsection headings within sections (individual service names, individual process steps)

Do not skip levels (no H1 -> H3 with no H2 in between).

---

## Step 5 - Service Pages

Each major service gets its own page if the contractor offers 4 or more services.

Page structure per service:
1. H1: `[Service] in [City], CA`
2. Intro paragraph (2-3 sentences): what the service is, who it is for, why this contractor
3. What is included (bullet list, 4-6 items)
4. Project photos (minimum 2, with descriptive alt text)
5. Testimonial (1 real client quote)
6. FAQ section (3-4 questions, answer each in 2-4 sentences)
7. CTA (contact form or Calendly link)

Internal link from each service page back to the homepage and to 2-3 related service pages.

---

## Step 6 - Image Alt Text

Rule: describe what is in the image, include the location and type of project when relevant.

Good: `Completed kitchen remodel with white shaker cabinets and quartz countertops - Walnut Creek CA`
Good: `Master bathroom renovation with walk-in shower - Danville CA`
Bad: `kitchen.jpg`
Bad: `photo1`
Bad: `image of kitchen` (too vague)

All hero images, project photos, and portfolio images get descriptive alt text. Logo alt text is just the business name.

---

## Step 7 - Internal Linking

Minimum internal link structure:
- Homepage links to each major service page
- Each service page links back to homepage
- Each service page links to 2 related services
- Homepage links to the "About" or "Our Work" section if it exists as a separate page
- Footer links: Homepage, Services, Contact, License number page (if any)

Anchor text: use the keyword you want that page to rank for.
Good: `kitchen remodeling in Walnut Creek`
Bad: `click here` or `learn more`

---

## Step 8 - GBP Optimization (post-launch)

Run this after DNS is live and the new site URL is set in GBP.

1. Business description: 750 characters max. Lead with city and primary service. Include license number. No links, no promotional language ("best in the Bay Area").
2. Services: add every service from the site. Each gets a short description (1-2 sentences).
3. Photos: upload a minimum of 10. Include: logo, exterior of a project, 8+ finished project photos.
4. Posts: publish a "we launched" post with a project photo and the site link.
5. Q&A: seed 3-5 questions and answer them yourself. Common ones:
   - "Are you licensed and insured?" -> Yes, CSLB #XXXXXXX
   - "What areas do you serve?"
   - "How long does a kitchen remodel take?"

---

## Step 9 - City Landing Pages (Growth tier only)

For contractors targeting multiple cities, build a unique landing page per city beyond the primary.

Page structure (same as service pages but city-focused):
- H1: `[Primary Service] in [City], CA`
- Intro paragraph mentions the city and any local context (neighborhood, common project types)
- Project photos from that city if available
- Testimonial from a client in that city if available
- Same CTA as service pages

Do not duplicate content between city pages - each intro paragraph must be unique. 2-3 sentences is enough of a difference.

---

## Step 10 - Final SEO Check

Before handing to pre-launch/SKILL.md:

- [ ] LocalBusiness schema validates with zero errors at schema.org/validator
- [ ] Every page has a unique meta title under 60 characters
- [ ] Every page has a meta description between 140-160 characters
- [ ] Homepage H1 contains primary keyword and city
- [ ] All project photos have descriptive alt text
- [ ] Internal links are in place from homepage to service pages
- [ ] Sitemap.xml generated and includes all public pages
- [ ] No broken internal links

---

## What This Skill Does Not Cover

- GBP creation (covered in client-deliverable-system.md Phase 3)
- Citation building / directory listings (covered in client-deliverable-system.md Phase 3)
- Ongoing content (covered in content-calendar.md)
- Monthly reporting (monthly-report/SKILL.md - Session 10)
