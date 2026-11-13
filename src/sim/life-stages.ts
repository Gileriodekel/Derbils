import { config } from '../data/config';
import type { Creature, DeepReadonly, LifeStage, Needs } from './types';

export function lifePath(lifeIndex = 0): readonly LifeStage[] {
  return lifeIndex === 0 ? config.lifecycle.firstLife : config.lifecycle.rebornLife;
}

export function stageStartAge(stage: LifeStage, lifeIndex = 0): number {
  let age = 0;
  for (const candidate of lifePath(lifeIndex)) {
    if (candidate === stage) return age;
    age += config.lifecycle.stages[candidate].durationTicks;
  }
  throw new Error(`${stage} is not a stage in this life.`);
}

export function lifespan(lifeIndex = 0): number {
  return lifePath(lifeIndex).reduce((sum, stage) => sum + config.lifecycle.stages[stage].durationTicks, 0);
}

/** Pure age mapping: exact boundary ages enter the next stage; null is the end of elderhood. */
export function stageAtAge(age: number, lifeIndex = 0): LifeStage | null {
  if (!Number.isSafeInteger(age) || age < 0) throw new Error('Age must be nonnegative whole ticks.');
  let end = 0;
  for (const stage of lifePath(lifeIndex)) {
    end += config.lifecycle.stages[stage].durationTicks;
    if (age < end) return stage;
  }
  return null;
}

export function stageProgress(c: DeepReadonly<Pick<Creature, 'age' | 'stage' | 'lifeIndex'>>): number {
  return (c.age - stageStartAge(c.stage, c.lifeIndex)) / config.lifecycle.stages[c.stage].durationTicks;
}

export function isMobile(c: DeepReadonly<Creature>): c is DeepReadonly<Creature> & { needs: DeepReadonly<Needs> } {
  return config.lifecycle.stages[c.stage].mobile && c.needs !== null;
}
