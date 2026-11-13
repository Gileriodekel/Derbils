import type { SaveState } from '../sim/types';
import type { RuntimeFailure } from './types';
/** An exception returns the last good snapshot; caller pauses without touching storage. */
export function guardedAdvance(state:SaveState,commands:readonly unknown[],advance:(s:SaveState)=>SaveState):{state:SaveState;failure:RuntimeFailure|null}{
  try{return {state:advance(state),failure:null};}catch(error){return {state,failure:{seed:Number(state.saveId.slice(6)),tick:state.clock.tick,commands:[...commands],details:error instanceof Error?`${error.name}: ${error.message}\n${error.stack??''}`:String(error)}};}
}
