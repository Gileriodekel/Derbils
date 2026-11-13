import { config } from '../data/config';
import { relationship } from '../sim/social/relationships';
import { relationshipColor, relationshipLabel } from '../sim/dynasty/social';
import { createSocialLayout, type GraphLink } from './social-layout';
import type { SaveState } from '../sim/types';
const ns='http://www.w3.org/2000/svg';
export function socialGraph(state:SaveState){
  const living=new Map(state.creatures.map(c=>[c.organismId,c]));
  const nodes=new Map(state.creatures.map(c=>[c.organismId,{id:c.organismId,lifeId:c.id,name:c.displayName,living:true}]));
  const links:GraphLink[]=[];
  for(const edge of state.relationships){const r=relationship(state,edge.a,edge.b)!;if(!living.has(r.a)||!living.has(r.b))continue;
    const kind=relationshipLabel(r.bond).toLowerCase() as 'friend'|'foe'|'neutral';if(kind!=='neutral')links.push({a:r.a,b:r.b,kind,strength:r.bond});
    if(r.mateBond>=config.social.mateBondThreshold)links.push({a:r.a,b:r.b,kind:'mate',strength:r.mateBond});}
  for(const c of state.creatures){const o=state.organisms.find(o=>o.id===c.organismId);
    for(const id of o?.parents??[]){
      if(!nodes.has(id)){const parent=state.lineage.filter(l=>l.organismId===id).at(-1);nodes.set(id,{id,lifeId:parent?.id??id,name:parent?.displayName??'Archived parent',living:false});}
      links.push({a:id,b:c.organismId,kind:'parent',strength:0});
    }
  }
  return {nodes:[...nodes.values()],links};
}
export function createSocialWeb(root:HTMLElement,select:(id:string)=>void){
  root.innerHTML=`<div class="needs-heading"><h2>The social web</h2><span>FAMILY, FRIENDS &amp; FOES</span></div>
    <p class="skills-note social-legend">— Friend · - - Foe · ═ Mate · → Parent to child · hollow node: deceased parent. Foe lines appear only in the Foe third of the spectrum. Neutral connections are hidden; mate and family links remain.</p>
    <p class="skills-note" id="social-web-selection">Select a Derbil to highlight its connections.</p>
    <svg viewBox="0 0 800 600" role="group" aria-label="Derbil friendships, foes, mates and parents"><defs><marker id="parent-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#456880"/></marker></defs><g class="social-links"></g><g class="social-nodes"></g></svg>`;
  const svg=root.querySelector('svg')!,lines=svg.querySelector('.social-links')!,nodeRoot=svg.querySelector('.social-nodes')!;
  const layout=createSocialLayout(),nodes=new Map<string,SVGGElement>();let lastSignature='';
  function element<K extends keyof SVGElementTagNameMap>(tag:K,attrs:Record<string,string|number>){const e=document.createElementNS(ns,tag);for(const [k,v]of Object.entries(attrs))e.setAttribute(k,String(v));return e;}
  return {update(state:SaveState,selectedId:string|null,visible:boolean){
    root.hidden=!visible;if(!visible)return;
    const graph=socialGraph(state),selected=state.creatures.find(c=>c.id===selectedId)?.organismId;
    const signature=graph.nodes.map(n=>n.id).join()+graph.links.map(l=>`${l.a}:${l.b}:${l.kind}:${Math.round(l.strength/10)}`).join();
    const positions=layout.update(graph.nodes.map(n=>n.id),graph.links,signature===lastSignature?2:16);lastSignature=signature;
    const index=new Map(graph.nodes.map(n=>[n.id,n]));lines.replaceChildren();
    for(const l of graph.links){if(l.kind==='neutral'&&l.a!==selected&&l.b!==selected)continue;
      const a=positions.get(l.a)!,b=positions.get(l.b)!,dx=b.x-a.x,dy=b.y-a.y,len=Math.max(1,Math.hypot(dx,dy)),ux=dx/len,uy=dy/len;
      const active=!selected||l.a===selected||l.b===selected,offset=l.kind==='mate'?8:l.kind==='parent'?-8:0;
      const path=element('path',{class:'social-edge','data-kind':l.kind,'data-a':l.a,'data-b':l.b,d:`M ${a.x+ux*24} ${a.y+uy*24} Q ${(a.x+b.x)/2-uy*offset} ${(a.y+b.y)/2+ux*offset} ${b.x-ux*26} ${b.y-uy*26}`,fill:'none',
        stroke:l.kind==='mate'?'#955786':l.kind==='parent'?'#456880':relationshipColor(l.strength),'stroke-width':l.kind==='mate'?5:active?2.5:1.5,'stroke-dasharray':l.kind==='foe'?'8 6':l.kind==='neutral'?'2 6':'none',opacity:active?1:.18});
      if(l.kind==='parent')path.setAttribute('marker-end','url(#parent-arrow)');
      const title=element('title',{});title.textContent=`${index.get(l.a)!.name} ${l.kind==='parent'?'→':'↔'} ${index.get(l.b)!.name}: ${l.kind}${['friend','foe','neutral'].includes(l.kind)?` (${l.strength.toFixed(1)})`:''}`;path.append(title);lines.append(path);
    }
    for(const [id,node]of nodes)if(!index.has(id)){node.remove();nodes.delete(id);}
    for(const n of graph.nodes){const p=positions.get(n.id)!;let node=nodes.get(n.id);
      if(!node){node=element('g',{tabindex:0,role:'button'});node.append(element('circle',{r:23}),element('text',{'text-anchor':'middle','font-size':11,y:4}),element('text',{'text-anchor':'middle','font-size':10,y:39}),element('title',{}));nodes.set(n.id,node);nodeRoot.append(node);}
      node.setAttribute('transform',`translate(${p.x} ${p.y})`);node.setAttribute('aria-label',`${n.name}${n.living?'':' (deceased parent)'}`);node.dataset.creatureId=n.lifeId;
      const inspect=()=>{if(n.living)select(n.lifeId);else root.querySelector('#social-web-selection')!.textContent=`${n.name} · deceased parent; family links remain after death.`;};node.onclick=inspect;node.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();inspect();}};
      const circle=node.querySelector('circle')!;circle.setAttribute('fill',n.id===selected?'#ffe6a2':n.living?'#f4f6eb':'#ffffff');circle.setAttribute('stroke',n.living?'#526d5c':'#7e8990');circle.setAttribute('stroke-dasharray',n.living?'none':'3 3');
      const text=node.querySelectorAll('text');text[0].textContent=`#${Number(n.lifeId.slice(2))||'—'}`;text[1].textContent=n.name;node.querySelector('title')!.textContent=n.name;
    }
    if(selected){const related=graph.links.filter(l=>l.a===selected||l.b===selected);root.querySelector('#social-web-selection')!.textContent=related.map(l=>`${l.kind==='parent'?(l.a===selected?'child':'parent'):l.kind}: ${index.get(l.a===selected?l.b:l.a)!.name}`).join(' · ')||'No connections yet.';}
  }};
}
