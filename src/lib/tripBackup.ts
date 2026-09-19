import { SCHEMA_VERSION, normalizeTrip } from "./hydrate";
import type { TripData } from "@/core/types";

/**
 * A whole trip as one `.json` file, and back again. Unlike the web-page and
 * calendar exports this is lossless — every stay, day, place, setting and
 * private detail — so it's the way to move a trip between devices or keep a
 * copy safe. Attached document files aren't inside it: a Drive attachment
 * still opens from anywhere, an on-device one only on the device that has it.
 */

const FORMAT = "zuknesst-atlas-trip";

interface BackupFile {
  format: typeof FORMAT;
  /** the data shape (`SCHEMA_VERSION`) the trip was saved in */
  schema: number;
  exportedAt: string;
  trip: TripData;
}

/** A backup that can't be restored — the message is written for the person who picked the file. */
export class BackupError extends Error {}

const slug = (s: string) => s.trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").slice(0, 60) || "trip";

export function buildBackup(data: TripData): string {
  const file: BackupFile = { format: FORMAT, schema: SCHEMA_VERSION, exportedAt: new Date().toISOString(), trip: data };
  return JSON.stringify(file, null, 2);
}

export function downloadBackup(data: TripData): void {
  const name = slug(data.meta.title || data.config.branding || "trip");
  const day = new Date().toISOString().slice(0, 10);
  const blob = new Blob([buildBackup(data)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${name}-backup-${day}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const isObject = (x: unknown): x is Record<string, unknown> => !!x && typeof x === "object" && !Array.isArray(x);

/** Read a backup file's text back into a trip, ready to be added as a new one.
 *  Throws a `BackupError` for anything that isn't a usable backup. */
export function parseBackup(text: string): TripData {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new BackupError("That file isn’t a trip backup.");
  }
  if (!isObject(raw) || raw.format !== FORMAT || !isObject(raw.trip)) {
    throw new BackupError("That file isn’t a trip backup.");
  }
  if (typeof raw.schema === "number" && raw.schema > SCHEMA_VERSION) {
    throw new BackupError("That backup was made by a newer version of the app — reload to update, then try again.");
  }
  const trip = raw.trip;
  if (!Array.isArray(trip.days) || !Array.isArray(trip.legs) || !isObject(trip.meta) || !isObject(trip.config)) {
    throw new BackupError("That backup is missing parts of the trip, so it can’t be restored.");
  }
  const data = normalizeTrip(trip as Partial<TripData>) as TripData;
  data.config.demo = false; // a restored copy is always editable
  return data;
}
