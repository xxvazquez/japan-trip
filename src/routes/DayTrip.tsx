import { useParams, Link } from "react-router-dom";
import { Page, PageTitle } from "@/components/Page";
import { useData, lookups } from "@/lib/data";

export default function DayTrip() {
  const data = useData();
  const { id } = useParams();
  if (!data) return null;
  const t = lookups(data).dayTrip(id);
  if (!t)
    return (
      <Page>
        <PageTitle>Day trip not found</PageTitle>
        <Link to="/explore" className="text-accent">Back to Explore</Link>
      </Page>
    );

  const s = t.stats;
  const stat = (label: string, value: string) => (
    <div key={label}><dt className="text-ink-faint">{label}</dt><dd>{value}</dd></div>
  );

  return (
    <Page>
      <PageTitle kicker={`Day trip · ${t.city}`}>{t.name}</PageTitle>
      <p className="text-lg leading-relaxed text-ink-soft">{t.blurb}</p>

      <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
        {stat("Travel time", `${s.travelTimeMin} min each way`)}
        {s.walkKm != null && stat("On foot", `~${s.walkKm} km`)}
        {stat("Difficulty", s.difficulty)}
        {stat("Reservation", s.reservation)}
        {s.lastTrainBack && <div className="col-span-2"><dt className="text-ink-faint">Last way back</dt><dd>{s.lastTrainBack}</dd></div>}
        {s.elevationNote && <div className="col-span-2"><dt className="text-ink-faint">Terrain</dt><dd>{s.elevationNote}</dd></div>}
        {s.weatherNote && <div className="col-span-2"><dt className="text-ink-faint">Weather</dt><dd>{s.weatherNote}</dd></div>}
      </dl>

      <Section title="Getting there" items={t.getThere} />
      <Section title="Coming back" items={t.returnOptions} />

      <section className="mt-6">
        <h2 className="kicker mb-2">See</h2>
        <ul className="space-y-1.5 text-sm">
          {t.see.map((x, i) => (
            <li key={i} className="border-t border-line pt-1.5 first:border-0 first:pt-0">
              <span className="font-medium">{x.name}</span>
              {x.note && <span className="text-ink-faint"> — {x.note}</span>}
            </li>
          ))}
        </ul>
      </section>

      {t.eat.length > 0 && (
        <section className="mt-6">
          <h2 className="kicker mb-2">Eat</h2>
          <ul className="space-y-1.5 text-sm">
            {t.eat.map((x, i) => (
              <li key={i} className="border-t border-line pt-1.5 first:border-0 first:pt-0">
                <span className="font-medium">{x.name}</span>
                {x.note && <span className="text-ink-faint"> — {x.note}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}
    </Page>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  if (!items?.length) return null;
  return (
    <section className="mt-6">
      <h2 className="kicker mb-2">{title}</h2>
      <ul className="space-y-1 text-sm text-ink-soft">
        {items.map((x, i) => (
          <li key={i}>{x}</li>
        ))}
      </ul>
    </section>
  );
}
