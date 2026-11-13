import { autoPrize, escrowPrizes, inventoryReason } from './prizes';
import { config, skillKeys } from '../../data/config';
import { rulesReason } from './eligibility';
import { competitionEvent } from './journal';
import { uniform } from '../rng';
import type { Competition, PlayerCommand, SaveState, Skill } from '../types';
export type CreateCompetitionCommand=Extract<PlayerCommand,{kind:'createCompetition'}>;
export function creationReason(state:SaveState,command:CreateCompetitionCommand):string|null{
  if(Object.keys(command).some(key=>!['kind','skill','format','entryRules','startDelay','skills','prize'].includes(key)))return 'Invalid competition command.';
  const s=config.competitions,f=s.formats.find(f=>f.id===command.format);
  if(!skillKeys.includes(command.skill))return 'Unknown skill.';
  if(!f)return 'Unknown format.';
  if(!f.skills.includes(command.skill))return 'This format does not support that skill.';
  const skills=command.skills??(command.format==='circuit'?[command.skill,...s.autoSkills.filter(k=>k!==command.skill).slice(0,f.rounds-1)]:[command.skill]);
  if(skills.length!==(command.format==='circuit'?f.rounds:1)||skills[0]!==command.skill||new Set(skills).size!==skills.length||skills.some(k=>!f.skills.includes(k)))return 'Select distinct supported circuit skills.';
  const rules=rulesReason(command.entryRules);if(rules)return rules;
  if(!Number.isInteger(command.startDelay)||command.startDelay<s.minimumStartDelay||command.startDelay>s.maximumStartDelay)return 'Invalid start delay.';
  if(state.competitions.length>=s.maximumConcurrent)return 'Concurrent competition limit reached.';
  if(skills.some(k=>(state.competitionState.skillCooldowns[k]??0)>state.clock.tick))return 'Skill competition cooldown is active.';
  return inventoryReason(state,command.prize);
}
/** Tick/command-private state only. Creating an event never selects its entrants. */
export function createCompetition(state:SaveState,command:CreateCompetitionCommand,createdBy:Competition['createdBy']='debug'):Competition{
  const reason=creationReason(state,command);if(reason)throw new Error(reason);
  const s=config.competitions,skills=command.skills??(command.format==='circuit'?[command.skill,...s.autoSkills.filter(k=>k!==command.skill).slice(0,s.formats.find(f=>f.id===command.format)!.rounds-1)]:[command.skill]);
  const event:Competition={id:`cpt_${String(state.counters.competition++).padStart(8,'0')}`,skill:command.skill,skills:[...skills],format:command.format,
    entryRules:JSON.parse(JSON.stringify(command.entryRules)),status:'scheduled',createdTick:state.clock.tick,
    entryOpenTick:state.clock.tick+Math.max(1,command.startDelay-s.entryWindowTicks),startTick:state.clock.tick+command.startDelay,
    endTick:state.clock.tick+command.startDelay+s.durationTicks,finishedTick:null,
    entrantIds:[],startedIds:[],attendance:[],snapshots:[],results:null,drops:[],cancellationReason:null,createdBy,prize:command.prize?JSON.parse(JSON.stringify(command.prize)):null,escrowState:'none',awarded:false,deliveries:[]};
  // Even the shortest delay leaves one boundary for entry-open before start.
  event.startTick=Math.max(event.entryOpenTick+1,event.startTick);event.endTick=event.startTick+s.durationTicks;
  escrowPrizes(state,event);state.competitions.push(event);competitionEvent(state,event,'competitionCreated',null,undefined,createdBy==='auto'?undefined:command);return event;
}
/** Test/report aid only; the shipped setting is OFF. It uses the saved competition stream. */
export function autoSchedule(state:SaveState):void{
  if(!state.settings.autoCompetitions||state.clock.tick<state.competitionState.nextAutoTick)return;
  const s=config.competitions;state.competitionState.nextAutoTick=state.clock.tick+s.autoCadenceTicks;
  if(state.competitions.length>=s.maximumConcurrent)return;
  const a=uniform(state.rng.competition),b=uniform(a.state);state.rng.competition=b.state;
  const format=s.autoFormats[Math.floor(a.value*s.autoFormats.length)],allowed=s.formats.find(f=>f.id===format)!.skills.filter(k=>s.autoSkills.includes(k));
  const skill:Skill=allowed[Math.floor(b.value*allowed.length)];
  const command:CreateCompetitionCommand={kind:'createCompetition',skill,format,entryRules:s.entry,startDelay:s.defaultStartDelay,prize:autoPrize(state)};
  if(!creationReason(state,command))createCompetition(state,command,'auto');
}
