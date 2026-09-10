import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
import { RowDeleteButton } from "@/components/RowDeleteButton";
import { SwipeToDelete } from "@/components/SwipeToDelete";
import { Icon } from "@/components/Icon";
import { IconTile } from "@/components/IconTile";
import { toneForPlaceCategory } from "@/lib/tones";
import { useData, lookups } from "@/lib/data";
import { useApp } from "@/store/useApp";
import { useReadOnly } from "@/lib/readonly";
import { fmtDate } from "@/lib/dates";
import { legHex } from "@/lib/legColors";
import { gmapsLink } from "@/lib/maps";
import { parseMoney, fmtMoney, cleanAmount, fmtFare, currencySymbol } from "@/lib/cost";
import type { Day as DayT, DayCost, ExpenseCategory, PlanItem, Place } from "@/core/types";

const rid = () => Math.random().toString(36).slice(2, 9);

/** "14:00–15:15" (any dash, any spacing) → ["14:00", "15:15"]; else null */
function splitRange(t?: string): [string, string] | null {
  const m = (t ?? "").match(/^\s*(\d{1,2}:\d{2})\s*[–—-]\s*(\d{1,2}:\d{2})\s*$/);
  return m ? [m[1], m[2]] : null;
}

export default function Day() {
  const data = useData();
  const { id } = useParams();
  const updateEntity = useApp((s) => s.updateEntity);
  const addEntity = useApp((s) => s.addEntity);
  const nav = useNavigate();
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

  // "＋ New journey" — a blank journey, its type chosen on the journey page (never
  // guessed from the day's date: you can arrive, transfer or leave at any point).
  const newJourney = () => {
    const jid = `journeys-${rid()}`;
    addEntity("journeys", { id: jid, label: "", kind: "transfer", date: day.date, segments: [] } as never);
    patch({ journeyId: jid });
    nav(`/journey/${jid}`);
  };

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

      {ro ? (
        (hotel || journey) && (
          <div className="-mt-4 mb-8 flex flex-wrap gap-2">
            {hotel && (
              <Link to={`/hotel/${hotel.id}`} className="btn-sm">
                <Icon name="bed" size={14} className="text-ink-soft" /> {hotel.name}
              </Link>
            )}
            {journey && (
              <Link to={`/journey/${journey.id}`} className="btn-sm">
                <Icon name="train" size={14} className="text-ink-soft" /> {journey.label || "Journey"}
              </Link>
            )}
          </div>
        )
      ) : (
        <div className="-mt-4 mb-8 space-y-2">
          <div className="flex items-baseline gap-3">
            <span className="eyebrow w-[5.5rem] shrink-0">Staying at</span>
            <select
              value={day.hotelId ?? ""}
              onChange={(e) => patch({ hotelId: e.target.value || undefined })}
              aria-label="Which hotel you're staying at"
              className="min-w-0 flex-1 cursor-pointer bg-transparent text-sm focus:outline-none"
            >
              <option value="">— none —</option>
              {data.hotels.map((h) => <option key={h.id} value={h.id}>{h.name || "Hotel"}</option>)}
            </select>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="eyebrow w-[5.5rem] shrink-0">Journey</span>
            <select
              value={day.journeyId ?? ""}
              onChange={(e) => {
                if (e.target.value === "__new") newJourney();
                else patch({ journeyId: e.target.value || undefined });
              }}
              aria-label="A journey on this day"
              className="min-w-0 flex-1 cursor-pointer bg-transparent text-sm focus:outline-none"
            >
              <option value="">None</option>
              {data.journeys.map((j) => <option key={j.id} value={j.id}>{j.label || "Journey"}</option>)}
              <option value="__new">＋ New journey…</option>
            </select>
          </div>
          {(hotel || journey) && (
            <div className="flex flex-wrap gap-2 pt-1">
              {hotel && (
                <Link to={`/hotel/${hotel.id}`} className="btn-sm">
                  <Icon name="bed" size={14} className="text-ink-soft" /> {hotel.name}
                </Link>
              )}
              {journey && (
                <Link to={`/journey/${journey.id}`} className="btn-sm">
                  <Icon name="train" size={14} className="text-ink-soft" /> {journey.label || "Journey"}
                </Link>
              )}
            </div>
          )}
        </div>
      )}

      <div className="space-y-6">
      {/* DAY TRIP — the logistics you opened the page for; first when it applies */}
      {day.dayTrip && (
        <Section
          icon="explore"
          title="Day trip"
          action={!ro && <button onClick={() => patch({ dayTrip: false })} className="link-quiet text-xs">not a day trip</button>}
        >
          <div className="space-y-3 px-3.5 py-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* out */}
              <div className="rounded-[10px] bg-accent/[0.07] p-3">
                <p className="flex items-center gap-1.5 text-accent">
                  <Icon name="chevron" size={13} className="shrink-0" />
                  <span className="text-2xs font-medium uppercase tracking-[0.12em]">Getting there</span>
                </p>
                <div className="note mt-1.5 text-ink">
                  <Editable as="textarea" label="Getting there" value={day.getThere ?? ""} placeholder="The route out — train, bus, how long" onCommit={(v) => patch({ getThere: v || undefined })} />
                </div>
              </div>

              {/* back */}
              <div className="rounded-[10px] bg-gold/[0.08] p-3">
                <p className="flex items-center gap-1.5 text-gold">
                  <Icon name="chevron" size={13} className="shrink-0 rotate-180" />
                  <span className="text-2xs font-medium uppercase tracking-[0.12em]">Getting back</span>
                </p>
                <div className="note mt-1.5 text-ink">
                  <Editable as="textarea" label="Getting back" value={day.getBack ?? ""} placeholder="The route back" onCommit={(v) => patch({ getBack: v || undefined })} />
                </div>
                {(day.lastTrainBack || !ro) && (
                  <p className="mt-2.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5 border-t border-gold/25 pt-2 text-sm">
                    <Icon name="clock" size={13} className="shrink-0 translate-y-0.5 text-gold" />
                    <span className="text-2xs font-medium uppercase tracking-[0.12em] text-gold">Last way back</span>
                    <span className="value">
                      <Editable label="Last way back" value={day.lastTrainBack ?? ""} placeholder="e.g. last train ~23:00" onCommit={(v) => patch({ lastTrainBack: v || undefined })} />
                    </span>
                  </p>
                )}
              </div>
            </div>

            {((day.toDo ?? []).length > 0 || !ro) && (
              <div className="border-t border-line pt-3">
                <div className="mb-1 flex items-baseline justify-between gap-3">
                  <p className="eyebrow">To do there</p>
                  {!ro && <button onClick={() => patch({ toDo: [...(day.toDo ?? []), ""] })} className="action text-xs"><Icon name="plus" size={13} /> Add</button>}
                </div>
                <StringList items={day.toDo ?? []} onChange={(v) => patch({ toDo: v.length ? v : undefined })} readOnly={ro} />
              </div>
            )}
          </div>
        </Section>
      )}

      {/* PLAN — the day's itinerary: time + step, drag to reorder */}
      {((day.plan ?? []).length > 0 || !ro) && (
        <Section
          icon="itinerary"
          title="Plan"
          action={
            !ro && (day.plan ?? []).length > 0 && (
              <button onClick={() => setPlan([...(day.plan ?? []), { id: rid(), text: "" }])} className="action text-xs">
                <Icon name="plus" size={13} /> Add
              </button>
            )
          }
        >
          <PlanList items={day.plan ?? []} places={data.places} categoryIcons={data.config.categoryIcons} readOnly={ro} onChange={setPlan} />
        </Section>
      )}

      {/* AREAS — pull an area's places onto this day's map, without touching the plan */}
      {((day.areaIds ?? []).length > 0 || (!ro && data.areas.length > 0)) && (
        <Section
          icon="pin"
          title="Areas"
          info={`Places in an area you add here show on the day’s map — they don’t change the plan above${ro ? "." : ", unless you tap + on a chip to add one as a step."}`}
        >
          <div className="flex flex-wrap gap-2 px-3.5 py-3">
            {(day.areaIds ?? []).map((id) => {
              const a = data.areas.find((x) => x.id === id);
              if (!a) return null;
              const linked = new Set((day.plan ?? []).map((it) => it.placeId).filter(Boolean));
              const newPlaces = a.placeIds.filter((pid) => !linked.has(pid)).map((pid) => data.places.find((p) => p.id === pid)).filter((p): p is NonNullable<typeof p> => !!p);
              return (
                <span key={id} className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-xs">
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
                className="cursor-pointer rounded-full border border-dashed border-line bg-transparent px-2.5 py-1 text-xs text-accent focus:outline-none"
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
        </Section>
      )}

      {/* SPENDING — what the day cost; feeds the Expenses roll-up */}
      {((day.costs ?? []).length > 0 || !ro) && (
        <Section icon="vault" title="Spending">
          <CostList
            costs={day.costs ?? []}
            categories={data.config.expenseCategories ?? []}
            currencies={(data.config.currencies ?? []).filter(Boolean)}
            readOnly={ro}
            onChange={(next) => patch({ costs: next.length ? next : undefined })}
          />
        </Section>
      )}

      {/* GENERAL NOTES — free-form catch-all, after the day's actual plan */}
      {(day.notes || !ro) && (
        <Section icon="list" title="General notes">
          <div className="note px-3.5 py-3">
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

/* ------------------------------------------------------------------ plan */

function PlanList({ items, places, categoryIcons, readOnly, onChange }: {
  items: PlanItem[];
  places: Place[];
  categoryIcons?: Record<string, string>;
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

  if (items.length === 0) {
    return readOnly ? (
      <p className="px-3.5 py-3 text-sm text-ink-faint">Nothing planned yet.</p>
    ) : (
      <button onClick={() => onChange([{ id: rid(), text: "" }])} className="action w-full px-3.5 py-3 text-sm">
        <Icon name="plus" size={14} /> Add a step
      </button>
    );
  }

  const rows = items.map((it) => (
    <PlanRow
      key={it.id}
      item={it}
      place={it.placeId ? places.find((p) => p.id === it.placeId) : undefined}
      places={places}
      categoryIcons={categoryIcons}
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

function PlanRow({ item, place, places, categoryIcons, readOnly, onPatch, onRemove }: {
  item: PlanItem;
  place?: Place;
  places: Place[];
  categoryIcons?: Record<string, string>;
  readOnly: boolean;
  onPatch: (p: Partial<PlanItem>) => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id, disabled: readOnly });
  const mapHref = gmapsLink(item.url || place?.url || place?.name);
  const hasNote = !!item.note?.trim();
  const [open, setOpen] = useState(false);
  const canExpand = !readOnly || hasNote;

  const range = splitRange(item.time);
  const timeText = range ? `${range[0]} – ${range[1]}` : item.time;
  const plainTime = !item.time || /^\d{1,2}:\d{2}$/.test(item.time);
  const catGlyph = place?.category ? categoryIcons?.[place.category] : undefined;
  const tile = (
    <IconTile
      size="sm"
      glyph={place ? catGlyph : undefined}
      name={place && catGlyph ? undefined : "pin"}
      color={place?.source === "mymap" ? place.color : undefined}
      tone={place ? toneForPlaceCategory(place.category, categoryIcons) : "ink-faint"}
      className={place ? "" : "opacity-70"}
    />
  );

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`group relative text-sm after:pointer-events-none after:absolute after:bottom-0 after:left-12 after:right-0 after:h-px after:bg-line last:after:hidden ${isDragging ? "z-10 bg-surface opacity-80" : ""}`}
    >
      <SwipeToDelete onDelete={readOnly ? undefined : onRemove}>
      <div className="flex items-center gap-2.5 px-3.5 py-2.5">
        {!readOnly && (
          <button
            {...attributes}
            {...listeners}
            className="grid h-4 w-3 shrink-0 cursor-grab touch-none place-items-center text-ink-faint/50 active:cursor-grabbing"
            aria-label="Drag to reorder"
          >
            <Icon name="grip" size={13} />
          </button>
        )}
        {mapHref ? (
          <a href={mapHref} target="_blank" rel="noopener" className="shrink-0" aria-label={place ? `Open ${place.name} in Google Maps` : "Open in Google Maps"}>
            {tile}
          </a>
        ) : (
          tile
        )}
        <span className="min-w-0 flex-1">
          <span className="block truncate leading-snug text-ink">
            {readOnly
              ? item.text
              : <Editable label="Step" value={item.text} placeholder="Add a step" onCommit={(v) => onPatch({ text: v })} />}
          </span>
          {(readOnly ? !!timeText : true) && (
            <span className="meta block leading-tight tabular-nums">
              {readOnly ? (
                timeText
              ) : plainTime ? (
                <Editable as="time" label="Time" value={item.time ?? ""} placeholder="Add a time" onCommit={(v) => onPatch({ time: v || undefined })} />
              ) : (
                <Editable label="Time" value={item.time ?? ""} placeholder="Add a time" onCommit={(v) => onPatch({ time: v.trim() || undefined })} />
              )}
            </span>
          )}
        </span>
        {canExpand && (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Hide step details" : "Step details"}
            className="shrink-0 px-0.5"
          >
            <Icon
              name="chevron"
              size={13}
              className={`transition-transform ${open ? "rotate-90" : ""} ${hasNote ? "text-ink-soft" : "text-ink-faint/50"}`}
            />
          </button>
        )}
        {!readOnly && <RowDeleteButton onClick={onRemove} />}
      </div>
      </SwipeToDelete>

      {open && (
        <div className="space-y-2.5 pb-3 pl-12 pr-3.5">
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
          {(!readOnly || hasNote) && (
            <div className="rounded border border-line bg-bg/60 px-3 py-2.5">
              <RichNote
                value={item.note ?? ""}
                onCommit={(v) => onPatch({ note: v || undefined })}
                placeholder="Add a note — bold, bullets, links…"
                className="text-[0.875rem] leading-relaxed text-ink-soft [&_strong]:text-ink"
              />
            </div>
          )}
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
        <li key={i} className="group border-b border-line/70 text-sm last:border-b-0">
          <SwipeToDelete onDelete={readOnly ? undefined : () => onChange(items.filter((_, j) => j !== i))}>
            <div className="flex items-start gap-2.5 py-2.5">
              <span className="mt-[0.5em] h-1.5 w-1.5 shrink-0 rounded-full bg-ink-faint" />
              <span className="min-w-0 flex-1">
                {readOnly ? it : (
                  <Editable label="Item" value={it} placeholder="…" onCommit={(v) => onChange(items.map((x, j) => (j === i ? v : x)))} />
                )}
              </span>
              {!readOnly && <RowDeleteButton onClick={() => onChange(items.filter((_, j) => j !== i))} />}
            </div>
          </SwipeToDelete>
        </li>
      ))}
    </ul>
  );
}

/** The day's spend — a category + a whole-number amount per row, with an
 *  optional free-text note. The amounts feed `tripCost`; the category drives
 *  the Expenses grouping. */
function CostList({ costs, categories, currencies, readOnly, onChange }: {
  costs: DayCost[];
  categories: ExpenseCategory[];
  currencies: string[];
  readOnly: boolean;
  onChange: (next: DayCost[]) => void;
}) {
  const primary = currencies[0] ?? "";
  const multi = currencies.length >= 2;
  const primarySym = currencySymbol(primary);
  const setAt = (i: number, patch: Partial<DayCost>) => onChange(costs.map((c, j) => (j === i ? { ...c, ...patch } : c)));
  const add = () => onChange([...costs, { id: rid(), categoryId: categories[0]?.id, label: "", amount: "" }]);
  const catLabel = (id?: string) => categories.find((c) => c.id === id)?.label ?? "Uncategorised";

  const subtotals = new Map<string, number>();
  for (const c of costs) {
    const m = parseMoney(c.amount, c.currency || primary);
    if (m) subtotals.set(m.currency, (subtotals.get(m.currency) ?? 0) + m.amount);
  }

  if (costs.length === 0) {
    return readOnly ? (
      <p className="px-3.5 py-3 text-sm text-ink-faint">Nothing logged.</p>
    ) : (
      <button onClick={add} className="action w-full px-3.5 py-3 text-sm"><Icon name="plus" size={14} /> Add an amount</button>
    );
  }

  return (
    <ul>
      {costs.map((c, i) => {
          const known = !c.categoryId || categories.some((cat) => cat.id === c.categoryId);
          return (
            <li key={c.id} className="group relative after:pointer-events-none after:absolute after:bottom-0 after:left-3.5 after:right-0 after:h-px after:bg-line last:after:hidden">
              <SwipeToDelete onDelete={readOnly ? undefined : () => onChange(costs.filter((_, j) => j !== i))}>
              <div className="px-3.5 py-2.5">
              <div className="flex items-baseline gap-3">
                <span className="min-w-0 flex-1">
                  {readOnly ? (
                    <span className="value">{c.label.trim() || catLabel(c.categoryId)}</span>
                  ) : (
                    <Editable label="What was it?" value={c.label} placeholder="What was it?" className="value" onCommit={(v) => setAt(i, { label: v })} />
                  )}
                </span>
                {readOnly ? (
                  <span className="value shrink-0 text-right tabular-nums">{fmtFare(c.amount, c.currency || primary)}</span>
                ) : (
                  <span className="flex shrink-0 items-baseline gap-1.5">
                    {multi ? (
                      <select
                        value={c.currency ?? primary}
                        onChange={(e) => setAt(i, { currency: e.target.value === primary ? undefined : e.target.value })}
                        aria-label="Currency"
                        className="cursor-pointer bg-transparent text-[0.8125rem] text-ink-soft focus:outline-none"
                      >
                        {[...new Set([...currencies, c.currency || primary])].filter(Boolean).map((cc) => (
                          <option key={cc} value={cc}>{cc}</option>
                        ))}
                      </select>
                    ) : primarySym && (!c.amount || /^[\d.,]+$/.test(c.amount)) ? (
                      <span className="value text-ink-faint">{primarySym}</span>
                    ) : null}
                    <span className="value text-right tabular-nums">
                      <Editable as="number" label="Amount" value={c.amount} placeholder="—" onCommit={(v) => setAt(i, { amount: cleanAmount(v) })} />
                    </span>
                  </span>
                )}
                {!readOnly && <RowDeleteButton onClick={() => onChange(costs.filter((_, j) => j !== i))} />}
              </div>
              {/* category — the quiet second line, so it never shouts the same
                  word down the list */}
              {readOnly ? (
                c.label.trim() && <div className="meta mt-0.5">{catLabel(c.categoryId)}</div>
              ) : (
                <select
                  value={c.categoryId ?? ""}
                  onChange={(e) => setAt(i, { categoryId: e.target.value || undefined })}
                  aria-label="Category"
                  className="meta mt-0.5 -ml-0.5 block max-w-full cursor-pointer bg-transparent focus:outline-none"
                >
                  {(!c.categoryId || !known) && <option value={c.categoryId ?? ""}>{c.categoryId ? "Uncategorised" : "Category…"}</option>}
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              )}
              </div>
              </SwipeToDelete>
            </li>
          );
        })}
      {subtotals.size > 0 && (
        <li className="relative flex items-baseline justify-between gap-4 px-3.5 py-2.5 after:pointer-events-none after:absolute after:bottom-0 after:left-3.5 after:right-0 after:h-px after:bg-line last:after:hidden">
          <span className="value font-semibold">Day total</span>
          <span className="value flex flex-wrap justify-end gap-x-3 font-semibold tabular-nums">
            {[...subtotals].map(([cur, amt]) => (
              <span key={cur || "—"}>{fmtMoney(amt, cur)}</span>
            ))}
          </span>
        </li>
      )}
      {!readOnly && (
        <li>
          <button onClick={add} className="action w-full px-3.5 py-2.5 text-xs"><Icon name="plus" size={13} /> Add an amount</button>
        </li>
      )}
    </ul>
  );
}
