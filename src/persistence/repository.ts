import type { SaveState } from '../sim/types';
import { config, configHash } from '../data/config';
import { hashState } from '../sim/hash';
import { inlineCodec } from './codec';
import type { SaveCodec, SaveRepository, SaveStore, WriteResult } from './types';

export function createSaveRepository(store:SaveStore,canWrite=()=>true,codec:SaveCodec=inlineCodec):SaveRepository {
  const base=config.persistence.key,pointer=`${base}.current`;
  let sequence=0,writeGeneration=0,queue:Promise<unknown>=Promise.resolve();
  const activeWrites=new Set<AbortController>();
  const cancelled=():WriteResult=>({ok:false,message:'Save superseded by a world change or recovery.',quota:false,cancelled:true});
  const message=(error:unknown)=>error instanceof Error?error.message:String(error);
  const warnings=(hash:string,state:SaveState)=>hash!==configHash?['This save was made with different tuning.', ...(state.dynasty.calendarChangedAtTick!==null?['Upgraded to 60-second days and 30-day lives. Existing life-stage progress and history were preserved; the day counter now uses the shorter calendar.']:[])]:[];
  async function slots():Promise<string[]>{
    const raw=await store.get(pointer);if(raw===null)return [];
    const ids=JSON.parse(raw);if(!Array.isArray(ids)||ids.some(s=>typeof s!=='string'||!s.startsWith(`${base}.slot.`)))throw new Error('Corrupt save revision pointer.');
    return [...new Set(ids)] as string[];
  }
  async function writeRaw(payload:string,generation:number,signal:AbortSignal):Promise<WriteResult>{
    const current=()=>generation===writeGeneration&&!signal.aborted;
    try {
      if(!current())return cancelled();
      if(!canWrite())throw new Error('This tab is read-only. Take over before saving.');
      const snapshot=await codec.decode(payload);
      let old:string[];try{old=await slots();}catch{old=[];}
      // Immutable spare keys prevent a stale writer from overwriting the current world's bytes.
      const issued=await store.keys(`${base}.slot.`),revision=Math.max(0,...issued.map(k=>Number(k.split('.slot.')[1].split('.')[0])||0))+1;
      const key=`${base}.slot.${revision}.${sequence++}.${snapshot.checksum}`;
      if(!current())return cancelled();
      if(!canWrite())throw new Error('Another tab took over before the save committed.');
      await store.set(key,payload,signal);
      const readback=await store.get(key);if(readback!==payload)throw new Error('Save read-back differs from the write.');await codec.decode(readback);
      if(!current())return cancelled();
      if(!canWrite())throw new Error('Another tab took over before the save committed.');
      const next=[key,...old.filter(k=>k!==key)].slice(0,config.robustness.backups+1);
      await store.set(pointer,JSON.stringify(next),signal); // Atomic publication after verified durable spare.
      // Removing stale revisions is optional housekeeping, never part of successful publication.
      for(const stale of old.filter(k=>!next.includes(k)))try{
        if(!current()||!canWrite())break;
        const prior=await store.get(stale);if(prior===null)continue;
        try{await codec.decode(prior);}catch{continue;} // Never discard a broken original, even if its quarantine copy failed.
        if(current()&&canWrite())await store.remove(stale);
      }catch{/* retained safely */}
      return {ok:true,message:`Saved at tick ${snapshot.state.clock.tick.toLocaleString()}`,quota:false};
    }catch(error){if(!current())return cancelled();return {ok:false,message:message(error),quota:!!error&&typeof error==='object'&&'name'in error&&error.name==='QuotaExceededError'};}
  }
  function enqueue(payload:()=>string|Promise<string>):Promise<WriteResult> {
    const generation=writeGeneration;
    const job=queue.then(async()=>{
      if(generation!==writeGeneration)return cancelled();
      const controller=new AbortController();activeWrites.add(controller);
      try{return await writeRaw(await payload(),generation,controller.signal);}catch(error){return generation!==writeGeneration?cancelled():{ok:false,message:message(error),quota:false};}
      finally{activeWrites.delete(controller);}
    });
    queue=job;return job;
  }
  const repository:SaveRepository={
    invalidateWrites(){writeGeneration++;for(const controller of activeWrites)controller.abort();},
    async idle(){await queue;},
    async load(){
      const failures:{key:string;payload:string;message:string}[]=[],notes:string[]=[];
      let keys:string[]=[],scanned=false;
      try{keys=await slots();}catch(error){const raw=await store.get(pointer);if(raw!==null)failures.push({key:pointer,payload:raw,message:message(error)});}
      // A torn/missing pointer must not make already durable slots unreachable.
      if(keys.length===0){const found=await store.keys(`${base}.slot.`);scanned=found.length>0;if(scanned)notes.push('Recovered durable slots after a missing or corrupt revision pointer.');keys.push(...found.sort((a,b)=>Number(b.split('.slot.')[1].split('.')[0])-Number(a.split('.slot.')[1].split('.')[0])));}
      if(!keys.includes(base))keys.push(base); // Historical root is never deleted during migration/recovery.
      for(const key of keys){
        const payload=await store.get(key);if(payload===null)continue;
        try {
          const checkpoint=await codec.decode(payload);
          if(failures.length)notes.push('Recovered the most recent valid backup. Broken payloads were preserved.');
          return {checkpoint,warnings:[...notes,...warnings(checkpoint.configHash,checkpoint.state)],failures,recovered:failures.length>0||scanned};
        }catch(error){
          const failure={key,payload,message:message(error)};failures.push(failure);
          // Quarantine is a copy; even quota failure cannot delete the original payload.
          if(canWrite())try{await store.set(`${base}.quarantine.${hashState(payload)}`,payload);}catch{notes.push('Quarantine could not be copied; original broken data is still preserved.');}
        }
      }
      return {checkpoint:null,warnings:notes,failures,recovered:false};
    },
    write(state,wall,offline=true){return enqueue(()=>codec.encode(state,wall,offline));},
    async inspectImport(payload){
      if(new TextEncoder().encode(payload).length>config.robustness.importMaximumBytes)throw new Error('Import exceeds the configured size limit.');
      try{const checkpoint=await codec.decode(payload);return {checkpoint,population:checkpoint.state.creatures.length,tick:checkpoint.state.clock.tick,warnings:warnings(checkpoint.configHash,checkpoint.state)};}
      catch(error){
        if(canWrite())try{const prefix=`${base}.quarantine.import.`,issued=await store.keys(prefix),generation=Math.max(0,...issued.map(k=>Number(k.slice(prefix.length))||0))+1;await store.set(`${prefix}${generation}`,payload);}catch{/* The user's original file is untouched even if storage is full. */}
        throw error;
      }
    },
    import(payload,confirmed){
      if(!confirmed)return Promise.resolve({ok:false,message:'Import confirmation required; current save untouched.',quota:false});
      return enqueue(async()=>{const {checkpoint}=await repository.inspectImport(payload);return codec.encode(checkpoint.state,checkpoint.savedAtWallClock??0,checkpoint.offlineEnabled);});
    },
    export(state,wall,offline=true){return codec.encode(state,wall,offline);},
  };
  return repository;
}
