import { describe, expect, it } from "vitest";
import { GUIDE_CONTENT } from "./content";
import { allTopics, articleText, cityArticles, dateArticles, dayTripArticles, resolveRef, topicArticles } from "./articles";

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
  }
});
