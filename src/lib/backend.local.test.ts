import { describe, it, expect, beforeEach, vi } from "vitest";
import { pickBackend } from "./backend";
import { store as kv } from "./storage";
import { STORAGE_KEYS } from "./app";
import { SCHEMA_VERSION } from "./hydrate";
import { resetSnapshotMemory, listDeviceSnapshots, latestValidSnapshot } from "./safety/snapshots";
import { listQuarantine } from "./safety/quarantine";
import { tripStats } from "./safety/validate";
import { TripLoadError, SaveBlockedError, StorageError } from "./safety/errors";
import { buildDemo } from "@/templates/demo";
import type { TripData } from "@/core/types";

const be = pickBackend();
const summary = { name: "T", archived: false };
const trip = (): TripData => buildDemo();
const emptied = (t: TripData): TripData => ({
  ...t,
  legs: [], days: [], hotels: [], journeys: [], luggage: [], packing: [], docs: [], places: [], areas: [], scratchNotes: [],
});
const stored = (id: string) => kv.get<TripData>(STORAGE_KEYS.trip(id));
const rejects = async (p: Promise<unknown>) => { try { await p; } catch (e) { return e; } throw new Error("expected a rejection"); };

beforeEach(() => {
  resetSnapshotMemory();
  vi.restoreAllMocks();
});

describe("local backend: the trip list", () => {
  it("a genuinely new device has no trips", async () => {
    expect(await be.listTrips()).toEqual({ trips: [], activeId: null });
  });

  it("a storage read failure is an error, never 'no trips' (which would seed the demo over real data)", async () => {
    await kv.set("x", 1); // IndexedDB has worked here
    vi.spyOn(kv, "get").mockRejectedValue(new StorageError("read", "nope"));
    await expect(be.listTrips()).rejects.toBeInstanceOf(StorageError);
  });

  it("a damaged trip list is quarantined and rebuilt from the trips on disk", async () => {
    const id = await be.createTrip(trip(), summary);
    await kv.set(STORAGE_KEYS.atlas, "garbage");
    const { trips } = await be.listTrips();
    expect(trips.map((t) => t.id)).toEqual([id]);
    expect((await listQuarantine("atlas")).length).toBe(1);
    // and the rebuilt list was written back
    expect((await kv.get<{ trips: unknown[] }>(STORAGE_KEYS.atlas))?.trips).toHaveLength(1);
  });

  it("a missing trip list adopts trips it doesn't know about (interrupted create)", async () => {
    const id = await be.createTrip(trip(), summary); // blob written, list never was
    const { trips } = await be.listTrips();
    expect(trips.map((t) => t.id)).toContain(id);
  });

  it("keeps a listed trip whose blob won't read, so opening it can report the problem", async () => {
    await be.setActive("ghost", [{ id: "ghost", name: "Ghost", archived: false, createdAt: "", updatedAt: "" }]);
    const { trips } = await be.listTrips();
    expect(trips.map((t) => t.id)).toEqual(["ghost"]);
  });
});

describe("local backend: loading", () => {
  it("round-trips a trip", async () => {
    const t = trip();
    const id = await be.createTrip(t, summary);
    const back = await be.loadTrip(id);
    expect(tripStats(back).total).toBeGreaterThanOrEqual(tripStats(t).total);
  });

  it("missing data is reported as missing", async () => {
    const e = await rejects(be.loadTrip("nope"));
    expect(e).toBeInstanceOf(TripLoadError);
    expect((e as TripLoadError).kind).toBe("missing");
  });

  it.each([
    ["an empty object", {}],
    ["a string", "garbage"],
    ["a list", []],
    ["a collection that isn't a list", { config: {}, meta: {}, days: "x" }],
  ])("damaged data (%s) is 'corrupt' — never a fabricated default — and the original is left alone", async (_n, bad) => {
    await kv.set(STORAGE_KEYS.trip("c1"), bad);
    const e = await rejects(be.loadTrip("c1"));
    expect((e as TripLoadError).kind).toBe("corrupt");
    expect(await kv.get(STORAGE_KEYS.trip("c1"))).toEqual(bad); // untouched
    expect((await listQuarantine("trip-c1")).length).toBe(1); // and a copy set aside
  });

  it("refuses a trip written by a newer app", async () => {
    await kv.set(STORAGE_KEYS.trip("n1"), { ...trip(), v: SCHEMA_VERSION + 1 });
    expect(((await rejects(be.loadTrip("n1"))) as TripLoadError).kind).toBe("newer");
  });

  it("keeps a pre-migration restore point when loading an older shape", async () => {
    const old = { ...trip(), v: 3 };
    await kv.set(STORAGE_KEYS.trip("m1"), old);
    const d = await be.loadTrip("m1");
    expect(d.v).toBe(SCHEMA_VERSION);
    const snaps = await listDeviceSnapshots("m1");
    expect(snaps.map((s) => s.reason)).toContain("pre-migration");
    expect(snaps.find((s) => s.reason === "pre-migration")!.schema).toBe(3);
  });

  it("an unreadable device store is 'unavailable', not corrupt or missing", async () => {
    vi.spyOn(kv, "get").mockRejectedValue(new StorageError("read", "nope"));
    expect(((await rejects(be.loadTrip("x"))) as TripLoadError).kind).toBe("unavailable");
  });
});

