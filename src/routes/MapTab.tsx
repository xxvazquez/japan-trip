import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type RefObject } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { MapView, type MLMap } from "@/components/MapView";
import { Editable } from "@/components/Editable";
import { RichNote } from "@/components/RichNote";
import { Icon } from "@/components/Icon";
import { IconTile } from "@/components/IconTile";
import { ConfirmButton } from "@/components/ConfirmButton";
import { ActionSheet, ConfirmMenuItem, useActionSheet } from "@/components/ActionSheet";
import { RowMenu } from "@/components/RowMenu";
import { ContextMenu } from "@/components/ContextMenu";
import { INSET_DIVIDER } from "@/components/InsetRow";
import { RowSelect } from "@/components/RowSelect";
import { TextPrompt } from "@/components/TextPrompt";
import { SearchField } from "@/components/SearchField";
import { useData } from "@/lib/data";
import { useToday } from "@/lib/useToday";
import { loadBasePois, saveBasePois } from "@/lib/mapStyle";
import { Switch } from "@/components/Switch";
import { useApp, undoable } from "@/store/useApp";
import { tripClock, fmtDate, plural } from "@/lib/dates";
import { mapUrlCoords, placeMapLink } from "@/lib/maps";
import { geocode, reverseGeocode, type GeoResult } from "@/lib/geocode";
import { haversineKm, fmtDistanceKm, fmtWalk, useGeolocation } from "@/lib/geo";
import { fmtMinutes } from "@/lib/time";
import { legHex } from "@/lib/legColors";
import { suggestAreas, type AreaSuggestion } from "@/lib/cluster";
import { useMode, isDark } from "@/lib/mode";
import { useReadOnly } from "@/lib/readonly";
import { menuHref, reviewHref, reviewSiteFor, useAutoReviewLink } from "@/lib/reviewSite";
import { glyphForCategoryName } from "@/lib/mapGlyphs";
import { hasFacts, placeArea, useAutoPlaceFacts, useFactsFailure, wantsFacts } from "@/lib/placeFacts";
import { PlaceAction, PlaceActions } from "@/components/PlaceAction";
import { ActionRow } from "@/components/ActionRow";
import { FactsRefresh, PlaceFactRows } from "@/components/PlaceFacts";
import { primeKeyboard } from "@/lib/keyboard";
import { TRANSIT_KINDS, TRANSIT_META } from "@/lib/transitLayers";
import { nearestStationFromMap, nearestStationLookup, type NearbyStation } from "@/lib/transitStation";
import { estimateWalk, useWalk } from "@/lib/walkRoute";
import { WalkLine } from "@/components/WalkLine";
import { ChipStrip } from "@/components/ChipStrip";
import { categoryName, glyphPath } from "@/lib/mapGlyphs";
import { placeColor, placeTile, AREA_TONES, NEUTRAL_TONE } from "@/lib/tones";
import { canonicalLegs } from "@/lib/cityAssign";
import { useCityAnchors, useTripCities } from "@/lib/cityCoords";
import { DEFAULT_ACCENT } from "@/lib/themePresets";
import type { Area, Day, PlanItem, Place, TripData } from "@/core/types";

const FALLBACK = DEFAULT_ACCENT;


/** the white grouped-inset card a run of place rows sits in, on the sheet's
 *  grey ground — what separates "an area" (a header on the ground) from "a
 *  place" (a row in a card), the way Settings and Reminders group a list */
const PLACE_CARD = "mx-4 isolate overflow-hidden rounded-[12px] bg-surface";
/** an area's name above its card — 17px Medium, one step above the 15px rows */
const AREA_TITLE = "block break-words text-[17px] leading-snug text-ink";
/** a place row's hairline, inset past its 28px tile (14px pad + 28 + 12 gap) */
/** a card row with a small tile in front: the hairline starts at the text */
const SM_TILE_DIVIDER = INSET_DIVIDER.replace("after:left-3.5", "after:left-12");
const TILE_DIVIDER =
  "relative after:pointer-events-none after:absolute after:bottom-0 after:left-[3.375rem] after:right-0 after:h-[var(--hair)] after:bg-line last:after:hidden";

/** an area's two farthest-apart places (its "width", not a tour of everywhere
 *  in it) — cheap local haversine just to find *which* pair, real walking
 *  time for that one pair comes from `useWalk` (see `AreaWalkSpan`).
 *  Null with fewer than two placed points to span. */
function farthestPair(items: Place[]): [Place, Place] | null {
  const pts = items.filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng));
  if (pts.length < 2) return null;
  let best: [Place, Place] = [pts[0], pts[1]];
  let maxKm = haversineKm(pts[0].lat, pts[0].lng, pts[1].lat, pts[1].lng);
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const km = haversineKm(pts[i].lat, pts[i].lng, pts[j].lat, pts[j].lng);
      if (km > maxKm) { maxKm = km; best = [pts[i], pts[j]]; }
    }
  }
  return best;
}

/** an area row's subtitle — walking time and distance between its
 *  two farthest-apart places, found cheaply via `farthestPair` first so only
 *  one route request is needed per area, not one per pair. A straight-line
 *  estimate shows first (always behind a "≈"), then the real street route. */
function AreaWalkSpan({ items }: { items: Place[] }) {
  const pair = farthestPair(items);
  const route = useWalk(pair?.[0] ?? { lat: 0, lng: 0 }, pair?.[1]);
  if (!pair || !route) return null;
  return <span className="block text-[15px] leading-snug text-ink-faint">Spans {fmtDistanceKm(route.km)} · {fmtMinutes(route.min)} walk</span>;
}

/** an area as a row of its city's card — the iOS outline list (Files' list
 *  view): a tile like its places' (a folder sits beside its files the same
 *  way), a disclosure chevron that turns down when open, its places
 *  following in the same card. The tile doubles as the area's map filter. */
function AreaRow({
  name, tone, items, open, dim, walk = true, onToggle, onSolo,
}: {
  name: string;
  tone: string;
  items: Place[];
  open: boolean;
  dim?: boolean;
  /** show the walk-across subtitle — not on the "No area" bucket */
  walk?: boolean;
  onToggle: () => void;
  onSolo?: () => void;
}) {
  return (
    <li className={`${TILE_DIVIDER} transition-opacity ${dim ? "opacity-40" : ""}`}>
      <div className="flex items-center">
        {onSolo ? (
          <button
            onClick={onSolo}
            aria-label={dim ? `Show ${name} on the map` : `Show only ${name} on the map`}
            aria-pressed={!dim}
            className="flex shrink-0 items-center self-stretch pl-3.5 pr-3"
          >
            <IconTile name="map" color={tone} />
          </button>
        ) : (
          <span className="flex shrink-0 items-center self-stretch pl-3.5 pr-3">
            <IconTile name="map" color={tone} ghost={!walk} />
          </span>
        )}
        <button
          onClick={onToggle}
          aria-expanded={open}
          className="flex min-h-[44px] min-w-0 flex-1 items-center gap-2 py-2.5 pr-3.5 text-left active:bg-ink/[0.07]"
        >
          <span className="min-w-0 flex-1">
            <span className={AREA_TITLE}>{name}</span>
            {walk && <AreaWalkSpan items={items} />}
          </span>
          <span className="shrink-0 text-[17px] tabular-nums text-ink-faint">{items.length}</span>
          <Icon name="chevron" size={13} className={`shrink-0 text-ink-faint transition-transform ${open ? "rotate-90" : ""}`} />
        </button>
      </div>
    </li>
  );
}

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

// city groups the person shut in the "All" list — remembered per trip too
const SHUT_CITIES_PREFIX = "za.map.shutCities.";
const loadShutCities = (tripId: string | null): Set<string> => {
  if (!tripId) return new Set();
  try {
    const v = JSON.parse(localStorage.getItem(SHUT_CITIES_PREFIX + tripId) ?? "[]");
    return new Set(Array.isArray(v) ? v : []);
  } catch {
    return new Set();
  }
};
const saveShutCities = (tripId: string | null, ids: string[]) => {
  if (!tripId) return;
  try {
    localStorage.setItem(SHUT_CITIES_PREFIX + tripId, JSON.stringify(ids));
  } catch {
    /* private window */
  }
};

// areas start collapsed every time unless the trip's own record says this one
// was left open — tracks *opened* ids (not collapsed ones) so an area added
// later still defaults shut without needing a special case.
const OPEN_AREAS_PREFIX = "za.map.openAreas.";
const loadOpenAreaIds = (tripId: string | null): Set<string> => {
  if (!tripId) return new Set();
  try {
    const raw = localStorage.getItem(OPEN_AREAS_PREFIX + tripId);
    const v = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(v) ? v : []);
  } catch {
    return new Set();
  }
};
const saveOpenAreaIds = (tripId: string | null, ids: string[]) => {
  if (!tripId) return;
  try {
    localStorage.setItem(OPEN_AREAS_PREFIX + tripId, JSON.stringify(ids));
  } catch {
    /* private window */
  }
};

type Snap = "peek" | "half" | "full";
/** a small preview, just past the city pills; enough of "half" to be worth
 *  defaulting to when there's a list; "full" leaves an 8px peek of map.
 *  "half" itself is capped at this ratio but shrinks to fit a short list
 *  instead — see `halfFitPx` below. */
const PEEK_PX = 132;
const HALF_RATIO = 0.58;
const FULL_GAP_PX = 8;
/** "half" never lands closer to "peek" than this — a short list still gets a
 *  visible bump when the handle is tapped, not a no-op. */
const HALF_MIN_PX = PEEK_PX + 64;
const snapPx = (s: Snap, containerH: number): number =>
  s === "peek" ? PEEK_PX : s === "half" ? Math.round(containerH * HALF_RATIO) : containerH - FULL_GAP_PX;
