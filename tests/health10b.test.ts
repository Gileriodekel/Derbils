import {expect,it} from 'vitest';
async function run(script:string,args:string[]){
 const childModule='node:child_process',processModule='node:process';const {execFile}=await import(childModule),process=await import(processModule);
 return new Promise<string>((resolve,reject)=>execFile(process.execPath,[script,...args],{cwd:process.cwd(),maxBuffer:1048576},(error:unknown,stdout:string,stderr:string)=>{if(error)reject(new Error(`${error}\n${stderr}\n${stdout}`));else resolve(stdout);}));
}
it('quick balance uses the production collector and the two shipped seed/profile bands',async()=>{
 const output=await run('scripts/balance.mjs',['--quick']);expect(output.match(/"kind":"result"/g)).toHaveLength(2);expect(output).not.toContain('"pass":false');
},300000);
it('short soak validates random round trips/chunks and repeated-state determinism',async()=>{
 const output=await run('scripts/soak.mjs',['--short']);expect(output).toContain('"kind":"soak-complete"');expect(output).toContain('"pass":true');
},120000);
