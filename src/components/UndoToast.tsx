import { useEffect } from "react";
import { useApp } from "@/store/useApp";

const SHOW_MS = 8000;

/**
 * The "Day deleted · Undo" bar. Shows after any delete that went through
 * `undoable` in the store and puts the deleted rows back on tap; goes away on
 * its own after a few seconds, and a newer delete replaces it. Sits above the
 * phone's tab bar, and centred in the content beside the desktop rail.
 */
export function UndoToast({ besidePane }: { besidePane?: boolean }) {
  const toast = useApp((s) => s.undoToast);
  const undo = useApp((s) => s.undo);
  const dismiss = useApp((s) => s.dismissUndo);

  // the countdown only runs while the app is on screen: a delete followed
  // by a switch to another app still has its Undo waiting on the way back
  useEffect(() => {
    if (!toast) return;
    let left = SHOW_MS;
    let started = Date.now();
    let t: ReturnType<typeof setTimeout> | undefined;
    const run = () => { started = Date.now(); t = setTimeout(dismiss, left); };
    const onVisibility = () => {
      if (document.hidden) { clearTimeout(t); left -= Date.now() - started; }
      else run();
    };
    if (!document.hidden) run();
    document.addEventListener("visibilitychange", onVisibility);
    return () => { clearTimeout(t); document.removeEventListener("visibilitychange", onVisibility); };
  }, [toast?.key, dismiss]);

  if (!toast) return null;
  return (
    <div className={`pointer-events-none fixed inset-x-0 bottom-[var(--tabbar-clear)] z-[60] flex justify-center px-4 md:bottom-6 md:pl-[72px] ${besidePane ? "pr-[calc(var(--pane-w)+1rem)]" : ""}`}>
      <div
        role="status"
        className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-[12px] bg-ink py-2.5 pl-4 pr-2 text-sm text-bg shadow-md motion-safe:animate-fade-in"
      >
        <span className="min-w-0 flex-1 break-words">{toast.label}</span>
        <button
          type="button"
          onClick={undo}
          className="shrink-0 rounded-[8px] px-3 py-1.5 text-sm font-medium underline-offset-2 active:opacity-70"
        >
          Undo
        </button>
      </div>
    </div>
  );
}
