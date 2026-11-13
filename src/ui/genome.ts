import { chromosomes, loci, locusAlleles } from '../sim/genetics/catalog';
import { derivePhenotype, expressLocus } from '../sim/genetics/expression';
import { validateGenome } from '../sim/genetics/validate';
import type { Creature, Genome, OffspringPreview, SaveState } from '../sim/types';

interface Handlers { spawnGenome: (genome: Genome) => void; spawnEgg: (genome: Genome) => void; preview: (a: string, b: string, seed: number) => OffspringPreview }

export function createGenomePanel(root: HTMLElement, handlers: Handlers) {
  root.innerHTML = `<div class="needs-heading"><h2>Genetics</h2><span>INHERITED POTENTIAL</span></div>
    <p class="skills-note">★ marks rank 1. Equal ranks share expression; unequal numeric ranks contribute 75% / 25%.</p>
    <details class="genome-view"><summary>Genome · ${loci.length} paired loci</summary><div id="gene-groups"></div></details>
    <details class="genome-view"><summary>Derived phenotype</summary><pre id="phenotype-summary" tabindex="0" aria-label="Derived phenotype"></pre></details>
    <details class="genome-view"><summary>Spawn from genome JSON <span>DEBUG</span></summary>
      <label for="genome-json">Genome JSON</label><textarea id="genome-json" rows="9" spellcheck="false"></textarea>
      <div class="genome-buttons"><button id="copy-selected-genome">Use selected genome</button><button id="spawn-genome">Spawn from JSON</button><button id="spawn-egg">Spawn egg from genome</button></div>
      <p id="genome-status" class="skills-note" role="status"></p></details>
    <details class="genome-view"><summary>Preview offspring <span>DEBUG</span></summary>
      <p class="skills-note">A preview creates no Derbil and consumes no habitat RNG.</p>
      <form id="offspring-form"><label>First parent<select id="parent-a"></select></label><label>Second parent<select id="parent-b"></select></label>
        <label>Preview seed<input id="preview-seed" type="number" min="1" max="4294967295" step="1" required></label>
        <button id="preview-offspring" type="submit">Preview offspring</button></form>
      <p id="preview-status" class="skills-note" role="status"></p><pre id="offspring-result" tabindex="0" aria-label="Offspring preview"></pre></details>`;
  const element = <T extends HTMLElement>(id: string) => root.querySelector<T>(`#${id}`)!;
  const groups = element<HTMLDivElement>('gene-groups');
  const rows = chromosomes.flatMap(chromosome => {
    const section = document.createElement('section'), title = document.createElement('h3'); title.textContent = chromosome;
    const table = document.createElement('table'); table.className = 'genome-table';
    table.innerHTML = '<thead><tr><th>Locus</th><th>Alleles</th><th>Expressed</th></tr></thead><tbody></tbody>';
    const entries = loci.filter(l => l.definition.chromosome === chromosome).map(locus => {
      const row = document.createElement('tr'), name = document.createElement('th'); name.scope = 'row'; name.textContent = locus.definition.id;
      const alleles = document.createElement('td'), expressed = document.createElement('td'); row.append(name, alleles, expressed);
      table.querySelector('tbody')!.append(row); return { locus, alleles, expressed };
    });
    section.append(title, table); groups.append(section); return entries;
  });
  const editor = element<HTMLTextAreaElement>('genome-json');
  const a = element<HTMLSelectElement>('parent-a'), b = element<HTMLSelectElement>('parent-b');
  const seed = element<HTMLInputElement>('preview-seed');
  let selected: Creature | undefined, roster = '';
  element('copy-selected-genome').addEventListener('click', () => { if (selected) editor.value = JSON.stringify(selected.genome, null, 2); });
  element('spawn-genome').addEventListener('click', () => {
    try { const data: unknown = JSON.parse(editor.value); validateGenome(data); handlers.spawnGenome(data); element('genome-status').textContent = 'Derbil spawned.'; }
    catch (error) { element('genome-status').textContent = error instanceof Error ? error.message : 'Could not spawn genome.'; }
  });
  element('spawn-egg').addEventListener('click', () => {
    try { const data: unknown = JSON.parse(editor.value); validateGenome(data); handlers.spawnEgg(data); element('genome-status').textContent = 'Egg spawned.'; }
    catch (error) { element('genome-status').textContent = error instanceof Error ? error.message : 'Could not spawn egg.'; }
  });
  element('offspring-form').addEventListener('submit', event => {
    event.preventDefault();
    try {
      const preview = handlers.preview(a.value, b.value, seed.valueAsNumber);
      element('offspring-result').textContent = JSON.stringify(preview, null, 2);
      element('preview-status').textContent = 'Preview only · no Derbil created.';
    } catch (error) { element('offspring-result').textContent = ''; element('preview-status').textContent = error instanceof Error ? error.message : 'Could not preview.'; }
  });
  return { update(state: SaveState, c: Creature) {
    const changed = selected?.id !== c.id; selected = c;
    if (changed) editor.value = JSON.stringify(c.genome, null, 2);
    const identity = state.creatures.map(c => c.id).join(',');
    if (roster !== identity) {
      roster = identity;
      for (const select of [a, b]) {
        const previous = select.value;
        select.replaceChildren(...state.creatures.map(c => new Option(c.displayName, c.id)));
        if (state.creatures.some(c => c.id === previous)) select.value = previous;
      }
      if (a.value === b.value && state.creatures.length > 1) b.value = state.creatures.find(c => c.id !== a.value)!.id;
      if (!seed.value) seed.value = String(state.rng.genetics);
    }
    element<HTMLButtonElement>('spawn-genome').disabled = state.creatures.length + state.sessions.length >= state.settings.capacity;
    element<HTMLButtonElement>('spawn-egg').disabled = state.creatures.length + state.sessions.length >= state.settings.capacity;
    element<HTMLButtonElement>('preview-offspring').disabled = state.creatures.length < 2;
    for (const r of rows) {
      const pair = locusAlleles(c.genome, r.locus);
      r.alleles.replaceChildren(...pair.map((allele, index) => {
        const span = document.createElement(allele.d > pair[1 - index].d ? 'strong' : 'span');
        span.textContent = `${index ? ' / ' : ''}${allele.v}${allele.d === 1 ? ' ★' : ''}`; return span;
      }));
      const value = expressLocus(pair[0], pair[1], r.locus.definition);
      r.expressed.textContent = typeof value === 'number' ? value.toFixed(3) : value;
    }
    element('phenotype-summary').textContent = JSON.stringify(derivePhenotype(c.genome), null, 2);
  } };
}
