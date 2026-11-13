import { config } from '../../data/config';
import { clamp } from '../needs';
import { skillLevel } from '../skills';
import { uniform } from '../rng';
import { distance, findPath } from '../navigation';
import { navigationTerrain } from '../food-sources';
import { relationship, relationshipScores, changeRelationship } from '../social/relationships';
import { recordLifeEvent } from '../life-records';
import { sociallyBusy } from '../social/candidates';
import type { Creature, DeepReadonly, SaveState } from '../types';
export function relationshipLabel(score:number):'Foe'|'Neutral'|'Friend' {
  const r=config.dynasty.relationships;return score<=r.foeThreshold?'Foe':score>=r.friendThreshold?'Friend':'Neutral';
}
export function relationshipColor(score:number):string {
  const r=config.dynasty.relationships,t=clamp((score+100)/200,0,1);
  const channels=(hex:string)=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));
  const a=channels(r.foeColor),b=channels(r.friendColor);
  return '#'+a.map((v,i)=>Math.round(v+(b[i]-v)*t).toString(16).padStart(2,'0')).join('');
}
export function socialCounts(s:DeepReadonly<SaveState>,c:DeepReadonly<Creature>){
  let friends=0,foes=0,mates=0;
  for(const edge of s.relationships){
    if(edge.a!==c.organismId&&edge.b!==c.organismId)continue;
    const r=relationshipScores(edge,s.clock.tick),label=relationshipLabel(r.bond);
    if(label==='Friend')friends++;if(label==='Foe')foes++;if(r.mateBond>=config.social.mateBondThreshold)mates++;
  }
  return {friends,foes,mates};
}
export function lonelinessBreedingFactor(c:DeepReadonly<Creature>):number{return 1-config.dynasty.relationships.breedingLonelinessWeight*(c.needs?.loneliness??100)/100;}
export function advanceSocialLoneliness(s:SaveState,c:Creature):void {
  if(!c.needs)return;const counts=socialCounts(s,c),r=config.dynasty.relationships;
  c.needs.loneliness=clamp(c.needs.loneliness+((counts.friends===0?r.lonelyNoFriendsPerMinute:0)+counts.foes*r.lonelyPerFoePerMinute)*config.clock.tickSeconds/60);
}
function inReach(s:DeepReadonly<SaveState>,a:DeepReadonly<Creature>,b:DeepReadonly<Creature>):boolean{
  const limit=config.dynasty.relationships.proximity;if(distance(a.position,b.position)>limit)return false;
  const path=findPath(navigationTerrain(s.world),s.world.width,s.world.height,a.position,b.position,a);
  if(!path)return false;let p=a.position,length=0;for(const next of path){length+=distance(p,next);p=next;}return length<=limit;
}
function log(s:SaveState,a:Creature,b:Creature,kind:'share'|'steal'|'fight',outcome:'friendly'|'rude',bond:number){
  changeRelationship(s,a.organismId,b.organismId,kind,{bond,mateBond:0,outcome});
  for(const [c,other]of [[a,b],[b,a]])c.social.lastInteraction={kind,outcome,tick:s.clock.tick,partner:other.organismId};
  recordLifeEvent(s,{kind,creatureId:a.id,relatedCreatureId:b.id,from:a.stage,to:a.stage});
}
export function shareFood(s:SaveState,giver:Creature,receiver:Creature):boolean {
  const r=relationship(s,giver.organismId,receiver.organismId);
  if(!inReach(s,giver,receiver)||!r||(relationshipLabel(r.bond)!=='Friend'&&r.mateBond<config.social.mateBondThreshold)
    ||!giver.dynasty.food.length||receiver.dynasty.food.length>=config.dynasty.plants.carryCapacity)return false;
  receiver.dynasty.food.push(giver.dynasty.food.shift()!);log(s,giver,receiver,'share','friendly',config.dynasty.relationships.shareBond);return true;
}
export function stealFood(s:SaveState,thief:Creature,victim:Creature):boolean {
  const r=relationship(s,thief.organismId,victim.organismId);
  if(!inReach(s,thief,victim)||!r||relationshipLabel(r.bond)!=='Foe'||!victim.dynasty.food.length||thief.dynasty.food.length>=config.dynasty.plants.carryCapacity)return false;
  thief.dynasty.food.push(victim.dynasty.food.shift()!);log(s,thief,victim,'steal','rude',config.dynasty.relationships.stealBond);return true;
}
/** Foes with food each stake one actual berry. Ties use the seeded competition stream.
 * Without food on either side the fight is deferred; there is no invented stake. */
export function fight(s:SaveState,a:Creature,b:Creature):string|null {
  const r=relationship(s,a.organismId,b.organismId);
  if(!a.needs||!b.needs||!inReach(s,a,b)||!r||relationshipLabel(r.bond)!=='Foe'||!a.dynasty.food.length||!b.dynasty.food.length)return null;
  const strengthA=skillLevel(a,'strength'),strengthB=skillLevel(b,'strength');let aWins=strengthA>strengthB;
  if(strengthA===strengthB){const roll=uniform(s.rng.competition);s.rng.competition=roll.state;aWins=roll.value<.5;}
  const winner=aWins?a:b,loser=aWins?b:a;
  // Capacity limits gathering, never earned wagers: both actual stakes remain owned.
  winner.dynasty.food.push(loser.dynasty.food.shift()!);
  loser.dynasty.runningPenaltyUntil=s.clock.tick+config.dynasty.relationships.fightPenaltyDays*config.clock.dayTicks;
  log(s,winner,loser,'fight','rude',config.dynasty.relationships.fightBond);return winner.id;
}
/** Bounded local encounters. Stable creature order and seeded choices are saved. */
export function socialFoodEncounters(s:SaveState):void {
  const r=config.dynasty.relationships,handled=new Set<string>();
  for(const a of s.creatures){
    if(!a.needs||s.clock.tick<a.dynasty.nextSocialTick||sociallyBusy(s,a.id)||handled.has(a.id))continue;
    a.dynasty.nextSocialTick=s.clock.tick+r.socialIntervalTicks;
    for(const b of s.creatures){
      if(a.id===b.id||!b.needs||handled.has(b.id)||sociallyBusy(s,b.id)||!inReach(s,a,b))continue;
      const edge=relationship(s,a.organismId,b.organismId);if(!edge)continue;
      let acted=false;
      if((relationshipLabel(edge.bond)==='Friend'||edge.mateBond>=config.social.mateBondThreshold)&&b.needs.hunger>=r.shareHunger&&a.dynasty.food.length>b.dynasty.food.length)acted=shareFood(s,a,b);
      if(relationshipLabel(edge.bond)==='Foe'){
        const roll=uniform(a.rng);a.rng=roll.state;
        if(roll.value<r.fightChance)acted=fight(s,a,b)!==null;
        if(!acted){const steal=uniform(a.rng);a.rng=steal.state;if(steal.value<r.stealChance)acted=stealFood(s,a,b);}
      }
      if(acted){handled.add(a.id);handled.add(b.id);b.dynasty.nextSocialTick=s.clock.tick+r.socialIntervalTicks;break;}
    }
  }
}
