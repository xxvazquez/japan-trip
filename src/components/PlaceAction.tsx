import type { Ref } from "react";
import { Icon, type IconName } from "./Icon";

/** A place card's button row: equal buttons across the card, the way Maps
 *  lays out Directions / Call / Website / More — up to five, all in view.
 *  Each is at most a quarter of the row, so a card with only two or three
 *  doesn't stretch them into wide bars; a short row sits centred. */
export function PlaceActions({ children }: { children: React.ReactNode }) {
  return <div className="flex justify-center gap-1.5">{children}</div>;
}

/** A button in a place card's top row — a compact rounded button, the icon
 *  over a short label, sharing the row equally so five fit on a phone
 *  without a label breaking mid-word (a two-word label wraps at its space);
 *  `primary` is the filled one. A link when it leaves the app, else a
 *  button. */
export function PlaceAction({ href, onClick, icon, label, primary, buttonRef, menu }: {
  href?: string;
  onClick?: () => void;
  icon: IconName;
  label: string;
  primary?: boolean;
  /** for a menu that opens from the button (More) to point at it */
  buttonRef?: Ref<HTMLButtonElement>;
  /** opens a menu — Maps' More */
  menu?: boolean;
}) {
  // the card's main action is filled, as Maps fills Directions; the rest grey
  const tone = primary ? "bg-accent text-white active:opacity-80 dark:text-bg" : "bg-ink/[0.06] text-accent active:bg-ink/[0.1]";
  const cls = `flex min-w-0 max-w-[calc((100%-1.125rem)/4)] flex-1 basis-0 flex-col items-center justify-center gap-0.5 rounded-[10px] px-1 py-1.5 text-center text-[12px] ${tone}`;
  const body = <><Icon name={icon} size={16} className="shrink-0" /><span className="leading-tight">{label}</span></>;
  return href ? (
    // a tel:/mailto: hands off to the dialler in place — a new tab would
    // leave a blank window behind in the installed app
    <a href={href} {...(/^https?:/i.test(href) ? { target: "_blank", rel: "noopener" } : {})} className={cls}>{body}</a>
  ) : (
    <button ref={buttonRef} type="button" onClick={onClick} aria-haspopup={menu ? "menu" : undefined} className={cls}>{body}</button>
  );
}
