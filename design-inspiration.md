# Design Inspiration

Reference sites worth pulling from for a specific upcoming build, not general
mood-boarding. Note WHICH client each one is earmarked for as soon as that's known.

---

## lingers.it/en

**Earmarked for:** a client soon (name TBD, add here once confirmed).

**What it is:** Lingers, a boutique hotel and vacation residence in Girlan
(Eppan), South Tyrol, Italy. Wine-country hospitality, intimate and curated.

**Why it's the reference:** full-width cinematic photography carousel in the
hero, a vertical narrative arc (value prop -> property overview -> the
experience -> press credibility -> room showcase -> gallery), soft muted
palette, generous whitespace, conversational-but-luxury copy tone ("Check in
and switch off"). Reads as considered and slow, not templated.

**What to actually port for the new build (once named):**
- Hero: full-bleed photo carousel or a slow drift/zoom, not a static banner
- Section order as a narrative arc, not a features grid
- Press/credibility strip if the client has real press or notable mentions
- Room/offering showcase with real pricing shown plainly, not hidden behind a "contact us"

**What NOT to copy directly:** the exact palette/type pairing (pick fresh per
client, same anti-cloning discipline as every RR build so far) and anything
hotel-specific that doesn't map to the new client's actual business.

**Related, same swipe session:** music.zajno.com (scroll-triggered "record
box" reveal, the idea that became AF Woodworker's drawer-gallery device) and
woolmers.com.au (heritage-site cinematic scroll, informed AF's hero
parallax/reveal-on-scroll treatment). Both already spent on AF Woodworker's
rebuild, see `remodelerrank/clients/af-woodworker/mockup/index.html`. Lingers
itself hasn't been spent on a build yet, that's what this entry is for.

---

## smeulders-ig.nl

**Earmarked for:** Arnold + Egan. Already partially spent, see below.

**What it is:** Smeulders Interieurgroep, a Dutch commercial interior
fit-out firm. Real named corporate clients: Unilever, DLA Piper, PSV,
Palo Alto Networks, plus government/institutional work (Vredespaleis,
Tweede Kamer). Awwwards-recognized.

**Why it's the reference:** the closest real-world match found so far to
A+E's actual target audience, B2B, commercial/institutional, GC and
architect-facing, not residential. Projects are titled by client name
first ("PSV Executive Floor," "Unilever AIR"), not a generic description.
Real, working filter tabs on the projects page: Alle projecten /
Hospitality / Retail / Utility / Woningen (residential), the exact
commercial-forward taxonomy A+E's own portfolio needed. Designer/architect
credits shown per project.

**Already spent on A+E:** the working sector-filter tabs on
`clients/arnold-egan/mockup/portfolio.html` (2026-09-17), and the
"Design partner" credit line per project card (currently the placeholder
"SF Designs R' Us" until real credits are confirmed).

**Not yet spent, still open:** whether A+E's "Wellness" category should
become something closer to Smeulders' "Utility" (office/institutional),
matching what discovery surfaced about A+E wanting more commercial work.
Held per A+E's own rule not to finalize categories before real project
inventory is known.

---

## emaratrealty.com/projects/c2

**Earmarked for:** Arnold + Egan, project-detail page template. Not spent
yet, logged for later per Jennifer's call not to touch A+E's one existing
project page (Champion's Bar) on this pass.

**What it is:** a real estate developer's individual project page.

**Why it's the reference:** Jennifer's read on the structure, a clear
before -> project features -> story -> after flow, rather than the
narrative-then-specs order A+E's Champion's Bar page currently uses.
Couldn't get a clean second look, the site rate-limited the research
fetch, so the exact section mechanics (photo treatment, whether "before"
is a real photo or a text framing, how "features" are laid out) still
need confirming before building from it.

**What to check before building:** whether "before" assumes a
renovation (a real before-photo) or works for new-build commercial work
too, since A+E doesn't have a real "before" photo for Champion's Bar and
one shouldn't be invented. A text-framed "before" (the real starting
brief) may be the honest substitute if the reference turns out to be
renovation-specific.

---

## ridgecrestdesigns.com

**Earmarked for:** Jennifer's own portfolio work (RemodelerRank's site
and/or future client builds), flagged 2026-09-18. Not spent yet.

**What it is:** Ridgecrest Designs, a luxury custom home design-build
firm in the East Bay (Pleasanton, CA), est. 2008, with a second office
in Weatherford, TX. High-end, full-service: custom homes ($5M-$10M+),
whole-home remodels (from $1M), kitchens (from $150K), bathrooms (from
$60K).

**Why it's the reference:** clean, confident, premium without being
cold. Serif display headlines with italicized accent words for rhythm
("Your Vision, *Flawlessly Built*"), sans-serif body for readability,
real hierarchy through size and weight rather than decoration. Copy is
consultative, not salesy ("One team. One contract. No gaps."). Real
credibility signals stacked plainly: "Est. 2008," five-star ratings
across Google/Houzz/Yelp, a California Home + Design feature, real
starting prices stated per service instead of hidden behind "contact
us." A five-stage process section explains exactly how a project runs.
Likely built on Webflow (clean markup, no visible custom framework).

**The real structural lesson, not just the look:** this is a 40+ page
site, and that's deliberate, not bloat. Service x location architecture
(4 core service pages x 12 real named service-area cities: Alamo,
Danville, Diablo, Dublin, Lafayette, Moraga, Orinda, Pleasanton,
Rossmoor, San Ramon, Sunol, Walnut Creek) means every city gets its own
real page to rank for, instead of one generic "service area" list. Plus
a blog ("The RD Edit"), a Press page, individual project pages per real
build, a Team page. The design is the visible layer; the page-count and
IA are what actually let it outrank a nicer-looking but thinner
competitor site.

**What's actually missing, worth noting before treating it as flawless:**
no visible client quotes or real case-study breakdowns despite four
named projects listed, no video content, Press and Team links exist but
weren't confirmed to have real content behind them, no visible
before/after photo pairing (surprising for a remodel-heavy business).

**What to actually port:** the serif/italic-accent headline treatment,
transparent starting-price-per-service pattern (matches the
nothing-hidden discipline already used in RR client work), the
service x location page architecture for any client with multiple real
service areas, the five-stage process explainer pattern.

**What NOT to copy directly:** the exact palette/type pairing (pick
fresh per client, same anti-cloning discipline as every build so far),
and the price points themselves, obviously specific to a $1M+ luxury
home-building business, not directly transferable to a cabinet shop or
millwork manufacturer.
