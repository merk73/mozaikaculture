import {readFile, writeFile, readdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const directories = ['', 'peoples', 'articles', 'beta', 'results', 'forms', 'events-results', 'media'];
for (const directory of directories) {
  for (const entry of await readdir(path.join(root, directory), {withFileTypes:true})) {
    if (!entry.isFile() || !entry.name.endsWith('.html')) continue;
    const file = path.join(root, directory, entry.name);
    const source = await readFile(file, 'utf8');
    const prefix = directory ? '../' : '';
    const links = `
    <link rel="apple-touch-icon" sizes="180x180" href="${prefix}assets/app-icons-v1/icon-180.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="${prefix}assets/app-icons-v1/favicon-32.png" />
    <link rel="icon" type="image/png" sizes="64x64" href="${prefix}assets/app-icons-v1/favicon-64.png" />
    <link rel="manifest" href="${prefix}site.webmanifest" />
    <meta name="apple-mobile-web-app-title" content="Мозаика культур" />
    <meta name="apple-mobile-web-app-capable" content="yes" />`;
    const clean = source.replace(links, '');
    const charset = clean.match(/<meta\b[^>]*\bcharset\s*=[^>]*>/i);
    if (!charset) throw new Error(`Missing charset in ${file}`);
    await writeFile(file, clean.replace(charset[0], charset[0] + links + '\n'));
  }
}
console.log('Connected application icons on all public site pages.');
