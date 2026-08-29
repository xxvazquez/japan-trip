import type { ReactNode } from "react";

/**
 * Standard reading column. Pages that open with a full-bleed hero render the
 * <Hero> outside <Page> and wrap the rest in <Page>.
 */
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

export function PageTitle({ kicker, children }: { kicker?: string; children: ReactNode }) {
  return (
    <header className="mb-7">
      {kicker && <p className="kicker mb-2">{kicker}</p>}
      <h1 className="text-display">{children}</h1>
    </header>
  );
}
