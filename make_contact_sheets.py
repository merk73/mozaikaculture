from pathlib import Path
import sys
from PIL import Image, ImageOps, ImageDraw

root = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(r"C:\Users\Merk\Documents\Mozaika\qa_render")
files = sorted(root.glob("page-*.png"))
for start in range(0, len(files), 6):
    group = files[start:start+6]
    thumbs = []
    for f in group:
        im = Image.open(f).convert("RGB")
        im.thumbnail((510, 660))
        canvas = Image.new("RGB", (530, 700), "white")
        canvas.paste(im, ((530-im.width)//2, 20))
        d = ImageDraw.Draw(canvas)
        d.text((12, 675), f.stem, fill="black")
        thumbs.append(canvas)
    sheet = Image.new("RGB", (1060, 2100), "#cccccc")
    for i, im in enumerate(thumbs):
        sheet.paste(im, ((i % 2) * 530, (i // 2) * 700))
    sheet.save(root / f"contact-{start+1:02d}-{start+len(group):02d}.png")
