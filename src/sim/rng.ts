/** Spec §12.2 xorshift32. Each call returns new state; callers own no hidden state. */
export function normalizeSeed(seed: number): number {
  if (!Number.isFinite(seed)) throw new Error('Seed must be finite.');
  return (Math.trunc(seed) >>> 0) || 1;
}

export function nextUint(state: number): number {
  let x = state >>> 0;
  if (x === 0) throw new Error('A saved RNG state must be a nonzero uint32.');
  x ^= x << 13;
  x ^= x >>> 17;
  x ^= x << 5;
  return x >>> 0;
}

export function uniform(state: number): { state: number; value: number } {
  const next = nextUint(state);
  return { state: next, value: next / 4294967296 };
}
