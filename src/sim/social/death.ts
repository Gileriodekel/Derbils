import { config } from '../../data/config';
import { clamp } from '../needs';
import { recordLifeEvent } from '../life-records';
import { endMateBond } from './relationships';
import type { Creature, SaveState } from '../types';

/** Permanent loss only; a reborn organism retains its scaled relationships. */
export function removeSocialLife(state:SaveState,dead:Creature,friends:Set<string>,mourningEnabled=config.social.mourning.enabled):void{
  if(mourningEnabled)for(const c of state.creatures)if(c.needs&&friends.has(c.organismId)){
    c.recentValence=clamp(c.recentValence+config.lifecycle.rebirth.friendValence,...config.food.valenceBounds);
    c.needs.stress=clamp(c.needs.stress+config.lifecycle.rebirth.friendStress);
    c.social.mourning={organismId:dead.organismId,untilTick:state.clock.tick+config.social.mourning.durationTicks};
    recordLifeEvent(state,{kind:'mourning',creatureId:c.id,from:c.stage,to:c.stage,relatedCreatureId:dead.id});
  }
  // A permanently ended organism can never use a breeding policy again.
  const rules=state.breedingRules,alive=(id:string)=>id!==dead.organismId;
  state.breedingRules={blockedIndividuals:rules.blockedIndividuals.filter(alive),encouragedIndividuals:rules.encouragedIndividuals.filter(alive),
    blockedPairs:rules.blockedPairs.filter(p=>p.every(alive)),encouragedPairs:rules.encouragedPairs.filter(p=>p.every(alive)),exclusivePairs:rules.exclusivePairs.filter(p=>p.every(alive))};
  state.relationships=state.relationships.filter(r=>{if(r.a!==dead.organismId&&r.b!==dead.organismId)return true;endMateBond(state,r);return false;});
  for(const c of state.creatures){
    c.social.targets=c.social.targets.filter(id=>id!==dead.organismId);delete c.social.contestCooldowns[dead.organismId];
    if(c.currentAction?.targetCreatureId===dead.id){c.currentAction=null;c.nextDecisionTick=state.clock.tick+1;}
  }
}
