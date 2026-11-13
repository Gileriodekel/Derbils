import {spawn} from 'node:child_process';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {buildStudyCore} from './study-build.mjs';
import {constants,setPriority} from 'node:os';
const health=JSON.parse(await readFile('src/data/health.json','utf8'));
const quick=process.argv.includes('--quick'),profile=quick?'quick':'full';
const scenarios=process.argv.includes('--no-scenarios')||quick?[]:Object.entries(JSON.parse(await readFile('tests/config/scenarios.json','utf8')));
const results=[],children=new Set();
process.once('SIGTERM',()=>{for(const child of children)child.kill('SIGTERM');process.exit(143);});
const core=await buildStudyCore();
async function run(seed,scenario){
 return new Promise(resolve=>{
  const child=spawn(process.execPath,['scripts/health-worker.mjs','balance',String(seed),profile,...(scenario?[scenario]:[])],{stdio:['ignore','pipe','inherit'],env:{...process.env,CREATURE_STUDY_CORE:core}});
  if(child.pid)try{setPriority(child.pid,constants.priority.PRIORITY_BELOW_NORMAL);}catch{/* Optional OS scheduling hint only. */}
  children.add(child);child.on('error',()=>{children.delete(child);resolve(1);});
  let pending='';child.stdout.on('data',chunk=>{pending+=chunk;const lines=pending.split('\n');pending=lines.pop();for(const line of lines){console.log(line);if(line.startsWith('{')){const item=JSON.parse(line);if(item.kind==='result')results.push(item);}}});
  child.on('close',code=>{children.delete(child);resolve(code??1);});
 });
}
// Worlds are independent; finish the default cohort before the scenario cohort.
let failed=(await Promise.all(health[profile].seeds.map(seed=>run(seed)))).some(code=>code!==0);
failed=(await Promise.all(scenarios.map(([name,scenario])=>run(scenario.seed,name)))).some(code=>code!==0)||failed;
results.sort((a,b)=>{
 const aIndex=a.scenario?health[profile].seeds.length+scenarios.findIndex(([name])=>name===a.scenario):health[profile].seeds.indexOf(a.seed);
 const bIndex=b.scenario?health[profile].seeds.length+scenarios.findIndex(([name])=>name===b.scenario):health[profile].seeds.indexOf(b.seed);
 return aIndex-bIndex;
});
for(const result of results){console.log(`\nSeed ${result.seed}${result.scenario?' / '+result.scenario:''}: ${result.pass?'PASS':'FAIL'}`);if(result.checks)console.table(result.checks.map(c=>({...c,value:Number(c.value?.toFixed(5)),result:c.pass?'PASS':'FAIL'})));}
await mkdir('.logs',{recursive:true});await writeFile(`.logs/m10b-balance-${profile}.json`,JSON.stringify(results,null,2)+'\n');
if(failed)process.exitCode=1;
