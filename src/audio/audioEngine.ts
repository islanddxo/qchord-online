import * as Tone from "tone";
import type { AppState, VoiceId } from "../types";
import {
  initRhythm,
  rebuildLoop,
  resetRhythmStep,
  setRhythmState,
  stopRhythmPlayback,
} from "./rhythmEngine";
import { getSustainChordNotes, isRoot } from "./chordUtils";
import {
  hasActiveSustain,
  initVoices,
  playStrumVoiceNote,
  refreshSustainAfterVoiceChange,
  setActiveVoice,
  startSustainChord,
  stopSustainChord,
} from "./voiceEngine";

let masterGain: Tone.Gain | null = null;
let voiceGain: Tone.Gain | null = null;
let rhythmGain: Tone.Gain | null = null;
let initialized = false;
let lastPowered = false;
let lastAppliedVoice: VoiceId | undefined;

export async function ensureAudio(): Promise<void> {
  await Tone.start();
  if (initialized) return;

  masterGain = new Tone.Gain(0).toDestination();
  voiceGain = new Tone.Gain(0.55).connect(masterGain);
  rhythmGain = new Tone.Gain(0.55).connect(masterGain);

  await initVoices(voiceGain);
  await initRhythm(rhythmGain);

  initialized = true;
}

export function isAudioReady(): boolean {
  return initialized;
}

export function stopAutoChordSustain(): void {
  stopSustainChord();
}

export function startAutoChordSustainFromState(
  s: Pick<AppState, "poweredOn" | "currentRoot" | "currentQuality">,
): void {
  if (!initialized || !s.poweredOn || !isRoot(s.currentRoot)) return;
  const notes = getSustainChordNotes(s.currentRoot, s.currentQuality);
  startSustainChord(notes);
}

/** Push UI state into the audio graph (call after init and on every relevant change). */
export function applyAudioFromState(s: AppState): void {
  if (!initialized || !masterGain || !voiceGain || !rhythmGain) return;

  lastPowered = s.poweredOn;
  if (!s.poweredOn) {
    stopSustainChord();
  }
  const gMaster = s.poweredOn ? s.masterVolume : 0;
  masterGain.gain.rampTo(gMaster, 0.04);
  voiceGain.gain.rampTo(s.voiceVolume, 0.02);
  rhythmGain.gain.rampTo(s.rhythmVolume, 0.02);

  if (lastAppliedVoice !== s.currentVoice) {
    setActiveVoice(s.currentVoice);
    if (lastAppliedVoice !== undefined && hasActiveSustain()) {
      refreshSustainAfterVoiceChange();
    }
    lastAppliedVoice = s.currentVoice;
  }

  setRhythmState({
    rhythm: s.currentRhythm,
    chordRoot: s.currentRoot,
    chordQuality: s.currentQuality,
    isPoweredOn: s.poweredOn,
    bpm: s.bpm,
  });

  Tone.getTransport().bpm.rampTo(s.bpm, 0.08);
}

export function playStrumNote(note: string): void {
  if (!initialized || !lastPowered) return;
  playStrumVoiceNote(note, "16n", undefined, 0.72);
}

export function startTransportFromState(s: AppState): void {
  if (!initialized) return;
  Tone.getTransport().bpm.value = s.bpm;
  applyAudioFromState(s);
  resetRhythmStep();
  rebuildLoop();
  Tone.getTransport().start();
}

/** Stops rhythm transport (chord sustain is independent). */
export function stopTransport(): void {
  Tone.getTransport().stop();
  resetRhythmStep();
  stopRhythmPlayback();
}
