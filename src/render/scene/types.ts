import type { Point } from '../../sim/types';

/** Affine transform into body-centered rig coordinates. Includes facing and life-stage scale. */
export interface Transform { a: number; b: number; c: number; d: number; e: number; f: number }
export type PathSegment =
  | { op: 'move'; to: Point }
  | { op: 'line'; to: Point }
  | { op: 'quadratic'; control: Point; to: Point }
  | { op: 'close' };
export interface CommandStyle {
  partId: string; slot: string; tier: number; layerIndex: number;
  fill: string | null; stroke: string | null; strokeWidth: number;
  opacity: number; transform: Transform;
  motion: 'body' | 'tail' | 'eye' | 'static'; pivot: Point;
  clip?: { radius: Point };
}
export type DrawCommand = CommandStyle & (
  | { primitive: 'ellipse'; radius: Point; center: Point }
  | { primitive: 'polygon' | 'path'; segments: PathSegment[] }
);
export interface Bounds { minX: number; minY: number; maxX: number; maxY: number }
export type Facing = 'left' | 'right';
