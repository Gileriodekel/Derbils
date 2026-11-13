import { grantDailyCache } from '../src/sim/competition/inventory';
import { describe, expect, it } from 'vitest';
import fixture from './fixtures/milestone-5a.json';
import { config, lifeStages } from '../src/data/config';
import { createSingleHabitat as createHabitat } from './helpers';
import { spawnCreature, spawnEgg } from '../src/sim/spawn';
import { forceStage, ageCreatureBy } from '../src/sim/debug-lifecycle';
import { stageAtAge, stageStartAge, lifespan } from '../src/sim/life-stages';
import { rebirthEligible } from '../src/sim/lifecycle';
import { tick, advanceTicks } from '../src/sim/tick';
import { derivePhenotype } from '../src/sim/genetics/expression';
import { setTraitValue } from '../src/sim/genetics/edits';
import { advanceNeeds } from '../src/sim/needs';
import { skillCap, skillLevel, xpAtLevel, xpGain } from '../src/sim/skills';
import { decide } from '../src/sim/brain';
import { navigationTerrain } from '../src/sim/food-sources';
import { encodeSave, decodeSave } from '../src/persistence/save';
import type { LifeStage } from '../src/sim/types';

const eggWorld = () => { const s = createHabitat(); return forceStage(s,s.creatures[0].id,'egg'); };

describe('deterministic life stages', () => {
  it('maps every boundary to the specified next stage, with no lifespan variance', () => {
    expect(lifespan()).toBe(58200); expect(lifespan(1)).toBe(58800);
    expect(config.lifecycle.firstLife).toEqual(['egg','baby','juvenile','adult','elder']);
    const durations = [600,2400,4800,43200,7200];
    let age = 0;
    for(const [i,stage] of config.lifecycle.firstLife.entries()) {
      expect(config.lifecycle.stages[stage].durationTicks).toBe(durations[i]);
      expect(stageAtAge(age)).toBe(stage);expect(stageAtAge(age+durations[i]-1)).toBe(stage);age+=durations[i];
    }
    expect(stageAtAge(age)).toBeNull();
  });
  it('traverses a complete first life in exact order and dies only at the elder boundary', () => {
    let s = eggWorld(), seen:LifeStage[] = ['egg'];
    const id = s.creatures[0].id;
    for(let t=0;t<lifespan();t++) {
      const before=s.creatures[0];s=tick(s);
      if(s.creatures[0]&&s.creatures[0].stage!==before.stage)seen.push(s.creatures[0].stage);
      if(t<lifespan()-1)expect(s.creatures[0]?.stage).toBe(stageAtAge(t+1));
    }
    expect(seen).toEqual(config.lifecycle.firstLife);expect(s.creatures).toHaveLength(0);
    const l=s.lineage.find(l=>l.id===id)!;expect(l.deathTick).toBe(58200);expect(l.ageAtDeath).toBe(58200);expect(l.finalStage).toBe('elder');
    expect(l.endReason).toBe('oldAge');expect(l.topSkill).not.toBeNull();expect(decodeSave(encodeSave(s))).toEqual(s);
    expect(advanceTicks(s,100).creatures).toEqual([]);
  },30000);
  it('eggs do no needs, travel, brain or XP work and hatch on the exact timer', () => {
    const s=eggWorld(),c=s.creatures[0], genome=structuredClone(c.genome), rng=c.rng;
    decide(s,c,navigationTerrain(s.world));expect(c.currentAction).toBeNull();
    const before=advanceTicks(s,599).creatures[0];expect(before.needs).toBeNull();expect(before.position).toEqual(c.position);
    expect(before.rng).toBe(rng);expect(before.xp).toEqual(c.xp);expect(before.welfare.ticks).toBe(0);
    const hatch=tick(advanceTicks(s,599)),baby=hatch.creatures[0];
    expect(baby.stage).toBe('baby');expect(baby.age).toBe(600);expect(baby.needs).toEqual(config.needs.newborn);
    expect(baby.welfare.ticks).toBe(0);expect(derivePhenotype(baby.genome)).toEqual(derivePhenotype(genome));
    expect(hatch.events.filter(e=>e.kind==='hatch')).toHaveLength(1);
  });
  it.each([
    ['baby',1.2,.6,15,.55],['juvenile',1.1,1.25,45,.78],['adult',1,1,70,1],['elder',.9,.5,70,.95],
  ] as const)('applies %s needs, XP, skill cap and scale exactly', (stage,needs,xp,cap,scale) => {
    const s=createHabitat();s.creatures[0].genome=setTraitValue(s.creatures[0].genome,'aptitudes','run',.5);
    const c=forceStage(s,s.creatures[0].id,stage).creatures[0];c.mood=1;
    expect(skillCap(c,'run')).toBe(cap);expect(xpGain(c,'run',1,0)).toBeCloseTo(xp,14);
    const hunger=c.needs!.hunger,fatigue=c.needs!.fatigue;advanceNeeds(c,0);
    expect(c.needs!.hunger-hunger).toBeCloseTo(config.needs.perMinute.hunger/60*needs,14);
    expect(c.needs!.fatigue-fatigue).toBeCloseTo(config.needs.perMinute.fatigue/60*needs,14);
    expect(config.lifecycle.stages[stage].scale).toBe(scale);
    if(stage==='elder')expect(config.lifecycle.stages[stage].performanceMultiplier).toBe(.85);
  });
  it('preserves XP, level and learned preferences at every normal mobile stage transition', () => {
    for(const stage of ['baby','juvenile','adult'] as const) {
      let s=createHabitat(),c=s.creatures[0];s=forceStage(s,c.id,stage);c=s.creatures[0];
      const duration=config.lifecycle.stages[stage].durationTicks;
      s.clock.tick=duration-1;c.age=stageStartAge(stage)+duration-1;
      c.xp.run=xpAtLevel(10,'run');c.foodPreferences.sunapple={learnedMean:.37,samples:3};
      c.lastFiveFoods=['sunapple','sunapple','sunapple'];c.lastMeal={fruit:'sunapple',tick:0,preference:.3,reward:.2};
      c.currentAction={kind:'idle',target:{...c.position},targetFruitId:null,path:[],workTicks:0};
      const next=tick(s).creatures[0];expect(next.xp).toEqual(c.xp);expect(next.foodPreferences).toEqual(c.foodPreferences);
      expect(skillLevel(next,'run')).toBe(skillLevel(c,'run'));expect(decodeSave(encodeSave(tick(s))).creatures[0].foodPreferences).toEqual(c.foodPreferences);
    }
  });
  it('advances debug aging through normal world ticks and keeps force-stage overrides explicit', () => {
    const s=createHabitat(),id=s.creatures[0].id;
    expect(ageCreatureBy(s,id,100)).toEqual(advanceTicks(s,100));
    const forced=forceStage(s,id,'elder');expect(forced.creatures[0].age).toBe(51000);expect(forced.events.at(-1)?.kind).toBe('debugStage');
    const baby=forceStage(s,id,'baby');expect(baby.creatures[0].age).toBe(600);
    expect(()=>forceStage(s,id,'cocoon')).toThrow();expect(encodeSave(s)).toBe(encodeSave(createHabitat()));
  });
});

