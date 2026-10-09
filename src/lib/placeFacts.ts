import { useEffect, useState } from "react";
import type { Place, PlaceFacts, TripData } from "@/core/types";
import { useApp } from "@/store/useApp";
import { todayISO } from "./dates";
import { isFoodPlace } from "./reviewSite";
import { glyphForCategoryName, glyphGroup } from "./mapGlyphs";
import { haversineKm } from "./geo";
import { apiGet } from "./api";
import { osmLinks } from "./placeWebsite";
import { nearestOpeningHours } from "./placeHours";
import { factsHoursForDate, hoursForDate, onlyClosedDays, osmHoursOn } from "./openingHours";
import { dayTripCities, placeCityMap, placeLegMap, type TripCity } from "./cityAssign";

/** the facts in the order they're shown, with their labels */
export const FACT_ROWS = [
  ["knownFor", "Known for"],
  ["hours", "Hours"],
  ["closed", "Closed"],
  ["reservations", "Reservations"],
  ["queue", "Queue"],
  ["price", "Price"],
] as const satisfies readonly (readonly [keyof PlaceFacts, string])[];

export type FactKey = (typeof FACT_ROWS)[number][0];

/** a fact as shown: one typed in by hand wins over the lookup's */
export const factValue = (f: PlaceFacts | undefined, k: FactKey): string | undefined =>
  (f?.edited && k in f.edited ? f.edited[k] : f?.[k]) || undefined;

/** a sight's labels for the slots that mean something else there */
const SIGHT_LABELS: Partial<Record<keyof PlaceFacts, string>> = { reservations: "Tickets", queue: "Crowds", price: "Entry" };

/** the rows to show for a set of facts, labelled for what they were asked as */
export const factRows = (f: PlaceFacts) =>
  FACT_ROWS.map(([k, label]) => [k, (f.kind === "sight" && SIGHT_LABELS[k]) || label] as const);

/** what a place is looked up as: somewhere to eat, else a sight */
export const kindOf = (p: Place, categoryIcons?: Record<string, string>): "food" | "sight" =>
  isFoodPlace(p, categoryIcons) ? "food" : "sight";

/** lower case without accents or spacing — "Hamamatsuchō" and "hamamatsucho" match */
const fold = (s: string) => s.normalize("NFKD").replace(/[\u0300-\u036f\s-]/g, "").toLowerCase();

/** somewhere you sleep or pass through rather than visit — one of the trip's
 *  own stays (by name or pin), or a place filed as lodging (a hot spring
 *  aside) or transport */
export function notASight(p: Place, data: TripData): boolean {
  const glyph = p.category ? data.config.categoryIcons?.[p.category] || glyphForCategoryName(p.category) : undefined;
  const group = glyphGroup(glyph);
  if ((group === "Lodging" && glyph !== "bath") || group === "Transport") return true;
  return data.hotels.some((h) =>
    (h.name && fold(h.name) === fold(p.name)) ||
    (h.lat != null && h.lng != null && haversineKm(h.lat, h.lng, p.lat, p.lng) < 0.1));
}

/** whether a place gets a "Good to know": somewhere to eat anywhere on the
 *  trip, and any other place that's on a day's plan, bar the hotel */
export const wantsFacts = (p: Place, data: TripData | null) =>
  isFoodPlace(p, data?.config.categoryIcons) ||
  (!!data?.days.some((d) => d.plan?.some((i) => i.placeId === p.id)) && !notASight(p, data));

/** older than this, a place's facts are looked up again when it's shown —
 *  hours and closed days change */
const STALE_DAYS = 30;

/** bumped when the lookup learns something new, so places checked before
 *  are asked again — 4 added the place's website, 5 the one the summary
 *  names as official, 6 hours from OpenStreetMap and only what two
 *  searches agree on, 7 never a neighbour's OpenStreetMap hours (asked
 *  again only where the hours came from it) */
const FACTS_VERSION = 7;

