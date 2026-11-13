import { config } from '../data/config';
import { navigationTerrain } from './food-sources';
import { decodeTerrain, encodeTerrain, isSafeLand, tileCenter, tileIndex } from './map';
import { distance } from './navigation';
import { trainingSkill } from './skills';
import { nearestPoints, pointRows } from './nearest-points';
import type { Action, Creature, DeepReadonly, Point, SaveState, Skill, Terrain, TrainingSpot } from './types';

export function spotCells(spot: DeepReadonly<TrainingSpot>, width: number): number[] {
  return Array.from({ length: spot.width * spot.height }, (_, i) =>
    (spot.y + Math.floor(i / spot.width)) * width + spot.x + i % spot.width);
}

// Cache footprint geometry only. Terrain and live claims are always checked at the call site.
const approachGeometry = new WeakMap<DeepReadonly<TrainingSpot>, { key:string; indices:number[] }>();
export function trainingApproaches(spot: DeepReadonly<TrainingSpot>, terrain: readonly Terrain[], width: number, height: number): Point[] {
  const key=`${spot.x}:${spot.y}:${spot.width}:${spot.height}:${width}:${height}`;
  let geometry=approachGeometry.get(spot);
  if(geometry?.key!==key){
    const cells=new Set(spotCells(spot,width)),approaches=new Set<number>();
    for(const index of cells){
      const x=index%width,y=Math.floor(index/width);
      for(const p of [{x,y:y-1},{x:x-1,y},{x:x+1,y},{x,y:y+1}]){
        const i=p.y*width+p.x;
        if(p.x>=0&&p.y>=0&&p.x<width&&p.y<height&&!cells.has(i))approaches.add(i);
      }
    }
    geometry={key,indices:[...approaches].sort((a,b)=>a-b)};approachGeometry.set(spot,geometry);
  }
  // Fresh points prevent callers' movement/targets from modifying the derived cache.
  return geometry.indices.filter(i=>isSafeLand(terrain[i])).map(i=>tileCenter(i,width));
}

/** Five fixed dedicated props; swimming uses the existing pond's natural shoreline. */
export function withDefaultTraining(state: SaveState): SaveState {
  const terrain = [...navigationTerrain(state.world)], width = state.world.width;
  const reserved = new Set(state.world.looseFruit.map(f => tileIndex(f, width)));
  for (const c of state.creatures) {
    reserved.add(tileIndex(c.position, width));
    if (c.currentAction) [c.currentAction.target, ...c.currentAction.path].forEach(p => reserved.add(tileIndex(p, width)));
  }
  const base = decodeTerrain(state.world.terrainRle);
  // A small shallow practice pool makes swimming reachable alongside the garden activities.
  for (const definition of config.training.shallowPractice) {
    const options = terrain.flatMap((code, i) => code === 0 && !reserved.has(i) ? [i] : [])
      .sort((a, b) => (a % width - definition.x) ** 2 + (Math.floor(a / width) - definition.y) ** 2
        - (b % width - definition.x) ** 2 - (Math.floor(b / width) - definition.y) ** 2 || a - b);
    const i = options.find(i => shoreline(tileCenter(i, width), terrain, width, state.world.height));
    if (i === undefined) throw new Error('No safe location for shallow practice.');
    base[i] = 2; terrain[i] = 2; reserved.add(i);
  }
  const items: TrainingSpot[] = [];
  for (const [offset, definition] of config.training.defaults.entries()) {
    const options = terrain.flatMap((code, index) => isSafeLand(code) ? [index] : [])
      .sort((a, b) => (a % width - definition.x) ** 2 + (Math.floor(a / width) - definition.y) ** 2
        - (b % width - definition.x) ** 2 - (Math.floor(b / width) - definition.y) ** 2 || a - b);
    let chosen: TrainingSpot | undefined;
    for (const index of options) {
      const spot = { ...definition, x: index % width, y: Math.floor(index / width), id: `i_${String(state.counters.item + offset).padStart(8, '0')}` };
      if (spot.x + spot.width > width || spot.y + spot.height > state.world.height) continue;
      const cells = spotCells(spot, width);
      if (!cells.every(i => isSafeLand(terrain[i]) && !reserved.has(i))) continue;
      if (!trainingApproaches(spot, terrain, width, state.world.height).length) continue;
      chosen = spot; cells.forEach(i => { terrain[i] = 5; reserved.add(i); }); break;
    }
    if (!chosen) throw new Error('No safe location for a training spot.');
    items.push(chosen);
  }
  return { ...state, counters: { ...state.counters, item: state.counters.item + items.length },
    world: { ...state.world, items, terrainRle: encodeTerrain(base), terrainRevision: state.world.terrainRevision + 1 } };
}

