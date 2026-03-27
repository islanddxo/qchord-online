import type { ChordQuality } from "../types";

export const ROOTS = [
  "Ab",
  "Eb",
  "Bb",
  "F",
  "C",
  "G",
  "D",
  "A",
  "E",
  "B",
] as const;

export type Root = (typeof ROOTS)[number];

/** Pitch class of root relative to C (=0). */
const ROOT_PC: Record<Root, number> = {
  Ab: 8,
  Eb: 3,
  Bb: 10,
  F: 5,
  C: 0,
  G: 7,
  D: 2,
  A: 9,
  E: 4,
  B: 11,
};

const INTERVALS: Record<ChordQuality, number[]> = {
  major: [0, 4, 7],
  minor: [0, 3, 7],
  seventh: [0, 4, 7, 10],
};

const NOTE_NAMES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
] as const;

export function isRoot(s: string): s is Root {
  return (ROOTS as readonly string[]).includes(s);
}

export function getChordNoteNames(root: Root, quality: ChordQuality): string[] {
  const base = ROOT_PC[root];
  return INTERVALS[quality].map((iv) => {
    const pc = (base + iv) % 12;
    return NOTE_NAMES[pc];
  });
}

/** Held auto-chord notes (spread across octaves). */
export function getSustainChordNotes(root: Root, quality: ChordQuality): string[] {
  const names = getChordNoteNames(root, quality);
  const oct = [3, 3, 4, 4];
  return names.map((n, i) => `${n}${oct[i] ?? 4}`);
}

/** Ten strum zones: cycle chord tones across octaves for a full strumplate. */
export function getStrumplateNotes(root: Root, quality: ChordQuality): string[] {
  const names = getChordNoteNames(root, quality);
  const octaves = [3, 3, 4, 4, 4, 4, 5, 5, 5, 5];
  const out: string[] = [];
  for (let i = 0; i < 10; i++) {
    out.push(`${names[i % names.length]}${octaves[i]}`);
  }
  return out;
}

export function chordLabel(root: Root, quality: ChordQuality): string {
  if (quality === "major") return `${root} Major`;
  if (quality === "minor") return `${root} Minor`;
  return `${root}7`;
}
