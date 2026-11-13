import { config, lifeStages, skillKeys } from '../../data/config';
import { stageStartAge } from '../life-stages';
import { skillLevel } from '../skills';
import { permittedKinship } from '../kinship';
import type { Competition, CompetitionEntryRules, Config, Creature, DeepReadonly, SaveState } from '../types';

export function rulesReason(r: DeepReadonly<CompetitionEntryRules>, settings:DeepReadonly<Config>=config):string|null {
  const s=settings.competitions;
  if(!r||!Array.isArray(r.allowedStages)||!r.allowedStages.length||new Set(r.allowedStages).size!==r.allowedStages.length
    ||r.allowedStages.some(stage=>!lifeStages.includes(stage)||!s.entry.allowedStages.includes(stage)))return 'Invalid allowed stages.';
  if(Object.keys(r).length!==Object.keys(s.entry).length||Object.keys(r).some(key=>!Object.hasOwn(s.entry,key)))return 'Invalid entry rules.';
  if(!Number.isInteger(r.maximumEntrants)||r.maximumEntrants<s.minimumEntrants||r.maximumEntrants>s.maximumEntrants)return 'Invalid entrant limit.';
  if(!Number.isFinite(r.needMaximum)||r.needMaximum<0||r.needMaximum>s.entry.needMaximum)return 'Invalid needs threshold.';
  if(!Number.isFinite(r.stressMaximum)||r.stressMaximum<0||r.stressMaximum>s.entry.stressMaximum)return 'Invalid stress threshold.';
  if(!Number.isFinite(r.minimumMood)||r.minimumMood<s.entry.minimumMood||r.minimumMood>1)return 'Invalid mood threshold.';
  if(typeof r.relatedEntrantsAllowed!=='boolean'||!r.levels||typeof r.levels!=='object'||Array.isArray(r.levels))return 'Invalid entry rules.';
  for(const [skill,range] of Object.entries(r.levels))if(!skillKeys.includes(skill as typeof skillKeys[number])||!range||!Number.isInteger(range.minimum)
    ||!Number.isInteger(range.maximum)||range.minimum<0||range.maximum>settings.skillCatalog[skill as typeof skillKeys[number]].levelCap||range.minimum>range.maximum||Object.keys(range).some(key=>key!=='minimum'&&key!=='maximum'))return 'Invalid skill band.';
  return null;
}
/** Intrinsic rules only; occupancy, duplicate entry, kinship and current tick are explicit context below. */
export function isEligible(c:DeepReadonly<Creature>, event:DeepReadonly<Pick<Competition,'skills'|'entryRules'>>, settings:DeepReadonly<Config>=config):{eligible:boolean;reason:string|null}{
  const r=event.entryRules,s=settings.competitions;
  let reason:string|null=null;
  if(!c.needs||!s.entry.allowedStages.includes(c.stage)||!r.allowedStages.includes(c.stage))reason='stage';
  else if(c.stage==='elder'&&settings.lifecycle.stages.elder.durationTicks-(c.age-stageStartAge('elder',c.lifeIndex))<s.elderRemainingMinimumTicks)reason='elder time';
  else if(c.needs.hunger>r.needMaximum)reason='hunger';
  else if(c.needs.fatigue>r.needMaximum)reason='fatigue';
  else if(c.needs.stress>r.stressMaximum)reason='stress';
  else if(c.mood<r.minimumMood)reason='mood';
  else for(const skill of event.skills){const level=skillLevel(c,skill),range=r.levels[skill];
    if(level<Math.max(s.requiredLevels[skill]??0,range?.minimum??0)){reason=`${skill} below minimum`;break;}
    if(level>(range?.maximum??settings.skillCatalog[skill].levelCap)){reason=`${skill} above maximum`;break;}
  }
  return {eligible:reason===null,reason};
}
export function entryReason(state:DeepReadonly<SaveState>,c:DeepReadonly<Creature>,event:DeepReadonly<Competition>):string|null{
  const reason=isEligible(c,event).reason;if(reason)return reason;
  if(event.status!=='entryOpen'||state.clock.tick>=event.startTick)return 'entry closed';
  if(event.entrantIds.includes(c.id)||event.drops.some(d=>d.id===c.id))return 'already entered';
  if(event.entrantIds.length>=event.entryRules.maximumEntrants)return 'full';
  if(state.sessions.some(s=>s.participants.includes(c.id))||state.social.sessions.some(s=>s.participants.includes(c.id))
    ||state.competitions.some(e=>e.entrantIds.includes(c.id)))return 'busy';
  if(!event.entryRules.relatedEntrantsAllowed&&event.entrantIds.some(id=>{const other=state.creatures.find(c=>c.id===id);return other&&!permittedKinship(state,c.organismId,other.organismId);}))return 'related entrant';
  return null;
}
