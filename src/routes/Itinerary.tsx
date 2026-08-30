import { Link } from "react-router-dom";
import { Page, PageTitle } from "@/components/Page";
import { TimelineRibbon } from "@/components/TimelineRibbon";
import { Icon } from "@/components/Icon";
import { useData } from "@/lib/data";
import { useApp } from "@/store/useApp";
import { fmtDate, tripClock, dayKind, type DerivedDayKind } from "@/lib/dates";
import { legHex } from "@/lib/legColors";

const KIND_TAG: Partial<Record<DerivedDayKind, string>> = {
  arrival: "Arrive",
  travel: "Travel",
  daytrip: "Day trip",
  departure: "Fly home",
};

export default function Itinerary() {
  const data = useData();
  const addEntity = useApp((s) => s.addEntity);
  if (!data) return null;
  const clock = tripClock(data);
  const loc = data.config.locale;

  return (
    <Page>
      <PageTitle kicker="The trip, at any zoom">Itinerary</PageTitle>

      <div className="mb-8">
        <TimelineRibbon />
      </div>

      <div className="space-y-8">
        {data.legs.map((leg) => {
          const legDays = data.days.filter((d) => d.legId === leg.id);
          return (
            <section key={leg.id}>
              <div className="mb-2">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: legHex(leg.color) }} />
                  <h2 className="font-display text-xl">{leg.base}</h2>
                  {leg.nameJp && <span className="text-sm text-ink-faint font-jp">{leg.nameJp}</span>}
                </div>
                <span className="ml-[18px] text-xs text-ink-faint">
                  {fmtDate(leg.start, loc, { day: "numeric", month: "short" })} – {fmtDate(leg.end, loc, { day: "numeric", month: "short" })}
                </span>
              </div>
              <ul className="overflow-hidden rounded-xl border border-line">
                {legDays.map((d) => (
                  <li key={d.date}>
                    <Link
                      to={`/day/${d.date}`}
                      className={`flex items-center gap-3 border-t border-line px-4 py-3 first:border-0 hover:bg-surface-2 ${
                        d.date === clock.todayISO ? "bg-accent/5" : ""
                      }`}
                    >
                      <span className="w-14 shrink-0 text-xs tabular-nums text-ink-faint">
                        {fmtDate(d.date, loc, { weekday: "short", day: "numeric" })}
                      </span>
                      <span className="min-w-0 flex-1 truncate">{d.title || d.summary || "—"}</span>
                      {KIND_TAG[dayKind(d, data)] && (
                        <span className="shrink-0 rounded-full bg-surface-2 px-2 py-0.5 text-2xs uppercase tracking-wide text-ink-faint">
                          {KIND_TAG[dayKind(d, data)]}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
                {legDays.length === 0 && <li className="px-4 py-3 text-sm text-ink-faint">No days in this leg.</li>}
              </ul>
            </section>
          );
        })}

        {data.legs.length === 0 && (
          <p className="text-ink-faint">
            No legs yet — add them in <Link to="/manage" className="text-accent">Manage → Content</Link>.
          </p>
        )}

        <button
          onClick={() => {
            const last = data.days.at(-1);
            const next = last
              ? new Date(new Date(last.date).getTime() + 86400000).toISOString().slice(0, 10)
              : data.meta.start;
            addEntity("days", {
              id: next,
              date: next,
              kind: "base",
              city: last?.city ?? "",
              legId: last?.legId ?? data.legs.at(-1)?.id ?? "",
              title: "New day",
            } as never);
          }}
          className="flex items-center gap-1.5 text-sm text-ink-faint hover:text-accent"
        >
          <Icon name="plus" size={14} /> Add a day
        </button>
      </div>
    </Page>
  );
}
