import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { MapView, type MLMap } from "@/components/MapView";
import { Editable } from "@/components/Editable";
import { Icon } from "@/components/Icon";
import { ConfirmButton } from "@/components/ConfirmButton";
import { useData } from "@/lib/data";
import { useApp } from "@/store/useApp";
import { tripClock, fmtDate, plural } from "@/lib/dates";
import { gmapsLink } from "@/lib/maps";
import { geocode, reverseGeocode, type GeoResult } from "@/lib/geocode";
import { haversineKm } from "@/lib/geo";
import { suggestAreas, type AreaSuggestion } from "@/lib/cluster";
import { useMode, isDark } from "@/lib/mode";
import { useReadOnly } from "@/lib/readonly";
import { TRANSIT_KINDS, TRANSIT_META } from "@/lib/transitLayers";
import { glyphPath } from "@/lib/mapGlyphs";
import type { Area, Day, DayPlace, Place, TripData } from "@/core/types";

const FALLBACK = "#5f7f9c";

/** the legend mark for a category chip: its glyph if it has one, else a dot */
function CatMark({ color, glyph, on }: { color: string; glyph?: string; on: boolean }) {
  const d = glyphPath(glyph);
  if (d)
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color}
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" aria-hidden="true">
        <path d={d} />
      </svg>
    );
  return (
    <span className="h-2.5 w-2.5 shrink-0 rounded-full"
      style={{ background: color, boxShadow: on ? `0 0 0 1px ${color}` : "none" }} />
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
const SNAP_H: Record<Snap, string> = {
  peek: "h-[132px]",
  half: "h-[46svh]",
  full: "h-[calc(100%-8px)]",
};
const NEXT: Record<Snap, Snap> = { peek: "half", half: "full", full: "peek" };

/**
 * During → today. Before → nearest upcoming day. After → last day. Else all.
 * But a day-scoped default only makes sense if that day actually has places
 * pinned to it — otherwise the map opens empty. Fall back to "all" when it does.
 */
function defaultScope(data: TripData): string {
  const c = tripClock(data);
  const days = [...data.days].sort((a, b) => a.date.localeCompare(b.date));
  let day: string | undefined;
  if (c.phase === "during" && c.today) day = c.today.id;
  else if (c.phase === "before") day = days.find((d) => d.date >= c.todayISO)?.id;
  else if (c.phase === "after") day = days.at(-1)?.id;

  const dayHasPlaces = day && (data.days.find((d) => d.id === day)?.places?.length ?? 0) > 0;
  return dayHasPlaces ? day! : "all";
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
  /** transit overlay — empty means nothing shown (opt-in). Persisted across trips. */
  const [transit, setTransit] = useState<Set<string>>(loadTransit);
  const [selected, setSelected] = useState<string | null>(null);
  const [snap, setSnap] = useState<Snap>("peek");

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

  const cats = useMemo(() => {
    const m = new Map<string, string>();
    for (const p of places) if (p.category && !m.has(p.category)) m.set(p.category, p.color || FALLBACK);
    return [...m].sort((a, b) => a[0].localeCompare(b[0]));
  }, [places]);

  const dayOfPlace = useMemo(() => {
    const m = new Map<string, string>();
    if (!data) return m;
    for (const d of data.days)
      for (const dp of d.places ?? []) if (dp.placeId) m.set(dp.placeId, d.id);
    return m;
  }, [data]);

  /** ids a day pulls in: explicit picks, and (live) everything in its areas */
  const dayIds = (d: Day | undefined) => {
    const explicit = (d?.places ?? []).map((x) => x.placeId).filter(Boolean) as string[];
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

  /** places for the current scope + which of them are inherited from an area (not explicit) */
  const { scoped, derived } = useMemo(() => {
    const pass = (p: Place) =>
      (catFilter.size === 0 || (!!p.category && catFilter.has(p.category))) &&
      (!areaAllowed || areaAllowed.has(p.id));
    if (!data) return { scoped: [] as Place[], derived: new Set<string>() };
    if (!scope || scope === "all" || scope.startsWith("area:")) {
      const ids = scope?.startsWith("area:") ? new Set(data.areas.find((a) => a.id === scope.slice(5))?.placeIds ?? []) : null;
      return { scoped: places.filter((p) => (!ids || ids.has(p.id)) && pass(p)), derived: new Set<string>() };
    }
    const days = scope.startsWith("leg:") ? data.days.filter((d) => d.legId === scope.slice(4)) : data.days.filter((d) => d.id === scope);
    const all = new Set<string>();
    const explicit = new Set<string>();
    for (const d of days) {
      const s = dayIds(d);
      s.all.forEach((id) => all.add(id));
      s.explicit.forEach((id) => explicit.add(id));
    }
    return {
      scoped: places.filter((p) => all.has(p.id) && pass(p)),
      derived: new Set([...all].filter((id) => !explicit.has(id))),
    };
  }, [data, places, scope, catFilter, areaAllowed]);

  /** the list grouped into collapsible area sections — only on the "all" scope,
   *  and only once areas exist. null → render the flat list instead. */
  const areaGroups = useMemo(() => {
    if (!data || data.areas.length === 0 || (scope && scope !== "all")) return null;
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
    return groups;
  }, [data, scope, scoped]);

  /** faint outline + label per area, for the "zoomed out" overview.
   *  Shown on All / By-area scopes; hidden when scoped to a day/stay. */
  const areaShapes = useMemo(() => {
    if (!data) return null;
    const onAreaScope = scope?.startsWith("area:") ? scope.slice(5) : null;
    const relevant = !scope || scope === "all";
    if (!relevant && !onAreaScope) return { type: "FeatureCollection" as const, features: [] };
    const byId = new Map(places.map((p) => [p.id, p]));
    const features = data.areas.flatMap((a, i) => {
      if (onAreaScope && a.id !== onAreaScope) return [];
      if (areaFilter.size > 0 && !areaFilter.has(a.id)) return [];
      const pts = a.placeIds.map((id) => byId.get(id)).filter(Boolean) as Place[];
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
  }, [data, places, scope, areaFilter]);

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
  const c = tripClock(data);

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
    const dp: DayPlace = { id: rid(), label: place.name, placeId: place.id, url: place.url };
    updateEntity<Day>("days", dayId, { places: [...(day.places ?? []), dp] });
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

  const scopeOptions: ScopeOption[] = [
    { value: "all", label: `All places · ${places.length}` },
    ...(c.today ? [{ value: c.today.id, label: `Today · ${c.today.title || fmtDate(c.today.date, loc)}` } as ScopeOption] : []),
    ...data.legs.map((l) => ({ value: `leg:${l.id}`, label: l.base, group: "By stay" as const })),
    ...[...data.days]
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((d) => ({
        value: d.id,
        label: `${fmtDate(d.date, loc, { weekday: "short", day: "numeric", month: "short" })}${d.title ? ` · ${d.title}` : ""}`,
        group: "By day" as const,
      })),
    ...[...data.areas]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((a) => ({
        value: `area:${a.id}`,
        label: `${a.name || "Untitled"}${a.placeIds.length ? ` · ${a.placeIds.length}` : ""}`,
        group: "By area" as const,
      })),
  ];

  const renderRow = (p: Place) => (
    <PlaceRow
      key={p.id}
      place={p}
      open={selected === p.id}
      dayId={dayOfPlace.get(p.id)}
      derived={derived.has(p.id)}
      days={data.days}
      areas={data.areas}
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
      {/* context bar */}
      <div className="shrink-0 border-b border-line px-4 pb-3 pt-3">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <ScopeMenu
              value={scope ?? "all"}
              options={scopeOptions}
              onChange={(v) => {
                setScope(v);
                setSelected(null);
              }}
            />
          </div>
          {readOnly ? null : adding ? (
            <button onClick={cancelAdd} className="link-quiet shrink-0 text-sm">
              Cancel
            </button>
          ) : (
            <button onClick={startAdd} className="action shrink-0 text-sm">
              <Icon name="plus" size={14} /> Add place
            </button>
          )}
        </div>

        {/* category filter — tap to narrow; none selected = all shown */}
        {cats.length > 0 && !adding && (
          <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1.5">
            {cats.map(([name, col]) => {
              const on = catFilter.size === 0 || catFilter.has(name);
              return (
                <button
                  key={name}
                  onClick={() => toggleCat(name)}
                  className={`inline-flex items-center gap-1.5 text-xs transition-opacity ${on ? "" : "opacity-35"}`}
                >
                  <CatMark color={col} glyph={data.config.categoryIcons?.[name]} on={on} />
                  <span className="capitalize">{name}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* area filter — tap to narrow the map (and list) to certain areas; none selected = all */}
        {data.areas.length > 0 && !adding && (
          <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-line pt-2.5">
            <span className="text-2xs uppercase tracking-[0.06em] text-ink-faint">Areas</span>
            {data.areas
              .map((a, i) => ({ a, col: AREA_TONES[i % AREA_TONES.length] }))
              .sort((x, y) => (x.a.name || "").localeCompare(y.a.name || ""))
              .map(({ a, col }) => {
                const on = areaFilter.size === 0 || areaFilter.has(a.id);
                return (
                  <button
                    key={a.id}
                    onClick={() => toggleAreaFilter(a.id)}
                    className={`inline-flex items-center gap-1.5 text-xs transition-opacity ${on ? "" : "opacity-35"}`}
                  >
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ background: col, boxShadow: on ? `0 0 0 1px ${col}` : "none" }}
                    />
                    {a.name || "Untitled"}
                  </button>
                );
              })}
          </div>
        )}

        {/* transit overlay — tap to show; drawn live from the basemap, works anywhere */}
        {!adding && (
          <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-line pt-2.5">
            <span className="text-2xs uppercase tracking-[0.06em] text-ink-faint">Transit</span>
            {TRANSIT_KINDS.map((kind) => {
              const on = transit.has(kind);
              const col = dark ? TRANSIT_META[kind].dark : TRANSIT_META[kind].light;
              return (
                <button
                  key={kind}
                  onClick={() => toggleTransit(kind)}
                  className={`inline-flex items-center gap-1.5 text-xs transition-opacity ${on ? "" : "opacity-35"}`}
                >
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: col, boxShadow: on ? `0 0 0 1px ${col}` : "none" }}
                  />
                  {TRANSIT_META[kind].label}
                </button>
              );
            })}
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

      {/* areas — create one by name, auto-suggest from the unsorted pile, or jump to full editing */}
      {!readOnly && !adding && review === null && (
        <div className="shrink-0 border-b border-line px-4 py-2 text-xs">
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
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <button
                onClick={() => setNamingArea(true)}
                className="inline-flex items-center gap-1 text-accent transition-opacity hover:opacity-70"
              >
                <Icon name="plus" size={12} className="align-[-1px]" />
                Add area
              </button>
              {ungrouped.length >= 4 && (
                <button
                  onClick={startSuggest}
                  className="inline-flex items-center gap-1 text-accent transition-opacity hover:opacity-70"
                >
                  <Icon name="explore" size={12} className="align-[-1px]" />
                  Suggest from {ungrouped.length} ungrouped
                </button>
              )}
              {data.areas.length > 0 && (
                <Link to="/manage?tab=content&section=areas" className="link-quiet ml-auto">Manage areas</Link>
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
      ) : areaGroups ? (
        <div className="min-h-0 flex-1 overflow-y-auto">
          {areaGroups.map((g) => {
            // a collapsed group still opens to reveal a pin picked on the map
            const shut = collapsedAreas.has(g.id) && !g.items.some((p) => p.id === selected);
            return (
              <section key={g.id || "none"}>
                <button
                  onClick={() => toggleAreaCollapsed(g.id)}
                  className="sticky top-0 z-[1] flex w-full items-center gap-2 border-b border-line bg-bg px-4 py-2 text-left"
                >
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: g.tone }} />
                  <span className="min-w-0 flex-1 truncate text-2xs font-medium uppercase tracking-[0.08em] text-ink-soft">{g.name}</span>
                  <span className="shrink-0 text-2xs tabular-nums text-ink-faint">{g.items.length}</span>
                  <Icon name={shut ? "down" : "up"} size={12} className="shrink-0 text-ink-faint" />
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
                : "No places in this view. Widen the scope or clear the category filter."}
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
    <div className="fixed inset-x-0 bottom-[56px] top-[calc(3.5rem+var(--demo-h,0px))] z-20 md:bottom-0 md:left-[72px]">
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
        className={`absolute inset-x-0 bottom-0 z-10 flex flex-col border-t border-line bg-bg transition-[height] duration-200 ease-paper md:hidden ${SNAP_H[snap]}`}
      >
        <button
          onClick={() => setSnap(NEXT[snap])}
          aria-label="Resize list"
          className="mx-auto mt-2 mb-1 h-1 w-9 shrink-0 rounded-full bg-ink/25"
        />
        <div className="min-h-0 flex-1">{panel}</div>
      </div>
    </div>
  );
}

type ScopeOption = { value: string; label: string; group?: "By stay" | "By day" | "By area" };
type ReviewGroup = AreaSuggestion & { keep: boolean; auto: boolean };

function ScopeMenu({ value, options, onChange }: { value: string; options: ScopeOption[]; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [up, setUp] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const current = options.find((o) => o.value === value) ?? options[0];
  let lastGroup: string | undefined;

  const toggle = () => {
    if (!open && btn.current) {
      const r = btn.current.getBoundingClientRect();
      setUp(window.innerHeight - r.bottom < 300);
    }
    setOpen((v) => !v);
  };

  return (
    <div className="relative">
      <button
        ref={btn}
        onClick={toggle}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Map scope: ${current?.label}`}
        className="flex max-w-[15rem] items-center gap-1 font-display text-[1.35rem] leading-tight"
      >
        <span className="truncate">{current?.label}</span>
        <Icon name="down" size={13} className={`shrink-0 text-ink-faint transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <div
            className={`absolute left-0 z-30 max-h-[min(60vh,24rem)] min-w-[15rem] overflow-y-auto border border-line bg-bg py-1 shadow-sm ${up ? "bottom-full mb-1.5" : "top-full mt-1.5"}`}
          >
            {options.map((o) => {
              const head = o.group && o.group !== lastGroup ? o.group : null;
              lastGroup = o.group;
              return (
                <div key={`${o.group ?? ""}:${o.value}`}>
                  {head && <p className="px-3 pb-1 pt-2.5 text-2xs font-normal uppercase tracking-[0.12em] text-ink-faint">{head}</p>}
                  <button
                    onClick={() => {
                      onChange(o.value);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm hover:bg-surface-2 ${o.value === value ? "font-medium text-accent" : "text-ink"}`}
                  >
                    <Icon name="check" size={13} className={`shrink-0 ${o.value === value ? "" : "opacity-0"}`} />
                    <span className="truncate">{o.label}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function PlaceRow({
  place,
  open,
  dayId,
  derived,
  days,
  areas,
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
  return (
    <li ref={li} className="scroll-my-3 border-b border-line last:border-b-0">
      <button onClick={onToggle} className={`flex w-full items-baseline gap-2.5 py-2 text-left ${derived ? "opacity-60" : ""}`}>
        <span
          className="h-2 w-2 shrink-0 translate-y-0.5 rounded-full"
          style={derived ? { boxShadow: `inset 0 0 0 1.5px ${place.color || FALLBACK}` } : { background: place.color || FALLBACK }}
        />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium leading-snug text-ink">{place.name}</span>
          {(metaBits || derived) && (
            <span className="meta block truncate">{[derived && "from area", metaBits].filter(Boolean).join(" · ")}</span>
          )}
        </span>
        <Icon name={open ? "up" : "down"} size={13} className="shrink-0 translate-y-0.5 text-ink-faint" />
      </button>

      {open && (
        <div className="pb-3.5 pl-5 pr-1">
          {place.source && !readOnly && (
            <div className="mb-2">
              <Editable label="Name" value={place.name} onCommit={onName} className="text-sm font-medium" />
            </div>
          )}
          {readOnly ? (
            place.note && <p className="whitespace-pre-wrap text-sm text-ink-soft">{place.note}</p>
          ) : (
            <Editable
              as="textarea"
              label="Note"
              value={place.note ?? ""}
              placeholder="＋ a note for this place"
              onCommit={onNote}
              className="text-sm text-ink-soft"
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
                      className={`rounded-[2px] border px-2 py-0.5 text-2xs ${on ? "border-accent text-accent" : "border-line text-ink-soft hover:border-ink-soft"}`}
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
              <a href={link} target="_blank" rel="noopener" className="font-medium text-accent">
                Open in Google Maps
              </a>
            )}
            {day ? (
              <Link to={`/day/${day.id}`} className="link-quiet">
                View day
              </Link>
            ) : (
              !readOnly && (
                <label className="text-ink-soft">
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
              <ConfirmButton onConfirm={onRemove} label="Remove place" className="text-ink-faint hover:text-accent">
                Remove
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
                    <Icon name={expanded === i ? "up" : "down"} size={12} className="ml-1 inline align-[-1px]" />
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
