import { advance } from '../sim/advance';
import type { Config, SaveState } from '../sim/types';
import { accumulateSummary, createSummary } from './summary';

export interface CatchUpOptions {
  now: () => number; config: Config; realAwaySeconds?: number; capped?: boolean;
  yieldControl?: () => Promise<void>;
}
/** Owns only the replay job. No rendering, storage, commands or browser clock is imported. */
export function createCatchUp(state: SaveState, targetTicks: number, options: CatchUpOptions) {
  if(!Number.isSafeInteger(targetTicks)||targetTicks<0||targetTicks>Number.MAX_SAFE_INTEGER-state.clock.tick)throw new Error('Invalid replay target.');
  let current=state,completed=0,cancelled=false;
  let summary=createSummary(state,options.realAwaySeconds,options.capped);
  const tuning=options.config.offline;
  function step(){
    const started=options.now();let ticks=0;
    while(!cancelled&&completed<targetTicks&&ticks<tuning.maxTicksPerSlice
      &&(ticks<tuning.minTicksPerSlice||options.now()-started<tuning.sliceBudgetMs)){
      current=advance(current,current.rng,1,(_before,after,output)=>{summary=accumulateSummary(summary,after,output,options.config);});
      ticks++;completed++;
    }
    return {state:current,completed,targetTicks,progress:targetTicks===0?1:completed/targetTicks,ticks,
      done:cancelled||completed===targetTicks,cancelled,summary};
  }
  return {
    step,
    cancel(){cancelled=true;summary={...summary,skipped:completed<targetTicks};},
    snapshot(){return {state:current,completed,targetTicks,progress:targetTicks===0?1:completed/targetTicks,
      done:cancelled||completed===targetTicks,cancelled,summary};},
    async run(onProgress?: (progress:ReturnType<typeof step>)=>void){
      // A macrotask yield works in hidden tabs; rAF would suspend replay there.
      const yieldControl=options.yieldControl??(()=>new Promise<void>(resolve=>setTimeout(resolve,0)));
      while(!cancelled&&completed<targetTicks){const progress=step();onProgress?.(progress);await yieldControl();}
      return this.snapshot();
    },
  };
}
