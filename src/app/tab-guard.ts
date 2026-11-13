import { config } from '../data/config';
import { arbitrate, ownsLease } from './ownership';
import type { TabLease } from './types';
/** BroadcastChannel owner handshake; storage events provide the same fallback protocol. */
export function createTabGuard(onChange:(active:boolean)=>void) {
  const key=`${config.persistence.key}.owner`,hello=`${key}.hello`,id=typeof crypto.randomUUID==='function'?crypto.randomUUID():Array.from(crypto.getRandomValues(new Uint32Array(4)),n=>n.toString(16).padStart(8,'0')).join('');let epoch=0,active:boolean|null=null,released=false;
  const channel=typeof BroadcastChannel==='undefined'?null:new BroadcastChannel(`${key}.channel`);
  function read():TabLease|null {try{const v=JSON.parse(localStorage.getItem(key)??'null');return v&&typeof v.owner==='string'&&Number.isSafeInteger(v.epoch)&&Number.isFinite(v.expiresAt)?v:null;}catch{return null;}}
  function publish(lease:TabLease){localStorage.setItem(key,JSON.stringify(lease));channel?.postMessage('lease');}
  function check(){
    let current=read();const now=Date.now();
    // A throttled owner may renew only while the authoritative epoch still belongs to it.
    // After takeover, both the owner ID and epoch test fail, so a stale tab cannot revive itself.
    if(!released&&current?.owner===id&&current.epoch===epoch&&current.expiresAt<=now){current=arbitrate(current,{id,now,duration:config.robustness.leaseMs});publish(current);}
    const next=!released&&ownsLease(current,id,epoch,now);if(next!==active){active=next;onChange(active);}return next;
  }
  function claim(takeOver=false){
    released=false;const next=arbitrate(read(),{id,now:Date.now(),duration:config.robustness.leaseMs,takeOver});
    if(next.owner===id){epoch=next.epoch;publish(next);}return check();
  }
  function greet(){const current=read();if(!released&&current?.owner===id&&current.epoch===epoch)claim();else check();}
  channel?.addEventListener('message',event=>{if(event.data==='hello')greet();else check();});
  window.addEventListener('storage',event=>{if(event.key===hello)greet();else if(event.key===key)check();});
  const interval=setInterval(()=>{const current=read();if(!released&&current?.owner===id&&current.epoch===epoch)claim();else check();},config.robustness.heartbeatMs);
  return {
    async start(){released=false;channel?.postMessage('hello');localStorage.setItem(hello,`${id}:${Date.now()}`);await new Promise<void>(resolve=>setTimeout(resolve,config.robustness.helloWaitMs));return claim();},
    release(){released=true;const current=read();if(current?.owner===id&&current.epoch===epoch)publish({...current,expiresAt:0});check();},
    takeOver:()=>claim(true),canWrite:check,dispose(){clearInterval(interval);channel?.close();},
  };
}
