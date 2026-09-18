# Photo Pipeline Skill

Covers naming, sizing, optimization, and folder structure for all client photography.

Read this before preparing photos for any client site or grader report.

---

## Naming Convention

Pattern: `[client-slug]_[section]_[number].[ext]`

- **client-slug** - business name lowercased, spaces to hyphens. Example: "Urban Edge Construction" -> `urban-edge-construction`
- **section** - what the photo is used for (see table below)
- **number** - zero-padded sequence: 01, 02, 03...
- **ext** - always `.webp` for final output (see format rules below)

### Section labels

| Section | Label | Notes |
|---|---|---|
| Hero (homepage banner) | `hero` | One per site, landscape |
| Project gallery | `project` | Main portfolio images |
| Before/after set | `before` / `after` | Paired, same number |
| Team / owner portrait | `team` | Jennifer.png is an exception - do not rename |
| Logo | `logo` | Keep original format if PNG; WebP for hero use |
| Grader before screenshot | `audit-before` | Jennifer screenshots client site |
| Grader after screenshot | `audit-after` | Jennifer screenshots mockup |

Examples:
```
urban-edge-construction_hero_01.webp
urban-edge-construction_project_01.webp
urban-edge-construction_project_02.webp
urban-edge-construction_before_01.webp
urban-edge-construction_after_01.webp
urban-edge-construction_team_01.webp
urban-edge-construction_audit-before_01.png
urban-edge-construction_audit-after_01.png
```

---

## Folder Structure

```
/clients/[client-slug]/
  logo.png                  <- original logo (keep as-is)
  logo.webp                 <- WebP version for hero use (optional)
  mockup/
    index.html
  photos/
    [client-slug]_hero_01.webp
    [client-slug]_project_01.webp
    [client-slug]_project_02.webp
    ...
  audit/
    [client-slug]_audit-before_01.png
    [client-slug]_audit-after_01.png
```

---

## Size Requirements

| Use | Max width | Quality |
|---|---|---|
| Hero (full-bleed) | 2000px | 85 |
| Project gallery | 1200px | 82 |
| Thumbnail / card | 600px | 80 |
| Team portrait | 800px | 85 |
| Audit screenshots | Native (no resize) | - |

Heights are not constrained - preserve aspect ratio.

---

## Format Rules

1. **Output is always WebP** for photos. Exception: logos may stay PNG if the original has transparency.
2. **Input** can be any format Jennifer provides (JPEG, PNG, HEIC from iPhone).
3. **Never upscale.** If the source is 900px wide, leave it at 900px - do not stretch to 1200px.
4. **Strip EXIF data** to remove location and device metadata from client photos.

### Conversion command (cwebp)

```bash
# Install once: brew install webp
cwebp -q 85 input.jpg -o output.webp
# Resize to max width 2000px:
cwebp -q 85 -resize 2000 0 input.jpg -o output.webp
```

### Batch conversion (shell loop)

```bash
for f in *.jpg; do
  cwebp -q 82 -resize 1200 0 "$f" -o "${f%.jpg}.webp"
done
```

---

## Before/After Photos for Grader Reports

The before/after images in grader reports are embedded as base64 strings. To convert:

```bash
base64 -i urban-edge-construction_audit-before_01.png | tr -d '\n'
```

Paste the output into the `src="data:image/png;base64,..."` attribute in the grader HTML.

Jennifer provides both images as screenshots after the mockup is built. Do not attempt to screenshot programmatically.

---

## SEO Upload Names — Public-Facing Filenames

The internal naming above (`coda-construction_project_01.webp`) is for local storage and tracking. When uploading photos to a client's live website, use SEO-optimized names instead.

**Format for upload:**
```
[service]-[detail]-[city]-[sequence].webp
```

**Examples:**
```
kitchen-remodel-walnut-creek-1.webp
master-bath-renovation-danville-before.webp
adu-addition-concord-exterior.webp
whole-home-remodel-lafayette-living-room.webp
cabinet-refacing-pleasanton-after.webp
```

**Rules:**
- Hyphens only — no underscores, no spaces (Google treats hyphens as word separators)
- Lead with the service, then qualifier, then city (matches how people search)
- 4-6 words max — longer filenames lose signal
- City is always last before sequence number
- Never upload: `IMG_4829.jpg`, `DSC0012.jpg`, `photo (1).jpg`, `download.webp`

**Alt tags matter more than filenames** — but filenames are a free SEO signal. After renaming, write the alt text: `"Kitchen remodel with white shaker cabinets in Walnut Creek, CA"` — describe what is actually in the photo, include the city.

**Large portfolio folder structure on the live site:**
```
/images/projects/
  kitchen-remodel-walnut-creek-2024/
    hero.webp
    before.webp
    during.webp
    cabinets.webp
    countertops.webp
    final-1.webp
    final-2.webp
```

One subfolder per project. Name each project folder: `[service]-[city]-[year]`. Makes photos reusable for GBP posts, AEO pages, and social without hunting.

---

## MANDATORY: The Filename Rule

Once a photo is named and placed on disk, **never rename it in HTML or config**. Reference it exactly as it exists.

If the filename is unknown, write `REPLACE_WITH_ACTUAL_FILENAME.webp` and ask.

Full rules: see [photo-filename-protection/SKILL.md](../photo-filename-protection/SKILL.md)
