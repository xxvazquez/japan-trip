/**
 * Generate a ready-to-run SQL seed for the Japan 2026 trip.
 *
 *   npx tsx scripts/gen_seed_sql.mts > supabase/seed_japan_2026.sql
 *
 * The output inserts one trip (owned by the given email's auth user) plus every
 * entity row, using the same camelCase -> snake_case column mapping as the app's
 * live per-row writer (src/lib/db.ts). Run it once in the Supabase SQL editor.
 */
import { buildTemplate } from "../src/templates/japan-2026/index.ts";
import { remapIds } from "../src/lib/remapIds.ts";

const OWNER_EMAIL = process.env.OWNER_EMAIL ?? "owner1@example.com";
// stable so regenerating this file produces a clean git diff; the seed deletes
// any existing trip for the owner first, so a fixed id is safe.
const TRIP_ID = "1a2b3c4d-0000-4a26-9a26-000000000001";

/* ---- mapping (mirrors src/lib/db.ts) ---- */
const camelToSnake = (s: string) => s.replace(/[A-Z]/g, (c) => "_" + c.toLowerCase());

type Spec = { table: string; rename?: Record<string, string>; toRow?: (e: any, r: any) => void };
const SPECS: Record<string, Spec> = {
  legs: { table: "legs", rename: { nameJp: "name_alt", start: "start_date", end: "end_date" } },
  hotels: { table: "hotels", rename: { nameJp: "name_alt" } },
  places: {
    table: "places",
    rename: { nameJp: "name_alt" },
    toRow: (e, r) => {
      const loc = e.loc as { lat: number; lng: number } | undefined;
      if (loc) { r.lat = loc.lat; r.lng = loc.lng; }
      delete r.loc;
    },
  },
  journeys: { table: "journeys", rename: { luggageShipmentId: "luggage_id" } },
  luggage: { table: "luggage" },
  days: { table: "days" },
  dayTrips: { table: "day_trips", rename: { nameJp: "name_alt" } },
  collections: { table: "collections" },
  reservations: { table: "reservations", rename: { when: "when_text" } },
  packing: { table: "packing", rename: { group: "group_name" } },
  docs: { table: "docs" },
  etiquette: { table: "etiquette" },
};
const SEG_RENAME: Record<string, string> = { from: "from_place", to: "to_place" };

function entityToRow(spec: Spec, e: any, tripId: string, position: number) {
  const row: any = { id: e.id, trip_id: tripId, position };
  for (const [k, v] of Object.entries(e)) {
    if (k === "id" || k === "segments" || v === undefined) continue;
    row[spec.rename?.[k] ?? camelToSnake(k)] = v;
  }
  spec.toRow?.(e, row);
  return row;
}
function segToRow(seg: any, tripId: string, journeyId: string, position: number) {
  const row: any = { id: seg.id, trip_id: tripId, journey_id: journeyId, position };
  for (const [k, v] of Object.entries(seg)) {
    if (k === "id" || v === undefined) continue;
    row[SEG_RENAME[k] ?? camelToSnake(k)] = v;
  }
  return row;
}

/* ---- NOT NULL jsonb defaults, parsed from the schema ---- */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
const ddl = readFileSync(fileURLToPath(new URL("../supabase/migrations/0001_init.sql", import.meta.url)), "utf8");
const jsonbDefaults: Record<string, Record<string, unknown>> = {};
for (const m of ddl.matchAll(/create table if not exists (\w+) \(([\s\S]*?)\n\);/g)) {
  const table = m[1];
  for (const c of m[2].matchAll(/(\w+)\s+jsonb\s+not null\s+default\s+'([^']*)'/g)) {
    (jsonbDefaults[table] ??= {})[c[1]] = JSON.parse(c[2]);
  }
}
// columns declared in 0001 but removed by a later migration — never emit them
const DROPPED = new Set(["days.morning", "days.afternoon", "days.evening", "days.kind"]);
function fillDefaults(table: string, row: Record<string, unknown>) {
  const defs = jsonbDefaults[table];
  if (!defs) return row;
  for (const [col, def] of Object.entries(defs)) {
    if (DROPPED.has(`${table}.${col}`)) continue;
    if (row[col] === undefined || row[col] === null) row[col] = def;
  }
  return row;
}

