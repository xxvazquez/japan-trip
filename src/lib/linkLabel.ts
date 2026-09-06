/** A short, human label for a link. Names the services this app actually sees
 *  (mostly map links — "google.com" tells you nothing); otherwise the bare
 *  host without "www". Falls back to a trimmed copy of the raw string when it
 *  isn't a parseable URL. Shared by <Editable> (link fields) and <Markdown>
 *  (bare URLs in a note). */
export function linkLabel(v: string): string {
  try {
    const u = new URL(v);
    const host = u.hostname.replace(/^www\./, "");
    const isGmaps =
      (/(^|\.)google\.[a-z.]+$/.test(host) && u.pathname.startsWith("/maps")) ||
      host === "maps.app.goo.gl" ||
      host === "g.page" ||
      (host === "goo.gl" && u.pathname.startsWith("/maps"));
    if (isGmaps) return "Google Maps";
    if (host === "maps.apple.com") return "Apple Maps";
    return host;
  } catch {
    return v.length > 30 ? v.slice(0, 30) + "…" : v;
  }
}
