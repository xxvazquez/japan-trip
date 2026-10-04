import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Icon } from "./Icon";
import { ContextMenu } from "./ContextMenu";

/**
 * One row of a grouped-inset list: a leading `IconTile`, a title that wraps,
 * an optional quiet sub-line, an optional trailing value, and a chevron when the
 * row goes somewhere.
 *
 * Renders an `<li>` with its own hairline divider, inset past the leading tile
 * (iOS-style) and dropped on the last row — so wrap a run in a plain `<ul>`, no
 * `divide-y`. Pass `to` for a link row, `onClick` for a toggle row, and
 * `menu` (`menu-item` buttons) for its long-press / right-click actions.
 */
export function TileRow({
  tile,
  title,
  meta,
  right,
  to,
  onClick,
  chevron,
  menu,
  className = "",
}: {
  tile: ReactNode;
  title: ReactNode;
  meta?: ReactNode;
  right?: ReactNode;
  to?: string;
  onClick?: () => void;
  chevron?: boolean;
  menu?: ReactNode;
  className?: string;
}) {
  const showChevron = chevron ?? (!!to || !!onClick);
  const twoLine = meta != null && meta !== "";
  const body = (
    <>
      {/* with a sub-line the tile sits on the title's line, as an iOS Label
          does; the chevron and trailing value stay centred on the row */}
      {twoLine ? <TitleLineTile>{tile}</TitleLineTile> : tile}
      <span className="min-w-0 flex-1">
        <span className="block break-words text-sm leading-snug text-ink">{title}</span>
        {twoLine && <span className="meta mt-0.5 block break-words">{meta}</span>}
      </span>
      {right != null && right !== "" && (
        <span className="shrink-0 text-sm tabular-nums text-ink-soft">{right}</span>
      )}
      {showChevron && <Icon name="chevron" size={14} className="shrink-0 text-ink-faint" />}
    </>
  );
  // the grouped inset clips its overflow, so pull the focus ring inward
  const cls = `flex w-full items-center gap-3 px-3.5 py-3 text-left transition-colors duration-150 focus-visible:[outline-offset:-2px] ${className}`;
  // own hairline, inset past the tile (14px pad + 22px tile + 12px gap), gone on the last row
  const li = "relative after:pointer-events-none after:absolute after:bottom-0 after:left-12 after:right-0 after:h-[var(--hair)] after:bg-line last:after:hidden";
  const row = to ? (
    <Link to={to} className={`${cls} hover:bg-surface-2/40 active:bg-ink/[0.07]`}>
      {body}
    </Link>
  ) : onClick ? (
    <button type="button" onClick={onClick} className={`${cls} active:bg-ink/[0.07]`}>
      {body}
    </button>
  ) : (
    <div className={cls}>{body}</div>
  );
  return <li className={li}>{menu ? <ContextMenu menu={menu}>{row}</ContextMenu> : row}</li>;
}

/** a box exactly one `text-sm leading-snug` line tall, pinned to the top of
 *  the row, with the tile centred in it — so a tile of any size lines up with
 *  the first line of the title beside it */
export function TitleLineTile({ children }: { children: ReactNode }) {
  return <span className="flex h-[1.375em] shrink-0 items-center self-start text-sm">{children}</span>;
}
