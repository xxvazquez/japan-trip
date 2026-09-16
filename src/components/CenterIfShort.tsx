import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

/**
 * Centres its children vertically when they're short enough to otherwise
 * trail into empty space below — a page with one or two real cards
 * shouldn't look abandoned any more than the fully-empty state does (`Empty`
 * wraps with this too). Measures both the content's real rendered height and
 * the real space available below it — down to the bottom tab bar on mobile,
 * or the bottom of the viewport on the desktop rail, which sits beside the
 * content rather than under it — instead of a flat vh fraction, which left a
 * second, unaccounted-for gap under the centred box on a normal phone
 * viewport (the header + tab bar together take far less than half the
 * screen).
 *
 * Re-measures on every render and on window resize; the check runs in
 * `useLayoutEffect` so a page that needs centring never flashes top-aligned
 * first.
 */
export function CenterIfShort({ children }: { children: ReactNode }) {
  // Two refs, not one: `outer`'s own position in the page flow is stable
  // (set by what comes before it, never by its own height/alignment), while
  // `inner`'s natural content height stays correct regardless of how `outer`
  // aligns it. Measuring position and height off the same element would feed
  // back on itself once centring shifts that element's top — the height we
  // compute would depend on a position centring had already moved.
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [minHeight, setMinHeight] = useState<number | null>(null);

  useLayoutEffect(() => {
    const measure = () => {
      if (!outerRef.current || !innerRef.current) return;
      const top = outerRef.current.getBoundingClientRect().top;
      const tabBar = document.querySelector('nav[aria-label="Sections"]');
      const tabBarRect = tabBar?.getBoundingClientRect();
      // the desktop rail is tall and narrow (no bottom obstruction); the
      // mobile bar is short and wide (its top edge is the real bottom limit)
      const bottom = !tabBarRect || tabBarRect.width < tabBarRect.height
        ? window.innerHeight
        : tabBarRect.top;
      const available = Math.max(bottom - top, 0);
      setMinHeight(innerRef.current.scrollHeight < available ? available : null);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  });

  return (
    <div ref={outerRef} className={minHeight ? "flex flex-col justify-center" : ""} style={minHeight ? { minHeight } : undefined}>
      <div ref={innerRef}>{children}</div>
    </div>
  );
}
