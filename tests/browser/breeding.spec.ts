import {expect,test} from '@playwright/test';

test('natural breeding and early rescue appear in the journal, with a persistent rescue control',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept());
 const vite='vite',buffer='node:buffer',{createServer}=await import(vite),{Buffer}=await import(buffer);
 const server=await createServer({server:{middlewareMode:true,hmr:false,ws:false,watch:null},appType:'custom'});
 let pair:string,endangered:string;
 try{
  const load=(p:string)=>server.ssrLoadModule('/src/'+p+'.ts');
  const {config}=await load('data/config');
  const {createHabitat}=await load('sim/habitat'),{encodeCheckpoint}=await load('persistence/checkpoint');
  const {ensureRelationship}=await load('sim/social/relationships'),{conceive}=await load('sim/courtship'),{forceStage}=await load('sim/debug-lifecycle');
  let s=createHabitat(621,2);s.clock.speed=0;
  const r=ensureRelationship(s,s.creatures[0].organismId,s.creatures[1].organismId);r.bond=85;r.mateBond=85;
  for(const c of s.creatures){c.needs={hunger:0,fatigue:0,boredom:20,loneliness:40,stress:0};c.mood=.8;}
  pair=encodeCheckpoint(s,Date.now());
  s=conceive(s,s.creatures[0],s.creatures[1]);s=conceive(s,s.creatures[0],s.creatures[1]);
  for(const [i,c]of s.creatures.entries())s=forceStage(s,c.id,i<2?'elder':'adult');
  s.clock.tick=config.breeding.recovery.checkEveryTicks-1;s.dynasty.nextPlantTick=s.clock.tick+config.dynasty.plants.spawnEveryTicks;for(const c of s.creatures)c.age+=s.clock.tick;s.world.lastCacheDay=Math.floor(s.clock.tick/config.clock.dayTicks);
  endangered=encodeCheckpoint(s,Date.now());
 }finally{await server.close();}
 await page.goto('./');await expect(page.locator('body')).toHaveAttribute('data-ready','true');
 await expect(page.locator('#extinction-rescue')).toBeVisible();await expect(page.locator('#extinction-rescue')).toBeChecked();
 await page.locator('#world-management > summary').click();
 const importWorld=async(name:string,payload:string)=>{await page.locator('#import-world').setInputFiles({name,mimeType:'application/json',buffer:Buffer.from(payload)});await expect(page.locator('#pause-label')).toHaveText('Resume');};
 await importWorld('mates.json',pair);await expect(page.locator('#creature-roster button')).toHaveCount(2);
 await page.locator('[data-speed="10"]').click();await expect.poll(()=>page.locator('#creature-roster button').count()).toBeGreaterThanOrEqual(5);
 await page.locator('#pause').click();await expect(page.locator('#life-events [data-kind="eggLaid"]')).toHaveCount(3);
 await importWorld('endangered.json',endangered);await expect(page.locator('#creature-roster button')).toHaveCount(4);
 await page.locator('[data-speed="1"]').click();await expect(page.locator('#creature-roster button')).toHaveCount(8);await page.locator('#pause').click();
 await expect(page.locator('#life-events [data-kind="rescue"]')).toHaveCount(4);await expect(page.locator('#life-events')).toContainText('POPULATION RESCUE');
 await page.locator('#extinction-rescue').uncheck();const tick=await page.locator('#tick').innerText();
 await page.locator('#save').click();await expect(page.locator('#save-status')).toContainText('Saved at tick');await page.reload();
 await expect(page.locator('body')).toHaveAttribute('data-ready','true');await expect(page.locator('#tick')).toHaveText(tick);
 await expect(page.locator('#extinction-rescue')).not.toBeChecked();await expect(page.locator('#creature-roster button')).toHaveCount(8);
 expect(errors).toEqual([]);
});
