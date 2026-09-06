import { useEffect, useState } from "react";
import { useApp } from "@/store/useApp";

/**
 * A quiet header dot confirming inline edits reached the server. Signed-in path
 * only — local-only writes never leave `syncState: "idle"`, so this renders
 * nothing. "Saved" shows for ~1.6s after a flush, then clears.
 */
export function SyncStatus() {
  const state = useApp((s) => s.syncState);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (state === "idle") return setVisible(false);
    if (state === "saved") {
      setVisible(true);
      const t = setTimeout(() => setVisible(false), 1600);
      return () => clearTimeout(t);
    }
    setVisible(true); // saving | error
  }, [state]);

  if (!visible) return null;

  const label =
    state === "error" ? "Offline — edits will sync when you're back"
      : state === "saving" ? "Saving…"
      : "Saved";
  const tone =
    state === "error" ? "bg-gold"
      : state === "saving" ? "animate-pulse bg-ink-faint"
      : "bg-matcha";

  return (
    <span className="flex items-center" title={label} aria-label={label} role="status">
      <span className={`h-1.5 w-1.5 rounded-full ${tone}`} />
    </span>
  );
}
