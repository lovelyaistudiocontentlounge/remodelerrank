a# Design Territory - SW Custom Cabinets

Built from `clients/sw-custom-cabinets/audit/audit-dossier.md` and
`clients/sw-custom-cabinets/brand-dna/brand-dna.md`. Jennifer named a specific
reference (medallioncabinetry.com) rather than asking for the usual three
independently-derived territories, so this file has ONE territory built
directly from that reference, adapted to SW's real facts. See the note at the
bottom about whether to still produce alternates.

---

## Territory - "One Name, Real Work"

Derived from Jennifer's reference (medallioncabinetry.com), adapted to what
SW actually is: a bespoke local install shop with real named clients, not a
national manufacturer selling standardized product lines through dealers.

Concept name: One Name, Real Work

Core idea: Medallion's restraint - neutral palette, generous whitespace,
photography doing the talking, a customer-journey navigation instead of a
generic menu - carried over directly. Medallion's actual shopping structure
(Silver/Gold/Platinum/Frameless product tiers, dealer/showroom locator) does
not carry over - SW doesn't sell configurable lines, it builds one-off work
for real clients, so the site replaces "browse a product tier" with "see real,
named projects." One consolidated site ends the sw-cabinets.com/702kitchens.com
split, and lets the real work Jennifer already knows is substantial carry the
premium feeling instead of either failure mode currently in play (plain and
generic on one domain, overclaiming with "luxury estates" language on the
other).

Why it fits: The reference is Jennifer's own pick, and the underlying
principle - real material and photography carrying trust instead of adjective-
heavy copy - directly fixes the specific problem in the audit (two competing,
weak, inconsistent-voice sites). Medallion's catalog structure would actively
misrepresent SW's business if copied wholesale (implying standardized product
lines instead of bespoke work), so it's deliberately left out.

Typographic direction: A clean modern sans for headlines and body (Inter or
General Sans) - no serif, no ornamental faces. Short, confident headline copy,
the opposite of 702kitchens.com's adjective-stacked "luxury estates" language.

Color behavior: Neutral base - white/off-white, charcoal, gray - with exactly
one accent pulled from the real wood tones already present in Steve's own
project photography, not an abstract "luxury" color choice.

Layout / composition: Generous whitespace, grid-based project sections, each
real project given dedicated uncluttered space with photography leading and
copy following - matches Medallion's composition approach directly.

Photography treatment: SW's own real, already-strong project photography
(confirmed strong in the audit) as the dominant visual content - full-bleed,
unfiltered, material/finish/joinery detail shown the way Medallion shows wood
grain and hardware finish. Always real completed work, never stock or generic
lifestyle imagery.

Navigation approach: A customer-journey nav instead of Services/About/Contact
- something like "The Work," "How It's Built," "Start a Project" - mirrors
Medallion's awareness-to-decision progression (Why Medallion / Products / Plan
/ Inspiration) but built around a bespoke-project business instead of a
product-selection business.

Signature visual device: A real-project detail carousel - close-up finish,
joinery, and material shots pulled directly from Steve's own high-end
completed jobs, presented the way Medallion shows its 100+ door/finish
combinations, except every image here is real finished work, not a catalog of
selectable options.

Motion / interaction: The real mechanism behind Medallion's hero (see
`medallion-reference-analysis.md` for the full breakdown) is a pinned,
scroll-scrubbed GSAP/ScrollTrigger sequence - four images sweep off-screen in
four directions at once as a dark scrim fades to white, revealing a brand
mark underneath. Fully portable to a static site (GSAP is three CDN script
tags, no WordPress/Divi dependency). Adapted for SW: four real project photos
(a kitchen, a vanity, a closet, a media built-in) sweep apart on scroll to
reveal the site's wordmark, using SW's own work instead of stock imagery.
Confirmed this is a homepage-only moment on Medallion's own site (checked
their door-gallery subpage - no custom scroll code there), matching this
territory's restraint elsewhere.

Risks: Needs the actual project photography pulled together and organized
(likely already exists per Instagram, per the audit) and needs Steve to
actually commit to one name/domain before "One Name" can be true - the
concept doesn't work half-adopted across two still-separate sites.

What makes this different from the other portfolio sites: this is the only
territory in this pipeline built directly from a client-chosen reference
rather than derived independently - and the discipline is entirely in what
got left OUT of that reference (the product-tier catalog) rather than what
got added.

---

## What to verify before building

- Which domain Steve actually wants to keep (sw-cabinets.com vs
  702kitchens.com) - "One Name" needs a real answer, not an assumption
- Real project photography inventory - pull from Instagram + ask Steve
  directly for his best, highest-resolution project shots
- Whether his real buyer mix is homeowner-direct or designer/architect-
  referred (changes the "journey" nav's actual stops)

## Note on process

The master brief's own workflow calls for three independently-derived
territories before a pick (Product / Customer / Story, as built for AF
Woodworker). Jennifer skipped straight to a reference she already trusts here,
which is a legitimate shortcut when the client already knows the direction -
but if you want a real comparison before committing, say so and two more
territories (e.g., one built from SW's family-owned story, one built from the
client's buying journey) can be produced the same way AF Woodworker's were.
