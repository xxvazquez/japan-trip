import { useParams, Link } from "react-router-dom";
import { Page, PageTitle } from "@/components/Page";
import { useData, lookups } from "@/lib/data";
import { fmtDate, fmtInZone } from "@/lib/dates";
import { Icon, type IconName } from "@/components/Icon";
import type { TransportMode } from "@/core/types";

const MODE_ICON: Record<TransportMode, IconName> = {
  flight: "external",
  train: "train",
  bus: "train",
  ferry: "train",
  car: "train",
  taxi: "train",
  subway: "train",
  walk: "places",
};

export default function Journey() {
  const data = useData();
  const { id } = useParams();
  if (!data) return null;
  const j = lookups(data).journey(id);
  if (!j)
    return (
      <Page>
        <PageTitle>Journey not found</PageTitle>
        <Link to="/places" className="text-accent">Back to Places</Link>
      </Page>
    );

  const loc = data.config.locale;
  const lug = lookups(data).luggage(j.luggageShipmentId);

  return (
    <Page>
      <PageTitle kicker={`${cap(j.kind)}${j.date ? ` · ${fmtDate(j.date, loc)}` : ""}`}>{j.label}</PageTitle>

      <ol className="mt-4 space-y-3">
        {j.segments.map((s) => (
          <li key={s.id} className="rounded-xl border border-line p-4">
            <div className="flex items-center gap-2 text-sm">
              <Icon name={MODE_ICON[s.mode]} size={16} className="text-ink-faint" />
              <span className="font-medium">{s.from}</span>
              <span className="text-ink-faint">→</span>
              <span className="font-medium">{s.to}</span>
            </div>
            <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-ink-soft">
              {s.depart && <div><dt className="inline text-ink-faint">Depart </dt><dd className="inline">{fmtInZone(s.depart, s.fromTz ?? data.config.tripTimeZone, loc)}</dd></div>}
              {s.arrive && <div><dt className="inline text-ink-faint">Arrive </dt><dd className="inline">{fmtInZone(s.arrive, s.toTz ?? data.config.tripTimeZone, loc)}</dd></div>}
              {(s.carrier || s.service) && <div className="col-span-2"><dt className="inline text-ink-faint">Service </dt><dd className="inline">{[s.carrier, s.service].filter(Boolean).join(" · ") || "—"}</dd></div>}
              {s.platform && <div className="col-span-2"><dt className="inline text-ink-faint">Platform </dt><dd className="inline">{s.platform}</dd></div>}
              {s.fare && <div><dt className="inline text-ink-faint">Fare </dt><dd className="inline">{s.fare}</dd></div>}
              {s.seat && <div><dt className="inline text-ink-faint">Seat </dt><dd className="inline">{s.seat}</dd></div>}
              {s.bookingRef && <div><dt className="inline text-ink-faint">Ref </dt><dd className="inline">{s.bookingRef}</dd></div>}
              {s.reserved != null && <div><dt className="inline text-ink-faint">Reserved </dt><dd className="inline">{s.reserved ? "yes" : "no"}</dd></div>}
            </dl>
            {s.note && <p className="mt-2 text-sm text-ink-faint">{s.note}</p>}
          </li>
        ))}
      </ol>

      {j.access && (
        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
          {j.access.stationWalkMin != null && <div><dt className="text-ink-faint">In-station walk</dt><dd>{j.access.stationWalkMin} min</dd></div>}
          {j.access.grade && <div><dt className="text-ink-faint">Underfoot</dt><dd className="capitalize">{j.access.grade}</dd></div>}
          <div><dt className="text-ink-faint">Lifts</dt><dd>{j.access.elevator ? "yes" : "no"}</dd></div>
          <div><dt className="text-ink-faint">Changes</dt><dd>{j.access.connections ?? Math.max(0, j.segments.length - 1)}</dd></div>
        </dl>
      )}

      {lug && (
        <div className="mt-6 rounded-lg border border-line px-4 py-3 text-sm">
          <p className="kicker mb-1">Luggage this day</p>
          <p>{lug.label} — send by {fmtDate(lug.sendBy, loc)}, expected {fmtDate(lug.expectedArrival, loc)}.</p>
        </div>
      )}

      {j.steps && j.steps.length > 0 && (
        <section className="mt-6">
          <h2 className="kicker mb-2">Steps</h2>
          <ol className="space-y-2 text-sm">
            {j.steps.map((s, i) => (
              <li key={i} className="border-t border-line pt-2 first:border-0 first:pt-0">
                <span className="font-medium">{s.title}</span>
                {s.detail && <span className="block text-ink-faint">{s.detail}</span>}
              </li>
            ))}
          </ol>
        </section>
      )}

      {j.backupRoute && (
        <section className="mt-6">
          <h2 className="kicker mb-1">Backup route</h2>
          <p className="text-sm text-ink-soft">{j.backupRoute}</p>
        </section>
      )}

      {j.notes && <p className="mt-6 text-sm text-ink-faint">{j.notes}</p>}
    </Page>
  );
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
