import { useEffect, useMemo, useState } from "react";
import { flushSync } from "react-dom";
import { useParams, useNavigate, useSearchParams, Link } from "react-router-dom";
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
import { InsetRow, INSET_DIVIDER } from "@/components/InsetRow";
import { ActionRow } from "@/components/ActionRow";
import { RowSelect } from "@/components/RowSelect";
import { ActionSheet, useActionSheet, ConfirmMenuItem } from "@/components/ActionSheet";
import { Editable } from "@/components/Editable";
import { MoneyField } from "@/components/MoneyField";
import { RichNote } from "@/components/RichNote";
import { RowMenu } from "@/components/RowMenu";
import { ContextMenu } from "@/components/ContextMenu";
import { RowDeleteButton } from "@/components/RowDeleteButton";
import { SwipeToDelete } from "@/components/SwipeToDelete";
import { ConfirmButton } from "@/components/ConfirmButton";
import { Icon } from "@/components/Icon";
import { RouteLabel } from "@/components/RouteLabel";
import { IconTile } from "@/components/IconTile";
import { useSplit } from "@/components/SplitMap";
import { glyphForStepText, placeTile, toneForGlyph, toneForPlaceCategory } from "@/lib/tones";
import { glyphForCategoryName } from "@/lib/mapGlyphs";
import { areaLeg } from "@/lib/cityAssign";
import { useCityAnchors, useTripCities } from "@/lib/cityCoords";
import { DayStepper } from "@/components/DayStepper";
import { DayLabels, tripLabels } from "@/components/DayLabels";
import { useData, lookups } from "@/lib/data";
import { useApp, undoable } from "@/store/useApp";
import { useReadOnly } from "@/lib/readonly";
import { reviewHref, reviewSiteFor, useAutoReviewLink } from "@/lib/reviewSite";
import { hasFacts, placeArea, useAutoPlaceFacts } from "@/lib/placeFacts";
import { PlaceFactRows } from "@/components/PlaceFacts";
import { dayJourneys, dayKind, fmtDate, journeyDepartDate, journeyOffDay, journeySpan, journeyStops, plural } from "@/lib/dates";
import { legHex } from "@/lib/legColors";
import { gmapsLink, gmapsRoute, mapUrlCoords, placeMapLink } from "@/lib/maps";
import { fmtWalk, haversineKm } from "@/lib/geo";
import { clockOf, fmtDuration, fmtMinutes } from "@/lib/time";
import { MODE_ICON, MODE_LABEL, MODE_TONE } from "@/lib/transport";
import { useWalk, estimateTransit } from "@/lib/walkRoute";
import { nearestStationLookup, type NearbyStation } from "@/lib/transitStation";
import { nearestOpeningHours, type PlaceHours } from "@/lib/placeHours";
import { hoursForDate } from "@/lib/openingHours";
import { fetchDayWeather, weatherLabel, type DayWeather } from "@/lib/weather";
import { prefetchTiles, canPrefetchTiles, dayOfflinePoints } from "@/lib/offlineTiles";
import { parseMoney, fmtMoney, cleanAmount, fmtFare, expenseCategoryIcon, expenseCategoryForGlyph } from "@/lib/cost";
import { useAsyncAction } from "@/lib/useAsyncAction";
import type { Day as DayT, DayCost, ExpenseCategory, Hotel, Journey, PlanItem, Place, TripData } from "@/core/types";

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
  const mutateTrip = useApp((s) => s.mutateTrip);
  const nav = useNavigate();
  const [, setParams] = useSearchParams();
  const { active: splitActive } = useSplit();
  const ro = useReadOnly();
  const { busy: icsBusy, run: runIcs } = useAsyncAction();
  const areaSheet = useActionSheet();

  const L = lookups(data);
  const patch = (p: Partial<DayT>) => updateEntity<DayT>("days", day.id, p);
  const pinned = (data.config.pinnedDays ?? []).includes(day.id);
  const leg = L.leg(day.legId);
  const hotel = L.hotel(day.hotelId);
  const journeys = dayJourneys(day, data);
  const journeySheet = useActionSheet();
  const linkJourney = (id: string) => patch({ journeyIds: [...(day.journeyIds ?? []), id] });
  const unlinkJourney = (id: string) => {
    const rest = (day.journeyIds ?? []).filter((x) => x !== id);
    patch({ journeyIds: rest.length ? rest : undefined });
  };
  // offered by "Add Journey": the ones not on this day yet, this day's own
  // date first (the likely pick), then by when they leave
  const addable = data.journeys
    .filter((j) => !(day.journeyIds ?? []).includes(j.id))
    .sort((a, b) => {
      const onDay = (j: Journey) => (journeyOffDay(j, day.date) || !journeySpan(j).from ? 1 : 0);
      const da = journeyDepartDate(a) ?? "~", db = journeyDepartDate(b) ?? "~"; // code order: undated last
      return onDay(a) - onDay(b) || (da < db ? -1 : da > db ? 1 : 0);
    });
  const loc = data.config.locale;
  const setPlan = (next: PlanItem[]) => patch({ plan: next.length ? next : undefined });
  const usedLabels = useMemo(() => tripLabels(data.days), [data.days]);
  // rename a label (or with no `to`, drop it) on every day that carries it;
  // a rename onto a label a day already has merges the two
  const relabel = (from: string, to?: string) => {
    const same = (a: string, b: string) => a.toLocaleLowerCase() === b.toLocaleLowerCase();
    for (const d of data.days) {
      if (!d.labels?.some((l) => same(l, from))) continue;
      const next: string[] = [];
      for (const l of d.labels) {
        const v = same(l, from) ? to : l;
        if (v && !next.some((x) => same(x, v))) next.push(v);
      }
      updateEntity<DayT>("days", d.id, { labels: next.length ? next : undefined });
    }
  };
  // areas offered by "+ Add area" — scoped to this day's own city, the way
  // the Map draws it (a day trip to Nara offers Nara's areas, not the base
  // city's), so a multi-city trip doesn't dump every area into one list;
  // falls back to the whole list if none resolve to that city yet (an
  // unlinked hotel, say) so the picker is never left with nothing to offer
  const cityAnchors = useCityAnchors(data);
  const { dayCity, placeCity } = useTripCities(data, cityAnchors);
  const cityAreas = useMemo(() => {
    const city = dayCity.get(day.id);
    const inCity = data.areas.filter((a) => areaLeg(a, placeCity) === city);
    return inCity.length > 0 ? inCity : data.areas;
  }, [data, day.id, dayCity, placeCity]);

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
  // a step's spend starts in the category its icon points to — a café under
  // Food & drink, a museum under Activities — the same icon the step shows
  const stepSpend = (it: PlanItem): SpendChoice => {
    const place = it.placeId ? data.places.find((pl) => pl.id === it.placeId) : undefined;
    const glyph = place
      ? (place.category ? data.config.categoryIcons?.[place.category] || glyphForCategoryName(place.category) : undefined)
      : glyphForStepText(it.text);
    return {
      label: (place?.name ?? it.text ?? "").trim(),
      categoryId: expenseCategoryForGlyph(glyph, data.config.expenseCategories ?? []),
    };
  };
  // what an amount can be picked as: each step in plan order — its place's
  // name, else its own text ("Lunch" is as likely a spend as a museum)
  const spendChoices: SpendChoice[] = [];
  for (const it of day.plan ?? []) {
    const c = stepSpend(it);
    if (c.label && !spendChoices.some((x) => x.label === c.label)) spendChoices.push(c);
  }
  // a new amount starts in the currency last used for day spending — on a
  // trip abroad that's the local one, not the home currency listed first
  const lastSpendCurrency = [...data.days]
    .filter((x) => x.date <= day.date && x.costs?.some((c) => c.amount))
    .sort((a, b) => a.date.localeCompare(b.date))
    .flatMap((x) => (x.costs ?? []).filter((c) => c.amount))
    .at(-1)?.currency;
  const overwhelmingCount = dayPlaces.filter((p) => p.overwhelming).length;
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

  // offline pre-fetch — every place this day's map shows (its areas, its own
  // plan steps, the hotel it's anchored to), so the day's corner of the map
  // works offline before you've ever panned around it
  const offlinePoints = dayOfflinePoints(data, day);
  const { busy: offlineBusy, msg: offlineMsg, run: runOffline } = useAsyncAction("Couldn't cache the map tiles.");
  const downloadOfflineMaps = () =>
    runOffline(async () => {
      const { ok, truncated } = await prefetchTiles(offlinePoints);
      return truncated
        ? `Cached ${ok} tiles — this area is large, so the far edges were left out.`
        : `Cached ${ok} map tiles for offline use.`;
    });

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
  const quickAddCost = (item: PlanItem) => {
    const id = rid();
    const { label, categoryId } = stepSpend(item);
    setCosts([...(day.costs ?? []), { id, label, amount: "", ...(categoryId && { categoryId }) }]);
    setJustAddedCostId(id);
  };

  // "show on map" — on a wide screen the map is already open beside this day
  // (SplitMap), so just select the place in it; on phone there's no pane, so
  // jump to the Map tab instead (same ?sel= deep link the search already uses)
  const showOnMap = (place: Place) => {
    if (splitActive) setParams((p) => { p.set("sel", place.id); return p; }, { replace: true });
    else nav(`/map?sel=${place.id}`);
  };

  // "＋ New journey" — a blank journey, its type chosen on the journey page (never
  // guessed from the day's date: you can arrive, transfer or leave at any point).
  const newJourney = () => {
    const jid = crypto.randomUUID?.() ?? `journeys-${rid()}`;
    addEntity("journeys", { id: jid, label: "", kind: "transfer", date: day.date, segments: [] } as never);
    linkJourney(jid);
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
      <DayStepper days={data.days} current={day.id} locale={loc} />
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
            className="tap -m-1 p-1 text-ink-faint transition-colors hover:text-ink-soft disabled:opacity-50"
          >
            <Icon name="calendar" size={17} />
            <span className="sr-only">{icsBusy ? "Building calendar file…" : "Add to calendar"}</span>
          </button>
        }
      />

      <DayLabels
        labels={day.labels ?? []}
        used={usedLabels}
        readOnly={ro}
        onChange={(next) => patch({ labels: next.length ? next : undefined })}
        onRenameAll={(from, to) => undoable("Label renamed", () => relabel(from, to))}
        onDeleteAll={(l) => undoable("Label deleted", () => relabel(l))}
      />

      {ro ? (
        (hotel || journeys.length > 0) && (
          <div className="mb-8 flex flex-wrap gap-2">
            {hotel && (
              <Link to={`/hotel/${hotel.id}`} className="btn-sm">
                <Icon name="bed" size={14} className="text-ink-soft" /> {hotel.name}
              </Link>
            )}
            {journeys.map((j) => (
              <Link key={j.id} to={`/journey/${j.id}`} className="btn-sm">
                <Icon name={j.segments[0] ? MODE_ICON[j.segments[0].mode] : "train"} size={14} className="text-ink-soft" /> <RouteLabel label={j.label || "New journey"} />
              </Link>
            ))}
          </div>
        )
      ) : (
        <Section className="mb-8">
          <ul>
            <InsetRow label="Staying at">
              <RowSelect
                value={day.hotelId ?? ""}
                onChange={(e) => patch({ hotelId: e.target.value || undefined })}
                aria-label="Where you're staying"
              >
                <option value="">— none —</option>
                {data.hotels.map((h) => <option key={h.id} value={h.id}>{h.name || "Stay"}</option>)}
              </RowSelect>
            </InsetRow>
          </ul>
        </Section>
      )}

      {/* JOURNEYS — every way you're carried today, in the order they leave */}
      {!ro && (
        <Section title="Journeys" id="day-journeys" className="mb-8">
          <ul>
            {journeys.map((j) => (
              <DayJourneyRow key={j.id} day={day} journey={j} data={data} onRemove={() => unlinkJourney(j.id)} />
            ))}
            <li className={INSET_DIVIDER}>
              <button
                ref={journeySheet.anchorRef}
                type="button"
                onClick={() => journeySheet.setOpen(true)}
                className="action w-full px-3.5 py-2.5 text-xs transition-colors duration-150 active:bg-ink/[0.07]"
              >
                <Icon name="plus" size={14} /> Add a journey
              </button>
              <ActionSheet open={journeySheet.open} onClose={() => journeySheet.setOpen(false)} anchorRef={journeySheet.anchorRef} title="Add a journey">
                <button type="button" className="menu-item" onClick={() => { journeySheet.setOpen(false); newJourney(); }}>
                  New journey…
                </button>
                {addable.map((j) => (
                  <button key={j.id} type="button" className="menu-item" onClick={() => { journeySheet.setOpen(false); linkJourney(j.id); }}>
                    <span><RouteLabel label={j.label || "New journey"} /></span>
                    {journeySpan(j).from && <span className="text-ink-soft">&nbsp;· {fmtDate(journeySpan(j).from!, loc, { weekday: "short", day: "numeric", month: "short" })}</span>}
                  </button>
                ))}
              </ActionSheet>
            </li>
          </ul>
        </Section>
      )}

      <div className="space-y-6">
      {/* PLAN — the day's itinerary: time + step, drag to reorder */}
      {((day.plan ?? []).length > 0 || !ro) && (
        <Section
          title="Plan"
          info="Drag to reorder. Tap a step's grey pin to link it to a place from an Area you've added below; notes are under ⋯."
          action={overwhelmingCount > 0 && (
            <span className="flex items-center gap-1 text-xs text-danger" title={`${plural(overwhelmingCount, "overwhelming place")} today`}>
              <Icon name="alert" size={13} /> {overwhelmingCount}
            </span>
          )}
        >
          <PlanList day={day} journeys={journeys} returnHotel={dayKind(day, data) === "departure" ? undefined : weatherHotel} tz={data.config.tripTimeZone} items={day.plan ?? []} places={data.places} areaPlaces={areaPlaces} areaNameByPlaceId={areaNameByPlaceId} categoryIcons={data.config.categoryIcons} categoryColors={data.config.categoryColors} readOnly={ro} onChange={setPlan} onQuickAddCost={quickAddCost} onShowOnMap={showOnMap} />
        </Section>
      )}

      {/* AREAS — pull an area's places onto this day's map, without touching the plan */}
      {((day.areaIds ?? []).length > 0 || (!ro && cityAreas.length > 0)) && (
        <Section
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
                  <span className="text-ink-soft">{a.placeIds.length}</span>
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
                      onConfirm={() => undoable("Area removed", () => patch({ areaIds: (day.areaIds ?? []).filter((x) => x !== id) }))}
                      className="text-ink-faint hover:text-accent"
                    >
                      <Icon name="close" size={11} />
                    </ConfirmButton>
                  )}
                </span>
              );
            })}
            {!ro && cityAreas.some((a) => !(day.areaIds ?? []).includes(a.id)) && (
              <>
                <button ref={areaSheet.anchorRef} onClick={() => areaSheet.setOpen(true)} className="action tap">
                  <Icon name="plus" size={12} /> Add area
                </button>
                <ActionSheet open={areaSheet.open} onClose={() => areaSheet.setOpen(false)} anchorRef={areaSheet.anchorRef} title="Add an area">
                  {cityAreas
                    .filter((a) => !(day.areaIds ?? []).includes(a.id))
                    .map((a) => (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => { patch({ areaIds: [...(day.areaIds ?? []), a.id] }); areaSheet.setOpen(false); }}
                        className="menu-item"
                      >
                        {a.name || "Untitled"} · {plural(a.placeIds.length, "place")}
                      </button>
                    ))}
                </ActionSheet>
              </>
            )}
            {canPrefetchTiles && offlinePoints.length > 0 && (
              <button onClick={downloadOfflineMaps} disabled={offlineBusy} className="action tap">
                <Icon name="download" size={12} /> {offlineBusy ? "Caching…" : "Download offline maps"}
              </button>
            )}
          </div>
          {offlineMsg && <p className="meta px-3.5 pb-3">{offlineMsg}</p>}
        </Section>
      )}

      {/* SPENDING — what the day cost; feeds the Expenses roll-up */}
      {((day.costs ?? []).length > 0 || !ro) && (
        <Section title="Spending" info="Tag each amount with a category — the Expenses tab in Logbook adds them up.">
          <CostList
            costs={day.costs ?? []}
            categories={data.config.expenseCategories ?? []}
            currencies={(data.config.currencies ?? []).filter(Boolean)}
            choices={spendChoices}
            defaultCurrency={lastSpendCurrency}
            highlightId={justAddedCostId}
            readOnly={ro}
            onChange={setCosts}
          />
        </Section>
      )}

      {/* GENERAL NOTES — free-form catch-all, after the day's actual plan */}
      {(day.notes || !ro) && (
        <Section title="General notes" info="Supports bold, italic, bullet lists, checklists, and links — tap a note to see the formatting toolbar.">
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

      {/* the day's own actions, one grouped list like an iOS settings footer */}
      {!ro && (
        <Section className="mt-8">
          <ul>
            {day.dayTrip
              ? <ActionRow icon="close" label="Not a day trip" onClick={() => patch({ dayTrip: false })} />
              : <ActionRow icon="plus" label="Make this a day trip" onClick={() => patch({ dayTrip: true })} />}
            <ActionRow
              icon="pushpin"
              label={pinned ? "Unpin this day" : "Pin this day"}
              hint={pinned ? undefined : "keeps it on its date when others move"}
              onClick={() => mutateTrip((d) => {
                const ids = new Set(d.config.pinnedDays ?? []);
                if (ids.has(day.id)) ids.delete(day.id); else ids.add(day.id);
                d.config.pinnedDays = ids.size ? [...ids] : undefined;
              })}
            />
          </ul>
        </Section>
      )}
      {/* destructive on its own, as iOS sets Delete apart from other actions */}
      {!ro && (
        <Section className="mt-6">
          <ul>
            <li className={INSET_DIVIDER}>
              <ConfirmButton
                label="Delete day"
                onConfirm={() => undoable("Day deleted", () => { removeEntity("days", day.id); nav("/"); })}
                className="w-full justify-center px-3.5 py-2.5 text-xs text-danger active:bg-ink/[0.07]"
              >
                Delete day
              </ConfirmButton>
            </li>
          </ul>
        </Section>
      )}
    </Page>
  );

}

