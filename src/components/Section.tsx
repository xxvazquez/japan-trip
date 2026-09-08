import { useState, type ReactNode } from "react";
import { CARD_SHELL } from "./Card";
import { Icon, type IconName } from "./Icon";

/**
 * A titled block on a detail page.
 *
 * `variant="panel"` (default) — a quiet surface panel framed by a hairline, with
 * a letter-spaced header on a rule directly above its content. Used for the
 * labelled sections of the Day / Journey / Hotel pages so they read as one
 * family; an optional `icon` gives a run of otherwise-identical panels a
 * glance-difference.
 *
 * `variant="grouped"` — the iOS grouped-inset-list treatment: a small quiet
 * label sitting *above* the inset (no rule), then a rounded near-white inset
 * that clips its rows. The page ground shows through between groups. Meant for
 * lists whose rows carry their own dividers and padding.
 *
 * `collapsible` turns the header into a toggle (a chevron appears on the left);
 * `defaultOpen` is true unless set. Collapse state is per-mount.
 *
 * Secondary actions (＋ Add, ＋ From map…) go in `action`. Callers own the
 * spacing between sections — wrap a run in `space-y-3.5`.
 */
export function Section({
  title,
  icon,
  action,
  children,
  className = "",
  variant = "panel",
  collapsible = false,
  defaultOpen = true,
}: {
  /** omit on a `grouped` section whose enclosing tab already names it */
  title?: ReactNode;
  icon?: IconName;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  variant?: "panel" | "grouped";
  collapsible?: boolean;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const shut = collapsible && !open;
  const grouped = variant === "grouped";
  const hasHeader = title != null || action != null;

  const heading = (
    <h2
      className={
        grouped
          ? "eyebrow flex min-w-0 items-center gap-1.5 text-ink-faint"
          : "kicker flex min-w-0 items-center gap-1.5"
      }
    >
      {collapsible && (
        <Icon
          name="chevron"
          size={grouped ? 11 : 12}
          className={`shrink-0 text-ink-faint transition-transform ${open ? "rotate-90" : ""}`}
        />
      )}
      {icon && <Icon name={icon} size={grouped ? 12 : 13} className="shrink-0 -translate-y-px text-ink-faint" />}
      <span className="truncate">{title}</span>
    </h2>
  );

  const headerRow = (
    <div
      className={
        grouped
          ? `flex items-baseline justify-between gap-3 px-1 ${shut ? "" : "mb-1.5"}`
          : `flex items-baseline justify-between gap-3 ${shut ? "" : "mb-2.5 border-b border-line pb-2.5"}`
      }
    >
      {collapsible ? (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="-my-1 flex min-w-0 flex-1 items-center py-1 text-left"
          aria-expanded={open}
        >
          {heading}
        </button>
      ) : (
        heading
      )}
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );

  if (grouped) {
    return (
      <section className={className}>
        {hasHeader && headerRow}
        {!shut && (
          <div className="overflow-hidden rounded-[12px] border border-line bg-surface shadow-[0_1px_1px_rgb(0_0_0/0.04),0_3px_8px_-2px_rgb(0_0_0/0.06)] dark:border-ink/10 dark:shadow-[0_1px_2px_rgb(0_0_0/0.4),0_6px_16px_-4px_rgb(0_0_0/0.5)]">
            {children}
          </div>
        )}
      </section>
    );
  }

  return (
    <section className={`${CARD_SHELL} ${className}`}>
      {hasHeader && headerRow}
      {!shut && children}
    </section>
  );
}
