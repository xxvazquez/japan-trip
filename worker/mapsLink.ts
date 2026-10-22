type Fetch = typeof fetch;

/** hosts a share link may hop through — nothing else is ever fetched */
const HOP = /^(maps\.app\.goo\.gl|goo\.gl|(www\.|maps\.)?google\.[a-z.]+|consent\.google\.[a-z.]+)$/i;
const isMapsPage = (u: URL) =>
  /^maps\.google\.[a-z.]+$/i.test(u.hostname) || (/(^|\.)google\.[a-z.]+$/i.test(u.hostname) && !u.hostname.startsWith("consent.") && u.pathname.startsWith("/maps"));
/** the link itself says where the place is (`!3d…!4d…` or `@lat,lng`) and
 *  what it's called (`/maps/place/<name>`) — nothing to read off its page */
const complete = (u: string) => /!3d-?\d|@-?\d{1,3}\.\d+,-?\d{1,3}\.\d+/.test(u) && /\/maps\/place\/[^/@?]/.test(u);
/** skips Google's cookie wall, so the place page itself comes back */
const CONSENT = "SOCS=CAI; CONSENT=YES+";

/** The place's position from its Google Maps page: the preview map in its
 *  `og:image` is centred on it, and so is the map the page opens on. */
export function pageCoords(html: string): [number, number] | null {
  const m = html.match(/staticmap\?[^"']*?center=(-?\d{1,3}\.\d+)(?:%2C|,)(-?\d{1,3}\.\d+)/i);
  if (m) return valid(Number(m[1]), Number(m[2]));
  // the opening view is [zoom, lng, lat]
  const view = html.match(/APP_INITIALIZATION_STATE=\[\[\[-?[\d.]+,(-?\d{1,3}\.\d+),(-?\d{1,3}\.\d+)\]/);
  return view ? valid(Number(view[2]), Number(view[1])) : null;
}
/** The place's name from its page — `og:title` reads "Name · address". */
export function pageName(html: string): string | null {
  const m = html.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:title"/i) ?? html.match(/<meta[^>]+property="og:title"[^>]+content="([^"]+)"/i);
  const name = m && decodeEntities(m[1]).split(" · ")[0].trim();
  return name && !/^google maps$/i.test(name) ? name : null;
}
const decodeEntities = (t: string) =>
  t.replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d))).replace(/&#x([\da-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");

const valid = (lat: number, lng: number): [number, number] | null =>
  Math.abs(lat) <= 90 && Math.abs(lng) <= 180 && !(lat === 0 && lng === 0) ? [lat, lng] : null;

/**
 * Follow a Google Maps share link (`maps.app.goo.gl/…`) to the full link it
 * stands for, which carries the place's name and usually its position. The
 * browser can't — the redirect has no CORS headers. A cookie wall on the
 * way (`consent.google.com`) names the real link in its `continue`. When
 * the full link doesn't say where the place is (the phone app's shares
 * often don't), or names only its address, its page is read for the
 * position (`at`) and the place's own name (`name`).
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
  let found: string | null = null;
  for (let hop = 0; hop < 6; hop++) {
    if (at.protocol !== "https:" || !HOP.test(at.hostname)) break;
    if (isMapsPage(at)) {
      found ??= at.href;
      if (complete(at.href)) return json({ url: at.href });
    }
    if (at.hostname.startsWith("consent.")) {
      const next = at.searchParams.get("continue");
      if (!next) break;
      at = new URL(next);
      continue;
    }
    const res = await fetchImpl(at.href, {
      redirect: "manual",
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36", "Accept-Language": "en", Cookie: CONSENT },
    });
    const loc = res.headers.get("location");
    if (loc) {
      at = new URL(loc, at);
      continue;
    }
    if (found && res.ok) {
      const html = await res.text();
      const coords = pageCoords(html);
      const name = pageName(html);
      return json({ url: found, ...(coords && { at: coords }), ...(name && { name }) });
    }
    break;
  }
  return found ? json({ url: found }) : json({ error: "Not a Google Maps place link" }, 422);
}
