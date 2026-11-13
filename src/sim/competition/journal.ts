import { recordLifeEvent } from '../life-records';
import type { Competition, LifeEvent, PlayerCommand, SaveState } from '../types';
export function competitionEvent(state:SaveState,event:Competition,kind:LifeEvent['kind'],reason:string|null=null,id?:string,command?:PlayerCommand):void{
  const c=state.creatures.find(c=>c.id===id)??state.creatures.find(c=>c.id===event.entrantIds[0])??state.creatures[0];
  const archived=state.lineage.find(l=>l.id===id)??state.lineage.at(-1);
  const creatureId=id??c?.id??archived?.id;if(!creatureId)return;
  const subject=state.creatures.find(c=>c.id===creatureId);
  recordLifeEvent(state,{kind,creatureId,from:subject?.stage??null,to:subject?.stage??'dead',relatedCreatureId:null,
    competitionEvent:{id:event.id,reason},...(command?{command}:{})});
}
