import { config, fruitKinds } from '../../data/config';
import type { Creature } from '../types';
import { exactKeys, finite, integer, requireValue } from './checks';

export function validateAppearanceModifiers(c: Creature, tick: number): void {
  const limits = config.appearance.modifiers;
  requireValue(Array.isArray(c.appearanceModifiers) && c.appearanceModifiers.length <= limits.maximum, 'appearance modifier count');
  requireValue(config.lifecycle.stages[c.stage].mobile || c.appearanceModifiers.length === 0, 'dormant appearance modifiers');
  for (const m of c.appearanceModifiers) {
    requireValue(exactKeys(m, ['type', 'magnitude', 'rgb', 'sourceFruit', 'expiresTick']) && m.type === 'dietTint'
      && finite(m.magnitude, limits.minimumStrength, limits.maximumStrength)
      && Array.isArray(m.rgb) && m.rgb.length === 3 && m.rgb.every(n => finite(n, 0, 1))
      && fruitKinds.includes(m.sourceFruit) && integer(m.expiresTick, tick + 1, tick + limits.expiryDays * config.clock.dayTicks)
      && c.appearanceModifiers.filter(other => other.type === m.type).length <= limits.maximumPerType, 'appearance modifier');
  }
}
