import type { SaveStore } from './types';
/** Browser adapters only; all recovery/commit rules are in repository.ts. */
export function localSaveStore(storage:Storage):SaveStore {
  return {async get(k){return storage.getItem(k);},async set(k,v,signal){signal?.throwIfAborted();storage.setItem(k,v);},async remove(k){storage.removeItem(k);},async keys(prefix){const keys:string[]=[];for(let i=0;i<storage.length;i++){const k=storage.key(i);if(k?.startsWith(prefix))keys.push(k);}return keys;}};
}
export async function indexedSaveStore(factory:IDBFactory):Promise<SaveStore> {
  const db=await new Promise<IDBDatabase>((resolve,reject)=>{
    const request=factory.open('creature-habitat-checkpoints',1);
    request.onupgradeneeded=()=>{request.result.createObjectStore('saves');};
    request.onerror=()=>reject(request.error);request.onsuccess=()=>resolve(request.result);
    request.onblocked=()=>reject(new Error('Save database upgrade blocked by another tab.'));
  });
  function transaction<T>(mode:IDBTransactionMode,work:(store:IDBObjectStore)=>IDBRequest<T>,signal?:AbortSignal):Promise<T>{
    return new Promise((resolve,reject)=>{
      signal?.throwIfAborted();
      const tx=db.transaction('saves',mode),request=work(tx.objectStore('saves'));
      const abort=()=>{try{tx.abort();}catch{/* already completed */}},cleanup=()=>signal?.removeEventListener('abort',abort);
      signal?.addEventListener('abort',abort,{once:true});
      tx.oncomplete=()=>{cleanup();resolve(request.result);};tx.onerror=tx.onabort=()=>{cleanup();reject(tx.error??request.error??new Error('Save transaction aborted.'));};
    });
  }
  return {async get(k){return (await transaction('readonly',s=>s.get(k)))??null;},async set(k,v,signal){await transaction('readwrite',s=>s.put(v,k),signal);},async remove(k){await transaction('readwrite',s=>s.delete(k));},async keys(prefix){return (await transaction('readonly',s=>s.getAllKeys())).filter((k):k is string=>typeof k==='string'&&k.startsWith(prefix));}};
}

/** Measured bytes and quota are explicit inputs; no browser API is needed to test the policy. */
export function preferIndexedDb(measuredBytes:number,quotaBytes:number,threshold:number):boolean{return measuredBytes>quotaBytes*threshold;}
