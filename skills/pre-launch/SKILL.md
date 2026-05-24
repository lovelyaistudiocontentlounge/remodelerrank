# Pre-Launch Checklist Skill

Complete every item on this checklist before flipping DNS for any client site.

Not optional. Not "most of them." Every item. Check means verified, not assumed.

---

## How to Invoke

Jennifer will say something like:
> "Run the pre-launch checklist for [Business Name]. Site is at [staging URL]."

Work through each section in order. Mark each item as confirmed or flag it as blocked with the reason.

---

## Section 1 - Content Accuracy

1. Business name matches GBP and CSLB license exactly (not a nickname or abbreviation)
2. Phone number is correct and clickable on mobile (`tel:` link)
3. Address is correct and matches GBP - full street address, no PO Box on the site
4. Service area cities match what was agreed in data collection
5. Services listed match what the contractor actually offers
6. Hours (if shown) match GBP
7. All testimonials are from real clients or clearly marked as representative examples
8. License number is shown and correct
9. No placeholder copy remaining ("Lorem ipsum", "Add your text here", "[CLIENT NAME]", etc.)
10. Calendly or contact form works - test a submission

## Section 2 - Technical SEO

11. Meta title on homepage: `[Business Name] - [Primary Service] in [City], CA`
12. Meta description present, 140-160 characters, includes city and primary service
13. H1 on homepage contains the primary keyword (e.g., "Kitchen Remodeling in Walnut Creek")
14. Each page has a unique meta title and description
15. LocalBusiness schema installed on homepage - validate at schema.org/validator
    - Required: @type, name, address, telephone, url, areaServed
    - Add priceRange if known
16. Sitemap.xml exists at /sitemap.xml and references all public pages
17. Robots.txt exists at /robots.txt - confirm it does not block Googlebot
18. Google Analytics (GA4) installed and firing a pageview on homepage
19. Google Search Console property created - submit sitemap

## Section 3 - Performance

20. Lighthouse score on mobile >= 75 (run via Chrome DevTools or PageSpeed Insights)
21. All images are WebP and have explicit width/height attributes (prevents layout shift)
22. Hero image is preloaded (`<link rel="preload" as="image">`)
23. No render-blocking scripts in `<head>` (defer or async all non-critical JS)

## Section 4 - Mobile + Cross-Browser

24. Site tested on iPhone Safari - hero, nav, CTA button, contact form
25. Site tested on Android Chrome
26. Site tested on desktop Chrome and Safari
27. All buttons and links are tappable on mobile (minimum 44px touch target)
28. No horizontal scroll on any screen size

## Section 5 - Security + Domain

29. SSL certificate installed - site loads over HTTPS with no mixed-content warnings
30. HTTP -> HTTPS redirect confirmed (test by typing `http://` in the address bar)
31. www -> non-www (or reverse) redirect is consistent - pick one and redirect the other
32. Old URLs (if site had a previous version) redirect to equivalent new URLs
33. No broken internal links (run a crawl with a tool like Screaming Frog or Sitebulb)

## Section 6 - Branding

34. Favicon present and correct (not a generic browser icon)
35. OG tags set for social sharing: `og:title`, `og:description`, `og:image` (1200x630px)
36. Logo renders correctly on all pages - no stretched or pixelated versions

---

## After Launch (within 48 hours)

- Verify Google Search Console shows no crawl errors
- Confirm GBP website field is updated to the new URL
- Confirm all directory listings (Yelp, Houzz, Apple Maps, etc.) updated to new URL
- Check PageSpeed Insights one more time on the live domain (CDN/caching changes scores)

---

## Notes Field

For each flagged item, record the reason and the resolution so there is a record if it ever comes up again.

| # | Status | Note |
|---|---|---|
| | | |
