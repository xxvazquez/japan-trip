import type { ReactNode } from "react";

/**
 * A titled block on a detail page: a quiet surface panel, framed by a hairline,
 * with a letter-spaced header sitting on a rule directly above its content. Used for
 * the labelled sections of the Day / Journey / Hotel pages so they read as one
 * family. Secondary actions (＋ Add, ＋ From map…) go in `action`.
 *
 * Callers own the spacing between sections — wrap a run of them in
 * `space-y-3.5`, or pass `className="mt-8"` for a lone one.
 */
export function Section({
  title,
  action,
  children,
  className = "",
}: {
  title: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-[4px] border border-ink-faint/20 bg-surface px-4 py-4 shadow-[0_1px_2px_rgb(var(--c-ink)/0.03)] sm:px-5 sm:py-5 ${className}`}
    >
      <div className="mb-3 flex items-baseline justify-between gap-3 border-b border-line pb-2.5">
        <h2 className="kicker">{title}</h2>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {children}
    </section>
  );
}
