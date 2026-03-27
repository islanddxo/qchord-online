import * as Tone from "tone";
import type { VoiceId } from "../types";

let poly: Tone.PolySynth<Tone.Synth> | null = null;
let fmVoice: Tone.PolySynth<Tone.FMSynth> | null = null;
let sustainPoly: Tone.PolySynth<Tone.Synth> | null = null;
let sustainFm: Tone.PolySynth<Tone.FMSynth> | null = null;
let strumPoly: Tone.PolySynth<Tone.Synth> | null = null;
let strumFm: Tone.PolySynth<Tone.FMSynth> | null = null;
let strumReverb: Tone.Reverb | null = null;
let strumCompressor: Tone.Compressor | null = null;
let activeVoice: VoiceId = "harp";

let activeSustainNotes: string[] = [];

function applyMainPreset(voice: VoiceId): void {
  if (!poly || !fmVoice) return;
  activeVoice = voice;
  if (voice === "synth") {
    poly.volume.value = -100;
    fmVoice.volume.value = -8;
  } else if (voice === "guitar") {
    poly.volume.value = -11;
    fmVoice.volume.value = -100;
  } else {
    poly.volume.value = -4;
    fmVoice.volume.value = -100;
  }

  switch (voice) {
    case "harp":
      poly.set({
        oscillator: { type: "triangle" },
        envelope: { attack: 0.002, decay: 0.45, sustain: 0, release: 1.1 },
      });
      break;
    case "guitar":
      poly.set({
        oscillator: { type: "triangle" },
        envelope: {
          attack: 0.008,
          decay: 0.35,
          sustain: 0.04,
          release: 0.75,
        },
      });
      break;
    case "organ":
      poly.set({
        oscillator: { type: "triangle" },
        envelope: { attack: 0.02, decay: 0.15, sustain: 0.9, release: 0.35 },
      });
      break;
    case "synth":
      break;
    default:
      break;
  }
}

/** Strum path: louder, longer decay/release, feeds reverb. */
function applyStrumPreset(voice: VoiceId): void {
  if (!strumPoly || !strumFm) return;
  if (voice === "synth") {
    strumPoly.volume.value = -100;
    strumFm.volume.value = -6;
  } else if (voice === "guitar") {
    strumPoly.volume.value = -4;
    strumFm.volume.value = -100;
  } else {
    strumPoly.volume.value = -1;
    strumFm.volume.value = -100;
  }

  switch (voice) {
    case "harp":
      strumPoly.set({
        oscillator: { type: "triangle" },
        envelope: {
          attack: 0.004,
          decay: 0.85,
          sustain: 0.42,
          release: 2.4,
        },
      });
      break;
    case "guitar":
      strumPoly.set({
        oscillator: { type: "triangle" },
        envelope: {
          attack: 0.005,
          decay: 0.65,
          sustain: 0.35,
          release: 2.1,
        },
      });
      break;
    case "organ":
      strumPoly.set({
        oscillator: { type: "triangle" },
        envelope: {
          attack: 0.025,
          decay: 0.45,
          sustain: 0.75,
          release: 2,
        },
      });
      break;
    case "synth":
      break;
    default:
      break;
  }
}

function applySustainPreset(voice: VoiceId): void {
  if (!sustainPoly || !sustainFm) return;
  if (voice === "synth") {
    sustainPoly.volume.value = -100;
    sustainFm.volume.value = -11;
  } else if (voice === "guitar") {
    sustainPoly.volume.value = -10;
    sustainFm.volume.value = -100;
  } else {
    sustainPoly.volume.value = -7;
    sustainFm.volume.value = -100;
  }

  switch (voice) {
    case "harp":
      sustainPoly.set({
        oscillator: { type: "triangle" },
        envelope: { attack: 0.04, decay: 0.25, sustain: 1, release: 0.7 },
      });
      break;
    case "guitar":
      sustainPoly.set({
        oscillator: { type: "triangle" },
        envelope: {
          attack: 0.035,
          decay: 0.22,
          sustain: 1,
          release: 0.62,
        },
      });
      break;
    case "organ":
      sustainPoly.set({
        oscillator: { type: "triangle" },
        envelope: { attack: 0.03, decay: 0.12, sustain: 1, release: 0.45 },
      });
      break;
    case "synth":
      break;
    default:
      break;
  }
}

