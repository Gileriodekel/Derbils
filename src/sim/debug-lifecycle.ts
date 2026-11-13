import { energyCapacity } from './dynasty/movement';
import { emptyAwards } from './competition/inventory';
import { withdrawFromCompetitions } from './competition/scheduler';
import { emptyCompetitionMemory } from './competition/state';
import { config } from '../data/config';
import { defaultFoodExperience } from './preferences';
import { emptySkillExperience, skillCap, xpAtLevel, zeroSkills } from './skills';
import { zeroPersonalityDrift } from './personality';
import { lifePath, stageStartAge } from './life-stages';
import { recordLifeEvent } from './life-records';
import { advanceTicks } from './tick';
import { emptySocialMemory } from './social/state';
import { abortSocialSession } from './social/sessions';
import type { Creature, LifeStage, SaveState } from './types';

/** Aging uses complete ordinary ticks for the habitat, keeping shared resources/time consistent. */
export function ageCreatureBy(state: SaveState, id: string, count: number): SaveState {
  if (!state.creatures.some(c => c.id === id)) throw new Error('Select a living creature.');
  return advanceTicks(state, count);
}

/** Explicit debug override, separate from normal age progression. Younger stage caps clamp XP. */
export function forceStage(state: SaveState, id: string, stage: LifeStage): SaveState {
  if(state.competitions.some(e=>e.entrantIds.includes(id))){state=JSON.parse(JSON.stringify(state)) as SaveState;withdrawFromCompetitions(state,id,'debug stage');}
  const old = state.creatures.find(c => c.id === id);
  if (!old || !lifePath(old.lifeIndex).includes(stage)) throw new Error('That stage is not available in this life.');
  const mobile = config.lifecycle.stages[stage].mobile;
  const c: Creature = { ...old, stage, age: stageStartAge(stage, old.lifeIndex), stageStartedTick: state.clock.tick,
    needs: mobile ? { ...(old.needs ?? config.needs.newborn) } : null,
    welfare: { ...old.welfare }, xp: { ...old.xp }, currentAction: null, lastLevelUp: null, nextDecisionTick: state.clock.tick + 1 };
  for (const skill of Object.keys(c.xp) as (keyof Creature['xp'])[]) c.xp[skill] = Math.min(c.xp[skill], xpAtLevel(skillCap(c, skill), skill));
  if (!mobile) Object.assign(c, defaultFoodExperience(), emptySkillExperience(), {
    appearanceModifiers: [],
    awards: {...emptyAwards(),owned:[...old.awards.owned],equipped:old.awards.equipped}, social: emptySocialMemory(), competition: emptyCompetitionMemory(),
    xp: zeroSkills(), personalityDrift: zeroPersonalityDrift(), lastPersonalityRewardTick: null,
    welfare: { total: 0, ticks: 0 }, mood: config.mood.initial, recentValence: 0, lastCompletedAction: null });
  c.dynasty={...old.dynasty,energy:Math.min(old.dynasty.energy,energyCapacity(c)),moving:false};
  const next = { ...state, sessions: state.sessions.filter(s=>!s.participants.includes(id)), counters: { ...state.counters }, creatures: state.creatures.map(other => other.id === id ? c : other) };
  recordLifeEvent(next, { creatureId: id, kind: 'debugStage', from: old.stage, to: stage, relatedCreatureId: null });
  next.social = { ...state.social, sessions: [...state.social.sessions] };
  for (const session of [...next.social.sessions]) if (session.participants.includes(id)) {
    next.creatures = next.creatures.map(other => other.id !== id && session.participants.includes(other.id) ? { ...other } : other);
    abortSocialSession(next,session);
  }
  return next;
}
