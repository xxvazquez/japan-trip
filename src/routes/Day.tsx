import { useEffect, useState } from "react";
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
import { TodayCard } from "@/components/TodayCard";
import { Section } from "@/components/Section";
import { InsetRow } from "@/components/InsetRow";
import { RowSelect } from "@/components/RowSelect";
import { ActionSheet, useActionSheet } from "@/components/ActionSheet";
import { Editable } from "@/components/Editable";
import { MoneyField } from "@/components/MoneyField";
import { RichNote } from "@/components/RichNote";
import { RowMenu } from "@/components/RowMenu";
import { RowDeleteButton } from "@/components/RowDeleteButton";
import { SwipeToDelete } from "@/components/SwipeToDelete";
import { ConfirmButton } from "@/components/ConfirmButton";
import { Icon } from "@/components/Icon";
import { RouteLabel } from "@/components/RouteLabel";
import { IconTile } from "@/components/IconTile";
import { toneForPlaceCategory } from "@/lib/tones";
import { useData, lookups } from "@/lib/data";
import { useApp, undoable } from "@/store/useApp";
import { useReadOnly } from "@/lib/readonly";
import { dayKind, fmtDate, plural, todayISO } from "@/lib/dates";
import { legHex } from "@/lib/legColors";
import { gmapsLink, gmapsRoute, mapUrlCoords } from "@/lib/maps";
import { fmtWalk } from "@/lib/geo";
import { useWalk } from "@/lib/walkRoute";
import { nearestStationLookup, type NearbyStation } from "@/lib/transitStation";
import { nearestOpeningHours, type PlaceHours } from "@/lib/placeHours";
import { hoursForDate } from "@/lib/openingHours";
import { fetchDayWeather, weatherLabel, type DayWeather } from "@/lib/weather";
import { parseMoney, fmtMoney, cleanAmount, fmtFare, expenseCategoryIcon } from "@/lib/cost";
import { useAsyncAction } from "@/lib/useAsyncAction";
import type { Day as DayT, DayCost, ExpenseCategory, Hotel, PlanItem, Place, TripData } from "@/core/types";

const rid = () => Math.random().toString(36).slice(2, 9);

/** "14:00–15:15" (any dash, any spacing) → ["14:00", "15:15"]; else null */
function splitRange(t?: string): [string, string] | null {
  const m = (t ?? "").match(/^\s*(\d{1,2}:\d{2})\s*[–—-]\s*(\d{1,2}:\d{2})\s*$/);
  return m ? [m[1], m[2]] : null;
}

/** the day's costs, summed per currency — for the header meta line, same
 *  math as CostList's own subtotal row. */
function daySpentText(costs: DayCost[] | undefined, primary: string): string | undefined {
  if (!costs?.length) return undefined;
  const subtotals = new Map<string, number>();
  for (const c of costs) {
    const m = parseMoney(c.amount, c.currency || primary);
    if (m) subtotals.set(m.currency, (subtotals.get(m.currency) ?? 0) + m.amount);
  }
  if (subtotals.size === 0) return undefined;
  return `Total spent: ${[...subtotals].map(([cur, amt]) => fmtMoney(amt, cur)).join(" · ")}`;
}

function weatherText(w: DayWeather): string {
  const text = `${weatherLabel(w.code)}, ${w.lowC}–${w.highC}°C`;
  return w.precipPct >= 30 ? `${text} · ${w.precipPct}% rain` : text;
}

export default function Day() {
  const data = useData();
  const { id } = useParams();
  if (!data) return null;
  const day = lookups(data).day(id);
  if (!day)
    return <Missing title="No day here" body="That day isn’t part of this trip." to="/" cta="Back to Plan" />;
  // the page proper is its own component so its hooks never sit behind the
  // early returns above — a day deleted while it's open (a shared trip's
  // realtime change) would otherwise change the hook count and crash
  return <DayPage data={data} day={day} />;
}

