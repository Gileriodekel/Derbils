import { config } from '../../data/config';
import { recordLifeEvent } from '../life-records';
import type { CreatureAwards, Prize, PrizeLedger, SaveState } from '../types';

export const prizeGroup = (kind: Prize['kind']) => ({ fruit:'fruit', seed:'seeds', item:'items', cosmetic:'cosmetics' } as const)[kind];
export const prizeKey = (p:Pick<Prize,'kind'|'id'>) => `${p.kind}:${p.id}`;
export function emptyAwards():CreatureAwards{return {owned:[],equipped:null,trophies:[],wins:0,bestPerformance:{},confidenceUntilTick:0,xpPeriod:0,xpThisPeriod:0,totalXp:0};}
export function starterInventory():SaveState['inventory']{return JSON.parse(JSON.stringify(config.prizes.starter));}
export function initialPrizeLedger():PrizeLedger{
  const supplied:Record<string,number>={};
  for(const [group,counts] of Object.entries(config.prizes.starter))for(const [id,n] of Object.entries(counts))supplied[`${({fruit:'fruit',seeds:'seed',items:'item',cosmetics:'cosmetic'} as Record<string,string>)[group]}:${id}`]=n;
  return {supplied,eaten:{},overflow:{},escrowed:0,delivered:0,refunded:0,returned:0,rareFruitEaten:0};
}
export function inventoryEvent(s:SaveState,kind:'dailyCache'|'inventoryOverflow',reason:string):void{
  const c=s.creatures[0],id=c?.id??s.lineage.at(-1)?.id;if(!id)return;
  recordLifeEvent(s,{kind,creatureId:id,from:c?.stage??null,to:c?.stage??'dead',relatedCreatureId:null});
  // Cache counts are authoritative in the ledger; the journal is a bounded notification.
  void reason;
}
/** Transfer credits never discard earned property, even when passive stacks are full. */
export function creditInventory(s:SaveState,p:Prize):void {const g=s.inventory[prizeGroup(p.kind)];if(g[p.id]+p.quantity>config.prizes.stackCapacity)throw new Error('Reserved inventory capacity exceeded.');g[p.id]+=p.quantity;}
/** Credits each elapsed day once. Capped passive overflow is accounted for separately. */
export function grantDailyCache(s:SaveState):void{
  const end=Math.floor(s.clock.tick/config.clock.dayTicks);let overflow=0;
  for(let day=s.world.lastCacheDay+1;day<=end;day++){
    const c=config.prizes.cache,id=c.fruit[day%c.fruit.length];
    const grants:Prize[]=[{kind:'fruit',id,quantity:c.fruitQuantity},{kind:'seed',id,quantity:c.seedQuantity},{kind:'cosmetic',id:c.cosmetics[day%c.cosmetics.length],quantity:c.cosmeticQuantity}];
    for(const p of grants){const group=s.inventory[prizeGroup(p.kind)],key=prizeKey(p),accepted=Math.min(p.quantity,Math.max(0,config.prizes.stackCapacity-group[p.id]-reservedReturnCapacity(s,p))),lost=p.quantity-accepted;
      group[p.id]+=accepted;s.prizeLedger.supplied[key]=(s.prizeLedger.supplied[key]??0)+accepted;
      if(lost){s.prizeLedger.overflow[key]=(s.prizeLedger.overflow[key]??0)+lost;overflow+=lost;}
    }
  }
  if(end>s.world.lastCacheDay)inventoryEvent(s,'dailyCache',`Supplies through day ${end}`);
  if(overflow)inventoryEvent(s,'inventoryOverflow',`${overflow} passive supplies beyond stack caps`);
  s.world.lastCacheDay=end;
}

function reservedReturnCapacity(s:SaveState,p:Prize):number{
  let total=0;for(const e of s.competitions)if(e.escrowState==='held')for(const row of e.prize!.placements)if(row.kind===p.kind&&row.id===p.id)total+=row.quantity;
  if(p.kind==='fruit')total+=s.world.looseFruit.filter(f=>f.kind===p.id&&f.prize).length;
  return total;
}
export function syncAwardRecord(s:SaveState,c:import('../types').Creature):void{
  s.lineage=s.lineage.map(l=>l.id===c.id?{...l,awards:JSON.parse(JSON.stringify(c.awards))}:l);
}
