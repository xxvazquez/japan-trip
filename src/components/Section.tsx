import { useState, type ReactNode } from "react";
import { CARD_SHELL } from "./Card";
import { Icon, type IconName } from "./Icon";

/**
 * A titled block on a detail page: a quiet surface panel, framed by a hairline,
 * with a letter-spaced header sitting on a rule directly above its content. Used
 * for the labelled sections of the Day / Journey / Hotel pages so they read as
 * one family — an optional `icon` gives a run of otherwise-identical panels a
 * glance-difference. Secondary actions (＋ Add, ＋ From map…) go in `action`.
 *
 * `collapsible` turns the header into a toggle (a chevron appears on the left,
 * the icon shifts to the title); `defaultOpen` is true unless set. Collapse
 * state is per-mount — a long list folds away, it doesn't persist.
 *
 * Callers own the spacing between sections — wrap a run of them in
 * `space-y-3.5`, or pass `className="mt-8"` for a lone one.
 */
export function Section({
  title,
  icon,
  action,
  children,
  className = "",
  collapsible = false,
  defaultOpen = true,
}: {
  title: ReactNode;
  icon?: IconName;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const shut = collapsible && !open;

  const heading = (
    <h2 className="kicker flex min-w-0 items-center gap-1.5">
      {collapsible && (
        <Icon
          name="chevron"
          size={12}
          className={`shrink-0 text-ink-faint transition-transform ${open ? "rotate-90" : ""}`}
        />
      )}
      {icon && <Icon name={icon} size={13} className="shrink-0 -translate-y-px text-ink-faint" />}
      <span className="truncate">{title}</span>
    </h2>
  );

  return (
    <section className={`${CARD_SHELL} ${className}`}>
      <div className={`flex items-baseline justify-between gap-3 ${shut ? "" : "mb-2.5 border-b border-line pb-2.5"}`}>
        {collapsible ? (
          <button type="button" onClick={() => setOpen((o) => !o)} className="-my-1 flex min-w-0 flex-1 items-center py-1 text-left" aria-expanded={open}>
            {heading}
          </button>
        ) : (
          heading
        )}
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {!shut && children}
    </section>
  );
}
