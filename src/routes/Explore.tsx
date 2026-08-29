import { Link } from "react-router-dom";
import { Page, PageTitle } from "@/components/Page";
import { useData, lookups } from "@/lib/data";

export default function Explore() {
  const data = useData();
  if (!data) return null;
  const L = lookups(data);

  return (
    <Page>
      <PageTitle kicker="What we want to seek out">Explore</PageTitle>

      {data.collections.length > 0 && (
        <section className="mb-8">
          <h2 className="kicker mb-2">Collections</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {data.collections.map((c) => (
              <li key={c.id}>
                <Link to={`/collection/${c.id}`} className="block h-full rounded-xl border border-line p-4 hover:bg-surface-2">
                  <p className="font-display text-lg">{c.title}</p>
                  {c.subtitle && <p className="text-xs text-ink-faint">{c.subtitle}</p>}
                  <p className="mt-1 text-xs text-ink-faint">{L.placesInCollection(c.id).length} places</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {data.dayTrips.length > 0 && (
        <section>
          <h2 className="kicker mb-2">Day trips</h2>
          <ul className="overflow-hidden rounded-xl border border-line">
            {data.dayTrips.map((t) => (
              <li key={t.id}>
                <Link to={`/day-trip/${t.id}`} className="flex items-center justify-between gap-3 border-t border-line px-4 py-3 first:border-0 hover:bg-surface-2">
                  <span>{t.name}{t.nameJp && <span className="ml-2 text-sm text-ink-faint font-jp">{t.nameJp}</span>}</span>
                  <span className="shrink-0 text-xs capitalize text-ink-faint">{t.stats.difficulty}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {data.collections.length === 0 && data.dayTrips.length === 0 && (
        <p className="text-ink-faint">Nothing here yet — add collections and day trips in <Link to="/manage" className="text-accent">Manage</Link>.</p>
      )}
    </Page>
  );
}
