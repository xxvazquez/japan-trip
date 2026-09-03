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
