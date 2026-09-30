# Medallion Cabinetry - Full Reference Analysis

Deep pass on medallioncabinetry.com, built by pulling the actual page source
(not just a rendered summary) to see the real scroll mechanism Jennifer wants
to reference. Stack: WordPress + Divi Builder theme, GSAP 3.14.1 +
ScrollTrigger + CustomEase loaded from jsdelivr, plus a small custom inline
script that drives the homepage hero specifically.

## The hero: not simple parallax, a pinned scroll-scrubbed sequence

This is the real "wow" moment and it's more deliberate than a standard
parallax effect. The mechanism:

1. The hero section is **pinned** to the viewport via
   `ScrollTrigger({ trigger: ".pg_hero2", pin: true, scrub: 1, end: "+=200%" })`
   - the page stops scrolling normally for a distance equal to 2 full screen
   heights, and everything below is choreographed to the scroll position
   itself (`scrub: 1`), not to time. Scroll slowly, the animation moves
   slowly. Scroll fast, it catches up. This is what makes it feel controlled
   rather than like a video playing on top of scrolling.

2. **Seven horizontal bands** (row1 through row7) change height in sync,
   opening and closing like a shutter or venetian blind across the frame -
   some grow, some shrink, all timed to the same scroll position (GSAP's `"<"`
   position parameter means every tween in this block starts at the same
   moment as the one before it, not in sequence).

3. **At the same instant**, a dark scrim over the hero photo
   (`.pg_home_heroDarken`, sitting at 55% black) fades all the way to solid
   white, and a small arrow icon's fill color shifts from white to a warm
   wood-tone brown (`rgba(159,106,76,1)`) - the exact accent color used
   sparingly elsewhere on the site.

4. **Four hero photographs sweep off-screen in four different directions at
   once** - one slides left-to-right across the entire width, one right-to-
   left, one top-to-bottom, one bottom-to-top - all starting fully
   off-screen and ending fully off-screen on the opposite side. It reads as
   the four images being "blown apart" toward the four edges of the screen.

5. As the images clear, a large brand monogram (**"the Big M"**) fades in and
   rises from below into final position - the reveal underneath the
   photographs is the brand mark itself, on a now-clean white background.

The whole thing runs once, tied to roughly the first 2 screen-heights of
scroll, then releases and the page continues as a normal scroll from there.
It is a single, carefully choreographed unpinning-reveal, not a technique
repeated throughout the site - **checked the door-gallery subpage
specifically: zero custom GSAP there.** The rest of the site relies on Divi
Builder's stock module behavior (fade-ins, simple transitions), not custom
scroll code. This matters: the "wow" is spent once, on the homepage entry,
exactly the restraint this whole master brief argues for ("the hero may
contain an art-directed wow, the rest of the site should be extremely
usable").

## The second motion device: a continuous marquee, not scroll-tied

The "Storage Solutions" section uses a different, simpler technique - a
continuously auto-scrolling horizontal strip (`vanilla-marquee.min.js`) of
isolated product cutout images (corner cabinet, roll-out tray, pocket door
cabinet, drawer boxes, a pet food station), each on a transparent background
with a small caption underneath. This never stops moving and is independent
of scroll position - closer to a museum-case, ever-present catalog strip than
a "reveal." Different tool, different purpose: the hero sells a feeling once,
the marquee is a browsable, always-on inventory of small ideas.

## Homepage section order (confirmed from real headings, not inferred)

1. Hero: "Cabinetry, Refined" (the pinned reveal sequence above)
2. "What shapes our philosophy" (brand story/values)
3. "Product Lines by Medallion" - Silver / Gold / Platinum / Frameless (the
   tier cards - this is the part that does NOT translate to SW, see brand-dna.md)
4. "Doors" (door style gallery teaser)
5. "Storage Solutions" (the marquee)
6. "Fall 2026 Premiere" (new-arrivals feature)
7. "Home Inspiration" (gallery/ideation section)

## What's genuinely transferable to a static site (this pipeline's stack)

Everything above is buildable without WordPress or Divi. GSAP + ScrollTrigger
+ CustomEase are just three script tags from a CDN (the same jsdelivr URLs
Medallion uses), which drop cleanly into a static HTML build the way this
repo already builds client sites. The pinned/scrubbed hero-reveal technique
is a real, portable device - it doesn't depend on WordPress at all, only on
GSAP being loaded. The marquee is even simpler (`vanilla-marquee` is a tiny
standalone library, no CMS dependency).

**What a version of this for SW Custom Cabinets could actually be:** instead
of four product photos sweeping apart to reveal a logo monogram, four real
project photos (a kitchen, a vanity, a closet, a media built-in - his own
range per the audit) sweep apart on scroll to reveal the words "One Name" or
a simple wordmark, with the same dark-to-white scrim fade underneath. Same
mechanism, same restraint (one moment, not everywhere), but built from real
SW project photography instead of a manufacturer's stock imagery.

## What NOT to copy (repeats the brand-dna.md point, worth restating here)

The product-tier structure and the marquee's contents (SKU-style accessory
options) both assume a catalog of standardized, selectable products. SW
doesn't sell configurable lines - it builds one-off work. If a marquee gets
used at all for SW, it should scroll real completed project photos, not
generic accessory categories.
