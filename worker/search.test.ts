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
  it("asks Linkup when Tavily and Exa are both used up", async () => {
    const asked: string[] = [];
    const fetchImpl = async (url: string) => {
      asked.push(new URL(url).hostname);
      if (url.includes("linkup"))
        return new Response(JSON.stringify({ answer: "Hours: 11-19", sources: [{ url: "https://c.com", name: "Linkup page", snippet: "s" }] }));
      return new Response("{}", { status: url.includes("tavily") ? 432 : 402 });
    };
    const out = await webSearch(req, { tavily: "t", exa: "e", linkup: "l" }, fetchImpl);
    expect(out.answer).toBe("Hours: 11-19");
    expect(out.results[0]).toMatchObject({ url: "https://c.com", title: "Linkup page", content: "s" });
    expect(asked).toEqual(["api.tavily.com", "api.exa.ai", "api.linkup.so"]);
  });
  it("throws the last one's error when every search is used up", async () => {
    const fetchImpl = async (url: string) => new Response("{}", { status: url.includes("linkup") ? 429 : 432 });
    await expect(webSearch(req, { tavily: "t", linkup: "l" }, fetchImpl)).rejects.toThrow("429");
  });
  it("says it was asked too fast when one search was, so a retry can work", async () => {
    const fetchImpl = async (url: string) => new Response("{}", { status: url.includes("tavily") ? 429 : 402 });
    await expect(webSearch(req, { tavily: "t", exa: "e" }, fetchImpl)).rejects.toMatchObject({ limit: "busy" });
  });
  it("reads Exa's 402 and Linkup's 429 as a month used up", async () => {
    const fetchImpl = async (url: string) => new Response("{}", { status: url.includes("exa") ? 402 : 429 });
    await expect(webSearch(req, { exa: "e" }, fetchImpl)).rejects.toMatchObject({ limit: "used-up" });
    await expect(webSearch(req, { linkup: "l" }, fetchImpl)).rejects.toMatchObject({ limit: "used-up" });
  });
  it("throws with no key at all", async () => {
    await expect(webSearch(req, {}, fakeApis(200).fetchImpl)).rejects.toThrow("No search key");
  });
});