export const hasFacts = (f: PlaceFacts | undefined): f is PlaceFacts => !!f && (!!f.website || !!f.menu || FACT_ROWS.some(([k]) => factValue(f, k)));
const stale = (f: PlaceFacts) =>
  (f.version ?? 1) < 6 ||
  ((f.version ?? 1) < FACTS_VERSION && (f.from?.hours === "osm" || f.from?.closed === "osm")) ||
  Date.now() - Date.parse(f.checkedAt) > STALE_DAYS * 864e5 ||
  // a tag that only lists closed days was once read as closed all the others
  (f.from?.closed === "osm" && !!f.osm && onlyClosedDays(f.osm) && f.closed !== osmFacts(f.osm, f.checkedAt).closed);

const DAY_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAY_LONG = ["Mondays", "Tuesdays", "Wednesdays", "Thursdays", "Fridays", "Saturdays", "Sundays"];

/** OpenStreetMap's `opening_hours` as Good to know's Hours and Closed lines,
 *  read for the week of `ref` (the trip's own, so a seasonal rule applies as
 *  it will then): "Mon–Fri 10:00–18:00 · Sat 11:00–17:00", "Mondays". A tag
 *  that can't be read day by day is shown as tagged, with no Closed line. */
export function osmFacts(raw: string, ref: string): { hours?: string; closed?: string } {
  const pretty = (v: string) => v.replace(/(\d)-(\d)/g, "$1–$2").replace(/\s*,\s*/g, ", ");
  const base = new Date(`${ref}T00:00:00Z`);
  const monday = new Date(base.getTime() - ((base.getUTCDay() + 6) % 7) * 864e5);
  const days = DAY_SHORT.map((_, i) => new Date(monday.getTime() + i * 864e5).toISOString().slice(0, 10));
  // a tag it can't read comes back as it is
  if (days.some((d) => { const v = hoursForDate(raw, d); return v === raw && /[a-z;]/i.test(raw); })) return { hours: pretty(raw) };
  // "Closed" or null is a shut day; undefined, an open one at hours the tag
  // doesn't give ("Su off" names Sunday and nothing else)
  const week = days.map((d) => osmHoursOn(raw, d));
  if (week.some((v) => v === undefined)) {
    const shut = DAY_LONG.filter((_, i) => week[i] === "Closed");
    return shut.length ? { closed: shut.join(", ") } : {};
  }
  // runs of days with the same hours
  const runs: { from: number; to: number; v: string | undefined }[] = [];
  week.forEach((v, i) => {
    const last = runs[runs.length - 1];
    if (last && last.v === v) last.to = i;
    else runs.push({ from: i, to: i, v });
  });
  const span = (r: { from: number; to: number }) => (r.from === r.to ? DAY_SHORT[r.from] : `${DAY_SHORT[r.from]}–${DAY_SHORT[r.to]}`);
  const open = runs.filter((r) => r.v !== "Closed");
  const shut = runs.filter((r) => r.v === "Closed");
  const hours = open.length === 1 && open[0].from === 0 && open[0].to === 6 ? `Daily ${pretty(open[0].v!)}` : open.map((r) => `${span(r)} ${pretty(r.v!)}`).join(" · ");
  const closed = !shut.length ? "None" : shut.length === 1 && shut[0].from === shut[0].to ? DAY_LONG[shut[0].from] : shut.map(span).join(", ");
  return { hours: hours || "Closed all week", closed };
}

/** a place's hours on `iso` from its Good to know: OpenStreetMap's tag read
 *  for that day when the hours came from it, else the looked-up or typed
 *  phrases — "Closed", the hours, or undefined when it can't be told */
