import { type MouseEvent, type ReactNode } from "react";
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
  "relative after:pointer-events-none after:absolute after:bottom-0 after:left-3.5 after:right-0 after:h-[var(--hair)] after:bg-line last:after:hidden";
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
      <li className={`${LI} px-3.5 py-3 ${className}`}>
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
        <Link to={to} className={`flex items-center justify-between gap-3 px-3.5 py-3 transition-colors duration-150 hover:bg-surface-2/40 active:bg-ink/[0.07] focus-visible:[outline-offset:-2px] ${className}`}>
          {inner}
        </Link>
      </li>
    );
  }

  return (
    <li className={`${LI} flex items-baseline justify-between gap-4 px-3.5 py-3 ${className}`} onClick={tapRowToEdit}>
      {inner}
    </li>
  );
}

/** iOS rows are tappable edge to edge, not just on the value's text: a tap on
 *  the empty part of a row opens its (single) inline editor — a text field or
 *  the time wheel. Taps on real controls inside the row are left alone. */
function tapRowToEdit(e: MouseEvent<HTMLLIElement>) {
  if ((e.target as HTMLElement).closest("button, a, input, select, textarea, label, [role=switch]")) return;
  const editors = e.currentTarget.querySelectorAll<HTMLButtonElement>("button.editable");
  if (editors.length === 1) editors[0].click();
}
