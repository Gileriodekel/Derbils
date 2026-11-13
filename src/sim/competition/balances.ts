import { prizeKey } from './inventory';
import type { SaveState } from '../types';
/** Conservation includes consumed fruit and archived cosmetic collections, never cumulative transfer counts. */
export function prizeBalances(s:SaveState):Record<string,number>{
  const balances:Record<string,number>={};const add=(key:string,n:number)=>balances[key]=(balances[key]??0)+n;
  for(const [group,values] of Object.entries(s.inventory))for(const [id,n] of Object.entries(values))add(`${({fruit:'fruit',seeds:'seed',items:'item',cosmetics:'cosmetic'} as Record<string,string>)[group]}:${id}`,n);
  for(const e of s.competitions)if(e.escrowState==='held')for(const p of e.prize!.placements)add(prizeKey(p),p.quantity);
  for(const f of s.world.looseFruit)if(f.prize)add(`fruit:${f.kind}`,1);
  const owned=new Map<string,Set<string>>();
  for(const c of [...s.lineage,...s.creatures]){let set=owned.get(c.organismId);if(!set){set=new Set();owned.set(c.organismId,set);}for(const id of c.awards.owned)set.add(id);}
  for(const set of owned.values())for(const id of set)add(`cosmetic:${id}`,1);
  for(const [id,n] of Object.entries(s.archive?.cosmetics??{}))add(`cosmetic:${id}`,n);
  for(const [key,n] of Object.entries(s.prizeLedger.eaten))add(key,n);
  return balances;
}