export function factsDayHours(f: PlaceFacts | undefined, iso: string): string | undefined {
  if (!f) return undefined;
  const typed = f.edited && ("hours" in f.edited || "closed" in f.edited);
  if (f.osm && !typed) {
    const day = osmHoursOn(f.osm, iso);
    if (day !== undefined) return day;
    // a tag that only lists closed days, and this isn't one: open, at the
    // hours the searches found — never lines once read off the tag itself
    const hours = f.from?.hours === "osm" ? undefined : factValue(f, "hours");
    return hours && hours !== VARIES ? factsHoursForDate(hours, undefined, iso) : undefined;
  }
  const hours = factValue(f, "hours");
  return factsHoursForDate(hours === VARIES ? undefined : hours, factValue(f, "closed") === VARIES ? undefined : factValue(f, "closed"), iso);
}

/** shown in place of a fact two searches answered differently (the
 *  server's own word for it) */
export const VARIES = "Varies by source";

/** past this from the stay's hotel, a place is a day trip out of that city
 *  (Osaka from a Kyoto stay), not in it */
const AREA_KM = 30;

/** each trip's place → stay and day-trip town, worked out once per version
 *  of the trip rather than once per place */
const cities = new WeakMap<TripData, { leg: Map<string, string>; town: Map<string, string>; towns: TripCity[] }>();
function cityMaps(data: TripData) {
  let c = cities.get(data);
  if (!c) {
    const towns = dayTripCities(data);
    c = { leg: placeLegMap(data), town: placeCityMap(data, undefined, undefined, towns), towns };
    cities.set(data, c);
  }
  return c;
}

/** the city a place is in, to tell the search which one is meant. Its stay
 *  is the one it's filed under, else the one its first day is in, else the
 *  nearest — the same one the Map puts it under. Away from that stay (a day
 *  trip), it's the day trip's town, or none when it's in no town we know:
 *  a wrong city would only mislead the search. */
export function placeArea(place: Place, data: TripData | null): string | undefined {
  if (!data) return undefined;
  const { leg: nearest, town, towns } = cityMaps(data);
  const legId = place.legId ?? data.days.find((d) => d.plan?.some((i) => i.placeId === place.id))?.legId ?? nearest.get(place.id);
  const leg = data.legs.find((l) => l.id === legId);
  const hotel = leg?.hotelId ? data.hotels.find((h) => h.id === leg.hotelId) : undefined;
  const away = hotel?.lat != null && hotel.lng != null && haversineKm(hotel.lat, hotel.lng, place.lat, place.lng) > AREA_KM;
  if (!away) return leg?.base || undefined;
  return towns.find((t) => t.id === town.get(place.id))?.name || undefined;
}

/** why a lookup couldn't be asked — told apart so a refusal never passes
 *  for being offline:
 *  - `offline`: no connection
 *  - `refused`: the server turned the request down (401 — signed out, or the
 *    Worker can't check sign-ins)
 *  - `setup`: the server has no search key (503)
 *  - `used-up`: every search's free month is spent
 *  - `busy`: asked too fast, still, after waiting and trying again
 *  - `search`: the search service failed or answered nonsense */
export type FactsFailure = "offline" | "refused" | "setup" | "used-up" | "busy" | "search";

/** found → the facts; nothing found → null; couldn't ask → why */
type Result = PlaceFacts | null | FactsFailure;
const isFailure = (r: Result): r is FactsFailure => typeof r === "string";

/** what each failure means, short enough for a row */
export const FAILURE_TEXT: Record<FactsFailure, string> = {
  offline: "You’re offline — try again with a connection",
  refused: "The server refused the lookup — try signing in again",
  setup: "Lookups aren’t set up on the server",
  "used-up": "This month’s free searches are used up — lookups start again next month",
  busy: "The search service is busy — try again in a few minutes",
  search: "The search service didn’t answer — try again later",
};

// one lookup at a time, each starting a short pause after the last search
// went out — a day of restaurants opening at once mustn't fire them all
// together, and each lookup is two searches a search service counts
// against how fast it may be asked; a place asked about already shares the
// running one
const GAP_MS = 1500;
let lastSearch = 0;
// asked too fast: wait this long and ask again, then longer, then give up
const BUSY_WAITS_MS = [15_000, 45_000];
const sleep = (ms: number) => new Promise((r) => setTimeout(r, Math.max(0, ms)));
let queue: Promise<unknown> = Promise.resolve();
const inFlight = new Map<string, Promise<Result>>();
/** places whose lookup couldn't be asked this session, and why — not
 *  retried on their own until the app is opened again; the card says why */
