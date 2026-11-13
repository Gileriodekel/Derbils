import { expect, test } from '@playwright/test';

test('the visible spectrum and web agree across both boundaries; new worlds retain Daroboo', async ({page}) => {
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept());
  const vite='vite',buffer='node:buffer',{createServer}=await import(vite),{Buffer}=await import(buffer);
  const server=await createServer({server:{middlewareMode:true,hmr:false,ws:false,watch:null},appType:'custom'});
  let payload:string;
  try {
    const load=(p:string)=>server.ssrLoadModule('/src/'+p+'.ts');
    const {createHabitat}=await load('sim/habitat'),{tick}=await load('sim/tick');
    const {encodeCheckpoint}=await load('persistence/checkpoint'),{ensureRelationship}=await load('sim/social/relationships');
    let s=createHabitat(552,2);s.settings.autoBreed=false;
    for(let i=0;i<59;i++)s=tick(s);
    const r=ensureRelationship(s,s.creatures[0].organismId,s.creatures[1].organismId);r.bond=-60;
    s.clock.speed=0;payload=encodeCheckpoint(s,Date.now());
  } finally {await server.close();}
  await page.goto('./');await expect(page.locator('body')).toHaveAttribute('data-ready','true');
  await expect(page.locator('#creature-roster button').first()).toHaveText('Daroboo');
  await page.locator('#world-management > summary').click();
  await page.locator('#import-world').setInputFiles({name:'calendar.json',mimeType:'application/json',buffer:Buffer.from(payload)});
  await expect(page.locator('#tick')).toHaveText('59');await expect(page.locator('#day')).toHaveText('Day 0');
  await page.locator('[data-speed="1"]').click();await expect(page.locator('#day')).toHaveText('Day 1');
  await page.locator('#pause').click();
  await page.locator('#debug-toggle').click();
  await page.locator('#creature-roster button').first().click();
  await page.locator('#social-web').evaluate(n=>{n.closest('details')!.open=true;});
  await page.locator('#social').evaluate(n=>{const d=n.closest('details');if(d)d.open=true;});
  await page.locator('#affinity-form').evaluate(n=>{n.closest('details')!.open=true;});
  await page.locator('#social').scrollIntoViewIfNeeded();
  await page.locator('#affinity-partner').selectOption('o_00000002');
  for(const score of [-100,-100/3,-33.333,0,33.333,100/3,100]) {
    await page.locator('#affinity-value').fill(String(score));await page.locator('#affinity-form button').click();
    const meter=page.locator('#relationships [role="meter"]').first();
    const label=score<=-100/3?'Foe':score>=100/3?'Friend':'Neutral';
    await expect(meter).toHaveAttribute('aria-valuenow',String(score));
    await expect(meter).toHaveAttribute('aria-valuetext',`${label} (${score.toFixed(1)})`);
    const geometry=await meter.evaluate(n=>{
      const bar=n.getBoundingClientRect(),pointer=n.querySelector('.spectrum-pointer')!.getBoundingClientRect();
      return {ratio:((pointer.left+pointer.width/2)-bar.left)/bar.width,colors:getComputedStyle(n).backgroundImage};
    });
    expect(geometry.ratio).toBeCloseTo((score+100)/200,2);expect(geometry.colors).toContain('linear-gradient');
    await page.locator('#social-web').scrollIntoViewIfNeeded();
    await expect(page.locator('#social-web .social-edge[data-kind="foe"]')).toHaveCount(label==='Foe'?1:0);
    await expect(page.locator('#social-web .social-edge[data-kind="friend"]')).toHaveCount(label==='Friend'?1:0);
    await expect(page.locator('#social-web .social-edge[data-kind="neutral"]')).toHaveCount(0);
  }
  await page.locator('#save').click();await expect(page.locator('#save-status')).toContainText('Saved at tick');
  await page.reload();await expect(page.locator('body')).toHaveAttribute('data-ready','true');
  await expect(page.locator('#creature-roster button').first()).toHaveText('Daroboo');
  expect(errors).toEqual([]);
});
