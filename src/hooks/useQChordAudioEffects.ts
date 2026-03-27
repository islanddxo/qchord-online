import { useEffect, type MutableRefObject } from "react";
import * as Tone from "tone";
import type { AppState } from "../types";
import {
  applyAudioFromState,
  startAutoChordSustainFromState,
  startTransportFromState,
  stopAutoChordSustain,
  stopTransport,
} from "../audio/audioEngine";
import { isRoot } from "../audio/chordUtils";

/** Syncs React state to the Tone graph, transport, and auto-chord sustain. */
export function useQChordAudioEffects(
  audioReady: boolean,
  state: AppState,
  manualChordPointerHeldRef: MutableRefObject<boolean>,
  chordKeyboardHeldRef: MutableRefObject<boolean>,
): void {
  useEffect(() => {
    if (!audioReady) return;
    applyAudioFromState(state);
  }, [audioReady, state]);

  useEffect(() => {
    if (!audioReady) return;
    const transport = Tone.getTransport();
    if (state.transportRunning) {
      if (transport.state !== "started") {
        startTransportFromState(state);
      }
    } else if (transport.state === "started") {
      stopTransport();
    }
  }, [audioReady, state]);

  useEffect(() => {
    if (!audioReady) return;
    if (!state.autoChord) return;

    if (!state.poweredOn || !isRoot(state.currentRoot)) {
      stopAutoChordSustain();
    } else {
      startAutoChordSustainFromState({
        poweredOn: state.poweredOn,
        currentRoot: state.currentRoot,
        currentQuality: state.currentQuality,
      });
    }

    return () => {
      /* Read .current when cleanup runs (latest hold state), not a stale snapshot. */
      /* eslint-disable react-hooks/exhaustive-deps -- ref.current in cleanup is intentional */
      if (manualChordPointerHeldRef.current) return;
      if (chordKeyboardHeldRef.current) return;
      stopAutoChordSustain();
      /* eslint-enable react-hooks/exhaustive-deps */
    };
  }, [
    audioReady,
    state.autoChord,
    state.poweredOn,
    state.currentRoot,
    state.currentQuality,
    manualChordPointerHeldRef,
    chordKeyboardHeldRef,
  ]);
}