function DayPage({ data, day }: { data: TripData; day: DayT }) {
  const updateEntity = useApp((s) => s.updateEntity);
  const addEntity = useApp((s) => s.addEntity);
  const removeEntity = useApp((s) => s.removeEntity);
  const nav = useNavigate();
  const ro = useReadOnly();
  const { busy: icsBusy, run: runIcs } = useAsyncAction();

  const L = lookups(data);
  const patch = (p: Partial<DayT>) => updateEntity<DayT>("days", day.id, p);
  const leg = L.leg(day.legId);
  const hotel = L.hotel(day.hotelId);
  const journey = L.journey(day.journeyId);
  const loc = data.config.locale;
  const setPlan = (next: PlanItem[]) => patch({ plan: next.length ? next : undefined });
  // places available to a plan step's picker — drawn only from this day's own
  // linked areas (see the Areas section below), not every place in the trip
  const areaPlaceIds = new Set((day.areaIds ?? []).flatMap((aid) => data.areas.find((a) => a.id === aid)?.placeIds ?? []));
  const areaPlaces = data.places.filter((p) => areaPlaceIds.has(p.id));
  // once a day spans more than 2 areas, the picker shows which area each
  // place is from (first area wins for a place linked to more than one)
  const areaNameByPlaceId = new Map<string, string>();
  if ((day.areaIds ?? []).length > 2) {
    for (const aid of day.areaIds ?? []) {
      const a = data.areas.find((x) => x.id === aid);
      for (const pid of a?.placeIds ?? []) {
        if (!areaNameByPlaceId.has(pid)) areaNameByPlaceId.set(pid, a!.name);
      }
    }
  }
  // places already on this day's plan — offered as a quick pick when logging
  // an expense, so its name doesn't need retyping
  const dayPlaceIds = new Set<string>();
  const dayPlaces: Place[] = [];
  for (const it of day.plan ?? []) {
    if (!it.placeId || dayPlaceIds.has(it.placeId)) continue;
    const p = data.places.find((pl) => pl.id === it.placeId);
    if (p) { dayPlaceIds.add(it.placeId); dayPlaces.push(p); }
  }
  // the day's forecast — anchored to wherever you're staying that day (an
  // override, else the leg's own hotel), since a day has no coordinates of
  // its own. Silent when that hotel has no coordinates yet or the date is
  // too far out for the free forecast window.
  const weatherHotel = hotel ?? L.hotel(leg?.hotelId);
  const [weather, setWeather] = useState<DayWeather | null>(null);
  useEffect(() => {
    setWeather(null);
    if (weatherHotel?.lat === undefined || weatherHotel?.lng === undefined) return;
    let cancelled = false;
    void fetchDayWeather(weatherHotel.lat, weatherHotel.lng, day.date).then((w) => { if (!cancelled) setWeather(w); });
    return () => { cancelled = true; };
  }, [weatherHotel?.lat, weatherHotel?.lng, day.date]);

  const setCosts = (next: DayCost[]) => patch({ costs: next.length ? next : undefined });
  // the wallet icon on a plan row: add a cost prefilled with that step's name,
  // then scroll it into view and briefly highlight it so it's obvious where it
  // landed — amount and category are still typed in by hand, same as always
  const [justAddedCostId, setJustAddedCostId] = useState<string | null>(null);
  useEffect(() => {
    if (!justAddedCostId) return;
    document.getElementById(`cost-${justAddedCostId}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    const t = setTimeout(() => setJustAddedCostId(null), 1600);
    return () => clearTimeout(t);
  }, [justAddedCostId]);
  const quickAddCost = (label: string) => {
    const id = rid();
    setCosts([...(day.costs ?? []), { id, label, amount: "" }]);
    setJustAddedCostId(id);
  };

  // "＋ New journey" — a blank journey, its type chosen on the journey page (never
  // guessed from the day's date: you can arrive, transfer or leave at any point).
  const newJourney = () => {
    const jid = crypto.randomUUID?.() ?? `journeys-${rid()}`;
    addEntity("journeys", { id: jid, label: "", kind: "transfer", date: day.date, segments: [] } as never);
    patch({ journeyId: jid });
    nav(`/journey/${jid}`);
  };

  const downloadDayCalendar = () =>
    runIcs(async () => {
      const { buildDayIcs, downloadIcs } = await import("@/lib/ics");
      downloadIcs(day.title || fmtDate(day.date, loc), buildDayIcs(data, day, { includePrivate: true }));
    });

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
        meta={[weather && weatherText(weather), daySpentText(day.costs, (data.config.currencies ?? [])[0] ?? "")]
          .filter(Boolean)
          .join(" · ") || undefined}
        action={
          <button
            onClick={downloadDayCalendar}
            disabled={icsBusy}
            className="-m-1 p-1 text-ink-faint transition-colors hover:text-ink-soft disabled:opacity-50"
          >
            <Icon name="calendar" size={17} />
            <span className="sr-only">{icsBusy ? "Building calendar file…" : "Add to calendar"}</span>
          </button>
        }
      />

      {/* today only: what's happening now / next — the main Plan stays a plain list of days */}
      {day.date === todayISO() && <TodayCard day={day} places={data.places} />}

      {ro ? (
        (hotel || journey) && (
          <div className="mb-8 flex flex-wrap gap-2">
            {hotel && (
              <Link to={`/hotel/${hotel.id}`} className="btn-sm">
                <Icon name="bed" size={14} className="text-ink-soft" /> {hotel.name}
              </Link>
            )}
            {journey && (
              <Link to={`/journey/${journey.id}`} className="btn-sm">
                <Icon name="train" size={14} className="text-ink-soft" /> <RouteLabel label={journey.label || "Journey"} />
              </Link>
            )}
          </div>
        )
      ) : (
        <Section className="mb-8">
          <ul>
            <InsetRow label="Staying at">
              <RowSelect
                value={day.hotelId ?? ""}
                onChange={(e) => patch({ hotelId: e.target.value || undefined })}
                aria-label="Which hotel you're staying at"
              >
                <option value="">— none —</option>
                {data.hotels.map((h) => <option key={h.id} value={h.id}>{h.name || "Hotel"}</option>)}
              </RowSelect>
            </InsetRow>
            <InsetRow label="Journey">
              <RowSelect
                value={day.journeyId ?? ""}
                onChange={(e) => {
                  if (e.target.value === "__new") newJourney();
                  else patch({ journeyId: e.target.value || undefined });
                }}
                aria-label="A journey on this day"
              >
                <option value="">None</option>
                {data.journeys.map((j) => <option key={j.id} value={j.id}>{j.label || "Journey"}</option>)}
                <option value="__new">＋ New journey…</option>
              </RowSelect>
            </InsetRow>
          </ul>
        </Section>
      )}

      <div className="space-y-6">
      {/* DAY TRIP — the logistics you opened the page for; first when it applies */}
      {day.dayTrip && (
        <Section
          icon="explore"
          title="Day trip"
          info="Out-of-town days get extra fields: how to get there and back, and the last train home."
          action={!ro && <button onClick={() => patch({ dayTrip: false })} className="link-quiet text-xs">not a day trip</button>}
        >
          <div className="space-y-3 px-3.5 py-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* out */}
              <div className="rounded-[12px] bg-accent/[0.07] p-3">
                <p className="flex items-center gap-1.5 text-accent">
                  <Icon name="chevron" size={13} className="shrink-0" />
                  <span className="eyebrow text-accent">Getting there</span>
                </p>
                <div className="note mt-1.5 text-ink">
                  <RichNote value={day.getThere ?? ""} placeholder="The route out — train, bus, how long" onCommit={(v) => patch({ getThere: v || undefined })} />
                </div>
              </div>

              {/* back */}
              <div className="rounded-[12px] bg-gold/[0.08] p-3">
                <p className="flex items-center gap-1.5 text-gold">
                  <Icon name="chevron" size={13} className="shrink-0 rotate-180" />
                  <span className="eyebrow text-gold">Getting back</span>
                </p>
                <div className="note mt-1.5 text-ink">
                  <RichNote value={day.getBack ?? ""} placeholder="The route back" onCommit={(v) => patch({ getBack: v || undefined })} />
                </div>
                {(day.lastTrainBack || !ro) && (
                  <p className="mt-2.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5 border-t border-gold/25 pt-2 text-sm">
                    <Icon name="clock" size={13} className="shrink-0 translate-y-0.5 text-gold" />
                    <span className="eyebrow text-gold">Last way back</span>
                    <span className="value">
                      <Editable label="Last way back" value={day.lastTrainBack ?? ""} placeholder="e.g. last train ~23:00" onCommit={(v) => patch({ lastTrainBack: v || undefined })} />
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </Section>
      )}

      {/* PLAN — the day's itinerary: time + step, drag to reorder */}
      {((day.plan ?? []).length > 0 || !ro) && (
        <Section
          icon="itinerary"
          title="Plan"
          info="Drag to reorder. Pick a place from an Area you've added below, or Custom for anything else — tap the note line under it to add one."
        >
          <PlanList day={day} returnHotel={dayKind(day, data) === "departure" ? undefined : weatherHotel} tz={data.config.tripTimeZone} items={day.plan ?? []} places={data.places} areaPlaces={areaPlaces} areaNameByPlaceId={areaNameByPlaceId} categoryIcons={data.config.categoryIcons} readOnly={ro} onChange={setPlan} onQuickAddCost={quickAddCost} />
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
                <span key={id} className="chip pr-2.5">
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
                    <ConfirmButton
                      label={`Remove ${a.name || "this area"}`}
                      onConfirm={() => patch({ areaIds: (day.areaIds ?? []).filter((x) => x !== id) })}
                      className="text-ink-faint hover:text-accent"
                    >
                      <Icon name="close" size={11} />
                    </ConfirmButton>
                  )}
                </span>
              );
            })}
            {!ro && data.areas.some((a) => !(day.areaIds ?? []).includes(a.id)) && (
              <select
                value=""
                aria-label="Add an area to this day"
                onChange={(e) => e.target.value && patch({ areaIds: [...(day.areaIds ?? []), e.target.value] })}
                className="chip cursor-pointer appearance-none text-accent focus:outline-none"
              >
                <option value="">＋ Add area</option>
                {data.areas
                  .filter((a) => !(day.areaIds ?? []).includes(a.id))
                  .map((a) => (
                    <option key={a.id} value={a.id}>{a.name || "Untitled"} · {plural(a.placeIds.length, "place")}</option>
                  ))}
              </select>
            )}
          </div>
        </Section>
      )}

      {/* SPENDING — what the day cost; feeds the Expenses roll-up */}
      {((day.costs ?? []).length > 0 || !ro) && (
        <Section icon="vault" title="Spending" info="Tag each amount with a category — the Expenses tab in Logbook adds them up.">
          <CostList
            costs={day.costs ?? []}
            categories={data.config.expenseCategories ?? []}
            currencies={(data.config.currencies ?? []).filter(Boolean)}
            places={dayPlaces}
            highlightId={justAddedCostId}
            readOnly={ro}
            onChange={setCosts}
          />
        </Section>
      )}

      {/* GENERAL NOTES — free-form catch-all, after the day's actual plan */}
      {(day.notes || !ro) && (
        <Section icon="list" title="General notes" info="Supports bold, italic, bullet lists, checklists, and links — tap a note to see the formatting toolbar.">
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

      {!ro && (
        <Section className="mt-6">
          <ConfirmButton
            label="Delete day"
            onConfirm={() => undoable("Day deleted", () => { removeEntity("days", day.id); nav("/"); })}
            className="w-full justify-center px-3.5 py-3 text-sm font-medium text-danger"
          >
            Delete day
          </ConfirmButton>
        </Section>
      )}
    </Page>
  );

}

/* ------------------------------------------------------------------ plan */

function PlanList({ day, returnHotel, tz, items, places, areaPlaces, areaNameByPlaceId, categoryIcons, readOnly, onChange, onQuickAddCost }: {
  day: DayT;
  /** where the day ends — the hotel you're staying at (see `ReturnToHotel`) */
  returnHotel?: Hotel;
  tz?: string;
  items: PlanItem[];
  places: Place[];
  areaPlaces: Place[];
  areaNameByPlaceId: Map<string, string>;
  categoryIcons?: Record<string, string>;
  readOnly: boolean;
  onChange: (next: PlanItem[]) => void;
  onQuickAddCost: (label: string) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 8 } }),
    useSensor(KeyboardSensor),
  );
  const patchItem = (id: string, p: Partial<PlanItem>) => onChange(items.map((x) => (x.id === id ? { ...x, ...p } : x)));
  const removeItem = (id: string) => onChange(items.filter((x) => x.id !== id));
  // dropped right after the original — a copied step usually belongs right
  // next to it (e.g. the same coffee stop, twice on a long day), not at the end
  const duplicateItem = (id: string) => {
    const i = items.findIndex((x) => x.id === id);
    if (i === -1) return;
    onChange([...items.slice(0, i + 1), { ...items[i], id: rid() }, ...items.slice(i + 1)]);
  };

  if (items.length === 0) {
    return readOnly ? (
      <p className="px-3.5 py-3 text-sm text-ink-faint">Nothing planned yet.</p>
    ) : (
      <button onClick={() => onChange([{ id: rid(), text: "" }])} className="action w-full px-3.5 py-3 text-sm">
        <Icon name="plus" size={14} /> Add a step
      </button>
    );
  }

  const rows = items.map((it, i) => (
    <PlanRow
      key={it.id}
      day={day}
      tz={tz}
      item={it}
      place={it.placeId ? places.find((p) => p.id === it.placeId) : undefined}
      nextPlace={items[i + 1]?.placeId ? places.find((p) => p.id === items[i + 1].placeId) : undefined}
      areaPlaces={areaPlaces}
      areaNameByPlaceId={areaNameByPlaceId}
      categoryIcons={categoryIcons}
      readOnly={readOnly}
      onPatch={(p) => patchItem(it.id, p)}
      onRemove={() => removeItem(it.id)}
      onDuplicate={() => duplicateItem(it.id)}
      onQuickAddCost={onQuickAddCost}
    />
  ));

  // the day closes with the way back to the hotel; its walk figures need the
  // last step to be tied to a real place, the directions link doesn't
  const lastPlace = items[items.length - 1].placeId ? places.find((p) => p.id === items[items.length - 1].placeId) : undefined;
  const backRow = returnHotel ? <ReturnToHotel from={lastPlace} hotel={returnHotel} indent={!readOnly} /> : null;

  if (readOnly) return <><ul>{rows}</ul>{backRow}</>;

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const from = items.findIndex((x) => x.id === active.id);
    const to = items.findIndex((x) => x.id === over.id);
    if (from >= 0 && to >= 0) onChange(arrayMove(items, from, to));
  };

  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={items.map((x) => x.id)} strategy={verticalListSortingStrategy}>
          <ul>{rows}</ul>
        </SortableContext>
      </DndContext>
      {backRow}
      {/* a second "add" affordance down here too — the one up in the Section
       *  header (see Day()) means a long plan otherwise needs a scroll back
       *  to the top just to add the next step */}
      <button onClick={() => onChange([...items, { id: rid(), text: "" }])} className="action w-full border-t border-line px-3.5 py-3 text-sm">
        <Icon name="plus" size={14} /> Add a step
      </button>
    </>
  );
}

function PlanRow({ day, tz, item, place, nextPlace, areaPlaces, areaNameByPlaceId, categoryIcons, readOnly, onPatch, onRemove, onDuplicate, onQuickAddCost }: {
  day: DayT;
  tz?: string;
  item: PlanItem;
  place?: Place;
  /** the next step's linked place, if both it and this step have one — for
   *  the real walking time shown at the foot of this card (see `StepWalkLines`) */
  nextPlace?: Place;
  areaPlaces: Place[];
  areaNameByPlaceId: Map<string, string>;
  categoryIcons?: Record<string, string>;
  readOnly: boolean;
  onPatch: (p: Partial<PlanItem>) => void;
  onRemove: () => void;
  onDuplicate: () => void;
  onQuickAddCost: (label: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id, disabled: readOnly });
  const mapHref = gmapsLink(item.url || place?.url || place?.name);
  // open the tab synchronously, in the same click, so the browser doesn't
  // treat it as an unrequested popup once the dynamic import resolves — then
  // point it at the real link once `ics.ts` (a separate lazy chunk) loads
  const addToGoogleCalendar = () => {
    const w = window.open("", "_blank");
    import("@/lib/ics").then(({ googleCalendarUrlForPlanItem }) => {
      if (w) w.location.href = googleCalendarUrlForPlanItem(item, day, tz, place);
    });
  };

  // the step's "what" picker: this day's own area places, plus the step's
  // already-linked place if it isn't one of them (an area removed later, or
  // a legacy link) — never silently drops an existing link.
  const pickable = place && !areaPlaces.some((p) => p.id === place.id)
    ? [place, ...areaPlaces]
    : areaPlaces;
  const sortedPickable = [...pickable].sort((a, b) => a.name.localeCompare(b.name));

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
      className={`relative z-10 ${place ? "" : "opacity-70"}`}
    />
  );

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`group relative text-sm after:pointer-events-none after:absolute after:bottom-0 after:left-12 after:right-0 after:h-px after:bg-line last:after:hidden ${isDragging ? "z-10 bg-surface opacity-80" : ""}`}
    >
      <SwipeToDelete undoLabel="Step removed" onDelete={readOnly ? undefined : onRemove}>
      <div className="px-3.5 py-2.5">
        <div className="flex items-start gap-2.5">
          {/* leading column — just the drag handle now; tile + hour moved
              into the content column's own meta line below, so the row
              shares one left margin instead of a separate icon/hour column
              sitting empty once the title/note grow past it. Omitted
              entirely when read-only (nothing left to put there), which is
              also why the stem's left offset (below) differs by mode. */}
          {!readOnly && (
            <div className="flex shrink-0 items-center">
              <button
                {...attributes}
                {...listeners}
                className="grid h-4 w-3 shrink-0 cursor-grab touch-none place-items-center text-ink-faint/50 active:cursor-grabbing"
                aria-label="Drag to reorder"
              >
                <Icon name="grip" size={13} />
              </button>
            </div>
          )}

          {/* what the step is — a place from one of this day's Areas, or
              Custom text below it; falls back to a plain text field when
              there's nothing to pick from yet (no Area added to the day). A
              note is its own quiet row underneath — italic placeholder when
              empty, tap to expand and edit. */}
          <div className="min-w-0 flex-1 space-y-1 pt-px">
            {/* tile + hour — one meta line, icon leading so the hour reads
                like a caption under it rather than a column of its own */}
            <div className="flex items-center gap-1.5">
              {mapHref ? (
                <a href={mapHref} target="_blank" rel="noopener" className="shrink-0" aria-label={place ? `Open ${place.name} in Google Maps` : "Open in Google Maps"}>
                  {tile}
                </a>
              ) : (
                tile
              )}
              {(readOnly ? !!timeText : true) && (
                <span className="meta flex h-[22px] shrink-0 items-center rounded-[7px] bg-surface-2 px-1.5 tabular-nums">
                  {readOnly ? (
                    timeText
                  ) : plainTime ? (
                    <Editable
                      as="time"
                      label="Time"
                      value={item.time ?? ""}
                      onCommit={(v) => onPatch({ time: v || undefined })}
                    />
                  ) : (
                    <Editable label="Time" value={item.time ?? ""} placeholder="Add a time" onCommit={(v) => onPatch({ time: v.trim() || undefined })} />
                  )}
                </span>
              )}
              {place && <PlaceHoursLine place={place} date={day.date} />}
            </div>
            {readOnly ? (
              // plain text — the tile beside the time is the Maps link
              <span className="block text-sm font-medium leading-snug text-ink">{item.text}</span>
            ) : sortedPickable.length > 0 ? (
              <>
                <PlacePicker
                  value={item.placeId}
                  places={sortedPickable}
                  areaNameByPlaceId={areaNameByPlaceId}
                  categoryIcons={categoryIcons}
                  onPick={(pid) => {
                    if (!pid) { onPatch({ placeId: undefined }); return; }
                    const p = sortedPickable.find((x) => x.id === pid);
                    onPatch({ placeId: pid, text: p?.name ?? item.text });
                  }}
                />
                {!item.placeId && (
                  <Editable label="Custom step" value={item.text} placeholder="What is it?" onCommit={(v) => onPatch({ text: v })} className="block text-sm font-medium leading-snug text-ink" />
                )}
              </>
            ) : (
              <Editable label="Step" value={item.text} placeholder="Add a step" onCommit={(v) => onPatch({ text: v })} className="block text-sm font-medium leading-snug text-ink" />
            )}
            <RichNote
              value={item.note ?? ""}
              onCommit={(v) => onPatch({ note: v || undefined })}
              placeholder="Add a note…"
              className="block text-[0.8125rem] leading-relaxed text-ink-faint [&_strong]:text-ink-soft"
              collapsible
            />
            {place && <StepWalkLines place={place} nextPlace={nextPlace} />}
          </div>

          {/* one ⋯ instead of four loose glyphs — the step's title and lines
              get the width, the secondary actions sit behind the sheet */}
          <RowMenu label={`More for ${place?.name || item.text || "this step"}`}>
            <button type="button" className="menu-item" onClick={addToGoogleCalendar}>
              <Icon name="calendar" size={16} /> Add to Google Calendar
            </button>
            {!readOnly && (
              <>
                <button type="button" className="menu-item" onClick={onDuplicate}>
                  <Icon name="copy" size={16} /> Duplicate
                </button>
                <button type="button" className="menu-item" onClick={() => onQuickAddCost(place?.name || item.text || "")}>
                  <Icon name="wallet" size={16} /> Add an expense
                </button>
                <button type="button" className="menu-item text-danger" onClick={() => undoable("Step removed", onRemove)}>
                  <Icon name="close" size={16} /> Remove
                </button>
              </>
            )}
          </RowMenu>
        </div>
      </div>
      </SwipeToDelete>
    </li>
  );
}

/** past this, a walk stops being the plan — the row points at the train (and
 *  Google Maps' own transit directions) instead of a walking route. */
const LONG_WALK_MIN = 20;

/** The day's closing row: how to get from the last stop back to the hotel
 *  you're staying at. Walking time and distance when the hotel has
 *  coordinates, plus — once the walk is long — the station to head for at
 *  each end. The whole row opens Google Maps directions (transit when far,
 *  walking when close): the best route with the actual lines and transfers is
 *  Google's to work out, there's no free keyless API for it here. When the
 *  last step isn't tied to a place there's no start point to measure from,
 *  so the row just opens directions from wherever you are. */
function ReturnToHotel({ from, hotel, indent }: { from?: Place; hotel: Hotel; indent: boolean }) {
  const linkCoords = mapUrlCoords(hotel.mapUrl);
  const to =
    hotel.lat !== undefined && hotel.lng !== undefined ? { lat: hotel.lat, lng: hotel.lng }
    : linkCoords ? { lat: linkCoords[0], lng: linkCoords[1] }
    : null;
  const walk = useWalk(from ?? { lat: 0, lng: 0 }, from ? to : null);
  const long = !walk || walk.min > LONG_WALK_MIN;

  const [fromStation, setFromStation] = useState<NearbyStation | null>(null);
  const [hotelStation, setHotelStation] = useState<NearbyStation | null>(null);
  useEffect(() => {
    setFromStation(null);
    setHotelStation(null);
    if (!from || !to || !long) return;
    let cancelled = false;
    void nearestStationLookup(from.lat, from.lng).then((s) => { if (!cancelled) setFromStation(s); });
    void nearestStationLookup(to.lat, to.lng).then((s) => { if (!cancelled) setHotelStation(s); });
    return () => { cancelled = true; };
  }, [long, from?.lat, from?.lng, to?.lat, to?.lng]);

  const dest = to ? `${to.lat},${to.lng}` : [hotel.name, hotel.address].filter(Boolean).join(" ");
  const href = gmapsRoute(from && `${from.lat},${from.lng}`, dest, long ? "transit" : "walking");
  const piece = "flex min-w-0 items-start gap-1";
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      aria-label={`Directions back to ${hotel.name || "the hotel"}`}
      className={`flex items-start gap-2.5 border-t border-line py-2.5 pr-3.5 active:bg-surface-2 ${indent ? "pl-9" : "pl-3.5"}`}
    >
      <IconTile size="sm" name="bed" tone="accent" className="mt-px" />
      <span className="min-w-0 flex-1 space-y-1">
        <span className="block text-sm font-medium leading-snug text-ink">Back to {hotel.name || "the hotel"}</span>
        {(walk || (fromStation && hotelStation && fromStation.name !== hotelStation.name)) && (
          <span className="meta flex flex-wrap gap-x-3 gap-y-0.5 text-ink-faint">
            {walk && (
              <span className={piece}>
                <Icon name="walk" size={12} className="mt-[3px] shrink-0" />
                <span className="min-w-0">{fmtWalk(walk)}</span>
              </span>
            )}
            {long && fromStation && hotelStation && fromStation.name !== hotelStation.name && (
              <span className={piece}>
                <Icon name="train" size={12} className="mt-[3px] shrink-0" />
                <span className="min-w-0">{fromStation.name} → {hotelStation.name}</span>
              </span>
            )}
          </span>
        )}
      </span>
      <span className="flex shrink-0 items-center gap-1 pt-0.5 text-xs font-medium text-accent">
        Directions <Icon name="chevron" size={12} />
      </span>
    </a>
  );
}

/** the step's own opening hours, straight from OpenStreetMap and narrowed to
 *  the day's own date (`hoursForDate` — the rule for that month and weekday,
 *  not the whole year's schedule; nothing at all when nothing covers the
 *  date). An FYI to replan by eye, not a warning: nothing is flagged as a
 *  conflict. Always the same spot — right end of the tile/time row — however
 *  long the text. Silent when nothing's tagged nearby. */
function PlaceHoursLine({ place, date }: { place: Place; date?: string }) {
  const [hours, setHours] = useState<PlaceHours | null>(null);
  useEffect(() => {
    setHours(null);
    let cancelled = false;
    void nearestOpeningHours(place.lat, place.lng).then((h) => { if (!cancelled) setHours(h); });
    return () => { cancelled = true; };
  }, [place.id, place.lat, place.lng]);
  const text = hours ? (date ? hoursForDate(hours.hours, date) : hours.hours) : null;
  if (!text) return null;
  return (
    <span className="meta ml-auto flex min-w-0 items-center gap-1 text-right text-ink-faint">
      <Icon name="clock" size={12} className="shrink-0" />
      <span className="min-w-0">{text}</span>
    </span>
  );
}

/** one caption of the walk figures — 🚶 "≈ 2h 2min · 9.8 km" (to the next
 *  step) and 🚆 "≈ 1 min · 84 m · Kita-sando" (to the nearest station) — side
 *  by side on one line, the icons saying which is which, wrapping as whole
 *  pieces only when the screen is too narrow for both. Time and distance always come
 *  as a pair (`useWalk`: estimate first, real route when it lands). The
 *  station comes from OpenStreetMap (`transitStation.ts`); a lookup that
 *  came back empty is tried once more shortly after, since the public
 *  server drops the odd request. */
function StepWalkLines({ place, nextPlace }: { place: Place; nextPlace?: Place }) {
  const next = useWalk(place, nextPlace);
  const [station, setStation] = useState<NearbyStation | null>(null);
  useEffect(() => {
    setStation(null);
    let cancelled = false;
    let retry: ReturnType<typeof setTimeout> | undefined;
    void nearestStationLookup(place.lat, place.lng).then((s) => {
      if (cancelled) return;
      if (s) { setStation(s); return; }
      retry = setTimeout(() => {
        void nearestStationLookup(place.lat, place.lng).then((s2) => { if (!cancelled) setStation(s2); });
      }, 6000);
    });
    return () => { cancelled = true; clearTimeout(retry); };
  }, [place.id, place.lat, place.lng]);
  const toStation = useWalk(place, station);

  const piece = "flex min-w-0 items-start gap-1";
  return (
    <>
      {(next || (station && toStation)) && (
        <span className="meta flex flex-wrap gap-x-3 gap-y-0.5 text-ink-faint">
          {next && (
            <span className={piece}>
              <Icon name="walk" size={12} className="mt-[3px] shrink-0" />
              <span className="min-w-0">{fmtWalk(next)}</span>
            </span>
          )}
          {station && toStation && (
            <span className={piece}>
              <Icon name="train" size={12} className="mt-[3px] shrink-0" />
              <span className="min-w-0">{fmtWalk(toStation)} · {station.name}</span>
            </span>
          )}
        </span>
      )}
    </>
  );
}

/** the plan step's "what" picker — a native `<select>` can't style part of an
 *  option's text, so once a day has more than 2 Areas (see `areaNameByPlaceId`
 *  in `Day`) and a place name alone stops being enough to tell rows apart, this
 *  renders as an iOS-style sheet list instead, with the area as trailing quiet
 *  text on the same line (same idiom as a place's category in Manage). */
function PlacePicker({ value, places, areaNameByPlaceId, categoryIcons, onPick }: {
  value?: string;
  places: Place[];
  areaNameByPlaceId: Map<string, string>;
  categoryIcons?: Record<string, string>;
  onPick: (id?: string) => void;
}) {
  const { open, setOpen, anchorRef } = useActionSheet();
  const current = value ? places.find((p) => p.id === value) : undefined;
  return (
    <>
      <button
        ref={anchorRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="What this step is"
        aria-haspopup="menu"
        className={`editable block w-full max-w-full cursor-pointer bg-transparent text-left leading-snug focus:outline-none ${
          current ? "text-sm font-medium text-ink" : "text-[0.8125rem] text-ink-soft"
        }`}
      >
        {current ? current.name : (
          <>Custom… <Icon name="down" size={11} className="inline-block align-[1px] text-ink-faint" /></>
        )}
      </button>
      <ActionSheet open={open} onClose={() => setOpen(false)} anchorRef={anchorRef} title="What this step is">
        <div className="max-h-[60vh] overflow-y-auto">
          <button type="button" onClick={() => onPick(undefined)} className="menu-item flex w-full items-center gap-2">
            <Icon name="check" size={13} className={`shrink-0 ${!value ? "text-accent" : "text-ink-faint/30"}`} />
            <IconTile size="sm" name="pin" tone="ink-faint" className="opacity-70" />
            <span className="min-w-0 flex-1 truncate">Custom…</span>
          </button>
          {places.map((p) => {
            const areaName = areaNameByPlaceId.get(p.id);
            const on = p.id === value;
            const glyph = p.category ? categoryIcons?.[p.category] : undefined;
            return (
              <button key={p.id} type="button" onClick={() => onPick(p.id)} className="menu-item flex w-full items-center gap-2">
                <Icon name="check" size={13} className={`shrink-0 ${on ? "text-accent" : "text-ink-faint/30"}`} />
                <IconTile
                  size="sm"
                  glyph={glyph}
                  name={glyph ? undefined : "pin"}
                  color={p.source === "mymap" ? p.color : undefined}
                  tone={toneForPlaceCategory(p.category, categoryIcons)}
                />
                <span className="min-w-0 flex-1 truncate">{p.name}</span>
                {areaName && <span className="shrink-0 text-2xs text-ink-faint">{areaName}</span>}
              </button>
            );
          })}
        </div>
      </ActionSheet>
    </>
  );
}

/** The day's spend — a category + a whole-number amount per row, with an
 *  optional free-text note. The amounts feed `tripCost`; the category drives
 *  the Expenses grouping. */
function CostList({ costs, categories, currencies, places, highlightId, readOnly, onChange }: {
  costs: DayCost[];
  categories: ExpenseCategory[];
  currencies: string[];
  places: Place[];
  highlightId?: string | null;
  readOnly: boolean;
  onChange: (next: DayCost[]) => void;
}) {
  const primary = currencies[0] ?? "";
  const setAt = (i: number, patch: Partial<DayCost>) => onChange(costs.map((c, j) => (j === i ? { ...c, ...patch } : c)));
  const addWithLabel = (label: string) => onChange([...costs, { id: rid(), label, amount: "" }]);
  const { open, setOpen, anchorRef } = useActionSheet();
  // a place already on the day's plan can be picked straight off, so its name
  // doesn't need retyping — otherwise there's nothing to pick from, so skip
  // straight to a blank row like before
  const add = () => (places.length > 0 ? setOpen(true) : addWithLabel(""));
  const catLabel = (id?: string) => categories.find((c) => c.id === id)?.label ?? "Uncategorised";

  const addButton = (className: string, iconSize: number) => (
    <>
      <button ref={anchorRef} onClick={add} className={className}><Icon name="plus" size={iconSize} /> Add an amount</button>
      <ActionSheet open={open} onClose={() => setOpen(false)} anchorRef={anchorRef} title="What was it?">
        <button type="button" onClick={() => addWithLabel("")} className="menu-item">Custom…</button>
        {places.map((p) => (
          <button key={p.id} type="button" onClick={() => addWithLabel(p.name)} className="menu-item">{p.name}</button>
        ))}
      </ActionSheet>
    </>
  );

  const subtotals = new Map<string, number>();
  for (const c of costs) {
    const m = parseMoney(c.amount, c.currency || primary);
    if (m) subtotals.set(m.currency, (subtotals.get(m.currency) ?? 0) + m.amount);
  }

  if (costs.length === 0) {
    return readOnly ? (
      <p className="px-3.5 py-3 text-sm text-ink-faint">Nothing logged.</p>
    ) : (
      addButton("action w-full px-3.5 py-3 text-sm", 14)
    );
  }

  return (
    <ul>
      {costs.map((c, i) => {
          const known = !c.categoryId || categories.some((cat) => cat.id === c.categoryId);
          const category = categories.find((cat) => cat.id === c.categoryId);
          const tile = category ? expenseCategoryIcon(category, categories.indexOf(category)) : { name: "wallet" as const, tone: "ink-faint" as const };
          return (
            <li
              key={c.id}
              id={`cost-${c.id}`}
              className={`group relative after:pointer-events-none after:absolute after:bottom-0 after:left-3.5 after:right-0 after:h-px after:bg-line last:after:hidden transition-colors duration-700 ${c.id === highlightId ? "bg-accent/10" : ""}`}
            >
              <SwipeToDelete undoLabel="Expense removed" onDelete={readOnly ? undefined : () => onChange(costs.filter((_, j) => j !== i))}>
              <div className="px-3.5 py-2.5">
              <div className="flex items-start gap-3">
                <IconTile size="sm" name={tile.name} glyph={tile.glyph} tone={tile.tone} color={tile.color} className="mt-0.5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-3">
                    <span className="min-w-0 flex-1">
                      {readOnly ? (
                        <span className="text-sm text-ink">{c.label.trim() || catLabel(c.categoryId)}</span>
                      ) : (
                        <Editable label="What was it?" value={c.label} placeholder="What was it?" className="text-sm text-ink" onCommit={(v) => setAt(i, { label: v })} />
                      )}
                    </span>
                    {readOnly ? (
                      <span className="shrink-0 text-right text-sm text-ink tabular-nums">{fmtFare(c.amount, c.currency || primary)}</span>
                    ) : (
                      <span className="shrink-0 text-right text-sm text-ink tabular-nums">
                        <MoneyField
                          label="Amount"
                          amount={c.amount}
                          currency={c.currency}
                          onAmount={(v) => setAt(i, { amount: cleanAmount(v) })}
                          onCurrency={(cc) => setAt(i, { currency: cc })}
                        />
                      </span>
                    )}
                  </div>
                  {/* category — the quiet second line, so it never shouts the
                      same word down the list */}
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
                {!readOnly && <RowDeleteButton undoLabel="Expense removed" onClick={() => onChange(costs.filter((_, j) => j !== i))} />}
              </div>
              </div>
              </SwipeToDelete>
            </li>
          );
        })}
      <li className="relative flex items-baseline justify-between gap-4 px-3.5 py-2.5 after:pointer-events-none after:absolute after:bottom-0 after:left-3.5 after:right-0 after:h-px after:bg-line last:after:hidden">
        <span className="value font-semibold">Total spent</span>
        <span className="value flex flex-wrap justify-end gap-x-3 font-semibold tabular-nums">
          {subtotals.size > 0
            ? [...subtotals].map(([cur, amt]) => <span key={cur || "—"}>{fmtMoney(amt, cur)}</span>)
            : "—"}
        </span>
      </li>
      {!readOnly && <li>{addButton("action w-full px-3.5 py-2.5 text-xs", 13)}</li>}
    </ul>
  );
}
