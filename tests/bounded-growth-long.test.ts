import { afterAll, expect, it } from 'vitest';
const children=new Set<{kill:(signal:string)=>void}>();
afterAll(()=>{for(const child of children)child.kill('SIGKILL');});
it('bounds every audited collection and the save after two million ticks from 30 creatures',async()=>{
  const childModule='node:child_process',fsModule='node:fs',processModule='node:process';
  const {spawn}=await import(childModule),fs=await import(fsModule),process=await import(processModule);
  const output=await new Promise<string>((resolve,reject)=>{
    const child=spawn(process.execPath,['scripts/study-growth.mjs'],{stdio:['ignore','pipe','pipe']});children.add(child);
    let output='',errors='',pending='';
    child.stdout.on('data',(chunk:{toString():string})=>{const text=chunk.toString();output+=text;pending+=text;const lines=pending.split('\n');pending=lines.pop()!;
      for(const line of lines)if(line.startsWith('{'))console.info(line);});
    child.stderr.on('data',(chunk:{toString():string})=>{errors+=chunk.toString();});child.on('error',reject);
    child.on('close',(code:number)=>{children.delete(child);fs.mkdirSync('.logs',{recursive:true});fs.writeFileSync('.logs/m10a-growth-study.log',output+'\n'+errors);code===0?resolve(output):reject(new Error(`Growth study failed (${code}): ${errors}\n${output.slice(-3000)}`));});
  });
  const result=JSON.parse(output.split('\n').find(line=>line.includes('"kind":"growth-result"'))!);
  expect(result.ticks).toBe(2000000);expect(result.initialPopulation).toBe(30);expect(result.bytes).toBeLessThan(result.budget);
  expect(result.compactions).toBeGreaterThan(0);expect(result.removedLives+result.stubs).toBeGreaterThan(0);expect(result.conserved).toBe(true);
},3600000);
