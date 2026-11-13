import { emitJournal } from './event-output';
import { derivePhenotype } from './genetics/expression';
import { config } from '../data/config';
import type { Creature, LifeEvent, LineageRecord, SaveState } from './types';

export function newLineage(c: Creature, tick: number, parentIds: string[] | null = null): LineageRecord {
  return { awards: JSON.parse(JSON.stringify(c.awards)), id: c.id, organismId: c.organismId, displayName: c.displayName, parentIds, birthTick: tick,
    deathTick: null, finalStage: null, ageAtDeath: null, topSkill: null, endReason: null,
    origin: 'founder', generation: 0, birthAptitudes: derivePhenotype(c.genome).aptitudes, mutations: [] };
}

/** Mutates only a tick/command's private root and counters; event history is bounded; lineage compacts at maintenance boundaries. */
export function recordLifeEvent(state: SaveState, event: Omit<LifeEvent, 'id' | 'tick'>): void {
  const id = `e_${String(state.counters.event).padStart(8, '0')}`;
  state.counters.event += 1;
  const emitted = { ...event, id, tick: state.clock.tick };
  const previous = state.events;
  state.events = [...previous, emitted].slice(-config.lifecycle.eventLogLimit);
  emitJournal(previous, state.events, emitted);
}
