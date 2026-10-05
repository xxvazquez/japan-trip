import type { ReactNode } from "react";
import { Icon, type IconName } from "./Icon";

/** One point of a section's or page's ⓘ help: a glyph, a short bold lead and a line or two under it. */
export type Tip = { icon: IconName; title: string; text: ReactNode };

/**
 * What an ⓘ opens: an inline tip card, the way iOS's own tips sit in a list —
 * a rounded card under the header, not loose grey text. A sentence or two
 * reads as a short paragraph; anything that explains several things passes a
 * list of `Tip`s instead, laid out like an iOS feature list (glyph, bold lead,
 * one line), so it scans instead of reading as a wall.
 */
export function InfoCard({ id, info, className = "" }: { id: string; info: ReactNode | Tip[]; className?: string }) {
  return (
    <div id={id} className={`motion-safe:animate-fade-in rounded-[12px] bg-surface px-3.5 py-3 text-xs leading-normal text-ink-soft ${className}`}>
      {Array.isArray(info) ? <Tips items={info as Tip[]} /> : <p>{info}</p>}
    </div>
  );
}

function Tips({ items }: { items: Tip[] }) {
  return (
    <ul className="space-y-3">
      {items.map((t) => (
        <li key={t.title} className="flex gap-3">
          <Icon name={t.icon} size={20} className="mt-px shrink-0 text-accent" />
          <div className="min-w-0">
            <p className="font-medium text-ink">{t.title}</p>
            <p className="break-words">{t.text}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
