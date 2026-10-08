import { describe, expect, it } from "vitest";
import { webSearch } from "./search";

const req = { query: "Cafe Kitsune", answer: true, max: 8, timeout: 1000 };

/** Tavily answers with `tavilyStatus`; Exa answers its /answer citations */
function fakeApis(tavilyStatus: number) {
  const asked: string[] = [];
  const fetchImpl = async (url: string) => {
    asked.push(new URL(url).hostname);
    if (url.includes("tavily"))
      return new Response(JSON.stringify({ answer: "Hours: 9-17", results: [{ url: "https://a.com", title: "Tavily page" }] }), { status: tavilyStatus });
    return new Response(JSON.stringify({ answer: "Hours: 10-18", citations: [{ url: "https://b.com", title: "Exa page", text: "x".repeat(5000) }] }));
  };
  return { fetchImpl, asked };
}

describe("webSearch", () => {
  it("asks Tavily first", async () => {
    const { fetchImpl, asked } = fakeApis(200);
    expect((await webSearch(req, { tavily: "t", exa: "e" }, fetchImpl)).answer).toBe("Hours: 9-17");
    expect(asked).toEqual(["api.tavily.com"]);
  });
  it("asks Exa when Tavily's searches are used up", async () => {
    const { fetchImpl, asked } = fakeApis(432);
    const out = await webSearch(req, { tavily: "t", exa: "e" }, fetchImpl);
    expect(out.answer).toBe("Hours: 10-18");
    expect(out.results[0]).toMatchObject({ url: "https://b.com", title: "Exa page" });
    expect(out.results[0].content).toHaveLength(1500);
    expect(asked).toEqual(["api.tavily.com", "api.exa.ai"]);
  });
  it("uses Exa alone when it's the only key", async () => {
    const { fetchImpl, asked } = fakeApis(200);
    await webSearch(req, { exa: "e" }, fetchImpl);
    expect(asked).toEqual(["api.exa.ai"]);
  });
  it("throws when Tavily fails and there's no Exa key", async () => {
    await expect(webSearch(req, { tavily: "t" }, fakeApis(432).fetchImpl)).rejects.toThrow("432");
  });
  it("throws with no key at all", async () => {
    await expect(webSearch(req, {}, fakeApis(200).fetchImpl)).rejects.toThrow("No search key");
  });
});
