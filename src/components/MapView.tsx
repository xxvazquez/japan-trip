import { useEffect, useRef, useState } from "react";
import {
  Map as MLMap,
  AttributionControl,
  addProtocol,
  type GeoJSONSource,
  type MapMouseEvent,
  type MapLayerMouseEvent,
  type MapTouchEvent,
} from "maplibre-gl";
import { Protocol } from "pmtiles";
import type { FeatureCollection, Point, Polygon } from "geojson";
import "maplibre-gl/dist/maplibre-gl.css";
import { buildMapStyle } from "@/lib/mapStyle";
import { Icon } from "@/components/Icon";
import { Loader } from "@/components/Loader";
import { transitLayers, TRANSIT_CONTROLS } from "@/lib/transitLayers";
import { buildMarkerImage, markerKey } from "@/lib/mapGlyphs";
import type { Place } from "@/core/types";
import { DEFAULT_ACCENT } from "@/lib/themePresets";

const FALLBACK = DEFAULT_ACCENT;
let protocolRegistered = false;

type CatIcons = Record<string, string> | undefined;
type Props = { id: string; name: string; color: string; derived: boolean; glyph: string; icon: string };

/** the marker glyph id for a place, or "" if its category has none */
const glyphFor = (p: Place, catIcons: CatIcons) => (p.category && catIcons?.[p.category]) || "";

function toFC(places: Place[], derivedIds: Set<string> | undefined, catIcons: CatIcons): FeatureCollection<Point, Props> {
  return {
    type: "FeatureCollection",
    features: places.map((p) => {
      const glyph = glyphFor(p, catIcons);
      const color = p.color || FALLBACK;
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
          icon: glyph ? markerKey(glyph, color) : "",
        },
      };
    }),
  };
}

/** make sure every (glyph, colour) pair on screen has a registered marker bitmap */
function ensureMarkerImages(m: MLMap, places: Place[], catIcons: CatIcons, dark: boolean) {
  if (!catIcons) return;
  for (const p of places) {
    const glyph = glyphFor(p, catIcons);
    if (!glyph) continue;
    const color = p.color || FALLBACK;
    const key = markerKey(glyph, color);
    if (m.hasImage(key)) continue;
    m.addImage(key, buildMarkerImage(glyph, color, dark), { pixelRatio: 2 });
  }
}

const sel = (id: string | null) => id ?? "__none__";

/** categories the trip wants kept on screen when zoomed out (`config.pinnedCategories`) */
function splitPinned(places: Place[], cats: string[] | undefined): { pinned: Place[]; rest: Place[] } {
  if (!cats?.length) return { pinned: [], rest: places };
  const on = new Set(cats);
  return { pinned: places.filter((p) => p.category && on.has(p.category)), rest: places.filter((p) => !p.category || !on.has(p.category)) };
}

/** pinned pins stay visible from a country-wide view down; below this they'd just be noise */
const PINNED_MINZOOM = 3;

