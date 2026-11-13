import { resolveContest } from '../src/sim/social/contest';
import { describe, expect, it } from 'vitest';
import old from './fixtures/milestone-9a.json';
import { config, skillKeys } from '../src/data/config';
import { createHabitat } from '../src/sim/habitat';
import { tick, advanceTicks } from '../src/sim/tick';
import { applyPlayerCommand } from '../src/sim/commands';
import { createCompetition, creationReason } from '../src/sim/competition/create';
import { deliverPrizes, maintainPrizeFruit } from '../src/sim/competition/prizes';
import { prizeBalances } from '../src/sim/competition/balances';
import { competitionPreview } from '../src/sim/competition/preview';
import { isEligible } from '../src/sim/competition/eligibility';
import { enterCompetition } from '../src/sim/competition/attendance';
import { advanceCompetitionWork } from '../src/sim/competition/scheduler';
import { grantDailyCache, prizeKey, prizeGroup } from '../src/sim/competition/inventory';
import { navigationTerrain, availableFood } from '../src/sim/food-sources';
import { resolveCompletion } from '../src/sim/actions';
import { completeMeal } from '../src/sim/preferences';
import { computeAppearance } from '../src/sim/appearance/derive';
import { buildScene } from '../src/render/scene/build';
import { setTraitValue } from '../src/sim/genetics/edits';
import { xpAtLevel } from '../src/sim/skills';
import { compatibility } from '../src/sim/mates';
import { encodeSave, decodeSave } from '../src/persistence/save';
import type { PlayerCommand, Prize, PrizeSpec, SaveState } from '../src/sim/types';

const clone=<T>(x:T):T=>JSON.parse(JSON.stringify(x));
const prize:PrizeSpec={placements:[{rank:1,kind:'fruit',id:'prismpear',quantity:2},{rank:2,kind:'cosmetic',id:'ribbon',quantity:1},{rank:3,kind:'seed',id:'spiralfruit',quantity:1}]};
const command=(p:PrizeSpec|null=prize):Extract<PlayerCommand,{kind:'createCompetition'}>=>({kind:'createCompetition',skill:'run',format:'dash',entryRules:clone(config.competitions.entry),startDelay:config.competitions.defaultStartDelay,prize:p});
function ready(n=3){const s=createHabitat(901,n);s.settings.autoBreed=false;s.settings.extinctionRescue=false;for(const c of s.creatures){c.currentAction=null;c.needs={hunger:5,fatigue:5,boredom:75,loneliness:75,stress:0};c.mood=.8;for(const k of skillKeys){c.genome=setTraitValue(c.genome,'aptitudes',k,.9);c.xp[k]=xpAtLevel(30,k);}}return s;}
function opened(p:PrizeSpec|null=prize,n=3){let s=applyPlayerCommand(ready(n),command(p));s=advanceTicks(s,s.competitions[0].entryOpenTick);s.social.sessions=[];s.sessions=[];
  for(const c of s.creatures){c.currentAction=null;c.needs={hunger:5,fatigue:5,boredom:75,loneliness:75,stress:0};if(!s.competitions[0].entrantIds.includes(c.id))expect(enterCompetition(s,c,s.competitions[0],navigationTerrain(s.world))).toBe(true);}return s;}
const until=(s:SaveState,t:number)=>advanceTicks(s,t-s.clock.tick);
function conserve(s:SaveState){const b=prizeBalances(s);for(const [key,n] of Object.entries(b))expect(n,key).toBe(s.prizeLedger.supplied[key]??0);for(const g of Object.values(s.inventory))for(const n of Object.values(g))expect(n).toBeGreaterThanOrEqual(0);}
function stock(s:SaveState,p:Prize){s.inventory[prizeGroup(p.kind)][p.id]+=p.quantity;s.prizeLedger.supplied[prizeKey(p)]=(s.prizeLedger.supplied[prizeKey(p)]??0)+p.quantity;}
function freeze<T>(x:T):T{if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;}

