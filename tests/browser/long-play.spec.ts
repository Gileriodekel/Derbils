import {expect,test} from '@playwright/test';

test('repeated developed-world play and reload keep vector resources bounded and zoom resolution sharp',async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept());
  await page.addInitScript(()=>{
    const draw=CanvasRenderingContext2D.prototype.drawImage;
    Object.assign(window,{rasterChecks:{count:0,undersized:0}});
    CanvasRenderingContext2D.prototype.drawImage=function(this:CanvasRenderingContext2D,image:CanvasImageSource,...args:number[]){
      if(this.canvas.id==='habitat'&&image instanceof HTMLCanvasElement&&image.dataset.derbil==='true'){
        const checks=(window as unknown as {rasterChecks:{count:number;undersized:number}}).rasterChecks,m=this.getTransform();checks.count++;
        if(image.width+1e-6<Math.abs(args[2])*Math.hypot(m.a,m.b)||image.height+1e-6<Math.abs(args[3])*Math.hypot(m.c,m.d))checks.undersized++;
      }
      (draw as (...args:unknown[])=>void).call(this,image,...args);
    } as typeof draw;
  });
  const vite='vite',buffer='node:buffer',{createServer}=await import(vite),{Buffer}=await import(buffer);
  const server=await createServer({server:{middlewareMode:true,hmr:false,ws:false,watch:null},appType:'custom'});let payload:string;
  try{
    const {createHabitat}=await server.ssrLoadModule('/src/sim/habitat.ts'),{encodeCheckpoint}=await server.ssrLoadModule('/src/persistence/checkpoint.ts');
    const {setDebugSkill}=await server.ssrLoadModule('/src/sim/skills.ts');
    const {applyFruitAppearance}=await server.ssrLoadModule('/src/sim/appearance/modifiers.ts'),{config}=await server.ssrLoadModule('/src/data/config.ts');
    let s=createHabitat(16731,30);s.clock.speed=0;s.settings.autoBreed=false;
    for(const c of s.creatures)for(const skill of ['run','fly','swim','strength'])s=setDebugSkill(s,c.id,skill,c.stage==='adult'?70:20,1);
    for(const c of s.creatures)applyFruitAppearance(c,config.fruit.sunapple,'sunapple',s.clock.tick);
    payload=encodeCheckpoint(s,Date.now());
  }finally{await server.close();}
  await page.goto('./');await expect(page.locator('body')).toHaveAttribute('data-ready','true');
  await page.locator('#world-management > summary').click();
  const cdp=await page.context().newCDPSession(page);await cdp.send('Performance.enable');const samples:number[]=[];
  for(let cycle=0;cycle<5;cycle++){
    await page.locator('#import-world').setInputFiles({name:'developed-world.json',mimeType:'application/json',buffer:Buffer.from(payload)});
    await expect(page.locator('#creature-roster button')).toHaveCount(30);await expect(page.locator('#pause-label')).toHaveText('Resume');
    await page.locator('[data-speed="100"]').click();
    await expect.poll(async()=>Number((await page.locator('#tick').innerText()).replaceAll(',',''))).toBeGreaterThan(180);
    await page.locator('#pause').click();await cdp.send('HeapProfiler.collectGarbage');
    const metrics=(await cdp.send('Performance.getMetrics')).metrics;
    expect(metrics.find(m=>m.name==='Documents')!.value).toBeLessThan(128);
    samples.push(metrics.find(m=>m.name==='JSHeapUsedSize')!.value);
  }
  // A generous memory bound, not a machine-dependent timing assertion.
  expect(samples.at(-1)!-samples[1]).toBeLessThan(15*1024*1024);
  const canvas=page.locator('#habitat');await canvas.scrollIntoViewIfNeeded();await canvas.focus();
  for(let i=0;i<6;i++)await page.keyboard.press('+');
  await expect(page.locator('.map-controls output')).toHaveText('800%');
  const checks=await page.evaluate(()=>(window as unknown as {rasterChecks:{count:number;undersized:number}}).rasterChecks);
  expect(checks.count).toBeGreaterThan(100);expect(checks.undersized).toBe(0);expect(errors).toEqual([]);
});
