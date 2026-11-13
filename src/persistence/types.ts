import type { SaveEnvelope, SaveState } from '../sim/types';
export interface SaveStore { get(key: string): Promise<string | null>; set(key: string, value: string, signal?: AbortSignal): Promise<void>; remove(key: string): Promise<void>; keys(prefix: string): Promise<string[]> }
export interface LoadResult { checkpoint: SaveEnvelope | null; warnings: string[]; failures: { key: string; payload: string; message: string }[]; recovered: boolean }
export interface WriteResult { ok: boolean; message: string; quota: boolean; cancelled?: boolean }
export interface ImportedSave { checkpoint: SaveEnvelope; population: number; tick: number; warnings: string[] }
export interface SaveCodec {
  encode(state: SaveState, wall: number, offline: boolean): Promise<string>;
  decode(payload: string): Promise<SaveEnvelope>;
}
export type CodecRequest = { id: number; kind: 'encode'; state: SaveState; wall: number; offline: boolean } | { id: number; kind: 'decode'; payload: string };
export type CodecResponse = { id: number; ok: true; value: string | SaveEnvelope } | { id: number; ok: false; message: string };
export interface SaveRepository {
  invalidateWrites(): void; idle(): Promise<void>;
  load(): Promise<LoadResult>; write(state: SaveState, wall: number, offline?: boolean): Promise<WriteResult>;
  inspectImport(payload: string): Promise<ImportedSave>; import(payload: string, confirmed: boolean): Promise<WriteResult>;
  export(state: SaveState, wall: number, offline?: boolean): Promise<string>;
}
