import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { MapView, type MLMap } from "@/components/MapView";
import { Editable } from "@/components/Editable";
import { Icon } from "@/components/Icon";
import { IconTile } from "@/components/IconTile";
import { ConfirmButton } from "@/components/ConfirmButton";
import { useData } from "@/lib/data";
import { useApp } from "@/store/useApp";
import { tripClock, fmtDate, plural } from "@/lib/dates";
import { gmapsLink, mapUrlCoords } from "@/lib/maps";
import { geocode, reverseGeocode, type GeoResult } from "@/lib/geocode";
import { haversineKm } from "@/lib/geo";
import { legHex } from "@/lib/legColors";
import { suggestAreas, type AreaSuggestion } from "@/lib/cluster";
import { useMode, isDark } from "@/lib/mode";
import { useReadOnly } from "@/lib/readonly";
import { TRANSIT_KINDS, TRANSIT_META } from "@/lib/transitLayers";
import { glyphPath } from "@/lib/mapGlyphs";
import { toneForPlaceCategory } from "@/lib/tones";
import { DEFAULT_ACCENT } from "@/lib/themePresets";
import type { Area, Day, Hotel, PlanItem, Place, TripData } from "@/core/types";

const FALLBACK = DEFAULT_ACCENT;
// colours an app-native pin may carry that aren't a real "own" colour — the
// current accent fallback and the prior default it replaced. An imported pin's
// colour is anything else.
const DEFAULT_PIN_COLORS = new Set([FALLBACK, "#5f7f9c"]);
/** how far a pin can sit from a stay's anchor and still count as "in" that base
 *  — roughly a metro area plus a short day-out. Beyond it the pin belongs to no
 *  city pill and shows only on "All" or on a day that names it. */
const MAX_ANCHOR_KM = 60;

/** the legend mark for a category chip — a mini filled tile echoing the place
 *  rows and the map pins: the category colour, its glyph in white if it has one.
 *  The chip button dims as a whole when the filter's off, so no separate state. */
function CatMark({ color, glyph }: { color: string; glyph?: string }) {
  const d = glyphPath(glyph);
  return (
    <span
      className="grid h-[15px] w-[15px] shrink-0 place-items-center rounded-[4px]"
      style={{ background: color }}
      aria-hidden="true"
    >
      {d && (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff"
          strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d={d} />
        </svg>
      )}
    </span>
  );
}
const rid = () => (crypto?.randomUUID ? crypto.randomUUID() : `p-${Math.random().toString(36).slice(2)}`);

const TRANSIT_KEY = "za.transit";
const TRANSIT_DEFAULT = ["train", "metro"];
const loadTransit = (): Set<string> => {
  try {
    const raw = localStorage.getItem(TRANSIT_KEY);
    if (raw == null) return new Set(TRANSIT_DEFAULT); // first run — show rail by default
    const v = JSON.parse(raw);
    return new Set(Array.isArray(v) ? v.filter((k) => TRANSIT_KINDS.includes(k)) : []);
  } catch {
    return new Set(TRANSIT_DEFAULT);
  }
};

type Snap = "peek" | "half" | "full";
/** a small preview, just past the city pills; enough of "half" to be worth
 *  defaulting to when there's a list; "full" leaves an 8px peek of map. */
const PEEK_PX = 132;
const HALF_RATIO = 0.58;
const FULL_GAP_PX = 8;
const snapPx = (s: Snap, containerH: number): number =>
  s === "peek" ? PEEK_PX : s === "half" ? Math.round(containerH * HALF_RATIO) : containerH - FULL_GAP_PX;
const NEXT: Record<Snap, Snap> = { peek: "half", half: "full", full: "peek" };
/** a tap (vs. a real drag) on the handle just cycles to the next stop */
const TAP_SLOP_PX = 6;

/**
 * Open on the city (leg) you're currently in — during: today's leg; before: the
 * first leg; after: the last. "all" when there's nothing better, or when that
 * leg has no places to show.
 */
function defaultScope(data: TripData): string {
  if (data.legs.length < 2) return "all";
  const c = tripClock(data);
  const days = [...data.days].sort((a, b) => a.date.localeCompare(b.date));
  let day: Day | undefined;
  if (c.phase === "during" && c.today) day = c.today;
  else if (c.phase === "before") day = days[0];
  else if (c.phase === "after") day = days.at(-1);
  const legId = day?.legId ?? data.legs[0]?.id;
  return legId ? `leg:${legId}` : "all";
}

