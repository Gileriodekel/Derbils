import { config, skillKeys } from '../data/config';
import { config as previous, validateState as validatePrevious } from './legacy/v11.js';
import { stageStartAge } from '../sim/life-stages';
import { newDynastyState } from '../sim/dynasty/state';
import type { SaveState } from '../sim/types';

/** Validate under the old rules first. Keep absolute ticks, histories and RNG;
 * convert stage progress and remaining calendar-based timers exactly once. */
export function migrateCalendar(value: unknown): SaveState {
  const issues = validatePrevious(value, previous);
  if (issues.length) throw new Error(issues.map(i => `${i.path}: ${i.message}`).join('\n'));
  const state = structuredClone(value) as SaveState, tick = state.clock.tick;
  const ratio = config.clock.dayTicks / previous.clock.dayTicks;
  const deadline = (until: number) => until <= tick ? until : tick + Math.ceil((until - tick) * ratio);
  for (const c of state.creatures) {
    const elapsed = tick - c.stageStartedTick;
    const progress = Math.floor(elapsed * config.lifecycle.stages[c.stage].durationTicks / previous.lifecycle.stages[c.stage].durationTicks);
    c.age = stageStartAge(c.stage, c.lifeIndex) + progress;
    c.stageStartedTick = tick - progress;
    c.breeding.cooldownUntil = deadline(c.breeding.cooldownUntil);
    c.breeding.nextAttemptTick = Math.min(c.breeding.nextAttemptTick,tick+config.breeding.attemptIntervalTicks);
    c.dynasty.runningPenaltyUntil = deadline(c.dynasty.runningPenaltyUntil);
    for (const modifier of c.appearanceModifiers) modifier.expiresTick = deadline(modifier.expiresTick);
    // New calendar boundary: preserve earned XP; restart only daily allowances.
    for (const skill of skillKeys) { c.practiceTicks[skill] = 0; c.social.rivalExtraXpToday[skill] = 0; }
  }
  for (const session of state.social.sessions) {
    session.workTicks = Math.floor(session.workTicks * config.actions[session.kind].workTicks / previous.actions[session.kind].workTicks);
  }
  for (const session of state.sessions) {
    session.workTicks = Math.floor(session.workTicks * config.breeding.courtshipWorkTicks / previous.breeding.courtshipWorkTicks);
  }
  for (const life of [...state.creatures, ...state.lineage]) life.awards.confidenceUntilTick = deadline(life.awards.confidenceUntilTick);
  for (const r of state.relationships) {
    const elapsed = Math.max(0, tick - Math.max(r.lastDecayTick, r.lastContactTick + previous.social.decayGraceDays * previous.clock.dayTicks));
    const mateElapsed = Math.max(0, tick - Math.max(r.lastDecayTick, r.lastContactTick + previous.social.mateDecayGraceDays * previous.clock.dayTicks));
    r.bond *= Math.exp(-elapsed / (previous.social.bondDecayDays * previous.clock.dayTicks));
    r.mateBond *= Math.exp(-mateElapsed / (previous.social.mateDecayDays * previous.clock.dayTicks));
    r.lastContactTick = tick - Math.floor((tick - r.lastContactTick) * ratio);
    r.lastDecayTick = tick;
  }
  // Never award a backlog of daily caches or competitions on import.
  state.world.lastCacheDay = Math.floor(tick / config.clock.dayTicks);
  state.world.nextImmigrationTick = deadline(state.world.nextImmigrationTick);
  const schedule = newDynastyState(tick);
  state.dynasty.nextDerbyDay = schedule.nextDerbyDay;
  state.dynasty.nextCupDay = schedule.nextCupDay;
  state.dynasty.calendarChangedAtTick = tick;
  state.schemaVersion = 12; state.rulesVersion = config.rulesVersion;
  return state;
}