/** One journey on the day, as an iOS list row: the first hop's mode tile,
 *  the route, its times underneath, a chevron into the journey. If it runs
 *  on another date (a flight moved to the next day), the sub-line says so in
 *  red and offers to move it there. Swipe (phone) or ✕ (desktop) takes it off
 *  this day — the journey itself stays. */
function DayJourneyRow({ day, journey, data, onRemove }: { day: DayT; journey: Journey; data: TripData; onRemove: () => void }) {
  const updateEntity = useApp((s) => s.updateEntity);
  const loc = data.config.locale;
  const segs = journey.segments;
  const first = segs[0];
  const last = segs[segs.length - 1];
  const short = (d: string) => fmtDate(d, loc, { weekday: "short", day: "numeric", month: "short" });

  const leave = clockOf(first?.depart);
  const arrive = clockOf(last?.arrive);
  const times = leave && arrive ? `${leave} – ${arrive}` : leave || (arrive && `arrives ${arrive}`);
  const meta = [times, first && MODE_LABEL[first.mode], segs.length > 1 && plural(segs.length - 1, "change")].filter(Boolean).join(" · ");

  const off = journeyOffDay(journey, day.date);
  const when = journeySpan(journey).from;
  const target = off && when ? data.days.find((d) => d.date === when && d.id !== day.id) : undefined;
  const move = () => {
    const rest = (day.journeyIds ?? []).filter((x) => x !== journey.id);
    updateEntity<DayT>("days", day.id, { journeyIds: rest.length ? rest : undefined });
    if (target && !target.journeyIds?.includes(journey.id)) {
      updateEntity<DayT>("days", target.id, { journeyIds: [...(target.journeyIds ?? []), journey.id] });
    }
  };

  return (
    <li className="group relative after:pointer-events-none after:absolute after:bottom-0 after:left-12 after:right-0 after:h-[var(--hair)] after:bg-line last:after:hidden">
      <SwipeToDelete label="Remove" undoLabel="Journey removed from day" onDelete={onRemove}>
        <div className="flex items-center gap-1 pr-2">
          <Link to={`/journey/${journey.id}`} className="flex min-w-0 flex-1 items-center gap-3 py-3 pl-3.5 pr-1 text-left active:bg-ink/[0.07]">
            <IconTile size="sm" name={first ? MODE_ICON[first.mode] : "train"} tone={first ? MODE_TONE[first.mode] : "ai"} />
            <span className="min-w-0 flex-1">
              <span className="block break-words text-sm leading-snug text-ink"><RouteLabel label={journey.label || "New journey"} /></span>
              {off && when ? (
                <span className="meta mt-0.5 block text-danger">Leaves {short(when)}, not this day</span>
              ) : (
                <span className={`meta mt-0.5 block ${meta ? "" : "text-ink-faint"}`}>{meta || "Add its times"}</span>
              )}
            </span>
            <Icon name="chevron" size={14} className="shrink-0 text-ink-faint" />
          </Link>
          <RowDeleteButton label="Remove from Day" undoLabel="Journey removed from day" onClick={onRemove} />
        </div>
      </SwipeToDelete>
      {target && !target.journeyIds?.includes(journey.id) && (
        <button type="button" onClick={move} className="action -mt-1 block pb-3 pl-12 text-xs">
          Move to {short(target.date)}{target.title ? ` · ${target.title}` : ""}
        </button>
      )}
    </li>
  );
}

