# RemodelerRank Launch Kit Spec

Drafted 2026-09-30. Not yet built. This is the scoping document, read HANDOFF-portfolio-
project-2026-09-12.md and portfolio-project-backlog.md for the related portfolio/lookbook
project this connects to.

## What this is

A new site launch is a real moment, and right now it gets wasted: the site goes live and
nothing else happens. The Launch Kit is the multi-channel announcement package that goes
out alongside every site launch, across the channels the client's own audience is
actually on. Four parts: email, social, Google Business Profile, print.

## The four channels

### 1. Email (to the client's own list)
- Two emails, not one: a primary "we're live" announcement, then a follow-up about a
  week later highlighting one specific thing (the new project gallery, a guide, whatever
  is strongest for that client). Open rates are never 100 percent, the second email
  reaches people the first one missed.
- Copy is drafted from that client's own brand-dna.md / voice doc (already exists for
  af-woodworker, arnold-egan, sw-custom-cabinets from the portfolio project; Coda has
  COPY-FULL.md). One clear CTA per email, specific to that client, not generic.
- RR drafts the copy. Sending is on the client's own list/ESP unless they ask RR to
  manage sending too (open question below).

### 2. Social (Instagram / Facebook)
- 5 to 7 posts over two weeks: 2 to 3 in launch week, spaced out after.
- Mix: the announcement itself, a portfolio/gallery carousel, a behind-the-scenes or
  process post, a direct CTA post.
- RR hands over ready-to-post images and captions. Whether RR also schedules/posts
  depends on account access, same open question as email.

### 3. Google Business Profile
- 3 to 4 posts over the first month, spaced rather than bunched (GBP rewards an
  actively-updated profile, this is the same "profile freshness" signal from the AI
  search guide on remodelerrank.com/guides/).
- Every post carries a real CTA button (Learn More / Call Now) pointed at the new site,
  not just a text update.

### 4. Print
- One print-ready piece per client: a simple "we're online" postcard or leave-behind
  with a QR to the new site. Same build pattern already proven this session on the Two
  Sets of Tools flyer, true print scale with bleed/trim/safe-area guides, not a rough
  mockup.
- Could double as the seed for the Site Credit / referral page idea (see that scoping
  note), if that page exists by the time a kit ships: "if you know a business whose
  marketing doesn't match their work" framing, same line already proven on the flyer.

## Open decisions before this gets built

These need a real answer, not a default guess:

- **Who posts?** Does RR draft-and-hand-off across all four channels, or actually manage
  sending/scheduling/posting? Very different scope and very different pricing either way.
- **Every client, or a tier thing?** Included at every pricing tier, or an add-on above
  a certain tier (see the Pricing table elsewhere in this file, Launch vs. Presence)?
- **Cadence.** The numbers above (2 emails, 5-7 social posts, 3-4 GBP posts, 1 print
  piece) are a proposed default, not settled. Confirm or adjust per channel.
- **Print for everyone?** Or only clients past a certain tier / only when a real mailing
  address and print budget exist.

## What it needs to actually get built

- Each client's brand-dna.md / voice doc (exists for the three portfolio-project
  clients; Coda's is COPY-FULL.md instead, different format, same job).
- A client-brand-aware version of the social asset generator. The existing carousel
  renderer (`carousel-render.js` in the CONTENTsystem repo) is tuned to the BD/RR brand
  tokens only right now, it would need a per-client token/font input to reuse for this.
- Print files follow the exact pattern already built for the Two Sets of Tools flyer,
  no new tooling needed there, just the per-client content.

## Suggested first build

Coda Construction, once its preview site is rebuilt from the finalized copy and actually
goes live (see clients/coda-construction/website/PICKUP.md), since it is the only client
with a real live site to launch right now. Everything else is still a pitch/mockup stage,
not yet a real launch to announce.
