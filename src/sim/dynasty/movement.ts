import { config } from '../../data/config';
import { skillLevel } from '../skills';
import { insideMap, tileIndex, terrainCost } from '../map';
import type { Creature, DeepReadonly, MovementMode, Point, Terrain } from '../types';
export const modeForTerrain = (code: Terrain): MovementMode => code === 3 || code === 2 ? 'swim' : code === 4 ? 'fly' : 'walk';
export function energyCapacity(c: DeepReadonly<Creature>): number {
  return config.dynasty.movement.baseEnergy + skillLevel(c,'stamina') * config.dynasty.movement.energyPerStamina;
}
export function effectiveRunning(c: DeepReadonly<Creature>, tick: number): number {
  return skillLevel(c,'run') * (c.dynasty.runningPenaltyUntil > tick ? 1-config.dynasty.relationships.fightPenalty : 1);
}
export function canFly(c: DeepReadonly<Creature>): boolean { return skillLevel(c,'fly') >= config.dynasty.movement.minimumFlight; }
export function movementSpeed(c: DeepReadonly<Creature>, mode: MovementMode, tick: number, fast: boolean): number {
  const m=config.dynasty.movement, level=mode==='walk'?effectiveRunning(c,tick):skillLevel(c,mode==='swim'?'swim':'fly');
  return m.normal[mode] * (fast ? 1 + level*m.bonusPerLevel : 1);
}
/** One interval, with mode/speed changes exactly at crossed tile boundaries. */
export function movePath(c: Creature, path: Point[], terrain: readonly Terrain[], width: number, tick: number): void {
  const m=config.dynasty.movement,d=c.dynasty;
  const height = terrain.length / width;
  const stop = () => { path.splice(0); c.currentAction = null; d.moving = false; };
  if (!insideMap(c.position, width, height)) { stop(); return; }
  let seconds=config.clock.tickSeconds;
  while(seconds>1e-9 && path.length) {
    const p=path[0];
    if (!insideMap(p, width, height)) { stop(); return; }
    const dx=p.x-c.position.x,dy=p.y-c.position.y,distance=Math.hypot(dx,dy);
    if(distance<1e-9){c.position={...p};path.shift();continue;}
    const ux=dx/distance,uy=dy/distance;
    // A tiny probe selects the terrain being entered when standing on a boundary.
    const code=terrain[tileIndex({x:c.position.x+ux*1e-8,y:c.position.y+uy*1e-8},width)];
    if(!Number.isFinite(terrainCost(code)) || (code===4&&!canFly(c))){path.splice(0);c.currentAction=null;return;}
    const mode=modeForTerrain(code);
    const toBoundary=Math.abs(ux)>1e-8 ? (ux>0?Math.floor(c.position.x+1e-8)+1-c.position.x:c.position.x-Math.ceil(c.position.x-1e-8)+1)/Math.abs(ux)
      : (uy>0?Math.floor(c.position.y+1e-8)+1-c.position.y:c.position.y-Math.ceil(c.position.y-1e-8)+1)/Math.abs(uy);
    if(!d.fast&&d.energy>=energyCapacity(c)*m.restartEnergyFraction)d.fast=true;
    if(d.energy<=0)d.fast=false;
    const speed=movementSpeed(c,mode,tick,d.fast);
    const energyTime=d.fast?d.energy/m.drainPerSecond:Infinity;
    const used=Math.min(seconds,distance/speed,toBoundary/speed,energyTime);
    if(used<=1e-10){d.fast=false;continue;}
    const travelled=speed*used;c.position.x+=ux*travelled;c.position.y+=uy*travelled;
    d.energy=Math.max(0,Math.min(energyCapacity(c),d.energy+(d.fast?-m.drainPerSecond:m.recoveryPerSecond)*used));
    d.moving=true;d.movementMode=mode;seconds-=used;
    if(distance-travelled<1e-8){c.position={...p};path.shift();}
  }
}
export function recoverEnergy(c:Creature):void {
  if(!c.dynasty.moving)c.dynasty.energy=Math.min(energyCapacity(c),c.dynasty.energy+config.dynasty.movement.recoveryPerSecond*config.clock.tickSeconds);
}