/* ------------------------------------------------------------------ plan */

function PlanList({ day, journeys, returnHotel, tz, items, places, areaPlaces, areaNameByPlaceId, categoryIcons, categoryColors, readOnly, onChange, onQuickAddCost, onShowOnMap }: {
  day: DayT;
  /** the day's journeys — their leave / arrive times show as rows of their own */
  journeys: Journey[];
  /** where the day ends — the hotel you're staying at (see `ReturnToHotel`) */
  returnHotel?: Hotel;
  tz?: string;
  items: PlanItem[];
  places: Place[];
  areaPlaces: Place[];
  areaNameByPlaceId: Map<string, string>;
  categoryIcons?: Record<string, string>;
  categoryColors?: Record<string, string>;
  readOnly: boolean;
  onChange: (next: PlanItem[]) => void;
  onQuickAddCost: (item: PlanItem) => void;
  onShowOnMap: (place: Place) => void;
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

  // the step just added opens straight into its text. Rendered synchronously
  // inside the tap, so its field is focused there and the iPhone keyboard
  // comes up (it won't for a focus that happens after the tap)
  const [fresh, setFresh] = useState<string | null>(null);
  const addStep = () => {
    const id = rid();
    flushSync(() => {
      setFresh(id);
      onChange([...items, { id, text: "" }]);
    });
  };

  // the journey's own rows, live from the journey (never stored as steps):
  // each sits before the first step timed later than it, else at the end
  const stops = journeys.flatMap((journey) => journeyStops(journey, day.date).map((st) => ({ ...st, journey })));
  const stopRow = (st: (typeof stops)[number]) => (
    <JourneyStopRow key={`journey-${st.journey.id}-${st.kind}`} journey={st.journey} stop={st} indent={!readOnly} />
  );
  const stopAt = (time: string) => {
    const i = items.findIndex((it) => {
      const t = splitRange(it.time)?.[0] ?? it.time;
      return !!t && /^\d{1,2}:\d{2}$/.test(t) && t.padStart(5, "0") > time;
    });
    return i < 0 ? items.length : i;
  };
  const stopsBefore = (i: number) =>
    stops.filter((st) => stopAt(st.time) === i).sort((a, b) => a.time.localeCompare(b.time)).map(stopRow);

  if (items.length === 0 && stops.length === 0) {
    return readOnly ? (
      <p className="px-3.5 py-3 text-sm text-ink-faint">Nothing planned yet.</p>
    ) : (
      <button onClick={addStep} className="action w-full px-3.5 py-2.5 text-xs active:bg-ink/[0.07]">
        <Icon name="plus" size={14} /> Add a step
      </button>
    );
  }

  const rows = items.flatMap((it, i) => [
    ...stopsBefore(i),
    <PlanRow
      key={it.id}
      day={day}
      tz={tz}
      item={it}
      fresh={it.id === fresh}
      timeStart={timeBefore(items, i)}
      place={it.placeId ? places.find((p) => p.id === it.placeId) : undefined}
      nextPlace={items[i + 1]?.placeId ? places.find((p) => p.id === items[i + 1].placeId) : undefined}
      areaPlaces={areaPlaces}
      areaNameByPlaceId={areaNameByPlaceId}
      categoryIcons={categoryIcons}
      categoryColors={categoryColors}
      readOnly={readOnly}
      onPatch={(p) => patchItem(it.id, p)}
      onRemove={() => removeItem(it.id)}
      onDuplicate={() => duplicateItem(it.id)}
      onQuickAddCost={onQuickAddCost}
      onShowOnMap={onShowOnMap}
    />,
  ]).concat(stopsBefore(items.length));

  // the day closes with the way back to the hotel; its walk figures need the
  // last step to be tied to a real place, the directions link doesn't
  const lastPlace = items[items.length - 1]?.placeId ? places.find((p) => p.id === items[items.length - 1].placeId) : undefined;
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
      {/* the add lives at the foot, next to where the new step lands, so a
       *  long plan doesn't need a scroll back to the top */}
      <button onClick={addStep} className="action w-full border-t border-line px-3.5 py-2.5 text-xs">
        <Icon name="plus" size={14} /> Add a step
      </button>
    </>
  );
}

