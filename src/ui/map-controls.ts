import { config } from '../data/config';
import type { createMapCamera } from '../render/camera';

export function bindMapControls(canvas: HTMLCanvasElement, camera: ReturnType<typeof createMapCamera>, select: (x: number, y: number) => void) {
  const controls = canvas.parentElement!.querySelector<HTMLElement>('.map-controls')!;
  const limits = config.presentation.mapCamera;
  let pointer: { id: number; startX: number; startY: number; x: number; y: number; dragged: boolean } | null = null;
  let suppressClick = false;
  function update() {
    controls.querySelector('output')!.textContent = `${Math.round(camera.zoom * 100)}%`;
    controls.querySelector<HTMLButtonElement>('#map-zoom-out')!.disabled = camera.zoom <= limits.minimumZoom;
    controls.querySelector<HTMLButtonElement>('#map-zoom-in')!.disabled = camera.zoom >= limits.maximumZoom;
  }
  function zoomAt(factor: number, clientX?: number, clientY?: number) {
    const box = canvas.getBoundingClientRect();
    camera.zoomAt(factor, clientX === undefined ? box.width / 2 : clientX - box.left,
      clientY === undefined ? box.height / 2 : clientY - box.top, box.width, box.height);
    update();
  }
  canvas.addEventListener('wheel', event => {
    event.preventDefault();
    const units = event.deltaMode === 1 ? limits.wheelLinePixels : event.deltaMode === 2 ? canvas.clientHeight : 1;
    const delta = Math.max(-limits.maximumWheelDelta, Math.min(limits.maximumWheelDelta, event.deltaY * units));
    zoomAt(Math.exp(-delta * limits.wheelSensitivity), event.clientX, event.clientY);
  }, { passive: false });
  canvas.addEventListener('pointerdown', event => {
    if (event.button !== 0 || !event.isPrimary) return;
    suppressClick = false;
    pointer = { id: event.pointerId, startX: event.clientX, startY: event.clientY, x: event.clientX, y: event.clientY, dragged: false };
    canvas.setPointerCapture(event.pointerId); canvas.focus({ preventScroll: true });
  });
  canvas.addEventListener('pointermove', event => {
    if (!pointer || pointer.id !== event.pointerId) return;
    if (!pointer.dragged && Math.hypot(event.clientX - pointer.startX, event.clientY - pointer.startY) < limits.dragThresholdPixels) return;
    pointer.dragged = true; canvas.classList.add('panning');
    const box = canvas.getBoundingClientRect();
    camera.pan(event.clientX - pointer.x, event.clientY - pointer.y, box.width, box.height);
    pointer.x = event.clientX; pointer.y = event.clientY;
  });
  function release(event: PointerEvent) {
    if (!pointer || pointer.id !== event.pointerId) return;
    suppressClick = pointer.dragged || event.type === 'pointercancel'; pointer = null;
    canvas.classList.remove('panning');
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
  }
  canvas.addEventListener('pointerup', release); canvas.addEventListener('pointercancel', release);
  canvas.addEventListener('lostpointercapture', event => { if (pointer?.id === event.pointerId) release(event); });
  canvas.addEventListener('click', event => {
    if (suppressClick) { suppressClick = false; return; }
    select(event.clientX, event.clientY);
  });
  controls.querySelector('#map-zoom-in')!.addEventListener('click', () => zoomAt(limits.buttonZoomFactor));
  controls.querySelector('#map-zoom-out')!.addEventListener('click', () => zoomAt(1 / limits.buttonZoomFactor));
  controls.querySelector('#map-fit')!.addEventListener('click', () => { camera.reset(); update(); });
  canvas.addEventListener('keydown', event => {
    const pan = limits.keyboardPanPixels;
    if (event.key === '+' || event.key === '=') zoomAt(limits.buttonZoomFactor);
    else if (event.key === '-') zoomAt(1 / limits.buttonZoomFactor);
    else if (event.key === 'Home') { camera.reset(); update(); }
    else if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
      const box = canvas.getBoundingClientRect();
      camera.pan(event.key === 'ArrowLeft' ? pan : event.key === 'ArrowRight' ? -pan : 0,
        event.key === 'ArrowUp' ? pan : event.key === 'ArrowDown' ? -pan : 0, box.width, box.height);
    } else return;
    event.preventDefault();
  });
  update();
  return { update };
}
