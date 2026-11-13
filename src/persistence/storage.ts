import { decodeCheckpoint, encodeCheckpoint } from './checkpoint';
import { config } from '../data/config';
import type { SaveState } from '../sim/types';
import { decodeSave, encodeSave } from './save';

export function saveLocal(storage: Pick<Storage, 'setItem'>, state: SaveState): void {
  storage.setItem(config.persistence.key, encodeSave(state));
}

export function loadLocal(storage: Pick<Storage, 'getItem'>): SaveState | null {
  const json = storage.getItem(config.persistence.key);
  return json === null ? null : decodeSave(json);
}

export function saveCheckpointLocal(storage: Pick<Storage, 'setItem'>, state: SaveState, savedAtWallClock: number, offlineEnabled=true): void {
  storage.setItem(config.persistence.key, encodeCheckpoint(state,savedAtWallClock,offlineEnabled));
}
export function loadCheckpointLocal(storage: Pick<Storage, 'getItem'>) {
  const json=storage.getItem(config.persistence.key);
  return json===null?null:decodeCheckpoint(json);
}
