import type { DeepReadonly } from '../sim/types';
import type { DrawCommand } from './scene/types';

/** Executes resolved commands. Part identity, tier, facing, anchors and sizes are already decided. */
export function drawScene(ctx: CanvasRenderingContext2D, scene: DeepReadonly<DrawCommand[]>): void {
  for (const command of scene) {
    ctx.save();
    const t = command.transform;
    ctx.transform(t.a, t.b, t.c, t.d, t.e, t.f);
    ctx.globalAlpha *= command.opacity;
    ctx.lineWidth = command.strokeWidth; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.beginPath();
    if (command.clip) { ctx.ellipse(0, 0, command.clip.radius.x, command.clip.radius.y, 0, 0, Math.PI * 2); ctx.clip(); ctx.beginPath(); }
    if (command.primitive === 'ellipse') ctx.ellipse(command.center.x, command.center.y, command.radius.x, command.radius.y, 0, 0, Math.PI * 2);
    else for (const segment of command.segments) {
      if (segment.op === 'move') ctx.moveTo(segment.to.x, segment.to.y);
      else if (segment.op === 'line') ctx.lineTo(segment.to.x, segment.to.y);
      else if (segment.op === 'quadratic') ctx.quadraticCurveTo(segment.control.x, segment.control.y, segment.to.x, segment.to.y);
      else ctx.closePath();
    }
    if (command.fill) { ctx.fillStyle = command.fill; ctx.fill(); }
    if (command.stroke) { ctx.strokeStyle = command.stroke; ctx.stroke(); }
    ctx.restore();
  }
}
