import navigation from '../assets/dynasty/map-navigation.json';
import { config } from '../data/config';
import type { Point, Terrain } from './types';

export function createTerrain(): Terrain[] {
  return decodeTerrain(navigation.terrainRle as [Terrain, number][]);
}

export function encodeTerrain(terrain: readonly Terrain[]): [Terrain, number][] {
  const runs: [Terrain, number][] = [];
  for (const code of terrain) {
    const last = runs.at(-1);
    if (last?.[0] === code) last[1] += 1;
    else runs.push([code, 1]);
  }
  return runs;
}

export function decodeTerrain(runs: ReadonlyArray<readonly [Terrain, number]>): Terrain[] {
  return runs.flatMap(([code, count]) => Array<Terrain>(count).fill(code));
}

export function insideMap(point: Point, width: number, height: number): boolean {
  return Number.isFinite(point.x) && Number.isFinite(point.y) && point.x >= 0 && point.y >= 0 && point.x < width && point.y < height;
}

export function tileIndex(point: Point, width: number): number {
  return Math.floor(point.y) * width + Math.floor(point.x);
}

export function tileCenter(index: number, width: number): Point {
  return { x: index % width + 0.5, y: Math.floor(index / width) + 0.5 };
}

export function terrainCost(code: Terrain): number {
  const costs = config.world.terrainCosts;
  switch (code) {
    case 0: return costs.grass;
    case 1: return costs.soil;
    case 2: case 3: return config.world.walkBaseSpeed / config.dynasty.movement.normal.swim;
    case 4: return config.world.walkBaseSpeed / config.dynasty.movement.normal.fly;
    default: return Infinity;
  }
}

export function isSafeLand(code: Terrain): boolean {
  return code === 0 || code === 1;
}
