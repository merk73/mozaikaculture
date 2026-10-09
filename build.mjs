import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { generateHomeData } from './scripts/generate-home-data.mjs';

const root = process.cwd();
const dist = path.join(root, "dist");

const files = [
  "index.html",
  "quiz.html",
  "gallery.html",
  "gallery.css",
  "gallery.js",
  "mobile-loader.js",
  "mobile-loader.css",
  "styles.css",
  "home.css",
  "home-polish.css",
  "home-interactions.css",
  "quiz.css",
  "article.css",
  "home-nav.js",
  "home-peoples.js",
  "home-atlas.js",
  "home-media.js",
  "site-shell.css",
  "site-motion.css",
  "site-motion.js",
  "content.js",
  "far-east-peoples.js",
  "script.js",
  "person.js",
  "person.css",
  "people-research.js",
  "quiz.js",
];

const directories = ["assets", "peoples", "articles", "beta", "results", "forms", "events-results", "media"];
const optionalFiles = ["_headers", "_redirects", ".nojekyll"];

await generateHomeData();
await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

for (const file of files) {
  await cp(path.join(root, file), path.join(dist, file));
}

for (const file of optionalFiles) {
  try {
    await cp(path.join(root, file), path.join(dist, file));
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

for (const directory of directories) {
  await cp(path.join(root, directory), path.join(dist, directory), { recursive: true });
}

const config = {
  SUPABASE_URL: process.env.SUPABASE_URL || "",
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || "",
};

await writeFile(
  path.join(dist, "config.js"),
  `window.MOZAIKA_CONFIG = ${JSON.stringify(config, null, 2)};\n`,
  "utf8",
);

if (!config.SUPABASE_URL || !config.SUPABASE_ANON_KEY) {
  console.warn("Supabase variables are empty. Account sign-in is unavailable; guest quiz remains available. Feedback requires a configured backend on GitHub Pages.");
}
