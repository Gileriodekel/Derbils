import { describe, expect, it } from 'vitest';
import fixture from './fixtures/saves/dynasty-v11-calendar.json';
import sessionsFixture from './fixtures/saves/dynasty-v11-sessions.json';
import { config } from '../src/data/config';
import { createHabitat } from '../src/sim/habitat';
import { lifespan, stageStartAge } from '../src/sim/life-stages';
import { tick } from '../src/sim/tick';
import { forceStage } from '../src/sim/debug-lifecycle';
import { validateState } from '../src/sim/validate-state';
import { ensureRelationship, relationship } from '../src/sim/social/relationships';
import { commitSocialOutcome } from '../src/sim/social/outcomes';
import { resolveInteraction } from '../src/sim/social/interaction';
import { socialGraph } from '../src/ui/social-web';
import { relationshipLabel } from '../src/sim/dynasty/social';
import { namedView } from '../src/app/names';
import { decodeCheckpoint, encodeCheckpoint } from '../src/persistence/checkpoint';
import { config as previous } from '../src/persistence/legacy/v11.js';

describe('three-section relationships', () => {
  it('draws friend/foe lines only in the matching third, using current decayed scores', () => {
    for (const score of [-100, -100/3-.001, -100/3, -100/3+.001, 0, 100/3-.001, 100/3, 100]) {
      const state = createHabitat(17,2), [a,b] = state.creatures;
      const edge = ensureRelationship(state,a.organismId,b.organismId); edge.bond = score;
      const kind = relationshipLabel(score), links = socialGraph(state).links;
      expect(links.map(l=>l.kind)).toEqual(kind==='Neutral'?[]:[kind.toLowerCase()]);
    }
    const state = createHabitat(18,2), [a,b] = state.creatures;
    const edge = ensureRelationship(state,a.organismId,b.organismId); edge.bond=-34;
    state.clock.tick=3*config.clock.dayTicks;
    expect(relationshipLabel(relationship(state,edge.a,edge.b)!.bond)).toBe('Neutral');
    expect(socialGraph(state).links).toEqual([]);
    edge.mateBond=90;
    expect(socialGraph(state).links.map(l=>l.kind)).toEqual(['mate']);
  });
  it('builds a buffered mate bond in three ordinary friendly plays from neutral', () => {
    const s=createHabitat(19,2), [a,b]=s.creatures;
    for(let i=0;i<3;i++) {
      // Comfort is deterministic; use a real friendly play outcome without accepting a rude roll.
      let result=resolveInteraction(a,b,'play',i+1,config,relationship(s,a.organismId,b.organismId)?.bond??0);
      for(let rng=i+2;result.outcome!=='friendly';rng++) result=resolveInteraction(a,b,'play',rng,config,relationship(s,a.organismId,b.organismId)?.bond??0);
      commitSocialOutcome(s,a,b,'play',result);
    }
    expect(relationship(s,a.organismId,b.organismId)!.mateBond).toBeGreaterThanOrEqual(config.dynasty.relationships.mateStartingBond);
    expect(s.social.statistics.mateBondsFormed).toBe(1);
  });
  it.each([271828,314159,161803])('finds mates and has offspring without player pairing (seed %i)', seed => {
    let s=createHabitat(seed),firstMate:number|null=null;
    for(let i=0;i<1500;i++){
      s=tick(s);
      if(firstMate===null&&s.social.statistics.mateBondsFormed>0)firstMate=s.clock.tick;
    }
    expect(firstMate).not.toBeNull();expect(firstMate!).toBeLessThan(300);
    expect(s.lineage.some(l=>l.origin==='birth')).toBe(true);
    expect(validateState(s,config)).toEqual([]);
  },30000);
});