const NEXT: Record<Snap, Snap> = { peek: "half", half: "full", full: "peek" };
/** a tap (vs. a real drag) on the handle just cycles to the next stop */
const TAP_SLOP_PX = 6;

// the desktop column's counterpart to the mobile sheet: a real drag on the
// right edge, continuous rather than snapped (a mouse is precise enough that
// stops would just get in the way) — width remembered across visits.
const PANEL_KEY = "za.map.panelW";
const PANEL_MIN_PX = 280;
const PANEL_MAX_PX = 640;
const PANEL_DEFAULT_PX = 340;
const loadPanelWidth = (): number => {
  try {
    const n = Number(localStorage.getItem(PANEL_KEY));
    return Number.isFinite(n) && n > 0 ? Math.min(Math.max(n, PANEL_MIN_PX), PANEL_MAX_PX) : PANEL_DEFAULT_PX;
  } catch {
    return PANEL_DEFAULT_PX;
  }
};

// "List" hides the map and lets the place list fill the whole screen — for
// area/city management work where the map itself isn't what you need to see.
// Remembered like the panel width, since it's a real mode switch, not a
// one-off peek.
const LIST_ONLY_KEY = "za.map.listOnly";
const loadListOnly = (): boolean => {
  try {
    return localStorage.getItem(LIST_ONLY_KEY) === "1";
  } catch {
    return false;
  }
};

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
  return legId ? `leg:${canonicalLegs(data).get(legId) ?? legId}` : "all";
}

/** the mobile sheet's handle: a real drag (not just a tap-to-cycle button),
 *  snapping to the nearest of peek/half/full on release. "half" shrinks to
 *  fit a short list instead of always jumping to the full ratio — a couple
 *  of areas shouldn't open onto a sheet that's mostly empty space.
 *  `panelRootRef` sits on the mobile sheet's own copy of `panel` (its
 *  top-level flex column: handle-adjacent context bar, the scrolling list,
 *  the sync footer…); `listOuterRef` sits on whichever list branch is
 *  rendering (the one flex-1 child in that column). Measuring at the
 *  *current* snap state directly (sheet.offsetHeight minus the list's
 *  clipped clientHeight) breaks when the sheet is currently shorter than the
 *  chrome's own natural height — "peek" clips the list to 0 but doesn't grow
 *  the chrome to fit, so that subtraction would read the wrong, squeezed
 *  chrome height instead of the real one. Walking `panelRootRef`'s children
 *  directly sidesteps that: every shrink-0 sibling reports its own true
 *  natural offsetHeight regardless of how little room the sheet currently
 *  gives it (flex-shrink: 0 never shrinks below content size, it just
 *  overflows), and the one flex-1 child (the list) is measured the same way
 *  `CenterIfShort` does — the sum of its own children's natural heights, not
 *  its own (possibly clipped) scrollHeight. */
function useSheetSnap(shellRef: RefObject<HTMLDivElement | null>) {
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const [containerH, setContainerH] = useState(0);
  const [snap, setSnap] = useState<Snap>("peek");
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ y: number; h: number } | null>(null);
  const suppressClick = useRef(false);

  useEffect(() => {
    const el = shellRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setContainerH(entry.contentRect.height));
    ro.observe(el);
    return () => ro.disconnect();
  }, [shellRef]);

  const panelRootRef = useRef<HTMLElement | null>(null);
  const setPanelRoot = (el: HTMLElement | null) => { panelRootRef.current = el; };
  const listOuterRef = useRef<HTMLElement | null>(null);
  const setListOuter = (el: HTMLElement | null) => { listOuterRef.current = el; };
  const [halfFitPx, setHalfFitPx] = useState<number | null>(null);
  useLayoutEffect(() => {
    const root = panelRootRef.current, listOuter = listOuterRef.current;
    if (!root) { setHalfFitPx(null); return; }
    let total = 0;
    for (const child of root.children) {
      if (child === listOuter) {
        for (const row of listOuter.children) total += (row as HTMLElement).offsetHeight;
      } else {
        total += (child as HTMLElement).offsetHeight;
      }
    }
    setHalfFitPx(total);
  });

  const availH = containerH || window.innerHeight - 112;
  const halfStopPx = Math.min(Math.max(halfFitPx ?? Infinity, HALF_MIN_PX), Math.round(availH * HALF_RATIO));
  const stopPx = (s: Snap): number => (s === "half" ? halfStopPx : snapPx(s, availH));
  const sheetHeight = stopPx(snap);

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
      setSnap(stops.reduce((best, s) => (Math.abs(stopPx(s) - finalH) < Math.abs(stopPx(best) - finalH) ? s : best)));
    }
    dragStart.current = null;
  };
  const onHandleClick = () => {
    if (suppressClick.current) { suppressClick.current = false; return; }
    setSnap(NEXT[snap]); // keyboard activation — no pointer sequence to read a drag from
  };

  return {
    sheetRef, snap, setSnap, sheetHeight, dragging, setPanelRoot, setListOuter,
    onHandlePointerDown, onHandlePointerMove, onHandlePointerUp, onHandleClick,
  };
}

/** the desktop column's own drag handle, on its right edge — same idea as the
 *  mobile handle above (mutate the DOM directly while dragging, commit to
 *  state only on release) but a plain continuous width, not a snap. */
function usePanelDrag(shellRef: RefObject<HTMLDivElement | null>) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [panelWidth, setPanelWidth] = useState(loadPanelWidth);
  const [panelDragging, setPanelDragging] = useState(false);
  const panelDragStart = useRef<{ x: number; w: number } | null>(null);

  const onPanelHandlePointerDown = (e: ReactPointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    panelDragStart.current = { x: e.clientX, w: panelRef.current?.getBoundingClientRect().width ?? panelWidth };
    setPanelDragging(true);
  };
  const onPanelHandlePointerMove = (e: ReactPointerEvent) => {
    if (!panelDragStart.current || !shellRef.current) return;
    const next = Math.min(Math.max(panelDragStart.current.w + (e.clientX - panelDragStart.current.x), PANEL_MIN_PX), PANEL_MAX_PX);
    // set on the shared ancestor, not the panel itself — the map div reads the
    // same custom property to keep its left edge flush against the panel
    shellRef.current.style.setProperty("--panel-w", `${next}px`);
  };
  const onPanelHandlePointerUp = () => {
    if (!panelDragStart.current || !panelRef.current) return;
    setPanelDragging(false);
    const finalW = panelRef.current.getBoundingClientRect().width;
    setPanelWidth(finalW);
    try { localStorage.setItem(PANEL_KEY, String(Math.round(finalW))); } catch { /* private window — nothing to persist */ }
    panelDragStart.current = null;
  };

  return {
    panelRef, panelWidth, panelDragging,
    onPanelHandlePointerDown, onPanelHandlePointerMove, onPanelHandlePointerUp,
  };
}

/** "add a place" (search/pin-drop) and "suggest areas" (auto-group + review)
 *  share one editing-mode state machine — starting either one cancels
 *  whatever the other was mid-flight, so they're grouped in one hook rather
 *  than two that would each need to know how to reset the other. */
