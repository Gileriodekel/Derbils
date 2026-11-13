import { config } from '../data/config';
import type { ArchiveState, LineageRecord, LineageStub, SaveState } from './types';

export function isArchivedAncestor(id:string):boolean { return /^archived:[oc]_[0-9]{8}:g[0-9]+$/.test(id); }
export function archivedGeneration(id:string):number { return Number(id.split(':g')[1]); }
const marker=(id:string,generation:number)=>`archived:${id}:g${generation}`;

/** Private tick boundary only. Preserve all living-family paths and bounded recent references. */
export function compactLineage(state:SaveState,tuning=config.offline.archive):void {
  if(state.clock.tick%tuning.maintenanceTicks!==0)return;
  if(state.clock.tick<=tuning.minimumAgeTicks&&state.lineage.length<=tuning.maximumFullRecords)return;
  const living=new Set(state.creatures.map(c=>c.organismId)),nodes=new Map(state.organisms.map(o=>[o.id,o]));
  const all=new Map<string,LineageRecord|LineageStub>([...state.lineage,...(state.archive?.stubs??[])].map(l=>[l.id,l]));
  const protectedOrganisms=new Set(living);
  if(state.dynasty.championOrganismId)protectedOrganisms.add(state.dynasty.championOrganismId);
  // Exact shallow kinship and immediate family labels for every living organism.
  function shallow(id:string,depth:number){if(depth<0||isArchivedAncestor(id))return;protectedOrganisms.add(id);for(const p of nodes.get(id)?.parents??[])shallow(p,depth-1);}
  for(const id of living)shallow(id,tuning.stubGenerationHorizon);
  // Also preserve every connector to a still-living ancestor at any depth.
  const reachesLiving=new Map<string,boolean>();
  function walk(id:string):boolean{
    if(isArchivedAncestor(id))return false;
    const previous=reachesLiving.get(id);if(previous!==undefined)return previous;
    const reaches=(nodes.get(id)?.parents??[]).map(walk).some(Boolean)||living.has(id);
    reachesLiving.set(id,reaches);if(reaches)protectedOrganisms.add(id);return reaches;
  }
  for(const id of living)walk(id);
  const protectLife=(id:string|null|undefined)=>{const l=id?all.get(id):null;if(l)protectedOrganisms.add(l.organismId);};
  for(const event of state.dynasty.events)for(const row of event.ranking)protectLife(row.id);
  for(const e of state.events){protectLife(e.creatureId);protectLife(e.relatedCreatureId);if(e.socialResult)protectLife(e.socialResult.winnerId);
    if(e.command){const c=e.command;if('id' in c&&nodes.has(c.id))protectedOrganisms.add(c.id);if('a' in c){protectedOrganisms.add(c.a);protectedOrganisms.add(c.b);}}}
  for(const e of [...state.competitions,...state.competitionHistory]){
    for(const id of [...e.entrantIds,...e.startedIds,...e.drops.map(d=>d.id),...e.snapshots.map(s=>s.id),...e.deliveries.map(d=>d.creatureId)])protectLife(id);
  }
  for(const c of state.creatures){
    protectLife(c.currentAction?.targetCreatureId);
    for(const id of [...c.social.targets,...Object.keys(c.social.contestCooldowns),c.social.mourning?.organismId,c.social.lastInteraction?.partner])if(id)protectedOrganisms.add(id);
  }
  const maximumGeneration=Math.max(0,...state.lineage.filter(l=>living.has(l.organismId)).map(l=>l.generation));
  const previous=state.archive;
  const archive:ArchiveState={stubs:[...(previous?.stubs??[])],cosmetics:{...previous?.cosmetics},removedLives:previous?.removedLives??0,removedOrganisms:previous?.removedOrganisms??0};
  const compact=new Set<string>();
  const byOrganism=new Map<string,LineageRecord[]>();
  for(const l of state.lineage){const records=byOrganism.get(l.organismId)??[];records.push(l);byOrganism.set(l.organismId,records);}
  let retained=state.lineage.length;
  for(const [id,records] of byOrganism){
    if(protectedOrganisms.has(id)||records.some(l=>l.deathTick===null))continue;
    const newest=Math.max(...records.map(l=>l.deathTick!)),generation=records[0].generation;
    const oldEnough=state.clock.tick-newest>=tuning.minimumAgeTicks&&generation<maximumGeneration-tuning.stubGenerationHorizon;
    if(!oldEnough&&retained<=tuning.maximumFullRecords)continue;
    compact.add(id);retained-=records.length;
    const owned=new Set(records.flatMap(l=>l.awards.owned));
    for(const cosmetic of owned)archive.cosmetics[cosmetic]=(archive.cosmetics[cosmetic]??0)+1;
    for(const l of records)archive.stubs.push({id:l.id,organismId:l.organismId,parentIds:l.parentIds,birthTick:l.birthTick,deathTick:l.deathTick!,topSkill:l.topSkill,generation:l.generation});
  }
  const drop=new Set<string>();
  const stubsByOrganism=new Map<string,LineageStub[]>();
  for(const l of archive.stubs){const records=stubsByOrganism.get(l.organismId)??[];records.push(l);stubsByOrganism.set(l.organismId,records);}
  let stubCount=archive.stubs.length;
  for(const [id,records] of stubsByOrganism){
    if(protectedOrganisms.has(id))continue;
    if(records[0].generation<maximumGeneration-tuning.dropGenerationHorizon||stubCount>tuning.maximumStubs){drop.add(id);stubCount-=records.length;}
  }
  if(!compact.size&&!drop.size)return;
  const droppedLives=new Map<string,number>();
  for(const l of archive.stubs)if(drop.has(l.organismId))droppedLives.set(l.id,l.generation);
  const droppedOrganisms=new Map([...drop].map(id=>[id,stubsByOrganism.get(id)![0].generation]));
  const parents=(ids:string[]|null)=>ids?.map(id=>droppedLives.has(id)?marker(id,droppedLives.get(id)!):id)??null;
  state.lineage=state.lineage.filter(l=>!compact.has(l.organismId)).map(l=>{
    const ids=parents(l.parentIds);return ids?.some((id,i)=>id!==l.parentIds![i])?{...l,parentIds:ids}:l;
  });
  archive.stubs=archive.stubs.filter(l=>!drop.has(l.organismId)).map(l=>({...l,parentIds:parents(l.parentIds)}));
  archive.removedLives+=droppedLives.size;archive.removedOrganisms+=drop.size;
  state.organisms=state.organisms.filter(o=>!drop.has(o.id)).map(o=>({...o,parents:o.parents.map(id=>droppedOrganisms.has(id)?marker(id,droppedOrganisms.get(id)!):id).sort()}));
  const alivePolicy=(id:string)=>living.has(id);
  state.breedingRules={blockedIndividuals:state.breedingRules.blockedIndividuals.filter(alivePolicy),encouragedIndividuals:state.breedingRules.encouragedIndividuals.filter(alivePolicy),
    blockedPairs:state.breedingRules.blockedPairs.filter(p=>p.every(alivePolicy)),encouragedPairs:state.breedingRules.encouragedPairs.filter(p=>p.every(alivePolicy)),exclusivePairs:state.breedingRules.exclusivePairs.filter(p=>p.every(alivePolicy))};
  state.archive=archive;
}
