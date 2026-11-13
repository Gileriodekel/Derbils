import { skillCap, skillLevel, xpAtLevel } from './skills';
import { applyFruitAppearance } from './appearance/modifiers';
import { config, skillKeys, fruitKinds, tasteKeys } from '../data/config';
import { applySkillBonuses } from './skills';
import { applyEffects, clamp } from './needs';
import { expressTrait } from './genetics/expression';
import type { Creature, DeepReadonly, FoodExperience, FruitKind, Taste } from './types';

export function defaultFoodExperience(): FoodExperience {
  return {
    foodPreferences: Object.fromEntries(fruitKinds.map(kind => [kind, { learnedMean: 0, samples: 0 }])) as FoodExperience['foodPreferences'],
    lastFiveFoods: [], lastMeal: null,
  };
}

type FoodView = DeepReadonly<Pick<Creature, keyof FoodExperience | 'genome'>>;
const tastes = new WeakMap<FoodView['genome'], { bias: number[]; weights: Taste; enjoyment: Record<FruitKind, number> }>();

function inheritedTaste(creature: FoodView) {
  const bias = tasteKeys.map(key => expressTrait(creature.genome, 'tasteBias', key) as number);
  const old = tastes.get(creature.genome);
  if (old && bias.every((value, i) => value === old.bias[i])) return old;
  const sum = bias.reduce((total, value) => total + value, 0);
  const weights = Object.fromEntries(tasteKeys.map((key, i) => [key, sum > 0 ? bias[i] / sum : 1 / tasteKeys.length])) as Taste;
  const enjoyment = Object.fromEntries(fruitKinds.map(kind => [kind,
    2 * tasteKeys.reduce((total, key) => total + weights[key] * config.fruit[kind].taste[key], 0) - 1])) as Record<FruitKind, number>;
  const result = { bias, weights, enjoyment }; tastes.set(creature.genome, result); return result;
}
export function tasteWeights(creature: FoodView): Taste {
  return { ...inheritedTaste(creature).weights };
}

export function tasteEnjoyment(creature: FoodView, kind: FruitKind): number {
  return inheritedTaste(creature).enjoyment[kind];
}

export function foodRepeat(creature: FoodView, kind: FruitKind): number {
  return creature.lastFiveFoods.filter(food => food === kind).length / config.food.historyLength;
}

/** Spec §10.2, including the repeat penalty even when fewer than five meals exist. */
export function foodPreference(creature: FoodView, kind: FruitKind): number {
  const f = config.food;
  return clamp(f.genePreferenceWeight * tasteEnjoyment(creature, kind)
    + f.learnedPreferenceWeight * creature.foodPreferences[kind].learnedMean
    - f.repeatPreferencePenalty * foodRepeat(creature, kind), -1, 1);
}

export function mealOutcome(creature: DeepReadonly<Creature>, kind: FruitKind): { preference: number; reward: number } {
  if (!creature.needs) throw new Error('Eggs and cocoons cannot eat.');
  const f = config.food;
  const reward = clamp(f.rewardTasteWeight * tasteEnjoyment(creature, kind)
    + f.rewardHungerWeight * creature.needs.hunger / 100
    + f.rewardStressWeight * clamp(-config.fruit[kind].effects.stress / f.rewardStressScale, 0, 1)
    - f.rewardLowHungerPenalty * Number(creature.needs.hunger < f.rewardLowHungerThreshold)
    - f.rewardRepeatPenalty * foodRepeat(creature, kind), -1, 1);
  return { preference: foodPreference(creature, kind), reward };
}

/** Called once by meal completion, on tick's private creature clone. */
export function completeMeal(creature: Creature, kind: FruitKind, tick: number): void {
  if (!creature.needs) throw new Error('Eggs and cocoons cannot eat.');
  const outcome = mealOutcome(creature, kind); // All reward inputs are pre-meal state/history.
  const f = config.food;
  const skill=skillKeys.find(s=>config.dynasty.stats[s].fruit===kind);
  if(skill){const before=skillLevel(creature,skill);creature.xp[skill]=Math.min(xpAtLevel(skillCap(creature,skill),skill),creature.xp[skill]+config.dynasty.plants.berryXp);const level=skillLevel(creature,skill);if(level>before)creature.lastLevelUp={skill,level,tick};}
  applyEffects(creature, config.fruit[kind].effects);
  applySkillBonuses(creature, config.fruit[kind], tick);
  applyFruitAppearance(creature, config.fruit[kind], kind, tick);
  creature.recentValence = clamp(creature.recentValence + f.valenceWeight * outcome.preference, ...f.valenceBounds);
  creature.needs.stress = clamp(creature.needs.stress - f.positiveStressRelief * Math.max(0, outcome.preference));
  const previous = creature.foodPreferences[kind];
  creature.foodPreferences[kind] = {
    learnedMean: clamp((1 - f.learningRate) * previous.learnedMean + f.learningRate * outcome.reward, -1, 1),
    samples: previous.samples + 1,
  };
  creature.lastFiveFoods = [...creature.lastFiveFoods, kind].slice(-f.historyLength);
  creature.lastMeal = { fruit: kind, tick, ...outcome };
}

export function preferenceLabel(creature: FoodView, kind: FruitKind): string {
  if (creature.foodPreferences[kind].samples < config.food.labelMinimumMeals) return 'Unfamiliar';
  const score = foodPreference(creature, kind);
  return score >= config.food.favoriteThreshold ? 'Favorite' : score <= config.food.dislikeThreshold ? 'Dislikes' : 'Neutral';
}
