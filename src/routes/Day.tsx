import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Page, PageHeader } from "@/components/Page";
import { Missing } from "@/components/Missing";
import { Section } from "@/components/Section";
import { Editable } from "@/components/Editable";
import { RichNote } from "@/components/RichNote";
import { Markdown } from "@/components/Markdown";
import { RowDeleteButton } from "@/components/RowDeleteButton";
import { Icon } from "@/components/Icon";
import { useData, lookups } from "@/lib/data";
import { useApp } from "@/store/useApp";
import { useReadOnly } from "@/lib/readonly";
import { fmtDate } from "@/lib/dates";
import { legHex } from "@/lib/legColors";
import { gmapsLink } from "@/lib/maps";
import type { Day as DayT, PlanItem, Place } from "@/core/types";

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
    return <Missing title="No day here" body="That day isn’t part of this trip." to="/" cta="Back to Plan" />;

  const patch = (p: Partial<DayT>) => updateEntity<DayT>("days", day.id, p);
  const leg = L.leg(day.legId);
  const hotel = L.hotel(day.hotelId);
  const journey = L.journey(day.journeyId);
  const loc = data.config.locale;
  const setPlan = (next: PlanItem[]) => patch({ plan: next.length ? next : undefined });

  return (
    <Page>
      {/* IDENTITY — date, title, and where you're based / how you move */}
      <PageHeader
        back="/"
        dotColor={legHex(leg?.color)}
        eyebrow={fmtDate(day.date, loc, { weekday: "long", day: "numeric", month: "long" })}
        title={
          <Editable label="Day title" value={day.title ?? ""} placeholder="Untitled day" onCommit={(v) => patch({ title: v || undefined })} />
        }
      />

      {(hotel || journey) && (
        <div className="-mt-4 mb-8 flex flex-wrap gap-2">
          {hotel && (
            <Link to={`/hotel/${hotel.id}`} className="btn-sm">
              <Icon name="bed" size={14} className="text-ink-soft" /> {hotel.name}
            </Link>
          )}
          {journey && (
            <Link to={`/journey/${journey.id}`} className="btn-sm">
              <Icon name="train" size={14} className="text-ink-soft" /> {journey.label}
            </Link>
          )}
        </div>
      )}

      <div className="space-y-3.5">
      {/* DAY TRIP — the logistics you opened the page for; first when it applies */}
      {day.dayTrip && (
        <Section
          title="Day trip"
          action={!ro && <button onClick={() => patch({ dayTrip: false })} className="link-quiet text-xs">not a day trip</button>}
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
              <Icon name="clock" size={14} className="shrink-0 translate-y-0.5 text-ink-faint" />
              <p className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-sm">
                <span className="eyebrow">Last way back</span>
                <span className="font-medium text-ink">
                  <Editable label="Last way back" value={day.lastTrainBack ?? ""} placeholder="e.g. last train ~23:00" onCommit={(v) => patch({ lastTrainBack: v || undefined })} />
                </span>
              </p>
            </div>
          )}

          {((day.toDo ?? []).length > 0 || !ro) && (
            <div className="mt-4 border-t border-line pt-3">
              <div className="mb-1 flex items-baseline justify-between gap-3">
                <p className="eyebrow">To do there</p>
                {!ro && <button onClick={() => patch({ toDo: [...(day.toDo ?? []), ""] })} className="action text-xs"><Icon name="plus" size={13} /> Add</button>}
              </div>
              <StringList items={day.toDo ?? []} onChange={(v) => patch({ toDo: v.length ? v : undefined })} readOnly={ro} />
            </div>
          )}
        </Section>
      )}

      {/* PLAN — the day's itinerary: time + step, drag to reorder */}
      {((day.plan ?? []).length > 0 || !ro) && (
        <Section
          title="Plan"
          action={
            !ro && (
              <button onClick={() => setPlan([...(day.plan ?? []), { id: rid(), text: "" }])} className="action text-xs">
                <Icon name="plus" size={13} /> Add
              </button>
            )
          }
        >
          <PlanList items={day.plan ?? []} places={data.places} readOnly={ro} onChange={setPlan} />
        </Section>
      )}

      {/* AREAS — pull an area's places onto this day's map, without touching the plan */}
      {((day.areaIds ?? []).length > 0 || (!ro && data.areas.length > 0)) && (
        <Section title="Areas">
          <div className="flex flex-wrap gap-2">
            {(day.areaIds ?? []).map((id) => {
              const a = data.areas.find((x) => x.id === id);
              if (!a) return null;
              const linked = new Set((day.plan ?? []).map((it) => it.placeId).filter(Boolean));
              const newPlaces = a.placeIds.filter((pid) => !linked.has(pid)).map((pid) => data.places.find((p) => p.id === pid)).filter((p): p is NonNullable<typeof p> => !!p);
              return (
                <span key={id} className="inline-flex items-center gap-1.5 rounded border border-line px-2 py-1 text-xs">
                  {a.name || "Untitled"}
                  <span className="text-ink-faint">{a.placeIds.length}</span>
                  {!ro && newPlaces.length > 0 && (
                    <button
                      onClick={() => setPlan([...(day.plan ?? []), ...newPlaces.map((p) => ({ id: rid(), text: p.name, placeId: p.id }))])}
                      aria-label={`Add ${a.name}'s places to the plan`}
                      title="Add these places to the plan"
                      className="text-ink-faint hover:text-accent"
                    >
                      <Icon name="plus" size={11} />
                    </button>
                  )}
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
                aria-label="Add an area to this day"
                onChange={(e) => e.target.value && patch({ areaIds: [...(day.areaIds ?? []), e.target.value] })}
                className="cursor-pointer rounded border border-dashed border-line bg-transparent px-2 py-1 text-xs text-accent focus:outline-none"
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
            <p className="meta mt-2">
              Places in {(day.areaIds ?? []).length === 1 ? "this area" : "these areas"} show on the day’s map — they
              don’t change the plan above{!ro ? ", unless you tap + to add one as a step" : ""}.
            </p>
          )}
        </Section>
      )}

      {/* GENERAL NOTES — free-form catch-all, after the day's actual plan */}
      {(day.notes || !ro) && (
        <Section title="General notes">
          <div className="note">
            <RichNote
              value={day.notes ?? ""}
              onCommit={(v) => patch({ notes: v || undefined })}
              placeholder="Anything else — ideas, reminders, links…"
            />
          </div>
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
      <p className="eyebrow">{label}</p>
      <div className="note mt-1">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ plan */

function PlanList({ items, places, readOnly, onChange }: {
  items: PlanItem[];
  places: Place[];
  readOnly: boolean;
  onChange: (next: PlanItem[]) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 8 } }),
    useSensor(KeyboardSensor),
  );
  const patchItem = (id: string, p: Partial<PlanItem>) => onChange(items.map((x) => (x.id === id ? { ...x, ...p } : x)));
  const removeItem = (id: string) => onChange(items.filter((x) => x.id !== id));

  if (items.length === 0) return <p className="text-sm text-ink-faint">Nothing planned yet.</p>;

  const rows = items.map((it) => (
    <PlanRow
      key={it.id}
      item={it}
      place={it.placeId ? places.find((p) => p.id === it.placeId) : undefined}
      places={places}
      readOnly={readOnly}
      onPatch={(p) => patchItem(it.id, p)}
      onRemove={() => removeItem(it.id)}
    />
  ));

  if (readOnly) return <ul>{rows}</ul>;

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const from = items.findIndex((x) => x.id === active.id);
    const to = items.findIndex((x) => x.id === over.id);
    if (from >= 0 && to >= 0) onChange(arrayMove(items, from, to));
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={items.map((x) => x.id)} strategy={verticalListSortingStrategy}>
        <ul>{rows}</ul>
      </SortableContext>
    </DndContext>
  );
}

