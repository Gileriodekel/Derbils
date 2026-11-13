export interface TuningMetadata { description: string; unit: string; min: number; max: number; integer?: boolean }
export interface BooleanMetadata { description: string; unit: string; allowed: readonly [false, true] }
export type ValueContract = { type: 'number'; metadata: TuningMetadata } | { type: 'string'; allowed?: string[]; pattern?: string } | { type: 'boolean'; metadata: BooleanMetadata } | { type: 'null' } | { type: 'array'; entries: ValueContract[]; repeat?: boolean } | { type: 'object'; fields: Record<string, ValueContract> };
export interface ConfigIssue { file: string; path: string; message: string }
