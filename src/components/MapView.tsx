import { useEffect, useRef, useState } from "react";
import {
  Map as MLMap,
  NavigationControl,
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
import { transitLayers, TRANSIT_CONTROLS } from "@/lib/transitLayers";
import type { Place } from "@/core/types";

const FALLBACK = "#5f7f9c";
let protocolRegistered = false;

type Props = { id: string; name: string; color: string; derived: boolean };

function toFC(places: Place[], derivedIds?: Set<string>): FeatureCollection<Point, Props> {
  return {
    type: "FeatureCollection",
    features: places.map((p) => ({
      type: "Feature",
      id: p.id,
      geometry: { type: "Point", coordinates: [p.lng, p.lat] },
      properties: { id: p.id, name: p.name, color: p.color || FALLBACK, derived: !!derivedIds?.has(p.id) },
    })),
  };
}

const sel = (id: string | null) => id ?? "__none__";
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
  const [painted, setPainted] = useState(false);
  const state = useRef({ places, selectedId, derivedIds, areaShapes, transit, dark, onSelect, onMapClick, onLongPress, onReady });
  state.current = { places, selectedId, derivedIds, areaShapes, transit, dark, onSelect, onMapClick, onLongPress, onReady };

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
    const { places: p, selectedId: s, derivedIds: di, areaShapes: sh, transit: tr, dark: d } = state.current;
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

    m.addSource("places", { type: "geojson", data: toFC(p, di), cluster: true, clusterRadius: 46, clusterMaxZoom: 13 });

    m.addLayer({
      id: "clusters", type: "circle", source: "places", filter: ["has", "point_count"],
      paint: {
        "circle-color": d ? "#e7ebee" : "#1a2026",
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
      paint: { "circle-radius": 13, "circle-color": ["get", "color"], "circle-opacity": 0.22 },
    });
    m.addLayer({
      id: "pins", type: "circle", source: "places", filter: ["!", ["has", "point_count"]],
      paint: {
        "circle-color": ["get", "color"],
        "circle-radius": ["case", ["==", ["get", "id"], sel(s)], 8, ["get", "derived"], 4.5, 5.5],
        "circle-opacity": ["case", ["==", ["get", "id"], sel(s)], 1, ["get", "derived"], 0.55, 1],
        "circle-stroke-width": ["case", ["==", ["get", "id"], sel(s)], 2.5, 1.5],
        "circle-stroke-color": d ? "#14181c" : "#fdfcf9",
        "circle-stroke-opacity": ["case", ["==", ["get", "id"], sel(s)], 1, ["get", "derived"], 0.55, 1],
      },
    });
    m.addLayer({
      id: "pin-label", type: "symbol", source: "places",
      filter: ["all", ["!", ["has", "point_count"]], ["==", ["get", "id"], sel(s)]],
      layout: {
        "text-field": ["get", "name"], "text-font": ["Noto Sans Medium"], "text-size": 12,
        "text-offset": [0, 1.3], "text-anchor": "top", "text-max-width": 9,
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
      center: [139.76, 35.68],
      zoom: 9,
      attributionControl: false,
      dragRotate: false,
      pitchWithRotate: false,
    });
    m.addControl(new NavigationControl({ showCompass: false }), "top-right");
    m.addControl(new AttributionControl({ compact: true }), "bottom-right");
    m.on("error", (e) => console.error("[MapView]", (e as { error?: Error }).error?.message || e));

    m.on("load", () => {
      addLayers(m);
      const pointer = () => (m.getCanvas().style.cursor = "pointer");
      const noPointer = () => (m.getCanvas().style.cursor = "");
      for (const l of ["pins", "clusters"]) { m.on("mouseenter", l, pointer); m.on("mouseleave", l, noPointer); }

      m.on("click", "pins", (e: MapLayerMouseEvent) => {
        const id = e.features?.[0]?.properties?.id as string | undefined;
        if (id) state.current.onSelect(id);
      });
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
        if (m.queryRenderedFeatures(e.point, { layers: ["pins", "clusters"] }).length === 0)
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

    m.once("idle", () => setPainted(true));
    const paintFallback = setTimeout(() => setPainted(true), 20000);

    map.current = m;
    return () => { clearTimeout(paintFallback); m.remove(); map.current = null; ready.current = false; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* data */
  useEffect(() => {
    if (ready.current) (map.current!.getSource("places") as GeoJSONSource | undefined)?.setData(toFC(places, derivedIds));
  }, [places, derivedIds]);

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
    m.setPaintProperty("pins", "circle-radius", ["case", ["==", ["get", "id"], s], 8, 5.5]);
    m.setPaintProperty("pins", "circle-stroke-width", ["case", ["==", ["get", "id"], s], 2.5, 1.5]);
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

  return (
    <div className="relative h-full w-full">
      <div ref={el} className="h-full w-full" />
      {!painted && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center bg-bg">
          <p className="meta animate-pulse">Loading the map…</p>
        </div>
      )}
    </div>
  );
}

export type { MLMap };
