export type ChordQuality = "major" | "minor" | "seventh";

export type VoiceId = "harp" | "organ" | "synth" | "guitar";

export type RhythmId = "pop" | "rock" | "hiphop" | "metro";

/** Discrete volume steps: low → medium → high → mute (cycle). */
export const VOICE_RHYTHM_VOL_STEPS = [0.28, 0.55, 0.85, 0] as const;

export type AppState = {
  poweredOn: boolean;
  currentRoot: string;
  currentQuality: ChordQuality;
  currentVoice: VoiceId;
  currentRhythm: RhythmId;
  autoChord: boolean;
  transportRunning: boolean;
  bpm: number;
  masterVolume: number;
  voiceVolume: number;
  rhythmVolume: number;
  /** Incremented on each chord selection (UI or keyboard) for auto-chord sustain timing. */
  chordGeneration: number;
};

export const INITIAL_STATE: AppState = {
  poweredOn: true,
  currentRoot: "C",
  currentQuality: "major",
  currentVoice: "harp",
  currentRhythm: "pop",
  autoChord: false,
  transportRunning: false,
  bpm: 100,
  masterVolume: 0.85,
  voiceVolume: 0.55,
  rhythmVolume: 0.55,
  chordGeneration: 0,
};
