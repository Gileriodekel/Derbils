import { afterAll, expect, it } from 'vitest';
import type { competitionMetrics } from '../src/sim/competition/metrics';
import type { socialMetrics } from '../src/sim/social/metrics';
import { config } from '../src/data/config';
const children=new Set<{kill:(signal:string)=>void}>();
afterAll(()=>{for(const child of children)child.kill('SIGKILL');});
interface Summary {
  populationRange:[number,number]; maxHunger:number; maxFatigue:number; extinctionRescueFired:boolean;
  births:number; deaths:number; minimumDiversity:number; firstLifeAverageLifespan:number; allLifespansCanonical:boolean;
  rebornAverageLifespan:number|null; firstFriendshipTick:number|null;
  prizes:{conserved:boolean;winningCreatures:number;maximumWinShare:number;rareFruitEaten:number;xp:{total:number;inPeriod:number}[];trophies:{id:string;titles:number;wins:number}[];inventory:Record<string,Record<string,number>>};
  socialAt300k:ReturnType<typeof socialMetrics>; competitions:ReturnType<typeof competitionMetrics>;
}
async function report(ticks:number,seed:number):Promise<Summary>{
  const childModule='node:child_process',processModule='node:process',fsModule='node:fs';
  const {spawn}=await import(childModule),process=await import(processModule),fs=await import(fsModule);
  return new Promise((resolve,reject)=>{
    const child=spawn(process.execPath,['scripts/report.mjs',String(ticks),String(seed),'--auto-competitions','--auto-prizes'],{cwd:process.cwd(),env:process.env,stdio:['ignore','pipe','pipe']});children.add(child);
    let output='',errors='',pending='';
    child.stdout.on('data',(chunk:{toString():string})=>{const text=chunk.toString();output+=text;pending+=text;const lines=pending.split('\n');pending=lines.pop()!;
      for(const line of lines)if(line.startsWith('{"seed"')){const row=JSON.parse(line);console.info(JSON.stringify({seed,tick:row.tick??row.ticks,population:row.population??row.populationRange,births:row.births,rescues:row.rescues??row.rescueEggs,competitions:{held:row.competitions.held,fill:row.competitions.fillRate,dropped:row.competitions.droppedShare}}));}});
    child.stderr.on('data',(chunk:{toString():string})=>{errors+=chunk.toString();});child.on('error',reject);
    child.on('close',(code:number|null)=>{children.delete(child);fs.mkdirSync('.logs',{recursive:true});fs.writeFileSync(`.logs/m9-stability-${seed}.log`,output+'\n'+errors);
      if(code!==0){reject(new Error(`Competition report failed (${code}): ${errors}\n${output.slice(-2000)}`));return;}
      resolve(JSON.parse(output.split('\n').filter(line=>line.startsWith('{"seed"')&&line.includes('"averageLifespan"')).at(-1)!));});
  });
}
for(const [i,seed] of config.competitions.report.seeds.entries())it.concurrent(`preserves M6/M8 healthy population, diversity and social targets with auto events: ${seed}`,async()=>{
  const result=await report(i===0?1000000:config.competitions.report.stabilityTicks,seed);
  // The existing healthy/endurance requirements are unchanged and apply with the auto aid ON.
  expect(result.populationRange[0]).toBeGreaterThan(0);expect(result.populationRange[1]).toBeLessThanOrEqual(30);
  expect(result.maxHunger).toBeLessThan(100);expect(result.maxFatigue).toBeLessThan(100);expect(result.extinctionRescueFired).toBe(false);
  expect(result.births).toBeGreaterThan(100);expect(result.deaths).toBeGreaterThan(50);expect(result.minimumDiversity).toBeGreaterThan(config.breeding.diversityFloor);
  expect(result.firstLifeAverageLifespan).toBe(58200);expect(result.allLifespansCanonical).toBe(true);
  if(result.rebornAverageLifespan!==null)expect(result.rebornAverageLifespan).toBe(58800);
  const social=result.socialAt300k;expect(social.friendshipsFormed).toBeGreaterThanOrEqual(config.social.pacing.minimumFriendships);expect(social.rivalriesFormed).toBeGreaterThanOrEqual(config.social.pacing.minimumRivalries);
  expect(social.relationships).toBeGreaterThan(0);expect(social.mateConnections).toBeGreaterThan(0);expect(social.mateBondsFormed).toBeGreaterThan(0);
  expect(result.firstFriendshipTick).not.toBeNull();expect(result.firstFriendshipTick).toBeLessThanOrEqual(config.social.pacing.earlyAdultTicks);
  expect(social.positiveShare).toBeGreaterThanOrEqual(config.social.pacing.positiveShare[0]);expect(social.positiveShare).toBeLessThanOrEqual(config.social.pacing.positiveShare[1]);
  const p=result.prizes;expect(p.conserved).toBe(true);expect(p.winningCreatures).toBeGreaterThan(1);expect(p.maximumWinShare).toBeLessThanOrEqual(config.prizes.report.maximumWinShare);expect(p.rareFruitEaten).toBeGreaterThan(0);expect(p.trophies.length).toBeGreaterThan(1);
  for(const row of p.xp)expect(row.inPeriod).toBeLessThanOrEqual(config.prizes.xpPerPeriodCap);
  for(const group of Object.values(p.inventory))for(const n of Object.values(group)){expect(n).toBeGreaterThanOrEqual(0);expect(n).toBeLessThanOrEqual(config.prizes.stackCapacity);}
  const c=result.competitions;expect(c.held).toBeGreaterThan(10);expect(c.fillRate).toBeGreaterThanOrEqual(config.competitions.report.minimumFillRate);expect(c.averageEntrants).toBeGreaterThanOrEqual(2);expect(c.droppedShare).toBeLessThanOrEqual(config.competitions.report.maximumDropShare);expect(c.levelPlacementCorrelation).toBeLessThan(0);
},3600000);
