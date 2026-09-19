import { describe, it, expect, beforeEach } from "vitest";
import { buildBlank } from "@/templates/blank";
import { store as kv } from "@/lib/storage";
import {
  takeDeviceSnapshot,
  listDeviceSnapshots,
  readSnapshot,
  latestValidSnapshot,
  resetSnapshotMemory,
  purgeDeletedTripSnapshots,
  DELETED_KEEP_DAYS,
  LIMITS,
} from "./snapshots";
import type { TripData } from "@/core/types";

beforeEach(() => {
  resetSnapshotMemory();
});

describe("takeDeviceSnapshot", () => {
  it("writes a restore point that reads back with a matching checksum", async () => {
    const trip = buildBlank("Test trip");
    const meta = await takeDeviceSnapshot("trip-1", trip, "manual", { force: true });
    expect(meta).not.toBeNull();
    const back = await readSnapshot(meta!);
    expect(back).toEqual(trip);
  });

  it("throttles automatic snapshots of unchanged content", async () => {
    const trip = buildBlank("Test trip");
    const first = await takeDeviceSnapshot("trip-1", trip, "auto");
    expect(first).not.toBeNull();
    const second = await takeDeviceSnapshot("trip-1", trip, "auto"); // same content, no force
    expect(second).toBeNull();
  });

  it("throttles automatic snapshots that arrive too soon, even with different content", async () => {
    const trip = buildBlank("Test trip");
    await takeDeviceSnapshot("trip-1", trip, "auto");
    const trip2 = { ...trip, meta: { ...trip.meta, title: "Renamed" } };
    const second = await takeDeviceSnapshot("trip-1", trip2, "auto"); // within LIMITS.deviceAutoEveryMs
    expect(second).toBeNull();
  });

  it("never throttles an event snapshot (before-delete, before-restore, …)", async () => {
    const trip = buildBlank("Test trip");
    await takeDeviceSnapshot("trip-1", trip, "auto", { force: true });
    const event = await takeDeviceSnapshot("trip-1", trip, "before-delete");
    expect(event).not.toBeNull();
  });

  it("force bypasses the throttle window", async () => {
    const trip = buildBlank("Test trip");
    await takeDeviceSnapshot("trip-1", trip, "auto", { force: true });
    const trip2 = { ...trip, meta: { ...trip.meta, title: "Renamed" } };
    const forced = await takeDeviceSnapshot("trip-1", trip2, "auto", { force: true });
    expect(forced).not.toBeNull();
  });

  it("refuses to back up structurally broken data", async () => {
    await expect(takeDeviceSnapshot("trip-1", { days: "oops" } as unknown as TripData, "manual")).rejects.toThrow(/broken/);
  });

  it("keeps trips separate", async () => {
    await takeDeviceSnapshot("trip-a", buildBlank("A"), "manual", { force: true });
    await takeDeviceSnapshot("trip-b", buildBlank("B"), "manual", { force: true });
    expect(await listDeviceSnapshots("trip-a")).toHaveLength(1);
    expect(await listDeviceSnapshots("trip-b")).toHaveLength(1);
  });
});

describe("pruning", () => {
  it("keeps only the newest LIMITS.autoKeep automatic snapshots", async () => {
    for (let i = 0; i < LIMITS.autoKeep + 3; i++) {
      const trip = { ...buildBlank("Test trip"), meta: { ...buildBlank().meta, title: `v${i}` } };
      await takeDeviceSnapshot("trip-1", trip, "auto", { force: true });
    }
    const list = await listDeviceSnapshots("trip-1");
    expect(list.filter((s) => s.reason === "auto")).toHaveLength(LIMITS.autoKeep);
  });

  it("event snapshots have their own ring, unaffected by a flood of autos", async () => {
    await takeDeviceSnapshot("trip-1", buildBlank("Test trip"), "before-delete");
    for (let i = 0; i < LIMITS.autoKeep + 3; i++) {
      const trip = { ...buildBlank("Test trip"), meta: { ...buildBlank().meta, title: `v${i}` } };
      await takeDeviceSnapshot("trip-1", trip, "auto", { force: true });
    }
    const list = await listDeviceSnapshots("trip-1");
    expect(list.some((s) => s.reason === "before-delete")).toBe(true);
  });
});

describe("readSnapshot", () => {
  it("throws if the stored envelope has been tampered with", async () => {
    const trip = buildBlank("Test trip");
    const meta = await takeDeviceSnapshot("trip-1", trip, "manual", { force: true });
    // reach past the public API to corrupt the stored bytes, the way real damage would
    const raw = (await kv.get<{ data: TripData }>(meta!.id))!;
    raw.data.meta.title = "Tampered";
    await kv.set(meta!.id, raw);
    await expect(readSnapshot(meta!)).rejects.toThrow(/damaged/);
  });
});

describe("latestValidSnapshot", () => {
  it("skips a damaged entry and returns the next good one", async () => {
    const good = buildBlank("Good");
    await takeDeviceSnapshot("trip-1", good, "manual", { force: true });
    await new Promise((r) => setTimeout(r, 2));
    const badMeta = await takeDeviceSnapshot("trip-1", buildBlank("Bad"), "manual", { force: true });
    const raw = (await kv.get<{ data: TripData }>(badMeta!.id))!;
    raw.data.meta.title = "Tampered";
    await kv.set(badMeta!.id, raw);

    const result = await latestValidSnapshot("trip-1");
    expect(result?.data.meta.title).toBe("Good");
  });

  it("returns null when there are no restore points", async () => {
    expect(await latestValidSnapshot("no-such-trip")).toBeNull();
  });
});

describe("purgeDeletedTripSnapshots", () => {
  const day = 86_400_000;
  it("removes restore points of trips deleted longer ago than the window, keeps recent ones and live trips", async () => {
    const t = buildBlank("x");
    for (const id of ["gone-old", "alive"]) await takeDeviceSnapshot(id, t, "manual", { force: true });
    const future = Date.now() + (DELETED_KEEP_DAYS + 1) * day;
    const removed = await purgeDeletedTripSnapshots(["alive"], { now: future }); // both are old by then; only one is a deleted trip
    expect(removed).toBeGreaterThan(0);
    expect(await listDeviceSnapshots("gone-old")).toHaveLength(0);
    expect((await listDeviceSnapshots("alive")).length).toBe(1);
    // a trip deleted just now keeps its restore points
    await takeDeviceSnapshot("gone-new", t, "before-delete", { force: true });
    expect(await purgeDeletedTripSnapshots([], { now: Date.now() })).toBe(0);
    expect((await listDeviceSnapshots("gone-new")).length).toBe(1);
  });
});
