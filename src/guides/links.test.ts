import { describe, expect, it } from "vitest";
import { GUIDE_CONTENT } from "./content";
import { allTopics, articleText, cityArticles, dateArticles, dayTripArticles, findRef, renamedPaths, resolveRef, titleSlug, topicArticles } from "./articles";
import { guideHits } from "./search";

describe("guide cross-references", () => {
  for (const [id, guide] of Object.entries(GUIDE_CONTENT)) {
    const entries = [
      ...allTopics(guide).flatMap(topicArticles),
      ...guide.cities.flatMap((c) => [...cityArticles(c), ...dayTripArticles(c)]),
      ...dateArticles(guide.dates),
    ];

    it(`${id}: every in-text link and related entry exists`, () => {
      const broken: string[] = [];
      const intros = allTopics(guide).map((t) => JSON.stringify(t.intro ?? ""));
      for (const text of [...entries.map((e) => articleText(e.article)), ...intros]) {
        for (const m of text.matchAll(/\]\(guide:([^)\s]+)\)/g)) if (!resolveRef(guide, m[1])) broken.push(m[1]);
      }
      for (const e of entries) for (const ref of e.article.related ?? []) if (!resolveRef(guide, ref)) broken.push(`${e.title} → ${ref}`);
      expect(broken).toEqual([]);
    });

    it(`${id}: every citation points at a listed source`, () => {
      const broken: string[] = [];
      for (const e of entries) {
        const n = e.article.sources?.length ?? 0;
        for (const m of articleText(e.article).matchAll(/\[\^(\d+)\]/g)) {
          if (Number(m[1]) < 1 || Number(m[1]) > n) broken.push(`${e.title} [^${m[1]}]`);
        }
      }
      for (const t of allTopics(guide)) {
        const n = t.intro?.sources?.length ?? 0;
        for (const m of JSON.stringify(t.intro?.body ?? "").matchAll(/\[\^(\d+)\]/g)) {
          if (Number(m[1]) < 1 || Number(m[1]) > n) broken.push(`${t.title} intro [^${m[1]}]`);
        }
      }
      expect(broken).toEqual([]);
    });

    it(`${id}: every search hit opens a page of the guide`, () => {
      const base = `/logbook/guide/${guide.id}`;
      const pages = new Set([
        ...allTopics(guide).flatMap((t) => [`${base}/${t.id}`, ...topicArticles(t).map((r) => `${base}/${t.id}/${r.slug}`)]),
        ...guide.cities.flatMap((c) => [`${base}/place/${c.id}`, ...cityArticles(c).map((r) => `${base}/place/${c.id}/${r.slug}`), ...dayTripArticles(c).map((r) => `${base}/place/${c.id}/day-trips/${r.slug}`)]),
        ...dateArticles(guide.dates).map((r) => `${base}/date/${r.slug}`),
      ]);
      const hits = guideHits([id]);
      expect(hits.length).toBe(pages.size);
      expect(hits.filter((h) => !pages.has(h.to)).map((h) => h.to)).toEqual([]);
    });

    it(`${id}: slugs keep accented letters, and old ones still open`, () => {
      // "Jōmon" must read "jomon", never "j-mon"
      const lost = entries.filter((e) => /[\u00C0-\u024F]/.test(e.title) && !e.slug.startsWith(titleSlug(e.title))).map((e) => e.slug);
      expect(lost).toEqual([]);
      expect(renamedPaths(guide).size).toBeGreaterThan(0);
      for (const e of entries.filter((x) => x.was)) expect(findRef(entries, e.was)).toBeGreaterThanOrEqual(0);
    });

    it(`${id}: key figures fit three across on a phone`, () => {
      // a figure never wraps, so a long one in a row of three runs into its
      // neighbour on a 375pt screen; about eight characters is the most that fits
      const long: string[] = [];
      const walk = (o: unknown): void => {
        if (Array.isArray(o)) return o.forEach(walk);
        if (!o || typeof o !== "object") return;
        const stats = (o as { stats?: { value: string }[] }).stats;
        if (stats?.length === 3) for (const s of stats) if ([...s.value].length > 8) long.push(s.value);
        Object.values(o).forEach(walk);
      };
      walk(guide);
      expect(long).toEqual([]);
    });

    it(`${id}: a list is set as a list, not run into a paragraph`, () => {
      // "**Land**: … **Trade**: …" or three sentences that each open on a
      // bold term are items, and belong in terms or a bulleted list
      const run: string[] = [];
      const walk = (o: unknown): void => {
        if (Array.isArray(o)) return o.forEach(walk);
        if (!o || typeof o !== "object") return;
        const p = (o as { p?: unknown }).p;
        if (typeof p === "string") {
          const labels = (p.match(/\*\*[^*]+\*\*:/g) ?? []).length;
          const boldLed = p.split(/(?<=[.!?])\s+/).filter((s) => s.startsWith("**")).length;
          if (labels >= 2 || boldLed >= 3) run.push(p.slice(0, 60));
        }
        Object.values(o).forEach(walk);
      };
      walk(guide);
      expect(run).toEqual([]);
    });

    it(`${id}: no photo appears twice`, () => {
      const seen = new Map<string, number>();
      for (const m of JSON.stringify(guide).matchAll(/"src":"([^"]+)"/g)) seen.set(m[1], (seen.get(m[1]) ?? 0) + 1);
      expect([...seen].filter(([, n]) => n > 1).map(([src]) => src)).toEqual([]);
    });
  }
});
