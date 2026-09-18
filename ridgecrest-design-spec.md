# Ridgecrest Designs — Full Design Spec

Pulled directly from raw HTML/CSS/JS (curl, not the rendered page — WebFetch
converts to markdown and loses all of this). Source: ridgecrestdesigns.com,
main.css, main.js, sitemap.xml. Captured 2026-09-18.

---

## Site Map (379 URLs total in sitemap.xml)

**Core pages (10):** Home, About, Team, Process, Services, Portfolio, Press,
Blog, Contact, Start a Project

**Service pages (11):** custom-homes, whole-house-remodels, kitchen-remodels,
bathroom-remodels, design-build, interior-design, home-renovation,
home-addition, general-contractor, adu-contractor, architect

**Individual project pages (10+):** pleasanton-oak-farmhouse, danville-hilltop,
danville-dream, napa-retreat, alamo-luxury, castro-valley-villa,
diablo-country-club, allprojects, and more — each a real named project, not a
generic template.

**Blog (~350 posts) — this is the real local-SEO engine, correcting my
earlier note in design-inspiration.md:** I originally assumed a dedicated
landing page per service x city combination. That's wrong. The actual
architecture is a huge blog, split into two real content types:
1. **Hyper-local SEO posts**, one per neighborhood/city + angle: "remodeling-
   in-blackhawk-danville," "bathroom-remodeling-in-moraga-a-local-
   homeowners-guide," "kitchen-contractors-orinda," "home-remodeling-walnut-
   creek," "room-additions-in-san-ramon-cost-scope-and-timeline." This is
   where the 12 service-area cities actually get their SEO surface area, as
   long-form guide posts, not thin landing pages.
2. **Design/lifestyle content**: color trend posts, seasonal styling,
   material guides, project features, a Q&A post. Keeps the blog from
   reading as purely SEO-bait.

---

## Real Copy (verbatim, homepage)

**Hero:**
- Eyebrow: "Luxury Design-Build · East Bay, California & Weatherford, TX"
- H1: "Your Vision, *Flawlessly Built*"
- Sub: "Photo-realistic renders. Integrated delivery. Flawless execution.
  Experience the Ridgecrest difference."
- CTAs: "Start Your Project" / "View Portfolio"

**Statement:** "Est. 2008 · Pleasanton, CA" / "We design and build homes the
way they were meant to be experienced." / "We work best with homeowners who
see the value in hiring a team of professionals, trusts and appreciate a firm
that executes it without compromise. If that's you, we should talk."

**Services (4 cards, each: name, one-line description, starting price):**
- Custom Homes — "Luxury custom homes from $5M to $10M+. We manage design,
  engineering, permitting, and construction under one roof — with photo-
  realistic renders before we break ground." — Starting at $5M
- Whole House Remodels — "Complete home transformations starting at $1M. We
  handle the full scope — architecture, structural, interiors, and
  construction — with zero gaps in accountability." — Starting at $1M
- Kitchen Remodels — "High-specification kitchen renovations starting at
  $150,000. Custom cabinetry, stonework, and premium appliances — designed
  and built to last decades." — Starting at $150K
- Bathroom Remodels — "Master and primary bathroom renovations starting at
  $60,000. Spa-quality craftsmanship with materials and finishes chosen for
  longevity and visual impact." — Starting at $60K

**Why Ridgecrest (4 items):** "See your home before we build it" (photo-
realistic renders) / "Integrated Design-Build — one team, one contract, no
gaps" / "Permitting & Engineering Expertise — we know California code inside
and out" / "Specialized Teams — the right craftsmen for every phase" /
"Clear Communication — progress updates built into our process"

**Process (5 stages, "Five stages. Zero surprises."):** Consultation → Design
→ Budget & Proposal → Build → Completion

