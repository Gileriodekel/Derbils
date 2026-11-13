import type { AdvanceMode, AdvancePlan, CatchUpPlan, Config, OfflineConfig } from '../sim/types';

/** Wall milliseconds in, whole simulation ticks out. Overflow is clamped before multiplication. */
export function computeCatchUpTicks(savedAt: number | null | undefined, now: number, tuning: OfflineConfig): CatchUpPlan {
  const result = { ticks: 0, capped: false, skewed: false, belowThreshold: false };
  if (typeof savedAt !== 'number' || !Number.isFinite(savedAt) || !Number.isFinite(now) || now < savedAt)
    return { ...result, skewed: true };
  const elapsed = (now - savedAt) / 1000;
  if (elapsed < tuning.minAwaySeconds) return { ...result, belowThreshold: true };
  const rate = tuning.ticksPerRealSecond * tuning.offlineRateMultiplier;
  if (!tuning.enabled || rate <= 0) return result;
  const capped = elapsed > tuning.maxCatchUpTicks / rate;
  return { ...result, capped, ticks: capped ? tuning.maxCatchUpTicks : Math.min(tuning.maxCatchUpTicks, Math.floor(elapsed * rate)) };
}

/** The host owns the fractional remainder; a stall never becomes one giant foreground frame. */
export function planAdvance(lastAdvancedWallClock: number, now: number, mode: AdvanceMode, config: Config): AdvancePlan {
  const empty = { ticks: 0, realtimeTicks: 0, catchUpTicks: 0, fractionalSeconds: mode.fractionalSeconds,
    capped: false, skewed: false, belowThreshold: false };
  if (!Number.isFinite(now) || !Number.isFinite(lastAdvancedWallClock) || now < lastAdvancedWallClock)
    return { ...empty, skewed: true };
  if (mode.speed === 0) return empty;
  const elapsed = (now - lastAdvancedWallClock) / 1000;
  if (mode.hidden || elapsed > config.offline.stallThresholdSeconds) {
    if (mode.offlineEnabled === false || !config.offline.enabled) return empty;
    const plan = computeCatchUpTicks(lastAdvancedWallClock, now, config.offline);
    if(plan.belowThreshold||plan.skewed)return {...empty,...plan};
    // Retain sub-tick simulated time even across repeated short absences.
    const rate = config.offline.ticksPerRealSecond * config.offline.offlineRateMultiplier;
    const budget = plan.skewed || plan.belowThreshold ? 0 : Math.min(elapsed * rate, config.offline.maxCatchUpTicks);
    const total = budget + mode.fractionalSeconds / config.clock.tickSeconds;
    const ticks = Math.min(config.offline.maxCatchUpTicks, Math.floor(total));
    return { ...empty, ...plan, ticks, catchUpTicks: ticks,
      fractionalSeconds: (total - Math.floor(total)) * config.clock.tickSeconds };
  }
  const budget = mode.fractionalSeconds + elapsed * mode.speed;
  const total = Math.floor(budget / config.clock.tickSeconds);
  const realtimeTicks = Math.min(total, config.clock.maxTicksPerFrame);
  return { ...empty, ticks: realtimeTicks, realtimeTicks, catchUpTicks: 0,
    fractionalSeconds: budget - realtimeTicks * config.clock.tickSeconds };
}
