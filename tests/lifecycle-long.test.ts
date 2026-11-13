import { afterAll, expect, it } from 'vitest';
import { config } from '../src/data/config';
import type { socialMetrics } from '../src/sim/social/metrics';

interface Summary {
  seed:number; ticks:number; populationRange:[number,number]; births:number; deaths:number;
  averageLifespan:number; maxHunger:number; maxFatigue:number; extinctionRescueFired:boolean;
  diversity:number; minimumDiversity:number; meanPopulationLast100k:number; birthsLast100k:number;
  firstLifeAverageLifespan:number; rebornAverageLifespan:number|null; allLifespansCanonical:boolean;
  firstFriendshipTick:number|null;
  socialAt300k:ReturnType<typeof socialMetrics>;
}

const children=new Set<{kill:(signal:string)=>void}>();
afterAll(()=>{for(const child of children)child.kill('SIGKILL');});

/** Exercise the production report script directly in Node; each child owns one deterministic world. */
async function report(ticks:number,seeds:number[],sources?:number):Promise<Summary[]> {
  const childModule='node:child_process',processModule='node:process';
  const {spawn}=await import(childModule),process=await import(processModule);
  return new Promise((resolve,reject)=>{
    const child=spawn(process.execPath,['scripts/report.mjs',String(ticks),...seeds.map(String)],{
      cwd:process.cwd(),env:{...process.env,...(sources===undefined?{}:{CREATURE_REPORT_SOURCES:String(sources)})},stdio:['ignore','pipe','pipe']});
    children.add(child);
    let output='',errors='',pending='';
    child.stdout.on('data',(chunk:{toString():string})=>{
      const text=chunk.toString();output+=text;pending+=text;
      const lines=pending.split('\n');pending=lines.pop()!;
      for(const line of lines)if(line.startsWith('{"seed"')||line.startsWith('Seed '))console.info(line);
    });
    child.stderr.on('data',(chunk:{toString():string})=>{errors+=chunk.toString();});
    child.on('error',reject);
    child.on('close',(code:number|null)=>{
      children.delete(child);
      if(code!==0){reject(new Error(`Report failed (${code}): ${errors}\n${output.slice(-2000)}`));return;}
      resolve(output.split('\n').filter(line=>line.startsWith('{"seed"')&&line.includes('"averageLifespan"')).map(line=>JSON.parse(line) as Summary));
    });
  });
}

function assertHealthy(result:Summary) {
  expect(result.populationRange[0]).toBeGreaterThan(0);expect(result.populationRange[1]).toBeLessThanOrEqual(30);
  expect(result.maxHunger).toBeLessThan(100);expect(result.maxFatigue).toBeLessThan(100);
  expect(result.extinctionRescueFired).toBe(false);assertLifespans(result);
  expect(result.births).toBeGreaterThan(100);expect(result.deaths).toBeGreaterThan(50);
}
function assertLifespans(result:Summary){
  // Social friends activate the already-defined rebirth path: subsequent lives include a cocoon.
  expect(result.firstLifeAverageLifespan).toBe(58200);expect(result.allLifespansCanonical).toBe(true);
  if(result.rebornAverageLifespan!==null)expect(result.rebornAverageLifespan).toBe(58800);
}
for(const [i,seed] of config.breeding.reportSeeds.entries())it.concurrent(`sustains population and diversity through generations: seed ${seed}`,async()=>{
  // Each report validates complete ancestry, egg/session slots and saves every 50,000 ticks.
  const results=await report(i===0?1000000:500000,[seed]);expect(results).toHaveLength(1);
  assertHealthy(results[0]);
  const social=results[0].socialAt300k;
  expect(social.friendshipsFormed).toBeGreaterThanOrEqual(config.social.pacing.minimumFriendships);
  expect(social.rivalriesFormed).toBeGreaterThanOrEqual(config.social.pacing.minimumRivalries);
  expect(social.relationships).toBeGreaterThan(0);expect(social.mateConnections).toBeGreaterThan(0);expect(social.mateBondsFormed).toBeGreaterThan(0);
  expect(results[0].firstFriendshipTick).not.toBeNull();expect(results[0].firstFriendshipTick).toBeLessThanOrEqual(config.social.pacing.earlyAdultTicks);
  expect(social.positiveShare).toBeGreaterThanOrEqual(config.social.pacing.positiveShare[0]);
  expect(social.positiveShare).toBeLessThanOrEqual(config.social.pacing.positiveShare[1]);
  if(i===0)expect(results[0].minimumDiversity).toBeGreaterThan(config.breeding.diversityFloor);
},3600000);

it.concurrent('reduced renewable food supply lowers population and births without starvation',async()=>{
  const seed=config.breeding.reportSeeds[0];
  // Two rebirths can extend an organism through 175,800 ticks; cover multiple full chains.
  const rich=(await report(500000,[seed]))[0],poor=(await report(500000,[seed],5))[0];
  expect(poor.meanPopulationLast100k).toBeLessThan(rich.meanPopulationLast100k*.8);
  expect(poor.birthsLast100k).toBeLessThan(rich.birthsLast100k);
  expect(poor.populationRange[0]).toBeGreaterThan(0);expect(poor.maxHunger).toBeLessThan(100);expect(poor.maxFatigue).toBeLessThan(100);
  expect(poor.populationRange[1]).toBeLessThanOrEqual(30);
  assertLifespans(poor);expect(poor.deaths).toBeGreaterThan(50);
  // Rescue is forbidden in the healthy default studies above. Scarcity only promises lower
  // reproduction/population without starvation; six founders can exhaust permitted kinship branches.
},3600000);
