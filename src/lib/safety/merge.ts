import { canonical } from "./validate";

/**
 * Three-way merge of a JSON value edited on two devices.
 *
 *  - `base`   — what both started from (the last copy this device saw from the server)
 *  - `local`  — this device's version now
 *  - `server` — the server's version now (which may include the other device's edits)
 *
 * The rule that keeps anyone's edit from disappearing: whichever side changed a
 * thing wins for that thing, and only when BOTH changed the same thing does this
 * device's win. Objects merge key by key, recursively. Lists of `{ id }` items
 * (people, categories, tabs, photos…) merge item by item, so two devices adding
 * different items both keep theirs; an edit beats a delete. Anything else
 * (numbers, text, plain lists) is atomic.
 *
 * `undefined` means "absent".
 */

type Obj = Record<string, unknown>;
const isObj = (x: unknown): x is Obj => !!x && typeof x === "object" && !Array.isArray(x);
const same = (a: unknown, b: unknown) => a === b || (a !== undefined && b !== undefined && canonical(a) === canonical(b));
const idList = (x: unknown): x is Obj[] =>
  Array.isArray(x) && x.every((e) => isObj(e) && typeof e.id === "string" && e.id !== "");
const ids = (l: Obj[]) => l.map((e) => e.id as string);

export function mergeJson(base: unknown, local: unknown, server: unknown): unknown {
  if (same(local, base)) return server; // we didn't touch it
  if (same(server, base)) return local; // they didn't
  if (same(local, server)) return local;

  if (isObj(local) && isObj(server)) {
    const b = isObj(base) ? base : {};
    const out: Obj = {};
    for (const k of new Set([...Object.keys(b), ...Object.keys(local), ...Object.keys(server)])) {
      const v = mergeJson(b[k], local[k], server[k]);
      if (v !== undefined) out[k] = v;
    }
    return out;
  }
  const b = base === undefined ? [] : base;
  if (idList(local) && idList(server) && idList(b)) return mergeIdList(b, local, server);
  return local; // both changed something atomic — this device's edit stands
}

function mergeIdList(base: Obj[], local: Obj[], server: Obj[]): Obj[] {
  const at = (l: Obj[]) => new Map(l.map((e) => [e.id as string, e]));
  const B = at(base), L = at(local), S = at(server);
  const out: Obj[] = [];

  for (const s of server) {
    const id = s.id as string;
    if (L.has(id)) out.push(mergeJson(B.get(id), L.get(id), s) as Obj);
    else if (!B.has(id)) out.push(s); // the other device added it
    else if (!same(B.get(id), s)) out.push(s); // we deleted it but they edited it — the edit wins
    // else: we deleted it and they left it alone → gone
  }
  for (const l of local) {
    const id = l.id as string;
    if (S.has(id)) continue;
    if (!B.has(id)) out.push(l); // we added it
    else if (!same(B.get(id), l)) out.push(l); // they deleted it but we edited it — the edit wins
    // else: they deleted it and we left it alone → gone
  }

  // order: if only this device reordered, keep its order; otherwise the server's stands
  const order = (l: Obj[], other: Map<string, Obj>) => ids(l).filter((i) => other.has(i));
  const localMoved = !same(order(local, B), order(base, L));
  const serverMoved = !same(order(server, B), order(base, S));
  if (localMoved && !serverMoved) {
    const rank = new Map(ids(local).map((id, i) => [id, i]));
    out.sort((x, y) => (rank.get(x.id as string) ?? Infinity) - (rank.get(y.id as string) ?? Infinity));
  }
  return out;
}
