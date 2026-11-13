import { config } from '../data/config';
import { clearSettings, readSettings, resolveReducedMotion, writeSettings } from '../app/settings';
import type { RuntimeFailure } from '../app/types';
import type { Speed } from '../sim/types';

interface Actions {
  export():void; import(payload:string):Promise<void>; newGame(seed:number,exportFirst:boolean):Promise<void>;
  takeOver():Promise<void>; restore():void; exportCurrent():void;
}
export function downloadJson(payload:string,name:string):void {
  const url=URL.createObjectURL(new Blob([payload],{type:'application/json'})),a=document.createElement('a');
  a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),0);
}
export function createPlayerTools(root:HTMLElement,actions:Actions) {
  const tools=document.createElement('section');tools.className='player-tools';tools.setAttribute('aria-label','World controls and help');
  tools.innerHTML=`<div class="world-actions"><button id="debug-toggle" aria-pressed="false">Debug tools <kbd>\u0060</kbd></button><button id="export-world">Export world</button><label class="import-label">Import world<input id="import-world" type="file" accept=".json,application/json"></label><button id="new-world">New game</button></div>
  <p id="tuning-warning" class="notice" hidden></p><section id="recovery-panel" class="notice" aria-label="Save recovery" hidden><h2>Saved world needs attention</h2><p id="recovery-message"></p><button id="download-broken">Download broken save</button><button id="recovery-new">New game…</button></section>
  <section id="ownership-panel" class="notice" hidden><p>Another tab owns this world. This tab is read-only and paused.</p><button id="take-over">Take over</button></section>
  <section id="runtime-error" class="notice" role="alert" hidden><h2>Simulation paused after an error</h2><p>The last autosave is untouched. Export details before restoring if you want to report this.</p><pre id="error-details" tabindex="0"></pre><button id="copy-error">Copy details</button><button id="restore-save">Restore last save</button><button id="export-current">Export current state</button></section>
  <div id="first-hints" class="hints" aria-label="Getting started"></div>
  <details id="help-panel"><summary>Help & legend</summary><p>Watch them live: Derbils feed, rest, practice, form bonds and raise eggs on their own. Click a Derbil, or use the Derbil list, to inspect its life. Scroll over the map to zoom toward your pointer; drag to pan. Fit map restores the whole habitat. At fast speeds, map lighting stays steady while the simulation continues its day/night cycle. Hide action bubbles below the map to clear the view.</p><p>Genes set potential and independent body, feet, eye and tail colors. Running grows feet, Swimming grows a tail fin, Flight grows wings, and Strength grows arms. Stamina sustains fast movement. Stat berries grant XP; highlights share each part’s color family.</p><p>Relationships grow from shared activities. Pair encourages willing adults; Block prevents breeding. Family restrictions still apply. New mate bonds have time to grow, and friendly contact keeps them strong. Pairs meet on nearby land and lay eggs there; no nest is needed. The rescue-eggs option below the map introduces unrelated eggs before a population runs short of future adults or eligible mates; turn it off for an unassisted world. Open Breeding & family on a Derbil’s card to manage these choices and see lineage.</p><p>At 1×, a day lasts 60 seconds. A full life lasts 30 days (30 minutes), from egg to the end of elderhood; reincarnation starts another life. Founders arrive at different ages, so their first remaining lifespan is shorter.</p><p>The Derbil Derby runs every 15 completed days; the Derbil Cup every 30. On shared dates the Derby runs first. The Cup fruit guarantees reincarnation at the winner’s next life expiry. You can also create optional venue competitions.</p><p>Legend: — friend · - - foe · ═ mate · → parent to child · × breeding blocked. Relationships use one score split equally into Foe, Neutral and Friend. Neutral relationships have no friend/foe line on the web; family and mate lines are separate. Friends share berries; foes steal and wager food in fights. Need bars are deficits: lower is better; skill bars show progress toward the next level. Content / neutral / unhappy describes mood, not health or mortality.</p><p>Keyboard: Space pause; 1–4 speeds; Escape deselects and leaves habitat cycling; Tab on the habitat cycles Derbils; Tab elsewhere moves through controls; backtick toggles debug tools.</p></details>
  <details id="settings-panel"><summary>Settings</summary><div class="settings-fields"><label>Starting speed<select id="default-speed">${config.clock.foregroundSpeeds.filter(s=>s>0).map(s=>`<option value="${s}">${s}×</option>`).join('')}</select></label><label>Text size<select id="text-size">${config.presentation.textSizes.map(s=>`<option value="${s}">${s}px</option>`).join('')}</select></label><label><input id="high-contrast" type="checkbox"> High contrast</label><button id="clear-settings">Reset settings & hints</button></div><p>Settings are stored separately from the world. Resetting these never deletes saves.</p></details>
  <dialog id="new-game-dialog"><form id="new-game-form"><h2>Start a new habitat?</h2><p>Your current saved world remains a rolling backup. You can export it first.</p><label>Seed (optional)<input id="new-seed" inputmode="numeric" type="number" min="1" max="4294967295" step="1" placeholder="${config.initial.seed}"></label><label><input id="new-export" type="checkbox" checked> Export current world first</label><p id="new-game-error" role="alert"></p><div><button type="button" id="cancel-new">Keep this world</button><button type="submit" id="confirm-new">Start new game</button></div></form></dialog>
  <div class="sr-only" id="event-announcement" aria-live="polite" aria-atomic="true"></div>`;
  root.querySelector('main .intro')!.after(tools);
  const management=document.createElement('details'),managementLabel=document.createElement('summary');
  management.id='world-management';managementLabel.textContent='World, settings & help';management.append(managementLabel);
  for(const selector of ['.world-actions','#help-panel','#settings-panel'])management.append(tools.querySelector(selector)!);
  tools.append(management);
  const el=<T extends HTMLElement=HTMLElement>(id:string)=>tools.querySelector<T>(`#${id}`)!;
  let settings=readSettings(localStorage),debug=false,broken='',lastAnnouncement=-Infinity,lastEvent='';
  const motion=root.querySelector<HTMLInputElement>('#reduced-motion')!,overlays=root.querySelector<HTMLInputElement>('#hide-social')!;
  const bubbles=root.querySelector<HTMLInputElement>('#hide-actions')!;
  const fields=el('settings-panel').querySelector('.settings-fields')!;
  fields.prepend(motion.closest('label')!,overlays.closest('label')!);
  function apply(){
    document.documentElement.style.fontSize=`${settings.textSize}px`;document.body.classList.toggle('high-contrast',settings.highContrast);
    motion.checked=resolveReducedMotion(settings.reducedMotion,matchMedia('(prefers-reduced-motion: reduce)').matches);overlays.checked=!settings.socialOverlays;bubbles.checked=!settings.actionBubbles;
    el<HTMLSelectElement>('default-speed').value=String(settings.defaultSpeed);el<HTMLSelectElement>('text-size').value=String(settings.textSize);el<HTMLInputElement>('high-contrast').checked=settings.highContrast;
    const hints=[['watch','Watch them live. Food and rest take care of themselves.'],['select','Click a Derbil, or choose one from the keyboard-accessible list.'],['compete','Try a competition: optional prizes come from your inventory.'],['pair','Open Breeding & family to encourage a willing pair or block breeding.']];
    el('first-hints').replaceChildren(...hints.filter(([id])=>!settings.dismissedHints.includes(id)).slice(0,1).map(([id,text])=>{
      const row=document.createElement('p'),label=document.createElement('span'),button=document.createElement('button');label.textContent=text;button.textContent='Dismiss';button.setAttribute('aria-label',`Dismiss hint: ${text}`);
      button.onclick=()=>{settings={...settings,dismissedHints:[...settings.dismissedHints,id]};save();apply();};row.append(label,button);return row;
    }));
  }
  function save(){try{writeSettings(localStorage,settings);}catch{showWarning('Settings could not be stored in this browser.');}}
  function showWarning(text:string){el('tuning-warning').textContent=text;el('tuning-warning').hidden=!text;}
  motion.onchange=()=>{settings={...settings,reducedMotion:motion.checked};save();};overlays.onchange=()=>{settings={...settings,socialOverlays:!overlays.checked};save();};
  bubbles.onchange=()=>{settings={...settings,actionBubbles:!bubbles.checked};save();};
  el<HTMLSelectElement>('default-speed').onchange=e=>{settings={...settings,defaultSpeed:Number((e.target as HTMLSelectElement).value) as Speed};save();};
  el<HTMLSelectElement>('text-size').onchange=e=>{settings={...settings,textSize:Number((e.target as HTMLSelectElement).value)};save();apply();};
  el<HTMLInputElement>('high-contrast').onchange=e=>{settings={...settings,highContrast:(e.target as HTMLInputElement).checked};save();apply();};
  el('clear-settings').onclick=()=>{clearSettings(localStorage);settings=readSettings(localStorage);apply();};
  el('export-world').onclick=actions.export;el('restore-save').onclick=actions.restore;el('export-current').onclick=actions.exportCurrent;
  el('take-over').onclick=()=>{void actions.takeOver().catch(error=>showWarning(String(error)));};
  el<HTMLInputElement>('import-world').onchange=async event=>{
    const input=event.target as HTMLInputElement,file=input.files?.[0];if(!file)return;
    try{if(file.size>config.robustness.importMaximumBytes)throw new Error('File exceeds import size limit.');await actions.import(await file.text());}catch(error){showWarning(`Import failed: ${error instanceof Error?error.message:String(error)}`);}finally{input.value='';}
  };
  function openNew(){el('new-game-error').textContent='';el<HTMLDialogElement>('new-game-dialog').showModal();}
  el('new-world').onclick=openNew;el('recovery-new').onclick=openNew;el('cancel-new').onclick=()=>el<HTMLDialogElement>('new-game-dialog').close();
  el<HTMLDialogElement>('new-game-dialog').oncancel=event=>{if(el<HTMLButtonElement>('cancel-new').disabled)event.preventDefault();};
  el('new-game-form').onsubmit=async event=>{
    event.preventDefault();const seed=el<HTMLInputElement>('new-seed').valueAsNumber||config.initial.seed;
    try{await actions.newGame(seed,el<HTMLInputElement>('new-export').checked);el<HTMLDialogElement>('new-game-dialog').close();}catch(error){el('new-game-error').textContent=error instanceof Error?error.message:String(error);}
  };
  function toggleDebug(){debug=!debug;document.body.classList.toggle('debug-mode',debug);el('debug-toggle').setAttribute('aria-pressed',String(debug));document.dispatchEvent(new Event('debugmodechange'));}
  el('debug-toggle').onclick=toggleDebug;
  el('download-broken').onclick=()=>downloadJson(broken,'derbil-dynasty-broken-save.json');
  el('copy-error').onclick=()=>{void navigator.clipboard?.writeText(el('error-details').textContent??'').catch(()=>showWarning('Select the error details and copy them manually.'));};
  apply();
  return {toggleDebug,debug:()=>debug,settings:()=>settings,warning:showWarning,
    ownership(active:boolean){el('ownership-panel').hidden=active;},
    recover(message:string,payload=''){el('recovery-panel').hidden=false;el('recovery-message').textContent=message;broken=payload;el('download-broken').hidden=!payload;},
    clearRecovery(){el('recovery-panel').hidden=true;el('runtime-error').hidden=true;},
    error(failure:RuntimeFailure){el('runtime-error').hidden=false;el('error-details').textContent=JSON.stringify(failure,null,2);},
    announce(id:string,text:string,now:number){if(id!==lastEvent&&now-lastAnnouncement>=config.presentation.ariaLiveIntervalMs){lastEvent=id;lastAnnouncement=now;el('event-announcement').textContent=text;}},
  };
}
