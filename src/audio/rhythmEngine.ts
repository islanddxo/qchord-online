import * as Tone from "tone";
import type { ChordQuality, RhythmId } from "../types";

import hiphopWav from "../assets/hiphop.wav";
import metronomeWav from "../assets/metronome.wav";
import popWav from "../assets/pop.wav";
import rockWav from "../assets/rock.wav";

/** Loops are authored at this BPM (4 bars). */
const REF_BPM = 100;

const RHYTHM_URLS: Record<RhythmId, string> = {
  pop: popWav,
  rock: rockWav,
  hiphop: hiphopWav,
  metro: metronomeWav,
};

let rhythmOut: Tone.Gain | null = null;
const players: Partial<Record<RhythmId, Tone.Player>> = {};

let currentRhythm: RhythmId = "pop";
let currentBpm = REF_BPM;
let poweredOn = true;

function disposeAllPlayers(): void {
  for (const id of Object.keys(players) as RhythmId[]) {
    const p = players[id];
    if (!p) continue;
    p.stop();
    p.unsync();
    p.dispose();
    delete players[id];
  }
}

function stopAllPlayers(): void {
  for (const p of Object.values(players)) {
    if (!p) continue;
    p.stop();
    p.unsync();
  }
}

function syncActivePlayer(): void {
  if (!rhythmOut) return;
  const p = players[currentRhythm];
  if (!p) return;
  p.playbackRate = currentBpm / REF_BPM;
  p.sync().start(0);
}

export async function initRhythm(rGain: Tone.Gain): Promise<void> {
  disposeAllPlayers();
  Tone.getTransport().cancel(0);
  rhythmOut = rGain;
  const ids = Object.keys(RHYTHM_URLS) as RhythmId[];
  for (const id of ids) {
    const url = RHYTHM_URLS[id];
    const player = new Tone.Player({
      url,
      loop: true,
      fadeIn: 0.02,
      fadeOut: 0.02,
    }).connect(rGain);
    await player.loaded;
    players[id] = player;
  }
}

/** WAV playback ignores chord fields; they exist so `applyAudioFromState` can pass a stable shape. */
export function setRhythmState(r: {
  rhythm: RhythmId;
  chordRoot: string;
  chordQuality: ChordQuality;
  isPoweredOn: boolean;
  bpm: number;
}): void {
  const rhythmChanged = r.rhythm !== currentRhythm;
  const bpmChanged = r.bpm !== currentBpm;
  currentRhythm = r.rhythm;
  currentBpm = r.bpm;
  poweredOn = r.isPoweredOn;

  for (const p of Object.values(players)) {
    if (p) p.playbackRate = currentBpm / REF_BPM;
  }

  if (!poweredOn) {
    stopAllPlayers();
    return;
  }

  if (Tone.getTransport().state === "started" && (rhythmChanged || bpmChanged)) {
    stopAllPlayers();
    Tone.getTransport().cancel(0);
    syncActivePlayer();
  }
}

export function rebuildLoop(): void {
  stopAllPlayers();
  Tone.getTransport().cancel(0);
  if (!poweredOn) return;
  syncActivePlayer();
}

export function resetRhythmStep(): void {
  stopAllPlayers();
}

export function stopRhythmPlayback(): void {
  stopAllPlayers();
  Tone.getTransport().cancel(0);
}
