import { describe, expect, it } from "vitest";
import { GUIDE_CONTENT } from "./content";
import { CITY_GROUPS } from "./types";
import { cityLinks, dateArticles, dayTripArticles, guideGraph, relatedTo, resolveRef } from "./articles";

describe("guide links, both ways", () => {
  for (const [id, guide] of Object.entries(GUIDE_CONTENT)) {
    const { entries, into } = guideGraph(guide);

    it(`${id}: a day trip and a date can be linked to`, () => {
      const c = guide.cities.find((x) => x.dayTrips?.length)!;
      const trip = dayTripArticles(c)[0];
      expect(resolveRef(guide, `place/${c.id}/day-trips/${trip.slug}`)?.title).toBe(trip.title);
      const date = dateArticles(guide.dates)[0];
      expect(resolveRef(guide, `date/${date.slug}`)?.title).toBe(date.title);
      expect(resolveRef(guide, "date/no-such-day")).toBeUndefined();
    });

    it(`${id}: every entry has its own reference`, () => {
      const refs = entries.map((e) => e.ref);
      expect(new Set(refs).size).toBe(refs.length);
      for (const e of entries) expect(resolveRef(guide, e.ref)?.title).toBe(e.entry.title);
    });

    it(`${id}: a link written on one side shows on the other`, () => {
      const missing: string[] = [];
      for (const e of entries) {
        for (const from of into.get(e.ref) ?? []) {
          const { related, places } = relatedTo(guide, e.ref, { related: Infinity, places: Infinity });
          const inText = (e.entry.article.related ?? []).includes(from) || JSON.stringify(e.entry.article).includes(`(guide:${from})`);
          if (!inText && !related.includes(from) && !places.includes(from)) missing.push(`${from} → ${e.ref}`);
        }
      }
      expect(missing).toEqual([]);
    });

    it(`${id}: related lists never point back at themselves or repeat`, () => {
      for (const e of entries) {
        const { related, places } = relatedTo(guide, e.ref);
        const all = [...related, ...places];
        expect(all).not.toContain(e.ref);
        expect(new Set(all).size).toBe(all.length);
      }
    });

    it(`${id}: every place is tied into the rest of the guide`, () => {
      const alone = guide.cities.filter((c) => cityLinks(guide, c).reads.length === 0).map((c) => c.id);
      expect(alone).toEqual([]);
    });
  }
});

describe("city pages", () => {
  for (const [id, guide] of Object.entries(GUIDE_CONTENT)) {
    it(`${id}: every note on a place sits under one of the shared headings`, () => {
      const loose = guide.cities.flatMap((c) => c.items.filter((i) => !i.group || !CITY_GROUPS.includes(i.group)).map((i) => `${c.id}: ${i.title}`));
      expect(loose).toEqual([]);
    });
  }
});

describe("dates", () => {
  for (const [id, guide] of Object.entries(GUIDE_CONTENT)) {
    it(`${id}: a date's places are places in the guide`, () => {
      const ids = new Set(guide.cities.map((c) => c.id));
      expect(guide.dates.flatMap((d) => (d.places ?? []).filter((p) => !ids.has(p)))).toEqual([]);
    });
  }
});
