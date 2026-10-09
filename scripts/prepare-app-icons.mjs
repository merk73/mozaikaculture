import {createRequire} from 'node:module';
import {readFile, writeFile, mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const sharp = createRequire(import.meta.url)('sharp');
const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'assets/app-icons-v1');
await mkdir(output, {recursive: true});
const logo = await readFile(path.join(root, 'assets/logo-mozaika.svg'), 'utf8');
const paths = logo.replace(/^\s*<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
const background = await sharp(path.join(root, 'assets/site-images-v1/quiz-landscape-1254.webp')).resize(512, 512).png().toBuffer();

function artwork(maskable = false, favicon = false) {
  const width = maskable ? 358 : 410;
  const height = width * 125 / 344;
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512" viewBox="0 0 512 512">
    <defs>
      <linearGradient id="red" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f01930"/><stop offset=".55" stop-color="#d20a23"/><stop offset="1" stop-color="#a10719"/></linearGradient>
      <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#e81128" stop-opacity=".08"/><stop offset="1" stop-color="#49030b" stop-opacity=".14"/></linearGradient>
    </defs>
    <rect width="512" height="512" fill="url(#red)"/>
    ${favicon ? '' : `<image width="512" height="512" opacity=".42" xlink:href="data:image/png;base64,${background.toString('base64')}"/>`}
    <rect width="512" height="512" fill="url(#shade)"/>
    <g transform="translate(${(512-width)/2} ${252-height/2}) scale(${width/344})">${paths}</g>
  </svg>`;
}

const regular = Buffer.from(artwork());
for (const size of [180, 192, 512]) {
  await sharp(regular).resize(size, size).flatten({background:'#d20a23'}).png({compressionLevel:9, palette:true, colours:256, dither:0}).toFile(path.join(output, `icon-${size}.png`));
}
await sharp(Buffer.from(artwork(true))).flatten({background:'#d20a23'}).png({compressionLevel:9,palette:true,colours:256,dither:0}).toFile(path.join(output, 'icon-maskable-512.png'));
for (const size of [32, 64]) {
  await sharp(Buffer.from(artwork(false, true))).resize(size,size).flatten({background:'#d20a23'}).png({compressionLevel:9}).toFile(path.join(output, `favicon-${size}.png`));
}
console.log('Created opaque application icons, Apple touch icon, maskable icon and favicons.');
