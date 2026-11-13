import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
const root=resolve('dist'),mime={'.js':'text/javascript','.css':'text/css','.html':'text/html','.svg':'image/svg+xml'};
createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://localhost'),name=decodeURIComponent(url.pathname).replace(/^\/garden\//,'/');
  const path=resolve(root,'.'+(name==='/'?'/index.html':name));if(!path.startsWith(root+'/'))throw new Error('Invalid path');
  if(!(await stat(path)).isFile())throw new Error('Missing file');res.setHeader('content-type',mime[extname(path)]??'application/octet-stream');res.end(await readFile(path));
 }catch{res.statusCode=404;res.end('Not found');}
}).listen(4173,'127.0.0.1',()=>console.log('Static subfolder host ready on port 4173 /garden/'));
