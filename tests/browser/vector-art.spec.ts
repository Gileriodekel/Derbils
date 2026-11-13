import { test, expect } from '@playwright/test';

test('Canvas vector parts preserve supplied SVG colors, paths, layers and animation at normal and enlarged sizes',async({page},testInfo)=>{
  const vite='vite',path='node:path',fs='node:fs/promises';
  const {build}=await import(vite),{resolve}=await import(path),{readdir,writeFile}=await import(fs);
  const outDir=resolve('.logs/render-probe');
  await build({configFile:false,publicDir:false,logLevel:'error',build:{lib:{entry:resolve('tests/browser/render-probe.ts'),formats:['iife'],name:'DerbilRenderProbe'},outDir,emptyOutDir:true}});
  const bundle=(await readdir(outDir)).find((name:string)=>name.endsWith('.js'))!;
  await page.setContent('<main></main>');await page.addScriptTag({path:resolve(outDir,bundle)});
  const result=await page.evaluate(async()=>{
    const probe=(window as unknown as {DerbilRenderProbe:any}).DerbilRenderProbe;
    let state=probe.createHabitat(923,1);const id=state.creatures[0].id;
    const specimens=[{name:'base',c:structuredClone(state.creatures[0]),tick:0,animate:false}];
    for(const skill of ['run','swim','fly','strength'])state=probe.setDebugSkill(state,id,skill,100,1);
    state=probe.setAppearanceGenes(state,id,{baseHue:210,feetHue:30,tailHue:300,eyeHue:120});
    const max=state.creatures[0];max.dynasty.moving=true;
    for(const [mode,tick]of [['walk',3],['fly',2]] as const){const c=structuredClone(max);c.dynasty.movementMode=mode;specimens.push({name:mode,c,tick,animate:true});}
    for(const stage of ['baby','elder'])specimens.push({name:stage,c:{...structuredClone(max),stage},tick:0,animate:false});
    for(const cosmetic of ['leaf_crown','ribbon','star_pin']){
      const c=structuredClone(max);c.awards.equipped=cosmetic;specimens.push({name:cosmetic,c,tick:0,animate:false});
    }
    const tinted=structuredClone(max);tinted.appearanceModifiers=[{type:'dietTint',rgb:[.15,.75,.45],magnitude:.18,sourceFruit:'sunapple',expiresTick:10000}];
    specimens.push({name:'diet-tint',c:tinted,tick:0,animate:false});
    const renderer=probe.createDerbilRenderer(),results=[];
    for(const specimen of specimens)for(const width of [215,860]){
      const height=width*1450/2150,left=document.createElement('canvas'),right=document.createElement('canvas');
      left.width=right.width=width;left.height=right.height=height;
      const old=left.getContext('2d')!,next=right.getContext('2d')!;
      const image=new Image();image.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(probe.derbilSvg(specimen.c,specimen.tick,specimen.animate));await image.decode();
      old.drawImage(image,0,0,width,height);next.translate(width/2,height/2);
      renderer.draw(next,specimen.c,width/probe.config.lifecycle.stages[specimen.c.stage].scale,specimen.tick,specimen.animate);
      const a=old.getImageData(0,0,width,height).data,b=next.getImageData(0,0,width,height).data;
      let absolute=0,large=0;for(let i=0;i<a.length;i+=4){let error=0;for(let j=0;j<4;j++){const d=Math.abs(a[i+j]-b[i+j]);absolute+=d;error=Math.max(error,d);}if(error>16)large++;}
      results.push({name:specimen.name,width,meanChannelError:absolute/a.length,largePixelFraction:large/(width*height)});
      if(width===215){const label=document.createElement('p');label.textContent=specimen.name+' · SVG reference / Canvas';document.querySelector('main')!.append(label,left,right);}
      image.src='';
    }
    return results;
  });
  await page.screenshot({path:testInfo.outputPath('svg-canvas-comparison.png'),fullPage:true});
  await testInfo.attach('pixel-comparison',{body:JSON.stringify(result,null,2),contentType:'application/json'});
  await writeFile(testInfo.outputPath('pixel-comparison.json'),JSON.stringify(result,null,2));
  for(const row of result){expect(row.meanChannelError,`${row.name} at ${row.width}px`).toBeLessThan(1);expect(row.largePixelFraction,`${row.name} edges at ${row.width}px`).toBeLessThan(.02);}
});
