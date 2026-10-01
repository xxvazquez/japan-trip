import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { search, type SearchHit, type SearchKind } from "@/lib/search";
import { useData } from "@/lib/data";
import { useBackToClose } from "@/lib/backClose";
import { useApp } from "@/store/useApp";
import { Icon } from "./Icon";
import { IconTile } from "./IconTile";
import { TileRow } from "./TileRow";

/** the section header a hit is listed under — Logbook's own list names */
const GROUP_LABEL: Record<SearchKind, string> = {
  day: "Days",
  leg: "Bases",
  hotel: "Stays",
  place: "Places",
  transfer: "Journeys",
  area: "Areas",
  luggage: "Luggage",
  doc: "Documents",
  packing: "Packing",
  list: "Lists",
  note: "Scratchpad",
};

/** A transfer's chip is its kind (Train, Flight) — a detail under its own
 *  "Journeys" header; any other chip names the list it sits in. */
function groupOf(hit: SearchHit): string {
  return hit.kind === "transfer" ? GROUP_LABEL.transfer : hit.chip ?? GROUP_LABEL[hit.kind];
}
function subOf(hit: SearchHit): string | undefined {
  return hit.kind === "transfer" && hit.chip ? [hit.chip, hit.sub].filter(Boolean).join(" · ") : hit.sub;
}

/* Recent searches, as iOS keeps them (Files, Maps, Settings): the words you
 * searched when you opened a result, newest first, per trip and per device. */
const RECENT_MAX = 8;
const recentKey = (tripId: string) => `za.recentSearches.${tripId}`;
function readRecents(tripId: string | null): string[] {
  if (!tripId) return [];
  try {
    const v = JSON.parse(localStorage.getItem(recentKey(tripId)) ?? "[]");
    return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}
function writeRecents(tripId: string | null, list: string[]) {
  if (!tripId) return;
  try {
    localStorage.setItem(recentKey(tripId), JSON.stringify(list));
  } catch {
    /* private window — recents just don't stick */
  }
}

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const data = useData();
  const tripId = useApp((st) => st.activeId);
  const [recents, setRecents] = useState<string[]>([]);
  const saveRecents = (list: string[]) => {
    setRecents(list);
    writeRecents(tripId, list);
  };

  // grouped by section, sections in order of their best hit; `results` is
  // the same hits flattened in display order, for arrow-key navigation
  const groups = useMemo(() => {
    const hits = open && data ? search(data, q, 60) : [];
    const by = new Map<string, SearchHit[]>();
    for (const h of hits) {
      const g = groupOf(h);
      by.set(g, [...(by.get(g) ?? []), h]);
    }
    return [...by.entries()];
  }, [q, open, data]);
  const results = useMemo(() => groups.flatMap(([, hits]) => hits), [groups]);

  useLayoutEffect(() => {
    if (!open) return;
    setQ("");
    setActive(0);
    setRecents(readRecents(tripId));
    // focus straight away, taking over from `primeKeyboard` (the opening
    // tap) so the iOS keyboard stays up
    inputRef.current?.focus({ preventScroll: true });
  }, [open, tripId]);
  useEffect(() => setActive(0), [q]);
  useBackToClose(open, onClose);

  if (!open) return null;

  const go = (hit: SearchHit) => {
    const words = q.trim();
    if (words) saveRecents([words, ...recents.filter((r) => r.toLowerCase() !== words.toLowerCase())].slice(0, RECENT_MAX));
    onClose();
    navigate(hit.to);
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") return onClose();
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    }
    if (e.key === "Enter" && results[active]) go(results[active]);
  };

  let n = 0;
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center bg-ink/40 md:px-4 md:pt-[8vh]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      <div
        className="flex h-[var(--vvh,100%)] w-full translate-y-[var(--vvt,0px)] flex-col bg-bg md:h-auto md:translate-y-0 md:border md:border-line md:shadow-xl md:max-h-[80dvh] md:max-w-reading md:overflow-hidden md:rounded-[18px] md:bg-bg motion-safe:animate-fade-up"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKey}
      >
        <div className="flex items-center gap-3 px-4 pb-2 pt-[calc(var(--sat)+0.75rem)] md:pt-3">
          <label className="flex min-w-0 flex-1 items-center gap-2 rounded-[10px] bg-ink/[0.07] px-2.5">
            <Icon name="search" size={17} className="shrink-0 text-ink-faint" />
            <input
              ref={inputRef}
              type="search"
              enterKeyHint="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search your trip"
              className="w-full min-w-0 bg-transparent py-2 text-sm outline-none placeholder:text-ink-faint [&::-webkit-search-cancel-button]:hidden"
              autoComplete="off"
              spellCheck={false}
            />
            {q && (
              <button type="button" onClick={() => { setQ(""); inputRef.current?.focus(); }} className="tap shrink-0 text-ink-faint">
                <Icon name="close" size={15} />
                <span className="sr-only">Clear</span>
              </button>
            )}
          </label>
          <button type="button" onClick={onClose} className="shrink-0 whitespace-nowrap text-sm text-accent">
            Cancel
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-[calc(var(--sab)+1.5rem)] pt-2 md:pb-4">
          {!q && recents.length > 0 && (
            <section>
              <div className="mb-1.5 flex items-baseline justify-between gap-3 px-1">
                <h2 className="kicker">Recent searches</h2>
                <button type="button" onClick={() => saveRecents([])} className="tap text-xs text-accent">
                  Clear
                </button>
              </div>
              <ul className="overflow-hidden rounded-[12px] border border-line bg-surface dark:border-ink/10">
                {recents.map((r) => (
                  <TileRow
                    key={r}
                    tile={<Icon name="search" size={17} className="w-[22px] shrink-0 text-ink-faint" />}
                    title={r}
                    chevron={false}
                    onClick={() => { setQ(r); inputRef.current?.focus(); }}
                    className="hover:bg-ink/[0.04]"
                  />
                ))}
              </ul>
            </section>
          )}
          {!q && recents.length === 0 && <p className="meta px-1 py-3">Search places, stays, days, documents and lists.</p>}
          {q && results.length === 0 && (
            <div className="px-6 pt-16 text-center">
              <p className="text-lg text-ink">No Results</p>
              <p className="meta mt-1 break-words">for “{q.trim()}”</p>
            </div>
          )}
          <div className="space-y-6">
            {groups.map(([group, hits]) => (
              <section key={group}>
                <h2 className="kicker mb-1.5 break-words px-1">{group}</h2>
                <ul className="overflow-hidden rounded-[12px] border border-line bg-surface dark:border-ink/10">
                  {hits.map((hit) => {
                    const i = n++;
                    return (
                      <TileRow
                        key={hit.to + hit.label}
                        tile={<IconTile size="sm" {...hit.tile} />}
                        title={hit.label}
                        meta={subOf(hit)}
                        onClick={() => go(hit)}
                        className={`hover:bg-ink/[0.04] ${i === active ? "md:bg-ink/[0.05]" : ""}`}
                      />
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
