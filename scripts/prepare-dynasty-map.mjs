import { chromium } from '@playwright/test';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const svg = await readFile('src/assets/dynasty/Map.svg', 'utf8');
const browser = await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
const page = await browser.newPage();
await page.setContent(svg);
const result = await page.evaluate(() => {
  const root = document.querySelector('svg'), box=root.viewBox.baseVal;
  const width=172,height=92, canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');
  canvas.width=Math.ceil(box.width);canvas.height=Math.ceil(box.height);
  const masks={};
  for(const id of ['SWIM','WALK','FLY']) {
    const el=document.getElementById(id), matrix=el.getCTM();
    const rootMatrix=root.getCTM().inverse().multiply(matrix);
    ctx.resetTransform();ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.setTransform(rootMatrix);ctx.fillStyle='#fff';ctx.fill(new Path2D(el.getAttribute('d')),'evenodd');
    masks[id]=ctx.getImageData(0,0,canvas.width,canvas.height).data;
  }
  // User-approved closure of each open cliff back. Extract the long missing
  // chord from the actual grass-edge contour, not a hand-drawn terrain region.
  const closures=[];
  const cross=(o,a,b)=>(a.x-o.x)*(b.y-o.y)-(a.y-o.y)*(b.x-o.x);
  function hull(points){points.sort((a,b)=>a.x-b.x||a.y-b.y);const low=[],high=[];
    for(const p of points){while(low.length>=2&&cross(low.at(-2),low.at(-1),p)<=0)low.pop();low.push(p);}
    for(const p of points.slice().reverse()){while(high.length>=2&&cross(high.at(-2),high.at(-1),p)<=0)high.pop();high.push(p);}return low.slice(0,-1).concat(high.slice(0,-1));}
  const outline=document.getElementById('GRASS_LINES'),outlineMatrix=root.getCTM().inverse().multiply(outline.getCTM());
  for(const d of outline.getAttribute('d').split(/(?=M)/)){
    const e=document.createElementNS('http://www.w3.org/2000/svg','path');e.setAttribute('d',d);root.append(e);
    const points=[];for(let n=0;n<e.getTotalLength();n+=2){const p=e.getPointAtLength(n).matrixTransform(outlineMatrix);points.push({x:p.x,y:p.y});}
    const boundary=hull(points),edges=boundary.map((a,i)=>({a,b:boundary[(i+1)%boundary.length]})).sort((a,b)=>Math.hypot(b.a.x-b.b.x,b.a.y-b.b.y)-Math.hypot(a.a.x-a.b.x,a.a.y-a.b.y));
    closures.push(edges[0]);e.remove();
  }
  ctx.resetTransform();ctx.clearRect(0,0,canvas.width,canvas.height);ctx.lineWidth=16;ctx.strokeStyle='#fff';ctx.lineCap='round';
  for(const {a,b}of closures){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
  const closureMask=ctx.getImageData(0,0,canvas.width,canvas.height).data;
  for(let i=3;i<closureMask.length;i+=4)masks.FLY[i]=Math.max(masks.FLY[i],closureMask[i]);
  const hit=(id,x,y)=>masks[id][(Math.floor(y)*canvas.width+Math.floor(x))*4+3]>127;
  const terrain=[];
  for(let y=0;y<height;y++)for(let x=0;x<width;x++){
    const px=(x+.5)*box.width/width,py=(y+.5)*box.height/height;
    let code=hit('WALK',px,py)?0:hit('SWIM',px,py)?3:5;
    // Cover every visible cliff pixel, so thin bands cannot disappear between centers.
    outer: for(let yy=Math.floor(y*box.height/height);yy<Math.ceil((y+1)*box.height/height);yy++)
      for(let xx=Math.floor(x*box.width/width);xx<Math.ceil((x+1)*box.width/width);xx++)
        if(hit('FLY',xx,yy)){code=4;break outer;}
    terrain.push(code);
  }
  const rle=[];for(const n of terrain){const last=rle.at(-1);if(last?.[0]===n)last[1]++;else rle.push([n,1]);}
  const counts={};for(const n of terrain)counts[n]=(counts[n]??0)+1;
  return {width,height,viewBox:[box.x,box.y,box.width,box.height],terrainRle:rle,counts,closures};
});
await browser.close();
result.sourceSha256=createHash('sha256').update(svg).digest('hex');
await writeFile('src/assets/dynasty/map-navigation.json',JSON.stringify(result)+'\n');
console.log({width:result.width,height:result.height,counts:result.counts,sourceSha256:result.sourceSha256});
