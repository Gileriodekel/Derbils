import type { AppearanceSpec, Config, DeepReadonly, Point } from '../../sim/types';

/** Body roots move together; local head/limb/tail scales act around their attachment joints. */
export function appearanceLayout(spec: DeepReadonly<AppearanceSpec>, config: DeepReadonly<Config>) {
  const data = config.appearance, p = spec.proportions;
  function scale(slotId: string): Point {
    const group = data.slots.find(s => s.id === slotId)!.proportion;
    const local = group === 'body' ? 1 : p[group];
    return { x: p.width * local, y: p.height * local };
  }
  function root(partId: string, visited = new Set<string>()): Point {
    if (visited.has(partId)) throw new Error('Cyclic appearance attachment.');
    visited.add(partId);
    const part = spec.parts.find(p => p.partId === partId)!;
    const slot = data.slots.find(s => s.id === part.slot)!;
    const base = { x: (slot.anchor.x * data.frame.size - data.frame.bodyCenter.x) * p.width,
      y: (slot.anchor.y * data.frame.size - data.frame.bodyCenter.y) * p.height };
    if (!slot.attachTo) return base;
    const parent = spec.parts.find(p => p.partId === slot.attachTo!.partId);
    if (!parent) throw new Error('Missing appearance attachment parent.');
    const origin = root(parent.partId, visited), local = scale(parent.slot);
    const tip = data.parts.find(p => p.id === parent.partId)!.tiers.find(t => t.tier === parent.tier)!.attachments![slot.attachTo.point];
    return { x: slot.attachTo.yOnly ? base.x : origin.x + tip.x * local.x, y: origin.y + tip.y * local.y };
  }
  return { root, scale };
}
