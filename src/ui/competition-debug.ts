import { config, skillKeys } from '../data/config';
import type { CompetitionFormat, PlayerCommand, SaveState, Skill } from '../sim/types';
export function createCompetitionDebugPanel(root:HTMLElement,command:(command:PlayerCommand)=>void){
  const s=config.competitions;
  root.innerHTML=`<details class="debug-details" open><summary>Competitions <span>DEBUG · 9a</span></summary><div class="debug-content">
    <form id="debug-competition-form" class="competition-form">
      <label>Format<select id="debug-competition-format">${s.formats.map(f=>`<option value="${f.id}">${f.name}</option>`).join('')}</select></label>
      <label>Skill / first leg<select id="debug-competition-skill">${skillKeys.map(k=>`<option value="${k}">${config.skillCatalog[k].name}</option>`).join('')}</select></label>
      <div id="debug-competition-circuit"><label>Second leg<select id="debug-competition-leg2">${skillKeys.map(k=>`<option ${k==='swim'?'selected':''}>${k}</option>`).join('')}</select></label><label>Third leg<select id="debug-competition-leg3">${skillKeys.map(k=>`<option ${k==='stamina'?'selected':''}>${k}</option>`).join('')}</select></label></div>
      <label>Minimum level<input id="debug-competition-min" type="number" min="0" max="100" value="0" required></label>
      <label>Maximum level<input id="debug-competition-max" type="number" min="0" max="100" value="100" required></label>
      <label>Start in ticks<input id="debug-competition-delay" type="number" min="${s.minimumStartDelay}" max="${s.maximumStartDelay}" value="${s.defaultStartDelay}" required></label>
      <label>Entrant limit<input id="debug-competition-limit" type="number" min="${s.minimumEntrants}" max="${s.maximumEntrants}" value="${s.maximumEntrants}" required></label>
      <label><input id="debug-competition-adults" type="checkbox"> Adults only</label>
      <label><input id="debug-competition-unrelated" type="checkbox"> Unrelated entrants only</label>
      <button type="submit">Create competition</button>
    </form><p id="debug-competition-status" role="status"></p>
    <div id="debug-competition-list"></div>
    <label>Results<select id="debug-competition-history" aria-label="Select competition results"><option value="">No results yet</option></select></label>
    <div id="debug-competition-results" aria-live="polite"></div>
    </div></details>`;
  const el=<T extends HTMLElement>(id:string)=>root.querySelector<T>(`#${id}`)!;
  const format=el<HTMLSelectElement>('debug-competition-format'),skill=el<HTMLSelectElement>('debug-competition-skill');
  const syncFormat=()=>{el('debug-competition-circuit').hidden=format.value!=='circuit';const allowed=s.formats.find(f=>f.id===format.value)!.skills;
    for(const option of skill.options)option.disabled=!allowed.includes(option.value as Skill);if(!allowed.includes(skill.value as Skill))skill.value=allowed[0];};
  format.onchange=syncFormat;syncFormat();let latest:SaveState|undefined,identity='',history:SaveState['competitionHistory']|undefined;
  const showResults=()=>{
    const e=latest?.competitionHistory.find(e=>e.id===el<HTMLSelectElement>('debug-competition-history').value);const target=el('debug-competition-results');target.replaceChildren();if(!e)return;
    const caption=document.createElement('p');caption.textContent=`${e.format} · ${e.skills.map(skill=>config.skillCatalog[skill].name).join(' → ')} · ${e.status}${e.cancellationReason?` · ${e.cancellationReason}`:''}`;target.append(caption);
    const name=(id:string)=>`${latest!.lineage.find(l=>l.id===id)?.displayName??id} #${Number(id.slice(2))}`;
    const ranking=document.createElement('ol');ranking.className='competition-ranking';
    for(const row of e.results?.placements??[]){const li=document.createElement('li');li.textContent=`${name(row.id)} · ${row.score.toFixed(3)}`;ranking.append(li);}target.append(ranking);
    if(e.results&&e.results.rounds.length>1)for(const [i,round] of e.results.rounds.entries()){const p=document.createElement('p');p.textContent=`${e.format==='circuit'?'Leg':'Attempt'} ${i+1} (${config.skillCatalog[round.skill].name}): ${round.ranking.map(r=>`${name(r.id)} ${r.score.toFixed(2)}`).join(' · ')}`;target.append(p);}
    for(const drop of e.drops){const p=document.createElement('p');p.textContent=`Dropped: ${name(drop.id)} · ${drop.reason}`;target.append(p);}
  };
  el<HTMLSelectElement>('debug-competition-history').onchange=showResults;
  el('debug-competition-form').onsubmit=event=>{event.preventDefault();const read=(id:string)=>el<HTMLInputElement>(id).valueAsNumber;
    const selected=skill.value as Skill,skills=format.value==='circuit'?[selected,el<HTMLSelectElement>('debug-competition-leg2').value as Skill,el<HTMLSelectElement>('debug-competition-leg3').value as Skill]:[selected];
    try{command({kind:'createCompetition',skill:selected,format:format.value as CompetitionFormat,skills,startDelay:read('debug-competition-delay'),entryRules:{...s.entry,
      allowedStages:el<HTMLInputElement>('debug-competition-adults').checked?['adult']:[...s.entry.allowedStages],maximumEntrants:read('debug-competition-limit'),relatedEntrantsAllowed:!el<HTMLInputElement>('debug-competition-unrelated').checked,
      levels:Object.fromEntries(skills.map(k=>[k,{minimum:read('debug-competition-min'),maximum:read('debug-competition-max')}]))}});el('debug-competition-status').textContent='Competition created. Derbils choose whether to enter.';}
    catch(error){el('debug-competition-status').textContent=error instanceof Error?error.message:'Could not create competition.';}
  };
  return {update(state:SaveState){latest=state;const list=el('debug-competition-list');
    // Rebuild only on a meaningful event change, preserving keyboard focus while ticks advance.
    const key=JSON.stringify([state.competitions.map(e=>[e.id,e.status,e.entrantIds,e.drops.length]),state.competitionHistory.map(e=>[e.id,e.status])]);if(key===identity&&history===state.competitionHistory)return;identity=key;history=state.competitionHistory;
    const focus=(document.activeElement as HTMLElement)?.dataset.cancelCompetition;list.replaceChildren();
    for(const e of state.competitions){const row=document.createElement('div');row.className='debug-competition-row';const text=document.createElement('p');text.textContent=`${e.id} · ${e.format} (${e.skills.map(skill=>config.skillCatalog[skill].name).join('/')}) · ${e.status} · starts ${e.startTick} · ${e.entrantIds.length}/${e.entryRules.maximumEntrants} entrants: ${e.entrantIds.map(id=>state.creatures.find(c=>c.id===id)?.displayName??id).join(', ')}`;
      const button=document.createElement('button');button.textContent='Cancel';button.dataset.cancelCompetition=e.id;button.onclick=()=>{try{command({kind:'cancelCompetition',id:e.id,debug:true});el('debug-competition-status').textContent='Cancelled.';}catch(error){el('debug-competition-status').textContent=String(error);}};row.append(text,button);list.append(row);}
    if(focus)list.querySelector<HTMLButtonElement>(`button[data-cancel-competition="${focus}"]`)?.focus();
    const select=el<HTMLSelectElement>('debug-competition-history'),previous=select.value;select.replaceChildren(...state.competitionHistory.slice().reverse().map(e=>new Option(`${e.id} · ${e.format} · ${e.status}`,e.id)));
    if(state.competitionHistory.some(e=>e.id===previous))select.value=previous;showResults();
  }};
}
