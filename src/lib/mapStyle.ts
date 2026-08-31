import { layers, namedFlavor, type Flavor } from "@protomaps/basemaps";
import type { StyleSpecification } from "maplibre-gl";

/**
 * A restrained editorial basemap: one warm land tone, hairline roads, muted
 * water, sparse labels. Built on Protomaps' free vector tiles — no key, no bill.
 *
 * Default is Protomaps' full planet archive on Source Cooperative. It works but
 * is slow to first paint (every tile walks a directory inside a 130 GB file on
 * a bucket with no edge cache). For a fast map, build a small regional extract
 * with `pmtiles extract`, host the one file anywhere static (Cloudflare R2, a
 * Pages asset, S3…), and set VITE_MAP_TILES_URL to its URL. Nothing else changes.
 */
const DEFAULT_PMTILES = "https://data.source.coop/protomaps/openstreetmap/v4.pmtiles";
const configured = import.meta.env.VITE_MAP_TILES_URL?.trim();
export const PMTILES = `pmtiles://${configured || DEFAULT_PMTILES}`;
const ATTRIB = '<a href="https://protomaps.com">Protomaps</a> · <a href="https://openstreetmap.org">OpenStreetMap</a>';
const GLYPHS = "https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf";

const LIGHT: Partial<Flavor> = {
  background: "#f2efe8",
  earth: "#f2efe8",
  park_a: "#e6e8de", park_b: "#e6e8de",
  wood_a: "#e4e7dc", wood_b: "#e4e7dc",
  scrub_a: "#e8e9df", scrub_b: "#e8e9df",
  water: "#cfdbdd",
  sand: "#ece7da", beach: "#ece7da", glacier: "#f4f2ec",
  buildings: "#e7e2d7",
  hospital: "#efe9e2", industrial: "#eae6dc", school: "#ece7dd", zoo: "#e6e8de",
  pier: "#e7e2d7", aerodrome: "#eae7de", runway: "#ded9cd",
  minor_a: "#eae5da", minor_b: "#ede8dd", minor_service: "#ece8dd", link: "#e6dcc7",
  major: "#e3d7c0", highway: "#dcccae",
  minor_casing: "#e6e1d4", minor_service_casing: "#e6e1d4", link_casing: "#e2ddd0",
  major_casing_early: "#ddd2b9", major_casing_late: "#d8ccb2",
  highway_casing_early: "#d7c6a4", highway_casing_late: "#d3c19f",
  railway: "#cfc8b8", boundaries: "#c2bcae",
  roads_label_minor: "#8a8f94", roads_label_minor_halo: "#f2efe8",
  roads_label_major: "#6a6f74", roads_label_major_halo: "#f2efe8",
  city_label: "#3a3f45", city_label_halo: "#f2efe8",
  state_label: "#9a9fa4", state_label_halo: "#f2efe8",
  country_label: "#7a7f84",
  subplace_label: "#7a8088", subplace_label_halo: "#f2efe8",
  ocean_label: "#9fb0b2",
  regular: "#5b616a", bold: "#3a3f45", italic: "#7a8088",
};

const DARK: Partial<Flavor> = {
  background: "#14181c",
  earth: "#14181c",
  park_a: "#1b2126", park_b: "#1b2126",
  wood_a: "#1a2024", wood_b: "#1a2024",
  scrub_a: "#191f23", scrub_b: "#191f23",
  water: "#1e2a30",
  sand: "#1b2024", beach: "#1b2024", glacier: "#171b1f",
  buildings: "#1c2227",
  hospital: "#1d2328", industrial: "#1a2024", school: "#1c2227", zoo: "#1b2126",
  pier: "#1c2227", aerodrome: "#1a2024", runway: "#242c33",
  minor_a: "#242b32", minor_b: "#20272d", minor_service: "#222930", link: "#2c333b",
  major: "#333b43", highway: "#3a434c",
  minor_casing: "#1c2227", minor_service_casing: "#1c2227", link_casing: "#1c2227",
  major_casing_early: "#262d34", major_casing_late: "#2a323a",
  highway_casing_early: "#2c353e", highway_casing_late: "#313b44",
  railway: "#39424b", boundaries: "#3a434c",
  roads_label_minor: "#7b858e", roads_label_minor_halo: "#14181c",
  roads_label_major: "#9aa1a8", roads_label_major_halo: "#14181c",
  city_label: "#c8ccd0", city_label_halo: "#14181c",
  state_label: "#7b858e", state_label_halo: "#14181c",
  country_label: "#9aa1a8",
  subplace_label: "#8b939b", subplace_label_halo: "#14181c",
  ocean_label: "#5f7176",
  regular: "#aab1b8", bold: "#d6dade", italic: "#8b939b",
};

export function buildMapStyle(dark: boolean): StyleSpecification {
  const flavor: Flavor = { ...namedFlavor(dark ? "dark" : "light"), ...(dark ? DARK : LIGHT) };
  return {
    version: 8,
    glyphs: GLYPHS,
    sources: {
      protomaps: { type: "vector", url: PMTILES, attribution: ATTRIB },
    },
    layers: layers("protomaps", flavor, { lang: "en" }),
  };
}
