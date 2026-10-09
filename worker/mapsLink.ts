type Fetch = typeof fetch;

/** hosts a share link may hop through — nothing else is ever fetched */
const HOP = /^(maps\.app\.goo\.gl|goo\.gl|(www\.|maps\.)?google\.[a-z.]+|consent\.google\.[a-z.]+)$/i;
const isMapsPage = (u: URL) => /(^|\.)google\.[a-z.]+$/i.test(u.hostname) && !u.hostname.startsWith("consent.") && u.pathname.startsWith("/maps");

/**
 * Follow a Google Maps share link (`maps.app.goo.gl/…`) to the full link it
 * stands for, which carries the place's name and position. The browser
 * can't — the redirect has no CORS headers. Only the redirect headers are
 * read, never a page: a cookie wall on the way (`consent.google.com`) names
 * the real link in its `continue`.
 */
export async function handleMapsLink(url: URL, _keys?: unknown, fetchImpl: Fetch = fetch): Promise<Response> {
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
  let at: URL;
  try {
    at = new URL(url.searchParams.get("url") ?? "");
  } catch {
    return json({ error: "url is required" }, 400);
  }
  for (let hop = 0; hop < 6; hop++) {
    if (at.protocol !== "https:" || !HOP.test(at.hostname)) break;
    if (isMapsPage(at)) return json({ url: at.href });
    if (at.hostname.startsWith("consent.")) {
      const next = at.searchParams.get("continue");
      if (!next) break;
      at = new URL(next);
      continue;
    }
    const res = await fetchImpl(at.href, { redirect: "manual", headers: { "User-Agent": "Mozilla/5.0" } });
    const loc = res.headers.get("location");
    if (!loc) break;
    at = new URL(loc, at);
  }
  return json({ error: "Not a Google Maps place link" }, 422);
}
