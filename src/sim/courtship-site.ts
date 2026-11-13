import { isSafeLand, tileIndex } from './map';
import { distance, findPath, nearestTile } from './navigation';
import type { Creature, Point, SaveState, Terrain } from './types';

/** Find a shared patch of land near either partner. No nest or global queue. */
export function courtshipSite(state:SaveState,a:Creature,b:Creature,terrain:readonly Terrain[]){
  const width=state.world.width, height=state.world.height;
  const land=(p:Point)=>p.x>=0&&p.y>=0&&p.x<width&&p.y<height&&isSafeLand(terrain[tileIndex(p,width)]);
  const anchors=[a.position,b.position,{x:(a.position.x+b.position.x)/2,y:(a.position.y+b.position.y)/2}];
  const sites:{first:Point;second:Point;distance:number}[]=[],seen=new Set<string>();
  for(const anchor of anchors){
    const local={x:Math.floor(anchor.x)+.5,y:Math.floor(anchor.y)+.5};
    const first=land(local)?local:nearestTile(terrain,width,anchor,isSafeLand);if(!first)continue;
    for(const second of [{x:first.x-1,y:first.y},{x:first.x+1,y:first.y},{x:first.x,y:first.y-1},{x:first.x,y:first.y+1}]){
      const key=`${first.x}:${first.y}:${second.x}:${second.y}`;
      if(!land(second)||seen.has(key))continue;seen.add(key);
      sites.push({first,second,distance:distance(a.position,first)+distance(b.position,second)});
    }
  }
  sites.sort((a,b)=>a.distance-b.distance);
  for(const site of sites){
    const pathA=findPath(terrain,width,height,a.position,site.first,a),pathB=findPath(terrain,width,height,b.position,site.second,b);
    if(pathA&&pathB)return {nest:{...site.first},targets:[{...site.first},{...site.second}] as [Point,Point],paths:[pathA,pathB] as [Point[],Point[]]};
  }
  return null;
}
