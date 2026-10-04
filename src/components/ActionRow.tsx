import { Link } from "react-router-dom";
import { Icon, type IconName } from "./Icon";
import { INSET_DIVIDER } from "./InsetRow";

export const ACTION_ROW = "action w-full px-3.5 py-2.5 text-xs transition-colors duration-150 active:bg-ink/[0.07] active:opacity-100 disabled:opacity-50";

/** an action in a grouped list — the iOS Settings idiom: a full-width row with
 *  an accent label, never a wide filled button inside the card. Renders an
 *  `<li>` for a plain `<ul>` inside a `<Section>`. `to` makes it a link to
 *  another page (a trailing chevron, like any row that pushes a page). */
export function ActionRow({ icon, label, hint, onClick, to, disabled }: { icon?: IconName; label: string; hint?: string; onClick?: () => void; to?: string; disabled?: boolean }) {
  const inner = (
    <>
      {icon && <Icon name={icon} size={14} />} {label}
      {hint && <span className="meta ml-1 hidden font-normal sm:inline">— {hint}</span>}
    </>
  );
  return (
    <li className={INSET_DIVIDER}>
      {to ? (
        <Link to={to} className={ACTION_ROW}>
          <span className="flex min-w-0 flex-1 items-center gap-1.5 break-words">{inner}</span>
          <Icon name="chevron" size={14} className="-mr-1 shrink-0 text-ink-faint" />
        </Link>
      ) : (
        <button onClick={onClick} disabled={disabled} className={ACTION_ROW}>
          {inner}
        </button>
      )}
    </li>
  );
}
