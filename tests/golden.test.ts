import { expect, it } from 'vitest';
import baseline from './golden/milestone-9b.json';
import { createHabitat } from '../src/sim/habitat';
import { tick } from '../src/sim/tick';
import { hashState } from '../src/sim/hash';
import { config } from '../src/data/config';
import { assertInvariants } from './helpers/invariants';

it('hashes every field with stable object ordering and significant array ordering', () => {
  expect(hashState({b:2,a:{z:1,y:2}})).toBe(hashState({a:{y:2,z:1},b:2}));
  expect(hashState([1,2])).not.toBe(hashState([2,1]));
});
for (const seed of [271828,314159,161803]) it(`preserves untouched 9b full-state goldens: ${seed}`, () => {
  let state=createHabitat(seed); state.settings.autoCompetitions=true; state.settings.autoPrizes=true;
  for (const row of baseline.hashes.filter(row => row.seed===seed)) {
    while (state.clock.tick<row.tick) state=tick(state);
    expect(hashState(state), `seed ${seed}, tick ${row.tick}`).toBe(row.hash);
    assertInvariants(state,config);
  }
}, 300000);
