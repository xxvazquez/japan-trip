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

/** Normalise a Google "My Maps" link into its embeddable form (…/maps/d/embed?mid=…). */
export function myMapEmbed(url?: string): string | undefined {
  if (!url) return undefined;
  const mid = url.match(/[?&]mid=([^&]+)/)?.[1];
  if (mid) return `https://www.google.com/maps/d/embed?mid=${mid}`;
  if (/\/maps\/d\/(embed|edit|viewer)/.test(url)) return url.replace("/maps/d/edit", "/maps/d/embed").replace("/maps/d/viewer", "/maps/d/embed");
  return undefined;
}