/** Route main + sustain to voiceGain; strum → preamp → reverb → voiceGain. */
export async function initVoices(voiceGain: Tone.Gain): Promise<void> {
  strumReverb = new Tone.Reverb({ decay: 2.2, wet: 0.18 });
  await strumReverb.generate();

  strumCompressor = new Tone.Compressor({
    threshold: -22,
    ratio: 4,
    attack: 0.003,
    release: 0.08,
    knee: 6,
  });
  strumCompressor.connect(strumReverb);

  const strumPreamp = new Tone.Gain(1.12).connect(strumCompressor);
  strumReverb.connect(voiceGain);

  poly = new Tone.PolySynth(Tone.Synth, {
    volume: -4,
    oscillator: { type: "triangle" },
    envelope: { attack: 0.002, decay: 0.4, sustain: 0.02, release: 1 },
  }).connect(voiceGain);

  fmVoice = new Tone.PolySynth(Tone.FMSynth, {
    volume: -10,
    harmonicity: 3,
    modulationIndex: 4,
    envelope: { attack: 0.01, decay: 0.2, sustain: 0.4, release: 0.5 },
    modulation: { type: "square" },
    modulationEnvelope: {
      attack: 0.01,
      decay: 0.1,
      sustain: 0.2,
      release: 0.2,
    },
  }).connect(voiceGain);

  sustainPoly = new Tone.PolySynth(Tone.Synth, {
    volume: -7,
    oscillator: { type: "triangle" },
    envelope: { attack: 0.03, decay: 0.2, sustain: 1, release: 0.6 },
  }).connect(voiceGain);

  sustainFm = new Tone.PolySynth(Tone.FMSynth, {
    volume: -11,
    harmonicity: 3,
    modulationIndex: 4,
    envelope: { attack: 0.02, decay: 0.2, sustain: 1, release: 0.5 },
    modulation: { type: "square" },
    modulationEnvelope: {
      attack: 0.01,
      decay: 0.1,
      sustain: 0.3,
      release: 0.2,
    },
  }).connect(voiceGain);

  strumPoly = new Tone.PolySynth(Tone.Synth, {
    volume: -1,
    oscillator: { type: "triangle" },
    envelope: { attack: 0.004, decay: 0.8, sustain: 0.4, release: 2.3 },
  }).connect(strumPreamp);

  strumFm = new Tone.PolySynth(Tone.FMSynth, {
    volume: -6,
    harmonicity: 3,
    modulationIndex: 4,
    envelope: { attack: 0.012, decay: 0.35, sustain: 0.45, release: 1.8 },
    modulation: { type: "square" },
    modulationEnvelope: {
      attack: 0.01,
      decay: 0.1,
      sustain: 0.25,
      release: 0.25,
    },
  }).connect(strumPreamp);

  setActiveVoice("harp");
}

export function setActiveVoice(voice: VoiceId): void {
  applyMainPreset(voice);
  applySustainPreset(voice);
  applyStrumPreset(voice);
}

function triggerSustainAttack(notes: string[], time?: number): void {
  const t = time ?? Tone.now();
  if (activeVoice === "synth" && sustainFm) {
    sustainFm.triggerAttack(notes, t);
  } else if (sustainPoly) {
    sustainPoly.triggerAttack(notes, t);
  }
}

export function startSustainChord(notes: string[]): void {
  stopSustainChord();
  if (notes.length === 0) return;
  activeSustainNotes = [...notes];
  triggerSustainAttack(notes);
}

export function stopSustainChord(): void {
  sustainPoly?.releaseAll();
  sustainFm?.releaseAll();
  activeSustainNotes = [];
}

export function refreshSustainAfterVoiceChange(): void {
  if (activeSustainNotes.length === 0) return;
  const notes = [...activeSustainNotes];
  sustainPoly?.releaseAll();
  sustainFm?.releaseAll();
  triggerSustainAttack(notes);
}

export function hasActiveSustain(): boolean {
  return activeSustainNotes.length > 0;
}

export function playVoiceNote(
  note: string,
  duration = "8n",
  time?: number,
  velocity = 0.92,
): void {
  if (activeVoice === "synth" && fmVoice) {
    fmVoice.triggerAttackRelease(note, duration, time, velocity);
  } else if (poly) {
    poly.triggerAttackRelease(note, duration, time, velocity);
  }
}

/** Strum plate: longer notes, higher level, reverb via strum bus. */
export function playStrumVoiceNote(
  note: string,
  duration = "16n",
  time?: number,
  velocity = 0.85,
): void {
  if (activeVoice === "synth" && strumFm) {
    strumFm.triggerAttackRelease(note, duration, time, velocity);
  } else if (strumPoly) {
    strumPoly.triggerAttackRelease(note, duration, time, velocity);
  }
}

export function disposeVoices(): void {
  stopSustainChord();
  poly?.dispose();
  fmVoice?.dispose();
  sustainPoly?.dispose();
  sustainFm?.dispose();
  strumPoly?.dispose();
  strumFm?.dispose();
  strumCompressor?.dispose();
  strumReverb?.dispose();
  poly = null;
  fmVoice = null;
  sustainPoly = null;
  sustainFm = null;
  strumPoly = null;
  strumFm = null;
  strumCompressor = null;
  strumReverb = null;
}
