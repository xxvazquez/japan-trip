import { useEffect, useRef, useState } from "react";
import {
  Map as MLMap,
  AttributionControl,
  addProtocol,
  LngLat,
  type GeoJSONFeature,
  type GeoJSONSource,
  type MapMouseEvent,
  type MapLayerMouseEvent,
  type MapTouchEvent,
} from "maplibre-gl";
import { Protocol } from "pmtiles";
import type { FeatureCollection, Geometry, LineString, Point, Polygon } from "geojson";
import "maplibre-gl/dist/maplibre-gl.css";
import { buildMapStyle, BASE_POIS_LAYER, kindLabel, labelName } from "@/lib/mapStyle";
import { Icon } from "@/components/Icon";
import { Loader } from "@/components/Loader";
import { LocateControl } from "@/components/LocateControl";
import { transitLayers, TRANSIT_CONTROLS } from "@/lib/transitLayers";
import { buildMarkerImage, markerKey } from "@/lib/mapGlyphs";
import type { Place } from "@/core/types";
import { DEFAULT_ACCENT } from "@/lib/themePresets";

/** One of the base map's own places, as clicked */
export type BasePoi = { name: string; kind?: string; lat: number; lng: number; x: number; y: number };

/** the trip's own pins — a click there picks the pin, never the map */
const PIN_LAYERS = ["pins", "pins-icon", "clusters", "pinned-icon", "pinned-dot", "stop-dot", "stop-num"];
/** the base map's spots: points of interest, the transit overlay's stops,
 *  named water and islands, and neighbourhood and town names — Maps opens
 *  each of these */
const PLACE_LAYERS = [
  BASE_POIS_LAYER,
  "transit-station-label", "transit-station", "transit-bus", "transit-ferry", "transit-airport-label", "transit-airport",
  "water_label_lakes", "earth_label_islands", "places_subplace", "places_locality",
];
/** whether a point falls inside a (multi)polygon — even-odd, so holes count */
function inShape([x, y]: [number, number], g: Geometry): boolean {
  const polys = g.type === "Polygon" ? [g.coordinates] : g.type === "MultiPolygon" ? g.coordinates : [];
  return polys.some((rings) => {
    let inside = false;
    for (const ring of rings)
      for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        const [xi, yi] = ring[i], [xj, yj] = ring[j];
        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
      }
    return inside;
  });
}
/** how far from a click inside an unnamed area its name's point may sit */
const AREA_NAME_REACH_M = 1000;
/** the base map's areas — a park's green, a campus, a named lake */
const AREA_LAYERS = [
  "landuse_park", "landuse_urban_green", "landuse_zoo", "landuse_hospital", "landuse_school",
  "landuse_beach", "landuse_aerodrome", "landuse_pedestrian", "landuse_pier", "water",
];

const FALLBACK = DEFAULT_ACCENT;
let protocolRegistered = false;

type CatIcons = Record<string, string> | undefined;
type CatColors = Record<string, string> | undefined;
type Props = { id: string; name: string; color: string; derived: boolean; glyph: string; icon: string };

/** the marker glyph id for a place, or "" if its category has none */
const glyphFor = (p: Place, catIcons: CatIcons) => (p.category && catIcons?.[p.category]) || "";

/** a place's pin colour: its category's colour from Manage, else its own */
const colorFor = (p: Place, catColors: CatColors) => (p.category && catColors?.[p.category]) || p.color || FALLBACK;

function toFC(places: Place[], derivedIds: Set<string> | undefined, catIcons: CatIcons, catColors: CatColors, dark: boolean): FeatureCollection<Point, Props> {
  return {
    type: "FeatureCollection",
    features: places.map((p) => {
      const glyph = glyphFor(p, catIcons);
      const color = colorFor(p, catColors);
      return {
        type: "Feature",
        id: p.id,
        geometry: { type: "Point", coordinates: [p.lng, p.lat] },
        properties: {
          id: p.id,
          name: p.name,
          color,
          derived: !!derivedIds?.has(p.id),
          glyph,
          icon: glyph ? markerKey(glyph, color, dark) : "",
        },
      };
    }),
  };
}

/** make sure every (glyph, colour) pair on screen has a registered marker bitmap */
function ensureMarkerImages(m: MLMap, places: Place[], catIcons: CatIcons, catColors: CatColors, dark: boolean) {
  if (!catIcons) return;
  for (const p of places) {
    const glyph = glyphFor(p, catIcons);
    if (!glyph) continue;
    const color = colorFor(p, catColors);
    const key = markerKey(glyph, color, dark);
    if (m.hasImage(key)) continue;
    m.addImage(key, buildMarkerImage(glyph, color, dark), { pixelRatio: 2 });
  }
}

const sel = (id: string | null) => id ?? "__none__";

