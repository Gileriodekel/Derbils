import { prizeBalances } from '../competition/balances';
import { config, skillKeys } from '../../data/config';
import { prizeGroup } from '../competition/inventory';
import { prizeReason } from '../competition/prizes';
import type { CreatureAwards, SaveState } from '../types';
import { exactKeys, finite, integer, object, requireValue } from './checks';

function validateAwards(a:CreatureAwards,s:SaveState):void{
  requireValue(exactKeys(a,['owned','equipped','trophies','wins','bestPerformance','confidenceUntilTick','xpPeriod','xpThisPeriod','totalXp'])&&Array.isArray(a.owned)&&new Set(a.owned).size===a.owned.length&&a.owned.every(id=>Object.hasOwn(config.prizes.starter.cosmetics,id))&&(a.equipped===null||a.owned.includes(a.equipped)),'cosmetic ownership');
  requireValue(integer(a.wins)&&integer(a.confidenceUntilTick,0,s.clock.tick+config.prizes.confidenceDays*config.clock.dayTicks)&&integer(a.xpPeriod,0,Math.floor(s.clock.tick/config.prizes.xpPeriodTicks))&&finite(a.xpThisPeriod,0,config.prizes.xpPerPeriodCap)&&finite(a.totalXp,a.xpThisPeriod,Number.MAX_SAFE_INTEGER),'bounded competition effects');
  requireValue(object(a.bestPerformance)&&Object.entries(a.bestPerformance).every(([k,v])=>skillKeys.includes(k as typeof skillKeys[number])&&finite(v,0,Number.MAX_SAFE_INTEGER)),'best performance');
  requireValue(Array.isArray(a.trophies)&&a.trophies.length<=config.prizes.trophyLimit&&new Set(a.trophies.map(t=>t.competitionId)).size===a.trophies.length,'trophy shelf');
  for(const t of a.trophies)requireValue(exactKeys(t,['competitionId','skills','placement','tick'])&&/^cpt_[0-9]{8}$/.test(t.competitionId)&&integer(Number(t.competitionId.slice(4)),1,s.counters.competition-1)&&Array.isArray(t.skills)&&(t.skills.length>=1||s.dynasty.legacyRecords.length>0)&&t.skills.every(k=>skillKeys.includes(k))&&integer(t.placement,1,config.competitions.maximumEntrants)&&integer(t.tick,0,s.clock.tick),'trophy record');
}
export function validatePrizes(s:SaveState):void{
  const l=s.prizeLedger;requireValue(exactKeys(l,['supplied','eaten','overflow','escrowed','delivered','refunded','returned','rareFruitEaten']),'prize ledger fields');
  const known=new Set(Object.entries(s.inventory).flatMap(([g,values])=>Object.keys(values).map(id=>`${({fruit:'fruit',seeds:'seed',items:'item',cosmetics:'cosmetic'} as Record<string,string>)[g]}:${id}`)));
  for(const values of [l.supplied,l.eaten,l.overflow])requireValue(object(values)&&Object.entries(values).every(([k,v])=>known.has(k)&&integer(v)),'prize supply counters');
  for(const k of ['escrowed','delivered','refunded','returned','rareFruitEaten'] as const)requireValue(integer(l[k]),'prize transfer counts');
  for(const group of Object.values(s.inventory))requireValue(Object.values(group).every(n=>integer(n,0,config.prizes.stackCapacity)),'inventory stack caps');
  requireValue(s.world.lastCacheDay===Math.floor(s.clock.tick/config.clock.dayTicks),'daily supply deadline');
  for(const c of s.creatures){validateAwards(c.awards,s);requireValue(c.awards.wins===c.competition.stats.wins,'win ledger');}
  for(const c of s.lineage)validateAwards(c.awards,s);
  for(const f of s.world.looseFruit)if(f.prize)requireValue(config.fruit[f.kind].rare&&exactKeys(f.prize,['competitionId','ownerId','exclusiveUntilTick'])&&/^cpt_[0-9]{8}$/.test(f.prize.competitionId)&&integer(Number(f.prize.competitionId.slice(4)),1,s.counters.competition-1)&&integer(f.prize.exclusiveUntilTick,f.droppedTick,f.droppedTick+config.prizes.deliveryWindowTicks)&&(f.prize.ownerId===null||s.creatures.some(c=>c.id===f.prize!.ownerId)&&s.clock.tick<f.prize.exclusiveUntilTick),'prize fruit handoff');
  requireValue(s.world.plants.every(p=>!config.fruit[p.kind].rare),'rare fruit has no habitat source');
  for(const e of [...s.competitions,...s.competitionHistory]){
    requireValue(!prizeReason(e.prize)&&typeof e.awarded==='boolean'&&Array.isArray(e.deliveries),'prize event fields');
    requireValue(e.awarded===(e.status==='resolved')&&e.escrowState===(e.prize?(e.status==='resolved'?'released':e.status==='cancelled'?'refunded':'held'):'none'),'prize settlement status');
    requireValue(e.deliveries.length===(e.awarded?(e.prize?.placements.length??0):0),'prize delivery count');
    for(const [i,d] of e.deliveries.entries()){
      const p=e.prize!.placements[i],{rank,...prize}=p;
      requireValue(exactKeys(d,['rank','creatureId','prize','destination','reason'])&&d.rank===rank&&JSON.stringify(d.prize)===JSON.stringify(prize)&&['fruit','cosmetic','donated','inventory'].includes(d.destination)&&(d.reason===null||typeof d.reason==='string')&&d.creatureId===(e.results!.placements.find(p=>p.rank===rank)?.id??null),'prize delivery record');
      if(d.destination==='cosmetic')requireValue(p.kind==='cosmetic','cosmetic delivery type');
      if(d.destination==='fruit')requireValue(p.kind==='fruit','fruit delivery type');
      if(d.destination==='donated')requireValue(p.kind==='item'||p.kind==='seed','donated delivery type');
      requireValue(Number.isSafeInteger(s.inventory[prizeGroup(p.kind)][p.id]),'known prize stack');
    }
  }
  const balances=prizeBalances(s);
  for(const key of known)requireValue((balances[key]??0)===(l.supplied[key]??0),`prize conservation ${key}`);
  requireValue(l.rareFruitEaten===Object.values(l.eaten).reduce((n,v)=>n+v,0),'rare meals total');
}
