import type { Dispatch, SetStateAction } from "react";
import type { AppState, VoiceId } from "../types";
import { stripSelectNext, stripSelectPrev } from "../utils/selectorStripNavigation";
import { volumeStepDown, volumeStepUp } from "../utils/volumeCycle";
import SelectorStrip from "./SelectorStrip";

const ITEMS: { id: VoiceId; label: string }[] = [
  { id: "harp", label: "Harp" },
  { id: "organ", label: "Organ" },
  { id: "synth", label: "Synth" },
  { id: "guitar", label: "Guitar" },
];

type Props = {
  state: AppState;
  setState: Dispatch<SetStateAction<AppState>>;
};

export default function VoiceSelector({ state, setState }: Props) {
  const selectUp = () => {
    setState((p) => ({
      ...p,
      currentVoice: stripSelectPrev(ITEMS, p.currentVoice),
    }));
  };

  const selectDown = () => {
    setState((p) => ({
      ...p,
      currentVoice: stripSelectNext(ITEMS, p.currentVoice),
    }));
  };

  return (
    <SelectorStrip
      sectionLabel="Voice"
      items={ITEMS}
      selectedId={state.currentVoice}
      poweredOn={state.poweredOn}
      onSelectionUp={selectUp}
      onSelectionDown={selectDown}
      onVolumeUp={() =>
        setState((p) => ({ ...p, voiceVolume: volumeStepUp(p.voiceVolume) }))
      }
      onVolumeDown={() =>
        setState((p) => ({ ...p, voiceVolume: volumeStepDown(p.voiceVolume) }))
      }
    />
  );
}
