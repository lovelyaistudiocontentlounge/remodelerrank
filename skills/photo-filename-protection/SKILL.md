# Photo Filename Protection Skill

Read this before writing any HTML that references an image file.

## The Rule

**Never rename, modify, or guess image filenames when writing HTML.**

This is a mandatory rule, not a preference. Breaking it causes silent failures that waste significant time to debug.

---

## Correct behavior by situation

### Jennifer tells you the filename

She says: "the file is jennifer.png"
You write: `<img src="jennifer.png" alt="Jennifer">`

She says: "logo is at /clients/abc-construction/logo.png"
You write: `<img src="/clients/abc-construction/logo.png" alt="ABC Construction">`

She says: "hero photo is abc_hero_01.webp"
You write: `<img src="abc_hero_01.webp" alt="">`

### The filename has a UUID or hash

She says: "the image is 3f2a8c1d-hero.webp"
You write: `<img src="3f2a8c1d-hero.webp" alt="">` - keep the UUID exactly, character for character.

Never "clean up" a UUID. Never guess that `3f2a8c1d-hero.webp` might also exist as `hero.webp`.

### The filename is unknown

You do NOT know what the image file is called.
You write: `<img src="REPLACE_WITH_ACTUAL_FILENAME.jpg" alt="">`

Then tell Jennifer: "I left REPLACE_WITH_ACTUAL_FILENAME.jpg as a placeholder - please swap it with the real filename."

---

## What NOT to do

- Do not rename `jennifer.png` to `jennifer-rocha.png` or `Jennifer.png`
- Do not assume a logo at `logo.png` also works as `Logo.png` (case matters on Linux/Netlify)
- Do not convert `photo.PNG` to `photo.png` unless you have confirmed the actual filename
- Do not generate a "cleaned" version of a UUID filename
- Do not omit the file extension
- Do not add a path prefix that was not given to you

---

## Why this rule exists

Renaming a file in code while the actual file on disk keeps its original name causes the image to silently fail to load. The page looks broken in production. Netlify and the client see it. Debugging costs time that should not be spent on this.

The cost of asking for a filename is zero. The cost of guessing wrong is high.

---

## Related skills

- photo-pipeline/SKILL.md - naming conventions when Jennifer is preparing new photos
- mini-site/SKILL.md - mockup generation (references logo.png, hero images)
