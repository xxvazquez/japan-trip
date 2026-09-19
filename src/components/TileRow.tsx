import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Icon } from "./Icon";

/**
 * One row of a grouped-inset list: a leading `IconTile`, a title that wraps,
 * an optional quiet sub-line, an optional trailing value, and a chevron when the
 * row goes somewhere.
 *
 * Renders an `<li>` with its own hairline divider, inset past the leading tile
 * (iOS-style) and dropped on the last row — so wrap a run in a plain `<ul>`, no
 * `divide-y`. Pass `to` for a link row, `onClick` for a toggle row.
 */
export function TileRow({
  tile,
  title,
  meta,
  right,
  to,
  onClick,
  chevron,
  className = "",
}: {
  tile: ReactNode;
  title: ReactNode;
  meta?: ReactNode;
  right?: ReactNode;
  to?: string;
  onClick?: () => void;
  chevron?: boolean;
  className?: string;
}) {
  const showChevron = chevron ?? (!!to || !!onClick);
  const body = (
    <>
      {tile}
      <span className="min-w-0 flex-1">
        <span className="block break-words text-sm font-medium leading-snug text-ink">{title}</span>
        {meta != null && meta !== "" && <span className="meta mt-0.5 block break-words">{meta}</span>}
      </span>
      {right != null && right !== "" && (
        <span className="shrink-0 text-[0.9375rem] tabular-nums text-ink-soft">{right}</span>
      )}
      {showChevron && <Icon name="chevron" size={14} className="shrink-0 text-ink-faint" />}
    </>
  );
  // the grouped inset clips its overflow, so pull the focus ring inward
  const cls = `flex w-full items-center gap-3 px-3.5 py-3 text-left focus-visible:[outline-offset:-2px] ${className}`;
  // own hairline, inset past the tile (14px pad + 22px tile + 12px gap), gone on the last row
  const li = "relative after:pointer-events-none after:absolute after:bottom-0 after:left-12 after:right-0 after:h-px after:bg-line last:after:hidden";
  return (
    <li className={li}>
      {to ? (
        <Link to={to} className={`${cls} transition-colors hover:bg-surface-2/40`}>
          {body}
        </Link>
      ) : onClick ? (
        <button type="button" onClick={onClick} className={cls}>
          {body}
        </button>
      ) : (
        <div className={cls}>{body}</div>
      )}
    </li>
  );
}
