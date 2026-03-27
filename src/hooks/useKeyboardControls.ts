import { useEffect, useRef } from "react";
import type { AppState, ChordQuality, RhythmId, VoiceId } from "../types";
import type { Root } from "../audio/chordUtils";
import {
  chordFromKeyboardKey,
  isStrumKey,
  normalizeKeyboardKey,
  strumIndexFromKey,
} from "../audio/keyMappings";
import { nextCyclic } from "../utils/cyclicList";

const VOICES: VoiceId[] = ["harp", "organ", "synth", "guitar"];
const RHYTHMS: RhythmId[] = ["pop", "rock", "hiphop", "metro"];

type Props = {
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  onStrumIndex: (index: number) => void;
  isPoweredOn: () => boolean;
  autoChordRef: React.MutableRefObject<boolean>;
  chordKeyboardHeldRef: React.MutableRefObject<boolean>;
  sustainManualChord: (root: Root, quality: ChordQuality) => void;
  releaseManualChord: () => void;
};

export function useKeyboardControls({
  setState,
  onStrumIndex,
  isPoweredOn,
  autoChordRef,
  chordKeyboardHeldRef,
  sustainManualChord,
  releaseManualChord,
}: Props): void {
  const chordKeyStackRef = useRef<string[]>([]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const powered = isPoweredOn();

      if (!powered) {
        chordKeyStackRef.current = [];
        chordKeyboardHeldRef.current = false;
        if (event.shiftKey && event.key === "P") {
          event.preventDefault();
          setState((prev) => ({ ...prev, poweredOn: !prev.poweredOn }));
        }
        return;
      }

      const chord = chordFromKeyboardKey(event.key);
      if (chord && !event.shiftKey) {
        if (event.repeat) return;
        event.preventDefault();
        const nk = normalizeKeyboardKey(event.key);
        chordKeyStackRef.current = chordKeyStackRef.current.filter((x) => x !== nk);
        chordKeyStackRef.current.push(nk);
        setState((prev) => ({
          ...prev,
          currentRoot: chord.root,
          currentQuality: chord.quality,
          chordGeneration: prev.chordGeneration + 1,
        }));
        if (!autoChordRef.current) {
          sustainManualChord(chord.root, chord.quality);
        }
        chordKeyboardHeldRef.current = chordKeyStackRef.current.length > 0;
        return;
      }

      if (!event.shiftKey && isStrumKey(event.key)) {
        if (event.repeat) return;
        event.preventDefault();
        const idx = strumIndexFromKey(event.key);
        if (idx !== null) onStrumIndex(idx);
        return;
      }

      if (!event.shiftKey) return;

      if (event.shiftKey && event.key === "P") {
        event.preventDefault();
        setState((prev) => {
          const nextOn = !prev.poweredOn;
          return {
            ...prev,
            poweredOn: nextOn,
            ...(nextOn
              ? {}
              : { autoChord: false, chordGeneration: 0 }),
          };
        });
        return;
      }
      if (event.shiftKey && event.code === "Space") {
        event.preventDefault();
        setState((prev) => {
          const nextRun = !prev.transportRunning;
          return {
            ...prev,
            transportRunning: nextRun,
            chordGeneration: nextRun ? prev.chordGeneration : 0,
          };
        });
        return;
      }
      if (event.shiftKey && event.key.toLowerCase() === "r") {
        event.preventDefault();
        setState((prev) => ({
          ...prev,
          currentRhythm: nextCyclic(RHYTHMS, prev.currentRhythm),
        }));
        return;
      }
      if (event.shiftKey && event.key.toLowerCase() === "v") {
        event.preventDefault();
        setState((prev) => ({
          ...prev,
          currentVoice: nextCyclic(VOICES, prev.currentVoice),
        }));
        return;
      }
      if (event.shiftKey && event.key.toLowerCase() === "m") {
        event.preventDefault();
        setState((prev) => {
          const turningOn = !prev.autoChord;
          return {
            ...prev,
            autoChord: turningOn,
            chordGeneration: turningOn ? 0 : prev.chordGeneration,
          };
        });
        return;
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (!isPoweredOn()) return;
      const chordHit = chordFromKeyboardKey(event.key);
      if (!chordHit || event.shiftKey) return;

      const nk = normalizeKeyboardKey(event.key);
      chordKeyStackRef.current = chordKeyStackRef.current.filter((x) => x !== nk);
      chordKeyboardHeldRef.current = chordKeyStackRef.current.length > 0;

      if (autoChordRef.current) return;

      if (chordKeyStackRef.current.length === 0) {
        releaseManualChord();
      } else {
        const last = chordKeyStackRef.current[chordKeyStackRef.current.length - 1]!;
        const c = chordFromKeyboardKey(last);
        if (c) sustainManualChord(c.root, c.quality);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [
    setState,
    onStrumIndex,
    isPoweredOn,
    autoChordRef,
    chordKeyboardHeldRef,
    sustainManualChord,
    releaseManualChord,
  ]);
}
