import { config } from '../data/config';
import { derivePhenotype } from '../sim/genetics/expression';
import type { AppearanceGenePatch, Creature } from '../sim/types';

/** Visible channels only: this tool cannot edit aptitudes, skills or acquired effects. */
export function createAppearanceEditor(root: HTMLElement, apply: (patch: AppearanceGenePatch) => void) {
  const genes = config.genes.filter(g => ['baseHue','feetHue','tailHue','eyeHue','saturation','lightness'].includes(g.trait));
  root.innerHTML = `<details class="appearance-debug"><summary>Set inherited part colors <span>DEBUG</span></summary>
    <form><label>Gene<select name="gene">${genes.map(g => `<option value="${g.trait}">${g.trait}</option>`).join('')}</select></label>
      <label>Value<input name="number" type="number" step="any" required></label>
      <label hidden>Value<select name="category" disabled></select></label>
      <button type="submit">Apply gene</button><p class="skills-note">Sets both alleles. Learned skills and acquired marks stay as they are.</p>
      <p class="skills-note" role="status"></p></form></details>`;
  const form = root.querySelector('form')!, gene = form.elements.namedItem('gene') as HTMLSelectElement;
  const number = form.elements.namedItem('number') as HTMLInputElement, category = form.elements.namedItem('category') as HTMLSelectElement;
  const status = form.querySelector('[role=status]')!;
  let creature: Creature | undefined;
  function fill() {
    if (!creature) return;
    const definition = genes.find(g => g.trait === gene.value)!, phenotype = derivePhenotype(creature.genome);
    const values = { ...phenotype.palette, ...phenotype.body };
    const value = values[definition.trait as keyof typeof values];
    const categorical = definition.dominanceType === 'categorical';
    number.disabled = categorical; category.disabled = !categorical;
    number.parentElement!.hidden = categorical; category.parentElement!.hidden = !categorical;
    if (categorical) {
      category.replaceChildren(...definition.options!.map(o => new Option(o.value, o.value)));
      category.value = String(value);
    } else {
      number.min = String(definition.traitRange![0]); number.max = String(definition.traitRange![1]); number.value = String(value);
    }
    status.textContent = '';
  }
  gene.addEventListener('change', fill);
  form.addEventListener('submit', event => {
    event.preventDefault();
    try {
      apply({ [gene.value]: category.disabled ? number.valueAsNumber : category.value } as AppearanceGenePatch);
      status.textContent = 'Appearance gene updated.';
    } catch (error) { status.textContent = error instanceof Error ? error.message : 'Could not set gene.'; }
  });
  return { update(c: Creature) {
    const changed = creature?.id !== c.id || creature.genome !== c.genome; creature = c;
    if (changed) fill();
  } };
}
