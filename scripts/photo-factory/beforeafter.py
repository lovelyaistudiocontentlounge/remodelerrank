#!/usr/bin/env python3
"""
beforeafter.py - build a before/after panel from two real photos.

Rule from the build: the "after" must be a restored REAL photo, never a synthesized
one. Before/after is a testimonial about a specific job, so it stays honest. This
script only composites two existing photos side by side; it invents nothing.

Both images are auto-oriented, matched to a common height, and joined with a thin
divider. Optional sage labels mark BEFORE and AFTER.

Usage:
  python3 beforeafter.py BEFORE.jpg AFTER.jpg OUT.jpg [--height 1400] [--no-labels]
"""
from __future__ import annotations
import argparse
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from PIL import Image, ImageDraw
from photolib import load_oriented, load_font

SAGE = (110, 142, 126)      # --sage-dark from the RemodelerRank palette
CHARCOAL = (44, 44, 44)
WHITE = (255, 255, 255)
DIVIDER = (221, 230, 225)   # --border


def _match_height(im: Image.Image, h: int) -> Image.Image:
    w = int(round(im.width * (h / im.height)))
    return im.resize((w, h), Image.LANCZOS)


def _label(panel: Image.Image, text: str, x: int) -> None:
    draw = ImageDraw.Draw(panel)
    font = load_font(max(22, panel.height // 28))
    pad = font.size // 2
    tb = draw.textbbox((0, 0), text, font=font)
    tw, th = tb[2] - tb[0], tb[3] - tb[1]
    bx, by = x + pad, pad
    draw.rectangle([bx, by, bx + tw + pad * 2, by + th + pad * 2], fill=SAGE)
    draw.text((bx + pad, by + pad - tb[1]), text, fill=WHITE, font=font)


def build(before_path: str, after_path: str, out_path: str,
          height: int = 1400, labels: bool = True, gap: int = 8) -> str:
    b = _match_height(load_oriented(before_path), height)
    a = _match_height(load_oriented(after_path), height)
    total_w = b.width + gap + a.width
    panel = Image.new("RGB", (total_w, height), DIVIDER)
    panel.paste(b, (0, 0))
    panel.paste(a, (b.width + gap, 0))
    if labels:
        _label(panel, "BEFORE", 0)
        _label(panel, "AFTER", b.width + gap)
    os.makedirs(os.path.dirname(os.path.abspath(out_path)), exist_ok=True)
    panel.save(out_path, "JPEG", quality=90, optimize=True)
    return out_path


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("before")
    ap.add_argument("after")
    ap.add_argument("out")
    ap.add_argument("--height", type=int, default=1400)
    ap.add_argument("--no-labels", action="store_true")
    args = ap.parse_args()
    for p in (args.before, args.after):
        if not os.path.isfile(p):
            sys.exit(f"not found: {p}")
    out = build(args.before, args.after, args.out, args.height, not args.no_labels)
    im = Image.open(out)
    print(f"wrote {out}  {im.width}x{im.height}")


if __name__ == "__main__":
    main()
