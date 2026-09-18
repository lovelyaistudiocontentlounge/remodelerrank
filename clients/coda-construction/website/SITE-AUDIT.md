# Coda Construction - Current Site Audit + Redirect Map

Last updated: 2026-07-06. Neutral audit of the LIVE site for the rebuild. This
replaces the old prospecting grader, which was a sales document and should not be
trusted as a build spec.

## Platform

WordPress, theme "hollow" (a builder/agency theme). PixelYourSite plugin with a
Facebook pixel installed. A "/website-design/" page is an agency credit link, not a
service. Favicon and OG tags present.

## Page / URL inventory (live)

| # | URL | Purpose | Assessment |
|---|---|---|---|
| 1 | / | Home | H1 is generic "Residential Construction & Remodeling" |
| 2 | /kitchen-remodeling-contractor/ | Kitchen service | keep, strong keyword |
| 3 | /bathroom-remodeling-contractor/ | Bathroom service | keep, strong keyword |
| 4 | /custom-home-additions/ | Additions | keep |
| 5 | /interior-remodeling-contractor/ | Interior/whole-home | overlaps 6 and 7 |
| 6 | /home-improvement-contractor/ | Generic | thin, keyword-stuffed |
| 7 | /home-remodeling-company/ | Generic | thin, keyword-stuffed |
| 8 | /contact/ | Contact | keep |
| 9 | /contractor-faqs-page/ | FAQs | keep, clean the slug |
| 10 | /website-design/ | Agency credit | remove |

## SEO-fluff assessment (confirms owner's read)

- Pages 5, 6, 7 are near-duplicate keyword-slug pages targeting overlapping terms
  ("home improvement contractor", "interior remodeling contractor", "home remodeling
  company"). Thin, overlapping content that likely competes with itself (keyword
  cannibalization) rather than helping.
- The home H1 "Residential Construction & Remodeling" is generic and repeated. No
  clear value proposition, no differentiation, no real proof above the fold.
- Slugs are keyword-stuffed rather than clean.
- Verdict: consolidate to a lean, intent-clear set. Keep the pages that carry real
  keyword value (kitchen, bathroom, additions), fold the thin pages into stronger
  ones, and rebuild the home page around trust and proof.

## Proposed redirect map (draft - finalize after Search Console data)

Golden Rule 6: preserve URL structure and 301 everything that changes so ranking
survives. DO NOT finalize until we see which pages actually rank (gap #7 in
DISCOVERY). Draft mapping:

| Old URL | New URL | Type |
|---|---|---|
| / | / | keep |
| /kitchen-remodeling-contractor/ | /services/kitchen-remodeling/ | 301 |
| /bathroom-remodeling-contractor/ | /services/bathroom-remodeling/ | 301 |
| /custom-home-additions/ | /services/room-additions/ | 301 |
| /interior-remodeling-contractor/ | /services/whole-home-remodeling/ | 301 |
| /home-improvement-contractor/ | /services/ | 301 consolidate |
| /home-remodeling-company/ | /services/ | 301 consolidate |
| /contractor-faqs-page/ | /faqs/ | 301 |
| /contact/ | /contact/ | keep |
| /website-design/ | / | 301 remove |

Note: keeping the exact high-value slugs (kitchen/bathroom) is an option if Search
Console shows they rank; the /services/ prefix is cleaner but only worth the redirect
cost if equity is protected. Decide with data.

## Migration constraints

- Site is live: build the new site separately, switch at launch, back up first
  (Golden Rule 1). Never edit the live WordPress during the build.
- Facebook pixel is installed; carry the tracking over or replace with the
  RemodelerRank GA4 + Ads tag setup.
- WordPress means the domain/DNS is elsewhere; confirm registrar and host access at
  launch planning (do not touch until then).
