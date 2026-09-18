#!/usr/bin/env python3
"""
export_crops.py - one clean master into the full marketing ratio set.

Governing rule: one clean master per viewpoint, generate once, then crop. This is
the crop step. It NEVER generates or invents pixels; it only reframes a real photo,
so it is faithful and free. Auto-orient runs first (via photolib.load_oriented) so
crops come out the right way up.

Usage:
  python3 export_crops.py MASTER.jpg OUTDIR [--name SLUG] [--anchor 0.5]

  --name    output filename stem (default: slug of the master's filename)
  --anchor  vertical crop center 0..1 (default 0.42, biased slightly high so
            vanities/mirrors/faucets are not cut off the top)

Outputs OUTDIR/SLUG__<ratio-name>.jpg for each of the 8 ratios in photolib.EXPORT_RATIOS.
"""
from __future__ import annotations
import argparse
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from photolib import load_oriented, save_jpg, center_crop_to_ratio, EXPORT_RATIOS, slugify


def export_all(master_path: str, outdir: str, name: str | None = None,
               anchor: float = 0.42) -> list[str]:
    im = load_oriented(master_path)
    stem = name or slugify(os.path.splitext(os.path.basename(master_path))[0])
    written = []
    for ratio_name, rw, rh in EXPORT_RATIOS:
        crop = center_crop_to_ratio(im, rw, rh, anchor_y=anchor)
        out = os.path.join(outdir, f"{stem}__{ratio_name}.jpg")
        save_jpg(crop, out, quality=90)
        written.append((out, crop.size, f"{rw}:{rh}"))
    return written


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("master")
    ap.add_argument("outdir")
    ap.add_argument("--name", default=None)
    ap.add_argument("--anchor", type=float, default=0.42)
    args = ap.parse_args()
    if not os.path.isfile(args.master):
        sys.exit(f"master not found: {args.master}")
    rows = export_all(args.master, args.outdir, args.name, args.anchor)
    src = load_oriented(args.master).size
    print(f"master (oriented): {src[0]}x{src[1]}")
    for out, size, ratio in rows:
        orient = "landscape" if size[0] >= size[1] else "portrait"
        print(f"  {os.path.basename(out):48s} {ratio:8s} {size[0]}x{size[1]} ({orient})")


if __name__ == "__main__":
    main()
