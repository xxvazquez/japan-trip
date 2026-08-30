import { useState, type ReactNode } from "react";
import { Icon, type IconName } from "./Icon";

/* ------------------------------------------------------------------ *
 * Generic visual primitives — no trip / country assumptions.
 * ------------------------------------------------------------------ */

export interface Signal {
  icon: IconName;
  label: string;
  value: ReactNode;
}

/** A row of compact icon + value signals. Reads at a glance; never prose. */
export function SignalChips({ items, className = "" }: { items: (Signal | false | null | undefined)[]; className?: string }) {
  const chips = items.filter(Boolean) as Signal[];
  if (chips.length === 0) return null;
  return (
    <div className={`flex flex-wrap gap-x-5 gap-y-2 ${className}`}>
      {chips.map((c, i) => (
        <span key={i} className="flex items-center gap-1.5 text-sm">
          <Icon name={c.icon} size={15} className="shrink-0 text-ink-faint" />
          <span className="font-medium">{c.value}</span>
          <span className="text-ink-faint">{c.label}</span>
        </span>
      ))}
    </div>
  );
}

export type Tone = "warn" | "info" | "ok";

const BAND_TONE: Record<Tone, string> = {
  warn: "border-accent text-accent",
  info: "border-ink-faint text-ink-soft",
  ok: "border-matcha text-matcha",
};

/** Things that need attention, stacked at the top of a screen. A colour-keyed
 *  left rule — no filled box. */
export function AttentionBand({ items }: { items: { icon?: IconName; text: ReactNode; tone?: Tone }[] }) {
  if (items.length === 0) return null;
  return (
    <div className="space-y-2.5">
      {items.map((it, i) => (
        <div key={i} className={`flex items-start gap-2.5 border-l-2 pl-3 text-sm ${BAND_TONE[it.tone ?? "warn"]}`}>
          <Icon name={it.icon ?? "alert"} size={15} className="mt-0.5 shrink-0" />
          <span>{it.text}</span>
        </div>
      ))}
    </div>
  );
}

/** Progressive disclosure — collapsed by default, a count hint, one tap to open. */
export function Disclosure({
  title,
  count,
  defaultOpen = false,
  children,
}: {
  title: string;
  count?: number;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="border-t border-line py-3">
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center gap-2 text-left">
        <Icon name={open ? "down" : "chevron"} size={15} className="text-ink-faint" />
        <span className="text-sm font-medium">{title}</span>
        {count != null && count > 0 && <span className="text-xs text-ink-faint">{count}</span>}
      </button>
      {open && <div className="mt-3 pl-[22px]">{children}</div>}
    </section>
  );
}
