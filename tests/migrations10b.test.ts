import {expect,it} from 'vitest';
import {config} from '../src/data/config';
import {decodeCheckpoint} from '../src/persistence/checkpoint';
import {validateState} from '../src/sim/validate-state';
import {advanceTicks} from '../src/sim/tick';
import {hashState} from '../src/sim/hash';
const fixtures=import.meta.glob('./fixtures/saves/*.json',{eager:true,query:'?raw',import:'default'}) as Record<string,string>;
for(let version=1;version<=11;version++)it(`loads real historical schema ${version}, validates and continues deterministically for 10k ticks`,()=>{
 const payload=fixtures[`./fixtures/saves/v${version}.json`];expect(payload).toBeTruthy();
 const state=decodeCheckpoint(payload).state;expect(validateState(state,config)).toEqual([]);
 const a=advanceTicks(state,10000),b=advanceTicks(decodeCheckpoint(payload).state,10000);
 expect(validateState(a,config)).toEqual([]);expect(hashState(a)).toBe(hashState(b));
},120000);
