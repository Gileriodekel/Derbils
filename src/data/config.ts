import { assertValidData } from './validation';
import { hashState } from '../sim/hash';
import dynasty from './dynasty.json';
import health from './health.json';
import presentation from './presentation.json';
import names from './names.json';
import robustness from './robustness.json';
import emptyInventory from './empty-inventory.json';
import balance from './balance.json';
import offline from './offline.json';
import actions from './actions.json';
import fruit from './fruits.json';
import sources from './sources.json';
import skills from './skills.json';
import training from './training-spots.json';
import genes from './genes.json';
import lifecycle from './lifecycle.json';
import breeding from './breeding.json';
import appearance from './appearance.json';
import social from './social.json';
import competitions from './competitions.json';
import prizes from './prizes.json';
import items from './items.json';
import type { AppearanceConfig, CompetitionConfig, Config, LocusDefinition, SocialConfig, Speed } from '../sim/types';

export const needKeys = ['hunger', 'fatigue', 'boredom', 'loneliness', 'stress'] as const;
export const actionKinds = ['enterCompetition', 'attendCompetition', 'court', 'play', 'comfort', 'contest', 'avoid', 'eat', 'gather', 'graze', 'sleep', 'wander', 'idle', 'train_run', 'train_swim', 'train_fly', 'train_strength', 'train_stamina'] as const;
export const skillKeys = ['run', 'swim', 'fly', 'strength', 'stamina'] as const;
export const fruitKinds = ['sunapple', 'dewberry', 'cloudplum', 'vinefig', 'stonepear', 'ambermelon', 'moonpeach', 'sparkcherry', 'prismpear', 'spiralfruit'] as const;
export const tasteKeys = ['sweet', 'tart', 'earthy'] as const;
export const lifeStages = ['egg', 'baby', 'juvenile', 'adult', 'elder', 'cocoon'] as const;

function enumValue<T extends string | number>(value: string | number, allowed: readonly T[]): T {
  const match = allowed.find(entry => entry === value);
  if (match === undefined) throw new Error(`Unknown config enum: ${value}`);
  return match;
}

function freeze<T>(value: T): T {
  if (value !== null && typeof value === 'object') {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
}

export const dataFiles = {'dynasty.json': dynasty, 'balance.json': balance, 'offline.json': offline, 'actions.json': actions, 'fruits.json': fruit, 'sources.json': sources, 'skills.json': skills, 'training-spots.json': training, 'genes.json': genes, 'lifecycle.json': lifecycle, 'breeding.json': breeding, 'appearance.json': appearance, 'social.json': social, 'competitions.json': competitions, 'prizes.json': prizes, 'items.json': items, 'empty-inventory.json': emptyInventory, 'health.json': health, 'presentation.json': presentation, 'names.json': names, 'robustness.json': robustness};
assertValidData(dataFiles);
export const configHash = hashState(dataFiles);

const speedEnum: readonly Speed[] = [0, 1, 10, 100, 1000];
export const config: Config = freeze({
  ...balance, dynasty: dynasty as Config['dynasty'], health: health as unknown as Config['health'], presentation: presentation as Config['presentation'], names, robustness, offline: offline as Config['offline'], actions, fruit, breeding, prizes: prizes as Config['prizes'], items: items as Config['items'], competitions: competitions as CompetitionConfig, social: {...social,friendBond:dynasty.relationships.friendThreshold,dislikedBond:dynasty.relationships.foeThreshold} as SocialConfig, appearance: appearance as AppearanceConfig, genes: genes as LocusDefinition[],
  lifecycle: { ...lifecycle, firstLife: lifecycle.firstLife.map(s => enumValue(s, lifeStages)),
    rebornLife: lifecycle.rebornLife.map(s => enumValue(s, lifeStages)) },
  genetics: { ...balance.genetics, mutationStep: [balance.genetics.mutationStep[0], balance.genetics.mutationStep[1]] },
  skillCatalog: Object.fromEntries(skillKeys.map(key => [key, { ...skills[key], id: key,
    trainingActivity: enumValue(skills[key].trainingActivity, actionKinds) }])) as Config['skillCatalog'],
  training: { ...training, defaults: training.defaults.map(entry => ({ ...entry, skill: enumValue(entry.skill, skillKeys) })) },
  food: { ...balance.food, valenceBounds: [balance.food.valenceBounds[0], balance.food.valenceBounds[1]] },
  sources: { defaults: sources.defaults.map(entry => ({ ...entry, kind: enumValue(entry.kind, fruitKinds) })) },
  clock: { ...balance.clock, foregroundSpeeds: balance.clock.foregroundSpeeds.map(value => enumValue(value, speedEnum)) },
  initial: { ...balance.initial, fruit: balance.initial.fruit as Config['initial']['fruit'] },
});
