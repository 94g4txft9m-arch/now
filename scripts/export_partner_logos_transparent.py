#!/usr/bin/env python3
"""
Export partner logos to WebP with alpha: near-white / uniform light background → transparent.
Rajec (already clean WebP) is skipped by default.
Run from repo root: python3 scripts/export_partner_logos_transparent.py
"""
from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "strings-static" / "images" / "partners"


def is_background_pixel(r: int, g: int, b: int, a: int) -> bool:
    if a == 0:
        return False
    mx, mn = max(r, g, b), min(r, g, b)
    # čistá / takmer biela
    if r >= 245 and g >= 245 and b >= 245:
        return True
    # veľmi svetlá sivá (rovnomerná — typické JPG pozadie)
    if r >= 228 and g >= 228 and b >= 228 and (mx - mn) <= 22:
        return True
    return False


def raster_to_transparent(src: Path, dst: Path, quality: int = 90) -> None:
    im = Image.open(src).convert("RGBA")
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if is_background_pixel(r, g, b, a):
                px[x, y] = (r, g, b, 0)
    dst.parent.mkdir(parents=True, exist_ok=True)
    tmp = dst.with_suffix(dst.suffix + "._export")
    im.save(tmp, "WEBP", quality=quality, method=6)
    tmp.replace(dst)
    print(f"OK {src.name} → {dst.name} ({w}×{h})")


def main() -> int:
    jobs = [
        ("anasoft.png", "anasoft.webp"),
        ("detect.png", "detect.webp"),
        ("wolters-kluwer.webp", "wolters-kluwer.webp"),  # overwrite
        ("pks.webp", "pks.webp"),
        ("sosv.png", "sosv.webp"),
        ("kaiser.jpg", "kaiser.webp"),
    ]
    for src_name, dst_name in jobs:
        src = OUT_DIR / src_name
        dst = OUT_DIR / dst_name
        if not src.exists():
            print(f"Missing {src}", file=sys.stderr)
            return 1
        raster_to_transparent(src, dst)
    print("Skipped rajec.webp (reference, už priehľadné).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
