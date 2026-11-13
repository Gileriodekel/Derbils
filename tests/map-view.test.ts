import { describe, expect, it } from 'vitest';
import { createMapCamera } from '../src/render/camera';
import { createReadyImages } from '../src/render/ready-images';
import { readSettings, settingsKey, writeSettings } from '../src/app/settings';

describe('map camera', () => {
  it('anchors wheel zoom to the cursor and inverts picking at every scale', () => {
    const camera = createMapCamera(), w = 900, h = 480, point = { x: 370, y: 230 };
    const before = camera.unproject(point.x, point.y, w, h);
    for (const factor of [1.3, 1.7, .8]) {
      camera.zoomAt(factor, point.x, point.y, w, h);
      const after = camera.unproject(point.x, point.y, w, h);
      expect(after.x).toBeCloseTo(before.x, 12); expect(after.y).toBeCloseTo(before.y, 12);
      const screen = camera.project(after.x, after.y, w, h);
      expect(screen.x).toBeCloseTo(point.x, 12); expect(screen.y).toBeCloseTo(point.y, 12);
    }
  });
  it('pans, clamps at the map edges, survives resizing and fits without blank margins', () => {
    const camera = createMapCamera(); camera.zoomAt(100, 450, 240, 900, 480);
    expect(camera.zoom).toBe(8); camera.pan(80, 40, 900, 480);
    const point = camera.unproject(450, 240, 900, 480);
    expect(camera.unproject(225, 120, 450, 240)).toEqual(point);
    for (const delta of [-100000, 100000]) {
      camera.pan(delta, delta, 900, 480);
      expect(camera.unproject(0, 0, 900, 480).x).toBeGreaterThanOrEqual(0);
      expect(camera.unproject(900, 480, 900, 480).y).toBeLessThanOrEqual(1);
    }
    camera.reset(); expect(camera.zoom).toBe(1);
    expect(camera.project(0, 0, 900, 480)).toEqual({ x: 0, y: 0 });
    expect(camera.project(1, 1, 900, 480)).toEqual({ x: 900, y: 480 });
  });
});

function delayedImage() {
  const target = new EventTarget(), image = Object.assign(target, { complete: false, naturalWidth: 0 });
  return { image: image as unknown as HTMLImageElement, finish() { image.complete = true; image.naturalWidth = 100; target.dispatchEvent(new Event('load')); } };
}
describe('asynchronous animation images', () => {
  it('keeps a visible frame during loading and ignores out-of-order older completions', () => {
    const frames = createReadyImages(4), first = delayedImage(), older = delayedImage(), newest = delayedImage(), pending = delayedImage();
    expect(frames.get('derbil', first.image)).toBeUndefined(); first.finish();
    expect(frames.get('derbil', older.image)).toBe(first.image);
    expect(frames.get('derbil', newest.image)).toBe(first.image); newest.finish(); older.finish();
    expect(frames.get('derbil', pending.image)).toBe(newest.image);
    pending.finish(); expect(frames.get('derbil', pending.image)).toBe(pending.image);
  });
  it('cannot leak another life or a cleared world into a new frame', () => {
    const frames = createReadyImages(2), old = delayedImage(), fresh = delayedImage();
    frames.get('old-life', old.image); old.finish();
    expect(frames.get('egg', fresh.image)).toBeUndefined();
    frames.clear(); fresh.finish(); expect(frames.get('egg', delayedImage().image)).toBeUndefined();
  });
});
it('migrates old UI preferences and persists hidden action bubbles separately from saves', () => {
  const values = new Map([[settingsKey, JSON.stringify({ socialOverlays: false })], ['world', 'unchanged']]);
  const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value); } };
  const old = readSettings(storage); expect(old.actionBubbles).toBe(true); expect(old.socialOverlays).toBe(false);
  writeSettings(storage, { ...old, actionBubbles: false });
  expect(readSettings(storage).actionBubbles).toBe(false); expect(values.get('world')).toBe('unchanged');
});
