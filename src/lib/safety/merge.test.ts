import { describe, it, expect } from "vitest";
import { mergeJson } from "./merge";

describe("mergeJson: objects", () => {
  it("keeps each device's different edits", () => {
    const base = { currency: "JPY", locale: "en-GB", tagline: "a" };
    const local = { ...base, currency: "EUR" };
    const server = { ...base, locale: "fr-FR" };
    expect(mergeJson(base, local, server)).toEqual({ currency: "EUR", locale: "fr-FR", tagline: "a" });
  });

  it("when both changed the same value, this device's wins", () => {
    expect(mergeJson({ a: 1 }, { a: 2 }, { a: 3 })).toEqual({ a: 2 });
  });

  it("a key one side removed stays removed if the other left it alone", () => {
    expect(mergeJson({ a: 1, b: 2 }, { a: 1 }, { a: 1, b: 2 })).toEqual({ a: 1 });
    expect(mergeJson({ a: 1, b: 2 }, { a: 1, b: 2 }, { a: 1 })).toEqual({ a: 1 });
  });

  it("merges nested objects (theme colours edited on two devices)", () => {
    const base = { theme: { light: { accent: "#111", ink: "#222" } } };
    const local = { theme: { light: { accent: "#aaa", ink: "#222" } } };
    const server = { theme: { light: { accent: "#111", ink: "#bbb" } } };
    expect(mergeJson(base, local, server)).toEqual({ theme: { light: { accent: "#aaa", ink: "#bbb" } } });
  });

  it("an unknown base makes this device's differences win, never silently drops anything", () => {
    expect(mergeJson(undefined, { a: 1 }, { a: 2, b: 3 })).toEqual({ a: 1, b: 3 });
  });
});

describe("mergeJson: lists of items with ids", () => {
  const item = (id: string, name = id) => ({ id, name });

  it("two devices adding different items keep both (the media gallery case)", () => {
    const base = { gallery: [item("a")] };
    const local = { gallery: [item("a"), item("mine")] };
    const server = { gallery: [item("a"), item("theirs")] };
    const out = mergeJson(base, local, server) as { gallery: { id: string }[] };
    expect(out.gallery.map((g) => g.id).sort()).toEqual(["a", "mine", "theirs"]);
  });

  it("edits to different items both survive", () => {
    const base = [item("a"), item("b")];
    const out = mergeJson(base, [item("a", "mine"), item("b")], [item("a"), item("b", "theirs")]) as { id: string; name: string }[];
    expect(out).toEqual([item("a", "mine"), item("b", "theirs")]);
  });

  it("an item deleted on one side and untouched on the other is gone", () => {
    const base = [item("a"), item("b")];
    expect(mergeJson(base, [item("a")], base)).toEqual([item("a")]);
    expect(mergeJson(base, base, [item("b")])).toEqual([item("b")]);
  });

  it("an edit beats a delete — nothing is lost", () => {
    const base = [item("a"), item("b")];
    expect(mergeJson(base, [item("a")], [item("a"), item("b", "edited elsewhere")])).toEqual([item("a"), item("b", "edited elsewhere")]);
    expect(mergeJson(base, [item("a"), item("b", "edited here")], [item("a")])).toEqual([item("a"), item("b", "edited here")]);
  });

  it("keeps this device's reordering when the other didn't reorder", () => {
    const base = [item("a"), item("b"), item("c")];
    const local = [item("c"), item("a"), item("b")];
    const server = [item("a"), item("b"), item("c"), item("d")];
    expect((mergeJson(base, local, server) as { id: string }[]).map((x) => x.id)).toEqual(["c", "a", "b", "d"]);
  });

  it("plain lists (no ids) are atomic: this device's stands if both changed", () => {
    expect(mergeJson({ c: ["JPY"] }, { c: ["EUR", "JPY"] }, { c: ["USD"] })).toEqual({ c: ["EUR", "JPY"] });
    expect(mergeJson({ c: ["JPY"] }, { c: ["JPY"] }, { c: ["USD"] })).toEqual({ c: ["USD"] });
  });
});
