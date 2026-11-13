import { migrateCalendar } from './calendar-migration';
import { config as previous } from './legacy/v11.js';
import { replaceHistoricalMap } from '../sim/dynasty/map-migration';
import { config } from '../data/config';
import { decodeSave as decodeHistoricalSave } from './legacy/v1-v10.js';
import { newDerbilState, newDynastyState } from '../sim/dynasty/state';
import type { SaveState } from '../sim/types';

// This module is the only boundary that reads removed fields. The frozen decoder
// validates the historical object before we touch positional chromosomes.
type Old = Record<string, any>;
export function migrateSave(data: unknown): unknown {
  if (!data || typeof data !== 'object' || !('schemaVersion' in data)) return data;
  if (data.schemaVersion === 12) return data;
  if (data.schemaVersion === 11) return migrateCalendar(data);
  if (typeof data.schemaVersion !== 'number' || data.schemaVersion < 1 || data.schemaVersion > 10) return data;
  const aliased = JSON.parse(JSON.stringify(data), (key, value) => {
    if (value && typeof value === 'object' && !Array.isArray(value) && Object.hasOwn(value, 'power')) {
      value.strength ??= value.power; delete value.power;
    }
    if(key==='skills'&&Array.isArray(value))return value.map(v=>v==='power'?'strength':v);
    return (key === 'skill' || key === 'trainingActivity') && value === 'power' ? 'strength' : value;
  });
  const old = decodeHistoricalSave(JSON.stringify(aliased)) as Old;
  const legacyRecords: unknown[] = [];
  // Archive full old contests before removing retired skill legs. Rewards already
  // settled remain settled; active gatherings are cancelled for the new terrain.
  for (const e of old.competitions as Old[]) {
    legacyRecords.push({ kind: 'competitionBeforeMapChange', record: e });
    if (e.escrowState === 'held') for (const p of e.prize.placements) {
      const group = ({ fruit: 'fruit', seed: 'seeds', item: 'items', cosmetic: 'cosmetics' } as const)[p.kind as 'fruit'];
      const amount = old.inventory[group][p.id] + p.quantity;
      const overflow = Math.max(0, amount - config.prizes.stackCapacity);
      old.inventory[group][p.id] = Math.min(amount, config.prizes.stackCapacity);
      if (overflow) { old.prizeLedger.supplied[`${p.kind}:${p.id}`] -= overflow; old.prizeLedger.overflow[`${p.kind}:${p.id}`] = (old.prizeLedger.overflow[`${p.kind}:${p.id}`] ?? 0) + overflow; }
    }
  }
  old.competitions = [];
  old.competitionHistory = old.competitionHistory.filter((e: Old) => {
    if (!e.skills.includes('climb')) return true;
    legacyRecords.push({ kind: 'retiredCompetition', record: e }); return false;
  });
  for (const c of old.creatures as Old[]) {
    const aptitude = c.genome.aptitude.haplotypes;
    legacyRecords.push({ kind: 'retiredClimbing', creatureId: c.id,
      alleles: aptitude.map((h: unknown[]) => h[3]), xp: c.xp.climb,
      practiceTicks: c.practiceTicks.climb, trainingTicks: c.trainingTicks.climb });
    c.genome.aptitude.haplotypes = aptitude.map((h: unknown[]) => h.filter((_, i) => i !== 3));
    // New independent hues start as exact copies of the former accent locus.
    // No RNG draw and no modification to retained loci.
    for (const h of c.genome.palette.haplotypes) h.push({ ...h[1] }, { ...h[1] });
    c.dynasty = newDerbilState();
    c.currentAction = null; c.nextDecisionTick = old.clock.tick + 1;
    if (c.lastCompletedAction === 'train_climb') c.lastCompletedAction = null;
    if (c.lastLevelUp?.skill === 'climb') c.lastLevelUp = null;
  }
  for (const r of old.relationships as Old[]) {
    legacyRecords.push({ kind: 'relationshipBeforeSpectrum', a: r.a, b: r.b, bond: r.bond, rivalry: r.rivalry, familiarity: r.familiarity });
    r.bond = Math.max(-100, Math.min(100, r.bond - r.rivalry));
    delete r.rivalry; delete r.familiarity;
  }
  for (const l of [...old.lineage,...(old.archive?.stubs??[])] as Old[]) if (l.topSkill?.skill === 'climb') {
    legacyRecords.push({ kind: 'retiredTopSkill', creatureId: l.id, topSkill: l.topSkill }); l.topSkill = null;
  }
  for(const l of old.lineage as Old[])l.mutations=l.mutations.filter((m:Old)=>{
    if(m.locus!=='climb')return true;
    legacyRecords.push({kind:'retiredMutation',creatureId:l.id,record:m});return false;
  });
  // Keep unrelated fields bit-for-bit. Removed data is retained separately for
  // historical inspection, and never participates in five-stat calculations.
  function retained(value: any, path: string): any {
    if (Array.isArray(value)) return value.filter(v => v !== 'climb').map((v, i) => retained(v, `${path}[${i}]`));
    if (!value || typeof value !== 'object') return value;
    const result: Old = {};
    for (const [key, v] of Object.entries(value)) {
      if (key === 'climb' || key === 'climbing_frame' || key === 'item:climbing_frame') {
        legacyRecords.push({ kind: 'removedField', path: `${path}.${key}`, value: v }); continue;
      }
      result[key] = retained(v, `${path}.${key}`);
    }
    return result;
  }
  old.world.items = old.world.items.filter((i: Old) => i.skill !== 'climb');
  old.sessions = []; old.social.sessions = [];
  old.events = old.events.filter((e: Old) => {
    if (e.socialResult?.skill === 'climb' || e.command?.skill === 'climb' || e.command?.skills?.includes('climb')) {
      legacyRecords.push({ kind: 'retiredEvent', record: e }); return false;
    } return true;
  });
  const state = retained(old, '$') as SaveState;
  (state as unknown as Old).schemaVersion = 11; state.rulesVersion = previous.rulesVersion;
  state.dynasty = { ...newDynastyState(state.clock.tick), legacyRecords };
  delete (state.dynasty as unknown as Old).calendarChangedAtTick;
  const day = Math.floor(state.clock.tick / previous.clock.dayTicks);
  state.dynasty.nextDerbyDay = (Math.floor(day / previous.dynasty.competitions.derbyDays) + 1) * previous.dynasty.competitions.derbyDays;
  state.dynasty.nextCupDay = (Math.floor(day / previous.dynasty.competitions.cupDays) + 1) * previous.dynasty.competitions.cupDays;
  return migrateCalendar(replaceHistoricalMap(state));
}
