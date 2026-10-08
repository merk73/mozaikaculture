// Export the 20 user-supplied backgrounds; originals in Downloads stay unchanged.
import { createRequire } from 'node:module';
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { runInNewContext } from 'node:vm';
import path from 'node:path';
const sharp = createRequire(import.meta.url)('sharp');
const sourceDirectory = process.argv[2] || path.join(process.env.USERPROFILE, 'Downloads');
const output = 'assets/atlas-backgrounds-v1';
const suffixes = ['21_21_51-1','21_21_52-2','21_21_53-3','21_21_57-4','21_21_58-5','21_21_59-6','21_22_00-7','21_22_01-8','21_22_02-9','21_22_03-10','21_45_18-1','21_45_19-2','21_45_20-3','21_45_21-4','21_45_22-5','21_45_24-6','21_45_25-7','21_45_26-8','21_45_28-9','21_45_29-10'];
const context = { window: {} };
for (const file of ['content.js','far-east-peoples.js']) runInNewContext(await readFile(file,'utf8'),context);
const peoples = context.window.MOZAIKA_PEOPLES;
if (peoples.length !== suffixes.length) throw new Error('Expected 20 atlas entries.');
await mkdir(output, { recursive: true });
const entries = [];
for (const [index, person] of peoples.entries()) {
  const sourceName = `Изображение ChatGPT 8 окт. 2026 г., ${suffixes[index]}.png`;
  const source = path.join(sourceDirectory, sourceName);
  const bytes = await readFile(source);
  const metadata = await sharp(bytes).metadata();
  const variants = {};
  for (const [label,width,quality] of [['mobile',384,58],['desktop',768,68]]) {
    const src = `${output}/${person.slug}-${width}.webp`;
    await sharp(bytes).rotate().resize({ width, withoutEnlargement: true }).webp({ quality, effort: 6 }).toFile(src);
    variants[label] = { src, width, height: Math.round(metadata.height*width/metadata.width), bytes: (await stat(src)).size };
  }
  entries.push({ slug: person.slug, name: person.name, sourceName, sourceBytes: bytes.length, sourceSha256: createHash('sha256').update(bytes).digest('hex'), ...variants });
}
if (new Set(entries.map(entry => entry.sourceSha256)).size !== 20) throw new Error('Every card needs a distinct source image.');
await writeFile(`${output}/manifest.json`, JSON.stringify({ description: '20 different backgrounds supplied by the user, mapped in filename order to atlas order.', entries },null,2)+'\n');
console.log(JSON.stringify({ images: entries.length, sourceBytes: entries.reduce((sum,e)=>sum+e.sourceBytes,0), mobileBytes: entries.reduce((sum,e)=>sum+e.mobile.bytes,0), desktopBytes: entries.reduce((sum,e)=>sum+e.desktop.bytes,0) }));
