import type { DeepReadonly } from '../sim/types';
import type { DrawCommand } from './scene/types';

const escape = (text: string) => text.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]!);

/** One element per command; no external resources, style sheets or platform objects. */
export function sceneToSvg(scene: DeepReadonly<DrawCommand[]>, maximumRadius: number, pixels: number, title = 'Derbil'): string {
  const clips = new Map<string, string>();
  const definitions: string[] = [];
  const elements = scene.map(command => {
    let clipping = '';
    if (command.clip) {
      const key = JSON.stringify(command.clip.radius);
      let id = clips.get(key);
      if (!id) { id = `clip-${clips.size}`; clips.set(key, id);
        definitions.push(`<clipPath id="${id}" clipPathUnits="userSpaceOnUse"><ellipse cx="0" cy="0" rx="${command.clip.radius.x}" ry="${command.clip.radius.y}"/></clipPath>`); }
      clipping = ` clip-path="url(#${id})"`;
    }
    const t = command.transform;
    const style = `${clipping} data-part="${escape(command.partId)}" transform="matrix(${t.a} ${t.b} ${t.c} ${t.d} ${t.e} ${t.f})" fill="${escape(command.fill ?? 'none')}" stroke="${escape(command.stroke ?? 'none')}" stroke-width="${command.strokeWidth}" opacity="${command.opacity}" stroke-linejoin="round" stroke-linecap="round"`;
    if (command.primitive === 'ellipse') return `<ellipse ${style} cx="${command.center.x}" cy="${command.center.y}" rx="${command.radius.x}" ry="${command.radius.y}"/>`;
    const d = command.segments.map(s => s.op === 'close' ? 'Z' : s.op === 'move' ? `M ${s.to.x} ${s.to.y}` :
      s.op === 'line' ? `L ${s.to.x} ${s.to.y}` : `Q ${s.control.x} ${s.control.y} ${s.to.x} ${s.to.y}`).join(' ');
    return `<path ${style} d="${d}"/>`;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${pixels}" height="${pixels}" viewBox="${-maximumRadius} ${-maximumRadius} ${maximumRadius * 2} ${maximumRadius * 2}" role="img"><title>${escape(title)}</title>\n<defs>${definitions.join('')}</defs>\n${elements.join('\n')}\n</svg>\n`;
}