/** like `iconSize`, but bigger all the way down so a pinned marker reads from far out */
const pinnedIconSize = (selId: string): unknown => {
  const bump = ["case", ["==", ["get", "id"], selId], 1.2, 1];
  return [
    "interpolate", ["linear"], ["zoom"],
    4, ["*", 0.8, bump],
    9, ["*", 1.05, bump],
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
/** opacity curve that fades area outlines out once you're zoomed into streets */
const areaFade = (peak: number): unknown =>
  ["interpolate", ["linear"], ["zoom"], 8, peak, 12.5, peak, 14.5, 0];

export function MapView({
  places,
  selectedId,
  derivedIds,
  areaShapes,
  transit,
  categoryIcons,
  pinnedCategories,
  dark,
  onSelect,
  onMapClick,
  onLongPress,
  onReady,
}: {
  places: Place[];
  selectedId: string | null;
  /** ids shown only because an area brought them in — rendered subtly */
  derivedIds?: Set<string>;
  /** place-category → marker glyph id (`config.categoryIcons`) */
  categoryIcons?: Record<string, string>;
  /** categories drawn on top, unclustered, and kept visible when zoomed out */
  pinnedCategories?: string[];
  /** area outlines to draw under the pins (visible when zoomed out) */
  areaShapes?: AreaShapes | null;
  /** enabled transit categories ("train" | "metro" | "tram" | "bus" | "airport") */
  transit?: Set<string>;
  dark: boolean;
  onSelect: (id: string | null) => void;
  onMapClick?: (lat: number, lng: number) => void;
  onLongPress?: (lat: number, lng: number) => void;
  onReady?: (map: MLMap) => void;
}) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<MLMap | null>(null);
  const ready = useRef(false);
  const tileErrs = useRef(0);
  const tilesOk = useRef(0);
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [retryKey, setRetryKey] = useState(0);
  const [online, setOnline] = useState(() => (typeof navigator === "undefined" ? true : navigator.onLine));
  const state = useRef({ places, selectedId, derivedIds, areaShapes, transit, categoryIcons, pinnedCategories, dark, onSelect, onMapClick, onLongPress, onReady });
  state.current = { places, selectedId, derivedIds, areaShapes, transit, categoryIcons, pinnedCategories, dark, onSelect, onMapClick, onLongPress, onReady };

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
    const { places: p, selectedId: s, derivedIds: di, areaShapes: sh, transit: tr, categoryIcons: ci, pinnedCategories: pc, dark: d } = state.current;
    const { pinned, rest } = splitPinned(p, pc);
    const halo = d ? "#14181c" : "#f2efe8";
    const ink = d ? "#e7ebee" : "#1a2026";

    // transit overlay sits ABOVE the basemap but under our areas + pins
    for (const layer of transitLayers(d)) m.addLayer(layer);
    applyTransit(m, tr);

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

    ensureMarkerImages(m, p, ci, d);
    m.addSource("places", { type: "geojson", data: toFC(rest, di, ci), cluster: true, clusterRadius: 46, clusterMaxZoom: 13 });

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
    m.addSource("pinned", { type: "geojson", data: toFC(pinned, di, ci) });
    m.addLayer({
      id: "pinned-dot", type: "circle", source: "pinned", minzoom: PINNED_MINZOOM,
      filter: ["==", ["get", "glyph"], ""],
      paint: {
        "circle-color": ["get", "color"],
        "circle-radius": ["interpolate", ["linear"], ["zoom"], 4, 6, 10, 9, 15, 12],
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
      const pointer = () => (m.getCanvas().style.cursor = "pointer");
      const noPointer = () => (m.getCanvas().style.cursor = "");
      for (const l of ["pins", "pins-icon", "clusters", "pinned-icon", "pinned-dot"]) { m.on("mouseenter", l, pointer); m.on("mouseleave", l, noPointer); }

      const pickPin = (e: MapLayerMouseEvent) => {
        const id = e.features?.[0]?.properties?.id as string | undefined;
        if (id) state.current.onSelect(id);
      };
      m.on("click", "pins", pickPin);
      m.on("click", "pins-icon", pickPin);
      m.on("click", "pinned-icon", pickPin);
      m.on("click", "pinned-dot", pickPin);
      m.on("click", "clusters", async (e: MapLayerMouseEvent) => {
        const f = e.features?.[0];
        const cid = f?.properties?.cluster_id;
        if (cid == null) return;
        const src = m.getSource("places") as GeoJSONSource;
        const zoom = await src.getClusterExpansionZoom(cid);
        const coords = (f!.geometry as Point).coordinates as [number, number];
        m.easeTo({ center: coords, zoom });
      });
      m.on("click", (e: MapMouseEvent) => {
        if (m.queryRenderedFeatures(e.point, { layers: ["pins", "pins-icon", "clusters", "pinned-icon", "pinned-dot"] }).length === 0)
          state.current.onMapClick?.(e.lngLat.lat, e.lngLat.lng);
      });

      // long-press → drop a pin (optional mobile shortcut)
      let lpTimer: ReturnType<typeof setTimeout> | null = null;
      const clearLp = () => { if (lpTimer) { clearTimeout(lpTimer); lpTimer = null; } };
      m.on("touchstart", (e: MapTouchEvent) => {
        clearLp();
        if (e.originalEvent.touches.length !== 1) return;
        const ll = e.lngLat;
        lpTimer = setTimeout(() => state.current.onLongPress?.(ll.lat, ll.lng), 500);
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
    ensureMarkerImages(m, places, categoryIcons, state.current.dark);
    const { pinned, rest } = splitPinned(places, pinnedCategories);
    (m.getSource("places") as GeoJSONSource | undefined)?.setData(toFC(rest, derivedIds, categoryIcons));
    (m.getSource("pinned") as GeoJSONSource | undefined)?.setData(toFC(pinned, derivedIds, categoryIcons));
  }, [places, derivedIds, categoryIcons, pinnedCategories]);

  useEffect(() => {
    if (ready.current) (map.current!.getSource("areas") as GeoJSONSource | undefined)?.setData(areaShapes ?? EMPTY_FC);
  }, [areaShapes]);

  /* transit filter */
  useEffect(() => {
    if (ready.current && map.current) applyTransit(map.current, transit);
  }, [transit]); // eslint-disable-line react-hooks/exhaustive-deps

  /* selection */
  useEffect(() => {
    const m = map.current;
    if (!m || !ready.current || !m.getLayer("pins")) return;
    const s = sel(selectedId);
    m.setFilter("pin-halo", ["all", ["!", ["has", "point_count"]], ["==", ["get", "id"], s]]);
    m.setFilter("pin-label", ["all", ["!", ["has", "point_count"]], ["==", ["get", "id"], s]]);
    m.setPaintProperty("pins", "circle-radius", ["case", ["==", ["get", "id"], s], 10, ["get", "derived"], 6, 7.5]);
    m.setPaintProperty("pins", "circle-stroke-width", ["case", ["==", ["get", "id"], s], 3, 2]);
    if (m.getLayer("pins-icon")) m.setLayoutProperty("pins-icon", "icon-size", iconSize(s));
    if (m.getLayer("pinned-icon")) m.setLayoutProperty("pinned-icon", "icon-size", pinnedIconSize(s));
    if (m.getLayer("pinned-dot")) m.setPaintProperty("pinned-dot", "circle-stroke-width", ["case", ["==", ["get", "id"], s], 5, 3]);
    const p = selectedId ? places.find((x) => x.id === selectedId) : undefined;
    if (p) m.easeTo({ center: [p.lng, p.lat], zoom: Math.max(m.getZoom(), 14), duration: 500, offset: [0, -70] });
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
        <div className="absolute right-3 top-3 flex flex-col overflow-hidden rounded border border-line bg-surface text-ink-soft">
          <button
            onClick={() => map.current?.zoomIn()}
            aria-label="Zoom in"
            className="grid h-8 w-8 place-items-center transition-colors hover:bg-surface-2 hover:text-ink"
          >
            <Icon name="plus" size={15} />
          </button>
          <button
            onClick={() => map.current?.zoomOut()}
            aria-label="Zoom out"
            className="grid h-8 w-8 place-items-center border-t border-line transition-colors hover:bg-surface-2 hover:text-ink"
          >
            <Icon name="minus" size={15} />
          </button>
        </div>
      )}
      {status === "loading" && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center bg-bg">
          <Loader label="Loading the map" />
        </div>
      )}
      {status === "error" && (
        <div className="absolute inset-0 grid place-items-center bg-bg px-6">
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
