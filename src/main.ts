import { backgroundCodec } from './persistence/worker-codec';
import { config } from './data/config';
import { createSaveRepository } from './persistence/repository';
import { indexedSaveStore, localSaveStore, preferIndexedDb } from './persistence/store';
import type { SaveRepository } from './persistence/types';
import { createCatchUp } from './app/catchup';
import { planAdvance } from './app/time';
import { namedView } from './app/names';
import { playerEvents } from './app/events';
import { shouldRefresh } from './app/refresh';
import { createTabGuard } from './app/tab-guard';
import { guardedAdvance } from './app/runtime';
import { advance } from './sim/advance';
import { advanceForeground } from './app/foreground';
import { validateState } from './sim/validate-state';
import { createOfflinePanel } from './ui/offline';
import { createPlayerTools, downloadJson } from './ui/player-tools';
import { bindMapControls } from './ui/map-controls';
import { createScene } from './render/scene';
import { createHabitat } from './sim/habitat';
import { setSpeed } from './sim/runner';
import { spawnCreature, spawnEgg } from './sim/spawn';
import { setDebugSkill } from './sim/skills';
import { setAppearanceGenes } from './sim/appearance/edits';
import { previewOffspring } from './sim/genetics/preview';
import { forceStage } from './sim/debug-lifecycle';
import { applyPlayerCommand } from './sim/commands';
import type { SaveEnvelope, SaveState, Speed } from './sim/types';
import type { RuntimeFailure } from './app/types';
import { createPanel } from './ui/panel';
import './styles.css';

