import type { TransportMode } from "@/core/types";
import type { IconName } from "@/components/Icon";

/** Title-case display label for a transport mode — the stored value is the
 *  lowercase enum, but every surface shows it capitalised. */
export const MODE_LABEL: Record<TransportMode, string> = {
  flight: "Flight",
  train: "Train",
  bus: "Bus",
  ferry: "Ferry",
  car: "Car",
  taxi: "Taxi",
  subway: "Subway",
  walk: "Walk",
};

/** A muted colour token per mode. Transit — however you're carried — reads as
 *  one calm blue-grey (`ai`); on foot is moss (`matcha`). Kept in step with
 *  `toneForSegmentMode` in `lib/tones.ts` so a hop card and its Logbook list
 *  tile match. Maps to a `--c-*` token and the matching Tailwind utility. */
export const MODE_TONE: Record<TransportMode, "ai" | "matcha"> = {
  train: "ai",
  subway: "ai",
  flight: "ai",
  ferry: "ai",
  bus: "ai",
  car: "ai",
  taxi: "ai",
  walk: "matcha",
};

/** The line icon for each mode (see `Icon`). */
export const MODE_ICON: Record<TransportMode, IconName> = {
  flight: "plane",
  train: "train",
  bus: "bus",
  ferry: "ferry",
  car: "car",
  taxi: "taxi",
  subway: "subway",
  walk: "walk",
};
