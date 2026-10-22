/** Turn a free-text place or a pasted Google Maps URL into a link that opens
 *  Google Maps (app or web). Works offline via the native hand-off. */
export function gmapsLink(input?: string): string | undefined {
  if (!input) return undefined;
  const s = input.trim();
  if (/^https?:\/\//i.test(s)) return s;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s)}`;
}

/** A map pin's Google Maps link: its own pasted link when it has one, else
 *  its name searched around its coordinates — a name alone opens whichever
 *  branch of a chain is nearest the phone, not the one on the trip. */
export function placeMapLink(place?: { name: string; lat: number; lng: number; url?: string }): string | undefined {
  if (!place) return undefined;
  if (place.url?.trim()) return gmapsLink(place.url);
  const located = Number.isFinite(place.lat) && Number.isFinite(place.lng) && !(place.lat === 0 && place.lng === 0);
  const name = place.name.trim();
  if (!located) return gmapsLink(name);
  return `https://www.google.com/maps/search/${encodeURIComponent(name || `${place.lat},${place.lng}`)}/@${place.lat},${place.lng},17z`;
}

/** Google Maps directions with a travel mode — the app/web picks the best
 *  route itself (lines, transfers, timings), which is the part this app has
 *  no free API for. Endpoints are `lat,lng` or a place name; without an
 *  `origin`, Google starts from wherever you are; without a `mode`, Google
 *  picks the traveller's usual one. */
export function gmapsRoute(origin: string | undefined, destination: string, mode?: "transit" | "walking"): string {
  const from = origin ? `&origin=${encodeURIComponent(origin)}` : "";
  const by = mode ? `&travelmode=${mode}` : "";
  return `https://www.google.com/maps/dir/?api=1${from}&destination=${encodeURIComponent(destination)}${by}`;
}

/** Pull a `[lat, lng]` out of a pasted Google Maps URL, if it carries one.
 *  Handles the common shapes — `@lat,lng,zoom`, `!3dlat!4dlng`, and a
 *  `q=`/`query=`/`ll=`/`destination=` coordinate pair. Returns null for a
 *  short link (`maps.app.goo.gl/…`) or a plain place name — there's nothing
 *  to parse without a network round-trip. */
export function mapUrlCoords(url?: string): [number, number] | null {
  if (!url) return null;
  const pat = [
    // the place's own position before `@`, which is only where the map was
    /!3d(-?\d{1,3}\.\d+)!4d(-?\d{1,3}\.\d+)/,
    /@(-?\d{1,3}\.\d+),(-?\d{1,3}\.\d+)/,
    /[?&](?:q|query|ll|destination|center)=(-?\d{1,3}\.\d+),\s*(-?\d{1,3}\.\d+)/,
  ];
  for (const re of pat) {
    const m = url.match(re);
    if (m) {
      const lat = Number(m[1]);
      const lng = Number(m[2]);
      if (Math.abs(lat) <= 90 && Math.abs(lng) <= 180) return [lat, lng];
    }
  }
  return null;
}

/** The Google Maps link in something pasted — a share often has the
 *  place's name before it, which comes back as `hint`. */
export function findMapsLink(text: string): { link: string; hint: string } | null {
  const m = text.match(/https?:\/\/(?:maps\.app\.goo\.gl|goo\.gl\/maps|(?:www\.|maps\.)?google\.[a-z.]+\/maps)\S*/i);
  if (!m) return null;
  return { link: m[0], hint: text.replace(m[0], " ").replace(/\s+/g, " ").trim() };
}

/** A pasted Google Maps place link read into a name and position — for a
 *  place OpenStreetMap doesn't have. Null when the text isn't such a link;
 *  `at` is null when the link names a place but carries no coordinates.
 *  A search link (`/maps/search/…`, `?q=`) often reads "Name, address",
 *  so the address comes back on its own to place it by. */
export function mapsLinkPlace(text: string): { name: string; address?: string; at: [number, number] | null } | null {
  const s = text.trim();
  let url: URL;
  try {
    url = new URL(s);
  } catch {
    return null;
  }
  if (!/(^|\.)google\.[a-z.]+$/i.test(url.hostname) || !/^\/maps/.test(url.pathname)) return null;
  const decode = (v: string) => {
    try {
      return decodeURIComponent(v.replace(/\+/g, " ")).trim();
    } catch {
      return v.trim();
    }
  };
  const at = mapUrlCoords(s);
  const fromPath = url.pathname.match(/\/maps\/place\/([^/@]+)/)?.[1];
  if (fromPath) return { name: decode(fromPath), at };
  const searched = decode(url.pathname.match(/\/maps\/search\/([^/@]+)/)?.[1] ?? "");
  const query = (url.searchParams.get("q") ?? url.searchParams.get("query") ?? "").trim();
  const said = searched || query;
  // a coordinate pair or a place id isn't a name
  if (!said || /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/.test(said) || /^place_id:/i.test(said)) return { name: "", at };
  const [name, ...rest] = said.split(/\s*,\s*/);
  const address = rest.join(", ");
  return address ? { name, address, at } : { name, at };
}

/** Send a place to someone (or yourself): the Share sheet where the browser
 *  has one, else its name and map link onto the clipboard. Resolves true
 *  only when it was copied, so the button can say so. */
export async function sharePlace(name: string, url?: string, detail?: string): Promise<boolean> {
  const text = [name, detail].filter(Boolean).join("\n");
  if (navigator.share) {
    try { await navigator.share({ title: name, text, url }); } catch { /* closed the sheet */ }
    return false;
  }
  const { copyText } = await import("./clipboard");
  return copyText([text, url].filter(Boolean).join("\n"));
}

/** A web search for a place with no website of its own — for its hours,
 *  tickets and photos. The town keeps a common name from matching elsewhere. */
export const webSearchHref = (name: string, town?: string) =>
  `https://www.google.com/search?q=${encodeURIComponent([name, town].filter(Boolean).join(" "))}`;
