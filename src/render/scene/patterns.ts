import type { AppearanceSpec, Config, DeepReadonly, Point } from '../../sim/types';
import type { DrawCommand } from './types';
import { hash32 } from './hash';
import { colorCss } from './colors';
import { resolvePath } from './paths';

/** Pattern coordinates share the body's local unit ellipse, including its clipping region. */
export function patternCommands(spec: DeepReadonly<AppearanceSpec>, body: DrawCommand, config: DeepReadonly<Config>): DrawCommand[] {
  if (spec.pattern.kind === 'solid' || body.primitive !== 'ellipse') return [];
  const data = config.appearance.pattern, kind = spec.pattern.kind;
  const count = data[kind];
  const sample = (i: number) => hash32(`${spec.pattern.seed}:${i}`) / 4294967296;
  const style = { partId: 'body-pattern', slot: 'bodyPattern', tier: body.tier, layerIndex: config.appearance.layerOrder.indexOf('bodyPattern'),
    transform: body.transform, pivot: body.pivot,
    fill: colorCss(spec.baseColors.accent), stroke: null, opacity: data.opacity, strokeWidth: 0,
    clip: { radius: { ...body.radius } }, motion: 'body' as const };
  return Array.from({ length: count }, (_, i): DrawCommand => {
    const shapeStyle = { ...style, transform: { ...style.transform }, pivot: { ...style.pivot } };
    if (kind === 'spots') {
      const radius = data.minRadius + sample(i * 3) * (data.maxRadius - data.minRadius);
      return { ...shapeStyle, primitive: 'ellipse', center: { x: (sample(i * 3 + 1) * 2 - 1) * data.margin,
        y: (sample(i * 3 + 2) * 2 - 1) * data.margin }, radius: { x: radius, y: radius } };
    }
    const y = -data.margin + i * data.margin * 2 / count;
    if (kind === 'stripes') {
      const points: Point[] = [{ x: -data.margin, y }, { x: data.margin, y: y - data.tilt },
        { x: data.margin, y: y - data.tilt + data.stripeWidth }, { x: -data.margin, y: y + data.stripeWidth }];
      return { ...shapeStyle, primitive: 'polygon', segments: resolvePath(points, true, false) };
    }
    const points = Array.from({ length: data.points }, (_, j) => ({ x: -data.margin + j * data.margin * 2 / (data.points - 1),
      y: y + (sample(i * data.points + j) * 2 - 1) * data.amplitude }));
    return { ...shapeStyle, primitive: 'path', fill: null, stroke: colorCss(spec.baseColors.accent), strokeWidth: data.stripeWidth,
      segments: resolvePath(points, false, true) };
  });
}