describe('inventory-backed escrow',()=>{
  it('has spec starter stock and the first cache at DAY, deterministic and once only',()=>{
    const s=ready();expect(s.inventory).toEqual(config.prizes.starter);const before=clone(s.inventory);grantDailyCache(s);expect(s.inventory).toEqual(before);
    s.clock.tick=config.clock.dayTicks;grantDailyCache(s);expect(s.inventory.fruit.spiralfruit).toBe(before.fruit.spiralfruit+2);expect(s.inventory.seeds.spiralfruit).toBe(before.seeds.spiralfruit+1);expect(s.inventory.cosmetics.leaf_crown).toBe(1);
    const copy=clone(s);grantDailyCache(s);expect(s).toEqual(copy);s.clock.tick+=config.clock.dayTicks;grantDailyCache(s);expect(s.inventory.fruit.prismpear).toBe(before.fruit.prismpear+2);conserve(s);
  });
  it('escrows at creation, journals, persists and refunds exactly on cancel',()=>{
    const original=freeze(ready()),s=applyPlayerCommand(original,command());expect(s.inventory.fruit.prismpear).toBe(original.inventory.fruit.prismpear-2);expect(s.competitions[0].escrowState).toBe('held');expect(s.events.some(e=>e.kind==='prizeEscrowed')).toBe(true);conserve(s);
    const after=applyPlayerCommand(decodeSave(encodeSave(s)),{kind:'cancelCompetition',id:s.competitions[0].id});expect(after.inventory).toEqual(original.inventory);expect(after.competitionHistory[0].escrowState).toBe('refunded');expect(after.prizeLedger.refunded).toBe(4);conserve(after);expect(()=>applyPlayerCommand(after,{kind:'cancelCompetition',id:s.competitions[0].id})).toThrow();
  });
  it('allows every catalog plant seed as a prize, including common starter seeds',()=>{
    const initial=ready(),s=applyPlayerCommand(initial,command({placements:[{rank:1,kind:'seed',id:'sunapple',quantity:1}]}));
    expect(s.inventory.seeds.sunapple).toBe(initial.inventory.seeds.sunapple-1);conserve(s);
    expect(applyPlayerCommand(s,{kind:'cancelCompetition',id:s.competitions[0].id}).inventory).toEqual(initial.inventory);
  });
  it('rejects unaffordable aggregate prizes without mutation, through the same command/preview reason',()=>{
    const s=ready(),before=clone(s),cmd=command({placements:[{rank:1,kind:'fruit',id:'prismpear',quantity:3},{rank:2,kind:'fruit',id:'prismpear',quantity:3}]});
    const reason=creationReason(s,cmd);expect(reason).toMatch(/Not enough/);expect(competitionPreview(s,cmd).messages[0]).toBe(reason);expect(()=>applyPlayerCommand(s,cmd)).toThrow(reason!);expect(s).toEqual(before);
  });
  it('refunds a below-minimum event and permits debug-only cancellation after start',()=>{
    let s=applyPlayerCommand(ready(1),command());const inventory=clone(ready(1).inventory);s=until(s,s.competitions[0].startTick);expect(s.competitionHistory[0].status).toBe('cancelled');expect(s.inventory).toEqual(inventory);conserve(s);
    s=opened();s=until(s,s.competitions[0].startTick);expect(()=>applyPlayerCommand(s,{kind:'cancelCompetition',id:s.competitions[0].id})).toThrow(/committed/);
    const after=applyPlayerCommand(s,{kind:'cancelCompetition',id:s.competitions[0].id,debug:true});expect(after.inventory).toEqual(inventory);expect(after.creatures.every(c=>c.awards.trophies.length===0)).toBe(true);conserve(after);
  });
  it('reserves refund capacity against capped passive grants; aggregated overflow is counted',()=>{
    let s=ready();stock(s,{kind:'fruit',id:'prismpear',quantity:config.prizes.stackCapacity-s.inventory.fruit.prismpear});s=applyPlayerCommand(s,command({placements:[{rank:1,kind:'fruit',id:'prismpear',quantity:3}]}));
    s.clock.tick=config.clock.dayTicks*2;grantDailyCache(s);expect(s.inventory.fruit.prismpear).toBe(config.prizes.stackCapacity-3);expect(s.prizeLedger.overflow['fruit:prismpear']).toBe(2);
    s=applyPlayerCommand(s,{kind:'cancelCompetition',id:s.competitions[0].id});expect(s.inventory.fruit.prismpear).toBe(config.prizes.stackCapacity);conserve(s);
  });
  it('settles boundary awards before daily supplies, allowing newly freed token capacity',()=>{
    let s=advanceTicks(ready(),config.clock.dayTicks-config.competitions.defaultStartDelay-config.competitions.durationTicks);
    stock(s,{kind:'cosmetic',id:'leaf_crown',quantity:config.prizes.stackCapacity});
    s=applyPlayerCommand(s,command({placements:[{rank:1,kind:'cosmetic',id:'leaf_crown',quantity:1}]}));s=until(s,s.competitions[0].entryOpenTick);s.social.sessions=[];s.sessions=[];
    for(const c of s.creatures){c.currentAction=null;c.needs={hunger:5,fatigue:5,boredom:75,loneliness:75,stress:0};if(!s.competitions[0].entrantIds.includes(c.id))enterCompetition(s,c,s.competitions[0],navigationTerrain(s.world));}
    s=until(s,config.clock.dayTicks);expect(s.competitionHistory[0].status).toBe('resolved');expect(s.inventory.cosmetics.leaf_crown).toBe(config.prizes.stackCapacity);expect(s.prizeLedger.overflow['cosmetic:leaf_crown']??0).toBe(0);
    const kinds=s.events.map(e=>e.kind);expect(kinds.lastIndexOf('competitionResult')).toBeLessThan(kinds.lastIndexOf('dailyCache'));conserve(s);
  });
  it('rejects invalid placements, quantities, unknown IDs and common fruit',()=>{
    for(const p of [{placements:[]},{placements:[{rank:1,kind:'fruit',id:'sunapple',quantity:1}]},{placements:[{rank:4,kind:'fruit',id:'prismpear',quantity:1}]},{placements:[{rank:1,kind:'cosmetic',id:'ribbon',quantity:2}]},{placements:[{rank:1,kind:'item',id:'missing',quantity:1}]},{placements:[{rank:1,kind:'seed',id:'spiralfruit',quantity:1},{rank:1,kind:'seed',id:'spiralfruit',quantity:1}]}])expect(()=>applyPlayerCommand(ready(),command(p as PrizeSpec))).toThrow();
  });
});

