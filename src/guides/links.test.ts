import { describe, expect, it } from "vitest";
import { GUIDE_CONTENT } from "./content";
import { allTopics, articleText, cityArticles, dayTripArticles, dateArticles, resolveRef, topicArticles } from "./articles";

describe("guide cross-references", () => {
  for (const [id, guide] of Object.entries(GUIDE_CONTENT)) {
    const entries = [
      ...allTopics(guide).flatMap(topicArticles),
      ...guide.cities.flatMap((c) => [...cityArticles(c), ...dayTripArticles(c)]),
      ...dateArticles(guide.dates),
    ];

    it(`${id}: every in-text link and related entry exists`, () => {
      const broken: string[] = [];
      for (const e of entries) {
        const refs = [...articleText(e.article).matchAll(/\]\(guide:([^)\s]+)\)/g)].map((m) => m[1]);
        for (const ref of [...refs, ...(e.article.related ?? [])]) {
          if (!resolveRef(guide, ref)) broken.push(`${e.title} → ${ref}`);
        }
      }
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
      expect(broken).toEqual([]);
    });
  }
});
