import { useEffect, useState, type RefObject } from "react";
import type { Day } from "@/core/types";
import { ActionSheet } from "./ActionSheet";
import { SegmentedControl } from "./SegmentedControl";
import { WheelColumn } from "./TimeWheel";
import { shiftDay, type DayShift } from "@/lib/shiftTimes";
import { fmtClocksIn } from "@/lib/time";
import { plural } from "@/lib/dates";

const HOURS = Array.from({ length: 13 }, (_, i) => String(i));
const MINUTES = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, "0"));

/**
 * Moving a day's times in one go — a late start, a long lunch — instead of
 * re-timing every step by hand. Earlier / Later over a duration wheel, as
 * Clock's timer picks one; what it'll do reads under the wheels before
 * Shift in the bar commits it. From a step (`fromId`) only it and what follows
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

  const summary = !mins
    ? "Choose how far to move the times."
    : res.outOfDay
      ? "That would move a time past midnight."
      : !res.patch
        ? "Nothing here has a time to move."
        : res.first
          ? `${plural(res.steps, "step")} · ${fmtClocksIn(res.first.from)} becomes ${fmtClocksIn(res.first.to)}`
          : "Moves the day’s times.";

  // the bar's text: iOS's 17pt on a phone sheet, the Mac's 13pt in a popover
  const barText = "text-[17px] sm:text-[13px]";
  const unit = "text-[17px] text-ink";

  return (
    <ActionSheet
      open={open}
      onClose={onClose}
      anchorRef={anchorRef}
      doneLabel={null}
      header={
        <div className="sm:w-[19rem]">
          {/* a modal's nav bar, as Calendar's New Event: Cancel, the title, the action */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 pb-3">
            <button type="button" onClick={onClose} className={`justify-self-start text-accent ${barText}`}>Cancel</button>
            <div className="text-center">
              <p className={`font-medium text-ink ${barText}`}>Shift Times</p>
              <p className="text-[12px] text-ink-soft">{fromId ? `From ${fromName || "this step"}` : "Whole day"}</p>
            </div>
            <button
              type="button"
              disabled={!ready}
              onClick={() => { if (res.patch) { onShift(res.patch); onClose(); } }}
              className={`justify-self-end font-medium text-accent disabled:text-ink-faint ${barText}`}
            >
              Shift
            </button>
          </div>
          <SegmentedControl
            options={[{ value: "earlier", label: "Earlier" }, { value: "later", label: "Later" }]}
            value={dir}
            onChange={setDir}
          />
          {/* Clock's timer wheels: each number flush against its unit, the
           *  pair centred, one selection band across both */}
          <div className="relative mt-2 flex items-center justify-center gap-6">
            <span aria-hidden className="pointer-events-none absolute inset-x-0 top-1/2 h-11 -translate-y-1/2 rounded-[10px] bg-ink/[0.08]" />
            <div className="flex items-center">
              <WheelColumn options={HOURS} value={h} onChange={setH} ariaLabel="Hours" width="w-12" align="end" />
              <span aria-hidden className={`w-14 pl-1 ${unit}`}>{h === "1" ? "hour" : "hours"}</span>
            </div>
            <div className="flex items-center">
              <WheelColumn options={MINUTES} value={m} onChange={setM} ariaLabel="Minutes" width="w-12" align="end" />
              <span aria-hidden className={`w-14 pl-1 ${unit}`}>min</span>
            </div>
          </div>
          <p className={`mt-2 min-h-[2.5em] text-center text-[13px] leading-snug ${mins && res.outOfDay ? "text-danger" : "text-ink-soft"}`}>
            {summary}
            {ready && res.pinned > 0 && <span className="block">{res.pinned === 1 ? "The pinned step keeps its time." : "Pinned steps keep their times."}</span>}
          </p>
        </div>
      }
    >
      {null}
    </ActionSheet>
  );
}
