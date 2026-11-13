import { tick } from './tick';
import type { RngStreams, SaveState, TickObserver, TickOutput } from './types';

/** The only batched path: exact ordinary ticks, regardless of speed or chunk boundaries. */
export function advance(state: SaveState, rng: RngStreams, n: number,
  onTick?: (before: SaveState, after: SaveState, output: TickOutput) => void, observer?: TickObserver): SaveState {
  if (!Number.isSafeInteger(n) || n < 0 || n > Number.MAX_SAFE_INTEGER - state.clock.tick) throw new Error('Invalid tick count.');
  let next=state;
  for (let i=0;i<n;i++) {
    const before=next, output: TickOutput | undefined=onTick ? {events:[],changes:[]} : undefined;
    next=tick(before,i===0?rng:before.rng,output,observer);
    if (output) onTick!(before,next,output);
  }
  return next;
}
