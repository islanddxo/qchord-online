import { useStrumInteraction } from "../hooks/useStrumInteraction";

type Props = {
  onSectionTrigger: (index: number) => void;
  litIndex: number | null;
};

const LABELS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

export default function StrumPlate({ onSectionTrigger, litIndex }: Props) {
  const { strumPointerHandlers, getSectionHandlers } = useStrumInteraction({
    onSectionTrigger,
  });

  return (
    <div
      className="qchord-strum-wrap"
      {...strumPointerHandlers}
      aria-label="Strumplate, ten sections"
    >
      <div className="qchord-strum-strip">
        {LABELS.map((label, index) => (
          <button
            key={label}
            type="button"
            className="qchord-strum-section"
            aria-label={`Strum section ${index + 1}`}
            {...getSectionHandlers(index)}
          >
            <span
              className={`qchord-strum-section-hit ${litIndex === index ? "qchord-strum-section-hit-lit" : ""}`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
