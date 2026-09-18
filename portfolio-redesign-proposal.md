# Portfolio Redesign - Architecture Proposal

Per the implementation brief's own "First Implementation Task": inspect,
propose, map SW, flag gaps, stop here for approval before any rewrite.
Building for **RemodelerRank** (name swapped from the brief's "Business
Fixer" placeholder throughout, per Jennifer's confirmation 2026-09-15).

---

## 1. What exists now (`work/index.html`)

A two-column card grid: sage/charcoal palette, Lora + Karla, generous
whitespace, each card = photo + project number + tags + 2-sentence
description, linking straight out to the external Claude Artifact
mockups. Exactly the "tasteful design agency" feeling the brief flags -
no dedicated case-study pages exist at all yet, the grid IS the whole
portfolio.

**Reusable as-is:** the real per-project copy already written (SW/AF/A+E
descriptions, tags, locations), the RemodelerRank nav/footer shell, the
live artifact links.

**Replace entirely:** the visual system (card grid, sage-dominant
palette, Lora/Karla pairing, whitespace-heavy pacing) and the fact that
there's no internal case-study page at all, everything lives on external
Artifact links right now.

## 2. Proposed component architecture

Reusable blocks, per the brief's own list, trimmed to what SW's real
story actually needs (not every block fires on every project):

- `CaseStudyHero` - field-note metadata + headline + supporting stat line
- `ProblemStatement` - large diagnostic headline + real bullet list
- `BeforeComparison` - the two real old sites, laptop composition,
  restrained annotation
- `StrategyBreakdown` - the rebuild, large device mockup
- `XRaySection` - "why each part exists," contractor-language annotations
  over the actual mockup screenshot (this reuses the presentation-notes
  content style already built for A+E, adapted to plain-English annotation
  form instead of a toggle)
- `BusinessOutcome` - two states, STRATEGY (current build) vs VERIFIED
  RESULT, never blended
- `QuoteBlock` - real quote OR an explicit `[QUOTE NOT YET COLLECTED]`
  placeholder state, never fabricated
- `FieldNote` - 1-3 handwritten-style annotations, used sparingly
- `NextProject` - dramatic transition into AF Woodworker

Not needed for SW specifically: `ExplodedView`, `FindTheProblem` (better
suited to a different project's signature visual once all four exist).

## 3. Data schema (adapted from the brief's suggestion)

```
project: {
  slug, projectNumber, client, location, industry, status,
  problemHeadline, problemSummary, businessContext,
  before: [{ label, screenshot, note }],
  diagnosis: [ string ],
  strategy: [ string ],
  build: { screenshot, description },
  xrayAnnotations: [{ title, copy, position }],
  businessOutcomes: {
    strategy: [ string ],          // current build, not yet verified
    verifiedResults: [ { metric, before, after, timeframe, source } ]
    // empty array until real data exists - never pre-filled
  },
  quote: { text, attribution, verified: boolean },
  fieldNotes: [ string ],           // 1-3 max
  signatureVisual: string,          // the ONE art-directed idea for this project
  nextProject: slug
}
```

## 4. SW mapped into the schema (real facts only)

```
slug: "sw-custom-cabinets"
projectNumber: "001"
client: "SW Custom Cabinets"
location: "Livermore, CA"
status: "CONCEPT"                    // real - not live, not measuring

problemHeadline: "25 years of work. Two websites. Two names. One confused customer."
problemSummary: "sw-cabinets.com and 702kitchens.com are the same
  business, same license (CSLB #979326), same address, branded as two
  different companies. One plain and family-owned, one sales-heavy
  ('Premium Bay Area Kitchens,' 'luxury estates'). Splitting authority
  in search instead of building it."

before: [
  { label: "sw-cabinets.com", note: "Plain, family-owned tone" },
  { label: "702kitchens.com", note: "\"Premium Bay Area Kitchens\" - inconsistent voice" }
]

diagnosis: [
  "Two separate websites, one license",
  "No clear positioning between them",
  "Real, strong work, undersold presentation",
  "Real asset (Instagram, 4,633 followers, organized by project type) not connected to either site"
]

strategy: [
  "Consolidate to one domain (sw-cabinets.com, per Jennifer's call - Steve's confirmation still needed)",
  "One consistent voice instead of two competing ones",
  "Real project photography as the dominant content, not stock or adjective-heavy copy"
]

quote: {
  text: null,
  attribution: null,
  verified: false
}
// EXPLICIT GAP: no real quote exists yet. The build is a concept draft
// Steve hasn't necessarily seen or reacted to. Do not fabricate one -
// this is a real open item, get his actual reaction once he's seen it.

businessOutcomes: {
  strategy: [
    "Attract better-fit, higher-value projects",
    "Reduce dependence on Steve for every sales conversation",
    "Build a digital presence that matches the real book of business",
    "Move toward a business that can function - and eventually sell - without the owner in every conversation"
  ],
  verifiedResults: []   // empty - nothing has launched yet, nothing to verify
}

fieldNotes: [
  "The business wasn't broken. The way it showed up was."
]
// ONE note, not three - the brief says 1-3, SW's story only earns one
// strong line right now, don't force two more to hit a quota.

signatureVisual: "Two competing websites, sweeping together into one -
  literally the same visual device already built for the hero
  (SW's mockup already does a 4-photo collage-reveal around a single
  persistent logo, close enough to this idea that it may not need a new
  device, worth deciding once we see it laid out)"
```

## 5. Real strategic addition: the exit-timeline story

Per the brief's explicit instruction, this is **STRATEGY, not a completed
result**, and gets its own clearly-labeled state, never blended into
"what we built":

> Steve mentioned during the September 2026 visit that he's looking to
> exit the business in roughly five years, and it isn't currently ready -
> still deeply owner-dependent for sales. This reframes the long-term
> opportunity (owner-dependent -> company-owned brand -> transferable
> relationships -> a business that can function and eventually sell
> without him), but it is a **direction**, not something built or proven
> yet. Labeled CURRENT STATE / STRATEGY in the outcomes block, never
> presented as achieved.

## 6. What's missing before this can be more than a concept draft

- Steve's real reaction to the draft (there's no quote to use until he's
  actually seen it)
- Confirmation he's fine retiring 702kitchens.com (decision made by
  Jennifer, not yet confirmed with him)
- Any real metric at all - this has never gone live, so `verifiedResults`
  stays an empty array, not a guess

## 7. Typography - locked 2026-09-15

Compared side by side against real SW copy
(font-comparison.html, published for reference): Set B confirmed.

- **Display** (headlines, field-rebuild titles): Archivo, weight 900,
  uppercase, tight letter-spacing
- **Editorial serif** (quotes only, demoted from carrying headlines):
  Lora italic - the one piece of the current brand system that survives
  unchanged
- **Technical label** (metadata, FIELD REBUILD 001, annotations, specs):
  IBM Plex Mono
- **Body**: Karla, unchanged
- **Handwritten field notes**: Caveat, confirmed over Kalam and
  Architects Daughter

## 8. Sequencing

Building the homepage first (smaller piece, establishes the new visual
system in a real live page before the larger SW case-study block system
gets built on top of it).
