import { Icon, type IconName } from "./Icon";
import { INSET_DIVIDER } from "./InsetRow";

/** an action in a grouped list — the iOS Settings idiom: a full-width row with
 *  an accent label, never a wide filled button inside the card. Renders an
 *  `<li>` for a plain `<ul>` inside a `<Section>`. */
export function ActionRow({ icon, label, hint, onClick, disabled }: { icon?: IconName; label: string; hint?: string; onClick: () => void; disabled?: boolean }) {
  return (
    <li className={INSET_DIVIDER}>
      <button onClick={onClick} disabled={disabled} className="action w-full px-3.5 py-2.5 text-[0.8125rem] disabled:opacity-50">
        {icon && <Icon name={icon} size={14} />} {label}
        {hint && <span className="meta ml-1 hidden font-normal sm:inline">— {hint}</span>}
      </button>
    </li>
  );
}
