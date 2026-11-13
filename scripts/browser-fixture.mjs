import {writeFile} from 'node:fs/promises';
import {createServer} from 'vite';
const server=await createServer({server:{middlewareMode:true,hmr:false,ws:false,watch:null},appType:'custom',logLevel:'error'});
try{
 const {createHabitat}=await server.ssrLoadModule('/src/sim/habitat.ts');
 const {forceStage}=await server.ssrLoadModule('/src/sim/debug-lifecycle.ts');
 const {setDebugSkill}=await server.ssrLoadModule('/src/sim/skills.ts');
 const {setSpeed}=await server.ssrLoadModule('/src/sim/runner.ts');
 const {skillKeys}=await server.ssrLoadModule('/src/data/config.ts');
 const {encodeCheckpoint}=await server.ssrLoadModule('/src/persistence/checkpoint.ts');
 let state=createHabitat(271828,30);
 for(const id of state.creatures.map(c=>c.id)){state=forceStage(state,id,'adult');for(const skill of skillKeys)state=setDebugSkill(state,id,skill,100,1);}
 state=setSpeed(state,0);await writeFile('.logs/m10b-max-parts.json',encodeCheckpoint(state,0));console.log('Wrote validated 30-creature/all-part browser fixture.');
}finally{await server.close();}