function useMapEditing(
  mapRef: RefObject<MLMap | null>,
  onSelect: (id: string | null) => void,
  bumpSheetOpen: () => void,
  placeCity: Map<string, string>,
  dayCity: Map<string, string>,
) {
  const data = useData();
  const readOnly = useReadOnly();
  const updateEntity = useApp((s) => s.updateEntity);
  const addEntity = useApp((s) => s.addEntity);

  const places = data?.places ?? [];
  const areas = data?.areas ?? [];
  /** the groups "Suggest areas" would offer — new areas, and places to add
   *  to existing ones — worked out up front so the link only shows when
   *  there's something to suggest (scattered places can still form no
   *  group). Grouped city by city, sized to the days spent in each. Keyed on
   *  ids, coordinates, area membership and cities, so renaming a place
   *  doesn't re-run the clustering. */
  const suggestKey = [
    places.map((p) => `${p.id}:${p.lat},${p.lng}:${placeCity.get(p.id) ?? ""}`).join("|"),
    areas.map((a) => `${a.id}:${a.placeIds.join(",")}`).join("|"),
    [...dayCity.values()].sort().join("|"),
  ].join("#");
  const suggestions = useMemo(() => {
    const daysInCity = new Map<string, number>();
    for (const c of dayCity.values()) daysInCity.set(c, (daysInCity.get(c) ?? 0) + 1);
    return suggestAreas(places, areas, { placeCity, daysInCity });
  }, [suggestKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const [adding, setAdding] = useState(false);
  const [q, setQ] = useState("");
  const [results, setResults] = useState<GeoResult[]>([]);
  const [pending, setPending] = useState<{ lat: number; lng: number; name: string } | null>(null);

  /** review state for "Suggest areas" — null when not suggesting */
  const [review, setReview] = useState<ReviewGroup[] | null>(null);
  /** true while the reverse-geocode pass is still filling in neighbourhood names */
  const [naming, setNaming] = useState(false);
  /** bumped whenever a suggestion run starts or ends, so a stale naming loop bails */
  const suggestRun = useRef(0);
  /** the "New Area" alert — true while it's open */
  const [namingArea, setNamingArea] = useState(false);
  /** inline area list open for rename / delete */
  const [editingAreas, setEditingAreas] = useState(false);

  // debounced place search (Nominatim)
  useEffect(() => {
    if (!adding || pending) return;
    const t = setTimeout(async () => {
      const c = mapRef.current?.getCenter();
      setResults(await geocode(q, c ? { lat: c.lat, lng: c.lng } : undefined, { high: true }));
    }, 400);
    return () => clearTimeout(t);
  }, [q, adding, pending, mapRef]);

  const startAdd = () => {
    setAdding(true);
    onSelect(null);
    setNamingArea(false);
    suggestRun.current++;
    setNaming(false);
    setReview(null);
    bumpSheetOpen();
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
    onSelect(id);
    mapRef.current?.easeTo({ center: [lng, lat], zoom: Math.max(mapRef.current.getZoom(), 14) });
  };

  const onMapClick = (lat: number, lng: number) => {
    if (adding) {
      primeKeyboard(); // the map tap raises the naming alert's keyboard on iPhone
      setPending({ lat, lng, name: "" });
    } else onSelect(null);
  };
  const onLongPress = (lat: number, lng: number) => {
    if (readOnly) return;
    setAdding(true);
    onSelect(null);
    setPending({ lat, lng, name: "" });
  };

  const startSuggest = () => {
    const found = suggestions;
    onSelect(null);
    setAdding(false);
    setNamingArea(false);
    bumpSheetOpen();
    // a group joining an existing area keeps that area's name — nothing to look up
    const groups: ReviewGroup[] = found.map((s) => ({ ...s, keep: true, auto: !s.areaId }));
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
    if (!data) return;
    for (const g of review ?? []) {
      if (!g.keep || g.placeIds.length < (g.areaId ? 1 : 2)) continue;
      const into = g.areaId && data.areas.find((a) => a.id === g.areaId);
      if (into) {
        updateEntity<Area>("areas", into.id, { placeIds: [...new Set([...into.placeIds, ...g.placeIds])] });
        continue;
      }
      const name = g.name || "Area";
      const dup = data.areas.find((a) => (a.name || "").trim().toLowerCase() === name.trim().toLowerCase());
      if (dup) {
        updateEntity<Area>("areas", dup.id, { placeIds: [...new Set([...dup.placeIds, ...g.placeIds])] });
      } else {
        addEntity("areas", { id: crypto.randomUUID?.() ?? rid(), name, placeIds: g.placeIds } as never);
      }
    }
    endSuggest();
  };
  const createArea = (name: string) => {
    if (!data) return;
    const dup = data.areas.find((a) => (a.name || "").trim().toLowerCase() === name.toLowerCase());
    if (!dup) addEntity("areas", { id: crypto.randomUUID?.() ?? rid(), name, placeIds: [] } as never);
  };

  return {
    suggestions,
    adding, q, setQ, results, pending, setPending,
    startAdd, cancelAdd, commitPlace, onMapClick, onLongPress,
    review, setReview, naming,
    namingArea, setNamingArea, editingAreas, setEditingAreas,
    startSuggest, endSuggest, applyReview, createArea,
  };
}

export default function MapTab() {
  const data = useData();
  const updateEntity = useApp((s) => s.updateEntity);
  const removeEntity = useApp((s) => s.removeEntity);
  const syncMyMap = useApp((s) => s.syncMyMap);
  const readOnly = useReadOnly();
  const [mode] = useMode();
  const dark = isDark(mode);

  const map = useRef<MLMap | null>(null);
  /** flips once on the map's first load — a place row's nearest-station
   *  lookup waits for this instead of finding `map.current` still null and
   *  reaching for Overpass on every cold load. */
  const [mapReady, setMapReady] = useState(false);
  const [scope, setScope] = useState<string | null>(null);
  /** category filter — empty means "all categories". Combines with any scope. */
  const [catFilter, setCatFilter] = useState<Set<string>>(new Set());
  /** area filter — empty means "all areas". Combines with scope + category. */
  const [areaFilter, setAreaFilter] = useState<Set<string>>(new Set());
  const tripId = useApp((s) => s.activeId);
  /** area groups opened in the list, by area id ("" = the "no area" group) —
   *  every area starts shut; opening one is remembered per trip, so it stays
   *  shut again next visit only if it was never opened. A newly added area
   *  defaults shut with no special-casing needed. Nothing but a tap on the
   *  group's own header opens or shuts it — picking a pin on the map shows
   *  that place in its own card at the top instead of springing its group
   *  open. Written straight to storage on every change (not from an effect),
   *  so switching trips can never write one trip's state over another's. */
  const [openAreas, setOpenAreasState] = useState<Set<string>>(() => loadOpenAreaIds(tripId));
  useEffect(() => setOpenAreasState(loadOpenAreaIds(tripId)), [tripId]);
  const setOpenAreas = (fn: (prev: Set<string>) => Set<string>) =>
    setOpenAreasState((prev) => {
      const next = fn(prev);
      saveOpenAreaIds(tripId, [...next]);
      return next;
    });
  /** city groups shut in the "All" list, by leg id ("" = the "no city" group) — remembered per trip */
  const [collapsedCities, setCollapsedCitiesState] = useState<Set<string>>(() => loadShutCities(tripId));
  useEffect(() => setCollapsedCitiesState(loadShutCities(tripId)), [tripId]);
  const setCollapsedCities = (fn: (prev: Set<string>) => Set<string>) =>
    setCollapsedCitiesState((prev) => {
      const next = fn(prev);
      saveShutCities(tripId, [...next]);
      return next;
    });
  /** transit overlay — empty means nothing shown (opt-in). Persisted across trips. */
  const [transit, setTransit] = useState<Set<string>>(loadTransit);
  /** the base map's own places (stations, parks, shops) — off to see only yours */
  const [basePois, setBasePois] = useState(loadBasePois);
  const toggleBasePois = (on: boolean) => { setBasePois(on); saveBasePois(on); };
  const [selected, setSelected] = useState<string | null>(null);
  /** the header's ⋯ menu — list/map, filters, area upkeep, sync */
  const moreSheet = useActionSheet();
  /** the "Filters" (category, transit) sheet — real filtering, split out from area upkeep above */
  const filterSheet = useActionSheet();
  /** hides the map, list fills the screen — see LIST_ONLY_KEY above */
  const [listOnly, setListOnly] = useState(loadListOnly);
  const setListOnlyPersist = (v: boolean) => {
    setListOnly(v);
    try { localStorage.setItem(LIST_ONLY_KEY, v ? "1" : "0"); } catch { /* private window */ }
  };
  /** "Nearby now" toggle on the Today list — not persisted, so it never asks
   *  for location on its own next time the trip opens. */
  const [nearbyOn, setNearbyOn] = useState(false);
  const today = useToday();
  /** the "Today" pill's own scope id, so the toggle only ever applies there */
  const todayScopeId = useMemo(() => {
    if (!data) return null;
    const c = tripClock(data);
    return c.phase === "during" && c.today ? `day:${c.today.id}` : null;
  }, [data, today]);
  const nearbyActive = nearbyOn && !!todayScopeId && scope === todayScopeId;
  const geo = useGeolocation(nearbyActive);

  const shellRef = useRef<HTMLDivElement | null>(null);
  const {
    sheetRef, snap, setSnap, sheetHeight, dragging, setPanelRoot, setListOuter,
    onHandlePointerDown, onHandlePointerMove, onHandlePointerUp, onHandleClick,
  } = useSheetSnap(shellRef);
  const {
    panelRef, panelWidth, panelDragging,
    onPanelHandlePointerDown, onPanelHandlePointerMove, onPanelHandlePointerUp,
  } = usePanelDrag(shellRef);

  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  /** layers the last sync found with no category chosen yet */
  const [newLayers, setNewLayers] = useState<string[]>([]);

  /** each place's "home city" (leg) — see `placeLegMap` for how it's guessed
   *  (or overridden by hand). Lets a whole city's imported pins sit under
   *  its pill even before they're linked to a day. */
  const cityAnchors = useCityAnchors(data);
  /** the trip's cities as pills: stays by city (two Tokyo stays are one
   *  Tokyo) plus day trips to other towns (Nara from Kyoto) — each place's
   *  city and each day's, so a pill, the list groups and the counts agree */
  const { cityLeg, tripCities, dayCity, placeCity: placeLeg } = useTripCities(data, cityAnchors);

  const {
    suggestions,
    adding, q, setQ, results, pending, setPending,
    startAdd, cancelAdd, commitPlace, onMapClick, onLongPress,
    review, setReview, naming,
    namingArea, setNamingArea, editingAreas, setEditingAreas,
    startSuggest, endSuggest, applyReview, createArea,
  } = useMapEditing(map, setSelected, () => setSnap((s) => (s === "peek" ? "half" : s)), placeLeg, dayCity);

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
      setOpenAreas((prev) => new Set(prev).add(area));
    }
    setParams((p) => { p.delete("area"); return p; }, { replace: true });
  }, [data, params, setParams]);

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
    const colors = data?.config.categoryColors;
    for (const p of places) if (p.category && !m.has(p.category)) m.set(p.category, placeColor(p, colors) || FALLBACK);
    return [...m].sort((a, b) => a[0].localeCompare(b[0]));
  }, [places, data?.config.categoryColors]);

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
    for (const d of data.days.filter((d) => dayCity.get(d.id) === legId)) {
      const s = dayIds(d);
      s.all.forEach((id) => all.add(id));
      s.explicit.forEach((id) => explicit.add(id));
    }
    for (const p of places) if (placeLeg.get(p.id) === legId) all.add(p.id);
    return { inScopeIds: all, derivedIds: new Set([...all].filter((id) => !explicit.has(id) && !placeLeg.has(id))) };
  }, [data, places, scope, placeLeg, dayCity]);

  /** the scope, narrowed by category only — area groups build their headers
   *  and counts from this, so soloing one area can't make its own header
   *  (or another area's count) disappear. */
  const preAreaScoped = useMemo(() => {
    const pass = (p: Place) =>
      inScopeIds.has(p.id) &&
      (catFilter.size === 0 || (!!p.category && catFilter.has(p.category)));
    return places.filter(pass);
  }, [places, inScopeIds, catFilter]);

  /** the scope, narrowed by category + the area filter — what the map and
   *  the flat/ungrouped list actually show */
  const scoped = useMemo(
    () => (areaAllowed ? preAreaScoped.filter((p) => areaAllowed.has(p.id)) : preAreaScoped),
    [preAreaScoped, areaAllowed],
  );
  const derived = derivedIds;

  /** distance-sorted Today places once "Nearby" is on and a fix has come in —
   *  filtered to `radiusKm` when that leaves anything, otherwise the full
   *  Today list, still nearest-first. Null whenever the caller should fall
   *  back to the normal grouped/flat view (toggle off, still locating, or the
   *  browser wouldn't give a position). */
  const nearby = useMemo(() => {
    if (!nearbyActive || geo.status !== "ready") return null;
    const radiusKm = 1.5;
    const withDist = scoped
      .map((p) => ({ p, km: haversineKm(geo.lat, geo.lng, p.lat, p.lng) }))
      .sort((a, b) => a.km - b.km);
    const near = withDist.filter((x) => x.km <= radiusKm);
    const chosen = near.length ? near : withDist;
    return {
      list: chosen.map((x) => x.p),
      distances: new Map(chosen.map((x) => [x.p.id, x.km] as const)),
      filtered: near.length > 0,
      radiusKm,
    };
  }, [nearbyActive, geo, scoped]);

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
    const byId = new Map(preAreaScoped.map((p) => [p.id, p] as const));
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
    const loose = preAreaScoped.filter((p) => !inArea.has(p.id));
    if (loose.length) groups.push({ id: "", name: "No area", tone: NEUTRAL_TONE, items: loose });
    // one group only → not worth the section chrome, render flat
    return groups.length > 1 ? groups : null;
  }, [data, preAreaScoped]);

  /** the "All" list nested city → area → places. Each area sits under the city
   *  most of its pins fall in. Null unless more than one city actually shows —
   *  then `areaGroups` (flat) or the plain list takes over. */
  const cityGroups = useMemo(() => {
    if (!data || (scope && scope !== "all") || data.areas.length === 0) return null;
    const byId = new Map(scoped.map((p) => [p.id, p] as const));
    const tone = new Map(data.areas.map((a, i) => [a.id, AREA_TONES[i % AREA_TONES.length]] as const));
    // a day-trip town sorts just after its stay
    const order = new Map<string, number>(data.legs.map((l, i) => [l.id, i] as const));
    for (const t of tripCities) order.set(t.id, (order.get(cityLeg.get(t.legId) ?? t.legId) ?? 99) + 0.5);

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
        const trip = tripCities.find((t) => t.id === legId);
        const leg = data.legs.find((l) => l.id === (trip?.legId ?? legId));
        c = { legId, name: trip?.name || leg?.base || "No city", hex: leg ? legHex(leg.color) : NEUTRAL_TONE, areas: [], loose: [] };
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
  }, [data, scope, scoped, placeLeg, tripCities, cityLeg]);

  /** legs whose hotel has coordinates — enough to earn a city pill even before
   *  any pin sits under it, so linking a hotel is all it takes to see the city */
  const anchoredLegIds = useMemo(() => {
    const s = new Set<string>();
    if (!data) return s;
    for (const leg of data.legs) {
      const h = data.hotels.find((x) => x.id === leg.hotelId);
      if ((h && Number.isFinite(h.lat) && Number.isFinite(h.lng)) || mapUrlCoords(h?.mapUrl) || cityAnchors.has(leg.id)) s.add(leg.id);
    }
    return s;
  }, [data, cityAnchors]);

  /** how many places each stay would show — so a stay with nothing to show
   *  doesn't get a dead city pill */
  const legCounts = useMemo(() => {
    const m = new Map<string, number>();
    if (!data) return m;
    for (const leg of data.legs) {
      const ids = new Set<string>();
      for (const d of data.days.filter((d) => d.legId === leg.id && dayCity.get(d.id) === (cityLeg.get(leg.id) ?? leg.id))) dayIds(d).all.forEach((id) => ids.add(id));
      for (const p of places) if (placeLeg.get(p.id) === leg.id) ids.add(p.id);
      m.set(leg.id, ids.size);
    }
    for (const t of tripCities) {
      const ids = new Set<string>();
      for (const id of t.dayIds) dayIds(data.days.find((d) => d.id === id)).all.forEach((x) => ids.add(x));
      for (const p of places) if (placeLeg.get(p.id) === t.id) ids.add(p.id);
      m.set(t.id, ids.size);
    }
    return m;
  }, [data, places, placeLeg, tripCities, dayCity, cityLeg]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const imported = useMemo(() => places.filter((p) => p.source === "mymap").length, [places]);

  /** areas sharing a case-insensitive trimmed name with at least one other —
   *  left over from before duplicate creation was guarded against. */
  const duplicateAreaGroups = useMemo(() => {
    if (!data) return [];
    const byName = new Map<string, Area[]>();
    for (const a of data.areas) {
      const key = (a.name || "").trim().toLowerCase();
      if (!key) continue;
      if (!byName.has(key)) byName.set(key, []);
      byName.get(key)!.push(a);
    }
    return [...byName.values()].filter((g) => g.length > 1);
  }, [data]);

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
    setOpenAreas((s) => {
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

  /** union each duplicate group's places onto the one with the most (ties → the
   *  first), repoint any day that linked one of the others, then drop them.
   *  Builds one dup→keep remap across every group before touching a single
   *  day — a day spanning two separate duplicate groups (Laura's real trip
   *  had several at once) needs one `updateEntity` covering both, not one
   *  per group: two sequential calls each read the same pre-merge `data.days`
   *  snapshot, so the second would silently overwrite the first's fix with
   *  stale `areaIds` and leave a dangling reference behind. */
  const mergeDuplicateAreas = () => {
    const remap = new Map<string, string>();
    for (const group of duplicateAreaGroups) {
      const keep = [...group].sort((x, y) => y.placeIds.length - x.placeIds.length)[0];
      const mergedIds = [...new Set(group.flatMap((a) => a.placeIds))];
      if (mergedIds.length !== keep.placeIds.length) {
        updateEntity<Area>("areas", keep.id, { placeIds: mergedIds });
      }
      for (const a of group) if (a.id !== keep.id) remap.set(a.id, keep.id);
    }
    for (const day of data.days) {
      const areaIds = day.areaIds ?? [];
      if (!areaIds.some((id) => remap.has(id))) continue;
      updateEntity<Day>("days", day.id, {
        areaIds: [...new Set(areaIds.map((id) => remap.get(id) ?? id))],
      });
    }
    for (const id of remap.keys()) removeEntity("areas", id);
  };

  const runSync = async () => {
    if (!url) return;
    setBusy(true);
    setMsg("");
    setNewLayers([]);
    try {
      const r = await syncMyMap(url);
      setNewLayers(r.newLayers);
      const pins = (n: number) => `${n} pin${n === 1 ? "" : "s"}`;
      const bits = [r.count > 0 && `added ${pins(r.count)}`, r.updated > 0 && `updated ${pins(r.updated)}`, r.removed > 0 && `removed ${pins(r.removed)} deleted there`].filter(Boolean);
      setMsg(bits.length ? `“${r.mapName}”: ${bits.join(", ")}.` : `“${r.mapName}” is up to date.`);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Sync failed.");
    } finally {
      setBusy(false);
    }
  };

  // `distanceKm` is only ever real for the "Nearby" list — never pass this
  // bare to `.map()` elsewhere: Array.map's own (item, index) callback shape
  // silently satisfies `(p, distanceKm?)` and the row index gets typeset as a
  // distance ("row 2" → "2.0 km"). Always wrap it: `.map((p) => renderRow(p))`.
  // the selected place lives in its card at the top, so its own list row
  // steps aside instead of repeating it underneath
  const renderRow = (p: Place, distanceKm?: number, card = false) => !card && selected === p.id ? null : (
    <PlaceRow
      key={p.id}
      place={p}
      card={card}
      open={card}
      dayId={dayOfPlace.get(p.id)}
      derived={derived.has(p.id)}
      distanceKm={distanceKm}
      days={data.days}
      areas={data.areas}
      legs={data.legs}
      categoryIcons={data.config.categoryIcons}
      categoryColors={data.config.categoryColors}
      loc={loc}
      map={map}
      mapReady={mapReady}
      onToggle={() => setSelected(selected === p.id ? null : p.id)}
      onNote={(v) => updateEntity<Place>("places", p.id, { note: v || undefined })}
      onName={(v) => v && updateEntity<Place>("places", p.id, { name: v })}
      onAddToDay={(d) => addToDay(p, d)}
      onToggleArea={(areaId) => toggleAreaPlace(areaId, p.id)}
      onLeg={(legId) => updateEntity<Place>("places", p.id, { legId })}
      // takes on the colour its new category's pins already have; a brand-new
      // category gets an icon guessed from its name, as a new layer does
      onCategory={(category) => {
        const glyph = data.config.categoryIcons?.[category] === undefined ? glyphForCategoryName(category) : undefined;
        if (glyph) useApp.getState().mutateTrip((d) => {
          d.config.categoryIcons = { ...(d.config.categoryIcons ?? {}), [category]: glyph };
        });
        updateEntity<Place>("places", p.id, {
          category,
          color: data.places.find((x) => x.category === category && x.id !== p.id)?.color ?? p.color,
        });
      }}
      onRemove={() => undoable("Place deleted", () => {
        removeEntity("places", p.id);
        if (selected === p.id) setSelected(null);
      })}
    />
  );

  // The selected place shows as a card at the top of whichever list is up —
  // its details live there, so a shut area or city never has to spring open to
  // reveal it.
  const selectedPlace = selected ? data.places.find((p) => p.id === selected) : undefined;
  const selectedCard = () =>
    selectedPlace ? renderRow(selectedPlace, undefined, true) : null;

  // a function, not a plain element — rendered once for the desktop column
  // and once for the mobile sheet (below), so `forMobile` can gate the
  // content-height measurement ref to the one instance that actually needs
  // it, rather than racing two instances for a single shared ref
  const renderPanel = (forMobile: boolean) => (
    <div ref={forMobile ? setPanelRoot : undefined} className="flex h-full flex-col">
      {/* context bar — city → area → filters */}
      <div className="shrink-0 border-b border-line px-4 pb-2 pt-2.5">
        {/* city pills. Soloing an area happens on its own row in the list
            below (areaGroups), not up here — a second row of area pills just
            duplicated that row's colour dot + name. */}
        <div className="flex items-center gap-2">
          <ChipStrip className="min-w-0 flex-1 items-center">
            {[
              ...(clock.phase === "during" && clock.today
                ? [{ id: `day:${clock.today.id}`, label: "Today", hex: "" }]
                : []),
              { id: "all", label: "All", hex: "" },
              ...data.legs
                // one pill per city: the first stay there stands for every
                // stay with the same name, and earns its pill if any of them would
                .filter((l) => cityLeg.get(l.id) === l.id)
                .filter((l) => {
                  const same = data.legs.filter((o) => cityLeg.get(o.id) === l.id);
                  return same.some((o) => (legCounts.get(o.id) ?? 0) > 0 || anchoredLegIds.has(o.id)) || scope === `leg:${l.id}`;
                })
                // each stay's pill, then its day-trip towns (Nara after Kyoto)
                .flatMap((l) => [
                  { id: `leg:${l.id}`, label: l.base || "Base", hex: legHex(l.color) },
                  ...tripCities
                    .filter((t) => (cityLeg.get(t.legId) ?? t.legId) === l.id)
                    .filter((t) => (legCounts.get(t.id) ?? 0) > 0 || scope === `leg:${t.id}`)
                    .map((t) => ({ id: `leg:${t.id}`, label: t.name, hex: legHex(l.color) })),
                ]),
            ].map((city) => {
              const active = (scope ?? "all") === city.id;
              return (
                <button
                  key={city.id}
                  onClick={() => { setScope(city.id); setSelected(null); setAreaFilter(new Set()); setCatFilter(new Set()); }}
                  className="chip"
                  aria-pressed={active}
                >
                  {city.hex && <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: active ? "currentColor" : city.hex }} />}
                  <span className="whitespace-nowrap">{city.label}</span>
                </button>
              );
            })}
          </ChipStrip>
          {todayScopeId && scope === todayScopeId && (
            <button
              onClick={() => setNearbyOn((v) => !v)}
              aria-label={nearbyOn ? "Show today's full list" : "Show what's nearby right now"}
              aria-pressed={nearbyOn}
              className="chip chip-icon"
            >
              <Icon name="locate" size={15} />
            </button>
          )}
          <button
            ref={moreSheet.anchorRef}
            onClick={() => moreSheet.setOpen(true)}
            aria-label="More"
            aria-haspopup="menu"
            aria-expanded={moreSheet.open}
            className={`chip chip-icon ${catFilter.size > 0 ? "chip-accent" : ""}`}
          >
            <Icon name="more" size={16} />
          </button>
          {!readOnly && (adding ? (
            <button onClick={cancelAdd} className="link-quiet shrink-0 text-sm">Cancel</button>
          ) : (
            <button
              onClick={startAdd}
              aria-label="Add place"
              className="chip chip-icon text-accent"
            >
              <Icon name="plus" size={15} />
            </button>
          ))}
        </div>

        {/* the ⋯ menu: how the list shows, then filtering, area upkeep and
            the My Maps sync — Apple Maps keeps all of this a tap away rather
            than on a row of its own above the list. Tinted while a category
            filter is on, so a narrowed list never looks like a short one. */}
        <ActionSheet open={moreSheet.open} onClose={() => moreSheet.setOpen(false)} anchorRef={moreSheet.anchorRef}>
          <button onClick={() => setListOnlyPersist(!listOnly)} className="menu-item">
            <Icon name={listOnly ? "map" : "list"} size={16} /> {listOnly ? "Show Map" : "Show List Only"}
          </button>
          {!adding && (
            <button onClick={() => filterSheet.setOpen(true)} className="menu-item">
              <Icon name="eye" size={16} /> {catFilter.size > 0 ? `Filters (${catFilter.size} on)` : "Filters"}
            </button>
          )}
          {!readOnly && !adding && review === null && (
            <>
              <button onClick={() => { primeKeyboard(); setNamingArea(true); }} className="menu-item">
                <Icon name="plus" size={16} /> New Area
              </button>
              {suggestions.length > 0 && (
                <button onClick={startSuggest} className="menu-item">
                  <Icon name="explore" size={16} /> Suggest Areas
                </button>
              )}
              {data.areas.length > 0 && (
                <button onClick={() => setEditingAreas(true)} className="menu-item">
                  <Icon name="pencil" size={16} /> Edit Areas
                </button>
              )}
              {data.places.length > 0 && (
                <Link to="/map/neighbourhoods" className="menu-item">
                  <Icon name="pin" size={16} /> Neighbourhoods
                </Link>
              )}
            </>
          )}
          {url && !readOnly && (
            <button onClick={runSync} disabled={busy} className="menu-item">
              <Icon name="refresh" size={16} /> Sync with My Maps
            </button>
          )}
        </ActionSheet>

        <TextPrompt
          open={namingArea}
          title="New Area"
          placeholder="Name"
          action="Add"
          onSubmit={createArea}
          onClose={() => setNamingArea(false)}
        />

        <ActionSheet open={filterSheet.open && !adding} onClose={() => filterSheet.setOpen(false)} anchorRef={moreSheet.anchorRef} title="Filters" doneLabel="Done">
          {/* toggles stay open until dismissed — stopPropagation so a chip
              tap doesn't trigger ActionSheet's "close on any click inside" */}
          <div onClick={(e) => e.stopPropagation()} className="space-y-4 px-4 pb-3 pt-1">
            {cats.length > 0 && (
              <div>
                <p className="eyebrow mb-1.5 text-ink-faint">Category</p>
                <div className="flex flex-wrap gap-2">
                  {cats.map(([name, col]) => {
                    const on = catFilter.size === 0 || catFilter.has(name);
                    return (
                      <button
                        key={name}
                        onClick={() => toggleCat(name)}
                        className={`chip ${on ? "" : "opacity-40"}`}
                      >
                        <CatMark color={col} glyph={data.config.categoryIcons?.[name]} />
                        <span>{categoryName(name)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <p className="eyebrow mb-1.5 text-ink-faint">Transit</p>
              <div className="flex flex-wrap gap-2">
                {TRANSIT_KINDS.map((kind) => {
                  const on = transit.has(kind);
                  const col = dark ? TRANSIT_META[kind].dark : TRANSIT_META[kind].light;
                  return (
                    <button
                      key={kind}
                      onClick={() => toggleTransit(kind)}
                      className={`chip ${on ? "" : "opacity-40"}`}
                    >
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: col, boxShadow: on ? `0 0 0 1px ${col}` : "none" }} />
                      {TRANSIT_META[kind].label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="eyebrow mb-1.5 text-ink-faint">Map</p>
              <label className="flex items-center justify-between gap-3">
                <span className="text-[17px] text-ink">Points of interest</span>
                <Switch checked={basePois} onChange={toggleBasePois} label="Points of interest" />
              </label>
            </div>
          </div>
        </ActionSheet>

        {editingAreas && !adding && !readOnly && review === null && (
          <div className="space-y-2 pb-1 pt-3">
            <div className="flex items-center justify-between px-1">
              <span className="kicker">Areas</span>
              <button onClick={() => setEditingAreas(false)} className="tap text-xs font-medium text-accent">Done</button>
            </div>
            {duplicateAreaGroups.length > 0 && (
              <div className="flex items-center justify-between gap-2 rounded-[8px] bg-accent/10 px-2.5 py-1.5 text-xs">
                <span className="text-ink-soft">
                  {plural(duplicateAreaGroups.length, "duplicate name")} found — merging combines their places and keeps one.
                </span>
                <ConfirmButton
                  label="Merge duplicate areas"
                  onConfirm={mergeDuplicateAreas}
                  className="shrink-0 text-accent"
                >
                  Merge
                </ConfirmButton>
              </div>
            )}
            {data.areas.length > 0 && (
              <ul className="isolate max-h-64 overflow-y-auto rounded-[12px] bg-surface">
                {[...data.areas]
                  .sort((a, b) => (a.name || "").localeCompare(b.name || ""))
                  .map((a) => (
                    <ContextMenu as="li" key={a.id} className={`flex items-center gap-2 px-3.5 py-2 text-sm ${INSET_DIVIDER}`}>
                      <span className="min-w-0 flex-1 break-words">
                        <Editable label="Area name" value={a.name} placeholder="Area name" onCommit={(v) => updateEntity<Area>("areas", a.id, { name: v.trim() || "Untitled" })} />
                      </span>
                      <span className="shrink-0 text-2xs tabular-nums text-ink-soft">{plural(a.placeIds.length, "place")}</span>
                      <RowMenu label="Area options">
                        <ConfirmMenuItem onConfirm={() => undoable("Area deleted", () => removeEntity("areas", a.id))} label="Delete area" />
                      </RowMenu>
                    </ContextMenu>
                  ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* add flow */}
      {adding && (
        <div className="shrink-0 border-b border-line px-4 py-3">
          {/* a dropped pin is named in an alert over the map, as Photos
              names a new album; Cancel goes back to searching or tapping */}
          <TextPrompt
            open={!!pending}
            title="New Place"
            message={pending ? `Pin at ${pending.lat.toFixed(4)}, ${pending.lng.toFixed(4)}` : undefined}
            placeholder="Name"
            action="Save"
            onSubmit={(name) => pending && commitPlace(name, pending.lat, pending.lng)}
            onClose={() => setPending(null)}
          />
          <div>
            <SearchField value={q} onChange={setQ} placeholder="Search for a place" autoFocus />
            {results.length > 0 && (
              <ul className="isolate mt-2 overflow-hidden rounded-[12px] bg-surface">
                {results.map((r, i) => (
                  <li key={i} className={INSET_DIVIDER}>
                    <button
                      onClick={() => commitPlace(r.name, r.lat, r.lng)}
                      className="block w-full px-3.5 py-2 text-left active:bg-ink/[0.07]"
                    >
                      <span className="block text-sm">{r.name}</span>
                      <span className="meta block break-words">{r.detail}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* "Nearby" status — pinned above the list so it stays visible while
          locating, and after, whether or not distance actually narrowed it */}
      {nearbyActive && review === null && (
        <p className="meta shrink-0 border-b border-line px-4 py-1.5">
          {geo.status === "pending" && "Finding what's nearby…"}
          {geo.status === "error" && "Couldn't get your location — showing today's full list."}
          {geo.status === "ready" && nearby && (
            nearby.filtered
              ? `${nearby.list.length} within ${fmtDistanceKm(nearby.radiusKm)}`
              : `Nothing within ${fmtDistanceKm(nearby.radiusKm)} — showing today's list, nearest first.`
          )}
        </p>
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
      ) : nearby ? (
        <div ref={forMobile ? setListOuter : undefined} className="min-h-0 flex-1 overflow-y-auto">
          {selectedCard()}
          {nearby.list.length > 0 ? (
            <ul className={`${PLACE_CARD} mt-3`}>{nearby.list.map((p) => renderRow(p, nearby.distances.get(p.id)))}</ul>
          ) : (
            <p className="meta px-4 py-6">Nothing on the map for today. Pick “All”, or add a place above.</p>
          )}
          <div className="h-4" />
        </div>
      ) : cityGroups ? (
        <div ref={forMobile ? setListOuter : undefined} className="min-h-0 flex-1 overflow-y-auto">
          {selectedCard()}
          {cityGroups.map((c) => {
            const cityShut = collapsedCities.has(c.legId);
            return (
              <section key={c.legId || "none"}>
                <button
                  onClick={() => toggleCityCollapsed(c.legId)}
                  className="sticky top-0 z-[2] flex w-full items-center gap-2.5 bg-bg px-5 pb-1 pt-5 text-left"
                >
                  <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: c.hex }} />
                  <span className="subhead min-w-0 flex-1 break-words">{c.name}</span>
                  <span className="shrink-0 text-xs tabular-nums text-ink-soft">{c.count}</span>
                  <Icon name="chevron" size={14} className={`shrink-0 text-ink-faint transition-transform ${cityShut ? "" : "rotate-90"}`} />
                </button>
                {!cityShut && (
                  <>
                    {c.areas.length > 0 && (
                      <ul className={`${PLACE_CARD} mt-2`}>
                        {c.areas.map((a) => {
                          const shut = !openAreas.has(a.id);
                          return [
                            <AreaRow key={a.id} name={a.name} tone={a.tone} items={a.items} open={!shut} onToggle={() => toggleAreaCollapsed(a.id)} />,
                            ...(!shut ? a.items.map((p) => renderRow(p)) : []),
                          ];
                        })}
                      </ul>
                    )}
                    {c.loose.length > 0 && (
                      <>
                        {c.areas.length > 0 && (
                          <p className="kicker px-5 pb-1.5 pt-4">Not in an area</p>
                        )}
                        <ul className={`${PLACE_CARD} ${c.areas.length > 0 ? "" : "mt-2"}`}>{c.loose.map((p) => renderRow(p))}</ul>
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
        <div ref={forMobile ? setListOuter : undefined} className="min-h-0 flex-1 overflow-y-auto">
          {selectedCard()}
          {areaGroups.length > 0 && (
            <ul className={`${PLACE_CARD} mt-3`}>
              {areaGroups.map((g) => {
                const isArea = g.id !== "";
                // the dot doubles as the old area-pill filter — soloed areas
                // dim out here. "No area" has no filter of its own; it just
                // drops out while any area's soloed.
                const filteredOut = isArea ? areaFilter.size > 0 && !areaFilter.has(g.id) : areaFilter.size > 0;
                const shut = filteredOut || !openAreas.has(g.id);
                return [
                  <AreaRow
                    key={g.id || "none"}
                    name={g.name}
                    tone={g.tone}
                    items={g.items}
                    open={!shut}
                    dim={filteredOut}
                    walk={isArea}
                    onToggle={() => toggleAreaCollapsed(g.id)}
                    onSolo={isArea ? () => toggleAreaFilter(g.id) : undefined}
                  />,
                  ...(!shut ? g.items.map((p) => renderRow(p)) : []),
                ];
              })}
            </ul>
          )}
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
        <div ref={forMobile ? setListOuter : undefined} className="min-h-0 flex-1 overflow-y-auto">
          {selectedCard()}
          {scoped.length > 0 && <ul className={`${PLACE_CARD} mt-3`}>{scoped.map((p) => renderRow(p))}</ul>}
          {scoped.length === 0 && (
            <p className="meta px-4 py-6">
              {places.length === 0
                ? "No places yet. Add one above, or paste a Google My Maps link in Manage to import your pins."
                : scope?.startsWith("day:")
                  ? "Nothing on the map for today. Pick “All”, or add a place above."
                  : "No places in this city yet. Pick “All”, or add one above."}
            </p>
          )}
          <div className="h-4" />
        </div>
      )}

      {/* sync footer — only once a My Maps link is actually configured; the
          empty-state "add a link" guidance lives in Manage now, where the
          link itself is added, instead of taking a permanent row here */}
      {url && (
        <div className="shrink-0 border-t border-line px-4 py-2 text-center text-2xs text-ink-faint">
          <p className="text-xs text-ink-soft">
            {busy ? "Checking for changes…" : syncedAt ? `Updated ${rel(syncedAt)}` : "Not synced yet"}
          </p>
          <p>{imported > 0 ? `${plural(imported, "pin")} from Google My Maps` : "No pins from Google My Maps"}</p>
          {msg && <p className="mt-1 text-accent">{msg}</p>}
          {newLayers.length > 0 && (
            <p className="mt-1 break-words">
              {newLayers.length === 1 ? "New layer" : "New layers"} {newLayers.map((l) => `“${l}”`).join(", ")} —{" "}
              <Link to="/manage/content" className="text-accent">choose a category</Link>
            </p>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div
      ref={shellRef}
      style={{ "--panel-w": `${panelWidth}px` } as CSSProperties}
      className="fixed inset-x-0 bottom-[max(var(--tabbar-clear),var(--kb,0px))] top-[calc(var(--sat)+var(--nav-h)+var(--demo-h,0px))] z-20 md:bottom-0 md:left-[72px]"
    >
      {/* map — hidden, not unmounted, in list-only view: keeps its instance
          (viewport, loaded tiles) alive for an instant toggle back */}
      <div className={`absolute inset-0 md:left-[var(--panel-w)] ${listOnly ? "hidden" : ""}`}>
        <MapView
          places={scoped}
          selectedId={selected}
          derivedIds={derived}
          areaShapes={areaShapes}
          transit={transit}
          basePois={basePois}
          categoryIcons={data.config.categoryIcons}
          categoryColors={data.config.categoryColors}
          pinnedCategories={data.config.pinnedCategories}
          dark={dark}
          onSelect={setSelected}
          onMapClick={onMapClick}
          onLongPress={onLongPress}
          onReady={(m) => {
            map.current = m;
            fitScope();
            setMapReady(true);
          }}
        />
        {adding && (
          <div className="pointer-events-none absolute inset-x-0 top-0 bg-accent/90 py-1.5 text-center text-xs font-medium text-white">
            Adding a place — search, or tap the map
          </div>
        )}
      </div>

      {/* desktop column — full width, no resize handle, in list-only view */}
      <div
        ref={panelRef}
        className={`absolute left-0 top-0 bottom-0 z-10 hidden bg-bg md:block ${listOnly ? "md:w-full" : "border-r border-line md:w-[var(--panel-w)]"}`}
      >
        {renderPanel(false)}
        {!listOnly && (
          <div
            onPointerDown={onPanelHandlePointerDown}
            onPointerMove={onPanelHandlePointerMove}
            onPointerUp={onPanelHandlePointerUp}
            onPointerCancel={onPanelHandlePointerUp}
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize list"
            className={`group absolute inset-y-0 -right-1.5 z-10 hidden w-3 cursor-col-resize touch-none md:block ${panelDragging ? "bg-accent/15" : "hover:bg-accent/10"}`}
          >
            {/* the grip — a short bar centred on the divider, like the sheet's grabber */}
            <span
              aria-hidden
              className={`pointer-events-none absolute left-1/2 top-1/2 h-10 w-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors ${panelDragging ? "bg-ink/50" : "bg-ink/30 group-hover:bg-ink/50"}`}
            />
          </div>
        )}
      </div>

      {/* mobile sheet — full height, no drag handle, in list-only view (there's
          no map underneath to reveal by dragging) */}
      <div
        ref={sheetRef}
        style={listOnly ? undefined : { height: `${sheetHeight}px` }}
        className={`absolute inset-x-0 z-10 flex flex-col bg-bg md:hidden ${listOnly ? "inset-y-0" : "bottom-0 overflow-hidden rounded-t-[28px] shadow-[0_-6px_24px_rgb(var(--c-ink)/0.12)]"} ${dragging ? "" : "transition-[height] duration-200 ease-paper"}`}
      >
        {!listOnly && (
          <button
            onPointerDown={onHandlePointerDown}
            onPointerMove={onHandlePointerMove}
            onPointerUp={onHandlePointerUp}
            onPointerCancel={onHandlePointerUp}
            onClick={onHandleClick}
            aria-label="Resize list"
            className="group flex h-6 w-full shrink-0 touch-none items-center justify-center"
          >
            <span className="block h-[5px] w-9 rounded-full bg-ink/30 transition-colors group-active:bg-ink/50" />
          </button>
        )}
        <div className="min-h-0 flex-1">{renderPanel(true)}</div>
      </div>
    </div>
  );
}

type ReviewGroup = AreaSuggestion & { keep: boolean; auto: boolean };

/** the Category picker's "New Category…" choice — never a real category */
const NEW_CATEGORY = "\u0000new";

function PlaceRow({
  place,
  card = false,
  open,
  dayId,
  derived,
  distanceKm,
  days,
  areas,
  legs,
  categoryIcons,
  categoryColors,
  loc,
  map,
  mapReady,
  onToggle,
  onNote,
  onName,
  onAddToDay,
  onToggleArea,
  onLeg,
  onCategory,
  onRemove,
}: {
  place: Place;
  /** drawn as the selected place's card at the top of the list, not as a list row */
  card?: boolean;
  /** show the place's details under its header (only ever true in the card) */
  open: boolean;
  dayId?: string;
  derived?: boolean;
  /** shown ahead of the usual category/day meta when the "Nearby" toggle is on */
  distanceKm?: number;
  days: TripData["days"];
  areas: Area[];
  legs: TripData["legs"];
  categoryIcons?: Record<string, string>;
  categoryColors?: Record<string, string>;
  loc: string;
  /** for the nearest-station lookup — read-only, never used to mutate the map */
  map: RefObject<MLMap | null>;
  /** the map's first load — before this, `map.current` is still null */
  mapReady: boolean;
  onToggle: () => void;
  onNote: (v: string) => void;
  onName: (v: string) => void;
  onAddToDay: (dayId: string) => void;
  onToggleArea: (areaId: string) => void;
  onLeg: (legId: string | undefined) => void;
  onCategory: (category: string) => void;
  onRemove: () => void;
}) {
  const readOnly = useReadOnly();
  const link = placeMapLink(place);
  // a restaurant's guide page (Tabelog in Japan) — looked up once it's opened
  const reviewSite = reviewSiteFor(place, categoryIcons);
  useAutoReviewLink(place, categoryIcons, open && !readOnly);
  // its "Good to know" (hours, reservations, queue…) — a restaurant's, or any
  // place's once it's on a day — looked up the same way
  const tripData = useData();
  const area = placeArea(place, tripData);
  // every category in use, for moving a pin added here into one — a My Maps
  // pin's comes from its layer (set in Manage), so it's shown, not picked
  const categories = [...new Set([
    ...(tripData?.places.map((p) => p.category) ?? []),
    ...Object.values(tripData?.config.layerCategories ?? {}),
  ].filter(Boolean) as string[])].sort((a, b) => a.localeCompare(b));
  const [namingCategory, setNamingCategory] = useState(false);
  useAutoPlaceFacts(place, tripData, area, open && !readOnly);
  const factsFailure = useFactsFailure(place.id);
  const day = dayId ? days.find((d) => d.id === dayId) : undefined;
  const li = useRef<HTMLLIElement>(null);
  useEffect(() => {
    if (open) li.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [open]);

  // nearest station — the map's own loaded tiles first (no request). Waits
  // for `mapReady` (the list mounts well before the map's first load) rather
  // than treating a not-yet-ready map as "no station"; if that first check
  // still comes up empty, gives the map one more settle cycle (e.g. the
  // scope-fit pan/zoom pulling in new tiles) before falling back to Overpass,
  // so a place whose tile just hasn't loaded yet doesn't hit the network for
  // no reason. Only ever runs for a place whose row is actually mounted (a
  // collapsed area's places never render), so this is never a batch job over
  // the whole trip, and Overpass runs at most once per place.
  const [station, setStation] = useState<NearbyStation | null>(null);
  useEffect(() => {
    setStation(null);
    if (!mapReady) return;
    const m = map.current;
    if (!m) return;
    let cancelled = false;

    const tryTiles = () => {
      const hit = nearestStationFromMap(m, place.lat, place.lng);
      if (!hit) return false;
      if (!cancelled) setStation(hit);
      return true;
    };
    const tryOverpass = () => {
      // Overpass only: a list of a hundred rows mustn't fall through to Nominatim
      void nearestStationLookup(place.lat, place.lng, { fallback: false }).then((hit) => {
        if (!cancelled) setStation(hit);
      });
    };

    if (!tryTiles()) {
      m.once("idle", () => {
        if (!cancelled && !tryTiles()) tryOverpass();
      });
    }
    return () => { cancelled = true; };
  }, [map, mapReady, place.id, place.lat, place.lng]);
  // scroll-margin below gives `block: "nearest"` a little breathing room so an
  // opened row never lands flush against the list's top edge.
  const catGlyph = place.category ? categoryIcons?.[place.category] : undefined;
  // the category is named by the tile's own icon when it has one — repeating it
  // as text only made the row a line taller
  const metaBits = [
    distanceKm !== undefined && fmtWalk({ min: estimateWalk(distanceKm).min, km: distanceKm }),
    !catGlyph && place.category,
    // the card has its day as a button instead
    !card && day && `on ${fmtDate(day.date, loc, { weekday: "short", day: "numeric" })}`,
  ].filter(Boolean).join(" · ");
  // an imported pin keeps its own colour (matches its map marker); an app-native
  // pin has no real colour, so tint it by category instead
  // grouped-inset rows, iOS Settings style: a quiet label left, the value right
  const rowCls = "flex items-center gap-3 px-3.5 py-2.5 text-sm";
  const sortedDays = [...days].sort((a, b) => a.date.localeCompare(b.date));
  const tile = (
    <IconTile size="md" {...placeTile(place, categoryIcons, categoryColors)} />
  );
  const details = (
    <>
      {(metaBits || derived) && (
        <span className="meta block break-words">{[derived && "from area", metaBits].filter(Boolean).join(" · ")}</span>
      )}
      {station && <WalkLine icon="train" from={place} to={station}>to {station.name}</WalkLine>}
    </>
  );
  // how the place is filed — its areas, category and city
  const filing = (
    <>
          <AreasRow place={place} areas={areas} readOnly={readOnly} onToggleArea={onToggleArea} rowCls={rowCls} />
          {place.category && (
            <li className={`${SM_TILE_DIVIDER} ${rowCls}`}>
              <IconTile size="sm" {...placeTile(place, categoryIcons, categoryColors)} />
              <span className="row-label">Category</span>
              {readOnly || place.source === "mymap" ? (
                <span className="row-value min-w-0 flex-1 break-words text-right">{place.category && categoryName(place.category)}</span>
              ) : (
                <label className="flex min-w-0 flex-1 cursor-pointer justify-end">
                  <RowSelect
                    value={place.category}
                    onChange={(e) => (e.target.value === NEW_CATEGORY ? setNamingCategory(true) : onCategory(e.target.value))}
                    aria-label="Category"
                    className="max-w-[12rem] truncate"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{categoryName(c)}</option>
                    ))}
                    <option value={NEW_CATEGORY}>New Category…</option>
                  </RowSelect>
                </label>
              )}
              <TextPrompt
                open={namingCategory}
                title="New Category"
                message="Set its colour and icon under Category pins in Manage."
                placeholder="Name"
                action="Create"
                onSubmit={(name) => {
                  if (name.trim()) onCategory(name.trim());
                  setNamingCategory(false);
                }}
                onClose={() => setNamingCategory(false)}
              />
            </li>
          )}
          {legs.length > 0 && (
            <li className={`${SM_TILE_DIVIDER} ${rowCls}`}>
              <IconTile size="sm" name="location" tone="ai" />
              <span className="row-label">City</span>
              {readOnly ? (
                <span className="row-value min-w-0 flex-1 text-right">
                  {legs.find((l) => l.id === place.legId)?.base || "Auto"}
                </span>
              ) : (
                <label className="flex min-w-0 flex-1 cursor-pointer justify-end">
                  <RowSelect
                    value={place.legId ?? ""}
                    onChange={(e) => onLeg(e.target.value || undefined)}
                    aria-label="City"
                    className="max-w-[12rem] truncate"
                  >
                    <option value="">Auto</option>
                    {legs.map((l) => (
                      <option key={l.id} value={l.id}>{l.base || "Base"}</option>
                    ))}
                  </RowSelect>
                </label>
              )}
            </li>
          )}
    </>
  );
  const nav = useNavigate();
  const [noteOpen, setNoteOpen] = useState(false);
  const [factsOpen, setFactsOpen] = useState(false);

  // the selected place's card, laid out as a Maps place card (and as a plan
  // step's): name and where it sits, the button row, then grouped — your
  // note, Good to know, how it's filed, and last Remove
  if (card) {
    const groupLabel = "kicker px-4 pb-1.5";
    return (
      <div className="mx-4 mb-1 mt-3 space-y-4">
        <div className={`space-y-3 rounded-[12px] bg-surface px-3.5 py-3 ${derived ? "opacity-60" : ""}`}>
          <div className="flex items-start gap-3">
            {tile}
            <span className="min-w-0 flex-1">
              <span className="block break-words text-[17px] font-medium leading-snug text-ink">
                <Editable label="Name" value={place.name} onCommit={onName} />
              </span>
              {details}
            </span>
            <button
              type="button"
              onClick={onToggle}
              aria-label="Close"
              className="tap grid h-[30px] w-[30px] shrink-0 place-items-center rounded-full bg-ink/[0.08] text-ink-soft"
            >
              <Icon name="close" size={13} />
            </button>
          </div>
          <PlaceActions>
            {link && <PlaceAction href={link} icon="map" label="Google Maps" primary />}
            {reviewSite && <PlaceAction href={reviewHref(reviewSite, place)} icon="link" label={place.reviewUrl ? reviewSite.label : `Search ${reviewSite.label}`} />}
            {day && <PlaceAction icon="calendar" label={fmtDate(day.date, loc, { weekday: "short", day: "numeric" })} onClick={() => nav(`/day/${day.id}`)} />}
          </PlaceActions>
        </div>

        {(!readOnly || place.note?.trim()) && (
          <div>
            <p className={groupLabel}>Note</p>
            {place.note?.trim() || noteOpen ? (
              <div className="rounded-[12px] bg-surface px-3.5 py-3">
                <RichNote value={place.note ?? ""} onCommit={onNote} placeholder="Add a note…" className="note" autoEdit={noteOpen} onEditEnd={() => setNoteOpen(false)} />
              </div>
            ) : (
              <ul className="overflow-hidden rounded-[12px] bg-surface">
                <ActionRow icon="pencil" label="Add a note" onClick={() => setNoteOpen(true)} />
              </ul>
            )}
          </div>
        )}

        {/* shown with nothing found too, so it can be filled in by hand */}
        {(hasFacts(place.facts) || menuHref(place) || factsFailure || !readOnly) && wantsFacts(place, tripData) && (
          <div>
            {/* folded by default here: on the Map you're mostly filing
                places, so the areas and category stay a short reach away */}
            <div className={`${groupLabel} flex items-center gap-2`}>
              <button
                type="button"
                onClick={() => setFactsOpen(!factsOpen)}
                aria-expanded={factsOpen}
                className="tap flex min-w-0 flex-1 items-center gap-1 text-left"
              >
                Good to know
                <Icon name="chevron" size={11} className={`transition-transform duration-200 ${factsOpen ? "rotate-90" : ""}`} />
              </button>
              {factsOpen && <FactsRefresh place={place} area={area} />}
            </div>
            {factsOpen && (
              <ul className="isolate overflow-hidden rounded-[12px] bg-surface">
                <PlaceFactRows place={place} />
              </ul>
            )}
          </div>
        )}

        <ul className="isolate overflow-hidden rounded-[12px] bg-surface">
          {/* on a day already, the day is a button up top */}
          {!day && !readOnly && (
            <li className={SM_TILE_DIVIDER}>
              <label className={`${rowCls} cursor-pointer`}>
                <IconTile size="sm" name="calendar" tone="accent" />
                <span className="row-label">Add to a day</span>
                <span className="flex min-w-0 flex-1 justify-end">
                  <RowSelect value="" onChange={(e) => e.target.value && onAddToDay(e.target.value)} aria-label="Add to a day" className="max-w-[12rem] truncate">
                    <option value="">Choose…</option>
                    {sortedDays.map((d) => (
                      <option key={d.id} value={d.id}>
                        {fmtDate(d.date, loc, { weekday: "short", day: "numeric", month: "short" })}
                        {d.title ? ` · ${d.title}` : ""}
                      </option>
                    ))}
                  </RowSelect>
                </span>
              </label>
            </li>
          )}
          {filing}
        </ul>

        {!readOnly && (
          <ul className="overflow-hidden rounded-[12px] bg-surface">
            <li>
              <ConfirmButton onConfirm={onRemove} label="Remove place" className={`${rowCls} w-full text-left text-danger`}>
                <Icon name="trash" size={15} className="shrink-0" /> Remove place
              </ConfirmButton>
            </li>
          </ul>
        )}
      </div>
    );
  }

  return (
    <li ref={li} className={`scroll-my-3 ${TILE_DIVIDER}`}>
        <ContextMenu
          menu={(link || !readOnly) && (
            <>
              {link && (
                <a href={link} target="_blank" rel="noopener" className="menu-item">
                  <Icon name="map" size={16} /> Open in Google Maps
                </a>
              )}
              {reviewSite && (
                <a href={reviewHref(reviewSite, place)} target="_blank" rel="noopener" className="menu-item">
                  <Icon name="link" size={16} /> {place.reviewUrl ? `Open in ${reviewSite.label}` : `Search ${reviewSite.label}`}
                </a>
              )}
              {!readOnly && <ConfirmMenuItem onConfirm={onRemove} label="Delete place" icon={<Icon name="trash" size={16} />} />}
            </>
          )}
        >
          <button onClick={onToggle} className={`flex w-full items-center gap-3 px-3.5 py-2 text-left active:bg-ink/[0.07] ${derived ? "opacity-60" : ""}`}>
            {tile}
            <span className="min-w-0 flex-1">
              <span className="block break-words text-sm leading-snug text-ink">{place.name}</span>
              {details}
            </span>
            <Icon name="chevron" size={13} className="shrink-0 text-ink-faint" />
          </button>
        </ContextMenu>
    </li>
  );
}

/** The areas a place belongs to, as one row — the names on the right, a check
 *  list on tap — instead of a pill per area in the city. */
function AreasRow({
  place,
  areas,
  readOnly,
  onToggleArea,
  rowCls,
}: {
  place: Place;
  areas: Area[];
  readOnly: boolean;
  onToggleArea: (areaId: string) => void;
  rowCls: string;
}) {
  const sheet = useActionSheet();
  if (areas.length === 0) return null;
  const mine = areas.filter((a) => a.placeIds.includes(place.id));
  const names = mine.map((a) => a.name || "Untitled").join(", ");
  if (readOnly) {
    return mine.length > 0 ? (
      <li className={`${SM_TILE_DIVIDER} ${rowCls}`}>
        <IconTile size="sm" name="pin" tone="matcha" />
        <span className="row-label">Areas</span>
        <span className="row-value min-w-0 flex-1 break-words text-right">{names}</span>
      </li>
    ) : null;
  }
  return (
    <li className={SM_TILE_DIVIDER}>
      <button ref={sheet.anchorRef} onClick={() => sheet.setOpen(true)} aria-haspopup="menu" className={`${rowCls} w-full text-left active:bg-surface-2`}>
        <IconTile size="sm" name="pin" tone="matcha" />
        <span className="row-label">Areas</span>
        <span className={`row-value min-w-0 flex-1 break-words text-right ${mine.length ? "" : "text-ink-faint"}`}>{names || "None"}</span>
        <Icon name="chevron" size={13} className="shrink-0 text-ink-faint" />
      </button>
      <ActionSheet open={sheet.open} onClose={() => sheet.setOpen(false)} anchorRef={sheet.anchorRef} title={`Areas for ${place.name}`} doneLabel="Done">
        {/* toggles stay open until dismissed — stopPropagation so a tap
            doesn't trigger ActionSheet's "close on any click inside" */}
        <div onClick={(e) => e.stopPropagation()}>
          {[...areas]
            .sort((a, b) => (a.name || "").localeCompare(b.name || ""))
            .map((a) => (
              <button key={a.id} type="button" className="menu-item flex w-full items-center gap-2" onClick={() => onToggleArea(a.id)}>
                <span className="min-w-0 flex-1 break-words text-left">{a.name || "Untitled"}</span>
                <span className="w-4 shrink-0 text-accent">{a.placeIds.includes(place.id) && <Icon name="check" size={14} />}</span>
              </button>
            ))}
        </div>
      </ActionSheet>
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
  const enough = (g: ReviewGroup) => g.placeIds.length >= (g.areaId ? 1 : 2);
  const kept = groups.filter((g) => g.keep && enough(g));
  const keptNew = kept.filter((g) => !g.areaId).length;
  const keptJoin = kept.length - keptNew;

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-4 pt-3">
      {groups.length === 0 ? (
        <p className="meta py-4">
          Couldn’t spot any clear groups — the places are too spread out or too few. Use Add area to make one by hand.
        </p>
      ) : (
        <>
          <p className="meta mb-3">
            Found {plural(groups.length, "group")} of nearby places
            {naming ? ", naming them by neighbourhood…" : ". "}
            {!naming && "Untick any you don’t want, rename them, or open one to drop a place."}
          </p>
          <ul className="isolate overflow-hidden rounded-[12px] bg-surface">
            {groups.map((g, i) => (
              <li key={i} className={`px-3.5 py-2.5 ${INSET_DIVIDER}`}>
                <div className="flex items-center gap-2">
                  <button onClick={() => set(i, { keep: !g.keep })} aria-label={g.keep ? "Skip this group" : "Keep this group"} className="shrink-0">
                    <Icon name="check" size={14} className={g.keep ? "text-accent" : "text-ink-faint/30"} />
                  </button>
                  {g.areaId ? (
                    <span className="min-w-0 flex-1 break-words pb-0.5 text-sm">
                      <span className="text-ink-soft">Add to </span>
                      {g.name}
                    </span>
                  ) : (
                    <input
                      value={g.name}
                      onChange={(e) => set(i, { name: e.target.value, auto: false })}
                      aria-label="Area name"
                      className="min-w-0 flex-1 border-b border-transparent bg-transparent pb-0.5 text-sm focus:border-line focus:outline-none"
                    />
                  )}
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
                          className="flex w-full items-center gap-2 py-1 text-left text-sm text-ink-soft hover:text-ink"
                        >
                          <Icon name="close" size={11} className="shrink-0 text-ink-faint" />
                          <span className="break-words">{nameById.get(id) ?? "place"}</span>
                        </button>
                      </li>
                    ))}
                    {!enough(g) && <li className="py-1 text-2xs text-ink-faint">{g.areaId ? "no places left to add" : "needs at least 2 places"}</li>}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
      <div className="sticky bottom-0 mt-3 flex items-center gap-4 bg-bg py-2 text-sm">
        {kept.length > 0 && (
          <button onClick={onApply} className="text-accent hover:opacity-70">
            {keptNew > 0 ? `Create ${plural(keptNew, "area")}` : `Update ${plural(keptJoin, "area")}`}
            {keptNew > 0 && keptJoin > 0 && `, update ${keptJoin}`}
          </button>
        )}
        <button onClick={onCancel} className="link-quiet">Cancel</button>
      </div>
    </div>
  );
}

/* ---- area outlines ------------------------------------------------ */

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