describe('one pure delivery path',()=>{
  it('awards first/second/third correctly, consumes escrow, records trophies, and cannot repeat',()=>{
    let s=opened();s=until(s,s.competitions[0].endTick);const e=s.competitionHistory[0],rank=e.results!.placements;expect(e.awarded).toBe(true);expect(e.escrowState).toBe('released');
    expect(e.deliveries.map(d=>[d.rank,d.creatureId,d.destination])).toEqual([[1,rank[0].id,'fruit'],[2,rank[1].id,'cosmetic'],[3,rank[2].id,'donated']]);
    expect(s.world.looseFruit.filter(f=>f.prize?.ownerId===rank[0].id)).toHaveLength(2);const second=s.creatures.find(c=>c.id===rank[1].id)!;expect(second.awards.owned).toEqual(['ribbon']);expect(second.awards.equipped).toBe('ribbon');expect(s.inventory.seeds.spiralfruit).toBe(config.prizes.starter.seeds.spiralfruit);
    expect(s.creatures.every(c=>c.awards.trophies.length===1)).toBe(true);expect(deliverPrizes(freeze(clone(s)),e.id)).toEqual(s);conserve(s);expect(decodeSave(encodeSave(s))).toEqual(s);
  });
  it('no prize delivers nothing while competition effects and titles still apply',()=>{
    let s=opened(null);s=until(s,s.competitions[0].endTick);expect(s.competitionHistory[0].deliveries).toEqual([]);expect(s.prizeLedger.delivered).toBe(0);expect(s.inventory).toEqual(config.prizes.starter);expect(s.creatures.some(c=>c.awards.wins===1)).toBe(true);
  });
  it('a dead recipient returns the prize and logs the reason, once',()=>{
    let s=opened();s=until(s,s.competitions[0].endTick-1);const e=s.competitions[0],winner=e.results!.placements[0].id;s.clock.tick=e.endTick;s.creatures=s.creatures.filter(c=>c.id!==winner);
    const before=clone(s),paid=deliverPrizes(freeze(s),e.id);expect(s).toEqual(before);expect(paid.inventory.fruit.prismpear).toBe(config.prizes.starter.fruit.prismpear);expect(paid.events.some(e=>e.kind==='prizeReturned'&&e.creatureId===winner)).toBe(true);expect(deliverPrizes(paid,e.id)).toBe(paid);
  });
  it('duplicate cosmetics return matching tokens, and item prizes are donated, without new habitat effects',()=>{
    const p:PrizeSpec={placements:[{rank:1,kind:'cosmetic',id:'ribbon',quantity:1},{rank:2,kind:'item',id:'track',quantity:1}]};
    let s=ready();stock(s,{kind:'item',id:'track',quantity:1});s=applyPlayerCommand(s,command(p));s=until(s,s.competitions[0].entryOpenTick);s.social.sessions=[];for(const c of s.creatures){c.currentAction=null;if(!s.competitions[0].entrantIds.includes(c.id))enterCompetition(s,c,s.competitions[0],navigationTerrain(s.world));}s=until(s,s.competitions[0].startTick);
    const winner=s.creatures.find(c=>c.id===s.competitions[0].results!.placements[0].id)!;winner.awards.owned=['ribbon'];s.prizeLedger.supplied['cosmetic:ribbon']++;const items=clone(s.world.items);
    s=until(s,s.competitions[0].endTick);expect(s.competitionHistory[0].deliveries[0].reason).toMatch(/Duplicate/);expect(s.inventory.items.track).toBe(1);expect(s.creatures.find(c=>c.id===winner.id)!.awards.equipped).toBe('ribbon');expect(s.world.items).toEqual(items);conserve(s);
  });
  it('holds fruit for the recipient then releases a non-spoiling ordinary pile; overflow is stored',()=>{
    let s=opened();s=until(s,s.competitions[0].endTick);const fruit=s.world.looseFruit.find(f=>f.prize)!,other=s.creatures.find(c=>c.id!==fruit.prize!.ownerId)!;
    expect(availableFood(s,other,navigationTerrain(s.world)).some(f=>f.targetFruitId===fruit.id)).toBe(false);
    s.clock.tick=fruit.prize!.exclusiveUntilTick;maintainPrizeFruit(s);expect(fruit.prize!.ownerId).toBeNull();expect(availableFood(s,other,navigationTerrain(s.world)).some(f=>f.targetFruitId===fruit.id)).toBe(true);conserve(s);
    let full=opened();full=until(full,full.competitions[0].endTick-1);const e=full.competitions[0];full.clock.tick=e.endTick;
    full.world.looseFruit=Array.from({length:config.prizes.looseCapacity},(_,i)=>({id:`f_${String(i+1).padStart(8,'0')}`,kind:'sunapple',x:1.5,y:1.5,droppedTick:0}));
    full=deliverPrizes(full,e.id);expect(full.competitions[0].deliveries[0].reason).toMatch(/overflow stored/);expect(full.inventory.fruit.prismpear).toBe(config.prizes.starter.fruit.prismpear);
  });
  it('returns uneaten held fruit when its recipient departs',()=>{
    let s=opened();s=until(s,s.competitions[0].endTick);const id=s.world.looseFruit.find(f=>f.prize)!.prize!.ownerId;s.creatures=s.creatures.filter(c=>c.id!==id);maintainPrizeFruit(s);expect(s.world.looseFruit.some(f=>f.prize?.ownerId===id)).toBe(false);expect(s.inventory.fruit.prismpear).toBe(config.prizes.starter.fruit.prismpear);expect(s.prizeLedger.returned).toBe(3);
  });
});

