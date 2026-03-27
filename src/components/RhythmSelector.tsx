import type { Dispatch, SetStateAction } from "react";
import type { AppState, RhythmId } from "../types";
import { stripSelectNext, stripSelectPrev } from "../utils/selectorStripNavigation";
import { volumeStepDown, volumeStepUp } from "../utils/volumeCycle";
import SelectorStrip from "./SelectorStrip";

const ITEMS: { id: RhythmId; label: string }[] = [
  { id: "pop", label: "Pop" },
  { id: "rock", label: "Rock" },
  { id: "hiphop", label: "Hiphop" },
  { id: "metro", label: "Metro" },
];

type Props = {
  state: AppState;
  setState: Dispatch<SetStateAction<AppState>>;
};

export default function RhythmSelector({ state, setState }: Props) {
  const selectUp = () => {
    setState((p) => ({
      ...p,
      currentRhythm: stripSelectPrev(ITEMS, p.currentRhythm),
    }));
  };

  const selectDown = () => {
    setState((p) => ({
      ...p,
      currentRhythm: stripSelectNext(ITEMS, p.currentRhythm),
    }));
  };

  return (
    <SelectorStrip
      sectionLabel="Rhythm"
      items={ITEMS}
      selectedId={state.currentRhythm}
      poweredOn={state.poweredOn}
      onSelectionUp={selectUp}
      onSelectionDown={selectDown}
      onVolumeUp={() =>
        setState((p) => ({ ...p, rhythmVolume: volumeStepUp(p.rhythmVolume) }))
      }
      onVolumeDown={() =>
        setState((p) => ({
          ...p,
          rhythmVolume: volumeStepDown(p.rhythmVolume),
        }))
      }
    />
  );
}
