import { useEffect, useRef } from "react";

/*
 * Back closes the open sheet first, the way Android's system back gesture
 * (and the browser's Back button) does in a native app — instead of leaving
 * the page underneath with the sheet still up.
 *
 * Opening a sheet pushes a same-URL history entry tagged with a marker;
 * Back pops it and the sheet closes. Closing the sheet any other way (a
 * tap, Escape, a drag) steps back over its entry so no dead step is left.
 * A sheet whose action navigated away leaves its entry under the new page —
 * an orphan, stepped over when Back reaches it.
 */

/** markers of the sheets open right now */
const live = new Set<string>();
/** a back() of ours is in flight; pushes wait for it to land */
let backPending = false;
const waiting: (() => void)[] = [];
/** order of opening, so Back landing on a lower entry closes only the
 *  sheets opened after it, never the one it belongs to */
let seq = 0;

function stepBack() {
  backPending = true;
  history.back();
}

if (typeof window !== "undefined") {
  window.addEventListener("popstate", () => {
    const m = history.state?.sheet;
    if (m && !live.has(m)) return stepBack();
    if (backPending) {
      backPending = false;
      waiting.splice(0).forEach((f) => f());
    }
  });
}

export function useBackToClose(open: boolean, onClose: () => void) {
  const close = useRef(onClose);
  close.current = onClose;

  useEffect(() => {
    if (!open) return;
    const marker = Math.random().toString(36).slice(2);
    const mySeq = ++seq;
    let pushed = false;
    let done = false;
    const onPop = () => {
      if (done || (history.state?.sheetSeq ?? 0) >= mySeq) return;
      done = true;
      close.current();
    };
    const push = () => {
      if (done) return;
      history.pushState({ ...history.state, sheet: marker, sheetSeq: mySeq }, "");
      live.add(marker);
      pushed = true;
      window.addEventListener("popstate", onPop);
    };
    if (backPending) waiting.push(push);
    else push();

    return () => {
      const wasOpen = pushed && !done;
      done = true;
      live.delete(marker);
      window.removeEventListener("popstate", onPop);
      // a tap inside the sheet may also navigate (the router pushes a tick
      // later) — wait for that, and only step back if still on our entry
      if (wasOpen) setTimeout(() => history.state?.sheet === marker && stepBack(), 0);
    };
  }, [open]);
}
