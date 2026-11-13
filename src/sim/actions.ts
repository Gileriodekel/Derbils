import { config } from '../data/config';
import { movePath } from './dynasty/movement';
import { applyEffects, clamp, wellbeing } from './needs';
import { consumeFood, harvestFood } from './food-sources';
import { completeMeal } from './preferences';
import { skillLevel, trainingSkill, trainTick } from './skills';
import { trainingQuality } from './training';
import { rewardNewActivity } from './personality';
import type { Creature, SaveState, Terrain } from './types';

export function advanceAction(creature: Creature, terrain: readonly Terrain[], width: number, startTick = 0): void {
  if (!creature.needs) return;
  const action = creature.currentAction;
  if (!action) return;
  if (action.path.length) {
    movePath(creature, action.path, terrain, width, startTick);
    return; // Arrival never also receives a full work tick.
  }
  const skill = trainingSkill(action.kind);
  if (skill) {
    action.workStart ??= { wellbeing: wellbeing(creature.needs), level: skillLevel(creature, skill) };
    trainTick(creature, skill, trainingQuality(action, terrain, width), startTick);
  }
  action.workTicks += 1;
  if (action.kind !== 'eat') {
    const definition = config.actions[action.kind];
    applyEffects(creature, definition.effects, config.clock.tickSeconds / definition.workTicks);
  }
}

export function resolveCompletion(state: SaveState, creature: Creature): boolean {
  if (!creature.needs) return false;
  const action = creature.currentAction;
  if (!action || action.path.length) return false;
  const finished = action.workTicks >= config.actions[action.kind].workTicks
    || (action.kind === 'sleep' && action.workTicks >= config.ai.minimumWorkCommitTicks && creature.needs.fatigue < config.needs.sleepExitFatigue);
  if (!finished) return false;
  if (action.kind === 'gather') {
    if (creature.dynasty.food.length < config.dynasty.plants.carryCapacity) { const berry=harvestFood(state,creature); if(berry)creature.dynasty.food.push(berry); }
  }
  if (action.kind === 'eat') {
    const kind = consumeFood(state, creature);
    if (!kind) { creature.currentAction = null; return true; }
    completeMeal(creature, kind, state.clock.tick);
  }
  const skill = trainingSkill(action.kind);
  if (skill && action.workStart) {
    const reward = clamp(config.skills.rewardWellbeingWeight * (wellbeing(creature.needs) - action.workStart.wellbeing)
      + config.skills.levelReward * Number(skillLevel(creature, skill) > action.workStart.level), -1, 1);
    const memory = creature.activityPreferences[skill];
    if (memory.samples === 0) rewardNewActivity(creature, state.clock.tick);
    creature.activityPreferences[skill] = { learnedMean: clamp((1 - config.skills.learningRate) * memory.learnedMean
      + config.skills.learningRate * reward, -1, 1), samples: memory.samples + 1 };
  }
  creature.lastCompletedAction = action.kind;
  creature.currentAction = null;
  return true;
}
