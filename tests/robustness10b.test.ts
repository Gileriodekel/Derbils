import {preferIndexedDb} from '../src/persistence/store';
import {expect,it} from 'vitest';
import {config,configHash} from '../src/data/config';
import {createHabitat} from '../src/sim/habitat';
import {advanceTicks} from '../src/sim/tick';
import {hashState} from '../src/sim/hash';
import {encodeCheckpoint,decodeCheckpoint} from '../src/persistence/checkpoint';
import {createSaveRepository} from '../src/persistence/repository';
import {inlineCodec} from '../src/persistence/codec';
import type {SaveStore} from '../src/persistence/types';
import {arbitrate,ownsLease} from '../src/app/ownership';
import {guardedAdvance} from '../src/app/runtime';
import {creatureName,namedView} from '../src/app/names';
import {clearSettings,readSettings,resolveReducedMotion,settingsKey,writeSettings} from '../src/app/settings';
import {playerEvents} from '../src/app/events';
import {shouldRefresh} from '../src/app/refresh';

class MemoryStore implements SaveStore {
 data=new Map<string,string>();fail=Infinity;writes=0;quota=false;
 async get(k:string){return this.data.get(k)??null;}
 async set(k:string,v:string){if(this.writes++>=this.fail)throw Object.assign(new Error('injected write failure'),{name:this.quota?'QuotaExceededError':'Error'});this.data.set(k,v);}
 async remove(k:string){this.data.delete(k);}
 async keys(prefix:string){return [...this.data.keys()].filter(k=>k.startsWith(prefix));}
}
const pointer=`${config.persistence.key}.current`;
it('round trips with checksum, rejects corruption/future formats, and warns on different tuning',()=>{
 const state=advanceTicks(createHabitat(91),300),json=encodeCheckpoint(state,1234),data=JSON.parse(json);
 expect(hashState(decodeCheckpoint(json).state)).toBe(hashState(state));expect(data.configHash).toBe(configHash);
 for(const bad of [json.slice(0,-20),JSON.stringify({...data,checksum:'bad'}),JSON.stringify({...data,format:'another'}),JSON.stringify({...data,schemaVersion:99})])expect(()=>decodeCheckpoint(bad)).toThrow();
 const {checksum:_,...body}=data;void _;body.configHash='old-tuning';const changed=JSON.stringify({...body,checksum:hashState(body)});
 expect(decodeCheckpoint(changed).configHash).toBe('old-tuning');
});
it('uses a verified spare, falls back to backups, and preserves every broken payload',async()=>{
 const store=new MemoryStore(),repo=createSaveRepository(store),a=createHabitat(51),b=advanceTicks(a,4);
 expect((await repo.write(a,1)).ok).toBe(true);expect((await repo.write(b,2)).ok).toBe(true);
 const keys=JSON.parse(store.data.get(pointer)!);store.data.set(keys[0],'{truncated');
 const recovered=await repo.load();expect(recovered.recovered).toBe(true);expect(recovered.checkpoint!.state.clock.tick).toBe(0);
 expect([...store.data.keys()].some(k=>k.includes('.quarantine.'))).toBe(true);expect(store.data.get(keys[0])).toBe('{truncated');
 store.data.set(keys[1],'broken backup');const failed=await repo.load();expect(failed.checkpoint).toBeNull();expect(failed.failures).toHaveLength(2);expect(failed.failures.map(f=>f.payload)).toContain('broken backup');
});
it('never loses the valid current revision when writes fail at any commit stage or quota is full',async()=>{
 for(const stage of [0,1])for(const quota of [false,true]){
  const store=new MemoryStore(),repo=createSaveRepository(store),state=createHabitat(1);await repo.write(state,1);
  store.fail=store.writes+stage;store.quota=quota;const result=await repo.write(advanceTicks(state,1),2);
  expect(result.ok).toBe(false);expect(result.quota).toBe(quota);expect((await repo.load()).checkpoint!.state.clock.tick).toBe(0);
 }
});
it('import requires confirmation and retains the previous world as a backup; export/import preserves hash',async()=>{
 const store=new MemoryStore(),repo=createSaveRepository(store),old=createHabitat(3),next=createHabitat(4);await repo.write(old,1);
 const exported=await repo.export(next,2),preview=await repo.inspectImport(exported);expect(preview.population).toBe(next.creatures.length);
 expect((await repo.import(exported,false)).ok).toBe(false);expect((await repo.load()).checkpoint!.state.saveId).toBe(old.saveId);
 expect((await repo.import(exported,true)).ok).toBe(true);expect(hashState((await repo.load()).checkpoint!.state)).toBe(hashState(next));
 const keys=JSON.parse(store.data.get(pointer)!);expect(decodeCheckpoint(store.data.get(keys[1])!).state.saveId).toBe(old.saveId);
 const data=JSON.parse(exported),{checksum:_,...body}=data;void _;body.configHash='different';store.data.set(keys[0],JSON.stringify({...body,checksum:hashState(body)}));
 expect((await repo.load()).warnings.join(' ')).toMatch(/different tuning/i);
});
it('arbitrates exactly one writer and transfers ownership; stale instances cannot write',async()=>{
 const first=arbitrate(null,{id:'a',now:0,duration:10}),second=arbitrate(first,{id:'b',now:1,duration:10});
 expect(second.owner).toBe('a');expect(ownsLease(second,'a',first.epoch,1)).toBe(true);expect(ownsLease(second,'b',first.epoch,1)).toBe(false);
 const takeover=arbitrate(second,{id:'b',now:2,duration:10,takeOver:true});expect(ownsLease(takeover,'a',first.epoch,3)).toBe(false);expect(ownsLease(takeover,'b',takeover.epoch,3)).toBe(true);
 const store=new MemoryStore(),repo=createSaveRepository(store,()=>false);expect((await repo.write(createHabitat(),0)).ok).toBe(false);expect(store.data.size).toBe(0);
});
it('a runtime exception retains the snapshot and exposes seed/tick/commands without touching saves',async()=>{
 const state=createHabitat(123),store=new MemoryStore(),repo=createSaveRepository(store);await repo.write(state,0);const before=[...store.data.entries()];
 const result=guardedAdvance(state,[{kind:'pause'}],()=>{throw new Error('test system failed');});
 expect(result.state).toBe(state);expect(result.failure).toMatchObject({seed:123,tick:0,commands:[{kind:'pause'}]});expect(result.failure!.details).toMatch(/test system failed/);expect([...store.data.entries()]).toEqual(before);
});
it('cosmetic names are deterministic and distinct while the guaranteed founder name is saved',()=>{
 const state=createHabitat(22),before=encodeCheckpoint(state,0),view=namedView(state),loaded=decodeCheckpoint(before).state;
 expect(view.creatures[0].displayName).toBe('Daroboo');expect(view.creatures[1].displayName).toBe(creatureName(22,state.creatures[1].id));expect(creatureName(22,loaded.creatures[0].id)).toBe(creatureName(22,state.creatures[0].id));
 expect(encodeCheckpoint(state,0)).toBe(before);expect(before).toContain('Daroboo');expect(before).not.toContain(view.creatures[1].displayName);
 const names=new Set(Array.from({length:config.names.sampleSize},(_,i)=>creatureName(1,`c_${String(i).padStart(8,'0')}`)));
 expect(names.size/config.names.sampleSize).toBeGreaterThanOrEqual(config.names.distinctFraction);
});
it('settings and worlds have separate keys; reduced-motion resolver honors defaults',()=>{
 const data=new Map<string,string>(),storage={getItem:(k:string)=>data.get(k)??null,setItem:(k:string,v:string)=>{data.set(k,v);},removeItem:(k:string)=>{data.delete(k);}};
 storage.setItem(config.persistence.key,'world');const settings=readSettings(storage);writeSettings(storage,{...settings,highContrast:true});expect(readSettings(storage).highContrast).toBe(true);
 clearSettings(storage);expect(storage.getItem(config.persistence.key)).toBe('world');writeSettings(storage,settings);storage.removeItem(config.persistence.key);expect(storage.getItem(settingsKey)).not.toBeNull();
 expect(resolveReducedMotion(null,true)).toBe(true);expect(resolveReducedMotion(false,true)).toBe(false);expect(resolveReducedMotion(true,false)).toBe(true);
});
it('classifies journal events and caps each player-visible window; refresh skips hidden panels',()=>{
 const state=createHabitat();const base={id:'e_1',tick:1,creatureId:state.creatures[0].id,kind:'hatch' as const,from:null,to:'baby' as const,relatedCreatureId:null};
 const events=Array.from({length:5000},(_,i)=>({...base,id:`e_${i}`,tick:i,kind:i%2?'hatch' as const:'debugStage' as const}));
 const filtered=playerEvents(events,config.presentation);
 expect(filtered.every(e=>e.kind==='hatch')).toBe(true);
 for(let start=0;start<5000;start+=137)expect(filtered.filter(e=>e.tick>=start&&e.tick<start+config.presentation.eventWindowTicks).length).toBeLessThanOrEqual(config.presentation.eventRateCap);
 expect(playerEvents(events,config.presentation,true)).toHaveLength(5000);
 expect(shouldRefresh(0,100,2,true)).toBe(false);expect(shouldRefresh(0,500,2,true)).toBe(true);expect(shouldRefresh(0,10000,2,false)).toBe(false);
});

