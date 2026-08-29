import type { TripData } from "@/core/types";
import { config } from "./config";
import { meta } from "./meta";
import { legs } from "./legs";
import { days } from "./days";
import { places } from "./places";
import { hotels } from "./hotels";
import { journeys } from "./journeys";
import { luggage } from "./luggage";
import { dayTrips } from "./dayTrips";
import { collections } from "./collections";
import { seasonal } from "./seasonal";
import { reservations } from "./reservations";
import { packing } from "./packing";
import { docs } from "./docs";
import { etiquette } from "./etiquette";
import { images } from "./images";

export const SCHEMA_VERSION = 1;

/** A fresh, deep-cloned dataset for a new trip built from this template. */
export function buildTemplate(): TripData {
  const data: TripData = {
    v: SCHEMA_VERSION,
    config,
    meta,
    media: { gallery: [] },
    legs,
    days: days.map((d) => ({ ...d, id: d.date })),
    seasonal: seasonal.map((s) => ({ ...s, id: s.date })),
    places,
    hotels,
    journeys,
    luggage,
    dayTrips,
    collections,
    reservations,
    packing,
    docs,
    etiquette,
    images,
    progress: { checks: {}, foliage: {} },
    notes: {},
  };
  return structuredClone(data);
}

export const templateMeta = {
  id: "japan-2026",
  name: "Japan 2026",
  subtitle: "Tokyo · Kawaguchiko · Kyoto",
};
