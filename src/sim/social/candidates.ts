import { config, needKeys, skillKeys } from '../../data/config';
import { clamp, urgentNeed } from '../needs';
import { personalityTrait } from '../personality';
import { skillLevel } from '../skills';
import { distance } from '../navigation';
import { isSafeLand, tileIndex } from '../map';
import { relationship, relationshipScores } from './relationships';
import { policyReason } from '../mates';
import type { Candidate, Creature, DeepReadonly, SaveState, SocialKind, Terrain } from '../types';
import type { SpatialIndex } from './spatial';

export function sociallyBusy(state: DeepReadonly<SaveState>, id: string): boolean {
  return state.competitions.some(e=>e.entrantIds.includes(id)) || state.sessions.some(s => s.participants.includes(id)) || (state.social?.sessions ?? []).some(s => s.participants.includes(id));
}
/** Meeting a potential mate has value before the pair already has a mate bond.
 * Needs, family policy and both partners' mate limits still gate this interest. */
function mateSeekingInterest(state: DeepReadonly<SaveState>, a: DeepReadonly<Creature>, b: DeepReadonly<Creature>): number {
  if(!state.settings.autoBreed || [a,b].some(c=>c.stage!=='adult'||!c.needs||c.needs.hunger>=config.breeding.needMaximum
    ||c.needs.fatigue>=config.breeding.needMaximum||c.needs.stress>=config.breeding.stressMaximum
    ||c.breeding.clutches>=config.breeding.maximumClutches) || policyReason(state,a,b)) return 0;
  const r=relationship(state,a.organismId,b.organismId);
  if((r?.bond??0)<0 || (r?.mateBond??0)>=config.social.mateBondThreshold) return 0;
  const count=(id:string)=>state.relationships.filter(r=>(r.a===id||r.b===id)
    &&relationshipScores(r,state.clock.tick).mateBond>=config.social.mateBondThreshold).length;
  const mates=count(a.organismId);
  return mates<config.dynasty.relationships.mateLimit && count(b.organismId)<config.dynasty.relationships.mateLimit
    ? (config.social.mateSeekingInterest+config.social.mateProgressInterest*Math.max(0,r?.bond??0)/100)/(1+mates) : 0;
}
export function socialCandidate(state: DeepReadonly<SaveState>, a: DeepReadonly<Creature>, b: DeepReadonly<Creature>, kind: SocialKind | 'avoid', recipient = false): Candidate {
  const s = config.social, r = relationship(state, a.organismId, b.organismId), effects = kind === 'comfort' && recipient ? s.comfortRecipientEffects : config.actions[kind].effects;
  let target = { ...b.position };
  if (kind === 'avoid') {
    const dx = a.position.x-b.position.x, dy = a.position.y-b.position.y, length = Math.hypot(dx,dy) || 1;
    target = { x: a.position.x + (dx || (dy ? 0 : 1)) / length * s.avoidDistanceTiles, y: a.position.y + dy / length * s.avoidDistanceTiles };
  }
  const fit = kind === 'play' ? personalityTrait(a,'sociability') : kind === 'comfort' ? personalityTrait(a,'gentleness')
    : kind === 'contest' ? personalityTrait(a,'competitiveness') : 1-personalityTrait(a,'sociability');
  return { kind, target, targetFruitId: null, targetCreatureId: b.id,
    relief: Object.fromEntries(needKeys.map(k => [k,Math.max(0,-effects[k])])) as Candidate['relief'],
    personalityFit: fit, preference: kind === 'avoid' ? 0 : a.social.preferences[kind].learnedMean, growthInterest: 0,
    socialAffinity: kind === 'avoid' ? clamp(-(r?.bond ?? 0)/100,0,1) : kind === 'contest'
      ? clamp(s.contestAffinityWeights[0]*(r?.bond ?? 0)/100+s.contestAffinityWeights[1]*Math.max(0,-(r?.bond ?? 0))/100,-1,1)
      : clamp((r?.bond ?? 0)/100+s.mateAffinityWeight*(r?.mateBond ?? 0)/100,-1,1), encouragement: 0,
    courtshipInterest: kind==='play'||kind==='comfort'?mateSeekingInterest(state,a,b):0,
    estimatedTravelSeconds: distance(a.position,target)/config.world.walkBaseSpeed, predictedFatigueIncrease: Math.max(0,effects.fatigue) };
}
/** Timers and partner IDs are authoritative; the grid itself is only a per-tick read index. */
export function socialCandidates(state: SaveState, c: Creature, index: SpatialIndex, terrain: readonly Terrain[]): Candidate[] {
  const s = config.social;
  if (state.clock.tick >= c.social.nextTargetTick) {
    const nearby = index.query(c.position,c.id);
    const mates=state.relationships.filter(r=>(r.a===c.organismId||r.b===c.organismId)&&relationshipScores(r,state.clock.tick).mateBond>=s.mateBondThreshold).length;
    const mateInterest=(b:DeepReadonly<Creature>)=>{
      const r=relationship(state,c.organismId,b.organismId);
      return c.stage==='adult'&&b.stage==='adult'&&c.breeding.clutches<config.breeding.maximumClutches
        &&b.breeding.clutches<config.breeding.maximumClutches&&(r?.bond??0)>=0&&!policyReason(state,c,b)
        &&((r?.mateBond??0)>=s.mateBondThreshold||mates<config.dynasty.relationships.mateLimit)?s.targetMateWeight:0;
    };
    c.social.nextTargetTick = state.clock.tick+s.targetIntervalTicks;
    c.social.targets = nearby.filter(b=>b.needs&&!sociallyBusy(state,b.id)&&!urgentNeed(b)&&b.needs.stress<config.skills.stressExclusionThreshold)
      .map(b => ({ b, score: s.targetBondWeight*(relationship(state,c.organismId,b.organismId)?.bond ?? 0)/100
      +mateInterest(b)+s.targetLonelinessWeight*(b.needs?.loneliness ?? 0)/100-distance(c.position,b.position)/s.targetDistanceScale }))
      .sort((a,b) => b.score-a.score || a.b.id.localeCompare(b.b.id)).slice(0,s.targetLimit).map(p => p.b.organismId);
    c.social.rivalBoosts = {};
    for (const b of nearby) {
      const r = relationship(state,c.organismId,b.organismId); if (!r || r.bond > s.dislikedBond) continue;
      for (const skill of skillKeys) {
        const fit = Math.max(0,1-Math.abs(skillLevel(c,skill)-skillLevel(b,skill))/s.rivalry.skillGap);
        const amount = fit*s.rivalry.xpBoost;
        if (amount > (c.social.rivalBoosts[skill]?.amount ?? 0)) c.social.rivalBoosts[skill]={amount,expiresTick:c.social.nextTargetTick};
      }
    }
  }
  const result: Candidate[] = [];
  for (const id of c.social.targets) {
    const b = index.organisms.get(id); if (!b?.needs || b.id===c.id || Math.hypot(c.position.x-b.position.x,c.position.y-b.position.y)>s.radiusTiles) continue;
    const r = relationship(state,c.organismId,b.organismId), close = distance(c.position,b.position)<=s.avoidRadiusTiles;
    const kind: SocialKind | 'avoid' = (r?.bond ?? 0)<=s.dislikedBond && close ? 'avoid'
      : b.needs.stress>=s.comfortStressMinimum && personalityTrait(c,'gentleness')>=s.comfortGentleness ? 'comfort'
      : 'play';
    if (kind !== 'avoid' && (sociallyBusy(state,b.id) || urgentNeed(b) || b.needs.stress>=config.skills.stressExclusionThreshold)) continue;
    const candidate=socialCandidate(state,c,b,kind);
    if (kind==='avoid') {
      const p={x:Math.floor(candidate.target.x)+.5,y:Math.floor(candidate.target.y)+.5};
      if(p.x<0||p.y<0||p.x>=state.world.width||p.y>=state.world.height||!isSafeLand(terrain[tileIndex(p,state.world.width)]))continue;
      candidate.target=p;
    }
    result.push(candidate);
    if(kind!=='avoid'&&(c.social.contestCooldowns[id]??0)<=state.clock.tick&&(b.social.contestCooldowns[c.organismId]??0)<=state.clock.tick)
      result.push(socialCandidate(state,c,b,'contest'));
  }
  return result;
}
