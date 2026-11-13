import { decodeCheckpoint, encodeCheckpoint } from './checkpoint';
import type { SaveCodec } from './types';
/** Node and unsupported-browser fallback; async boundary is the same as the worker adapter. */
export const inlineCodec:SaveCodec={async encode(state,wall,offline){return encodeCheckpoint(state,wall,offline);},async decode(payload){return decodeCheckpoint(payload);}};
