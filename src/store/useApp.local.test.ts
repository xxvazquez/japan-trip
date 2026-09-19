import { describe, it, expect, vi, beforeEach } from "vitest";
import { STORAGE_KEYS } from "@/lib/app";
import type { TripData } from "@/core/types";

/** a fresh "page load": new module instances, same device storage */
async function boot() {
  vi.resetModules();
  const app = await import("@/store/useApp");
  const kv = (await import("@/lib/storage")).store;
  const snaps = await import("@/lib/safety/snapshots");
  await app.useApp.getState().init();
  return { ...app, kv, snaps, s: () => app.useApp.getState() };
}
const place = (id: string) => ({ id, name: `Place ${id}`, lat: 1, lng: 2 }) as never;

beforeEach(() => vi.restoreAllMocks());

describe("device-only trips: edits survive reloads", () => {
  it("first boot seeds a trip once; a reload opens the same trip, it doesn't seed again", async () => {
    const a = await boot();
    const id = a.s().activeId!;
    expect(a.s().data).not.toBeNull();
    const b = await boot();
    expect(b.s().activeId).toBe(id);
    expect(b.s().trips).toHaveLength(1);
  });

  it("an edit is on disk after settling, and is there after a reload", async () => {
    const a = await boot();
    a.s().addEntity("places", place("p1"));
    expect(await a.settlePending()).toBe(true);
    const b = await boot();
    expect(b.s().data!.places.map((p) => p.id)).toContain("p1");
  });

  it("the page-hide flush gets a still-debounced edit onto disk", async () => {
    const a = await boot();
    a.s().addEntity("places", place("p2"));
    a.flushPendingNow(); // what pagehide / visibilitychange / an error screen call
    await a.settlePending();
    const b = await boot();
    expect(b.s().data!.places.map((p) => p.id)).toContain("p2");
  });

  it("rapid edits all land (the single-flight writer always saves the newest state)", async () => {
    const a = await boot();
    for (let i = 0; i < 10; i++) a.s().addEntity("places", place(`r${i}`));
    await a.settlePending();
    const b = await boot();
    const ids = b.s().data!.places.map((p) => p.id);
    for (let i = 0; i < 10; i++) expect(ids).toContain(`r${i}`);
  });
});

describe("device-only trips: the page dies right after an edit", () => {
  it("an edit made in the last moments survives even though the disk write never finished", async () => {
    const a = await boot();
    a.s().addEntity("places", place("lastsecond"));
    // the page is going away: the store drops a synchronous copy, then starts the async save…
    const { StorageError } = await import("@/lib/safety/errors");
    vi.spyOn(a.kv, "set").mockRejectedValue(new StorageError("write", "process killed"));
    a.flushPendingNow();
    await a.settlePending(300); // …which never lands
    vi.restoreAllMocks();

    const b = await boot(); // next open
    expect(b.s().data!.places.map((p) => p.id)).toContain("lastsecond");
  });

  it("an edit inside the debounce window with no hide event is (only) what the draft exists for", async () => {
    const a = await boot();
    a.s().addEntity("places", place("nodraft"));
    // killed with no pagehide at all and nothing saved: nothing to recover, and nothing corrupt either
    const b = await boot();
    expect(b.s().data).not.toBeNull();
    expect(b.s().loadIssue).toBeNull();
  });
});

describe("device-only trips: damaged storage never becomes an empty trip", () => {
  it("a corrupt trip blob opens the recovery state, leaves the blob alone, and keeps the other trips", async () => {
    const a = await boot();
    const id = a.s().activeId!;
    a.s().addEntity("places", place("keep"));
    await a.settlePending();
    await a.kv.set(STORAGE_KEYS.trip(id), { config: {}, meta: {}, days: "broken" });

    const b = await boot();
    expect(b.s().data).toBeNull();
    expect(b.s().loadIssue).toMatchObject({ kind: "corrupt", tripId: id });
    expect(b.s().trips.map((t) => t.id)).toEqual([id]); // not replaced by a fresh seed
    expect(await b.kv.get(STORAGE_KEYS.trip(id))).toEqual({ config: {}, meta: {}, days: "broken" });
  });

  it("restoring the newest restore point brings the trip back and clears the recovery state", async () => {
    const a = await boot();
    const id = a.s().activeId!;
    a.s().addEntity("places", place("precious"));
    await a.settlePending();
    await a.kv.set(STORAGE_KEYS.trip(id), "garbage");

    const b = await boot();
    expect(b.s().loadIssue?.kind).toBe("corrupt");
    const points = await b.snaps.listSnapshots(id);
    expect(points.length).toBeGreaterThan(0);
    await b.s().restoreSnapshot(points[0], "replace");
    expect(b.s().loadIssue).toBeNull();
    expect(b.s().data!.places.map((p) => p.id)).toContain("precious");

    const c = await boot(); // and it's really back on disk
    expect(c.s().loadIssue).toBeNull();
    expect(c.s().data!.places.map((p) => p.id)).toContain("precious");
  });

  it("a damaged trip list doesn't reseed the demo over the user's trips", async () => {
    const a = await boot();
    const id = a.s().activeId!;
    await a.s().createTrip({ name: "Second" });
    await a.settlePending();
    await a.kv.set(STORAGE_KEYS.atlas, 12345);
    const b = await boot();
    expect(b.s().trips.map((t) => t.name)).toEqual(expect.arrayContaining(["Second"]));
    expect(b.s().trips.length).toBeGreaterThanOrEqual(2);
    expect(b.s().trips.some((t) => t.id === id)).toBe(true);
  });

  it("a storage read failure at boot shows the retry screen, not an empty app", async () => {
    const a = await boot();
    await a.settlePending();
    vi.resetModules();
    const app = await import("@/store/useApp");
    const kv = (await import("@/lib/storage")).store;
    const { StorageError } = await import("@/lib/safety/errors");
    vi.spyOn(kv, "get").mockRejectedValue(new StorageError("read", "nope"));
    await app.useApp.getState().init();
    expect(app.useApp.getState().bootError).toBe(true);
    expect(app.useApp.getState().data).toBeNull();
    expect(app.useApp.getState().trips).toEqual([]);
  });
});

