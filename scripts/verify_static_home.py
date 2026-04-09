#!/usr/bin/env python3
"""Kontrola domovskej stránky: hero-copy, čitateľný blok, logo písmená."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "strings-static" / "index.html"
CSS = ROOT / "strings-static" / "assets" / "site.css"


def main() -> None:
    html = INDEX.read_text(encoding="utf-8")
    css = CSS.read_text(encoding="utf-8")
    assert "hero-copy" in html, "Chýba obal .hero-copy v index.html"
    assert "hero-singularity.js" in html
    assert "site.css" in html
    assert ".hero--singularity .hero-copy" in css
    assert "logoLetterRhythm" in css
    print("verify_static_home: OK")


if __name__ == "__main__":
    main()
