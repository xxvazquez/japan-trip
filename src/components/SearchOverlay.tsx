import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { search, type SearchHit, type SearchKind } from "@/lib/search";
import { useData } from "@/lib/data";
import { Icon } from "./Icon";

const KIND_LABEL: Record<SearchKind, string> = {
  day: "Day",
  "day-trip": "Day trip",
  hotel: "Stay",
  transfer: "Transfer",
  collection: "Collection",
  place: "Place",
  station: "Station",
};

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const data = useData();

  const results = useMemo(() => (open && data ? search(data, q) : []), [q, open, data]);

  useEffect(() => {
    if (!open) return;
    setQ("");
    setActive(0);
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [open]);
  useEffect(() => setActive(0), [q]);

  if (!open) return null;

  const go = (hit: SearchHit) => {
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

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center bg-ai/30 px-4 pt-[10vh] backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      <div
        className="flex w-full max-w-reading flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl motion-safe:animate-fade-up"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKey}
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Icon name="search" size={20} className="shrink-0 text-ink-faint" />
          <input
            ref={inputRef}
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Places, stations, days, day trips, collections…"
            className="w-full bg-transparent py-4 text-base outline-none placeholder:text-ink-faint"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="hidden rounded border border-line px-1.5 py-0.5 text-2xs text-ink-faint sm:block">esc</kbd>
        </div>

        {q && results.length === 0 && <p className="px-4 py-6 text-sm text-ink-faint">No matches for “{q}”.</p>}

        {results.length > 0 && (
          <ul className="max-h-[52vh] overflow-y-auto py-1">
            {results.map((hit, i) => (
              <li key={hit.to + hit.label}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(hit)}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-left ${i === active ? "bg-surface-2" : ""}`}
                >
                  <span className="w-16 shrink-0 text-2xs uppercase tracking-wide text-ink-faint">{KIND_LABEL[hit.kind]}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[0.95rem]">{hit.label}</span>
                    {hit.sub && <span className="block truncate text-xs text-ink-faint">{hit.sub}</span>}
                  </span>
                  <Icon name="chevron" size={15} className="shrink-0 text-ink-faint" />
                </button>
              </li>
            ))}
          </ul>
        )}

        {!q && <p className="px-4 py-5 text-sm text-ink-faint">Try a place, a day trip, or a date like “5 Nov”.</p>}
      </div>
    </div>
  );
}
