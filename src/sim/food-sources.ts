import { prizeKey } from './competition/inventory';
import { recordLifeEvent } from './life-records';
import { config, skillKeys } from '../data/config';
import { decodeTerrain, tileIndex } from './map';
import { distance, reachable } from './navigation';
import { uniform } from './rng';
import type { Action, CarriedBerry, Creature, DeepReadonly, FoodTarget, FruitKind, FruitSource, Point, SaveState, Terrain } from './types';
type WorldView=DeepReadonly<SaveState>;
const navigationCache=new WeakMap<WorldView['world']['terrainRle'],Terrain[]>();
export function navigationTerrain(world:WorldView['world']):Terrain[]{
  let t=navigationCache.get(world.terrainRle);if(!t){t=decodeTerrain(world.terrainRle);navigationCache.set(world.terrainRle,t);}return t;
}
export function plantApproaches(plant:DeepReadonly<FruitSource>,_terrain:readonly Terrain[],_width:number,_height:number):Point[]{return [{x:plant.x+.5,y:plant.y+.5}];}
function random(state:SaveState):number{const draw=uniform(state.rng.world);state.rng.world=draw.state;return draw.value;}
export function spawnPlant(state:SaveState):boolean{
  const p=config.dynasty.plants;if(state.world.plants.length>=p.maximum)return false;
  const terrain=navigationTerrain(state.world),water=random(state)<p.waterShare;
  const cells=terrain.flatMap((code,i)=>(water?code===3:code===0)?[i]:[]);
  for(let attempt=0;attempt<p.spawnAttempts&&cells.length;attempt++){
    const cell=cells[Math.floor(random(state)*cells.length)],x=cell%state.world.width,y=Math.floor(cell/state.world.width);
    if(state.world.plants.some(other=>Math.hypot(other.x-x,other.y-y)<p.spacing))continue;
    const skill=skillKeys[Math.floor(random(state)*skillKeys.length)],kind=config.dynasty.stats[skill].fruit;
    const fruitId=()=>`f_${String(state.counters.fruit++).padStart(8,'0')}`;
    state.world.plants.push({id:`p_${String(state.counters.plant++).padStart(8,'0')}`,kind,x,y,matureAtTick:state.clock.tick,ripe:2,growthProgress:0,berries:[true,true],berryIds:[fruitId(),fruitId()]});
    return true;
  }
  return false;
}
export function withDefaultSources(state:SaveState):SaveState{
  const next={...state,rng:{...state.rng},counters:{...state.counters},world:{...state.world,plants:[] as FruitSource[]}};
  for(let i=0;i<config.dynasty.plants.initial;i++)spawnPlant(next);
  return next;
}
/** Apply a smaller plant limit to an existing world without touching owned food,
 * RNG, ancestry or prizes. Keep the land/water mix and spread retained plant IDs. */
