import type { AppearanceSpec, Config, DeepReadonly, DrawRecipe, Point, VisiblePart } from '../../sim/types';
import type { CommandStyle, DrawCommand, Facing } from './types';
import { resolvePath } from './paths';
import { sceneBounds } from './bounds';
import { appearanceLayout } from './layout';
import { patternCommands } from './patterns';
import { colorCss } from './colors';

/** All static geometry choices are resolved here; no display or animation resources are read. */
export function buildScene(appearance: DeepReadonly<AppearanceSpec>, facing: Facing, config: DeepReadonly<Config>): DrawCommand[] {
  const data = config.appearance, mirror = facing === 'left' ? -1 : 1, scale = appearance.bodyScale;
  const layout = appearanceLayout(appearance, config), dormant = appearance.stage === 'egg' || appearance.stage === 'cocoon';
  const tailRoot = dormant ? { x: 0, y: 0 } : layout.root('stamina-tail');
  function command(recipe: DeepReadonly<DrawRecipe>, origin: Point, local: Point, part: DeepReadonly<VisiblePart>): DrawCommand {
    const cos = Math.cos(recipe.rotation), sin = Math.sin(recipe.rotation), slot = data.slots.find(s => s.id === part.slot)!;
    const color = (role: typeof recipe.fillRole) => role === null ? null : colorCss(appearance.baseColors[role], recipe.saturationMultiplier);
    const style: CommandStyle = { partId: part.partId, slot: part.slot, tier: part.tier, layerIndex: part.layerIndex,
      fill: color(recipe.fillRole), stroke: color(recipe.strokeRole), strokeWidth: recipe.strokeWidth, opacity: recipe.opacity,
      motion: recipe.motion ?? slot.motion, pivot: { x: mirror * scale * tailRoot.x, y: scale * tailRoot.y },
      transform: { a: mirror * scale * local.x * cos * recipe.scale.x, b: scale * local.y * sin * recipe.scale.x,
        c: -mirror * scale * local.x * sin * recipe.scale.y, d: scale * local.y * cos * recipe.scale.y,
        e: mirror * scale * (origin.x + recipe.offset.x * local.x), f: scale * (origin.y + recipe.offset.y * local.y) } };
    return recipe.primitive === 'ellipse' ? { ...style, primitive: 'ellipse', radius: { ...recipe.radius }, center: { x: 0, y: 0 } } :
      { ...style, primitive: recipe.primitive, segments: resolvePath(recipe.points, recipe.primitive === 'polygon', recipe.smoothing) };
  }
  const commands: DrawCommand[] = [];
  if (appearance.stage === 'egg' || appearance.stage === 'cocoon') {
    const part = { partId: appearance.stage, slot: 'body', tier: 0, sourceSkill: null, layerIndex: data.layerOrder.indexOf('body') };
    for (const recipe of data.dormant[appearance.stage]) commands.push(command(recipe, { x: 0, y: 0 }, { x: 1, y: 1 }, part));
    commands.push(...patternCommands(appearance, commands[0], config));
  } else for (const part of appearance.parts) {
    const tier = data.parts.find(p => p.id === part.partId)!.tiers.find(t => t.tier === part.tier)!;
    const recipes = tier.variants?.[appearance.ears] ?? tier.recipe;
    for (const recipe of recipes) commands.push(command(recipe, layout.root(part.partId), layout.scale(part.slot), part));
    if (part.partId === 'base-body') commands.push(...patternCommands(appearance, commands.find(c => c.partId === part.partId)!, config));
  }
  commands.sort((a, b) => a.layerIndex - b.layerIndex);
  const bounds = sceneBounds(commands);
  const radius = Math.hypot(Math.max(Math.abs(bounds.minX), Math.abs(bounds.maxX)), Math.max(Math.abs(bounds.minY), Math.abs(bounds.maxY)));
  const fit = Math.min(1, (data.frame.maximumRadius - data.animation.boundsMargin) / (radius || 1));
  if (fit < 1) for (const c of commands) {
    for (const key of ['a', 'b', 'c', 'd', 'e', 'f'] as const) c.transform[key] *= fit;
    c.pivot.x *= fit; c.pivot.y *= fit;
  }
  return commands;
}
