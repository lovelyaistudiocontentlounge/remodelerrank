# Generation card template

The machine fills one of these per generative task and saves it to
`clients/<slug>/photos/cards/`. Jennifer runs it in Gemini (Nano Banana) or ChatGPT,
then drops the result in `generated/`. The machine QAs it (SKILL.md Stage 8).

Copy the block, fill the brackets, delete the guidance notes. Keep the prompt free of
em dashes and emoji.

---

## Card: <task name, e.g. "shower door - master bath viewpoint 12">

**Task type:** completion | declutter | staging | relight
**Input image:** `clients/<slug>/photos/masters/<file>`
**Tool:** Gemini (Nano Banana) first choice. ChatGPT edit as fallback.
**Edit mode:** MASKED. Keep the whole photo identical and paint only the new object.
If the result comes back with the tile, fixtures, or geometry subtly redrawn, it
regenerated the frame - reject and retry with a tighter mask.

### Completion Q&A spec (fill before writing the prompt)
Only for task type = completion. Answers come from Jennifer, not a guess.

Shower enclosure:
- Door type: [hinged | sliding | fixed panel only]
- Hinge side: [left | right]
- Swing: [in | out]
- Split: [single full-width door | door + fixed panel], ratio [e.g. door 24in + panel 36in]
- Return panel / header notch: [yes/no, describe]
- Handle: side [left/right], style [bar | knob | pull], finish [brushed nickel | matte black | ...]
- Hardware finish must match existing fixtures: [finish]

Other items (mirror, pulls, fixture): [dimensions, count, placement, finish]

### Prompt (copy-paste)
> [One paragraph. Name the item and its spec from the Q&A. Then the preservation
> clause: "Keep the rest of the photograph identical - do not redraw the tile, grout,
> fixtures, floor, or geometry. Add only [the item]. Photorealistic, matches the
> original lighting and perspective exactly."]

### Save result as
`clients/<slug>/photos/generated/<file>__<task>.jpg` (JPEG or PNG both fine)

### After drop, the machine checks (Stage 8)
1. Functional plausibility (does it physically work - swing, mounting, split).
2. Regeneration tell (whole frame redrawn = reject).
3. AI artifacts.
4. Style fidelity.

---

## Worked example: shower door, corrected from the test build

The first pass failed QA: the door swung the wrong way and used a fake 50/50 split,
and it was a full-frame regenerate so the tile drifted. This card fixes all three.

**Task type:** completion
**Input image:** `masters/shower-viewpoint-12.jpg` (finished walk-in, open front, no glass)
**Tool:** Gemini (Nano Banana)
**Edit mode:** MASKED - only the front opening becomes glass; tile and fixtures untouched.

**Q&A spec (example answers - confirm the real ones with Jennifer):**
- Door type: hinged
- Hinge side: right (hinges on the fixed panel post, opens away from the tile wall)
- Swing: out
- Split: door + fixed panel, ratio door 26in + fixed panel 34in (NOT 50/50)
- Return panel: none, curb-mounted
- Handle: left edge of the door, slim ladder pull, brushed nickel
- Hardware finish matches the brushed-nickel shower fixtures

**Prompt:**
> Add a frameless glass shower enclosure in the open front of this finished walk-in
> shower, as a masked edit: keep the entire rest of the photograph identical and do
> not redraw the herringbone tile, the vertical wall tile, the niche, the fixtures,
> the shower base, the floor, or the geometry. Add only the glass. The enclosure is a
> fixed glass panel on the left (about 34 inches) and a hinged glass door on the right
> (about 26 inches) that swings outward, hinged on the right post, with a slim
> brushed-nickel ladder pull on the left edge of the door. The glass is clear and clean
> so all the existing tile stays fully visible through it. Brushed-nickel clips and
> hinges matching the shower fixtures. Photorealistic, matches the original lighting
> and perspective exactly.

**Save as:** `generated/shower-viewpoint-12__door.jpg`
