import { useEffect, type RefObject } from "react";

/** breathing room left between the row and the sheet's top edge */
const GAP = 12;

/**
 * While a phone bottom sheet is open, keep the row it's editing in view just
 * above it — the way iOS scrolls the edited cell clear of a keyboard or
 * picker. Scrolls the page only when the row would be covered, and pads the
 * page's foot for as long as the sheet is open when there isn't enough page
 * below to scroll it up far enough. A popover (desktop) is left alone.
 */
export function useRevealAboveSheet(open: boolean, anchorRef: RefObject<HTMLElement>, sheetRef: RefObject<HTMLElement>) {
  useEffect(() => {
    if (!open) return;
    let padded = false;
    const frame = requestAnimationFrame(() => {
      const sheet = sheetRef.current;
      const anchor = anchorRef.current;
      if (!sheet || !anchor) return;
      // a fixed sheet's offsetTop ignores the slide-in transform, so this is
      // where its top edge comes to rest
      const sheetTop = sheet.offsetTop;
      const row = anchor.closest("li") ?? anchor;
      const r = row.getBoundingClientRect();
      // never so far that the row's top slides under the nav bar
      const barBottom = document.querySelector("header")?.getBoundingClientRect().bottom ?? 0;
      const by = Math.min(r.bottom + GAP - sheetTop, r.top - barBottom - GAP);
      if (by < 1) return;
      const room = document.documentElement.scrollHeight - window.innerHeight - window.scrollY;
      if (room < by) {
        document.body.style.paddingBottom = `${by - room}px`;
        padded = true;
      }
      window.scrollBy({ top: by, behavior: "smooth" });
    });
    return () => {
      cancelAnimationFrame(frame);
      if (padded) document.body.style.paddingBottom = "";
    };
  }, [open, anchorRef, sheetRef]);
}
