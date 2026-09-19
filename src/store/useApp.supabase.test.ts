import { describe, it, expect, vi, beforeEach } from "vitest";
import { createFakeSupabase } from "@/test/fakeSupabase";
import { STORAGE_KEYS } from "@/lib/app";
import { SCHEMA_VERSION } from "@/lib/hydrate";
import type { TripData } from "@/core/types";

const fake = vi.hoisted(() => ({ current: null as unknown as ReturnType<typeof createFakeSupabase> }));
vi.mock("@/lib/supabase", () => ({
  supabaseEnabled: true,
  sandboxMode: false,
  getSupabase: () => Promise.resolve(fake.current.client),
}));
vi.mock("@/lib/auth", () => ({
  isAuthReady: () => true,
  getUserId: () => "user-1",
  useAuth: () => ({ ready: true, user: { id: "user-1" }, session: null }),
}));
vi.mock("@/lib/realtime", () => ({ subscribeTrip: () => {}, unsubscribeTrip: () => {}, markWritten: () => {}, TABLE_OF: {} }));

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const place = (id: string) => ({ id, name: `Place ${id}`, lat: 1, lng: 2 }) as never;
const rows = (table: string) => fake.current.ctl.tables[table] ?? [];

/** create a trip on the fake server the way the app does, and make it the active one */
async function seedTrip(name = "Server trip"): Promise<string> {
  const db = await import("@/lib/db");
  const { remapIds } = await import("@/lib/remapIds");
  const { buildBlank } = await import("@/templates/blank");
  const data = remapIds(buildBlank(name));
  data.meta.title = name;
  const id = await db.createTrip(data, { name, archived: false });
  const kv = (await import("@/lib/storage")).store;
  await kv.set(STORAGE_KEYS.activeTrip, id);
  return id;
}

async function boot() {
  vi.resetModules();
  const app = await import("@/store/useApp");
  const kv = (await import("@/lib/storage")).store;
  const snaps = await import("@/lib/safety/snapshots");
  await app.useApp.getState().init();
  return { ...app, kv, snaps, s: () => app.useApp.getState() };
}
const outbox = (kv: { get: <T>(k: string) => Promise<T | undefined> }, id: string) =>
  kv.get<{ ops: { t: string; id?: string }[]; data: TripData }>(STORAGE_KEYS.outbox(id));

beforeEach(() => {
  fake.current = createFakeSupabase();
  vi.restoreAllMocks();
});

describe("signed-in: loading", () => {
  it("opens the server's trip", async () => {
    const id = await seedTrip();
    const a = await boot();
    expect(a.s().activeId).toBe(id);
    expect(a.s().data!.meta.title).toBe("Server trip");
    expect(a.s().loadIssue).toBeNull();
  });

  it("a server error while loading is 'unavailable', not an empty trip — and nothing is seeded", async () => {
    const id = await seedTrip();
    const before = rows("trips").length;
    fake.current.ctl.fail = (op, table) => (op === "select" && table === "days" ? { message: "boom" } : null);
    const a = await boot();
    expect(a.s().data).toBeNull();
    expect(a.s().loadIssue).toMatchObject({ kind: "unavailable", tripId: id });
    expect(a.s().trips).toHaveLength(1);
    expect(rows("trips")).toHaveLength(before); // no demo trip was added
  });

  it("falls back to the mirrored edits when the server can't be reached", async () => {
    const id = await seedTrip();
    const a = await boot();
    fake.current.ctl.fail = () => ({ message: "Failed to fetch" }); // the network drops
    a.s().addEntity("places", place("offline1"));
    a.flushPendingNow();
    await sleep(100);
    const b = await boot(); // cold start with no connection
    expect(b.s().data?.places.map((p) => p.id)).toContain("offline1");
    expect(b.s().loadIssue).toBeNull();
    expect((await outbox(b.kv, id))?.ops.length).toBeGreaterThan(0);
  });

  it("refuses a trip a newer app has written", async () => {
    await seedTrip();
    rows("trips")[0].schema_version = SCHEMA_VERSION + 1;
    const a = await boot();
    expect(a.s().data).toBeNull();
    expect(a.s().loadIssue?.kind).toBe("newer");
  });

  it("loads lists longer than the 1000-row page limit completely", async () => {
    const id = await seedTrip();
    fake.current.ctl.tables.places = Array.from({ length: 2500 }, (_, i) => ({ id: `p${i}`, trip_id: id, position: i, name: `P${i}` }));
    const a = await boot();
    expect(a.s().data!.places).toHaveLength(2500);
  });

  it("a trip that's gone from the server is 'missing'", async () => {
    await seedTrip();
    const kv = (await import("@/lib/storage")).store;
    await kv.set(STORAGE_KEYS.activeTrip, "does-not-exist");
    const a = await boot(); // falls back to the first real trip, doesn't blank out
    expect(a.s().data).not.toBeNull();
  });
});

