import type { AppearanceColor, DeepReadonly } from '../types';

export const clampRange = (value: number, bounds: readonly number[]) => Math.max(bounds[0], Math.min(bounds[1], value));
export const interpolate = (range: readonly number[], fraction: number) => range[0] + (range[1] - range[0]) * fraction;

export function hslToRgb(c: DeepReadonly<AppearanceColor>): [number, number, number] {
  const s = c.saturation / 100, l = c.lightness / 100, a = s * Math.min(l, 1 - l);
  const channel = (n: number) => { const k = (n + c.hue / 30) % 12; return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)); };
  return [channel(0), channel(8), channel(4)];
}

export function rgbToHsl(rgb: readonly number[], alpha = 1): AppearanceColor {
  const [r, g, b] = rgb, max = Math.max(r, g, b), min = Math.min(r, g, b), delta = max - min, l = (max + min) / 2;
  const hue = delta === 0 ? 0 : max === r ? ((g - b) / delta + 6) % 6 : max === g ? (b - r) / delta + 2 : (r - g) / delta + 4;
  return { hue: hue * 60, saturation: delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1)) * 100, lightness: l * 100, alpha };
}

export function parseRgb(hex: string): [number, number, number] {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) throw new Error('Expected a six-digit RGB color.');
  return [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255) as [number, number, number];
}
