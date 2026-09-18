# PICKUP - Coda Construction website (session handoff)

Last worked: 2026-07-09. Read this first next session, then BUILD-LOG.md (full history),
DISCOVERY.md (verified facts), COPY-FULL.md (all site copy for review).

## Where we are

Phase 0 (audit/discovery), Phase 1 (copy), and Phase 2 (single home page + nav shell)
are DONE. We are at the Phase 3 gate: Elias is reviewing. He has given rounds of copy
feedback that are folded into the copy docs but NOT yet into the live site.

IMPORTANT: the live preview still shows the ORIGINAL copy. All the recent revisions
(services, scope-of-price, About story, hours, FAQ, etc.) live only in COPY-home.md /
COPY-FULL.md. The site must be rebuilt from the finalized copy and redeployed.

Live preview: https://coda-construction-eastbay-preview.netlify.app
Netlify site id: 5985d87c-1280-497f-9103-e2439080d4ee  (account slug: hilovely)
Redeploy: `netlify deploy --dir=clients/coda-construction/website --prod --site 5985d87c-1280-497f-9103-e2439080d4ee`
Note: site has ignore_html_forms=false (form detection ON); noindex header + robots.txt
disallow are in place (preview should stay noindex).

## THE immediate next step

1. Get the copy-checker results from Jennifer + her final calls on the open copy items
   (below). Lock COPY-FULL.md.
2. Rebuild index.html from the finalized copy (the current index.html still has old copy
   and 6 services incl. ADU/Outdoor - must be updated to the new 4-5 services, new About,
   new process, new FAQ, remove the form "No obligation..." line, hours 8-5, footer
   tagline already conceptually fixed in COPY-FULL).
3. Reprocess service/photo needs if services changed (e.g., if woodworking card added).
4. Redeploy to the same Netlify site. Re-verify mobile (remember Chrome headless clamps
   to 500px min - use the true-viewport method or trust the mobile CSS).

## Open copy decisions (waiting on Jennifer/Elias)

- Copy-checker results - pending, fold in edits.
- 3 word picks - currently using recommended: hero "gives you an honest price built on
  the real scope of the work"; hero "builds the kind of quality that makes your house
  feel like home"; About headline "The owner is the one on your job site." Confirm/override.
- About section - NEW pending draft (2026-07-09, corporate-first, in COPY-home.md and
  COPY-FULL.md). Approve or tune. May not need a separate headline (draft self-opens).
- Custom Cabinetry & Woodworking service card - keep or cut (ties to his story; recommend keep).
- FAQ timelines answer - real placeholder, need durations for kitchen/bath/whole-home.
- "Same day" in Contact body - keep or drop (Elias cut it from the form line).
- Final service-area city list.

## Open (technical / launch)

- Google Search Console: Elias must verify ownership -> finalize redirect map (SITE-AUDIT.md
  has the draft). Needed to protect ranking at cutover (replacing a live WordPress site).
- Delete the test form submission ("TEST - safe to delete") in Netlify Forms.
- Address visibility: default = show it (NAP consistency). Flip to service-area only if
  Elias wants privacy - then do it everywhere, not just the site.
- Form notifications currently go to account email; point where desired at launch.

## Then (build-out, after design approval)

- Phase 4: build Services / Portfolio / About / Contact pages (nav currently anchors only).
- Finalize redirect map, back up, DNS cutover, then publish platform profiles (PROFILES.md).
- Roadmap: Phase 2 qualifying/component intake form; Phase 3 client estimate-builder software.

## Locked facts (do not re-litigate)

- NAP: Coda Construction Inc, 8095 Aldea Street, Dublin CA 94568, (925) 785-6367,
  info@coda-construction.com, CSLB #949820, founded 2010, hours Mon-Fri 8-5, no financing.
- Owner: Elias Torrez, on every job. Photo: full frame JBP_HLID_RoyalOaks_9.14.23.028.jpg.
- ALL photos in the ~/Downloads/test grade set are Coda-built (Royal Oaks + Heather Lund
  + Coda Dublin + Elias Kitchen + phone projects). Royal Oaks + Heather Lund baths usable.
- Positioning: honesty-first, owner-led, scope-of-work drives price, corporate discipline
  plus real craftsmanship. NOT luxury-forward (attract easier honest-value clients).
- Brand: crimson #7D1E24 + brass #C9A96E, Playfair Display + DM Sans (from his logo).
- Services: Kitchen, Bathroom, Room Expansions (not additions), Whole-Home; woodworking TBD.
  REMOVED: ADU, Outdoor Living.
- Reviews: 4 real from Houzz (REVIEWS.md). Never ship the old fabricated mockup reviews.
- Real photos already web-sized in website/images/ (hero, work-1..4, elias, logo).

## File map (clients/coda-construction/website/)

- PICKUP.md - this file
- BUILD-LOG.md - full chronological history + decisions
- DISCOVERY.md - verified business facts + gaps
- SITE-AUDIT.md - old-site URL inventory + draft redirect map
- REVIEWS.md - real testimonials verbatim
- COPY-home.md - annotated home copy (sections + notes)
- COPY-FULL.md - clean full copy for the copy checker
- PROFILES.md - GBP/Houzz/Yelp/Facebook/etc profile copy
- index.html + images/ + thank-you.html + _headers + robots.txt - the deployed site

## Parked (separate thread, not blocking Coda)

Portfolio Recovery Factory is built and committed (skills/portfolio-recovery/ +
scripts/photo-factory/). Open there: the shower-door image needs a corrected MASKED
regeneration (Jennifer runs it in Gemini from the generation card, not a full-frame
regenerate); grader awaits her full photo set when she drops it.
