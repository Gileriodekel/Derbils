import {expect,it} from 'vitest';
import {config,configHash,dataFiles} from '../src/data/config';
import {assertValidData,tuningDocument,validateData} from '../src/data/validation';
import {hashState} from '../src/sim/hash';
import {validateState} from '../src/sim/validate-state';
import {createHabitat} from '../src/sim/habitat';
import {applyPlayerCommand} from '../src/sim/commands';
import {ensureRelationship} from '../src/sim/social/relationships';
import {tick} from '../src/sim/tick';

it('validates EVERY shipped JSON and has metadata for every numeric field',async()=>{
 const module='node:fs'; const {readFileSync,readdirSync}=await import(module);
 expect(Object.keys(dataFiles).sort()).toEqual(readdirSync('src/data').filter((f:string)=>f.endsWith('.json')).sort());
 expect(()=>assertValidData(dataFiles)).not.toThrow();
 expect(readFileSync('docs/TUNING.md','utf8')).toBe(tuningDocument(dataFiles));
 expect(configHash).toBe(hashState(Object.fromEntries(Object.entries(dataFiles).reverse())));
});
it('names the file and key for missing, wrong-type and out-of-range tuning',()=>{
 expect(validateData('breeding.json',{...dataFiles['breeding.json'],enabled:'yes'})).toContainEqual({file:'breeding.json',path:'enabled',message:'expected boolean'});
 for(const value of [-3,'fast',undefined]){
  const data=structuredClone(dataFiles['balance.json']) as unknown as {ai:{temperature:unknown}};
  if(value===undefined)delete (data.ai as Record<string,unknown>).temperature;else data.ai.temperature=value;
  expect(validateData('balance.json',data)).toContainEqual(expect.objectContaining({file:'balance.json',path:'ai.temperature'}));
 }
});
it('accepts configurable seed lists and rejects empty or duplicate study inputs',()=>{
 const data=structuredClone(dataFiles['health.json']);data.full.seeds=[1];expect(validateData('health.json',data)).toEqual([]);
 data.full.seeds=[1,2,3,4,5,6];expect(validateData('health.json',data)).toEqual([]);
 data.full.seeds=[];expect(validateData('health.json',data)).toContainEqual(expect.objectContaining({path:'full.seeds'}));
 data.full.seeds=[1];data.soak.seeds=[2,2];expect(validateData('health.json',data)).toContainEqual(expect.objectContaining({path:'soak.seeds'}));
 data.soak.seeds=[2];data.soak.shortSeeds=[3,3];expect(validateData('health.json',data)).toContainEqual(expect.objectContaining({path:'soak.shortSeeds'}));
});
it('returns actionable violations and never throws for malformed states',()=>{
 const changes:[string,(s:ReturnType<typeof createHabitat>)=>void][]=[
  ['relationship',s=>{ensureRelationship(s,s.creatures[0].organismId,s.creatures[1].organismId).a='o_99999999';}],
  ['inventory',s=>{s.inventory.fruit.prismpear=-1;}],
  ['duplicate',s=>{s.creatures.push(s.creatures[0]);}],
  ['finite',s=>{s.creatures[0].needs!.hunger=NaN;}],
  ['conservation',s=>{s.prizeLedger.supplied['fruit:prismpear']=(s.prizeLedger.supplied['fruit:prismpear']??0)+1;}],
  ['skill',s=>{s.creatures[0].xp.run=1e10;}],
 ];
 for(const [word,edit] of changes){const state=createHabitat();edit(state);expect(validateState(state,config).map(i=>i.message).join(' ')).toMatch(new RegExp(word,'i'));}
 for(const value of [undefined,null,{},[],{creatures:null}])expect(validateState(value,config).length).toBeGreaterThan(0);
});
it('reports missing competition entrants and escrow mismatches',()=>{
 const source=applyPlayerCommand(createHabitat(),{kind:'createCompetition',format:'dash',skill:'run',startDelay:90,entryRules:structuredClone(config.competitions.entry),prize:{placements:[{rank:1,kind:'fruit',id:'prismpear',quantity:1}]}});
 const entrant=structuredClone(source);entrant.competitions[0].entrantIds.push('c_99999999');expect(validateState(entrant,config).map(v=>v.message).join(' ')).toMatch(/entrant/);
 const escrow=structuredClone(source);escrow.competitions[0].prize!.placements[0].quantity=2;expect(validateState(escrow,config).map(v=>v.message).join(' ')).toMatch(/conservation|escrow/);
});
it('has no false positives across 200,000 ticks and three seeds',()=>{
 for(const seed of [271828,314159,161803]){
  let state=createHabitat(seed);state.settings.autoCompetitions=true;state.settings.autoPrizes=true;
  for(let n=1;n<=200000;n++){state=tick(state);if(n%1000===0)expect(validateState(state,config)).toEqual([]);}
 }
},900000);
