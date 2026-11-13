import { config } from '../data/config';
import { createDerbilRenderer, derbilColors, derbilSvg, development, svgImage } from '../render/dynasty-art';
import { createAppearanceEditor } from './appearance-editor';
import type { AppearanceGenePatch, Creature } from '../sim/types';

export function createAppearancePanel(root: HTMLElement, portrait: HTMLCanvasElement, apply: (patch: AppearanceGenePatch) => void) {
  root.innerHTML = `<div class="needs-heading"><h2>Appearance</h2><span>INHERITED COLORS + EARNED DEVELOPMENT</span></div>
    <p class="skills-note">Body, feet, eyes and tail inherit their own colors. Highlights stay in the same color family.</p>
    <div class="palette-swatches" aria-label="Inherited body-part colors"></div>
    <p class="appearance-development skills-note"></p><div class="appearance-editor"></div>`;
  const editor = createAppearanceEditor(root.querySelector<HTMLElement>('.appearance-editor')!,apply);
  const ctx=portrait.getContext('2d')!,renderer=createDerbilRenderer();let currentSvg='';
  function paint(svg:string,aspect:number){
    const width=Math.min(portrait.width,portrait.height*aspect),height=width/aspect;
    const img=svgImage(svg,()=>{if(currentSvg===svg)paint(svg,aspect);},{width,height});
    if(!img.complete||!img.naturalWidth)return;
    ctx.resetTransform();ctx.clearRect(0,0,portrait.width,portrait.height);
    const scale=Math.min(portrait.width/img.naturalWidth,portrait.height/img.naturalHeight);
    ctx.drawImage(img,(portrait.width-img.naturalWidth*scale)/2,(portrait.height-img.naturalHeight*scale)/2,img.naturalWidth*scale,img.naturalHeight*scale);
  }
  return {reset(){currentSvg='';renderer.reset();},update(c:Creature,_tick:number,_seed:number,details=true){
    renderer.retain(new Set([c.id]));
    if(c.stage==='egg'||c.stage==='cocoon'){currentSvg=derbilSvg(c);paint(currentSvg,1);}
    else{
      currentSvg='';ctx.resetTransform();ctx.clearRect(0,0,portrait.width,portrait.height);
      ctx.save();ctx.translate(portrait.width/2,portrait.height/2);
      renderer.draw(ctx,c,Math.min(portrait.width,portrait.height*2150/1450)/config.lifecycle.stages[c.stage].scale);ctx.restore();
    }
    if(!details)return;editor.update(c);
    root.querySelector('.palette-swatches')!.replaceChildren(...Object.entries(derbilColors(c)).map(([name,family])=>{
      const cell=document.createElement('div'),base=document.createElement('i'),highlight=document.createElement('i'),label=document.createElement('span');
      base.style.background=family.base;highlight.style.background=family.highlight;label.textContent=name;cell.append(base,highlight,label);return cell;
    }));
    root.querySelector('.appearance-development')!.textContent=(['run','swim','fly','strength'] as const).map(s=>`${config.dynasty.stats[s].name}: ${Math.round(development(c,s)*100)}% development`).join(' · ');
  }};
}
