import type { TransportMode } from "@/core/types";

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