function otherTraining(state: DeepReadonly<SaveState>, creature: DeepReadonly<Creature>) {
  const claims: DeepReadonly<Action>[]=[];
  for (const c of state.creatures) if(c.id!==creature.id && c.currentAction?.targetItemId)claims.push(c.currentAction);
  for (const s of state.social?.sessions ?? []) if(s.kind==='contest'&&s.skill&&s.targetItemId) for(const [i,id] of s.participants.entries()) if(id!==creature.id)
    claims.push({kind:config.skillCatalog[s.skill].trainingActivity,target:s.targets[i],targetItemId:s.targetItemId,targetFruitId:null,path:[],workTicks:s.workTicks});
  return claims;
}

export function validTraining(state: DeepReadonly<SaveState>, creature: DeepReadonly<Creature>, action: DeepReadonly<Action>, terrain: readonly Terrain[]): boolean {
  const skill = trainingSkill(action.kind);
  if (!skill) return false;
  if (action.targetItemId) {
    const item = state.world.items.find(i => i.id === action.targetItemId);
    const claims = otherTraining(state, creature);
    return !!item && item.skill === skill && claims.filter(a => a.targetItemId === item.id).length < config.training.capacity
      && !claims.some(a => distance(a.target, action.target) === 0)
      && trainingApproaches(item, terrain, state.world.width, state.world.height).some(p => distance(p, action.target) === 0);
  }
  const code = terrain[tileIndex(action.target, state.world.width)];
  if (skill === 'swim') return code === 3 || code === 2;
  return isSafeLand(code);
}

function shoreline(p: Point, terrain: readonly Terrain[], width: number, height: number): boolean {
  const x = Math.floor(p.x), y = Math.floor(p.y);
  return [{ x, y: y - 1 }, { x: x - 1, y }, { x: x + 1, y }, { x, y: y + 1 }]
    .some(p => p.x >= 0 && p.y >= 0 && p.x < width && p.y < height && isSafeLand(terrain[p.y * width + p.x]));
}

// A 30-agent habitat reuses the same immutable terrain; avoid scanning every tile per decision.
const naturalCache = new WeakMap<readonly Terrain[], Map<string, { rows: ReturnType<typeof pointRows>; nearest: Map<string,Point[]> }>>();
function naturalTargets(terrain: readonly Terrain[], width: number, height: number) {
  let dimensions=naturalCache.get(terrain);
  if(!dimensions){dimensions=new Map();naturalCache.set(terrain,dimensions);}
  const key=`${width}:${height}`;let result=dimensions.get(key);
  if(!result){
    const swim:Point[]=[];
    for(let i=0;i<terrain.length;i++){
      const code=terrain[i];if(code!==2&&code!==3)continue;
      const p=tileCenter(i,width);
      if(code===3||shoreline(p,terrain,width,height))swim.push(p);
    }
    result={rows:pointRows(swim),nearest:new Map()};dimensions.set(key,result);
  }
  return result;
}

export function trainingTargets(state: SaveState, creature: Creature, skill: Skill, terrain: readonly Terrain[]): { target: Point; targetItemId?: string }[] {
  const claims = otherTraining(state, creature);
  const targets: { target: Point; targetItemId?: string }[] = [];
  for (const item of state.world.items.filter(i => i.skill === skill)) {
    if (claims.filter(a => a.targetItemId === item.id).length >= config.training.capacity) continue;
    const approach = trainingApproaches(item, terrain, state.world.width, state.world.height)
      .filter(target => !claims.some(a => distance(a.target, target) === 0))
      .sort((a, b) => distance(a, creature.position) - distance(b, creature.position) || tileIndex(a, state.world.width) - tileIndex(b, state.world.width))[0];
    if (approach) targets.push({ target: approach, targetItemId: item.id });
  }
  if (skill === 'swim') {
    const entries=naturalTargets(terrain,state.world.width,state.world.height),key=`${state.world.width}:${state.world.height}:${creature.position.x}:${creature.position.y}`;
    const cached=entries.nearest.get(key);
    if(cached){entries.nearest.delete(key);entries.nearest.set(key,cached);targets.push(...cached.map(target=>({target:{...target}})));return targets;}
    const natural=nearestPoints(entries.rows,creature.position,config.ai.candidateCounts.perSkill);
    entries.nearest.set(key,natural);if(entries.nearest.size>config.world.navigationCacheEntries)entries.nearest.delete(entries.nearest.keys().next().value!);
    targets.push(...natural.slice(0, config.ai.candidateCounts.perSkill).map(target => ({ target:{...target} })));
  } else if (!targets.length && isSafeLand(terrain[tileIndex(creature.position, state.world.width)])) targets.push({ target: { ...creature.position } });
  return targets;
}

export function trainingQuality(action: Action, terrain: readonly Terrain[], width: number): number {
  return action.targetItemId || trainingSkill(action.kind) === 'swim' || terrain[tileIndex(action.target, width)] === 4
    ? config.skills.dedicatedQuality : config.skills.improvisedQuality;
}
