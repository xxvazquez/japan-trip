import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useParams } from "react-router-dom";
import { Icon } from "./Icon";
import { setRead, setSaved, useReadSet, useSaved, type SavedEntry } from "@/lib/guideReading";

/** The reader's tools on a guide article, kept per device: save it, share
 *  it, mark it read. Bookmark and Share sit in the navigation bar, the way
 *  Apple News and Books put them; Mark as Read waits at the foot of the
 *  read, where you finish it. */

/** Bookmark and Share — a glass capsule in the nav bar's `#nav-actions`
 *  slot, beside the account button. */
export function ReadingActions({ entry }: { entry: SavedEntry }) {
  const { guide } = useParams();
  const saved = useSaved(guide).some((e) => e.to === entry.to);
  const [slot, setSlot] = useState<HTMLElement | null>(null);
  const [copied, setCopied] = useState(false);
  useEffect(() => setSlot(document.getElementById("nav-actions")), []);
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(t);
  }, [copied]);

  const share = async () => {
    const url = new URL(entry.to, window.location.origin).href;
    // the system share sheet where there is one (iPhone, Android); a copied
    // link on desktop Chrome, which has none
    if (navigator.share) {
      try {
        await navigator.share({ title: entry.title, url });
      } catch {
        /* dismissed */
      }
      return;
    }
    setCopied(await copy(url));
  };

  if (!slot || !guide) return null;
  const btn = "grid h-10 w-10 place-items-center rounded-full transition-colors hover:text-accent";
  return createPortal(
    <div className="glass flex h-11 items-center rounded-full px-0.5 text-ink">
      <button
        type="button"
        className={btn}
        aria-pressed={saved}
        aria-label={saved ? "Remove bookmark" : "Bookmark"}
        onClick={() => setSaved(guide, entry, !saved)}
      >
        <Icon name="bookmark" size={20} filled={saved} className={saved ? "text-accent" : undefined} />
      </button>
      <button type="button" className={btn} aria-label={copied ? "Link copied" : "Share"} onClick={share}>
        <Icon name={copied ? "check" : "share"} size={20} className={copied ? "text-matcha" : undefined} />
      </button>
    </div>,
    slot,
  );
}

/** copy text to the clipboard — the async API first, then the old
 *  selection copy, which still works where the API is refused */
async function copy(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const el = document.createElement("textarea");
    el.value = text;
    el.setAttribute("readonly", "");
    el.style.cssText = "position:fixed;opacity:0";
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand("copy");
    el.remove();
    return ok;
  }
}

/** "Mark as Read" at the foot of an article — one tap, and a tap again
 *  takes it back, as Mail's Mark as Unread does. */
export function MarkRead({ path }: { path: string }) {
  const { guide } = useParams();
  const read = useReadSet(guide).has(path);
  if (!guide) return null;
  return (
    <button
      type="button"
      aria-pressed={read}
      onClick={() => setRead(guide, path, !read)}
      className="flex w-full items-center gap-3 rounded-[12px] bg-surface px-3.5 py-3 text-left transition-colors active:bg-ink/[0.07]"
    >
      <Icon name="check-circle" size={24} filled={read} className={`shrink-0 transition-colors ${read ? "text-matcha" : "text-ink-faint"}`} />
      <span className="min-w-0 flex-1">
        <span className={`block text-[17px] leading-snug ${read ? "text-ink" : "text-accent"}`}>{read ? "Read" : "Mark as Read"}</span>
        {read && <span className="block text-[13px] text-ink-faint">Tap to mark as unread</span>}
      </span>
    </button>
  );
}

/** a small filled tick for a row that's been read */
export function ReadTick({ to }: { to: string }) {
  const { guide } = useParams();
  if (!useReadSet(guide).has(to)) return null;
  return <Icon name="check-circle" size={17} filled className="shrink-0 text-matcha" />;
}

/** "3 of 8 read" — how far through a list of articles this reader is */
export function useProgress(paths: string[]): { done: number; total: number } {
  const { guide } = useParams();
  const read = useReadSet(guide);
  return { done: paths.filter((p) => read.has(p)).length, total: paths.length };
}