/** highlight the selected pin (halo, label, bigger icon). Shared by the
 *  reactive selection effect and the initial `load` handler — a map that
 *  mounts with a selection already set (e.g. arriving via a `?sel=` deep
 *  link) needs this applied once ready, not just on a later change. */
function applySelection(m: MLMap, selectedId: string | null) {
  if (!m.getLayer("pins")) return;
  const s = sel(selectedId);
  m.setFilter("pin-halo", ["all", ["!", ["has", "point_count"]], ["==", ["get", "id"], s]]);
  m.setFilter("pin-label", ["all", ["!", ["has", "point_count"]], ["==", ["get", "id"], s]]);
  m.setPaintProperty("pins", "circle-radius", ["case", ["==", ["get", "id"], s], 10, ["get", "derived"], 6, 7.5]);
  m.setPaintProperty("pins", "circle-stroke-width", ["case", ["==", ["get", "id"], s], 3, 2]);
  if (m.getLayer("pins-icon")) m.setLayoutProperty("pins-icon", "icon-size", iconSize(s));
  if (m.getLayer("pinned-icon")) m.setLayoutProperty("pinned-icon", "icon-size", pinnedIconSize(s));
  if (m.getLayer("pinned-dot")) m.setPaintProperty("pinned-dot", "circle-stroke-width", ["case", ["==", ["get", "id"], s], 5, 3]);
  if (m.getLayer("stop-dot")) {
    m.setFilter("stop-halo", ["==", ["get", "id"], s]);
    m.setPaintProperty("stop-dot", "circle-radius", stopRadius(s));
    m.setLayoutProperty("stop-num", "text-size", ["case", ["==", ["get", "id"], s], 15, 13]);
  }
}

/** a stop's numbered disc, a touch bigger when it's the pick */
const stopRadius = (selId: string): unknown => ["case", ["==", ["get", "id"], selId], 14.5, 12];

/** move the camera to a picked place, centred in the map a bottom sheet leaves showing */
function flyToPlace(m: MLMap, p: Place, animate: boolean, coverBottom = 140) {
  m.easeTo({ center: [p.lng, p.lat], zoom: Math.max(m.getZoom(), 14), duration: animate ? 500 : 0, offset: [0, -coverBottom / 2] });
}

/** a day's stops: each place's number in the day (its first visit), and
 *  the rest of the places, which stay ordinary pins */
function splitStops(places: Place[], route: string[] | undefined): { stops: Place[]; others: Place[]; num: Map<string, number> } {
  const num = new Map<string, number>();
  for (const id of route ?? []) if (!num.has(id)) num.set(id, num.size + 1);
  if (num.size < 2) return { stops: [], others: places, num: new Map() };
  return { stops: places.filter((p) => num.has(p.id)), others: places.filter((p) => !num.has(p.id)), num };
}

/** the day's stops as numbered features, in the place's own colour */
function stopsFC(stops: Place[], num: Map<string, number>, catColors: CatColors): FeatureCollection<Point> {
  return {
    type: "FeatureCollection",
    features: stops.map((p) => ({
      type: "Feature",
      id: p.id,
      geometry: { type: "Point", coordinates: [p.lng, p.lat] },
      properties: { id: p.id, name: p.name, color: colorFor(p, catColors), n: num.get(p.id) ?? 0 },
    })),
  };
}

/** the line joining a day's stops in order. Each hop bows gently to one
 *  side (a quadratic curve, a fifth of its length) so it reads as "then
 *  here", never as the street route — between stations it would be a lie. */
function routeLine(places: Place[], route: string[] | undefined): FeatureCollection<LineString> {
  const byId = new Map(places.map((p) => [p.id, p] as const));
  const pts = (route ?? []).map((id) => byId.get(id)).filter((p): p is Place => !!p)
    .filter((p, i, all) => i === 0 || p.id !== all[i - 1].id);
  if (pts.length < 2) return { type: "FeatureCollection", features: [] };
  const k = Math.cos((pts[0].lat * Math.PI) / 180);
  const coords: [number, number][] = [[pts[0].lng, pts[0].lat]];
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i];
    // work in a locally square plane so the bow is round at any latitude
    const ax = a.lng * k, bx = b.lng * k;
    const dx = bx - ax, dy = b.lat - a.lat;
    const cx = (ax + bx) / 2 - dy * 0.2, cy = (a.lat + b.lat) / 2 + dx * 0.2;
    for (let t = 1 / 24; t <= 1.0001; t += 1 / 24) {
      const u = 1 - t;
      const x = u * u * ax + 2 * u * t * cx + t * t * bx;
      const y = u * u * a.lat + 2 * u * t * cy + t * t * b.lat;
      coords.push([x / k, y]);
    }
  }
  return { type: "FeatureCollection", features: [{ type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: coords } }] };
}

/** the trip's accent as a colour the map can paint, read from the live
 *  palette so it follows light/dark and the trip's theme */
