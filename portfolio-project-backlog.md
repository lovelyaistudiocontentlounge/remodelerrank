# Portfolio + Lookbook + Interactive Sales Experience - Project Backlog

Source brief: `contractor-portfolio-lookbook-master-brief.md` (website repo,
CONTENT/). This backlog is Step 1's output (repo inspection + architecture +
schemas + backlog). Per the brief: stop here for review before any client audit,
design territory, or code begins.

---

## Architecture decision

Reuse the existing per-client convention in `clients/<slug>/` rather than the
brief's suggested standalone `/data/prospects/`, `/data/projects/`,
`/data/brand-dna/` tree. This repo already organizes everything by client slug with
purpose-named subfolders (`photos/`, `mockup/`, `grader/`, `website/`, `reports/`).
Adding four more subfolders keeps one mental model instead of two parallel systems:

```
clients/<slug>/
  audit/audit-dossier.md              NEW - Business Reality + Digital Footprint
  brand-dna/brand-dna.md              NEW
  design-territories/
    three-territories.md              NEW - all three, pre-approval
    chosen-territory.md               NEW - written only after Gate 2 approval
  portfolio-case-study/case-study.json  NEW - the public-facing record (schema above)
  photos/                             EXISTS (portfolio-recovery skill runs here)
  mockup/                             EXISTS (mini-site skill - the "after" digital mockup)
  grader/                             EXISTS (the sales-facing website grade)
  website/                            EXISTS (the real build, once a client)
  reports/                            EXISTS (monthly reports, once a client)
```

INTERNAL vs PUBLIC split (per the brief): everything above stays inside this
pipeline repo (`Desktop/RemodelerRank/remodelerrank/`, gitignored/local) until a
field is deliberately promoted into `case-study.json` and rendered onto the public
site in the website repo (`Desktop/RemodelerRank/`, git-tracked, Netlify).

## What already does the brief's job - reuse, do not rebuild

| Brief asks for | Already built | Location |
|---|---|---|
| Photography Inventory (A-F grading) | Stage 1-8 grade/cull/rank/QA pipeline, more rigorous than the brief's own A-F scale | `skills/portfolio-recovery/SKILL.md` |
| Before/after comparison tool | Side-by-side panel generator, sage-labeled | `scripts/photo-factory/beforeafter.py` |
| Contact sheet / numbered grid | | `scripts/photo-factory/contactsheet.py` |
| Marketing-ratio crops | | `scripts/photo-factory/export_crops.py` |
| "After" digital mockup (the digital analogy in Experience 02) | Builds a single-page mockup in the prospect's own brand palette | `skills/mini-site/SKILL.md` |
| Portfolio wrapper visual system (the brief demands ONE consistent system across all case studies) | Sage palette + Lora/Karla type system, already the RemodelerRank brand, documented with CSS variables | `CLAUDE.md` "Grader Report Design" section |
| Business Reality / Digital Footprint audit, with FACT vs INFERENCE separation | Already done this way for one real client, Source-column convention | `clients/coda-construction/website/DISCOVERY.md`, `SITE-AUDIT.md` |
| Print-ready HTML pattern | Existing precedent for a print-oriented static page | `assets/goldmine-checklist-print.html` (website repo) |

Net new work is genuinely new in four places: Brand DNA (structured, not previously
captured this way), Design Territories (net-new creative-strategy step, does not
exist anywhere yet), the physical lookbook, and the iPad presentation.

## New schemas/templates created (this session)

- `templates/audit-dossier-template.md`
- `templates/brand-dna-template.md`
- `templates/design-territory-template.md`
- `templates/portfolio-case-study-schema.md`

## Backlog, mapped to the brief's Build Workflow

For each client, in order, stopping at the brief's four gates:

