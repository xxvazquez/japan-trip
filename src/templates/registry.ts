import type { TripData } from "@/core/types";
import { buildBlank } from "./blank";
import { buildDemo, buildSandbox } from "./demo";

export { buildDemo, buildSandbox };

export interface TemplateEntry {
  id: string;
  name: string;
  subtitle: string;
  build: () => TripData;
}

/**
 * Templates shown in "New trip → Start from…". Empty on purpose — a new trip is
 * always blank, then trimmed in Manage → Modules. The read-only demo trip
 * (see ./demo) is what shows how a filled-in trip looks.
 */
export const TEMPLATES: TemplateEntry[] = [];

export function buildFromTemplate(id: string | undefined, fallbackName = "New trip"): TripData {
  if (id === "demo") return buildDemo();
  if (id === "sandbox") return buildSandbox();
  const t = id ? TEMPLATES.find((x) => x.id === id) : undefined;
  return t ? t.build() : buildBlank(fallbackName);
}
