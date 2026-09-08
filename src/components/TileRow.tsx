import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Icon } from "./Icon";

/**
 * One row of a grouped-inset list: a leading `IconTile`, a title that truncates,
 * an optional quiet sub-line, an optional trailing value, and a chevron when the
 * row goes somewhere.
 *
 * Renders an `<li>` — wrap a run in `<ul className="divide-y divide-line">` (or
 * put it straight inside a `<Section variant="grouped">`). Pass `to` for a link
 * row, `onClick` for a toggle row.
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
        <span className="block truncate text-sm font-medium leading-snug text-ink">{title}</span>
        {meta != null && meta !== "" && <span className="meta mt-0.5 block truncate">{meta}</span>}
      </span>
      {right != null && right !== "" && (
        <span className="shrink-0 text-[0.8125rem] tabular-nums text-ink-soft">{right}</span>
      )}
      {showChevron && <Icon name="chevron" size={14} className="shrink-0 text-ink-faint" />}
    </>
  );
  const cls = `flex w-full items-center gap-3 px-3.5 py-2.5 text-left ${className}`;
  return (
    <li>
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
