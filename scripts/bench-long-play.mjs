// Exercise the ordinary core with a fresh or imported world, including archive maintenance.
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {dirname,resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {performance} from 'node:perf_hooks';
import {buildStudyCore} from './study-build.mjs';
const args=process.argv.slice(2),option=(name,fallback)=>{const i=args.indexOf(name);return i<0?fallback:args[i+1];};
const ticks=Number(option('--ticks','10000')),world=option('--world'),output=resolve(option('--out','.logs/long-play.json'));
if(!Number.isSafeInteger(ticks)||ticks<1)throw new Error('--ticks must be a positive integer');
const core=await import(pathToFileURL(await buildStudyCore()).href);
let state=world?core.decodeCheckpoint(await readFile(world,'utf8')).state:core.createHabitat(Number(option('--seed','271828')),Number(option('--population','12')));
const startTick=state.clock.tick,rows=[];let elapsed=0,segment=0;
assert.deepEqual(core.validateState(state,core.config),[]);
for(let done=0;done<ticks;){
 const count=Math.min(10000,ticks-done),start=performance.now();
 for(let i=0;i<count;i++)state=core.tick(state);
 const ms=performance.now()-start;elapsed+=ms;segment++;done+=count;
 assert.deepEqual(core.validateState(state,core.config),[]);
 globalThis.gc?.();
 const row={tick:state.clock.tick,population:state.creatures.length,lineage:state.lineage.length,stubs:state.archive?.stubs.length??0,organisms:state.organisms.length,
   ticksPerSecond:count*1000/ms,heapBytes:process.memoryUsage().heapUsed,rssBytes:process.memoryUsage().rss};
 rows.push(row);console.log(JSON.stringify(row));
}
const checkpoint=core.encodeCheckpoint(state,0),loaded=core.decodeCheckpoint(checkpoint).state;assert.deepEqual(loaded,state);
const final=state;let twin=loaded;for(let i=0;i<1000;i++){state=core.tick(state);twin=core.tick(twin);}assert.deepEqual(twin,state);
const result={configHash:core.configHash,startTick,endTick:final.clock.tick,ticks,segments:segment,ticksPerSecond:ticks*1000/elapsed,checkpointBytes:Buffer.byteLength(checkpoint),hash:core.hashState(final),continuationIdentical:true,explicitGc:typeof globalThis.gc==='function',rows};
await mkdir(dirname(output),{recursive:true});await writeFile(output,JSON.stringify(result,null,2));await writeFile(output.replace(/\.json$/,'')+'-world.json',checkpoint);
console.log(`Validated ${ticks} ticks; ${result.ticksPerSecond.toFixed(0)} ticks/s. Report: ${output}`);
