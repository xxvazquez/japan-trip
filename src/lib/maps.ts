/** Turn a free-text place or a pasted Google Maps URL into a link that opens
 *  Google Maps (app or web). Works offline via the native hand-off. */
export function gmapsLink(input?: string): string | undefined {
  if (!input) return undefined;
  const s = input.trim();
  if (/^https?:\/\//i.test(s)) return s;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s)}`;
}

export function gmapsDirections(from: string, to: string): string {
  return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(from)}&destination=${encodeURIComponent(to)}`;
}

/** Pull a `[lat, lng]` out of a pasted Google Maps URL, if it carries one.
 *  Handles the common shapes — `@lat,lng,zoom`, `!3dlat!4dlng`, and a
 *  `q=`/`query=`/`ll=`/`destination=` coordinate pair. Returns null for a
 *  short link (`maps.app.goo.gl/…`) or a plain place name — there's nothing
 *  to parse without a network round-trip. */
export function mapUrlCoords(url?: string): [number, number] | null {
  if (!url) return null;
  const pat = [
    /@(-?\d{1,3}\.\d+),(-?\d{1,3}\.\d+)/,
    /!3d(-?\d{1,3}\.\d+)!4d(-?\d{1,3}\.\d+)/,
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
