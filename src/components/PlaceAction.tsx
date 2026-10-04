import { Icon, type IconName } from "./Icon";

/** A place card's button row: equal buttons across the card, the way Maps
 *  lays out Directions / Call / Website — all of them always in view. */
export function PlaceActions({ children }: { children: React.ReactNode }) {
  return <div className="flex gap-1.5">{children}</div>;
}

/** A button in a place card's top row — a compact rounded button, the icon
 *  over a short label, sharing the row equally so four fit on a phone
 *  without a label breaking mid-word (a two-word label wraps at its space);
 *  `primary` is the filled one. A link when it leaves the app, else a
 *  button. */
export function PlaceAction({ href, onClick, icon, label, primary }: { href?: string; onClick?: () => void; icon: IconName; label: string; primary?: boolean }) {
  // the card's main action is filled, as Maps fills Directions; the rest grey
  const tone = primary ? "bg-accent text-white active:opacity-80" : "bg-ink/[0.06] text-accent active:bg-ink/[0.1]";
  const cls = `flex min-w-0 flex-1 basis-0 flex-col items-center justify-center gap-0.5 rounded-[10px] px-1 py-1.5 text-center text-[12px] ${tone}`;
  const body = <><Icon name={icon} size={16} className="shrink-0" /><span className="leading-tight">{label}</span></>;
  return href ? (
    <a href={href} target="_blank" rel="noopener" className={cls}>{body}</a>
  ) : (
    <button type="button" onClick={onClick} className={cls}>{body}</button>
  );
}
