import { config, skillKeys } from '../../data/config';
import { isArchivedAncestor } from '../archive';
import { emptyAwards } from '../competition/inventory';
import { lifespanAtDeath } from '../historical-time';
import type { LineageRecord, SaveState } from '../types';
import { exactKeys, integer, requireValue } from './checks';

/** Materialize validation-only summaries; compact stubs never regain mutable gameplay data. */
export function validationLineage(state:SaveState):LineageRecord[]{
  if(!state.archive)return state.lineage;
  const archive=state.archive;
  requireValue(exactKeys(archive,['stubs','cosmetics','removedLives','removedOrganisms'])&&integer(archive.removedLives)&&integer(archive.removedOrganisms)
    &&Array.isArray(archive.stubs)&&archive.stubs.length<=config.offline.archive.maximumStubs,'archive bounds');
  requireValue(Object.entries(archive.cosmetics).every(([id,n])=>Object.hasOwn(config.prizes.starter.cosmetics,id)&&integer(n)),'archived cosmetics');
  const nodes=new Map(state.organisms.map(o=>[o.id,o]));
  return [...state.lineage,...archive.stubs.map(stub=>{
    requireValue(exactKeys(stub,['id','organismId','parentIds','birthTick','deathTick','topSkill','generation'])&&integer(stub.deathTick,stub.birthTick,state.clock.tick)&&integer(stub.generation),'lineage stub');
    const organism=nodes.get(stub.organismId),life=organism?.lives.find(l=>l.creatureId===stub.id);
    requireValue(life&&life.endedTick!==null,'archived life');
    return {...stub,awards:emptyAwards(),displayName:life!.displayName,finalStage:'elder' as const,ageAtDeath:lifespanAtDeath(state,stub.deathTick,life!.lifeIndex),
      endReason:life!.lifeIndex<organism!.lives.length-1?'rebirth' as const:'oldAge' as const,
      origin:stub.parentIds?'birth' as const:'founder' as const,birthAptitudes:Object.fromEntries(skillKeys.map(k=>[k,0])) as LineageRecord['birthAptitudes'],mutations:[]};
  })];
}
export function validParentMarker(id:string,state:SaveState):boolean {
  return !!state.archive&&isArchivedAncestor(id);
}
