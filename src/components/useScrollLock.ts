import { useEffect } from "react";

let locks = 0;

/**
 * Holds the page still while a sheet or alert is up — iOS never lets the
 * screen behind a sheet scroll. `overflow: hidden` on the root is honoured
 * for touch by WebKit (iOS 16+) and Chrome alike, keeps the scroll position
 * where it was (no jump, no scroll event for the nav bar to react to), and
 * still lets code scroll the page (`useRevealAboveSheet`). Counted, so a
 * sheet opened from another sheet doesn't unlock the page when it closes.
 */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const root = document.documentElement;
    if (locks++ === 0) root.style.overflow = "hidden";
    return () => {
      if (--locks === 0) root.style.overflow = "";
    };
  }, [active]);
}
