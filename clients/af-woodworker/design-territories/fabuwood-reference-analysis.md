# Fabuwood - Reference Analysis

Jennifer's pick for AF Woodworker's direction (2026-09-11), same pattern as
SW Custom Cabinets' Medallion reference. fabuwood.com blocks direct scraping
(sits behind a Vercel bot-check, returned 429 to both WebFetch and curl), so
this is built from a Wayback Machine snapshot plus the site's real featured
image - solid on structure and positioning, thinner on exact color/type
tokens than the Medallion analysis (that site's own inline styles were
fully readable; Fabuwood's are split into hashed Next.js CSS chunks that
weren't practical to pull apart).

## What it is

A New Jersey-based cabinet *manufacturer* (Next.js site, not WordPress),
selling two named product lines through a dealer network - the same
manufacturer-scale business model as Medallion, with the same caution that
implies: structural elements built for "standardized lines through third
parties" do not fit a bespoke shop.

## Real findings

**Hero positioning:** "America's most desired kitchen." - a bold, outsized
confidence claim. Not something AF Woodworker (two founders, ~3-4 years old)
can credibly say, and shouldn't try to borrow the SCALE of the claim, only
the *confidence* of tone.

**The "outperform" section:** "Elevated Value / Quality made attainable,"
"Impossibly reliable speed / More at every budget," "A dozen ways we
outperform." A quantified-differentiator device - confident, stat-forward
claims about why they're better. Real device worth adapting, but only with
AF's own real, honest differentiators (CNC precision, 2D/3D modeling before
production, direct founder involvement) - never invented performance stats.

**Visual identity (from the real featured image, see
`fabuwood-hero-reference.png`):** a lowercase wordmark ("fabuwood") paired
with a distinctive geometric icon mark - an abstract interlocking-diamond
shape, modern and architectural. Photography: warm mixed-wood cabinetry
against a matte black island, big natural-light window, styled but not
overdone. This register (modern, geometric, photography-forward) fits AF
Woodworker's own self-description ("modern, sleek, minimalist") much better
than Medallion's ornate register fit SW.

**Two named product lines:** Allure (traditional, framed overlay) and Illume
(European, frameless overlay), plus Hoods and Vanity categories. Same
pattern as Medallion's Silver/Gold/Platinum/Frameless - a manufacturer's
catalog structure. **Does not translate** - AF Woodworker builds one-off
custom pieces, not two selectable overlay styles across a product range.

**Dealer network:** `/become-a-dealer`, `/dealers` - irrelevant, AF sells
direct.

**Content section:** "Fabuwood at Large" / "Latest Looks" - a blog/content
hub, structurally similar to the "Guides" section already built for SW
(cost guides, how-tos). Same device, reusable pattern.

**Motion:** uses Swiper (a carousel library), not GSAP/ScrollTrigger - no
elaborate scroll-jacked hero sequence like Medallion. Simpler to adapt: no
complex scroll choreography needed here, carousel-driven interactions are
enough.

**Color-AI tool:** an AI-powered cabinet color visualizer (per search
results, a real live feature). Flashy and clearly a real budget item for a
manufacturer - flagged as a future-consideration idea, not something to
build into a rough draft now.

## What's genuinely missing for AF Woodworker

**No real logo exists.** Checked afwoodworker.com directly (Squarespace) -
no logo image asset anywhere in the page source, just a plain text site
title. Unlike SW, there's nothing real to pull in for a "logo reveal"
moment. Two honest options: design AF Woodworker a real mark (Fabuwood's own
geometric icon is a reasonable style reference for what that could look
like, given AF's engineering/CNC-precision differentiator), or build the
hero around their name as clean typography instead of a mark, until they
have one. Flagging rather than fabricating a fake logo.

## What to borrow vs not, for AF Woodworker

| Borrow | Leave out |
|---|---|
| Modern, geometric, confident visual register (fits AF's own "modern, sleek, minimalist" self-description) | The two-named-product-line catalog structure (Allure/Illume) |
| The quantified-differentiator device, filled with AF's real facts (CNC, 2D/3D modeling, founder-led) | The outsized "most desired" scale of claim |
| Photography-forward hero, warm materials, natural light | The dealer network structure |
| A content/guides section (already proven for SW, same pipeline) | The AI color visualizer (flag as future idea, not now) |
| Simpler carousel-based motion (Swiper), no need to replicate a GSAP scroll sequence | - |
