import type { Point } from '../sim/types';
export interface GraphLink { a:string; b:string; kind:'friend'|'foe'|'mate'|'parent'|'neutral'; strength:number }
/** Presentation-only, deterministic relaxation. Only friends/mates attract. */
export function createSocialLayout(){
  const positions=new Map<string,Point>();
  return {positions,update(ids:readonly string[],links:readonly GraphLink[],steps=16){
    const known=new Set(ids);for(const id of positions.keys())if(!known.has(id))positions.delete(id);
    for(const [i,id]of ids.entries())if(!positions.has(id)){const angle=i*2.399963;positions.set(id,{x:400+Math.cos(angle)*(70+12*i),y:300+Math.sin(angle)*(70+8*i)});}
    for(let step=0;step<steps;step++){
      const force=new Map(ids.map(id=>[id,{x:0,y:0}]));
      for(let i=0;i<ids.length;i++)for(let j=i+1;j<ids.length;j++){
        const a=positions.get(ids[i])!,b=positions.get(ids[j])!,dx=a.x-b.x||.01,dy=a.y-b.y||.01,d=Math.max(1,Math.hypot(dx,dy));
        const f=Math.min(8,1800/(d*d)+(d<70?(70-d)*.12:0)),A=force.get(ids[i])!,B=force.get(ids[j])!;
        A.x+=dx/d*f;A.y+=dy/d*f;B.x-=dx/d*f;B.y-=dy/d*f;
      }
      for(const l of links){if(l.kind!=='friend'&&l.kind!=='mate')continue;const a=positions.get(l.a),b=positions.get(l.b);if(!a||!b)continue;
        const dx=b.x-a.x,dy=b.y-a.y,d=Math.max(1,Math.hypot(dx,dy)),wanted=l.kind==='mate'?80:105;
        const f=(d-wanted)*.018*(.5+l.strength/100),A=force.get(l.a)!,B=force.get(l.b)!;A.x+=dx/d*f;A.y+=dy/d*f;B.x-=dx/d*f;B.y-=dy/d*f;}
      for(const id of ids){const p=positions.get(id)!,f=force.get(id)!;f.x+=(400-p.x)*.0015;f.y+=(300-p.y)*.0015;
        p.x=Math.max(42,Math.min(758,p.x+Math.max(-4,Math.min(4,f.x))));p.y=Math.max(42,Math.min(558,p.y+Math.max(-4,Math.min(4,f.y))));}
    }
    return positions;
  }};
}
