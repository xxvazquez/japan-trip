import { Link } from "react-router-dom";
import { Page, PageTitle } from "@/components/Page";
import { useData } from "@/lib/data";
import { fmtDate, tripClock } from "@/lib/dates";

const KIND_TAG: Record<string, string> = {
  arrival: "Arrive",
  travel: "Travel",
  daytrip: "Day trip",
  departure: "Fly home",
  base: "",
};

export default function Itinerary() {
  const data = useData();
  if (!data) return null;
  const clock = tripClock(data);
  const loc = data.config.locale;

  return (
    <Page>
      <PageTitle kicker="The trip, at any zoom">Itinerary</PageTitle>

      <div className="space-y-8">
        {data.legs.map((leg) => {
          const legDays = data.days.filter((d) => d.legId === leg.id);
          return (
            <section key={leg.id}>
              <div className="mb-2 flex items-baseline justify-between">
                <h2 className="font-display text-xl">
                  {leg.base}
                  {leg.nameJp && <span className="ml-2 text-sm text-ink-faint font-jp">{leg.nameJp}</span>}
                </h2>
                <span className="text-xs text-ink-faint">
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
                      <span className="min-w-0 flex-1 truncate">{d.title ?? d.summary}</span>
                      {KIND_TAG[d.kind] && (
                        <span className="shrink-0 rounded-full bg-surface-2 px-2 py-0.5 text-2xs uppercase tracking-wide text-ink-faint">
                          {KIND_TAG[d.kind]}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
                {legDays.length === 0 && <li className="px-4 py-3 text-sm text-ink-faint">No days yet.</li>}
              </ul>
            </section>
          );
        })}
        {data.legs.length === 0 && (
          <p className="text-ink-faint">
            No legs yet. Add them in <Link to="/manage" className="text-accent">Manage</Link>.
          </p>
        )}
      </div>
    </Page>
  );
}
