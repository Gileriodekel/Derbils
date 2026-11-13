import { expect, it } from 'vitest';
const fsModule='node:fs',pathModule='node:path';
it('keeps all sim and numeric scene modules free of browser, render and wall-clock access',async()=>{
  const fs=await import(fsModule),path=await import(pathModule);
  function files(dir:string):string[]{return fs.readdirSync(dir,{withFileTypes:true}).flatMap((e:{isDirectory():boolean;name:string})=>e.isDirectory()?files(path.join(dir,e.name)):[path.join(dir,e.name)]);}
  for(const file of [...files('src/sim'),...files('src/render/scene')].filter(p=>p.endsWith('.ts'))){
    const text=fs.readFileSync(file,'utf8');expect(text,file).not.toMatch(/Date\.now|new\s+Date|performance\.now|Math\.random|\bwindow\b|\bdocument\b/);
    if(file.startsWith('src/sim'))expect(text,file).not.toMatch(/from\s+['"][^'"]*(?:render|\/app\/)/);
  }
});
it('runs the complete replay dependency graph with no render import',async()=>{
  const fs=await import(fsModule),path=await import(pathModule),seen=new Set<string>();
  function visit(file:string){if(seen.has(file))return;seen.add(file);expect(file).not.toMatch(/\/render\//);const text=fs.readFileSync(file,'utf8');
    for(const match of text.matchAll(/(?:from\s*|import\s*)['"](\.[^'"]+)['"]/g)){let target=path.resolve(path.dirname(file),match[1]);if(!path.extname(target))target+='.ts';if(target.endsWith('.ts'))visit(target);}}
  visit(path.resolve('src/app/catchup.ts'));expect(seen.size).toBeGreaterThan(20);
});
