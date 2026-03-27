import { VOICE_RHYTHM_VOL_STEPS } from "../types";

const TOL = 0.07;

/** Loudness order: mute → low → medium → high (top = louder). */
const LOUDNESS_STEPS = [0, 0.28, 0.55, 0.85] as const;

function nearestLoudnessIndex(current: number): number {
  let best = 0;
  let bestD = Infinity;
  LOUDNESS_STEPS.forEach((v, i) => {
    const d = Math.abs(v - current);
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  });
  return best;
}

/** One step louder (toward high); caps at max. */
export function volumeStepUp(current: number): number {
  const i = nearestLoudnessIndex(current);
  return LOUDNESS_STEPS[Math.min(i + 1, LOUDNESS_STEPS.length - 1)]!;
}

/** One step quieter (toward mute); caps at mute. */
export function volumeStepDown(current: number): number {
  const i = nearestLoudnessIndex(current);
  return LOUDNESS_STEPS[Math.max(i - 1, 0)]!;
}

/** Legacy single-button cycle (low → med → high → mute order in array). */
export function cycleVoiceRhythmVolume(current: number): number {
  const steps = [...VOICE_RHYTHM_VOL_STEPS];
  let idx = steps.findIndex((v) => Math.abs(v - current) < TOL);
  if (idx < 0) idx = 0;
  return steps[(idx + 1) % steps.length]!;
}

export function volumeStepIndex(value: number): number {
  const steps = [...VOICE_RHYTHM_VOL_STEPS];
  const idx = steps.findIndex((v) => Math.abs(v - value) < TOL);
  return idx < 0 ? 1 : idx;
}
