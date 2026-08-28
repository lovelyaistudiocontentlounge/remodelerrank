# Coda Construction Website - Build Log

Running record of the build, decisions, and sign-offs. One entry per working session.
This doubles as the reusable template for future client website builds.

## Plan (agreed 2026-07-06)

- Goal of round one: a design-approved single home page to win the owner's buy-in.
- Approach: build ONE home page now with the full nav header showing every planned
  page (Services, Portfolio, About, Reviews, Contact) as links, but do not build those
  pages out yet. Approve the design, then build the rest.
- Site is replacing a live WordPress site: preserve URLs, build a redirect map, back up
  and switch at launch. Brand gets a refresh (owner's call), starting from his real
  crimson/brass logo palette.
- Discovery: mostly consolidation, we already have most facts.

## Phases

0. Gather + audit (DONE 2026-07-06)
1. Architecture + home page copy (in Coda voice, Builder Funnel structure)
2. Build single home page + full nav shell (buy-in artifact)
3. Design approval gate (owner sign-off)
4. Build out remaining pages + SEO layer (seo-build)
5. Pre-launch checklist + finalize redirect map + backup
6. Launch + platform buildout (client-deliverable-system phase 3)

## Log

- 2026-07-06 | Phase 0 complete. Audited live site (curl; WebFetch was 403-blocked).
  Site is WordPress theme-hollow. Extracted verified facts to DISCOVERY.md: CSLB
  #949820, founded 2010, Dublin CA 94568, phone 925-785-6367, legal name Coda
  Construction Inc, owner likely E. Torrez, Facebook confirmed. Wrote SITE-AUDIT.md
  with 10-page URL inventory, SEO-fluff assessment (pages 5/6/7 are thin duplicate
  keyword pages), and a draft redirect map (finalize after Search Console data).
  Confirmed the existing mockup is a refreshed Builder Funnel in his brand - a strong
  starting point for the buy-in page. Flagged 9 gaps for the owner, including that the
  mockup's testimonials are fabricated placeholders and must not ship.

- 2026-07-06 | Gaps update. Owner confirmed Elias Torrez. Branded email
  info@coda-construction.com (retire the comcast address). Business is service-area
  (home office) so no public street address; GBP set as service-area, schema uses
  areaServed. Owner photo available in the graded set (confirm which frame). Search
  Console access likely available to finalize redirects.

- 2026-07-06 | Reviews + portfolio. 4 real reviews captured verbatim in REVIEWS.md
  (Houzz/Yelp), replacing the fabricated placeholders. Houzz profile URL recorded.
  Royal Oaks confirmed a real Coda build by Elias - promotes it to hero/portfolio, and
  Elias is in the frame (owner headshot source). Search Console access blocked pending
  owner verification, so the redirect map stays draft; not a Phase 1 blocker. Phase 0
  is effectively closed; ready for Phase 1 (architecture + home copy).

- 2026-07-06 | Phase 1 complete. Positioning locked: honesty-first, owner-led by Elias,
  craftsmanship shown through photos (deliberately not luxury-forward, to attract
  easier honest-value clients). Wrote COPY-home.md: full sitemap + nav shell, and
  complete home-page copy in Elias's voice using real reviews and CSLB #949820. Added
  two sections vs the mockup: a craftsmanship/portfolio strip and an owner-led "About
  Elias" band. Ready for Phase 2 (build the single home page + nav shell).

- 2026-07-06 | Refinements. Address: keep showing it for NAP consistency (already
  public everywhere); corrected the earlier hide-it note; full privacy conversion only
  if Elias asks. Service area leads with Dublin/Pleasanton/Livermore (full list
  pending). Owner photo confirmed: full Royal Oaks 028 frame as an environmental
  portrait (Elias in the kitchen he built). Copy doc updated accordingly.

- 2026-07-06 | Phase 2 complete. Built index.html (single home page + full nav shell)
  in his crimson/brass brand, mobile-mandatory. Processed real photos into
  website/images/ (hero = Royal Oaks 012, 3-shot work strip from Royal Oaks + Coda
  Dublin, Elias environmental portrait from RO 028). Real reviews, full NAP (8095 Aldea
  St), CSLB #949820, GeneralContractor JSON-LD schema with address + areaServed +
  sameAs. Verified render via headless Chrome at desktop and mobile. This is the
  design-approval artifact for Phase 3.

- 2026-07-06 | Graded the page and applied upgrades. Confirmed by Jennifer: ALL photos
  in the test folder are Coda-built (so Heather Lund baths are usable). Upgrades: work
  strip expanded to 4 with a real bathroom (Heather Lund) for range; added a working
  estimate form (Netlify Forms, name/phone/email/project/message) as the real #contact
  target; fixed all dead CTAs to drive to the form; built the FAQ shell (3 real answers,
  3 placeholders). Added thank-you.html for the form redirect. Re-verified render.
  Next: hosted preview link on Netlify (CLI installed, needs `netlify login`).

- 2026-07-06 | Mobile-hardened + deployed. Added a sticky mobile call/estimate bar and
  nav/trust-bar font fixes. Diagnosed apparent "mobile overflow" as a headless-capture
  artifact (Chrome clamps window to 500px min); real overflow was only .hero-bg, which
  is clipped by overflow:hidden. Deployed to Netlify: https://coda-construction-eastbay-preview.netlify.app
  (standalone site, account hilovely, id 5985d87c-1280-497f-9103-e2439080d4ee). Fixed
  form backend: site had ignore_html_forms=true; set false + redeployed; form now
  detected and POST returns 200 (one TEST submission in dashboard to delete). Added
  X-Robots-Tag noindex + robots.txt disallow so the preview does not compete with his
  live site. All images, thank-you page, and form verified live.

- 2026-07-06 | Phase 3 gate: preview sent to Elias. PENDING his design feedback.

- 2026-07-06 | Drafted platform profile copy (PROFILES.md) while waiting on Elias: GBP
  (name, categories, 700-char description, services), Houzz About Us, Yelp
  (Specialties/History/Meet the Owner), Facebook, Instagram, plus other-directory
  checklist. Anchored to one canonical NAP block for consistency. Flagged placeholders:
  cost ranges, financing, Elias personal history, hours, address visibility, category
  confirmation, service-area list.

- 2026-07-07 | Elias feedback copy pass (copy only, site not yet rebuilt). Updated
  COPY-home.md, DISCOVERY.md, PROFILES.md. Changes: hours 8-5; no financing; removed ADU
  and Outdoor Living; "additions" reframed as "Room Expansions"; added Elias origin story
  to About (blue-collar family, woodworking, let down by a contractor); process reworked
  around "scope of work drives price"; trust bar and hero reworded; FAQ questions
  replaced with better ones; removed the form reassurance line; suggested a Custom
  Cabinetry/Woodworking service. Logged future Phase 2 (qualifying/component form) and
  Phase 3 (client estimate-builder software). Options for the subjective rewrites raised
  with Jennifer before the site rebuild.

- 2026-07-09 | About section reframed per Elias: lead with his corporate career
  (structure, process, organization, management, staying on task, listening) as the
  differentiator most contractors lack, THEN the family craft roots and woodworking.
  Removed the "growing up poor" segment. Kept the let-down-by-a-contractor origin and
  the scope-drives-price close. Updated COPY-home.md and COPY-FULL.md.

- 2026-07-09 | Saved new About draft (Jennifer/Elias, corporate-first, short-line
  rhythm) as the current pending version in COPY-home.md + COPY-FULL.md. Created
  PICKUP.md as the session handoff - read it first next session. Chat being closed.

## Open decisions / waiting on owner

- Real reviews, exact street address, branded email, owner full name, other platform
  URLs, Search Console access (to finalize redirects). See DISCOVERY.md gaps list.
