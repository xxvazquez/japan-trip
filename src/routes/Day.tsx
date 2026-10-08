import { Fragment, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  DndContext,
  MouseSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { HoldDragSensor, swallowNextClick } from "@/lib/holdDrag";
import { moveAroundPinned, sortByTime, startMinutes } from "@/lib/planOrder";
import { CSS } from "@dnd-kit/utilities";
import { Page, PageHeader } from "@/components/Page";
import { useLeavePage } from "@/components/NavBar";
import { Missing } from "@/components/Missing";
import { Section } from "@/components/Section";
import { InsetRow, INSET_DIVIDER } from "@/components/InsetRow";
import { ActionRow, ACTION_ROW } from "@/components/ActionRow";
import { SearchField } from "@/components/SearchField";
import { RowSelect } from "@/components/RowSelect";
import { ActionSheet, useActionSheet, ConfirmMenuItem } from "@/components/ActionSheet";
import { Editable } from "@/components/Editable";
import { MoneyField } from "@/components/MoneyField";
import { AmountSheet } from "@/components/AmountSheet";
import { PlaceAction, PlaceActions } from "@/components/PlaceAction";
import type { Tip } from "@/components/InfoTips";
import { saveFile, touchDevice } from "@/lib/device";
import { RichNote } from "@/components/RichNote";
import { RowMenu } from "@/components/RowMenu";
import { Markdown } from "@/components/Markdown";
import { ContextMenu } from "@/components/ContextMenu";
import { RowDeleteButton } from "@/components/RowDeleteButton";
import { SwipeToDelete } from "@/components/SwipeToDelete";
import { ConfirmButton } from "@/components/ConfirmButton";
import { Icon, type IconName } from "@/components/Icon";
import { RouteLabel } from "@/components/RouteLabel";
import { IconTile } from "@/components/IconTile";
import { TitleLineTile } from "@/components/TileRow";
import { useSplit } from "@/components/SplitMap";
import { AREA_TONES, glyphForStepText, placeTile, toneForGlyph, toneForPlaceCategory } from "@/lib/tones";
import { glyphForCategoryName, type MapGlyphId } from "@/lib/mapGlyphs";
import { areaLeg, byAreaName } from "@/lib/cityAssign";
import { useCityAnchors, useTripCities } from "@/lib/cityCoords";
import { DayStepper } from "@/components/DayStepper";
import { NavAddButton } from "@/components/NavAddButton";
import { DayLabelsCaption, DayLabelsSheet, tripLabels, tripStepLabels } from "@/components/DayLabels";
import { useData, lookups } from "@/lib/data";
import { useApp, undoable } from "@/store/useApp";
import { useReadOnly } from "@/lib/readonly";
import { isFoodPlace, reviewHref, reviewSiteFor, useAutoReviewLink } from "@/lib/reviewSite";
import { FACT_ROWS, factsDayHours, factValue, notASight, placeArea, useAutoPlaceFacts, useFactsFailure, wantsFacts } from "@/lib/placeFacts";
import { FactsRefresh, PlaceFactRows } from "@/components/PlaceFacts";
import { addDays, dayJourneys, dayKind, fmtDate, journeyDepartDate, journeyOffDay, journeySpan, journeyStops, plural } from "@/lib/dates";
import { legHex } from "@/lib/legColors";
import { gmapsLink, gmapsRoute, mapUrlCoords, placeMapLink, sharePlace, webSearchHref } from "@/lib/maps";
import { fmtDistanceKm, fmtWalk, haversineKm } from "@/lib/geo";
import { clock24, clockOf, fmtClock, fmtClocksIn, fmtDuration, fmtMinutes } from "@/lib/time";

/** the timeline's time column — wide enough for "10:30 PM" on a 12-hour device */
const TIME_COL = clock24 ? "w-[2.625rem]" : "w-[3.75rem]";
import { MODE_ICON, MODE_LABEL, MODE_TONE } from "@/lib/transport";
import { useWalk, estimateTransit } from "@/lib/walkRoute";
import { nearestStationLookup, type NearbyStation } from "@/lib/transitStation";
import { stayCoords } from "@/lib/hotelCoords";
import { cachedOpeningHours, nearestOpeningHours } from "@/lib/placeHours";
import { hoursConflict, osmHoursOn } from "@/lib/openingHours";
import { NEARBY_WALK_MIN, nearbyForDay, type NearbyGroup, type NearbyItem } from "@/lib/nearby";
import { NearbyCard, NearbyGroupRows, NearbyProvider, NearbyRow, usePlaceHours, useStepNearby } from "@/components/Nearby";
import { fetchDayWeather, forecastSpot, weatherLabel, type DayWeather } from "@/lib/weather";
import { useDaySun } from "@/lib/daySun";
import { prefetchTiles, canPrefetchTiles, dayOfflinePoints } from "@/lib/offlineTiles";
import { parseMoney, fmtMoney, cleanAmount, fmtFare, expenseCategoryIcon, expenseCategoryForGlyph } from "@/lib/cost";
import { useAsyncAction } from "@/lib/useAsyncAction";
import { selectInSplit } from "@/lib/splitSelect";
import { fmtIn, minutesUntil, nowInDay } from "@/lib/upNext";
import { useClock, useToday } from "@/lib/useToday";
import { buildDayPdf, buildPagePdf, mdToPlain, PDF_HREF, PDF_HIDE, PDF_KEEP, type DayPdfRow } from "@/lib/dayPdf";
import { setExpandAll } from "@/lib/collapse";
import { applyPalette } from "@/lib/mode";
import { THEME_PRESETS } from "@/lib/themePresets";
import type { Area, Day as DayT, DayCost, ExpenseCategory, Hotel, Journey, PlanItem, Place, TripData } from "@/core/types";

const rid = () => Math.random().toString(36).slice(2, 9);
/** an area row's hairline, inset past its small tile like a `TileRow`'s */
const AREA_ROW_LI = INSET_DIVIDER.replace("after:left-3.5", "after:left-12");

/** "14:00–15:15" (any dash, any spacing) → ["14:00", "15:15"]; else null */
function splitRange(t?: string): [string, string] | null {
  const m = (t ?? "").match(/^\s*(\d{1,2}:\d{2})\s*[–—-]\s*(\d{1,2}:\d{2})\s*$/);
  return m ? [m[1], m[2]] : null;
}

/** an untimed step's time slot — left blank, as Calendar leaves an
 *  all-day event's, but still a tap target that opens the time wheel */
const UNTIMED = <span className="inline-block h-5 w-10" aria-hidden="true" />;

function weatherText(w: DayWeather, locale?: string): string {
  const text = `${weatherLabel(w.code)}, ${w.lowC}–${w.highC}°C`;
  const rain = w.precipPct >= 30 ? `${text} · ${w.precipPct}% rain` : text;
  // an old forecast kept on the device, shown with no signal
  return w.asOf ? `${rain} · as of ${fmtDate(w.asOf, locale, { day: "numeric", month: "short" })}` : rain;
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
  // realtime change) would otherwise change the hook count and crash.
  // Keyed by the day: the stepper keeps this route mounted, and a step or
  // amount just added (opened for typing) mustn't open again on coming back
  return <DayPage key={day.id} data={data} day={day} />;
}

/** The Plan section's ⓘ, worded for the device in hand */
const PLAN_TIPS_TOUCH: Tip[] = [
  { icon: "clock", title: "Steps sort by time", text: "Set a time and the step moves into place." },
  { icon: "reorder", title: "Move an untimed step", text: "Touch and hold the step, then drag it where you want it. It stays with the step above it." },
  { icon: "pushpin", title: "Pin a booking", text: "Touch and hold a step, then tap Pin this step. Its time stays locked until you unpin it." },
  { icon: "pin", title: "Link a place", text: "Tap a step's icon and pick one of your saved places — the day's areas come first." },
];
const PLAN_TIPS_POINTER: Tip[] = [
  { icon: "clock", title: "Steps sort by time", text: "Set a time and the step moves into place." },
  { icon: "reorder", title: "Move an untimed step", text: "Point at the step and drag its ≡ where you want it. It stays with the step above it." },
  { icon: "pushpin", title: "Pin a booking", text: "Right-click a step and choose Pin this step. Its time stays locked until you unpin it." },
  { icon: "pin", title: "Link a place", text: "Click a step's icon and pick one of your saved places — the day's areas come first." },
];

function DayPage({ data, day }: { data: TripData; day: DayT }) {
  const updateEntity = useApp((s) => s.updateEntity);
  const addEntity = useApp((s) => s.addEntity);
  const removeEntity = useApp((s) => s.removeEntity);
  const mutateTrip = useApp((s) => s.mutateTrip);
  const activeId = useApp((s) => s.activeId);
  const nav = useNavigate();
  const leave = useLeavePage();
  const { active: splitActive } = useSplit();
  const ro = useReadOnly();
  const { busy: icsBusy, run: runIcs } = useAsyncAction();
  const { busy: pdfBusy, run: runPdf } = useAsyncAction();
  // the timeline as plain rows, kept by the plan as it draws — what the PDF prints
  const outline = useRef<DayPdfRow[]>([]);
  const areaSheet = useActionSheet();

  const L = lookups(data);
  const patch = (p: Partial<DayT>) => updateEntity<DayT>("days", day.id, p);
  const pinned = (data.config.pinnedDays ?? []).includes(day.id);
  const leg = L.leg(day.legId);
  const hotel = L.hotel(day.hotelId);
  const journeys = dayJourneys(day, data);
  const journeySheet = useActionSheet();
  // the labels sheet opens from the caption or the title's ⋯, beside either
  const [labelsOpen, setLabelsOpen] = useState(false);
  const labelsAnchor = useRef<HTMLElement | null>(null);
  const dayMenuAnchor = useRef<HTMLSpanElement>(null);
  const openLabels = (el: HTMLElement | null) => { labelsAnchor.current = el; setLabelsOpen(true); };
  // what the journey popover points at — the section's own row, or the nav ＋
  const journeyAnchor = useRef<HTMLElement | null>(null);
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
  // the step just added opens straight into its text. Rendered synchronously
  // inside the tap, so its field is focused there and the iPhone keyboard
  // comes up (it won't for a focus that happens after the tap)
  const [freshStep, setFreshStep] = useState<string | null>(null);
  // a new step starts with what it is, as Maps' "Add a stop" does: one of
  // the trip's places (then its time), or Custom… for a step to type
  const addSheet = useActionSheet();
  const addAnchor = useRef<HTMLElement | null>(null);
  // where the new step goes: at the end, or (from a part-of-day band or a
  // step's Add Step Below) at that spot — untimed, so it stays there
  const addAt = useRef<number | undefined>(undefined);
  const addStep = (e?: { currentTarget: HTMLElement }, at?: number) => {
    addAnchor.current = e?.currentTarget ?? null;
    addAt.current = at;
    addSheet.setOpen(true);
  };
  const addPicked = (pid?: string) => {
    addSheet.setOpen(false);
    const id = rid();
    const p = pid ? data.places.find((x) => x.id === pid) : undefined;
    flushSync(() => {
      setFreshStep(id);
      const step: PlanItem = p ? { id, text: p.name, placeId: p.id } : { id, text: "" };
      // the plan as shown (time order), so the index is the spot tapped
      const plan = sortByTime(day.plan ?? [], () => false);
      const at = Math.min(addAt.current ?? plan.length, plan.length);
      setPlan([...plan.slice(0, at), step, ...plan.slice(at)]);
    });
  };
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
  // areas offered by "+ Add area", one group per city the way the Map
  // draws it (a day trip to Nara puts Nara's areas first): this day's city,
  // then the one it set off from (a travel day still reaches the city it
  // leaves), then the rest of the trip's cities in order; A–Z within each
  const cityAnchors = useCityAnchors(data);
  const { dayCity, placeCity, tripCities, areaCity } = useTripCities(data, cityAnchors);
  const areaGroups = useMemo(() => {
    const nameOf = (c: string) => data.legs.find((l) => l.id === c)?.base || tripCities.find((t) => t.id === c)?.name || "";
    const at = data.days.findIndex((d) => d.id === day.id);
    const order = [dayCity.get(day.id), at > 0 ? dayCity.get(data.days[at - 1].id) : undefined, ...data.days.map((d) => dayCity.get(d.id))];
    const rank = (c?: string) => { const i = c ? order.indexOf(c) : -1; return i < 0 ? order.length : i; };
    const groups = new Map<string | undefined, Area[]>();
    for (const a of data.areas) {
      if ((day.areaIds ?? []).includes(a.id)) continue;
      const c = areaLeg(a, placeCity);
      groups.set(c, [...(groups.get(c) ?? []), a]);
    }
    return [...groups]
      .sort(([a], [b]) => rank(a) - rank(b))
      .map(([c, areas]) => ({ label: c ? nameOf(c) : "Other", areas: areas.sort(byAreaName) }));
  }, [data, day.id, day.areaIds, dayCity, placeCity, tripCities]);

  // places available to a plan step's picker — drawn only from this day's own
  // linked areas (see the Areas section below), not every place in the trip
  const areaPlaceIds = new Set((day.areaIds ?? []).flatMap((aid) => data.areas.find((a) => a.id === aid)?.placeIds ?? []));
  const areaPlaces = data.places.filter((p) => areaPlaceIds.has(p.id));
  // and after them, the rest of the day's city, then everywhere else — so a
  // day with no areas yet still picks from the trip's places
  const morePlaces = useMemo<PlaceGroup[]>(() => {
    const byName = (a: Place, b: Place) => a.name.localeCompare(b.name);
    const city = dayCity.get(day.id);
    const cityName = city ? data.legs.find((l) => l.id === city)?.base ?? tripCities.find((c) => c.id === city)?.name : undefined;
    const rest = data.places.filter((p) => !areaPlaceIds.has(p.id)).sort(byName);
    const here = city ? rest.filter((p) => placeCity.get(p.id) === city) : [];
    const hereIds = new Set(here.map((p) => p.id));
    return [
      { label: cityName ? `In ${cityName}` : "In this city", places: here },
      { label: here.length || areaPlaceIds.size ? "Elsewhere" : "Places", places: rest.filter((p) => !hereIds.has(p.id)) },
    ];
  }, [data.places, data.legs, day.id, day.areaIds, data.areas, dayCity, placeCity, tripCities]);
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
  // a stay with no coordinates of its own (a second booking of the same
  // hotel) borrows them, so the way to and from it still shows
  const locate = (h?: Hotel) => {
    const at = h && stayCoords(h, data.hotels, data.places);
    return h && at ? { ...h, ...at } : h;
  };
  const weatherHotel = locate(hotel ?? L.hotel(leg?.hotelId));
  // where the day starts from: the night before's stay (on a moving day
  // that's the old hotel, not the new one). None on the trip's first day or
  // an arrival — that day starts off the journey
  const prevDay = data.days.find((x) => x.date === addDays(day.date, -1));
  const startHotel = !prevDay || dayKind(day, data) === "arrival" ? undefined
    : locate(L.hotel(prevDay.hotelId) ?? L.hotel(L.leg(prevDay.legId)?.hotelId));
  // today: the plan shows where now is and what's up next
  const isToday = day.date === useToday();
  const clockNow = useClock(isToday);
  const [weather, setWeather] = useState<DayWeather | null>(null);
  // a day trip's forecast is for where it goes, not the hotel's city
  const spot = forecastSpot(weatherHotel, dayPlaces, day.dayTrip);
  const spotKey = spot && `${spot.lat.toFixed(2)},${spot.lng.toFixed(2)}`;
  useEffect(() => {
    setWeather(null);
    if (!spot) return;
    let cancelled = false;
    void fetchDayWeather(spot.lat, spot.lng, day.date).then((w) => { if (!cancelled) setWeather(w); });
    return () => { cancelled = true; };
  }, [spotKey, day.date]); // eslint-disable-line react-hooks/exhaustive-deps
  // sunrise and sunset for that same spot, on its own clock — the same
  // times the day's row on Plan shows
  const sun = useDaySun(data, day);
  const sunText = [sun.rise && `Sunrise ${fmtClock(sun.rise)}`, sun.set && `Sunset ${fmtClock(sun.set)}`].filter(Boolean).join(" · ");

  // offline pre-fetch — every place this day's map shows (its areas, its own
  // plan steps, the hotel it's anchored to), so the day's corner of the map
  // works offline before you've ever panned around it
  const offlinePoints = dayOfflinePoints(data, day);
  const { busy: offlineBusy, msg: offlineMsg, run: runOffline } = useAsyncAction("Couldn't cache the map tiles.");
  const downloadOfflineMaps = () =>
    runOffline(async () => {
      const { ok, truncated } = activeId ? await prefetchTiles(activeId, offlinePoints) : { ok: 0, truncated: false };
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
  // today's ＋ → Amount: the keypad straight away, then its category — a
  // spend logged at the till, landing in Spending like any other row
  const [quickSpend, setQuickSpend] = useState(false);
  const quickSpendAnchor = useRef<HTMLElement | null>(null);
  const addSpend = (cost: Omit<DayCost, "id">) => {
    const id = rid();
    setCosts([...(day.costs ?? []), { id, ...cost }]);
    setJustAddedCostId(id);
  };
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
    if (splitActive) selectInSplit(place.id);
    else nav(`/map?sel=${place.id}`);
  };

  // NEARBY — the trip's saved places close to the plan's stops, offered in
  // their own section (and on each stop's card), never written into the plan
  // until one is added. Hours come from what's already known (Good to know,
  // or a cached OSM answer); the shown ones are looked up below, and the
  // list re-sorts as they land
  const [hoursTick, bumpHours] = useReducer((n: number) => n + 1, 0);
  const icons = data.config.categoryIcons;
  const nearby = useMemo(() => {
    const plan = sortByTime(day.plan ?? [], () => false);
    const plannedOn = new Map<string, string>();
    for (const d of [...data.days].sort((a, b) => a.date.localeCompare(b.date))) {
      if (d.id === day.id) continue;
      for (const it of d.plan ?? []) if (it.placeId && !plannedOn.has(it.placeId)) plannedOn.set(it.placeId, d.date);
    }
    // a café isn't lunch, and doesn't stand in for one
    const glyphOf = (p: Place) => (p.category ? icons?.[p.category] || glyphForCategoryName(p.category) : undefined);
    const isMeal = (p: Place) => isFoodPlace(p, icons) && glyphOf(p) !== "coffee";
    return nearbyForDay({
      plan,
      places: data.places,
      plannedOn,
      skip: (p) => !Number.isFinite(p.lat) || !Number.isFinite(p.lng) || (p.lat === 0 && p.lng === 0) || notASight(p, data),
      isFood: isMeal,
      isMealStep: (it, p) => (p ? isMeal(p) : glyphForStepText(it.text) === "food"),
      hoursOn: (p) => nearbyHours(p, day.date),
    });
    // hoursTick: a lookup below has landed in the hours cache
  }, [data, day.id, day.plan, day.date, icons, hoursTick]);
  const nearbyKey = nearby.map((g) => g.items.map((i) => i.place.id).join(",")).join("|");
  useEffect(() => {
    let live = true;
    for (const g of nearby) {
      for (const { place: p } of g.items) {
        if (nearbyHours(p, day.date) !== undefined || cachedOpeningHours(p.lat, p.lng, p.name) !== undefined) continue;
        // a failed lookup isn't cached, so only an answer re-sorts the list
        void nearestOpeningHours(p.lat, p.lng, p.name).then((h) => { if (live && h) bumpHours(); });
      }
    }
    return () => { live = false; };
  }, [nearbyKey, day.date]);
  const nearbyByStep = useMemo(() => new Map(nearby.map((g) => [g.stepId, g])), [nearby]);
  // a pick goes in right after the stop it's near, untimed — it then rides
  // with that stop wherever its time takes it
  const withNearby = (stepId: string, place: Place) => {
    const plan = sortByTime(day.plan ?? [], () => false);
    const i = plan.findIndex((x) => x.id === stepId);
    return [...plan.slice(0, i + 1), { id: rid(), text: place.name, placeId: place.id }, ...plan.slice(i + 1)];
  };
  const addNearby = (group: NearbyGroup, place: Place) =>
    undoable(`Added after ${group.stop.name}`, () => setPlan(withNearby(group.stepId, place)));
  // "Move here": off the day that has it, onto this one after the stop
  const moveNearby = (group: NearbyGroup, place: Place) => {
    const from = data.days.find((d) => d.id !== day.id && d.plan?.some((it) => it.placeId === place.id));
    if (!from) { addNearby(group, place); return; }
    undoable(`Moved from ${fmtDate(from.date, loc, { weekday: "short", day: "numeric", month: "short" })}`, () => {
      const rest = (from.plan ?? []).filter((it) => it.placeId !== place.id);
      updateEntity<DayT>("days", from.id, { plan: rest.length ? rest : undefined });
      setPlan(withNearby(group.stepId, place));
    });
  };
  const [nearbyOpen, setNearbyOpen] = useState<{ item: NearbyItem; group: NearbyGroup } | null>(null);
  // the card keeps showing the place it opened with while it slides away
  const nearbyLast = useRef<{ item: NearbyItem; group: NearbyGroup } | null>(null);
  if (nearbyOpen) nearbyLast.current = nearbyOpen;
  const nearbyCard = nearbyOpen ?? nearbyLast.current;
  const nearbyAnchor = useRef<HTMLElement | null>(null);
  const openNearby = (item: NearbyItem, group: NearbyGroup, anchor: HTMLElement | null) => {
    nearbyAnchor.current = anchor;
    setNearbyOpen({ item, group });
  };
  const nearbyCtx = {
    byStep: nearbyByStep,
    open: ({ item, group, anchor }: { item: NearbyItem; group: NearbyGroup; anchor: HTMLElement | null }) => openNearby(item, group, anchor),
    add: addNearby,
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

  const pdfDate = fmtDate(day.date, loc, { weekday: "long", day: "numeric", month: "long" });
  const pdfName = `${day.date} ${day.title || pdfDate}`.replace(/[\\/:*?"<>|]+/g, " ").replace(/\s+/g, " ").trim();

  // the plan, for printing: times, places with their hours that day, notes
  const downloadPlanPdf = () =>
    runPdf(async () => {
      const accent = getComputedStyle(document.documentElement).getPropertyValue("--c-accent").trim();
      // a place's hours that day: what Good to know found, else OpenStreetMap
      // (remembered on the device; a short wait at most when offline)
      const hoursOf = async (placeId?: string) => {
        const p = placeId ? data.places.find((x) => x.id === placeId) : undefined;
        if (!p) return undefined;
        const facts = factsDayHours(p.facts, day.date);
        if (facts) return facts;
        const osm = await Promise.race([
          nearestOpeningHours(p.lat, p.lng, p.name).catch(() => null),
          new Promise<null>((r) => setTimeout(() => r(null), 4000)),
        ]);
        return osm ? osmHoursOn(osm.hours, day.date) : undefined;
      };
      const rows = await Promise.all(outline.current.map(async (row) => {
        const hours = await hoursOf(row.placeId);
        if (!hours) return row;
        return hours === "Closed"
          ? { ...row, warning: [row.warning, "Closed this day"].filter(Boolean).join(" · ") }
          : { ...row, meta: [`Open ${fmtClocksIn(hours)}`, row.meta].filter(Boolean).join(" · ") };
      }));
      const blob = await buildDayPdf({
        date: pdfDate,
        title: day.title,
        labels: day.labels,
        stay: weatherHotel && { name: weatherHotel.name || "your stay", address: weatherHotel.address, href: gmapsLink(weatherHotel.mapUrl || weatherHotel.address || weatherHotel.name) },
        rows,
        notes: day.notes?.trim() ? mdToPlain(day.notes) : undefined,
        trip: data.meta.title,
        accent: accent && `rgb(${accent})`,
      });
      saveFile(blob, `${pdfName}.pdf`);
    });

  // the whole page as it is, every section open, in light mode
  const downloadPagePdf = () =>
    runPdf(async () => {
      const root = document.querySelector<HTMLElement>(".day-pdf-root");
      if (!root) return;
      const theme = THEME_PRESETS.find((t) => t.id === data.config.themePreset)?.tokens ?? data.config.theme;
      const blob = await buildPagePdf(root, {
        date: pdfDate,
        trip: data.meta.title,
        open: setExpandAll,
        prepare: (copy) => {
          copy.documentElement.classList.remove("dark");
          if (theme) applyPalette(theme.light, theme.dark, "light", copy.documentElement);
        },
      });
      saveFile(blob, `${pdfName} (full).pdf`);
    });

  return (
    <NearbyProvider value={nearbyCtx}>
    <Page className="day-pdf-root">
      {/* IDENTITY — date, title, and where you're based / how you move */}
      <DayStepper days={data.days} current={day.id} locale={loc} />
      {/* ＋ where Plan has it, beside the account button: the day's one new thing is a step */}
      {!ro && (
        <NavAddButton
          label="Add"
          items={[
            { icon: "itinerary", label: "Add a step", onClick: (a) => addStep(a ? { currentTarget: a } : undefined) },
            { icon: "train", label: "Add a journey", onClick: (a) => { journeyAnchor.current = a; journeySheet.setOpen(true); } },
            // during the trip, today's spending is a tap away
            ...(isToday ? [{ icon: "wallet" as const, label: "Add an amount", onClick: (a: HTMLElement | null) => { quickSpendAnchor.current = a; setQuickSpend(true); } }] : []),
          ]}
        />
      )}
      {!ro && isToday && (
        <QuickSpend
          open={quickSpend}
          onClose={() => setQuickSpend(false)}
          anchorRef={quickSpendAnchor as React.RefObject<HTMLElement>}
          currencies={(data.config.currencies ?? []).filter(Boolean)}
          defaultCurrency={lastSpendCurrency}
          categories={data.config.expenseCategories ?? []}
          onAdd={addSpend}
        />
      )}
      {!ro && (
        <PlacePicker
          title="Add a step"
          adding
          places={[...areaPlaces].sort((a, b) => a.name.localeCompare(b.name))}
          more={morePlaces}
          areaNameByPlaceId={areaNameByPlaceId}
          categoryIcons={data.config.categoryIcons}
          categoryColors={data.config.categoryColors}
          onPick={addPicked}
          sheet={addSheet}
          anchor={addAnchor}
        />
      )}
      <PageHeader
        back="/"
        dotColor={legHex(leg?.color)}
        eyebrow={fmtDate(day.date, loc, { weekday: "long", day: "numeric", month: "long" })}
        navSubtitle={fmtDate(day.date, loc, { weekday: "short", day: "numeric", month: "short" })}
        title={
          <Editable label="Day title" value={day.title ?? ""} placeholder="Untitled day" onCommit={(v) => patch({ title: v || undefined })} />
        }
        meta={(day.labels?.length || weather || sunText) ? (
          <>
            <DayLabelsCaption labels={day.labels ?? []} onEdit={ro ? undefined : openLabels} />
            {weather && <span className="block">{weatherText(weather, loc)}</span>}
            {sunText && <span className="block">{sunText}</span>}
          </>
        ) : undefined}
        action={
          <span ref={dayMenuAnchor} {...{ [PDF_HIDE]: "" }}>
          <RowMenu label="Day options">
            {!ro && (
              <button className="menu-item" onClick={() => openLabels(dayMenuAnchor.current)}>
                <Icon name="tag" size={16} /> {day.labels?.length ? "Labels…" : "Add a Label…"}
              </button>
            )}
            <button className="menu-item" onClick={downloadDayCalendar} disabled={icsBusy}>
              <Icon name="calendar" size={16} /> {icsBusy ? "Building calendar file…" : "Add Day to Calendar"}
            </button>
            <button className="menu-item" onClick={downloadPlanPdf} disabled={pdfBusy}>
              <Icon name="download" size={16} /> {pdfBusy ? "Making PDF…" : "Download Plan (PDF)"}
            </button>
            <button className="menu-item" onClick={downloadPagePdf} disabled={pdfBusy}>
              <Icon name="download" size={16} /> {pdfBusy ? "Making PDF…" : "Download Full Day (PDF)"}
            </button>
          </RowMenu>
          </span>
        }
      />

      {!ro && (
        <DayLabelsSheet
          open={labelsOpen}
          onClose={() => setLabelsOpen(false)}
          anchorRef={labelsAnchor}
          labels={day.labels ?? []}
          used={usedLabels}
          onChange={(next) => patch({ labels: next.length ? next : undefined })}
          onRenameAll={(from, to) => undoable("Label renamed", () => relabel(from, to))}
          onDeleteAll={(l) => undoable("Label deleted", () => relabel(l))}
        />
      )}

      {ro && journeys.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {journeys.map((j) => (
            <Link key={j.id} to={`/journey/${j.id}`} className="btn-sm">
              <Icon name={j.segments[0] ? MODE_ICON[j.segments[0].mode] : "train"} size={14} className="text-ink-soft" /> <RouteLabel label={j.label || "New journey"} />
            </Link>
          ))}
        </div>
      )}

      {/* JOURNEYS — every way you're carried today, in the order they leave;
          hidden on a day with none, where the nav ＋ adds the first */}
      {!ro && (
        <ActionSheet open={journeySheet.open} onClose={() => journeySheet.setOpen(false)} anchorRef={journeyAnchor} title="Add a journey">
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
      )}
      {!ro && journeys.length > 0 && (
        <Section title="Journeys" id="day-journeys" className="mb-8">
          <ul>
            {journeys.map((j) => (
              <DayJourneyRow key={j.id} day={day} journey={j} data={data} onRemove={() => unlinkJourney(j.id)} />
            ))}
            <li className={INSET_DIVIDER}>
              <button
                type="button"
                onClick={(e) => { journeyAnchor.current = e.currentTarget; journeySheet.setOpen(true); }}
                className="action w-full px-3.5 py-2.5 text-xs transition-colors duration-150 active:bg-ink/[0.07]"
              >
                <Icon name="plus" size={14} /> Add a journey
              </button>
            </li>
          </ul>
        </Section>
      )}

      <div className="space-y-6">
      {/* PLAN — the day's itinerary: time + step, drag to reorder */}
      {((day.plan ?? []).length > 0 || !ro) && (
        <Section
          title="Plan"
          info={touchDevice ? PLAN_TIPS_TOUCH : PLAN_TIPS_POINTER}
          action={overwhelmingCount > 0 && (
            <span className="flex items-center gap-1 text-xs text-danger" title={`${plural(overwhelmingCount, "overwhelming place")} today`}>
              <Icon name="alert" size={13} /> {overwhelmingCount}
            </span>
          )}
        >
          <PlanList day={day} journeys={journeys} startHotel={startHotel} returnHotel={dayKind(day, data) === "departure" ? undefined : weatherHotel} tz={data.config.tripTimeZone} items={day.plan ?? []} places={data.places} areaPlaces={areaPlaces} morePlaces={morePlaces} areaNameByPlaceId={areaNameByPlaceId} categoryIcons={data.config.categoryIcons} categoryColors={data.config.categoryColors} readOnly={ro} fresh={freshStep} onAdd={addStep} onChange={setPlan} onBackAt={(t) => patch({ backAt: t })} onLeaveAt={(t) => patch({ leaveAt: t })} onWakeAt={(t) => patch({ wakeAt: t })} onBreakfastAt={(t) => patch({ breakfastAt: t })} onQuickAddCost={quickAddCost} onShowOnMap={showOnMap} outline={outline} now={isToday ? clockNow : undefined} />
        </Section>
      )}

      {/* NEARBY — saved places close to the plan's stops, kept out of the plan.
          It and Areas start shut on every day, one open/closed state for all */}
      {nearby.length > 0 && (
        <Section
          title="Nearby"
          id="day-nearby"
          defaultOpen={false}
          info={[
            { icon: "walk", title: "Close to your stops", text: `Saved places not on this day's plan, under the stop they're nearest — up to about ${NEARBY_WALK_MIN} minutes' walk.` },
            { icon: "clock", title: "Food when it's time", text: "Around a lunch or dinner the plan leaves open, somewhere to eat comes first." },
            ...(ro ? [] : [{ icon: "plus" as const, title: "Add one", text: "Tap ＋ to add it after its stop." }]),
          ]}
        >
          <ul className="pb-1">
            {nearby.map((g, i) => (
              <NearbyGroupRows
                key={g.stepId}
                group={g}
                first={i === 0}
                locale={loc}
                categoryIcons={icons}
                categoryColors={data.config.categoryColors}
                readOnly={ro}
                onOpen={(item, anchor) => openNearby(item, g, anchor)}
                onAdd={(item) => addNearby(g, item.place)}
              />
            ))}
          </ul>
        </Section>
      )}

      {/* AREAS — pull an area's places onto this day's map, without touching the plan */}
      {((day.areaIds ?? []).length > 0 || (!ro && data.areas.length > 0)) && (
        <Section
          title="Areas"
          id="day-areas"
          defaultOpen={false}
          info={[
            { icon: "map", title: "On the day's map", text: "Places in an area you add here show on the day's map." },
            { icon: "list", title: "Plan stays as it is", text: ro ? "They don't change the plan above." : "They don't change the plan above — unless you add them from the row's ⋯ menu." },
          ]}
        >
          {/* one row per area (Files' list view: the same map tile the Map
              list gives it, its place count trailing), then the section's
              actions as accent rows */}
          <ul>
            {(day.areaIds ?? [])
              .map((id) => data.areas.find((x) => x.id === id))
              .filter((a): a is Area => !!a)
              .sort(byAreaName)
              .map((a) => {
                const id = a.id;
                const index = data.areas.indexOf(a);
                const linked = new Set((day.plan ?? []).map((it) => it.placeId).filter(Boolean));
                const newPlaces = a.placeIds.filter((pid) => !linked.has(pid)).map((pid) => data.places.find((p) => p.id === pid)).filter((p): p is NonNullable<typeof p> => !!p);
                const name = a.name || "Untitled";
                return (
                  <li key={id} className={AREA_ROW_LI}>
                    <ContextMenu>
                      <div className="flex items-center gap-3 px-3.5 py-2.5">
                        <IconTile size="sm" name="map" color={AREA_TONES[index % AREA_TONES.length]} className="shrink-0" />
                        <span className="min-w-0 flex-1 break-words text-sm leading-snug text-ink">
                          {name}
                          {areaCity.has(id) && <span className="block text-xs text-ink-faint">{areaCity.get(id)}</span>}
                        </span>
                        <span className="shrink-0 text-[15px] tabular-nums text-ink-faint">{plural(a.placeIds.length, "place")}</span>
                        {!ro && (
                          <RowMenu label={`More for ${name}`}>
                            {newPlaces.length > 0 && (
                              <button
                                type="button"
                                className="menu-item"
                                onClick={() => undoable(`Added ${plural(newPlaces.length, "place")}`, () => setPlan([...(day.plan ?? []), ...newPlaces.map((p) => ({ id: rid(), text: p.name, placeId: p.id }))]))}
                              >
                                <Icon name="plus" size={16} /> Add {newPlaces.length === a.placeIds.length ? "its places" : plural(newPlaces.length, "more place")} to the plan
                              </button>
                            )}
                            <button
                              type="button"
                              className="menu-item text-danger"
                              onClick={() => undoable("Area removed", () => patch({ areaIds: (day.areaIds ?? []).filter((x) => x !== id) }))}
                            >
                              <Icon name="close" size={16} /> Remove from this day
                            </button>
                          </RowMenu>
                        )}
                      </div>
                    </ContextMenu>
                  </li>
                );
              })}
            {!ro && areaGroups.length > 0 && (
              <li className={INSET_DIVIDER}>
                <button ref={areaSheet.anchorRef} onClick={() => areaSheet.setOpen(true)} className={ACTION_ROW}>
                  <Icon name="plus" size={14} /> Add area
                </button>
                <ActionSheet open={areaSheet.open} onClose={() => areaSheet.setOpen(false)} anchorRef={areaSheet.anchorRef} title="Add an area">
                  {areaGroups.map((g) => (
                    <div key={g.label}>
                      {/* every area sits under its city; only a lone "Other" goes bare */}
                      {(areaGroups.length > 1 || g.label !== "Other") && <p className="kicker px-4 pb-0.5 pt-3 text-ink-faint">{g.label}</p>}
                      {g.areas.map((a) => (
                        <button
                          key={a.id}
                          type="button"
                          onClick={() => { patch({ areaIds: [...(day.areaIds ?? []), a.id] }); areaSheet.setOpen(false); }}
                          className="menu-item"
                        >
                          {a.name || "Untitled"} · {plural(a.placeIds.length, "place")}
                        </button>
                      ))}
                    </div>
                  ))}
                </ActionSheet>
              </li>
            )}
            {canPrefetchTiles && offlinePoints.length > 0 && (
              <ActionRow icon="download" label={offlineBusy ? "Caching…" : "Download offline maps"} onClick={downloadOfflineMaps} disabled={offlineBusy} />
            )}
          </ul>
          {offlineMsg && <p className="meta px-3.5 pb-3">{offlineMsg}</p>}
        </Section>
      )}

      {/* SPENDING — what the day cost; feeds the Expenses roll-up */}
      {((day.costs ?? []).length > 0 || !ro) && (
        <Section title="Spending" info={[
          { icon: "tag", title: "Pick a category", text: "Tag each amount so it's counted in the right place." },
          { icon: "wallet", title: "Added up for you", text: "Expenses in the Logbook totals them across the trip." },
        ]}>
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
        <Section title="General notes" info={[
          { icon: "pencil", title: "Tap to edit", text: "Aa sets headings, bold and colours." },
          { icon: "chevron", title: "Fold a heading", text: "A heading's chevron folds its section away." },
        ]}>
          <div className="note px-3.5 py-3">
            <RichNote
              value={day.notes ?? ""}
              onCommit={(v) => patch({ notes: v || undefined })}
              placeholder="Anything else — ideas, reminders, links…"
            />
          </div>
        </Section>
      )}

      {/* STAY — last: you know where you're sleeping, the plan comes first */}
      {(hotel || !ro) && (
        <Section>
          <ul>
            {ro ? (
              hotel && <InsetRow label="Staying at" to={`/hotel/${hotel.id}`}>{hotel.name || "Stay"}</InsetRow>
            ) : (
              <>
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
                {hotel && <ActionRow icon="bed" label={`Open ${hotel.name || "stay"}`} to={`/hotel/${hotel.id}`} />}
              </>
            )}
          </ul>
        </Section>
      )}
      </div>

      {/* the day's own actions, one grouped list like an iOS settings footer */}
      {!ro && (
        <div {...{ [PDF_HIDE]: "" }}><Section className="mt-8">
          <ul>
            {day.dayTrip
              ? <ActionRow icon="close" label="Not a day trip" onClick={() => patch({ dayTrip: false })} />
              : <ActionRow icon="explore" label="Make this a day trip" onClick={() => patch({ dayTrip: true })} />}
            <ActionRow
              icon="pushpin"
              label={pinned ? "Unpin this day" : "Pin this day"}
              onClick={() => mutateTrip((d) => {
                const ids = new Set(d.config.pinnedDays ?? []);
                if (ids.has(day.id)) ids.delete(day.id); else ids.add(day.id);
                d.config.pinnedDays = ids.size ? [...ids] : undefined;
              })}
            />
          </ul>
        </Section></div>
      )}
      {/* destructive on its own, as iOS sets Delete apart from other actions */}
      {!ro && (
        <div {...{ [PDF_HIDE]: "" }}><Section className="mt-6">
          <ul>
            <li className={INSET_DIVIDER}>
              <ConfirmButton
                label="Delete day"
                message="This day and its plan will be deleted."
                onConfirm={() => undoable("Day deleted", () => { removeEntity("days", day.id); leave("/"); })}
                className="w-full justify-center px-3.5 py-2.5 text-xs text-danger active:bg-ink/[0.07]"
              >
                Delete day
              </ConfirmButton>
            </li>
          </ul>
        </Section></div>
      )}
      <NearbyCard
        open={!!nearbyOpen}
        onClose={() => setNearbyOpen(null)}
        anchorRef={nearbyAnchor as React.RefObject<HTMLElement>}
        item={nearbyCard?.item}
        group={nearbyCard?.group}
        date={day.date}
        locale={loc}
        categoryIcons={icons}
        readOnly={ro}
        plannedDayId={(() => { const d = nearbyCard?.item.plannedOn; return d ? data.days.find((x) => x.date === d)?.id : undefined; })()}
        onAdd={() => nearbyCard && addNearby(nearbyCard.group, nearbyCard.item.place)}
        onMove={() => nearbyCard && moveNearby(nearbyCard.group, nearbyCard.item.place)}
        onShowOnMap={showOnMap}
      />
    </Page>
    </NearbyProvider>
  );

}

/** what's already known of a place's hours on `date`, without asking:
 *  its Good to know lines, else a cached OpenStreetMap answer */
function nearbyHours(p: Place, date: string): string | undefined {
  const fromFacts = factsDayHours(p.facts, date);
  if (fromFacts) return fromFacts;
  const cached = cachedOpeningHours(p.lat, p.lng, p.name);
  return cached ? osmHoursOn(cached.hours, date) : undefined;
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

  const leave = fmtClock(clockOf(first?.depart));
  const arrive = fmtClock(clockOf(last?.arrive));
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
            <TitleLineTile><IconTile size="sm" name={first ? MODE_ICON[first.mode] : "train"} tone={first ? MODE_TONE[first.mode] : "ai"} /></TitleLineTile>
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

function PlanList({ day, journeys, startHotel, returnHotel, tz, items: storedItems, places, areaPlaces, morePlaces, areaNameByPlaceId, categoryIcons, categoryColors, readOnly, fresh, onAdd, onChange, onBackAt, onLeaveAt, onWakeAt, onBreakfastAt, onQuickAddCost, onShowOnMap, outline, now }: {
  day: DayT;
  /** the day's journeys — their leave / arrive times show as rows of their own */
  journeys: Journey[];
  /** where the day starts — the night before's stay (see `StartFromHotel`) */
  startHotel?: Hotel;
  /** where the day ends — the hotel you're staying at (see `ReturnToHotel`) */
  returnHotel?: Hotel;
  tz?: string;
  items: PlanItem[];
  places: Place[];
  areaPlaces: Place[];
  morePlaces: PlaceGroup[];
  areaNameByPlaceId: Map<string, string>;
  categoryIcons?: Record<string, string>;
  categoryColors?: Record<string, string>;
  readOnly: boolean;
  /** the step just added — opens its text for typing */
  fresh: string | null;
  /** adds a step at the end, or at index `at` — opens what it is first */
  onAdd: (e?: { currentTarget: HTMLElement }, at?: number) => void;
  onChange: (next: PlanItem[]) => void;
  /** sets when you're back at the hotel (the last row's time) */
  onBackAt: (time: string | undefined) => void;
  /** sets when you leave the hotel (that row's time) */
  onLeaveAt: (time: string | undefined) => void;
  onWakeAt: (time: string | undefined) => void;
  /** filled with the timeline as plain rows, in the order shown — what the
   *  day's PDF prints */
  outline?: { current: DayPdfRow[] };
  /** the time now ("HH:MM") when this day is today — draws the now line
   *  and Up next; unset on any other day */
  now?: string;
  onBreakfastAt: (time: string | undefined) => void;
  onQuickAddCost: (item: PlanItem) => void;
  onShowOnMap: (place: Place) => void;
}) {
  const sensors = useSensors(
    // a mouse drags by the grip; a finger holds the row still, then moves —
    // no grip on a touch screen, as Plan's days and iOS lists reorder
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(HoldDragSensor),
    useSensor(KeyboardSensor),
  );
  // every step goes where its time puts it — a pin only locks a step's time
  // (a booking), it never holds a step out of order
  const isPinned = () => false;
  // shown (and edited) in time order even if stored out of it — a plan from
  // before steps sorted themselves, or from when a pin held a slot
  const items = useMemo(() => sortByTime(storedItems, isPinned), [storedItems]);
  // a new or changed time moves the step to its place in the day
  const patchItem = (id: string, p: Partial<PlanItem>) => {
    const next = items.map((x) => (x.id === id ? { ...x, ...p } : x));
    onChange("time" in p ? sortByTime(next, isPinned) : next);
  };
  const removeItem = (id: string) => onChange(items.filter((x) => x.id !== id));
  // dropped right after the original — a copied step usually belongs right
  // next to it (e.g. the same coffee stop, twice on a long day), not at the end
  const duplicateItem = (id: string) => {
    const i = items.findIndex((x) => x.id === id);
    if (i === -1) return;
    onChange([...items.slice(0, i + 1), { ...items[i], id: rid(), pinned: undefined }, ...items.slice(i + 1)]);
  };


  // the journey's own rows, live from the journey (never stored as steps):
  // each sits before the first step timed later than it, else at the end
  const stops = journeys.flatMap((journey) => journeyStops(journey, day.date).map((st) => ({ ...st, journey })));
  const stopRow = (st: (typeof stops)[number]) => (
    <JourneyStopRow key={`journey-${st.journey.id}-${st.hop}-${st.kind}`} journey={st.journey} stop={st} />
  );
  const stopAt = (time: string) => {
    const i = items.findIndex((it) => {
      const t = splitRange(it.time)?.[0] ?? it.time;
      return !!t && /^\d{1,2}:\d{2}$/.test(t) && t.padStart(5, "0") > time;
    });
    return i < 0 ? items.length : i;
  };
  const stopsAt = (i: number) =>
    stops.filter((st) => stopAt(st.time) === i).sort((a, b) => a.time.localeCompare(b.time));

  // nothing planned and no hotel to start or end at — on any other empty
  // day the hotel rows still draw, so it looks like every other day
  if (items.length === 0 && stops.length === 0 && !startHotel && !returnHotel) {
    // nothing to print — not the steps there were before the last one went
    if (outline) outline.current = [];
    return readOnly ? (
      <p className="px-3.5 py-3 text-sm text-ink-faint">Nothing planned yet.</p>
    ) : (
      <button onClick={onAdd} className="action w-full px-3.5 py-2.5 text-xs active:bg-ink/[0.07]">
        <Icon name="plus" size={14} /> Add a step
      </button>
    );
  }

  const placeOf = (it?: PlanItem) => (it?.placeId ? places.find((p) => p.id === it.placeId) : undefined);
  // the way back to the hotel sits where its time puts it, like a journey's
  // rows — a step timed later (a late drink near the hotel) follows it.
  // With no time set it closes the day
  const backAt = returnHotel && /^\d{1,2}:\d{2}$/.test(day.backAt ?? "") ? day.backAt!.padStart(5, "0") : undefined;
  const backIdx = !returnHotel ? -1 : backAt ? stopAt(backAt) : items.length;
  // the hotel you woke up at sits where the time you leave puts it: a step
  // timed earlier (getting up, breakfast in the room) comes above it, with
  // the untimed steps that follow it. Without a time it opens the day
  const leaveAt = startHotel && /^\d{1,2}:\d{2}$/.test(day.leaveAt ?? "") ? day.leaveAt!.padStart(5, "0") : undefined;
  let leaveIdx = startHotel ? 0 : -1;
  if (leaveAt) {
    for (let k = 0; k < items.length; k++) {
      const t = splitRange(items[k].time)?.[0] ?? items[k].time;
      const timed = !!t && /^\d{1,2}:\d{2}$/.test(t);
      if (timed && t.padStart(5, "0") >= leaveAt) break;
      if (timed || leaveIdx > 0) leaveIdx = k + 1;
    }
  }
  // where the plan last stood before step i, and at which step, looking
  // past steps with no place of their own (a snack, a rest) — unless a
  // journey's own row or the way back to the hotel falls among them, which
  // is the travel already
  const placeBefore = (i: number) => {
    for (let k = i - 1; k >= 0; k--) {
      if (k + 1 === leaveIdx) return undefined;
      if (k + 1 < i && (k + 1 === backIdx || stopsAt(k + 1).length)) return undefined;
      const p = placeOf(items[k]);
      if (p) return { place: p, at: k };
    }
    return undefined;
  };
  // the way to the next place hangs off the place it leaves from, looking
  // past steps with no place of their own (a snack, a rest) — unless a
  // journey's own row or the way back to the hotel is in between, which is
  // the travel already
  const connectorAfter = (i: number) => {
    const from = placeOf(items[i]);
    if (!from) return [];
    for (let j = i + 1; j < items.length; j++) {
      if (j === backIdx || j === leaveIdx || stopsAt(j).length) return [];
      const to = placeOf(items[j]);
      if (to) return [<TravelConnector key={`travel-${items[i].id}`} from={from} to={to} />];
    }
    return [];
  };

  // the way out from the night's hotel to the step after it — unless a
  // journey or the way back to the hotel comes first
  const startFrom = startHotel && hotelCoords(startHotel);
  const firstPlace = placeOf(items[leaveIdx]);
  const startConnector = startFrom && firstPlace && !stopsAt(leaveIdx).length && backIdx !== leaveIdx
    ? [<TravelConnector key="travel-from-hotel" from={startFrom} to={firstPlace} />]
    : [];

  // the plan in order, each entry with the time it starts at: a journey's
  // own rows, and each step with the way on to the next just under it — a
  // stop and its travel are one chunk, never split by a part-of-day label
  const entries: { time?: string; nodes: React.ReactNode[]; item?: number; hotel?: boolean; morning?: boolean; print?: DayPdfRow }[] = [];
  // each step's own entry, so the way back to the hotel can hang off it
  const itemEntries: (typeof entries)[number][] = [];
  const pushStops = (sts: typeof stops) => {
    for (const st of sts) entries.push({ time: st.time, nodes: [stopRow(st)], print: journeyPrint(st) });
  };
  // the journey rows due at slot i, with the way back to the hotel among
  // them in time order when it falls there too
  const pushSlot = (i: number) => {
    const sts = stopsAt(i);
    if (i !== backIdx || !returnHotel) return pushStops(sts);
    const before = sts.filter((st) => !backAt || st.time <= backAt);
    const after = sts.filter((st) => !before.includes(st));
    pushStops(before);
    // the way there hangs off the place it leaves from, in that step's own
    // chunk, so a part-of-day band never falls between a step and its
    // travel — unless a journey's row is the travel already
    const last = before.length ? undefined : placeBefore(i);
    const from = last?.place;
    const to = hotelCoords(returnHotel);
    if (last && to) itemEntries[last.at].nodes.push(<TravelConnector key="travel-to-hotel" from={last.place} to={to} />);
    const next = placeOf(items[i]);
    entries.push({
      time: backAt,
      print: { time: fmtClock(day.backAt) || undefined, title: `Back to ${returnHotel.name || "your stay"}`, href: hotelHref(returnHotel), quiet: true },
      nodes: [
        <ReturnToHotel
          key="back-to-hotel"
          from={from}
          hotel={returnHotel}
          time={day.backAt}
          timeStart={timeBefore(items, i)}
          readOnly={readOnly}
          onTime={onBackAt}
        />,
        // and on from the hotel to a step after it
        ...(to && next && !after.length ? [<TravelConnector key="travel-from-hotel-back" from={to} to={next} />] : []),
      ],
    });
    pushStops(after);
  };
  // Wake up and Breakfast open every day, above the hotel you leave from:
  // in time order among the steps before it, an untimed one first
  const clock = (t?: string) => (t && /^\d{1,2}:\d{2}$/.test(t) ? t.padStart(5, "0") : undefined);
  const morning = [
    { key: "wake", label: "Wake up", glyph: "sunrise" as MapGlyphId, time: day.wakeAt, timeStart: "07:00", onTime: onWakeAt },
    { key: "breakfast", label: "Breakfast", glyph: "breakfast" as MapGlyphId, time: day.breakfastAt, timeStart: clock(day.wakeAt) ?? "07:30", onTime: onBreakfastAt },
  ];
  const pushMorning = (before?: string) => {
    while (morning.length) {
      const m = morning[0];
      const at = clock(m.time);
      if (before && at && at > before) return;
      morning.shift();
      entries.push({
        time: m.time,
        morning: true,
        print: m.time ? { time: fmtClock(m.time), title: m.label, quiet: true } : undefined,
        nodes: [<MorningRow key={m.key} label={m.label} glyph={m.glyph} time={m.time} timeStart={m.timeStart} readOnly={readOnly} onTime={m.onTime} />],
      });
    }
  };
  const pushLeave = () => {
    pushMorning();
    if (!startHotel) return;
    entries.push({
      time: day.leaveAt,
      hotel: true,
      print: { time: fmtClock(day.leaveAt) || undefined, title: `From ${startHotel.name || "your stay"}`, href: hotelHref(startHotel), quiet: true },
      nodes: [
        <StartFromHotel
          key="from-hotel"
          hotel={startHotel}
          to={startConnector.length ? firstPlace : undefined}
          firstTime={splitRange(items[leaveIdx]?.time)?.[0] ?? items[leaveIdx]?.time}
          time={day.leaveAt}
          readOnly={readOnly}
          onTime={onLeaveAt}
        />,
        ...startConnector,
      ],
    });
  };
  items.forEach((it, i) => {
    if (i === leaveIdx) pushLeave();
    else if (!startHotel || i < leaveIdx) pushMorning(clock(splitRange(it.time)?.[0] ?? it.time) ?? "");
    pushSlot(i);
    const place = placeOf(it);
    entries.push(itemEntries[i] = {
      item: i,
      time: splitRange(it.time)?.[0] ?? it.time,
      print: {
        time: fmtClocksIn(it.time) || undefined,
        title: place?.name || it.text || "Step",
        meta: it.optional ? "Optional" : undefined,
        warning: [place?.overwhelming && "Overwhelming", ...(it.labels ?? [])].filter(Boolean).join(" · ") || undefined,
        note: it.note ? mdToPlain(it.note) : undefined,
        href: placeMapLink(place),
        placeId: place?.id,
      },
      nodes: [
        <PlanRow
          key={it.id}
          day={day}
          tz={tz}
          item={it}
          fresh={it.id === fresh}
          timeStart={timeBefore(items, i)}
          place={it.placeId ? places.find((p) => p.id === it.placeId) : undefined}
          areaPlaces={areaPlaces}
          morePlaces={morePlaces}
          areaNameByPlaceId={areaNameByPlaceId}
          categoryIcons={categoryIcons}
          categoryColors={categoryColors}
          readOnly={readOnly}
          onPatch={(p) => patchItem(it.id, p)}
          onRemove={() => removeItem(it.id)}
          onDuplicate={() => duplicateItem(it.id)}
          onAddBelow={(el) => onAdd(el ? { currentTarget: el } : undefined, i + 1)}
          onQuickAddCost={onQuickAddCost}
          onShowOnMap={onShowOnMap}
        />,
        ...(i < items.length - 1 ? connectorAfter(i) : []),
      ],
    });
  });
  if (leaveIdx === items.length) pushLeave();
  pushMorning();
  pushSlot(items.length);

  // Morning / Afternoon / Evening, as Reminders splits its Today list: a
  // label wherever a timed entry starts a new part of the day (an untimed
  // one stays in the part before it), on a day with more than one part
  // the way back to the hotel is one of them, so it falls in its own part
  // of the day like any step — back at 19:00 closes the day under Evening
  const parts = entries.map((e) => dayPart(e.time));
  // the hotel with no time to leave sits under the first step's part, since
  // leaving is part of it
  const leaveEntry = entries.findIndex((e) => e.hotel);
  if (leaveEntry >= 0 && !parts[leaveEntry]) parts[leaveEntry] = parts.find(Boolean);
  // getting up and breakfast are the morning, whatever the clock says
  entries.forEach((e, i) => { if (e.morning && !parts[i]) parts[i] = "morning"; });
  const multiPart = new Set(parts.filter(Boolean)).size > 1;
  // bands only ever move forward through the day — a row that sits out of
  // time order stays under the band it sits in, never opens an earlier one
  // again. Keyed by the part, so a band stays itself while the steps under
  // it change
  const bandAt: number[] = [];
  let part: DayPart | undefined;
  parts.forEach((p, i) => {
    if (!multiPart || !p || (part && PART_ORDER.indexOf(p) <= PART_ORDER.indexOf(part))) return;
    part = p;
    bandAt.push(i);
  });
  // a band's ＋ adds a step at the end of its part: after the last step
  // under it (counted in entries, which hold the steps in order)
  const endOfBand = (b: number) => {
    const stop = bandAt[b + 1] ?? entries.length;
    return entries.slice(0, stop).filter((e) => e.item != null).length;
  };
  if (outline) {
    // a part's heading goes on the first printed row under it
    let heading: string | undefined;
    outline.current = entries.flatMap((e, i) => {
      if (bandAt.includes(i)) heading = DAY_PARTS[parts[i]!].label;
      if (!e.print) return [];
      const row = { ...e.print, ...(heading && { part: heading }) };
      heading = undefined;
      return [row];
    });
  }
  // today: a red line where now falls, as Calendar draws it, and the row
  // that's up next — a row with nothing to print (an untimed Wake up) is
  // passed over for the one after it
  const nowAt = now ? nowInDay(entries.map((e) => e.time), now) : null;
  let nextIdx = nowAt ? nowAt.next : -1;
  while (nextIdx >= 0 && nextIdx < entries.length && !entries[nextIdx].print) nextIdx++;
  const nextEntry = nextIdx >= 0 && nextIdx < entries.length ? entries[nextIdx] : undefined;
  // where the next row is, and where you'd be setting off from
  let nextTo: { lat: number; lng: number } | null = null;
  let nextFrom: { lat: number; lng: number } | null = null;
  if (nextEntry?.item != null) {
    nextTo = placeOf(items[nextEntry.item]) ?? null;
    nextFrom = placeBefore(nextEntry.item)?.place ?? (startHotel && nextEntry.item <= leaveIdx ? hotelCoords(startHotel) : null);
  } else if (nextEntry && returnHotel && nextEntry.print?.title.startsWith("Back to")) {
    nextTo = hotelCoords(returnHotel);
    nextFrom = placeBefore(backIdx)?.place ?? null;
  }
  const nowLine = (key: string) => now && <NowLine key={key} now={now} />;

  const rows = entries.flatMap((e, i) => {
    const line = nowAt?.line === i ? [nowLine("now")] : [];
    const b = bandAt.indexOf(i);
    if (b < 0) return [...line, ...e.nodes];
    const p = parts[i]!;
    return [
      ...line,
      <DayPartRow key={`part-${p}`} part={p} onAdd={readOnly ? undefined : (el) => onAdd({ currentTarget: el }, endOfBand(b))} />,
      ...e.nodes,
    ];
  });
  if (nowAt?.line === entries.length) rows.push(nowLine("now"));

  // one timeline for the whole day — the hotel, steps, journeys and the way
  // home — with what's up next above it on today
  const timeline = (
    <>
      {now && nextEntry?.print && <UpNext row={nextEntry.print} start={nextEntry.time} now={now} from={nextFrom} to={nextTo} />}
      <ul className="timeline pb-1.5">{rows}</ul>
    </>
  );

  if (readOnly) return timeline;

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    // the finger lifting off a dropped row isn't a tap on it
    swallowNextClick();
    if (!over || active.id === over.id) return;
    const from = items.findIndex((x) => x.id === active.id);
    const to = items.findIndex((x) => x.id === over.id);
    // an untimed step lands where it's dropped, then rides with the timed
    // step above it — the timed ones stay in time order
    if (from >= 0 && to >= 0) onChange(sortByTime(moveAroundPinned(items, from, to, isPinned), isPinned));
  };

  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={items.map((x) => x.id)} strategy={verticalListSortingStrategy}>
          {timeline}
        </SortableContext>
      </DndContext>
      {/* the add lives at the foot, next to where the new step lands, so a
       *  long plan doesn't need a scroll back to the top */}
      <button onClick={onAdd} className="action w-full px-3.5 py-2.5 text-xs active:bg-ink/[0.07]">
        <Icon name="plus" size={14} /> Add a step
      </button>
    </>
  );
}

type DayPart = "morning" | "afternoon" | "evening";
const PART_ORDER: DayPart[] = ["morning", "afternoon", "evening"];
// whole class names, so Tailwind sees them: a light wash of the part's own
// colour behind the band, the glyph in that colour at full strength
const DAY_PARTS: Record<DayPart, { label: string; icon: IconName; band: string; glyph: string }> = {
  morning: { label: "Morning", icon: "sunrise", band: "bg-gold/[0.14]", glyph: "text-gold" },
  afternoon: { label: "Afternoon", icon: "sun", band: "bg-ai/[0.14]", glyph: "text-ai" },
  evening: { label: "Evening", icon: "moon", band: "bg-accent/[0.12]", glyph: "text-accent" },
};

/** which part of the day a start time falls in — before noon, before 18:00,
 *  or later; nothing for a loose time ("Around noon") or none */
function dayPart(time?: string): DayPart | undefined {
  const m = /^(\d{1,2}):(\d{2})$/.exec(time ?? "");
  if (!m) return undefined;
  const h = +m[1];
  return h < 12 ? "morning" : h < 18 ? "afternoon" : "evening";
}

/** a part-of-day header: a tinted band across the whole timeline, like the
 *  section bands in Calendar's list view — it breaks the rail, so where the
 *  morning ends and the afternoon starts is plain at a glance and never
 *  mistaken for a stop. Its ＋ adds a step at the end of that part, as
 *  Reminders' Today sections take a new reminder where you tap */
function DayPartRow({ part, onAdd }: { part: DayPart; onAdd?: (el: HTMLElement) => void }) {
  const { label, icon, band, glyph } = DAY_PARTS[part];
  return (
    <li aria-label={label} className="px-2.5 py-1.5" {...{ [PDF_KEEP]: "next" }}>
      <span className={`flex items-center gap-2 rounded-[10px] py-1.5 pl-3 ${onAdd ? "pr-1.5" : "pr-3"} ${band}`}>
        <Icon name={icon} size={15} className={`shrink-0 ${glyph}`} />
        <span className="min-w-0 flex-1 text-[15px] font-medium leading-snug text-ink">{label}</span>
        {onAdd && (
          <button
            type="button"
            aria-label={`Add a step to the ${label.toLowerCase()}`}
            onClick={(e) => onAdd(e.currentTarget)}
            className={`tap grid h-6 w-6 shrink-0 place-items-center rounded-full ${glyph} active:opacity-60`}
          >
            <Icon name="plus" size={16} />
          </button>
        )}
      </span>
    </li>
  );
}

/** rename a step label (or with no `to`, drop it) on every step of the trip
 *  that carries it; a rename onto a label a step already has merges the two */
function relabelSteps(days: DayT[], update: (t: "days", id: string, p: Partial<DayT>) => void, from: string, to?: string) {
  const same = (a: string, b: string) => a.toLocaleLowerCase() === b.toLocaleLowerCase();
  for (const d of days) {
    if (!d.plan?.some((p) => p.labels?.some((l) => same(l, from)))) continue;
    const plan = d.plan.map((p) => {
      if (!p.labels?.some((l) => same(l, from))) return p;
      const next: string[] = [];
      for (const l of p.labels) {
        const v = same(l, from) ? to : l;
        if (v && !next.some((x) => same(x, v))) next.push(v);
      }
      const { labels: _, ...rest } = p;
      return next.length ? { ...rest, labels: next } : rest;
    });
    update("days", d.id, { plan });
  }
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

function PlanRow({ day, tz, item, fresh, timeStart, place, areaPlaces, morePlaces, areaNameByPlaceId, categoryIcons, categoryColors, readOnly, onPatch, onRemove, onDuplicate, onAddBelow, onQuickAddCost, onShowOnMap }: {
  day: DayT;
  tz?: string;
  item: PlanItem;
  /** just added — open its text for typing */
  fresh?: boolean;
  /** where its time wheel starts while it has no time (see `timeBefore`) */
  timeStart?: string;
  place?: Place;
  areaPlaces: Place[];
  morePlaces: PlaceGroup[];
  areaNameByPlaceId: Map<string, string>;
  categoryIcons?: Record<string, string>;
  categoryColors?: Record<string, string>;
  readOnly: boolean;
  onPatch: (p: Partial<PlanItem>) => void;
  onRemove: () => void;
  onDuplicate: () => void;
  /** adds a new step right under this one (opens what it is first) */
  onAddBelow: (row: HTMLElement | null) => void;
  onQuickAddCost: (item: PlanItem) => void;
  onShowOnMap: (place: Place) => void;
}) {
  const rowRef = useRef<HTMLLIElement | null>(null);
  // a step with a clock time is placed by its time, not by hand
  const timed = startMinutes(item.time) !== undefined;
  // a pinned step's time is locked (a booking) until it's unpinned; it
  // still sits where that time puts it. With no time there's nothing to lock
  const pinned = !!item.pinned && !!item.time;
  const pinSheet = useActionSheet();
  // unpinned from the locked time's sheet: open the wheels straight away
  const [retime, setRetime] = useState(false);
  // spent once the wheels have opened (a child's mount effect runs first)
  useEffect(() => { if (retime && !item.pinned) setRetime(false); }, [retime, item.pinned]);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id, disabled: readOnly || timed });
  const updateEntity = useApp((s) => s.updateEntity);
  // an empty note stays out of the card until "Add a note" asks for it
  const [noteOpen, setNoteOpen] = useState(false);
  // while its text is being edited, a step with no note offers one right
  // under it, as Reminders does
  const [titleEditing, setTitleEditing] = useState(false);
  // the same, for the note in the step's place card
  const [cardNote, setCardNote] = useState(false);
  const mapHref = item.url ? gmapsLink(item.url) : placeMapLink(place);
  // a restaurant's guide page (Tabelog in Japan) — looked up as the step shows
  const reviewSite = place ? reviewSiteFor(place, categoryIcons) : undefined;
  // only the place's own menu page — the guide's menu tab is one tap from
  // its own button already
  const placeMenu = place?.facts?.menu;
  const website = place?.facts?.website;
  useAutoReviewLink(place, categoryIcons, !readOnly);
  // its "Good to know" (hours, reservations, queue…), behind a line under the step
  const tripData = useData();
  const area = place && placeArea(place, tripData);
  useAutoPlaceFacts(place, tripData, area, !readOnly);
  const factsFailure = useFactsFailure(place?.id ?? "");
  // the place card the step's icon opens; on desktop it hangs off the step
  const placeCard = useActionSheet();
  const placeCardAnchor = useRef<HTMLDivElement>(null);
  // the place's name itself — the desktop card's arrow points at it
  const nameRef = useRef<HTMLSpanElement>(null);
  const nearby = useStepNearby(item.id);
  // the card's Nearby group starts shut every time the card opens
  const [nearbyShown, setNearbyShown] = useState(false);
  const [cardWasOpen, setCardWasOpen] = useState(false);
  if (placeCard.open !== cardWasOpen) {
    setCardWasOpen(placeCard.open);
    if (placeCard.open) setNearbyShown(false);
  }
  // "Change place" on the card swaps the step's place from the same list a
  // custom step's icon opens
  const changePlace = useActionSheet();
  // wide screens draw the day's map beside the plan: opening a place's card
  // also flies that map to it, so the card needs no Map button there
  const { active: mapBeside } = useSplit();
  // the card's button row, as Maps lays it out: four equal buttons —
  // Google Maps, then the place's own pages and Show on Map, then More,
  // which takes whatever doesn't fit (and Add to Calendar). Five left two
  // labels wrapping on a phone.
  const slot = (["review", "menu", "website", "map", "share", "search"] as const).filter((k) =>
    k === "review" ? !!reviewSite : k === "menu" ? !!placeMenu : k === "website" ? !!website
      : k === "map" ? !mapBeside : k === "share" ? true : !website,
  ).slice(0, mapHref ? 2 : 3);
  const inRow = (k: (typeof slot)[number]) => slot.includes(k);
  const [copied, setCopied] = useState(false);
  const share = async () => {
    if (place && await sharePlace(place.name, mapHref || undefined)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };
  const openCard = place ? () => { placeCard.setOpen(true); if (mapBeside) onShowOnMap(place); } : undefined;
  // "Move to another day": off this day, onto the end of the picked one —
  // a timed step then sorts itself into place there, pin and all
  const moveSheet = useActionSheet();
  // the place card's More — every secondary action, as Maps keeps them
  const moreSheet = useActionSheet();
  const dayOpts = { weekday: "short", day: "numeric", month: "short" } as const;
  const tripDays = useMemo(
    () => [...(tripData?.days ?? [])].sort((a, b) => a.date.localeCompare(b.date)),
    [tripData?.days],
  );
  const moveTo = (target: DayT) => {
    moveSheet.setOpen(false);
    undoable(`Moved to ${fmtDate(target.date, tripData?.config.locale, dayOpts)}`, () => {
      onRemove();
      updateEntity<DayT>("days", target.id, { plan: [...(target.plan ?? []), { ...item }] });
    });
  };
  // what's switched on in More, said under the card's title so it isn't hidden
  const cardStatus = [item.optional && "Optional", pinned && "Time pinned", place?.overwhelming && "Overwhelming", ...(item.labels ?? [])]
    .filter(Boolean).join(" · ");
  // the step's own labels ("Remember to book"), picked from every label in
  // the trip in the labels sheet — red under the name, like Overwhelming
  const [labelsOpen, setLabelsOpen] = useState(false);
  const labels = item.labels ?? [];
  const usedLabels = useMemo(() => tripStepLabels(tripData?.days ?? []), [tripData?.days]);

  const toggleOptional = () => onPatch({ optional: item.optional ? undefined : true });
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
    const p = sortedPickable.find((x) => x.id === pid) ?? morePlaces.flatMap((g) => g.places).find((x) => x.id === pid);
    onPatch({ placeId: pid, text: p?.name ?? item.text });
  };

  const range = splitRange(item.time);
  const plainTime = !item.time || /^\d{1,2}:\d{2}$/.test(item.time);
  // a range stacks its start over its end in the time column
  // in the device's own clock format; a range stacks start over end
  const stacked = (t: string) => {
    const r = splitRange(t);
    return fmtClocksIn(r ? `${r[0]}\n${r[1]}` : t);
  };
  const hours = usePlaceHours(place, day.date);
  // the place's own hours that day, checked against when the step is
  // planned — a red line under the name only when they don't fit
  const stepTimes = range ?? (plainTime && item.time ? [item.time] : []);
  const clash = hours ? hoursConflict(hours, stepTimes[0], stepTimes[1]) : null;
  const conflict = clash && fmtClocksIn(clash);
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
      className={place || textGlyph ? "" : "opacity-70"}
    />
  );

  return (
    <li
      ref={(el) => { setNodeRef(el); rowRef.current = el; }}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`group relative ${isDragging ? "z-10 bg-surface opacity-80" : ""}`}
      // held on a touch screen, the whole row lifts (the grip is mouse-only)
      onTouchStart={readOnly || timed || pinned ? undefined : (listeners?.onTouchStart as React.TouchEventHandler | undefined)}
    >
      <SwipeToDelete undoLabel="Step removed" onDelete={readOnly ? undefined : onRemove}>
      <ContextMenu dismiss={isDragging}>
        <TimelineStop
          onTap={openCard}
          tapLabel={place ? `About ${place.name}` : undefined}
          time={
            readOnly ? (
              item.time && <span className="whitespace-pre-line">{stacked(item.time)}</span>
            ) : pinned ? (
              // locked: a tap says why and offers the way out, as iOS does
              // for a setting that's held by something else
              <>
                <button
                  ref={pinSheet.anchorRef}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); pinSheet.setOpen(true); }}
                  aria-label={`${fmtClocksIn(item.time)} — pinned`}
                  className="tap whitespace-pre-line text-right tabular-nums"
                >
                  {stacked(item.time ?? "")}
                </button>
                <ActionSheet open={pinSheet.open} onClose={() => pinSheet.setOpen(false)} anchorRef={pinSheet.anchorRef} title={`${fmtClocksIn(item.time)} is pinned. Unpin it to change the time.`}>
                  <button
                    type="button"
                    className="menu-item"
                    onClick={() => { pinSheet.setOpen(false); setRetime(plainTime); onPatch({ pinned: undefined }); }}
                  >
                    <Icon name="pushpin" size={16} /> Unpin and change time
                  </button>
                  <button type="button" className="menu-item" onClick={() => { pinSheet.setOpen(false); onPatch({ pinned: undefined }); }}>
                    <Icon name="pushpin" size={16} /> Unpin
                  </button>
                </ActionSheet>
              </>
            ) : plainTime ? (
              <Editable
                as="time"
                // a step just added from a place goes straight on to its time
                autoEdit={retime || (!!fresh && !!place)}
                label="Time"
                value={item.time ?? ""}
                onCommit={(v) => onPatch({ time: v || undefined })}
                timeStart={timeStart}
                className="tap"
                emptyContent={UNTIMED}
              />
            ) : range ? (
              // a range is two clock times, so each end opens its own wheel
              // (Calendar's Starts / Ends) instead of a text field squeezed
              // into the time column; clearing one end leaves the other. The
              // start's tap area grows up and the end's down, so the two
              // stacked times never steal each other's taps
              <span className="flex flex-col items-end">
                <Editable
                  as="time"
                  label="Start time"
                  value={range[0]}
                  onCommit={(v) => onPatch({ time: v ? `${v}–${range[1]}` : range[1] })}
                  className="-mt-3 block pt-3"
                />
                <Editable
                  as="time"
                  label="End time"
                  value={range[1]}
                  timeStart={range[0]}
                  onCommit={(v) => onPatch({ time: v ? `${range[0]}–${v}` : range[0] })}
                  className="-mb-3 block pb-3"
                />
              </span>
            ) : (
              // a loose time ("Around noon") is typed — there's no wheel for it
              <Editable
                label="Time"
                value={item.time ?? ""}
                placeholder="Add a time"
                format={stacked}
                onCommit={(v) => onPatch({ time: v.trim() || undefined })}
                className="w-full whitespace-pre-line text-right"
              />
            )
          }
          tile={
            // the icon is the step's "what": a tap swaps it for another of
            // the day's places (or links a custom step to one); the rest of
            // the row opens the place card
            !readOnly ? (
              <PlacePicker
                value={item.placeId}
                places={sortedPickable}
                more={morePlaces}
                areaNameByPlaceId={areaNameByPlaceId}
                categoryIcons={categoryIcons}
                categoryColors={categoryColors}
                onPick={pick}
                trigger={tile}
              />
            ) : (
              tile
            )
          }
          trailing={
            // pinned beside the name only, so the hours and note below run
            // the full width of the card
            <span className="absolute right-1.5 top-[7px] flex">
              {/* the step's menu opens on a hold (phone) or right-click
                  (desktop). A place step's tap opens its card, which holds
                  all of this, so it has no ⋯ at all; a custom step has no
                  card, so desktop shows its ⋯ on hover. Mounted either way
                  — the hold opens its items */}
              <span className={place ? "hidden" : "hover-reveal touch-hidden"}>
                <RowMenu label={`More for ${place?.name || item.text || "this step"}`}>
                  {mapHref && (
                    <a href={mapHref} target="_blank" rel="noopener" className="menu-item">
                      <Icon name="map" size={16} /> Open in Google Maps
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
                      <button type="button" className="menu-item" onClick={() => setLabelsOpen(true)}>
                        <Icon name="tag" size={16} /> {labels.length ? "Labels…" : "Add a label…"}
                      </button>
                      {!item.note && (
                        <button type="button" className="menu-item" onClick={() => { if (place) { setCardNote(true); placeCard.setOpen(true); } else setNoteOpen(true); }}>
                          <Icon name="pencil" size={16} /> Add a note
                        </button>
                      )}
                      {item.time && (
                        <button type="button" className="menu-item" onClick={() => onPatch({ pinned: pinned ? undefined : true })}>
                          <Icon name="pushpin" size={16} /> {pinned ? "Unpin this step" : "Pin this step"}
                        </button>
                      )}
                      <button type="button" className="menu-item" onClick={toggleOptional}>
                        <Icon name="optional" size={16} /> {item.optional ? "Make this a must" : "Mark as optional"}
                      </button>
                      <button type="button" className="menu-item" onClick={() => onAddBelow(rowRef.current)}>
                        <Icon name="plus" size={16} /> Add a step below
                      </button>
                      <button type="button" className="menu-item" onClick={onDuplicate}>
                        <Icon name="copy" size={16} /> Duplicate
                      </button>
                      {tripDays.length > 1 && (
                        <button type="button" className="menu-item" onClick={() => moveSheet.setOpen(true)}>
                          <Icon name="move" size={16} /> Move to another day
                        </button>
                      )}
                      <button type="button" className="menu-item" onClick={() => onQuickAddCost(item)}>
                        <Icon name="wallet" size={16} /> Add an expense
                      </button>
                      <ConfirmMenuItem onConfirm={() => undoable("Step removed", onRemove)} label="Remove" icon={<Icon name="close" size={16} />} />
                    </>
                  )}
                </RowMenu>
              </span>
              {/* a pinned step's time is locked, so the pin shows on every
                  width, like a pinned day on Plan */}
              {pinned && !readOnly ? (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); pinSheet.setOpen(true); }}
                  className="tap grid h-7 w-6 place-items-center text-ink-faint"
                  aria-label="Time pinned — unpin to change it"
                >
                  <Icon name="pushpin" size={14} />
                </button>
              ) : !readOnly && !timed && (
                <button
                  {...attributes}
                  onMouseDown={listeners?.onMouseDown as React.MouseEventHandler | undefined}
                  onKeyDown={listeners?.onKeyDown as React.KeyboardEventHandler | undefined}
                  className="hover-reveal tap grid h-7 w-6 [@media(hover:none)]:hidden cursor-grab touch-none place-items-center text-ink-faint active:cursor-grabbing"
                  aria-label="Drag to reorder"
                >
                  <Icon name="reorder" size={16} />
                </button>
              )}
            </span>
          }
        >
          {/* the name leads; under it only what changes the plan (closed
              that day, overwhelming) and the note in secondary grey, as
              Reminders sets a reminder's notes. The day's hours live on
              the place card, not repeated here. */}
          <div ref={placeCardAnchor} className="space-y-0.5">
            {/* the ⋯ / grip pinned top right only needs room on the name's
                first line: a place name wraps around a small float, so its
                later lines run the full width. A custom step's name is an
                `Editable` (a button, which can't wrap round a float), so it
                keeps a plain right padding. */}
            <div className={place ? "flow-root" : readOnly ? "[@media(hover:hover)]:pr-7" : "pr-6 [@media(hover:hover)]:pr-[3.25rem]"}>
            {place && (
              <span aria-hidden className={`float-right h-[23px] ${readOnly || (timed && !pinned) ? "w-0" : "w-6"}`} />
            )}
            {place ? (
              // the row's tap opens the place card, as tapping a result
              // does in Maps — the info, then where to go next
              <div className={STOP_TITLE}><span ref={nameRef} {...{ [PDF_HREF]: placeMapLink(place) }}>{place.name}</span></div>
            ) : readOnly ? (
              <span className={STOP_TITLE}>{item.text}</span>
            ) : (
              <Editable
                label="Step"
                value={item.text}
                placeholder="What is it?"
                autoEdit={fresh}
                onCommit={(v) => onPatch({ text: v })}
                // like a reminder left blank: a step with nothing else in it
                // goes away — undoably when it had a name, since clearing an
                // old step's text is easy to do by mistake. One with a time,
                // place or note, or left by a tap elsewhere on its own row
                // (its pin, time or ⋯), just loses its text
                onBlank={(onRow) => (item.time || item.placeId || item.note || onRow
                  ? item.text && onPatch({ text: "" })
                  : item.text ? undoable("Step removed", onRemove) : onRemove())}
                onEditingChange={setTitleEditing}
                className={STOP_TITLE}
              />
            )}
            </div>
            {/* a tinted tag, as Mail tints a category: easy to spot down a
                day, ochre rather than red — information, not a warning */}
            {item.optional && (
              <span className="mt-1 inline-flex w-fit items-center gap-1 rounded-[6px] bg-gold/15 px-1.5 py-0.5 text-xs font-medium text-gold">
                <Icon name="optional" size={12} />Optional
              </span>
            )}
            {(conflict || place?.overwhelming || labels.length > 0) && (
              <span className="block break-words text-xs text-danger">
                {[
                  conflict,
                  place?.overwhelming && (
                    <span key="ow" className="whitespace-nowrap">
                      <Icon name="alert" size={12} className="inline-block align-[-1px]" /> Overwhelming
                    </span>
                  ),
                  ...labels.map((l) => (
                    <span key={l}>
                      <Icon name="tag" size={12} className="inline-block align-[-1px]" /> {l}
                    </span>
                  )),
                ].filter(Boolean).map((n, i) => <Fragment key={i}>{i > 0 && " · "}{n}</Fragment>)}
              </span>
            )}
            {place ? (
              // shown, not edited, on a place's row — its tap opens the
              // card, where the note is edited
              item.note && <Markdown text={item.note} className={PLACE_ROW_NOTE} />
            ) : !readOnly && !item.note && !noteOpen && titleEditing ? (
              // keeps the title's focus on the way down, so the line is
              // still here for the tap to land on
              <button
                type="button"
                onPointerDown={(e) => e.preventDefault()}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setNoteOpen(true)}
                className="tap mt-0.5 block text-left text-xs leading-snug text-ink-faint"
              >
                Add a note
              </button>
            ) : (readOnly || item.note || noteOpen) && (
              <RichNote
                value={item.note ?? ""}
                onCommit={(v) => onPatch({ note: v || undefined })}
                placeholder="Add a note…"
                className="mt-0.5 block text-xs leading-snug text-ink-faint [&_p]:leading-snug [&_strong]:font-medium [&_strong]:text-ink-soft"
                collapsible
                autoEdit={noteOpen}
                onEditEnd={() => setNoteOpen(false)}
              />
            )}
            {place && (
              <ActionSheet
                open={placeCard.open}
                onClose={() => placeCard.setOpen(false)}
                anchorRef={nameRef}
                doneLabel={null}
                side
                // laid out like a Maps place card: the name as the title, a
                // clash with its hours under it, ✕ to close, then the
                // button row — the place's own pages (Google Maps is the
                // row's long-press and More, and the map beside the plan
                // already shows where it is)
                header={
                  <div className="space-y-3 md:w-[20rem]">
                    <div className="flex items-start gap-3 pl-1">
                      <div className="min-w-0 flex-1">
                        <h2 className="subhead break-words">{place.name}</h2>
                        {/* only a clash with the plan up here; the hours
                            themselves are in Good to know below */}
                        {conflict && <p className="mt-0.5 break-words text-xs text-danger">{conflict}</p>}
                        {cardStatus && <p className="mt-0.5 break-words text-xs text-ink-faint">{cardStatus}</p>}
                      </div>
                      <button
                        type="button"
                        onClick={() => placeCard.setOpen(false)}
                        className="tap grid h-[30px] w-[30px] shrink-0 place-items-center rounded-full bg-ink/[0.08] text-ink-soft"
                        aria-label="Close"
                      >
                        <Icon name="close" size={13} />
                      </button>
                    </div>
                    {/* Google Maps leads, filled, as Maps leads with Directions;
                        then the place's own pages, Show on Map and More */}
                    <PlaceActions>
                      {mapHref && <PlaceAction href={mapHref} icon="map" label="Google Maps" primary />}
                      {inRow("review") && reviewSite && <PlaceAction href={reviewHref(reviewSite, place)} icon="link" label={place.reviewUrl ? reviewSite.label : `Search ${reviewSite.label}`} />}
                      {inRow("menu") && placeMenu && <PlaceAction href={placeMenu} icon="menu" label="Menu" />}
                      {inRow("website") && website && <PlaceAction href={website} icon="globe" label="Website" />}
                      {inRow("map") && <PlaceAction icon="locate" label="Show on Map" onClick={() => { placeCard.setOpen(false); onShowOnMap(place); }} />}
                      {inRow("share") && <PlaceAction icon="share" label={copied ? "Copied" : "Share"} onClick={() => void share()} />}
                      {inRow("search") && <PlaceAction href={webSearchHref(place.name, area)} icon="search" label="Search Web" />}
                      <PlaceAction icon="more" label="More" menu buttonRef={moreSheet.anchorRef} onClick={() => moreSheet.setOpen(true)} />
                    </PlaceActions>
                    <ActionSheet open={moreSheet.open} onClose={() => moreSheet.setOpen(false)} anchorRef={moreSheet.anchorRef}>
                      {!inRow("review") && reviewSite && (
                        <a href={reviewHref(reviewSite, place)} target="_blank" rel="noopener" className="menu-item">
                          <Icon name="link" size={16} /> {place.reviewUrl ? reviewSite.label : `Search ${reviewSite.label}`}
                        </a>
                      )}
                      {!inRow("menu") && placeMenu && (
                        <a href={placeMenu} target="_blank" rel="noopener" className="menu-item">
                          <Icon name="menu" size={16} /> Menu
                        </a>
                      )}
                      {!inRow("website") && website && (
                        <a href={website} target="_blank" rel="noopener" className="menu-item">
                          <Icon name="globe" size={16} /> Website
                        </a>
                      )}
                      {!mapBeside && !inRow("map") && (
                        <button type="button" className="menu-item" onClick={() => { placeCard.setOpen(false); onShowOnMap(place); }}>
                          <Icon name="locate" size={16} /> Show on Map
                        </button>
                      )}
                      {!inRow("share") && (
                        <button type="button" className="menu-item" onClick={() => void share()}>
                          <Icon name="share" size={16} /> {copied ? "Copied" : "Share"}
                        </button>
                      )}
                      {!inRow("search") && !website && (
                        <a href={webSearchHref(place.name, area)} target="_blank" rel="noopener" className="menu-item">
                          <Icon name="search" size={16} /> Search Web
                        </a>
                      )}
                      <button type="button" className="menu-item" onClick={addToGoogleCalendar}>
                        <Icon name="calendar" size={16} /> Add to Calendar
                      </button>
                      {!readOnly && <>
                        <div className="my-1 h-px bg-ink/10" />
                        <MenuCheck checked={!!item.optional} onClick={toggleOptional}>Optional</MenuCheck>
                        {item.time && (
                          <MenuCheck checked={pinned} onClick={() => onPatch({ pinned: pinned ? undefined : true })}>Pin Time</MenuCheck>
                        )}
                        <MenuCheck checked={!!place.overwhelming} onClick={toggleOverwhelming}>Overwhelming</MenuCheck>
                        <button type="button" className="menu-item" onClick={() => { placeCard.setOpen(false); setLabelsOpen(true); }}>
                          <Icon name="tag" size={16} /> {labels.length ? "Labels…" : "Add a Label…"}
                        </button>
                        <div className="my-1 h-px bg-ink/10" />
                        <button type="button" className="menu-item" onClick={() => { placeCard.setOpen(false); changePlace.setOpen(true); }}>
                          <Icon name="pin" size={16} /> Change Place
                        </button>
                        <button type="button" className="menu-item" onClick={() => { placeCard.setOpen(false); onQuickAddCost(item); }}>
                          <Icon name="wallet" size={16} /> Add an Expense
                        </button>
                        <button type="button" className="menu-item" onClick={() => { placeCard.setOpen(false); onAddBelow(rowRef.current); }}>
                          <Icon name="plus" size={16} /> Add Step Below
                        </button>
                        <button type="button" className="menu-item" onClick={() => { placeCard.setOpen(false); onDuplicate(); }}>
                          <Icon name="copy" size={16} /> Duplicate
                        </button>
                        {tripDays.length > 1 && (
                          <button type="button" className="menu-item" onClick={() => { placeCard.setOpen(false); moveSheet.setOpen(true); }}>
                            <Icon name="move" size={16} /> Move to Another Day
                          </button>
                        )}
                        <div className="my-1 h-px bg-ink/10" />
                        <button type="button" className="menu-item text-danger" onClick={() => { placeCard.setOpen(false); undoable("Step removed", onRemove); }}>
                          <Icon name="close" size={16} /> Remove Step
                        </button>
                      </>}
                    </ActionSheet>
                  </div>
                }
              >
                {/* then, as a Maps place card runs: your note, what's good to
                    know, and last the things you do to the step itself */}
                <div onClick={(e) => e.stopPropagation()} className="space-y-4 px-3 pb-3 md:w-[21.5rem]">
                  {(item.note || cardNote || !readOnly) && (
                    <div>
                      <p className="kicker px-4 pb-1.5 pt-1">Note</p>
                      {item.note || cardNote ? (
                        <div className="rounded-[12px] bg-surface px-3.5 py-3">
                          <RichNote
                            value={item.note ?? ""}
                            onCommit={(v) => onPatch({ note: v || undefined })}
                            placeholder="Add a note…"
                            className="note"
                            autoEdit={cardNote}
                            onEditEnd={() => setCardNote(false)}
                          />
                        </div>
                      ) : (
                        <ul className="overflow-hidden rounded-[12px] bg-surface">
                          <ActionRow icon="pencil" label="Add a note" onClick={() => setCardNote(true)} />
                        </ul>
                      )}
                    </div>
                  )}
                  {/* shown with nothing found too, so it can be filled in by hand */}
                  {/* Website / Menu are buttons up top, so they don't count here */}
                  {(FACT_ROWS.some(([k]) => factValue(place.facts, k)) || factsFailure || !readOnly) && wantsFacts(place, tripData) && (
                    <div>
                      <div className="flex items-center gap-2 px-4 pb-1.5 pt-1">
                        <p className="kicker min-w-0 flex-1">Good to know</p>
                        <FactsRefresh place={place} area={area} />
                      </div>
                      <ul className="overflow-hidden rounded-[12px] bg-surface">
                        <PlaceFactRows place={place} links={false} />
                      </ul>
                    </div>
                  )}
                  {/* what else is close by — the same short list the day's
                      Nearby section shows under this stop */}
                  {nearby.group && (
                    <div>
                      <button
                        type="button"
                        onClick={() => setNearbyShown((v) => !v)}
                        aria-expanded={nearbyShown}
                        className="kicker flex w-full items-center gap-1.5 px-4 pb-1.5 pt-1 text-left"
                      >
                        <Icon name="chevron" size={13} className={`shrink-0 text-ink-faint transition-transform ${nearbyShown ? "rotate-90" : ""}`} />
                        <span className="min-w-0 flex-1">Nearby</span>
                        {!nearbyShown && <span className="shrink-0 normal-case text-ink-faint">{nearby.group.items.length}</span>}
                      </button>
                      <div className={`grid transition-[grid-template-rows] duration-300 ease-paper ${nearbyShown ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                      <div className="min-h-0 overflow-hidden">
                      <ul className="overflow-hidden rounded-[12px] bg-surface">
                        {nearby.group.items.map((n, i) => (
                          <NearbyRow
                            key={n.place.id}
                            item={n}
                            group={nearby.group!}
                            locale={tripData?.config.locale}
                            categoryIcons={categoryIcons}
                            categoryColors={categoryColors}
                            readOnly={readOnly}
                            divider={i < nearby.group!.items.length - 1}
                            onOpen={() => { placeCard.setOpen(false); nearby.open?.({ item: n, group: nearby.group!, anchor: placeCardAnchor.current }); }}
                            onAdd={() => nearby.add?.(nearby.group!, n.place)}
                          />
                        ))}
                      </ul>
                      </div>
                      </div>
                    </div>
                  )}
                </div>
              </ActionSheet>
            )}
            {!readOnly && (
              <ActionSheet open={moveSheet.open} onClose={() => moveSheet.setOpen(false)} anchorRef={placeCardAnchor} title="Move to">
                {tripDays.map((d) => {
                  const here = d.id === day.id;
                  const city = tripData?.legs.find((l) => l.id === d.legId)?.base;
                  const sub = [d.title, city].filter(Boolean).join(" · ");
                  return (
                    <button key={d.id} type="button" className="menu-item" aria-current={here || undefined} onClick={() => (here ? moveSheet.setOpen(false) : moveTo(d))}>
                      <span className="min-w-0 flex-1">
                        <span className="block">{fmtDate(d.date, tripData?.config.locale, dayOpts)}</span>
                        {sub && <span className="block break-words text-[13px] leading-snug text-ink-faint">{sub}</span>}
                      </span>
                      {here && <Icon name="check" size={16} className="shrink-0 text-accent" />}
                    </button>
                  );
                })}
              </ActionSheet>
            )}
            {!readOnly && (
              <DayLabelsSheet
                open={labelsOpen}
                onClose={() => setLabelsOpen(false)}
                anchorRef={placeCardAnchor}
                labels={labels}
                used={usedLabels}
                onChange={(next) => onPatch({ labels: next.length ? next : undefined })}
                onRenameAll={(from, to) => undoable("Label renamed", () => relabelSteps(tripData?.days ?? [], updateEntity, from, to))}
                onDeleteAll={(f) => undoable("Label deleted", () => relabelSteps(tripData?.days ?? [], updateEntity, f))}
                scope="step"
                example="Remember to book"
              />
            )}
            {place && !readOnly && (
              <PlacePicker
                value={item.placeId}
                places={sortedPickable}
                more={morePlaces}
                areaNameByPlaceId={areaNameByPlaceId}
                categoryIcons={categoryIcons}
                categoryColors={categoryColors}
                onPick={(pid) => { changePlace.setOpen(false); pick(pid); }}
                sheet={changePlace}
                anchor={placeCardAnchor}
              />
            )}
          </div>
        </TimelineStop>
      </ContextMenu>
      </SwipeToDelete>
    </li>
  );
}

/** a timeline stop's type, the way Reminders sets a list: the stop itself in
 *  regular 17px primary ink — it leads by colour and size, not weight — and
 *  anything under it a clear step down in both (13px caption and note), in the
 *  secondary grey */
const STOP_TITLE = "block break-words text-[17px] leading-snug text-ink";
const PLACE_ROW_NOTE = "mt-0.5 block break-words text-xs leading-snug text-ink-faint [&_p]:leading-snug [&_strong]:font-medium [&_strong]:text-ink-soft";
const STOP_META = "block break-words text-xs text-ink-faint";

/** One stop on a day's timeline, the way Maps lays out a route: the time
 *  in its own column on the left, the stop's icon sitting on the rail that
 *  joins every stop (`.timeline` in index.css trims it to the first and
 *  last icon), then what it is. No hairlines — the rail does the joining. */
function TimelineStop({ time, tile, trailing, children, className = "pr-3.5", onTap, tapLabel }: {
  time?: React.ReactNode;
  tile?: React.ReactNode;
  trailing?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  /** the whole row is one target, as a row in Maps or Calendar is — its own
   *  controls (the time, the grip) keep their taps */
  onTap?: () => void;
  tapLabel?: string;
}) {
  if (!onTap) {
    return (
      <span className={`relative flex gap-2.5 pl-3.5 ${className}`}>
        <span className={`block ${TIME_COL} shrink-0 pb-2.5 pt-[13.5px] text-right text-xs tabular-nums text-ink-soft`}>{time}</span>
        <Rail>{tile && <span className="relative z-10 block pt-2.5">{tile}</span>}</Rail>
        <span className="block min-w-0 flex-1 pb-2.5 pl-0.5 pt-[11px]">{children}</span>
        {trailing}
      </span>
    );
  }
  const own = (e: React.SyntheticEvent) => {
    const t = e.target as HTMLElement;
    // a click from a sheet it opened reaches here through the React tree,
    // not the page — only taps on the row itself count
    if (!e.currentTarget.contains(t)) return false;
    const control = t.closest(ROW_OWN_CONTROLS);
    return !control || control === e.currentTarget;
  };
  return (
    <span
      role="button"
      tabIndex={0}
      aria-label={tapLabel}
      onClick={(e) => { if (own(e)) onTap(); }}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && e.target === e.currentTarget) { e.preventDefault(); onTap(); }
      }}
      className={`relative flex cursor-pointer gap-2.5 pl-3.5 transition-colors duration-150 active:bg-ink/[0.07] ${className}`}
    >
      <span className={`block ${TIME_COL} shrink-0 pb-2.5 pt-[13.5px] text-right text-xs tabular-nums text-ink-soft`}>{time}</span>
      <Rail>{tile && <span className="relative z-10 block pt-2.5">{tile}</span>}</Rail>
      <span className="block min-w-0 flex-1 pb-2.5 pl-0.5 pt-[11px]">{children}</span>
      {trailing}
    </span>
  );
}

/** what inside a tappable stop keeps its own tap */
const ROW_OWN_CONTROLS = "button, a, input, textarea, select, [role='button'], [contenteditable='true']";

/** the timeline's rail column — the line runs the row's full height */
function Rail({ children }: { children?: React.ReactNode }) {
  return (
    <span className="relative flex w-[22px] shrink-0 justify-center">
      <span aria-hidden className="rail-line absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 bg-line" />
      {children}
    </span>
  );
}

/** past this, a walk stops being the plan — the row points at the train (and
 *  Google Maps' own transit directions) instead of a walking route. */
const LONG_WALK_MIN = 30;
/** past this, the train is offered beside the walk — a 20-odd-minute walk is
 *  a real choice, so both show and either opens its own directions. */
const TRAIN_TOO_MIN = 15;
/** past this, two stops are a journey apart (a moving day, a stop left in
 *  another city): no walk and no guessed ride — a 100-hour walk or a
 *  13-hour "train" helps nobody; Google's own transit directions do */
const FAR_KM = 50;

/** `to`, unless it's too far from `from` to walk or guess a ride to */
function inReach<T extends { lat: number; lng: number }>(from: { lat: number; lng: number } | null | undefined, to: T | null | undefined): T | null {
  return from && to && haversineKm(from.lat, from.lng, to.lat, to.lng) <= FAR_KM ? to : null;
}

type TrainOption = { a: NearbyStation; b: NearbyStation; walkIn: number | null; ride: number; walkOut: number | null };

/** The train between the nearest station at each end: the walk to the first
 *  station, a rough ride time (`estimateTransit`) and the walk from the last.
 *  Null until both stations are found, or when they're the same station. */
function useTrainOption(from: { lat: number; lng: number } | null, to: { lat: number; lng: number } | null, enabled: boolean): TrainOption | null {
  const [stations, setStations] = useState<[NearbyStation | null, NearbyStation | null]>([null, null]);
  const on = enabled && !!from && !!to;
  useEffect(() => {
    setStations([null, null]);
    if (!on || !from || !to) return;
    let cancelled = false;
    void Promise.all([nearestStationLookup(from.lat, from.lng), nearestStationLookup(to.lat, to.lng)]).then((s) => {
      if (!cancelled) setStations(s);
    });
    return () => { cancelled = true; };
  }, [on, from?.lat, from?.lng, to?.lat, to?.lng]);
  const [a, b] = on ? stations : [null, null];
  const origin = from ?? { lat: 0, lng: 0 };
  const dest = to ?? { lat: 0, lng: 0 };
  const toA = useWalk(origin, from ? a : null);
  const fromB = useWalk(dest, to ? b : null);
  if (!a || !b || a.name === b.name) return null;
  return { a, b, walkIn: toA?.min ?? null, ride: estimateTransit(haversineKm(a.lat, a.lng, b.lat, b.lng)), walkOut: fromB?.min ?? null };
}

/** door to door by train: the walk in, the ride and the walk out */
function trainMinutes(t: TrainOption): number {
  return (t.walkIn ?? 0) + t.ride + (t.walkOut ?? 0);
}

/** the caption under a journey's plan row, hop by hop as Maps lays out a
 *  transit route: a Leave row has that ride's length, mode, carrier and
 *  service (and its platform); an Arrive where you change has the wait
 *  until the next one leaves; the last Arrive needs nothing, its time says it */
function journeyStopMeta(journey: Journey, stop: ReturnType<typeof journeyStops>[number]): (string | false | null | undefined)[] {
  const { seg, hop } = stop;
  if (stop.kind === "leave") {
    return [
      fmtDuration(seg.depart, seg.arrive, seg.fromTz, seg.toTz),
      MODE_LABEL[seg.mode], seg.carrier, seg.service,
      seg.platform && `Platform ${seg.platform}`,
    ];
  }
  const next = journey.segments[hop + 1];
  if (!next) return [];
  const wait = fmtDuration(seg.arrive, next.depart, seg.toTz, next.fromTz);
  return [wait ? `${wait} to change` : "Change here"];
}

/** One end of the day's journey as a plan row — "Leave Kyoto" at its first
 *  departure, "Arrive Kurama" at its last arrival. Read-only here; it opens
 *  the journey, where the times are edited. */
function JourneyStopRow({ journey, stop }: { journey: Journey; stop: ReturnType<typeof journeyStops>[number] }) {
  const { seg } = stop;
  const meta = journeyStopMeta(journey, stop);
  return (
    <li>
      <Link to={`/journey/${journey.id}`} className="block active:bg-ink/[0.07]">
        <TimelineStop
          className="pr-3"
          time={fmtClock(stop.time)}
          tile={<IconTile size="sm" name={MODE_ICON[seg.mode]} tone={MODE_TONE[seg.mode]} />}
          trailing={<Icon name="chevron" size={14} className="mt-[15px] shrink-0 text-ink-faint" />}
        >
          <span className={STOP_TITLE}>
            {stop.kind === "leave" ? "Leave" : "Arrive"} {stop.place || (stop.kind === "leave" ? "from start" : "at destination")}
          </span>
          {meta.some(Boolean) && <span className={`${STOP_META} mt-0.5`}>{meta.filter(Boolean).join(" · ")}</span>}
        </TimelineStop>
      </Link>
    </li>
  );
}

/** Calendar's red "now" line across today's timeline: the time in red in
 *  the time column, a dot on the rail, a hairline to the edge */
function NowLine({ now }: { now: string }) {
  return (
    <li aria-label={`Now, ${fmtClock(now)}`} className="relative flex h-4 items-center gap-2.5 pl-3.5 pr-3.5">
      <span className={`${TIME_COL} shrink-0 text-right text-[11px] font-medium leading-none tabular-nums text-danger`}>{fmtClock(now)}</span>
      {/* the grey rail runs on through it */}
      <Rail>
        <span className="relative z-10 my-auto h-2 w-2 rounded-full bg-danger" />
      </Rail>
      <span className="h-px flex-1 bg-danger" />
    </li>
  );
}

/** What's up next today, at the head of the plan — the next stop and when
 *  it starts, and when to leave for it: the walk there, or past a long walk
 *  the train (as the travel line under the stop before it works it out) */
function UpNext({ row, start, now, from, to }: {
  row: DayPdfRow;
  start?: string;
  now: string;
  from: { lat: number; lng: number } | null;
  to: { lat: number; lng: number } | null;
}) {
  const walk = useWalk(from ?? { lat: 0, lng: 0 }, inReach(from, to));
  const train = useTrainOption(from, to, !!walk && walk.min > LONG_WALK_MIN);
  const byTrain = !!walk && walk.min > LONG_WALK_MIN && !!train;
  const way = byTrain ? trainMinutes(train!) : walk?.min;
  const at = start && /^\d{1,2}:\d{2}/.test(start) ? start : undefined;
  const leave = leaveBy(at, way);
  const late = leave !== undefined && minutesUntil(leave, now) <= 0;
  // a train ride is always a guess; a walk only until its real route is in
  const guess = byTrain || walk?.estimated !== false;
  const how = way !== undefined && `${guess ? "≈\u00a0" : ""}${fmtMinutes(way)} ${byTrain ? "by train" : "walk"}`;
  return (
    <div className="mx-2.5 mb-1 mt-2.5 rounded-[10px] bg-accent/[0.08] px-3 py-2.5">
      <span className="kicker block text-accent">
        Up next{at && <> · {fmtIn(minutesUntil(at, now))}</>}
      </span>
      <span className={`${STOP_TITLE} mt-0.5`}>{row.time && <span className="tabular-nums text-ink-soft">{row.time} </span>}{row.title}</span>
      {leave ? (
        <span className={`block text-[15px] leading-snug ${late ? "text-danger" : "text-ink-soft"}`}>
          {late ? "Leave now" : `Leave by ${fmtClock(leave)}`} · {how}
        </span>
      ) : (
        row.meta && <span className="block text-[15px] leading-snug text-ink-soft">{row.meta}</span>
      )}
    </div>
  );
}

/** where a hotel row links to in the PDF: its own map link, else its address */
const hotelHref = (hotel: Hotel) => gmapsLink(hotel.mapUrl || hotel.address || hotel.name);

/** a journey's row as the PDF prints it — what `JourneyStopRow` shows */
function journeyPrint(stop: ReturnType<typeof journeyStops>[number] & { journey: Journey }): DayPdfRow {
  const { journey } = stop;
  const meta = journeyStopMeta(journey, stop);
  return {
    time: fmtClock(stop.time),
    title: `${stop.kind === "leave" ? "Leave" : "Arrive"} ${stop.place || (stop.kind === "leave" ? "from start" : "at destination")}`,
    meta: meta.filter(Boolean).join(" · ") || undefined,
    quiet: true,
  };
}

/** a hotel's coordinates — its own, else the ones in its map link */
function hotelCoords(hotel: Hotel): { lat: number; lng: number } | null {
  const linkCoords = mapUrlCoords(hotel.mapUrl);
  return hotel.lat !== undefined && hotel.lng !== undefined ? { lat: hotel.lat, lng: hotel.lng }
    : linkCoords ? { lat: linkCoords[0], lng: linkCoords[1] }
    : null;
}

/** The day's first stop: the hotel you woke up at, mirroring `ReturnToHotel`
 *  at the foot. Its time (when you leave) is set on the wheel like a step's,
 *  which opens on a suggestion: the first step's time less the way there
 *  (`leaveBy`); the way on sits under it, and its name opens the hotel's own
 *  page. */
function StartFromHotel({ hotel, to, firstTime, time, readOnly, onTime }: {
  hotel: Hotel;
  /** the first step's place, when the way there starts at the hotel */
  to?: Place;
  /** the first step's (start) time */
  firstTime?: string;
  time?: string;
  readOnly: boolean;
  onTime: (time: string | undefined) => void;
}) {
  // the same way TravelConnector shows: the walk, or past a long walk the
  // train (walk in, ride, walk out)
  const from = hotelCoords(hotel);
  const walk = useWalk(from ?? { lat: 0, lng: 0 }, inReach(from, to));
  const train = useTrainOption(from, to ?? null, !!walk && walk.min > LONG_WALK_MIN);
  const way = walk && walk.min > LONG_WALK_MIN && train
    ? trainMinutes(train)
    : walk?.min;
  const timeStart = leaveBy(firstTime, way);
  return (
    <li>
      <TimelineStop
        tile={<IconTile size="sm" glyph="hotel" tone="ink-faint" />}
        time={<HotelRowTime label="Leave at" time={time} timeStart={timeStart} readOnly={readOnly} onTime={onTime} />}
      >
        <Link to={`/hotel/${hotel.id}`} className={`${STOP_TITLE} active:opacity-60`}>
          From {hotel.name || "your stay"}
        </Link>
      </TimelineStop>
    </li>
  );
}

/** Wake up / Breakfast — fixed rows that open every day, each with its own
 *  time on the same wheel as a step's */
function MorningRow({ label, glyph, time, timeStart, readOnly, onTime }: {
  label: string;
  glyph: MapGlyphId;
  time?: string;
  timeStart?: string;
  readOnly: boolean;
  onTime: (time: string | undefined) => void;
}) {
  return (
    <li>
      <TimelineStop
        tile={<IconTile size="sm" glyph={glyph} tone={toneForGlyph(glyph)} />}
        time={<HotelRowTime label={label} time={time} timeStart={timeStart} readOnly={readOnly} onTime={onTime} />}
      >
        <span className={STOP_TITLE}>{label}</span>
      </TimelineStop>
    </li>
  );
}

/** when to leave to be at a step for its time: `minutes` before it, rounded
 *  down to 5 minutes as you'd plan it. Nothing without both. */
function leaveBy(time: string | undefined, minutes: number | undefined): string | undefined {
  const m = /^(\d{1,2}):(\d{2})$/.exec(time ?? "");
  if (!m || minutes == null) return undefined;
  const at = Math.max(0, Math.floor((+m[1] * 60 + +m[2] - minutes) / 5) * 5);
  return `${String(Math.floor(at / 60)).padStart(2, "0")}:${String(at % 60).padStart(2, "0")}`;
}

/** the time on a hotel row (leaving, back) — the same wheel as a step's */
function HotelRowTime({ label, time, timeStart, readOnly, onTime }: {
  label: string;
  time?: string;
  timeStart?: string;
  readOnly: boolean;
  onTime: (time: string | undefined) => void;
}) {
  if (readOnly) return <>{fmtClock(time)}</>;
  return (
    <Editable
      as="time"
      label={label}
      value={time ?? ""}
      onCommit={(v) => onTime(v || undefined)}
      timeStart={timeStart}
      className="tap"
      emptyContent={UNTIMED}
    />
  );
}

/** Back to the hotel you're staying at — the day's last stop, unless a step
 *  is timed later. The way there sits on the rail above it like any other
 *  travel (`TravelConnector`, drawn by the plan); its time is set on the wheel like a
 *  step's, and its name opens Google Maps directions (from wherever you are
 *  when the last step has no place). */
function ReturnToHotel({ from, hotel, time, timeStart, readOnly, onTime }: {
  from?: Place;
  hotel: Hotel;
  time?: string;
  timeStart?: string;
  readOnly: boolean;
  onTime: (time: string | undefined) => void;
}) {
  const to = hotelCoords(hotel);
  const walk = useWalk(from ?? { lat: 0, lng: 0 }, inReach(from, to));
  const long = !walk || walk.min > LONG_WALK_MIN;
  const dest = to ? `${to.lat},${to.lng}` : [hotel.name, hotel.address].filter(Boolean).join(" ");
  const href = gmapsRoute(from && `${from.lat},${from.lng}`, dest, long ? "transit" : "walking");
  return (
    <li>
      <TimelineStop
        tile={<IconTile size="sm" glyph="hotel" tone="ink-faint" />}
        time={<HotelRowTime label="Back at" time={time} timeStart={timeStart} readOnly={readOnly} onTime={onTime} />}
      >
        <a href={href} target="_blank" rel="noopener" aria-label={`Directions back to ${hotel.name || "your stay"}`} className={`${STOP_TITLE} active:opacity-60`}>
          Back to {hotel.name || "your stay"}
        </a>
      </TimelineStop>
    </li>
  );
}

/** The way from one step to the next, as a slim row between them — the
 *  Calendar "travel time" idiom: travel is between two things you do, not
 *  part of either. The walk all the way is always there; past
 *  `TRAIN_TOO_MIN` the train (`useTrainOption`) gets a line under it, read
 *  like an Apple Maps transit summary: walk to the station › ride › walk
 *  from the station. Each line opens its own Google Maps directions
 *  — the real route with lines and changes is Google's to work out (no free
 *  keyless transit API). Stations come from OpenStreetMap (`transitStation.ts`). */
/** closer than this, two stops count as one place — no travel row */
const SAME_SPOT_KM = 0.05;

function TravelConnector({ from, to }: { from: { lat: number; lng: number }; to: { lat: number; lng: number } }) {
  const near = inReach(from, to);
  const walk = useWalk(from, near);
  const train = useTrainOption(from, to, !!near && (!walk || walk.min > TRAIN_TOO_MIN));
  // two stops at the same spot (breakfast at the hotel) have no way between
  if (haversineKm(from.lat, from.lng, to.lat, to.lng) < SAME_SPOT_KM) return null;

  // plain quiet text, no fill — as Calendar sets travel time — a shade
  // fainter than a step's note (iOS's tertiary grey under the secondary), so
  // name, note and travel read as three levels; a filled chip outweighed them
  // no `.tap` here: its 44pt reach ran up into the stop above, so a tap on
  // the stop could land on directions instead. `relative` keeps it painted
  // over the stop it's tucked under
  const pill = "relative inline-flex min-w-0 max-w-full items-center gap-1 text-[0.75rem] leading-snug text-ink-faint/70 tabular-nums transition-opacity active:opacity-50";
  const trainTitle = train ? `Train from ${train.a.name} to ${train.b.name}` : "Transit directions";
  const long = !walk || walk.min > LONG_WALK_MIN;
  // a chevron between legs, as Maps strings a transit route together
  const leg = <Icon name="chevron" size={10} className="mx-0.5 inline-block shrink-0 align-[-1px] opacity-70" />;
  return (
    // tucked up under the stop it leaves from, as Calendar hangs travel time
    // off an event — the room goes after it, before the next stop
    <li className="-mt-1.5 flex gap-2.5 pl-3.5 pr-3.5" {...{ [PDF_KEEP]: "prev" }}>
      <span className={`${TIME_COL} shrink-0`} />
      <Rail />
      <span className="flex min-w-0 flex-1 flex-col items-start gap-0.5 pb-2.5 pl-0.5">
        {walk && (
          <a
            href={gmapsRoute(`${from.lat},${from.lng}`, `${to.lat},${to.lng}`, "walking")}
            target="_blank"
            rel="noopener"
            title={`Walk ${fmtWalk(walk)}`}
            aria-label={`Walk ${fmtWalk(walk)}`}
            className={pill}
          >
            <Icon name="walk" size={12} className="shrink-0" />
            {walk.estimated !== false && "≈\u00a0"}{fmtMinutes(walk.min)} · {fmtDistanceKm(walk.km)}
          </a>
        )}
        {(long || train) && (
          <a
            href={gmapsRoute(`${from.lat},${from.lng}`, `${to.lat},${to.lng}`, "transit")}
            target="_blank"
            rel="noopener"
            title={trainTitle}
            aria-label={trainTitle}
            className={pill}
          >
            {train ? (
              // a line breaks between legs, never inside a station name
              // ("Omote-sando") or before its minutes
              // door to door first, as Maps heads a transit route with its
              // total — a trailing walk's minutes read as the trip's otherwise
              <span className="min-w-0 break-words">
                <span className="whitespace-nowrap">
                  {/* the ride itself is always a guess — no free source has the timetable */}
                  <Icon name="train" size={12} className="inline-block align-[-2px]" /> ≈&nbsp;{fmtMinutes(trainMinutes(train))} ·
                </span>{" "}
                {train.walkIn != null && (
                  <span className="whitespace-nowrap">
                    <Icon name="walk" size={12} className="inline-block align-[-2px]" /> {fmtMinutes(train.walkIn)}{leg}
                  </span>
                )}
                <span className="whitespace-nowrap">{train.a.name} →</span>{" "}
                <span className="whitespace-nowrap">{train.b.name}</span>
                {train.walkOut != null && (
                  <span className="whitespace-nowrap">
                    {leg}<Icon name="walk" size={12} className="inline-block align-[-2px]" /> {fmtMinutes(train.walkOut)}
                  </span>
                )}
              </span>
            ) : (
              <><Icon name="train" size={12} className="shrink-0" /> By train</>
            )}
          </a>
        )}
      </span>
    </li>
  );
}

/** the plan step's "what" picker, opened from its icon — a native `<select>` can't style part of an
 *  option's text, so once a day has more than 2 Areas (see `areaNameByPlaceId`
 *  in `Day`) and a place name alone stops being enough to tell rows apart, this
 *  renders as an iOS-style sheet list instead, with the area as trailing quiet
 *  text on the same line (same idiom as a place's category in Manage). */
type PlaceGroup = { label: string; places: Place[] };

function PlacePicker({ value, adding, places, more = [], title = "What this step is", areaNameByPlaceId, categoryIcons, categoryColors, onPick, trigger, sheet, anchor }: {
  value?: string;
  /** picking for a new step — nothing to tick yet */
  adding?: boolean;
  /** the day's own area places — first, with no heading */
  places: Place[];
  /** then the rest of the trip's places, in groups ("In Tokyo", "Elsewhere") */
  more?: PlaceGroup[];
  title?: string;
  areaNameByPlaceId: Map<string, string>;
  categoryIcons?: Record<string, string>;
  categoryColors?: Record<string, string>;
  onPick: (id?: string) => void;
  /** what opens it — a custom step's icon tile. Without one it's opened
   *  from elsewhere (a place card's "Change place", the day's ＋) through `sheet` */
  trigger?: React.ReactNode;
  sheet?: ReturnType<typeof useActionSheet>;
  /** where its desktop popover hangs when there's no trigger */
  anchor?: React.RefObject<HTMLElement>;
}) {
  const own = useActionSheet();
  const { open, setOpen, anchorRef } = sheet ?? own;
  const [query, setQuery] = useState("");
  useEffect(() => { if (!open) setQuery(""); }, [open]);
  const fold = (t: string) => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const q = fold(query.trim());
  const match = (p: Place) => !q || fold(p.name).includes(q);
  // a place already in the first group isn't listed again under its city
  const first = new Set(places.map((p) => p.id));
  const groups = [{ label: "", places }, ...more.map((g) => ({ ...g, places: g.places.filter((p) => !first.has(p.id)) }))]
    .map((g) => ({ ...g, places: g.places.filter(match) }))
    .filter((g) => g.places.length);
  const total = places.length + more.reduce((n, g) => n + g.places.length, 0);
  const row = (p: Place) => {
    const areaName = areaNameByPlaceId.get(p.id);
    const on = p.id === value;
    const glyph = p.category ? categoryIcons?.[p.category] : undefined;
    return (
      <button key={p.id} type="button" onClick={() => onPick(p.id)} className="menu-item flex w-full items-center gap-2">
        {!adding && <Icon name="check" size={13} className={`shrink-0 ${on ? "text-accent" : "invisible"}`} />}
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
  };
  return (
    <>
      {trigger && (
        <button
          ref={anchorRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-label={value ? "Change the place" : "Link this step to a place"}
          aria-haspopup="menu"
          className="tap relative shrink-0"
        >
          {trigger}
        </button>
      )}
      <ActionSheet
        open={open}
        onClose={() => setOpen(false)}
        anchorRef={trigger ? anchorRef : anchor ?? anchorRef}
        title={title}
        header={total > 8 ? <SearchField value={query} onChange={setQuery} placeholder="Search places" /> : undefined}
      >
        <div className="md:w-[20rem]">
          {!q && (
            <button type="button" onClick={() => onPick(undefined)} className="menu-item flex w-full items-center gap-2">
              {!adding && <Icon name="check" size={13} className={`shrink-0 ${!value ? "text-accent" : "invisible"}`} />}
              <IconTile size="sm" name="pencil" tone="ink-faint" className="opacity-70" />
              <span className="min-w-0 flex-1 break-words">Custom…</span>
            </button>
          )}
          {groups.map((g) => (
            <div key={g.label || "day"}>
              {g.label && <p className="kicker px-4 pb-0.5 pt-3 text-ink-faint">{g.label}</p>}
              {g.places.map(row)}
            </div>
          ))}
          {q && !groups.length && <p className="meta px-4 pb-4 pt-2 text-center">No place matches &ldquo;{query.trim()}&rdquo;</p>}
        </div>
      </ActionSheet>
    </>
  );
}

/** a spend row's category as its grey caption (Wallet's second line) — tap
 *  it for the list to change it, the current one ticked */
function CategoryCaption({ value, categories, onChange }: {
  value?: string;
  categories: ExpenseCategory[];
  onChange: (id: string | undefined) => void;
}) {
  const sheet = useActionSheet();
  const current = categories.find((c) => c.id === value);
  return (
    <>
      <button
        ref={sheet.anchorRef}
        type="button"
        onClick={() => sheet.setOpen(true)}
        aria-haspopup="menu"
        aria-label={`Category: ${current?.label ?? "none"}`}
        className="meta tap mt-0.5 block break-words text-left"
      >
        {current?.label ?? "Add a category"}
      </button>
      <ActionSheet open={sheet.open} onClose={() => sheet.setOpen(false)} anchorRef={sheet.anchorRef} title="Category">
        {categories.map((cat) => (
          <button key={cat.id} type="button" className="menu-item" onClick={() => { onChange(cat.id); sheet.setOpen(false); }}>
            <Icon name="check" size={14} className={`shrink-0 text-accent ${cat.id === value ? "" : "invisible"}`} />
            {cat.label}
          </button>
        ))}
        {value && (
          <button type="button" className="menu-item" onClick={() => { onChange(undefined); sheet.setOpen(false); }}>
            <Icon name="check" size={14} className="invisible shrink-0" />
            No category
          </button>
        )}
      </ActionSheet>
    </>
  );
}

/** a plan step offered under "Add an amount", with the category its icon
 *  suggests */
type SpendChoice = { label: string; categoryId?: string };

/** A spend logged in two taps, as Wallet takes a payment: the keypad first,
 *  in the currency last spent in (else the trip's second, the local one,
 *  with what it comes to at home under it), then which category it was.
 *  Skipping the category still keeps the amount; what it was can be named
 *  later on its row in Spending. */
function QuickSpend({ open, onClose, anchorRef, currencies, defaultCurrency, categories, onAdd }: {
  open: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement>;
  currencies: string[];
  defaultCurrency?: string;
  categories: ExpenseCategory[];
  onAdd: (cost: Omit<DayCost, "id">) => void;
}) {
  const primary = currencies[0] ?? "";
  const start = defaultCurrency && currencies.includes(defaultCurrency) ? defaultCurrency : currencies[1] ?? primary;
  const [currency, setCurrency] = useState(start);
  const [picking, setPicking] = useState(false);
  // the keypad commits, then closes — read the amount through a ref so the
  // close sees what was just committed
  const amount = useRef("");
  // a tapped category closes the sheet too, and closing it means "skip" —
  // the spend is added once, by whichever comes first
  const added = useRef(false);
  useEffect(() => {
    if (!open) return;
    amount.current = "";
    added.current = false;
    setCurrency(start);
    setPicking(false);
  }, [open]);
  const add = (categoryId?: string) => {
    if (added.current) return;
    added.current = true;
    onAdd({
      label: "",
      amount: amount.current,
      ...(categoryId && { categoryId }),
      ...(currency && currency !== primary && { currency }),
    });
    onClose();
  };
  return (
    <>
      <AmountSheet
        open={open && !picking}
        onClose={() => {
          if (!amount.current) onClose();
          else if (categories.length) setPicking(true);
          else add();
        }}
        anchorRef={anchorRef}
        label="Spent today"
        amount=""
        currency={currency}
        currencies={currencies.length >= 2 ? currencies : []}
        onCommit={(a) => { amount.current = a; }}
        onCurrency={setCurrency}
        home={currencies.length >= 2 ? primary : undefined}
      />
      <ActionSheet open={open && picking} onClose={() => add()} anchorRef={anchorRef} title={`${fmtFare(amount.current, currency || primary)} — what for?`} doneLabel="Skip">
        {categories.map((cat, i) => {
          const tile = expenseCategoryIcon(cat, i);
          return (
            <button key={cat.id} type="button" className="menu-item" onClick={() => add(cat.id)}>
              <IconTile size="sm" name={tile.name} glyph={tile.glyph} tone={tile.tone} color={tile.color} className="shrink-0" />
              {cat.label}
            </button>
          );
        })}
      </ActionSheet>
    </>
  );
}

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
<CategoryCaption
                      value={known ? c.categoryId : undefined}
                      categories={categories}
                      onChange={(id) => setAt(i, { categoryId: id })}
                    />
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
        <span className="value flex-1 font-medium">Total spent</span>
        <span className="value flex flex-wrap justify-end gap-x-1.5 font-medium tabular-nums">
          {subtotals.size > 0
            ? [...subtotals].map(([cur, amt], i) => <span key={cur || "—"} className="whitespace-nowrap">{i > 0 && "+ "}{fmtMoney(amt, cur)}</span>)
            : "—"}
        </span>
        {/* holds the slot of the rows' ✕ (pointer devices only), so the
            total lines up under their amounts */}
        {!readOnly && <span aria-hidden className="-ml-1 w-[21px] shrink-0 [@media(hover:none)_and_(pointer:coarse)]:hidden" />}
      </li>
      {!readOnly && <li>{addButton("action w-full px-3.5 py-2.5 text-xs transition-colors duration-150 active:bg-ink/[0.07] active:opacity-100", 14)}</li>}
    </ul>
  );
}

/** an on/off item in a menu — iOS menus mark the one that's on with a
 *  leading checkmark instead of a switch */
function MenuCheck({ checked, onClick, children }: { checked: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" role="menuitemcheckbox" aria-checked={checked} className="menu-item" onClick={onClick}>
      <span className="grid w-4 shrink-0 place-items-center">{checked && <Icon name="check" size={16} />}</span>
      {children}
    </button>
  );
}
