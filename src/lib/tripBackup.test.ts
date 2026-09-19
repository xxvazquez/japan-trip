import { describe, it, expect } from "vitest";
import { buildBackup, parseBackup, BackupError } from "./tripBackup";
import { buildDemo } from "@/templates/demo";
import { tripStats } from "./safety/validate";
import { SCHEMA_VERSION } from "./hydrate";
import type { TripData } from "@/core/types";

const trip = () => buildDemo();
const file = (over: Record<string, unknown> = {}) => JSON.parse(buildBackup(trip())) as Record<string, any> & typeof over;
const fails = (text: string, re: RegExp) => expect(() => parseBackup(text)).toThrow(re);

describe("backup export", () => {
  it("round-trips a whole trip without losing anything", () => {
    const t = trip();
    const back = parseBackup(buildBackup(t));
    // normalizing on the way back may add the guaranteed Emergency doc, never remove anything
    expect(tripStats(back).total).toBeGreaterThanOrEqual(tripStats(t).total);
    expect(back.meta.title).toBe(t.meta.title);
  });

  it("refuses to export data that's structurally broken", () => {
    expect(() => buildBackup({ ...trip(), days: "oops" } as unknown as TripData)).toThrow(BackupError);
  });

  it("records a checksum and item count", () => {
    const f = file();
    expect(f.checksum).toBeTruthy();
    expect(f.counts.total).toBe(tripStats(trip()).total);
  });
});

describe("backup import refuses bad files instead of overwriting anything", () => {
  it("not JSON / truncated", () => {
    fails("not json", /isn.t a trip backup/);
    fails(buildBackup(trip()).slice(0, 200), /isn.t a trip backup/);
  });
  it("valid JSON of the wrong kind", () => {
    fails("[]", /isn.t a trip backup/);
    fails('{"format":"other","trip":{}}', /isn.t a trip backup/);
  });
  it("made by a newer app", () => {
    const f = file();
    f.schema = SCHEMA_VERSION + 1;
    fails(JSON.stringify(f), /newer version/);
  });
  it("missing parts of the trip", () => {
    const f = file();
    delete f.trip.days;
    fails(JSON.stringify(f), /missing parts/);
  });
  it("a damaged collection", () => {
    const f = file();
    f.trip.places = "nope";
    delete f.checksum;
    fails(JSON.stringify(f), /damaged/);
  });
  it("edited or corrupted after it was saved (checksum mismatch)", () => {
    const f = file();
    f.trip.meta.title = "tampered";
    fails(JSON.stringify(f), /checksum/);
  });
  it("an empty trip", () => {
    const f = file();
    for (const k of ["legs", "days", "hotels", "journeys", "luggage", "packing", "docs", "places", "areas", "scratchNotes"]) f.trip[k] = [];
    delete f.checksum;
    fails(JSON.stringify(f), /nothing in it/);
  });
  it("an implausibly huge file", () => {
    expect(() => parseBackup("x".repeat(51 * 1024 * 1024))).toThrow(/too big/);
  });
  it("a restored trip is always editable", () => {
    const t = trip();
    t.config.demo = true;
    expect(parseBackup(buildBackup(t)).config.demo).toBe(false);
  });
});
