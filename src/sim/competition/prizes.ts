import { inheritJournal } from '../event-output';
import { config, fruitKinds } from '../../data/config';
import { creditInventory, prizeGroup, prizeKey, syncAwardRecord } from './inventory';
import { competitionEvent } from './journal';
import type { Competition, PrizeSpec, SaveState } from '../types';

export function prizeReason(prize:unknown):string|null{
  if(prize===null||prize===undefined)return null;
  if(typeof prize!=='object'||Array.isArray(prize)||Object.keys(prize).join()!=='placements')return 'Invalid prize table.';
  const rows=(prize as PrizeSpec).placements;
  if(!Array.isArray(rows)||rows.length<1||rows.length>config.prizes.maximumRankedPrizes)return 'Choose one to three ranked prizes.';
  const ranks=new Set<number>();let previous=0;
  for(const p of rows){
    if(!p||typeof p!=='object'||Object.keys(p).sort().join()!=='id,kind,quantity,rank')return 'Invalid prize fields.';
    if(!Number.isInteger(p.rank)||p.rank<1||p.rank>config.prizes.maximumRankedPrizes||ranks.has(p.rank)||p.rank<=previous)return 'Use unique ascending prize placements from first to third.';
    ranks.add(p.rank);previous=p.rank;
    const valid=p.kind==='fruit'?fruitKinds.includes(p.id)&&config.fruit[p.id].rare:p.kind==='seed'?fruitKinds.includes(p.id):p.kind==='item'?Object.hasOwn(config.items,p.id):p.kind==='cosmetic'?Object.hasOwn(config.prizes.starter.cosmetics,p.id):false;
    if(!valid)return 'Unknown prize type or id (fruit must be rare).';
    if(!Number.isInteger(p.quantity)||p.quantity<1||p.quantity>(p.kind==='fruit'?config.prizes.maximumFruitPerPrize:1))return 'Fruit prizes allow 1–3; other prizes require quantity 1.';
  }
  return null;
}
export function inventoryReason(s:SaveState,prize:PrizeSpec|null|undefined):string|null{
  const invalid=prizeReason(prize);if(invalid)return invalid;
  const totals=new Map<string,number>();
  for(const p of prize?.placements??[]){const key=prizeKey(p),n=(totals.get(key)??0)+p.quantity;totals.set(key,n);
    if(s.inventory[prizeGroup(p.kind)][p.id]<n)return `Not enough ${p.id} in inventory.`;}
  return null;
}
export function escrowPrizes(s:SaveState,e:Competition):void{
  if(!e.prize)return;const reason=inventoryReason(s,e.prize);if(reason)throw new Error(reason);
  for(const p of e.prize.placements){s.inventory[prizeGroup(p.kind)][p.id]-=p.quantity;s.prizeLedger.escrowed+=p.quantity;}
  e.escrowState='held';competitionEvent(s,e,'prizeEscrowed','Prizes held; cancellation refunds them.');
}
export function refundPrizes(s:SaveState,e:Competition):void{
  if(e.escrowState!=='held')return;
  for(const p of e.prize!.placements){creditInventory(s,p);s.prizeLedger.refunded+=p.quantity;}
  e.escrowState='refunded';competitionEvent(s,e,'prizeRefunded','All held prizes refunded.');
}
/** Pure, idempotent completion transfer. Every destination is recorded in the event ledger. */
export function deliverPrizes(state:SaveState,competitionId:string):SaveState{
  const original=[...state.competitions,...state.competitionHistory].find(e=>e.id===competitionId);
  if(!original||original.awarded||original.status==='cancelled'||!original.results||state.clock.tick<original.endTick)return state;
  const s=JSON.parse(JSON.stringify(state)) as SaveState,e=[...s.competitions,...s.competitionHistory].find(e=>e.id===competitionId)!;
  inheritJournal(state.events,s.events);
  for(const row of e.prize?.placements??[]){
    const {rank,...p}=row,placement=e.results!.placements.find(r=>r.rank===rank),c=s.creatures.find(c=>c.id===placement?.id);
    let destination:Competition['deliveries'][number]['destination']='inventory',reason:string|null=null;
    if(!c){creditInventory(s,p);reason=placement?'Recipient life ended':'No finisher at this placement';s.prizeLedger.returned+=p.quantity;}
    else if(p.kind==='fruit'){
      const position=e.attendance.find(a=>a.id===c.id)?.entryPosition??c.position;
      const room=Math.max(0,config.prizes.looseCapacity-s.world.looseFruit.length),placed=Math.min(room,p.quantity);
      for(let i=0;i<placed;i++)s.world.looseFruit.push({id:`f_${String(s.counters.fruit++).padStart(8,'0')}`,kind:p.id,x:position.x,y:position.y,droppedTick:s.clock.tick,
        prize:{competitionId:e.id,ownerId:c.id,exclusiveUntilTick:s.clock.tick+config.prizes.deliveryWindowTicks}});
      if(placed<p.quantity){creditInventory(s,{...p,quantity:p.quantity-placed});s.prizeLedger.returned+=p.quantity-placed;reason='Fruit pile full; overflow stored';}
      destination=placed?'fruit':'inventory';
    }else if(p.kind==='cosmetic'){
      if(c.awards.owned.includes(p.id)){creditInventory(s,p);s.prizeLedger.returned+=p.quantity;reason='Duplicate cosmetic returned as matching token';}
      else{c.awards.owned.push(p.id);destination='cosmetic';}
      c.awards.equipped=p.id;
    }else{creditInventory(s,p);destination='donated';reason=`Donated by ${c.displayName}`;s.prizeLedger.returned+=p.quantity;}
    if(c)syncAwardRecord(s,c);
    e.deliveries.push({rank,creatureId:placement?.id??null,prize:p,destination,reason});s.prizeLedger.delivered+=p.quantity;
    competitionEvent(s,e,destination==='inventory'||destination==='donated'?'prizeReturned':'prizeAwarded',`${p.quantity} ${p.id}: ${reason??destination}`,placement?.id);
  }
  if(e.escrowState==='held')e.escrowState='released';e.awarded=true;
  return s;
}
/** Timed hand-off to a shared pile; prize fruit never silently spoils. */
export function maintainPrizeFruit(s:SaveState):void{
  const living=new Set(s.creatures.map(c=>c.id));
  s.world.looseFruit=s.world.looseFruit.filter(f=>{
    if(!f.prize?.ownerId)return true;
    if(!living.has(f.prize.ownerId)){
      creditInventory(s,{kind:'fruit',id:f.kind,quantity:1});s.prizeLedger.returned++;
      const e=[...s.competitions,...s.competitionHistory].find(e=>e.id===f.prize!.competitionId);
      if(e)competitionEvent(s,e,'prizeReturned','Recipient life ended before eating; fruit returned',f.prize.ownerId);return false;
    }
    if(s.clock.tick>=f.prize.exclusiveUntilTick)f.prize={...f.prize,ownerId:null};return true;
  });
}
export function autoPrize(s:SaveState):PrizeSpec|null{
  if(!s.settings.autoPrizes)return null;
  const template=config.prizes.auto[(s.counters.competition-1)%config.prizes.auto.length];
  const available=JSON.parse(JSON.stringify(s.inventory)) as SaveState['inventory'];
  const placements=template.placements.filter(p=>{const g=available[prizeGroup(p.kind)];if(g[p.id]<p.quantity)return false;g[p.id]-=p.quantity;return true;});
  return placements.length?{placements}:null;
}
