import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useData } from "@/lib/data";
import { tripClock, fmtDate, parseISO } from "@/lib/dates";
import { legHex } from "@/lib/legColors";
import { Icon, type IconName } from "./Icon";

const KIND_ICON: Partial<Record<string, IconName>> = {
  travel: "train",
  arrival: "external",
  departure: "external",
  daytrip: "explore",
};

/** A horizontal, colour-banded strip of every day. Tap a day to open it. */
export function TimelineRibbon() {
  const data = useData();
  const clock = data ? tripClock(data) : null;
  const scroller = useRef<HTMLOListElement>(null);
  const todayEl = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    todayEl.current?.scrollIntoView({ inline: "center", block: "nearest" });
  }, []);

  if (!data) return null;
  const loc = data.config.locale;
  const legOf = (legId: string) => data.legs.find((l) => l.id === legId);

  return (
    <div className="relative">
      <ol
        ref={scroller}
        className="flex snap-x gap-1.5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {data.days.map((d) => {
          const isToday = d.date === clock?.todayISO;
          const leg = legOf(d.legId);
          const icon = KIND_ICON[d.kind];
          const dt = parseISO(d.date);
          return (
            <li key={d.date} className="snap-start">
              <Link
                ref={isToday ? todayEl : undefined}
                to={`/day/${d.date}`}
                className={`relative flex w-[50px] flex-col items-center gap-0.5 rounded-lg border px-1 pb-1.5 pt-2 transition-colors hover:bg-surface-2 ${
                  isToday ? "border-accent bg-accent/5" : "border-line"
                }`}
                title={d.title ?? fmtDate(d.date, loc)}
              >
                {icon && (
                  <span
                    className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full text-white"
                    style={{ background: legHex(leg?.color) }}
                  >
                    <Icon name={icon} size={9} strokeWidth={2.4} />
                  </span>
                )}
                <span className="text-[9px] uppercase tracking-wide text-ink-faint">
                  {dt.toLocaleDateString(loc, { weekday: "short" })}
                </span>
                <span className="text-sm font-medium tabular-nums">{dt.getDate()}</span>
                <span className="mt-0.5 h-[3px] w-6 rounded-full" style={{ background: legHex(leg?.color) }} />
              </Link>
            </li>
          );
        })}
      </ol>
      <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-bg to-transparent" />
    </div>
  );
}
