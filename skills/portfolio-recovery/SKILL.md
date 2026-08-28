# Portfolio Recovery Factory

Turn messy contractor project photos into portfolio-ready website and social image
sets. Kitchens, bathrooms, and small remodels.

## The principle that governs everything

The machine does the work. Jennifer is the art director: she picks the frames she
likes, says what to fix in plain words, and approves the output. She is never the
photo editor.

Two lanes:
- **Free local lane** (this repo, deterministic, no cost): grade, cull, auto-orient,
  crop/export, before/after, contact sheets. Runs on Python + Pillow via the scripts
  in `scripts/photo-factory/`.
- **Paid generative lane** (Jennifer's own Gemini or ChatGPT subscription): the few
  steps that must invent pixels - completion (a missing installed item like shower
  glass), decluttering, staging, relight. The machine never spends money here. It
  hands Jennifer a generation card (prepped image + locked prompt + drop folder),
  she runs it, drops the result back.

Governing build rules:
1. One clean master per viewpoint. Generate once on the master, then crop. Never
   clean or stage each crop separately or details drift between the hero and the thumb.
2. Auto-orient every photo before any crop. Phone photos carry an EXIF rotation flag;
   cropping the raw buffer produces a rotated crop. `photolib.load_oriented()` handles
   this. It is not optional.
3. Completion items get a Q&A spec first (see Stage 4). The model guesses wrong
   otherwise - during the test build it put a shower door on the wrong swing and a
   50/50 split that was not real.
4. Completion must be a MASKED / composite edit, not a full-frame regenerate. A full
   regenerate redraws the whole photo, so the real tile and fixtures become synthetic
   approximations that drift. Freeze the photo, paint only the new object.
5. The "after" in a before/after stays a real restored photo, never synthesized. It
   is a testimonial about a specific job.
6. No em dashes, no emoji, premium output, honest quality, never auto-publish.

## Project folder convention

```
clients/<slug>/photos/
  raw/                 <- everything the contractor sent, untouched
  masters/             <- one clean master per viewpoint (after the free + paid lanes)
  generated/           <- drop folder: results Jennifer pastes back from Gemini/ChatGPT
  cards/               <- generation cards the machine writes for Jennifer
  final/
    portfolio/         <- hero.jpg, gallery-01..NN.jpg
    website/           <- website-hero, website-banner, portfolio-thumb, google-business
    social/            <- square, instagram-portrait, pinterest, facebook-linkedin
    before-after/      <- side-by-side panels
  review/              <- contact sheets + grade report for Jennifer
```

---

## Stage 1: Grade, bucket, rank (free, vision only)

The front door. Ingest 30+ photos, look at each, and produce a ranked work plan
before spending a single generation credit. This is a vision task the agent does by
reading the images directly. No image generation, so it is free.

For each photo, record this schema:

```json
{
  "file": "Photo Sep 11 2024, 12 47 13 PM.jpg",
  "room": "bathroom",              // kitchen | bathroom | laundry | fireplace | exterior | other
  "phase": "after",               // before | during | after
  "scores": {
    "composition": 8,             // 1-10, is the framing usable
    "lighting": 6,                // 1-10, exposure/white balance/contrast as shot
    "sharpness": 8,               // 1-10, resolution and focus
    "staging": 5,                 // 1-10, clutter-free and tastefully styled
    "cleanup_needed": 3           // 1-10, how much generative work to make it shine (LOWER is better)
  },
  "hero_score": 7.5,              // weighted overall, see formula
  "flaws": ["photographer reflection in mirror", "soap bottle and rag on counter"],
  "disqualifiers": [],           // blown window, person in frame, unfixable blur -> cannot be a hero
  "subject": "double vanity",    // the thing the photo is of, used to group duplicate angles
  "use": "category-hero"         // main-hero | category-hero | gallery | supporting | reject
}
```

**hero_score formula** (composition and lighting matter most for a hero, cleanup is a
penalty because generative work risks the AI look):

```
hero_score = 0.30*composition + 0.25*lighting + 0.20*sharpness
           + 0.15*staging + 0.10*(10 - cleanup_needed)
```

Any disqualifier caps `use` at `gallery` at best and forbids `main-hero`.

**Bucketing and ranking** across the whole folder:
- **main-hero**: the single highest hero_score across all rooms with zero
  disqualifiers. One per site.
- **category-hero / top-N**: within each room type, rank by hero_score. "Top 10
  kitchens" = the 10 highest-scoring kitchen afters. "Top 5 baths" likewise. These
  head the category pages.
- **gallery**: solid afters that are not heroes. Fill out project galleries.
- **supporting**: 1-3 acceptable frames of smaller jobs, to show range.
- **reject**: below threshold or unfixable. Logged with the reason, never silently
  dropped.

This feeds the tiering in the main CLAUDE.md (Hero 8-12 projects get full treatment,
Standard 10-15 get 3-6 images, Supporting get 1-3). The grader decides which projects
earn generation budget before any is spent.

Output: write `review/grades.json` (the array) and a human summary, and build a
contact sheet (Stage 7 tool) so Jennifer sees the ranking visually.

---

## Stage 2: Cull, group, select masters (free)

1. **Group** photos into projects by room and continuity. Watch for stray photos that
   do not belong (during the test build, a finished kitchen was mixed into a bathroom
   set - it was kicked to its own project).
2. **Collapse duplicate angles.** The same subject shot several ways (a shower from
   three angles, a vanity from four) becomes ONE master plus alternates. Pick the
   master by hero_score. The alternates become crop sources or gallery frames, not
   separate edits.
3. **Select one master per viewpoint.** A viewpoint is a distinct camera position, not
   a distinct crop. You cannot rotate the camera in post, so if a shot does not exist
   as a viewpoint, it does not exist - do not plan to generate a new angle from
   nothing (that is where the AI look lives). Crop what you have; if a needed shot was
   never taken, mark it "reshoot" rather than invent it.

---

## Stage 3: Clean (mostly free, some paid)

Order matters. Do the faithful, deterministic work first, generative work last, each
generative pass masked as tightly as possible on a base that is already correct.

1. **Geometry + optics** (free-ish): straighten verticals, fix perspective, crop.
2. **Tonal** (free-ish): exposure, white balance, shadow lift, denoise. Most "bad
   lighting" is underexposure and white balance and fixes losslessly. Only escalate to
   a generative relight when tone cannot save it.
3. **Removal** (paid, masked): construction junk, tools, tape, cords, a rag or soap
   bottle on the counter. Masked inpaint so nothing else is touched.

Steps 1-2 can often be done well enough with a one-tap auto-adjust or by asking the
generative tool for a light touch; keep them out of full-frame regeneration.

---

## Stage 4: Completion (paid, masked, GATED) - generation cards

Only when an actually-installed item is missing from the photo (shower glass, a
mirror, cabinet pulls that were installed but absent). This is the hardest step and
the one that drifts. Two hard requirements:

**A. Q&A spec before generating.** The machine asks Jennifer the item's real spec so
the model does not guess. For a shower enclosure:
- Door type: hinged, sliding, or fixed panel only
- Hinge side and swing: left or right, in-swing or out-swing
- Split: single full-width door, or door + fixed panel, and the rough ratio (a 24 inch
  door beside a 36 inch panel is not 50/50)
- Return panel or header notch
- Handle: side, style, finish
- Hardware finish to match existing fixtures

**B. Masked / composite instruction, not a full regenerate.** The card tells Jennifer
to use an edit mode that keeps the rest of the photo identical and paints only the new
object (Photoshop generative fill with a selection, or Gemini/ChatGPT with an explicit
"keep everything else identical, add only the glass in the front opening"). If the
whole image comes back subtly redrawn, that is the tell it regenerated - reject it.

The machine writes a generation card to `cards/` (template:
`generation-card-template.md`) and prepares the input image in `masters/`. Jennifer
runs it, drops the result in `generated/`. See Stage 8 for the QA gate on the result.

---

## Stage 5: Staging (paid, additive)

Warm California editorial, restrained. Kitchen: a bowl of lemons, a linen towel, a
wood board, simple greenery. Bath: folded towels, a soap dispenser, a candle,
eucalyptus. Additive/masked so cabinets and hardware are not regenerated. Resist the
model overdoing it. Done on the master, once, before cropping.

---

## Stage 6: Export crops (free)

`scripts/photo-factory/export_crops.py MASTER OUTDIR --name SLUG`

One approved master into the 8 marketing ratios (website hero 16:9, banner 21:9,
thumb 4:3, square 1:1, instagram 4:5, pinterest 2:3, google-business 4:3,
facebook-linkedin 1.91:1). Auto-oriented, faithful, instant. `--anchor` biases the
vertical crop center (default 0.42, slightly high so mirrors and faucets are not cut).

---

## Stage 7: Before/after + contact sheet (free)

`scripts/photo-factory/beforeafter.py BEFORE AFTER OUT.jpg` - side-by-side panel with
sage BEFORE/AFTER labels, matched heights. After must be a real restored photo.

`scripts/photo-factory/contactsheet.py FOLDER OUT.jpg --cols 4 --title "..."` - a
numbered, captioned grid for approval. One per project.

---

## Stage 8: QA gate (assisted + Jennifer approves)

Check each generated result against its source, in this order:
1. **Functional plausibility first** (the miss during the test build): does a door
   swing a way it physically can, is the split real, does hardware sit where it
   mounts. A functional error reads as fake instantly.
2. **Regeneration tell**: is the whole frame subtly redrawn (tile scale shifted,
   fixtures re-rendered)? If yes it was a full generate, not a mask - reject.
3. **AI artifacts**: warped geometry, impossible reflections, melted fixtures,
   over-smoothed surfaces.
4. **Fidelity to the contractor's real style** (not pixel-exact, but same materials
   and look).

