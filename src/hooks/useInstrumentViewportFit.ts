import { useLayoutEffect, useRef, useState, type RefObject } from "react";
import {
  QCHORD_DESIGN_HEIGHT,
  QCHORD_DESIGN_WIDTH,
} from "../layout/qchordDesign";

export type InstrumentViewportFit = {
  scale: number;
  rotated: boolean;
  stageRef: RefObject<HTMLDivElement | null>;
};

/**
 * Computes uniform scale to fit the design-sized instrument in the stage.
 * Uses -90° rotation when that yields a larger uniform scale (typical portrait phones/tablets).
 */
export function useInstrumentViewportFit(): InstrumentViewportFit {
  const stageRef = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState<{ scale: number; rotated: boolean }>({
    scale: 1,
    rotated: false,
  });

  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const measure = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (w <= 0 || h <= 0) return;

      const DW = QCHORD_DESIGN_WIDTH;
      const DH = QCHORD_DESIGN_HEIGHT;

      /* No cap at 1 — grow to fill the stage on large screens while staying inside the viewport */
      const sNormal = Math.min(w / DW, h / DH);
      const sRotated = Math.min(w / DH, h / DW);

      const preferRotated = sRotated > sNormal + 1e-4;

      setFit({
        rotated: preferRotated,
        scale: preferRotated ? sRotated : sNormal,
      });
    };

    measure();

    const ro = new ResizeObserver(() => measure());
    ro.observe(el);

    const vv = window.visualViewport;
    if (vv) {
      vv.addEventListener("resize", measure);
      vv.addEventListener("scroll", measure);
    }
    window.addEventListener("resize", measure);

    return () => {
      ro.disconnect();
      if (vv) {
        vv.removeEventListener("resize", measure);
        vv.removeEventListener("scroll", measure);
      }
      window.removeEventListener("resize", measure);
    };
  }, []);

  return { ...fit, stageRef };
}
