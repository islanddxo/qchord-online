import type { ReactElement } from "react";

export type StripItem<T extends string> = { id: T; label: string };

function StripControlSet({
  label,
  groupAriaLabel,
  onUp,
  onDown,
  upAriaLabel,
  downAriaLabel,
}: {
  label: string;
  groupAriaLabel: string;
  onUp: () => void;
  onDown: () => void;
  upAriaLabel: string;
  downAriaLabel: string;
}): ReactElement {
  return (
    <div
      className="qchord-strip-control-set"
      role="group"
      aria-label={groupAriaLabel}
    >
      <button
        type="button"
        className="qchord-strip-mini qchord-strip-mini-up"
        aria-label={upAriaLabel}
        onClick={onUp}
      />
      <span className="qchord-strip-set-label">{label}</span>
      <button
        type="button"
        className="qchord-strip-mini qchord-strip-mini-down"
        aria-label={downAriaLabel}
        onClick={onDown}
      />
    </div>
  );
}

type Props<T extends string> = {
  sectionLabel: string;
  items: StripItem<T>[];
  selectedId: T;
  poweredOn: boolean;
  onSelectionUp: () => void;
  onSelectionDown: () => void;
  onVolumeUp: () => void;
  onVolumeDown: () => void;
};

export default function SelectorStrip<T extends string>({
  sectionLabel,
  items,
  selectedId,
  poweredOn,
  onSelectionUp,
  onSelectionDown,
  onVolumeUp,
  onVolumeDown,
}: Props<T>): ReactElement {
  const found = items.findIndex((it) => it.id === selectedId);
  const selIdx = found < 0 ? 0 : found;
  const n = items.length;
  const markerTop = n <= 1 ? 0 : (selIdx / (n - .5)) * 80;

  return (
    <div
      className={`qchord-strip ${poweredOn ? "" : "qchord-strip-powered-off"}`}
      role="group"
      aria-label={sectionLabel}
    >
      <StripControlSet
        label="Selector"
        groupAriaLabel={`${sectionLabel} selector`}
        upAriaLabel={`${sectionLabel}: select previous`}
        downAriaLabel={`${sectionLabel}: select next`}
        onUp={onSelectionUp}
        onDown={onSelectionDown}
      />

      <div className="qchord-strip-core">
        <div className="qchord-strip-labels">
          {items.map((it) => (
            <span
              key={it.id}
              className={
                poweredOn && it.id === selectedId
                  ? "qchord-strip-label qchord-strip-label-active"
                  : "qchord-strip-label"
              }
            >
              {it.label}
            </span>
          ))}
        </div>
        <div className="qchord-strip-track" aria-hidden>
          {poweredOn ? (
            <div
              className="qchord-strip-marker"
              style={{ top: `${markerTop}%` }}
            />
          ) : null}
        </div>
      </div>

      <StripControlSet
        label="Volume"
        groupAriaLabel={`${sectionLabel} volume`}
        upAriaLabel={`${sectionLabel}: volume up`}
        downAriaLabel={`${sectionLabel}: volume down`}
        onUp={onVolumeUp}
        onDown={onVolumeDown}
      />
      
    </div>
    
  );
}
