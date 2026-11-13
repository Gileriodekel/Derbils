import { config } from '../data/config';
import type { DeepReadonly } from '../sim/types';
import { hash32 } from './scene/hash';
import { multiply } from './scene/matrix';
import type { DrawCommand, Transform } from './scene/types';
import type { AnimationPose } from './animation-types';

/** Tick may include interpolation. No wall clock, authoritative stream or hidden phase is read. */
export function animationPose(tick: number, id: string, behavior: string, mood: number, reducedMotion: boolean,
  tuning = config.appearance.animation): AnimationPose {
  if (reducedMotion) return { scaleX: 1, scaleY: 1, offsetY: 0, rotation: 0, tailRotation: 0, eyeScaleY: 1 };
  const phase = hash32(id) / 4294967296, seconds = tick * config.clock.tickSeconds;
  const angle = (seconds / tuning.breathingSeconds + phase) * Math.PI * 2;
  const breath = Math.sin(angle) * tuning.breathing;
  const tired = behavior === 'sleep' || mood < -tuning.moodThreshold, happy = !tired && mood > tuning.moodThreshold;
  const blink = ((seconds + phase * tuning.blinkIntervalSeconds) % tuning.blinkIntervalSeconds) / tuning.blinkSeconds;
  return { scaleX: 1 + breath, scaleY: (tired ? tuning.tiredScale : 1) * (1 + breath),
    offsetY: happy ? Math.sin(angle) * tuning.bobPixels : 0,
    rotation: tired ? -tuning.tiltRadians : happy ? Math.sin(angle) * tuning.tiltRadians : 0,
    tailRotation: Math.cos(angle) * tuning.swayRadians,
    eyeScaleY: blink < 1 ? 1 - (1 - tuning.closedEyeScale) * Math.sin(blink * Math.PI) : 1 };
}

/** Numeric transforms are detached; cached geometry and command styles remain read-only. */
export function animateScene(scene: DeepReadonly<DrawCommand[]>, pose: AnimationPose): DeepReadonly<DrawCommand[]> {
  const cos = Math.cos(pose.rotation), sin = Math.sin(pose.rotation);
  const body: Transform = { a: cos * pose.scaleX, b: sin * pose.scaleX, c: -sin * pose.scaleY, d: cos * pose.scaleY, e: 0, f: pose.offsetY };
  return scene.map(command => {
    if (command.motion === 'static') return command;
    let t = { ...command.transform };
    if (command.motion === 'tail') {
      const c = Math.cos(pose.tailRotation), s = Math.sin(pose.tailRotation), p = command.pivot;
      t = multiply({ a: c, b: s, c: -s, d: c, e: p.x - c * p.x + s * p.y, f: p.y - s * p.x - c * p.y }, t);
    }
    if (command.motion === 'eye') t = multiply(t, { a: 1, b: 0, c: 0, d: pose.eyeScaleY, e: 0, f: 0 });
    return { ...command, transform: multiply(body, t) };
  });
}
