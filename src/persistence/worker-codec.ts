import { inlineCodec } from './codec';
import type { CodecRequest, CodecResponse, SaveCodec } from './types';
import type { SaveEnvelope } from '../sim/types';
/** Host-only codec worker; it neither advances the world nor writes browser storage. */
export function backgroundCodec():SaveCodec {
  if(typeof Worker==='undefined')return inlineCodec;
  let worker:Worker;try{worker=new Worker(new URL('./codec-worker.ts',import.meta.url),{type:'module'});}catch{return inlineCodec;}
  let next=0,failed=false;
  const pending=new Map<number,{resolve:(value:string|SaveEnvelope)=>void;reject:(error:Error)=>void;fallback:()=>Promise<string|SaveEnvelope>}>();
  worker.onmessage=({data}:{data:CodecResponse})=>{const job=pending.get(data.id);if(!job)return;pending.delete(data.id);if(data.ok)job.resolve(data.value);else job.reject(new Error(data.message));};
  worker.onerror=event=>{
    event.preventDefault();failed=true;worker.terminate();
    for(const job of pending.values())void job.fallback().then(job.resolve,job.reject);pending.clear();
  };
  function call(message:CodecRequest,fallback:()=>Promise<string|SaveEnvelope>):Promise<string|SaveEnvelope>{
    if(failed)return fallback();
    return new Promise((resolve,reject)=>{pending.set(message.id,{resolve,reject,fallback});try{worker.postMessage(message);}catch(error){pending.delete(message.id);reject(error);}});
  }
  return {async encode(state,wall,offline){return await call({id:next++,kind:'encode',state,wall,offline},()=>inlineCodec.encode(state,wall,offline)) as string;},
    async decode(payload){return await call({id:next++,kind:'decode',payload},()=>inlineCodec.decode(payload)) as SaveEnvelope;}};
}
