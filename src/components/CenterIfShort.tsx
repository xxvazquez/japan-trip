import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

/**
 * Centres its children vertically when they're short enough to otherwise
 * trail into empty space below — a page with one or two real cards
 * shouldn't look abandoned any more than the fully-empty state does (see
 * `Empty`, which uses the same `min-h-[52vh]`). Measures the actual
 * rendered height rather than guessing from an item count: a Logbook card's
 * height depends on what the user put in it (a note, a date, a link), so a
 * count-based threshold is right for one page and wrong for the next.
 *
 * Re-measures on every render and on window resize; the check runs in
 * `useLayoutEffect` so a page that needs centring never flashes top-aligned
 * first.
 */
export function CenterIfShort({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [short, setShort] = useState(false);

  useLayoutEffect(() => {
    const measure = () => {
      if (ref.current) setShort(ref.current.scrollHeight < window.innerHeight * 0.52);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  });

  return (
    <div className={short ? "flex min-h-[52vh] flex-col justify-center" : ""}>
      <div ref={ref}>{children}</div>
    </div>
  );
}
