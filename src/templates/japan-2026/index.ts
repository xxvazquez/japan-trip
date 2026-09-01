import type { TripData } from "@/core/types";
import { config } from "./config";
import { meta } from "./meta";
import { legs } from "./legs";
import { days } from "./days";
import { hotels } from "./hotels";
import { journeys } from "./journeys";
import { luggage } from "./luggage";
import { packing } from "./packing";
import { docs } from "./docs";

export const SCHEMA_VERSION = 2;

/** A fresh, deep-cloned dataset for a new trip built from this template. */
export function buildTemplate(): TripData {
  const data: TripData = {
    v: SCHEMA_VERSION,
    config,
    meta,
    media: { gallery: [] },
    legs,
    days: days.map((d) => ({ ...d, id: d.date })),
    hotels,
    journeys,
    luggage,
    places: [],
    areas: [],
    packing,
    docs,
  };
  return structuredClone(data);
}

export const templateMeta = {
  id: "japan-2026",
  name: "Japan 2026",
  subtitle: "Tokyo · Kawaguchiko · Kyoto",
};
