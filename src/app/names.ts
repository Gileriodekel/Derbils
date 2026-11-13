import { config } from '../data/config';
import type { NamesConfig, SaveState } from '../sim/types';
/** Cosmetic integer hash; never consumes a saved RNG stream. */
export function creatureName(seed:number,id:string,table:NamesConfig=config.names):string {
  let h=(seed^0x811c9dc5)>>>0;
  for(let i=0;i<id.length;i++)h=Math.imul(h^id.charCodeAt(i),0x01000193)>>>0;
  const choose=(words:string[])=>{h^=h>>>16;h=Math.imul(h,0x7feb352d)>>>0;h^=h>>>15;return words[(h>>>0)%words.length];};
  return choose(table.starts)+choose(table.middles)+choose(table.ends);
}
export function nameWithId(seed:number,id:string,name=creatureName(seed,id)):string{return `${name} #${Number(id.slice(2))}`;}
const views=new WeakMap<SaveState,SaveState>();
const creatureViews=new WeakMap<SaveState['creatures'],{seed:number;rows:SaveState['creatures']}>();
const lineageViews=new WeakMap<SaveState['lineage'],{seed:number;rows:SaveState['lineage']}>();
/** Presentation copy only. Keep raw authoritative names/records untouched in debug, saves and hashes. */
export function namedView(state:SaveState):SaveState {
  let view=views.get(state);if(view)return view;
  const seed=Number(state.saveId.slice(6));
  let creatures=creatureViews.get(state.creatures),lineage=lineageViews.get(state.lineage);
  if(!creatures||creatures.seed!==seed){creatures={seed,rows:state.creatures.map(c=>({...c,displayName:c.displayName===config.names.founderName?c.displayName:creatureName(seed,c.id)}))};creatureViews.set(state.creatures,creatures);}
  if(!lineage||lineage.seed!==seed){lineage={seed,rows:state.lineage.map(l=>({...l,displayName:l.displayName===config.names.founderName?l.displayName:creatureName(seed,l.id)}))};lineageViews.set(state.lineage,lineage);}
  view={...state,creatures:creatures.rows,lineage:lineage.rows};
  views.set(state,view);return view;
}
