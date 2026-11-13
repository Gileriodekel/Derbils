import {expect,test} from '@playwright/test';

const key='creature-habitat.milestones-1-2';
test('built subfolder app: canvas, selection, prizes, exact reload, offline return and second tab',async({page,context})=>{
 const errors:string[]=[];const observe=(p:typeof page)=>{p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error'||m.type()==='warning')errors.push(m.text());});};observe(page);context.on('page',observe);
 await page.goto('./');await expect(page.locator('body')).toHaveAttribute('data-ready','true');
 await expect(page.locator('#first-hints')).toBeVisible();await expect(page.locator('#raw-state')).not.toBeVisible();
 if(await page.locator('#pause-label').textContent()==='Pause')await page.locator('#pause').click();
 const pixels=await page.locator('#habitat').evaluate((node:HTMLCanvasElement)=>{const ctx=node.getContext('2d')!,{data}=ctx.getImageData(0,0,node.width,node.height);return new Set(Array.from(data.slice(0,20000))).size;});expect(pixels).toBeGreaterThan(3);
 const creature=page.locator('#creature-roster button').nth(1),id=await creature.getAttribute('data-creature-id');await creature.click();await expect(page.locator('#select-creature')).toHaveAttribute('data-creature-id',id!);await expect(page.locator('#creature-name')).not.toHaveText('Pip');
 await page.locator('[data-prize-rank="1"]').selectOption('0');await page.locator('#competition-confirm').click();await expect(page.locator('#competition-list')).toContainText('scheduled');
 const tick=await page.locator('#tick').textContent();await page.locator('#save').click();await expect(page.locator('#save-status')).toContainText('Saved at tick');await page.reload();await expect(page.locator('body')).toHaveAttribute('data-ready','true');await expect(page.locator('#tick')).toHaveText(tick!);await expect(page.locator('#competition-list')).toContainText('scheduled');
 // Close the owner before changing a durable fixture, avoiding a pagehide write race.
 const payload=await page.evaluate(async(base:string)=>{
  const db=await new Promise<IDBDatabase>((resolve,reject)=>{const r=indexedDB.open('creature-habitat-checkpoints',1);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});
  const get=(k:string)=>new Promise<string>((resolve,reject)=>{const r=db.transaction('saves').objectStore('saves').get(k);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});
  const keys=JSON.parse(await get(`${base}.current`));return {key:keys[0] as string,json:await get(keys[0])};
 },key);
 await page.close();const returned=await context.newPage();await returned.route('**/storage-helper',route=>route.fulfill({contentType:'text/html',body:'<html><body>Storage fixture helper</body></html>'}));await returned.goto('http://127.0.0.1:4173/storage-helper');
 await returned.evaluate(async({base,payload})=>{
  const db=await new Promise<IDBDatabase>(resolve=>{const r=indexedDB.open('creature-habitat-checkpoints',1);r.onsuccess=()=>resolve(r.result);});
  const data=JSON.parse(payload.json);data.savedAtWallClock=Date.now()-2*60*60*1000;data.state.clock.speed=1;
  const {checksum:_,...body}=data;void _;
  function stable(v:unknown):string{if(v===null||typeof v!=='object')return JSON.stringify(v);if(Array.isArray(v))return `[${v.map(stable).join(',')}]`;return `{${Object.keys(v).sort().map(k=>`${JSON.stringify(k)}:${stable((v as Record<string,unknown>)[k])}`).join(',')}}`;}
  const json=stable(body);let hash=0xcbf29ce484222325n;for(let i=0;i<json.length;i++)hash=BigInt.asUintN(64,(hash^BigInt(json.charCodeAt(i)))*0x100000001b3n);
  const tx=db.transaction('saves','readwrite');tx.objectStore('saves').put(JSON.stringify({...body,checksum:hash.toString(16).padStart(16,'0')}),payload.key);tx.objectStore('saves').put(JSON.stringify([payload.key]),`${base}.current`);
  await new Promise<void>((resolve,reject)=>{tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);});
 },{base:key,payload});
 // No unsaved world exists here; reload is paused first to prevent a last-frame tick overwriting the fixture.
 await returned.addInitScript(()=>{new MutationObserver(()=>{const el=document.querySelector<HTMLElement>('#catchup-overlay');if(el&&!el.hidden&&document.documentElement.dataset.sawCatchup!=='true')document.documentElement.dataset.sawCatchup='true';}).observe(document,{subtree:true,attributes:true,childList:true});});
 await returned.goto('./');await expect(returned.locator('html')).toHaveAttribute('data-saw-catchup','true');await expect(returned.locator('#away-summary')).toBeVisible({timeout:60000});
 const second=await context.newPage();await second.goto('./');await expect(second.locator('#ownership-panel')).toBeVisible();await second.locator('#take-over').click();await expect(second.locator('#ownership-panel')).not.toBeVisible();await expect(returned.locator('#ownership-panel')).toBeVisible();
 await second.close();expect(errors).toEqual([]);
});

