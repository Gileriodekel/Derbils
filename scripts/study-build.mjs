import {build} from 'vite';
import {resolve} from 'node:path';

/** Bundle once, then give each independent world its own module instance/process. */
export async function buildStudyCore(){
 const outDir=`.logs/study-core-${process.pid}`;
 await build({configFile:false,publicDir:false,logLevel:'error',build:{ssr:'scripts/study-core.ts',outDir,emptyOutDir:true,minify:false}});
 return resolve(outDir,'study-core.js');
}
