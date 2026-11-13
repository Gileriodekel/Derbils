import {build} from 'vite';
import {readFile,writeFile} from 'node:fs/promises';

// Package the ordinary browser app into one file, including its existing codec worker.
const outDir='.logs/standalone-build';
await build({plugins:[{
 name:'standalone-codec',enforce:'pre',
 transform(source,id){
  if(!id.endsWith('/persistence/worker-codec.ts'))return;
  const constructor="new Worker(new URL('./codec-worker.ts',import.meta.url),{type:'module'})";
  if(!source.includes(constructor))throw new Error('Codec worker changed; review standalone packaging.');
  return "import InlineCodecWorker from './codec-worker.ts?worker&inline';\n"+source.replace(constructor,'new InlineCodecWorker()');
 },
}],build:{outDir,emptyOutDir:true,assetsInlineLimit:Infinity,rollupOptions:{output:{inlineDynamicImports:true}}}});
let html=await readFile(`${outDir}/index.html`,'utf8');
const script=html.match(/<script\b[^>]*src="([^"]+)"[^>]*><\/script>/);
if(!script)throw new Error('Expected one bundled browser entry.');
const js=await readFile(`${outDir}/${script[1].replace(/^\.\//,'')}`,'utf8');
html=html.replace(script[0],()=>`<script type="module">${js.replace(/<\/script/gi,'<\\/script')}</script>`);
const styles=[...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g)];
for(const style of styles){
 const css=await readFile(`${outDir}/${style[1].replace(/^\.\//,'')}`,'utf8');
 html=html.replace(style[0],()=>`<style>${css.replace(/<\/style/gi,'<\\/style')}</style>`);
}
const icon=await readFile('public/favicon.svg');
html=html.replace('href="./favicon.svg"',`href="data:image/svg+xml;base64,${icon.toString('base64')}"`);
if(/(?:src|href)="(?:\.\/)?assets\//.test(html))throw new Error('Unpackaged asset reference.');
await writeFile('Derbil-Dynasty.html',html);
console.log(`Derbil-Dynasty.html: ${Buffer.byteLength(html).toLocaleString()} bytes; open directly in Chrome or Edge.`);
