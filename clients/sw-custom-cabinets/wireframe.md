# Wireframe / Information Architecture - SW Custom Cabinets

Step 10 of the master brief's build workflow, done properly this time instead
of skipped. Built from the "One Name, Real Work" territory
(`design-territories/three-territories.md`), the Medallion reference
(`design-territories/medallion-reference-analysis.md`), and Brand DNA
(`brand-dna/brand-dna.md`). This governs the next build pass on
`mockup/index.html` - not a rebuild of what exists now, an addition and a
few copy fixes.

Status note: the hero's scroll mechanism has gone through two builds.

**Build 1** (sweep-away): images start visible in a collage, dark scrim
covers them, then they sweep off-screen in four directions as the scrim
clears to reveal the headline. Had two real bugs Jennifer caught: the scrim
sat on top of the photos the whole time instead of clearing early (they read
as muddy/dark almost the entire scroll), and everything fired as one
simultaneous move instead of staged beats. Saved as
`mockup/index-alt-sweep-away.html` per Jennifer's request, not deleted.

**Build 2** (current, `mockup/index.html`) - corrected after Jennifer sent 4
real screenshots of medallioncabinetry.com's actual sequence, broken into
scenes:
1. Full-bleed photo + dark shade + a copy line (the resting state, no scroll needed)
2. Photo fades to blank white, the real logo fades and rises in
3. Two photos fly IN from left and right at different speeds
4. Two more photos fly IN from top and bottom, completing a collage around
   the still-present logo, copy line, and CTA

Build 1 had the whole direction backwards (images present then swept away,
rather than starting off-screen and arriving). Build 2 matches Medallion's
real behavior: images ACCUMULATE around a persistent central logo, they
never disperse. This also resolved the headline problem - Jennifer rejected
"One name. Real work." (2026-09-11) as the on-screen copy; the real logo is
now the reveal payoff instead (scene 2), so no invented tagline is needed.
**Updated again (2026-09-11):** Jennifer liked Medallion's actual hero copy
treatment (elegant italic serif, warm color, one real "saying") and wanted
the same quality here, not a plain fact-line. Hero font now loads Cormorant
Garamond (italic) for the tagline, styled larger and in the wood-deep
accent color once it transitions in during scene 2. For the words
themselves, rather than guess a third time, gave Jennifer options grounded
in SW's real register (not Medallion's luxury-lifestyle tone, which
wouldn't fit a plain family-owned shop) - she picked **"Crafted for how you
live."** The earlier fact-line ("Family owned. Livermore, CA. Twenty-five
years.") was dropped from the hero as redundant, since Statement 1
immediately below already carries those facts in his own words.

Scroll timing: Jennifer confirmed Medallion's is still a little better-paced
but not worth continued iteration. Holding the current 4-scene timing as-is.

---

## Homepage, section by section

1. **Nav** (sticky) - wordmark, The Work / How It's Built / Start a Project, CTA. No change.

2. **Hero** - pinned scroll-reveal, four real project photos sweep apart to
   reveal the headline. Built. Holding as-is per Jennifer's note above.

3. **Statement 1** - "Servicing the construction industry for 25 years, all
   across the Bay Area." Real captured phrase, no change needed.

4. **Marquee** - continuous scroll strip of real project photos. Built, no
   change needed.

5. **Statement 2 - removed (2026-09-11).** Decision made: eliminate
   702kitchens.com, consolidate under SW Custom Cabinets / sw-cabinets.com.
   The two-domain history was only ever an internal consolidation problem,
   never something a homeowner needs to know about - the site does not
   mention it anywhere. Section removed from `mockup/index.html`; the page
   now flows Statement 1 directly into the Marquee, then into Project Types.

