import { derivePhenotype } from '../genetics/expression';
import { clampRange, hslToRgb, interpolate, rgbToHsl } from './color';
import type { AppearanceColor, ColorRole, Config, Creature, DeepReadonly } from '../types';

/** Gene channels resolve independently of skill parts. Diet affects base/accent paint only. */
export function resolvePalette(c: DeepReadonly<Creature>, config: DeepReadonly<Config>, genes = derivePhenotype(c.genome).palette): Record<ColorRole, AppearanceColor> {
  const data = config.appearance.palette;
  const fraction = (trait: 'saturation' | 'lightness') => {
    const range = config.genes.find(g => g.traitGroup === 'palette' && g.trait === trait)!.traitRange!;
    return (genes[trait] - range[0]) / (range[1] - range[0]);
  };
  return Object.fromEntries(Object.entries(data.roles).map(([role, style]) => {
    let color: AppearanceColor = { hue: genes[style.hueGene], saturation: interpolate(style.saturation, fraction('saturation')),
      lightness: interpolate(style.lightness, fraction('lightness')), alpha: style.alpha };
    if (role === 'primary' || role === 'secondary' || role === 'accent') for (const modifier of c.appearanceModifiers) {
      const rgb = hslToRgb(color), strength = modifier.magnitude;
      color = rgbToHsl(rgb.map((v, i) => (1 - strength) * v + strength * modifier.rgb[i]), color.alpha);
    }
    color.saturation = clampRange(color.saturation, data.saturationBounds) * config.lifecycle.stages[c.stage].saturationMultiplier;
    color.lightness = clampRange(color.lightness, data.lightnessBounds);
    return [role, color];
  })) as Record<ColorRole, AppearanceColor>;
}
