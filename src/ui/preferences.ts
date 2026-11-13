import { config, fruitKinds } from '../data/config';
import { foodPreference, preferenceLabel, tasteWeights } from '../sim/preferences';
import type { Creature } from '../sim/types';
import { mealReaction } from '../render/labels';

export function createPreferenceTable(root: HTMLElement) {
  root.innerHTML = `<div class="needs-heading"><h2>Developing tastes</h2><span>SCORE / MEALS</span></div>
    <p id="last-eaten" class="last-eaten">No fruit tried yet</p>
    <table class="preference-table"><caption class="sr-only">Individual fruit preferences, from minus one to plus one, and times eaten</caption>
      <thead><tr><th scope="col">Fruit</th><th scope="col">Score</th><th scope="col">Meals</th></tr></thead><tbody></tbody></table>
    <p class="taste-note">Tastes combine genes, experience, and recent repetition. <span id="taste-bias"></span></p>`;
  const rows = fruitKinds.map(kind => {
    const row = document.createElement('tr');
    const name = document.createElement('th'); name.scope = 'row';
    const swatch = document.createElement('span'); swatch.className = 'fruit-swatch'; swatch.style.background = config.fruit[kind].color;
    const label = document.createElement('span'); label.textContent = config.fruit[kind].name;
    const track = document.createElement('span'); track.className = 'preference-track';
    const fill = document.createElement('span'); fill.className = 'preference-fill'; track.append(fill);
    name.append(swatch, label, track);
    const score = document.createElement('td'); const samples = document.createElement('td');
    row.append(name, score, samples); root.querySelector('tbody')!.append(row);
    return { kind, row, score, samples, fill };
  });
  const lastEaten = root.querySelector<HTMLElement>('#last-eaten')!;
  const bias = root.querySelector<HTMLElement>('#taste-bias')!;
  return {
    update(creature: Creature, tick: number) {
      const reaction = mealReaction(creature, tick);
      lastEaten.textContent = creature.lastMeal
        ? `Last eaten: ${config.fruit[creature.lastMeal.fruit].name}${reaction ? ` · ${reaction}` : ''}` : 'No fruit tried yet';
      for (const entry of rows) {
        const value = foodPreference(creature, entry.kind);
        entry.score.textContent = `${value >= 0 ? '+' : ''}${value.toFixed(2)}`;
        entry.samples.textContent = String(creature.foodPreferences[entry.kind].samples);
        entry.row.dataset.preference = preferenceLabel(creature, entry.kind).toLowerCase();
        entry.row.title = preferenceLabel(creature, entry.kind);
        entry.fill.style.left = `${value < 0 ? (1 + value) * 50 : 50}%`;
        entry.fill.style.width = `${Math.abs(value) * 50}%`;
        entry.fill.classList.toggle('negative', value < 0);
      }
      const weights = tasteWeights(creature);
      bias.textContent = `Gene-derived weights: sweet ${weights.sweet.toFixed(2)}, tart ${weights.tart.toFixed(2)}, earthy ${weights.earthy.toFixed(2)}.`;
    },
  };
}
