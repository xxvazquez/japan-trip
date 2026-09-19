import { useRef, useState } from "react";
import { ActionSheet } from "./ActionSheet";
import { Icon } from "./Icon";

/** hsl (0–360, 0–100, 0–100) → #rrggbb */
function hex(h: number, s: number, l: number): string {
  const a = (s / 100) * Math.min(l / 100, 1 - l / 100);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const c = l / 100 - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(255 * c).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

const HUES = [4, 28, 48, 140, 178, 212, 262, 320];
const TONES: [number, number][] = [[52, 30], [50, 44], [55, 60], [60, 78]];
const GREYS = [10, 24, 38, 52, 66, 80, 91, 97];

/** the curated palette — tap-only, so choosing a colour never needs a keyboard
 *  or a platform-specific picker: four tones of eight hues, then a grey ramp */
const PALETTE = [
  ...TONES.flatMap(([s, l]) => HUES.map((h) => hex(h, s, l))),
  ...GREYS.map((l) => hex(215, 8, l)),
];

/**
 * A colour control for a settings row: a round swatch that opens a sheet of
 * colours (a bottom sheet on a phone, a popover on a desktop). Replaces the
 * browser's `<input type="color">`, which looks and behaves differently on
 * every platform.
 */
export function ColorSwatch({ value, onChange, label }: { value: string; onChange: (hex: string) => void; label: string }) {
  const [open, setOpen] = useState(false);
  const anchor = useRef<HTMLButtonElement>(null);
  return (
    <>
      <button
        ref={anchor}
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`${label}: ${value}`}
        aria-haspopup="menu"
        className="tap h-7 w-7 rounded-full border border-ink/15"
        style={{ background: value }}
      />
      <ActionSheet open={open} onClose={() => setOpen(false)} anchorRef={anchor} title={label}>
        <div className="grid grid-cols-8 gap-2 p-3">
          {PALETTE.map((c) => {
            const on = c.toLowerCase() === value.toLowerCase();
            return (
              <button
                key={c}
                type="button"
                onClick={() => onChange(c)}
                aria-label={c}
                aria-pressed={on}
                className={`tap grid h-8 w-8 place-items-center rounded-full border border-ink/15 ${on ? "ring-2 ring-accent ring-offset-2 ring-offset-surface" : ""}`}
                style={{ background: c }}
              >
                {on && <Icon name="check" size={14} className="text-white mix-blend-difference" />}
              </button>
            );
          })}
        </div>
      </ActionSheet>
    </>
  );
}
