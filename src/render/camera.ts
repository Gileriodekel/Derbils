import { config } from '../data/config';

/** Normalized map camera. Presentation only: no simulation coordinates are changed. */
export function createMapCamera() {
  const limits = config.presentation.mapCamera;
  let zoom = limits.minimumZoom, centerX = .5, centerY = .5;
  function constrain() {
    const half = .5 / zoom;
    centerX = Math.max(half, Math.min(1 - half, centerX));
    centerY = Math.max(half, Math.min(1 - half, centerY));
  }
  function unproject(x: number, y: number, width: number, height: number) {
    return { x: centerX + (x / width - .5) / zoom, y: centerY + (y / height - .5) / zoom };
  }
  function project(x: number, y: number, width: number, height: number) {
    return { x: (x - centerX) * width * zoom + width / 2, y: (y - centerY) * height * zoom + height / 2 };
  }
  return {
    get zoom() { return zoom; }, project, unproject,
    zoomAt(factor: number, x: number, y: number, width: number, height: number) {
      if (width <= 0 || height <= 0 || !Number.isFinite(factor) || factor <= 0) return;
      const anchor = unproject(x, y, width, height);
      zoom = Math.max(limits.minimumZoom, Math.min(limits.maximumZoom, zoom * factor));
      centerX = anchor.x - (x / width - .5) / zoom;
      centerY = anchor.y - (y / height - .5) / zoom;
      constrain();
    },
    pan(dx: number, dy: number, width: number, height: number) {
      if (width <= 0 || height <= 0) return;
      centerX -= dx / (width * zoom); centerY -= dy / (height * zoom); constrain();
    },
    reset() { zoom = limits.minimumZoom; centerX = centerY = .5; },
  };
}
