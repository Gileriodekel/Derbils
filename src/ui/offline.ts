import { config } from '../data/config';
import type { SummaryAccumulator } from '../sim/types';

function duration(seconds:number):string {
  if(!Number.isFinite(seconds))return 'unknown';
  const whole=Math.max(0,Math.floor(seconds));
  const hours=Math.floor(whole/3600),minutes=Math.floor(whole%3600/60);
  return hours?`${hours}h ${minutes}m`:minutes?`${minutes}m ${whole%60}s`:`${whole}s`;
}
/** Separate from the simulation panels so the skip control remains usable while they are blocked. */
export function createOfflinePanel(root:HTMLElement) {
  root.innerHTML=`<section id="catchup-overlay" class="catchup-overlay" aria-label="Advancing the habitat" hidden>
    <strong>The habitat is catching up</strong><p id="catchup-times"></p>
    <progress id="catchup-progress" max="1" value="0" aria-label="Catch-up progress"></progress>
    <span id="catchup-count" role="status" aria-live="polite"></span><button id="catchup-skip" type="button">Skip remaining time</button>
    </section><section id="away-summary" class="away-summary" aria-labelledby="away-title" hidden>
    <div class="summary-heading"><h2 id="away-title">While you were away</h2><button id="away-dismiss" type="button">Dismiss</button></div>
    <p id="away-times"></p><dl id="away-counts"></dl><ol id="away-notable"></ol></section>`;
  const overlay=root.querySelector<HTMLElement>('#catchup-overlay')!,summary=root.querySelector<HTMLElement>('#away-summary')!;
  const progress=root.querySelector<HTMLProgressElement>('#catchup-progress')!;
  let cancel=()=>{};
  root.querySelector('#catchup-skip')!.addEventListener('click',()=>cancel());
  root.querySelector('#away-dismiss')!.addEventListener('click',()=>{summary.hidden=true;});
  return {
    begin(realSeconds:number,ticks:number,capped:boolean,onCancel:()=>void){
      cancel=onCancel;summary.hidden=true;overlay.hidden=false;progress.value=0;
      root.querySelector('#catchup-times')!.textContent=`Away ${duration(realSeconds)} · simulating ${duration(ticks*config.clock.tickSeconds)}${capped?' · capped; excess discarded':''}`;
      root.querySelector('#catchup-count')!.textContent=`0 / ${ticks.toLocaleString()} ticks`;
      (root.querySelector('#catchup-skip') as HTMLButtonElement).focus();
    },
    progress(completed:number,target:number){progress.value=target?completed/target:1;root.querySelector('#catchup-count')!.textContent=`${completed.toLocaleString()} / ${target.toLocaleString()} ticks`;},
    finish(value:SummaryAccumulator){
      overlay.hidden=true;summary.hidden=false;
      (root.querySelector('#away-dismiss') as HTMLButtonElement).focus();
      root.querySelector('#away-times')!.textContent=`Away ${duration(value.realAwaySeconds)} · advanced ${duration((value.endTick-value.startTick)*config.clock.tickSeconds)}${value.capped?' · capped; excess discarded':''}${value.skipped?' · remaining time skipped':''}`;
      const counts: [string,number][]=[['Births (eggs laid)',value.births],['Hatchings',value.hatchings],
        ...Object.entries(value.deaths).map(([stage,n])=>[`Deaths · ${stage}`,n] as [string,number]),['Rebirths',value.rebirths],['Arrivals',value.arrivals],
        ['Generations passed',value.generationsPassed],['Competitions held',value.competitionsHeld],['Competitions resolved',value.competitionsResolved],
        ['Competitions cancelled',value.competitionsCancelled],['Prize awards',value.prizesAwarded],['New friendships',value.friendships],['New rivalries',value.rivalries],
        ['Mate bonds formed',value.mateBonds],['Body parts earned',value.bodyParts],['Skill milestones',value.skillMilestones],['Population rescue eggs',value.rescueEggs]];
      root.querySelector('#away-counts')!.replaceChildren(...counts.flatMap(([name,n])=>{
        const term=document.createElement('dt'),count=document.createElement('dd');term.textContent=name;count.textContent=n.toLocaleString();return [term,count];
      }));
      root.querySelector('#away-notable')!.replaceChildren(...value.notable.map(e=>{const row=document.createElement('li');row.textContent=`Tick ${e.tick.toLocaleString()} · ${e.name}: ${e.detail}`;return row;}));
    },
  };
}
