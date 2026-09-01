import { useParams, Link } from "react-router-dom";
import { Page } from "@/components/Page";
import { BackBar } from "@/components/BackBar";
import { Section } from "@/components/Section";
import { Editable } from "@/components/Editable";
import { RichNote } from "@/components/RichNote";
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

      {/* IDENTITY — date, title, and where you're based / how you move */}
      <header className="mb-8">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: legHex(leg?.color) }} />
          <p className="eyebrow">
            {fmtDate(day.date, loc, { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>
        <h1 className="mt-2 font-display text-[2rem] leading-[1.1]">
          <Editable label="Day title" value={day.title ?? ""} placeholder="Untitled day" onCommit={(v) => patch({ title: v || undefined })} />
        </h1>

        {(hotel || journey) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {hotel && (
              <Link
                to={`/hotel/${hotel.id}`}
                className="inline-flex items-center gap-1.5 rounded-[2px] border border-line px-2.5 py-1 text-[0.8125rem] font-medium transition-colors hover:border-ink"
              >
                <Icon name="bed" size={14} className="text-ink-soft" /> {hotel.name}
              </Link>
            )}
            {journey && (
              <Link
                to={`/journey/${journey.id}`}
                className="inline-flex items-center gap-1.5 rounded-[2px] border border-line px-2.5 py-1 text-[0.8125rem] font-medium transition-colors hover:border-ink"
              >
                <Icon name="train" size={14} className="text-ink-soft" /> {journey.label}
              </Link>
            )}
          </div>
        )}
      </header>

      <div className="space-y-3.5">
      {/* PLAN — a short bullet list */}
      {((day.plan ?? []).length > 0 || !ro) && (
        <Section
          title="Plan"
          action={
            !ro && (
              <button onClick={() => patch({ plan: [...(day.plan ?? []), ""] })} className="action text-xs">
                <Icon name="plus" size={13} /> Add
              </button>
            )
          }
        >
          <StringList
            items={day.plan ?? []}
            onChange={(v) => patch({ plan: v.length ? v : undefined })}
            readOnly={ro}
            emptyHint="Nothing planned yet."
          />
        </Section>
      )}

      {/* NOTES — free-form, lightly formatted */}
      {(day.notes || !ro) && (
        <Section title="Notes">
          <div className="text-[0.95rem] text-ink">
            <RichNote
              value={day.notes ?? ""}
              onCommit={(v) => patch({ notes: v || undefined })}
              placeholder="Anything else — ideas, reminders, links…"
            />
          </div>
        </Section>
      )}

      {/* PLACES */}
      {((day.places ?? []).length > 0 || !ro) && (
      <Section
        title="Places"
        action={
          <div className={`flex items-center gap-3 ${ro ? "hidden" : ""}`}>
            {data.places.length > 0 && (
              <select
                value=""
                aria-label="Add a place from the map"
                onChange={(e) => {
                  const pl = data.places.find((x) => x.id === e.target.value);
                  if (pl) setPlaces([...(day.places ?? []), { id: rid(), label: pl.name, placeId: pl.id, url: pl.url }]);
                }}
                className="w-[6.5rem] cursor-pointer appearance-none bg-transparent text-xs font-medium text-accent focus:outline-none"
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
        }
      >
        {(day.places ?? []).length === 0 ? (
          <p className="text-sm text-ink-faint">Drop in a café, a temple, anything from your map.</p>
        ) : (
          <ul>
            {(day.places ?? []).map((p, i) => {
              const link = gmapsLink(p.url || (p.placeId ? p.label : undefined));
              return (
                <li key={p.id} className="group flex items-start gap-2.5 border-b border-line/70 py-2.5 last:border-b-0 last:pb-0">
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener"
                    className={`shrink-0 translate-y-0.5 ${link ? "text-accent" : "pointer-events-none text-ink-faint/40"}`}
                    aria-label="Open in Google Maps"
                  >
                    <Icon name="map" size={15} />
                  </a>
                  <span className="lead min-w-0 flex-1">
                    <Editable label="Place" value={p.label} placeholder="Name" onCommit={(v) => setPlaces(day.places!.map((x, j) => (j === i ? { ...x, label: v } : x)))} />
                  </span>
                  <span className="shrink-0 text-xs text-ink-soft">
                    <Editable as="link" label="Google Maps link" value={p.url ?? ""} placeholder="＋ link" onCommit={(v) => setPlaces(day.places!.map((x, j) => (j === i ? { ...x, url: v || undefined } : x)))} />
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
      </Section>
      )}

      {/* AREAS — pull an area's places onto this day's map, without touching the plan */}
      {((day.areaIds ?? []).length > 0 || (!ro && data.areas.length > 0)) && (
        <Section title="Areas">
          <div className="flex flex-wrap gap-2">
            {(day.areaIds ?? []).map((id) => {
              const a = data.areas.find((x) => x.id === id);
              if (!a) return null;
              return (
                <span key={id} className="inline-flex items-center gap-1.5 rounded-[2px] border border-line px-2 py-1 text-xs">
                  {a.name || "Untitled"}
                  <span className="text-ink-faint">{a.placeIds.length}</span>
                  {!ro && (
                    <button
                      onClick={() => patch({ areaIds: (day.areaIds ?? []).filter((x) => x !== id) })}
                      aria-label={`Remove ${a.name}`}
                      className="text-ink-faint hover:text-accent"
                    >
                      <Icon name="close" size={11} />
                    </button>
                  )}
                </span>
              );
            })}
            {!ro && data.areas.some((a) => !(day.areaIds ?? []).includes(a.id)) && (
              <select
                value=""
                onChange={(e) => e.target.value && patch({ areaIds: [...(day.areaIds ?? []), e.target.value] })}
                className="cursor-pointer rounded-[2px] border border-dashed border-line bg-transparent px-2 py-1 text-xs text-accent focus:outline-none"
              >
                <option value="">＋ Add area</option>
                {data.areas
                  .filter((a) => !(day.areaIds ?? []).includes(a.id))
                  .map((a) => (
                    <option key={a.id} value={a.id}>{a.name || "Untitled"}</option>
                  ))}
              </select>
            )}
          </div>
          {(day.areaIds ?? []).length > 0 && (
            <p className="meta mt-2">Places in {(day.areaIds ?? []).length === 1 ? "this area" : "these areas"} show on the day's map — they don't change the plan above.</p>
          )}
        </Section>
      )}

      {/* DAY TRIP — a distinct block */}
      {day.dayTrip && (
        <Section
          title="Day trip"
          action={!ro && <button onClick={() => patch({ dayTrip: false })} className="text-xs text-ink-soft transition-colors hover:text-accent">not a day trip</button>}
        >
          <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
            <Field label="Getting there">
              <Editable as="textarea" label="Getting there" value={day.getThere ?? ""} placeholder="Route out" onCommit={(v) => patch({ getThere: v || undefined })} />
            </Field>
            <Field label="Getting back">
              <Editable as="textarea" label="Getting back" value={day.getBack ?? ""} placeholder="Route back" onCommit={(v) => patch({ getBack: v || undefined })} />
            </Field>
          </div>

          {(day.lastTrainBack || !ro) && (
            <div className="mt-4 flex items-baseline gap-2 border-t border-line pt-3">
              <Icon name="clock" size={14} className="shrink-0 translate-y-0.5 text-accent" />
              <p className="text-sm">
                <span className="text-ink-soft">Last way back — </span>
                <span className="font-medium text-accent">
                  <Editable label="Last way back" value={day.lastTrainBack ?? ""} placeholder="e.g. last train ~23:00" onCommit={(v) => patch({ lastTrainBack: v || undefined })} />
                </span>
              </p>
            </div>
          )}

          {((day.toDo ?? []).length > 0 || !ro) && (
            <div className="mt-4 border-t border-line pt-3">
              <div className="mb-1 flex items-baseline justify-between gap-3">
                <p className="text-2xs font-normal uppercase tracking-[0.12em] text-ink-soft">To do there</p>
                {!ro && <button onClick={() => patch({ toDo: [...(day.toDo ?? []), ""] })} className="action text-xs"><Icon name="plus" size={13} /> Add</button>}
              </div>
              <StringList items={day.toDo ?? []} onChange={(v) => patch({ toDo: v.length ? v : undefined })} readOnly={ro} />
            </div>
          )}
        </Section>
      )}
      </div>

      {!day.dayTrip && !ro && (
        <button onClick={() => patch({ dayTrip: true })} className="action mt-8">
          <Icon name="plus" size={14} /> Make this a day trip
        </button>
      )}
    </Page>
  );

}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-2xs font-normal uppercase tracking-[0.12em] text-ink-soft">{label}</p>
      <div className="mt-1 text-sm leading-relaxed text-ink">{children}</div>
    </div>
  );
}

function StringList({ items, onChange, readOnly, emptyHint = "Nothing yet." }: { items: string[]; onChange: (next: string[]) => void; readOnly?: boolean; emptyHint?: string }) {
  if (items.length === 0) return <p className="text-sm text-ink-faint">{emptyHint}</p>;
  return (
    <ul>
      {items.map((it, i) => (
        <li key={i} className="group flex items-start gap-2.5 border-b border-line/70 py-2.5 text-sm last:border-b-0 last:pb-0">
          <span className="mt-[0.5em] h-1.5 w-1.5 shrink-0 rounded-full bg-ink-faint" />
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
