// Long-run breeding regression using the ordinary bundled tick; no alternate simulation.
import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const [coreFile,seedText,ticksText,output,input,mode]=process.argv.slice(2);
const {config,configHash,createHabitat,tick,encodeCheckpoint,decodeCheckpoint,validateState,hashState}=await import(pathToFileURL(coreFile).href);
let state=input?decodeCheckpoint(await readFile(input,'utf8')).state:createHabitat(Number(seedText));
const startTick=state.clock.tick,target=startTick+Number(ticksText);if(mode==='unassisted')state.settings.extinctionRescue=false;
const rescueEnabled=state.settings.extinctionRescue;
let min=state.creatures.length,max=min,sum=0,samples=0,births=0,deaths=0,rescues=0,rebirths=0,peakHunger=0,peakFatigue=0,lastBirth=null,extinctAt=null;
const started=Date.now(),rows=[];
for(;state.clock.tick<target;){
 const before=state;state=tick(state);const n=state.creatures.length;min=Math.min(min,n);max=Math.max(max,n);
 if(before.counters.event!==state.counters.event)for(const e of state.events.slice(-(state.counters.event-before.counters.event))){if(e.kind==='eggLaid'){births++;lastBirth=e.tick;}if(e.kind==='death')deaths++;if(e.kind==='rescue')rescues++;if(e.kind==='rebirth')rebirths++;}
 for(const c of state.creatures)if(c.needs){peakHunger=Math.max(peakHunger,c.needs.hunger);peakFatigue=Math.max(peakFatigue,c.needs.fatigue);assert(c.position.x>=0&&c.position.x<state.world.width&&c.position.y>=0&&c.position.y<state.world.height);}
 if(state.clock.tick%1200===0){sum+=n;samples++;}
 if((state.clock.tick-startTick)%10000===0){assert.deepEqual(validateState(state,config),[]);const row={tick:state.clock.tick,population:n,births,deaths,rescues,rebirths,generation:Math.max(0,...state.lineage.map(l=>l.generation)),seconds:Math.round((Date.now()-started)/1000)};rows.push(row);console.log(JSON.stringify(row));}
 if(n===0){extinctAt=state.clock.tick;break;}
}
assert.deepEqual(validateState(state,config),[]);
const checkpoint=encodeCheckpoint(state,0),loaded=decodeCheckpoint(checkpoint).state;assert.deepEqual(loaded,state);
let twin=loaded;for(let i=0;i<1000;i++){state=tick(state);twin=tick(twin);}assert.deepEqual(twin,state);
const result={seed:Number(seedText),input:input??null,configHash,startTick,endTick:state.clock.tick-1000,requestedTicks:Number(ticksText),rescueEnabled,min,max,mean:sum/Math.max(1,samples),final:loaded.creatures.length,births,deaths,rescues,rebirths,lastBirth,extinctAt,peakHunger,peakFatigue,generation:Math.max(0,...loaded.lineage.map(l=>l.generation)),hash:hashState(loaded),continuationIdentical:true,seconds:(Date.now()-started)/1000,rows};
const pass=result.min>=6&&result.max<=config.lifecycle.capacity&&result.final>=6&&result.births>0&&(rescueEnabled||result.rescues===0)&&result.extinctAt===null&&result.lastBirth!==null&&result.endTick-result.lastBirth<config.lifecycle.stages.adult.durationTicks;
await writeFile(output+'.json',JSON.stringify({...result,pass},null,2));await writeFile(output+'-world.json',checkpoint);
const {rows:_,...summary}=result;console.log(JSON.stringify({result:summary,pass}));if(!pass)process.exitCode=1;
