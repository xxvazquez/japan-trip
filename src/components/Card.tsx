import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Icon } from "./Icon";

/** The panel shell shared with <Section> — a quiet surface framed by a hairline. */
export const CARD_SHELL =
  "rounded-[4px] border border-ink-faint/20 bg-surface px-4 py-4 shadow-[0_1px_2px_rgb(var(--c-ink)/0.03)] sm:px-5 sm:py-5";

/**
 * One entry on a Logbook tab — a stay, a journey, a document, a note. Same shell
 * as <Section>, but the header is the entry's own name (L2 `.lead`), not a
 * letter-spaced section label, so a run of them reads as a stack of things
 * rather than one crammed panel.
 *
 * Pass `to` to make the whole card a link (a chevron appears, the name
 * underlines on hover); otherwise it's a plain container for editable content.
 * `title` is optional — omit it for a card that's just a body (e.g. Notes).
 */
export function Card({
  title,
  right,
  meta,
  to,
  children,
  className = "",
}: {
  title?: ReactNode;
  /** node shown at the top-right — a date, a count, a remove button */
  right?: ReactNode;
  /** a quiet line under the title */
  meta?: ReactNode;
  to?: string;
  children?: ReactNode;
  className?: string;
}) {
  const header = title != null && (
    <div className="flex items-start justify-between gap-3">
      <span className={`lead min-w-0 ${to ? "group-hover:underline" : ""}`}>{title}</span>
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
      {meta && <p className={`meta ${title != null ? "mt-1" : ""}`}>{meta}</p>}
      {children && <div className={title != null || meta ? "mt-3" : ""}>{children}</div>}
    </>
  );

  return to ? (
    <Link to={to} className={`group block ${CARD_SHELL} transition-colors hover:border-ink-faint/40 ${className}`}>
      {body}
    </Link>
  ) : (
    <div className={`${CARD_SHELL} ${className}`}>{body}</div>
  );
}
