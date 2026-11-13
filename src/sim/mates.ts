import { config, skillKeys, tasteKeys } from '../data/config';
import { derivePhenotype } from './genetics/expression';
import { personalityTrait } from './personality';
import { stageStartAge } from './life-stages';
import { clamp } from './needs';
import { permittedKinship } from './kinship';
import { distance } from './navigation';
import { relationship } from './social/relationships';
import { familyTie } from './social/family';
import { sociallyBusy } from './social/candidates';
import type { Creature, DeepReadonly, MateCompatibility, OrganismPair, SaveState } from './types';

type World = DeepReadonly<SaveState>;
type Agent = DeepReadonly<Creature>;
export const canonicalPair = (a: string, b: string): OrganismPair => a < b ? [a,b] : [b,a];
export function hasPair(pairs: readonly (readonly string[])[], a: string, b: string): boolean {
  return pairs.some(p => p.includes(a) && p.includes(b));
}
export function encouraged(state: World, a: Agent, b: Agent): boolean {
  const r = state.breedingRules;
  return r.encouragedIndividuals.includes(a.organismId) || r.encouragedIndividuals.includes(b.organismId)
    || hasPair(r.encouragedPairs,a.organismId,b.organismId) || hasPair(r.exclusivePairs,a.organismId,b.organismId);
}
export function policyReason(state: World, a: Agent, b: Agent): string | null {
  const r = state.breedingRules;
  if (a.id === b.id) return 'Same creature';
  if (r.blockedIndividuals.includes(a.organismId) || r.blockedIndividuals.includes(b.organismId)) return 'Individual blocked';
  if (hasPair(r.blockedPairs,a.organismId,b.organismId)) return 'Pair blocked';
  if (r.exclusivePairs.some(p => (p.includes(a.organismId) && !p.includes(b.organismId)) || (p.includes(b.organismId) && !p.includes(a.organismId)))) return 'Exclusively paired elsewhere';
  if (!permittedKinship(state,a.organismId,b.organismId)) return 'Disallowed relative';
  return null;
}
export function breedingReason(state: World, c: Agent, phase: 'entry' | 'working' | 'completion' = 'entry', ignoreSession = false): string | null {
  const b = config.breeding;
  if (!state.settings.autoBreed) return 'Autonomous breeding disabled';
  if (c.stage !== 'adult' || !c.needs) return 'Adults only';
  if (phase !== 'completion' && stageStartAge('elder',c.lifeIndex) - c.age < b.adultRemainingTicks) return 'Too close to elderhood';
  if (c.breeding.cooldownUntil > state.clock.tick) return 'Breeding cooldown';
  if (c.breeding.clutches >= b.maximumClutches) return 'Lifetime clutch limit';
  if (state.breedingRules.blockedIndividuals.includes(c.organismId)) return 'Individual blocked';
  const maximum = phase === 'completion' ? config.needs.urgentThreshold : b.needMaximum;
  if (c.needs.hunger >= maximum) return 'Hungry';
  if (c.needs.fatigue >= maximum) return 'Tired';
  if (c.needs.stress >= b.stressMaximum) return 'Stressed';
  if (phase !== 'completion' && c.mood < b.minimumMood) return 'Mood too low';
  if (!ignoreSession && sociallyBusy(state,c.id)) return 'In shared session';
  return null;
}
export function compatibility(state: World, a: Agent, b: Agent): MateCompatibility {
  const A = derivePhenotype(a.genome), B = derivePhenotype(b.genome);
  const traits = config.genes.filter(g => g.traitGroup === 'personality').map(g => g.trait as keyof Creature['personalityDrift']);
  const traitSimilarity = 1 - traits.reduce((n,k) => n + Math.abs(personalityTrait(a,k) - personalityTrait(b,k)),0) / traits.length;
  const tasteSimilarity = 1 - tasteKeys.reduce((n,k) => n + Math.abs(A.tasteBias[k] - B.tasteBias[k]),0) / tasteKeys.length;
  const geneticDifference = skillKeys.reduce((n,k) => n + Math.abs(A.aptitudes[k] - B.aptitudes[k]),0) / skillKeys.length;
  const r = relationship(state,a.organismId,b.organismId), bond=r?.bond??0, mateBond=r?.mateBond??0, hostility=Math.max(0,-bond), w=config.breeding.compatibilityWeights;
  const score = clamp(w.bond*Math.max(0,bond/100)+w.traits*traitSimilarity+w.taste*tasteSimilarity+w.diversity*geneticDifference
    +(state.dynasty.championOrganismId===b.organismId?config.dynasty.competitions.championAttraction:0)+config.breeding.mateBondWeight*mateBond/100-config.breeding.rivalryPenalty*hostility/100,0,1);
  return { creatureId:b.id,traitSimilarity,tasteSimilarity,geneticDifference,bond,mateBond,family:familyTie(state,a.organismId,b.organismId),score,
    encouraged:encouraged(state,a,b), reason:policyReason(state,a,b) ?? breedingReason(state,b)
      ?? (mateBond < config.social.mateBondThreshold ? 'Mate bond must form before breeding' : null)
      ?? (bond < config.breeding.minimumBond ? 'Needs a stronger bond' : null)
      ?? (score < config.breeding.minimumCompatibility ? 'Low compatibility' : null) };
}
function inMateRange(state:World,a:Agent,b:Agent):boolean {
  return b.id!==a.id&&(distance(a.position,b.position)<=config.breeding.radiusTiles
    ||(relationship(state,a.organismId,b.organismId)?.mateBond??0)>=config.social.mateBondThreshold);
}
export function hasEligibleMate(state:World,a:Agent,nearby:readonly Agent[]=state.creatures):boolean {
  return nearby.some(b=>inMateRange(state,a,b)&&!compatibility(state,a,b).reason);
}
export function mateCandidates(state: World, a: Agent, nearby: readonly Agent[] = state.creatures): MateCompatibility[] {
  return nearby.filter(b => inMateRange(state,a,b))
    .map(b => compatibility(state,a,b)).sort((x,y) => y.score-x.score || x.creatureId.localeCompare(y.creatureId));
}
export function occupiedSlots(state: World): number { return state.creatures.length + state.sessions.length; }
export function breedingPopulationTarget(state: World): number {
  const b=config.breeding,ratio=Math.min(1,state.world.plants.length/b.referenceSources);
  return Math.min(state.settings.capacity,b.foodCapacityFloor+(b.targetPopulation-b.foodCapacityFloor)*ratio);
}
export function breedingDensity(state: World): number {
  const b=config.breeding, ratio=Math.min(1,state.world.plants.length / b.referenceSources);
  const softCap=breedingPopulationTarget(state);
  const fullUntil=b.densityFullUntil*ratio;
  return softCap<=fullUntil ? Number(occupiedSlots(state)<softCap) : clamp((softCap-occupiedSlots(state))/(softCap-fullUntil),0,1);
}
