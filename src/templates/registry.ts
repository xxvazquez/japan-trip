import type { TripData } from "@/core/types";
import { buildBlank } from "./blank";
import { buildTemplate as buildJapan2026 } from "./japan-2026";

export interface TemplateEntry {
  id: string;
  name: string;
  subtitle: string;
  build: () => TripData;
}

/**
 * Available templates. Optional — the app works with an empty registry (new
 * trips are then always blank). Add an entry to offer another starting point.
 */
export const TEMPLATES: TemplateEntry[] = [
  {
    id: "japan-2026",
    name: "Japan 2026 · demo",
    subtitle: "a full worked 24-day example — trim it or ignore it",
    build: buildJapan2026,
  },
];

export function buildFromTemplate(id: string | undefined, fallbackName = "New trip"): TripData {
  const t = id ? TEMPLATES.find((x) => x.id === id) : undefined;
  return t ? t.build() : buildBlank(fallbackName);
}
