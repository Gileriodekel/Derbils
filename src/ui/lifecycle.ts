import { config, lifeStages } from '../data/config';
import { lifePath, lifespan, stageProgress } from '../sim/life-stages';
import type { Creature, LifeStage, SaveState } from '../sim/types';

interface Handlers { age: (ticks: number) => Promise<void>; forceStage: (stage: LifeStage) => void }

export function createLifecyclePanel(root: HTMLElement, handlers: Handlers) {
  root.innerHTML = `<div class="needs-heading"><h2>A life in progress</h2><span id="life-stage"></span></div>
    <p id="life-age" class="skills-note"></p><progress id="stage-progress" max="1" value="0" aria-label="Stage progress"></progress><p id="stage-remaining" class="skills-note"></p>
    <details class="life-debug"><summary>Lifecycle tools <span>DEBUG</span></summary>
      <p class="skills-note">Aging advances the whole habitat through normal ticks. Force stage resets its stage timer; younger caps clamp XP.</p>
      <form id="age-form"><label>Age selected by N ticks<input id="age-ticks" type="number" min="0" step="1" required value="${config.lifecycle.debugAgeTicks}"></label><button id="age-selected" type="submit">Advance age</button></form>
      <form id="force-stage-form"><label>Force stage<select id="force-stage"></select></label><button id="force-stage-button" type="submit">Force stage</button></form>
      <p id="lifecycle-status" class="skills-note" role="status"></p></details>`;
  const element = <T extends HTMLElement>(id: string) => root.querySelector<T>(`#${id}`)!;
  const ageButton = element<HTMLButtonElement>('age-selected'), select = element<HTMLSelectElement>('force-stage');
  const status = element('lifecycle-status'); let busy = false, identity = '';
  element('age-form').addEventListener('submit', async event => {
    event.preventDefault(); if (busy) return;
    busy = true; ageButton.disabled = true; status.textContent = 'Advancing normal habitat ticks…';
    try { await handlers.age(element<HTMLInputElement>('age-ticks').valueAsNumber); status.textContent = 'Aging complete.'; }
    catch (err) { status.textContent = err instanceof Error ? err.message : 'Could not advance age.'; }
    finally { busy = false; ageButton.disabled = false; }
  });
  element('force-stage-form').addEventListener('submit', event => {
    event.preventDefault();
    try { handlers.forceStage(select.value as LifeStage); status.textContent = 'Stage forced.'; }
    catch (err) { status.textContent = err instanceof Error ? err.message : 'Could not force stage.'; }
  });
  return { update(_state: SaveState, c: Creature) {
    element('life-stage').textContent = c.stage.toUpperCase();
    element('life-age').textContent = `Age ${(c.age/config.clock.dayTicks).toFixed(1)} / ${lifespan(c.lifeIndex)/config.clock.dayTicks} days (${c.age.toLocaleString()} ticks) · Reincarnation count: ${c.lifeIndex}`;
    element<HTMLProgressElement>('stage-progress').value = stageProgress(c);
    const left = config.lifecycle.stages[c.stage].durationTicks * (1 - stageProgress(c));
    element('stage-remaining').textContent = `${Math.round(left).toLocaleString()} ticks until ${c.stage === 'elder' ? 'life ends' : 'the next stage'}${c.dynasty.reincarnationFruit?` · Reincarnation fruit ×${c.dynasty.reincarnationFruit}: next reincarnation guaranteed`:''}`;
    const key = `${c.id}:${c.lifeIndex}`;
    if (identity !== key) { identity = key; select.replaceChildren(...lifePath(c.lifeIndex).map(s => new Option(s,s))); select.value = c.stage; }
  } };
}