describe("signed-in: saving and the outbox", () => {
  it("an edit reaches the server and the mirror is cleared", async () => {
    const id = await seedTrip();
    const a = await boot();
    a.s().addEntity("places", place("s1"));
    expect(await a.settlePending()).toBe(true);
    await sleep(60);
    expect(rows("places").map((r) => r.id)).toContain("s1");
    expect(await outbox(a.kv, id)).toBeUndefined();
    expect(a.s().syncState).toBe("saved");
  });

  it("the batch that's IN FLIGHT stays in the mirror, even when the page-hide flush runs again", async () => {
    const id = await seedTrip();
    const a = await boot();
    let release!: () => void;
    fake.current.ctl.gate = new Promise((r) => { release = r; });
    a.s().addEntity("places", place("f1"));
    a.flushPendingNow(); // request sent, never answered
    a.s().addEntity("places", place("f2"));
    await sleep(200); // let the mirror's debounce fire
    a.flushPendingNow(); // pagehide with nothing new queued — used to delete the mirror
    await sleep(60);
    const ob = await outbox(a.kv, id);
    expect(ob).toBeDefined();
    const ids = ob!.ops.map((o) => o.id);
    expect(ids).toEqual(expect.arrayContaining(["f1", "f2"]));
    expect(ob!.data.places.map((p) => p.id)).toEqual(expect.arrayContaining(["f1", "f2"]));
    release();
  });

  it("a tab killed mid-request loses nothing: the next load replays the mirror to the server", async () => {
    const id = await seedTrip();
    const a = await boot();
    let release!: () => void;
    fake.current.ctl.gate = new Promise((r) => { release = r; });
    a.s().addEntity("places", place("k1"));
    a.flushPendingNow();
    a.s().addEntity("places", place("k2"));
    a.flushPendingNow();
    await sleep(200);
    // the tab dies here: the server never saw either edit
    expect(rows("places").map((r) => r.id)).not.toContain("k1");
    fake.current.ctl.gate = null; // a fresh page load, connection fine
    const b = await boot();
    await b.settlePending();
    await sleep(60);
    expect(b.s().data!.places.map((p) => p.id)).toEqual(expect.arrayContaining(["k1", "k2"]));
    expect(rows("places").map((r) => r.id)).toEqual(expect.arrayContaining(["k1", "k2"]));
    expect(await outbox(b.kv, id)).toBeUndefined();
    release();
  });

  it("a failed write keeps the edit queued and mirrored, then lands on retry", async () => {
    const id = await seedTrip();
    const a = await boot();
    fake.current.ctl.fail = (op, table) => (op === "upsert" && table === "places" ? { message: "Failed to fetch" } : null);
    a.s().addEntity("places", place("r1"));
    await a.settlePending(300);
    await sleep(60);
    expect(a.s().syncState).toBe("error");
    expect(a.s().syncErrorItems.length).toBeGreaterThan(0);
    expect((await outbox(a.kv, id))!.ops.map((o) => o.id)).toContain("r1");
    expect(a.s().data!.places.map((p) => p.id)).toContain("r1"); // still on screen

    fake.current.ctl.fail = null;
    a.s().retrySyncNow();
    await a.settlePending(3000);
    await sleep(60);
    expect(rows("places").map((r) => r.id)).toContain("r1");
    expect(await outbox(a.kv, id)).toBeUndefined();
  });

  it("a failed reorder is reported and retried, not silently dropped", async () => {
    await seedTrip();
    const a = await boot();
    a.s().addEntity("places", place("o1"));
    a.s().addEntity("places", place("o2"));
    await a.settlePending();
    fake.current.ctl.fail = (op, table) => (op === "update" && table === "places" ? { message: "Failed to fetch" } : null);
    a.s().moveEntity("places", "o2", -1);
    await a.settlePending(300);
    expect(a.s().syncState).toBe("error");
  });

  it("a corrupt mirror is set aside and never replayed onto the trip", async () => {
    const id = await seedTrip();
    const kv = (await import("@/lib/storage")).store;
    await kv.set(STORAGE_KEYS.outbox(id), { ops: "nonsense", data: 5 });
    const a = await boot();
    expect(a.s().data).not.toBeNull();
    const { listQuarantine } = await import("@/lib/safety/quarantine");
    expect((await listQuarantine(`outbox-${id}`)).length).toBe(1);
  });

  it("replaying offline edits first keeps the server's copy as a restore point", async () => {
    const id = await seedTrip();
    const a = await boot();
    fake.current.ctl.fail = () => ({ message: "Failed to fetch" });
    a.s().addEntity("places", place("rp1"));
    await a.settlePending(200);
    await sleep(60);
    fake.current.ctl.fail = null;
    fake.current.ctl.tables.trip_snapshots = [];
    const b = await boot();
    await b.settlePending();
    await sleep(100);
    const reasons = (await b.snaps.listSnapshots(id, { cloud: true })).map((p) => p.reason);
    expect(reasons).toContain("before-sync");
  });

  it("refuses to send a structurally broken trip to the server", async () => {
    await seedTrip();
    const a = await boot();
    a.s().addEntity("places", place("ok1"));
    await a.settlePending();
    const before = fake.current.ctl.requests.length;
    a.s().mutate((d) => { (d as unknown as { days: unknown }).days = "broken"; });
    a.s().addEntity("places", place("bad1") as never);
    a.flushPendingNow();
    await sleep(100);
    expect(a.s().syncState).toBe("error");
    expect(fake.current.ctl.requests.slice(before).filter((r) => r.op === "upsert")).toHaveLength(0);
  });

  it("stamps the trip with the app's data version once its column exists", async () => {
    await seedTrip();
    rows("trips")[0].schema_version = SCHEMA_VERSION - 1;
    const a = await boot();
    a.s().addEntity("places", place("st1"));
    await a.settlePending();
    await sleep(100);
    expect(rows("trips")[0].schema_version).toBe(SCHEMA_VERSION);
  });

  it("still saves normally when migration 0026 hasn't been applied", async () => {
    await seedTrip();
    fake.current.ctl.missing.add("trip_snapshots");
    const a = await boot();
    a.s().addEntity("places", place("m1"));
    expect(await a.settlePending()).toBe(true);
    await sleep(60);
    expect(rows("places").map((r) => r.id)).toContain("m1");
    expect(a.s().syncState).not.toBe("error");
  });
});