let state=createHabitat(),previous=state,selectedId:string|null=state.creatures[0]?.id??null;
let resumeSpeed:Speed=1,last=Date.now(),lastInspector=-Infinity,lastSave=performance.now(),hiddenAt:number|null=null;
let booted=false,ready=false,active=false,canAutosave=false,catchingUp=false,aging=false,saving=false,changingWorld=false,offlineEnabled=config.offline.enabled;
let failure:RuntimeFailure|null=null,repository:SaveRepository,backendNotice='';
let replayJob:ReturnType<typeof createCatchUp>|null=null;
const commands:unknown[]=[];
const disabledControls=new Set<HTMLInputElement|HTMLButtonElement|HTMLSelectElement|HTMLTextAreaElement>();
const root=document.querySelector<HTMLElement>('#app')!;
const errorMessage=(error:unknown)=>error instanceof Error?error.message:String(error);
function record(command:unknown){commands.push(structuredClone(command));commands.splice(0,Math.max(0,commands.length-config.robustness.commandHistoryLimit));}
function writable(){return ready&&active&&!failure&&!catchingUp&&!aging&&!changingWorld;}
function assertOwner(){if(!active||!guard.canWrite())throw new Error('This tab is read-only. Use Take over to control this world.');}
function edit(command:unknown,change:()=>void){if(!writable())return;assertOwner();settleClock(Date.now());if(catchingUp||failure)return;record(command);change();previous=state;refresh();}
const panel=createPanel(root,{
  speed(speed){changePlayback(speed);},
  pause(){changePlayback(state.clock.speed===0?resumeSpeed:0);},
  save(){void persist();},load(){void restore();},
  select(id){selectedId=state.creatures.some(c=>c.id===id)?id:null;refresh();},
  spawn(){edit({kind:'debugSpawn'},()=>{state=spawnCreature(state);selectedId=state.creatures.at(-1)?.id??null;});},
  skill(skill,level,aptitude){edit({kind:'debugSkill',skill,level,aptitude},()=>{if(selectedId)state=setDebugSkill(state,selectedId,skill,level,aptitude);});},
  appearanceGenes(patch){edit({kind:'debugAppearance',patch},()=>{if(selectedId)state=setAppearanceGenes(state,selectedId,patch);});},
  spawnGenome(genome){edit({kind:'debugGenome',genome},()=>{state=spawnCreature(state,genome);selectedId=state.creatures.at(-1)!.id;});},
  spawnEgg(genome){edit({kind:'debugEgg',genome},()=>{state=spawnEgg(state,genome);selectedId=state.creatures.at(-1)!.id;});},
  forceStage(stage){edit({kind:'debugStage',stage},()=>{if(selectedId)state=forceStage(state,selectedId,stage);});},
  command(command){edit(command,()=>{state=applyPlayerCommand(state,command);});},
  async age(count){
    if(!writable()||!selectedId)return;assertOwner();
    if(!Number.isSafeInteger(count)||count<0||count>Number.MAX_SAFE_INTEGER-state.clock.tick)throw new Error('Use a nonnegative whole tick count.');
    settleClock(Date.now());if(catchingUp||failure)return;record({kind:'debugAge',count});const speed=state.clock.speed;aging=true;
    try{for(let remaining=count;remaining>0&&!failure&&active;){const batch=Math.min(remaining,config.lifecycle.debugAgeBatchTicks);safeAdvance(batch);remaining-=batch;refresh();await new Promise<void>(resolve=>setTimeout(resolve,0));}}
    finally{aging=false;if(!failure)state=setSpeed(state,active?speed:0);last=Date.now();refresh();}
  },preview(a,b,seed){return previewOffspring(state,a,b,seed);},
});
const tools=createPlayerTools(root,{
  export(){exportWorld();},exportCurrent(){downloadJson(JSON.stringify(state,null,2),`derbil-dynasty-state-${state.clock.tick}.json`);},
  restore(){void restore();},
  async takeOver(){if(changingWorld)return;ready=false;guard.takeOver();await restore();},
  async import(payload){
    assertOwner();if(catchingUp||aging)throw new Error('Wait for time advancement to finish.');
    const imported=await repository.inspectImport(payload);
    if(!confirm(`Import ${imported.population} ${imported.population===1?'Derbil':'Derbils'} at tick ${imported.tick}? The current world will be backed up.\n${imported.warnings.join('\n')}`))return;
    await withWorldChange(async()=>{
      assertOwner();const backup=await repository.write(state,last,offlineEnabled);if(!backup.ok)throw new Error(`Current-world backup failed: ${backup.message}`);
      const written=await repository.import(payload,true);if(!written.ok)throw new Error(written.message);
      failure=null;canAutosave=true;ready=true;tools.clearRecovery();tools.warning(imported.warnings.join(' '));
    });
    await applyCheckpoint(imported.checkpoint);
  },
  async newGame(seed,exportFirst){
    assertOwner();if(catchingUp||aging)throw new Error('Wait for time advancement to finish.');
    await withWorldChange(async()=>{
      assertOwner();if(exportFirst)await exportWorld();
      if(ready&&!failure){const backup=await repository.write(state,last,offlineEnabled);if(!backup.ok)throw new Error(backup.message);}
      const next=setSpeed(createHabitat(seed),tools.settings().defaultSpeed);
      const written=await repository.write(next,Date.now(),config.offline.enabled);if(!written.ok)throw new Error(written.message);
      failure=null;canAutosave=active;ready=true;offlineEnabled=config.offline.enabled;tools.clearRecovery();tools.warning('');applyLoaded(active?next:setSpeed(next,0));panel.status(written.message);
    });
  },
});
const guard=createTabGuard(value=>{
  active=value;tools.ownership(value);
  if(!value){repository?.invalidateWrites();replayJob?.cancel();canAutosave=false;state=setSpeed(state,0);previous=state;}
  last=Date.now();refresh();
});
const offlineRoot=document.createElement('div');offlineRoot.id='offline-host';document.body.append(offlineRoot);
const offlinePanel=createOfflinePanel(offlineRoot);
const scene=createScene(panel.canvas);
let mapVisible=true;
new IntersectionObserver(entries=>{mapVisible=entries.some(entry=>entry.isIntersecting);}).observe(panel.canvas);
new ResizeObserver(()=>scene.resize()).observe(panel.canvas);
window.addEventListener('resize',()=>scene.resize());

