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

/** One ring of a clock face (hour or minute) — every option gets its own
 *  absolutely-positioned tap target around the circle, so picking a time is
 *  a single click with a mouse instead of a scroll (the wheel columns stay
 *  the touch-first control on phone widths; this is the pointer-first one
 *  for the desktop popover). A short accent hand points at the current
 *  value, same look as `CheckCircle`'s filled ring for "selected". */
function ClockRing({ options, value, onChange, ariaLabel, size }: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  ariaLabel: string;
  size: number;
}) {
  const cx = size / 2, cy = size / 2;
  const r = size / 2 - 15;
  const i = options.indexOf(value);
  const angle = (n: number) => (n / options.length) * 2 * Math.PI - Math.PI / 2;
  return (
    <div role="listbox" aria-label={ariaLabel} className="relative shrink-0" style={{ width: size, height: size }}>
      <div aria-hidden className="absolute inset-0 rounded-full border border-line" />
      {i >= 0 && (
        <svg aria-hidden className="pointer-events-none absolute inset-0" width={size} height={size}>
          <line
            x1={cx} y1={cy}
            x2={cx + (r - 6) * 0.6 * Math.cos(angle(i))} y2={cy + (r - 6) * 0.6 * Math.sin(angle(i))}
            className="stroke-accent" strokeWidth={2} strokeLinecap="round"
          />
        </svg>
      )}
      <div aria-hidden className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" />
      {options.map((o, n) => {
        const active = o === value;
        return (
          <button
            key={o}
            type="button"
            role="option"
            aria-selected={active}
            onClick={() => onChange(o)}
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
 *  ring instead of scrolling a column. Same values/granularity as the wheel
 *  (24 hours, 5-minute steps), just a faster pick with a mouse. */
function ClockPicker({ hour, minute, onPick }: { hour: string; minute: string; onPick: (h: string, m: string) => void }) {
  const size = 168;
  return (
    <div className="flex flex-col items-center gap-2 p-2">
      <div className="text-[22px] font-medium tabular-nums text-ink">{hour}:{minute}</div>
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center gap-1">
          <ClockRing options={HOURS} value={hour} onChange={(v) => onPick(v, minute)} ariaLabel="Hour" size={size} />
          <span className="kicker text-ink-faint">Hour</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <ClockRing options={MINUTES} value={minute} onChange={(v) => onPick(hour, v)} ariaLabel="Minute" size={size} />
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
 *  a mouse picks a position in one click far faster than scrolling 24 hours
 *  or 12 five-minute steps; touch keeps the familiar wheel. */
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
  const left = Math.min(Math.max(r?.left ?? 0, 8), window.innerWidth - 380);
  return createPortal(
    <>
      <div className="fixed inset-0 z-50" onClick={onClose} />
      <div
        style={{ top: (r?.bottom ?? 0) + 4, left }}
        className="fixed z-[55] flex flex-col rounded-[12px] border border-line bg-surface p-2 shadow-md motion-safe:animate-fade-in"
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
