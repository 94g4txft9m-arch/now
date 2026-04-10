#!/usr/bin/env python3
"""Generate PNG app icons (stdlib only) matching favicon.svg palette."""
import struct
import zlib
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "icons"
OUT.mkdir(parents=True, exist_ok=True)


def write_png(path: Path, w: int, h: int, rgba: bytes) -> None:
    def chunk(tag: bytes, data: bytes) -> bytes:
        crc = zlib.crc32(tag + data) & 0xFFFFFFFF
        return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", crc)

    ihdr = struct.pack(">IIBBBBB", w, h, 8, 6, 0, 0, 0)
    rows = []
    for y in range(h):
        rows.append(b"\x00" + rgba[y * w * 4 : (y + 1) * w * 4])
    raw = b"".join(rows)
    compressed = zlib.compress(raw, 9)
    png = (
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", ihdr)
        + chunk(b"IDAT", compressed)
        + chunk(b"IEND", b"")
    )
    path.write_bytes(png)


def render(size: int) -> bytes:
    # Match viewBox 32x32: rect #0a0a0f, outer ring r~9.5 stroke teal, inner r~4.5
    bg = (10, 10, 15, 255)
    inner_fill = (5, 5, 8, 255)
    teal = (45, 212, 191, 255)
    teal_ring = (45, 212, 191, 90)

    def blend(dst, src):
        if src[3] >= 255:
            return src
        a = src[3] / 255.0
        return tuple(int(dst[i] * (1 - a) + src[i] * a) for i in range(4))

    cx = cy = (size - 1) * 0.5
    r_outer = 9.5 / 16.0 * (size * 0.5)
    r_outer_stroke = max(1.0, 1.25 / 32.0 * size)
    r_inner = 4.5 / 16.0 * (size * 0.5)
    r_inner_stroke = max(1.0, 1.0 / 32.0 * size)

    buf = bytearray(size * size * 4)
    for y in range(size):
        for x in range(size):
            dx = x - cx
            dy = y - cy
            d = (dx * dx + dy * dy) ** 0.5
            pix = bg
            # outer ring (stroke only, approximate)
            if abs(d - r_outer) <= r_outer_stroke * 0.55:
                pix = blend(pix, teal_ring)
            elif d < r_outer - r_outer_stroke * 0.5 and d > r_inner + r_inner_stroke * 0.5:
                pix = bg
            # inner disk + stroke
            if abs(d - r_inner) <= r_inner_stroke * 0.55:
                pix = blend(pix, teal)
            elif d < r_inner - r_inner_stroke * 0.45:
                pix = inner_fill
            i = (y * size + x) * 4
            buf[i : i + 4] = bytes(pix)
    return bytes(buf)


def main() -> None:
    for name, s in (("icon-192.png", 192), ("icon-512.png", 512), ("apple-touch-icon.png", 180)):
        write_png(OUT / name, s, s, render(s))
        print("wrote", OUT / name)


if __name__ == "__main__":
    main()