it('recovers verified slots even when a crash tears the revision pointer',async()=>{
 const store=new MemoryStore(),repo=createSaveRepository(store);await repo.write(createHabitat(8),1);
 store.data.set(pointer,'[torn');const result=await repo.load();expect(result.checkpoint!.state.saveId).toBe('world_8');expect(result.recovered).toBe(true);
});

it('chooses storage using the measured size and configured quota threshold',()=>{
 expect(preferIndexedDb(2_006_423*2,5_242_880,.5)).toBe(true);expect(preferIndexedDb(100,1000,.5)).toBe(false);expect(preferIndexedDb(500,1000,.5)).toBe(false);
});

it('quarantines a rejected import without replacing the current world',async()=>{
 const store=new MemoryStore(),repo=createSaveRepository(store);await repo.write(createHabitat(13),1);const before=store.data.get(pointer);
 await expect(repo.inspectImport('{broken import')).rejects.toThrow();expect(store.data.get(pointer)).toBe(before);
 expect([...store.data.entries()].some(([k,v])=>k.includes('.quarantine.import.')&&v==='{broken import')).toBe(true);
});

it('retains a broken original when quarantine fails, including after later rolling cleanup',async()=>{
 const store=new MemoryStore(),repo=createSaveRepository(store);await repo.write(createHabitat(31),1);
 const old=JSON.parse(store.data.get(pointer)!)[0];store.data.set(old,'broken original');
 const originalSet=store.set.bind(store);store.set=async(k,v)=>{if(k.includes('.quarantine.'))throw new Error('quarantine full');await originalSet(k,v);};
 expect((await repo.load()).checkpoint).toBeNull();store.set=originalSet;
 for(let i=0;i<4;i++)expect((await repo.write(createHabitat(32+i),2+i)).ok).toBe(true);
 expect(store.data.get(old)).toBe('broken original');
});

