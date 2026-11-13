import parts from './dynasty-parts.json';
import { multiply } from './scene/matrix';
import type { Transform } from './scene/types';

type Part = Exclude<keyof typeof parts, 'egg' | 'bush' | 'kelp' | 'berry'>;
interface Paint { fill: string; stroke: string; width: number; cap: CanvasLineCap }
interface Shape extends Paint { path: Path2D; matrix: Transform }
const identity: Transform = { a:1,b:0,c:0,d:1,e:0,f:0 };
const compiled = new Map<Part, Shape[]>();

/** Compile the supplied Derbil path groups once. Their only geometry is path
 * and nested affine matrices; keep stroke transforms and the original fill rule.
 * Eggs retain the SVG renderer because their highlight is an embedded bitmap. */
function compile(part: Part): Shape[] {
  const cached=compiled.get(part);if(cached)return cached;
  const root=new DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg">${parts[part]}</svg>`,'image/svg+xml').documentElement;
  const shapes:Shape[]=[];
  function walk(node:Element,parent:Transform,inherited:Paint) {
    let matrix=parent;
    const transform=node.getAttribute('transform');
    if(transform){
      const match=/^matrix\(([^)]+)\)$/.exec(transform);if(!match)throw new Error(`Unsupported supplied art transform: ${transform}`);
      const [a,b,c,d,e,f]=match[1].split(/[ ,]+/).map(Number);matrix=multiply(parent,{a,b,c,d,e,f});
    }
    const style=Object.fromEntries((node.getAttribute('style')??'').split(';').filter(Boolean).map(s=>s.split(':').map(v=>v.trim())));
    const paint:Paint={fill:style.fill??inherited.fill,stroke:style.stroke??inherited.stroke,
      width:style['stroke-width']?parseFloat(style['stroke-width']):inherited.width,cap:(style['stroke-linecap']??inherited.cap) as CanvasLineCap};
    if(node.localName==='path')shapes.push({...paint,matrix,path:new Path2D(node.getAttribute('d')!)});
    else if(node.localName!=='svg'&&node.localName!=='g')throw new Error(`Unsupported supplied art element: ${node.localName}`);
    for(const child of node.children)walk(child,matrix,paint);
  }
  walk(root,identity,{fill:'black',stroke:'none',width:1,cap:'round'});compiled.set(part,shapes);return shapes;
}

export function drawVectorPart(ctx:CanvasRenderingContext2D,part:Part,base:string,highlight:string):void {
  for(const shape of compile(part)){
    const m=shape.matrix;ctx.save();ctx.transform(m.a,m.b,m.c,m.d,m.e,m.f);
    if(shape.fill!=='none'){
      ctx.fillStyle=shape.fill==='rgb(86,86,86)'?base:shape.fill==='rgb(128,128,128)'?highlight:shape.fill;
      ctx.fill(shape.path,'evenodd');
    }
    if(shape.stroke!=='none'){
      ctx.strokeStyle=shape.stroke;ctx.lineWidth=shape.width;ctx.lineCap=shape.cap;ctx.lineJoin='round';ctx.miterLimit=1.5;ctx.stroke(shape.path);
    }
    ctx.restore();
  }
}
