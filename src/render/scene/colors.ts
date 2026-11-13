import type { AppearanceColor, DeepReadonly } from '../../sim/types';
export function colorCss(color: DeepReadonly<AppearanceColor>, saturationMultiplier = 1): string {
  return `hsla(${color.hue}, ${color.saturation * saturationMultiplier}%, ${color.lightness}%, ${color.alpha})`;
}