test('mobile controls, debug toggle and settings remain keyboard accessible',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('./');await expect(page.locator('body')).toHaveAttribute('data-ready','true');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.locator('#habitat').focus();await page.keyboard.press('Tab');await expect(page.locator('#select-creature')).toHaveAttribute('data-creature-id',/c_/);
 await page.keyboard.press('Escape');await expect(page.locator('#no-selection')).toBeVisible();await expect(page.locator('#habitat')).not.toBeFocused();
 await page.keyboard.press('Backquote');await expect(page.locator('#debug-toggle')).toHaveAttribute('aria-pressed','true');
 await page.locator('#world-management > summary').click();await page.locator('#settings-panel summary').click();await page.locator('#high-contrast').check();await expect(page.locator('body')).toHaveClass(/high-contrast/);
});

test('corrupt saves recover visibly; new-game confirmation and storage-event ownership fallback work',async({page,context})=>{
 await context.addInitScript(()=>{Object.defineProperty(globalThis,'BroadcastChannel',{value:undefined,configurable:true});});
 await page.goto('./');await expect(page.locator('body')).toHaveAttribute('data-ready','true');if(await page.locator('#pause-label').textContent()==='Pause')await page.locator('#pause').click();
 for(let i=0;i<2;i++){await page.locator('#save').click();await expect(page.locator('#save-status')).toContainText('Saved at tick');}
 async function corrupt(all:boolean){await page.evaluate(async({base,all})=>{
  const db=await new Promise<IDBDatabase>(resolve=>{const r=indexedDB.open('creature-habitat-checkpoints',1);r.onsuccess=()=>resolve(r.result);});
  const keys=await new Promise<string[]>(resolve=>{const r=db.transaction('saves').objectStore('saves').get(`${base}.current`);r.onsuccess=()=>resolve(JSON.parse(r.result));});
  const tx=db.transaction('saves','readwrite');for(const k of all?keys:[keys[0]])tx.objectStore('saves').put('{broken checkpoint',k);await new Promise<void>((resolve,reject)=>{tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);});
 },{base:key,all});}
 await corrupt(false);await page.locator('#load').click();await expect(page.locator('#recovery-panel')).toBeVisible();await expect(page.locator('#recovery-message')).toContainText('Recovered');
 await corrupt(true);await page.locator('#load').click();await expect(page.locator('#save-status')).toContainText('No valid');await expect(page.locator('#pause')).toBeDisabled();await expect(page.locator('#download-broken')).toBeVisible();
 const download=page.waitForEvent('download');await page.locator('#download-broken').click();expect((await download).suggestedFilename()).toContain('broken');
 await page.locator('#recovery-new').click();await page.locator('#new-export').uncheck();await page.locator('#new-seed').fill('123');await page.locator('#confirm-new').click();await expect(page.locator('#new-game-dialog')).not.toBeVisible();await expect(page.locator('#recovery-panel')).not.toBeVisible();await expect(page.locator('#save-status')).toContainText('Saved at tick');
 const second=await context.newPage();await second.goto('./');await expect(second.locator('#ownership-panel')).toBeVisible();await expect(second.locator('#save')).toBeDisabled();await second.locator('#take-over').click();await expect(page.locator('#ownership-panel')).toBeVisible();await expect(second.locator('#ownership-panel')).not.toBeVisible();
});
