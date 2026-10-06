import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type RefObject } from "react";
import { createPortal } from "react-dom";
import { useSheetDrag } from "./useSheetDrag";
import { useRevealAboveSheet } from "./useRevealAboveSheet";
import { useBackToClose } from "@/lib/backClose";
import { Icon } from "./Icon";

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

type Seg = "h" | "m" | "p";
const SEGS: Seg[] = ["h", "m", "p"];

/** The desktop editor, after the Mac's own time field (Calendar, System
 *  Settings): the time as three segments — hour, minute, AM/PM — beside a
 *  small up/down stepper. Click a segment to select it, then step it with the
 *  stepper, the arrow keys or the scroll wheel (minutes in fives), or just
 *  type digits ("9", "37", "p"). A scroll wheel suits a touchscreen; a mouse and keyboard are
 *  faster at this. */
function TimeField({ hour, minute, onPick, onDone }: {
  hour: string;
  minute: string;
  onPick: (h: string, m: string) => void;
  onDone: () => void;
}) {
  const [seg, setSeg] = useState<Seg>("h");
  const ref = useRef<HTMLDivElement>(null);
  const typed = useRef({ seg: "h" as Seg, text: "", at: 0 });
  const wheelAcc = useRef(0);
  const h12 = Number(to12(hour));
  const period = periodOf(hour);

  // latest values for the native wheel listener below
  const live = useRef({ hour, minute, seg, onPick });
  live.current = { hour, minute, seg, onPick };

  const step = (s: Seg, d: number, cur = live.current) => {
    const h = Number(to12(cur.hour)), p = periodOf(cur.hour);
    const onPick = cur.onPick;
    if (s === "h") onPick(to24(String(((h - 1 + d + 1200) % 12) + 1), p), cur.minute);
    if (s === "m") {
      // steps land on the five-minute marks (32 → 35 / 30); typing stays exact
      const m = Number(cur.minute);
      const next = d > 0 ? Math.floor(m / 5) * 5 + 5 * d : Math.ceil(m / 5) * 5 + 5 * d;
      onPick(cur.hour, String((next + 6000) % 60).padStart(2, "0"));
    }
    if (s === "p") onPick(to24(String(h), p === "AM" ? "PM" : "AM"), cur.minute);
  };

  useEffect(() => {
    ref.current?.focus();
    const el = ref.current;
    if (!el) return;
    // React's onWheel is passive and can't stop the page scrolling behind
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      wheelAcc.current += e.deltaY;
      while (Math.abs(wheelAcc.current) >= 24) {
        const d = wheelAcc.current > 0 ? 1 : -1;
        wheelAcc.current -= d * 24;
        step(live.current.seg, -d);
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const move = (d: number) => setSeg(SEGS[Math.min(2, Math.max(0, SEGS.indexOf(seg) + d))]);

  const typeDigit = (n: number) => {
    const now = Date.now();
    const t = typed.current;
    const fresh = t.seg !== seg || now - t.at > 1200;
    const text = (fresh ? "" : t.text) + n;
    typed.current = { seg, text, at: now };
    if (seg === "h") {
      const v = Number(text);
      if (text.length === 2 && v >= 1 && v <= 12) { onPick(to24(String(v), period), minute); setSeg("m"); typed.current.text = ""; }
      else if (text.length === 2) { typed.current.text = String(n); if (n) onPick(to24(String(n), period), minute); if (n > 1) setSeg("m"); }
      else { if (n) onPick(to24(String(n), period), minute); if (n > 1) setSeg("m"); }
    } else if (seg === "m") {
      onPick(hour, text.padStart(2, "0").slice(-2));
      if (text.length === 2 || n > 5) { setSeg("p"); typed.current.text = ""; }
    }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const k = e.key;
    if (k === "ArrowUp" || k === "ArrowDown") { e.preventDefault(); step(seg, k === "ArrowUp" ? 1 : -1); }
    else if (k === "ArrowLeft") { e.preventDefault(); move(-1); }
    else if (k === "ArrowRight" || k === ":") { e.preventDefault(); move(1); }
    else if (k === "Tab" && !(e.shiftKey ? seg === "h" : seg === "p")) { e.preventDefault(); move(e.shiftKey ? -1 : 1); }
    else if (k === "Enter") { e.preventDefault(); onDone(); }
    else if (/^[0-9]$/.test(k)) { e.preventDefault(); typeDigit(Number(k)); }
    else if (/^[ap]$/i.test(k)) { e.preventDefault(); onPick(to24(String(h12), k.toLowerCase() === "a" ? "AM" : "PM"), minute); }
  };

  const segment = (s: Seg, text: string, label: string) => (
    <span
      role="spinbutton"
      aria-label={label}
      aria-valuetext={text}
      onPointerDown={(e) => { e.preventDefault(); ref.current?.focus(); if (s === seg && s === "p") step("p", 1); setSeg(s); }}
      className={`cursor-default rounded-[6px] px-1 tabular-nums transition-colors ${
        s === seg ? "bg-accent text-white dark:text-bg" : "hover:bg-ink/[0.06]"
      }`}
    >
      {text}
    </span>
  );

  return (
    <div className="flex items-center gap-2">
      <div
        ref={ref}
        tabIndex={0}
        onKeyDown={onKeyDown}
        aria-label="Time"
        className="flex select-none items-baseline rounded-[8px] bg-surface-2 px-1.5 py-1 text-[22px] text-ink focus:outline-none"
      >
        {segment("h", String(h12), "Hour")}
        <span aria-hidden className="px-px text-ink-faint">:</span>
        {segment("m", minute, "Minute")}
        <span className="w-1.5" />
        {segment("p", period, "AM or PM")}
      </div>
      <div className="flex flex-col overflow-hidden rounded-[7px] bg-surface-2">
        {[1, -1].map((d) => (
          <button
            key={d}
            type="button"
            tabIndex={-1}
            aria-label={d > 0 ? "Increase" : "Decrease"}
            onPointerDown={(e) => e.preventDefault()}
            onClick={() => step(seg, d)}
            className="flex h-[17px] w-6 items-center justify-center text-ink-soft hover:bg-ink/[0.06] active:bg-ink/[0.12]"
          >
            <Icon name="chevron" size={11} className={d > 0 ? "-rotate-90" : "rotate-90"} />
          </button>
        ))}
      </div>
    </div>
  );
}

/** The iOS-style scroll-wheel time picker: a bottom sheet on phone widths, a
 *  small anchored popover on wider ones — the same narrow/wide split as
 *  `ActionSheet`, but not built on it, since a wheel needs to stay open
 *  through a scroll or a tap, where `ActionSheet` closes on any click inside
 *  it. The phone gets wheels, the popover a Mac-style `TimeField`; values
 *  commit live as they change. With no time set yet the wheels show `hour` /
 *  `minute` as a starting point (`unset`), and "Done" saves that — what's on
 *  screen is what you get; otherwise "Done" just dismisses. */
export function TimeWheelSheet({ open, onClose, anchorRef, hour, minute, unset, onPick, onClear }: {
  open: boolean;
  onClose: () => void;
  anchorRef: RefObject<HTMLElement>;
  hour: string;
  minute: string;
  /** no time stored yet — `hour`/`minute` are only where the wheels start */
  unset?: boolean;
  onPick: (h: string, m: string) => void;
  onClear: () => void;
}) {
  const { sheetRef, handleProps } = useSheetDrag(onClose);
  useRevealAboveSheet(open, anchorRef, sheetRef);
  useBackToClose(open, onClose);
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
  const done = () => {
    if (unset) onPick(h, m);
    onClose();
  };
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
            <button type="button" onClick={done} className="text-[17px] font-medium text-accent">Done</button>
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
        className="glass-panel fixed z-[55] flex items-center gap-4 rounded-[14px] py-2 pl-2 pr-3 motion-safe:animate-fade-in"
      >
        <TimeField hour={h} minute={m} onPick={onPick} onDone={done} />
        <button type="button" onClick={onClear} className="text-xs text-danger">Clear</button>
        <button type="button" onClick={done} className="text-xs font-medium text-accent">Done</button>
      </div>
    </>,
    document.body,
  );
}
