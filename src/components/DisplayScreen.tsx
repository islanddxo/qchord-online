import type { AppState } from "../types";

const MARQUEE_TEXT = "the final stage of healing is becoming an artist";

type Props = {
  state: Pick<AppState, "bpm" | "poweredOn">;
};

export default function DisplayScreen({ state }: Props) {
  return (
    <div
      className={`qchord-display qchord-display-stack ${state.poweredOn ? "" : "qchord-display-off"}`}
      aria-label=""
    >
      <div className="qchord-display-bpm-num" aria-live="polite">
        {state.bpm}
      </div>
      <div className="qchord-marquee-mask">
        <div className="qchord-marquee-track">
          <span className="qchord-marquee-text">{MARQUEE_TEXT}</span>
          <span className="qchord-marquee-text" aria-hidden="true">
            {MARQUEE_TEXT}
          </span>
        </div>
      </div>
    </div>
  );
}
