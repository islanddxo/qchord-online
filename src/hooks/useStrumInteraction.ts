import { useCallback, useRef } from "react";

type Handlers = {
  onSectionTrigger: (index: number) => void;
};

/**
 * Pointer strum: click triggers once; drag only fires when entering a new section.
 * Works for mouse and touch.
 */
export function useStrumInteraction({ onSectionTrigger }: Handlers) {
  const activeSection = useRef<number | null>(null);
  const dragging = useRef(false);

  const fireIfNew = useCallback(
    (index: number) => {
      if (activeSection.current === index) return;
      activeSection.current = index;
      onSectionTrigger(index);
    },
    [onSectionTrigger],
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent, index: number) => {
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      dragging.current = true;
      activeSection.current = null;
      fireIfNew(index);
    },
    [fireIfNew],
  );

  const onPointerEnter = useCallback(
    (e: React.PointerEvent, index: number) => {
      if (!dragging.current) return;
      if (e.buttons === 0 && e.pointerType === "mouse") return;
      fireIfNew(index);
    },
    [fireIfNew],
  );

  const endDrag = useCallback(() => {
    dragging.current = false;
    activeSection.current = null;
  }, []);

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      try {
        (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
      } catch {
        /* ignore */
      }
      endDrag();
    },
    [endDrag],
  );

  const onPointerCancel = useCallback(() => {
    endDrag();
  }, [endDrag]);

  return {
    strumPointerHandlers: {
      onPointerUp,
      onPointerCancel,
      onPointerLeave: endDrag,
    },
    getSectionHandlers: (index: number) => ({
      onPointerDown: (e: React.PointerEvent) => onPointerDown(e, index),
      onPointerEnter: (e: React.PointerEvent) => onPointerEnter(e, index),
    }),
  };
}