function accentColor(): string {
  const v = getComputedStyle(document.documentElement).getPropertyValue("--c-accent").trim();
  return v ? `rgb(${v.split(/\s+/).join(",")})` : FALLBACK;
}

/** categories the trip wants kept on screen when zoomed out (`config.pinnedCategories`) */
function splitPinned(places: Place[], cats: string[] | undefined): { pinned: Place[]; rest: Place[] } {
  if (!cats?.length) return { pinned: [], rest: places };
  const on = new Set(cats);
  return { pinned: places.filter((p) => p.category && on.has(p.category)), rest: places.filter((p) => !p.category || !on.has(p.category)) };
}

/** pinned pins show while you're browsing a city (a whole city is about zoom 10) and
 *  drop out at regional / country views, where a pin per city would just be noise */
const PINNED_MINZOOM = 9;

/** like `iconSize`, but bigger all the way down so a pinned marker reads from far out */
const pinnedIconSize = (selId: string): unknown => {
  const bump = ["case", ["==", ["get", "id"], selId], 1.2, 1];
  return [
    "interpolate", ["linear"], ["zoom"],
    9, ["*", 0.95, bump],
    11, ["*", 1.15, bump],
    13, ["*", 1.4, bump],
    16, ["*", 1.6, bump],
  ];
};

/** icon-size for the glyph markers: a zoom ramp, enlarged for the selected pin.
 *  The zoom `interpolate` has to stay top-level, so the selected bump is folded
 *  into each stop rather than multiplied on the outside. */
const iconSize = (selId: string): unknown => {
  const bump = ["case", ["==", ["get", "id"], selId], 1.2, 1];
  return [
    "interpolate", ["linear"], ["zoom"],
    8, ["*", 0.72, bump],
    12, ["*", 1.05, bump],
    16, ["*", 1.28, bump],
  ];
};
type AreaShapeProps = { name: string; color: string };
type AreaShapes = FeatureCollection<Polygon, AreaShapeProps>;
const EMPTY_FC: AreaShapes = { type: "FeatureCollection", features: [] };
/** opacity curve for the area outlines: in once a city fills the screen (at
 *  country scale a neighbourhood ring is a dot, and its name sat over the
 *  pin clusters), out again once you're zoomed into streets */
const areaFade = (peak: number): unknown =>
  ["interpolate", ["linear"], ["zoom"], 9, 0, 10.5, peak, 12.5, peak, 14.5, 0];

