import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useParams } from "react-router-dom";
import { Icon } from "./Icon";
import { ActionSheet, useActionSheet } from "./ActionSheet";
import { GuideContentsButton } from "./GuideContents";
import { setRead, setSaved, useReadSet, useSaved, type SavedEntry } from "@/lib/guideReading";

/** The reader's tools on a guide article, kept per device: save it, share
 *  it, mark it read. Bookmark, Share and a ⋯ menu sit in the navigation
 *  bar, the way Apple News and Books put them. Reading to the end marks an
 *  article read by itself, as Books keeps your place without being told;
 *  the ⋯ menu (and a row's long-press) is where you change it by hand, as
 *  Podcasts keeps Mark as Played in its menu. */

/** Contents, Bookmark and Share — a glass capsule in the nav bar's `#nav-actions`
 *  slot, beside the account button. */
export function ReadingActions({ entry }: { entry: SavedEntry }) {
  const { guide } = useParams();
  const saved = useSaved(guide).some((e) => e.to === entry.to);
  const read = useReadSet(guide).has(entry.to);
  const more = useActionSheet();
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
      <GuideContentsButton inline />
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
      <button ref={more.anchorRef} type="button" className={btn} aria-label="More" aria-haspopup="menu" aria-expanded={more.open} onClick={() => more.setOpen(true)}>
        <Icon name="more" size={20} />
      </button>
      <ActionSheet open={more.open} onClose={() => more.setOpen(false)} anchorRef={more.anchorRef}>
        <ReadMenuItem guide={guide} path={entry.to} read={read} />
      </ActionSheet>
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

/** Mark as Read / Mark as Unread, for a ⋯ menu or a row's long-press —
 *  Mail's and Podcasts' wording. */
export function ReadMenuItem({ guide, path, read }: { guide: string; path: string; read: boolean }) {
  return (
    <button type="button" className="menu-item" onClick={() => setRead(guide, path, !read)}>
      <Icon name="check-circle" size={18} filled={!read} className={read ? "text-ink-faint" : "text-matcha"} />
      {read ? "Mark as Unread" : "Mark as Read"}
    </button>
  );
}

/** Marks the article read once its end has been on screen for a moment —
 *  reading to the bottom is finishing it, as in Books. Put it after the
 *  article's text. It acts once per visit, so marking the article unread
 *  from the ⋯ menu while still on it sticks. */
export function ReadWhenFinished({ path }: { path: string }) {
  const { guide } = useParams();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !guide) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const io = new IntersectionObserver(([e]) => {
      clearTimeout(timer);
      if (!e.isIntersecting) return;
      timer = setTimeout(() => {
        setRead(guide, path, true);
        io.disconnect();
      }, 1200);
    });
    io.observe(el);
    return () => {
      clearTimeout(timer);
      io.disconnect();
    };
  }, [guide, path]);
  return <div ref={ref} aria-hidden className="h-px" />;
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