// Extra short tasks drain accelerated work between paints without a long UI block.
const foregroundChannel=new MessageChannel();let foregroundQueued=false;
foregroundChannel.port1.onmessage=()=>{
  foregroundQueued=false;
  if(document.hidden||!writable()||state.clock.speed===0)return;
  settleClock(Date.now());
};
function queueForeground(){
  if(!foregroundQueued&&!document.hidden&&writable()&&state.clock.speed>0&&state.clock.fractionalSeconds>=config.clock.tickSeconds){
    foregroundQueued=true;foregroundChannel.port2.postMessage(null);
  }
}
let rateAt=performance.now(),rateTick=state.clock.tick,measuredRate=0;
function changePlayback(speed:Speed){
  if(!writable())return;assertOwner();record({kind:'speed',speed});
  state=setSpeed(state,speed);if(speed)resumeSpeed=speed;
  previous=state;last=Date.now();rateAt=performance.now();rateTick=state.clock.tick;measuredRate=0;refresh();
}
function playbackRate(now:number){
  const elapsed=now-rateAt;
  if(elapsed>=config.presentation.rateSampleMs){measuredRate=Math.max(0,(state.clock.tick-rateTick)*1000/elapsed);rateAt=now;rateTick=state.clock.tick;}
  const label=root.querySelector<HTMLElement>('#playback-rate')!;
  label.textContent=state.clock.speed===0?'Paused':`${state.clock.speed}× selected · ${measuredRate.toFixed(measuredRate<10?1:0)} ticks/s`;
}
function syncControls(){
  if(writable()){for(const control of disabledControls)control.disabled=false;disabledControls.clear();}
  else for(const control of root.querySelectorAll<HTMLInputElement|HTMLButtonElement|HTMLSelectElement|HTMLTextAreaElement>('#pause,[data-speed],#save,#spawn-creature,#extinction-rescue,#selected-content button,#selected-content input,#selected-content select,#selected-content textarea,#competitions button,#competitions input,#competitions select')){
    if(!control.disabled){disabledControls.add(control);control.disabled=true;}
  }
  for(const id of ['new-world','recovery-new','import-world','confirm-new','new-seed','new-export']){const control=root.querySelector<HTMLInputElement|HTMLButtonElement>(`#${id}`);if(control)control.disabled=!active||!booted||catchingUp||aging||changingWorld;}
  root.querySelector<HTMLButtonElement>('#cancel-new')!.disabled=changingWorld;
  for(const id of ['load','restore-save','take-over'])root.querySelector<HTMLButtonElement>(`#${id}`)!.disabled=!repository||catchingUp||aging||changingWorld;
}

async function withWorldChange<T>(operation:()=>Promise<T>):Promise<T>{
  if(changingWorld)throw new Error('A world change is already in progress.');
  changingWorld=true;repository.invalidateWrites();refresh();
  try{await repository.idle();return await operation();}
  finally{changingWorld=false;last=Date.now();hiddenAt=document.hidden?last:null;refresh();}
}

