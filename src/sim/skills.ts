import { config, skillKeys } from '../data/config';
import { clamp } from './needs';
import { skillAptitude } from './genetics/expression';
import { setTraitValue } from './genetics/edits';
import type { ActionKind, Creature, DeepReadonly, FruitDefinition, SaveState, Skill, SkillExperience } from './types';

export function trainingSkill(kind: ActionKind): Skill | null {
  return skillKeys.find(skill => config.skillCatalog[skill].trainingActivity === kind) ?? null;
}

export function skillCap(creature: DeepReadonly<Pick<Creature, 'genome' | 'stage'>>, skill: Skill): number {
  return Math.min(config.skillCatalog[skill].levelCap, config.lifecycle.stages[creature.stage].skillCap,
    Math.floor(config.skills.capBase + config.skills.capRange * skillAptitude(creature, skill)));
}

export function xpAtLevel(level: number, skill: Skill): number {
  const { xpLinear, xpQuadratic } = config.skillCatalog[skill];
  return xpLinear * level + xpQuadratic * level * level;
}

export function skillLevel(creature: DeepReadonly<Pick<Creature, 'xp' | 'genome' | 'stage'>>, skill: Skill): number {
  const { xpLinear: a, xpQuadratic: b } = config.skillCatalog[skill];
  return Math.min(skillCap(creature, skill), Math.floor((-a + Math.sqrt(a * a + 4 * b * creature.xp[skill])) / (2 * b)));
}

export function emptySkillExperience(): SkillExperience {
  return { practiceTicks: zeroSkills(), trainingTicks: zeroSkills(),
    activityPreferences: Object.fromEntries(skillKeys.map(s => [s, { learnedMean: 0, samples: 0 }])) as SkillExperience['activityPreferences'],
    skillBonuses: {}, lastLevelUp: null };
}

export function zeroSkills(): Record<Skill, number> {
  return Object.fromEntries(skillKeys.map(skill => [skill, 0])) as Record<Skill, number>;
}

/** Literal §6 rate for the interval starting at tick, including the current life-stage modifier. */
function baseXpGain(creature: DeepReadonly<Creature>, skill: Skill, quality: number, tick: number): number {
  const s = config.skills, cap = skillCap(creature, skill), level = skillLevel(creature, skill);
  if (!creature.needs || !config.lifecycle.stages[creature.stage].mobile) return 0;
  if (creature.needs.hunger >= config.needs.urgentThreshold || creature.needs.fatigue >= config.needs.urgentThreshold
    || creature.needs.stress >= s.stressExclusionThreshold || level >= cap) return 0;
  const bonus = creature.skillBonuses[skill];
  return s.baseXpPerSecond * quality * config.lifecycle.stages[creature.stage].xpMultiplier
    * (s.aptitudeBase + s.aptitudeWeight * skillAptitude(creature, skill))
    * (1 - s.capTaper * (level / cap) ** 2)
    * (s.moodBase + s.moodWeight * ((creature.mood + 1) / 2))
    * (1 + (bonus && bonus.expiresTick > tick ? bonus.amount : 0))
    * (creature.practiceTicks[skill] < s.dailyFullRateTicks ? 1 : s.dailyReducedMultiplier);
}

export function xpGain(creature: DeepReadonly<Creature>, skill: Skill, quality: number, tick: number): number {
  const base = baseXpGain(creature,skill,quality,tick), boost = creature.social.rivalBoosts[skill];
  const extra = boost && boost.expiresTick > tick ? Math.min(base*boost.amount,
    Math.max(0,config.social.rivalry.dailyExtraXpCap-creature.social.rivalExtraXpToday[skill])/config.clock.tickSeconds) : 0;
  return base+extra;
}

/** Private work clone only. Counts actual work, including work suppressed by need gates/caps. */
export function trainTick(creature: Creature, skill: Skill, quality: number, start: number, maximumGain = Infinity): void {
  if (!creature.needs || !config.lifecycle.stages[creature.stage].mobile) return;
  const before = skillLevel(creature, skill);
  const oldXp = creature.xp[skill], ordinary = baseXpGain(creature,skill,quality,start)*config.clock.tickSeconds;
  creature.xp[skill] = Math.min(xpAtLevel(skillCap(creature, skill), skill),
    creature.xp[skill] + Math.min(maximumGain,xpGain(creature, skill, quality, start) * config.clock.tickSeconds));
  const boost = creature.social.rivalBoosts[skill];
  if (boost && boost.expiresTick > start) creature.social.rivalExtraXpToday[skill] = Math.min(config.social.rivalry.dailyExtraXpCap,
    creature.social.rivalExtraXpToday[skill]+Math.max(0,creature.xp[skill]-oldXp-ordinary));
  creature.practiceTicks[skill] += config.clock.tickSeconds;
  creature.trainingTicks[skill] += config.clock.tickSeconds;
  const level = skillLevel(creature, skill);
  if (level > before) creature.lastLevelUp = { skill, level, tick: start + 1 };
}

export function applySkillBonuses(creature: Creature, fruit: Pick<FruitDefinition, 'skillBonuses' | 'skillBonusDurationTicks'>, tick: number): void {
  for (const skill of skillKeys) {
    const amount = fruit.skillBonuses[skill];
    if (amount === undefined) continue;
    const active = creature.skillBonuses[skill];
    if (!active || active.expiresTick <= tick || amount >= active.amount)
      creature.skillBonuses[skill] = { amount, expiresTick: tick + fruit.skillBonusDurationTicks };
  }
}

/** Atomic debug command. Lowering a cap clamps XP; setting a level starts exactly at its threshold. */
export function setDebugSkill(state: SaveState, id: string, skill: Skill, level: number, aptitude: number): SaveState {
  const original = state.creatures.find(c => c.id === id);
  if (!original || !skillKeys.includes(skill) || !Number.isInteger(level) || level < 0
    || !Number.isFinite(aptitude) || aptitude < 0 || aptitude > 1) throw new Error('Use an integer level and aptitude from 0 to 1.');
  if (!original.needs) throw new Error('Eggs and cocoons cannot train or edit learned levels.');
  const c = { ...original, genome: setTraitValue(original.genome, 'aptitudes', skill, aptitude), xp: { ...original.xp } };
  if (level > skillCap(c, skill)) throw new Error(`This aptitude permits level ${skillCap(c, skill)} at most.`);
  c.xp[skill] = clamp(xpAtLevel(level, skill), 0, xpAtLevel(skillCap(c, skill), skill));
  const capacity=config.dynasty.movement.baseEnergy+skillLevel(c,'stamina')*config.dynasty.movement.energyPerStamina;
  Object.assign(c,{dynasty:{...original.dynasty,energy:Math.min(original.dynasty.energy,capacity)}});
  if (c.currentAction && trainingSkill(c.currentAction.kind) === skill) c.currentAction = null;
  c.nextDecisionTick = state.clock.tick + 1;
  if (c.lastLevelUp?.skill === skill) c.lastLevelUp = null;
  return { ...state, creatures: state.creatures.map(creature => creature.id === id ? c : creature) };
}
