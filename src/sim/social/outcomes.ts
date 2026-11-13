import { policyReason } from '../mates';
import { config } from '../../data/config';
import { personalityTrait } from '../personality';
import { clamp } from '../needs';
import { changeRelationship, relationship, relationshipScores } from './relationships';
import { resolveInteraction } from './interaction';
import { rewardSocialExperience } from './drift';
import type { Creature, InteractionKind, InteractionResult, SaveState } from '../types';

export function commitSocialOutcome(state: SaveState, a: Creature, b: Creature, kind: InteractionKind, result: InteractionResult): void {
  if ((kind==='play'||kind==='comfort') && result.outcome==='friendly' && a.stage==='adult' && b.stage==='adult') {
    const current=relationship(state,a.organismId,b.organismId),r=config.dynasty.relationships;
    const count=(id:string)=>state.relationships.filter(e=>(e.a===id||e.b===id)&&relationshipScores(e,state.clock.tick).mateBond>=config.social.mateBondThreshold).length;
    const bonded=(current?.mateBond??0)>=config.social.mateBondThreshold;
    if((current?.bond??0)+result.bond>=r.mateMinimumScore && !policyReason(state,a,b)
      && (bonded || (count(a.organismId)<r.mateLimit && count(b.organismId)<r.mateLimit))) {
      let gain=bonded?r.mateReinforcement:r.mateGain;
      // Crossing the formation threshold must leave room for ordinary decay.
      if(!bonded && (current?.mateBond??0)+gain>=config.social.mateBondThreshold)
        gain=Math.max(gain,r.mateStartingBond-(current?.mateBond??0));
      result={...result,mateBond:result.mateBond+gain};
    }
  }
  changeRelationship(state, a.organismId, b.organismId, kind, result);
  for (const [i,c] of [a,b].entries()) {
    c.recentValence = clamp(c.recentValence + result.valence[i], ...config.food.valenceBounds);
    if (c.needs) c.needs.stress = clamp(c.needs.stress + result.stress[i]);
    c.social.lastInteraction = { kind, outcome: result.outcome, tick: state.clock.tick, partner: (i === 0 ? b : a).organismId };
    if (kind === 'play') rewardSocialExperience(c, result.outcome === 'rude' ? 'rudePlay' : 'friendlyPlay', state.clock.tick, i === 1);
    if (kind === 'contest' || kind === 'comfort') rewardSocialExperience(c, kind, state.clock.tick, i === 1);
  }
  const stats = state.social.statistics; stats.interactions++;
  if (kind === 'play') { if (result.outcome === 'rude') stats.rudePlays++; else stats.friendlyPlays++; }
}
export function completeCourtshipBond(state: SaveState, a: Creature, b: Creature): void {
  const before = relationship(state, a.organismId, b.organismId), stats = state.social.statistics;
  stats.matings++; if ((before?.mateBond ?? 0) >= config.social.mateBondThreshold) stats.bondedMatings++;
  if ((before?.bond ?? 0) >= config.social.friendBond) stats.friendMatings++;
  commitSocialOutcome(state, a, b, 'court', resolveInteraction(a, b, 'court', a.rng, config, before?.bond ?? 0));
}

/** The same relationship/memory/drift path for informal pairs and bounded formal groups. */
export function commitContestRelationship(state:SaveState,a:Creature,b:Creature,winnerId:string|null,valence:[number,number],scale=1):void{
  const t=config.social.contest,before=relationship(state,a.organismId,b.organismId);
  const competitive=[a,b].every(c=>personalityTrait(c,'competitiveness')>=t.competitivenessMinimum);
  commitSocialOutcome(state,a,b,'contest',{
    bond:scale*(t.bond+(winnerId&&before&&before.bond<=config.social.dislikedBond?before.bond>=config.social.friendBond?t.friendLossBond:t.rivalLossBond:0)-(competitive?t.rivalry:t.lowRivalry)),
    mateBond:0,valence,stress:[0,0],outcome:'neutral',rng:a.rng
  });
}