describe('one-minute days and thirty-day lives', () => {
  it('ages an egg through exactly 1,800 ticks and consumes a guarantee for the next full life', () => {
    expect(config.clock.dayTicks*config.clock.tickSeconds).toBe(60);
    expect(lifespan()).toBe(1800);expect(lifespan(1)).toBe(1800);
    let s=createHabitat(20,1);s=forceStage(s,s.creatures[0].id,'egg');
    s.settings.autoBreed=false;s.settings.extinctionRescue=false;
    s.creatures[0].dynasty.reincarnationFruit=1;
    for(let i=0;i<1799;i++)s=tick(s);
    expect(s.creatures[0].age).toBe(1799);expect(s.creatures[0].stage).toBe('elder');
    s=tick(s);expect(s.clock.tick/config.clock.dayTicks).toBe(30);
    expect(s.lineage[0].ageAtDeath).toBe(1800);
    expect(s.creatures[0]).toMatchObject({age:0,stage:'cocoon',lifeIndex:1});
    expect(s.creatures[0].dynasty.reincarnationFruit).toBe(0);
    expect(namedView(s).creatures[0].displayName).toBe('Daroboo');
    expect(validateState(s,config)).toEqual([]);
  },30000);
  it('keeps Daroboo in every new world and in saved, displayed and reincarnated records', () => {
    for(const seed of [1,2,17,999,0xffffffff]) {
      const s=createHabitat(seed), loaded=decodeCheckpoint(encodeCheckpoint(s,0)).state;
      expect(s.creatures[0].displayName).toBe('Daroboo');
      expect(loaded.organisms[0].lives[0].displayName).toBe('Daroboo');
      expect(namedView(loaded).lineage[0].displayName).toBe('Daroboo');
      expect(namedView(loaded).creatures[0].displayName).toBe('Daroboo');
    }
  });
});

describe('schema-11 calendar migration', () => {
  it('preserves progress of active play and courtship when their durations shorten', () => {
    const state=decodeCheckpoint(JSON.stringify(sessionsFixture)).state;
    expect(state.social.sessions[0].workTicks).toBe(19);
    expect(state.sessions[0].workTicks).toBe(14);
    expect(validateState(state,config)).toEqual([]);
    const next=tick(state);
    expect(next.social.sessions.some(s=>s.id===state.social.sessions[0].id)).toBe(false);
    expect(next.social.statistics.interactions).toBeGreaterThan(state.social.statistics.interactions);
    expect(validateState(next,config)).toEqual([]);
  });
  it('preserves histories, current stage fraction and RNG without replaying past rewards', () => {
    const old=fixture.state, s=decodeCheckpoint(JSON.stringify(fixture)).state;
    expect(s.schemaVersion).toBe(12);expect(s.dynasty.calendarChangedAtTick).toBe(old.clock.tick);
    expect(s.clock).toEqual(old.clock);expect(s.rng).toEqual(old.rng);
    expect(s.organisms).toEqual(old.organisms);expect(s.lineage).toEqual(old.lineage);
    expect(s.events).toEqual(old.events);expect(s.inventory).toEqual(old.inventory);expect(s.prizeLedger).toEqual(old.prizeLedger);
    for(const [i,c] of s.creatures.entries()) {
      const before=old.creatures[i];
      const progress=Math.floor((s.clock.tick-before.stageStartedTick)*config.lifecycle.stages[c.stage].durationTicks/previous.lifecycle.stages[c.stage].durationTicks);
      expect(c.age-stageStartAge(c.stage,c.lifeIndex)).toBe(progress);expect(c.stage).toBe(before.stage);
      expect(c.genome).toEqual(before.genome);expect(c.xp).toEqual(before.xp);expect(c.needs).toEqual(before.needs);
      expect(c.breeding.cooldownUntil).toBeLessThanOrEqual(before.breeding.cooldownUntil);
    }
    expect(s.dynasty.nextDerbyDay*60).toBeGreaterThan(s.clock.tick);
    const next=tick(s);expect(next.dynasty.events).toHaveLength(s.dynasty.events.length);
    expect(next.prizeLedger).toEqual(s.prizeLedger);
    expect(validateState(next,config)).toEqual([]);
  });
  it('round trips and continues exactly after migration, rejecting forged historical ages', () => {
    let a=decodeCheckpoint(JSON.stringify(fixture)).state,b=decodeCheckpoint(encodeCheckpoint(a,0)).state;
    expect(b).toEqual(a);
    for(let i=0;i<2000;i++){a=tick(a);b=tick(b);}
    expect(a).toEqual(b);expect(validateState(a,config)).toEqual([]);
    const bad=structuredClone(fixture.state);bad.creatures[0].age=999999;
    expect(()=>decodeCheckpoint(JSON.stringify(bad))).toThrow();
  },30000);
});
