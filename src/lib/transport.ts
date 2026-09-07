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

/** A muted colour token per mode, so the "Getting there" cards carry one calm
 *  tint each and never a rainbow. Grouped: on rails = accent, through air or
 *  water = ai, on the road = gold, on foot = matcha. Maps to a `--c-*` token
 *  and the matching Tailwind colour utility. */
export const MODE_TONE: Record<TransportMode, "accent" | "ai" | "gold" | "matcha"> = {
  train: "accent",
  subway: "accent",
  flight: "ai",
  ferry: "ai",
  bus: "gold",
  car: "gold",
  taxi: "gold",
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