const failed = new Map<string, FactsFailure>();
const failureListeners = new Set<() => void>();
function setFailure(id: string, why: FactsFailure | null) {
  if ((failed.get(id) ?? null) === why) return;
  if (why) failed.set(id, why);
  else failed.delete(id);
  failureListeners.forEach((l) => l());
}

/** why this place's last lookup couldn't be asked, if it couldn't */
export function useFactsFailure(id: string): FactsFailure | undefined {
  const [, bump] = useState(0);
  useEffect(() => {
    const l = () => bump((n) => n + 1);
    failureListeners.add(l);
    return () => { failureListeners.delete(l); };
  }, []);
  return failed.get(id);
}

async function ask(p: Place, area: string | undefined, kind: "food" | "sight"): Promise<Result> {
  if (typeof navigator !== "undefined" && !navigator.onLine) return "offline";
  try {
    const q = new URLSearchParams({ name: p.name });
    if (area) q.set("area", area);
    if (kind === "sight") q.set("kind", kind);
    let res: Response;
    try {
      res = await apiGet(`/api/place-facts?${q}`);
    } catch {
      return "offline";
    }
    if (res.status === 401 || res.status === 403) return "refused";
    if (res.status === 503) return "setup";
    if (res.status === 429) {
      // an older server didn't say which; it only ever meant used up then
      const limit = ((await res.json().catch(() => ({}))) as { limit?: string }).limit;
      return limit === "busy" ? "busy" : "used-up";
    }
    if (!res.ok || !res.headers.get("Content-Type")?.includes("json")) return "search";
    const facts = ((await res.json()) as { facts?: PlaceFacts | null }).facts;
    if (facts === undefined) return "search";
    // OSM's own tags at the pin beat what was read off the web: its website
    // and menu over a site picked out of the search's pages, its opening
    // hours over the searches' — a tag says the same thing every time
    const [{ website, menu }, osm] = await Promise.all([
      osmLinks(p.lat, p.lng, p.name).catch(() => ({ website: undefined, menu: undefined })),
      // undefined when OpenStreetMap couldn't be asked, null when it has nothing
      nearestOpeningHours(p.lat, p.lng, p.name, p.osm).catch(() => undefined),
    ]);
    const from: PlaceFacts["from"] = {};
    for (const [k] of FACT_ROWS) if (facts?.[k]) from[k] = "web";
    const out: PlaceFacts = { ...(facts ?? { checkedAt: todayISO() }), ...(website && { website }), ...(menu && { menu }) };
    // hours read off OpenStreetMap before keep reading day by day when it
    // can't be asked now — but not when it answered without them
    const tag = osm ? osm.hours : osm === undefined && p.facts?.from?.hours === "osm" ? p.facts.osm : undefined;
    if (tag) {
      const ref = useApp.getState().data?.meta.start || todayISO();
      const read = osmFacts(tag, ref);
      out.osm = tag;
      if (read.hours) { out.hours = read.hours; from.hours = "osm"; }
      if (read.closed) { out.closed = read.closed; from.closed = "osm"; }
    }
    if (!facts && !website && !menu && !tag) return null;
    return { ...out, from };
  } catch {
    return "search";
  }
}

function lookUp(p: Place, area: string | undefined, kind: "food" | "sight"): Promise<Result> {
  // a rename mid-lookup asks again under the new name
  const key = `${p.id}|${p.name}|${kind}`;
  const running = inFlight.get(key);
  if (running) return running;
  const searched = async () => {
    await sleep(lastSearch + GAP_MS - Date.now());
    const found = await ask(p, area, kind);
    // only a lookup that reached the search counts towards the pace
    if (found !== "offline" && found !== "refused" && found !== "setup") lastSearch = Date.now();
    return found;
  };
  const job = queue.then(async () => {
    let found = await searched();
    for (const wait of BUSY_WAITS_MS) {
      if (found !== "busy") break;
      await sleep(wait);
      found = await searched();
    }
    return found;
  });
  queue = job.catch(() => "search");
  inFlight.set(key, job);
  void job.finally(() => inFlight.delete(key));
  return job;
}

