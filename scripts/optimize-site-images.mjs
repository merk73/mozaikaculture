// Optional asset preparation tool; the build consumes committed WebP assets.
// Requires sharp: node scripts/optimize-site-images.mjs
import { readFile, writeFile, readdir, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
const sharp = createRequire(import.meta.url)('sharp');
const output = 'assets/site-images-v1';
const files = ['index.html', 'gallery.html', 'quiz.html', 'content.js', 'far-east-peoples.js', 'styles.css', 'home.css', 'home-interactions.css', 'gallery.css', 'quiz.css', 'person.css', 'article.css'];
for (const directory of ['articles', 'peoples']) {
  for (const name of await readdir(directory)) if (name.endsWith('.html')) files.push(`${directory}/${name}`);
}
const sources = new Set();
// Keep original references available after markup has switched to WebP.
try {
  Object.keys(JSON.parse(await readFile(`${output}/manifest.json`, 'utf8'))).forEach(source => sources.add(source));
} catch (error) { if (error.code !== 'ENOENT') throw error; }
for (const file of files) {
  for (const match of (await readFile(file, 'utf8')).matchAll(/(?:\.\.\/)?(assets\/[\w./-]+\.(?:png|jpe?g|webp))/g)) {
    if (!match[1].startsWith('assets/home-mobile-') && !match[1].startsWith('assets/site-images-') && !match[1].startsWith('assets/events/upcoming/') && !match[1].startsWith('assets/atlas-portraits-v2/') && !match[1].startsWith('assets/atlas-backgrounds-v1/')) sources.add(match[1]);
  }
}
const manifest = {};
const list = [...sources].sort();
// Limit concurrency so resizing does not saturate memory or compete with preview.
for (let start = 0; start < list.length; start += 3) {
  await Promise.all(list.slice(start, start + 3).map(async source => {
    const metadata = await sharp(source).metadata();
    const portrait = source.startsWith('assets/people/');
    const widths = [...new Set((portrait ? [320, 512, 768, 1024] : [480, 960, 1600]).map(width => Math.min(width, metadata.width)))];
    const base = `${output}/${source.replace(/^assets\//, '').replace(/\.[^.]+$/, '')}`;
    await mkdir(path.dirname(base), { recursive: true });
    const variants = [];
    for (const width of widths) {
      const src = `${base}-${width}.webp`;
      await sharp(source).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: portrait ? 74 : 76, effort: 4 }).toFile(src);
      variants.push({ src, width, bytes: (await stat(src)).size });
    }
    manifest[source] = { width: metadata.width, height: metadata.height, originalBytes: (await stat(source)).size, variants, defaultSrc: variants.at(-1).src };
  }));
  console.log(`Optimized ${Math.min(start + 3, list.length)} / ${list.length} source images`);
}
await writeFile(`${output}/manifest.json`, JSON.stringify(manifest, null, 2) + '\n');
console.log(`${list.length} originals: ${Object.values(manifest).reduce((sum, item) => sum + item.originalBytes, 0)} bytes; largest WebPs: ${Object.values(manifest).reduce((sum, item) => sum + item.variants.at(-1).bytes, 0)} bytes`);
