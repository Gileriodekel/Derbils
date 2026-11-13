import { config } from '../data/config';
import type { Creature, PlayerCommand, SaveState } from '../sim/types';
export function createTrophyShelf(root:HTMLElement,command:(c:PlayerCommand)=>void){
  root.innerHTML='<div class="needs-heading"><h2>Trophy shelf</h2><span>ACQUIRED</span></div><p class="skills-note" id="confidence-note"></p><label>Equipped cosmetic<select id="equipped-cosmetic"></select></label><p id="cosmetic-status" role="status"></p><ol id="trophy-list"></ol>';
  const select=root.querySelector<HTMLSelectElement>('select')!;let current:Creature|undefined,key='';
  select.onchange=()=>{if(!current)return;try{command({kind:'equipCosmetic',id:current.organismId,cosmetic:(select.value||null) as Creature['awards']['equipped']});root.querySelector('#cosmetic-status')!.textContent='Cosmetic changed.';}catch(err){root.querySelector('#cosmetic-status')!.textContent=String(err);}};
  return {update(s:SaveState,c:Creature){current=c;root.querySelector('#confidence-note')!.textContent=c.awards.confidenceUntilTick>s.clock.tick?`Confidence +${config.prizes.confidenceBonus*100}% until tick ${c.awards.confidenceUntilTick} · refreshes, never stacks`:'No active confidence boost';
    const identity=JSON.stringify([c.id,c.awards.owned,c.awards.equipped,c.awards.trophies]);if(identity===key)return;key=identity;
    select.replaceChildren(new Option('None',''),...c.awards.owned.map(id=>new Option(id.replaceAll('_',' '),id)));select.value=c.awards.equipped??'';
    root.querySelector('#trophy-list')!.replaceChildren(...c.awards.trophies.slice().reverse().map(t=>{const li=document.createElement('li');li.textContent=`${t.placement===1?'Winner':`Place ${t.placement}`} · ${t.skills.map(skill=>config.skillCatalog[skill].name).join(' / ')} · ${t.competitionId} · tick ${t.tick}`;return li;}));
  }};
}