describe("device-only trips: a failed save is loud, keeps the edit, and retries", () => {
  it("quota error → banner + error state, edit stays on screen; retry succeeds once space is back", async () => {
    const a = await boot();
    const { StorageError } = await import("@/lib/safety/errors");
    const spy = vi.spyOn(a.kv, "set").mockRejectedValue(new StorageError("quota", "full"));
    a.s().addEntity("places", place("q1"));
    await a.settlePending(500);
    expect(a.s().syncState).toBe("error");
    expect(a.s().notice?.text).toMatch(/storage space/);
    expect(a.s().data!.places.map((p) => p.id)).toContain("q1");

    spy.mockRestore();
    a.s().retrySave();
    await a.settlePending(2000);
    expect(a.s().syncState).toBe("idle");
    expect(a.s().notice).toBeNull();
    const b = await boot();
    expect(b.s().data!.places.map((p) => p.id)).toContain("q1");
  });

  it("an interrupted write leaves the last saved version on disk untouched", async () => {
    const a = await boot();
    const id = a.s().activeId!;
    a.s().addEntity("places", place("safe"));
    await a.settlePending();
    const { StorageError } = await import("@/lib/safety/errors");
    vi.spyOn(a.kv, "set").mockRejectedValue(new StorageError("write", "cut off"));
    a.s().addEntity("places", place("lost-for-now"));
    await a.settlePending(500);
    vi.restoreAllMocks();
    const blob = await a.kv.get<TripData>(STORAGE_KEYS.trip(id));
    const ids = blob!.places.map((p) => p.id);
    expect(ids).toContain("safe");
    expect(ids).not.toContain("lost-for-now"); // the stored trip was never half-written
  });
});

describe("trips: delete, restore, import", () => {
  async function withOwnTrip() {
    const a = await boot();
    const id = await a.s().createTrip({ name: "Mine" });
    await a.s().switchTrip(id);
    a.s().addEntity("places", place("mine1"));
    await a.settlePending();
    return { a, id };
  }

  it("deleting a trip keeps a restore point first, and 'Recently deleted' can bring it back", async () => {
    const { a, id } = await withOwnTrip();
    await a.s().deleteTrip(id);
    expect(a.s().trips.some((t) => t.id === id)).toBe(false);
    expect(await a.kv.get(STORAGE_KEYS.trip(id))).toBeUndefined();

    const points = (await a.snaps.listSnapshots(id)).filter((p) => p.reason === "before-delete");
    expect(points).toHaveLength(1);
    await a.s().restoreSnapshot(points[0], "copy");
    expect(a.s().data!.places.map((p) => p.id.length > 0)).toContain(true);
    expect(a.s().data!.places).toHaveLength(1);
    expect(a.s().data!.meta.title).toMatch(/Mine/);
  });

  it("refuses to delete when no restore point can be made — the trip stays", async () => {
    const { a, id } = await withOwnTrip();
    const { StorageError } = await import("@/lib/safety/errors");
    const real = a.kv.set.bind(a.kv);
    vi.spyOn(a.kv, "set").mockImplementation((k, v) =>
      k.startsWith("snap:") ? Promise.reject(new StorageError("write", "no")) : real(k, v));
    await a.s().deleteTrip(id);
    expect(a.s().notice?.tone).toBe("error");
    expect(a.s().trips.some((t) => t.id === id)).toBe(true);
    expect(await a.kv.get(STORAGE_KEYS.trip(id))).toBeDefined();
  });

  it("importing bad data throws and adds nothing", async () => {
    const a = await boot();
    const before = a.s().trips.length;
    await expect(a.s().importTrip({ days: "x" } as unknown as TripData)).rejects.toThrow(/Nothing was changed/);
    expect(a.s().trips).toHaveLength(before);
  });

  it("importing a good trip only ever adds one; nothing existing changes", async () => {
    const a = await boot();
    const existing = a.s().data!;
    const beforeIds = a.s().trips.map((t) => t.id);
    const id = await a.s().importTrip(structuredClone(existing));
    expect(a.s().trips.map((t) => t.id)).toEqual([...beforeIds, id]);
    expect(await a.kv.get(STORAGE_KEYS.trip(beforeIds[0]))).toBeDefined();
  });

  it("a restore over the open trip keeps what it replaced as a restore point", async () => {
    const { a, id } = await withOwnTrip();
    const [older] = await a.snaps.listSnapshots(id);
    a.s().addEntity("places", place("mine2"));
    await a.settlePending();
    await a.s().restoreSnapshot(older, "replace");
    const reasons = (await a.snaps.listSnapshots(id)).map((p) => p.reason);
    expect(reasons).toContain("before-restore");
  });
});
