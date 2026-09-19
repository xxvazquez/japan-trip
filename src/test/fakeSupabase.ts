/**
 * A tiny in-memory stand-in for the slice of supabase-js the app uses
 * (from/select/insert/upsert/update/delete + eq/in/not/order/range/limit/single),
 * with switches for the failures the safety layer has to survive.
 */
type Row = Record<string, unknown>;
type Err = { message: string; code?: string } | null;

export interface FakeControls {
  tables: Record<string, Row[]>;
  /** while set, every request waits on it (a request "in flight" that never answers) */
  gate: Promise<void> | null;
  /** return an error to fail that request */
  fail: ((op: string, table: string) => Err) | null;
  /** tables that don't exist (migration not applied) */
  missing: Set<string>;
  requests: { op: string; table: string }[];
}

const PK: Record<string, string[]> = { area_places: ["area_id", "place_id"] };

export function createFakeSupabase() {
  const ctl: FakeControls = { tables: {}, gate: null, fail: null, missing: new Set(), requests: [] };
  const t = (name: string) => (ctl.tables[name] ??= []);

  class Q implements PromiseLike<{ data: unknown; error: Err }> {
    private filters: ((r: Row) => boolean)[] = [];
    private orders: { col: string; asc: boolean }[] = [];
    private lo = 0;
    private hi = Infinity;
    private one = false;
    private payload: Row | Row[] | null = null;
    private returning = false;
    constructor(private table: string, private op: "select" | "insert" | "upsert" | "update" | "delete") {}

    select(_cols?: string) { if (this.op !== "select") this.returning = true; return this; }
    insert(p: Row | Row[]) { this.op = "insert"; this.payload = p; return this; }
    upsert(p: Row | Row[]) { this.op = "upsert"; this.payload = p; return this; }
    update(p: Row) { this.op = "update"; this.payload = p; return this; }
    delete() { this.op = "delete"; return this; }
    eq(c: string, v: unknown) { this.filters.push((r) => r[c] === v); return this; }
    in(c: string, vs: unknown[]) { this.filters.push((r) => vs.includes(r[c])); return this; }
    not(c: string, _op: string, list: string) {
      const vs = list.replace(/^\(|\)$/g, "").split(",");
      this.filters.push((r) => !vs.includes(String(r[c])));
      return this;
    }
    order(col: string, o?: { ascending?: boolean }) { this.orders.push({ col, asc: o?.ascending !== false }); return this; }
    range(a: number, b: number) { this.lo = a; this.hi = b; return this; }
    limit(n: number) { this.lo = 0; this.hi = n - 1; return this; }
    single() { this.one = true; return this; }

    then<A = { data: unknown; error: Err }, B = never>(
      ok?: ((v: { data: unknown; error: Err }) => A | PromiseLike<A>) | null,
      bad?: ((e: unknown) => B | PromiseLike<B>) | null,
    ): PromiseLike<A | B> {
      return this.run().then(ok, bad);
    }

    private async run(): Promise<{ data: unknown; error: Err }> {
      if (ctl.gate) await ctl.gate;
      ctl.requests.push({ op: this.op, table: this.table });
      if (ctl.missing.has(this.table)) return { data: null, error: { message: `relation "${this.table}" does not exist`, code: "42P01" } };
      const injected = ctl.fail?.(this.op, this.table);
      if (injected) return { data: null, error: injected };

      const rows = t(this.table);
      const match = (r: Row) => this.filters.every((f) => f(r));
      const arr = (p: Row | Row[]) => (Array.isArray(p) ? p : [p]);

      if (this.op === "insert" || this.op === "upsert") {
        const out: Row[] = [];
        for (const p of arr(this.payload!)) {
          const row = structuredClone(p);
          if (this.table === "trip_snapshots") { row.id ??= crypto.randomUUID(); row.created_at ??= new Date().toISOString(); }
          const keys = PK[this.table] ?? ["id"];
          const i = rows.findIndex((r) => keys.every((k) => r[k] === row[k]));
          if (i >= 0) {
            if (this.op === "insert") return { data: null, error: { message: "duplicate key", code: "23505" } };
            rows[i] = { ...rows[i], ...row };
            out.push(rows[i]);
          } else { rows.push(row); out.push(row); }
        }
        return this.reply(this.returning ? out : null);
      }
      if (this.op === "update") {
        for (const r of rows.filter(match)) Object.assign(r, structuredClone(this.payload as Row));
        return { data: null, error: null };
      }
      if (this.op === "delete") {
        ctl.tables[this.table] = rows.filter((r) => !match(r));
        return { data: null, error: null };
      }
      let out = rows.filter(match).map((r) => structuredClone(r));
      for (const { col, asc } of [...this.orders].reverse()) {
        out.sort((a, b) => {
          const x = a[col] as never, y = b[col] as never;
          return (x < y ? -1 : x > y ? 1 : 0) * (asc ? 1 : -1);
        });
      }
      out = out.slice(this.lo, this.hi === Infinity ? undefined : this.hi + 1);
      return this.reply(out);
    }

    private reply(rows: Row[] | null): { data: unknown; error: Err } {
      if (!this.one) return { data: rows, error: null };
      const first = rows?.[0];
      return first ? { data: first, error: null } : { data: null, error: { message: "no rows", code: "PGRST116" } };
    }
  }

  const client = { from: (table: string) => new Q(table, "select") };
  return { client, ctl };
}
