import parts from './dynasty-parts.json';
import { createReadyImages } from './ready-images';
import { drawVectorPart } from './vector-parts';
import { config } from '../data/config';
import { hslToRgb, rgbToHsl } from '../sim/appearance/color';
import { derivePhenotype } from '../sim/genetics/expression';
import { skillLevel } from '../sim/skills';
import type { Creature, DeepReadonly, FruitKind, Skill } from '../sim/types';

const bounds = { x: 150, y: 500, width: 2150, height: 1450 };
const originalStyle = 'fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5';
export function derbilColors(c: DeepReadonly<Creature>) {
  const p = derivePhenotype(c.genome).palette, a = config.dynasty.art;
  const saturation = p.saturation * (c.stage==='elder'?config.lifecycle.stages.elder.saturationMultiplier:1);
  const family = (h: number, diet = false) => {
    let paint={hue:h,saturation,lightness:p.lightness,alpha:1};
    if(diet)for(const modifier of c.appearanceModifiers){const rgb=hslToRgb(paint);paint=rgbToHsl(rgb.map((v,i)=>(1-modifier.magnitude)*v+modifier.magnitude*modifier.rgb[i]));}
    const color=(light:number)=>`hsl(${paint.hue} ${paint.saturation}% ${light}%)`;
    return {base:color(paint.lightness),highlight:color(Math.min(90,paint.lightness+a.highlightLightness-a.baseLightness))};
  };
  return { body: family(p.baseHue,true), feet: family(p.feetHue), eyes: family(p.eyeHue), tail: family(p.tailHue) };
}
function recolor(svg: string, base: string, highlight: string): string {
  // Only the artist's two gray fills are palette masks. Black/none/white, cheeks
  // and every outline keep their original paint and stroke geometry.
  return svg.replaceAll('fill:rgb(86,86,86)', `fill:${base}`).replaceAll('fill:rgb(128,128,128)', `fill:${highlight}`);
}
export function development(c: DeepReadonly<Creature>, skill: Skill): number {
  const a = config.dynasty.art, level = skillLevel(c, skill);
  return level < a.developmentStart ? 0 : Math.min(1, (level - a.developmentStart + 1) / (a.developmentMaximum - a.developmentStart + 1));
}
const transform = (svg: string, value: string) => `<g transform="${value}">${svg}</g>`;
const around = (x: number, y: number, operation: string) => `translate(${x} ${y}) ${operation} translate(${-x} ${-y})`;
export function derbilLayers(c: DeepReadonly<Creature>) {
  const color = derbilColors(c);
  return {
    tail: recolor(parts.tail, color.tail.base, color.tail.base),
    leftFoot: recolor(parts.leftFoot, color.feet.base, color.feet.highlight),
    rightFoot: recolor(parts.rightFoot, color.feet.base, color.feet.highlight),
    body: recolor(parts.body, color.body.base, color.body.highlight),
    eyes: recolor(parts.eyes, color.eyes.base, color.eyes.highlight),
    wings: recolor(parts.wings, color.body.base, color.body.highlight),
    leftArm: recolor(parts.leftArm, color.body.base, color.body.highlight),
    rightArm: recolor(parts.rightArm, color.body.base, color.body.highlight),
    fin: recolor(parts.fin, color.tail.base, color.tail.base),
  };
}
function cosmeticSvg(c:DeepReadonly<Creature>):string {
  const part=config.appearance.parts.find(p=>p.cosmetic===c.awards.equipped);if(!part)return '';
  const paint=derbilColors(c),anchor=c.awards.equipped==='leaf_crown'?{x:1450,y:650}:c.awards.equipped==='ribbon'?{x:1470,y:1190}:{x:1540,y:1450};
  return part.tiers[0].recipe.map(r=>r.primitive==='polygon'?`<polygon data-part="${part.id}" points="${r.points.map(p=>`${p.x},${p.y}`).join(' ')}" transform="translate(${anchor.x} ${anchor.y}) scale(18)" fill="${paint.tail.base}" stroke="black" stroke-width="${r.strokeWidth}"/>`:'').join('');
}
export function eggSvg(c: DeepReadonly<Creature>): string {
  const color = derbilColors(c);
  // BASE and DOTS are distinct masks; the supplied embedded highlight is kept.
  return parts.egg.replace('fill:rgb(128,128,128)', `fill:${color.body.base}`).replace('fill:rgb(86,86,86)', `fill:${color.tail.base}`);
}
export function derbilSvg(c: DeepReadonly<Creature>, tick = 0, animate = false): string {
  if (c.stage === 'egg' || c.stage === 'cocoon') return eggSvg(c);
  const p = derbilLayers(c), a = config.dynasty.art;
  const run = development(c, 'run'), fly = development(c, 'fly'), strength = development(c, 'strength'), swim = development(c, 'swim');
  const moving = animate && c.dynasty.moving;
  const footAngle = moving && c.dynasty.movementMode === 'walk' ? Math.sin(Math.floor(((tick / a.walkCycleTicks) % 1) * 8) * Math.PI / 4) * a.footAngle : 0;
  const wingScale = moving && c.dynasty.movementMode === 'fly' ? 1 + Math.sin(Math.floor(((tick / a.flapCycleTicks) % 1) * 8) * Math.PI / 4) * a.wingAngle / 100 : 1;
  const feet = (part: string, x: number, shift: number, angle: number) => transform(transform(part,
    `matrix(${1 + 1.000596 * run} 0 0 ${1 + 1.000596 * run} ${shift * run} ${-1702.893761 * run})`), around(x,1700,`rotate(${angle})`));
  const grow = (part: string, amount: number, x: number, y: number, extra = '') => amount > 0 ? transform(part, around(x,y,`scale(${.25 + .75 * amount}) ${extra}`)) : '';
  const content = grow(p.fin,swim,365,1230) + p.tail + feet(p.rightFoot,1630,-1631.646394,-footAngle) + feet(p.leftFoot,1155,-1155.794605,footAngle)
    + grow(p.wings,fly,1400,1100,`scale(1 ${wingScale})`) + p.body + p.eyes
    + grow(p.leftArm,strength,1120,1270) + grow(p.rightArm,strength,1852,1388) + cosmeticSvg(c);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${bounds.width}" height="${bounds.height}" viewBox="${bounds.x} ${bounds.y} ${bounds.width} ${bounds.height}" style="${originalStyle}"><title>Derbil</title>${content}</svg>`;
}
// Finite artwork combinations: fruit catalog × two berry flags × land/water.
const plantImages = new Map<string, string>();
const berryImages = new Map<FruitKind, string>();
export function plantSvg(kind: FruitKind, berries: readonly [boolean,boolean], water: boolean): string {
  const key = `${kind}:${berries[0]}:${berries[1]}:${water}`, old = plantImages.get(key);
  if (old) return old;
  const stat = Object.values(config.dynasty.stats).find(s => s.fruit === kind);
  const base = stat?.color ?? config.fruit[kind].color, border = stat?.border ?? '#555555';
  let svg = water ? parts.kelp : parts.bush;
  // Individual parent group visibility leaves the other original berry untouched.
  for (let i = 0; i < 2; i++) if (!berries[i]) svg = svg.replace(`id="BERRY_${i+1}"`, `id="BERRY_${i+1}" visibility="hidden"`);
  // Both assets use the same named BASE/BORDER berry palette.
  svg = svg.replaceAll('fill:rgb(128,128,128)', `fill:${base}`).replaceAll('fill:rgb(86,86,86)', `fill:${border}`);
  plantImages.set(key, svg); return svg;
}

