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
