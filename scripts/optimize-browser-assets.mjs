import { readFile, readdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { build, transform } from 'esbuild';

// Keep readable sources; publish minified assets with content-based cache keys.
export async function optimizeBrowserAssets(dist) {
  async function htmlFiles(directory) {
    const result = [];
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory() && entry.name !== 'assets') result.push(...await htmlFiles(file));
      else if (entry.isFile() && entry.name.endsWith('.html')) result.push(file);
    }
    return result;
  }
  const scripts = new Map(), styles = new Map();
  let originalBytes = 0, optimizedBytes = 0;
  const hash = text => createHash('sha256').update(text).digest('hex').slice(0, 12);
  const relative = (from, to) => path.relative(path.dirname(from), to).replaceAll('\\', '/');
  const local = (html, url) => path.resolve(path.dirname(html), url.split(/[?#]/)[0]);
  const inside = file => !path.relative(dist, file).startsWith('..') && !path.isAbsolute(path.relative(dist, file));
  async function scriptAsset(file) {
    if (!scripts.has(file)) {
      const source = await readFile(file, 'utf8');
      // Classic scripts share globals across files: never mangle top-level names.
      const result = await transform(source, { loader: 'js', minify: true, charset: 'utf8', target: ['es2020'], legalComments: 'eof' });
      const output = path.join(path.dirname(file), `${path.basename(file, '.js')}.${hash(result.code)}.js`);
      await writeFile(output, result.code);
      originalBytes += Buffer.byteLength(source); optimizedBytes += Buffer.byteLength(result.code);
      scripts.set(file, output);
    }
    return scripts.get(file);
  }
  async function styleAsset(files) {
    const key = files.join('\n');
    if (!styles.has(key)) {
      const imports = files.map(file => `@import ${JSON.stringify('./' + path.relative(dist, file).replaceAll('\\', '/'))};`).join('\n');
      const result = await build({
        stdin: { contents: imports, resolveDir: dist, loader: 'css' },
        outfile: path.join(dist, 'site.css'), bundle: true, minify: true, write: false,
        target: ['safari15.5', 'chrome100'], charset: 'utf8', legalComments: 'eof',
        plugins: [{ name: 'keep-local-images-and-fonts', setup(builder) {
          builder.onResolve({ filter: /.*/ }, args => {
            if (args.kind !== 'url-token' || /^(?:data:|https?:|\/\/|#)/.test(args.path)) return;
            const [asset, suffix = ''] = args.path.split(/(?=[?#])/);
            const absolute = path.resolve(args.resolveDir, asset);
            if (!inside(absolute)) throw new Error(`CSS asset outside site: ${args.path}`);
            return { path: './' + path.relative(dist, absolute).replaceAll('\\', '/') + suffix, external: true };
          });
        } }],
      });
      const css = result.outputFiles[0].text;
      const output = path.join(dist, `site.${hash(css)}.css`);
      await writeFile(output, css);
      styles.set(key, output);
    }
    return styles.get(key);
  }
  for (const html of await htmlFiles(dist)) {
    let source = await readFile(html, 'utf8');
    const groups = [...source.matchAll(/(?:[ \t\r\n]*<link\b(?=[^>]*\brel=["']stylesheet["'])[^>]*>)+/gi)];
    for (const group of groups) {
      const tags = [...group[0].matchAll(/<link\b[^>]*>/gi)].map(match => match[0]);
      // Preserve media/disabled/alternate stylesheets and the critical loader boundary.
      if (tags.some(tag => /\s(?:media|disabled|title|onload|integrity|crossorigin)(?:\s*=|[\s/>])/i.test(tag))) continue;
      const urls = tags.map(tag => /\bhref=["']([^"']+)["']/i.exec(tag)?.[1]);
      if (urls.some(url => !url || /^(?:https?:|\/\/|data:)/.test(url))) continue;
      const files = urls.map(url => local(html, url));
      if (files.some(file => !inside(file))) throw new Error(`Stylesheet outside site: ${html}`);
      const common = files.length >= 2 && files[0] === path.join(dist, 'assets', 'site-theme.css') && files[1] === path.join(dist, 'styles.css');
      const chunks = common ? [files.slice(0, 2), files.slice(2)].filter(chunk => chunk.length) : [files];
      const replacements = [];
      for (const chunk of chunks) replacements.push(`<link rel="stylesheet" href="${relative(html, await styleAsset(chunk))}" />`);
      source = source.replace(group[0], '\n    ' + replacements.join('\n    '));
    }
    for (const match of [...source.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)]) {
      const url = match[1];
      if (/^(?:https?:|\/\/|data:)/.test(url)) continue;
      const file = local(html, url);
      if (!inside(file)) throw new Error(`Script outside site: ${url}`);
      source = source.replace(match[0], match[0].replace(url, relative(html, await scriptAsset(file))));
    }
    await writeFile(html, source);
  }
  console.log(`Browser scripts: ${originalBytes} → ${optimizedBytes} bytes; ${styles.size} shared CSS bundles.`);
}
