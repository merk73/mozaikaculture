"""Losslessly package the existing Leporid font for the web (fonttools + brotli)."""
from pathlib import Path
from fontTools.ttLib import TTFont

root = Path(__file__).resolve().parent.parent
source = root / "assets/fonts/Leporid-Regular.otf"
target = source.with_suffix(".woff2")
font = TTFont(source, recalcTimestamp=False)
font.flavor = "woff2"
font.save(target)
converted = TTFont(target)
assert font.getBestCmap() == converted.getBestCmap()
assert font["hmtx"].metrics == converted["hmtx"].metrics
assert font.getGlyphOrder() == converted.getGlyphOrder()
print(f"Leporid: {source.stat().st_size} -> {target.stat().st_size} bytes; all glyphs and advance widths retained.")