describe('ordinary fruit, visual cosmetics and bounded effects',()=>{
  it('eats a prize through ordinary completion, with exactly the existing meal effects and no direct XP',()=>{
    let s=opened();s=until(s,s.competitions[0].endTick);const f=s.world.looseFruit.find(f=>f.prize)!,c=s.creatures.find(c=>c.id===f.prize!.ownerId)!;
    c.position={x:f.x,y:f.y};c.needs!.hunger=55;c.currentAction={kind:'eat',target:{...c.position},targetFruitId:f.id,path:[],workTicks:config.actions.eat.workTicks};const expected=clone(c);completeMeal(expected,f.kind,s.clock.tick);
    expect(resolveCompletion(s,c)).toBe(true);expect(c.needs).toEqual(expected.needs);expect(c.foodPreferences).toEqual(expected.foodPreferences);expect(c.skillBonuses).toEqual(expected.skillBonuses);expect(c.appearanceModifiers).toEqual(expected.appearanceModifiers);expect(c.xp).toEqual(expected.xp);expect(s.prizeLedger.rareFruitEaten).toBe(1);expect(s.events.at(-1)!.kind).toBe('prizeFruitEaten');conserve(s);
  });
  it('rare fruit never grows in the default habitat',()=>{
    const s=createHabitat();expect(s.world.plants.every(p=>!config.fruit[p.kind].rare)).toBe(true);expect(config.sources.defaults.every(p=>!config.fruit[p.kind].rare)).toBe(true);expect(config.fruit.prismpear.skillBonuses).toEqual({fly:.2,swim:.2});
  });
  it('equipping changes only stored cosmetic fields and adds a recipe layer, anchored at extreme proportions',()=>{
    let s=ready();s.creatures[0].awards.owned=['ribbon'];s.prizeLedger.supplied['cosmetic:ribbon']++;const c=s.creatures[0],before=clone(c);
    s=applyPlayerCommand(s,{kind:'equipCosmetic',id:c.organismId,cosmetic:'ribbon'});expect({...s.creatures[0],awards:before.awards}).toEqual(before);
    for(const q of [0,1]){let extreme=clone(s.creatures[0]);for(const gene of ['width','height','head'] as const)extreme.genome=setTraitValue(extreme.genome,'body',gene,config.appearance.proportions[gene][q]);
      const a=computeAppearance(extreme,config),scene=buildScene(a,'right',config),hat=scene.find(p=>p.partId==='cosmetic-ribbon')!,head=scene.find(p=>p.partId==='base-head')!;
      expect(a.parts.some(p=>p.partId==='cosmetic-ribbon')).toBe(true);expect(hat.transform.e).toBeCloseTo(head.transform.e,8);expect(hat.transform.f).toBeLessThan(head.transform.f);expect(Number.isFinite(hat.transform.a)).toBe(true);expect(hat.layerIndex).toBeGreaterThan(head.layerIndex);
    }
  });
  it('cosmetics and trophies are not inherited and mate choice ignores them',()=>{
    const s=ready(),before=compatibility(s,s.creatures[0],s.creatures[1]);s.creatures[0].awards.owned=['ribbon'];s.creatures[0].awards.equipped='ribbon';s.creatures[0].awards.trophies=[{competitionId:'cpt_00000001',skills:['run'],placement:1,tick:0}];
    expect(compatibility(s,s.creatures[0],s.creatures[1])).toEqual(before);const bred=applyPlayerCommand(s,{kind:'forceBreed',a:s.creatures[0].organismId,b:s.creatures[1].organismId});expect(bred.creatures.at(-1)!.awards.owned).toEqual([]);expect(bred.creatures.at(-1)!.awards.trophies).toEqual([]);
  });
  it('placement valence and confidence match the spec and stay bounded',()=>{
    let s=opened(prize,5);s=until(s,s.competitions[0].endTick-1);const before=new Map(s.creatures.map(c=>[c.id,c.recentValence]));const decay=Math.exp(-1/config.mood.valenceDecayTicks);s=tick(s);const e=s.competitionHistory[0];
    for(const row of e.results!.placements){const c=s.creatures.find(c=>c.id===row.id)!,expected=(before.get(c.id)??0)*decay+(config.prizes.rankValence[row.rank-1]??config.prizes.otherValence);expect(c.recentValence).toBeCloseTo(Math.max(config.food.valenceBounds[0],Math.min(config.food.valenceBounds[1],expected)),10);expect(c.awards.confidenceUntilTick).toBe(row.rank===1?s.clock.tick+config.clock.dayTicks:0);expect(c.awards.trophies[0].placement).toBe(row.rank);}
  });
  it('confidence multiplies committed performance by exactly 3%, without changing rolls or stacking',()=>{
    const c={id:'a',level:30,staminaLevel:20,wellbeing:.8,stagePerformance:1,aptitude:.5},other={...c,id:'b'};
    const neutral=resolveContest([c,other],'run',913,config),boosted=resolveContest([{...c,confidence:config.prizes.confidenceBonus},other],'run',913,config);
    expect(boosted.ranking.find(r=>r.id==='a')!.base).toBeCloseTo(neutral.ranking.find(r=>r.id==='a')!.base*(1+config.prizes.confidenceBonus),12);
    expect(boosted.ranking.find(r=>r.id==='a')!.score).toBeCloseTo(neutral.ranking.find(r=>r.id==='a')!.score*(1+config.prizes.confidenceBonus),12);expect(boosted.rng).toBe(neutral.rng);
  });
  it('competition XP is capped per configured period even under repeated forced work',()=>{
    let s=opened();s=until(s,s.competitions[0].startTick+1);const e=s.competitions[0],terrain=navigationTerrain(s.world);s.clock.tick=e.startTick+2;
    for(let i=0;i<1000;i++)advanceCompetitionWork(s,terrain);
    for(const c of s.creatures){expect(c.awards.xpThisPeriod).toBeLessThanOrEqual(config.prizes.xpPerPeriodCap);expect(c.awards.xpThisPeriod).toBeCloseTo(config.prizes.xpPerPeriodCap,8);}
  });
});

