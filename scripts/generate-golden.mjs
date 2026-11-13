import {readFile,writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {buildStudyCore} from './study-build.mjs';

const reason=process.argv.slice(2).join(' ').trim();
if(!reason)throw new Error('Provide the accepted config-change reason recorded in docs/BALANCE_LOG.md.');
const {config,configHash,createHabitat,tick,hashState}=await import(pathToFileURL(await buildStudyCore()).href);
if(config.rulesVersion!=='0.10.0')throw new Error('This capture is for declared Milestone10b tuning only.');
// Historical9b goldens AND fixtures are immutable. Retain their exact checkpoint coverage.
const {seeds,checkpoints}=JSON.parse(await readFile('tests/golden/milestone-9b.json','utf8')),hashes=[];
for(const seed of seeds){
 let state=createHabitat(seed);state.settings.autoCompetitions=true;state.settings.autoPrizes=true;
 for(const target of checkpoints){
  while(state.clock.tick<target)state=tick(state);
  const row={seed,tick:target,hash:hashState(state)};hashes.push(row);console.log(JSON.stringify(row));
 }
}
await writeFile('tests/golden/milestone-10b.json',JSON.stringify({algorithm:'fnv1a64-utf16-sorted-json',rulesVersion:config.rulesVersion,configHash,reason,seeds,checkpoints,hashes},null,2)+'\n');