1. Collect source material
2. Audit (business + digital) -> `audit/audit-dossier.md`
3. Photography inventory -> run `skills/portfolio-recovery/SKILL.md` Stage 1
4. Message inventory -> folded into `audit/audit-dossier.md` section 4
5. Brand DNA -> `brand-dna/brand-dna.md`
6. Name the primary business/digital problem
7. Three Design Territories -> `design-territories/three-territories.md`
8. **GATE 1** (audit + Brand DNA done) and **GATE 2** (three territories) - stop, present, wait for approval
9. Signature visual concept (stop again if it diverges meaningfully from the chosen territory)
10. Wireframe/information architecture
11. Copy (preserve the client's real voice, per the message inventory)
12. Build
13. Anti-cloning test (strip logo/name/photos, compare against every other case study - reject if it still reads generic)
14. Responsive/accessibility/performance pass
15. Portfolio case-study assets -> promote approved fields into `portfolio-case-study/case-study.json`
16. **GATE 3** (wireframe/art direction) and **GATE 4** (completed build) fall inside steps 10-15 above - stop before publishing
17. Physical lookbook assets (2-4 page spread per the template above)
18. iPad presentation assets

## Open questions - need your call before Step 2 starts

1. **First real case study: Coda Construction, not AF Woodworker.** The brief
   recommends AF Woodworker (a cold prospect, nothing verified yet). Coda
   Construction is a real, paid, live client with a completed rebuild, a real
   audit (`SITE-AUDIT.md`), a real discovery doc with sourced facts
   (`DISCOVERY.md`), real before/after photos, and monthly reports already
   running. Starting there means zero fabrication risk and most of steps 1-4
   above are already sitting in the repo waiting to be reformatted into the new
   templates. Recommend Coda first, AF Woodworker (or another cold prospect)
   second, once the system is proven. Confirm or override.

2. **Where does the public case-study page live?** `Desktop/RemodelerRank/portfolio/`
   already exists and is a different asset (an "about Jennifer's decade running
   marketing for a design-build firm" credibility page, not a case-study grid).
   Options: repurpose that URL, or add a new route (e.g. `/work/` or
   `/case-studies/`) and leave the existing portfolio page as-is. Your call.

3. **The "What's Wrong With This Picture" hero kitchen image.** This needs one
   specific, highly photorealistic luxury kitchen photo with five deliberately
   planted, physically plausible flaws. Per this repo's own hard rules (before/after
   images are always manual, real client photos are never fabricated to
   misrepresent work), this can't be auto-generated as if it were a real
   project. Options: a licensed stock photo styled to spec, a real
   project photo (with the client's permission, if flaws can be found/staged
   honestly in an actual space), or a clearly-labeled illustrative AI-generated
   image with the five flaws designed in. This one needs your decision, not an
   autonomous generation.

4. **Lookbook production method.** Recommend the same static HTML+CSS approach as
   the rest of the site (precedent: `assets/goldmine-checklist-print.html`), with
   a `@media print` stylesheet sized to 6x9in, rather than introducing a design
   tool. Confirm or override.

5. **iPad presentation.** Recommend a lightweight offline-capable web page
   (matches the all-static-HTML stack already in use, no new framework), rather
   than a Keynote/PDF deck. Confirm or override.

## Status

Step 1 (inspect, architecture, schemas, backlog) - done.

Jennifer chose AF Woodworker as first case study (overriding the Coda
Construction recommendation above - her call). Audit + Brand DNA done:
`clients/af-woodworker/audit/audit-dossier.md`,
`clients/af-woodworker/brand-dna/brand-dna.md`. This is **GATE 1** - stop here,
waiting for review before Design Territories (Gate 2).

Design Territories done for AF Woodworker:
`clients/af-woodworker/design-territories/three-territories.md` - three
genuinely different concepts (The Spec Sheet / process-as-spectacle, Both Of
You Should Love It / client-journey with sketch-to-real proof, Two Names One
Shop / founder-led editorial). **This is GATE 2** - stop here, waiting for
Jennifer to pick one before wireframe/copy/build starts.

SW Custom Cabinets added out of sequence - fast pre-visit brief, not the full
slow-lane workflow, ahead of an in-person visit Monday 2026-09-14:
`clients/sw-custom-cabinets/audit/audit-dossier.md` +
`clients/sw-custom-cabinets/brand-dna/brand-dna.md`. Surfaced a real reputation
risk (BuildZoom 2.5/5, recent complaint pattern) and confirmed `702kitchens.com`
is the same business under a second name/domain (same license, same address) -
both worth reading before the visit. Brand DNA fully unblocked after Jennifer's 2026-09-11 read (she's not worried
about the reputation pattern - he has a large, genuinely high-end book of
business; the real problem is his two websites "both kinda suck"). Jennifer
then named a specific reference, medallioncabinetry.com, rather than asking
for three independently-derived territories - one territory built from it:
`clients/sw-custom-cabinets/design-territories/three-territories.md` +
`image-prompts.md`. Kept Medallion's restraint/whitespace/photography-led
approach, deliberately dropped its product-tier catalog structure (Medallion
is a manufacturer selling standardized lines through dealers; SW does bespoke
work for named clients, so that structure would misrepresent the business).

