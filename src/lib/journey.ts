/** A journey's name is stored as one string ("Old town → home"). The Journey
 *  screen edits it as separate "from" and "to" fields and supplies the arrow
 *  itself, so these split and rejoin the stored label. Splitting on the first
 *  separator only keeps a multi-hop label ("A → B → C") lossless when the
 *  "to" side is left untouched. */

const SEPARATOR = /\s*(?:→|➜|➔|⟶|->|—|–)\s*|\s+-\s+/;

export function splitRoute(label: string): { from: string; to: string } {
  const m = label.match(SEPARATOR);
  if (!m || m.index === undefined) return { from: label.trim(), to: "" };
  return {
    from: label.slice(0, m.index).trim(),
    to: label.slice(m.index + m[0].length).trim(),
  };
}

export function joinRoute(from: string, to: string): string {
  const f = from.trim();
  const t = to.trim();
  return f && t ? `${f} → ${t}` : f || t;
}
