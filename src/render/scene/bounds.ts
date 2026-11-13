import type { DeepReadonly, Point } from '../../sim/types';
import type { Bounds, DrawCommand, Transform } from './types';

export function transformPoint(p: DeepReadonly<Point>, t: DeepReadonly<Transform>): Point {
  return { x: t.a * p.x + t.c * p.y + t.e, y: t.b * p.x + t.d * p.y + t.f };
}

/** Conservative control-point hull, including transformed strokes; ellipses use exact affine extents. */
export function sceneBounds(scene: DeepReadonly<DrawCommand[]>): Bounds {
  if (!scene.length) return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
  const bounds = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
  for (const command of scene) {
    const t = command.transform;
    const padX = command.stroke ? command.strokeWidth / 2 * Math.hypot(t.a, t.c) : 0;
    const padY = command.stroke ? command.strokeWidth / 2 * Math.hypot(t.b, t.d) : 0;
    let points: Point[];
    if (command.primitive === 'ellipse') {
      const dx = Math.hypot(t.a * command.radius.x, t.c * command.radius.y);
      const dy = Math.hypot(t.b * command.radius.x, t.d * command.radius.y);
      const center = transformPoint(command.center, t);
      points = [{ x: center.x - dx, y: center.y - dy }, { x: center.x + dx, y: center.y + dy }];
    } else points = command.segments.flatMap(s => s.op === 'close' ? [] :
      s.op === 'quadratic' ? [transformPoint(s.control, t), transformPoint(s.to, t)] : [transformPoint(s.to, t)]);
    let minX = Math.min(...points.map(p => p.x)) - padX, maxX = Math.max(...points.map(p => p.x)) + padX;
    let minY = Math.min(...points.map(p => p.y)) - padY, maxY = Math.max(...points.map(p => p.y)) + padY;
    if (command.clip) {
      const r = command.clip.radius, dx = Math.hypot(t.a * r.x, t.c * r.y), dy = Math.hypot(t.b * r.x, t.d * r.y);
      minX = Math.max(minX, t.e - dx); maxX = Math.min(maxX, t.e + dx); minY = Math.max(minY, t.f - dy); maxY = Math.min(maxY, t.f + dy);
    }
    if (minX <= maxX && minY <= maxY) { bounds.minX = Math.min(bounds.minX, minX); bounds.maxX = Math.max(bounds.maxX, maxX);
      bounds.minY = Math.min(bounds.minY, minY); bounds.maxY = Math.max(bounds.maxY, maxY); }
  }
  return bounds;
}
