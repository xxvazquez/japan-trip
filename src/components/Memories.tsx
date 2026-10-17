import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { TripData } from "@/core/types";
import { canonicalLegs } from "@/lib/cityAssign";
import { legNights, legsWithDays, plural } from "@/lib/dates";
import { legHex } from "@/lib/legColors";
import { useTripSpent } from "@/lib/fx";
import { Icon } from "./Icon";

/** One memory: a small kicker, the big figure, a line under it — the way
 *  Fitness lays out an award. A link when there's a page behind it. */
function Card({ title, to, children }: { title: string; to?: string; children: ReactNode }) {
  const cls = "flex min-h-[10.5rem] w-[78%] max-w-[18rem] shrink-0 snap-start flex-col rounded-[12px] bg-surface p-4 md:w-auto md:max-w-none";
  const head = (
    <span className="kicker flex items-center justify-between">
      {title}
      {to && <Icon name="chevron" size={13} className="text-ink-faint" />}
    </span>
  );
  return to ? (
    <Link to={to} viewTransition className={`${cls} transition-colors duration-150 active:bg-ink/[0.07]`}>
      {head}
      {children}
    </Link>
  ) : (
    <div className={cls}>
      {head}
      {children}
    </div>
  );
}

const Big = ({ children }: { children: ReactNode }) => <span className="text-title mt-auto block pt-3 tabular-nums">{children}</span>;
const Under = ({ children }: { children: ReactNode }) => <span className="meta mt-1 block">{children}</span>;

/**
 * The trip, looked back on: a row of cards under the after-trip recap —
 * the route, the cities and their nights, how many nights in all, the places
 * on the plans, stamps and what it cost. Swipe through them on a phone (they
 * snap, the next one peeking in, as Photos' Memories do); a computer has the
 * room to lay them out as a grid. A card with nothing to say isn't drawn.
 */
export function Memories({ data }: { data: TripData }) {
  const canon = canonicalLegs(data);
  const legs = legsWithDays(data);
  const spent = useTripSpent(data);

  // nights per city, in the order you got there
  const cities = new Map<string, { name: string; color: string; nights: number }>();
  for (const leg of [...legs].sort((a, b) => a.start.localeCompare(b.start))) {
    const key = canon.get(leg.id) ?? leg.id;
    const first = data.legs.find((l) => l.id === key) ?? leg;
    const c = cities.get(key) ?? { name: first.base?.trim() || "Unnamed base", color: legHex(first.color), nights: 0 };
    c.nights += legNights(leg, legs);
    cities.set(key, c);
  }
  const nights = [...cities.values()].reduce((sum, c) => sum + c.nights, 0);
  const hotels = new Set(legs.map((l) => l.hotelId).filter(Boolean)).size;
  const places = new Set(data.days.flatMap((d) => (d.plan ?? []).map((it) => it.placeId).filter(Boolean))).size;
  const plannedDays = data.days.filter((d) => (d.plan ?? []).some((it) => it.placeId)).length;
  const stamps = data.config.stamps ?? [];
  const collected = stamps.filter((s) => s.done).length;

  return (
    <div className="-mx-5 mt-5 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:-mx-7 sm:scroll-px-7 sm:px-7 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
      {cities.size > 0 && (
        <Card title={cities.size === 1 ? "City" : "Cities"}>
          <ul className="mt-auto space-y-1.5 pt-3">
            {[...cities].map(([key, c]) => (
              <li key={key} className="flex items-baseline gap-2 text-sm">
                <span aria-hidden className="h-2 w-2 shrink-0 translate-y-[-1px] rounded-full" style={{ background: c.color }} />
                <span className="min-w-0 flex-1 break-words text-ink">{c.name}</span>
                {c.nights > 0 && <span className="shrink-0 tabular-nums text-ink-faint">{plural(c.nights, "night")}</span>}
              </li>
            ))}
          </ul>
        </Card>
      )}
      {nights > 0 && (
        <Card title="Nights">
          <Big>{nights}</Big>
          <Under>{hotels > 1 ? `in ${hotels} places to stay` : hotels === 1 ? "in one place to stay" : `in ${plural(cities.size, "city", "cities")}`}</Under>
        </Card>
      )}
      {places > 0 && (
        <Card title="Places">
          <Big>{places}</Big>
          <Under>on the plan, across {plural(plannedDays, "day")}</Under>
        </Card>
      )}
      {collected > 0 && (
        <Card title="Stamps" to="/logbook/stamps">
          <Big>
            {collected}
            <span className="text-ink-faint">/{stamps.length}</span>
          </Big>
          <Under>{collected === stamps.length ? "Every one collected" : "collected"}</Under>
        </Card>
      )}
      {spent && (
        <Card title="Spent" to="/logbook/budget">
          <Big>{spent}</Big>
          <Under>stays, fares and day spending</Under>
        </Card>
      )}
    </div>
  );
}
