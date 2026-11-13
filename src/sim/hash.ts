/** Full JSON state, sorted object keys; array order and every saved value are significant. */
export function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(v => stableStringify(v) ?? 'null').join(',')}]`;
  return `{${Object.keys(value).sort().filter(k => (value as Record<string, unknown>)[k] !== undefined)
    .map(k => `${JSON.stringify(k)}:${stableStringify((value as Record<string, unknown>)[k])}`).join(',')}}`;
}

/** FNV-1a 64 over UTF-16 code units; pure and independent of insertion order. */
export function hashState(state: unknown): string {
  const json = stableStringify(state);
  let hash = 0xcbf29ce484222325n;
  for (let i = 0; i < json.length; i++) hash = BigInt.asUintN(64, (hash ^ BigInt(json.charCodeAt(i))) * 0x100000001b3n);
  return hash.toString(16).padStart(16, '0');
}
