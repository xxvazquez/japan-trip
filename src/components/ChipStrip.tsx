import { useEffect, useRef, useState, type ReactNode } from "react";

const FADE = 40;

/**
 * A single row of chips that scrolls sideways instead of wrapping. Each edge
 * fades out only while there's more to scroll that way, so a chip running
 * under the edge reads as "keep going", not as a clipped label — and a row
 * that fits (or has been scrolled to its end) shows every chip crisp.
 */
export function ChipStrip({ className = "", children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [more, setMore] = useState({ left: false, right: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const left = el.scrollLeft > 1;
      const right = el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
      setMore((m) => (m.left === left && m.right === right ? m : { left, right }));
    };
    el.addEventListener("scroll", update, { passive: true });
    // the strip resizing, a chip's label changing width, or chips coming and
    // going all change whether there's more to scroll
    const ro = new ResizeObserver(update);
    const watch = () => {
      ro.disconnect();
      ro.observe(el);
      for (const c of el.children) ro.observe(c);
      update();
    };
    watch();
    const mo = new MutationObserver(watch);
    mo.observe(el, { childList: true });
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
      mo.disconnect();
    };
  }, []);

  const mask =
    more.left || more.right
      ? `linear-gradient(to right, ${more.left ? `transparent, black ${FADE}px` : "black"}, ${more.right ? `black calc(100% - ${FADE}px), transparent` : "black"})`
      : undefined;

  return (
    <div
      ref={ref}
      style={{ maskImage: mask, WebkitMaskImage: mask }}
      className={`-mx-1 flex gap-1.5 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`}
    >
      {children}
    </div>
  );
}