export function MapView({
  places,
  selectedId,
  derivedIds,
  areaShapes,
  transit,
  basePois = true,
  categoryIcons,
  categoryColors,
  pinnedCategories,
  route,
  dark,
  onSelect,
  onMapClick,
  onLongPress,
  onPoiClick,
  onContextMenu,
  onReady,
  coverBottom,
}: {
  places: Place[];
  selectedId: string | null;
  /** ids shown only because an area brought them in — rendered subtly */
  derivedIds?: Set<string>;
  /** place-category → marker glyph id (`config.categoryIcons`) */
  categoryIcons?: Record<string, string>;
  /** place-category → pin colour (`config.categoryColors`), over a pin's own */
  categoryColors?: Record<string, string>;
  /** categories drawn on top, unclustered, and kept visible when zoomed out */
  pinnedCategories?: string[];
  /** a day's places in plan order (ids, repeats allowed): numbered pins
   *  joined by a dotted line. Two stops or more, else ordinary pins. */
  route?: string[];
  /** area outlines to draw under the pins (visible when zoomed out) */
  areaShapes?: AreaShapes | null;
  /** enabled transit categories ("train" | "metro" | "tram" | "bus" | "airport") */
  transit?: Set<string>;
  /** the base map's own places (stations, parks, shops) — off leaves only your pins */
  basePois?: boolean;
  dark: boolean;
  onSelect: (id: string | null) => void;
  onMapClick?: (lat: number, lng: number) => void;
  onLongPress?: (lat: number, lng: number) => void;
  /** a click on one of the base map's own places (a park, a station, a
   *  shop) — `x`/`y` is the click in the viewport, for a card beside it */
  onPoiClick?: (poi: BasePoi) => void;
  /** a right-click with a mouse (a touch hold is `onLongPress`) — `x`/`y`
   *  is the click in the viewport, for a menu beside it */
  onContextMenu?: (at: { lat: number; lng: number; x: number; y: number }) => void;
  onReady?: (map: MLMap) => void;
  /** how much of the map's foot a sheet covers (px), so a picked place is
   *  centred in what's left showing */
  coverBottom?: number;
}) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<MLMap | null>(null);
  const ready = useRef(false);
  /** the pick the camera last went to — see the selection effect */
  const flownTo = useRef<string | null>(null);
  const tileErrs = useRef(0);
  const tilesOk = useRef(0);
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [retryKey, setRetryKey] = useState(0);
  const [online, setOnline] = useState(() => (typeof navigator === "undefined" ? true : navigator.onLine));
  const state = useRef({ places, selectedId, derivedIds, areaShapes, transit, basePois, categoryIcons, categoryColors, pinnedCategories, route, dark, onSelect, onMapClick, onLongPress, onPoiClick, onContextMenu, onReady, coverBottom });
  state.current = { places, selectedId, derivedIds, areaShapes, transit, basePois, categoryIcons, categoryColors, pinnedCategories, route, dark, onSelect, onMapClick, onLongPress, onPoiClick, onContextMenu, onReady, coverBottom };

  const applyBasePois = (m: MLMap, on: boolean) => {
    if (m.getLayer(BASE_POIS_LAYER)) m.setLayoutProperty(BASE_POIS_LAYER, "visibility", on ? "visible" : "none");
  };

  /* show/hide transit layers to match the current filter */
  const applyTransit = (m: MLMap, enabled: Set<string> | undefined) => {
    for (const [layerId, kinds] of Object.entries(TRANSIT_CONTROLS)) {
      if (!m.getLayer(layerId)) continue;
      const on = !!enabled && kinds.some((k) => enabled.has(k));
      m.setLayoutProperty(layerId, "visibility", on ? "visible" : "none");
    }
  };

  /* add our source + layers on top of the basemap (re-run after a style swap) */
  const addLayers = (m: MLMap) => {
    const { places: all, selectedId: s, derivedIds: di, areaShapes: sh, transit: tr, categoryIcons: ci, categoryColors: cc, pinnedCategories: pc, route: rt, dark: d } = state.current;
    const { stops, others: p, num } = splitStops(all, rt);
    const { pinned, rest } = splitPinned(p, pc);
    const halo = d ? "#14181c" : "#f2efe8";
    const ink = d ? "#e7ebee" : "#1a2026";

    // transit overlay sits ABOVE the basemap but under our areas + pins
    for (const layer of transitLayers(d)) m.addLayer(layer);
    applyTransit(m, tr);
    applyBasePois(m, state.current.basePois);

    // area outlines sit UNDERNEATH the pins
    m.addSource("areas", { type: "geojson", data: sh ?? EMPTY_FC });
    m.addLayer({
      id: "area-fill", type: "fill", source: "areas",
      paint: { "fill-color": ["get", "color"], "fill-opacity": areaFade(0.06) as number },
    });
    m.addLayer({
      id: "area-line", type: "line", source: "areas",
      paint: { "line-color": ["get", "color"], "line-width": 1.25, "line-opacity": areaFade(0.7) as number },
    });
    m.addLayer({
      id: "area-label", type: "symbol", source: "areas",
      layout: {
        "text-field": ["get", "name"], "text-font": ["Noto Sans Medium"], "text-size": 11,
        "text-transform": "uppercase", "text-letter-spacing": 0.08,
        "text-allow-overlap": true, "text-ignore-placement": true,
        "text-offset": [0, -0.9], "text-anchor": "bottom",
      },
      paint: { "text-color": ["get", "color"], "text-opacity": areaFade(0.95) as number, "text-halo-color": halo, "text-halo-width": 2 },
    });

    // the day's route: a dotted line under every pin, as Maps draws a walk
    m.addSource("route", { type: "geojson", data: routeLine(all, rt) });
    // a pale ribbon under the dots, so they read over rail lines of the
    // same blue and any street colour
    m.addLayer({
      id: "route-casing", type: "line", source: "route",
      layout: { "line-cap": "round", "line-join": "round" },
      paint: {
        "line-color": halo,
        "line-width": ["interpolate", ["linear"], ["zoom"], 10, 7, 15, 11],
        "line-opacity": 0.85,
      },
    });
    m.addLayer({
      id: "route-line", type: "line", source: "route",
      layout: { "line-cap": "round", "line-join": "round" },
      paint: {
        "line-color": accentColor(),
        "line-width": ["interpolate", ["linear"], ["zoom"], 10, 3, 15, 5],
        "line-dasharray": [0, 1.7],
        "line-opacity": 0.9,
      },
    });

    ensureMarkerImages(m, p, ci, cc, d);
    m.addSource("places", { type: "geojson", data: toFC(rest, di, ci, cc, d), cluster: true, clusterRadius: 46, clusterMaxZoom: 13 });

    m.addLayer({
      id: "clusters", type: "circle", source: "places", filter: ["has", "point_count"],
      paint: {
        "circle-color": ink,
        "circle-radius": ["step", ["get", "point_count"], 15, 10, 19, 25, 24],
        "circle-stroke-width": 3, "circle-stroke-color": halo,
      },
    });
    m.addLayer({
      id: "cluster-count", type: "symbol", source: "places", filter: ["has", "point_count"],
      layout: { "text-field": ["get", "point_count_abbreviated"], "text-font": ["Noto Sans Medium"], "text-size": 12 },
      paint: { "text-color": halo },
    });
    m.addLayer({
      id: "pin-halo", type: "circle", source: "places",
      filter: ["all", ["!", ["has", "point_count"]], ["==", ["get", "id"], sel(s)]],
      paint: {
        "circle-radius": ["case", ["==", ["get", "glyph"], ""], 16, 22],
        "circle-color": ["get", "color"], "circle-opacity": 0.22,
      },
    });
    // plain dots — pins whose category has no glyph
    m.addLayer({
      id: "pins", type: "circle", source: "places",
      filter: ["all", ["!", ["has", "point_count"]], ["==", ["get", "glyph"], ""]],
      paint: {
        "circle-color": ["get", "color"],
        "circle-radius": ["case", ["==", ["get", "id"], sel(s)], 10, ["get", "derived"], 6, 7.5],
        "circle-opacity": ["case", ["==", ["get", "id"], sel(s)], 1, ["get", "derived"], 0.55, 1],
        "circle-stroke-width": ["case", ["==", ["get", "id"], sel(s)], 3, 2],
        "circle-stroke-color": d ? "#14181c" : "#fdfcf9",
        "circle-stroke-opacity": ["case", ["==", ["get", "id"], sel(s)], 1, ["get", "derived"], 0.55, 1],
      },
    });
    // glyph markers — pins whose category maps to an icon
    m.addLayer({
      id: "pins-icon", type: "symbol", source: "places",
      filter: ["all", ["!", ["has", "point_count"]], ["!=", ["get", "glyph"], ""]],
      layout: {
        "icon-image": ["get", "icon"],
        "icon-size": iconSize(sel(s)) as number,
        "icon-allow-overlap": true,
        "icon-ignore-placement": true,
      },
      paint: { "icon-opacity": ["case", ["get", "derived"], 0.6, 1] },
    });
    m.addLayer({
      id: "pin-label", type: "symbol", source: "places",
      filter: ["all", ["!", ["has", "point_count"]], ["==", ["get", "id"], sel(s)]],
      layout: {
        "text-field": ["get", "name"], "text-font": ["Noto Sans Medium"], "text-size": 12,
        "text-offset": ["case", ["==", ["get", "glyph"], ""], ["literal", [0, 1.6]], ["literal", [0, 2]]],
        "text-anchor": "top", "text-max-width": 9,
      },
      paint: { "text-color": ink, "text-halo-color": halo, "text-halo-width": 2 },
    });

    // pinned categories: their own source, so nothing folds them into a cluster,
    // and drawn last, so they sit above every cluster, area outline and pin
    m.addSource("pinned", { type: "geojson", data: toFC(pinned, di, ci, cc, d) });
    m.addLayer({
      id: "pinned-dot", type: "circle", source: "pinned", minzoom: PINNED_MINZOOM,
      filter: ["==", ["get", "glyph"], ""],
      paint: {
        "circle-color": ["get", "color"],
        "circle-radius": ["interpolate", ["linear"], ["zoom"], 9, 7, 12, 9, 15, 12],
        "circle-stroke-width": 3,
        "circle-stroke-color": halo,
      },
    });
    m.addLayer({
      id: "pinned-icon", type: "symbol", source: "pinned", minzoom: PINNED_MINZOOM,
      filter: ["!=", ["get", "glyph"], ""],
      layout: {
        "icon-image": ["get", "icon"],
        "icon-size": pinnedIconSize(sel(s)) as number,
        "icon-allow-overlap": true,
        "icon-ignore-placement": true,
      },
    });
    // the day's stops: numbered discs over everything else, never clustered
    m.addSource("stops", { type: "geojson", data: stopsFC(stops, num, cc) });
    m.addLayer({
      id: "stop-halo", type: "circle", source: "stops", filter: ["==", ["get", "id"], sel(s)],
      paint: { "circle-radius": 24, "circle-color": ["get", "color"], "circle-opacity": 0.22 },
    });
    m.addLayer({
      id: "stop-dot", type: "circle", source: "stops",
      paint: {
        "circle-color": ["get", "color"],
        "circle-radius": stopRadius(sel(s)) as number,
        "circle-stroke-width": 2.5,
        "circle-stroke-color": d ? "#14181c" : "#ffffff",
      },
    });
    m.addLayer({
      id: "stop-num", type: "symbol", source: "stops",
      layout: {
        "text-field": ["to-string", ["get", "n"]], "text-font": ["Noto Sans Medium"],
        "text-size": ["case", ["==", ["get", "id"], sel(s)], 15, 13],
        "text-allow-overlap": true, "text-ignore-placement": true,
      },
      paint: { "text-color": "#ffffff" },
    });
    m.addLayer({
      id: "stop-label", type: "symbol", source: "stops",
      layout: {
        "text-field": ["get", "name"], "text-font": ["Noto Sans Medium"], "text-size": 12,
        "text-offset": [0, 1.5], "text-anchor": "top", "text-max-width": 9, "text-optional": true,
      },
      paint: { "text-color": ink, "text-halo-color": halo, "text-halo-width": 2 },
    });

    m.addLayer({
      id: "pinned-label", type: "symbol", source: "pinned", minzoom: 11,
      layout: {
        "text-field": ["get", "name"], "text-font": ["Noto Sans Medium"], "text-size": 12,
        "text-offset": [0, 2.3], "text-anchor": "top", "text-max-width": 9,
      },
      paint: { "text-color": ink, "text-halo-color": halo, "text-halo-width": 2 },
    });
  };

  /* init */
  useEffect(() => {
    if (!el.current || map.current) return;
    if (!protocolRegistered) { addProtocol("pmtiles", new Protocol().tile); protocolRegistered = true; }

    const m = new MLMap({
      container: el.current,
      style: buildMapStyle(state.current.dark),
      // a neutral, trip-agnostic starting view — the caller fits to the
      // trip's own places as soon as they're known (see MapTab's fitScope)
      center: [0, 20],
      zoom: 1.5,
      attributionControl: false,
      dragRotate: false,
      pitchWithRotate: false,
    });
    // no NavigationControl — its boxed, drop-shadowed buttons clash with the
    // flat / hairline UI; a matching +/- is rendered in JSX below instead
    m.addControl(new AttributionControl({ compact: true }), "bottom-right");
    tileErrs.current = 0;
    tilesOk.current = 0;
    m.on("sourcedata", (e) => {
      // count only tiles that actually returned renderable data, so a fully
      // failed basemap keeps tilesOk at 0
      if (e.sourceId === "protomaps" && (e as { tile?: { state?: string } }).tile?.state === "loaded")
        tilesOk.current += 1;
    });
    m.on("error", (e) => {
      console.error("[MapView]", (e as { error?: Error }).error?.message || e);
      tileErrs.current += 1;
      // Fail fast once errors pile up with nothing on screen — the offline,
      // un-cached-area case. A stray edge-of-extract 404 while other tiles
      // load fine won't trip this (tilesOk stays > 0).
      if (tileErrs.current >= 4 && tilesOk.current === 0)
        setStatus((s) => (s === "loading" ? "error" : s));
    });

    m.on("load", () => {
      addLayers(m);
      const { selectedId: s0, places: p0 } = state.current;
      applySelection(m, s0);
      const picked = s0 ? p0.find((x) => x.id === s0) : undefined;
      if (picked) { flownTo.current = s0; flyToPlace(m, picked, false, state.current.coverBottom); }
      const pointer = () => (m.getCanvas().style.cursor = "pointer");
      const noPointer = () => (m.getCanvas().style.cursor = "");
      for (const l of PIN_LAYERS) { m.on("mouseenter", l, pointer); m.on("mouseleave", l, noPointer); }

      const pickPin = (e: MapLayerMouseEvent) => {
        const id = e.features?.[0]?.properties?.id as string | undefined;
        if (id) state.current.onSelect(id);
      };
      m.on("click", "pins", pickPin);
      m.on("click", "pins-icon", pickPin);
      m.on("click", "pinned-icon", pickPin);
      m.on("click", "pinned-dot", pickPin);
      m.on("click", "stop-dot", pickPin);
      m.on("click", "clusters", async (e: MapLayerMouseEvent) => {
        const f = e.features?.[0];
        const cid = f?.properties?.cluster_id;
        if (cid == null) return;
        const src = m.getSource("places") as GeoJSONSource;
        const zoom = await src.getClusterExpansionZoom(cid);
        const coords = (f!.geometry as Point).coordinates as [number, number];
        m.easeTo({ center: coords, zoom });
      });
      // every place the base map draws opens on a click, as Maps opens any
      // place on its map: a labelled or iconed spot (a shop, a temple, a
      // station, a lake), else the named area under the click (a park's
      // green, a campus). Searched in a small box so a tap needn't land
      // exactly on a 12px icon.
      const placeAt = (pt: MapMouseEvent["point"]): Omit<BasePoi, "x" | "y"> | undefined => {
        if (!state.current.onPoiClick) return undefined;
        const kindOf = (f: GeoJSONFeature) => (typeof f.properties?.kind === "string" ? f.properties.kind : undefined);
        const box: [[number, number], [number, number]] = [[pt.x - 8, pt.y - 8], [pt.x + 8, pt.y + 8]];
        const spots = PLACE_LAYERS.filter((l) => m.getLayer(l));
        const spot = spots.length ? m.queryRenderedFeatures(box, { layers: spots }).find((f) => labelName(f.properties) || kindOf(f)) : undefined;
        if (spot) {
          // a spot's own position, not wherever on its label the click landed
          const [lng, lat] = spot.geometry.type === "Point" ? (spot.geometry.coordinates as [number, number]) : m.unproject(pt).toArray();
          return { name: labelName(spot.properties) ?? kindLabel(kindOf(spot)!), kind: kindOf(spot), lat, lng };
        }
        const areas = AREA_LAYERS.filter((l) => m.getLayer(l));
        const area = areas.length ? m.queryRenderedFeatures(pt, { layers: areas })[0] : undefined;
        const kind = area && kindOf(area);
        if (!area || !kind) return undefined;
        const here = m.unproject(pt);
        const named = labelName(area.properties);
        if (named) return { name: named, kind: area.properties?.kind_detail ?? kind, lat: here.lat, lng: here.lng };
        // an area's shape carries no name in the tiles — a park's name sits
        // on one point of the same kind inside it, so take the nearest
        // inside this very shape first, else the nearest close by
        let best: { f: GeoJSONFeature; d: number } | undefined;
        for (const f of m.querySourceFeatures("protomaps", { sourceLayer: "pois", filter: ["==", ["get", "kind"], kind] })) {
          if (f.geometry.type !== "Point" || !labelName(f.properties)) continue;
          const p = f.geometry.coordinates as [number, number];
          const d = inShape(p, area.geometry) ? 0 : here.distanceTo(new LngLat(...p));
          if (d < AREA_NAME_REACH_M && (!best || d < best.d)) best = { f, d };
        }
        if (!best) return undefined;
        const [lng, lat] = (best.f.geometry as Point).coordinates;
        return { name: labelName(best.f.properties)!, kind, lat, lng };
      };
      // one hit test per frame, not per mouse event — `placeAt` can walk
      // every point of interest in the tile when the pointer's over a park
      let hoverAt: MapMouseEvent["point"] | null = null;
      m.on("mousemove", (e: MapMouseEvent) => {
        if (hoverAt) { hoverAt = e.point; return; }
        hoverAt = e.point;
        requestAnimationFrame(() => {
          const pt = hoverAt!;
          hoverAt = null;
          if (map.current !== m) return;
          if (!m.queryRenderedFeatures(pt, { layers: PIN_LAYERS }).length) m.getCanvas().style.cursor = placeAt(pt) ? "pointer" : "";
        });
      });
      // a held finger already dropped a pin; the click its lift makes isn't a tap
      let heldDown = false;
      m.on("click", (e: MapMouseEvent) => {
        if (heldDown) { heldDown = false; return; }
        if (m.queryRenderedFeatures(e.point, { layers: PIN_LAYERS }).length) return;
        const place = placeAt(e.point);
        if (place) {
          const box = m.getCanvas().getBoundingClientRect();
          state.current.onPoiClick!({ ...place, x: box.left + e.point.x, y: box.top + e.point.y });
        } else state.current.onMapClick?.(e.lngLat.lat, e.lngLat.lng);
      });

      // right-click → a menu at that spot, as Maps on a Mac. Mouse only: a
      // touch hold fires contextmenu too on Android, and is the long-press
      // below. Not on a pin, which has its own click.
      m.on("contextmenu", (e: MapMouseEvent) => {
        const oe = e.originalEvent as MouseEvent & { pointerType?: string };
        if (!state.current.onContextMenu) return;
        if (oe.pointerType ? oe.pointerType !== "mouse" : !matchMedia("(pointer: fine)").matches) return;
        if (m.queryRenderedFeatures(e.point, { layers: PIN_LAYERS }).length) return;
        e.preventDefault();
        oe.preventDefault();
        state.current.onContextMenu({ lat: e.lngLat.lat, lng: e.lngLat.lng, x: oe.clientX, y: oe.clientY });
      });

      // long-press → drop a pin (optional mobile shortcut)
      let lpTimer: ReturnType<typeof setTimeout> | null = null;
      const clearLp = () => { if (lpTimer) { clearTimeout(lpTimer); lpTimer = null; } };
      m.on("touchstart", (e: MapTouchEvent) => {
        clearLp();
        heldDown = false;
        if (e.originalEvent.touches.length !== 1) return;
        const ll = e.lngLat;
        lpTimer = setTimeout(() => { heldDown = !!state.current.onLongPress; state.current.onLongPress?.(ll.lat, ll.lng); }, 500);
      });
      m.on("touchend", clearLp);
      m.on("touchmove", clearLp);
      m.on("dragstart", clearLp);

      ready.current = true;
      state.current.onReady?.(m);
    });

    // Map settled: show it if any tile made it, otherwise it's broken.
    const settle = () => setStatus((s) => (s === "loading" ? (tilesOk.current > 0 ? "ok" : "error") : s));
    m.once("idle", settle);
    // last resort — the Source Cooperative planet archive can be 20–30s to
    // first paint, so wait a while before forcing the decision.
    const paintFallback = setTimeout(settle, 25000);

    map.current = m;
    return () => { clearTimeout(paintFallback); m.remove(); map.current = null; ready.current = false; };
  }, [retryKey]); // eslint-disable-line react-hooks/exhaustive-deps

  /* data — a dark-mode flip is handled by the theme effect (it rebuilds every
     layer and marker image), so it's deliberately not a dep here */
  useEffect(() => {
    const m = map.current;
    if (!ready.current || !m) return;
    const { stops, others, num } = splitStops(places, route);
    ensureMarkerImages(m, others, categoryIcons, categoryColors, state.current.dark);
    const { pinned, rest } = splitPinned(others, pinnedCategories);
    (m.getSource("stops") as GeoJSONSource | undefined)?.setData(stopsFC(stops, num, categoryColors));
    (m.getSource("route") as GeoJSONSource | undefined)?.setData(routeLine(places, route));
    (m.getSource("places") as GeoJSONSource | undefined)?.setData(toFC(rest, derivedIds, categoryIcons, categoryColors, state.current.dark));
    (m.getSource("pinned") as GeoJSONSource | undefined)?.setData(toFC(pinned, derivedIds, categoryIcons, categoryColors, state.current.dark));
  }, [places, derivedIds, categoryIcons, categoryColors, pinnedCategories, route]);

  useEffect(() => {
    if (ready.current) (map.current!.getSource("areas") as GeoJSONSource | undefined)?.setData(areaShapes ?? EMPTY_FC);
  }, [areaShapes]);

  /* transit filter */
  useEffect(() => {
    if (ready.current && map.current) applyTransit(map.current, transit);
  }, [transit]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (ready.current && map.current) applyBasePois(map.current, basePois);
  }, [basePois]); // eslint-disable-line react-hooks/exhaustive-deps

  /* selection — the camera goes to a pin only when the pick changes (or its
     place first turns up). A new places array alone — a fetched fact or a
     synced edit landing while the card is open — just re-applies the
     highlight, so it never pulls the map back from where you panned it. */
  useEffect(() => {
    const m = map.current;
    if (!m || !ready.current) return;
    applySelection(m, selectedId);
    const p = selectedId ? places.find((x) => x.id === selectedId) : undefined;
    const move = p && flownTo.current !== selectedId ? p : null;
    flownTo.current = p ? selectedId : null;
    // a frame later, so the sheet's height for this pick has been measured
    if (move) requestAnimationFrame(() => { if (map.current === m) flyToPlace(m, move, true, state.current.coverBottom); });
  }, [selectedId, places]);

  /* theme */
  useEffect(() => {
    const m = map.current;
    if (!m || !ready.current) return;
    m.setStyle(buildMapStyle(dark));
    m.once("styledata", () => { if (!m.getSource("places")) addLayers(m); });
  }, [dark]); // eslint-disable-line react-hooks/exhaustive-deps

  const retry = () => {
    setStatus("loading");
    tileErrs.current = 0;
    tilesOk.current = 0;
    setRetryKey((k) => k + 1);
  };

  /* connectivity — drives the failed-state copy, and auto-retries the moment
     the connection comes back */
  useEffect(() => {
    const sync = () => setOnline(navigator.onLine);
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  useEffect(() => {
    if (online && status === "error") retry();
  }, [online]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="relative h-full w-full">
      <div ref={el} className="h-full w-full" />
      {status === "ok" && (
        <div className="glass absolute right-3 top-3 flex flex-col overflow-hidden rounded-full text-ink">
          <button
            onClick={() => map.current?.zoomIn()}
            aria-label="Zoom in"
            className="grid h-11 w-11 place-items-center transition-colors active:bg-ink/[0.07]"
          >
            <Icon name="plus" size={17} />
          </button>
          <button
            onClick={() => map.current?.zoomOut()}
            aria-label="Zoom out"
            className="grid h-11 w-11 place-items-center transition-colors active:bg-ink/[0.07]"
          >
            <Icon name="minus" size={17} />
          </button>
        </div>
      )}
      {status === "ok" && <LocateControl getMap={() => map.current} mapKey={retryKey} />}
      {status === "loading" && (
        // centred in what a bottom sheet leaves showing, like the message below
        <div className="pointer-events-none absolute inset-0 grid place-items-center bg-bg" style={{ paddingBottom: coverBottom }}>
          <Loader label="Loading the map" />
        </div>
      )}
      {status === "error" && (
        <div className="absolute inset-0 grid place-items-center bg-bg px-6" style={{ paddingBottom: coverBottom }}>
          <div className="max-w-xs text-center">
            <Icon name="map" size={30} className="mx-auto text-ink-faint" />
            <h2 className="mt-3 font-display text-lg">{online ? "Map didn’t load" : "You’re offline"}</h2>
            <p className="mt-1 text-sm text-ink-soft">
              {online
                ? "Couldn’t reach the map tiles. Your pins and the plan still work."
                : "Areas you’ve already opened stay on the device. This one isn’t downloaded yet."}
            </p>
            <button onClick={retry} className="btn mt-4">Try again</button>
          </div>
        </div>
      )}
    </div>
  );
}

export type { MLMap };