Rough draft built: `clients/sw-custom-cabinets/mockup/index.html`. First
photo batch Jennifer saved (raw, unfinished shaker door fronts and moulding
profile samples, likely not even SW's own photos) was confirmed incorrect and
pulled from the draft. Real project photography (24 images) found in
`Desktop/SW Images/`, a genuine, high-end portfolio (walnut/brass kitchens,
reeded-wood vanities, a custom walk-in pantry, built-in wine bars) that
confirms Jennifer's read on the real book of business. 10 selected and copied
into `clients/sw-custom-cabinets/photos/raw/` with descriptive filenames,
used in the mockup's hero and an 8-photo work grid.

## Ported back into the everyday client flow (Sep 2026)

Five items from this brief were valuable enough to wire into the general
lead-to-client pipeline, not just this one-off project:

1. Voice pass added to `skills/mini-site/SKILL.md` Step 4 (fast lane, under a minute)
2. Anti-cloning check added to `skills/mini-site/SKILL.md` Step 6b and
   `templates/client-deliverable-system.md` 2.2 (fast lane self-check)
3. Design territories promoted to its own skill, `skills/design-territories/SKILL.md`,
   wired into `client-deliverable-system.md` 2.1 for Active/Growth-tier or
   portfolio-featured builds (slow lane, not the cold-prospect mockup)
4. Target buyer + how-they-actually-buy added to `client-deliverable-system.md` 1.5
5. "Does this channel actually matter to this business" judgment added to the
   lead-scoring prompt in `prompts.js` - changes nightly automated `best_hook`
   output, worth watching on the next scrape

See `CLAUDE.md`'s new "Portfolio/Lookbook Project" section for the same summary.

## AF Woodworker pivoted to a Fabuwood reference (2026-09-11)

Same pattern as SW's Medallion pivot. Jennifer named fabuwood.com (blocked
direct scraping, pulled via Wayback Machine snapshot + their real featured
image instead). New "Territory D - Precision, Made Modern" built in
`clients/af-woodworker/design-territories/three-territories.md`, superseding
Territories A-C (kept in the file for the record). Full breakdown in the new
`fabuwood-reference-analysis.md`. Real finding: AF Woodworker has no logo
asset at all (checked their live Squarespace site directly) - flagged, not
faked.

## AF Woodworker mockup built (2026-09-11)

`clients/af-woodworker/mockup/index.html`, built on Territory D (Precision,
Made Modern, the Fabuwood reference). 9 real photos from AF's own Instagram
(confirmed with Jennifer before use, all from @af_woodworker) copied into
`clients/af-woodworker/photos/raw/`. Hero uses the wood-slat room divider
photo (most distinctive piece). "Why AF" strip uses only real, sourced
facts (2D/3D modeling, CNC fabrication, founder-built) - no invented stats.
Testimonials pulled verbatim from afwoodworker.com. No logo used anywhere
(none exists) - nav and hero rely on clean lowercase wordmark typography
instead, consistent with what was flagged in the territory doc.

## Public portfolio wrapper started (2026-09-11)

First real build of the actual portfolio site (not a client mockup) - the
consistent RemodelerRank-branded shell from the master brief's "Portfolio
Visual System" section. Lives in the website repo (`Desktop/RemodelerRank/`,
git-tracked) at the new route `work/index.html`, using RR's own real sage
palette and Lora/Karla type (pulled directly from their live homepage, not
guessed). Deliberately did NOT touch or repurpose the existing
`remodelerrank/portfolio/` page (a different asset, in the pipeline repo -
Jennifer's own "about my decade in marketing" bio page, not a case-study
index).

