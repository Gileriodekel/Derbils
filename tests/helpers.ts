import { createHabitat } from '../src/sim/habitat';
/** Earlier milestones' isolated self-care/training fixtures keep their original one-adult scope. */
export function createSingleHabitat(seed?: number) {
  const s=createHabitat(seed,1);
  s.settings.autoBreed=false;s.settings.extinctionRescue=false;
  return s;
}
