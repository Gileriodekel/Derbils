import {expect,it} from 'vitest';
import {config} from '../src/data/config';
it('has a relative production base and build output stays under its recorded budget',async()=>{
 const module='node:fs/promises',fs=await import(module);
 const childModule='node:child_process';const {execFile}=await import(childModule);await new Promise<void>((resolve,reject)=>execFile('npm',['run','build'],{maxBuffer:1048576},(error:unknown)=>error?reject(error):resolve()));
 expect(await fs.readFile('vite.config.ts','utf8')).toContain("base:'./'");
 // The browser smoke command performs the actual build; inspect the same exported artifact here.
 const html=await fs.readFile('dist/index.html','utf8');expect(html).not.toMatch(/(?:src|href)="\/(?!\/)/);
 let bytes=0;
 async function visit(dir:string):Promise<void>{for(const entry of await fs.readdir(dir,{withFileTypes:true})){const path=`${dir}/${entry.name}`;if(entry.isDirectory())await visit(path);else bytes+=(await fs.stat(path)).size;}}
 await visit('dist');expect(bytes).toBeLessThanOrEqual(config.presentation.bundleByteBudget);
},120000);
