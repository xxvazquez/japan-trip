/** One web search, asked of Tavily first, then Exa, then Linkup — each one
 *  only when the one before can't answer (its month's searches used up, or
 *  no key). All three have a free monthly allowance; with every key set, a
 *  month gets them all. */

const TAVILY = "https://api.tavily.com/search";
const EXA_SEARCH = "https://api.exa.ai/search";
const EXA_ANSWER = "https://api.exa.ai/answer";
const LINKUP = "https://api.linkup.so/v1/search";

type Fetch = (url: string, init?: RequestInit) => Promise<Response>;

/** the server's search keys — either can be missing */
export type SearchKeys = { tavily?: string; exa?: string; linkup?: string };
export type SearchHit = { url: string; title: string; content?: string };
export type SearchRequest = {
  query: string;
  /** a written summary of what the pages say, besides the pages */
  answer?: boolean;
  /** only pages on these sites */
  domains?: string[];
  max: number;
  timeout: number;
};

export const hasSearchKey = (keys: SearchKeys) => !!(keys.tavily || keys.exa || keys.linkup);

async function tavily(req: SearchRequest, key: string, fetchImpl: Fetch) {
  const res = await fetchImpl(TAVILY, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      query: req.query,
      search_depth: "basic",
      max_results: req.max,
      ...(req.answer && { include_answer: "advanced" }),
      ...(req.domains && { include_domains: req.domains }),
    }),
    signal: AbortSignal.timeout(req.timeout),
  });
  if (!res.ok) throw new Error(`Search answered ${res.status}`);
  const body = (await res.json()) as { answer?: string; results?: SearchHit[] };
  return { answer: body.answer, results: body.results ?? [] };
}

async function exa(req: SearchRequest, key: string, fetchImpl: Fetch) {
  const post = (url: string, body: unknown) =>
    fetchImpl(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": key },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(req.timeout),
    });
  if (req.answer) {
    const res = await post(EXA_ANSWER, { query: req.query, text: true });
    if (!res.ok) throw new Error(`Search answered ${res.status}`);
    const body = (await res.json()) as { answer?: unknown; citations?: { url: string; title?: string; text?: string }[] };
    return {
      answer: typeof body.answer === "string" ? body.answer : undefined,
      // a page's opening, about the size of Tavily's snippet — the whole
      // page would name every place it links to
      results: (body.citations ?? []).slice(0, req.max).map((c) => ({ url: c.url, title: c.title ?? "", content: c.text?.slice(0, 1500) })),
    };
  }
  const res = await post(EXA_SEARCH, { query: req.query, type: "fast", numResults: req.max, ...(req.domains && { includeDomains: req.domains }) });
  if (!res.ok) throw new Error(`Search answered ${res.status}`);
  const body = (await res.json()) as { results?: { url: string; title?: string }[] };
  return { answer: undefined, results: (body.results ?? []).map((r) => ({ url: r.url, title: r.title ?? "" })) };
}

async function linkup(req: SearchRequest, key: string, fetchImpl: Fetch) {
  const res = await fetchImpl(LINKUP, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      q: req.query,
      depth: "standard",
      outputType: req.answer ? "sourcedAnswer" : "searchResults",
      maxResults: req.max,
      ...(req.domains && { includeDomains: req.domains }),
    }),
    signal: AbortSignal.timeout(req.timeout),
  });
  if (!res.ok) throw new Error(`Search answered ${res.status}`);
  type Page = { url: string; name?: string; snippet?: string; content?: string };
  const body = (await res.json()) as { answer?: string; sources?: Page[]; results?: Page[] };
  const pages = (body.sources ?? body.results ?? []).slice(0, req.max);
  return {
    answer: typeof body.answer === "string" ? body.answer : undefined,
    results: pages.map((p) => ({ url: p.url, title: p.name ?? "", content: (p.snippet ?? p.content)?.slice(0, 1500) })),
  };
}

/** Throws when none can be asked, so a caller can tell "found nothing"
 *  from "couldn't ask" — with the last one's error, so a month used up
 *  everywhere still reads as used up. */
export async function webSearch(req: SearchRequest, keys: SearchKeys, fetchImpl: Fetch = fetch): Promise<{ answer?: string; results: SearchHit[] }> {
  const order: (() => Promise<{ answer?: string; results: SearchHit[] }>)[] = [];
  if (keys.tavily) order.push(() => tavily(req, keys.tavily!, fetchImpl));
  if (keys.exa) order.push(() => exa(req, keys.exa!, fetchImpl));
  if (keys.linkup) order.push(() => linkup(req, keys.linkup!, fetchImpl));
  if (!order.length) throw new Error("No search key is set");
  let last: unknown;
  for (const ask of order) {
    try {
      return await ask();
    } catch (e) {
      last = e;
    }
  }
  throw last;
}