export default function MapTab() {
  const data = useData();
  const updateEntity = useApp((s) => s.updateEntity);
  const removeEntity = useApp((s) => s.removeEntity);
  const addEntity = useApp((s) => s.addEntity);
  const syncMyMap = useApp((s) => s.syncMyMap);
  const readOnly = useReadOnly();
  const [mode] = useMode();
  const dark = isDark(mode);

  const map = useRef<MLMap | null>(null);
  const [scope, setScope] = useState<string | null>(null);
  /** category filter — empty means "all categories". Combines with any scope. */
  const [catFilter, setCatFilter] = useState<Set<string>>(new Set());
  /** area filter — empty means "all areas". Combines with scope + category. */
  const [areaFilter, setAreaFilter] = useState<Set<string>>(new Set());
  /** area groups collapsed in the list, by area id ("" = the "no area" group) */
  const [collapsedAreas, setCollapsedAreas] = useState<Set<string>>(new Set());
  /** city groups collapsed in the "All" list, by leg id ("" = the "no city" group) */
  const [collapsedCities, setCollapsedCities] = useState<Set<string>>(new Set());
  /** transit overlay — empty means nothing shown (opt-in). Persisted across trips. */
  const [transit, setTransit] = useState<Set<string>>(loadTransit);
  const [selected, setSelected] = useState<string | null>(null);
  const [snap, setSnap] = useState<Snap>("peek");
  /** the "Filters" disclosure (category, transit, area editing) */
  const [filtersOpen, setFiltersOpen] = useState(false);

  // the mobile sheet's handle: a real drag (not just a tap-to-cycle button),
  // snapping to the nearest of peek/half/full on release
  const shellRef = useRef<HTMLDivElement | null>(null);
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const [containerH, setContainerH] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ y: number; h: number } | null>(null);
  const suppressClick = useRef(false);

  useEffect(() => {
    const el = shellRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setContainerH(entry.contentRect.height));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const availH = containerH || window.innerHeight - 112;
  const sheetHeight = snapPx(snap, availH);

  const onHandlePointerDown = (e: ReactPointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragStart.current = { y: e.clientY, h: sheetRef.current?.getBoundingClientRect().height ?? sheetHeight };
    setDragging(true);
  };
  const onHandlePointerMove = (e: ReactPointerEvent) => {
    if (!dragStart.current || !sheetRef.current) return;
    const next = Math.min(Math.max(dragStart.current.h + (dragStart.current.y - e.clientY), PEEK_PX), availH - FULL_GAP_PX);
    sheetRef.current.style.height = `${next}px`;
  };
  const onHandlePointerUp = (e: ReactPointerEvent) => {
    if (!dragStart.current || !sheetRef.current) return;
    const moved = Math.abs(e.clientY - dragStart.current.y);
    setDragging(false);
    suppressClick.current = true;
    if (moved < TAP_SLOP_PX) {
      setSnap(NEXT[snap]);
    } else {
      const finalH = sheetRef.current.getBoundingClientRect().height;
      const stops: Snap[] = ["peek", "half", "full"];
      setSnap(stops.reduce((best, s) => (Math.abs(snapPx(s, availH) - finalH) < Math.abs(snapPx(best, availH) - finalH) ? s : best)));
    }
    dragStart.current = null;
  };
  const onHandleClick = () => {
    if (suppressClick.current) { suppressClick.current = false; return; }
    setSnap(NEXT[snap]); // keyboard activation — no pointer sequence to read a drag from
  };

  const [adding, setAdding] = useState(false);
  const [q, setQ] = useState("");
  const [results, setResults] = useState<GeoResult[]>([]);
  const [pending, setPending] = useState<{ lat: number; lng: number; name: string } | null>(null);

  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  /** review state for "Suggest areas" — null when not suggesting */
  const [review, setReview] = useState<ReviewGroup[] | null>(null);
  /** true while the reverse-geocode pass is still filling in neighbourhood names */
  const [naming, setNaming] = useState(false);
  /** bumped whenever a suggestion run starts or ends, so a stale naming loop bails */
  const suggestRun = useRef(0);
  /** inline "name a new area" field — true while it's open */
  const [namingArea, setNamingArea] = useState(false);
  const [areaName, setAreaName] = useState("");
  /** inline area list open for rename / delete */
  const [editingAreas, setEditingAreas] = useState(false);

  const places = useMemo(() => data?.places ?? [], [data]);

  // set the contextual default scope once the trip is loaded
  useEffect(() => {
    if (data && scope === null) setScope(defaultScope(data));
  }, [data, scope]);

  // arrived from search with ?sel=<placeId>: widen to all places so the pin is
  // on the map, select it, then drop the param
  const [params, setParams] = useSearchParams();
  const selHandled = useRef(false);
  useEffect(() => {
    if (selHandled.current || !data) return;
    const sel = params.get("sel");
    if (!sel) return;
    selHandled.current = true;
    if (data.places.some((p) => p.id === sel)) {
      setScope("all");
      setCatFilter(new Set());
      setAreaFilter(new Set());
      setSelected(sel);
    }
    setParams((p) => { p.delete("sel"); return p; }, { replace: true });
  }, [data, params, setParams]);

  // arrived from search with ?area=<areaId>: widen to all places, filter to
  // just that area, and make sure its group isn't left collapsed
  const areaHandled = useRef(false);
  useEffect(() => {
    if (areaHandled.current || !data) return;
    const area = params.get("area");
    if (!area) return;
    areaHandled.current = true;
    if (data.areas.some((a) => a.id === area)) {
      setScope("all");
      setCatFilter(new Set());
      setAreaFilter(new Set([area]));
      setCollapsedAreas((prev) => { const next = new Set(prev); next.delete(area); return next; });
    }
    setParams((p) => { p.delete("area"); return p; }, { replace: true });
  }, [data, params, setParams]);

  // debounced place search (Nominatim)
  useEffect(() => {
    if (!adding || pending) return;
    const t = setTimeout(async () => {
      const c = map.current?.getCenter();
      setResults(await geocode(q, c ? { lat: c.lat, lng: c.lng } : undefined));
    }, 400);
    return () => clearTimeout(t);
  }, [q, adding, pending]);

  // keep the map sized to the sheet / panel
  useEffect(() => {
    const t = setTimeout(() => map.current?.resize(), 260);
    return () => clearTimeout(t);
  }, [snap]);

  // a selection deserves at least the half sheet on mobile
  useEffect(() => {
    if (selected) setSnap((s) => (s === "peek" ? "half" : s));
  }, [selected]);

  // remember the transit overlay choice (app-wide, not per-trip)
  useEffect(() => {
    try {
      localStorage.setItem(TRANSIT_KEY, JSON.stringify([...transit]));
    } catch {
      /* private mode — fine */
    }
  }, [transit]);

  // Geocode a hotel's address once when it has no coords and its Maps link
  // carries none — so the city pills anchor on real trips whose hotel links are
  // the short `maps.app.goo.gl` kind. One lookup per hotel, spaced for Nominatim,
  // cached straight back onto the entity.
  const geoTried = useRef<Set<string>>(new Set());
  useEffect(() => {
    if (!data || readOnly) return;
    const pending = data.hotels.filter(
      (h) =>
        h.address?.trim() &&
        !geoTried.current.has(h.id) &&
        !(Number.isFinite(h.lat) && Number.isFinite(h.lng)) &&
        !mapUrlCoords(h.mapUrl),
    );
    if (pending.length === 0) return;
    let stop = false;
    (async () => {
      for (const h of pending) {
        if (stop) return;
        geoTried.current.add(h.id);
        // drop a leading postcode ("〒105-0013 ") — Nominatim reads it as noise
        const q = h.address!.trim().replace(/^〒?\s*\d{3}-?\d{4}[\s,]*/, "");
        let [hit] = await geocode(q);
        // retry with the latin part only — a Japanese building-name tail
        // ("… ビーサイト浜松町") often sinks the whole lookup
        if (!hit) {
          const latin = q.replace(/[^\x00-\x7F]+/g, " ").replace(/\s{2,}/g, " ").replace(/[\s,]+$/, "").trim();
          if (latin && latin !== q) [hit] = await geocode(latin);
        }
        if (hit) updateEntity<Hotel>("hotels", h.id, { lat: hit.lat, lng: hit.lng });
        await new Promise((r) => setTimeout(r, 1200));
      }
    })();
    return () => { stop = true; };
  }, [data, readOnly, updateEntity]);

  const cats = useMemo(() => {
    const m = new Map<string, string>();
    for (const p of places) if (p.category && !m.has(p.category)) m.set(p.category, p.color || FALLBACK);
    return [...m].sort((a, b) => a[0].localeCompare(b[0]));
  }, [places]);

  const dayOfPlace = useMemo(() => {
    const m = new Map<string, string>();
    if (!data) return m;
    for (const d of data.days)
      for (const it of d.plan ?? []) if (it.placeId) m.set(it.placeId, d.id);
    return m;
  }, [data]);

  /** ids a day pulls in: places named in its plan, and (live) everything in its areas */
  const dayIds = (d: Day | undefined) => {
    const explicit = (d?.plan ?? []).map((x) => x.placeId).filter(Boolean) as string[];
    const fromAreas = (d?.areaIds ?? []).flatMap((id) => data?.areas.find((a) => a.id === id)?.placeIds ?? []);
    return { explicit: new Set(explicit), all: new Set([...explicit, ...fromAreas]) };
  };

  /** union of placeIds across the areas ticked in the area filter — null when none ticked */
  const areaAllowed = useMemo(() => {
    if (!data || areaFilter.size === 0) return null;
    const ids = new Set<string>();
    for (const a of data.areas) if (areaFilter.has(a.id)) a.placeIds.forEach((id) => ids.add(id));
    return ids;
  }, [data, areaFilter]);

  /** each place's "home city" (leg), by nearest leg anchor. A leg is anchored on
   *  its hotel (its stored coords — from the Maps link or a one-off geocode of
   *  the address) or, failing that, the centroid of the places its days pull in.
   *  A leg with neither has no anchor and claims nothing. Lets a whole city's
   *  imported pins sit under its pill even before they're linked to a day. */
  const placeLeg = useMemo(() => {
    const m = new Map<string, string>();
    if (!data) return m;
    const anchors: { legId: string; lat: number; lng: number }[] = [];
    for (const leg of data.legs) {
      const hotel = data.hotels.find((h) => h.id === leg.hotelId);
      const hc = hotel && Number.isFinite(hotel.lat) && Number.isFinite(hotel.lng)
        ? ([hotel.lat, hotel.lng] as [number, number])
        : mapUrlCoords(hotel?.mapUrl);
      if (hc) {
        anchors.push({ legId: leg.id, lat: hc[0], lng: hc[1] });
        continue;
      }
      const pts = data.days
        .filter((d) => d.legId === leg.id)
        .flatMap((d) => [...dayIds(d).all])
        .map((id) => places.find((p) => p.id === id))
        .filter((p): p is Place => !!p);
      if (pts.length) {
        anchors.push({
          legId: leg.id,
          lat: pts.reduce((s, p) => s + p.lat, 0) / pts.length,
          lng: pts.reduce((s, p) => s + p.lng, 0) / pts.length,
        });
      }
    }
    if (anchors.length === 0) return m;
    for (const p of places) {
      let best = anchors[0].legId, bd = Infinity;
      for (const a of anchors) {
        const d = haversineKm(p.lat, p.lng, a.lat, a.lng);
        if (d < bd) { bd = d; best = a.legId; }
      }
      // only claim a pin that's plausibly in that base's orbit — otherwise a
      // lone anchored leg vacuums up every pin in the trip (a Tokyo pin is not
      // "in" Kawaguchiko just because that's the only stay with coordinates).
      if (bd <= MAX_ANCHOR_KM) m.set(p.id, best);
    }
    return m;
  }, [data, places]); // eslint-disable-line react-hooks/exhaustive-deps

  /** ids in the current scope, before the category / area chips narrow it —
   *  the area chips derive from this so ticking one can't make its own chip
   *  vanish. Also tracks which came in via an area, not an explicit plan step. */
  const { inScopeIds, derivedIds } = useMemo(() => {
    if (!data) return { inScopeIds: new Set<string>(), derivedIds: new Set<string>() };
    if (!scope || scope === "all") {
      return { inScopeIds: new Set(places.map((p) => p.id)), derivedIds: new Set<string>() };
    }
    const all = new Set<string>();
    const explicit = new Set<string>();
    // a single day — the "Today" pill
    if (scope.startsWith("day:")) {
      const d = data.days.find((x) => x.id === scope.slice(4));
      const s = dayIds(d);
      s.all.forEach((id) => all.add(id));
      s.explicit.forEach((id) => explicit.add(id));
      return { inScopeIds: all, derivedIds: new Set([...all].filter((id) => !explicit.has(id))) };
    }
    // a stay / city
    const legId = scope.slice(4);
    for (const d of data.days.filter((d) => d.legId === legId)) {
      const s = dayIds(d);
      s.all.forEach((id) => all.add(id));
      s.explicit.forEach((id) => explicit.add(id));
    }
    for (const p of places) if (placeLeg.get(p.id) === legId) all.add(p.id);
    return { inScopeIds: all, derivedIds: new Set([...all].filter((id) => !explicit.has(id) && !placeLeg.has(id))) };
  }, [data, places, scope, placeLeg]);

  /** the scope, narrowed by the category + area chips */
  const scoped = useMemo(() => {
    const pass = (p: Place) =>
      inScopeIds.has(p.id) &&
      (catFilter.size === 0 || (!!p.category && catFilter.has(p.category))) &&
      (!areaAllowed || areaAllowed.has(p.id));
    return places.filter(pass);
  }, [places, inScopeIds, catFilter, areaAllowed]);
  const derived = derivedIds;

  // settle the opening view once: if the default city has no places, widen to
  // "all"; then open to the half sheet if there's a list worth showing.
  const snapInit = useRef(false);
  useEffect(() => {
    if (snapInit.current || scope === null) return;
    if (scoped.length === 0 && places.length > 0 && scope.startsWith("leg:")) {
      setScope("all");
      return;
    }
    snapInit.current = true;
    if (scoped.length > 0) setSnap("half");
  }, [scope, scoped.length, places.length]);

  /** the list split into collapsible area sections. Shown whenever areas exist
   *  and more than one is represented in the current view; null → flat list. */
  const areaGroups = useMemo(() => {
    if (!data || data.areas.length === 0) return null;
    const byId = new Map(scoped.map((p) => [p.id, p] as const));
    const groups = data.areas
      .map((a, i) => ({
        id: a.id,
        name: a.name || "Untitled",
        tone: AREA_TONES[i % AREA_TONES.length],
        items: a.placeIds.map((id) => byId.get(id)).filter(Boolean) as Place[],
      }))
      .filter((g) => g.items.length > 0)
      .sort((x, y) => x.name.localeCompare(y.name));
    const inArea = new Set(data.areas.flatMap((a) => a.placeIds));
    const loose = scoped.filter((p) => !inArea.has(p.id));
    if (loose.length) groups.push({ id: "", name: "No area", tone: "#9aa3ad", items: loose });
    // one group only → not worth the section chrome, render flat
    return groups.length > 1 ? groups : null;
  }, [data, scoped]);

  /** the "All" list nested city → area → places. Each area sits under the city
   *  most of its pins fall in. Null unless more than one city actually shows —
   *  then `areaGroups` (flat) or the plain list takes over. */
  const cityGroups = useMemo(() => {
    if (!data || (scope && scope !== "all") || data.areas.length === 0) return null;
    const byId = new Map(scoped.map((p) => [p.id, p] as const));
    const tone = new Map(data.areas.map((a, i) => [a.id, AREA_TONES[i % AREA_TONES.length]] as const));
    const order = new Map(data.legs.map((l, i) => [l.id, i] as const));

    // an area's city = where the plurality of its in-view pins sit
    const areaCity = (a: Area) => {
      const tally = new Map<string, number>();
      for (const id of a.placeIds) {
        if (!byId.has(id)) continue;
        const lg = placeLeg.get(id) ?? "";
        tally.set(lg, (tally.get(lg) ?? 0) + 1);
      }
      let best = "", bn = 0;
      for (const [lg, n] of tally) if (n > bn) { bn = n; best = lg; }
      return best;
    };

    type Sub = { id: string; name: string; tone: string; items: Place[] };
    const cities = new Map<string, { legId: string; name: string; hex: string; areas: Sub[]; loose: Place[] }>();
    const bucket = (legId: string) => {
      let c = cities.get(legId);
      if (!c) {
        const leg = data.legs.find((l) => l.id === legId);
        c = { legId, name: leg?.base || "No city", hex: leg ? legHex(leg.color) : "#9aa3ad", areas: [], loose: [] };
        cities.set(legId, c);
      }
      return c;
    };

    for (const a of data.areas) {
      const items = a.placeIds.map((id) => byId.get(id)).filter(Boolean) as Place[];
      if (items.length === 0) continue;
      bucket(areaCity(a)).areas.push({ id: a.id, name: a.name || "Untitled", tone: tone.get(a.id)!, items });
    }
    const inArea = new Set(data.areas.flatMap((a) => a.placeIds));
    for (const p of scoped) if (!inArea.has(p.id)) bucket(placeLeg.get(p.id) ?? "").loose.push(p);

    const groups = [...cities.values()]
      .filter((c) => c.areas.length > 0 || c.loose.length > 0)
      .map((c) => ({
        ...c,
        areas: c.areas.sort((x, y) => x.name.localeCompare(y.name)),
        count: c.areas.reduce((s, a) => s + a.items.length, 0) + c.loose.length,
      }))
      .sort((x, y) => (order.get(x.legId) ?? 99) - (order.get(y.legId) ?? 99));

    return groups.length > 1 ? groups : null;
  }, [data, scope, scoped, placeLeg]);

  /** the area chips to show for the current city — only areas that actually have
   *  a place in view. Derived from the scope *before* the chips narrow it, so
   *  ticking one can't make its own chip disappear. */
  const scopeAreas = useMemo(() => {
    if (!data) return [];
    return data.areas
      .map((a, i) => ({
        a,
        col: AREA_TONES[i % AREA_TONES.length],
        n: a.placeIds.filter((id) => inScopeIds.has(id)).length,
      }))
      .filter((g) => g.n > 0)
      .sort((x, y) => (x.a.name || "").localeCompare(y.a.name || ""));
  }, [data, inScopeIds]);

  /** legs whose hotel has coordinates — enough to earn a city pill even before
   *  any pin sits under it, so linking a hotel is all it takes to see the city */
  const anchoredLegIds = useMemo(() => {
    const s = new Set<string>();
    if (!data) return s;
    for (const leg of data.legs) {
      const h = data.hotels.find((x) => x.id === leg.hotelId);
      if ((h && Number.isFinite(h.lat) && Number.isFinite(h.lng)) || mapUrlCoords(h?.mapUrl)) s.add(leg.id);
    }
    return s;
  }, [data]);

  /** how many places each stay would show — so a stay with nothing to show
   *  doesn't get a dead city pill */
  const legCounts = useMemo(() => {
    const m = new Map<string, number>();
    if (!data) return m;
    for (const leg of data.legs) {
      const ids = new Set<string>();
      for (const d of data.days.filter((d) => d.legId === leg.id)) dayIds(d).all.forEach((id) => ids.add(id));
      for (const p of places) if (placeLeg.get(p.id) === leg.id) ids.add(p.id);
      m.set(leg.id, ids.size);
    }
    return m;
  }, [data, places, placeLeg]); // eslint-disable-line react-hooks/exhaustive-deps

  /** faint outline + label per area, for the "zoomed out" overview.
   *  Shown on All / By-area scopes; hidden when scoped to a day/stay. */
  const areaShapes = useMemo(() => {
    if (!data) return null;
    const byId = new Map(places.map((p) => [p.id, p]));
    const inScope = inScopeIds;
    const features = data.areas.flatMap((a, i) => {
      if (areaFilter.size > 0 && !areaFilter.has(a.id)) return [];
      const pts = a.placeIds.map((id) => byId.get(id)).filter((p): p is Place => !!p && inScope.has(p.id));
      if (pts.length === 0) return [];
      const clng = pts.reduce((s, p) => s + p.lng, 0) / pts.length;
      const clat = pts.reduce((s, p) => s + p.lat, 0) / pts.length;
      const km = Math.max(0.3, ...pts.map((p) => haversineKm(clat, clng, p.lat, p.lng))) * 1.25;
      return [{
        type: "Feature" as const,
        properties: { name: a.name || "Untitled", color: AREA_TONES[i % AREA_TONES.length] },
        geometry: { type: "Polygon" as const, coordinates: [circleRing(clng, clat, km)] },
      }];
    });
    return { type: "FeatureCollection" as const, features };
  }, [data, places, inScopeIds, areaFilter]);

  /** places not yet in any area — the ones worth auto-grouping */
  const ungrouped = useMemo(() => {
    const inArea = new Set(data?.areas.flatMap((a) => a.placeIds) ?? []);
    return places.filter((p) => !inArea.has(p.id));
  }, [places, data?.areas]);

  const imported = useMemo(() => places.filter((p) => p.source === "mymap").length, [places]);

  // fit the map to the current scope when nothing is selected
  const fitScope = () => {
    const m = map.current;
    if (!m || selected || scoped.length === 0) return;
    const lngs = scoped.map((p) => p.lng);
    const lats = scoped.map((p) => p.lat);
    m.fitBounds(
      [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]],
      { padding: { top: 56, right: 44, bottom: window.innerWidth < 768 ? 180 : 44, left: 44 }, maxZoom: 15, duration: 500 },
    );
  };
  useEffect(fitScope, [scoped, selected]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!data) return null;
  const url = data.config.mapSourceUrl?.trim() ?? "";
  const syncedAt = data.config.mapSyncedAt;
  const loc = data.config.locale;
  const clock = tripClock(data);

  const toggleCat = (name: string) =>
    setCatFilter((s) => {
      const n = new Set(s);
      n.has(name) ? n.delete(name) : n.add(name);
      return n;
    });

  const toggleTransit = (kind: string) =>
    setTransit((s) => {
      const n = new Set(s);
      n.has(kind) ? n.delete(kind) : n.add(kind);
      return n;
    });

  const toggleAreaFilter = (id: string) =>
    setAreaFilter((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const toggleAreaCollapsed = (id: string) =>
    setCollapsedAreas((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const toggleCityCollapsed = (id: string) =>
    setCollapsedCities((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const startAdd = () => {
    setAdding(true);
    setSelected(null);
    setNamingArea(false);
    suggestRun.current++;
    setNaming(false);
    setReview(null);
    setSnap((s) => (s === "peek" ? "half" : s));
  };
  const cancelAdd = () => {
    setAdding(false);
    setQ("");
    setResults([]);
    setPending(null);
  };
  const commitPlace = (name: string, lat: number, lng: number) => {
    const id = rid();
    addEntity("places", { id, name: name || "New place", lat, lng, category: "My places", color: FALLBACK } as Place);
    cancelAdd();
    setSelected(id);
    map.current?.easeTo({ center: [lng, lat], zoom: Math.max(map.current.getZoom(), 14) });
  };

  const onMapClick = (lat: number, lng: number) => {
    if (adding) setPending({ lat, lng, name: "" });
    else setSelected(null);
  };
  const onLongPress = (lat: number, lng: number) => {
    if (readOnly) return;
    setAdding(true);
    setSelected(null);
    setPending({ lat, lng, name: "" });
  };

  const addToDay = (place: Place, dayId: string) => {
    const day = data.days.find((d) => d.id === dayId);
    if (!day) return;
    if ((day.plan ?? []).some((it) => it.placeId === place.id)) return;
    const step: PlanItem = { id: rid(), text: place.name, placeId: place.id };
    updateEntity<Day>("days", dayId, { plan: [...(day.plan ?? []), step] });
  };

  const toggleAreaPlace = (areaId: string, placeId: string) => {
    const a = data.areas.find((x) => x.id === areaId);
    if (!a) return;
    const next = a.placeIds.includes(placeId) ? a.placeIds.filter((p) => p !== placeId) : [...a.placeIds, placeId];
    updateEntity<Area>("areas", areaId, { placeIds: next });
  };

  const startSuggest = () => {
    const found = suggestAreas(ungrouped);
    setSelected(null);
    setAdding(false);
    setNamingArea(false);
    setSnap((s) => (s === "peek" ? "half" : s));
    const groups: ReviewGroup[] = found.map((s) => ({ ...s, keep: true, auto: true }));
    setReview(groups);
    const run = ++suggestRun.current;
    if (groups.length) void nameGroups(run, groups);
  };
  /** fill each group's name with the neighbourhood it centres on, one lookup at a
   *  time (Nominatim is ~1 req/s). Skips groups the user has already renamed. */
  const nameGroups = async (run: number, groups: ReviewGroup[]) => {
    setNaming(true);
    for (let i = 0; i < groups.length; i++) {
      if (suggestRun.current !== run) return;
      const label = await reverseGeocode(groups[i].lat, groups[i].lng);
      if (suggestRun.current !== run) return;
      if (label) {
        setReview((cur) =>
          cur && cur[i]?.auto ? cur.map((g, j) => (j === i ? { ...g, name: label } : g)) : cur,
        );
      }
      if (i < groups.length - 1) await new Promise((r) => setTimeout(r, 1200));
    }
    if (suggestRun.current === run) setNaming(false);
  };
  const endSuggest = () => {
    suggestRun.current++;
    setNaming(false);
    setReview(null);
  };
  const applyReview = () => {
    for (const g of review ?? []) {
      if (!g.keep || g.placeIds.length < 2) continue;
      addEntity("areas", { id: crypto.randomUUID?.() ?? rid(), name: g.name || "Area", placeIds: g.placeIds } as never);
    }
    endSuggest();
  };
  const createArea = () => {
    const name = areaName.trim();
    if (!name) return;
    addEntity("areas", { id: crypto.randomUUID?.() ?? rid(), name, placeIds: [] } as never);
    setAreaName("");
    setNamingArea(false);
  };

  const runSync = async () => {
    if (!url) return;
    setBusy(true);
    setMsg("");
    try {
      const r = await syncMyMap(url);
      setMsg(`Imported ${r.count} pins from “${r.mapName}”.`);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Sync failed.");
    } finally {
      setBusy(false);
    }
  };

  const renderRow = (p: Place) => (
    <PlaceRow
      key={p.id}
      place={p}
      open={selected === p.id}
      dayId={dayOfPlace.get(p.id)}
      derived={derived.has(p.id)}
      days={data.days}
      areas={data.areas}
      categoryIcons={data.config.categoryIcons}
      loc={loc}
      onToggle={() => setSelected(selected === p.id ? null : p.id)}
      onNote={(v) => updateEntity<Place>("places", p.id, { note: v || undefined })}
      onName={(v) => v && updateEntity<Place>("places", p.id, { name: v })}
      onAddToDay={(d) => addToDay(p, d)}
      onToggleArea={(areaId) => toggleAreaPlace(areaId, p.id)}
      onRemove={() => {
        removeEntity("places", p.id);
        if (selected === p.id) setSelected(null);
      }}
    />
  );

  const panel = (
    <div className="flex h-full flex-col">
      {/* context bar — city → area → filters */}
      <div className="shrink-0 border-b border-line px-4 pb-2 pt-2.5">
        {/* city pills + Add place (always one tap) */}
        <div className="flex items-center gap-2">
          <div className="-mx-1 flex min-w-0 flex-1 gap-1.5 overflow-x-auto px-1 pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {[
              ...(clock.phase === "during" && clock.today
                ? [{ id: `day:${clock.today.id}`, label: "Today", hex: "" }]
                : []),
              { id: "all", label: `All · ${places.length}`, hex: "" },
              ...data.legs
                .filter((l) => (legCounts.get(l.id) ?? 0) > 0 || anchoredLegIds.has(l.id) || scope === `leg:${l.id}`)
                .map((l) => ({ id: `leg:${l.id}`, label: l.base || "Stay", hex: legHex(l.color) })),
            ].map((city) => {
              const active = (scope ?? "all") === city.id;
              return (
                <button
                  key={city.id}
                  onClick={() => { setScope(city.id); setSelected(null); setAreaFilter(new Set()); setCatFilter(new Set()); }}
                  className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors ${active ? "border-ink bg-ink text-bg" : "border-line text-ink-soft hover:border-ink-soft"}`}
                >
                  {city.hex && <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: active ? "currentColor" : city.hex }} />}
                  <span className="whitespace-nowrap">{city.label}</span>
                </button>
              );
            })}
          </div>
          {!readOnly && (adding ? (
            <button onClick={cancelAdd} className="link-quiet shrink-0 text-sm">Cancel</button>
          ) : (
            <button onClick={startAdd} className="action shrink-0 whitespace-nowrap text-sm">
              <Icon name="plus" size={14} /> Add place
            </button>
          ))}
        </div>

        {/* area chips — only once a city is picked, and only that city's areas
            that have a place in view. On "All" the list's own area sections do
            the narrowing; a chip wall there is the thing this redesign killed. */}
        {scope?.startsWith("leg:") && scopeAreas.length > 0 && !adding && (
          <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1.5">
            {scopeAreas.map(({ a, col }) => {
              const on = areaFilter.size === 0 || areaFilter.has(a.id);
              return (
                <button
                  key={a.id}
                  onClick={() => toggleAreaFilter(a.id)}
                  className={`inline-flex items-center gap-1.5 text-xs transition-opacity ${on ? "" : "opacity-35"}`}
                >
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: col, boxShadow: on ? `0 0 0 1px ${col}` : "none" }} />
                  {a.name || "Untitled"}
                </button>
              );
            })}
          </div>
        )}

        {/* Filters — category, transit, and area editing, folded away by default */}
        {!adding && (
          <div className="mt-2 border-t border-line pt-1">
            <button
              onClick={() => setFiltersOpen((v) => !v)}
              aria-expanded={filtersOpen}
              className="flex w-full items-center justify-between py-1 text-left"
            >
              <span className="eyebrow text-ink-faint">
                Filters{catFilter.size > 0 ? ` · ${catFilter.size}` : ""}
              </span>
              <Icon name="chevron" size={13} className={`text-ink-faint transition-transform ${filtersOpen ? "rotate-90" : ""}`} />
            </button>

            {filtersOpen && (
              <div className="space-y-3 pb-1 pt-1.5">
                {cats.length > 0 && (
                  <div>
                    <p className="eyebrow mb-1.5 text-ink-faint">Category</p>
                    <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                      {cats.map(([name, col]) => {
                        const on = catFilter.size === 0 || catFilter.has(name);
                        return (
                          <button
                            key={name}
                            onClick={() => toggleCat(name)}
                            className={`inline-flex items-center gap-1.5 text-xs transition-opacity ${on ? "" : "opacity-35"}`}
                          >
                            <CatMark color={col} glyph={data.config.categoryIcons?.[name]} />
                            <span className="capitalize">{name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div>
                  <p className="eyebrow mb-1.5 text-ink-faint">Transit</p>
                  <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                    {TRANSIT_KINDS.map((kind) => {
                      const on = transit.has(kind);
                      const col = dark ? TRANSIT_META[kind].dark : TRANSIT_META[kind].light;
                      return (
                        <button
                          key={kind}
                          onClick={() => toggleTransit(kind)}
                          className={`inline-flex items-center gap-1.5 text-xs transition-opacity ${on ? "" : "opacity-35"}`}
                        >
                          <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: col, boxShadow: on ? `0 0 0 1px ${col}` : "none" }} />
                          {TRANSIT_META[kind].label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {!readOnly && review === null && (
                  <div>
                    <p className="eyebrow mb-1.5 text-ink-faint">Areas</p>
                    {namingArea ? (
                      <div className="flex items-center gap-3">
                        <input
                          autoFocus
                          value={areaName}
                          onChange={(e) => setAreaName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") createArea();
                            if (e.key === "Escape") { setNamingArea(false); setAreaName(""); }
                          }}
                          placeholder="Area name — e.g. Asakusa"
                          className="min-w-0 flex-1 border-b border-ink bg-transparent pb-1 text-sm focus:outline-none"
                        />
                        <button onClick={createArea} className="shrink-0 font-medium text-accent">Add</button>
                        <button onClick={() => { setNamingArea(false); setAreaName(""); }} className="shrink-0 text-ink-faint hover:text-ink-soft">Cancel</button>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                        <button onClick={() => setNamingArea(true)} className="inline-flex items-center gap-1 text-accent transition-opacity hover:opacity-70">
                          <Icon name="plus" size={12} className="align-[-1px]" /> Add area
                        </button>
                        {ungrouped.length >= 4 && (
                          <button onClick={startSuggest} className="inline-flex items-center gap-1 text-accent transition-opacity hover:opacity-70">
                            <Icon name="explore" size={12} className="align-[-1px]" /> Suggest from {ungrouped.length}
                          </button>
                        )}
                        {data.areas.length > 0 && (
                          <button onClick={() => setEditingAreas((v) => !v)} className="link-quiet ml-auto">
                            {editingAreas ? "Done" : "Edit areas"}
                          </button>
                        )}
                      </div>
                    )}
                    {editingAreas && data.areas.length > 0 && (
                      <ul className="mt-2 border-t border-line pt-1.5">
                        {[...data.areas]
                          .sort((a, b) => (a.name || "").localeCompare(b.name || ""))
                          .map((a) => (
                            <li key={a.id} className="flex items-center gap-2 border-b border-line py-1.5 text-sm last:border-b-0">
                              <span className="min-w-0 flex-1 truncate">
                                <Editable label="Area name" value={a.name} placeholder="Area name" onCommit={(v) => updateEntity<Area>("areas", a.id, { name: v.trim() || "Untitled" })} />
                              </span>
                              <span className="shrink-0 text-2xs tabular-nums text-ink-faint">{plural(a.placeIds.length, "place")}</span>
                              <ConfirmButton onConfirm={() => removeEntity("areas", a.id)} className="shrink-0 text-ink-faint hover:text-accent">
                                <Icon name="trash" size={13} />
                              </ConfirmButton>
                            </li>
                          ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* add flow */}
      {adding && (
        <div className="shrink-0 border-b border-line px-4 py-3">
          {pending ? (
            <div>
              <p className="meta mb-2">
                Pin at {pending.lat.toFixed(4)}, {pending.lng.toFixed(4)}
              </p>
              <input
                autoFocus
                value={pending.name}
                onChange={(e) => setPending({ ...pending, name: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && commitPlace(pending.name, pending.lat, pending.lng)}
                placeholder="Name this place"
                className="w-full border-b border-ink bg-transparent pb-1 text-sm focus:outline-none"
              />
              <div className="mt-3 flex gap-4 text-sm">
                <button onClick={() => commitPlace(pending.name, pending.lat, pending.lng)} className="font-medium text-accent">
                  Save place
                </button>
                <button onClick={() => setPending(null)} className="text-ink-faint hover:text-ink-soft">
                  Pick again
                </button>
              </div>
            </div>
          ) : (
            <div>
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search for a place…"
                className="w-full border-b border-ink bg-transparent pb-1 text-sm focus:outline-none"
              />
              <p className="meta mt-1.5">…or tap the map to drop a pin.</p>
              {results.length > 0 && (
                <ul className="mt-2 divide-y divide-line">
                  {results.map((r, i) => (
                    <li key={i}>
                      <button
                        onClick={() => commitPlace(r.name, r.lat, r.lng)}
                        className="block w-full py-2 text-left"
                      >
                        <span className="block text-sm font-medium">{r.name}</span>
                        <span className="meta block truncate">{r.detail}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}

      {/* list, or the suggestion review */}
      {review !== null ? (
        <SuggestReview
          groups={review}
          places={places}
          naming={naming}
          onChange={setReview}
          onApply={applyReview}
          onCancel={endSuggest}
        />
      ) : cityGroups ? (
        <div className="min-h-0 flex-1 overflow-y-auto">
          {cityGroups.map((c) => {
            const cityShut = collapsedCities.has(c.legId)
              && !c.areas.some((a) => a.items.some((p) => p.id === selected))
              && !c.loose.some((p) => p.id === selected);
            return (
              <section key={c.legId || "none"}>
                <button
                  onClick={() => toggleCityCollapsed(c.legId)}
                  className="sticky top-0 z-[2] flex w-full items-center gap-2 border-b border-line bg-bg px-4 py-2 text-left"
                >
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: c.hex }} />
                  <span className="subhead min-w-0 flex-1 truncate">{c.name}</span>
                  <span className="shrink-0 text-2xs tabular-nums text-ink-faint">{c.count}</span>
                  <Icon name="chevron" size={13} className={`shrink-0 text-ink-faint transition-transform ${cityShut ? "" : "rotate-90"}`} />
                </button>
                {!cityShut && (
                  <>
                    {c.areas.map((a) => {
                      const shut = collapsedAreas.has(a.id) && !a.items.some((p) => p.id === selected);
                      return (
                        <div key={a.id}>
                          <button
                            onClick={() => toggleAreaCollapsed(a.id)}
                            className="flex w-full items-center gap-2 border-b border-line py-1.5 pl-8 pr-4 text-left"
                          >
                            <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: a.tone }} />
                            <span className="eyebrow min-w-0 flex-1 truncate font-medium">{a.name}</span>
                            <span className="shrink-0 text-2xs tabular-nums text-ink-faint">{a.items.length}</span>
                            <Icon name="chevron" size={12} className={`shrink-0 text-ink-faint transition-transform ${shut ? "" : "rotate-90"}`} />
                          </button>
                          {!shut && <ul className="pl-8 pr-4">{a.items.map(renderRow)}</ul>}
                        </div>
                      );
                    })}
                    {c.loose.length > 0 && (
                      <>
                        {c.areas.length > 0 && (
                          <p className="eyebrow border-b border-line py-1.5 pl-8 pr-4 text-ink-faint">No area</p>
                        )}
                        <ul className="pl-8 pr-4">{c.loose.map(renderRow)}</ul>
                      </>
                    )}
                  </>
                )}
              </section>
            );
          })}
          <div className="h-4" />
        </div>
      ) : areaGroups ? (
        <div className="min-h-0 flex-1 overflow-y-auto">
          {areaGroups.map((g) => {
            // a collapsed group still opens to reveal a pin picked on the map
            const shut = collapsedAreas.has(g.id) && !g.items.some((p) => p.id === selected);
            return (
              <section key={g.id || "none"}>
                <button
                  onClick={() => toggleAreaCollapsed(g.id)}
                  className="sticky top-0 z-[1] flex w-full items-center gap-2 border-b border-line bg-bg px-4 py-1.5 text-left"
                >
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: g.tone }} />
                  <span className="eyebrow min-w-0 flex-1 truncate font-medium">{g.name}</span>
                  <span className="shrink-0 text-2xs tabular-nums text-ink-faint">{g.items.length}</span>
                  <Icon name="chevron" size={12} className={`shrink-0 text-ink-faint transition-transform ${shut ? "" : "rotate-90"}`} />
                </button>
                {!shut && <ul className="px-4">{g.items.map(renderRow)}</ul>}
              </section>
            );
          })}
          {areaGroups.length === 0 && (
            <p className="meta px-4 py-6">
              {places.length === 0
                ? "No places yet. Add one above, or paste a Google My Maps link in Manage to import your pins."
                : "No places in this view. Clear the area or category filter."}
            </p>
          )}
          <div className="h-4" />
        </div>
      ) : (
        <ul className="min-h-0 flex-1 overflow-y-auto px-4">
          {scoped.map(renderRow)}
          {scoped.length === 0 && (
            <li className="meta py-6">
              {places.length === 0
                ? "No places yet. Add one above, or paste a Google My Maps link in Manage to import your pins."
                : scope?.startsWith("day:")
                  ? "Nothing on the map for today. Pick “All”, or add a place above."
                  : "No places in this city yet. Pick “All”, or add one above."}
            </li>
          )}
          <li className="h-4" />
        </ul>
      )}

      {/* sync footer */}
      <div className="shrink-0 border-t border-line px-4 py-2.5 text-xs text-ink-soft">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span>
            {imported > 0 ? `${imported} pins from Google My Maps` : "No My Maps pins"}
            {syncedAt ? ` · synced ${rel(syncedAt)}` : ""}
          </span>
          {url && (
            <button onClick={runSync} disabled={busy} className="font-medium text-accent disabled:opacity-50">
              {busy ? "syncing…" : "Sync"}
            </button>
          )}
        </div>
        {msg && <p className="mt-1 text-accent">{msg}</p>}
        {imported > 0 && <p className="mt-0.5 text-2xs text-ink-faint">Syncing replaces imported pins. Your added places and notes are kept.</p>}
        {!url && (
          <p className="mt-1 text-2xs text-ink-faint">
            Add a My Maps link in{" "}
            <Link to="/manage" className="text-accent">
              Manage
            </Link>{" "}
            to import pins.
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div ref={shellRef} className="fixed inset-x-0 bottom-[56px] top-[calc(3.5rem+var(--demo-h,0px))] z-20 md:bottom-0 md:left-[72px]">
      {/* map */}
      <div className="absolute inset-0 md:left-[340px]">
        <MapView
          places={scoped}
          selectedId={selected}
          derivedIds={derived}
          areaShapes={areaShapes}
          transit={transit}
          categoryIcons={data.config.categoryIcons}
          dark={dark}
          onSelect={setSelected}
          onMapClick={onMapClick}
          onLongPress={onLongPress}
          onReady={(m) => {
            map.current = m;
            fitScope();
          }}
        />
        {adding && (
          <div className="pointer-events-none absolute inset-x-0 top-0 bg-accent/90 py-1.5 text-center text-xs font-medium text-white">
            Adding a place — search, or tap the map
          </div>
        )}
      </div>

      {/* desktop column */}
      <div className="absolute left-0 top-0 bottom-0 z-10 hidden w-[340px] border-r border-line bg-bg md:block">
        {panel}
      </div>

      {/* mobile sheet */}
      <div
        ref={sheetRef}
        style={{ height: `${sheetHeight}px` }}
        className={`absolute inset-x-0 bottom-0 z-10 flex flex-col border-t border-line bg-bg md:hidden ${dragging ? "" : "transition-[height] duration-200 ease-paper"}`}
      >
        <button
          onPointerDown={onHandlePointerDown}
          onPointerMove={onHandlePointerMove}
          onPointerUp={onHandlePointerUp}
          onPointerCancel={onHandlePointerUp}
          onClick={onHandleClick}
          aria-label="Resize list"
          className="mx-auto mt-2 mb-1 h-1 w-9 shrink-0 touch-none rounded-full bg-ink/25"
        />
        <div className="min-h-0 flex-1">{panel}</div>
      </div>
    </div>
  );
}

type ReviewGroup = AreaSuggestion & { keep: boolean; auto: boolean };

function PlaceRow({
  place,
  open,
  dayId,
  derived,
  days,
  areas,
  categoryIcons,
  loc,
  onToggle,
  onNote,
  onName,
  onAddToDay,
  onToggleArea,
  onRemove,
}: {
  place: Place;
  open: boolean;
  dayId?: string;
  derived?: boolean;
  days: TripData["days"];
  areas: Area[];
  categoryIcons?: Record<string, string>;
  loc: string;
  onToggle: () => void;
  onNote: (v: string) => void;
  onName: (v: string) => void;
  onAddToDay: (dayId: string) => void;
  onToggleArea: (areaId: string) => void;
  onRemove: () => void;
}) {
  const readOnly = useReadOnly();
  const link = gmapsLink(place.url || place.name);
  const day = dayId ? days.find((d) => d.id === dayId) : undefined;
  const li = useRef<HTMLLIElement>(null);
  useEffect(() => {
    if (open) li.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [open]);
  // scroll-margin below gives `block: "nearest"` a little breathing room so an
  // opened row never lands flush against the list's top edge.
  const metaBits = [place.category, day && `on ${fmtDate(day.date, loc, { weekday: "short", day: "numeric" })}`].filter(Boolean).join(" · ");
  const catGlyph = place.category ? categoryIcons?.[place.category] : undefined;
  // an imported pin keeps its own colour (matches its map marker); an app-native
  // pin has no real colour, so tint it by category instead
  const ownColour = place.color && !DEFAULT_PIN_COLORS.has(place.color) ? place.color : undefined;
  return (
    <li ref={li} className="scroll-my-3 border-b border-line last:border-b-0">
      <button onClick={onToggle} className={`flex w-full items-center gap-3 py-2 text-left ${derived ? "opacity-60" : ""}`}>
        <IconTile
          size="sm"
          glyph={catGlyph}
          name={catGlyph ? undefined : "pin"}
          color={ownColour}
          tone={toneForPlaceCategory(place.category, categoryIcons)}
        />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium leading-snug text-ink">{place.name}</span>
          {(metaBits || derived) && (
            <span className="meta block truncate">{[derived && "from area", metaBits].filter(Boolean).join(" · ")}</span>
          )}
        </span>
        <Icon name="chevron" size={13} className={`shrink-0 text-ink-faint transition-transform ${open ? "rotate-90" : ""}`} />
      </button>

      {open && (
        <div className="pb-3.5 pl-[calc(22px+0.75rem)] pr-1">
          {place.source && !readOnly && (
            <div className="mb-2">
              <Editable label="Name" value={place.name} onCommit={onName} className="text-sm font-medium" />
            </div>
          )}
          {readOnly ? (
            place.note && <p className="note whitespace-pre-wrap text-ink-soft">{place.note}</p>
          ) : (
            <Editable
              as="textarea"
              label="Note"
              value={place.note ?? ""}
              placeholder="＋ a note for this place"
              onCommit={onNote}
              className="note text-ink-soft"
            />
          )}

          {/* Areas this place belongs to — "where", separate from its category */}
          {areas.length > 0 && (
            readOnly ? (
              areas.some((a) => a.placeIds.includes(place.id)) && (
                <p className="mt-2 text-xs text-ink-soft">
                  Area: {areas.filter((a) => a.placeIds.includes(place.id)).map((a) => a.name || "Untitled").join(" · ")}
                </p>
              )
            ) : (
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {areas.map((a) => {
                  const on = a.placeIds.includes(place.id);
                  return (
                    <button
                      key={a.id}
                      onClick={() => onToggleArea(a.id)}
                      className={`rounded-full border px-2.5 py-0.5 text-2xs ${on ? "border-accent text-accent" : "border-line text-ink-soft hover:border-ink-soft"}`}
                    >
                      {a.name || "Untitled"}
                    </button>
                  );
                })}
              </div>
            )
          )}

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm">
            {link && (
              <a href={link} target="_blank" rel="noopener" className="action">
                <Icon name="map" size={14} /> Open in Google Maps
              </a>
            )}
            {day ? (
              <Link to={`/day/${day.id}`} className="link-quiet inline-flex items-center gap-1">
                <Icon name="itinerary" size={14} /> View day
              </Link>
            ) : (
              !readOnly && (
                <label className="inline-flex items-center gap-1 text-ink-soft">
                  <Icon name="plus" size={13} className="shrink-0" />
                  <span className="sr-only">Add to a day</span>
                  <select
                    defaultValue=""
                    onChange={(e) => e.target.value && onAddToDay(e.target.value)}
                    className="cursor-pointer bg-transparent focus:outline-none"
                  >
                    <option value="">Add to a day…</option>
                    {[...days]
                      .sort((a, b) => a.date.localeCompare(b.date))
                      .map((d) => (
                        <option key={d.id} value={d.id}>
                          {fmtDate(d.date, loc, { weekday: "short", day: "numeric", month: "short" })}
                          {d.title ? ` · ${d.title}` : ""}
                        </option>
                      ))}
                  </select>
                </label>
              )
            )}
            {!place.source && !readOnly && (
              <ConfirmButton onConfirm={onRemove} label="Remove place" className="inline-flex items-center gap-1 text-ink-faint hover:text-accent">
                <Icon name="trash" size={14} /> Remove
              </ConfirmButton>
            )}
          </div>
        </div>
      )}
    </li>
  );
}

function rel(iso: string): string {
  const s = (Date.now() - +new Date(iso)) / 1000;
  if (s < 90) return "just now";
  if (s < 3600) return `${Math.round(s / 60)}m ago`;
  if (s < 86400) return `${Math.round(s / 3600)}h ago`;
  return `${Math.round(s / 86400)}d ago`;
}

/* ---- suggest areas review ---------------------------------------- */

function SuggestReview({
  groups,
  places,
  naming,
  onChange,
  onApply,
  onCancel,
}: {
  groups: ReviewGroup[];
  places: Place[];
  naming: boolean;
  onChange: (next: ReviewGroup[]) => void;
  onApply: () => void;
  onCancel: () => void;
}) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const nameById = new Map(places.map((p) => [p.id, p.name] as const));
  const set = (i: number, patch: Partial<ReviewGroup>) => onChange(groups.map((g, j) => (j === i ? { ...g, ...patch } : g)));
  const keptCount = groups.filter((g) => g.keep && g.placeIds.length >= 2).length;

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-4 pt-3">
      {groups.length === 0 ? (
        <p className="meta py-4">
          Couldn’t spot any clear groups — the places are too spread out or too few. Add areas by hand in Manage.
        </p>
      ) : (
        <>
          <p className="meta mb-3">
            Found {plural(groups.length, "group")} of nearby places
            {naming ? ", naming them by neighbourhood…" : ". "}
            {!naming && "Untick any you don’t want, rename them, or open one to drop a place."}
          </p>
          <ul>
            {groups.map((g, i) => (
              <li key={i} className="border-b border-line py-2 last:border-b-0">
                <div className="flex items-center gap-2">
                  <button onClick={() => set(i, { keep: !g.keep })} aria-label={g.keep ? "Skip this group" : "Keep this group"} className="shrink-0">
                    <Icon name="check" size={14} className={g.keep ? "text-accent" : "text-ink-faint/30"} />
                  </button>
                  <input
                    value={g.name}
                    onChange={(e) => set(i, { name: e.target.value, auto: false })}
                    aria-label="Area name"
                    className="min-w-0 flex-1 border-b border-transparent bg-transparent pb-0.5 text-sm focus:border-line focus:outline-none"
                  />
                  <button onClick={() => setExpanded(expanded === i ? null : i)} className="shrink-0 text-xs text-ink-soft hover:text-ink">
                    {plural(g.placeIds.length, "place")}
                    <Icon name="chevron" size={12} className={`ml-1 inline align-[-1px] transition-transform ${expanded === i ? "rotate-90" : ""}`} />
                  </button>
                </div>
                {expanded === i && (
                  <ul className="mt-1.5 pl-6">
                    {g.placeIds.map((id) => (
                      <li key={id}>
                        <button
                          onClick={() => set(i, { placeIds: g.placeIds.filter((x) => x !== id) })}
                          className="link-quiet flex w-full items-center gap-2 py-1 text-left text-sm"
                        >
                          <Icon name="close" size={11} className="shrink-0 text-ink-faint" />
                          <span className="truncate">{nameById.get(id) ?? "place"}</span>
                        </button>
                      </li>
                    ))}
                    {g.placeIds.length < 2 && <li className="py-1 text-2xs text-ink-faint">needs at least 2 places</li>}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
      <div className="sticky bottom-0 mt-3 flex items-center gap-4 bg-bg py-2 text-sm">
        {keptCount > 0 && (
          <button onClick={onApply} className="font-medium text-accent hover:opacity-70">
            Create {plural(keptCount, "area")}
          </button>
        )}
        <button onClick={onCancel} className="link-quiet">Cancel</button>
      </div>
    </div>
  );
}

/* ---- area outlines ------------------------------------------------ *
 * Muted, distinguishable tones assigned by position — no colour picker.  */
const AREA_TONES = ["#6f83a0", "#7e947a", "#a2856a", "#94788e", "#6f9494", "#9e9772", "#8a8fa8", "#a08674"];

/** a closed ring of lng/lat points approximating a circle of `km` around a centre */
function circleRing(lng: number, lat: number, km: number, n = 56): [number, number][] {
  const dLat = km / 110.574;
  const dLng = km / (111.32 * Math.cos((lat * Math.PI) / 180));
  const ring: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * 2 * Math.PI;
    ring.push([lng + dLng * Math.cos(t), lat + dLat * Math.sin(t)]);
  }
  return ring;
}
