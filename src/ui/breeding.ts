import { breedingDensity, breedingReason, compatibility, hasPair } from '../sim/mates';
import { config } from '../data/config';
import { relationship } from '../sim/social/relationships';
import { familyTie } from '../sim/social/family';
import type { Creature, PlayerCommand, SaveState } from '../sim/types';

export function createBreedingPanel(root: HTMLElement, command: (c:PlayerCommand)=>void) {
  root.innerHTML=`<div class="needs-heading"><h2>Breeding & family</h2><span>GENERATION <b id="generation">0</b></span></div>
    <p id="breeding-state" role="status"></p><p id="breeding-clock" class="skills-note"></p>
    <div class="breeding-flags"><label><input type="checkbox" id="block-individual"> Block breeding</label><label><input type="checkbox" id="encourage-individual"> Encourage breeding</label></div>
    <label>Partner<select id="mate-select" aria-label="Breeding partner"></select></label>
    <div class="pair-controls"><button id="pair">Pair exclusively</button><button id="block-pair">Block pair</button><button id="encourage-pair">Encourage pair</button></div>
    <p class="skills-note">Pair restricts both Derbils to each other and adds encouragement. Adult wellbeing, kinship and willingness still apply. Pairs can lay up to ${config.breeding.clutchEggs} eggs on nearby land, limited by population space.</p>
    <p id="breeding-feedback" role="status"></p>
    <details open><summary>Mate compatibility</summary><p class="skills-note">Affinity and mate bonds · traits · tastes · aptitude difference. Close relatives remain ineligible.</p><ol id="mate-scores" class="mate-scores"></ol></details>
    <details open><summary>Lineage</summary><dl id="family" class="family"></dl></details>
    <details><summary>Breeding tools <span>DEBUG</span></summary><button id="force-breed">Force breed selected pair</button><p class="skills-note">Bypasses eligibility and kinship; keeps the population cap. Logged as a debug event.</p></details>`;
  const el=<T extends HTMLElement>(id:string)=>root.querySelector<T>(`#${id}`)!;
  let current:Creature|null=null,snapshot:SaveState|null=null,identity='';
  const partner=el<HTMLSelectElement>('mate-select'),feedback=el('breeding-feedback');
  function send(kind:PlayerCommand['kind'],enabled=true){
    if(!current||!snapshot)return;
    try{
      if(kind==='blockCreature'||kind==='encourageCreature')command({kind,id:current.organismId,enabled});
      else if(kind==='forceBreed')command({kind,a:current.organismId,b:partner.value});
      else if(kind==='pair'||kind==='blockPair'||kind==='encouragePair')command({kind,a:current.organismId,b:partner.value,enabled});
      feedback.textContent='Command applied.';
    }catch(e){feedback.textContent=e instanceof Error?e.message:'Could not apply command.';}
  }
  el<HTMLInputElement>('block-individual').onchange=e=>send('blockCreature',(e.target as HTMLInputElement).checked);
  el<HTMLInputElement>('encourage-individual').onchange=e=>send('encourageCreature',(e.target as HTMLInputElement).checked);
  for(const [id,kind,key] of [['pair','pair','exclusivePairs'],['block-pair','blockPair','blockedPairs'],['encourage-pair','encouragePair','encouragedPairs']] as const)
    el(id).onclick=()=>send(kind,!hasPair(snapshot!.breedingRules[key],current!.organismId,partner.value));
  el('force-breed').onclick=()=>send('forceBreed');
  partner.onchange=()=>{if(snapshot&&current)update(snapshot,current);};
  function update(state:SaveState,c:Creature){
    snapshot=state;current=c;
    const key=c.id+state.creatures.map(c=>c.id).join();
    if(identity!==key){
      const selected=partner.value;identity=key;
      partner.replaceChildren(...state.creatures.filter(o=>o.id!==c.id).map(o=>new Option(`${o.displayName} · ${o.id.slice(2)} · ${o.stage}`,o.organismId)));
      if([...partner.options].some(o=>o.value===selected))partner.value=selected;
    }
    const session=state.sessions.find(s=>s.participants.includes(c.id));
    const mateId=session?.participants.find(id=>id!==c.id), mate=state.creatures.find(o=>o.id===mateId);
    const unavailable=state.creatures.length+state.sessions.length>=state.settings.capacity?'Population slots are full'
      :breedingDensity(state)===0?'Births paused at the current population/food limit':null;
    el('breeding-state').textContent=session ? `${session.workStartedTick===null?'Meeting on land':'Mating'} with ${mate?.displayName} · ${session.workTicks}/${config.breeding.courtshipWorkTicks}`
      : breedingReason(state,c)??unavailable??'Eligible · seeking a willing mate';
    el('breeding-clock').textContent=`Cooldown: ${Math.max(0,c.breeding.cooldownUntil-state.clock.tick)} ticks · clutches ${c.breeding.clutches}/${config.breeding.maximumClutches}`;
    el<HTMLInputElement>('block-individual').checked=state.breedingRules.blockedIndividuals.includes(c.organismId);
    el<HTMLInputElement>('encourage-individual').checked=state.breedingRules.encouragedIndividuals.includes(c.organismId);
    for(const [id,key,on,off] of [['pair','exclusivePairs','Unpair','Pair exclusively'],['block-pair','blockedPairs','Unblock pair','Block pair'],['encourage-pair','encouragedPairs','Remove encouragement','Encourage pair']] as const){
      const active=hasPair(state.breedingRules[key],c.organismId,partner.value),button=el<HTMLButtonElement>(id);
      button.textContent=active?on:off;button.setAttribute('aria-pressed',String(active));button.disabled=!partner.value;
    }
    el<HTMLButtonElement>('force-breed').disabled=!partner.value||state.creatures.length+state.sessions.length>=state.settings.capacity;
    const matches=state.creatures.filter(o=>o.id!==c.id).map(o=>compatibility(state,c,o)).sort((a,b)=>Number(!!a.reason)-Number(!!b.reason)||b.score-a.score).slice(0,5);
    el('mate-scores').replaceChildren(...matches.map(m=>{
      const row=document.createElement('li'),other=state.creatures.find(o=>o.id===m.creatureId)!;
      row.textContent=`${other.displayName} (${other.id.slice(2)}) · ${m.score.toFixed(3)}${m.encouraged?' ↑':''}\n${m.family==='none'?'no direct family tie':m.family} · relationship ${m.bond.toFixed(1)} · mate ${m.mateBond.toFixed(1)}\ntraits ${m.traitSimilarity.toFixed(2)} · taste ${m.tasteSimilarity.toFixed(2)} · diversity ${m.geneticDifference.toFixed(2)}${m.reason?' · '+m.reason:''}`;return row;
    }));
    const record=state.lineage.find(l=>l.id===c.id)!;el('generation').textContent=String(record.generation);
    const organisms=new Map(state.organisms.map(o=>[o.id,o]));
    const organism=organisms.get(c.organismId)!;
    const relatives=(kind:'Parents'|'Siblings'|'Children')=>state.lineage.filter(l=>{
      if(kind==='Parents')return record.parentIds?.includes(l.id);
      if(kind==='Children')return organisms.get(l.organismId)?.parents.includes(c.organismId);
      const parents=organisms.get(l.organismId)!.parents;
      return l.organismId!==c.organismId&&parents.some(id=>organism.parents.includes(id));
    });
    const family=el('family');family.replaceChildren();
    for(const kind of ['Parents','Siblings','Children'] as const){
      const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=kind;
      const records=relatives(kind);dd.textContent=records.length?records.map(l=>{
        const affinity=relationship(state,c.organismId,l.organismId)?.bond;
        return `${l.displayName} (${l.id.slice(2)})${l.endReason==='rebirth'?' (reborn)':l.deathTick!==null?' †':''} · ${familyTie(state,c.organismId,l.organismId)} · ${affinity===undefined?'no current relationship':`relationship ${affinity.toFixed(1)}`}`;
      }).join('; '):'None';family.append(dt,dd);
    }
  }
  return{update};
}