describe("local backend: saving", () => {
  it.each([["[]", []], ["{}", {}], ["null", null], ["a string", "x"]])("refuses to save %s and leaves the stored trip unchanged", async (_n, bad) => {
    const id = await be.createTrip(trip(), summary);
    const before = await stored(id);
    const e = await rejects(be.saveWhole(id, bad as never));
    expect(e).toBeInstanceOf(SaveBlockedError);
    expect(await stored(id)).toEqual(before);
  });

  it("refuses a save that would erase the whole trip, keeps a copy, and allows it only when forced", async () => {
    const t = trip();
    const id = await be.createTrip(t, summary);
    const e = await rejects(be.saveWhole(id, emptied(t)));
    expect((e as SaveBlockedError).reason).toBe("would-erase");
    expect(tripStats(await stored(id)).total).toBeGreaterThan(0);
    expect((await listDeviceSnapshots(id)).map((s) => s.reason)).toContain("before-shrink");
    await be.saveWhole(id, emptied(t), { force: true });
    expect(tripStats(await stored(id)).total).toBe(0);
    // the pre-erase version is recoverable
    const good = await latestValidSnapshot(id);
    expect(tripStats(good!.data).total).toBeGreaterThan(0);
  });

  it("keeps a restore point before a large removal", async () => {
    const t = trip();
    const id = await be.createTrip(t, summary);
    const shrunk = { ...t, places: [], days: t.days.slice(0, 1), hotels: [], journeys: [], packing: [] };
    await be.saveWhole(id, shrunk);
    expect((await listDeviceSnapshots(id)).map((s) => s.reason)).toContain("before-shrink");
  });

  it("an interrupted write leaves the previous version intact", async () => {
    const t = trip();
    const id = await be.createTrip(t, summary);
    const before = await stored(id);
    vi.spyOn(kv, "set").mockRejectedValueOnce(new StorageError("write", "cut off"));
    await expect(be.saveWhole(id, { ...t, meta: { ...t.meta, title: "changed" } })).rejects.toBeInstanceOf(StorageError);
    expect(await stored(id)).toEqual(before);
  });

  it("a quota error is reported, not swallowed", async () => {
    const t = trip();
    const id = await be.createTrip(t, summary);
    vi.spyOn(kv, "set").mockRejectedValueOnce(new StorageError("quota", "full"));
    const e = await rejects(be.saveWhole(id, { ...t, meta: { ...t.meta, title: "x" } }));
    expect((e as StorageError).kind).toBe("quota");
  });

  it("reads each write back: a write that silently didn't stick is an error", async () => {
    const t = trip();
    const id = await be.createTrip(t, summary);
    vi.spyOn(kv, "set").mockResolvedValue(undefined); // claims success, stores nothing
    await expect(be.saveWhole(id, { ...t, meta: { ...t.meta, title: "lost" } })).rejects.toThrow(/read back/);
  });

  it("keeps the other window's version when it's about to be replaced", async () => {
    const t = trip();
    const id = await be.createTrip(t, summary);
    await be.loadTrip(id); // this tab now "knows" the stored version
    await kv.set(STORAGE_KEYS.trip(id), { ...t, meta: { ...t.meta, title: "edited elsewhere" } }); // another tab saves
    await be.saveWhole(id, { ...t, meta: { ...t.meta, title: "mine" } });
    const snaps = await listDeviceSnapshots(id);
    const ext = snaps.find((s) => s.reason === "external-change");
    expect(ext).toBeTruthy();
    expect(ext!.tripName).toBe("edited elsewhere");
    expect((await stored(id))!.meta.title).toBe("mine");
  });

  it("concurrent saves land in order: the last one wins", async () => {
    const t = trip();
    const id = await be.createTrip(t, summary);
    await Promise.all([1, 2, 3, 4, 5].map((n) => be.saveWhole(id, { ...t, meta: { ...t.meta, title: `v${n}` } })));
    expect((await stored(id))!.meta.title).toBe("v5");
  });

  it("overwriting a damaged blob sets the damaged copy aside first", async () => {
    const t = trip();
    await kv.set(STORAGE_KEYS.trip("d1"), { junk: true });
    await be.saveWhole("d1", t);
    expect((await listQuarantine("trip-d1")).length).toBe(1);
  });
});

describe("local backend: deleting and restoring", () => {
  it("a damaged blob is quarantined before it's deleted", async () => {
    await kv.set(STORAGE_KEYS.trip("x1"), "junk");
    await be.deleteTrip("x1");
    expect(await kv.get(STORAGE_KEYS.trip("x1"))).toBeUndefined();
    expect((await listQuarantine("trip-x1")).length).toBe(1);
  });

  it("replaceTrip restores a trip exactly", async () => {
    const t = trip();
    const id = await be.createTrip(t, summary);
    await be.replaceTrip(id, emptied(t));
    await be.replaceTrip(id, t);
    expect(tripStats(await stored(id)).total).toBe(tripStats(t).total);
  });
});