export function createLifeLog(root: HTMLElement) {
  root.innerHTML = `<div class="needs-heading"><h2>Habitat journal</h2><span>RECENT LIFE EVENTS</span></div><ol id="life-events"></ol>`;
  const list = root.querySelector('ol')!; let previous: SaveState['events'] = [], previousLineage: SaveState['lineage'] | undefined;
  return { update(state: SaveState) {
    const events=state.events.slice(-config.lifecycle.visibleEventLimit).reverse();
    if (state.lineage===previousLineage && events.length===previous.length && events.every((event,i)=>event===previous[i])) return;
    previous=events;previousLineage=state.lineage;
    list.replaceChildren(...events.map(e => {
      const row = document.createElement('li'); row.dataset.kind=e.kind; const tick = document.createElement('span'); tick.textContent = `Tick ${e.tick.toLocaleString()}`;
      const name = state.lineage.find(l => l.id === e.creatureId)?.displayName ?? e.creatureId;
      const partner = state.lineage.find(l=>l.id===e.relatedCreatureId)?.displayName ?? '';
      const detail = document.createElement('span');
      detail.textContent = e.competitionEvent ? `${e.competitionEvent.id} · ${e.kind.replace('competition','')} · ${name}${e.competitionEvent.reason?` · ${e.competitionEvent.reason}`:''}` : e.kind === 'death' ? `${name} died of old age.` : e.kind === 'hatch' ? `${name} hatched into babyhood.`
        : e.kind === 'rebirth' ? `${name} entered a rebirth cocoon.`
        : e.kind === 'rescue' ? `POPULATION RESCUE · unrelated founder egg ${name} arrived.`
        : e.kind === 'courtship' ? `${name} invited ${partner} to meet on land.`
        : e.kind === 'courtshipAborted' ? `${name}'s courtship was cancelled.`
        : e.kind === 'mating' ? `${name} began mating with ${partner}.`
        : e.kind === 'eggLaid' ? `${name} was laid · generation ${state.lineage.find(l=>l.id===e.creatureId)?.generation}.`
        : e.kind === 'friendship' ? `${name} and ${partner} became friends.`
        : e.kind === 'rivalry' ? `${name} and ${partner} became foes.`
        : e.kind === 'mateBondFormed' ? `${name} and ${partner} formed a mate bond.`
        : e.kind === 'mateBondBroken' ? `${name} and ${partner}'s mate bond ended.`
        : e.kind === 'share' ? `${name} shared a berry with ${partner}.`
        : e.kind === 'steal' ? `${name} stole a berry from ${partner}.`
        : e.kind === 'fight' ? `${name} won a food wager against ${partner}; ${partner} has a two-day Running penalty.`
        : e.kind === 'mourning' ? `${name} is remembering ${partner}.`
        : e.kind === 'contest' ? `${name} sparred with ${partner} (${e.socialResult?.skill?config.skillCatalog[e.socialResult.skill].name:'practice'}); ${e.socialResult?.winnerId?`${state.lineage.find(l=>l.id===e.socialResult!.winnerId)?.displayName??e.socialResult.winnerId} won`:'a draw'}.`
        : e.kind === 'debugAffinity' ? `DEBUG relationship: ${name} and ${partner}${e.command&&'value' in e.command?` → ${e.command.value}`:''}.`
        : e.kind === 'intervention' || e.kind === 'forceBreed' ? `${name}: ${e.kind === 'forceBreed' ? 'DEBUG force breed' : e.command?.kind} ${e.command && 'enabled' in e.command ? (e.command.enabled ? 'on' : 'off') : ''}.`
        : e.kind==='dailyCache'?'Daily welcome cache credited to player inventory.' : e.kind==='inventoryOverflow'?'Daily cache overflow beyond stack caps was discarded (see supply ledger).' : e.kind === 'spawn' ? `${name} arrived as ${e.to === 'egg' ? 'an egg' : 'an adult'}.`
        : `${name}: ${e.from} → ${e.to}${e.kind === 'debugStage' ? ' (debug)' : ''}.`;
      row.append(tick, detail); return row;
    }));
  } };
}

export function populationSummary(state: SaveState): string {
  if (!state.creatures.length) return 'EXTINCT · no living Derbils or eggs';
  return lifeStages.map(stage => `${stage}: ${state.creatures.filter(c => c.stage === stage).length}`).join(' · ');
}
