import type { LayerSpecification } from "maplibre-gl";

/**
 * Transit overlay — metro, rail, tram, bus, ferry, airports — drawn straight
 * from the Protomaps basemap vector tiles (`roads` + `pois` source-layers). No
 * data of our own: it works anywhere on Earth the basemap covers, for any trip.
 *
 * Lines split cleanly by `kind_detail`; station POIs don't (a JR station and a
 * metro station are both `kind: "station"`), so the station dots turn on with
 * either Train or Metro.
 */

export type TransitKind = "train" | "metro" | "tram" | "bus" | "ferry" | "airport";
export const TRANSIT_KINDS: TransitKind[] = ["train", "metro", "tram", "bus", "ferry", "airport"];

export const TRANSIT_META: Record<TransitKind, { label: string; light: string; dark: string }> = {
  train: { label: "Train", light: "#4f6591", dark: "#8ea3c9" },
  metro: { label: "Metro", light: "#3f7d6e", dark: "#74b4a1" },
  tram: { label: "Tram", light: "#94788e", dark: "#c0a0b8" },
  bus: { label: "Bus", light: "#8a8172", dark: "#b3a692" },
  ferry: { label: "Ferry", light: "#4f7f97", dark: "#7fb4cc" },
  airport: { label: "Airport", light: "#5c6470", dark: "#9aa4b2" },
};

const SRC = "protomaps";

/** style-layer id → the toggle(s) that reveal it (visible if ANY is enabled) */
export const TRANSIT_CONTROLS: Record<string, TransitKind[]> = {
  "transit-line-train": ["train"],
  "transit-line-metro": ["metro"],
  "transit-line-tram": ["tram"],
  "transit-line-ferry": ["ferry"],
  "transit-station": ["train", "metro"],
  "transit-station-label": ["train", "metro"],
  "transit-bus": ["bus"],
  "transit-ferry": ["ferry"],
  "transit-airport": ["airport"],
  "transit-airport-label": ["airport"],
};

const LATIN = ["coalesce", ["get", "name:en"], ["get", "pgf:name"], ["get", "name"]];

/** All transit layers, added hidden — call applyTransit() to reveal per the filter. */
export function transitLayers(dark: boolean): LayerSpecification[] {
  const tone = (k: TransitKind) => (dark ? TRANSIT_META[k].dark : TRANSIT_META[k].light);
  const halo = dark ? "#14181c" : "#f2efe8";
  const labelInk = dark ? "#aeb8c4" : "#586472";
  const railWidth = ["interpolate", ["exponential", 1.5], ["zoom"], 9, 0.4, 13, 1.3, 16, 3.2];
  const hidden = { visibility: "none" } as const;

  const line = (id: string, k: TransitKind, detail: unknown): LayerSpecification =>
    ({
      id,
      type: "line",
      source: SRC,
      "source-layer": "roads",
      filter: ["all", ["==", ["get", "kind"], "rail"], detail],
      layout: { ...hidden, "line-cap": "round", "line-join": "round" },
      paint: { "line-color": tone(k), "line-width": railWidth, "line-opacity": 0.85 },
    }) as unknown as LayerSpecification;

  return [
    line("transit-line-train", "train", [
      "!",
      ["in", ["get", "kind_detail"], ["literal", ["subway", "tram", "light_rail"]]],
    ]),
    line("transit-line-metro", "metro", ["==", ["get", "kind_detail"], "subway"]),
    line("transit-line-tram", "tram", [
      "in",
      ["get", "kind_detail"],
      ["literal", ["tram", "light_rail"]],
    ]),
    {
      id: "transit-line-ferry",
      type: "line",
      source: SRC,
      "source-layer": "roads",
      filter: ["==", ["get", "kind"], "ferry"],
      layout: { ...hidden, "line-cap": "round" },
      paint: {
        "line-color": tone("ferry"),
        "line-width": ["interpolate", ["linear"], ["zoom"], 8, 0.6, 14, 1.6],
        "line-opacity": 0.7,
        "line-dasharray": [2, 2.5],
      },
    },

    {
      id: "transit-station",
      type: "circle",
      source: SRC,
      "source-layer": "pois",
      minzoom: 10,
      filter: ["==", ["get", "kind"], "station"],
      layout: hidden,
      paint: {
        "circle-radius": ["interpolate", ["linear"], ["zoom"], 10, 2, 14, 4, 16, 5.5],
        "circle-color": tone("train"),
        "circle-stroke-width": 1.5,
        "circle-stroke-color": halo,
      },
    },
    {
      id: "transit-station-label",
      type: "symbol",
      source: SRC,
      "source-layer": "pois",
      minzoom: 12.5,
      filter: ["==", ["get", "kind"], "station"],
      layout: {
        ...hidden,
        "text-field": LATIN,
        "text-font": ["Noto Sans Regular"],
        "text-size": 10.5,
        "text-offset": [0, 0.85],
        "text-anchor": "top",
        "text-max-width": 8,
        "text-optional": true,
      },
      paint: { "text-color": labelInk, "text-halo-color": halo, "text-halo-width": 1.5 },
    },
    {
      id: "transit-bus",
      type: "circle",
      source: SRC,
      "source-layer": "pois",
      minzoom: 13,
      filter: ["in", ["get", "kind"], ["literal", ["bus_stop", "bus_station"]]],
      layout: hidden,
      paint: {
        "circle-radius": ["interpolate", ["linear"], ["zoom"], 13, 1.8, 16, 3.5],
        "circle-color": tone("bus"),
        "circle-stroke-width": 1,
        "circle-stroke-color": halo,
      },
    },
    {
      id: "transit-ferry",
      type: "circle",
      source: SRC,
      "source-layer": "pois",
      minzoom: 11,
      filter: ["==", ["get", "kind"], "ferry_terminal"],
      layout: hidden,
      paint: {
        "circle-radius": ["interpolate", ["linear"], ["zoom"], 11, 2, 15, 4.5],
        "circle-color": tone("ferry"),
        "circle-stroke-width": 1.25,
        "circle-stroke-color": halo,
      },
    },
    {
      id: "transit-airport",
      type: "circle",
      source: SRC,
      "source-layer": "pois",
      minzoom: 8,
      filter: ["==", ["get", "kind"], "aerodrome"],
      layout: hidden,
      paint: {
        "circle-radius": ["interpolate", ["linear"], ["zoom"], 8, 3, 12, 6],
        "circle-color": tone("airport"),
        "circle-stroke-width": 1.5,
        "circle-stroke-color": halo,
      },
    },
    {
      id: "transit-airport-label",
      type: "symbol",
      source: SRC,
      "source-layer": "pois",
      minzoom: 8.5,
      filter: ["==", ["get", "kind"], "aerodrome"],
      layout: {
        ...hidden,
        "text-field": ["coalesce", ["get", "iata"], LATIN],
        "text-font": ["Noto Sans Medium"],
        "text-size": 11,
        "text-offset": [0, 0.85],
        "text-anchor": "top",
        "text-optional": true,
      },
      paint: { "text-color": labelInk, "text-halo-color": halo, "text-halo-width": 1.5 },
    },
  ] as unknown as LayerSpecification[];
}