describe('preview, migrations, persistence and replay',()=>{
  it('preview counts exactly match isEligible for hand-built populations and invalid choices match commands',()=>{
    const s=ready(5),cmd=command();s.creatures[0].needs!.hunger=90;s.creatures[1].stage='baby';s.creatures[2].needs!.fatigue=75;
    const event=createCompetition(clone(s),command(null));expect(competitionPreview(s,cmd).eligible).toBe(s.creatures.filter(c=>isEligible(c,event).eligible).length);
    for(const bad of [{...cmd,startDelay:0},{...cmd,entryRules:{...cmd.entryRules,maximumEntrants:100}},{...cmd,format:'power',skill:'run'}] as typeof cmd[]){const reason=creationReason(s,bad);expect(competitionPreview(s,bad).messages[0]).toBe(reason);expect(()=>applyPlayerCommand(s,bad)).toThrow(reason!);}
  });
  it('migrates a real 9a save, preserves prior creature/RNG/clocks, and replaces rare sources without adding time',()=>{
    const s=decodeSave(JSON.stringify(old));expect(s.schemaVersion).toBe(10);expect(s.clock).toEqual(old.clock);expect(s.rng).toEqual(old.rng);expect(s.inventory).toEqual(config.prizes.starter);
    for(const [i,c] of s.creatures.entries()){const {awards,...prior}=c;expect(prior).toEqual(old.creatures[i]);expect(awards.owned).toEqual([]);expect(awards.trophies).toEqual([]);}expect(s.world.plants.every(p=>!config.fruit[p.kind].rare)).toBe(true);expect(s.settings.autoPrizes).toBe(false);conserve(s);
  });
  it('migrates 9a committed work without rerolls, and preserves prior life wins without fabricating trophies',()=>{
    const historical=(state:SaveState)=>{
      const data=JSON.parse(JSON.stringify(state));data.schemaVersion=9;data.rulesVersion='0.9.0';delete data.prizeLedger;delete data.settings.autoPrizes;
      for(const group of Object.values(data.inventory) as Record<string,number>[])for(const id of Object.keys(group))group[id]=0;
      for(const c of [...data.creatures,...data.lineage])delete c.awards;
      for(const e of [...data.competitions,...data.competitionHistory]){delete e.escrowState;delete e.awarded;delete e.deliveries;
        for(const row of e.snapshots)delete row.confidence;
        for(const round of e.results?.rounds??[])for(const row of round.ranking)delete row.confidence;
      }
      data.events=data.events.filter((e:{kind:string})=>e.kind!=='trophyEarned');return data;
    };
    let s=opened(null);s=until(s,s.competitions[0].startTick+40);const old=historical(s),migrated=decodeSave(JSON.stringify(old));
    expect(migrated.rng).toEqual(s.rng);expect(migrated.competitions[0].results).toEqual(old.competitions[0].results);
    const end=migrated.competitions[0].endTick,done=until(migrated,end);expect(done.competitionHistory[0].status).toBe('resolved');expect(done.creatures.reduce((n,c)=>n+c.awards.wins,0)).toBe(1);
    const won=decodeSave(JSON.stringify(historical(done)));for(const c of won.creatures){expect(c.awards.wins).toBe(c.competition.stats.wins);expect(c.awards.trophies).toEqual([]);}expect(decodeSave(encodeSave(won))).toEqual(won);
  });
  it('round-trips held escrow, fruit handoff, trophies and equipped cosmetics with identical continuation',()=>{
    let s=opened();for(const t of [s.clock.tick,s.competitions[0].startTick+30,s.competitions[0].endTick,s.competitions[0].endTick+50]){s=until(s,t);const loaded=decodeSave(encodeSave(s));expect(advanceTicks(loaded,100)).toEqual(advanceTicks(s,100));}
  });
  it('rejects tampering with settlement, cosmetic ownership, delivery and supply counts',()=>{
    let s=opened();s=until(s,s.competitions[0].endTick);
    for(const edit of [(s:SaveState)=>{s.inventory.fruit.prismpear++;},(s:SaveState)=>{s.competitionHistory[0].awarded=false;},(s:SaveState)=>{s.competitionHistory[0].deliveries=[];},(s:SaveState)=>{s.creatures[0].awards.equipped='star_pin';},(s:SaveState)=>{s.creatures[0].awards.xpThisPeriod=config.prizes.xpPerPeriodCap+1;}]){const bad=clone(s);edit(bad);expect(()=>decodeSave(JSON.stringify(bad))).toThrow();}
  });
  it('same seed with automatic competitions and prizes is identical for 50,000 ticks, with conserved stock',()=>{
    const run=()=>{let s=createHabitat(271828);s.settings.autoCompetitions=true;s.settings.autoPrizes=true;for(let i=0;i<50000;i++){s=tick(s);if(i%5000===0){conserve(s);encodeSave(s);}}return s;};
    const a=run(),b=run();expect(a).toEqual(b);conserve(a);expect(a.prizeLedger.delivered).toBeGreaterThan(0);expect(a.prizeLedger.rareFruitEaten).toBeGreaterThan(0);expect(a.creatures.some(c=>c.awards.owned.length>0)).toBe(true);expect(decodeSave(encodeSave(a))).toEqual(a);
  },180000);
});
