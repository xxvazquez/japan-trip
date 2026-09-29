import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { fmtDate } from "@/lib/dates";
import type { Day } from "@/core/types";
import { Icon } from "./Icon";

/**
 * ‹ › in the navigation bar on a day's page — step to the day before or after
 * without going back to Plan, the way Calendar's day view pages through days.
 * A glass capsule beside the account button (portalled into the bar's
 * `#nav-actions` slot). ← / → do the same with a keyboard, unless you're
 * typing.
 */
export function DayStepper({ days, current, locale }: { days: Day[]; current: string; locale?: string }) {
  const go = useNavigate();
  const [slot, setSlot] = useState<HTMLElement | null>(null);
  useEffect(() => setSlot(document.getElementById("nav-actions")), []);

  const i = days.findIndex((d) => d.id === current);
  const prev = i > 0 ? days[i - 1] : undefined;
  const next = i >= 0 && i < days.length - 1 ? days[i + 1] : undefined;
  const label = (d: Day) => fmtDate(d.date, locale, { weekday: "short", day: "numeric", month: "short" });
  // replace, not push: stepping through a week shouldn't need seven Backs
  const open = (d?: Day) => d && go(`/day/${d.id}`, { replace: true });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (t instanceof Element && t.closest("input, textarea, select, [contenteditable=true], [role=dialog]")) return;
      if (e.key === "ArrowLeft" && prev) open(prev);
      if (e.key === "ArrowRight" && next) open(next);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (!slot || (!prev && !next)) return null;
  const btn = "grid h-10 w-10 place-items-center rounded-full transition-colors hover:text-accent disabled:opacity-30";
  return createPortal(
    <div className="glass flex h-11 items-center rounded-full px-0.5 text-ink">
      <button type="button" className={btn} disabled={!prev} onClick={() => open(prev)} aria-label={prev ? `Previous day, ${label(prev)}` : "No earlier day"}>
        <Icon name="back" size={20} />
      </button>
      <button type="button" className={btn} disabled={!next} onClick={() => open(next)} aria-label={next ? `Next day, ${label(next)}` : "No later day"}>
        <Icon name="chevron" size={20} />
      </button>
    </div>,
    slot,
  );
}
