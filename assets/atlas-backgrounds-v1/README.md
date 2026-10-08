# Atlas backgrounds

Twenty different images supplied by the user on 2026-10-08, assigned in filename order to atlas cards 01–20. The first ten files (21:21–21:22) belong to cards 01–10; the next ten (21:45) belong to cards 11–20. These are decorative backgrounds, not ethnographic photographs.

`manifest.json` records each card, original filename, SHA-256 hash, and exported file sizes. Source PNGs remain unchanged in the user's Downloads folder. The website uses only the optimized WebP exports: 384px wide for phones, 768px for desktop.

To export again with sharp installed:

```powershell
node scripts/prepare-atlas-backgrounds.mjs "C:/path/to/source/images"
node build.mjs
```

The shared portrait files remain unchanged. CSS darkens backgrounds independently and smoothly scales them within the card on hover/focus. Reduced-motion preferences disable this movement. The mobile loading screen waits for all 20 backgrounds and portraits; failed image downloads release the loading screen.
