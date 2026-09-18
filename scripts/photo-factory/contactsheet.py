#!/usr/bin/env python3
"""
contactsheet.py - a labeled grid of every photo in a folder, for approval.

This is the review surface: the machine does the sorting and prep, then hands
Jennifer one contact sheet per project to thumbs-up or flag. Each cell is numbered
and captioned with the filename so feedback can reference a specific frame.

Auto-orients every image so nothing shows up sideways.

Usage:
  python3 contactsheet.py FOLDER OUT.jpg [--cols 4] [--title "Project name"]
  python3 contactsheet.py --files a.jpg b.jpg -- OUT.jpg [--cols 4]
"""
from __future__ import annotations
import argparse
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from PIL import Image, ImageDraw
from photolib import load_oriented, contain, list_images, load_font

OFF_WHITE = (250, 250, 248)
CHARCOAL = (44, 44, 44)
SAGE_DEEP = (74, 110, 94)
MUTED = (122, 138, 128)


def build(paths: list[str], out_path: str, cols: int = 4,
          title: str = "", cell: int = 460) -> str:
    if not paths:
        sys.exit("no images to place on the contact sheet")
    pad = 18
    cap_h = 40
    cols = max(1, cols)
    rows = (len(paths) + cols - 1) // cols
    title_h = 70 if title else 0

    cell_w = cell
    cell_h = cell  # square cells; images are contained inside, letterboxed
    sheet_w = pad + cols * (cell_w + pad)
    sheet_h = title_h + pad + rows * (cell_h + cap_h + pad)
    sheet = Image.new("RGB", (sheet_w, sheet_h), OFF_WHITE)
    draw = ImageDraw.Draw(sheet)

    if title:
        tfont = load_font(34)
        draw.text((pad, 20), title, fill=CHARCOAL, font=tfont)

    cfont = load_font(20)
    nfont = load_font(22)
    for i, p in enumerate(paths):
        r, c = divmod(i, cols)
        cx = pad + c * (cell_w + pad)
        cy = title_h + pad + r * (cell_h + cap_h + pad)
        # image, contained and centered in the cell
        try:
            thumb = contain(load_oriented(p), cell_w, cell_h)
        except Exception as e:
            draw.rectangle([cx, cy, cx + cell_w, cy + cell_h], outline=MUTED)
            draw.text((cx + 8, cy + 8), f"unreadable: {e}", fill=MUTED, font=cfont)
            continue
        ox = cx + (cell_w - thumb.width) // 2
        oy = cy + (cell_h - thumb.height) // 2
        sheet.paste(thumb, (ox, oy))
        # index badge
        badge = f"{i + 1:02d}"
        draw.rectangle([cx, cy, cx + 44, cy + 30], fill=SAGE_DEEP)
        draw.text((cx + 8, cy + 4), badge, fill=OFF_WHITE, font=nfont)
        # caption filename (truncated)
        name = os.path.basename(p)
        if len(name) > 40:
            name = name[:37] + "..."
        draw.text((cx, cy + cell_h + 8), name, fill=MUTED, font=cfont)

    os.makedirs(os.path.dirname(os.path.abspath(out_path)), exist_ok=True)
    sheet.save(out_path, "JPEG", quality=88, optimize=True)
    return out_path


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("folder", nargs="?", default=None)
    ap.add_argument("out")
    ap.add_argument("--files", nargs="*", default=None)
    ap.add_argument("--cols", type=int, default=4)
    ap.add_argument("--title", default="")
    args = ap.parse_args()
    if args.files:
        paths = [p for p in args.files if os.path.isfile(p)]
    elif args.folder:
        paths = list_images(args.folder)
    else:
        sys.exit("provide a FOLDER or --files")
    out = build(paths, args.out, args.cols, args.title)
    im = Image.open(out)
    print(f"wrote {out}  {im.width}x{im.height}  ({len(paths)} images)")


if __name__ == "__main__":
    main()
