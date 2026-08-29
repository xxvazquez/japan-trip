import { Link } from "react-router-dom";
import { Page, PageTitle } from "@/components/Page";
import { useData, lookups } from "@/lib/data";
import { fmtDate } from "@/lib/dates";

export default function Places() {
  const data = useData();
  if (!data) return null;
  const L = lookups(data);
  const loc = data.config.locale;

  return (
    <Page>
      <PageTitle kicker="Where we sleep, how we move">Places</PageTitle>

      <section className="mb-8">
        <h2 className="kicker mb-2">Stays</h2>
        <ul className="overflow-hidden rounded-xl border border-line">
          {data.legs.map((leg) => {
            const h = L.hotel(leg.hotelId);
            if (!h) return null;
            return (
              <li key={leg.id}>
                <Link to={`/hotel/${h.id}`} className="flex items-center justify-between gap-3 border-t border-line px-4 py-3 first:border-0 hover:bg-surface-2">
                  <span><span className="font-medium">{h.name}</span><span className="block text-xs text-ink-faint">{leg.base}</span></span>
                  <span className="shrink-0 text-xs text-ink-faint">{fmtDate(leg.start, loc, { day: "numeric", month: "short" })}</span>
                </Link>
              </li>
            );
          })}
          {data.legs.length === 0 && <li className="px-4 py-3 text-sm text-ink-faint">No stays yet.</li>}
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="kicker mb-2">Transport</h2>
        <ul className="overflow-hidden rounded-xl border border-line">
          {[...data.journeys].sort((a, b) => (a.date ?? "").localeCompare(b.date ?? "")).map((j) => (
            <li key={j.id}>
              <Link to={`/journey/${j.id}`} className="flex items-center justify-between gap-3 border-t border-line px-4 py-3 first:border-0 hover:bg-surface-2">
                <span className="min-w-0 truncate">
                  {j.label}
                  <span className="ml-2 text-xs capitalize text-ink-faint">{j.kind}</span>
                </span>
                <span className="shrink-0 text-xs text-ink-faint">{j.date ? fmtDate(j.date, loc, { day: "numeric", month: "short" }) : ""}</span>
              </Link>
            </li>
          ))}
          {data.journeys.length === 0 && <li className="px-4 py-3 text-sm text-ink-faint">No transport yet.</li>}
        </ul>
      </section>

      {data.luggage.length > 0 && (
        <section id="luggage">
          <h2 className="kicker mb-2">Luggage</h2>
          <ul className="space-y-2 text-sm">
            {data.luggage.map((l) => (
              <li key={l.id} className="rounded-lg border border-line px-4 py-3">
                <p className="font-medium">{l.label}</p>
                <p className="text-ink-faint">
                  Send by {fmtDate(l.sendBy, loc)} · expected {fmtDate(l.expectedArrival, loc)} · {l.status}
                </p>
                {l.notes && <p className="mt-1 text-ink-soft">{l.notes}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}
    </Page>
  );
}
