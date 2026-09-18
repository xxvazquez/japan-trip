import { useEffect, useLayoutEffect, useRef, type KeyboardEvent, type RefObject } from "react";
import { createPortal } from "react-dom";

const HOURS = Array.from({ length: 24 }, (_, h) => String(h).padStart(2, "0"));
const MINUTES = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, "0"));

const ITEM_H = 44;
const VISIBLE_ROWS = 5;
const WHEEL_H = ITEM_H * VISIBLE_ROWS;
const PAD = (WHEEL_H - ITEM_H) / 2;

const isNarrow = () =>
  typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches;

/** One spinning column (hour or minute) — scroll-snap drives the wheel feel,
 *  a short settle timer (not every scroll tick) is what actually commits a
 *  value, so a fast flick doesn't fire dozens of intermediate `onChange`s. */
function WheelColumn({ options, value, onChange, ariaLabel }: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  ariaLabel: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const settleTimer = useRef<number>();

  // snap to the current value whenever it changes from outside (opening the
  // sheet, or the other wheel defaulting this one to "00") — scrolling is
  // what drives `onChange` in the first place, so this must never fight it
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.scrollTop = Math.max(0, options.indexOf(value)) * ITEM_H;
  }, [value, options]);

  const jump = (i: number) => ref.current?.scrollTo({ top: i * ITEM_H, behavior: "smooth" });

  const handleScroll = () => {
    window.clearTimeout(settleTimer.current);
    settleTimer.current = window.setTimeout(() => {
      const el = ref.current;
      if (!el) return;
      const i = Math.min(Math.max(Math.round(el.scrollTop / ITEM_H), 0), options.length - 1);
      jump(i);
      const v = options[i];
      if (v !== value) onChange(v);
    }, 110);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const i = Math.max(0, options.indexOf(value));
    if (e.key === "ArrowUp" && i > 0) { e.preventDefault(); jump(i - 1); onChange(options[i - 1]); }
    if (e.key === "ArrowDown" && i < options.length - 1) { e.preventDefault(); jump(i + 1); onChange(options[i + 1]); }
  };

  return (
    <div
      ref={ref}
      onScroll={handleScroll}
      onKeyDown={onKeyDown}
      tabIndex={0}
      role="listbox"
      aria-label={ariaLabel}
      className="wheel-col relative h-[220px] w-14 snap-y snap-mandatory overflow-y-scroll focus:outline-none"
      style={{ paddingTop: PAD, paddingBottom: PAD }}
    >
      {options.map((o) => (
        <div
          key={o}
          role="option"
          aria-selected={o === value}
          onClick={() => { jump(options.indexOf(o)); onChange(o); }}
          className="flex h-11 snap-center cursor-pointer items-center justify-center text-[22px] tabular-nums text-ink"
        >
          {o}
        </div>
      ))}
    </div>
  );
}

/** The iOS-style scroll-wheel time picker: a bottom sheet on phone widths, a
 *  small anchored popover on wider ones — the same narrow/wide split as
 *  `ActionSheet`, but not built on it, since a wheel needs to stay open
 *  through a scroll or a tap, where `ActionSheet` closes on any click inside
 *  it. Values commit live as each wheel settles; "Done" just dismisses. */
export function TimeWheelSheet({ open, onClose, anchorRef, hour, minute, onPick, onClear }: {
  open: boolean;
  onClose: () => void;
  anchorRef: RefObject<HTMLElement>;
  hour: string;
  minute: string;
  onPick: (h: string, m: string) => void;
  onClear: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: globalThis.KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const h = hour || "00";
  const m = minute || "00";
  const wheels = (
    <div className="relative flex items-center justify-center gap-1">
      <span aria-hidden className="pointer-events-none absolute inset-x-2 top-1/2 h-11 -translate-y-1/2 rounded-[10px] bg-surface-2" />
      <WheelColumn options={HOURS} value={h} onChange={(v) => onPick(v, m)} ariaLabel="Hour" />
      <span aria-hidden className="text-[22px] text-ink-faint">:</span>
      <WheelColumn options={MINUTES} value={m} onChange={(v) => onPick(h, v)} ariaLabel="Minute" />
    </div>
  );

  if (isNarrow()) {
    return createPortal(
      <>
        <div className="fixed inset-0 z-50 bg-black/40 motion-safe:animate-fade-in" onClick={onClose} />
        <div className="fixed inset-x-0 bottom-0 z-[55] flex flex-col rounded-t-[16px] border-t border-line bg-surface pb-[max(0.75rem,var(--sab))] pt-2 motion-safe:animate-sheet-up">
          <span aria-hidden className="mx-auto mb-1.5 block h-1 w-9 shrink-0 rounded-full bg-ink/20" />
          <div className="flex items-center justify-between px-4 pb-2">
            <button type="button" onClick={onClear} className="text-[15px] text-danger">Clear</button>
            <button type="button" onClick={onClose} className="text-[15px] font-medium text-accent">Done</button>
          </div>
          <div className="pb-2">{wheels}</div>
        </div>
      </>,
      document.body,
    );
  }

  const r = anchorRef.current?.getBoundingClientRect();
  const left = Math.min(Math.max(r?.left ?? 0, 8), window.innerWidth - 200);
  return createPortal(
    <>
      <div className="fixed inset-0 z-50" onClick={onClose} />
      <div
        style={{ top: (r?.bottom ?? 0) + 4, left }}
        className="fixed z-[55] flex flex-col rounded-[12px] border border-line bg-surface p-2 shadow-md motion-safe:animate-fade-in"
      >
        {wheels}
        <div className="flex items-center justify-between px-1 pt-1">
          <button type="button" onClick={onClear} className="text-xs text-danger">Clear</button>
          <button type="button" onClick={onClose} className="text-xs font-medium text-accent">Done</button>
        </div>
      </div>
    </>,
    document.body,
  );
}
