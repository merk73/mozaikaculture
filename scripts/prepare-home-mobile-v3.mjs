// More compact homepage-only assets. Export from originals without replacing them.
import { createRequire } from 'node:module';
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
const sharp = createRequire(import.meta.url)('sharp');
const output = 'assets/home-mobile-v3';
const previous = JSON.parse(await readFile('assets/home-mobile-v1/manifest.json','utf8'));
const backgrounds = JSON.parse(await readFile('assets/atlas-backgrounds-v1/manifest.json','utf8')).entries;
const jobs = Object.keys(previous).map(source => {
  let widths = [400,720], quality = 48;
  if(source.includes('/people/')) { widths=[256,384,512]; quality=42; }
  else if(source.includes('hero-landscape')) { widths=[896]; quality=40; }
  else if(source.includes('quiz-landscape')) { widths=[640]; quality=42; }
  else if(source.includes('card-overlay')) { widths=[384]; quality=38; }
  else if(source.includes('culture-divider')) { widths=[320,640]; quality=44; }
  else if(/poster|certificate/.test(source)) { widths=[400,720]; quality=56; }
  return {source,base:source.replace(/^assets\//,'').replace(/\.[^.]+$/,''),widths,quality};
});
jobs.push({source:'assets/hero-nanai-portrait.png',base:'hero-nanai-portrait',widths:[576,768],quality:42});
for(const entry of backgrounds) jobs.push({source:entry.desktop.src,base:`atlas-backgrounds/${entry.slug}`,widths:[256],quality:35});
for(const slug of ['ethnocode-unity','wind-trail','voices-of-earth','northern-patterns']) {
  const { readdir } = await import('node:fs/promises');
  const files=(await readdir('assets/events/upcoming')).filter(file=>file.startsWith(slug+'-')).sort((a,b)=>parseInt(b.match(/-(\d+)/)[1])-parseInt(a.match(/-(\d+)/)[1]));
  jobs.push({source:`assets/events/upcoming/${files[0]}`,base:`upcoming/${slug}`,widths:[240,384],quality:55});
}
const manifest={};
for(let i=0;i<jobs.length;i+=4) await Promise.all(jobs.slice(i,i+4).map(async job=>{
  const meta=await sharp(job.source).metadata();
  const variants=[];
  for(const width of [...new Set(job.widths.map(w=>Math.min(w,meta.width)))]) {
    const src=`${output}/${job.base}-${width}.webp`;
    await mkdir(path.dirname(src),{recursive:true});
    await sharp(job.source).rotate().resize({width,withoutEnlargement:true}).webp({quality:job.quality,alphaQuality:90,effort:6}).toFile(src);
    variants.push({src,width,bytes:(await stat(src)).size});
  }
  manifest[job.source]={quality:job.quality,variants};
}));
await writeFile(`${output}/manifest.json`,JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify({images:jobs.length,portraits384Bytes:Object.entries(manifest).filter(([s])=>s.includes('/people/')).reduce((sum,[,e])=>sum+e.variants.find(v=>v.width===384).bytes,0),backgroundBytes:Object.entries(manifest).filter(([s])=>s.includes('atlas-backgrounds-v1')).reduce((sum,[,e])=>sum+e.variants[0].bytes,0),coverBytes:manifest['assets/hero-nanai-portrait.png'].variants.at(-1).bytes}));
