# Handoff - Contractor Portfolio Project

Written 2026-09-12/13 to close out a very long session and start fresh.
Paste this into a new chat, or just point Claude at this file - it covers
everything open across the portfolio project as of right now.

Source brief: `CONTENT/contractor-portfolio-lookbook-master-brief.md`
(website repo). Architecture + backlog: `portfolio-project-backlog.md` (this
repo, the pipeline one) - that file has the full history, this doc is the
shorter "what's open right now" version.

---

## The three clients, where each one stands

### SW Custom Cabinets - furthest along
- Real, high-end project photography confirmed (24 real Instagram photos,
  verified with Jennifer after an earlier mix-up with the wrong batch - see
  "Lessons" below)
- Real logo pulled from their live site, used throughout
- Domain decision made: sw-cabinets.com stays, 702kitchens.com retires (not
  yet executed - still needs the actual redirect handled)
- Mockup built: `clients/sw-custom-cabinets/mockup/index.html`. Hero is a
  4-scene GSAP scroll sequence (photos fly in from 4 directions around a
  persistent central logo), built by reverse-engineering
  medallioncabinetry.com's real mechanism (see
  `design-territories/medallion-reference-analysis.md`). Jennifer confirmed
  this is close enough - not worth more scroll-timing iteration.
- Hero copy: "Crafted for how you live." (her pick from 3 options after she
  rejected an earlier line - see Lessons)
- Alt hero version (the earlier "images sweep away" build, since corrected)
  saved at `mockup/index-alt-sweep-away.html`, kept per her request, not
  deleted
- Published for sharing: https://claude.ai/code/artifact/86b70401-5a49-4460-9d7f-bc4877886fe8
- **Open:** the service-area city list in the footer is a geographic guess
  (Livermore/Pleasanton/Dublin/San Ramon/Danville/Walnut Creek), not
  confirmed with Steve. The logo/typography tension (his real logo is
  ornate/traditional, the site direction is modern-minimal) is flagged in
  Brand DNA but not resolved.

### AF Woodworker - mockup built, has a known problem
- Pivoted from 3 abstract territories to a Fabuwood-based direction
  ("Precision, Made Modern") after Jennifer named fabuwood.com as a
  reference - see `design-territories/fabuwood-reference-analysis.md`
- **No real logo exists** for this business (checked their live Squarespace
  site directly) - nav/hero use clean wordmark typography instead of a
  fabricated mark
- 9 real photos confirmed from @af_woodworker, copied into
  `clients/af-woodworker/photos/raw/`
- Mockup built: `clients/af-woodworker/mockup/index.html`. Static hero
  (no scroll sequence, matches Fabuwood's simpler carousel-based motion)
- Published: https://claude.ai/code/artifact/b2b87a87-7465-484d-b335-5214a3b0b234
- **Anti-cloning failure fixed (2026-09-13):** the `.work-grid`, testimonial
  card, and section-rhythm CSS that were copy-pasted from SW have been
  redesigned fresh (12-col spec-plate grid with corner-cut accents, flush
  bordered testimonial rows, left-set statement rule), grounded in the
  Fabuwood reference's diamond icon mark. Full detail in
  `portfolio-project-backlog.md`'s new "AF Woodworker anti-cloning failure
  fixed" entry. Still needs a by-eye check in a browser (not yet visually
  confirmed this session).
- **Caught mid-fix:** the published Artifact had been lightly edited directly
  on the page since the mockup was first built (title shortened to "AF
  Woodworker", the draft-flag banner softened to "Early concept draft for
  review... Not a live site", presumably Jennifer making it shareable) -
  the local repo file never had that edit. The first republish of the
  anti-cloning fix would have silently reverted both; caught by diffing
  a pre-publish read against the local file, and both text changes were
  folded into the local file and the local file is now the source of truth
  for this page. Nothing else differed between the two versions (checked
  contact info, hero copy, testimonials, CSLB number - all matched).

### Arnold + Egan - full build done 2026-09-15, see backlog for detail
- Real business: Arnold & Egan Manufacturing Co., founded 1937, ~89 years in
  business - a genuinely different profile from the other two (SW is 25
  years, AF is 3-4 years)
- **Has a real logo** - found embedded in one of the saved marketing photos
  (`ae-residential-kitchen-collage-with-logo.jpg`), not yet extracted as a
  clean standalone file
- Jennifer flagged a specific photo (`ae-lattice-wood-screen-detail.jpg` - a
  diamond-lattice walnut screen) as signature-element inspiration. Real
  finding worth acting on: its geometry (diamond grid) actually rhymes with
  the real logo's geometry (circle/square/crossing diagonals) - a genuine
  alignment, flagged in Brand DNA as the strongest direction to build from
- 63 real photos + a screen recording confirmed as genuine Arnold + Egan
  work (all from their Instagram), 8 selected and copied into
  `clients/arnold-egan/photos/raw/` so far - the other ~55 haven't been
  reviewed yet, there may be stronger hero candidates
- Audit + Brand DNA done (`clients/arnold-egan/audit/audit-dossier.md`,
  `clients/arnold-egan/brand-dna/brand-dna.md`) - **this is the only client
  where the audit is genuinely incomplete**: their live site
  (arnoldandegan.com/about) has not been read directly yet, so voice and
  real brand colors are still provisional, not confirmed
- **Nothing built yet** - no design territories, no mockup. This is where
  the next session should pick up, after finishing the digital footprint
  audit properly (unlike AF/SW, this one's audit was left intentionally
  incomplete given session length, not because it was actually finished)

## Public portfolio wrapper

`work/index.html` in the website repo (`Desktop/RemodelerRank/`, NOT this
pipeline repo). RR's own real sage palette + Lora/Karla pulled from their
live homepage. Currently shows SW (Project 001) and AF (Project 002) as
cards linking to their published Artifact drafts. Arnold + Egan isn't on it
yet - add once it has a real mockup.

Did NOT touch or repurpose `clients/portfolio/index.html` in this repo -
that's a different asset (Jennifer's own "about my decade in marketing" bio
page), confirmed early in the project and never revisited.

