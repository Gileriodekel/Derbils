import {writeFile} from 'node:fs/promises';
import {createServer} from 'vite';
const server=await createServer({server:{middlewareMode:true,hmr:false,ws:false,watch:null},appType:'custom'});
try {
  const {dataFiles}=await server.ssrLoadModule('/src/data/config.ts');
  const {tuningDocument}=await server.ssrLoadModule('/src/data/validation.ts');
  await writeFile('docs/TUNING.md',tuningDocument(dataFiles));
  console.log('Updated docs/TUNING.md');
} finally {await server.close();}
