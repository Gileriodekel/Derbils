import { validateSave } from './validation/validate';
import { prizeBalances } from './competition/balances';
import { skillCap, xpAtLevel } from './skills';
import type { Config, SaveState, StateViolation } from './types';

/** Never throws, including malformed external values. Pure and non-mutating. */
export function validateState(value: unknown, config: Config): StateViolation[] {
  const issues:StateViolation[]=[];
  const add=(path:string,message:string)=>issues.push({path,message});
  const seen=new Set<object>();
  function finite(v:unknown,path:string):void {
    if(typeof v==='number'&&!Number.isFinite(v))add(path,'number must be finite');
    else if(v&&typeof v==='object') {
      if(seen.has(v)){add(path,'cyclic or shared object reference');return;}seen.add(v);
      for(const [k,n] of Object.entries(v))finite(n,path?`${path}.${k}`:k);
      seen.delete(v);
    }
  }
  try {finite(value,'');if(issues.length)return issues;}catch{add('$root','unreadable state');return issues;}
  try{validateSave(value);}catch(error){add('$state',error instanceof Error?error.message:'invalid state');}
  try {
    const s=value as SaveState;
    for(const key of ['creatures','organisms','lineage','relationships','competitions','competitionHistory'] as const){
      const rows=s[key];if(!Array.isArray(rows))continue;
      const ids=new Set<string>();
      for(const [i,row] of rows.entries()){
        const id='id' in row?String(row.id):`${(row as SaveState['relationships'][number]).a}:${(row as SaveState['relationships'][number]).b}`;
        if(ids.has(id))add(`${key}[${i}]`,'duplicate id');ids.add(id);
      }
    }
    const organisms=new Set(s.organisms.map(o=>o.id));
    for(const [i,r] of s.relationships.entries())if(!organisms.has(r.a)||!organisms.has(r.b))add(`relationships[${i}]`,'dangling relationship endpoint');
    const lives=new Set([...s.lineage,...(s.archive?.stubs??[])].map(l=>l.id));
    for(const e of [...s.competitions,...s.competitionHistory])for(const id of e.entrantIds)if(!lives.has(id))add(`competitions.${e.id}.entrantIds`,'missing entrant');
    if(s.creatures.length+s.sessions.length>config.lifecycle.capacity)add('creatures','occupied slots exceed capacity');
    if(s.events.length>config.lifecycle.eventLogLimit)add('events','journal exceeds cap');
    if(s.relationships.length>config.social.maximumRelationships)add('relationships','edge cap exceeded');
    for(const [group,items] of Object.entries(s.inventory))for(const [id,n] of Object.entries(items))if(!Number.isSafeInteger(n)||n<0||n>config.prizes.stackCapacity)add(`inventory.${group}.${id}`,'inventory outside bounds');
    for(const [i,c] of s.creatures.entries()) {
      for(const [need,n] of Object.entries(c.needs??{}))if(n<0||n>100)add(`creatures[${i}].needs.${need}`,'need outside [0,100]');
      for(const skill of Object.keys(c.xp) as (keyof typeof c.xp)[])if(c.xp[skill]<0||c.xp[skill]>xpAtLevel(skillCap(c,skill),skill))add(`creatures[${i}].xp.${skill}`,'skill XP/cap outside range');
      if(s.relationships.filter(r=>r.a===c.organismId||r.b===c.organismId).length>config.social.relationshipsPerCreature)add(`creatures[${i}]`,'relationship degree cap');
    }
    for(const [id,n] of Object.entries(prizeBalances(s)))if(n!==(s.prizeLedger.supplied[id]??0))add(`prizeLedger.${id}`,'prize/escrow conservation mismatch');
  } catch(error) {if(!issues.length)add('$state',error instanceof Error?error.message:'malformed state');}
  return issues;
}
