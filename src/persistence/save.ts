import type { SaveState } from '../sim/types';
import { validateSave } from './validate';
import { migrateSave } from './migrate';

/** The codec is platform-independent; browser storage is a separate adapter. */
export function encodeSave(state: SaveState): string {
  validateSave(state);
  return JSON.stringify(state);
}

export function decodeSave(json: string): SaveState {
  const data = migrateSave(JSON.parse(json));
  validateSave(data);
  return data;
}
