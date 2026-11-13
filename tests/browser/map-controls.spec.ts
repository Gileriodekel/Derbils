import { expect, test, type Page } from '@playwright/test';
import type { SaveState, Skill } from '../../src/sim/types';

interface Frame { images: number; thoughts: number; closures: number; positions: { x: number; y: number }[] }
declare global { interface Window { mapFrames: Frame[]; mapFrame: Frame } }
async function observeMap(page: Page, delayImages = false) {
  await page.addInitScript(({ delayImages }) => {
    window.mapFrames = []; window.mapFrame = { images: 0, thoughts: 0, closures: 0, positions: [] };
    const proto = CanvasRenderingContext2D.prototype, clear = proto.clearRect, draw = proto.drawImage, text = proto.fillText, stroke = proto.stroke;
    proto.clearRect = function(x, y, w, h) {
      if (this.canvas.id === 'habitat') {
        window.mapFrames.push(window.mapFrame); if (window.mapFrames.length > 600) window.mapFrames.shift();
        window.mapFrame = { images: 0, thoughts: 0, closures: 0, positions: [] };
      }
      clear.call(this, x, y, w, h);
    };
    proto.drawImage = function(this: CanvasRenderingContext2D, image: CanvasImageSource, ...args: number[]) {
      if (this.canvas.id === 'habitat' && ((image instanceof HTMLImageElement && image.src.includes('%3Ctitle%3EDerbil'))
        || (image instanceof HTMLCanvasElement && image.dataset.derbil==='true'))) {
        const matrix = this.getTransform(); window.mapFrame.images++;
        window.mapFrame.positions.push({ x: matrix.e / devicePixelRatio, y: matrix.f / devicePixelRatio });
      }
      (draw as (...args: unknown[]) => void).call(this, image, ...args);
    } as typeof draw;
    proto.fillText = function(label, x, y, maxWidth?) {
      if (this.canvas.id === 'habitat' && this.font.startsWith('500 12px')) window.mapFrame.thoughts++;
      if (maxWidth === undefined) text.call(this, label, x, y); else text.call(this, label, x, y, maxWidth);
    };
    proto.stroke = function(this: CanvasRenderingContext2D, ...args: unknown[]) {
      if (this.canvas.id === 'habitat' && this.strokeStyle === '#9f55e1' && this.getLineDash().length) window.mapFrame.closures++;
      (stroke as (...args: unknown[]) => void).apply(this, args);
    } as typeof stroke;
    if (delayImages) {
      const descriptor = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src')!;
      Object.defineProperty(HTMLImageElement.prototype, 'src', { ...descriptor, set(value: string) {
        if (value.startsWith('data:image/svg+xml')) setTimeout(() => descriptor.set!.call(this, value), 120);
        else descriptor.set!.call(this, value);
      } });
    }
  }, { delayImages });
}
const latest = (page: Page) => page.evaluate(() => window.mapFrames.at(-1)!);

