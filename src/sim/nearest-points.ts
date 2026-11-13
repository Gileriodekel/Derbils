import { distance } from './navigation';
import type { Point } from './types';

/** Immutable tile centers, grouped by row and ordered by x. */
export function pointRows(points: readonly Point[]): readonly (readonly Point[])[] {
  const rows = new Map<number, Point[]>();
  for (const point of points) {
    let row = rows.get(point.y);
    if (!row) { row = []; rows.set(point.y, row); }
    row.push({ ...point });
  }
  return [...rows.values()].sort((a, b) => a[0].y - b[0].y).map(row => row.sort((a, b) => a.x - b.x));
}

/** Exact Manhattan nearest neighbors, with the original row/column tie order.
 * Only k candidates per row can belong to the global first k. No approximate
 * distances or rounded positions: fractional movement keeps its exact result. */
export function nearestPoints(rows: readonly (readonly Point[])[], from: Point, count: number): Point[] {
  if (count <= 0) return [];
  const best: { point: Point; distance: number }[] = [];
  for (const row of rows) {
    if (!row.length || (best.length === count && Math.abs(row[0].y - from.y) > best[count - 1].distance)) continue;
    let low = 0, high = row.length;
    while (low < high) { const mid = (low + high) >>> 1; if (row[mid].x < from.x) low = mid + 1; else high = mid; }
    let left = low - 1, right = low;
    for (let n = 0; n < count && (left >= 0 || right < row.length); n++) {
      const takeLeft = right === row.length || (left >= 0 && distance(row[left], from) <= distance(row[right], from));
      const point = takeLeft ? row[left--] : row[right++], d = distance(point, from);
      const at = best.findIndex(other => other.distance > d || (other.distance === d
        && (other.point.y > point.y || (other.point.y === point.y && other.point.x > point.x))));
      if (at >= 0) best.splice(at, 0, { point, distance: d });
      else if (best.length < count) best.push({ point, distance: d });
      if (best.length > count) best.pop();
    }
  }
  return best.map(({ point }) => ({ ...point }));
}