**Portfolio preview:** 4 real projects, each with city + project name +
category (e.g. "Pleasanton, CA / Pleasanton Modern Farmhouse / New Custom
Home")

**Service areas (12, plain list, no per-city landing page from the nav):**
Pleasanton, Walnut Creek, Danville, Lafayette, Orinda, Alamo, San Ramon,
Dublin, Moraga, Diablo, Rossmoor, Sunol

**FAQ (5 questions)** — includes real numbers: "$400 to $600 per square foot
to build, and about $400 to $600 per square foot to finish," "about a year
to plan and design, and about a year to build."

**Final CTA:** "Ready to build something extraordinary? Tell us about your
project. We'll follow up within one business day." + phone: 925-784-2798

---

## Colors (real CSS variables)

```
--accent-dark:  #A89070
--gold/accent:  #C8B89A
--charcoal:     #1C1C1C
--dark:         #111111
--light:        #E8E4DC
--mid:          #9E9E8E
--off-white:    #F2EFE9
--slate-light:  #80A4C8
--slate:        #607B8E
--white:        #FAFAF8
```

Muted gold/tan as the one accent, a cool slate-blue as a secondary accent
(used on primary buttons), everything else is warm neutral. Restrained —
two accent colors total, not a rainbow.

## Typography

```
--font-display: 'Cormorant Garamond', Georgia, serif   (headlines, italic accents)
--font-sans:    'Jost', 'Helvetica Neue', Arial, sans-serif   (body, labels, buttons, nav)
```

- h1: `clamp(2.8rem, 6vw, 5.5rem)` = 44.8px–88px, weight 400, line-height 1.15
- h2: `clamp(2rem, 4vw, 3.5rem)` = 32px–56px
- h3: `clamp(1.3rem, 2.5vw, 1.8rem)` = 20.8px–28.8px
- Body `p`: line-height 1.8
- Eyebrow/label text: 0.65–0.75rem, letter-spacing 0.15–0.25em, uppercase
- Headings are weight 400 (not bold) — the SIZE carries the emphasis, not
  weight. This is a real, specific choice worth carrying: a huge, thin serif
  headline reads as more expensive than a bold one.

## Buttons

```css
.btn {
  font-family: Jost; font-size: 0.75rem; font-weight: 500;
  letter-spacing: 0.15em; text-transform: uppercase;
  padding: 1rem 2.2rem; transition: 0.3s cubic-bezier(0.4,0,0.2,1);
}
```
- `.btn--primary`: bg slate (#607B8E) → hover charcoal
- `.btn--ghost`: transparent, 1px rgba(255,255,255,0.5) border, white text →
  hover bg rgba(255,255,255,0.08)
- `.btn--ghost-sm`: smaller (0.7rem, padding 0.6rem 1.4rem)
- `.btn--dark`: bg charcoal → hover slate
- `.btn--outline`: 1px charcoal border/text → hover fills charcoal
- `.btn--lg`: padding 1.2rem 3rem, 0.8rem

**No border-radius on buttons at all** — sharp rectangles. That's a real,
specific "quiet luxury" signal; rounded pill buttons read as more casual/
consumer, sharp corners read as more architectural/considered.

## Spacing (a real token scale, not eyeballed)

```
--space-xs: 0.5rem   (8px)
--space-sm: 1rem     (16px)
--space-md: 2rem     (32px)
--space-lg: 4rem     (64px)
--space-xl: 7rem     (112px)
```
Compresses at smaller breakpoints (xl drops to 4rem/3rem, lg to 2.5rem/2rem).
The jump from `md` to `lg` to `xl` is roughly 2x each step — a real
geometric scale, not arbitrary numbers.

## Effects

- **One transition timing used everywhere**: `0.3s cubic-bezier(0.4,0,0.2,1)`
  — buttons, nav, links, all the same curve. Consistency, not a different
  easing per element.
- **Border-radius**: minimal and inconsistent by design — 4px/6px on small
  elements, 50% on circular dots/icons, one 40px pill somewhere (likely a
  filter tag). Buttons themselves stay sharp.
- **Box-shadow**: almost none. Only real shadow found: a 1px bottom shadow
  on the nav once scrolled. This is a "flat luxury" look — photography and
  contrast do the visual work, not drop-shadows stacked on every card.
- **Motion**: hero Ken-Burns zoom + a pulsing scroll-cue line (scrollPulse
  keyframe) + IntersectionObserver-driven scroll-reveal fades throughout.
