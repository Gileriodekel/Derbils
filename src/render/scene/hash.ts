/** Independent cosmetic hash: never consumes an authoritative random stream. */
export function hash32(text: string, seed = 2166136261): number {
  let value = seed;
  for (let i = 0; i < text.length; i++) value = Math.imul(value ^ text.charCodeAt(i), 16777619);
  value = Math.imul(value ^ value >>> 16, 2246822507);
  return (value ^ value >>> 13) >>> 0;
}
