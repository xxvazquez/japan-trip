import type { StampItem } from "@/core/types";

const rid = () => Math.random().toString(36).slice(2, 8);

/** Read a stamp list from JSON text — either an array, or `{ "stamps": [...] }`,
 *  each entry `{ label, note?, group?, local? }`. Entries without a label are
 *  dropped. Throws a readable message when the text isn't a stamp list. */
export function parseStampFile(text: string): StampItem[] {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new Error("That file isn’t a stamp list.");
  }
  const list = Array.isArray(raw) ? raw : (raw as { stamps?: unknown })?.stamps;
  if (!Array.isArray(list)) throw new Error("That file isn’t a stamp list.");
  const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : undefined);
  const out: StampItem[] = [];
  for (const e of list) {
    const label = str((e as Record<string, unknown>)?.label);
    if (!label) continue;
    const r = e as Record<string, unknown>;
    out.push({
      id: rid(),
      label,
      ...(str(r.note) ? { note: str(r.note) } : {}),
      ...(str(r.group) ? { group: str(r.group) } : {}),
      ...(str(r.local) ? { local: str(r.local) } : {}),
    });
  }
  if (!out.length) throw new Error("That file has no stamps in it.");
  return out;
}