function refresh(){
  if(catchingUp||document.hidden)return;
  if(selectedId&&!state.creatures.some(c=>c.id===selectedId)){
    const old=state.lineage.find(l=>l.id===selectedId);selectedId=state.creatures.find(c=>c.organismId===old?.organismId)?.id??state.creatures[0]?.id??null;
  }
  panel.update(state,selectedId);syncControls();playbackRate(performance.now());lastInspector=performance.now();
}
function applyLoaded(loaded:SaveState){
  state=loaded;previous=state;last=Date.now();lastSave=performance.now();resumeSpeed=state.clock.speed||resumeSpeed;
  selectedId=state.creatures[0]?.id??null;rateAt=performance.now();rateTick=state.clock.tick;measuredRate=0;scene.camera.reset();scene.reset();mapControls.update();panel.resetRendering();refresh();
}
function runtimeError(error:RuntimeFailure){
  failure=error;repository?.invalidateWrites();canAutosave=false;state=setSpeed(state,0);previous=state;tools.error(error);panel.status('Paused after a simulation error. Last autosave preserved.',true);refresh();
}
function safeAdvance(count:number){
  const result=guardedAdvance(state,commands,s=>{
    const next=advance(s,s.rng,count);
    if(import.meta.env.DEV&&config.robustness.devValidate&&Math.floor(next.clock.tick/config.robustness.validateEveryTicks)!==Math.floor(s.clock.tick/config.robustness.validateEveryTicks)){
      const issues=validateState(next,config);if(issues.length)throw new Error(JSON.stringify(issues));
    }
    return next;
  });
  previous=state;state=result.state;if(result.failure)runtimeError(result.failure);
}
async function replay(ticks:number,seconds:number,capped:boolean,sourceWall:number,writeSource:boolean,fractionalSeconds:number){
  if(catchingUp||!active||failure)return;catchingUp=true;panel.setReplaying(true);syncControls();
  const source=state;replayJob=createCatchUp({...source,clock:{...source.clock,fractionalSeconds}},ticks,{now:()=>performance.now(),config,realAwaySeconds:seconds,capped});
  offlinePanel.begin(seconds,ticks,capped,()=>replayJob?.cancel());
  try{
    if(writeSource){const result=await repository.write(source,sourceWall,offlineEnabled);if(!result.ok){canAutosave=false;panel.status(`Save failed: ${result.message}. Export your world.`,true);}}
    if(!active){replayJob.cancel();offlinePanel.finish(replayJob.snapshot().summary);return;}
    await new Promise<void>(resolve=>setTimeout(resolve,0));
    const result=await replayJob.run(p=>offlinePanel.progress(p.completed,p.targetTicks));
    state=active?result.state:setSpeed(result.state,0);previous=state;scene.reset();panel.resetRendering();offlinePanel.finish(result.summary);
  }catch(error){runtimeError({seed:Number(state.saveId.slice(6)),tick:state.clock.tick,commands:[...commands],details:errorMessage(error)});}
  finally{replayJob=null;catchingUp=false;panel.setReplaying(false);last=Date.now();lastSave=performance.now();hiddenAt=document.hidden?last:null;refresh();}
  if(canAutosave&&active&&!failure)await persist(false);
}
function settleClock(now:number,hidden=false,writeSource=true){
  if(!ready||!active||failure||catchingUp||aging||changingWorld)return;
  const sourceWall=last,plan=planAdvance(last,now,{speed:state.clock.speed,fractionalSeconds:state.clock.fractionalSeconds,hidden,offlineEnabled},config);
  last=now;
  let completed=0;
  if(plan.realtimeTicks){
    let before=state;
    const result=guardedAdvance(state,commands,s=>{
      const frame=advanceForeground(s,plan.realtimeTicks,config.presentation.foregroundBudgetMs,()=>performance.now());
      completed=frame.completed;before=frame.previous;return frame.state;
    });
    previous=before;state=result.state;if(result.failure)runtimeError(result.failure);
  }
  if(failure)return;
  if(plan.catchUpTicks){
    // Replay owns a durable starting state. Fractional result is applied only after that source has been captured.
    void replay(plan.catchUpTicks,Math.max(0,now-sourceWall)/1000,plan.capped,sourceWall,writeSource,plan.fractionalSeconds);
  }else {
    state={...state,clock:{...state.clock,fractionalSeconds:plan.fractionalSeconds+(plan.realtimeTicks-completed)*config.clock.tickSeconds}};
    queueForeground();
  }
}
async function applyCheckpoint(checkpoint:SaveEnvelope){
  applyLoaded(checkpoint.state);offlineEnabled=checkpoint.offlineEnabled;
  if(!active){state=setSpeed(state,0);previous=state;refresh();return;}
  const now=Date.now();last=checkpoint.savedAtWallClock??now;
  settleClock(now,true,false);if(!catchingUp){last=now;refresh();}
}
async function restore(){
  if(catchingUp||aging||changingWorld)return;
  try{
    const loaded=await withWorldChange(()=>repository.load());tools.warning([backendNotice,...loaded.warnings].filter(Boolean).join(' '));
    if(!loaded.checkpoint){
      if(loaded.failures.length){ready=false;canAutosave=false;state=setSpeed(state,0);tools.recover(loaded.failures.map(f=>f.message).join('\n'),loaded.failures[0].payload);panel.status('No valid saved revision. Broken payload preserved.',true);}
      else {ready=true;canAutosave=active;state=setSpeed(state,tools.settings().defaultSpeed);last=Date.now();panel.status('New habitat · not saved yet');}
      refresh();return;
    }
    failure=null;tools.clearRecovery();ready=true;canAutosave=active;
    if(loaded.failures.length)tools.recover(loaded.warnings.join(' '),loaded.failures[0].payload);
    await applyCheckpoint(loaded.checkpoint);panel.status(loaded.recovered?'Recovered backup':'Loaded saved world');
  }catch(error){ready=false;canAutosave=false;tools.recover(`Storage could not be read: ${errorMessage(error)}`);panel.status('Load failed; saved data was not deleted.',true);}
}
async function persist(settle=true){
  if(!ready||!active||failure||catchingUp||aging||saving||changingWorld)return;
  assertOwner();const anchor=document.hidden&&hiddenAt!==null?hiddenAt:Date.now();
  if(settle&&!document.hidden)settleClock(anchor);if(catchingUp||failure)return;
  saving=true;panel.status('Saving…');
  try{
    const result=await repository.write(state,anchor,offlineEnabled);if(result.cancelled)return;canAutosave=result.ok;lastSave=performance.now();panel.status(result.ok?result.message:`Save failed: ${result.message}`,!result.ok);
    if(!result.ok)tools.warning(result.quota?'Browser storage is full. Your previous save is safe. Use Export world to keep this progress.':`Save failed. Previous save preserved. ${result.message}`);
  }finally{saving=false;}
}
async function exportWorld(){
  if(!repository)return;
  try{downloadJson(await repository.export(state,last,offlineEnabled),`derbil-dynasty-world-${state.clock.tick}.json`);}catch{downloadJson(JSON.stringify(state,null,2),`derbil-dynasty-recovery-${state.clock.tick}.json`);}
}
const mapControls=bindMapControls(panel.canvas,scene.camera,(x,y)=>{selectedId=scene.selectAt(state,x,y);refresh();});
document.addEventListener('keydown',event=>{
  if(event.defaultPrevented||event.repeat||document.querySelector('dialog[open]'))return;
  const target=event.target as HTMLElement;
  if(target.isContentEditable||target.closest('input,textarea,select'))return;
  if(event.code==='Backquote'){event.preventDefault();tools.toggleDebug();refresh();return;}
  if(event.code==='Escape'){selectedId=null;refresh();if(target===panel.canvas)(root.querySelector<HTMLElement>('#creature-roster button')??root.querySelector<HTMLElement>('#world-management>summary'))?.focus();return;}
  if(event.code==='Tab'&&target===panel.canvas){event.preventDefault();const index=state.creatures.findIndex(c=>c.id===selectedId),direction=event.shiftKey?-1:1;selectedId=state.creatures[(index+direction+state.creatures.length)%state.creatures.length]?.id??null;refresh();return;}
  if(!writable()||target.closest('button,summary,a'))return;
  if(event.code==='Space'){event.preventDefault();changePlayback(state.clock.speed===0?resumeSpeed:0);}
  if(/^Digit[1-4]$/.test(event.code)){const speed=config.clock.foregroundSpeeds.filter(s=>s>0)[Number(event.code.slice(-1))-1];if(speed){event.preventDefault();changePlayback(speed);}}
});
document.addEventListener('visibilitychange',()=>{
  if(!ready||!active||failure)return;const now=Date.now();
  if(document.hidden){if(!catchingUp){settleClock(now);hiddenAt=now;if(canAutosave)void persist();}}
  else if(!catchingUp){last=hiddenAt??last;settleClock(now,true);hiddenAt=null;}
});
window.addEventListener('pagehide',()=>{if(canAutosave&&!catchingUp)void persist();guard.release();});
window.addEventListener('pageshow',event=>{if(event.persisted)void guard.start().then(()=>restore());});
function frame(now:number){
  try{
    if(!document.hidden&&!catchingUp){
      if(active&&ready&&!failure)settleClock(Date.now());
      if(!catchingUp){
        if(mapVisible)scene.draw(namedView(state),namedView(previous),state.clock.speed===0?1:(state.clock.fractionalSeconds%config.clock.tickSeconds)/config.clock.tickSeconds,selectedId,panel.reducedMotion(),panel.socialOverlays(),tools.settings().actionBubbles);
        if(shouldRefresh(lastInspector,now,config.presentation.playerRefreshHz,true)){refresh();lastInspector=now;const event=playerEvents(state.events,config.presentation).at(-1);if(event)tools.announce(event.id,`${event.kind.replace(/([A-Z])/g,' $1')} at tick ${event.tick}`,now);}
        if(canAutosave&&active&&!failure&&now-lastSave>=config.offline.autosaveIntervalSeconds*1000)void persist();
      }
    }
  }catch(error){if(!failure)runtimeError({seed:Number(state.saveId.slice(6)),tick:state.clock.tick,commands:[...commands],details:errorMessage(error)});}
  requestAnimationFrame(frame);
}
async function boot(){
  try{
    // 10a measured 2,006,423 UTF-8 bytes, about 4,012,846 localStorage UTF-16 bytes (> half 5 MiB).
    // Rolling revisions exceed that budget. IndexedDB is the authoritative backend when available.
    let store;
    const measuredUtf16Bytes=config.robustness.measuredCheckpointUtf8Bytes*Uint16Array.BYTES_PER_ELEMENT;
    if(preferIndexedDb(measuredUtf16Bytes,config.robustness.storageQuotaBytes,config.robustness.indexedDbThreshold)){
      try{store=await indexedSaveStore(indexedDB);const legacy=localStorage.getItem(config.persistence.key);if(legacy&&!await store.get(config.persistence.key))await store.set(config.persistence.key,legacy);}
      catch{store=localSaveStore(localStorage);backendNotice='IndexedDB is unavailable. Using browser localStorage; export regularly if space is limited.';tools.warning(backendNotice);}
    }else store=localSaveStore(localStorage);
    repository=createSaveRepository(store,()=>active&&(!failure||changingWorld)&&guard.canWrite(),backgroundCodec());await guard.start();await restore();booted=true;document.body.dataset.ready="true";refresh();
  }catch(error){tools.recover(errorMessage(error));panel.status('Could not initialize saves. Saved data preserved.',true);}
}
refresh();requestAnimationFrame(frame);void boot();
