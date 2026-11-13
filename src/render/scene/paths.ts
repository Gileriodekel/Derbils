import type { DeepReadonly, Point } from '../../sim/types';
import type { PathSegment } from './types';

const midpoint = (a: DeepReadonly<Point>, b: DeepReadonly<Point>): Point => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
const copy = (p: DeepReadonly<Point>): Point => ({ x: p.x, y: p.y });

/** Rounded polygons use midpoint quadratic segments; their convex hull stays inside the recipe. */
export function resolvePath(points: DeepReadonly<Point[]>, closed: boolean, smoothing: boolean): PathSegment[] {
  if (!points.length) return [];
  if (!smoothing || points.length < 3) return [{ op: 'move', to: copy(points[0]) },
    ...points.slice(1).map(p => ({ op: 'line' as const, to: copy(p) })), ...(closed ? [{ op: 'close' as const }] : [])];
  if (closed) return [{ op: 'move', to: midpoint(points.at(-1)!, points[0]) },
    ...points.map((p, i) => ({ op: 'quadratic' as const, control: copy(p), to: midpoint(p, points[(i + 1) % points.length]) })), { op: 'close' }];
  return [{ op: 'move', to: copy(points[0]) },
    ...points.slice(1, -1).map((p, i) => ({ op: 'quadratic' as const, control: copy(p), to: midpoint(p, points[i + 2]) })),
    { op: 'line', to: copy(points.at(-1)!) }];
}
