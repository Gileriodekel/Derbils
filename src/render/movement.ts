import { config } from '../data/config';
import type { Creature, DeepReadonly, Point, SaveState } from '../sim/types';

/** Recover the path actually traversed in the last tick, including corner turns. */
export function movementRoute(previous: DeepReadonly<SaveState>, before: DeepReadonly<Creature>, after: DeepReadonly<Creature>): Point[] {
  if (before.position.x === after.position.x && before.position.y === after.position.y) return [after.position];
  const court = previous.sessions.find(s => s.participants.includes(before.id));
  const social = previous.social.sessions.find(s => s.participants.includes(before.id));
  const attendance = previous.competitions.flatMap(e => e.attendance).find(a => a.id === before.id);
  const path = court ? court.paths[court.participants.indexOf(before.id)] : social ? social.paths[social.participants.indexOf(before.id)]
    : attendance?.path ?? before.currentAction?.path ?? [];
  const route: Point[] = [before.position]; let from = before.position;
  for (const target of path) {
    const end = after.position;
    const within = (n: number, a: number, b: number) => n >= Math.min(a, b) - 1e-8 && n <= Math.max(a, b) + 1e-8;
    if ((from.x === target.x && Math.abs(end.x - from.x) < 1e-8 && within(end.y, from.y, target.y))
      || (from.y === target.y && Math.abs(end.y - from.y) < 1e-8 && within(end.x, from.x, target.x))) return [...route, end];
    route.push(target); from = target;
  }
  // A newly chosen urgent action or lifecycle transition can have no prior route.
  return [before.position, after.position];
}

export function sampleRoute(route: readonly Point[], alpha: number): Point {
  if (route.length === 1) return { ...route[0] };
  const lengths = route.slice(1).map((p, i) => Math.hypot(p.x - route[i].x, p.y - route[i].y));
  let distance = lengths.reduce((a, b) => a + b, 0) * Math.max(0, Math.min(1, alpha));
  for (let i = 0; i < lengths.length; i++) {
    const length = lengths[i]; if (length === 0) continue;
    if (distance <= length) return { x: route[i].x + (route[i + 1].x - route[i].x) * distance / length,
      y: route[i].y + (route[i + 1].y - route[i].y) * distance / length };
    distance -= length;
  }
  return { ...route.at(-1)! };
}

/** Keep the entire SVG inside the world rectangle, even at an outer shoreline.
 * This small visual inset does not change a Derbil's saved navigation position. */
export function visiblePosition(position: Point, creature: DeepReadonly<Creature>, width: number, height: number): Point {
  const dormant = creature.stage === 'egg' || creature.stage === 'cocoon';
  const scale = dormant ? 1 : config.lifecycle.stages[creature.stage].scale;
  const halfWidth = Math.min(width / 2, config.dynasty.art.sizeTiles * scale / 2);
  const halfHeight = Math.min(height / 2, halfWidth * (dormant ? 1 : 1450 / 2150));
  return { x: Math.max(halfWidth, Math.min(width - halfWidth, position.x)),
    y: Math.max(halfHeight, Math.min(height - halfHeight, position.y)) };
}