describe("signed-in: deleting, restoring, creating", () => {
  it("deleting a trip first stores a restore point that outlives it", async () => {
    await seedTrip("Keep me");
    const a = await boot();
    const id = await a.s().createTrip({ name: "Doomed" });
    await a.s().switchTrip(id);
    a.s().addEntity("places", place("d1"));
    await a.settlePending();
    await a.s().deleteTrip(id);
    expect(rows("trips").some((r) => r.id === id)).toBe(false);
    const snap = rows("trip_snapshots").find((r) => r.trip_id === id && r.reason === "before-delete");
    expect(snap).toBeDefined();
    expect((snap!.data as TripData).places.map((p) => p.id)).toContain("d1");
  });

  it("a deleted trip comes back from 'Recently deleted' as a new trip", async () => {
    await seedTrip("Keep me");
    const a = await boot();
    const id = await a.s().createTrip({ name: "Doomed" });
    await a.s().switchTrip(id);
    a.s().addEntity("places", place("d2"));
    await a.settlePending();
    await a.s().deleteTrip(id);
    const [meta] = (await a.snaps.listSnapshots(undefined, { cloud: true })).filter((p) => p.tripId === id && p.source === "cloud");
    await a.s().restoreSnapshot(meta, "copy");
    expect(a.s().data!.meta.title).toMatch(/Doomed/);
    expect(a.s().data!.places).toHaveLength(1);
    expect(rows("trips").some((r) => r.id === a.s().activeId)).toBe(true);
  });

  it("no delete when neither the account nor the device can take a restore point", async () => {
    await seedTrip("Keep me");
    const a = await boot();
    const id = await a.s().createTrip({ name: "Doomed" });
    await a.s().switchTrip(id);
    await a.settlePending();
    fake.current.ctl.fail = (op, table) => (op === "insert" && table === "trip_snapshots" ? { message: "down" } : null);
    const { StorageError } = await import("@/lib/safety/errors");
    const real = a.kv.set.bind(a.kv);
    vi.spyOn(a.kv, "set").mockImplementation((k, v) => (k.startsWith("snap:") ? Promise.reject(new StorageError("write", "no")) : real(k, v)));
    await a.s().deleteTrip(id);
    expect(a.s().notice?.tone).toBe("error");
    expect(rows("trips").some((r) => r.id === id)).toBe(true);
  });

  it("creating a trip that partly fails leaves nothing behind and says so", async () => {
    await seedTrip();
    const a = await boot();
    const tripsBefore = rows("trips").length;
    fake.current.ctl.fail = (op, table) => (op === "upsert" && table === "places" ? { message: "constraint" } : null);
    await expect(a.s().createTrip({ name: "Half", templateId: "demo" })).rejects.toThrow(/Nothing was added/);
    expect(rows("trips")).toHaveLength(tripsBefore);
  });

  it("restore over the open trip makes the server match the restore point exactly, and keeps what it replaced", async () => {
    const id = await seedTrip();
    const a = await boot();
    a.s().addEntity("places", place("keep1"));
    await a.settlePending();
    const point = (await a.snaps.takeSnapshot(id, a.s().data!, "manual", { force: true, cloud: true })).cloud!;
    a.s().addEntity("places", place("extra1"));
    a.s().removeEntity("places", "keep1");
    await a.settlePending();
    await sleep(60);
    expect(rows("places").map((r) => r.id)).toContain("extra1");

    await a.s().restoreSnapshot(point, "replace");
    const ids = rows("places").filter((r) => r.trip_id === id).map((r) => r.id);
    expect(ids).toContain("keep1");
    expect(ids).not.toContain("extra1");
    expect(a.s().data!.places.map((p) => p.id)).toEqual(expect.arrayContaining(["keep1"]));
    expect((await a.snaps.listSnapshots(id, { cloud: true })).map((p) => p.reason)).toContain("before-restore");
  });
});
