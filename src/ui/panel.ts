import { energyCapacity } from '../sim/dynasty/movement';
import { skillLevel } from '../sim/skills';
import { relationship } from '../sim/social/relationships';
import { namedView, nameWithId } from '../app/names';
import { playerEvents } from '../app/events';
import { shouldRefresh } from '../app/refresh';
import { createTrophyShelf } from './trophies';
import { createCompetitionPanel } from './competition';
import { competitionCandidate } from '../sim/competition/attendance';
import { createBreedingPanel } from './breeding';
import { config, needKeys, skillKeys } from '../data/config';
import { behaviorLabels, moodLabel, thought } from '../render/labels';
import { makeCandidate } from '../sim/brain';
import { initialSeed } from '../sim/state';
import { scoreUtility } from '../sim/utility';
import type { AppearanceGenePatch, Genome, LifeStage, OffspringPreview, SaveState, Skill, Speed, PlayerCommand } from '../sim/types';
import { createPreferenceTable } from './preferences';
import { createSkillsPanel } from './skills';
import { createGenomePanel } from './genome';
import { createAppearancePanel } from './appearance';
import { createGallery } from './gallery';
import { createLifecyclePanel, createLifeLog, populationSummary } from './lifecycle';
import { createSocialPanel } from './social';
import { createSocialWeb } from './social-web';

interface Handlers { speed: (speed: Speed) => void; pause: () => void; save: () => void; load: () => void; select: (id: string) => void; spawn: () => void; skill: (skill: Skill, level: number, aptitude: number) => void;
  appearanceGenes: (patch: AppearanceGenePatch) => void;
  spawnGenome: (genome: Genome) => void; spawnEgg: (genome: Genome) => void; preview: (a: string, b: string, seed: number) => OffspringPreview;
  age: (ticks: number) => Promise<void>; forceStage: (stage: LifeStage) => void; command: (command: PlayerCommand) => void }

