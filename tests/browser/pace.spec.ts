import { expect, test } from '@playwright/test';

test('all speed selections work and slowing down or pausing clears accelerated debt', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('./'); await expect(page.locator('body')).toHaveAttribute('data-ready', 'true');
  const ticks = async () => Number((await page.locator('#tick').innerText()).replaceAll(',', ''));
  for (const speed of [1, 10, 100, 1000]) {
    await page.locator(`[data-speed="${speed}"]`).click();
    await expect(page.locator(`[data-speed="${speed}"]`)).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#playback-rate')).toContainText(`${speed}× selected`);
    const before = await ticks();
    await expect.poll(ticks, { timeout: 10000 }).toBeGreaterThan(before + (speed === 1 ? 0 : 5));
  }
  // Let the highest request build debt on slower devices, then slow down immediately.
  await page.waitForTimeout(1500);
  await page.locator('[data-speed="1"]').click();
  const before = await ticks(); await page.waitForTimeout(1300);
  const delta = await ticks() - before; expect(delta).toBeGreaterThanOrEqual(1); expect(delta).toBeLessThanOrEqual(3);
  await page.locator('[data-speed="1000"]').click(); await page.waitForTimeout(500);
  await page.locator('#pause').click(); await expect(page.locator('#playback-rate')).toHaveText('Paused');
  const paused = await ticks(); await page.waitForTimeout(700); expect(await ticks()).toBe(paused);
  await page.locator('#habitat').focus(); await page.keyboard.press('Digit2'); await expect(page.locator('[data-speed="10"]')).toHaveAttribute('aria-pressed', 'true');
  await expect.poll(ticks).toBeGreaterThan(paused);
  await page.keyboard.press('Space'); await expect(page.locator('#pause-label')).toHaveText('Resume');
  expect(errors).toEqual([]);
});

test('ordinary travel has intermediate rendered positions and keeps complete images within the map', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message)); page.on('dialog', d => d.accept());
  await page.addInitScript(() => {
    const frames: { x: number; y: number; inside: boolean }[] = [];
    Object.assign(window, { movementFrames: frames });
    const draw = CanvasRenderingContext2D.prototype.drawImage;
    CanvasRenderingContext2D.prototype.drawImage = function(this: CanvasRenderingContext2D, image: CanvasImageSource, ...args: number[]) {
      if (this.canvas.id === 'habitat' && ((image instanceof HTMLImageElement && image.src.includes('%3Ctitle%3EDerbil'))
        || (image instanceof HTMLCanvasElement && image.dataset.derbil==='true'))) {
        const m = this.getTransform(), [x, y, w, h] = args;
        const corners = [[x, y], [x + w, y], [x, y + h], [x + w, y + h]].map(([px, py]) => ({ x: m.a * px + m.c * py + m.e, y: m.b * px + m.d * py + m.f }));
        frames.push({ x: m.e, y: m.f, inside: corners.every(p => p.x >= -.01 && p.y >= -.01 && p.x <= this.canvas.width + .01 && p.y <= this.canvas.height + .01) });
        if (frames.length > 1000) frames.shift();
      }
      (draw as (...args: unknown[]) => void).call(this, image, ...args);
    } as typeof draw;
  });
  await page.goto('./'); await expect(page.locator('body')).toHaveAttribute('data-ready', 'true');
  const viteModule = 'vite', bufferModule = 'node:buffer', { Buffer } = await import(bufferModule), { createServer } = await import(viteModule);
  const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false, watch: null }, appType: 'custom' });
  let payload: string, edgePayload: string;
  try {
    const { createHabitat } = await server.ssrLoadModule('/src/sim/habitat.ts');
    const { encodeCheckpoint } = await server.ssrLoadModule('/src/persistence/checkpoint.ts');
    const s = createHabitat(84, 1), c = s.creatures[0];
    s.clock.speed = 1; c.needs = { hunger: 10, fatigue: 10, boredom: 20, loneliness: 20, stress: 0 };
    const { x, y } = c.position;
    c.currentAction = { kind: 'wander', targetFruitId: null, target: { x: x + 5, y }, path: Array.from({ length: 5 }, (_, i) => ({ x: x + i + 1, y })), workTicks: 0 };
    payload = encodeCheckpoint(s, Date.now());
    c.currentAction = null; c.position = { x: .5, y: .5 }; s.clock.speed = 0;
    edgePayload = encodeCheckpoint(s, Date.now());
  } finally { await server.close(); }
  await page.locator('#world-management > summary').click();
  await page.locator('#import-world').setInputFiles({ name: 'movement.json', mimeType: 'application/json', buffer: Buffer.from(payload) });
  await expect(page.locator('#creature-roster button')).toHaveCount(1);
  await page.evaluate(() => { (window as unknown as { movementFrames: unknown[] }).movementFrames.length = 0; });
  await page.waitForTimeout(2200);
  const frames = await page.evaluate(() => (window as unknown as { movementFrames: { x: number; y: number; inside: boolean }[] }).movementFrames);
  expect(frames.length).toBeGreaterThan(20);
  expect(new Set(frames.map(p => p.x.toFixed(2))).size).toBeGreaterThan(15);
  expect(frames.every(p => p.inside)).toBe(true);
  await page.locator('#import-world').setInputFiles({ name: 'edge.json', mimeType: 'application/json', buffer: Buffer.from(edgePayload) });
  await expect(page.locator('#pause-label')).toHaveText('Resume');
  await page.evaluate(() => { (window as unknown as { movementFrames: unknown[] }).movementFrames.length = 0; });
  await expect.poll(async () => page.evaluate(() => (window as unknown as { movementFrames: unknown[] }).movementFrames.length)).toBeGreaterThan(5);
  expect(await page.evaluate(() => (window as unknown as { movementFrames: { inside: boolean }[] }).movementFrames.every(p => p.inside))).toBe(true);
  expect(errors).toEqual([]);
});
