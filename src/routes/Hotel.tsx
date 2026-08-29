import { useParams, Link } from "react-router-dom";
import { Page, PageTitle } from "@/components/Page";
import { useData, lookups } from "@/lib/data";

export default function Hotel() {
  const data = useData();
  const { id } = useParams();
  if (!data) return null;
  const hotel = lookups(data).hotel(id);
  if (!hotel)
    return (
      <Page>
        <PageTitle>Stay not found</PageTitle>
        <Link to="/places" className="text-accent">Back to Places</Link>
      </Page>
    );

  return (
    <Page>
      <PageTitle kicker="Stay">{hotel.name}</PageTitle>
      {hotel.notes && <p className="text-lg leading-relaxed text-ink-soft">{hotel.notes}</p>}

      <dl className="mt-6 space-y-2 text-sm">
        {hotel.address && <div><dt className="text-ink-faint">Address</dt><dd>{hotel.address}</dd></div>}
        <div><dt className="text-ink-faint">Check-in / out</dt><dd>{hotel.checkIn ?? "—"} / {hotel.checkOut ?? "—"}</dd></div>
        <div>
          <dt className="text-ink-faint">From the station</dt>
          <dd>
            {hotel.access.stationWalkMin ?? "—"} min walk · {hotel.access.grade ?? "—"} ·{" "}
            {hotel.access.elevator ? "lift available" : "no lift"}
          </dd>
        </div>
        {hotel.wifi && <div><dt className="text-ink-faint">Wi-Fi</dt><dd>{hotel.wifi}</dd></div>}
        {hotel.doorCode && <div><dt className="text-ink-faint">Door code</dt><dd>{hotel.doorCode}</dd></div>}
      </dl>

      {hotel.nearby.length > 0 && (
        <section className="mt-6">
          <h2 className="kicker mb-2">Nearby</h2>
          <ul className="space-y-1.5 text-sm">
            {hotel.nearby.map((n, i) => (
              <li key={i} className="flex justify-between gap-4 border-t border-line pt-1.5 first:border-0 first:pt-0">
                <span>{n.brand ?? n.name}<span className="text-ink-faint"> · {n.type}</span></span>
                {n.walkMin != null && <span className="shrink-0 text-ink-faint">{n.walkMin} min</span>}
              </li>
            ))}
          </ul>
        </section>
      )}
    </Page>
  );
}
