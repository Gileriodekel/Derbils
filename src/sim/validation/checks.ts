export function requireValue(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`Invalid save: ${message}.`);
}
export function integer(value: unknown, min = 0, max = Number.MAX_SAFE_INTEGER): boolean {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= min && value <= max;
}
export function finite(value: unknown, min: number, max: number): boolean {
  return typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max;
}
export function object(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
export function exactKeys(value: unknown, keys: readonly string[]): boolean {
  return object(value) && Object.keys(value).length === keys.length && keys.every(key => Object.hasOwn(value, key));
}
export function allFinite(value: unknown): boolean {
  if (typeof value === 'number') return Number.isFinite(value);
  if (Array.isArray(value)) return value.every(allFinite);
  if (object(value)) return Object.values(value).every(allFinite);
  return true;
}
