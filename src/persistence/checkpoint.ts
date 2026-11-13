import { config, configHash } from '../data/config';
import { hashState } from '../sim/hash';
import { validateState } from '../sim/validate-state';
import type { SaveEnvelope, SaveState } from '../sim/types';
import { migrateSave } from './migrate';

export const envelopeVersion=14;
function checkedState(value:unknown):SaveState {
  if(value&&typeof value==='object'&&'schemaVersion' in value&&Number(value.schemaVersion)>12)throw new Error('This snapshot needs a newer app.');
  const state=migrateSave(value),issues=validateState(state,config);
  if(issues.length)throw new Error(issues.map(i=>`${i.path}: ${i.message}`).join('\n'));
  return state as SaveState;
}
export function encodeCheckpoint(state: SaveState, savedAtWallClock: number, offlineEnabled=true): string {
  if(!Number.isFinite(savedAtWallClock))throw new Error('Invalid checkpoint timestamp.');
  const issues=validateState(state,config);if(issues.length)throw new Error(issues.map(i=>`${i.path}: ${i.message}`).join('\n'));
  const body={format:'creature-habitat' as const,schemaVersion:envelopeVersion,savedAtWallClock,configHash,offlineEnabled,state};
  return JSON.stringify({...body,checksum:hashState(body)});
}
/** Parse → checksum → known migration → semantic validation. Old payloads have no invented checksum. */
export function decodeCheckpoint(json: string): SaveEnvelope {
  const data=JSON.parse(json);
  if(!data||typeof data!=='object'||!Number.isInteger(data.schemaVersion))throw new Error('Missing save schemaVersion.');
  if(data.schemaVersion>envelopeVersion)throw new Error(`This save needs a newer app (schema ${data.schemaVersion}; supported ${envelopeVersion}).`);
  if(data.schemaVersion>=12 && 'state' in data){
    if(data.format!=='creature-habitat')throw new Error('Wrong save format. Expected creature-habitat.');
    const {checksum,...body}=data;
    if(typeof checksum!=='string'||checksum!==hashState(body))throw new Error('Save checksum mismatch.');
    if(typeof data.configHash!=='string'||typeof data.offlineEnabled!=='boolean'||(data.savedAtWallClock!==null&&(!Number.isFinite(data.savedAtWallClock)||typeof data.savedAtWallClock!=='number'))
      ||Object.keys(data).some(k=>!['format','schemaVersion','savedAtWallClock','configHash','checksum','offlineEnabled','state'].includes(k)))throw new Error('Invalid save envelope.');
    const state=checkedState(data.state);
    return {...data,schemaVersion:14,state};
  }
  if(data.schemaVersion===11&&'state' in data){
    if(typeof data.offlineEnabled!=='boolean'||!data.state||Object.keys(data).some(k=>!['schemaVersion','savedAtWallClock','offlineEnabled','state'].includes(k)))throw new Error('Invalid legacy checkpoint.');
    return {format:'creature-habitat',schemaVersion:14,savedAtWallClock:Number.isFinite(data.savedAtWallClock)?data.savedAtWallClock:null,configHash:'legacy-unknown',checksum:'legacy-unverified',offlineEnabled:data.offlineEnabled,state:checkedState(data.state)};
  }
  return {format:'creature-habitat',schemaVersion:14,savedAtWallClock:null,configHash:'legacy-unknown',checksum:'legacy-unverified',offlineEnabled:true,state:checkedState(data)};
}