/** where an empty step's time wheel starts: the latest time set on an
 *  earlier step (a range's end), so a new step follows on from the last */
function timeBefore(items: PlanItem[], i: number): string | undefined {
  for (let j = i - 1; j >= 0; j--) {
    const t = items[j].time;
    const r = splitRange(t);
    if (r) return r[1];
    if (t && /^\d{1,2}:\d{2}$/.test(t)) return t;
  }
  return undefined;
}

function PlanRow({ day, tz, item, fresh, timeStart, place, nextPlace, areaPlaces, areaNameByPlaceId, categoryIcons, categoryColors, readOnly, onPatch, onRemove, onDuplicate, onQuickAddCost, onShowOnMap }: {
  day: DayT;
  tz?: string;
  item: PlanItem;
  /** just added — open its text for typing */
  fresh?: boolean;
  /** where its time wheel starts while it has no time (see `timeBefore`) */
  timeStart?: string;
  place?: Place;
  /** the next step's linked place, if both it and this step have one — for
   *  the real walking time shown at the foot of this card (see `StepWalkLines`) */
  nextPlace?: Place;
  areaPlaces: Place[];
  areaNameByPlaceId: Map<string, string>;
  categoryIcons?: Record<string, string>;
  categoryColors?: Record<string, string>;
  readOnly: boolean;
  onPatch: (p: Partial<PlanItem>) => void;
  onRemove: () => void;
  onDuplicate: () => void;
  onQuickAddCost: (item: PlanItem) => void;
  onShowOnMap: (place: Place) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id, disabled: readOnly });
  const updateEntity = useApp((s) => s.updateEntity);
  // an empty note stays out of the card until "Add a note" asks for it
  const [noteOpen, setNoteOpen] = useState(false);
  const mapHref = item.url ? gmapsLink(item.url) : placeMapLink(place);
  // a restaurant's guide page (Tabelog in Japan) — looked up as the step shows
  const reviewSite = place ? reviewSiteFor(place, categoryIcons) : undefined;
  useAutoReviewLink(place, categoryIcons, !readOnly);
  // its "Good to know" (hours, reservations, queue…), behind a line under the step
  const tripData = useData();
  const area = place && placeArea(place, tripData);
  useAutoPlaceFacts(place, categoryIcons, area, !readOnly);
  const factsSheet = useActionSheet();
  const toggleOverwhelming = () => {
    if (!place) return;
    updateEntity<Place>("places", place.id, { overwhelming: !place.overwhelming || undefined });
  };
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
  const pick = (pid?: string) => {
    if (!pid) { onPatch({ placeId: undefined }); return; }
    const p = sortedPickable.find((x) => x.id === pid);
    onPatch({ placeId: pid, text: p?.name ?? item.text });
  };

  const range = splitRange(item.time);
  const timeText = range ? `${range[0]} – ${range[1]}` : item.time;
  const plainTime = !item.time || /^\d{1,2}:\d{2}$/.test(item.time);
  const catGlyph = place?.category ? categoryIcons?.[place.category] : undefined;
  // a custom step has no category to go on, so guess from its own text
  const textGlyph = place ? undefined : glyphForStepText(item.text);
  const glyph = place ? catGlyph : textGlyph;
  const tile = (
    <IconTile
      size="sm"
      glyph={glyph}
      name={glyph ? undefined : "pin"}
      color={place ? placeTile(place, categoryIcons, categoryColors).color : undefined}
      tone={place ? toneForPlaceCategory(place.category, categoryIcons) : textGlyph ? toneForGlyph(textGlyph) : "ink-faint"}
      className={`relative z-10 ${place || textGlyph ? "" : "opacity-70"}`}
    />
  );

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`group relative text-sm after:pointer-events-none after:absolute after:bottom-0 after:left-12 after:right-0 after:h-[var(--hair)] after:bg-line last:after:hidden ${isDragging ? "z-10 bg-surface opacity-80" : ""}`}
    >
      <SwipeToDelete undoLabel="Step removed" onDelete={readOnly ? undefined : onRemove}>
      <ContextMenu className="px-3.5 py-3">
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
                className="tap grid h-4 w-3 shrink-0 cursor-grab touch-none place-items-center text-ink-faint/50 active:cursor-grabbing"
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
              {!readOnly && !item.placeId && sortedPickable.length > 0 ? (
                // an unlinked step's grey pin is where you link it to a place
                <PlacePicker
                  value={item.placeId}
                  places={sortedPickable}
                  areaNameByPlaceId={areaNameByPlaceId}
                  categoryIcons={categoryIcons}
                  categoryColors={categoryColors}
                  onPick={pick}
                  trigger={tile}
                />
              ) : mapHref ? (
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
                      timeStart={timeStart}
                      className="tap"
                      emptyContent={<Icon name="clock" size={12} className="inline-block align-[-1px] not-italic" />}
                    />
                  ) : (
                    <Editable label="Time" value={item.time ?? ""} placeholder="Add a time" onCommit={(v) => onPatch({ time: v.trim() || undefined })} />
                  )}
                </span>
              )}
              {place && (
                <span className="ml-auto flex min-w-0 shrink-0 items-center gap-1.5">
                  <PlaceHoursLine place={place} date={day.date} />
                  {place.overwhelming && (
                    <span className="shrink-0 text-danger" title="Can be overwhelming">
                      <Icon name="alert" size={13} />
                      <span className="sr-only">Can be overwhelming</span>
                    </span>
                  )}
                </span>
              )}
            </div>
            {readOnly ? (
              // plain text — the tile beside the time is the Maps link
              <span className="block text-sm leading-snug text-ink">{item.text}</span>
            ) : item.placeId && sortedPickable.length > 0 ? (
              <PlacePicker
                value={item.placeId}
                places={sortedPickable}
                areaNameByPlaceId={areaNameByPlaceId}
                categoryIcons={categoryIcons}
                categoryColors={categoryColors}
                onPick={pick}
              />
            ) : (
              <Editable
                label="Step"
                value={item.text}
                placeholder="What is it?"
                autoEdit={fresh}
                onCommit={(v) => onPatch({ text: v })}
                // like a new reminder left blank: a step with nothing in it at
                // all goes away (never stored, so no Undo); one with a time,
                // place or note, or left by a tap elsewhere on its own row
                // (its pin, time or ⋯), just loses its text
                onBlank={(onRow) => (item.time || item.placeId || item.note || onRow ? item.text && onPatch({ text: "" }) : onRemove())}
                className="block text-sm leading-snug text-ink"
              />
            )}
            {(readOnly || item.note || noteOpen) && (
              <RichNote
                value={item.note ?? ""}
                onCommit={(v) => onPatch({ note: v || undefined })}
                placeholder="Add a note…"
                className="block text-xs leading-relaxed text-ink-soft [&_strong]:text-ink"
                collapsible
                autoEdit={noteOpen}
                onEditEnd={() => setNoteOpen(false)}
              />
            )}
            {place && ((place.reviewUrl && reviewSite) || hasFacts(place.facts)) && (
              <span className="flex flex-wrap items-center gap-x-4 gap-y-1">
                {place.reviewUrl && reviewSite && (
                  <a href={place.reviewUrl} target="_blank" rel="noopener" className="meta flex w-fit items-center gap-1 text-accent">
                    <Icon name="link" size={12} className="shrink-0" /> {reviewSite.label}
                  </a>
                )}
                {hasFacts(place.facts) && (
                  <button type="button" ref={factsSheet.anchorRef} onClick={() => factsSheet.setOpen(true)} className="meta flex w-fit items-center gap-1 text-accent">
                    <Icon name="info" size={12} className="shrink-0" /> Good to know
                  </button>
                )}
              </span>
            )}
            {place && (
              <ActionSheet open={factsSheet.open} onClose={() => factsSheet.setOpen(false)} anchorRef={factsSheet.anchorRef} title={place.name} doneLabel="Done">
                <ul onClick={(e) => e.stopPropagation()}>
                  <PlaceFactRows place={place} area={area} />
                </ul>
              </ActionSheet>
            )}
            {place && <StepWalkLines place={place} nextPlace={nextPlace} />}
          </div>

          {/* one ⋯ instead of four loose glyphs — the step's title and lines
              get the width, the secondary actions sit behind the sheet */}
          <RowMenu label={`More for ${place?.name || item.text || "this step"}`}>
            {place && (
              <button type="button" className="menu-item" onClick={() => onShowOnMap(place)}>
                <Icon name="locate" size={16} /> Show on map
              </button>
            )}
            {place && reviewSite && (
              <a href={reviewHref(reviewSite, place)} target="_blank" rel="noopener" className="menu-item">
                <Icon name="link" size={16} /> {place.reviewUrl ? `Open in ${reviewSite.label}` : `Search ${reviewSite.label}`}
              </a>
            )}
            <button type="button" className="menu-item" onClick={addToGoogleCalendar}>
              <Icon name="calendar" size={16} /> Add to Google Calendar
            </button>
            {!readOnly && (
              <>
                {place && (
                  <button type="button" className="menu-item" onClick={toggleOverwhelming}>
                    <Icon name="alert" size={16} /> {place.overwhelming ? "Unmark as overwhelming" : "Mark as overwhelming"}
                  </button>
                )}
                {!item.note && (
                  <button type="button" className="menu-item" onClick={() => setNoteOpen(true)}>
                    <Icon name="pencil" size={16} /> Add a note
                  </button>
                )}
                <button type="button" className="menu-item" onClick={onDuplicate}>
                  <Icon name="copy" size={16} /> Duplicate
                </button>
                <button type="button" className="menu-item" onClick={() => onQuickAddCost(item)}>
                  <Icon name="wallet" size={16} /> Add an expense
                </button>
                <ConfirmMenuItem onConfirm={() => undoable("Step removed", onRemove)} label="Remove" icon={<Icon name="close" size={16} />} />
              </>
            )}
          </RowMenu>
        </div>
      </ContextMenu>
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
/** One end of the day's journey as a plan row — "Leave Kyoto" at its first
 *  departure, "Arrive Kurama" at its last arrival. Read-only here; it opens
 *  the journey, where the times are edited. */
