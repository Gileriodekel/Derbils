import previous from '../src/data/legacy/timing-v11.json';
import {stageStartAge} from '../src/sim/life-stages';
import { describe, it, expect } from 'vitest';
const fixtures=import.meta.glob('./fixtures/saves/*.json',{query:'?raw',import:'default',eager:true}) as Record<string,string>;
import { config, skillKeys } from '../src/data/config';
import { createHabitat } from '../src/sim/habitat';
import { encodeCheckpoint, decodeCheckpoint } from '../src/persistence/checkpoint';
import { derivePhenotype } from '../src/sim/genetics/expression';
import { decodeSave as decodeHistoricalSave } from '../src/persistence/legacy/v1-v10.js';
import { decodeSave } from '../src/persistence/save';
import { validateState } from '../src/sim/validate-state';

describe('Dynasty shared data and save migration', () => {
  it('has exactly the five named performance stats and independent color loci', () => {
    expect(skillKeys).toEqual(['run', 'swim', 'fly', 'strength', 'stamina']);
    expect(skillKeys.map(s => config.dynasty.stats[s].color)).toEqual(['#FE66AB','#EAB607','#9F55E1','#EE4930','#437CF5']);
    const s = createHabitat(271828, 2);
    expect(Object.keys(derivePhenotype(s.creatures[0].genome).aptitudes)).toEqual(skillKeys);
    expect(derivePhenotype(s.creatures[0].genome).palette).toHaveProperty('feetHue');
    expect(derivePhenotype(s.creatures[0].genome).palette).toHaveProperty('tailHue');
  });
  it('round trips all new timers and fields exactly', () => {
    const s = createHabitat(42, 2);
    expect(validateState(s, config)).toEqual([]);
    expect(decodeCheckpoint(encodeCheckpoint(s, 123)).state).toEqual(s);
  });
  it('preserves retained genes, needs, stage progress, XP, memories and ancestry from the previous schema',()=>{
    const input=fixtures['./fixtures/saves/v10.json'];
    const old=decodeHistoricalSave(input) as ReturnType<typeof createHabitat>,s=decodeSave(input);
    expect(s.clock).toEqual(old.clock);expect(s.rng).toEqual(old.rng);expect(s.organisms).toEqual(old.organisms);
    for(const [i,c]of s.creatures.entries()){
      const before=old.creatures[i];expect(c.stage).toBe(before.stage);expect(c.age).toBe(stageStartAge(c.stage,c.lifeIndex)+Math.floor((old.clock.tick-before.stageStartedTick)*config.lifecycle.stages[c.stage].durationTicks/previous.stages[c.stage]));expect(c.needs).toEqual(before.needs);expect(c.rng).toBe(before.rng);expect(c.foodPreferences).toEqual(before.foodPreferences);
      expect(c.genome.shape).toEqual(before.genome.shape);expect(c.genome.temperament).toEqual(before.genome.temperament);
      for(const [j,h]of c.genome.palette.haplotypes.entries())expect(h.slice(0,-2)).toEqual(before.genome.palette.haplotypes[j]);
      for(const skill of skillKeys){expect(c.xp[skill]).toBe(before.xp[skill]);expect(c.trainingTicks[skill]).toBe(before.trainingTicks[skill]);}
    }
    const alias=JSON.stringify(JSON.parse(input)).replaceAll('"strength":','"power":').replaceAll('"skill":"strength"','"skill":"power"');expect(decodeSave(alias)).toEqual(s);
  });
  for (const version of [1,2,3,4,5,6,7,8,9,10,11]) it(`migrates historical save ${version}`, () => {
    const input = fixtures[`./fixtures/saves/v${version}.json`];
    const state = version === 11 ? decodeCheckpoint(input).state : decodeSave(input);
    expect(validateState(state, config)).toEqual([]);
    expect(state.schemaVersion).toBe(12);
    expect(encodeCheckpoint(state, 123)).toEqual(encodeCheckpoint(decodeCheckpoint(encodeCheckpoint(state, 123)).state, 123));
  });
});
