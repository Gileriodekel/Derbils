import { expect, it } from 'vitest';
import { config } from '../src/data/config';
import { createHabitat } from '../src/sim/habitat';
import { advance } from '../src/sim/advance';
import { compactLineage, isArchivedAncestor } from '../src/sim/archive';
import { permittedKinship } from '../src/sim/kinship';
import { familyTie } from '../src/sim/social/family';
import { encodeSave, decodeSave } from '../src/persistence/save';
import { hashState } from '../src/sim/hash';
import { assertInvariants } from './helpers/invariants';

it('compacts dead branches to fixed-size stubs, then drops them; ownership conservation survives both',()=>{
  let state=createHabitat(17,1);state.settings.autoBreed=false;state.settings.extinctionRescue=false;
  state=advance(state,state.rng,60000);state.events=[];
  const settings={...config.offline.archive,maintenanceTicks:1,minimumAgeTicks:0,stubGenerationHorizon:0,maximumFullRecords:0};
  compactLineage(state,settings);expect(state.lineage).toHaveLength(0);expect(state.archive?.stubs).toHaveLength(1);
  expect(Object.keys(state.archive!.stubs[0]).sort()).toEqual(['id','organismId','parentIds','birthTick','deathTick','topSkill','generation'].sort());
  assertInvariants(state,config);expect(decodeSave(encodeSave(state))).toEqual(state);
  compactLineage(state,{...settings,maximumStubs:0});expect(state.organisms).toHaveLength(0);expect(state.archive!.stubs).toHaveLength(0);expect(state.archive!.removedLives).toBe(1);assertInvariants(state,config);
},45000);

it('keeps living-family facts, all-depth ancestry and subsequent simulation behavior unchanged',()=>{
  let before=createHabitat(271828);before.settings.autoCompetitions=true;before.settings.autoPrizes=true;
  before=advance(before,before.rng,160000);before.events=[];before.competitionHistory=[];
  const compacted=structuredClone(before);
  const settings={...config.offline.archive,maintenanceTicks:1,minimumAgeTicks:0,stubGenerationHorizon:2,dropGenerationHorizon:3,maximumFullRecords:0,maximumStubs:0};
  const pairs=before.creatures.flatMap(a=>before.creatures.map(b=>[a.organismId,b.organismId] as const));
  const facts=pairs.map(([a,b])=>[permittedKinship(before,a,b),familyTie(before,a,b)]);
  compactLineage(compacted,settings);expect(compacted.archive?.removedLives).toBeGreaterThan(0);
  expect(pairs.map(([a,b])=>[permittedKinship(compacted,a,b),familyTie(compacted,a,b)])).toEqual(facts);
  expect(compacted.creatures).toEqual(before.creatures);assertInvariants(compacted,config);
  expect(decodeSave(encodeSave(compacted))).toEqual(compacted);
  const afterA=advance(before,before.rng,1000),afterB=advance(compacted,compacted.rng,1000);
  expect(hashState(afterA.creatures)).toBe(hashState(afterB.creatures));expect(afterA.rng).toEqual(afterB.rng);
  for(const o of compacted.organisms)for(const parent of o.parents)expect(compacted.organisms.some(o=>o.id===parent)||isArchivedAncestor(parent)).toBe(true);
},240000);
