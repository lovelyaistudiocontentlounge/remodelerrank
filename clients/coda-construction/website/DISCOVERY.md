# Coda Construction - Discovery (verified)

Last updated: 2026-07-06. Source of truth for the website rebuild. All platform data
(GBP, schema, footer) must be copy-pasted from here, never retyped. Verify every gap
with the owner before build sign-off.

## Business identity (verified from live site)

| Field | Value | Source |
|---|---|---|
| Legal name | Coda Construction Inc | Facebook page handle |
| Display name | Coda Construction | logo, site |
| What they are | Residential construction and remodeling general contractor | site H1 |
| CSLB license # | 949820 | site footer, VERIFIED on page |
| Founded | 2010 (about 15 years) | site copy "since 2010" |
| Address | 8095 Aldea Street, Dublin, CA 94568 | owner-provided (matches GBP) |
| Phone | 925-785-6367 | site (consistent everywhere) |
| Email (use this) | info@coda-construction.com | branded, confirmed by Jennifer. Retire the old etorrez1@comcast.net shown on current site |
| Owner | Elias Torrez | confirmed by Jennifer |
| Facebook | https://www.facebook.com/codaconstructioninc/ | site |
| Hours | Mon-Fri 8am-5pm | confirmed by Elias |
| Financing | None offered | confirmed by Elias |

### Address / business model (home office) - DECISION

His address is a home office, but it is ALREADY published everywhere (GBP, Houzz,
citations) and consistent. Decision rule: NAP must stay consistent across all
platforms. Do not hide it on the site only - that creates inconsistency with zero
privacy gain.

Default (recommended): KEEP showing the address, matching his GBP and citations. It is
established, adds legitimacy, and privacy is already gone. Footer + schema include it.
Schema is LocalBusiness with BOTH the address AND areaServed.

Alternative: only if Elias actively wants his home address out of circulation, do a
FULL service-area conversion everywhere (GBP to SAB + hide, scrub citations, drop from
site). Bigger cross-platform project. Do not half-measure.

Status: pending Elias's privacy preference. Building to the default (show it) unless he
objects.

### Owner photo (trust asset) - CONFIRMED

Elias is in JBP_HLID_RoyalOaks_9.14.23.028.jpg - an environmental portrait leaning on
the marble counter in the Royal Oaks kitchen he built. Use the FULL frame as the
About-Elias image (man + his craftsmanship in one shot, authentic). Strong enough to be
a secondary hero option too. No tight headshot crop needed.

## Service area (verified)

Focus (per Jennifer): Dublin, Pleasanton, Livermore first (Tri-Valley core), plus
more. Full list coming from Jennifer. Site/mockup also mention Walnut Creek, Lafayette,
Danville, San Ramon, Blackhawk, Pleasant Hill, Concord, Orinda, Moraga, Alamo, Castro
Valley. Lead the copy with the Tri-Valley core; treat the rest as extended reach until
the final list arrives.

## Services (confirmed by Elias 2026-07-07)

Keep: Kitchen Remodeling, Bathroom Remodeling, Whole-Home Renovation.
Reframe: "Room Additions" becomes "Room Expansions" - expanding/reworking space as part
of a kitchen or bathroom remodel, NOT standalone home additions.
REMOVE: ADU / In-Law Suites, Outdoor Living.
Suggested add (ties to his story): Custom Cabinetry & Woodworking - Elias's craft.

## Elias origin story (source notes for About copy)

Raw notes from Elias, to be polished into the About section:
- Left corporate America, went back to his blue-collar family roots.
- Grew up without much money; learned early that when things break, you fix them yourself.
- Grandfather, uncles, cousins all in construction. Grew up doing the work.
- Fell in love with woodworking - building tables and cabinets by hand.
- Hired a contractor for his own home and was displeased with the service and
  communication. It inspired him to build a better version.
Polished draft lives in COPY-home.md (About section).

## Site roadmap (future phases, per Elias)

- Phase 2 (after design approval): a qualifying intake form where clients specify
  components - cabinets, appliances, countertops, etc.
- Phase 3: estimating software / interactive builder where a client builds their own
  scope and estimate.

## Brand (verified from logo + existing mockup)

The logo is a dark crimson/maroon oval wordmark, so crimson is the real brand color.
The existing RemodelerRank mockup already refreshed this into a usable system:

| Token | Hex | Use |
|---|---|---|
| Crimson (primary) | #7D1E24 | brand, CTAs, accents |
| Crimson dark | #5C1519 | hovers |
| Brass (accent) | #C9A96E | eyebrows, rules, detail |
| Charcoal | #1E1E1E | dark sections, footer |
| Off-white | #FAFAF8 | page background |
| Text | #3A3A3A | body |
| Border | #E0D8D0 | hairlines |

Fonts: Playfair Display (headings), DM Sans (body). Reads premium and derives from
the logo. Owner wants a refresh, so treat this as the starting system to elevate, not
a locked spec.

## Photos (verified, already graded)

Coda Dublin pro-shot set (7 photos): white shaker kitchen (hero material) plus a brick
fireplace. Graded as Tier A, portfolio-ready. See the photo grader output. This is the
hero imagery for the home page.

## Design head start

The existing mockup (`clients/coda-construction/mockup/index.html`) is already a
refreshed Builder Funnel page in his brand. The design buy-in page is largely a matter
of swapping in REAL content and REAL photos, not designing from zero.

## Gaps - status

Resolved 2026-07-06:
- Owner name: Elias Torrez.
- Email: info@coda-construction.com (branded).
- Address: home office, service-area business, no public street address needed.

Resolved 2026-07-06 (cont.):
- Real reviews captured verbatim in REVIEWS.md (4 real, from Houzz/Yelp). Replaces the
  fabricated mockup placeholders.
- Houzz profile: https://www.houzz.com/professionals/general-contractors/coda-construction-inc-pfvwus-pf~1992973856
- Royal Oaks is a real Coda build by Elias (portfolio + hero material). Elias is the
  man in the Royal Oaks frame - crop as owner headshot.

Still open (Jennifer grabbing / owner):
1. Real Google rating and review count - to justify or drop the "5-Star on Google"
   claim (Golden Rule 13). Houzz reviews are in hand regardless.
2. Remaining platform URLs: Instagram, Yelp, BBB, Google Business Profile.
3. Google Search Console: access needs owner verification. Redirect map stays DRAFT
   until we get top-ranking pages (via Elias verifying, or delegated access). Not a
   Phase 1 blocker; we 301 everything safely at launch either way.
4. Certifications - site says "certified"; confirm which.
5. Confirm true service-area city list.
6. Confirm exactly which Royal Oaks frame is Elias (for the headshot crop).
