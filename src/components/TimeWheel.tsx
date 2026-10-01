import { useEffect, useLayoutEffect, useRef, type KeyboardEvent, type RefObject } from "react";
import { createPortal } from "react-dom";
import { useSheetDrag } from "./useSheetDrag";

/* The pickers work on a 12-hour dial plus AM/PM, the way a clock (and the iOS
 * wheel) reads; the stored value stays 24-hour "HH:MM". */
const WHEEL_HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1));
const PERIODS = ["AM", "PM"] as const;
type Period = (typeof PERIODS)[number];
const to12 = (h24: string) => String(Number(h24) % 12 || 12);
const periodOf = (h24: string): Period => (Number(h24) < 12 ? "AM" : "PM");
const to24 = (h12: string, p: Period) =>
  String((Number(h12) % 12) + (p === "PM" ? 12 : 0)).padStart(2, "0");
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

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
 *  it. Both show the same wheels (scroll, click a row, or arrow keys); values
 *  commit live as each wheel settles, "Done" just dismisses. */
export function TimeWheelSheet({ open, onClose, anchorRef, hour, minute, onPick, onClear }: {
  open: boolean;
  onClose: () => void;
  anchorRef: RefObject<HTMLElement>;
  hour: string;
  minute: string;
  onPick: (h: string, m: string) => void;
  onClear: () => void;
}) {
  const { sheetRef, handleProps } = useSheetDrag(onClose);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: globalThis.KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Place the desktop popover from its measured size: below the field when it
  // fits, else above it, always kept inside the viewport.
  const popRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const pop = popRef.current;
    if (!open || !pop) return;
    const r = anchorRef.current?.getBoundingClientRect();
    const { width, height } = pop.getBoundingClientRect();
    const m = 8;
    const below = (r?.bottom ?? 0) + 4;
    const above = (r?.top ?? 0) - 4 - height;
    const top = below + height <= window.innerHeight - m || above < m ? below : above;
    pop.style.top = `${Math.max(m, Math.min(top, window.innerHeight - m - height))}px`;
    pop.style.left = `${Math.max(m, Math.min(r?.left ?? 0, window.innerWidth - m - width))}px`;
    pop.style.visibility = "visible";
  }, [open, anchorRef]);

  if (!open) return null;

  const h = hour || "00";
  const m = minute || "00";
  const wheels = (
    <div className="relative flex items-center justify-center gap-1">
      <span aria-hidden className="pointer-events-none absolute inset-x-2 top-1/2 h-11 -translate-y-1/2 rounded-[10px] bg-surface-2" />
      <WheelColumn options={WHEEL_HOURS} value={to12(h)} onChange={(v) => onPick(to24(v, periodOf(h)), m)} ariaLabel="Hour" />
      <span aria-hidden className="text-[22px] text-ink-faint">:</span>
      <WheelColumn options={MINUTES} value={m} onChange={(v) => onPick(h, v)} ariaLabel="Minute" />
      <WheelColumn options={[...PERIODS]} value={periodOf(h)} onChange={(p) => onPick(to24(to12(h), p as Period), m)} ariaLabel="AM or PM" />
    </div>
  );

  if (isNarrow()) {
    return createPortal(
      <>
        <div className="fixed inset-0 z-50 bg-black/25 motion-safe:animate-fade-in" onClick={onClose} />
        <div ref={sheetRef} className="sheet-float glass-panel z-[55] flex flex-col pb-2 pt-2 motion-safe:animate-sheet-up">
          <div {...handleProps} className="shrink-0 cursor-grab touch-none pb-1">
            <span aria-hidden className="mx-auto mb-1.5 block h-1 w-9 rounded-full bg-ink/20" />
          </div>
          <div className="flex items-center justify-between px-4 pb-2">
            <button type="button" onClick={onClear} className="text-[17px] text-danger">Clear</button>
            <button type="button" onClick={onClose} className="text-[17px] font-medium text-accent">Done</button>
          </div>
          <div className="pb-2">{wheels}</div>
        </div>
      </>,
      document.body,
    );
  }

  return createPortal(
    <>
      <div className="fixed inset-0 z-50" onClick={onClose} />
      <div
        ref={popRef}
        style={{ top: 0, left: 0, visibility: "hidden" }}
        className="glass-panel fixed z-[55] flex flex-col rounded-[18px] p-2 motion-safe:animate-fade-in"
      >
        <div className="px-2 pt-1">{wheels}</div>
        <div className="flex items-center justify-between px-2 pb-1">
          <button type="button" onClick={onClear} className="text-xs text-danger">Clear</button>
          <button type="button" onClick={onClose} className="text-xs font-medium text-accent">Done</button>
        </div>
      </div>
    </>,
    document.body,
  );
}
