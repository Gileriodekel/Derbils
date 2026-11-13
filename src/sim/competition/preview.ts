import { config } from '../../data/config';
import { creationReason, type CreateCompetitionCommand } from './create';
import { isEligible, rulesReason } from './eligibility';
import { inventoryReason } from './prizes';
import type { SaveState } from '../types';
/** Same intrinsic predicate and first rejection reason as the command; consumes no random draws. */
export function competitionPreview(s:SaveState,command:CreateCompetitionCommand){
  const format=config.competitions.formats.find(f=>f.id===command.format);
  const skills=command.skills??(command.format==='circuit'?[command.skill,...config.competitions.autoSkills.filter(k=>k!==command.skill).slice(0,(format?.rounds??1)-1)]:[command.skill]);
  const first=creationReason(s,command),messages:string[]=[];
  if(first)messages.push(first);
  for(const error of [rulesReason(command.entryRules),inventoryReason(s,command.prize),!Number.isInteger(command.startDelay)||command.startDelay<config.competitions.minimumStartDelay||command.startDelay>config.competitions.maximumStartDelay?'Invalid start delay.':null])if(error&&!messages.includes(error))messages.push(error);
  const rows=s.creatures.map(c=>({id:c.id,...isEligible(c,{skills,entryRules:command.entryRules}),busy:s.sessions.some(e=>e.participants.includes(c.id))||s.social.sessions.some(e=>e.participants.includes(c.id))||s.competitions.some(e=>e.entrantIds.includes(c.id))}));
  const eligible=rows.filter(r=>r.eligible).length;
  return {eligible,minimum:config.competitions.minimumEntrants,belowMinimum:eligible<config.competitions.minimumEntrants,rows,messages};
}
