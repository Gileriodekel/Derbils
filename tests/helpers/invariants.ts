import { expect } from 'vitest';
import type { Config, SaveState } from '../../src/sim/types';
import { validateState } from '../../src/sim/validate-state';
export function assertInvariants(state: SaveState, config: Config): void { expect(validateState(state, config)).toEqual([]); }
