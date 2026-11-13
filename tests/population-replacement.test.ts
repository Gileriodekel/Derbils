import {describe,expect,it} from 'vitest';
import {config} from '../src/data/config';
import {createHabitat} from '../src/sim/habitat';
import {startCourtship} from '../src/sim/courtship';
import {ensureRelationship} from '../src/sim/social/relationships';
import {decodeTerrain,isSafeLand,tileCenter,tileIndex} from '../src/sim/map';
import {distance} from '../src/sim/navigation';
import {tick} from '../src/sim/tick';
import {validateState} from '../src/sim/validate-state';
import {encodeCheckpoint,decodeCheckpoint} from '../src/persistence/checkpoint';
import {rescueExtinction} from '../src/sim/population';
import {stageStartAge} from '../src/sim/life-stages';

function pairs(count=4){
  const s=createHabitat(77161,count),t=decodeTerrain(s.world.terrainRle);s.settings.extinctionRescue=false;
  const points=t.flatMap((code,i)=>{
    const p=tileCenter(i,s.world.width);
    return isSafeLand(code)&&p.x<s.world.width-1&&isSafeLand(t[i+1])&&distance(p,config.breeding.nest)>25?[p]:[];
  });
  const sites=[points[0],points.find(p=>distance(p,points[0])>30)!];
  for(let i=0;i<4;i++){
    const c=s.creatures[i],p=sites[Math.floor(i/2)];c.position={x:p.x+i%2,y:p.y};
    c.needs={hunger:0,fatigue:0,boredom:0,loneliness:0,stress:0};c.mood=.8;
  }
  for(let i=0;i<4;i+=2){const r=ensureRelationship(s,s.creatures[i].organismId,s.creatures[i+1].organismId);r.bond=90;r.mateBond=90;}
  return {s,t,sites};
}

describe('local clutches and replacement',()=>{
  it('independent pairs court on distant land and lay distinct inherited eggs there',()=>{
    const {s,t,sites}=pairs();
    expect(startCourtship(s,s.creatures[0],s.creatures[1],t)).toBe(true);
    expect(startCourtship(s,s.creatures[2],s.creatures[3],t)).toBe(true);
    expect(s.sessions).toHaveLength(2);expect(validateState(s,config)).toEqual([]);
    let a=s,b=decodeCheckpoint(encodeCheckpoint(s,0)).state;
    for(let i=0;i<30;i++){a=tick(a);b=tick(b);}
    expect(a).toEqual(b);
    const eggs=a.lineage.filter(l=>l.origin==='birth');expect(eggs).toHaveLength(2*config.breeding.clutchEggs);
    expect(a.social.statistics.matings).toBe(2);
    for(let i=0;i<2;i++){
      const parent=s.creatures[i*2],children=a.creatures.filter(c=>a.organisms.find(o=>o.id===c.organismId)!.parents.includes(parent.organismId));
      expect(children).toHaveLength(config.breeding.clutchEggs);
      for(const child of children){expect(isSafeLand(t[tileIndex(child.position,a.world.width)])).toBe(true);expect(distance(child.position,sites[i])).toBeLessThan(8);}
      expect(new Set(children.map(c=>JSON.stringify(c.genome))).size).toBe(children.length);
      expect(a.creatures.find(c=>c.id===parent.id)!.breeding.clutches).toBe(1);
    }
    expect(validateState(a,config)).toEqual([]);
  });
  it('preserves one reserved egg per pair at capacity and never fills another pair’s slot',()=>{
    const {s,t}=pairs(28);
    expect(startCourtship(s,s.creatures[0],s.creatures[1],t)).toBe(true);
    expect(startCourtship(s,s.creatures[2],s.creatures[3],t)).toBe(true);
    let next=s;
    for(let i=0;i<30;i++){next=tick(next);expect(next.creatures.length+next.sessions.length).toBeLessThanOrEqual(30);}
    expect(next.creatures).toHaveLength(30);
    expect(next.lineage.filter(l=>l.origin==='birth')).toHaveLength(2);
    expect(validateState(next,config)).toEqual([]);
  });
  it('assists an aging cohort before it disappears, honors opt-out, and avoids repeated batches',()=>{
    const s=createHabitat(77162,8);s.clock.tick=config.breeding.recovery.checkEveryTicks;
    for(const c of s.creatures){c.age=stageStartAge('elder')-1;c.stageStartedTick=s.clock.tick-(config.lifecycle.stages.adult.durationTicks-1);}
    const disabled=structuredClone(s);disabled.settings.extinctionRescue=false;expect(rescueExtinction(disabled)).toBe(disabled);
    const next=rescueExtinction(s);expect(next.creatures.length-s.creatures.length).toBe(config.breeding.recovery.eggs);
    expect(next.creatures.slice(s.creatures.length).every(c=>c.stage==='egg')).toBe(true);
    expect(rescueExtinction(next)).toBe(next);
    next.settings.autoBreed=false;next.clock.tick+=config.clock.dayTicks*4;expect(rescueExtinction(next)).toBe(next);
  });
});
