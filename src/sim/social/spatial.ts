import { config } from '../../data/config';
import type { Creature, DeepReadonly, Point } from '../types';
type Agent = DeepReadonly<Creature>;
export interface SpatialIndex { organisms: ReadonlyMap<string, Agent>; query(point: DeepReadonly<Point>, exclude?: string): Agent[]; operations(): { indexed: number; queries: number; inspected: number } }
/** One linear build; bucket queries inspect a fixed budget even in a crowded clearing. */
export function buildSpatialIndex(creatures: readonly Agent[], tick = 0): SpatialIndex {
  const s = config.social, buckets = new Map<string, Agent[]>(); let queries = 0, inspected = 0;
  const cell = (p: DeepReadonly<Point>) => ({ x: Math.floor(p.x / s.gridTiles), y: Math.floor(p.y / s.gridTiles) });
  for (const c of [...creatures].sort((a, b) => a.id.localeCompare(b.id))) {
    const p = cell(c.position), k = `${p.x}:${p.y}`, list = buckets.get(k) ?? []; list.push(c); buckets.set(k, list);
  }
  return { organisms: new Map(creatures.map(c => [c.organismId, c])), query(point, exclude) {
    queries++; const center = cell(point), radius = Math.ceil(s.radiusTiles / s.gridTiles), nearby: { x: number; y: number }[] = [];
    for (let y = -radius; y <= radius; y++) for (let x = -radius; x <= radius; x++) nearby.push({ x: center.x + x, y: center.y + y });
    nearby.sort((a, b) => (a.x-center.x)**2+(a.y-center.y)**2-(b.x-center.x)**2-(b.y-center.y)**2 || a.y-b.y || a.x-b.x);
    const found: Agent[] = []; let checked = 0;
    for (const p of nearby) {
      const bucket = buckets.get(`${p.x}:${p.y}`) ?? [], offset = (Number(exclude?.slice(2) ?? 0) + Math.floor(tick/s.targetIntervalTicks)) % (bucket.length || 1);
      for (let i=0;i<bucket.length;i++) { const c=bucket[(i+offset)%bucket.length];
      if (c.id === exclude) continue;
      if (checked++ >= s.scanLimit) return found;
      inspected++;
      if (c.needs && Math.hypot(c.position.x-point.x,c.position.y-point.y) <= s.radiusTiles) found.push(c);
      }
    }
    return found;
  }, operations() { return { indexed: creatures.length, queries, inspected }; } };
}
