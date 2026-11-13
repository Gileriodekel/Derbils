import { describe, expect, it } from 'vitest';
import { DOMParser } from '@xmldom/xmldom';
import { config, tasteKeys } from '../src/data/config';
import { createHabitat } from '../src/sim/habitat';
import { distance } from '../src/sim/navigation';
import { nearestPoints, pointRows } from '../src/sim/nearest-points';
import { expressLocus, expressTrait } from '../src/sim/genetics/expression';
import { locusFor } from '../src/sim/genetics/catalog';
import { tasteEnjoyment, tasteWeights } from '../src/sim/preferences';
import { socialCounts, relationshipLabel } from '../src/sim/dynasty/social';
import { decayRelationship, ensureRelationship } from '../src/sim/social/relationships';
import { uniform } from '../src/sim/rng';
import { derbilSvg, eggSvg, sizedSvg } from '../src/render/dynasty-art';

describe('exact performance optimizations', () => {
  it('matches a full nearest-tile scan for fractional positions, ties, gaps and different candidate limits', () => {
    let rng=83921;const draw=()=>{const r=uniform(rng);rng=r.state;return r.value;};
    const points=Array.from({length:23*37},(_,i)=>({x:i%37+.5,y:Math.floor(i/37)+.5})).filter(()=>draw()<.43);
    const rows=pointRows(points);
    for(let i=0;i<180;i++){
      const from=i<30?{x:i,y:i%23}:{x:draw()*44-3,y:draw()*30-3};
      const count=i%8;
      const expected=[...points].sort((a,b)=>distance(a,from)-distance(b,from)||a.y-b.y||a.x-b.x).slice(0,count);
      expect(nearestPoints(rows,from,count)).toEqual(expected);
    }
    const first=nearestPoints(rows,{x:5,y:6},2);first[0].x=-999;
    expect(nearestPoints(rows,{x:5,y:6},2)[0].x).not.toBe(-999);
    expect(nearestPoints([],{x:0,y:0},2)).toEqual([]);
  });
  it('invalidates expressed traits and tastes for in-place allele changes and chromosome replacement', () => {
    const c=createHabitat(92,1).creatures[0],locus=locusFor('tasteBias',tasteKeys[0]);
    const genome=c.genome,chromosome=genome[locus.definition.chromosome];
    for(const values of [[0,0,255,1],[255,1,0,0],[0,0,0,0],[128,1,128,1]]){
      const a=chromosome.haplotypes[0][locus.index],b=chromosome.haplotypes[1][locus.index];
      [a.v,a.d,b.v,b.d]=values as [number,0|1,number,0|1];
      expect(expressTrait(genome,'tasteBias',tasteKeys[0])).toBe(expressLocus(a,b,locus.definition));
      const weights=tasteWeights(c),expected=2*tasteKeys.reduce((n,k)=>n+weights[k]*config.fruit.sunapple.taste[k],0)-1;
      expect(tasteEnjoyment(c,'sunapple')).toBe(expected);
      weights[tasteKeys[0]]=999;expect(tasteEnjoyment(c,'sunapple')).toBe(expected);
    }
    genome[locus.definition.chromosome]=structuredClone(chromosome);
    genome[locus.definition.chromosome].haplotypes[0][locus.index].v=42;
    const changed=genome[locus.definition.chromosome];
    expect(expressTrait(genome,'tasteBias',tasteKeys[0])).toBe(expressLocus(changed.haplotypes[0][locus.index],changed.haplotypes[1][locus.index],locus.definition));
  });
  it('counts friends, foes and mates with exactly the previous decay formula across grace boundaries', () => {
    const s=createHabitat(3,5),c=s.creatures[0];
    for(const [i,peer] of s.creatures.slice(1).entries())Object.assign(ensureRelationship(s,c.organismId,peer.organismId),{bond:[-80,34,75,0][i],mateBond:[0,50,90,0][i]});
    for(const tick of [0,1,1200,6000,6001,70000]){
      s.clock.tick=tick;const edges=s.relationships.filter(r=>r.a===c.organismId||r.b===c.organismId).map(r=>decayRelationship(r,tick));
      expect(socialCounts(s,c)).toEqual({friends:edges.filter(r=>relationshipLabel(r.bond)==='Friend').length,foes:edges.filter(r=>relationshipLabel(r.bond)==='Foe').length,mates:edges.filter(r=>r.mateBond>=config.social.mateBondThreshold).length});
    }
  });
  it('sizes sprites without changing the SVG viewBox, paths, colors, groups or animation transforms', () => {
    const c=createHabitat(4,1).creatures[0];c.dynasty.moving=true;
    const parser=new DOMParser();
    for(const svg of [derbilSvg(c,3,true),eggSvg({...c,stage:'egg'})]){
      const original=parser.parseFromString(svg,'image/svg+xml').documentElement!;
      for(const size of [{width:31.1,height:20.2},{width:492,height:330}]){
        const resized=parser.parseFromString(sizedSvg(svg,size),'image/svg+xml').documentElement!;
        expect(resized.getAttribute('width')).toBe(String(Math.ceil(size.width)));
        expect(resized.getAttribute('height')).toBe(String(Math.ceil(size.height)));
        expect(resized.getAttribute('viewBox')).toBe(original.getAttribute('viewBox'));
        for(const attr of ['width','height','preserveAspectRatio']){original.removeAttribute(attr);resized.removeAttribute(attr);}
        expect(resized.toString()).toBe(original.toString());
      }
    }
  });
});
