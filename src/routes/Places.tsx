import { Link, useParams, useNavigate } from "react-router-dom";
import { Page, PageTitle } from "@/components/Page";
import { Field } from "@/components/Field";
import { Editable } from "@/components/Editable";
import { Icon } from "@/components/Icon";
import { MyMapEmbed, OpenInMaps } from "@/components/PlaceMap";
import { useData, lookups } from "@/lib/data";
import { useApp } from "@/store/useApp";
import { fmtDate } from "@/lib/dates";
import type { LuggageShipment, LuggageStatus } from "@/core/types";

const TABS = ["stays", "transport", "luggage", "map"] as const;
type Tab = (typeof TABS)[number];

export default function Places() {
  const data = useData();
  const { tab: rawTab } = useParams();
  const nav = useNavigate();
  if (!data) return null;
  const tab: Tab = (TABS as readonly string[]).includes(rawTab ?? "") ? (rawTab as Tab) : "stays";

  return (
    <Page>
      <PageTitle kicker="Where we sleep, how we move">Places</PageTitle>
      <div className="mb-6 flex gap-1 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => nav(t === "stays" ? "/places" : `/places/${t}`)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm capitalize transition-colors ${
              tab === t ? "bg-accent/10 text-accent" : "text-ink-faint hover:bg-surface-2"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      {tab === "stays" && <Stays />}
      {tab === "transport" && <Transport />}
      {tab === "luggage" && <Luggage />}
      {tab === "map" && <MapHub />}
    </Page>
  );
}

function Stays() {
  const data = useData()!;
  const L = lookups(data);
  const loc = data.config.locale;
  return (
    <ul className="overflow-hidden rounded-xl border border-line">
      {data.legs.map((leg) => {
        const h = L.hotel(leg.hotelId);
        if (!h) return null;
        const nights = Math.max(0, Math.round((new Date(leg.end).getTime() - new Date(leg.start).getTime()) / 86400000));
        return (
          <li key={leg.id}>
            <Link to={`/hotel/${h.id}`} className="flex items-center justify-between gap-3 border-t border-line px-4 py-3.5 first:border-0 hover:bg-surface-2">
              <span className="min-w-0">
                <span className="font-medium">{h.name}</span>
                <span className="block text-xs text-ink-faint">{leg.base} · {nights} {nights === 1 ? "night" : "nights"}</span>
              </span>
              <span className="shrink-0 text-xs text-ink-faint">{fmtDate(leg.start, loc, { day: "numeric", month: "short" })}</span>
            </Link>
          </li>
        );
      })}
      {data.legs.length === 0 && <li className="px-4 py-3 text-sm text-ink-faint">No stays yet.</li>}
    </ul>
  );
}

function Transport() {
  const data = useData()!;
  const loc = data.config.locale;
  const sorted = [...data.journeys].sort((a, b) => (a.date ?? "").localeCompare(b.date ?? ""));
  return (
    <ul className="overflow-hidden rounded-xl border border-line">
      {sorted.map((j) => (
        <li key={j.id}>
          <Link to={`/journey/${j.id}`} className="flex items-center justify-between gap-3 border-t border-line px-4 py-3.5 first:border-0 hover:bg-surface-2">
            <span className="min-w-0">
              <span className="font-medium">{j.label}</span>
              <span className="block text-xs capitalize text-ink-faint">
                {j.kind} · {j.segments.map((s) => s.mode).join(" + ") || "no segments"}
              </span>
            </span>
            <span className="shrink-0 text-xs text-ink-faint">{j.date ? fmtDate(j.date, loc, { day: "numeric", month: "short" }) : ""}</span>
          </Link>
        </li>
      ))}
      {data.journeys.length === 0 && <li className="px-4 py-3 text-sm text-ink-faint">No transport yet.</li>}
    </ul>
  );
}

const STATUSES: LuggageStatus[] = ["planned", "sent", "in-transit", "delivered"];

function Luggage() {
  const data = useData()!;
  const L = lookups(data);
  const updateEntity = useApp((s) => s.updateEntity);

  if (data.luggage.length === 0)
    return <p className="text-sm text-ink-faint">No shipments. Add them in Manage → Content.</p>;

  return (
    <div className="space-y-6">
      {data.luggage.map((s) => {
        const from = L.hotel(s.fromHotelId);
        const to = L.hotel(s.toHotelId);
        const p = (patch: Partial<LuggageShipment>) => updateEntity<LuggageShipment>("luggage", s.id, patch);
        return (
          <div key={s.id} className="rounded-xl border border-line p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-medium">
                <Editable label="Shipment label" value={s.label} onCommit={(v) => p({ label: v || s.label })} />
              </h3>
              <select
                value={s.status}
                onChange={(e) => p({ status: e.target.value as LuggageStatus })}
                className="rounded-full border border-line bg-surface px-2.5 py-1 text-xs capitalize"
              >
                {STATUSES.map((st) => <option key={st} value={st}>{st}</option>)}
              </select>
            </div>

            <div className="my-3 flex items-center gap-2 text-sm">
              {from ? <Link to={`/hotel/${from.id}`} className="text-accent">{from.name}</Link> : <span className="text-ink-faint">from?</span>}
              <span className="flex-1 border-t border-dashed border-line" />
              <Icon name="places" size={14} className="text-ink-faint" />
              <span className="flex-1 border-t border-dashed border-line" />
              {to ? <Link to={`/hotel/${to.id}`} className="text-accent">{to.name}</Link> : <span className="text-ink-faint">to?</span>}
            </div>

            <Field label="Carrier" value={s.carrier} onCommit={(v) => p({ carrier: v })} />
            <Field label="Send by" value={s.sendBy} onCommit={(v) => p({ sendBy: v })} />
            <Field label="Expected arrival" value={s.expectedArrival} onCommit={(v) => p({ expectedArrival: v })} />
            <Field label="Tracking number" value={s.trackingNo ?? ""} onCommit={(v) => p({ trackingNo: v || undefined })} />
            <Field label="Office address" value={s.officeAddress ?? ""} onCommit={(v) => p({ officeAddress: v || undefined })} />

            <p className="mt-3 text-2xs uppercase tracking-wide text-ink-faint">Notes</p>
            <p className="text-sm text-ink-soft">
              <Editable as="textarea" label="Notes" value={s.notes ?? ""} placeholder="Plan for this shipment" onCommit={(v) => p({ notes: v || undefined })} />
            </p>
          </div>
        );
      })}
      <p className="text-xs text-ink-faint">
        On transfer days with a shipment, pack an overnight bag — the big cases arrive a day later.
      </p>
    </div>
  );
}

function MapHub() {
  const data = useData()!;
  const byCity = new Map<string, typeof data.places>();
  for (const p of data.places) {
    if (p.kind === "station") continue;
    const arr = byCity.get(p.city) ?? [];
    arr.push(p);
    byCity.set(p.city, arr);
  }

  return (
    <div className="space-y-8">
      <MyMapEmbed height={360} />
      {[...byCity.entries()].map(([city, list]) => (
        <section key={city}>
          <h2 className="kicker mb-2">{city}</h2>
          <ul>
            {list.map((p) => (
              <li key={p.id} className="flex items-center gap-3 border-t border-line py-2 text-sm first:border-0">
                <span className="min-w-0 flex-1">
                  {p.name}
                  {p.nameJp && <span className="text-ink-faint font-jp"> {p.nameJp}</span>}
                  <span className="block text-xs capitalize text-ink-faint">{p.kind}{p.area ? ` · ${p.area}` : ""}</span>
                </span>
                <OpenInMaps target={{ loc: p.loc, query: p.gmapsQuery, name: p.name }} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
