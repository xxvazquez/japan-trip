import { useEffect, useLayoutEffect, useRef, type KeyboardEvent, type RefObject } from "react";
import { createPortal } from "react-dom";
import { useSheetDrag } from "./useSheetDrag";
import { SegmentedControl } from "./SegmentedControl";

/* The pickers work on a 12-hour dial plus AM/PM, the way a clock (and the iOS
 * wheel) reads; the stored value stays 24-hour "HH:MM". */
const WHEEL_HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1));
// clock face order — 12 at the top, then round
const FACE_HOURS = ["12", ...WHEEL_HOURS.slice(0, 11)];
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

/** One ring of a clock face (hour or minute). Clicking — or dragging — anywhere
 *  on the face picks the nearest value by angle, so the minute face can land on
 *  any minute (37, 52…) while only every `labelEvery`th value is labelled, the
 *  way a real clock only numbers the fives. The labels stay buttons for
 *  keyboard use. A short accent hand points at the current value, and a
 *  value between labels gets its own dot on the ring. */
function ClockRing({ options, value, onChange, ariaLabel, size, labelEvery = 1 }: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  ariaLabel: string;
  size: number;
  labelEvery?: number;
}) {
  const cx = size / 2, cy = size / 2;
  const r = size / 2 - 15;
  const i = options.indexOf(value);
  const angle = (n: number) => (n / options.length) * 2 * Math.PI - Math.PI / 2;
  const pick = (e: React.PointerEvent<HTMLDivElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    const a = Math.atan2(e.clientY - box.top - cy, e.clientX - box.left - cx) + Math.PI / 2;
    const n = Math.round(((a + 2 * Math.PI) % (2 * Math.PI)) / (2 * Math.PI) * options.length) % options.length;
    if (options[n] !== value) onChange(options[n]);
  };
  return (
    <div
      role="listbox"
      aria-label={ariaLabel}
      onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); pick(e); }}
      onPointerMove={(e) => e.buttons === 1 && pick(e)}
      className="relative shrink-0 cursor-pointer touch-none select-none"
      style={{ width: size, height: size }}
    >
      <div aria-hidden className="absolute inset-0 rounded-full border border-line" />
      {i >= 0 && (
        <svg aria-hidden className="pointer-events-none absolute inset-0" width={size} height={size}>
          <line
            x1={cx} y1={cy}
            x2={cx + (r - 6) * 0.6 * Math.cos(angle(i))} y2={cy + (r - 6) * 0.6 * Math.sin(angle(i))}
            className="stroke-accent" strokeWidth={2} strokeLinecap="round"
          />
          {labelEvery > 1 && options.map((_, n) => n % labelEvery !== 0 && (
            <line
              key={n}
              x1={cx + (r - 3) * Math.cos(angle(n))} y1={cy + (r - 3) * Math.sin(angle(n))}
              x2={cx + (r + 3) * Math.cos(angle(n))} y2={cy + (r + 3) * Math.sin(angle(n))}
              className="stroke-ink-faint" strokeWidth={1} strokeLinecap="round"
            />
          ))}
          {i % labelEvery !== 0 && (
            <circle cx={cx + r * Math.cos(angle(i))} cy={cy + r * Math.sin(angle(i))} r={5} className="fill-accent" />
          )}
        </svg>
      )}
      <div aria-hidden className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" />
      {options.map((o, n) => {
        if (n % labelEvery !== 0) return null;
        const active = o === value;
        return (
          <button
            key={o}
            type="button"
            role="option"
            aria-selected={active}
            // a pointer already picked by angle on pointerdown — only a
            // keyboard press (detail 0) should pick the label itself, or a
            // click just beside "25" would snap 27 back to 25
            onClick={(e) => e.detail === 0 && onChange(o)}
            style={{ left: cx + r * Math.cos(angle(n)), top: cy + r * Math.sin(angle(n)) }}
            className={`absolute flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[10px] tabular-nums transition-colors ${
              active ? "bg-accent text-white" : "text-ink-soft hover:bg-surface-2"
            }`}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

/** The clock-face pair behind the desktop popover — click a position on each
 *  ring instead of scrolling a column: a 12-hour face with AM/PM beside the
 *  readout, and every minute on the minute face. */
function ClockPicker({ hour, minute, onPick }: { hour: string; minute: string; onPick: (h: string, m: string) => void }) {
  const size = 168;
  const period = periodOf(hour);
  return (
    <div className="flex flex-col items-center gap-2 p-2">
      <div className="flex items-center gap-3">
        <span className="text-[22px] font-medium tabular-nums text-ink">{to12(hour)}:{minute}</span>
        <SegmentedControl
          className="w-[6.5rem]"
          value={period}
          onChange={(p) => onPick(to24(to12(hour), p), minute)}
          options={PERIODS.map((p) => ({ value: p, label: p }))}
        />
      </div>
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center gap-1">
          <ClockRing options={FACE_HOURS} value={to12(hour)} onChange={(v) => onPick(to24(v, period), minute)} ariaLabel="Hour" size={size} />
          <span className="kicker text-ink-faint">Hour</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <ClockRing options={MINUTES} labelEvery={5} value={minute} onChange={(v) => onPick(hour, v)} ariaLabel="Minute" size={size} />
          <span className="kicker text-ink-faint">Minute</span>
        </div>
      </div>
    </div>
  );
}

/** The iOS-style scroll-wheel time picker: a bottom sheet on phone widths, a
 *  small anchored popover on wider ones — the same narrow/wide split as
 *  `ActionSheet`, but not built on it, since a wheel needs to stay open
 *  through a scroll or a tap, where `ActionSheet` closes on any click inside
 *  it. Values commit live as each wheel settles; "Done" just dismisses. The
 *  wide popover swaps the wheel for a clickable clock face (`ClockPicker`) —
 *  a mouse picks a position in one click far faster than scrolling 12 hours
 *  or 60 minutes; touch keeps the familiar wheel. */
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
        <ClockPicker hour={h} minute={m} onPick={onPick} />
        <div className="flex items-center justify-between px-2 pb-1">
          <button type="button" onClick={onClear} className="text-xs text-danger">Clear</button>
          <button type="button" onClick={onClose} className="text-xs font-medium text-accent">Done</button>
        </div>
      </div>
    </>,
    document.body,
  );
}
