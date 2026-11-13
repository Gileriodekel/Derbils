import { expect, it, vi } from 'vitest';
vi.mock('../src/data/config',async importOriginal=>{
  const original=await importOriginal<typeof import('../src/data/config')>();
  return {...original,config:{...original.config,lifecycle:{...original.config.lifecycle,eventLogLimit:2}}};
});
import { config } from '../src/data/config';
import { createHabitat } from '../src/sim/habitat';
import { advance } from '../src/sim/advance';
import { createSummary, accumulateSummary } from '../src/app/summary';
import { forceStage } from '../src/sim/debug-lifecycle';
import { hashState } from '../src/sim/hash';
import { assertInvariants } from './helpers/invariants';

it('counts every autonomous event even when the journal constantly evicts',()=>{
  const initial=createHabitat(271828);initial.settings.autoCompetitions=true;initial.settings.autoPrizes=true;
  let summary=createSummary(initial,120000,true),emitted=0;
  const after=advance(initial,initial.rng,30000,(_before,after,output)=>{
    emitted+=output.events.length;summary=accumulateSummary(summary,after,output,config);
  });
  expect(after.events.length).toBeLessThanOrEqual(2);expect(emitted).toBeGreaterThan(100);
  expect(summary.births).toBe(after.lineage.filter(l=>l.origin==='birth').length);
  expect(summary.hatchings).toBe(after.lineage.filter(l=>l.origin==='birth'&&after.creatures.find(c=>c.id===l.id)?.stage!=='egg').length);
  expect(summary.friendships).toBe(after.social.statistics.friendships-initial.social.statistics.friendships);
  expect(summary.rivalries).toBe(after.social.statistics.rivalries-initial.social.statistics.rivalries);
  expect(summary.mateBonds).toBe(after.social.statistics.mateBondsFormed-initial.social.statistics.mateBondsFormed);
  expect(summary.competitionsResolved).toBe(after.competitionState.statistics.held);
  expect(summary.competitionsCancelled).toBe(after.competitionState.statistics.cancelled);
  expect(summary.prizesAwarded).toBe(after.competitionHistory.flatMap(e=>e.deliveries).filter(d=>d.destination!=='inventory').length);
  expect(summary.generationsPassed).toBe(Math.max(...after.lineage.map(l=>l.generation)));
  expect(summary.skillMilestones).toBeGreaterThan(0);expect(summary.bodyParts).toBeGreaterThan(0);
  expect(summary.notable.length).toBeLessThanOrEqual(config.offline.summary.notableLimit);
  expect(summary.notable.some(e=>e.kind==='competitionResult'&&e.detail.includes('won'))).toBe(true);
  expect(hashState(after)).toBe(hashState(advance(initial,initial.rng,30000)));assertInvariants(after,config);
},120000);

it('records all same-tick elder deaths, rescue eggs and later hatchings beyond a tiny journal cap',()=>{
  let state=createHabitat(71,3);state.settings.autoBreed=false;
  for(const c of [...state.creatures])state=forceStage(state,c.id,'elder');
  state=advance(state,state.rng,config.lifecycle.stages.elder.durationTicks-1);
  for(const c of state.creatures)c.welfare.total=0; // Make rebirth ineligible; isolate permanent departures.
  let summary=createSummary(state);
  const after=advance(state,state.rng,1+config.lifecycle.stages.egg.durationTicks,(_before,after,output)=>{summary=accumulateSummary(summary,after,output,config);});
  expect(summary.deaths.elder).toBe(3);expect(summary.rescueEggs).toBe(config.breeding.rescueCount);
  expect(summary.hatchings).toBe(config.breeding.rescueCount);expect(summary.births).toBe(0);
  expect(after.lineage.filter(l=>l.endReason==='oldAge')).toHaveLength(3);
  expect(after.creatures.every(c=>c.stage==='baby')).toBe(true);expect(after.events).toHaveLength(2);assertInvariants(after,config);
},30000);
