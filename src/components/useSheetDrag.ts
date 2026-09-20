import { useRef, type PointerEvent } from "react";

/**
 * Drag-down-to-dismiss for a phone bottom sheet — the iOS gesture. Put `sheetRef`
 * on the sheet and spread `handleProps` on its grabber/title strip: pulling that
 * strip down moves the sheet with the finger (written straight to the element,
 * no React state per frame), and releasing past ~80px or with a quick flick
 * closes it; anything shorter springs back. A drag never counts as a tap, so
 * the sheet's own click-to-close doesn't fire on release.
 */
export function useSheetDrag(onClose: () => void) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ y0: number; t0: number; dy: number } | null>(null);
  const dragged = useRef(false);

  const settle = (e: PointerEvent, cancelled: boolean) => {
    const d = drag.current;
    drag.current = null;
    const el = sheetRef.current;
    if (!d || !el) return;
    const v = d.dy / Math.max(1, e.timeStamp - d.t0); // px per ms
    if (!cancelled && (d.dy > 80 || (v > 0.6 && d.dy > 40))) {
      el.style.transition = "transform 180ms ease-out";
      el.style.transform = "translateY(100%)";
      window.setTimeout(onClose, 170);
    } else {
      el.style.transition = "transform 260ms cubic-bezier(0.22, 1, 0.36, 1)";
      el.style.transform = "";
    }
  };

  const handleProps = {
    onPointerDown: (e: PointerEvent<HTMLElement>) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      dragged.current = false;
      drag.current = { y0: e.clientY, t0: e.timeStamp, dy: 0 };
      e.currentTarget.setPointerCapture(e.pointerId);
      if (sheetRef.current) sheetRef.current.style.transition = "none";
    },
    onPointerMove: (e: PointerEvent<HTMLElement>) => {
      const d = drag.current;
      const el = sheetRef.current;
      if (!d || !el) return;
      d.dy = Math.max(0, e.clientY - d.y0);
      if (d.dy > 4) dragged.current = true;
      el.style.transform = `translateY(${d.dy}px)`;
    },
    onPointerUp: (e: PointerEvent<HTMLElement>) => settle(e, false),
    onPointerCancel: (e: PointerEvent<HTMLElement>) => settle(e, true),
    onClickCapture: (e: React.MouseEvent) => {
      if (dragged.current) {
        e.stopPropagation();
        e.preventDefault();
        dragged.current = false;
      }
    },
  };

  return { sheetRef, handleProps };
}
