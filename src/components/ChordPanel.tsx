import type { ChordQuality } from "../types";
import { ROOTS, type Root } from "../audio/chordUtils";

type Props = {
  currentRoot: string;
  currentQuality: ChordQuality;
  poweredOn: boolean;
  onChordPointerDown: (root: Root, quality: ChordQuality) => void;
  onChordPointerUp: () => void;
};

const ROWS: { quality: ChordQuality; label: string }[] = [
  { quality: "major", label: "MAJ" },
  { quality: "minor", label: "min" },
  { quality: "seventh", label: "7th" },
];

export default function ChordPanel({
  currentRoot,
  currentQuality,
  poweredOn,
  onChordPointerDown,
  onChordPointerUp,
}: Props) {
  return (
    <div
      className={`qchord-chord-panel ${poweredOn ? "" : "qchord-chord-panel-off"}`}
      aria-label="Chord selection"
    >
      <div className="qchord-chord-header-row">
        <span className="qchord-chord-corner" aria-hidden />
        <div className="qchord-chord-keys qchord-chord-keys-labels">
          {ROOTS.map((root) => (
            <span key={root} className="qchord-chord-col-label">
              {root}
            </span>
          ))}
        </div>
      </div>
      {ROWS.map(({ quality, label }) => (
        <div key={quality} className="qchord-chord-row">
          <span className="qchord-chord-row-label">{label}</span>
          <div className="qchord-chord-keys">
            {ROOTS.map((root) => {
              const active =
                poweredOn &&
                currentRoot === root &&
                currentQuality === quality;
              const chordName =
                quality === "major"
                  ? `${root} major`
                  : quality === "minor"
                    ? `${root} minor`
                    : `${root} seventh`;
              return (
                <button
                  key={`${quality}-${root}`}
                  type="button"
                  className={`qchord-chord-btn ${active ? "qchord-chord-btn-active" : ""}`}
                  aria-label={chordName}
                  aria-pressed={active}
                  disabled={!poweredOn}
                  onPointerDown={(e) => {
                    if (!poweredOn) return;
                    e.preventDefault();
                    e.currentTarget.setPointerCapture(e.pointerId);
                    onChordPointerDown(root, quality);
                  }}
                  onPointerUp={(e) => {
                    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
                      e.currentTarget.releasePointerCapture(e.pointerId);
                    }
                    onChordPointerUp();
                  }}
                  onPointerCancel={(e) => {
                    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
                      e.currentTarget.releasePointerCapture(e.pointerId);
                    }
                    onChordPointerUp();
                  }}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
