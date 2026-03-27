import type { Dispatch, SetStateAction } from "react";
import type { AppState } from "../types";

type Props = {
  state: AppState;
  setState: Dispatch<SetStateAction<AppState>>;
};

export default function MasterControls({ state, setState }: Props) {
  return (
    <div className="qchord-master" aria-label="Master controls">
      <div className="qchord-master-row qchord-master-buttons">
        <div className="qchord-ctrl-stack qchord-power-stack">
          <span
            className={`qchord-ctrl-led ${state.poweredOn ? "qchord-ctrl-led-on" : ""}`}
            aria-hidden
          />
          <button
            type="button"
            className={`qchord-ctrl qchord-ctrl-face qchord-power ${state.poweredOn ? "qchord-ctrl-on" : ""}`}
            aria-pressed={state.poweredOn}
            aria-label="Power"
            onClick={() =>
              setState((p) => {
                const nextOn = !p.poweredOn;
                return {
                  ...p,
                  poweredOn: nextOn,
                  ...(nextOn
                    ? {}
                    : { autoChord: false, chordGeneration: 0 }),
                };
              })
            }
          />
          <span className="qchord-ctrl-underlabel">Power</span>
        </div>

        <div
          className={`qchord-ctrl-stack ${state.poweredOn ? "" : "qchord-ctrl-stack-muted"}`}
        >
          <button
            type="button"
            className={`qchord-ctrl qchord-ctrl-face ${state.transportRunning ? "qchord-ctrl-on" : ""}`}
            aria-pressed={state.transportRunning}
            aria-label="Start or stop rhythm"
            disabled={!state.poweredOn}
            onClick={() =>
              setState((p) => {
                const nextRun = !p.transportRunning;
                return {
                  ...p,
                  transportRunning: nextRun,
                  chordGeneration: nextRun ? p.chordGeneration : 0,
                };
              })
            }
          />
          <span className="qchord-ctrl-underlabel">Start/Stop</span>
        </div>

        <div
          className={`qchord-ctrl-stack ${state.poweredOn ? "" : "qchord-ctrl-stack-muted"}`}
        >
          <span
            className={`qchord-ctrl-led ${state.autoChord ? "qchord-ctrl-led-on" : ""}`}
            aria-hidden
          />
          <button
            type="button"
            className={`qchord-ctrl qchord-ctrl-face ${state.autoChord ? "qchord-ctrl-on" : ""}`}
            aria-pressed={state.autoChord}
            aria-label="Auto chord"
            disabled={!state.poweredOn}
            onClick={() =>
              setState((p) => {
                const turningOn = !p.autoChord;
                return {
                  ...p,
                  autoChord: turningOn,
                  chordGeneration: turningOn ? 0 : p.chordGeneration,
                };
              })
            }
          />
          <span className="qchord-ctrl-underlabel">Auto Chord</span>
        </div>
      </div>
      <div className="qchord-display-bpm-row">
        <button
          type="button"
          className="qchord-bpm-btn qchord-display-bpm-btn"
          aria-label="Decrease BPM"
          onClick={() =>
            setState((p) => ({
              ...p,
              bpm: Math.max(60, p.bpm - 1),
            }))
          }
        >
          −
        </button>
        <span className="qchord-display-bpm-mid">BPM</span>
        <button
          type="button"
          className="qchord-bpm-btn qchord-display-bpm-btn"
          aria-label="Increase BPM"
          onClick={() =>
            setState((p) => ({
              ...p,
              bpm: Math.min(180, p.bpm + 1),
            }))
          }
        >
          +
        </button>
      </div>
      <div
        className={`qchord-master-volume-knob ${state.poweredOn ? "" : "qchord-master-volume-knob-muted"}`}
      >
        <label className="qchord-knob-silver-wrap">
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(state.masterVolume * 100)}
            aria-label="Volume"
            disabled={!state.poweredOn}
            onChange={(e) =>
              setState((p) => ({
                ...p,
                masterVolume: Number(e.target.value) / 100,
              }))
            }
            className="qchord-knob-silver"
          />
          <span className="qchord-knob-silver-caption">Volume</span>
        </label>
      </div>
    </div>
  );
}
