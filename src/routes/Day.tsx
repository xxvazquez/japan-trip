import { useParams, Link } from "react-router-dom";
import { Page } from "@/components/Page";
import { BackBar } from "@/components/BackBar";
import { Editable } from "@/components/Editable";
import { Icon } from "@/components/Icon";
import { useData, lookups } from "@/lib/data";
import { useApp } from "@/store/useApp";
import { useReadOnly } from "@/lib/readonly";
import { fmtDate } from "@/lib/dates";
import { legHex } from "@/lib/legColors";
import { gmapsLink } from "@/lib/maps";
import type { Day as DayT, DayPlace } from "@/core/types";

const rid = () => Math.random().toString(36).slice(2, 9);

export default function Day() {
  const data = useData();
  const { id } = useParams();
  const updateEntity = useApp((s) => s.updateEntity);
  const ro = useReadOnly();
  if (!data) return null;

  const L = lookups(data);
  const day = L.day(id);
  if (!day)
    return (
      <Page>
        <BackBar to="/" />
        <p className="lead">No day here.</p>
      </Page>
    );

  const patch = (p: Partial<DayT>) => updateEntity<DayT>("days", day.id, p);
  const leg = L.leg(day.legId);
  const hotel = L.hotel(day.hotelId);
  const journey = L.journey(day.journeyId);
  const loc = data.config.locale;
  const setPlaces = (next: DayPlace[]) => patch({ places: next });

  return (
    <Page>
      <BackBar to="/" />

      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: legHex(leg?.color) }} />
        <p className="kicker">{fmtDate(day.date, loc, { weekday: "long", day: "numeric", month: "long" })}</p>
      </div>
      <h1 className="mt-1 font-display text-[1.75rem] leading-tight">
        <Editable label="Day title" value={day.title ?? ""} placeholder="Untitled day" onCommit={(v) => patch({ title: v || undefined })} />
      </h1>

      {(hotel || journey) && (
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          {hotel && (
            <Link to={`/hotel/${hotel.id}`} className="inline-flex items-center gap-1.5 rounded-[2px] border border-line px-2.5 py-1 hover:border-ink">
              <Icon name="bed" size={13} className="text-ink-soft" /> {hotel.name}
            </Link>
          )}
          {journey && (
            <Link to={`/journey/${journey.id}`} className="inline-flex items-center gap-1.5 rounded-[2px] border border-line px-2.5 py-1 hover:border-ink">
              <Icon name="train" size={13} className="text-ink-soft" /> {journey.label}
            </Link>
          )}
        </div>
      )}

      {/* PLAN — the day's content, given real presence */}
      <section className="mt-7">
        <p className="kicker mb-2">Plan</p>
        <div className="text-[0.95rem] leading-relaxed text-ink">
          <Editable
            as="textarea"
            label="Plan"
            value={day.notes ?? ""}
            placeholder="What's the shape of the day…"
            onCommit={(v) => patch({ notes: v || undefined })}
          />
        </div>
      </section>

      {/* PLACES */}
      <section className="mt-8">
        <div className="section-head">
          <p className="kicker">Places</p>
          <div className={`flex items-center gap-3 ${ro ? "hidden" : ""}`}>
            {data.places.length > 0 && (
              <select
                value=""
                onChange={(e) => {
                  const pl = data.places.find((x) => x.id === e.target.value);
                  if (pl) setPlaces([...(day.places ?? []), { id: rid(), label: pl.name, placeId: pl.id, url: pl.url }]);
                }}
                className="cursor-pointer bg-transparent text-xs font-medium text-accent focus:outline-none"
              >
                <option value="">＋ From map</option>
                {[...data.places].sort((a, b) => a.name.localeCompare(b.name)).map((pl) => (
                  <option key={pl.id} value={pl.id}>{pl.name}</option>
                ))}
              </select>
            )}
            <button onClick={() => setPlaces([...(day.places ?? []), { id: rid(), label: "" }])} className="action text-xs">
              <Icon name="plus" size={13} /> Add
            </button>
          </div>
        </div>
        {(day.places ?? []).length === 0 ? (
          <p className="meta">Drop in a café, a temple, anything from your map.</p>
        ) : (
          <ul>
            {(day.places ?? []).map((p, i) => {
              const link = gmapsLink(p.url || (p.placeId ? p.label : undefined));
              return (
                <li key={p.id} className="group flex items-center gap-2.5 border-b border-line py-2.5">
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener"
                    className={`shrink-0 ${link ? "text-accent" : "pointer-events-none text-ink-faint/40"}`}
                    aria-label="Open in Google Maps"
                  >
                    <Icon name="map" size={15} />
                  </a>
                  <span className="min-w-0 flex-1 font-medium">
                    <Editable label="Place" value={p.label} placeholder="Name" onCommit={(v) => setPlaces(day.places!.map((x, j) => (j === i ? { ...x, label: v } : x)))} />
                  </span>
                  <span className="shrink-0 text-xs text-ink-soft">
                    <Editable label="Google Maps link" value={p.url ?? ""} placeholder="＋ link" onCommit={(v) => setPlaces(day.places!.map((x, j) => (j === i ? { ...x, url: v || undefined } : x)))} />
                  </span>
                  {!ro && (
                    <button onClick={() => setPlaces(day.places!.filter((_, j) => j !== i))} className="shrink-0 p-1 text-ink-faint opacity-0 transition-opacity hover:text-accent group-hover:opacity-100" aria-label="Remove">
                      <Icon name="close" size={13} />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* DAY TRIP */}
      {day.dayTrip ? (
        <section className="mt-8 border-t-2 border-ink/70 pt-5">
          <div className="section-head">
            <p className="kicker">
              <Icon name="explore" size={12} className="mr-1 inline align-[-1px]" /> Day trip
            </p>
            {!ro && <button onClick={() => patch({ dayTrip: false })} className="text-xs text-ink-faint hover:text-accent">not a day trip</button>}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Getting there">
              <Editable as="textarea" label="Getting there" value={day.getThere ?? ""} placeholder="Route out" onCommit={(v) => patch({ getThere: v || undefined })} />
            </Field>
            <Field label="Getting back">
              <Editable as="textarea" label="Getting back" value={day.getBack ?? ""} placeholder="Route back" onCommit={(v) => patch({ getBack: v || undefined })} />
            </Field>
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <Icon name="clock" size={14} className="shrink-0 translate-y-0.5 text-accent" />
            <p className="text-sm">
              <span className="text-ink-soft">Last way back — </span>
              <span className="font-medium text-accent">
                <Editable label="Last way back" value={day.lastTrainBack ?? ""} placeholder="e.g. last train ~23:00" onCommit={(v) => patch({ lastTrainBack: v || undefined })} />
              </span>
            </p>
          </div>

          <div className="mt-5">
            <div className="section-head">
              <p className="kicker">What to do there</p>
              {!ro && <button onClick={() => patch({ toDo: [...(day.toDo ?? []), ""] })} className="action text-xs"><Icon name="plus" size={13} /> Add</button>}
            </div>
            <StringList items={day.toDo ?? []} onChange={(v) => patch({ toDo: v.length ? v : undefined })} readOnly={ro} />
          </div>
        </section>
      ) : (
        !ro && (
          <button onClick={() => patch({ dayTrip: true })} className="action mt-8">
            <Icon name="plus" size={14} /> Make this a day trip
          </button>
        )
      )}
    </Page>
  );

}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-2xs font-semibold uppercase tracking-wide text-ink-soft">{label}</p>
      <div className="mt-1 text-sm leading-relaxed text-ink">{children}</div>
    </div>
  );
}

function StringList({ items, onChange, readOnly }: { items: string[]; onChange: (next: string[]) => void; readOnly?: boolean }) {
  if (items.length === 0) return <p className="meta">Nothing yet.</p>;
  return (
    <ul>
      {items.map((it, i) => (
        <li key={i} className="group flex items-center gap-2.5 border-b border-line py-2.5 text-sm">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-ink-faint" />
          <span className="min-w-0 flex-1">
            {readOnly ? it : (
              <Editable label="Item" value={it} placeholder="…" onCommit={(v) => onChange(items.map((x, j) => (j === i ? v : x)))} />
            )}
          </span>
          {!readOnly && (
            <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="shrink-0 p-1 text-ink-faint opacity-0 transition-opacity hover:text-accent group-hover:opacity-100" aria-label="Remove">
              <Icon name="close" size={13} />
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
