import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Icon } from "./Icon";

/** The panel shell shared with <Section> — a quiet surface lifted off the page.
 *  Light: a hairline plus a soft two-layer shadow so it reads as a card, not an
 *  outlined box. Dark: a shadow barely registers on a dark ground, so the lift
 *  comes from a faint light-tinted border (`ink/10`) over a deeper shadow. */
export const CARD_SHELL =
  "rounded border border-line bg-surface px-4 py-4 sm:px-5 sm:py-5 " +
  "shadow-[0_1px_1px_rgb(0_0_0/0.04),0_3px_8px_-2px_rgb(0_0_0/0.06)] " +
  "dark:border-ink/10 dark:shadow-[0_1px_2px_rgb(0_0_0/0.4),0_6px_16px_-4px_rgb(0_0_0/0.5)]";

/**
 * One entry on a Logbook tab — a stay, a journey, a document, a note. Same shell
 * as <Section>, but the header is the entry's own name (L2 `.lead`), not a
 * letter-spaced section label, so a run of them reads as a stack of things
 * rather than one crammed panel.
 *
 * Pass `to` to make the whole card a link (a chevron appears, the name
 * underlines on hover); otherwise it's a plain container for editable content.
 * `title` is optional — omit it for a card that's just a body (e.g. Notes).
 *
 * `collapsible` adds a fold chevron before the title (the chevron alone is the
 * toggle, so an `Editable` title stays tappable-to-edit); `defaultOpen` is true
 * unless set. Ignored when `to` is set — a link card can't also be a toggle.
 * Collapse state is per-mount, it doesn't persist. `right` (a count, a delete)
 * stays visible while collapsed.
 */
export function Card({
  title,
  right,
  meta,
  to,
  children,
  className = "",
  collapsible = false,
  defaultOpen = true,
}: {
  title?: ReactNode;
  /** node shown at the top-right — a date, a count, a remove button */
  right?: ReactNode;
  /** a quiet line under the title */
  meta?: ReactNode;
  to?: string;
  children?: ReactNode;
  className?: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const canCollapse = collapsible && !to;
  const shut = canCollapse && !open;

  const header = title != null && (
    <div className="flex items-start justify-between gap-3">
      <span className={`lead flex min-w-0 items-center gap-1.5 ${to ? "group-hover:underline" : ""}`}>
        {canCollapse && (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? "Collapse" : "Expand"}
            className="-m-1 shrink-0 p-1"
          >
            <Icon
              name="chevron"
              size={13}
              className={`text-ink-faint transition-transform ${open ? "rotate-90" : ""}`}
            />
          </button>
        )}
        <span className="min-w-0 truncate">{title}</span>
      </span>
      {(right || to) && (
        <span className="flex shrink-0 items-center gap-2 pt-0.5">
          {right}
          {to && <Icon name="chevron" size={14} className="text-ink-faint" />}
        </span>
      )}
    </div>
  );
  const body = (
    <>
      {header}
      {!shut && meta && <p className={`meta ${title != null ? "mt-1" : ""}`}>{meta}</p>}
      {!shut && children && <div className={title != null || meta ? "mt-3" : ""}>{children}</div>}
    </>
  );

  return to ? (
    <Link to={to} className={`group block ${CARD_SHELL} transition-colors hover:border-ink-soft/30 ${className}`}>
      {body}
    </Link>
  ) : (
    <div className={`${CARD_SHELL} ${className}`}>{body}</div>
  );
}
