import type { LifeEvent, PresentationConfig } from '../sim/types';
/** Newest-first selection enforces a rolling simulated-time cap, independent of UI refresh frequency. */
export function playerEvents(events: readonly LifeEvent[], config: PresentationConfig, debug=false): LifeEvent[] {
  if(debug)return [...events];
  const recent:number[]=[];
  return [...events].reverse().filter(e=>{
    if(!config.playerEventKinds.includes(e.kind))return false;
    while(recent.length&&recent[0]-e.tick>=config.eventWindowTicks)recent.shift();
    if(recent.length>=config.eventRateCap)return false;recent.push(e.tick);return true;
  }).reverse();
}
