import { useParams, Link } from "react-router-dom";
import { Page, PageTitle } from "@/components/Page";
import { useData, lookups } from "@/lib/data";
import { fmtDate } from "@/lib/dates";

export default function Day() {
  const data = useData();
  const { date } = useParams();
  if (!data) return null;
  const L = lookups(data);
  const day = L.day(date);
  if (!day)
    return (
      <Page>
        <PageTitle>Day not found</PageTitle>
        <Link to="/itinerary" className="text-accent">Back to the itinerary</Link>
      </Page>
    );

  const season = L.seasonal(day.date);
  const hotel = L.hotel(day.hotelId);
  const loc = data.config.locale;
  const blocks: [string, typeof day.morning][] = [
    ["Morning", day.morning],
    ["Afternoon", day.afternoon],
    ["Evening", day.evening],
  ];

  return (
    <Page>
      <PageTitle kicker={`${fmtDate(day.date, loc, { weekday: "long", day: "numeric", month: "long" })} · ${day.city}`}>
        {day.title ?? fmtDate(day.date, loc)}
      </PageTitle>
      {day.summary && <p className="text-lg leading-relaxed text-ink-soft">{day.summary}</p>}

      <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
        {hotel && <div><dt className="text-ink-faint">Staying</dt><dd><Link to={`/hotel/${hotel.id}`} className="text-accent">{hotel.name}</Link></dd></div>}
        {day.journeyId && <div><dt className="text-ink-faint">Transport</dt><dd><Link to={`/journey/${day.journeyId}`} className="text-accent">See route</Link></dd></div>}
        {day.dayTripId && <div><dt className="text-ink-faint">Day trip</dt><dd><Link to={`/day-trip/${day.dayTripId}`} className="text-accent">Guide</Link></dd></div>}
        {season && (
          <>
            <div><dt className="text-ink-faint">Sunset</dt><dd>{season.sunset}</dd></div>
            <div><dt className="text-ink-faint">Temperature</dt><dd>{season.tempC[0]}–{season.tempC[1]} °C</dd></div>
            {season.koyo && <div><dt className="text-ink-faint">Foliage</dt><dd className="capitalize">{season.koyo.replace("-", " ")}</dd></div>}
          </>
        )}
      </dl>

      {(day.weatherNote || day.packingReminder) && (
        <div className="mt-4 space-y-1 rounded-lg border border-line px-4 py-3 text-sm text-ink-soft">
          {day.weatherNote && <p>{day.weatherNote}</p>}
          {day.packingReminder && <p className="text-accent">{day.packingReminder}</p>}
        </div>
      )}

      {blocks.map(([label, items]) =>
        items && items.length ? (
          <section key={label} className="mt-6">
            <h2 className="kicker mb-2">{label}</h2>
            <ul className="space-y-2">
              {items.map((it, i) => (
                <li key={i} className="flex gap-3 border-t border-line pt-2 first:border-0 first:pt-0">
                  {it.time && <span className="w-12 shrink-0 text-sm tabular-nums text-ink-faint">{it.time}</span>}
                  <span>
                    <span className="font-medium">{it.title}</span>
                    {it.note && <span className="block text-sm text-ink-faint">{it.note}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ) : null,
      )}
    </Page>
  );
}
