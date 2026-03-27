import { useCallback, useId, useState } from "react";

export default function ControlsPanel() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const headingId = useId();

  const toggle = useCallback(() => {
    setOpen((v) => !v);
  }, []);

  return (
    <div
      className={`qchord-controls-menu${open ? " qchord-controls-menu--open" : ""}`}
    >
      <button
        type="button"
        className="qchord-controls-toggle"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label="Toggle keyboard controls reference panel"
        onClick={toggle}
      >
        Controls
      </button>
      <div className="qchord-controls-panel-clip">
        <div className="qchord-controls-panel-clip-inner">
          <section
            id={panelId}
            className="qchord-controls-panel"
            role="region"
            aria-labelledby={headingId}
            aria-hidden={!open}
          >
            <h2 id={headingId} className="qchord-controls-panel-title">
              Controls
            </h2>
            <ul className="qchord-controls-list">
              <li className="qchord-controls-item">
              <span className="qchord-controls-bullet" aria-hidden="true">
                •{" "}
              </span>
              <span className="qchord-controls-kbd">Q - P</span>
              <span> | Major Chords</span>
              </li>
              <li className="qchord-controls-item">
              <span className="qchord-controls-bullet" aria-hidden="true">
                •{" "}
              </span>
              <span className="qchord-controls-kbd">A - ;</span>
              <span> | Minor Chords</span>
              </li>
              <li className="qchord-controls-item">
              <span className="qchord-controls-bullet" aria-hidden="true">
                •{" "}
              </span>
              <span className="qchord-controls-kbd">Z - /</span>
              <span> | 7th Chords</span>
              </li>
              <li className="qchord-controls-item">
              <span className="qchord-controls-bullet" aria-hidden="true">
                •{" "}
              </span>
              <span className="qchord-controls-kbd">1 - 0</span>
              <span> | Strum Plate</span>
              </li>
              <li className="qchord-controls-item">
              <span className="qchord-controls-bullet" aria-hidden="true">
                •{" "}
              </span>
              <span className="qchord-controls-kbd">Shift + P</span>
              <span> | Power</span>
              </li>
              <li className="qchord-controls-item">
              <span className="qchord-controls-bullet" aria-hidden="true">
                •{" "}
              </span>
              <span className="qchord-controls-kbd">Shift + Space</span>
              <span> | Start/Stop</span>
              </li>
              <li className="qchord-controls-item">
              <span className="qchord-controls-bullet" aria-hidden="true">
                •{" "}
              </span>
              <span className="qchord-controls-kbd">Shift + M</span>
              <span> | Auto Chord</span>
              </li>
              <li className="qchord-controls-item">
              <span className="qchord-controls-bullet" aria-hidden="true">
                •{" "}
              </span>
              <span className="qchord-controls-kbd">Shift + V</span>
              <span> | Voice Selector</span>
              </li>
              <li className="qchord-controls-item">
              <span className="qchord-controls-bullet" aria-hidden="true">
                •{" "}
              </span>
              <span className="qchord-controls-kbd">Shift + R</span>
              <span> | Rhythm Selector</span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
