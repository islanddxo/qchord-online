import { useCallback, useEffect, useRef, useState } from "react";
import shellImg from "../assets/qchord-shell.png";
import logoImg from "../assets/qchordlogo.svg";
import "../styles/qchord.css";
import type { AppState, ChordQuality } from "../types";
import { INITIAL_STATE } from "../types";
import {
  ensureAudio,
  playStrumNote,
  startAutoChordSustainFromState,
  stopAutoChordSustain,
} from "../audio/audioEngine";
import { getStrumplateNotes, isRoot, type Root } from "../audio/chordUtils";
import { useInstrumentViewportFit } from "../hooks/useInstrumentViewportFit";
import { useKeyboardControls } from "../hooks/useKeyboardControls";
import { useQChordAudioEffects } from "../hooks/useQChordAudioEffects";
import {
  QCHORD_DESIGN_HEIGHT,
  QCHORD_DESIGN_WIDTH,
} from "../layout/qchordDesign";
import ChordPanel from "./ChordPanel";
import ControlsPanel from "./ControlsPanel";
import DisplayScreen from "./DisplayScreen";
import MasterControls from "./MasterControls";
import RhythmSelector from "./RhythmSelector";
import StrumPlate from "./StrumPlate";
import VoiceSelector from "./VoiceSelector";

export default function QChordOnline() {
  const { stageRef, scale, rotated } = useInstrumentViewportFit();
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [audioReady, setAudioReady] = useState(false);
  const [strumLitIndex, setStrumLitIndex] = useState<number | null>(null);
  const stateRef = useRef(state);
  const poweredRef = useRef(state.poweredOn);
  const autoChordRef = useRef(state.autoChord);
  const manualChordPointerHeldRef = useRef(false);
  const chordKeyboardHeldRef = useRef(false);
  const strumLitTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  useEffect(() => {
    stateRef.current = state;
    poweredRef.current = state.poweredOn;
    autoChordRef.current = state.autoChord;
  }, [state]);

  const unlock = useCallback(async () => {
    await ensureAudio();
    setAudioReady(true);
  }, []);

  const onShellPointerDown = useCallback(() => {
    void unlock();
  }, [unlock]);

  const flashStrum = useCallback((index: number) => {
    setStrumLitIndex(index);
    if (strumLitTimer.current !== undefined) {
      clearTimeout(strumLitTimer.current);
    }
    strumLitTimer.current = setTimeout(() => {
      setStrumLitIndex(null);
    }, 160);
  }, []);

  useQChordAudioEffects(
    audioReady,
    state,
    manualChordPointerHeldRef,
    chordKeyboardHeldRef,
  );

  const onStrumIndex = useCallback(
    (index: number) => {
      if (!stateRef.current.poweredOn) return;
      void unlock();
      flashStrum(index);
      const s = stateRef.current;
      if (!isRoot(s.currentRoot)) return;
      const notes = getStrumplateNotes(s.currentRoot, s.currentQuality);
      playStrumNote(notes[index] ?? notes[0]);
    },
    [unlock, flashStrum],
  );

  const isPoweredOn = useCallback(() => poweredRef.current, []);

  const sustainManualChord = useCallback((root: Root, quality: ChordQuality) => {
    if (!stateRef.current.poweredOn) return;
    void unlock();
    startAutoChordSustainFromState({
      poweredOn: true,
      currentRoot: root,
      currentQuality: quality,
    });
  }, [unlock]);

  const releaseManualChord = useCallback(() => {
    stopAutoChordSustain();
  }, []);

  useKeyboardControls({
    setState,
    onStrumIndex,
    isPoweredOn,
    autoChordRef,
    chordKeyboardHeldRef,
    sustainManualChord,
    releaseManualChord,
  });

  const onChordPointerDown = useCallback(
    (root: Root, quality: ChordQuality) => {
      if (!stateRef.current.poweredOn) return;
      void unlock();
      if (!autoChordRef.current) {
        manualChordPointerHeldRef.current = true;
        startAutoChordSustainFromState({
          poweredOn: true,
          currentRoot: root,
          currentQuality: quality,
        });
      }
      setState((p) => ({
        ...p,
        currentRoot: root,
        currentQuality: quality,
        chordGeneration: p.chordGeneration + 1,
      }));
    },
    [unlock],
  );

  const onChordPointerUp = useCallback(() => {
    manualChordPointerHeldRef.current = false;
    if (!autoChordRef.current && !chordKeyboardHeldRef.current) {
      stopAutoChordSustain();
    }
  }, []);

  return (
    <div className="qchord-page">
      <div className="qchord-chrome">
        <div className="qchord-logo-container">
          <img className="qchord-logo" src={logoImg} alt="QChord Online Logo" />
        </div>
        <ControlsPanel />
      </div>
      <div className="qchord-viewport-stage" ref={stageRef}>
        <div
          className={`qchord-instrument-scaler${rotated ? " qchord-instrument-scaler--rotated" : ""}`}
          style={{
            width: QCHORD_DESIGN_WIDTH,
            height: QCHORD_DESIGN_HEIGHT,
            transform: `translate(-50%, -50%)${rotated ? " rotate(-90deg)" : ""} scale(${scale})`,
          }}
        >
          <div
            className="qchord-shell-outer"
            onPointerDownCapture={onShellPointerDown}
          >
            <div className="qchord-shell">
              <img
                className="qchord-shell-img"
                src={shellImg}
                alt=""
                draggable={false}
              />
              <div
                className={`qchord-overlay ${!state.poweredOn ? "qchord-instrument-off" : ""}`}
                aria-hidden={false}
              >
                <div className="qchord-region qchord-region-display">
                  <DisplayScreen state={state} />
                </div>

                <div className="qchord-region qchord-region-master">
                  <MasterControls state={state} setState={setState} />
                </div>

                <div className="qchord-region qchord-region-chord">
                  <ChordPanel
                    currentRoot={state.currentRoot}
                    currentQuality={state.currentQuality}
                    poweredOn={state.poweredOn}
                    onChordPointerDown={onChordPointerDown}
                    onChordPointerUp={onChordPointerUp}
                  />
                </div>

                <div className="qchord-region qchord-region-strum">
                  <StrumPlate
                    onSectionTrigger={onStrumIndex}
                    litIndex={state.poweredOn ? strumLitIndex : null}
                  />
                </div>

                <div className="qchord-region qchord-region-voice">
                  <VoiceSelector state={state} setState={setState} />
                </div>

                <div className="qchord-region qchord-region-rhythm">
                  <RhythmSelector state={state} setState={setState} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
