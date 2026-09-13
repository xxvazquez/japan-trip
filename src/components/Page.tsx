import { useId, useState, type ReactNode } from "react";
import { BackBar } from "./BackBar";
import { Icon } from "./Icon";

/** Standard reading column for a route's content. */
export function Page({
  children,
  width = "reading",
  className = "",
}: {
  children: ReactNode;
  width?: "reading" | "page";
  className?: string;
}) {
  return (
    <div
      className={[
        "relative z-10 mx-auto w-full px-5 pb-28 pt-6 sm:px-7 md:pb-14",
        width === "reading" ? "max-w-reading" : "max-w-page",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

/**
 * The one page-header pattern for the reading-column routes. Two shapes:
 *
 *   • detail page (Day / Journey / Hotel / Leg / a Logbook section) — `back` +
 *     `eyebrow` (a date, a stay span, "Stay") + `title`
 *   • section page (the Logbook index / Manage) — `title` alone, optional
 *     `meta`, no `back`, no `eyebrow`: the tab bar already says where you are
 *
 * `title` takes a node so a page can drop an <Editable> straight in. Two routes
 * deliberately don't use this: Plan (its "NOW" countdown block stands in for a
 * title) and Map (full-bleed, no reading column).
 *
 * `info` — one-off "how this works" copy for a page with no `<Section>` of its
 * own to hang it on (e.g. Scratchpad), revealed by an ⓘ next to the title
 * itself rather than a near-empty section header underneath.
 */
export function PageHeader({
  back,
  eyebrow,
  dotColor,
  title,
  meta,
  info,
  className = "",
}: {
  /** show a back control: a path is the cold-load fallback, `true` uses Plan */
  back?: string | boolean;
  eyebrow?: ReactNode;
  dotColor?: string;
  title: ReactNode;
  meta?: ReactNode;
  info?: ReactNode;
  className?: string;
}) {
  const [showInfo, setShowInfo] = useState(false);
  const infoId = useId();
  return (
    <header className={`mb-8 ${className}`}>
      {back ? <BackBar to={typeof back === "string" ? back : undefined} /> : null}
      {eyebrow ? (
        <p className="eyebrow mb-1.5 flex items-center gap-1.5 text-ink-faint">
          {dotColor && <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: dotColor }} />}
          {eyebrow}
        </p>
      ) : null}
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-title min-w-0">{title}</h1>
        {info && (
          <button
            type="button"
            onClick={() => setShowInfo((v) => !v)}
            aria-expanded={showInfo}
            aria-controls={infoId}
            className="-m-1 shrink-0 p-1 text-ink-faint transition-colors hover:text-ink-soft"
          >
            <Icon name="info" size={17} className={showInfo ? "text-accent" : undefined} />
            <span className="sr-only">About this page</span>
          </button>
        )}
      </div>
      {info && showInfo && <p id={infoId} className="meta mt-1.5">{info}</p>}
      {meta ? <p className="meta mt-2">{meta}</p> : null}
    </header>
  );
}
