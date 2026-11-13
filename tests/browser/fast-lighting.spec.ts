import {expect,test} from '@playwright/test';

test('accelerated days do not flash the map and unchanged resize events do not clear it',async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{
    Object.assign(window,{lightingSamples:[]});
    function sample(){
      const canvas=document.querySelector<HTMLCanvasElement>('#habitat');
      if(canvas&&canvas.width&&canvas.height){
        const samples=(window as unknown as {lightingSamples:{pixel:number[]}[]}).lightingSamples;
        samples.push({pixel:[...canvas.getContext('2d')!.getImageData(1,1,1,1).data]});
        if(samples.length>600)samples.shift();
      }
      requestAnimationFrame(sample);
    }
    requestAnimationFrame(sample);
  });
  await page.goto('./');await expect(page.locator('body')).toHaveAttribute('data-ready','true');
  await page.locator('#hide-actions').check();
  for(const speed of [100,1000]){
    await page.locator(`[data-speed="${speed}"]`).click();await page.locator('#habitat').scrollIntoViewIfNeeded();
    await page.waitForTimeout(2200);
    await page.evaluate(()=>{(window as unknown as {lightingSamples:unknown[]}).lightingSamples=[];});
    const before=Number((await page.locator('#tick').innerText()).replaceAll(',',''));
    await page.waitForTimeout(1200);
    const samples=await page.evaluate(()=>(window as unknown as {lightingSamples:{style:string;pixel:number[]}[]}).lightingSamples);
    expect(samples.length).toBeGreaterThan(5);
    for(let channel=0;channel<4;channel++){
      const values=samples.map(s=>s.pixel[channel]);expect(Math.max(...values)-Math.min(...values)).toBeLessThanOrEqual(1);
    }
    expect(samples.every(s=>s.pixel[3]===255)).toBe(true);
    expect(Number((await page.locator('#tick').innerText()).replaceAll(',',''))).toBeGreaterThan(before);
  }
  const unchanged=await page.locator('#habitat').evaluate((canvas:HTMLCanvasElement)=>{
    const ctx=canvas.getContext('2d')!,before=[...ctx.getImageData(1,1,1,1).data];
    for(let i=0;i<10;i++)window.dispatchEvent(new Event('resize'));
    return JSON.stringify(before)===JSON.stringify([...ctx.getImageData(1,1,1,1).data]);
  });
  expect(unchanged).toBe(true);expect(errors).toEqual([]);
});
