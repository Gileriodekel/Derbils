import { config, skillKeys } from '../data/config';
import type { ActionKind, Creature, DeepReadonly, SaveState } from '../sim/types';
import { foodKind } from '../sim/food-sources';
import { stageStartAge } from '../sim/life-stages';

export const behaviorLabels: Record<ActionKind, string> = { enterCompetition:'Entering competition',attendCompetition:'Attending competition',play: 'Playing together', comfort: 'Comforting', contest: 'Sparring', avoid: 'Avoiding', court: 'Courting', eat: 'Eating', gather: 'Gathering berries', graze: 'Grazing', sleep: 'Resting', wander: 'Wandering', idle: 'Idling',
  ...Object.fromEntries(skillKeys.map(s => [config.skillCatalog[s].trainingActivity, config.skillCatalog[s].activityName])) } as Record<ActionKind, string>;

export function moodLabel(mood: number): string {
  return mood >= config.mood.labelThreshold ? 'Content' : mood <= -config.mood.labelThreshold ? 'Unhappy' : 'Neutral';
}

export function mealReaction(creature: DeepReadonly<Creature>, tick: number): string {
  const meal = creature.lastMeal;
  if (!meal || tick - meal.tick >= config.food.reactionTicks) return '';
  const feeling = meal.preference >= config.food.favoriteThreshold ? 'Loved'
    : meal.preference <= config.food.dislikeThreshold ? 'Disliked' : meal.preference > 0 ? 'Enjoyed' : 'Tried';
  return `${feeling} ${config.fruit[meal.fruit].name}`;
}

export function thought(creature: DeepReadonly<Creature>, state: DeepReadonly<SaveState>): string {
  if (creature.stage === 'egg' || creature.stage === 'cocoon') {
    const remaining = config.lifecycle.stages[creature.stage].durationTicks - (creature.age - stageStartAge(creature.stage, creature.lifeIndex));
    return `${creature.stage === 'egg' ? 'Hatching' : 'Reawakening'} in ${remaining} ticks`;
  }
  const event=state.competitions.find(e=>e.entrantIds.includes(creature.id));
  if(event){const a=event.attendance.find(a=>a.id===creature.id);return `${event.status==='running'?'Competing':a?.path.length?'Going to competition':'Waiting at venue'} · ${event.format} · ${event.skills.map(skill=>config.skillCatalog[skill].name).join('/')}`;}
  const session = state.sessions.find(s=>s.participants.includes(creature.id));
  if (session) {
    const mate = state.creatures.find(c=>session.participants.includes(c.id)&&c.id!==creature.id);
    return `${session.workStartedTick === null ? 'Going to court' : 'Courting'} ${mate?.displayName ?? 'a mate'} ♡`;
  }
  const social=state.social.sessions.find(s=>s.participants.includes(creature.id));
  if(social){
    const partner=state.creatures.find(c=>c.id!==creature.id&&social.participants.includes(c.id));
    const activity=social.kind==='comfort'?social.participants[0]===creature.id?'Comforting':'Receiving comfort from':`${behaviorLabels[social.kind]} with`;
    return `${social.workStartedTick===null?'Seeking company · ':''}${activity} ${partner?.displayName??'a friend'} #${Number(partner?.id.slice(2))}${social.skill?` · ${config.skillCatalog[social.skill].name}`:''}`;
  }
  const action = creature.currentAction;
  if (!action) return 'Taking in the clearing';
  const traveling = action.path.length > 0;
  let label = `${traveling ? 'Going to train: ' : ''}${behaviorLabels[action.kind]}`;
  switch (action.kind) {
    case 'gather':
    case 'eat': {
      const fruit = foodKind(state, action);
      label = `${traveling ? creature.dynasty.movementMode==='fly'?'Flying for':creature.dynasty.movementMode==='swim'?'Swimming for':'Going for' : action.kind==='gather'?'Gathering':'Eating'} ${fruit ? config.fruit[fruit].name : 'fruit'}`;
      break;
    }
    case 'graze': label = traveling ? 'Finding a patch of grass' : 'Grazing on grass'; break;
    case 'sleep': label = traveling ? 'Finding a quiet spot' : 'Resting'; break;
    case 'wander': label = traveling ? 'Wandering' : 'Looking around'; break;
    case 'idle': label = 'Taking a moment'; break;
    case 'avoid': {const other=state.creatures.find(c=>c.id===action.targetCreatureId);label=`Avoiding ${other?.displayName??'company'}${other?` #${Number(other.id.slice(2))}`:''}`;break;}
  }
  const reaction = mealReaction(creature, state.clock.tick);
  if (reaction) label += ` / ${reaction.toLowerCase()}`;
  const up = creature.lastLevelUp;
  if (up && state.clock.tick - up.tick < config.skills.levelUpMessageTicks) label += ` / ${config.skillCatalog[up.skill].name} Lv ${up.level}!`;
  if ((creature.needs?.hunger ?? 0) >= config.needs.urgentThreshold) return `Very hungry · ${label.toLowerCase()}`;
  if ((creature.needs?.fatigue ?? 0) >= config.needs.urgentThreshold) return `Very tired · ${label.toLowerCase()}`;
  return label;
}
