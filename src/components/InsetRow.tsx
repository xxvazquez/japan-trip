import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Icon } from "./Icon";

/**
 * A label / value row for a grouped-inset list (`<Section variant="grouped">`) —
 * the iOS Settings row: a quiet label on the left, the value or its control on
 * the right, at one type size so there's no cliff between them. The value slot
 * takes an `<Editable>` straight in.
 *
 * Renders an `<li>` with its own hairline divider (inset to the label, gone on
 * the last row) — wrap a run in a plain `<ul>`, no `divide-y`. `stacked` puts
 * the label above a full-width value (a long address, a note). `to` makes the
 * whole row a link with a trailing chevron.
 */
/** The inset hairline for a grouped-list `<li>` — for hand-rolled rows that
 *  can't use `<InsetRow>` (an external-link row, a custom cell). */
export const INSET_DIVIDER =
  "relative after:pointer-events-none after:absolute after:bottom-0 after:left-3.5 after:right-0 after:h-px after:bg-line last:after:hidden";
const LI = INSET_DIVIDER;

export function InsetRow({
  label,
  children,
  stacked = false,
  to,
  className = "",
}: {
  label: ReactNode;
  children: ReactNode;
  stacked?: boolean;
  to?: string;
  className?: string;
}) {
  if (stacked) {
    return (
      <li className={`${LI} px-3.5 py-2.5 ${className}`}>
        <span className="row-label mb-0.5 block">{label}</span>
        <span className="row-value block text-left">{children}</span>
      </li>
    );
  }

  const inner = (
    <>
      <span className="row-label">{label}</span>
      <span className="row-value">
        {children}
      </span>
      {to && <Icon name="chevron" size={14} className="-mr-1 shrink-0 text-ink-faint" />}
    </>
  );

  if (to) {
    return (
      <li className={LI}>
        <Link to={to} className={`flex items-center justify-between gap-3 px-3.5 py-2.5 transition-colors hover:bg-surface-2/40 focus-visible:[outline-offset:-2px] ${className}`}>
          {inner}
        </Link>
      </li>
    );
  }

  return (
    <li className={`${LI} flex items-baseline justify-between gap-4 px-3.5 py-2.5 ${className}`}>
      {inner}
    </li>
  );
}
