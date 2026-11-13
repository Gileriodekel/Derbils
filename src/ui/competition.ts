import { config, skillKeys } from '../data/config';
import { competitionPreview } from '../sim/competition/preview';
import { prizeGroup } from '../sim/competition/inventory';
import { createCompetitionDebugPanel } from './competition-debug';
import type { CompetitionFormat, ItemKind, PlayerCommand, Prize, PrizeSpec, SaveState, Skill } from '../sim/types';

const prizeChoices:Prize[]=[...Object.entries(config.fruit).filter(([,f])=>f.rare).flatMap(([id])=>[{kind:'fruit',id,quantity:1},{kind:'seed',id,quantity:1}] as Prize[]),
  ...Object.entries(config.fruit).filter(([,f])=>!f.rare).map(([id])=>({kind:'seed',id,quantity:1} as Prize)),
  ...Object.keys(config.items).map(id=>({kind:'item',id:id as ItemKind,quantity:1} as const)),
  ...Object.keys(config.prizes.starter.cosmetics).map(id=>({kind:'cosmetic',id,quantity:1} as Prize))];
const label=(p:Prize)=>`${p.id.replaceAll('_',' ')} ${p.kind==='seed'?'seed':p.kind==='cosmetic'?'token':p.kind==='item'?'item token':'fruit'}`;
export function createCompetitionPanel(root:HTMLElement,command:(command:PlayerCommand)=>void,select:(id:string)=>void){
  root.innerHTML=`<details class="management-panel" open><summary>Competitions <span>GATHER · COMPETE · CELEBRATE</span></summary>
    <section class="dynasty-schedule"><h3>Derbil Derby &amp; Derbil Cup</h3><p id="dynasty-next"></p><p id="dynasty-champion"></p><ol id="dynasty-results"></ol></section><p>Choose the occasion. Derbils decide whether to join.</p>
    <details class="inventory-panel" open><summary>Player inventory</summary><p id="prize-supply-note"></p><div id="prize-inventory"></div></details>
    <form id="competition-form" class="competition-form" novalidate>
      <label>Format<select id="competition-format">${config.competitions.formats.map(f=>`<option value="${f.id}">${f.name}</option>`).join('')}</select></label>
      <label>Skill / first leg<select id="competition-skill">${skillKeys.map(k=>`<option value="${k}">${config.skillCatalog[k].name}</option>`).join('')}</select></label>
      <div id="competition-circuit"><label>Second leg<select id="competition-leg2">${skillKeys.map(k=>`<option value="${k}" ${k==='swim'?'selected':''}>${config.skillCatalog[k].name}</option>`).join('')}</select></label><label>Third leg<select id="competition-leg3">${skillKeys.map(k=>`<option value="${k}" ${k==='stamina'?'selected':''}>${config.skillCatalog[k].name}</option>`).join('')}</select></label></div>
      <label>Minimum level<input id="competition-min" type="number" min="0" max="100" value="0"></label><label>Maximum level<input id="competition-max" type="number" min="0" max="100" value="100"></label>
      <label>Start in ticks<input id="competition-delay" type="number" min="${config.competitions.minimumStartDelay}" max="${config.competitions.maximumStartDelay}" value="${config.competitions.defaultStartDelay}"></label>
      <label>Entrant limit<input id="competition-limit" type="number" min="${config.competitions.minimumEntrants}" max="${config.competitions.maximumEntrants}" value="${config.competitions.entry.maximumEntrants}"></label>
      <fieldset><legend>Life stages</legend>${config.competitions.entry.allowedStages.map(stage=>`<label><input data-entry-stage="${stage}" type="checkbox" checked>${stage}</label>`).join('')}</fieldset>
      <label><input id="competition-unrelated" type="checkbox"> Unrelated entrants only</label>
      <fieldset class="rank-prizes"><legend>Prizes · held from inventory when confirmed</legend>${Array.from({length:config.prizes.maximumRankedPrizes},(_,i)=>i+1).map(rank=>`<div class="rank-prize"><label>Place ${rank}<select data-prize-rank="${rank}"><option value="">No prize</option>${prizeChoices.map((p,i)=>`<option value="${i}">${label(p)}</option>`).join('')}</select></label><label>Quantity<input data-prize-quantity="${rank}" type="number" min="1" max="${config.prizes.maximumFruitPerPrize}" value="1"></label></div>`).join('')}</fieldset>
      <div id="competition-preview" role="status"></div><ul id="competition-validation" role="alert"></ul>
      <button id="competition-confirm" type="submit">Confirm competition &amp; hold prizes</button>
    </form><p id="competition-status" role="status"></p>
    <details><summary>Eligibility right now</summary><ul id="competition-eligibility"></ul></details>
    <h3>Upcoming &amp; active</h3><div id="competition-list"></div>
    <label>Recent competitions<select id="competition-history"><option>No results yet</option></select></label><div id="competition-results"></div>
  </details><label class="rescue-toggle"><input id="competition-debug-toggle" type="checkbox"> Show competition debug tools</label><div id="competition-debug" hidden></div>`;
  const el=<T extends HTMLElement>(id:string)=>root.querySelector<T>(`#${id}`)!;
  const debug=createCompetitionDebugPanel(el('competition-debug'),command);el<HTMLInputElement>('competition-debug-toggle').onchange=e=>{el('competition-debug').hidden=!(e.target as HTMLInputElement).checked;};
  let latest:SaveState|undefined,lastEvents='',lastHistory:SaveState['competitionHistory']|undefined;
  const readCommand=():Extract<PlayerCommand,{kind:'createCompetition'}>=>{
    const selected=el<HTMLSelectElement>('competition-skill').value as Skill,format=el<HTMLSelectElement>('competition-format').value as CompetitionFormat;
    const skills=format==='circuit'?[selected,el<HTMLSelectElement>('competition-leg2').value as Skill,el<HTMLSelectElement>('competition-leg3').value as Skill]:[selected];
    const placements:PrizeSpec['placements']=[];
    for(const choice of root.querySelectorAll<HTMLSelectElement>('[data-prize-rank]'))if(choice.value!==''){
      const rank=Number(choice.dataset.prizeRank),p=prizeChoices[Number(choice.value)],quantity=root.querySelector<HTMLInputElement>(`[data-prize-quantity="${rank}"]`)!.valueAsNumber;
      placements.push({...p,rank,quantity});
    }
    return {kind:'createCompetition',skill:selected,format,skills,startDelay:el<HTMLInputElement>('competition-delay').valueAsNumber,entryRules:{...config.competitions.entry,
      allowedStages:[...root.querySelectorAll<HTMLInputElement>('[data-entry-stage]:checked')].map(i=>i.dataset.entryStage as 'adult'),
      maximumEntrants:el<HTMLInputElement>('competition-limit').valueAsNumber,relatedEntrantsAllowed:!el<HTMLInputElement>('competition-unrelated').checked,
      levels:Object.fromEntries(skills.map(k=>[k,{minimum:el<HTMLInputElement>('competition-min').valueAsNumber,maximum:el<HTMLInputElement>('competition-max').valueAsNumber}]))},prize:placements.length?{placements}:null};
  };
  function preview(){if(!latest)return;const p=competitionPreview(latest,readCommand());
    el('competition-preview').textContent=`${p.eligible} living ${p.eligible===1?'Derbil meets':'Derbils meet'} these stage, need and skill rules now; minimum ${p.minimum}.${p.belowMinimum?' Warning: too few eligible entrants; an underfilled event will refund every prize.':''} Needs ≤${config.competitions.entry.needMaximum}, stress ≤${config.competitions.entry.stressMaximum}, mood ≥${config.competitions.entry.minimumMood}. Entry is voluntary; busy Derbils must finish their activity.`;
    el('competition-validation').replaceChildren(...p.messages.map(m=>{const li=document.createElement('li');li.textContent=m;return li;}));el<HTMLButtonElement>('competition-confirm').disabled=p.messages.length>0;
    el('competition-eligibility').replaceChildren(...p.rows.map(r=>{const li=document.createElement('li');li.textContent=`${latest!.creatures.find(c=>c.id===r.id)!.displayName} #${Number(r.id.slice(2))}: ${r.reason??(r.busy?'meets rules · currently busy':'eligible')}`;return li;}));
  }
  function formatChanged(){const format=el<HTMLSelectElement>('competition-format').value,allowed=config.competitions.formats.find(f=>f.id===format)!.skills,skill=el<HTMLSelectElement>('competition-skill');
    el('competition-circuit').hidden=format!=='circuit';for(const o of skill.options)o.disabled=!allowed.includes(o.value as Skill);if(!allowed.includes(skill.value as Skill))skill.value=allowed[0];preview();}
  el<HTMLSelectElement>('competition-format').onchange=formatChanged;formatChanged();
  el('competition-form').addEventListener('input',preview);
  for(const choice of root.querySelectorAll<HTMLSelectElement>('[data-prize-rank]'))choice.onchange=()=>{const p=prizeChoices[Number(choice.value)],q=root.querySelector<HTMLInputElement>(`[data-prize-quantity="${choice.dataset.prizeRank}"]`)!;q.max=String(p?.kind==='fruit'?config.prizes.maximumFruitPerPrize:1);if(p?.kind!=='fruit')q.value='1';preview();};
  el('competition-form').onsubmit=e=>{e.preventDefault();if(!latest)return;try{const cmd=readCommand(),p=competitionPreview(latest,cmd);if(p.messages.length)throw new Error(p.messages[0]);command(cmd);el('competition-status').textContent='Competition scheduled. Prizes held; cancelling before start refunds them.';}catch(err){el('competition-status').textContent=err instanceof Error?err.message:String(err);}};
  function results(){const s=latest,e=s?.competitionHistory.find(e=>e.id===el<HTMLSelectElement>('competition-history').value),target=el('competition-results');target.replaceChildren();if(!s||!e)return;
    const caption=document.createElement('p');caption.textContent=`${e.format} · ${e.skills.map(k=>config.skillCatalog[k].name).join(' → ')} · ${e.status}${e.cancellationReason?` · ${e.cancellationReason} · prizes refunded`:''}`;target.append(caption);
    const archiveInfo=document.createElement('p');archiveInfo.setAttribute('role','status');
    const ranking=document.createElement('ol');ranking.className='competition-ranking';
    for(const row of e.results?.placements??[]){const li=document.createElement('li'),button=document.createElement('button'),c=s.creatures.find(c=>c.id===row.id),record=s.lineage.find(l=>l.id===row.id);
      button.textContent=`${row.rank<=3?['♜','✧','✦'][row.rank-1]+' ':''}${record?.displayName??row.id} #${Number(row.id.slice(2))}`;button.onclick=()=>{if(c)select(row.id);else archiveInfo.textContent=`${record?.displayName??row.id} · archived life ${row.id} · ended at tick ${record?.deathTick??'unknown'} · ${record?.awards.wins??0} wins · cosmetics: ${record?.awards.owned.join(', ')||'none'} · best skill: ${record?.topSkill?`${config.skillCatalog[record.topSkill.skill].name} ${record.topSkill.level}`:'unrecorded'}`;el('competition-status').textContent=c?'Selected Derbil.':'Opened archived life record.';};
      const text=document.createElement('span'),d=e.deliveries.find(d=>d.rank===row.rank);text.textContent=` ${row.score.toFixed(3)} · level ${row.level.toFixed(1)}${row.rank===1?` · confidence +${config.prizes.confidenceBonus*100}% for ${config.prizes.confidenceDays} day(s)`:''}${d?` · ${d.prize.quantity} ${label(d.prize)} → ${d.destination}${d.reason?` (${d.reason})`:''}`:' · no prize'}`;li.append(button,text);ranking.append(li);}
    target.append(ranking,archiveInfo);
    for(const [i,round] of (e.results?.rounds??[]).entries()){if(e.results!.rounds.length===1)break;const p=document.createElement('p');p.textContent=`${e.format==='circuit'?'Leg':'Attempt'} ${i+1} (${config.skillCatalog[round.skill].name}): ${round.ranking.map(r=>`${s.lineage.find(l=>l.id===r.id)?.displayName??r.id} ${r.score.toFixed(2)}`).join(' · ')}`;target.append(p);}
    for(const d of e.deliveries.filter(d=>!d.creatureId)){const p=document.createElement('p');p.textContent=`Place ${d.rank}: ${label(d.prize)} returned · ${d.reason}`;target.append(p);}
    for(const d of e.drops){const p=document.createElement('p');p.textContent=`${s.lineage.find(l=>l.id===d.id)?.displayName??d.id} withdrew · ${d.reason}`;target.append(p);}
  }
  el<HTMLSelectElement>('competition-history').onchange=results;
  return {update(s:SaveState,visible=true){latest=s;if(visible)preview();
    el('dynasty-next').textContent=`Next Derby: day ${s.dynasty.nextDerbyDay} · ${config.dynasty.competitions.berryPrize} berries. Next Cup: day ${s.dynasty.nextCupDay} · guaranteed reincarnation fruit. Shared dates run Derby, then Cup.`;
    const champion=s.creatures.find(c=>c.organismId===s.dynasty.championOrganismId);
    el('dynasty-champion').textContent=champion?`Current champion: ${champion.displayName} · +${config.dynasty.competitions.championAttraction.toFixed(2)} mate attraction; normal eligibility still applies.`:'No living current champion.';
    el('dynasty-results').replaceChildren(...s.dynasty.events.slice(-8).reverse().map(e=>{const li=document.createElement('li');const winner=s.lineage.find(c=>c.id===e.winnerId);li.textContent=`Day ${e.day}${s.dynasty.calendarChangedAtTick!==null&&e.tick<=s.dynasty.calendarChangedAtTick?' (previous calendar)':''} · ${e.kind==='derby'?'Derbil Derby':'Derbil Cup'} · ${e.winnerId?`${winner?.displayName??e.winnerId} won · ${e.kind==='cup'?'Reincarnation fruit':config.dynasty.competitions.berryPrize+' berries'} awarded`:'Not enough eligible entrants'}`;return li;}));
if(visible&&document.body.classList.contains('debug-mode')&&!el('competition-debug').hidden)debug.update(s);
    el('prize-supply-note').textContent=`Daily welcome cache: ${config.prizes.cache.fruitQuantity} rare fruit, a rare seed and a cosmetic token. Next at tick ${(s.world.lastCacheDay+1)*config.clock.dayTicks}. Seed/item awards are donated back to this storage.`;
    el('prize-inventory').textContent=Object.entries(s.inventory).map(([g,v])=>`${g}: ${Object.entries(v).filter(([,n])=>n>0).map(([id,n])=>`${id.replaceAll('_',' ')} ×${n}`).join(' · ')||'empty'}`).join('\n');
    if(visible)for(const choice of root.querySelectorAll<HTMLSelectElement>('[data-prize-rank]'))for(const o of choice.options)if(o.value!==''){const p=prizeChoices[Number(o.value)];o.textContent=`${label(p)} · ${s.inventory[prizeGroup(p.kind)][p.id]} available`;}
    const key=JSON.stringify(s.competitions.map(e=>[e.id,e.status,e.entrantIds]));
    if(lastEvents!==key){lastEvents=key;const list=el('competition-list'),focused=(document.activeElement as HTMLElement)?.dataset.cancelCompetition;list.replaceChildren();
      for(const e of s.competitions){const row=document.createElement('div'),p=document.createElement('p');p.textContent=`${e.id} · ${e.format} (${e.skills.map(k=>config.skillCatalog[k].name).join('/')}) · ${e.status} · starts ${e.startTick} · ${e.entrantIds.length}/${e.entryRules.maximumEntrants} entrants · ${e.prize?.placements.map(p=>`#${p.rank} ${p.quantity} ${p.id}`).join(', ')||'no prizes'}`;
        row.append(p);if(e.status!=='running'){const b=document.createElement('button');b.textContent=`Cancel · refund ${e.prize?.placements.reduce((n,p)=>n+p.quantity,0)??0} held prizes`;b.dataset.cancelCompetition=e.id;b.onclick=()=>{try{command({kind:'cancelCompetition',id:e.id});el('competition-status').textContent='Cancelled. Every held prize refunded to inventory.';}catch(err){el('competition-status').textContent=String(err);}};row.append(b);}else{const notice=document.createElement('p');notice.textContent='Results committed · awards at tick '+e.endTick;row.append(notice);}list.append(row);}
      if(!s.competitions.length)list.textContent='The venue is available.';if(focused)list.querySelector<HTMLButtonElement>(`[data-cancel-competition="${focused}"]`)?.focus();
    }
    if(lastHistory!==s.competitionHistory){lastHistory=s.competitionHistory;const select=el<HTMLSelectElement>('competition-history'),previous=select.value;select.replaceChildren(...s.competitionHistory.slice().reverse().map(e=>new Option(`${e.id} · ${e.format} · ${e.status}`,e.id)));if(s.competitionHistory.some(e=>e.id===previous))select.value=previous;results();}
  }};
}