function JourneyStopRow({ journey, stop, indent }: { journey: Journey; stop: ReturnType<typeof journeyStops>[number]; indent: boolean }) {
  const { seg } = stop;
  const segs = journey.segments;
  const meta = stop.kind === "leave"
    ? [MODE_LABEL[seg.mode], seg.carrier, seg.service, segs.length > 1 && plural(segs.length - 1, "change")]
    : [fmtDuration(segs[0]?.depart, seg.arrive, segs[0]?.fromTz, seg.toTz)];
  return (
    <li className="relative after:pointer-events-none after:absolute after:bottom-0 after:left-12 after:right-0 after:h-[var(--hair)] after:bg-line last:after:hidden">
      <Link to={`/journey/${journey.id}`} className={`flex items-start gap-2.5 py-3 pr-3.5 text-sm active:bg-ink/[0.07] ${indent ? "pl-9" : "pl-3.5"}`}>
        <span className="min-w-0 flex-1 space-y-1 pt-px">
          <span className="flex items-center gap-1.5">
            <IconTile size="sm" name={MODE_ICON[seg.mode]} tone={MODE_TONE[seg.mode]} />
            <span className="meta flex h-[22px] shrink-0 items-center rounded-[7px] bg-surface-2 px-1.5 tabular-nums">{stop.time}</span>
          </span>
          <span className="block break-words leading-snug text-ink">
            {stop.kind === "leave" ? "Leave" : "Arrive"} {stop.place || (stop.kind === "leave" ? "from start" : "at destination")}
          </span>
          {meta.some(Boolean) && <span className="meta block text-ink-soft">{meta.filter(Boolean).join(" · ")}</span>}
        </span>
        <Icon name="chevron" size={14} className="mt-1 shrink-0 text-ink-faint" />
      </Link>
    </li>
  );
}

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
      aria-label={`Directions back to ${hotel.name || "your stay"}`}
      className={`flex items-start gap-2.5 border-t border-line py-3 pr-3.5 active:bg-surface-2 ${indent ? "pl-9" : "pl-3.5"}`}
    >
      <IconTile size="sm" name="bed" tone="accent" className="mt-px" />
      <span className="min-w-0 flex-1 space-y-1">
        <span className="block text-sm leading-snug text-ink">Back to {hotel.name || "your stay"}</span>
        {(walk || (fromStation && hotelStation && fromStation.name !== hotelStation.name)) && (
          <span className="meta flex flex-wrap gap-x-3 gap-y-0.5 text-[0.8125rem] text-accent">
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
    void nearestOpeningHours(place.lat, place.lng, place.name).then((h) => { if (!cancelled) setHours(h); });
    return () => { cancelled = true; };
  }, [place.id, place.lat, place.lng]);
  const text = hours ? (date ? hoursForDate(hours.hours, date) : hours.hours) : null;
  if (!text) return null;
  return (
    <span className="meta flex min-w-0 items-center gap-1 text-right text-ink-soft">
      <Icon name="clock" size={12} className="shrink-0" />
      <span className="min-w-0">{text}</span>
    </span>
  );
}

