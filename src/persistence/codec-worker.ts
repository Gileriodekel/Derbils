import { decodeCheckpoint, encodeCheckpoint } from './checkpoint';
import type { CodecRequest, CodecResponse } from './types';
const host=globalThis as unknown as {onmessage:((event:{data:CodecRequest})=>void)|null;postMessage:(value:CodecResponse)=>void};
host.onmessage=({data})=>{
  try{host.postMessage({id:data.id,ok:true,value:data.kind==='encode'?encodeCheckpoint(data.state,data.wall,data.offline):decodeCheckpoint(data.payload)});}
  catch(error){host.postMessage({id:data.id,ok:false,message:error instanceof Error?error.message:String(error)});}
};
