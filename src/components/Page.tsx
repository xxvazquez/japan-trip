import type { ReactNode } from "react";
import { BackBar } from "./BackBar";

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
 *   • detail page (Day / Journey / Hotel / Leg) — `back` + `eyebrow`
 *     (a date, a stay span, "Stay") + `title`
 *   • section page (Logbook / Manage) — `title` alone, optional `meta`, no
 *     `back`, no `eyebrow`: the tab bar already says where you are
 *
 * `title` takes a node so a page can drop an <Editable> straight in. Two routes
 * deliberately don't use this: Plan (its "NOW" countdown block stands in for a
 * title) and Map (full-bleed, no reading column).
 */
export function PageHeader({
  back,
  eyebrow,
  dotColor,
  title,
  meta,
  className = "",
}: {
  /** show a back control: a path is the cold-load fallback, `true` uses Plan */
  back?: string | boolean;
  eyebrow?: ReactNode;
  dotColor?: string;
  title: ReactNode;
  meta?: ReactNode;
  className?: string;
}) {
  return (
    <header className={`mb-8 ${className}`}>
      {back ? <BackBar to={typeof back === "string" ? back : undefined} /> : null}
      {eyebrow ? (
        <p className="eyebrow mb-1.5 flex items-center gap-1.5 text-ink-faint">
          {dotColor && <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: dotColor }} />}
          {eyebrow}
        </p>
      ) : null}
      <h1 className="text-title">{title}</h1>
      {meta ? <p className="meta mt-2">{meta}</p> : null}
    </header>
  );
}
