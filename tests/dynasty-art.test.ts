import { describe, it, expect } from 'vitest';
import { DOMParser } from '@xmldom/xmldom';
import { createHabitat } from '../src/sim/habitat';
import { setDebugSkill } from '../src/sim/skills';
import { setAppearanceGenes } from '../src/sim/appearance/edits';
import { derbilSvg, eggSvg, plantSvg, derbilColors } from '../src/render/dynasty-art';
import { decodeCheckpoint, encodeCheckpoint } from '../src/persistence/checkpoint';
import { spawnEgg } from '../src/sim/spawn';
const parse=(svg:string)=>new DOMParser().parseFromString(svg,'image/svg+xml');
describe('supplied SVG integration',()=>{
 it('combines all four physical developments without repainting black outlines',()=>{
  let s=createHabitat(12,1);const id=s.creatures[0].id;
  for(const skill of ['run','swim','fly','strength'] as const)s=setDebugSkill(s,id,skill,100,1);
  const svg=derbilSvg(s.creatures[0]),doc=parse(svg);
  for(const group of ['WINGS','FIN','ARMS_LEFT','ARMS_RIGHT','LEFT_FOOT','RIGHT_FOOT'])expect(doc.getElementById(group),group).not.toBeNull();
  expect(svg).toContain('stroke:black');expect(svg).toContain('2.000596');
 });
 it('keeps independent colors and hue-matched highlights across saving and hatching',()=>{
  let s=createHabitat(42,2);s=setAppearanceGenes(s,s.creatures[0].id,{baseHue:210,feetHue:30,tailHue:300,eyeHue:120});
  s=spawnEgg(s,s.creatures[0].genome,[s.creatures[0].id,s.creatures[1].id]);
  const egg=s.creatures.at(-1)!,colors=derbilColors(egg),svg=eggSvg(egg);
  expect(new Set(Object.values(colors).map(c=>c.base)).size).toBe(4);
  for(const f of Object.values(colors)){expect(f.base.split(' ')[0]).toBe(f.highlight.split(' ')[0]);const values=f.base.match(/[\d.]+/g)!.map(Number);expect(values[1]).toBeLessThanOrEqual(100);expect(values[2]).toBeLessThanOrEqual(100);}
  expect(svg).toContain(`fill:${colors.body.base}`);expect(svg).toContain(`fill:${colors.tail.base}`);
  const loaded=decodeCheckpoint(encodeCheckpoint(s,100)).state.creatures.at(-1)!;
  expect(eggSvg(loaded)).toBe(svg);expect(derbilColors({...loaded,stage:'baby'})).toEqual(colors);
  expect(eggSvg({...loaded,stage:'cocoon'})).toBe(svg);
 });
 it('keeps the two supplied berry groups independently visible',()=>{
  for(const water of [false,true]){
   const both=parse(plantSvg('sunapple',[true,true],water)),one=parse(plantSvg('sunapple',[false,true],water));
   expect(both.getElementById('BERRY_1')?.getAttribute('visibility')).not.toBe('hidden');
   expect(one.getElementById('BERRY_1')?.getAttribute('visibility')).toBe('hidden');
   expect(one.getElementById('BERRY_2')?.getAttribute('visibility')).not.toBe('hidden');
   expect(plantSvg('sunapple',[true,true],water)).toContain('#FE66AB');
   expect(plantSvg('sunapple',[true,true],water)).toContain('#C95187');
  }
 });
});