export function createPanel(root: HTMLElement, handlers: Handlers) {
  root.innerHTML = `
    <header class="masthead">
      <a class="wordmark" href="./" aria-label="Derbil Dynasty home"><span class="brand-icon" aria-hidden="true">D</span><span class="brand-name">Derbil Dynasty</span></a>
      <span class="masthead-note">A LITTLE LIFE, UNFOLDING</span><span class="build-tag">SANDBOX <span>${config.rulesVersion}</span></span>
    </header>
    <main>
      <div class="intro"><div><p class="eyebrow">THE WOODLAND HABITAT</p><h1>A world of its own.</h1><p class="intro-copy">A quiet clearing. Growing families. Lives that find their own way.</p></div>
        <div class="day-card"><span class="sun-icon" aria-hidden="true">☼</span><div><span id="day">Day 1</span><small id="time-period">Dawn in the clearing</small></div></div>
      </div>
      <div class="workspace">
        <section class="habitat-column" aria-label="Habitat and simulation controls">
          <div class="toolbar"><div class="playback"><button id="pause" class="pause-button" aria-label="Pause simulation"><span id="pause-icon" aria-hidden="true">||</span><span id="pause-label">Pause</span></button>
            <span class="toolbar-divider"></span><div class="speeds" role="group" aria-label="Simulation speed">${config.clock.foregroundSpeeds.filter(s => s > 0).map(s => `<button data-speed="${s}" aria-pressed="${s === 1}">${s}×</button>`).join('')}</div>
          </div><span class="tick-display">TICK <strong id="tick">0</strong></span></div>
          <div class="canvas-wrap"><canvas id="habitat" width="1024" height="768" tabindex="0" aria-label="Woodland habitat. Scroll to zoom, drag to pan. Plus and minus zoom; arrow keys pan; Home fits the map. Tab cycles Derbils. Escape deselects and returns focus to the HTML Derbil list.">Your browser needs Canvas 2D to display the habitat.</canvas>
            <div class="map-controls" role="group" aria-label="Map zoom"><button id="map-zoom-out" aria-label="Zoom out">−</button><output aria-label="Map zoom level">100%</output><button id="map-zoom-in" aria-label="Zoom in">+</button><button id="map-fit">Fit map</button></div><div class="map-label"><span class="live-dot"></span><span id="live-label">LIVING, AT ITS OWN PACE</span></div><span class="map-size">${config.world.widthTiles} × ${config.world.heightTiles}</span>
          </div>
          <div class="habitat-footer"><span><span class="legend-dot fruit-dot"></span><span id="fruit-count">Ripe fruit</span><span class="legend-dot grass-dot"></span>Grass for grazing</span><span id="playback-rate" title="Actual speed depends on your device; accelerated ticks remain exact.">1× selected</span></div>
          <div class="map-options"><label><input type="checkbox" id="hide-actions"> Hide action bubbles</label><span>Scroll to zoom · drag to pan</span></div>
          <div class="fruit-legend" aria-label="Fruit source legend">${Object.values(config.dynasty.stats).map(stat => `<span title="Two berries per plant; eating grants ${config.dynasty.plants.berryXp} ${stat.name} XP"><i style="background:${stat.color}" aria-hidden="true"></i>${stat.name} berry</span>`).join('')}</div>
          <p class="observation"><span aria-hidden="true">&gt;</span> New bushes and kelp replace emptied plants. Berries and practice build skills. Each Derbil finds its own way.</p>
          <label class="rescue-toggle" title="Adds ${config.breeding.recovery.eggs} unrelated eggs when ${config.breeding.recovery.maximumPopulation} or fewer Derbils have no unrelated future breeding pair; adds ${config.breeding.rescueCount} after extinction."><input type="checkbox" id="extinction-rescue"> Rescue eggs for endangered populations</label>
          <label class="rescue-toggle"><input type="checkbox" id="reduced-motion"> Reduced motion</label>
          <label class="rescue-toggle"><input type="checkbox" id="hide-social"> Hide social overlays</label>
          <p id="population-stages" class="stage-summary" aria-label="Population by life stage"></p>
          <section id="social-web" class="social-web" aria-label="Relationship web"></section>
          <section id="appearance-gallery" aria-label="Appearance gallery"></section>
          <section id="competitions" class="competition-panel" aria-label="Competitions, prizes and results"></section>
          <section id="journal" class="life-journal" aria-label="Lifecycle event log"></section>
        </section>
        <aside class="inspector" aria-label="Selected Derbil card">
          <div class="inspector-heading"><p class="eyebrow">FIELD NOTES</p><span id="population" class="population"></span></div>
          <div id="creature-roster" class="creature-roster" role="group" aria-label="Select a Derbil"></div>
          <button id="spawn-creature" class="spawn-creature">+ Spawn random founder <span>DEBUG</span></button>
          <button id="select-creature" class="creature-select" aria-label="Select Pip"><span class="portrait" aria-hidden="true"><canvas id="creature-portrait" width="${config.appearance.gallery.cellPixels}" height="${config.appearance.gallery.cellPixels}"></canvas></span><span><strong id="creature-name">Pip</strong><small id="creature-stage-note">Adult · woodland resident</small></span><span class="selected-mark" aria-hidden="true">+</span></button>
          <div id="selected-content"><div class="mood-line"><span><span class="mood-dot"></span><span id="mood-label">Content</span></span><span id="behavior-label">Settling in</span></div>
            <p id="thought" class="thought">Taking in the clearing</p>
            <p id="movement-status" class="skills-note"></p><p id="top-skills" class="skills-note"></p><p id="key-relationships" class="skills-note"></p><p id="competition-stats" class="skills-note"></p><section id="trophy-shelf" class="trophy-shelf" aria-label="Trophies and cosmetics"></section>
            <section id="social" class="social-panel" aria-label="Selected Derbil relationships"></section>
            <section id="breeding" class="breeding-panel" aria-label="Breeding policies and lineage"></section>
            <section id="lifecycle" class="lifecycle-panel" aria-label="Selected Derbil age and lifecycle tools"></section>
            <div id="active-needs">
            <div class="needs-heading"><h2>Needs</h2><span>LOWER IS BETTER</span></div>
            <div class="need-list">${needKeys.map(key => `<div class="need-row"><div><label for="need-${key}">${key[0].toUpperCase() + key.slice(1)}</label><span id="value-${key}">0</span></div><meter id="need-${key}" min="0" max="100" value="0">0</meter></div>`).join('')}</div>
            </div><p id="dormant-needs" class="skills-note" hidden>Eggs and cocoons have no needs or brain activity.</p>
            <dl class="coordinates" data-debug><div><dt>POSITION</dt><dd id="position">26.5, 22.5</dd></div><div><dt>SEED</dt><dd id="seed">271828</dd></div></dl>
            <section id="preferences" class="preference-panel" aria-label="Selected Derbil fruit preferences"></section>
            <section id="skills" class="skills-panel" aria-label="Selected Derbil skills"></section>
            <section id="appearance" class="appearance-panel" aria-label="Selected Derbil appearance"></section>
            <section id="genetics" class="genetics-panel" aria-label="Selected Derbil genome and genetics tools"></section>
            <details class="debug-details" open><summary>Under the hood <span>DEBUG</span></summary><div class="debug-content"><p class="debug-caption">Chosen action · utility contributions</p><div id="utility-terms"></div><p class="debug-caption">Raw Derbil state</p><pre id="raw-state" tabindex="0" aria-label="Raw state of selected Derbil"></pre></div></details>
          </div><p id="no-selection" hidden>Select a living Derbil or spawn a founder to inspect its state.</p>
        </aside>
      </div>
      <footer class="page-footer"><span class="milestone-label">A STUDY IN SMALL, AUTONOMOUS LIVES <span>·</span> DERBIL DYNASTY</span><div class="save-controls"><span id="save-status" role="status">Not saved yet</span><button id="save">Save</button><button id="load">Load</button></div></footer>
      <p class="keyboard-hint"><kbd>Space</kbd> pause / resume <span>·</span> Saves stay in this browser. The habitat also advances gently while you are away.</p>
    </main>`;
  const elements = new Map<string, HTMLElement>();
  const element = <T extends HTMLElement = HTMLElement>(id: string): T => {
    let found = elements.get(id);
    if (!found) { found = root.querySelector<HTMLElement>(`#${id}`)!; elements.set(id, found); }
    return found as T;
  };
  const speedButtons = [...root.querySelectorAll<HTMLButtonElement>('[data-speed]')];
  for (const button of speedButtons) button.addEventListener('click', () => handlers.speed(Number(button.dataset.speed) as Speed));
  element('pause').addEventListener('click', handlers.pause);
  element('save').addEventListener('click', handlers.save);
  element('load').addEventListener('click', handlers.load);
  element('select-creature').addEventListener('click', () => handlers.select(element('select-creature').dataset.creatureId ?? ''));
  element('spawn-creature').addEventListener('click', handlers.spawn);
  const roster = element('creature-roster');
  roster.addEventListener('click', event => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button[data-creature-id]');
    if (button) handlers.select(button.dataset.creatureId!);
  });
  const preferences = createPreferenceTable(element('preferences'));
  const skills = createSkillsPanel(element('skills'), handlers.skill);
  const appearance = createAppearancePanel(element('appearance'), element<HTMLCanvasElement>('creature-portrait'), handlers.appearanceGenes);
  const reducedMotion = element<HTMLInputElement>('reduced-motion');
  reducedMotion.checked = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const gallery=createGallery(element('appearance-gallery'));
  const genetics = createGenomePanel(element('genetics'), handlers);
  const breeding = createBreedingPanel(element('breeding'), handlers.command);
  const social = createSocialPanel(element('social'), handlers.command, handlers.select);
  const web = createSocialWeb(element('social-web'), handlers.select);
  element<HTMLInputElement>('extinction-rescue').onchange = event => handlers.command({kind:'extinctionRescue',enabled:(event.target as HTMLInputElement).checked});
  const lifecycle = createLifecyclePanel(element('lifecycle'), handlers);
  const competitions=createCompetitionPanel(element('competitions'),handlers.command,handlers.select);
  const shelf=createTrophyShelf(element('trophy-shelf'),handlers.command);
  const journal = createLifeLog(element('journal'));
  // Existing debug tools retain their IDs and handlers, behind one global toggle.
  for(const detail of root.querySelectorAll('details'))if(detail.querySelector('summary')?.textContent?.includes('DEBUG'))detail.setAttribute('data-debug','');
  for(const id of ['spawn-creature','appearance-gallery','genetics','appearance','preferences'])element(id).setAttribute('data-debug','');
  element('competition-debug-toggle').closest('label')!.setAttribute('data-debug','');
  element('utility-terms').closest('details')!.setAttribute('data-debug','');
  for(const id of ['social','breeding']){const section=element(id),details=document.createElement('details'),summary=document.createElement('summary');summary.textContent=id==='social'?'Relationships':'Breeding & family / lineage';section.before(details);details.append(summary,section);}
  {const section=element('social-web'),details=document.createElement('details'),summary=document.createElement('summary');summary.textContent='Relationship web';section.before(details);details.append(summary,section);}
  let debugLast=-Infinity,replaying=false;
  function debugMode(){return document.body.classList.contains('debug-mode');}
  document.addEventListener('debugmodechange',()=>{gallery.setSuspended(replaying||!debugMode()||document.hidden);});
  document.addEventListener('visibilitychange',()=>gallery.setSuspended(replaying||!debugMode()||document.hidden));
  gallery.setSuspended(true);
  let lastState:SaveState|null=null,lastSelection:string|null=null;
  root.addEventListener('toggle',()=>{if(lastState&&!replaying&&!document.hidden)update(lastState,lastSelection);},true);
  let rosterIdentity = '';
  const terms = element('utility-terms');
  const raw = element('raw-state');
  const needs = needKeys.map(key => ({ key, meter: element<HTMLMeterElement>(`need-${key}`), value: element(`value-${key}`) }));

  function update(rawState: SaveState, selectedId: string | null) {
    lastState=rawState;lastSelection=selectedId;
    const state=namedView(rawState),now=performance.now(),debug=debugMode();
    element('social-web').hidden=element<HTMLInputElement>('hide-social').checked;
    // Read layout once before writing to it. Offscreen/closed inspectors resume
    // on the next regular refresh, without rebuilding unseen graphs and forms.
    const shown = new Set(['competitions','social-web','preferences','select-creature','appearance','genetics','breeding','social'].filter(id=>{
      const box=element(id).getBoundingClientRect();return box.width>0&&box.height>0&&box.bottom>=0&&box.top<=window.innerHeight;
    }));
    const visible=(id:string)=>shown.has(id);
    const refreshDebug=shouldRefresh(debugLast,now,config.presentation.debugRefreshHz,debug);
    if(refreshDebug)debugLast=now;
    const c = state.creatures.find(c => c.id === selectedId);
    const identity = state.creatures.map(c => c.id).join(',');
    if (rosterIdentity !== identity) {
      rosterIdentity = identity;
      roster.replaceChildren(...state.creatures.map(creature => {
        const button = document.createElement('button'); button.dataset.creatureId = creature.id;
        button.textContent = creature.displayName; button.title=nameWithId(Number(state.saveId.slice(6)),creature.id,creature.displayName); button.setAttribute('aria-label', `Select ${nameWithId(Number(state.saveId.slice(6)),creature.id,creature.displayName)}`); return button;
      }));
    }
    for (const button of roster.querySelectorAll('button')) button.setAttribute('aria-pressed', String(button.dataset.creatureId === selectedId));
    element('population').textContent = `${state.creatures.length} / ${config.lifecycle.capacity} DERBILS`;
    element<HTMLInputElement>('extinction-rescue').checked = state.settings.extinctionRescue;
    element('population-stages').textContent = populationSummary(state); journal.update({...state,events:playerEvents(state.events,config.presentation,debug)});
    competitions.update(state,visible('competitions'));
    if(visible('social-web'))web.update(state,selectedId,!element<HTMLInputElement>('hide-social').checked);
    element<HTMLButtonElement>('spawn-creature').disabled = state.creatures.length + state.sessions.length >= state.settings.capacity;
    element('select-creature').dataset.creatureId = c?.id ?? state.creatures[0]?.id ?? '';
    element('tick').textContent = state.clock.tick.toLocaleString();
    element('day').textContent = `Day ${Math.floor(state.clock.tick / config.clock.dayTicks)}`;
    const isNight = (state.clock.tick % config.clock.dayTicks) / config.clock.dayTicks >= config.world.nightStart;
    element('time-period').textContent = isNight ? 'Night in the clearing' : 'Daylight in the clearing';
    element('pause-label').textContent = state.clock.speed === 0 ? 'Resume' : 'Pause';
    element('pause-icon').textContent = state.clock.speed === 0 ? '>' : '||';
    element('pause').setAttribute('aria-label', state.clock.speed === 0 ? 'Resume simulation' : 'Pause simulation');
    element('live-label').textContent = state.creatures.length === 0 ? 'EXTINCT · A QUIET CLEARING' : state.clock.speed === 0 ? 'A MOMENT OF STILLNESS' : 'LIVING, AT ITS OWN PACE';
    for (const button of speedButtons) button.setAttribute('aria-pressed', String(Number(button.dataset.speed) === state.clock.speed));
    element('fruit-count').textContent = `${state.world.looseFruit.length + state.world.plants.reduce((sum, p) => sum + p.ripe, 0)} ripe fruit`;
    element('selected-content').hidden = !c; element('no-selection').hidden = !!c;
    element('select-creature').hidden = !c;
    if (!c) return;
    element('select-creature').setAttribute('aria-label', `Inspect ${c.displayName}`);
    shelf.update(state,c);
    if(refreshDebug&&visible('preferences'))preferences.update(c, state.clock.tick);
    skills.update(c, state.clock.tick);
    if(visible('select-creature'))appearance.update(c, state.clock.tick, state.organisms.find(o => o.id === c.organismId)!.appearanceSeed,refreshDebug&&visible('appearance'));
    if(refreshDebug&&visible('genetics'))genetics.update(state, c);
    lifecycle.update(state, c);
    if(visible('breeding'))breeding.update(state, c);
    if(visible('social'))social.update(state,c);
    const competition=state.competitions.find(e=>e.entrantIds.includes(c.id));
    const competitionStats=c.competition.stats;
    element('competition-stats').textContent=`Competitions: ${competitionStats.entered} entered · ${competitionStats.wins} wins · ${competitionStats.podiums} podiums · best ${Object.entries(competitionStats.bestPlacement).map(([k,v])=>`${config.skillCatalog[k as Skill].name} #${v}`).join(', ')||'—'}`;
    const practiced=skillKeys.map(skill=>({skill,level:skillLevel(c,skill)})).sort((a,b)=>b.level-a.level||skillKeys.indexOf(a.skill)-skillKeys.indexOf(b.skill));
    element('top-skills').textContent=`Best practiced: ${practiced.map(r=>`${config.skillCatalog[r.skill].name} ${r.level}`).join(' · ')}`;
    const edges=state.relationships.filter(r=>r.a===c.organismId||r.b===c.organismId).map(r=>relationship(state,r.a,r.b)!);
    const closest=edges.slice().sort((a,b)=>b.bond-a.bond)[0],peer=closest?state.creatures.find(p=>p.organismId===(closest.a===c.organismId?closest.b:closest.a)):null;
    element('key-relationships').textContent=`${edges.filter(r=>r.bond>=config.social.friendBond).length} friends · ${edges.filter(r=>r.bond<=config.social.dislikedBond).length} foes · ${edges.filter(r=>r.mateBond>=config.social.mateBondThreshold).length} mate bonds${peer?` · closest: ${peer.displayName}`:''}`;
    element('mood-label').parentElement!.title='Mood follows needs and recent experiences. See Help & legend for thresholds.';
    element('creature-name').textContent = c.displayName; element('select-creature').title=nameWithId(Number(state.saveId.slice(6)),c.id,c.displayName);
    element('creature-stage-note').textContent = `${c.stage[0].toUpperCase() + c.stage.slice(1)} · reincarnations: ${c.lifeIndex}${c.lifeIndex?' ↻':''}`;
    element('mood-label').textContent = c.needs ? moodLabel(c.mood) : 'Dormant'; element('mood-label').title='Mood follows needs and recent experiences. Content ≥ .25; unhappy ≤ −.25.';
    const shared=state.social.sessions.find(s=>s.participants.includes(c.id));
    element('behavior-label').textContent = competition ? competition.status==='running'?'Competing':'Attending competition' : state.sessions.some(s=>s.participants.includes(c.id)) ? 'Courtship' : shared ? shared.kind==='comfort'&&shared.participants[1]===c.id?'Receiving comfort':behaviorLabels[shared.kind] : c.currentAction ? behaviorLabels[c.currentAction.kind] : c.needs ? 'Settling in' : c.stage;
    element('active-needs').hidden = c.needs === null; element('dormant-needs').hidden = c.needs !== null;
    element('thought').textContent = thought(c, state);
    element('movement-status').textContent = `Energy ${c.dynasty.energy.toFixed(0)} / ${energyCapacity(c).toFixed(0)} · ${c.dynasty.moving ? c.dynasty.movementMode : 'resting'} · ${c.dynasty.food.length} carried berries`;
    element('position').textContent = `${c.position.x.toFixed(2)}, ${c.position.y.toFixed(2)} · ${c.dynasty.movementMode} · energy ${c.dynasty.energy.toFixed(0)}/${energyCapacity(c).toFixed(0)} · ${c.dynasty.food.length} carried berries`;
    element('seed').textContent = String(initialSeed(state));
    for (const need of needs) {
      need.meter.value = (c.needs?.[need.key] ?? 0); need.meter.textContent = String((c.needs?.[need.key] ?? 0)); need.value.textContent = (c.needs?.[need.key] ?? 0).toFixed(1);
    }
    if(!refreshDebug)return;
    raw.textContent = JSON.stringify(rawState.creatures.find(creature=>creature.id===c.id), null, 2);
    terms.replaceChildren();
    if (c.currentAction || competition) {
      const a = c.currentAction;
      const score = scoreUtility(c, competition ? competitionCandidate(state,c,competition,true) : makeCandidate(state, c, a!.kind, a!.target, a!.targetFruitId, a!.targetPlantId, a!.targetItemId));
      const entries = Object.entries(score.terms).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1])).slice(0, 5);
      for (const [name, value] of [...entries, ['Total', score.total] as const]) {
        const row = document.createElement('div'); row.className = 'utility-row';
        const label = document.createElement('span'); label.textContent = name;
        const amount = document.createElement('span'); amount.textContent = `${value >= 0 ? '+' : ''}${value.toFixed(4)}`;
        row.append(label, amount); terms.append(row);
      }
    }
  }
  return { canvas: element<HTMLCanvasElement>('habitat'), update, resetRendering() { appearance.reset(); }, setReplaying(value:boolean) { replaying=value; gallery.setSuspended(value||!debugMode()||document.hidden); },
    reducedMotion() { return reducedMotion.checked; },
    socialOverlays() { return !element<HTMLInputElement>('hide-social').checked; },
    status(message: string, failed = false) { element('save-status').textContent = message; element('save-status').classList.toggle('failed', failed); } };
}
