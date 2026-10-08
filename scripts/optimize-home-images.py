"""Regenerate mobile homepage assets with Pillow: python scripts/optimize-home-images.py.

Original images stay intact for desktop and full-size downloads. Bump the output
directory version when changing the encoder settings (assets are immutable).
"""
from pathlib import Path
import argparse
import json
import re
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / "assets/home-mobile-v1"
OUTPUT.mkdir(parents=True, exist_ok=True)
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--group', choices=('all', 'people', 'homepage'), default='all')
group = parser.parse_args().group
manifest_file = OUTPUT / 'manifest.json'
manifest = json.loads(manifest_file.read_text(encoding='utf-8')) if manifest_file.exists() else {}


def variants(relative, widths, quality):
    source = ROOT / relative
    with Image.open(source) as original:
        original = ImageOps.exif_transpose(original)
        paths = []
        for width in sorted(set(min(width, original.width) for width in widths)):
            image = original.resize((width, round(original.height * width / original.width)), Image.Resampling.LANCZOS)
            target = OUTPUT / Path(relative).relative_to("assets").with_suffix("")
            target = target.with_name(f"{target.name}-{width}.webp")
            target.parent.mkdir(parents=True, exist_ok=True)
            image.save(target, "WEBP", quality=quality, method=6)
            paths.append({"src": target.relative_to(ROOT).as_posix(), "width": width, "bytes": target.stat().st_size})
        manifest[relative] = {"originalBytes": source.stat().st_size, "variants": paths}
        # Remove only obsolete variants of this generated asset.
        current = {ROOT / item['src'] for item in paths}
        for old in target.parent.glob(f'{source.stem}-*.webp'):
            if old not in current:
                old.unlink()


if group in ('all', 'people'):
    for source in sorted((ROOT / "assets/people").glob("*.png")):
        variants(source.relative_to(ROOT).as_posix(), (320, 512, 768), 64)

if group in ('all', 'homepage'):
    variants("assets/hero-landscape.png", (1280,), 68)
    variants("assets/quiz-landscape.png", (960,), 68)
    variants("assets/events/card-overlay.png", (640,), 68)
    html = (ROOT / "index.html").read_text(encoding="utf-8")
    inline_images = re.findall(r'<img\b[^>]*\bsrc="(assets/[^"?]+)"', html)
    video_posters = re.findall(r'(?<![\w-])(?:poster|data-poster)="(assets/[^"?]+)"', html)
    for relative in sorted(set(inline_images + video_posters)):
        if relative.endswith(".svg"):
            continue
        variants(relative, (480, 960), 72)

(OUTPUT / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
people = [value for key, value in manifest.items() if key.startswith("assets/people/")]
print(f"Atlas: {sum(p['originalBytes'] for p in people):,} original bytes; "
      f"{sum(p['variants'][1]['bytes'] for p in people):,} bytes at 512px")
hero = manifest["assets/hero-landscape.png"]
print(f"Hero: {hero['originalBytes']:,} -> {hero['variants'][0]['bytes']:,} bytes")
print(f"Generated {sum(len(p['variants']) for p in manifest.values())} mobile WebP files.")
