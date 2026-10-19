/**
 * Printer's punctuation for a guide's text, applied once as it loads so
 * every string reads the same however it was typed: curly quotes and
 * apostrophes (“ ” ‘ ’) instead of straight ones, and a number held to its
 * unit with a no-break space, so "486 m" never ends one line and starts the
 * next. Addresses, photo files and in-guide references are left alone.
 */

const KEEP = new Set(["url", "src", "related", "ref", "id", "query"]);

/** one string, set */
export function typeset(s: string): string {
  return (
    s
      // an opening quote follows a space, a bracket or a dash — or the
      // start of bold or italics that does (**"…"**)
      .replace(/(^|[\s([{—–])(\*{0,2})"/g, "$1$2“")
      .replace(/"/g, "”")
      // ’70 — a quote before a digit is an elision, not an opening
      .replace(/'(?=\d)/g, "’")
      .replace(/(^|[\s([{—–])(\*{0,2})'(?=\S)/g, "$1$2‘")
      .replace(/'/g, "’")
      .replace(/(\d) (?=(?:m|km|cm|mm|kg|g|ha|°C)(?![\p{L}\d]))/gu, "$1 ")
  );
}

/** a whole guide, every readable string in it set */
export function typesetAll<T>(v: T, key = ""): T {
  if (typeof v === "string") return (KEEP.has(key) ? v : typeset(v)) as T;
  if (Array.isArray(v)) return v.map((x) => typesetAll(x, key)) as T;
  if (v && typeof v === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, x] of Object.entries(v)) out[k] = typesetAll(x, k);
    return out as T;
  }
  return v;
}