it('cancels an old encode and its queued autosave before publishing a replacement world',async()=>{
 const store=new MemoryStore();let release!:()=>void,started!:()=>void;
 const gate=new Promise<void>(resolve=>{release=resolve;}),encoding=new Promise<void>(resolve=>{started=resolve;});
 const repo=createSaveRepository(store,()=>true,{...inlineCodec,async encode(state,wall,offline){if(state.saveId==='world_41'){started();await gate;}return inlineCodec.encode(state,wall,offline);}});
 await repo.write(createHabitat(40),0);
 const old=repo.write(createHabitat(41),1);await encoding;
 const queued=repo.write(createHabitat(42),2);repo.invalidateWrites();
 const replacement=repo.write(createHabitat(43),3);release();
 expect((await old).cancelled).toBe(true);expect((await queued).cancelled).toBe(true);expect((await replacement).ok).toBe(true);await repo.idle();
 expect((await repo.load()).checkpoint!.state.saveId).toBe('world_43');
 const keys=JSON.parse(store.data.get(pointer)!);expect(keys.map((key:string)=>decodeCheckpoint(store.data.get(key)!).state.saveId)).toEqual(['world_43','world_40']);
});

it('aborts a pending publication on runtime failure and preserves the last committed autosave',async()=>{
 const store=new MemoryStore(),repo=createSaveRepository(store),state=createHabitat(44);await repo.write(state,0);
 const before=store.data.get(pointer);let started!:()=>void;
 const publishing=new Promise<void>(resolve=>{started=resolve;}),originalSet=store.set.bind(store);
 const cancellable:SaveStore['set']=async(key,value,signal)=>{
  if(key!==pointer)return originalSet(key,value);
  started();await new Promise<void>((_resolve,reject)=>{signal!.addEventListener('abort',()=>reject(signal!.reason),{once:true});});
 };
 store.set=cancellable;const pending=repo.write(advanceTicks(state,10),1);await publishing;
 const result=guardedAdvance(state,[],()=>{throw new Error('injected tick failure');});if(result.failure)repo.invalidateWrites();
 expect((await pending).cancelled).toBe(true);expect(store.data.get(pointer)).toBe(before);expect((await repo.load()).checkpoint!.state.clock.tick).toBe(0);
});
