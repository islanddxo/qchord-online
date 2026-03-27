import type { ChordQuality } from "../types";
import { ROOTS } from "./chordUtils";

const MAJOR_KEYS = [
  "q",
  "w",
  "e",
  "r",
  "t",
  "y",
  "u",
  "i",
  "o",
  "p",
] as const;
const MINOR_KEYS = [
  "a",
  "s",
  "d",
  "f",
  "g",
  "h",
  "j",
  "k",
  "l",
  ";",
] as const;
const SEVENTH_KEYS = [
  "z",
  "x",
  "c",
  "v",
  "b",
  "n",
  "m",
  ",",
  ".",
  "/",
] as const;

const STRUM_KEYS = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "0",
] as const;

export function normalizeKeyboardKey(key: string): string {
  return key.length === 1 ? key.toLowerCase() : key;
}

export function chordFromKeyboardKey(key: string): {
  root: (typeof ROOTS)[number];
  quality: ChordQuality;
} | null {
  const k = normalizeKeyboardKey(key);
  let idx = MAJOR_KEYS.indexOf(k as (typeof MAJOR_KEYS)[number]);
  if (idx >= 0) return { root: ROOTS[idx], quality: "major" };
  idx = MINOR_KEYS.indexOf(k as (typeof MINOR_KEYS)[number]);
  if (idx >= 0) return { root: ROOTS[idx], quality: "minor" };
  idx = SEVENTH_KEYS.indexOf(k as (typeof SEVENTH_KEYS)[number]);
  if (idx >= 0) return { root: ROOTS[idx], quality: "seventh" };
  return null;
}

export function strumIndexFromKey(key: string): number | null {
  const i = STRUM_KEYS.indexOf(key as (typeof STRUM_KEYS)[number]);
  return i >= 0 ? i : null;
}

export function isStrumKey(key: string): boolean {
  return STRUM_KEYS.includes(key as (typeof STRUM_KEYS)[number]);
}
