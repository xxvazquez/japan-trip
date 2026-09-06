import type { ReactNode } from "react";
import { CARD_SHELL } from "./Card";
import { Icon, type IconName } from "./Icon";

/**
 * A titled block on a detail page: a quiet surface panel, framed by a hairline,
 * with a letter-spaced header sitting on a rule directly above its content. Used
 * for the labelled sections of the Day / Journey / Hotel pages so they read as
 * one family — an optional `icon` gives a run of otherwise-identical panels a
 * glance-difference. Secondary actions (＋ Add, ＋ From map…) go in `action`.
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
}: {
  title: ReactNode;
  icon?: IconName;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`${CARD_SHELL} ${className}`}>
      <div className="mb-2.5 flex items-baseline justify-between gap-3 border-b border-line pb-2.5">
        <h2 className="kicker flex items-center gap-1.5">
          {icon && <Icon name={icon} size={13} className="shrink-0 -translate-y-px text-ink-faint" />}
          {title}
        </h2>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {children}
    </section>
  );
}