export function trimPlants(state:SaveState):void {
  const maximum=config.dynasty.plants.maximum,plants=state.world.plants;
  if(plants.length<=maximum)return;
  const terrain=navigationTerrain(state.world),water=plants.filter(p=>terrain[p.y*state.world.width+p.x]===3),land=plants.filter(p=>terrain[p.y*state.world.width+p.x]!==3);
  const waterCount=Math.round(water.length*maximum/plants.length),keep=new Set<string>();
  for(const [group,count] of [[water,waterCount],[land,maximum-waterCount]] as const)
    for(let i=0;i<count;i++)keep.add(group[Math.floor(i*group.length/count)].id);
  state.world.plants=plants.filter(p=>keep.has(p.id));
}
export function growSources(state:SaveState,_start:number,end:number):void{
  trimPlants(state);
  if(end<state.dynasty.nextPlantTick)return;
  state.dynasty.nextPlantTick=end+config.dynasty.plants.spawnEveryTicks;spawnPlant(state);
}
export function availableFood(state:WorldView,c:DeepReadonly<Creature>,terrain:readonly Terrain[]):FoodTarget[]{
  const foods:FoodTarget[]=c.dynasty.food.map(f=>({fruit:f.kind,target:{...c.position},targetFruitId:f.id}));
  for(const f of state.world.looseFruit)if((!f.prize?.ownerId||f.prize.ownerId===c.id)&&reachable(terrain,state.world.width,state.world.height,c.position,f,c))
    foods.push({fruit:f.kind,target:{x:f.x,y:f.y},targetFruitId:f.id});
  for(const plant of state.world.plants){
    if(plant.matureAtTick>state.clock.tick)continue;
    const target={x:plant.x+.5,y:plant.y+.5};
    if(!reachable(terrain,state.world.width,state.world.height,c.position,target,c))continue;
    for(let i=0;i<2;i++)if(plant.berries?.[i])foods.push({fruit:plant.kind,target,targetFruitId:plant.berryIds![i],targetPlantId:plant.id});
  }
  return foods;
}
export function foodKind(state:WorldView,action:Pick<Action,'targetFruitId'|'targetPlantId'>):FruitKind|null{
  if(action.targetPlantId)return state.world.plants.find(p=>p.id===action.targetPlantId)?.kind??null;
  return state.world.looseFruit.find(f=>f.id===action.targetFruitId)?.kind??state.creatures.flatMap(c=>c.dynasty.food).find(f=>f.id===action.targetFruitId)?.kind??null;
}
export function validFoodClaim(state:WorldView,c:DeepReadonly<Creature>,a:DeepReadonly<Action>):boolean{
  if(a.targetPlantId){const p=state.world.plants.find(p=>p.id===a.targetPlantId),i=p?.berryIds?.indexOf(a.targetFruitId??'')??-1;
    return !!p&&i>=0&&!!p.berries?.[i]&&p.matureAtTick<=state.clock.tick&&distance(a.target,{x:p.x+.5,y:p.y+.5})===0;}
  if(c.dynasty.food.some(f=>f.id===a.targetFruitId))return a.kind==='eat'&&distance(a.target,c.position)===0;
  return state.world.looseFruit.some(f=>f.id===a.targetFruitId&&(!f.prize?.ownerId||f.prize.ownerId===c.id)&&distance(f,a.target)===0);
}
/** Called only after physical arrival; a token leaves exactly one owner/container. */
export function harvestFood(state:SaveState,c:Creature):CarriedBerry|null{
  const a=c.currentAction;if(!a||a.path.length||distance(c.position,a.target)>1e-8||!validFoodClaim(state,c,a))return null;
  const kind=foodKind(state,a)!;const berry={id:a.targetFruitId!,kind};
  if(a.targetPlantId){const p=state.world.plants.find(p=>p.id===a.targetPlantId)!,i=p.berryIds!.indexOf(a.targetFruitId!);
    p.berries![i]=false;p.ripe--;if(!p.ripe)state.world.plants=state.world.plants.filter(other=>other.id!==p.id);
  }else if(c.dynasty.food.some(f=>f.id===a.targetFruitId))c.dynasty.food=c.dynasty.food.filter(f=>f.id!==a.targetFruitId);
  else {
    const f=state.world.looseFruit.find(f=>f.id===a.targetFruitId)!;
    if(f.prize){if(a.kind!=='eat')return null;const key=prizeKey({kind:'fruit',id:kind});state.prizeLedger.eaten[key]=(state.prizeLedger.eaten[key]??0)+1;state.prizeLedger.rareFruitEaten++;
      recordLifeEvent(state,{kind:'prizeFruitEaten',creatureId:c.id,from:c.stage,to:c.stage,relatedCreatureId:null,competitionEvent:{id:f.prize.competitionId,reason:`Ate prize ${kind}`}});}
    state.world.looseFruit=state.world.looseFruit.filter(f=>f.id!==a.targetFruitId);
  }
  return berry;
}
export function consumeFood(state:SaveState,c:Creature):FruitKind|null{return harvestFood(state,c)?.kind??null;}
export function foodTerrain(state:WorldView,p:Point):Terrain{return navigationTerrain(state.world)[tileIndex(p,state.world.width)];}
