import { config, skillKeys } from '../../data/config';
import { findPath, distance } from '../navigation';
import { isSafeLand, terrainCost, tileIndex } from '../map';
import { trainingApproaches, trainingTargets, validTraining } from '../training';
import { skillAptitude } from '../genetics/expression';
import { uniform } from '../rng';
import type { Creature, Point, SaveState, Skill, Terrain } from '../types';

/** Reserves two valid nearby cells; contest practice uses an agreed reachable activity. */
export function meetingSite(state: SaveState, a: Creature, b: Creature, terrain: readonly Terrain[], contest: boolean) {
  const width=state.world.width, safe=(p:Point)=>p.x>=0&&p.y>=0&&p.x<width&&p.y<state.world.height&&isSafeLand(terrain[tileIndex(p,width)]);
  const local=[{x:Math.floor(b.position.x)+.5,y:Math.floor(b.position.y)+.5}];
  const adjacent=(p:Point,land=true)=>[{x:p.x-1,y:p.y},{x:p.x+1,y:p.y},{x:p.x,y:p.y-1},{x:p.x,y:p.y+1}]
    .filter(p=>land?safe(p):p.x>=0&&p.y>=0&&p.x<width&&p.y<state.world.height&&Number.isFinite(terrainCost(terrain[tileIndex(p,width)])));
  const candidates: {skill:Skill|null;item:string|null;first:Point;second:Point}[]=[];
  if(!contest){for(const first of local)for(const second of adjacent(first))if(safe(first))candidates.push({skill:null,item:null,first,second});}
  else for(const skill of skillKeys){
    const targets=trainingTargets(state,a,skill,terrain);
    for(const t of targets){
      const item=t.targetItemId ? state.world.items.find(i=>i.id===t.targetItemId) : undefined;
      // A contest claims two places atomically, not the one place an ordinary target needs.
      if(item){
        const ordinary=state.creatures.filter(c=>c.id!==a.id&&c.id!==b.id&&c.currentAction?.targetItemId===item.id).length;
        const shared=state.social.sessions.filter(s=>s.targetItemId===item.id).length*2;
        if(ordinary+shared+2>config.training.capacity)continue;
      }
      // Informal peers can use improvised land; water/boulder practice retains its ordinary validity.
      const options=item?trainingApproaches(item,terrain,width,state.world.height):adjacent(t.target,false);
      for(const second of options){
        if(distance(t.target,second)===0 || distance(t.target,second)>config.social.proximityTiles)continue;
        const trial={kind:config.skillCatalog[skill].trainingActivity,target:second,targetFruitId:null,...(item?{targetItemId:item.id}:{}),path:[],workTicks:0};
        if(!validTraining(state,b,trial,terrain))continue;
        candidates.push({skill,item:item?.id??null,first:t.target,second});break;
      }
    }
  }
  const reachable=candidates.flatMap(site=>{
    const A=findPath(terrain,width,state.world.height,a.position,site.first,a),B=findPath(terrain,width,state.world.height,b.position,site.second,b);
    return A&&B ? [{...site,paths:[A,B] as [Point[],Point[]]}] : [];
  });
  if(!reachable.length)return null;
  let chosen=reachable[0];
  if(contest){
    const skills=[...new Set(reachable.map(s=>s.skill!))],weights=skills.map(skill=>1+(skillAptitude(a,skill)+skillAptitude(b,skill))/2);
    const roll=uniform(a.rng);a.rng=roll.state;let pick=roll.value*weights.reduce((n,w)=>n+w,0),skill=skills[0];
    for(let i=0;i<skills.length;i++){pick-=weights[i];if(pick<=0){skill=skills[i];break;}}
    chosen=reachable.filter(s=>s.skill===skill).sort((x,y)=>distance(a.position,x.first)+distance(b.position,x.second)-distance(a.position,y.first)-distance(b.position,y.second))[0];
  }
  return{targets:[{...chosen.first},{...chosen.second}] as [Point,Point],paths:chosen.paths,skill:chosen.skill,targetItemId:chosen.item};
}
