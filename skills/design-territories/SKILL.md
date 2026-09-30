# Design Territories Skill

Ported from the contractor-portfolio-lookbook master brief (see
`portfolio-project-backlog.md`). Produces three genuinely different art-direction
concepts for a client site before anything gets built, so the final design is
derived from THIS business rather than defaulted from the mini-site template.

## When to run this

Not for the fast grader-mockup flow (`skills/mini-site/SKILL.md`, ~3-5 minute
build, used on every cold prospect). Design territories are deliberately slower
and only pay off once a business is worth differentiating for:

- A real client's full site build (Phase 2 of `templates/client-deliverable-system.md`), especially Active/Growth tier where the build is meant to stand out, not just convert
- Any project that will also become a public portfolio case study
- Any client whose mini-site mockup and grader both scored/read as generic on the anti-cloning check

Skip it for a Launch-tier templated build unless Jennifer asks for it specifically.

## Inputs required before starting

- `clients/<slug>/audit/audit-dossier.md` (or `website/DISCOVERY.md` +
  `website/SITE-AUDIT.md` for a client from before this template existed) -
  Business Reality, Digital Footprint, and Message Inventory sections filled in
- `clients/<slug>/brand-dna/brand-dna.md` filled in - a territory without a
  Brand DNA is just a mood board, not derived from anything real

If either is missing or thin, fill it first. Do not skip straight to territories
from a blank read of their website.

## How to run it

1. Read the audit dossier and Brand DNA in full.
2. Copy `templates/design-territory-template.md` to
   `clients/<slug>/design-territories/three-territories.md`.
3. Fill all three (Product, Customer, Story) - see the template for the exact
   fields each one needs (concept name, core idea, why it fits, typographic
   direction, color behavior, layout, photography treatment, navigation, signature
   visual device, motion, risks, and what makes it different from every other
   territory this repo has produced).
4. Run the anti-cloning check against each territory before presenting: could this
   exact territory be handed to a different contractor in the portfolio with only
   the logo/photos swapped? If yes, it is not specific enough yet - the risks
   section should name that risk directly rather than hide it.
5. **Stop here.** Present all three, unbuilt, to Jennifer. This is Gate 2 in the
   master brief's workflow - do not build any of them without her picking one.
6. Once she picks one, fill `chosen-territory.md`'s bottom section in the same
   file and proceed to wireframe/copy/build.

## What this replaces

Nothing existing - this is a genuinely new step. `skills/mini-site/SKILL.md`
jumps straight from palette-extraction to one built mockup, which is correct for
speed on a cold prospect but means every real client build has so far started
from the same template rhythm with different colors. This skill is the fix for
that gap (also flagged in this repo's own CLAUDE.md under "Files Still To Build:
Front-end design skill... not yet built").

## Downstream

Once a territory is chosen, its `signature_visual` and typographic/color/layout
decisions govern the real build in `clients/<slug>/website/`. If this client is
also becoming a public case study, the chosen territory feeds
`clients/<slug>/portfolio-case-study/case-study.json`'s `design_territory` and
`signature_visual` fields directly.
