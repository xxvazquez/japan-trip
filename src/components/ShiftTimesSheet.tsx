import { useEffect, useState, type RefObject } from "react";
import type { Day } from "@/core/types";
import { ActionSheet } from "./ActionSheet";
import { SegmentedControl } from "./SegmentedControl";
import { WheelColumn } from "./TimeWheel";
import { Icon } from "./Icon";
import { shiftDay, type DayShift } from "@/lib/shiftTimes";
import { fmtClocksIn, fmtMinutes } from "@/lib/time";
import { plural } from "@/lib/dates";

const HOURS = Array.from({ length: 13 }, (_, i) => String(i));
const MINUTES = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, "0"));

/**
 * Moving a day's times in one go — a late start, a long lunch — instead of
 * re-timing every step by hand. Earlier / Later over a duration wheel, as
 * Clock's timer picks one; what it'll do reads under the wheels before the
 * Shift button commits it. From a step (`fromId`) only it and what follows
 * move; pinned steps keep their times.
 */
export function ShiftTimesSheet({ open, onClose, anchorRef, day, fromId, fromName, onShift }: {
  open: boolean;
  onClose: () => void;
  anchorRef: RefObject<HTMLElement>;
  day: Day;
  /** shift from this step on; the whole day without one */
  fromId?: string;
  fromName?: string;
  onShift: (patch: NonNullable<DayShift["patch"]>) => void;
}) {
  const [dir, setDir] = useState<"earlier" | "later">("later");
  const [h, setH] = useState("0");
  const [m, setM] = useState("15");
  // each opening starts from the usual nudge — a quarter of an hour later
  useEffect(() => {
    if (!open) return;
    setDir("later");
    setH("0");
    setM("15");
  }, [open]);

  const mins = +h * 60 + +m;
  const by = dir === "later" ? mins : -mins;
  const res = shiftDay(day, by, fromId);
  const ready = mins > 0 && !!res.patch;
  const amount = mins ? fmtMinutes(mins) : "";

  const summary = !mins
    ? "Pick how far to move the times."
    : res.outOfDay
      ? "That would move a time past midnight."
      : !res.patch
        ? "Nothing here has a time to move."
        : res.first
          ? `${plural(res.steps, "step")} · ${fmtClocksIn(res.first.from)} becomes ${fmtClocksIn(res.first.to)}`
          : "Moves the day’s times";

  return (
    <ActionSheet
      open={open}
      onClose={onClose}
      anchorRef={anchorRef}
      header={
        <div className="space-y-3 pt-1">
          <p className="text-center text-xs text-ink-soft">
            {fromId ? <>Shift <span className="text-ink">{fromName || "this step"}</span> and everything after it</> : "Shift every time in this day"}
          </p>
          <SegmentedControl
            options={[{ value: "earlier", label: "Earlier" }, { value: "later", label: "Later" }]}
            value={dir}
            onChange={setDir}
          />
          <div className="relative flex items-center justify-center">
            <span aria-hidden className="pointer-events-none absolute inset-x-2 top-1/2 h-11 -translate-y-1/2 rounded-[10px] bg-ink/[0.1]" />
            <WheelColumn options={HOURS} value={h} onChange={setH} ariaLabel="Hours" />
            <span className="w-14 text-[17px] text-ink">{h === "1" ? "hour" : "hours"}</span>
            <WheelColumn options={MINUTES} value={m} onChange={setM} ariaLabel="Minutes" />
            <span className="w-10 text-[17px] text-ink">min</span>
          </div>
          <p className={`text-center text-xs ${mins && res.outOfDay ? "text-danger" : "text-ink-soft"}`}>
            {summary}
            {ready && res.pinned > 0 && <span className="block">{res.pinned === 1 ? "The pinned step keeps its time." : "Pinned steps keep their times."}</span>}
          </p>
        </div>
      }
    >
      <button
        type="button"
        className="menu-item justify-center font-medium text-accent disabled:text-ink-faint"
        disabled={!ready}
        onClick={() => res.patch && onShift(res.patch)}
      >
        <Icon name="clock" size={16} /> {ready ? `Shift ${amount} ${dir === "later" ? "Later" : "Earlier"}` : "Shift"}
      </button>
    </ActionSheet>
  );
}
