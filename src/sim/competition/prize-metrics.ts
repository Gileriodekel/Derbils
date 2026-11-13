import { prizeBalances } from './balances';
import type { SaveState } from '../types';
/** Reports persisted transfer counters and distinct life records, including departed winners. */
export function prizeMetrics(s:SaveState){
  const lives=new Map(s.lineage.map(l=>[l.id,{id:l.id,organismId:l.organismId,awards:l.awards}]));
  for(const c of s.creatures)lives.set(c.id,c);
  const rows=[...lives.values()],wins=rows.reduce((n,c)=>n+c.awards.wins,0),balances=prizeBalances(s);
  return {...s.prizeLedger,inventory:s.inventory,balances,conserved:Object.entries(balances).every(([k,n])=>n===(s.prizeLedger.supplied[k]??0)),
    xp:rows.map(c=>({id:c.id,total:c.awards.totalXp,period:c.awards.xpPeriod,inPeriod:c.awards.xpThisPeriod})),
    trophies:rows.filter(c=>c.awards.trophies.length).map(c=>({id:c.id,organismId:c.organismId,wins:c.awards.wins,titles:c.awards.trophies.length})),
    winningCreatures:rows.filter(c=>c.awards.wins>0).length,maximumWinShare:wins?Math.max(...rows.map(c=>c.awards.wins))/wins:0,prestigeMatingWeight:0};
}