test('pointer-anchored wheel zoom, pan, picking, fit and persistent action bubbles', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await observeMap(page); await page.setViewportSize({ width: 1400, height: 1000 });
  await page.goto('./'); await expect(page.locator('body')).toHaveAttribute('data-ready', 'true');
  if (await page.locator('#pause-label').textContent() === 'Pause') await page.locator('#pause').click();
  await expect.poll(async () => (await latest(page)).images).toBe(12);
  expect((await latest(page)).thoughts).toBeGreaterThan(0); expect((await latest(page)).closures).toBe(0);
  const canvas = page.locator('#habitat'); await canvas.scrollIntoViewIfNeeded();
  const box = (await canvas.boundingBox())!, anchor = (await latest(page)).positions[0];
  await page.mouse.click(box.x + anchor.x, box.y + anchor.y);
  const selected = await page.locator('#select-creature').getAttribute('data-creature-id');
  const scroll = await page.evaluate(() => scrollY);
  await page.mouse.wheel(0, -300);
  await expect(page.locator('.map-controls output')).toHaveText('182%');
  await expect.poll(async () => Math.abs((await latest(page)).positions[0].x - anchor.x)).toBeLessThan(1);
  expect(await page.evaluate(() => scrollY)).toBe(scroll);
  await page.mouse.click(box.x + anchor.x, box.y + anchor.y);
  await expect(page.locator('#select-creature')).toHaveAttribute('data-creature-id', selected!);
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2); await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 45, box.y + box.height / 2 + 25, { steps: 5 }); await page.mouse.up();
  await expect.poll(async () => Math.abs((await latest(page)).positions[0].x - anchor.x - 45)).toBeLessThan(1);
  await expect(page.locator('#select-creature')).toHaveAttribute('data-creature-id', selected!);
  const moved = (await latest(page)).positions[0]; await page.mouse.click(box.x + moved.x, box.y + moved.y);
  await expect(page.locator('#select-creature')).toHaveAttribute('data-creature-id', selected!);
  await page.locator('#map-fit').click(); await expect(page.locator('.map-controls output')).toHaveText('100%');
  await page.locator('#hide-actions').check(); await expect.poll(async () => (await latest(page)).thoughts).toBe(0);
  await expect(page.locator('#thought')).not.toBeEmpty();
  const tick = await page.locator('#tick').innerText(); await page.locator('#save').click();
  await expect(page.locator('#save-status')).toContainText('Saved at tick'); await page.reload();
  await expect(page.locator('body')).toHaveAttribute('data-ready', 'true'); await expect(page.locator('#tick')).toHaveText(tick);
  await expect(page.locator('#hide-actions')).toBeChecked(); await expect.poll(async () => (await latest(page)).images).toBe(12);
  expect((await latest(page)).thoughts).toBe(0);
  await canvas.focus(); await page.keyboard.press('+'); await expect(page.locator('.map-controls output')).toHaveText('150%');
  await page.keyboard.press('Home'); await expect(page.locator('.map-controls output')).toHaveText('100%');
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});

test('30 moving Derbils stay drawn while SVG assets decode slowly', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await observeMap(page, true); page.on('dialog', dialog => dialog.accept());
  await page.goto('./'); await expect(page.locator('body')).toHaveAttribute('data-ready', 'true');
  const nodeBuffer = 'node:buffer'; const { Buffer } = await import(nodeBuffer);
  // The app's JSON modules need Vite's loader when creating a Node-side fixture.
  const viteModule = 'vite', { createServer } = await import(viteModule);
  const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false, watch: null }, appType: 'custom' });
  let payload: string;
  try {
    const { createHabitat } = await server.ssrLoadModule('/src/sim/habitat.ts');
    const { encodeCheckpoint } = await server.ssrLoadModule('/src/persistence/checkpoint.ts');
    const { xpAtLevel, skillCap } = await server.ssrLoadModule('/src/sim/skills.ts');
    const state: SaveState = createHabitat(912345, 30); state.settings.autoBreed = false; state.clock.speed = 10;
    for (const c of state.creatures) for (const skill of Object.keys(c.xp) as Skill[]) c.xp[skill] = xpAtLevel(Math.min(60, skillCap(c, skill)), skill);
    payload = encodeCheckpoint(state, Date.now());
  } finally { await server.close(); }
  await page.locator('#world-management > summary').click();
  await page.locator('#import-world').setInputFiles({ name: 'moving-world.json', mimeType: 'application/json', buffer: Buffer.from(payload) });
  await expect.poll(async () => (await latest(page)).images).toBe(30);
  await page.evaluate(() => { window.mapFrames = []; });
  await expect.poll(async () => (await page.evaluate(() => window.mapFrames.length)), { timeout: 30000 }).toBeGreaterThan(180);
  const frames = await page.evaluate(() => window.mapFrames);
  expect(Math.min(...frames.map(f => f.images))).toBe(30);
  const first = frames[0].positions, last = frames.at(-1)!.positions;
  expect(first.some((p, i) => Math.hypot(p.x - last[i].x, p.y - last[i].y) > 1)).toBe(true);
  expect(errors).toEqual([]);
});