Verdict: pass, or send back with a specific fix note. Give up to a couple retries;
if it keeps drifting, that completion stays a manual job and is logged as such.
Nothing multiplies into crops until it passes this gate.

---

## Tool routing

| Work | Where | Cost |
|---|---|---|
| Grade, cull, rank, QA judgement | Claude vision (the agent) | free |
| Auto-orient, crop/export, before/after, contact sheet | `scripts/photo-factory/` (Python + Pillow) | free |
| Removal, completion, staging, relight | Jennifer in Gemini (Nano Banana) or ChatGPT via generation card | flat-rate sub |

Gemini / Nano Banana is first choice for masked edits (best at keep-everything-else).
Full-frame text-to-image models are wrong for completion - they regenerate and drift.

## Scripts

| Script | Purpose |
|---|---|
| `photolib.py` | Shared: `load_oriented()` (the EXIF fix), crop/contain/font helpers, the 8 export ratios |
| `export_crops.py` | One master into the 8 marketing ratios |
| `beforeafter.py` | Before/after side-by-side panel |
| `contactsheet.py` | Numbered, captioned approval grid |

Requires Python 3 and Pillow (`python3 -m pip install --user Pillow`).

## Long-term

This factory is the internal engine and the productized "Portfolio Recovery System"
service at the same time - the same code that fixes Jennifer's own client photos is
the thing she sells: imperfect jobsite photos turned into accurate, portfolio-ready
marketing assets without misrepresenting the work.