/** The supplied bush's first berry, retaining its original BASE/BORDER paths. */
export function berrySvg(kind:FruitKind):string {
  const old=berryImages.get(kind);if(old)return old;
  const stat=Object.values(config.dynasty.stats).find(s=>s.fruit===kind);
  const berry=parts.berry.replaceAll('fill:rgb(128,128,128)',`fill:${stat?.color??config.fruit[kind].color}`).replaceAll('fill:rgb(86,86,86)',`fill:${stat?.border??'#555555'}`);
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="565.3 311.7 11 11">${berry}</svg>`;
  berryImages.set(kind,svg);return svg;
}

export interface RasterSize { width: number; height: number }
/** Keep the original viewBox and all paths/colors; rasterize at the drawn device-pixel size. */
export function sizedSvg(svg: string, size: RasterSize): string {
  const width=Math.max(1,Math.ceil(size.width)),height=Math.max(1,Math.ceil(size.height));
  return svg.replace(/<svg\b[^>]*>/, tag => tag.replace(/\s(?:width|height|preserveAspectRatio)="[^"]*"/g,'')
    .replace('<svg',`<svg width="${width}" height="${height}" preserveAspectRatio="none"`));
}
const images = new Map<string, { image: HTMLImageElement; pixels: number }>();
let pixels=0;
function trimImages() {
  while(images.size>config.appearance.cache.maximum || (pixels>config.appearance.cache.rasterPixelBudget&&images.size>1)) {
    const key=images.keys().next().value!,entry=images.get(key)!;pixels-=entry.pixels;images.delete(key);
  }
}
/** Browser image cache is presentation-only. Eviction cannot affect simulation. */
export function svgImage(svg: string, onLoad?: () => void, size?: RasterSize): HTMLImageElement {
  const key=size?`${Math.ceil(size.width)}:${Math.ceil(size.height)}:${svg}`:svg;
  let entry = images.get(key);
  if (!entry) {
    const img = new Image(); entry={image:img,pixels:size?Math.max(1,Math.ceil(size.width))*Math.max(1,Math.ceil(size.height)):0};
    images.set(key,entry);pixels+=entry.pixels;
    if (!size) {const record=entry;img.addEventListener('load',()=>{
      if(images.get(key)!==record)return;record.pixels=img.naturalWidth*img.naturalHeight;pixels+=record.pixels;trimImages();
    },{once:true});}
    if (onLoad) img.addEventListener('load',onLoad,{once:true});
    if(size)svg=sizedSvg(svg,size);
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    trimImages();
  } else {
    images.delete(key); images.set(key,entry); // LRU: keep actively used animation frames resident.
    if (!entry.image.complete && onLoad) entry.image.addEventListener('load',onLoad,{once:true});
  }
  return entry.image;
}
export function createDerbilRenderer() {
  const ready = createReadyImages(config.appearance.cache.maximum);
  const frames = new Map<string,{canvas:HTMLCanvasElement;key:string}>();
  return {
    reset() { ready.clear(); frames.clear(); },
    retain(ids:ReadonlySet<string>) {
      for(const id of frames.keys())if(!ids.has(id))frames.delete(id);
      ready.retain(new Set([...ids].flatMap(id=>[`${id}:egg`,`${id}:cocoon`])));
    },
    draw(ctx: CanvasRenderingContext2D, c: DeepReadonly<Creature>, size: number, tick = 0, animate = false, facingLeft = false) {
      const dormant = c.stage === 'egg' || c.stage === 'cocoon', scale = dormant ? 1 : config.lifecycle.stages[c.stage].scale;
      const h = dormant ? size : size * bounds.height / bounds.width, matrix=ctx.getTransform();
      const raster={width:Math.max(1,Math.ceil(size*scale*Math.hypot(matrix.a,matrix.b))),height:Math.max(1,Math.ceil(h*scale*Math.hypot(matrix.c,matrix.d)))};
      let img:CanvasImageSource|undefined;
      if(dormant)img=ready.get(`${c.id}:${c.stage}`,svgImage(eggSvg(c),undefined,raster));
      else{
        const color=derbilColors(c),a=config.dynasty.art;
        const run=development(c,'run'),fly=development(c,'fly'),strength=development(c,'strength'),swim=development(c,'swim');
        const moving=animate&&c.dynasty.moving;
        const footAngle=moving&&c.dynasty.movementMode==='walk'?Math.sin(Math.floor(((tick/a.walkCycleTicks)%1)*8)*Math.PI/4)*a.footAngle:0;
        const wingScale=moving&&c.dynasty.movementMode==='fly'?1+Math.sin(Math.floor(((tick/a.flapCycleTicks)%1)*8)*Math.PI/4)*a.wingAngle/100:1;
        const key=JSON.stringify([raster,color,run,fly,strength,swim,footAngle,wingScale,c.awards.equipped]);
        let frame=frames.get(c.id);
        if(!frame){frame={canvas:document.createElement('canvas'),key:''};frame.canvas.dataset.derbil='true';frames.set(c.id,frame);}
        if(frame.key!==key){
          const canvas=frame.canvas;if(canvas.width!==raster.width||canvas.height!==raster.height){canvas.width=raster.width;canvas.height=raster.height;}
          const paint=canvas.getContext('2d')!;paint.resetTransform();paint.clearRect(0,0,canvas.width,canvas.height);
          paint.scale(canvas.width/bounds.width,canvas.height/bounds.height);paint.translate(-bounds.x,-bounds.y);
          const part=(name:Parameters<typeof drawVectorPart>[1],family:typeof color.body)=>drawVectorPart(paint,name,family.base,family.highlight);
          const grow=(name:Parameters<typeof drawVectorPart>[1],amount:number,x:number,y:number,family:typeof color.body,wing=1)=>{
            if(amount<=0)return;paint.save();paint.translate(x,y);paint.scale(.25+.75*amount,(.25+.75*amount)*wing);paint.translate(-x,-y);part(name,family);paint.restore();
          };
          const foot=(name:'leftFoot'|'rightFoot',x:number,shift:number,angle:number)=>{
            paint.save();paint.translate(x,1700);paint.rotate(angle*Math.PI/180);paint.translate(-x,-1700);
            paint.transform(1+1.000596*run,0,0,1+1.000596*run,shift*run,-1702.893761*run);part(name,color.feet);paint.restore();
          };
          const tail={base:color.tail.base,highlight:color.tail.base};
          grow('fin',swim,365,1230,tail);part('tail',tail);
          foot('rightFoot',1630,-1631.646394,-footAngle);foot('leftFoot',1155,-1155.794605,footAngle);
          grow('wings',fly,1400,1100,color.body,wingScale);part('body',color.body);part('eyes',color.eyes);
          grow('leftArm',strength,1120,1270,color.body);grow('rightArm',strength,1852,1388,color.body);
          const accessory=config.appearance.parts.find(p=>p.cosmetic===c.awards.equipped);
          if(accessory){
            const anchor=c.awards.equipped==='leaf_crown'?{x:1450,y:650}:c.awards.equipped==='ribbon'?{x:1470,y:1190}:{x:1540,y:1450};
            paint.save();paint.translate(anchor.x,anchor.y);paint.scale(18,18);paint.fillStyle=color.tail.base;paint.strokeStyle='black';paint.lineCap='round';paint.lineJoin='round';paint.miterLimit=1.5;
            for(const recipe of accessory.tiers[0].recipe)if(recipe.primitive==='polygon'){
              paint.beginPath();for(const [i,p]of recipe.points.entries())if(i)paint.lineTo(p.x,p.y);else paint.moveTo(p.x,p.y);paint.closePath();paint.fill('evenodd');paint.lineWidth=recipe.strokeWidth;paint.stroke();
            }paint.restore();
          }
          frame.key=key;
        }
        img=frame.canvas;
      }
      if (!img) return;
      ctx.save(); if (facingLeft) ctx.scale(-1, 1);
      ctx.drawImage(img, -size * scale / 2, -h * scale / 2, size * scale, h * scale); ctx.restore();
    },
  };
}
