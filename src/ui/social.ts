import { lonelinessBreedingFactor, relationshipLabel, socialCounts } from '../sim/dynasty/social';
import { config } from '../data/config';
import { familyTie } from '../sim/social/family';
import { relationship, relationshipStrength } from '../sim/social/relationships';
import type { Creature, PlayerCommand, SaveState } from '../sim/types';

export function createSocialPanel(root: HTMLElement, command: (c: PlayerCommand)=>void, select: (id: string)=>void) {
  root.style.setProperty('--affinity-positive',config.social.overlays.friendly);root.style.setProperty('--affinity-negative',config.social.overlays.hostile);
  root.innerHTML=`<div class="needs-heading"><h2>Relationships</h2><span>INDIVIDUAL CONNECTIONS</span></div>
    <p id="social-state" class="skills-note"></p><ol class="relationship-list" id="relationships"></ol>
    <details class="social-debug"><summary>Set relationship <span>DEBUG</span></summary>
      <form id="affinity-form"><label>Other Derbil<select id="affinity-partner" required></select></label>
      <label>Relationship<input id="affinity-value" type="number" min="${config.social.bondBounds[0]}" max="${config.social.bondBounds[1]}" step="any" value="50" required></label>
      <button type="submit">Set relationship</button></form><p id="affinity-status" class="skills-note" role="status"></p></details>`;
  const list=root.querySelector<HTMLOListElement>('#relationships')!,partner=root.querySelector<HTMLSelectElement>('#affinity-partner')!;
  let current:Creature|null=null,identity='';
  root.querySelector('form')!.addEventListener('submit',event=>{
    event.preventDefault();if(!current||!partner.value)return;
    const status=root.querySelector('#affinity-status')!;
    try{command({kind:'setAffinity',a:current.organismId,b:partner.value,value:root.querySelector<HTMLInputElement>('#affinity-value')!.valueAsNumber});status.textContent='DEBUG relationship applied and logged.';}
    catch(error){status.textContent=error instanceof Error?error.message:'Could not set relationship.';}
  });
  return {update(state:SaveState,c:Creature){
    current=c;const key=c.id+state.creatures.map(c=>c.id).join();
    if(key!==identity){identity=key;const chosen=partner.value;partner.replaceChildren(...state.creatures.filter(b=>b.id!==c.id).map(b=>new Option(`${b.displayName} · #${Number(b.id.slice(2))}`,b.organismId)));
      if([...partner.options].some(p=>p.value===chosen))partner.value=chosen;}
    root.querySelector<HTMLButtonElement>('button[type=submit]')!.disabled=!partner.value;
    const edges=state.relationships.filter(r=>r.a===c.organismId||r.b===c.organismId).map(r=>relationship(state,r.a,r.b)!)
      .sort((a,b)=>relationshipStrength(b)-relationshipStrength(a)||a.a.localeCompare(b.a)||a.b.localeCompare(b.b));
    root.querySelector('#social-state')!.textContent=c.social.mourning?`Remembering ${state.lineage.find(l=>l.organismId===c.social.mourning!.organismId)?.displayName??'a friend'} · ${c.social.mourning.untilTick-state.clock.tick} ticks`
      :`${socialCounts(state,c).friends} friends · ${socialCounts(state,c).foes} foes · loneliness ${(c.needs?.loneliness??0).toFixed(1)} / 100 · breeding willingness ×${lonelinessBreedingFactor(c).toFixed(2)}`;
    const focused=(document.activeElement as HTMLElement|null)?.dataset.socialCreatureId;
    list.replaceChildren(...edges.map(r=>{
      const other=state.creatures.find(b=>b.organismId===(r.a===c.organismId?r.b:r.a))!,row=document.createElement('li');
      const button=document.createElement('button');button.dataset.socialCreatureId=other.id;button.textContent=`${other.displayName} · #${Number(other.id.slice(2))}`;button.onclick=()=>select(other.id);
      const labels=[familyTie(state,c.organismId,other.organismId),relationshipLabel(r.bond),r.mateBond>=config.social.mateBondThreshold?'Mate bond':''].filter(v=>v&&v!=='none');
      const caption=document.createElement('small');caption.textContent=labels.join(' · ');
      row.dataset.organismId=other.organismId;
      const meter=document.createElement('div');meter.className='relationship-spectrum';meter.setAttribute('role','meter');meter.setAttribute('aria-valuemin','-100');meter.setAttribute('aria-valuemax','100');meter.setAttribute('aria-valuenow',String(r.bond));meter.setAttribute('aria-label',`Relationship with ${other.displayName}: ${relationshipLabel(r.bond)}`);
      const foeEnd=(config.dynasty.relationships.foeThreshold+100)/2, friendStart=(config.dynasty.relationships.friendThreshold+100)/2;
      meter.style.background=`linear-gradient(to right, ${config.dynasty.relationships.foeColor} 0% ${foeEnd}%, #e8e5d8 ${foeEnd}% ${friendStart}%, ${config.dynasty.relationships.friendColor} ${friendStart}% 100%)`;
      meter.setAttribute('aria-valuetext',`${relationshipLabel(r.bond)} (${r.bond.toFixed(1)})`);
      for(const score of [config.dynasty.relationships.foeThreshold,config.dynasty.relationships.friendThreshold]){const mark=document.createElement('i');mark.className='spectrum-threshold';mark.style.left=`${(score+100)/2}%`;meter.append(mark);}
      const pointer=document.createElement('b');pointer.className='spectrum-pointer';pointer.textContent='▼';pointer.style.left=`${(r.bond+100)/2}%`;meter.append(pointer);
      const key=document.createElement('div');key.className='spectrum-labels';key.innerHTML='<span>Foe</span><span>Neutral</span><span>Friend</span>';
      const values=document.createElement('p');values.textContent=`Relationship ${r.bond.toFixed(1)} · mate ${r.mateBond.toFixed(1)}`;
      const history=document.createElement('p');history.className='relationship-history';history.textContent=r.history.length?r.history.slice().reverse().map(h=>`${h.kind}${h.outcome==='neutral'?'':` (${h.outcome})`} · tick ${h.tick}`).join(' / '):'Family head start · no completed interaction yet';
      row.append(button,caption,meter,key,values,history);return row;
    }));
    if(!edges.length){const row=document.createElement('li');row.textContent='Connections grow through shared time.';list.append(row);}
    if(focused)list.querySelector<HTMLButtonElement>(`[data-social-creature-id="${focused}"]`)?.focus({preventScroll:true});
  }};
}
