"""
photolib.py - shared image utilities for the RemodelerRank Portfolio Recovery Factory.

The one rule every deterministic lane depends on: load_oriented(). Phone photos
store their pixels unrotated plus an EXIF orientation flag. If you crop the stored
buffer you get a rotated crop (the bug that produced a portrait "16:9" hero during
the test build). load_oriented() bakes the rotation first so stored pixels match
what the eye sees. Everything else here builds on it.

No third-party deps beyond Pillow. No network. No emoji, no em dashes anywhere.
"""

from __future__ import annotations
import os
from PIL import Image, ImageOps, ImageFont

# Common macOS font paths, tried in order for labels/titles.
_FONT_CANDIDATES = [
    "/System/Library/Fonts/Supplemental/Arial.ttf",
    "/System/Library/Fonts/Helvetica.ttc",
    "/System/Library/Fonts/SFNS.ttf",
    "/Library/Fonts/Arial.ttf",
]


def load_font(size: int) -> ImageFont.FreeTypeFont:
    """A truetype font at the given size, falling back to Pillow's bitmap default."""
    for path in _FONT_CANDIDATES:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except Exception:
                continue
    return ImageFont.load_default()

# Supported source extensions (case-insensitive)
IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".heic", ".webp", ".tif", ".tiff"}

# The 8 marketing export ratios. name -> (w, h). Order is stable for output naming.
EXPORT_RATIOS = [
    ("website-hero", 16, 9),      # main site hero
    ("website-banner", 21, 9),    # wide service-page banner
    ("portfolio-thumb", 4, 3),    # gallery thumbnail
    ("square", 1, 1),             # square social
    ("instagram-portrait", 4, 5), # IG feed portrait
    ("pinterest", 2, 3),          # Pinterest vertical
    ("google-business", 4, 3),    # GBP image
    ("facebook-linkedin", 191, 100),  # 1.91:1 wide
]


def is_image(path: str) -> bool:
    return os.path.splitext(path)[1].lower() in IMAGE_EXTS


def load_oriented(path: str) -> Image.Image:
    """Open an image and bake its EXIF orientation so stored pixels == what you see.
    Returns an RGB image with the orientation tag consumed. This is the fix for the
    rotated-crop bug; call it instead of Image.open() everywhere."""
    im = Image.open(path)
    im = ImageOps.exif_transpose(im)  # applies EXIF orientation, strips the flag
    if im.mode not in ("RGB",):
        im = im.convert("RGB")
    return im


def save_jpg(im: Image.Image, path: str, quality: int = 90) -> None:
    os.makedirs(os.path.dirname(os.path.abspath(path)), exist_ok=True)
    im.save(path, "JPEG", quality=quality, optimize=True, progressive=True)


def center_crop_to_ratio(im: Image.Image, rw: int, rh: int,
                         anchor_y: float = 0.5) -> Image.Image:
    """Largest rw:rh box that fits inside the image, then crop.
    anchor_y (0..1) chooses the vertical center of the crop: 0.5 = middle,
    lower values bias toward the top (useful so faucets/mirrors are not cut).
    Horizontal is always centered."""
    W, H = im.size
    target = rw / rh
    if W / H > target:
        # image is wider than target: full height, crop width
        cw = int(round(H * target)); ch = H
    else:
        cw = W; ch = int(round(W / target))
    x0 = (W - cw) // 2
    y_center = int(round(H * anchor_y))
    y0 = y_center - ch // 2
    y0 = max(0, min(y0, H - ch))  # clamp inside frame
    return im.crop((x0, y0, x0 + cw, y0 + ch))


def contain(im: Image.Image, max_w: int, max_h: int) -> Image.Image:
    """Downscale to fit within max_w x max_h, preserving aspect. Never upscales."""
    c = im.copy()
    c.thumbnail((max_w, max_h), Image.LANCZOS)
    return c


def list_images(folder: str) -> list[str]:
    """All image files directly in folder, sorted, skipping dot-underscore siblings."""
    out = []
    for name in sorted(os.listdir(folder)):
        if name.startswith("._") or name.startswith("."):
            continue
        p = os.path.join(folder, name)
        if os.path.isfile(p) and is_image(p):
            out.append(p)
    return out


def slugify(text: str) -> str:
    keep = []
    for ch in text.lower().strip():
        if ch.isalnum():
            keep.append(ch)
        elif ch in (" ", "-", "_"):
            keep.append("-")
    slug = "".join(keep)
    while "--" in slug:
        slug = slug.replace("--", "-")
    return slug.strip("-") or "image"