/** one caption of the walk figures — 🚶 "Walk to next stop ≈ 2h 2min · 9.8 km" (straight
 *  to the next step) and 🚆 "Walk to Y ≈ 1 min · 84 m" (to the nearest station
 *  from here) — side by side on one line, each spelling out what it's a
 *  distance *to* rather than leaning on the icon alone (the train icon on the
 *  station figure is about the trip being transit, not about that number
 *  being a train ride — it's still a walk). Time and distance always come
 *  as a pair (`useWalk`: estimate first, real route when it lands). The
 *  station comes from OpenStreetMap (`transitStation.ts`); a lookup that
 *  came back empty is tried once more shortly after, since the public
 *  server drops the odd request. Past `LONG_WALK_MIN` to the next step, a
 *  third piece appears — the train leg between the nearest station at each
 *  end, as a link to Google Maps transit directions (same "no free keyless
 *  multi-modal API" reasoning as `ReturnToHotel`), labelled with a rough
 *  door-to-door total (`estimateTransit` for the ride itself, plus both walk
 *  legs) so the link isn't just two station names with no sense of the time
 *  they add up to. */
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

  const long = !!nextPlace && (!next || next.min > LONG_WALK_MIN);
  const [nextStation, setNextStation] = useState<NearbyStation | null>(null);
  useEffect(() => {
    setNextStation(null);
    if (!nextPlace || !long) return;
    let cancelled = false;
    void nearestStationLookup(nextPlace.lat, nextPlace.lng).then((s) => { if (!cancelled) setNextStation(s); });
    return () => { cancelled = true; };
  }, [long, nextPlace?.id, nextPlace?.lat, nextPlace?.lng]);
  const fromNextStation = useWalk(nextPlace ?? { lat: 0, lng: 0 }, nextPlace ? nextStation : null);
  const transitTotal =
    station && nextStation && toStation && fromNextStation
      ? toStation.min + estimateTransit(haversineKm(station.lat, station.lng, nextStation.lat, nextStation.lng)) + fromNextStation.min
      : null;
  const piece = "flex min-w-0 items-start gap-1";
  // past a long walk with a train to take, the train is the answer — lead
  // with it and drop the hour-plus walk figure rather than stacking both
  const showTrain = long && !!nextPlace && !!station && !!nextStation && station.name !== nextStation.name;
  const train = showTrain && (
    <a
      href={gmapsRoute(`${place.lat},${place.lng}`, `${nextPlace!.lat},${nextPlace!.lng}`, "transit")}
      target="_blank"
      rel="noopener"
      className={`${piece} text-accent`}
      aria-label={`Transit directions from ${station!.name} to ${nextStation!.name}${transitTotal ? `, about ${fmtMinutes(transitTotal)} door to door` : ""}`}
    >
      <Icon name="train" size={12} className="mt-[3px] shrink-0" />
      <span className="min-w-0">
        Train: {station!.name} → {nextStation!.name}
        {transitTotal && <> · ≈ {fmtMinutes(transitTotal)} total</>}
      </span>
    </a>
  );
  return (
    <>
      {(next || (station && toStation)) && (
        <span className="meta flex flex-wrap gap-x-3 gap-y-0.5 text-[0.8125rem] text-ink-soft">
          {train}
          {next && nextPlace && !showTrain && (
            <span className={piece}>
              <Icon name="walk" size={12} className="mt-[3px] shrink-0" />
              <span className="min-w-0">Walk to next stop {fmtWalk(next)}</span>
            </span>
          )}
          {station && toStation && (
            <span className={piece}>
              <Icon name="train" size={12} className="mt-[3px] shrink-0" />
              <span className="min-w-0">Walk to {station.name} {fmtWalk(toStation)}</span>
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
function PlacePicker({ value, places, areaNameByPlaceId, categoryIcons, categoryColors, onPick, trigger }: {
  value?: string;
  places: Place[];
  areaNameByPlaceId: Map<string, string>;
  categoryIcons?: Record<string, string>;
  categoryColors?: Record<string, string>;
  onPick: (id?: string) => void;
  /** what to tap instead of the name line — an unlinked step's pin tile */
  trigger?: React.ReactNode;
}) {
  const { open, setOpen, anchorRef } = useActionSheet();
  const current = value ? places.find((p) => p.id === value) : undefined;
  return (
    <>
      {trigger ? (
        <button
          ref={anchorRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Link this step to a place"
          aria-haspopup="menu"
          className="tap relative shrink-0"
        >
          {trigger}
        </button>
      ) : (
      <button
        ref={anchorRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="What this step is"
        aria-haspopup="menu"
        className={`editable block w-full max-w-full cursor-pointer bg-transparent text-left leading-snug focus:outline-none ${
          current ? "text-sm text-ink" : "text-xs text-ink-soft"
        }`}
      >
        {current ? current.name : (
          <>Custom… <Icon name="down" size={11} className="inline-block align-[1px] text-ink-faint" /></>
        )}
      </button>
      )}
      <ActionSheet open={open} onClose={() => setOpen(false)} anchorRef={anchorRef} title="What this step is">
        <div className="max-h-[60dvh] overflow-y-auto">
          <button type="button" onClick={() => onPick(undefined)} className="menu-item flex w-full items-center gap-2">
            <Icon name="check" size={13} className={`shrink-0 ${!value ? "text-accent" : "invisible"}`} />
            <IconTile size="sm" name="pin" tone="ink-faint" className="opacity-70" />
            <span className="min-w-0 flex-1 break-words">Custom…</span>
          </button>
          {places.map((p) => {
            const areaName = areaNameByPlaceId.get(p.id);
            const on = p.id === value;
            const glyph = p.category ? categoryIcons?.[p.category] : undefined;
            return (
              <button key={p.id} type="button" onClick={() => onPick(p.id)} className="menu-item flex w-full items-center gap-2">
                <Icon name="check" size={13} className={`shrink-0 ${on ? "text-accent" : "invisible"}`} />
                <IconTile
                  size="sm"
                  glyph={glyph}
                  name={glyph ? undefined : "pin"}
                  color={placeTile(p, categoryIcons, categoryColors).color}
                  tone={toneForPlaceCategory(p.category, categoryIcons)}
                />
                <span className="min-w-0 flex-1 break-words">{p.name}</span>
                {areaName && <span className="shrink-0 text-2xs text-ink-soft">{areaName}</span>}
              </button>
            );
          })}
        </div>
      </ActionSheet>
    </>
  );
}

/** a plan step offered under "Add an amount", with the category its icon
 *  suggests */
type SpendChoice = { label: string; categoryId?: string };

/** The day's spend — a category + a whole-number amount per row, with an
 *  optional free-text note. The amounts feed `tripCost`; the category drives
 *  the Expenses grouping. */
function CostList({ costs, categories, currencies, choices, defaultCurrency, highlightId, readOnly, onChange }: {
  costs: DayCost[];
  /** the currency a new row starts in; absent = the trip's primary */
  defaultCurrency?: string;
  categories: ExpenseCategory[];
  currencies: string[];
  choices: SpendChoice[];
  highlightId?: string | null;
  readOnly: boolean;
  onChange: (next: DayCost[]) => void;
}) {
  const primary = currencies[0] ?? "";
  const setAt = (i: number, patch: Partial<DayCost>) => onChange(costs.map((c, j) => (j === i ? { ...c, ...patch } : c)));
  // the row just added opens straight onto what's missing: the keypad once
  // it's named (picked off the plan), else its name. Rendered inside the tap
  // so the iPhone keyboard comes up for the name.
  const [fresh, setFresh] = useState<string | null>(null);
  // picked off the plan = nothing typed, so closing its keypad empty can
  // simply drop the row; a typed name is kept
  const [picked, setPicked] = useState(false);
  // a custom row's name entered with Return moves straight on to its amount
  // (remounting its field open), the way a quick-entry flow advances; tapping
  // away just stops there
  const [keypadFor, setKeypadFor] = useState<string | null>(null);
  const addWithLabel = (label: string, categoryId?: string) => {
    const id = rid();
    flushSync(() => {
      setOpen(false);
      setFresh(id);
      setPicked(!!label);
      const currency = defaultCurrency && currencies.includes(defaultCurrency) && defaultCurrency !== primary ? defaultCurrency : undefined;
      onChange([...costs, { id, label, amount: "", ...(categoryId && { categoryId }), ...(currency && { currency }) }]);
    });
  };
  const { open, setOpen, anchorRef } = useActionSheet();
  // a step already on the day's plan can be picked straight off, so its name
  // doesn't need retyping — otherwise there's nothing to pick from, so skip
  // straight to a blank row like before
  const add = () => (choices.length > 0 ? setOpen(true) : addWithLabel(""));
  const catLabel = (id?: string) => categories.find((c) => c.id === id)?.label ?? "Uncategorised";

  const addButton = (className: string, iconSize: number) => (
    <>
      <button ref={anchorRef} onClick={add} className={className}><Icon name="plus" size={iconSize} /> Add an amount</button>
      <ActionSheet open={open} onClose={() => setOpen(false)} anchorRef={anchorRef} title="What was it?">
        <button type="button" onClick={() => addWithLabel("")} className="menu-item">Custom…</button>
        {choices.map((c) => (
          <button key={c.label} type="button" onClick={() => addWithLabel(c.label, c.categoryId)} className="menu-item">{c.label}</button>
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
      addButton("action w-full px-3.5 py-2.5 text-xs transition-colors duration-150 active:bg-ink/[0.07] active:opacity-100", 14)
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
              className={`group relative after:pointer-events-none after:absolute after:bottom-0 after:left-3.5 after:right-0 after:h-[var(--hair)] after:bg-line last:after:hidden transition-colors duration-700 ${c.id === highlightId ? "bg-accent/10" : ""}`}
            >
              <SwipeToDelete undoLabel="Expense removed" onDelete={readOnly ? undefined : () => onChange(costs.filter((_, j) => j !== i))}>
              <div className="px-3.5 py-3">
              <div className="flex items-start gap-3">
                <IconTile size="sm" name={tile.name} glyph={tile.glyph} tone={tile.tone} color={tile.color} className="mt-0.5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-3">
                    <span className="min-w-0 flex-1">
                      {readOnly ? (
                        <span className="text-sm text-ink">{c.label.trim() || catLabel(c.categoryId)}</span>
                      ) : (
                        <Editable label="What was it?" value={c.label} placeholder="What was it?" autoEdit={c.id === fresh && !c.label} className="text-sm text-ink" onCommit={(v) => setAt(i, { label: v })}
                          onReturn={c.id === fresh && !c.amount ? () => setKeypadFor(c.id) : undefined}
                          // a row with no amount left without a name goes,
                          // like a step left blank (undoably if it had a name
                          // or category); one with an amount just loses its name
                          onBlank={(onRow) => {
                            if (c.amount || onRow) return void (c.label && setAt(i, { label: "" }));
                            const drop = () => onChange(costs.filter((x) => x.id !== c.id));
                            if (c.label || c.categoryId) undoable("Amount removed", drop);
                            else drop();
                          }}
                        />
                      )}
                    </span>
                    {readOnly ? (
                      <span className="shrink-0 text-right text-sm text-ink tabular-nums">{fmtFare(c.amount, c.currency || primary)}</span>
                    ) : (
                      <span className="shrink-0 text-right text-sm text-ink tabular-nums">
                        <MoneyField
                          key={keypadFor === c.id ? `${c.id}-keypad` : c.id}
                          label="Amount"
                          autoOpen={c.id === fresh && !!c.label}
                          // a row just added from the plan and left without an
                          // amount goes away, like a new step left blank
                          onLeftEmpty={c.id === fresh && picked ? () => onChange(costs.filter((x) => x.id !== c.id)) : undefined}
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
      <li className="relative flex items-baseline justify-between gap-4 px-3.5 py-3 after:pointer-events-none after:absolute after:bottom-0 after:left-3.5 after:right-0 after:h-[var(--hair)] after:bg-line last:after:hidden">
        <span className="value font-medium">Total spent</span>
        <span className="value flex flex-wrap justify-end gap-x-3 font-medium tabular-nums">
          {subtotals.size > 0
            ? [...subtotals].map(([cur, amt]) => <span key={cur || "—"}>{fmtMoney(amt, cur)}</span>)
            : "—"}
        </span>
      </li>
      {!readOnly && <li>{addButton("action w-full px-3.5 py-2.5 text-xs transition-colors duration-150 active:bg-ink/[0.07] active:opacity-100", 14)}</li>}
    </ul>
  );
}