/** looks a place's facts up and saves them on it. Nothing found keeps what
 *  it had (or records the check, so it isn't asked again for a while).
 *  Resolves null when it asked, or why it couldn't. */
export async function refreshFacts(p: Place, area: string | undefined): Promise<FactsFailure | null> {
  const kind = kindOf(p, useApp.getState().data?.config.categoryIcons);
  const found = await lookUp(p, area, kind);
  if (isFailure(found)) {
    setFailure(p.id, found);
    return found;
  }
  setFailure(p.id, null);
  const { data, updateEntity } = useApp.getState();
  const now = data?.places.find((x) => x.id === p.id);
  if (!now || data?.config.demo) return null;
  // a place renamed since doesn't take facts about its old name
  if (now.name !== p.name) return null;
  // what it had is only worth keeping if it was asked the same way
  const kept = now.facts?.name === p.name && (now.facts.kind ?? "food") === kind ? now.facts : undefined;
  // a fact this lookup didn't settle keeps what it had, so a refresh never
  // wipes an answer just because this time the search came back blank
  const merged: PlaceFacts | undefined = found ? { ...found, from: { ...found.from } } : undefined;
  if (merged && kept) {
    for (const [k] of FACT_ROWS) {
      if (merged[k] || !kept[k]) continue;
      // hours OpenStreetMap no longer gives this place (a neighbour's, once) aren't kept
      if (kept.from?.[k] === "osm") continue;
      merged[k] = kept[k];
      if (kept.from?.[k]) merged.from![k] = kept.from[k];
    }
  }
  updateEntity<Place>("places", p.id, {
    facts: {
      ...(merged ?? { ...kept, checkedAt: todayISO() }),
      name: p.name,
      kind: kind === "sight" ? kind : undefined,
      version: FACTS_VERSION,
      // what was typed in by hand outlives every lookup, a rename included
      edited: now.facts?.edited,
    },
  });
  return null;
}

/** sets one fact by hand. Typing back exactly what the lookup found drops
 *  the override; clearing one the lookup found keeps it cleared. */
export function editFact(place: Place, k: FactKey, value: string) {
  const v = value.trim();
  const f = place.facts;
  const edited = { ...f?.edited };
  if (v === (f?.[k] ?? "")) delete edited[k];
  else edited[k] = v;
  useApp.getState().updateEntity<Place>("places", place.id, {
    facts: { ...(f ?? { checkedAt: "" }), edited: Object.keys(edited).length ? edited : undefined },
  });
}

/** whether a place's facts are due a lookup: one that gets them (see
 *  `wantsFacts`) with none yet, ones about a name it's since been renamed
 *  from or asked as the other kind (its category changed), or ones past
 *  `STALE_DAYS` or from an older `FACTS_VERSION` */
export const factsDue = (p: Place, data: TripData | null) =>
  wantsFacts(p, data) &&
  (!p.facts || p.facts.name !== p.name || (p.facts.kind ?? "food") !== kindOf(p, data?.config.categoryIcons) || stale(p.facts));

/** looks a place's facts up as soon as it's shown, and again once they're
 *  stale — so opening a day fills in every stop on it */
export function useAutoPlaceFacts(place: Place | undefined, data: TripData | null, area: string | undefined, enabled: boolean) {
  const due = !!place && enabled && factsDue(place, data) && !failed.has(place.id);
  useEffect(() => {
    if (due && place) void refreshFacts(place, area);
    // the place's identity and what the lookup goes on — not the object itself
  }, [due, place?.id, place?.name, area]);
}
