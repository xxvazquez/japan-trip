import { Icon, type IconName } from "./Icon";

/** A button in a place card's top row — a slim rounded button, icon beside
 *  a short label, sharing the row equally (the Maps Directions / Call /
 *  Website row, at a height that doesn't crowd the card); `primary` is the
 *  filled one. A link when it leaves the app,
 *  else a button. */
export function PlaceAction({ href, onClick, icon, label, primary }: { href?: string; onClick?: () => void; icon: IconName; label: string; primary?: boolean }) {
  // the card's main action is filled, as Maps fills Directions; the rest grey
  const tone = primary ? "bg-accent text-white active:opacity-80" : "bg-ink/[0.06] text-accent active:bg-ink/[0.1]";
  const cls = `flex min-h-[36px] min-w-0 flex-1 items-center justify-center gap-1.5 rounded-[10px] px-2 py-1.5 text-center text-xs ${tone}`;
  const body = <><Icon name={icon} size={15} className="shrink-0" /><span className="min-w-0 break-words leading-tight">{label}</span></>;
  return href ? (
    <a href={href} target="_blank" rel="noopener" className={cls}>{body}</a>
  ) : (
    <button type="button" onClick={onClick} className={cls}>{body}</button>
  );
}
