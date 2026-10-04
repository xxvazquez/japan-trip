import { Icon, type IconName } from "./Icon";

/** A button in a place card's top row — icon over a short label on a grey
 *  tile, sharing the row equally, as Maps lays out Directions / Call /
 *  Website; `primary` is the filled one. A link when it leaves the app,
 *  else a button. */
export function PlaceAction({ href, onClick, icon, label, primary }: { href?: string; onClick?: () => void; icon: IconName; label: string; primary?: boolean }) {
  // the card's main action is filled, as Maps fills Directions; the rest grey
  const tone = primary ? "bg-accent text-white active:opacity-80" : "bg-ink/[0.06] text-accent active:bg-ink/[0.1]";
  const cls = `flex min-w-0 flex-1 flex-col items-center gap-1 rounded-[12px] px-1 py-2.5 text-center text-xs ${tone}`;
  const body = <><Icon name={icon} size={20} /><span className="break-words leading-tight">{label}</span></>;
  return href ? (
    <a href={href} target="_blank" rel="noopener" className={cls}>{body}</a>
  ) : (
    <button type="button" onClick={onClick} className={cls}>{body}</button>
  );
}