6. **NEW - Project Types** (this session's addition, replaces nothing,
   inserts between Statement 2 and The Work). Structurally borrowed from
   Medallion's "Product Lines by Medallion" section (four large cards in a
   row: Silver / Gold / Platinum / Frameless) - same visual device, different
   content. Medallion's cards sell configurable product tiers; SW's cards
   are **project types**, since that's what actually organizes his real work
   and what a visitor is actually looking for (I need a kitchen vs I need a
   vanity vs I need pantry storage).

   Proposed cards (5, one wider than Medallion's 4 to fit SW's real range):
   - **Kitchens** - hero photo: sw-kitchen-walnut-brass-sink.jpg
   - **Vanities & Baths** - hero photo: sw-vanity-reeded-dark-wood.jpg
   - **Pantries & Storage** - hero photo: sw-walkin-pantry-custom-bins.jpg
   - **Wine & Coffee Bars** - hero photo: sw-wine-bar-builtin-oak.jpg
   - **Custom Built-ins** - hero photo: sw-butlers-pantry-archway.jpg

   Each card: one full-bleed photo, a short label, no price/tier language
   anywhere (the whole point of dropping Medallion's tier model is that SW
   doesn't sell standardized options - each card should read as "see this
   kind of work," not "choose this package"). Clicking a card should filter
   or jump to that category within The Work section once there's a large
   enough photo library to actually filter - for now (limited photos) it can
   just anchor-scroll to #work.

7. **The Work** - asymmetric evidence gallery, built. Once Project Types
   exists above it, The Work becomes the fuller "see everything" gallery
   rather than the only place work is browsable - no structural change
   needed there, just less pressure on it to do the categorization job alone.

8. **NEW - Testimonials.** Three real, sourced BuildZoom quotes (Chris E.,
   Melissa W., Curtis A. - see `audit/audit-dossier.md` section on reviews),
   attributed and dated. Real evidence, not invented quotes.

9. **How It's Built** - craftsmanship statement + burl wood delivery photo. Built, no change.

10. **NEW - Guides ("From the Shop").** Ported from Jennifer's reference:
    Ridgecrest Designs' "The RD Edit" (ridgecrestdesigns.com/blog), a
    Pleasanton-based design-build firm, same region as SW. Not just a blog -
    a local-SEO/AEO content hub: neighborhood guides, cost guides, FAQ-format
    articles, each structured as question, honest direct answer, then detail.
    That structure maps directly onto this repo's own existing AEO Article
    Generator (`npm run aeo`, see CLAUDE.md) - same question-first,
    direct-answer format already built and used for RemodelerRank's own AEO
    site. Three placeholder card titles shown in the mockup (cost guide,
    design-process FAQ, design-ideas piece) - explicitly labeled as
    placeholders, no real articles written. Real production path once this
    moves past planning: run `npm run questions -- <topic-seed>` /
    `npm run aeo` against real SW-relevant questions, the same pipeline RR
    already uses for itself, not a new build.

11. **Trust bar** - 25 years / CSLB #979326 / Family Owned / Bay Area. Built, no change.

12. **Start a Project CTA** - phone + shop address. Built, no change.

13. **NEW - Fuller footer.** Four columns: brand (logo, inverted to white via
    CSS filter since no reversed asset exists, plus a short blurb), Services
    (mirrors the Project Types cards), Service Area (city list, see note
    below), Contact (phone, address, Instagram). Bottom bar: legal line +
    license number.

    **Service Area list is an assumption, not a verified fact.** Livermore,
    Pleasanton, Dublin, San Ramon, Danville, Walnut Creek - picked as
    geographically plausible Tri-Valley cities near his Livermore shop, not
    confirmed with Steve. Flag this before treating the footer as real copy -
    same caution as any other inferred field in this project.

---

## Decided

- **Domain: sw-cabinets.com stays, 702kitchens.com retires.** "One Name" is
  now a real plan, not just a positioning line. Still needs the actual
  retirement/redirect handled once this moves past mockup stage (301 the old
  domain, don't just let it go dark).
- **Logo: real logo sourced 2026-09-11**, pulled from sw-cabinets.com (Wix-
  hosted, upscaled to 1000x440 for use). Saved to `logo/sw-logo-original.png`
  (288x122, the real source size) and `logo/sw-logo-large.png` (upscaled,
  used in the mockup nav). It's an ornate, illustrated mark - a cabinet door
  with an S/W monogram, scrollwork flourishes, serif "Custom Cabinets Inc."
  wordmark. That's a traditional/heritage character, a real tension against
  the modern-minimal Medallion-derived direction this mockup is built in.
  Not resolved yet - flagged in `brand-dna/brand-dna.md`.

## What's still open

- Real buyer mix (homeowner-direct vs designer/architect-referred) - would
  change whether Project Types cards lead with kitchens (homeowner-first) or
  something else.
- More project photos per category, so Project Types cards can eventually
  filter into real sub-galleries instead of anchor-scrolling to one shared grid.
- The logo/typography tension above - keep the modern-minimal direction and
  treat the logo as a small trust anchor only, or let the ornate mark pull
  the whole direction toward something warmer/more traditional? Worth a
  real decision, not a default.
