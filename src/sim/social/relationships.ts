import { config } from '../../data/config';
import { clamp } from '../needs';
import { recordLifeEvent } from '../life-records';
import { familyTie } from './family';
import type { DeepReadonly, InteractionKind, InteractionResult, Relationship, SaveState } from '../types';
type World = DeepReadonly<SaveState>;
const indexes = new WeakMap<World['relationships'], { length: number; pairs: Map<string, DeepReadonly<Relationship>> }>();
const key = (a: string, b: string) => a < b ? `${a}:${b}` : `${b}:${a}`;
function stored(state: World, a: string, b: string) {
  let index = indexes.get(state.relationships);
  if (!index || index.length !== state.relationships.length) {
    index = { length: state.relationships.length, pairs: new Map(state.relationships.map(r => [key(r.a, r.b), r])) }; indexes.set(state.relationships, index);
  }
  return index.pairs.get(key(a, b));
}
export function relationshipScores(r: DeepReadonly<Relationship>, tick: number): Pick<Relationship, 'bond' | 'mateBond'> {
  const s = config.social, elapsed = Math.max(0, tick - Math.max(r.lastDecayTick, r.lastContactTick + s.decayGraceDays * config.clock.dayTicks));
  const mateElapsed = Math.max(0, tick - Math.max(r.lastDecayTick, r.lastContactTick + s.mateDecayGraceDays * config.clock.dayTicks));
  return { bond: r.bond * Math.exp(-elapsed / (s.bondDecayDays * config.clock.dayTicks)),
    mateBond: r.mateBond * Math.exp(-mateElapsed / (s.mateDecayDays * config.clock.dayTicks)) };
}
export function decayRelationship(r: DeepReadonly<Relationship>, tick: number): Relationship {
  return { ...r, history: [...r.history], ...relationshipScores(r, tick), lastDecayTick: tick };
}
export function relationship(state: World, a: string, b: string): Relationship | null {
  const r = stored(state, a, b); return r ? decayRelationship(r, state.clock.tick) : null;
}
export const relationshipStrength = (r: DeepReadonly<Relationship>) => Math.abs(r.bond) + r.mateBond;
function event(state: SaveState, kind: 'friendship' | 'rivalry' | 'mateBondFormed' | 'mateBondBroken', r: Relationship) {
  const a = state.creatures.find(c => c.organismId === r.a), b = state.creatures.find(c => c.organismId === r.b);
  const A=a??state.lineage.slice().reverse().find(l=>l.organismId===r.a),B=b??state.lineage.slice().reverse().find(l=>l.organismId===r.b);
  if (A && B) recordLifeEvent(state, { kind, creatureId: A.id, relatedCreatureId: B.id, from: a?.stage??'elder', to: a?.stage??'elder' });
}
export function endMateBond(state:SaveState,r:Relationship):void{
  if(r.mateBond>=config.social.mateBondThreshold){state.social.statistics.mateBondsBroken++;event(state,'mateBondBroken',r);}
}
export function retainRelationships(state:SaveState,organismId:string,bond:number):void{
  state.relationships=state.relationships.map(old=>{
    if(old.a!==organismId&&old.b!==organismId)return old;
    const decayed=decayRelationship(old,state.clock.tick),r={...decayed,bond:decayed.bond*bond,mateBond:decayed.mateBond*bond};
    transitions(state,old,r);return r;
  });
}
function transitions(state: SaveState, old: DeepReadonly<Relationship>, r: Relationship) {
  const s = config.social, stats = state.social.statistics;
  if (old.bond < s.friendBond && r.bond >= s.friendBond) { stats.friendships++; event(state, 'friendship', r); }
  if (old.bond > s.dislikedBond && r.bond <= s.dislikedBond) { stats.rivalries++; event(state, 'rivalry', r); }
  if (old.mateBond < s.mateBondThreshold && r.mateBond >= s.mateBondThreshold) { stats.mateBondsFormed++; event(state, 'mateBondFormed', r); }
  if (old.mateBond >= s.mateBondThreshold && r.mateBond < s.mateBondThreshold) { stats.mateBondsBroken++; event(state, 'mateBondBroken', r); }
}
export function enforceRelationshipCaps(state: SaveState): void {
  const limits = config.social;
  const counts = new Map<string, number>(); for (const r of state.relationships) for (const id of [r.a, r.b]) counts.set(id, (counts.get(id) ?? 0) + 1);
  const sorted = [...state.relationships].sort((a, b) => relationshipStrength(a) - relationshipStrength(b) || key(a.a, a.b).localeCompare(key(b.a, b.b)));
  const remove = new Set<Relationship>(); let size = sorted.length;
  for (const r of sorted) if (size > limits.maximumRelationships || (counts.get(r.a) ?? 0) > limits.relationshipsPerCreature || (counts.get(r.b) ?? 0) > limits.relationshipsPerCreature) {
    remove.add(r); size--; counts.set(r.a, counts.get(r.a)! - 1); counts.set(r.b, counts.get(r.b)! - 1);
  }
  if (remove.size) {for(const r of remove)endMateBond(state,r);state.relationships = state.relationships.filter(r => !remove.has(r));}
}
export function ensureRelationship(state: SaveState, a: string, b: string): Relationship {
  const existing = stored(state, a, b) as Relationship | undefined;
  if (existing) {
    const next = decayRelationship(existing, state.clock.tick); transitions(state, existing, next);
    state.relationships = state.relationships.map(r => r === existing ? next : r); return next;
  }
  const A = state.lineage.find(l => l.organismId === a), B = state.lineage.find(l => l.organismId === b);
  const founder = A?.birthTick === 0 && B?.birthTick === 0 && A.origin === 'founder' && B.origin === 'founder';
  const r: Relationship = { a: a < b ? a : b, b: a < b ? b : a, bond: founder ? config.social.initialFounderBond : 0,
    mateBond: 0, lastContactTick: state.clock.tick, lastDecayTick: state.clock.tick, history: [] };
  state.relationships = [...state.relationships,r]; return r;
}
/** Common path for natural outcomes, family initialization and explicit player/debug changes. */
export function changeRelationship(state: SaveState, a: string, b: string, kind: InteractionKind, result: Pick<InteractionResult, 'bond' | 'mateBond' | 'outcome'>, absoluteBond?: number): void {
  const r = ensureRelationship(state, a, b), old = { ...r };
  // Explicit spectrum settings must not cross a boundary through subtract/add rounding.
  r.bond = clamp(absoluteBond ?? r.bond + result.bond, ...config.social.bondBounds);
  r.mateBond = clamp(r.mateBond + result.mateBond);
  if(r.bond<=config.dynasty.relationships.breakupScore)r.mateBond=0;
  r.lastContactTick = r.lastDecayTick = state.clock.tick;
  r.history = [...r.history, { kind, outcome: result.outcome, tick: state.clock.tick }].slice(-config.social.historyLimit);
  transitions(state, old, r); enforceRelationshipCaps(state);
}
export function initializeFamily(state: SaveState, id?: string): void {
  for (const a of state.creatures.filter(c => !id || c.id === id)) for (const b of state.creatures) {
    if (a.id === b.id || !a.needs || stored(state, a.organismId, b.organismId)) continue;
    const tie = familyTie(state, a.organismId, b.organismId); if (tie === 'none') continue;
    const r = ensureRelationship(state, a.organismId, b.organismId);
    r.bond = tie === 'sibling' ? config.social.newbornSiblingBond : config.social.newbornParentBond;
  }
  enforceRelationshipCaps(state);
}
export function maintainRelationships(state: SaveState): void {
  if (state.clock.tick < state.social.nextMaintenanceTick) return;
  state.social.nextMaintenanceTick = state.clock.tick + config.social.maintenanceTicks;
  state.relationships = state.relationships.flatMap(old => {
    const r = decayRelationship(old, state.clock.tick); transitions(state, old, r);
    return familyTie(state, r.a, r.b) === 'none' && Math.max(Math.abs(r.bond), r.mateBond) < config.social.pruneStrength ? [] : [r];
  });
  enforceRelationshipCaps(state);
}
