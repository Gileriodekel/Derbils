import { config, skillKeys } from '../data/config';
import { skillCap, skillLevel, xpAtLevel } from '../sim/skills';
import { skillAptitude } from '../sim/genetics/expression';
import type { Creature, Skill } from '../sim/types';

export function createSkillsPanel(root: HTMLElement, apply: (skill: Skill, level: number, aptitude: number) => void) {
  root.innerHTML = `<div class="needs-heading"><h2>Skills</h2><span>PRACTICE MAKES PROGRESS</span></div>
    <p class="skills-note">Aptitude comes from genes. Practice and fruit affect XP gain.</p>
    <table class="skills-table"><thead><tr><th>Skill</th><th>Level</th><th>XP progress</th><th>Aptitude</th></tr></thead><tbody></tbody></table>
    <p id="training-activity" class="skills-note"></p><p id="level-up" class="level-up" role="status"></p>
    <details class="skill-debug"><summary>Set skills <span>DEBUG</span></summary>
      <form id="skill-editor"><label>Skill<select name="skill">${skillKeys.map(s => `<option value="${s}">${config.skillCatalog[s].name}</option>`).join('')}</select></label>
        <label>Level<input name="level" type="number" min="0" max="100" step="1" required></label>
        <label>Aptitude<input name="aptitude" type="number" min="0" max="1" step="any" required></label>
        <button type="submit">Apply skill</button><p class="skills-note">Aptitude edits change the two gene alleles at byte precision.</p><p class="skills-note" id="skill-error" role="status"></p></form>
    </details>`;
  const tbody = root.querySelector('tbody')!;
  const rows = skillKeys.map(skill => {
    const tr = document.createElement('tr');
    const name = document.createElement('th'); name.scope = 'row'; name.style.borderLeft=`5px solid ${config.dynasty.stats[skill].color}`; name.style.paddingLeft='8px'; name.textContent = config.skillCatalog[skill].name;
    const time = document.createElement('small'); name.append(time);
    const level = document.createElement('td'); const xp = document.createElement('td');
    const bar = document.createElement('progress'); bar.max = 1; bar.style.accentColor=config.dynasty.stats[skill].color; bar.setAttribute('aria-label', `${config.skillCatalog[skill].name} XP progress`);
    const amount = document.createElement('small'); xp.append(bar, amount);
    const aptitude = document.createElement('td'); tr.append(name, level, xp, aptitude); tbody.append(tr);
    return { skill, time, level, bar, amount, aptitude };
  });
  const form = root.querySelector<HTMLFormElement>('#skill-editor')!;
  const select = form.elements.namedItem('skill') as HTMLSelectElement;
  const levelInput = form.elements.namedItem('level') as HTMLInputElement;
  const aptitudeInput = form.elements.namedItem('aptitude') as HTMLInputElement;
  const error = root.querySelector('#skill-error')!;
  let creature: Creature | undefined;
  function fill() {
    if (!creature) return;
    const skill = select.value as Skill;
    levelInput.value = String(skillLevel(creature, skill));
    aptitudeInput.value = String(skillAptitude(creature, skill));
    error.textContent = '';
  }
  select.addEventListener('change', fill);
  form.addEventListener('submit', event => {
    event.preventDefault();
    try { apply(select.value as Skill, levelInput.valueAsNumber, aptitudeInput.valueAsNumber); error.textContent = 'Skill updated.'; }
    catch (err) { error.textContent = err instanceof Error ? err.message : 'Could not set skill.'; }
  });
  return { update(c: Creature, tick: number) {
    form.querySelector<HTMLButtonElement>('button[type="submit"]')!.disabled = c.needs === null;
    const changed = creature?.id !== c.id; creature = c;
    if (changed) fill();
    for (const r of rows) {
      const level = skillLevel(c, r.skill), cap = skillCap(c, r.skill);
      const floor = xpAtLevel(level, r.skill), next = xpAtLevel(Math.min(cap, level + 1), r.skill);
      r.level.textContent = `${level} / ${cap}`;
      r.bar.value = level === cap ? 1 : (c.xp[r.skill] - floor) / (next - floor);
      r.amount.textContent = level === cap ? `${c.xp[r.skill].toFixed(1)} · capped` : `${(c.xp[r.skill] - floor).toFixed(1)} / ${(next - floor).toFixed(0)}`;
      const bonus = c.skillBonuses[r.skill];
      r.aptitude.textContent = `${skillAptitude(c, r.skill).toFixed(3)}${bonus ? ` (+${Math.round(bonus.amount * 100)}%)` : ''}`;
      r.aptitude.title = bonus ? `Fruit training bonus until tick ${bonus.expiresTick}` : 'Gene-derived aptitude';
      r.time.textContent = `${c.trainingTicks[r.skill]}s practiced`;
    }
    const skill = skillKeys.find(s => config.skillCatalog[s].trainingActivity === c.currentAction?.kind);
    root.querySelector('#training-activity')!.textContent = skill ? `${c.currentAction!.path.length ? 'Heading to: ' : ''}${config.skillCatalog[skill].activityName}` : 'No training activity right now.';
    if(c.dynasty.runningPenaltyUntil>tick)root.querySelector('#training-activity')!.textContent+=` Running movement/performance −${config.dynasty.relationships.fightPenalty*100}% until tick ${c.dynasty.runningPenaltyUntil}; trained level unchanged.`;
    const up = c.lastLevelUp;
    root.querySelector('#level-up')!.textContent = up && tick - up.tick < config.skills.levelUpMessageTicks
      ? `${config.skillCatalog[up.skill].name} reached level ${up.level}!` : '';
  } };
}
