import { useLayoutEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useData } from "@/lib/data";
import { useClock, useToday } from "@/lib/useToday";
import { fmtIn, minutesUntil, nextOnDay } from "@/lib/upNext";
import { fmtClock } from "@/lib/time";
import { Icon } from "./Icon";

/**
 * While the trip is on, what's up next today rides above the tab bar on every
 * screen — iOS 26's tab bar accessory, the glass capsule Music keeps its Now
 * Playing in, used here the way a Live Activity counts down to a departure.
 * Tap it for today. It stands aside on today's own page (which has its own
 * Up next card) and on the Map (whose sheet owns the foot of the screen).
 *
 * It reports its height as `--accessory-h`, which `--tabbar-clear` adds, so
 * page ends and the Undo toast sit above it rather than under it.
 */
export function UpNextPill({ besidePane }: { besidePane?: boolean }) {
  const data = useData();
  const today = useToday();
  const now = useClock(true);
  const { pathname } = useLocation();
  const next = data ? nextOnDay(data, today, now) : null;
  const shown = !!next && !pathname.startsWith("/map") && pathname !== `/day/${next.day.id}`;

  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const root = document.documentElement.style;
    const el = ref.current;
    if (!shown || !el) {
      root.removeProperty("--accessory-h");
      return;
    }
    const measure = () => root.setProperty("--accessory-h", `${el.offsetHeight + 8}px`);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      ro.disconnect();
      root.removeProperty("--accessory-h");
    };
  }, [shown]);

  if (!shown) return null;
  return (
    <div
      className={`tabbar-float pointer-events-none fixed inset-x-0 bottom-[calc(var(--tabbar-bottom)+var(--tabbar-h)+0.5rem)] z-30 flex justify-center px-3 md:bottom-6 md:pl-[72px] ${besidePane ? "md:pr-[calc(var(--pane-w)+0.75rem)]" : ""}`}
    >
      <div ref={ref} className="pointer-events-auto w-full max-w-md">
        <Link
          to={`/day/${next.day.id}`}
          className="glass flex min-h-[52px] motion-safe:animate-fade-in items-center gap-3 rounded-[26px] py-1.5 pl-1.5 pr-4 text-ink transition-transform duration-150 active:scale-[0.98]"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent text-white dark:text-bg">
            <Icon name="clock" size={20} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block break-words text-[15px] leading-snug">{next.title}</span>
            <span className="block text-xs leading-snug text-ink-faint">Up next · {fmtClock(next.time)}</span>
          </span>
          <span className="shrink-0 text-[15px] tabular-nums text-accent">{fmtIn(minutesUntil(next.time, now))}</span>
        </Link>
      </div>
    </div>
  );
}
