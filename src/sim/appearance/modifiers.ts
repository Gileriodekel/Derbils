import { config } from '../../data/config';
import { parseRgb } from './color';
import type { Creature, FruitDefinition, FruitKind } from '../types';

const decayPerTick = Math.pow(.5, config.clock.tickSeconds / (config.clock.dayTicks * config.appearance.modifiers.halfLifeDays));

/** Called on tick's private clone before meal completion. No RNG or genetic effects. */
export function advanceAppearanceModifiers(c: Creature, endTick: number): void {
  if (!c.appearanceModifiers.length) return;
  const minimum = config.appearance.modifiers.minimumStrength;
  c.appearanceModifiers = c.appearanceModifiers.flatMap(m => {
    const magnitude = m.magnitude * decayPerTick;
    return m.expiresTick <= endTick || magnitude < minimum ? [] : [{ ...m, magnitude }];
  });
}

/** The spec defines one blended, decaying diet tint, represented as a capped one-entry modifier. */
export function applyFruitAppearance(c: Creature, fruit: FruitDefinition, sourceFruit: FruitKind, tick: number): void {
  const settings = config.appearance.modifiers;
  if (!fruit.appearance.tintRgb || settings.maximum < 1 || settings.maximumPerType < 1) return;
  const incoming = parseRgb(fruit.appearance.tintRgb), previous = c.appearanceModifiers.find(m => m.type === 'dietTint');
  const rgb = previous ? previous.rgb.map((v, i) => (1 - settings.blendWeight) * v + settings.blendWeight * incoming[i]) as typeof incoming : incoming;
  c.appearanceModifiers = [{ type: 'dietTint', rgb, sourceFruit,
    magnitude: Math.min(settings.maximumStrength, (previous?.magnitude ?? 0) + settings.strengthPerFruit),
    expiresTick: tick + settings.expiryDays * config.clock.dayTicks }];
}
