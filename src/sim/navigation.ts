import { config } from '../data/config';
import { terrainCost, tileCenter, tileIndex } from './map';
import { canFly } from './dynasty/movement';
import type { Creature, DeepReadonly, Point, Terrain } from './types';
export const distance=(a:Point,b:Point)=>Math.abs(a.x-b.x)+Math.abs(a.y-b.y);
function neighbors(i:number,w:number,h:number):number[]{const x=i%w,y=Math.floor(i/w);return [y?i-w:-1,x?i-1:-1,x<w-1?i+1:-1,y<h-1?i+w:-1].filter(n=>n>=0);}
const regions=new WeakMap<readonly Terrain[],Map<string,Int32Array>>();
function components(t:readonly Terrain[],w:number,h:number,flight:boolean):Int32Array {
  let cache=regions.get(t);if(!cache){cache=new Map();regions.set(t,cache);}const key=`${w}:${h}:${flight}`;
  const old=cache.get(key);if(old)return old;
  const labels=new Int32Array(t.length);let group=0;
  for(let i=0;i<t.length;i++){
    if(labels[i]||!Number.isFinite(terrainCost(t[i]))||(!flight&&t[i]===4))continue;
    const queue=[i];labels[i]=++group;
    for(let k=0;k<queue.length;k++)for(const n of neighbors(queue[k],w,h))if(!labels[n]&&Number.isFinite(terrainCost(t[n]))&&(flight||t[n]!==4)){labels[n]=group;queue.push(n);}
  }
  cache.set(key,labels);return labels;
}
export function reachable(terrain:readonly Terrain[],width:number,height:number,from:Point,to:Point,c?:DeepReadonly<Creature>):boolean {
  if(![from,to].every(p=>p.x>=0&&p.y>=0&&p.x<width&&p.y<height))return false;
  const groups=components(terrain,width,height,!c||canFly(c));
  const a=groups[tileIndex(from,width)],b=groups[tileIndex(to,width)];return !!a&&a===b;
}
const pathCaches = new WeakMap<readonly Terrain[], Map<string, number[]>>();
function exactPath(ids:readonly number[],width:number,from:Point,to:Point):Point[]{
  const path:Point[]=[];let cursor=from;
  for(const point of [...ids.map(i=>tileCenter(i,width)),to]){
    if(cursor.x!==point.x)path.push({x:point.x,y:cursor.y});
    if(cursor.y!==point.y)path.push({...point});cursor=point;
  }
  return path;
}
/** Cardinal A* with a stable binary heap; never skips a terrain boundary. */
export function findPath(terrain:readonly Terrain[],width:number,height:number,from:Point,to:Point,c?:DeepReadonly<Creature>):Point[]|null {
  if(!reachable(terrain,width,height,from,to,c))return null;
  if(distance(from,to)===0)return [];
  const start=tileIndex(from,width),goal=tileIndex(to,width),flight=!c||canFly(c);
  let cache=pathCaches.get(terrain);if(!cache){cache=new Map();pathCaches.set(terrain,cache);}
  const key=`${width}:${height}:${flight}:${start}:${goal}`,cached=cache.get(key);
  if(cached){cache.delete(key);cache.set(key,cached);return exactPath(cached,width,from,to);}
  const costs=new Float64Array(terrain.length);costs.fill(Infinity);costs[start]=0;
  const previous=new Int32Array(terrain.length);previous.fill(-1);
  const heap:{index:number;priority:number;cost:number}[]=[];
  const less=(a:typeof heap[number],b:typeof heap[number])=>a.priority<b.priority||(a.priority===b.priority&&a.index<b.index);
  function push(item:typeof heap[number]){heap.push(item);let i=heap.length-1;while(i){const p=(i-1)>>1;if(!less(heap[i],heap[p]))break;[heap[i],heap[p]]=[heap[p],heap[i]];i=p;}}
  function pop(){const first=heap[0],last=heap.pop()!;if(heap.length){heap[0]=last;let i=0;while(true){let n=i,l=2*i+1,r=l+1;if(l<heap.length&&less(heap[l],heap[n]))n=l;if(r<heap.length&&less(heap[r],heap[n]))n=r;if(n===i)break;[heap[i],heap[n]]=[heap[n],heap[i]];i=n;}}return first;}
  const heuristic=(i:number)=>distance(tileCenter(i,width),tileCenter(goal,width))/config.world.walkBaseSpeed;
  push({index:start,priority:heuristic(start),cost:0});
  while(heap.length){
    const row=pop(),current=row.index;if(row.cost!==costs[current])continue;
    if(current===goal){
      const ids=[goal];while(ids[ids.length-1]!==start)ids.push(previous[ids[ids.length-1]]);ids.reverse();
      cache.set(key,ids);if(cache.size>config.world.navigationCacheEntries)cache.delete(cache.keys().next().value!);
      return exactPath(ids,width,from,to);
    }
    for(const n of neighbors(current,width,height)){
      if(!flight&&terrain[n]===4)continue;
      const tentative=costs[current]+terrainCost(terrain[n])/config.world.walkBaseSpeed;
      if(tentative<costs[n]){costs[n]=tentative;previous[n]=current;push({index:n,priority:tentative+heuristic(n),cost:tentative});}
    }
  }
  return null;
}
const nearestCaches = new WeakMap<readonly Terrain[], Map<string, Point|null>>();
export function nearestTile(terrain:readonly Terrain[],width:number,from:Point,accepts:(code:Terrain)=>boolean):Point|null {
  let cache=nearestCaches.get(terrain);if(!cache){cache=new Map();nearestCaches.set(terrain,cache);}
  const mask=([0,1,2,3,4,5] as Terrain[]).filter(accepts).join(','),key=`${width}:${from.x}:${from.y}:${mask}`;
  const cached=cache.get(key);if(cached!==undefined){cache.delete(key);cache.set(key,cached);return cached?{...cached}:null;}
  let best=Infinity,result:Point|null=null;
  for(let index=0;index<terrain.length;index++){if(!accepts(terrain[index]))continue;const point=tileCenter(index,width),d=distance(point,from);if(d<best){best=d;result=point;}}
  cache.set(key,result);if(cache.size>config.world.navigationCacheEntries)cache.delete(cache.keys().next().value!);
  return result?{...result}:null;
}