describe('rebirth legacy, death and persistence', () => {
  function eligible() {
    let s=spawnCreature(spawnCreature(createHabitat()));s=forceStage(s,s.creatures[0].id,'elder');
    const c=s.creatures[0];s.clock.tick=7199;grantDailyCache(s);c.age=lifespan()-1;c.welfare={total:700,ticks:800};c.rng=1;
    for(const other of s.creatures.slice(1)) {
      other.age+=7199;
      s.relationships.push({a:c.organismId,b:other.organismId,bond:80,mateBond:20,lastContactTick:s.clock.tick,lastDecayTick:s.clock.tick,history:[]});
    }
    return s;
  }
  it('performs eligible rebirth without mutation, retains legacy memory, and preserves organism continuity', () => {
    const s=eligible(),old=s.creatures[0];old.foodPreferences.sunapple={learnedMean:.5,samples:3};
    old.lastFiveFoods=['sunapple','sunapple','sunapple'];old.lastMeal={fruit:'sunapple',tick:0,preference:.3,reward:.2};
    old.personalityDrift.boldness=.1;old.xp.run=xpAtLevel(10,'run');
    const original=encodeSave(s);
    expect(rebirthEligible(s,old)).toBe(true);const next=tick(s),c=next.creatures.find(c=>c.organismId===old.organismId)!;
    expect(encodeSave(s)).toBe(original);
    expect(c.stage).toBe('cocoon');expect(c.id).not.toBe(old.id);expect(c.lifeIndex).toBe(1);expect(c.genome).toEqual(old.genome);
    expect(c.needs).toBeNull();expect(Object.values(c.xp).every(x=>x===0)).toBe(true);
    expect(c.foodPreferences.sunapple).toEqual({learnedMean:.25,samples:3});expect(c.lastFiveFoods).toEqual([]);
    expect(c.personalityDrift.boldness).toBeCloseTo(.1*Math.exp(-1/(20*1200))*.5);
    expect(next.relationships[0]).toMatchObject({bond:40,mateBond:10,rivalry:10,familiarity:.5});
    expect(next.lineage.find(l=>l.id===old.id)?.endReason).toBe('rebirth');expect(next.creatures).toHaveLength(3);
    expect(decodeSave(encodeSave(next))).toEqual(next);
    expect(advanceTicks(next,1199).creatures.find(p=>p.id===c.id)?.stage).toBe('cocoon');
    const hatch=advanceTicks(next,1200).creatures.find(p=>p.id===c.id)!;
    expect(hatch.stage).toBe('baby');expect(hatch.foodPreferences.sunapple).toEqual(c.foodPreferences.sunapple);
  });
  it('requires welfare, two living friends, a remaining rebirth, and the specified RNG roll', () => {
    const s=eligible(),c=s.creatures[0];expect(rebirthEligible(s,c)).toBe(true);
    c.welfare.total=0;expect(rebirthEligible(s,c)).toBe(false);c.welfare.total=700;
    s.relationships.pop();expect(rebirthEligible(s,c)).toBe(false);
    const again=eligible();again.creatures[0].lifeIndex=2;expect(rebirthEligible(again,again.creatures[0])).toBe(false);
  });
  it('with rescue disabled, old-age death empties the habitat and closes its records', () => {
    let s=createHabitat();s=forceStage(s,s.creatures[0].id,'elder');
    s=advanceTicks(s,7200);expect(s.creatures).toHaveLength(0);expect(s.lineage[0].parentIds).toBeNull();
    expect(s.organisms[0].lives[0].endedTick).toBe(7200);expect(decodeSave(encodeSave(s))).toEqual(s);
  });
  it('spawns a configured egg from a genome with founder lineage and enforces the 30-slot cap', () => {
    let s=createHabitat();s=spawnEgg(s,s.creatures[0].genome);
    expect(s.creatures[1].stage).toBe('egg');expect(s.creatures[1].age).toBe(0);expect(s.lineage[1].parentIds).toBeNull();
    while(s.creatures.length<config.lifecycle.capacity)s=spawnEgg(s,s.creatures[0].genome);
    expect(s.creatures).toHaveLength(30);expect(spawnCreature(s)).toBe(s);expect(spawnEgg(s,s.creatures[0].genome)).toBe(s);
    expect(decodeSave(encodeSave(s))).toEqual(s);
  });
  it.each(lifeStages.filter(s=>s!=='cocoon'))('round-trips mid-%s, including unchanged continuation', stage => {
    let s=createHabitat();s=forceStage(s,s.creatures[0].id,stage);s=advanceTicks(s,137);
    expect(advanceTicks(decodeSave(encodeSave(s)),100)).toEqual(advanceTicks(s,100));
  });
  it('migrates a real 5a checkpoint to the start of adulthood and founder lineage, preserving previous work', () => {
    const s=decodeSave(JSON.stringify(fixture)),c=s.creatures[0];
    expect(s.schemaVersion).toBe(10);expect(c.stage).toBe('adult');expect(c.age).toBe(7800);expect(c.stageStartedTick).toBe(s.clock.tick);
    expect(c.genome).toEqual(fixture.creatures[0].genome);expect(c.xp).toEqual(fixture.creatures[0].xp);
    expect(c.needs).toEqual(fixture.creatures[0].needs);expect(c.currentAction).toEqual(fixture.creatures[0].currentAction);
    expect(c.foodPreferences).toEqual(fixture.creatures[0].foodPreferences);expect(s.rng).toEqual(fixture.rng);expect(s.clock).toEqual(fixture.clock);
    expect(s.lineage[0]).toMatchObject({id:c.id,parentIds:null,birthTick:0,deathTick:null});
    expect(decodeSave(JSON.stringify(fixture))).toEqual(s);expect(decodeSave(encodeSave(s))).toEqual(s);
  });
  it('rejects contradictory ages, missing lineage, malformed parents and dormant work', () => {
    for(const corrupt of [(s:ReturnType<typeof createHabitat>)=>{s.creatures[0].age=0;},
      (s:ReturnType<typeof createHabitat>)=>{s.lineage=[];},
      (s:ReturnType<typeof createHabitat>)=>{s.lineage[0].parentIds=[s.creatures[0].id];},
      (s:ReturnType<typeof createHabitat>)=>{s.creatures[0].needs=null;}]) {
      const s=createHabitat();corrupt(s);expect(()=>decodeSave(JSON.stringify(s))).toThrow(/Invalid save/);
    }
  });
  it('replays 20,000 ticks identically with ages, stages, welfare and lineage', () => {
    let initial=createHabitat(92318);
    initial=spawnEgg(initial,initial.creatures[0].genome);
    initial=forceStage(initial,initial.creatures[0].id,'elder');
    const a=advanceTicks(initial,20000),b=advanceTicks(initial,20000);
    expect(a).toEqual(b);expect(a.lineage.some(l=>l.endReason==='oldAge')).toBe(true);
    expect(a.events.some(e=>e.kind==='hatch')).toBe(true);
  },30000);
});