/* ---- SQL serialisation ---- */
function lit(v: unknown): string {
  if (v === null || v === undefined) return "NULL";
  if (typeof v === "number") return Number.isFinite(v) ? String(v) : "NULL";
  if (typeof v === "boolean") return v ? "true" : "false";
  if (typeof v === "string") return `'${v.replace(/'/g, "''")}'`;
  return `'${JSON.stringify(v).replace(/'/g, "''")}'::jsonb`;
}
function insertStmt(table: string, rows: Record<string, unknown>[]): string {
  if (!rows.length) return `-- ${table}: (no rows)\n`;
  const cols = [...new Set(rows.flatMap((r) => Object.keys(r)))];
  const values = rows
    .map((r) => "  (" + cols.map((c) => lit(r[c])).join(", ") + ")")
    .join(",\n");
  return `insert into ${table} (${cols.join(", ")}) values\n${values};\n`;
}

/* ---- build ---- */
const data: any = remapIds(buildTemplate());

const out: string[] = [];
out.push(`-- Japan 2026 seed — generated ${new Date().toISOString().slice(0, 10)}`);
out.push(`-- Run once in the Supabase SQL editor. Requires migrations 0001 + 0002 first.`);
out.push(`-- Owner: ${OWNER_EMAIL} (must have signed into the app at least once).`);
out.push(``);
// schema top-ups so this file also works run standalone (all idempotent):
out.push(`-- schema top-ups (idempotent), in case migrations 0003/0004 haven't been run:`);
for (const s of [
  `alter table journeys add column if not exists gmaps_directions text`,
  `alter table journeys add column if not exists official_url text`,
  `alter table days add column if not exists sunset text`,
  `alter table days add column if not exists temp_lo numeric`,
  `alter table days add column if not exists temp_hi numeric`,
  `alter table days add column if not exists weather_note text`,
  `alter table days add column if not exists entries jsonb not null default '[]'`,
  `alter table trips add column if not exists scratch text`,
  `alter table places add column if not exists visited boolean`,
  `alter table packing add column if not exists done boolean`,
]) out.push(s + ";");
out.push(``);
out.push(`do $seed$`);
out.push(`declare v_uid uuid;`);
out.push(`begin`);
out.push(`  select id into v_uid from auth.users where lower(email) = ${lit(OWNER_EMAIL.toLowerCase())};`);
out.push(`  if v_uid is null then`);
out.push(`    raise exception 'No auth user for ${OWNER_EMAIL} — sign into the app once with Google, then re-run.';`);
out.push(`  end if;`);
out.push(`  delete from trips where user_id = v_uid;   -- clear any half-seeded trip`);
out.push(`  insert into trips (id, user_id, name, subtitle, template_id, position, config, meta, media, images, scratch)`);
out.push(`  values (`);
out.push(`    ${lit(TRIP_ID)}, v_uid, 'Japan 2026', NULL, 'japan-2026', 0,`);
out.push(`    ${lit(data.config)},`);
out.push(`    ${lit(data.meta)},`);
out.push(`    ${lit(data.media ?? { gallery: [] })},`);
out.push(`    ${lit(data.images ?? {})},`);
out.push(`    ${lit((data as { scratch?: string }).scratch ?? null)}`);
out.push(`  );`);
out.push(`end $seed$;`);
out.push(``);

for (const [type, spec] of Object.entries(SPECS)) {
  const list: any[] = data[type] ?? [];
  const rows = list.map((e, i) => fillDefaults(spec.table, entityToRow(spec, e, TRIP_ID, i)));
  out.push(insertStmt(spec.table, rows));
}

const segRows: Record<string, unknown>[] = [];
for (const j of data.journeys as any[]) {
  (j.segments ?? []).forEach((s: any, i: number) => segRows.push(fillDefaults("segments", segToRow(s, TRIP_ID, j.id, i))));
}
out.push(insertStmt("segments", segRows));

process.stdout.write(out.join("\n") + "\n");
