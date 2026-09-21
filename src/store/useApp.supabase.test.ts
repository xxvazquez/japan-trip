import { describe, it, expect, vi, beforeEach } from "vitest";
import { createFakeSupabase } from "@/test/fakeSupabase";
import { STORAGE_KEYS } from "@/lib/app";
import { SCHEMA_VERSION } from "@/lib/hydrate";
import type { TripData } from "@/core/types";

const fake = vi.hoisted(() => ({ current: null as unknown as ReturnType<typeof createFakeSupabase> }));
vi.mock("@/lib/supabase", () => ({
  supabaseEnabled: true,
  sandboxMode: false,
  publicDemoMode: false,
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
/** the unconfirmed edits saved for a trip, from whichever tab's key holds them */
const outboxKeys = async (kv: { keys: () => Promise<string[]> }, id: string) =>
  (await kv.keys()).filter((k) => k === STORAGE_KEYS.outbox(id) || k.startsWith(`${STORAGE_KEYS.outbox(id)}:`));
const outbox = async (kv: { get: <T>(k: string) => Promise<T | undefined>; keys: () => Promise<string[]> }, id: string) => {
  const [key] = await outboxKeys(kv, id);
  return key ? kv.get<{ ops: { t: string; id?: string }[]; data: TripData }>(key) : undefined;
};

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
    await sleep(60);
    expect((await outbox(b.kv, id))?.ops.length).toBeGreaterThan(0); // still held for when the network returns
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

describe("signed-in: on-device attachments", () => {
  it("uploads a device-only attachment once on open, keeps the local copy, and marks the file", async () => {
    const id = await seedTrip();
    const { putFile, getFileBlob } = await import("@/lib/fileStore");
    const fileId = await putFile(new Blob(["hello"], { type: "application/pdf" }));
    (fake.current.ctl.tables.docs ??= []).push({ id: "doc1", trip_id: id, position: 0, title: "Booking", kind: "other", fields: [], files: [{ id: fileId, name: "b.pdf" }] });
    const uploaded: string[] = [];
    (fake.current.client as unknown as { storage: unknown }).storage = { from: () => ({ upload: async (path: string) => { uploaded.push(path); return { error: null }; } }) } as never;

    const a = await boot();
    await sleep(200);
    await a.settlePending();
    await sleep(100);
    expect(uploaded).toEqual([`${id}/${fileId}`]);
    const files = a.s().data!.docs.find((d) => d.id === "doc1")!.files!;
    expect(files[0].storagePath).toBe(`${id}/${fileId}`);
    expect((rows("docs").find((r) => r.id === "doc1")!.files as { storagePath?: string }[])[0].storagePath).toBe(`${id}/${fileId}`);
    expect(await getFileBlob(fileId)).toBeDefined();
  });
});

describe("signed-in: several tabs", () => {
  /** a tab whose edits can't reach the server, so they stay in its own outbox */
  async function tabWithStuckEdit(id: string, placeId: string) {
    const t = await boot();
    fake.current.ctl.fail = (op, table) => (op === "upsert" && table === "places" ? { message: "Failed to fetch" } : null);
    t.s().addEntity("places", place(placeId));
    await t.settlePending(200);
    await sleep(60);
    fake.current.ctl.fail = null;
    const { TAB_ID } = await import("@/lib/safety/crossTab");
    expect(await outboxKeys(t.kv, id)).toContain(STORAGE_KEYS.outbox(id, TAB_ID));
    return { t, tab: TAB_ID };
  }
  const alive = (tab: string) => localStorage.setItem(`za.beat.${tab}`, String(Date.now()));
  const dead = (tab: string) => localStorage.removeItem(`za.beat.${tab}`);

  it("each tab keeps its own outbox: one tab finishing doesn't clear another's", async () => {
    const id = await seedTrip();
    const { tab } = await tabWithStuckEdit(id, "tabA");
    alive(tab);
    const b = await boot();
    b.s().addEntity("places", place("tabB"));
    await b.settlePending();
    await sleep(60);
    expect(rows("places").map((r) => r.id)).toContain("tabB");
    expect(rows("places").map((r) => r.id)).not.toContain("tabA"); // B never replayed A's edit
    expect(await outboxKeys(b.kv, id)).toEqual([STORAGE_KEYS.outbox(id, tab)]); // A's is intact, B's is gone
  });

  it("a closed tab's unconfirmed edits are picked up by the next tab and reach the server", async () => {
    const id = await seedTrip();
    const { tab } = await tabWithStuckEdit(id, "orphan1");
    dead(tab);
    const b = await boot();
    await b.settlePending();
    await sleep(80);
    expect(b.s().data!.places.map((p) => p.id)).toContain("orphan1");
    expect(rows("places").map((r) => r.id)).toContain("orphan1");
    expect(await outboxKeys(b.kv, id)).toEqual([]); // adopted, replayed, and cleaned up
  });

  it("edits left by two different closed tabs are both recovered", async () => {
    const id = await seedTrip();
    const one = await tabWithStuckEdit(id, "fromOne");
    alive(one.tab); // still open when the second tab starts, so it leaves that outbox alone
    const two = await tabWithStuckEdit(id, "fromTwo");
    dead(one.tab);
    dead(two.tab);
    const b = await boot();
    await b.settlePending();
    await sleep(80);
    const ids = rows("places").map((r) => r.id);
    expect(ids).toEqual(expect.arrayContaining(["fromOne", "fromTwo"]));
    expect(await outboxKeys(b.kv, id)).toEqual([]);
  });

  it("the older single-key outbox is still recovered", async () => {
    const id = await seedTrip();
    const a = await boot();
    const data = structuredClone(a.s().data!);
    data.places.push(place("legacy1"));
    await a.kv.set(STORAGE_KEYS.outbox(id), { ops: [{ t: "row", type: "places", id: "legacy1" }], data });
    const b = await boot();
    await b.settlePending();
    await sleep(80);
    expect(rows("places").map((r) => r.id)).toContain("legacy1");
    expect(await outboxKeys(b.kv, id)).toEqual([]);
  });

  it("adopted edits are saved under the new tab's key before the old key goes", async () => {
    const id = await seedTrip();
    const { tab } = await tabWithStuckEdit(id, "handover");
    dead(tab);
    fake.current.ctl.fail = () => ({ message: "Failed to fetch" }); // the new tab can't reach the server either
    const b = await boot();
    fake.current.ctl.fail = () => ({ message: "Failed to fetch" });
    await sleep(200);
    const { TAB_ID } = await import("@/lib/safety/crossTab");
    const keys = await outboxKeys(b.kv, id);
    expect(keys).toEqual([STORAGE_KEYS.outbox(id, TAB_ID)]);
    expect((await outbox(b.kv, id))!.ops.map((o) => o.id)).toContain("handover");
  });
});

describe("signed-in: opening with no connection", () => {
  const offline = () => { fake.current.ctl.fail = () => ({ message: "Failed to fetch" }); };
  const online = () => { fake.current.ctl.fail = null; };

  it("a device that has opened the trip before opens it with no connection at all, even with nothing pending", async () => {
    const id = await seedTrip("Offline trip");
    const a = await boot();
    await sleep(80); // the mirror is written in the background
    offline();
    const b = await boot();
    expect(b.s().bootError).toBe(false);
    expect(b.s().loadIssue).toBeNull();
    expect(b.s().activeId).toBe(id);
    expect(b.s().data!.meta.title).toBe("Offline trip");
    expect(b.s().trips.map((t) => t.id)).toContain(id);
    void a;
  });

  it("edits made offline are queued, survive another offline reload, and reach the server when it's back", async () => {
    const id = await seedTrip();
    await boot();
    await sleep(80);
    offline();
    const b = await boot();
    b.s().addEntity("places", place("planeEdit"));
    b.flushPendingNow();
    await sleep(100);
    const c = await boot(); // still offline, page reloaded
    expect(c.s().data!.places.map((p) => p.id)).toContain("planeEdit");
    online();
    await c.s().refreshTrip(); // what the 'online' event triggers
    await c.settlePending();
    await sleep(80);
    expect(rows("places").map((r) => r.id)).toContain("planeEdit");
    expect(await outboxKeys(c.kv, id)).toEqual([]);
  });

  it("the mirror only ever holds server-confirmed state, never unsent edits", async () => {
    const id = await seedTrip();
    const a = await boot();
    await sleep(80);
    offline();
    a.s().addEntity("places", place("unsent"));
    a.flushPendingNow();
    await sleep(100);
    const m = await a.kv.get<{ data: TripData }>(STORAGE_KEYS.mirror(id));
    expect(m!.data.places.map((p) => p.id)).not.toContain("unsent");
  });

  it("never opens another account's mirror", async () => {
    const id = await seedTrip();
    const a = await boot();
    await sleep(80);
    const m = await a.kv.get<{ user: string; data: TripData; at: number }>(STORAGE_KEYS.mirror(id));
    await a.kv.set(STORAGE_KEYS.mirror(id), { ...m, user: "someone-else" });
    offline();
    const b = await boot();
    expect(b.s().data).toBeNull();
    expect(b.s().bootError).toBe(true);
  });

  it("signing out clears the mirrors", async () => {
    const id = await seedTrip();
    const a = await boot();
    await sleep(80);
    expect(await a.kv.get(STORAGE_KEYS.mirror(id))).toBeDefined();
    await a.clearDeviceMirrors();
    expect(await a.kv.get(STORAGE_KEYS.mirror(id))).toBeUndefined();
    expect(await a.kv.get(STORAGE_KEYS.mirrorTrips)).toBeUndefined();
  });

  it("a damaged mirror is not opened", async () => {
    const id = await seedTrip();
    const a = await boot();
    await sleep(80);
    await a.kv.set(STORAGE_KEYS.mirror(id), { at: 1, user: "user-1", data: { days: "broken" } });
    offline();
    const b = await boot();
    expect(b.s().data).toBeNull();
    expect(b.s().bootError).toBe(true);
  });
});

describe("signed-in: two devices editing the trip's settings", () => {
  /** what another device would do: change the row on the server directly */
  const otherDeviceSaves = (patch: (row: Record<string, any>) => void) => {
    const row = rows("trips")[0] as Record<string, any>;
    patch(row);
    row.updated_at = new Date(Date.now() + 86_400_000).toISOString();
  };

  it("keeps the other device's change to a different setting instead of overwriting it", async () => {
    await seedTrip();
    const a = await boot();
    otherDeviceSaves((r) => { r.config = { ...r.config, locale: "fr-FR" }; });
    a.s().mutateTrip((d) => { d.config.tagline = "written here"; });
    await a.settlePending();
    await sleep(60);
    const server = rows("trips")[0].config as Record<string, unknown>;
    expect(server.tagline).toBe("written here");
    expect(server.locale).toBe("fr-FR"); // not lost
    expect(a.s().data!.config.locale).toBe("fr-FR"); // and now shown here too
    expect(a.s().data!.config.tagline).toBe("written here");
  });

  it("both devices adding a photo keeps both", async () => {
    await seedTrip();
    const a = await boot();
    otherDeviceSaves((r) => { r.media = { gallery: [{ id: "theirs", src: "t.jpg" }] }; });
    a.s().addGalleryMedia({ id: "mine", src: "m.jpg" } as never);
    await a.settlePending();
    await sleep(60);
    const gallery = (rows("trips")[0].media as { gallery: { id: string }[] }).gallery.map((g) => g.id).sort();
    expect(gallery).toEqual(["mine", "theirs"]);
    expect(a.s().data!.media.gallery.map((g) => g.id).sort()).toEqual(["mine", "theirs"]);
  });

  it("a save that races another device's save merges again on top of it rather than overwriting", async () => {
    await seedTrip();
    const a = await boot();
    let raced = false;
    fake.current.ctl.fail = (op, table) => {
      if (op === "update" && table === "trips" && !raced) {
        raced = true; // the other device saves between our read and our write
        otherDeviceSaves((r) => { r.config = { ...r.config, homeTimeZone: "Asia/Tokyo" }; });
      }
      return null;
    };
    a.s().mutateTrip((d) => { d.config.tagline = "raced"; });
    await a.settlePending();
    await sleep(60);
    const server = rows("trips")[0].config as Record<string, unknown>;
    expect(raced).toBe(true);
    expect(server.tagline).toBe("raced");
    expect(server.homeTimeZone).toBe("Asia/Tokyo");
  });

  it("this device's own settings still save when nothing else changed", async () => {
    await seedTrip();
    const a = await boot();
    a.s().mutateTrip((d) => { d.config.tagline = "solo"; });
    await a.settlePending();
    await sleep(60);
    expect((rows("trips")[0].config as Record<string, unknown>).tagline).toBe("solo");
    expect(a.s().syncState).toBe("saved");
  });

  it("the trip name follows the merged title", async () => {
    await seedTrip("Before");
    const a = await boot();
    a.s().mutateTrip((d) => { d.meta.title = "After"; d.config.branding = "After"; });
    await a.settlePending();
    await sleep(60);
    expect(rows("trips")[0].name).toBe("After");
  });
});
