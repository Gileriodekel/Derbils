import {expect,it} from 'vitest';
import {config} from '../src/data/config';
import {createDaylight,daylightTarget} from '../src/render/daylight';

it('keeps accelerated and reduced-motion lighting constant through whole simulation days',()=>{
  for(const [speed,reduced]of [[100,false],[1000,false],[1,true]] as const){
    const values=new Set(Array.from({length:600},(_,i)=>daylightTarget(i,speed,reduced)));
    expect(values.size).toBe(1);expect([...values][0]).toBeCloseTo(config.world.nightOverlayAlpha*(1-config.world.nightStart));
  }
});
it('has gradual dawn/dusk at ordinary speeds, including the day boundary',()=>{
  expect(daylightTarget(15,1,false)).toBe(0);
  expect(daylightTarget(51,1,false)).toBe(config.world.nightOverlayAlpha);
  for(let tick=0;tick<120;tick+=.1)expect(Math.abs(daylightTarget(tick,10,false)-daylightTarget(tick+.1,10,false))).toBeLessThan(.01);
});
it('blends speed/pause changes in real time without changing any simulation input',()=>{
  const light=createDaylight();expect(light.update(51,1,false,0)).toBe(config.world.nightOverlayAlpha);
  const after=light.update(51,1000,false,1/60);expect(after).toBeLessThan(config.world.nightOverlayAlpha);expect(after).toBeGreaterThan(.2);
  for(let i=0;i<120;i++)light.update(i*50,1000,false,1/60);
  const stable=light.update(0,1000,false,1/60);expect(stable).toBeCloseTo(daylightTarget(0,1000,false),2);
  light.reset();expect(light.update(15,0,false,0)).toBe(0);
});