First card: SW Custom Cabinets (Project 001), linking to the published
Artifact draft, using one of SW's real photos (copied into
`images/work/sw-custom-cabinets-01.jpg`, this website repo's own asset
space, since the pipeline repo's client photos can't be referenced directly
across repos). Second card: AF Woodworker (Project 002), marked "In
Progress" with a plain placeholder tile, no invented image.

Not yet built: individual case-study detail pages (the "PROJECT 001 / THE
BUSINESS / WHAT I SAW / WHAT WAS MISSING / THE PLAN / THE BUILD / THE
DETAILS / THE RESULT" format from the master brief) - the wrapper homepage
links straight to the Artifact draft for now instead. Also not decided: the
lookbook and iPad presentation pieces, still open per the original backlog.

## AF Woodworker anti-cloning failure fixed (2026-09-13)

Jennifer ran the anti-cloning test on the AF mockup (built 2026-09-11) and
it failed: the `.work-grid` CSS (`.wg-a` through `.wg-e`) was byte-for-byte
identical to SW's, copy-pasted as a starting template, and the testimonial
card treatment + general section rhythm (`.eyebrow`, `.statement`) were
also near-identical, just color-swapped. The hero mechanism and typography
genuinely differed and passed; the supporting plumbing didn't.

Redesigned all three, grounded in the Fabuwood reference's geometric
diamond icon mark rather than invented from nothing:
- **Work grid**: 6-col bento with a row-spanning hero tile and full-width
  gradient-overlay captions (SW) -> 12-col single-row asymmetric spans
  (5/4/3 then 6/6), a corner-cut triangle accent, and a solid tag caption
  with a small rotated-square bullet instead of a gradient (`.wg1`-`.wg5`,
  replacing `.wg-a`-`.wg-e`).
- **Testimonials**: white boxed cards with a border-radius and drop shadow
  (SW) -> flush bordered spec-sheet rows on the section's own background,
  no radius, a diamond mark standing in for the quote glyph.
- **Section rhythm**: centered `.statement` block (SW) -> left-set against
  a border-left rule; `.eyebrow` now always carries a small rotated-square
  mark before the text, the recurring shape doing double duty as AF's
  proto-signature since no real logo exists yet.

Republished to the same Artifact URL (b2b87a87-7465-484d-b335-5214a3b0b234)
so the existing link stays live. This same shortcut (reusing SW's plumbing
CSS as a template) is the thing to watch for when Arnold + Egan's mockup
gets built next - design its grid/card/section CSS fresh, or at minimum
diff it against both SW's and AF's before calling it done.

## AF Woodworker photos replaced + a real image-path bug fixed (2026-09-15)

Two separate problems, found back to back:

1. **The Instagram reel screenshots were unusable, not just low-res.**
   Jennifer found real project photos on afwoodworker.com itself (their
   Portfolio page) and flagged the old photos as maybe worth reconstructing.
   Checked the old screenshots directly first: every one of them has a
   visible IG play-button triangle burned into the frame (some also carry
   a mute icon). Not a quality nuance - genuinely broken for any
   client-facing use. Call made: skip reconstruction, replace outright.
   Pulled 7 real photos straight from afwoodworker.com/portfolio (real
   camera exports, 2500px+, named by project location - Saratoga, Menlo
   Park, Oakland, Sunset, Mill Valley, Sunset SF, plus a "Showcase
   Projects" tile). 6 of the 7 used (skipped the most dated-looking
   traditional kitchen, "Sunset"): Saratoga as the new hero (dramatic
   vaulted-ceiling walnut kitchen), Oakland/Mill Valley/Menlo
   Park/Sunset SF/the built-in library tile across the 5 work-grid slots.
   Old screenshots moved to `photos/ig-screenshots-archive/` (kept, not
   deleted). New files in `photos/raw/` with descriptive names; originals
   at full resolution also kept in `photos/site-raw/`.

2. **The mockup's image paths never actually worked on the published
   Artifact.** Both the hero background and the work-grid images used
   `../photos/raw/...` - a path that only resolves on the local
   filesystem, not on a hosted Artifact page, and no `files` were ever
   attached on the two prior publishes. That almost certainly means the
   shared AF link has been showing broken images (or the fallback
   background color) this entire time, unnoticed because no one had
   opened the actual published link to check, only viewed the local file.
   Fixed by dropping the `../` (paths are now `photos/<name>.jpg`,
   relative to the mockup) and republishing with the real files attached
   via the Artifact tool's `files` param.

**Open, not yet fixed:** SW's mockup almost certainly has the exact same
`../logo/...` / `../photos/raw/...` path problem on its published Artifact
link. Not touched this session (today's priority was AF + Arnold + Egan) -
worth the same fix next time SW's mockup is touched, and worth actually
opening the published link (not just the local file) to confirm either
way before assuming it's fine.

## Arnold + Egan: full build, audit through mockup (2026-09-15)

Everything the 2026-09-12/13 handoff flagged as "the only client where the
audit is genuinely incomplete" is now done, same session as the AF fix
above.

**Digital footprint audit finished**: arnoldandegan.com/about read
directly. Their own words now on record: "Full-Service Casework &
Millwork Manufacturing Company," serving "Commercial, Hospitality, Retail
and Residential Clients," capable of taking a project "from the
Architectural & Planning stages... through to completion," fixtures
"personalized to their unique specifications." Visual identity confirmed:
black/white minimal palette, clean modern sans-serif - notably NOT a
heritage/traditional register despite the 89-year history, which directly
validated the logo mark's own modern-geometric reading. Audit dossier and
Brand DNA both updated, no more provisional flags.

**Photo review**: sampled broadly across the ~55 previously-unreviewed
photos (not exhaustive - real diminishing returns past a good sample).
Strongest find of the whole set: `ae-bronze-filigree-marble-counter-shop.jpg`
(IMG_0733/0747), bronze filigree hardware being fitted to a marble counter,
shot mid-fabrication in their own shop - literal craft-in-progress, became
the mockup's hero. Five more real additions (walnut table detail, bench/
steel joinery, built-in bookshelf+fireplace, cubby-wall divider, dark wood
powder room). One mislabeled file caught and fixed (a "spa reception"
photo was actually the bench/joinery shot - renamed rather than left
wrong). Working photo set: 8 to 13.

**Logo extracted**: extracted the real mark + wordmark from the marketing
collage using a throwaway Python/Pillow venv (no ImageMagick/PIL on the
system already) - `logo/ae-logo-transparent.png` (real alpha channel,
verified pixel-by-pixel) and `logo/ae-logo-original-bg.png`. Real
production work the audit had explicitly flagged as still needed.

**Design Territories**: `design-territories/capabilities-record.md`. One
territory, not three drafts - unlike SW/AF, Brand DNA had already
converged on a real, earned direction (the logo/lattice geometric rhyme,
the "capabilities book" physical analogy) without needing a borrowed
reference site. Named "The Capabilities Record." Palette: their real
black/white plus ONE earned accent (warm bronze/walnut, sampled from the
two signature photos, not invented). Type: Archivo (headings, matches the
logo's tracked-caps wordmark) + IBM Plex Sans (body, fits their trade
vocabulary - "casework," "specifications"). Structural signature: the work
section is organized by SECTOR (Hospitality / Retail & Food Service /
Wellness / Residential) instead of a flat photo grid - a genuinely
different information architecture from both SW's bento grid and AF's
spec-plate grid, the anti-cloning lesson applied at the structural level,
not just the CSS level.

**Mockup built**: `clients/arnold-egan/mockup/index.html`, built fully
fresh (no copy-paste from SW or AF, verified no shared class names or
duplicated CSS blocks). Diamond motif used as eyebrow bullets and craft-
strip corner ticks, drawn from the real logo geometry, not invented.
Published: https://claude.ai/code/artifact/7a2cc35a-d39b-48eb-8ad5-99b7665bc8b9

**Path-bug lesson applied from the start**: built `mockup/photos/` and
`mockup/logo/` as self-contained folders inside the mockup directory itself
(plain relative paths, no `../` traversal) so the page works both opened
locally via `file://` and published as an Artifact with `files` attached -
the exact bug just found and fixed on AF's mockup, avoided here by
construction rather than caught after the fact.

**Portfolio wrapper updated** (website repo, `work/index.html`): added
Arnold + Egan as Project 003. Also fixed AF's card image while in there -
`images/work/af-woodworker-01.png` was the same broken play-button
screenshot just replaced in the pipeline repo (confirmed by matching pixel
dimensions), swapped for the new walnut-vaulted-kitchen hero photo, now
`.jpg`.

## Real feedback on both mockups: too weak to justify switching (2026-09-15)

Jennifer's direct read on AF's and Arnold + Egan's mockups as built: "they
feel weak... no reason for them to go through the hassle let alone pay
money to switch." Two separate problems, both real:

1. **Structural thinness.** A refreshed hero and a real photo grid aren't
   enough - the site has to visibly do more than the prospect's real site
   already does. Missing: Services (named), Process (how a project
   actually runs), Why-Them substance, and an AEO/content device (the
   Guides pattern SW's mockup already had). Fixed on Arnold + Egan first
   (see `design-territories/capabilities-record.md`'s "Structural
   additions" section) - Services, Process, and Guides sections added,
   all grounded in real confirmed facts (their own about-page language),
   nothing invented. AF still needs the same treatment, blocked on the
   logo question below.

2. **The strategy-view prototype was talking to Jennifer, not the
   prospect.** First draft's notes described what Claude did ("pulled
   verbatim from AF's own site reviews") instead of why a choice matters
   to the client. Needs a rewrite before it's usable in a real meeting.
   Also surfaced a bigger ask: a "proof of knowledge" leave-behind per
   client beyond the site itself - top GBP fixes, a caption format for
   their existing social content, a few cheap quick-win projects, an
   email template to reactivate past clients for reviews. Framed as
   demonstrated expertise, not a pitch. Not built yet.

Both lessons logged in memory
(`feedback_client-mockup-build-discipline.md`, rules 5 and 6) so they
carry into every future client build, not just this session.

**AF Woodworker logo, open question:** Jennifer says there's a real logo
on their existing site. Checked the homepage, About page, and favicon
directly (three separate passes) - still only plain-text "AF WOODWORKER"
branding, no graphic found. Also tried their Instagram profile picture
directly (URL was session-signed, expired before it could be fetched).
Not fabricating one - waiting on Jennifer to point to the exact spot
before touching AF's identity work.

---

## Future: A public "How We Work" page (not started, deliberately gated)

Jennifer's own note (2026-09-16): the agency process defined across
`skills/` (onboarding, site-mapping, copywriting, photo-pipeline,
design-territories, seo-build, aeo-articles, pre-launch) wasn't clearly
defined in her own head until this session, and none of it is reflected
anywhere on the public site. A page walking a prospect through the real
process (discovery -> design territories -> build -> SEO/AEO layer ->
launch -> ongoing) would sit naturally alongside `/work/` and would be a
real differentiator, most competing agencies don't show their work this
transparently.

**Explicitly gated, not ready to build yet:** Jennifer's own call was
"once we are good", meaning once the process has actually run on real
client work, not just been freshly written this session. Publishing a
process page before it's been tested risks reading as aspirational
rather than true, the same trap the strategy-view prototype note above
already flagged once for client-facing copy. Revisit once at least one
client has been through the full pipeline end to end (onboarding through
launch) and the process docs have had real edits from actually using
them, not just first-draft theory.

**When it's time:** this needs its own copy pass, not a dump of the
internal SKILL.md files. A prospect doesn't need `site-mapping/SKILL.md`'s
eligibility-rule mechanics, they need the plain-English shape of what
working with RemodelerRank looks like and how long it takes. Route
through `copywriting/SKILL.md`'s nothing-invented rule same as any other
public page: describe the real process as it's actually run, not the
aspirational version.