function PlanRow({ item, place, places, readOnly, onPatch, onRemove }: {
  item: PlanItem;
  place?: Place;
  places: Place[];
  readOnly: boolean;
  onPatch: (p: Partial<PlanItem>) => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id, disabled: readOnly });
  const mapHref = gmapsLink(item.url || place?.url || place?.name);
  const hasNote = !!item.note?.trim();
  const [open, setOpen] = useState(false);
  const canExpand = !readOnly || hasNote;

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`group border-b border-line/70 bg-surface text-sm last:border-b-0 ${isDragging ? "z-10 opacity-70" : ""}`}
    >
      <div className="flex items-start gap-2 py-2.5">
        {!readOnly && (
          <button
            {...attributes}
            {...listeners}
            className="mt-[0.15em] grid h-4 w-4 shrink-0 cursor-grab touch-none place-items-center text-ink-faint/50 active:cursor-grabbing"
            aria-label="Drag to reorder"
          >
            <Icon name="grip" size={13} />
          </button>
        )}
        {/* time + pin-slot are fixed width so every step's text starts at the same x */}
        <span className="w-[4.5rem] shrink-0 whitespace-nowrap pt-px text-[0.7rem] leading-tight tabular-nums text-ink-soft">
          {readOnly
            ? item.time
            : <Editable label="Time" value={item.time ?? ""} placeholder="––:––" onCommit={(v) => onPatch({ time: v.replace(/\s+/g, "") || undefined })} />}
        </span>
        <span className="mt-[0.1em] grid w-4 shrink-0 place-items-center">
          {(mapHref || item.placeId) && (
            <a
              href={mapHref}
              target="_blank"
              rel="noopener"
              className={mapHref ? "text-accent" : "pointer-events-none text-ink-faint/40"}
              aria-label={place ? `Open ${place.name} in Google Maps` : "Open in Google Maps"}
            >
              <Icon name="pin" size={13} />
            </a>
          )}
        </span>
        <span className="min-w-0 flex-1">
          {readOnly
            ? item.text
            : <Editable label="Step" value={item.text} placeholder="What's happening" onCommit={(v) => onPatch({ text: v })} />}
        </span>
        {canExpand && (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Hide step details" : "Step details"}
            className="mt-[0.1em] shrink-0 px-0.5"
          >
            <Icon
              name="chevron"
              size={13}
              className={`transition-transform ${open ? "rotate-90" : ""} ${hasNote ? "text-ink-soft" : "text-ink-faint/50"}`}
            />
          </button>
        )}
        {!readOnly && <RowDeleteButton onClick={onRemove} label="Remove step" />}
      </div>

      {open && (
        <div className="ml-[4.5rem] space-y-2.5 border-l border-line pb-3 pl-3 pr-1">
          {!readOnly && (places.length > 0 || item.placeId) && (
            <div className="flex items-center gap-1.5">
              <Icon name="pin" size={12} className={item.placeId ? "shrink-0 text-ink-soft" : "shrink-0 text-ink-faint"} />
              <select
                value={item.placeId ?? ""}
                onChange={(e) => onPatch({ placeId: e.target.value || undefined })}
                aria-label="Link this step to a place"
                className="min-w-0 flex-1 cursor-pointer bg-transparent text-xs font-medium text-ink focus:outline-none"
              >
                <option value="">Link a place…</option>
                {[...places].sort((a, b) => a.name.localeCompare(b.name)).map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          )}
          <div className="note">
            {readOnly
              ? (hasNote && <Markdown text={item.note!} />)
              : (
                <Editable
                  as="textarea"
                  label="Step note"
                  value={item.note ?? ""}
                  placeholder="Add a note…"
                  onCommit={(v) => onPatch({ note: v || undefined })}
                />
              )}
          </div>
        </div>
      )}
    </li>
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
          {!readOnly && <RowDeleteButton onClick={() => onChange(items.filter((_, j) => j !== i))} />}
        </li>
      ))}
    </ul>
  );
}
