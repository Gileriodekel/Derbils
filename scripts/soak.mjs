import {spawn} from 'node:child_process';
import {readFile,writeFile,mkdir,rename} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {buildStudyCore} from './study-build.mjs';
import {constants,setPriority} from 'node:os';
const {soak}=JSON.parse(await readFile('src/data/health.json','utf8'));
const short=process.argv.includes('--short'),seeds=short?soak.shortSeeds:soak.seeds,completed=[];
const core=await buildStudyCore();
await mkdir('.logs',{recursive:true});let writes=Promise.resolve();const children=new Set();
process.once('SIGTERM',()=>{for(const child of children)child.kill('SIGTERM');process.exit(143);});
function record(result){completed.push(result);const snapshot=JSON.stringify(completed,null,2)+'\n',path=`.logs/m10b-soak-${short?'short':'full'}.partial.json`;writes=writes.then(async()=>{await writeFile(path+'.spare',snapshot);await rename(path+'.spare',path);});}
async function run(seed,repeated=false){return new Promise((resolve,reject)=>{
 const child=spawn(process.execPath,['scripts/health-worker.mjs','soak',String(seed),short?'short':'full'],{stdio:['ignore','pipe','pipe'],env:{...process.env,CREATURE_STUDY_CORE:core,...(repeated?{CREATURE_SOAK_REPLAY:'1'}:{})}});
 if(child.pid)try{setPriority(child.pid,constants.priority.PRIORITY_BELOW_NORMAL);}catch{/* Optional OS scheduling hint only. */}
 children.add(child);let pending='',errors='',result;
 child.stderr.on('data',data=>{errors+=data;process.stderr.write(data);});
 child.stdout.on('data',data=>{pending+=data;const lines=pending.split('\n');pending=lines.pop();for(const line of lines){console.log(line);if(line.startsWith('{')){const item=JSON.parse(line);if(item.kind==='result')result={...item,repeated};}}});
 child.on('error',reject);child.on('close',code=>{children.delete(child);if(code===0&&result){record(result);resolve(result);}else reject(new Error(`Soak ${seed} failed (${code}): ${errors}`));});
});}
// These worlds are entirely independent, including the repeat from tick zero. Running them together avoids leaving cores idle in the tail of the study.
let runs;
try{runs=await Promise.all([...seeds.map(seed=>run(seed)),run(seeds[0],true)]);}
catch(error){for(const child of children)child.kill('SIGTERM');await writes;throw error;}
const repeated=runs.at(-1),results=runs.slice(0,-1);assert.equal(repeated.hash,results[0].hash,'independent repeated soak hash');
await writes;await writeFile(`.logs/m10b-soak-${short?'short':'full'}.json`,JSON.stringify(results,null,2)+'\n');
console.log(JSON.stringify({kind:'soak-complete',seeds,ticks:short?soak.shortTicks:soak.ticks,repeatedHash:repeated.hash,pass:true}));
