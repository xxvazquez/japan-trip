import { type ReactNode } from "react";
import { Icon, type IconName } from "./Icon";
import { usePersistedOpen } from "@/lib/collapse";

/**
 * One row of a shared grouped-inset list that expands in place to reveal more
 * content — for several same-kind cards (a document, a luggage note) that
 * each want their own disclosure without each becoming its own floating
 * `Section`. A `Section` hides its whole rounded card when collapsed (right
 * for one named feature block — collapsed just means "hidden"), which is
 * wrong for a list of several: collapse a few and the page reads as a stack
 * of bare quiet labels with no visible list at all, not an iOS list. Wrap a
 * run of these in one plain `<Section><ul>…</ul></Section>` instead — one
 * shared card stays visible no matter how many rows are collapsed.
 *
 * The chevron is its own button, separate from `title`, so an `Editable`
 * title keeps editing instead of toggling the row. Open/closed persists per
 * trip, keyed by `id` (see `usePersistedOpen`).
 */
export function AccordionRow({
  id,
  icon,
  title,
  action,
  defaultOpen = false,
  children,
}: {
  id: string;
  icon?: IconName;
  title: ReactNode;
  action?: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = usePersistedOpen(id, defaultOpen);

  return (
    <li className="relative after:pointer-events-none after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-line last:after:hidden">
      <div className="flex items-center gap-2 py-2.5 pl-2 pr-3.5">
        <button
          type="button"
          onClick={() => setOpen((was) => !was)}
          aria-expanded={open}
          className="-m-1 shrink-0 p-1 text-ink-faint transition-colors hover:text-ink-soft"
        >
          <Icon name="chevron" size={14} className={`transition-transform ${open ? "rotate-90" : ""}`} />
          <span className="sr-only">{open ? "Collapse" : "Expand"}</span>
        </button>
        {icon && <Icon name={icon} size={15} className="shrink-0 text-ink-soft" />}
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink">{title}</span>
        {action}
      </div>
      {open && <div className="border-t border-line">{children}</div>}
    </li>
  );
}
