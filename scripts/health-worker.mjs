import assert from 'node:assert/strict';
import {readFile,writeFile,rename,mkdir} from 'node:fs/promises';
import {createServer} from 'vite';
import {pathToFileURL} from 'node:url';
const [mode='balance',seedText='271828',profileName='full',scenarioName]=process.argv.slice(2);
const bundled=process.env.CREATURE_STUDY_CORE?await import(pathToFileURL(process.env.CREATURE_STUDY_CORE).href):null;
const server=bundled?null:await createServer({server:{middlewareMode:true,hmr:false,ws:false,watch:null},appType:'custom',logLevel:'error'});
try {
 const load=p=>bundled??server.ssrLoadModule(`/src/${p}.ts`);
 const {config,configHash}=await load('data/config');
 const {createHabitat}=await load('sim/habitat');const {tick}=await load('sim/tick');
 const {validateState}=await load('sim/validate-state');const {hashState}=await load('sim/hash');
 const {encodeCheckpoint,decodeCheckpoint}=await load('persistence/checkpoint');
 const {createCatchUp}=await load('app/catchup');const {uniform}=await load('sim/rng');
 const {createHealthCollector}=await load('analysis/health');
 const seed=Number(seedText),settings=config.health.soak;
 let scenario=scenarioName?JSON.parse(await readFile('tests/config/scenarios.json','utf8'))[scenarioName]:null;
 let state=createHabitat(seed,scenario?.founders);state.settings.autoCompetitions=true;state.settings.autoPrizes=true;
 if(scenario)state.world.plants=state.world.plants.slice(0,scenario.sources);
 // Test-only world inputs; cadence presets adjust the saved scheduler deadline.
 const profile=config.health[profileName]??config.health.full;
 const target=scenario?.ticks??(mode==='soak'?(profileName==='short'?settings.shortTicks:settings.ticks):profile.ticks);
 const health=mode==='balance'?createHealthCollector(state,profile):null;
 let random=(seed^0x9e3779b9)>>>0||1,roundTrips=0,chunks=0,minPopulation=state.creatures.length,maxPopulation=minPopulation,rescues=0,births=0,maxHunger=0,maxFatigue=0;
 const start=Date.now();let maxBytes=0,nextCheck=settings.validateEveryTicks,nextProgress=100000;
 const independentRepeat=process.env.CREATURE_SOAK_REPLAY==='1';
 const resumePath=`.logs/soak-resume-${seed}-${target}${independentRepeat?'-independent-repeat':''}.json`;
 if(mode==='soak'&&profileName!=='short'){
  try{const saved=JSON.parse(await readFile(resumePath,'utf8'));assert.equal(saved.configHash,configHash,'resume tuning mismatch');state=decodeCheckpoint(saved.payload).state;random=saved.random;roundTrips=saved.roundTrips;chunks=saved.chunks;maxBytes=saved.maxBytes;rescues=saved.rescues??0;nextCheck=Math.floor(state.clock.tick/settings.validateEveryTicks+1)*settings.validateEveryTicks;nextProgress=Math.floor(state.clock.tick/100000+1)*100000;console.log(JSON.stringify({kind:'resume',seed,tick:state.clock.tick}));}catch(error){if(error.code!=='ENOENT')throw error;}
 }
 function check(){const errors=validateState(state,config);assert.deepEqual(errors,[],`seed ${seed} tick ${state.clock.tick}`);}
 function checkpoint(){const json=encodeCheckpoint(state,0);const bytes=Buffer.byteLength(json);maxBytes=Math.max(maxBytes,bytes);assert(bytes<=config.offline.archive.saveByteBudget,`save budget ${bytes}`);return json;}
 function sample(before){
   if(mode==='soak'){if(state.counters.event!==before.counters.event)rescues+=state.events.slice(-(state.counters.event-before.counters.event)).filter(e=>e.kind==='rescue').length;return;}
   health?.observe(before,state);minPopulation=Math.min(minPopulation,state.creatures.length);maxPopulation=Math.max(maxPopulation,state.creatures.length+state.sessions.length);
   if(state.counters.event!==before.counters.event){const events=state.events.slice(-(state.counters.event-before.counters.event));rescues+=events.filter(e=>e.kind==='rescue').length;births+=events.filter(e=>e.kind==='eggLaid').length;}
   for(const c of state.creatures)if(c.needs){maxHunger=Math.max(maxHunger,c.needs.hunger);maxFatigue=Math.max(maxFatigue,c.needs.fatigue);}
 }
 console.log(JSON.stringify({kind:'start',mode,seed,ticks:target,configHash}));
 await new Promise(resolve=>setImmediate(resolve));
 while(state.clock.tick<target){
   if(scenario?.cadence&&state.competitionState.nextAutoTick>state.clock.tick+scenario.cadence)state.competitionState={...state.competitionState,nextAutoTick:state.clock.tick+scenario.cadence};
   const before=state;state=tick(state);sample(before);
   if(mode==='soak'){
     // Validate an exact boundary before a replay can cross it.
     if(state.clock.tick>=nextCheck){check();nextCheck=Math.floor(state.clock.tick/settings.validateEveryTicks+1)*settings.validateEveryTicks;}
     let draw=uniform(random);random=draw.state;
     if(draw.value<settings.roundTripChance||(profileName==='short'&&state.clock.tick===1)){state=decodeCheckpoint(checkpoint()).state;roundTrips++;}
     draw=uniform(random);random=draw.state;
     if(draw.value<settings.catchUpChance||(profileName==='short'&&state.clock.tick===1)){
       draw=uniform(random);random=draw.state;const n=Math.min(target-state.clock.tick,nextCheck-state.clock.tick,1+Math.floor(draw.value*settings.maximumChunkTicks));
       const expected=state;const job=createCatchUp(state,n,{now:()=>0,config});while(!job.snapshot().done)job.step();
       state=job.snapshot().state;rescues+=job.snapshot().summary.rescueEggs;
       // Every inserted replay is checked against the identical ordinary path.
       let direct=expected;for(let i=0;i<n;i++)direct=tick(direct);
       assert.equal(hashState(state),hashState(direct),'chunked catch-up differs');chunks++;
     }
   }
   if(state.clock.tick>=nextCheck){check();nextCheck=Math.floor(state.clock.tick/settings.validateEveryTicks+1)*settings.validateEveryTicks;}
   if(state.clock.tick>=nextProgress){check();const payload=checkpoint();nextProgress=Math.floor(state.clock.tick/100000+1)*100000;if(mode==='soak'&&profileName!=='short'){await mkdir('.logs',{recursive:true});await writeFile(resumePath+'.spare',JSON.stringify({configHash,payload,random,roundTrips,chunks,maxBytes,rescues}));await rename(resumePath+'.spare',resumePath);}console.log(JSON.stringify({kind:'progress',mode,seed,tick:state.clock.tick,seconds:(Date.now()-start)/1000,maxBytes}));await new Promise(resolve=>setImmediate(resolve));}
 }
 check();checkpoint();const hash=hashState(state);
 let result=health?health.result(state):{seed,ticks:target,pass:true,population:state.creatures.length,rescues};
 if(scenario){result={seed,scenario:scenarioName,ticks:target,pass:minPopulation>=scenario.minimumPopulation&&maxPopulation<=scenario.maximumPopulation&&rescues<=scenario.maximumRescues&&maxHunger<100&&maxFatigue<100&&state.creatures.length>=scenario.minimumFinalPopulation&&births>=scenario.minimumBirths,finalPopulation:state.creatures.length,births,minPopulation,maxPopulation,rescues,maxHunger,maxFatigue};}
 console.log(JSON.stringify({kind:'result',mode,...result,hash,roundTrips,chunks,maxBytes,seconds:(Date.now()-start)/1000}));
 if(!result.pass)process.exitCode=1;
} catch(error){console.error(error);process.exitCode=1;}finally{await server?.close();}
