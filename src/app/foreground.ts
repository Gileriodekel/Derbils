import { tick } from '../sim/tick';
import type { SaveState } from '../sim/types';

/** Yield between exact ticks so accelerated play cannot monopolize the UI thread.
 * Keep the final adjacent snapshots for interpolation, not a whole-frame jump. */
export function advanceForeground(state: SaveState, count: number, budgetMs: number, now: () => number) {
  const started = now(); let next = state, previous = state, completed = 0;
  while (completed < count && (completed === 0 || now() - started < budgetMs)) {
    previous = next; next = tick(next); completed++;
  }
  return { state: next, previous, completed };
}
