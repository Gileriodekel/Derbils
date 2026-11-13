import type { Speed } from '../sim/types';
export interface UiSettings { defaultSpeed: Speed; reducedMotion: boolean | null; socialOverlays: boolean; actionBubbles: boolean; textSize: number; highContrast: boolean; dismissedHints: string[] }
export interface TabLease { owner: string; epoch: number; expiresAt: number }
export interface RuntimeFailure { seed: number; tick: number; commands: unknown[]; details: string }
