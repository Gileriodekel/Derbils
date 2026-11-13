import { config } from '../../data/config';
import { createTerrain, encodeTerrain, isSafeLand, tileIndex } from '../map';
import { nearestTile } from '../navigation';
import { withDefaultSources } from '../food-sources';
import type { Point, SaveState } from '../types';
/** One-time coordinate projection for historical saves. Current saves never pass here. */
export function replaceHistoricalMap(state: SaveState): SaveState {
  const width=config.world.widthTiles,height=config.world.heightTiles,old=state.world,terrain=createTerrain();
  const project=(p:Point):Point=>{
    const scaled={x:Math.min(width-.5,Math.floor(p.x/old.width*width)+.5),y:Math.min(height-.5,Math.floor(p.y/old.height*height)+.5)};
    return isSafeLand(terrain[tileIndex(scaled,width)])?scaled:nearestTile(terrain,width,scaled,isSafeLand)!;
  };
  state.dynasty.legacyRecords.push({kind:'previousHabitat',world:old});
  state.world={...old,width,height,terrainRevision:old.terrainRevision+1,terrainRle:encodeTerrain(terrain),items:[],plants:[],looseFruit:old.looseFruit.map(f=>({...f,...project(f)}))};
  state.creatures=state.creatures.map(c=>({...c,position:project(c.position)}));
  const streams={...state.rng};const next=withDefaultSources(state);next.rng=streams;return next;
}