A local preview server may still be running on port 8934 for viewing the
wrapper page's root-relative image paths correctly (they don't resolve via
plain `file://`). Kill it if needed: `lsof -ti:8934 | xargs kill`. Restart
with `cd /Users/jenniferrocha/Desktop/remodelerrank && python3 -m http.server 8934`.

## Lessons from this session, worth carrying forward

1. **Verify photo/asset sources before using them, every time.** Two real
   incidents: SW's first photo batch turned out to be raw shop-supplier
   material, not SW's own finished work - caught only because Jennifer said
   "those images are not correct" after they were already used. After that,
   both AF's and Arnold + Egan's photo batches were explicitly confirmed
   with her before use. Keep doing this - don't skip the confirmation step
   because a folder name looks right.

2. **Run the actual anti-cloning test, don't just claim it passes.** AF's
   build failed it (see above) because CSS was reused as a starting
   template. When building Arnold + Egan (or revising AF), design each
   client's grid/card/section CSS from scratch, or at minimum audit for
   copy-pasted class names before calling it done.

3. **Don't guess twice at subjective creative copy.** AF's original headline
   ("One name. Real work.") was rejected outright. Rather than guess again
   blind, the fix both times was either (a) using something real and
   un-inventable instead (the client's actual logo/name) or (b) presenting 3
   concrete options and letting Jennifer pick. Both worked well. Prefer this
   over repeated blind guessing on tone/copy calls specifically - technical
   fixes (font, color, layout mechanics) don't need the same caution.

4. **Reference sites sometimes need real reverse-engineering, not a
   paraphrase.** The Medallion hero required pulling raw page source (GSAP
   timeline code) to get the actual mechanism right - a text description
   from WebFetch alone got the sequence backwards on the first attempt.
   When a reference site has real motion/interaction worth borrowing, go
   get the real code if it's accessible (view-source, curl, Wayback Machine
   if blocked).

5. **Manufacturer reference sites (Medallion, Fabuwood) always have a
   product-tier catalog structure that must NOT be copied** - none of these
   three clients sell standardized lines through dealers, they all do
   bespoke/project-based work. This will come up again if more manufacturer
   sites get used as references.

## Suggested next steps, in rough priority order

1. ~~Fix AF Woodworker's anti-cloning failure~~ - done 2026-09-13.
2. ~~Finish Arnold + Egan's audit, Design Territories, logo, photo review,
   mockup~~ - done 2026-09-15, full detail in the backlog's "Arnold + Egan:
   full build" entry. Published: https://claude.ai/code/artifact/7a2cc35a-d39b-48eb-8ad5-99b7665bc8b9
3. ~~Add Arnold + Egan to the portfolio wrapper~~ - done 2026-09-15 (Project
   003), also fixed AF's card image on the wrapper (same broken
   play-button screenshot, replaced).
4. AF Woodworker's own photos also got a real fix 2026-09-15: the old
   Instagram reel screenshots all had a play-button icon burned into the
   frame (unusable, not just low-res) - Jennifer spotted real photos on
   afwoodworker.com's own Portfolio page, all 6 used photos replaced with
   real site exports. Along the way, found that BOTH AF's and (presumably)
   SW's published Artifact links never actually rendered images at all -
   relative `../photos/raw/...` paths don't resolve on a hosted Artifact,
   and no files were ever attached at publish time. Fixed for AF; **SW's
   mockup still needs the same check and fix, not yet done.**
5. SW's business context changed materially 2026-09-14: he's looking to
   exit in about 5 years and the business isn't ready. Reframes SW from a
   "two weak websites" case study into an exit-readiness one - noted in
   `sw-custom-cabinets/audit/audit-dossier.md`, worth keeping in mind for
   how any real proposal to Steve eventually gets framed.
6. Handle SW's actual domain retirement (702kitchens.com) and confirm the
   real service-area city list with Steve
7. Still fully open from the original backlog: the physical lookbook and
   the iPad presentation pieces of the master brief - nothing built there yet
