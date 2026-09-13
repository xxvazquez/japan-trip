import { useEffect, useState } from "react";
import { useApp } from "@/store/useApp";
import { pickBackend } from "@/lib/backend";
import { ActionSheet, useActionSheet } from "./ActionSheet";
import { Icon } from "./Icon";

function useOnline(): boolean {
  const [online, setOnline] = useState(() => navigator.onLine);
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);
  return online;
}

/**
 * A quiet header readout of whether inline edits have reached the server.
 * Signed-in path only — the local backend has no server to be behind, so this
 * renders nothing there. Genuinely offline (or a write that couldn't land)
 * stays up until it clears; "Saved" flashes for ~1.6s after a flush.
 */
export function SyncStatus() {
  const signedIn = pickBackend().kind === "supabase";
  const state = useApp((s) => s.syncState);
  const errorItems = useApp((s) => s.syncErrorItems);
  const retrySyncNow = useApp((s) => s.retrySyncNow);
  const discardSyncIssue = useApp((s) => s.discardSyncIssue);
  const online = useOnline();
  const [showSaved, setShowSaved] = useState(false);
  const { open, setOpen, anchorRef } = useActionSheet();

  useEffect(() => {
    if (state !== "saved") return setShowSaved(false);
    setShowSaved(true);
    const t = setTimeout(() => setShowSaved(false), 1600);
    return () => clearTimeout(t);
  }, [state]);

  if (!signedIn) return null;

  const label = !online ? "Offline"
    : state === "error" ? "Couldn't save — retrying"
    : state === "saving" ? "Saving…"
    : showSaved ? "Saved"
    : null;

  if (!label) return null;

  const tone = !online || state === "error" ? "bg-gold"
    : state === "saving" ? "animate-pulse bg-ink-faint"
    : "bg-matcha";

  const dot = (
    <span className="flex items-center gap-1.5 text-2xs text-ink-soft" role="status">
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${tone}`} />
      {label}
    </span>
  );

  if (state !== "error" || !errorItems.length) return dot;

  return (
    <>
      <button
        ref={anchorRef}
        onClick={() => setOpen(true)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="relative before:absolute before:-inset-2 before:content-['']"
      >
        {dot}
      </button>
      <ActionSheet open={open} onClose={() => setOpen(false)} anchorRef={anchorRef} title="Not saved yet">
        {errorItems.map((item) =>
          item.type && item.id ? (
            <button
              key={item.key}
              type="button"
              onClick={() => discardSyncIssue(item.key)}
              className="menu-item justify-between text-danger"
            >
              <span className="min-w-0 truncate">{item.label}</span>
              <Icon name="trash" size={14} className="shrink-0" />
            </button>
          ) : (
            <div key={item.key} className="menu-item text-ink">{item.label}</div>
          ),
        )}
        <button type="button" onClick={() => retrySyncNow()} className="menu-item font-medium text-accent">
          Retry now
        </button>
      </ActionSheet>
    </>
  );
}
