import { historicalDayTicks } from '../historical-time';
import { config, fruitKinds } from '../../data/config';
import { exactKeys, finite, integer, requireValue } from '../validation/checks';
import { energyCapacity } from './movement';
import type { SaveState } from '../types';
export function validateDynasty(s:SaveState):void {
  const d=s.dynasty,p=config.dynasty.plants;
  requireValue(exactKeys(d,['calendarChangedAtTick','nextPlantTick','nextDerbyDay','nextCupDay','championOrganismId','events','legacyRecords']),'Dynasty fields');
  requireValue(d.calendarChangedAtTick === null || integer(d.calendarChangedAtTick,0,s.clock.tick), 'calendar migration boundary');
  requireValue(integer(d.nextPlantTick,0,s.clock.tick+p.spawnEveryTicks)&&integer(d.nextDerbyDay,1)&&integer(d.nextCupDay,1)
    &&d.nextDerbyDay%config.dynasty.competitions.derbyDays===0&&d.nextCupDay%config.dynasty.competitions.cupDays===0,'Dynasty event timers');
  requireValue(d.championOrganismId===null||s.organisms.some(o=>o.id===d.championOrganismId),'champion organism');
  requireValue(Array.isArray(d.legacyRecords)&&Array.isArray(d.events)&&d.events.length<=config.dynasty.competitions.historyLimit,'Dynasty records');
  const ids=new Set<string>(),days=new Set<string>();let previous=0;
  for(const e of d.events){
    requireValue(exactKeys(e,['id','kind','day','tick','winnerId','ranking','awarded'])&&['derby','cup'].includes(e.kind)
      &&integer(e.day,1)&&e.tick===e.day*historicalDayTicks(s,e.tick)&&integer(e.tick,previous,s.clock.tick)
      &&e.day%(e.kind==='derby'?config.dynasty.competitions.derbyDays:config.dynasty.competitions.cupDays)===0
      &&!days.has(`${e.kind}:${e.day}`)&&!ids.has(e.id)&&e.awarded===true,'scheduled Dynasty event');
    days.add(`${e.kind}:${e.day}`);ids.add(e.id);previous=e.tick;
    requireValue(Array.isArray(e.ranking)&&new Set(e.ranking.map(p=>p.id)).size===e.ranking.length&&e.ranking.every(p=>exactKeys(p,['id','score'])&&typeof p.id==='string'&&finite(p.score,0,Number.MAX_SAFE_INTEGER)),'Dynasty results');
    requireValue(e.winnerId===(e.ranking[0]?.id??null),'Dynasty winner');
  }
  const berries=new Set<string>();
  function berry(id:string){requireValue(/^f_[0-9]{8}$/.test(id)&&integer(Number(id.slice(2)),1,s.counters.fruit-1)&&!berries.has(id),'unique berry ownership');berries.add(id);}
  for(const plant of s.world.plants){
    requireValue(Array.isArray(plant.berries)&&plant.berries.length===2&&plant.berries.every(v=>typeof v==='boolean')&&plant.ripe===plant.berries.filter(Boolean).length&&plant.ripe>0
      &&Array.isArray(plant.berryIds)&&plant.berryIds.length===2&&plant.berryIds[0]!==plant.berryIds[1]&&plant.growthProgress===0,'two individual berries');
    plant.berries.forEach((present,i)=>{if(present)berry(plant.berryIds![i]);});
  }
  for(const f of s.world.looseFruit)berry(f.id);
  for(const c of s.creatures){const x=c.dynasty;
    requireValue(exactKeys(x,['energy','movementMode','moving','fast','food','nextSocialTick','runningPenaltyUntil','reincarnationFruit'])&&finite(x.energy,0,energyCapacity(c))
      &&['walk','swim','fly'].includes(x.movementMode)&&typeof x.moving==='boolean'&&typeof x.fast==='boolean'
      &&integer(x.nextSocialTick,0,s.clock.tick+config.dynasty.relationships.socialIntervalTicks)
      &&integer(x.runningPenaltyUntil,0,s.clock.tick+config.dynasty.relationships.fightPenaltyDays*config.clock.dayTicks)&&integer(x.reincarnationFruit),'Derbil Dynasty state');
    requireValue(Array.isArray(x.food)&&x.food.length<s.counters.fruit,'carried berry capacity');
    for(const f of x.food){requireValue(exactKeys(f,['id','kind'])&&fruitKinds.includes(f.kind)&&!config.fruit[f.kind].rare,'carried berry');berry(f.id);}
  }
}
