/**
 * The note format: a small slice of Markdown, plus two additions of our own.
 * It's what every note is stored as (one plain text column), what <Markdown>
 * renders and what the note editor reads and writes.
 *
 *   **bold**  *italic* (or _italic_)  ++underline++  ~~strike~~  `code`
 *   [text](url)  bare https:// links
 *   # / ## / ### headings — `## Title {folded}` is a heading folded shut
 *   - bullets  1. numbers  - [ ] / - [x] checklist items, nested by indent
 *   > callout lines   ---  rule
 *   {purple}coloured text{/}  — one of NOTE_COLORS
 *   \* etc. — a backslash keeps a marker character literal
 *
 * `parseNote` turns text into blocks of inline nodes; `docFromNote` /
 * `noteFromDoc` convert to and from the editor's document JSON. Writing a
 * document back always produces text `parseNote` reads the same way.
 */

export const NOTE_COLORS = ["purple", "pink", "orange", "mint", "blue"] as const;
export type NoteColor = (typeof NOTE_COLORS)[number];
const isColor = (s: string): s is NoteColor => (NOTE_COLORS as readonly string[]).includes(s);

export type Inline =
  | { t: "text"; s: string }
  | { t: "br" }
  | { t: "code"; s: string }
  | { t: "b" | "i" | "u" | "s"; kids: Inline[] }
  | { t: "color"; c: NoteColor; kids: Inline[] }
  | { t: "link"; href: string; kids: Inline[] };

export type ListItem = { kids: Inline[]; line: number; checked?: boolean; sub?: List };
export type List = { t: "ul" | "ol"; start: number; items: ListItem[] };
export type Block =
  | { t: "h"; level: number; kids: Inline[]; folded: boolean; line: number }
  | { t: "p"; kids: Inline[] }
  | { t: "quote"; blocks: Block[] }
  | List
  | { t: "hr" };

/* ------------------------------------------------------------------ *
 * Blocks
 * ------------------------------------------------------------------ */

const LIST_ITEM = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/;
const HEADING = /^(#{1,3})\s+(.*?)(\s+\{folded\})?\s*$/;
const RULE = /^\s*(-{3,}|\*{3,}|_{3,})\s*$/;
const QUOTE = /^\s*>\s?/;
const BLANK = /^\s*$/;
const indentOf = (ws: string) => ws.replace(/\t/g, "    ").length;

export function parseNote(text: string): Block[] {
  return parseBlocks(text.replace(/\r\n?/g, "\n").split("\n"), 0);
}

/** Lines → blocks. `base` is the line number of `lines[0]` in the whole
 *  note, so a checklist item or heading can report its own source line. */
function parseBlocks(lines: string[], base: number): Block[] {
  const out: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (BLANK.test(line)) { i++; continue; }

    const h = line.match(HEADING);
    if (h) {
      out.push({ t: "h", level: h[1].length, kids: parseInline(h[2].trim()), folded: !!h[3], line: base + i });
      i++;
      continue;
    }
    if (RULE.test(line)) { out.push({ t: "hr" }); i++; continue; }
    if (QUOTE.test(line)) {
      const start = i;
      const inner: string[] = [];
      while (i < lines.length && QUOTE.test(lines[i])) { inner.push(lines[i].replace(QUOTE, "")); i++; }
      out.push({ t: "quote", blocks: parseBlocks(inner, base + start) });
      continue;
    }
    if (LIST_ITEM.test(line)) {
      const { list, next } = parseList(lines, i, base);
      out.push(list);
      i = next;
      continue;
    }
    const para: string[] = [];
    while (
      i < lines.length &&
      !BLANK.test(lines[i]) &&
      !HEADING.test(lines[i]) &&
      !RULE.test(lines[i]) &&
      !QUOTE.test(lines[i]) &&
      !LIST_ITEM.test(lines[i])
    ) { para.push(lines[i]); i++; }
    out.push({ t: "p", kids: parseInline(para.join("\n")) });
  }
  return out;
}

/** One list from line `i`, with its nested lists. An item indented past its
 *  list's own indent nests under the item above it, as in Markdown. So do
 *  bullets written straight under a numbered step with no indent at all
 *  (`2. Try a snack` then `- Senbei`) — the way a step's sub-points get
 *  typed on a phone, where indenting means typing spaces. An indented line
 *  that isn't an item carries on the item above (a line break inside it).
 *  Any other line ends the list, as does a blank line not followed by more
 *  of the list. */
function parseList(lines: string[], i: number, base: number, sameIndentBullets = false): { list: List; next: number } {
  const first = lines[i].match(LIST_ITEM)!;
  const indent = indentOf(first[1]);
  const t = /\d/.test(first[2]) ? "ol" : "ul";
  const list: List = { t, start: t === "ol" ? parseInt(first[2], 10) || 1 : 1, items: [] };
  const raws: string[] = [];
  const continues = (m: RegExpMatchArray) => {
    const ind = indentOf(m[1]);
    const kind = /\d/.test(m[2]) ? "ol" : "ul";
    return ind > indent || (ind === indent && (kind === t || (t === "ol" && !sameIndentBullets)));
  };
  while (i < lines.length) {
    // a blank line only ends the list if what follows doesn't carry it on —
    // so steps 1–2, a few bullets, then 3–4 stay one list however spaced
    if (BLANK.test(lines[i])) {
      let j = i;
      while (j < lines.length && BLANK.test(lines[j])) j++;
      const after = j < lines.length ? lines[j].match(LIST_ITEM) : null;
      if (!list.items.length || !after || !continues(after)) break;
      i = j;
      continue;
    }
    const m = lines[i].match(LIST_ITEM);
    const last = list.items[list.items.length - 1];
    if (!m) {
      // an indented plain line continues the item above
      const ws = lines[i].match(/^\s*/)![0];
      if (last && !last.sub && indentOf(ws) > indent && !HEADING.test(lines[i].trim()) && !QUOTE.test(lines[i])) {
        raws[raws.length - 1] += "\n" + lines[i].trim();
        i++;
        continue;
      }
      break;
    }
    const ind = indentOf(m[1]);
    const kind = /\d/.test(m[2]) ? "ol" : "ul";
    if (ind < indent) break;
    if (last && !last.sub && (ind > indent || (t === "ol" && kind === "ul" && !sameIndentBullets))) {
      const nested = parseList(lines, i, base, ind === indent);
      last.sub = nested.list;
      i = nested.next;
      continue;
    }
    if (ind > indent || kind !== t) break;
    const raw = m[3];
    const box = t === "ul" ? raw.match(/^\[([ xX])\](?:\s+(.*))?$/) : null;
    if (box) {
      list.items.push({ kids: [], line: base + i, checked: /x/i.test(box[1]) });
      raws.push(box[2] ?? "");
    } else {
      list.items.push({ kids: [], line: base + i });
      raws.push(raw);
    }
    i++;
  }
  list.items.forEach((it, k) => { it.kids = parseInline(raws[k]); });
  return { list, next: i };
}

/* ------------------------------------------------------------------ *
 * Inline
 * ------------------------------------------------------------------ */

/** The url part allows one level of balanced parens inside it — real links
 *  often carry them (a Wikipedia page, a "#:~:text=…(¥400)…" fragment). */
const BALANCED_URL = "(?:[^\\s()<]|\\([^\\s()]*\\))+";
const LINK = new RegExp(`\\[([^\\]\\n]+)\\]\\((${BALANCED_URL})\\)`, "y");
const BARE_URL = new RegExp(`https?:\\/\\/${BALANCED_URL}`, "y");
const BARE_URL_G = new RegExp(`https?:\\/\\/${BALANCED_URL}`, "g");
const COLOR_OPEN = /\{([a-z]+)\}/y;
const ESCAPABLE = "\\*_~+{}[]`#>-.!";
const alnum = (ch: string | undefined) => !!ch && /[\p{L}\p{N}]/u.test(ch);

/** Index of the closing `delim` for a span whose content starts at `from`,
 *  on the same line, skipping escaped characters; -1 if there isn't one. */
function findClose(src: string, from: number, delim: string, ok: (at: number) => boolean = () => true): number {
  for (let j = from; j < src.length; j++) {
    const ch = src[j];
    if (ch === "\n") return -1;
    if (ch === "\\") { j++; continue; }
    if (src.startsWith(delim, j) && j > from && ok(j)) return j;
  }
  return -1;
}

/** The `{/}` closing a colour opened just before `from`, minding nested
 *  colours; -1 if there isn't one. */
function findColorClose(src: string, from: number): number {
  let depth = 0;
  for (let j = from; j < src.length; j++) {
    if (src[j] === "\\") { j++; continue; }
    if (src.startsWith("{/}", j)) {
      if (depth === 0) return j > from ? j : -1;
      depth--;
      j += 2;
      continue;
    }
    COLOR_OPEN.lastIndex = j;
    const m = COLOR_OPEN.exec(src);
    if (m && isColor(m[1])) { depth++; j += m[0].length - 1; }
  }
  return -1;
}

export function parseInline(src: string): Inline[] {
  const out: Inline[] = [];
  let buf = "";
  const flush = () => { if (buf) { out.push({ t: "text", s: buf }); buf = ""; } };
  const span = (node: Inline, to: number) => { flush(); out.push(node); return to; };

  let i = 0;
  while (i < src.length) {
    const ch = src[i];
    const rest = src.slice(i);

    if (ch === "\\" && i + 1 < src.length && ESCAPABLE.includes(src[i + 1])) { buf += src[i + 1]; i += 2; continue; }
    if (ch === "\n") { flush(); out.push({ t: "br" }); i++; continue; }

    if (ch === "`") {
      const j = src.indexOf("`", i + 1);
      if (j > i + 1 && !src.slice(i + 1, j).includes("\n")) { i = span({ t: "code", s: src.slice(i + 1, j) }, j + 1); continue; }
    }

    if (ch === "{") {
      COLOR_OPEN.lastIndex = i;
      const m = COLOR_OPEN.exec(src);
      if (m && isColor(m[1])) {
        const from = i + m[0].length;
        const j = findColorClose(src, from);
        if (j > 0) { i = span({ t: "color", c: m[1], kids: parseInline(src.slice(from, j)) }, j + 3); continue; }
      }
    }

    if (ch === "[") {
      LINK.lastIndex = i;
      const m = LINK.exec(src);
      if (m) { i = span({ t: "link", href: m[2], kids: parseInline(m[1]) }, i + m[0].length); continue; }
    }

    if ((ch === "h" || ch === "H") && !alnum(src[i - 1])) {
      BARE_URL.lastIndex = i;
      const m = BARE_URL.exec(src);
      if (m) { i = span({ t: "link", href: m[0], kids: [{ t: "text", s: m[0] }] }, i + m[0].length); continue; }
    }

    // **bold** — when `*`s run three deep the closer is the last two, so an
    // italic ending where the bold does (`**a *b***`) closes inside it
    if (rest.startsWith("**") && src[i + 2] !== " ") {
      const j = findClose(src, i + 2, "**", (at) => src[at + 2] !== "*");
      if (j > 0) { i = span({ t: "b", kids: parseInline(src.slice(i + 2, j)) }, j + 2); continue; }
    }
    if (rest.startsWith("__") && src[i + 2] !== " ") {
      const j = findClose(src, i + 2, "__");
      if (j > 0) { i = span({ t: "b", kids: parseInline(src.slice(i + 2, j)) }, j + 2); continue; }
    }
    if (rest.startsWith("~~") && src[i + 2] !== " ") {
      const j = findClose(src, i + 2, "~~");
      if (j > 0) { i = span({ t: "s", kids: parseInline(src.slice(i + 2, j)) }, j + 2); continue; }
    }
    if (rest.startsWith("++") && src[i + 2] !== " ") {
      const j = findClose(src, i + 2, "++");
      if (j > 0) { i = span({ t: "u", kids: parseInline(src.slice(i + 2, j)) }, j + 2); continue; }
    }
    if (ch === "*" && src[i + 1] !== " " && src[i + 1] !== "*") {
      const j = findClose(src, i + 1, "*");
      if (j > 0) { i = span({ t: "i", kids: parseInline(src.slice(i + 1, j)) }, j + 1); continue; }
    }
    // _italic_ only at a word's edge, so snake_case stays as typed
    if (ch === "_" && !alnum(src[i - 1]) && src[i + 1] !== " " && src[i + 1] !== "_") {
      const j = findClose(src, i + 1, "_", (at) => !alnum(src[at + 1]));
      if (j > 0) { i = span({ t: "i", kids: parseInline(src.slice(i + 1, j)) }, j + 1); continue; }
    }

    buf += ch;
    i++;
  }
  flush();
  return out;
}

/** The note as plain words — for search and previews. */
export function noteToPlain(text: string): string {
  const inl = (ns: Inline[]): string =>
    ns.map((n) => (n.t === "text" || n.t === "code" ? n.s : n.t === "br" ? "\n" : inl(n.kids))).join("");
  const list = (l: List): string[] => l.items.flatMap((it) => [inl(it.kids), ...(it.sub ? list(it.sub) : [])]);
  const blocks = (bs: Block[]): string[] =>
    bs.flatMap((b) =>
      b.t === "h" || b.t === "p" ? [inl(b.kids)] : b.t === "quote" ? blocks(b.blocks) : b.t === "hr" ? [] : list(b),
    );
  return blocks(parseNote(text)).join("\n");
}

/* ------------------------------------------------------------------ *
 * Editor document  (ProseMirror JSON)
 * ------------------------------------------------------------------ */

export type PMMark = { type: string; attrs?: Record<string, unknown> };
export type PMNode = {
  type: string;
  attrs?: Record<string, unknown>;
  content?: PMNode[];
  text?: string;
  marks?: PMMark[];
};

const MARK_OF = { b: "bold", i: "italic", u: "underline", s: "strike" } as const;

function inlineToPM(ns: Inline[], marks: PMMark[] = []): PMNode[] {
  const out: PMNode[] = [];
  for (const n of ns) {
    if (n.t === "text") { if (n.s) out.push(marks.length ? { type: "text", text: n.s, marks } : { type: "text", text: n.s }); }
    else if (n.t === "br") out.push({ type: "hardBreak" });
    else if (n.t === "code") { if (n.s) out.push({ type: "text", text: n.s, marks: [...marks, { type: "code" }] }); }
    else if (n.t === "color") out.push(...inlineToPM(n.kids, [...marks, { type: "noteColor", attrs: { color: n.c } }]));
    else if (n.t === "link") out.push(...inlineToPM(n.kids, [...marks, { type: "link", attrs: { href: n.href } }]));
    else out.push(...inlineToPM(n.kids, [...marks, { type: MARK_OF[n.t] }]));
  }
  return out;
}

const para = (kids: Inline[]): PMNode => {
  const content = inlineToPM(kids);
  return content.length ? { type: "paragraph", content } : { type: "paragraph" };
};

function listToPM(l: List): PMNode[] {
  const item = (it: ListItem, type: string): PMNode => ({
    type,
    ...(type === "taskItem" ? { attrs: { checked: !!it.checked } } : {}),
    content: [para(it.kids), ...(it.sub ? listToPM(it.sub) : [])],
  });
  if (l.t === "ol") return [{ type: "orderedList", attrs: { start: l.start }, content: l.items.map((it) => item(it, "listItem")) }];
  // a bullet list may mix plain and checklist items; the editor keeps
  // those as separate lists, so split it into runs
  const out: PMNode[] = [];
  for (const it of l.items) {
    const type = it.checked === undefined ? "bulletList" : "taskList";
    const prev = out[out.length - 1];
    if (!prev || prev.type !== type) out.push({ type, content: [] });
    out[out.length - 1].content!.push(item(it, type === "taskList" ? "taskItem" : "listItem"));
  }
  return out;
}

function blocksToPM(bs: Block[]): PMNode[] {
  return bs.flatMap((b): PMNode[] => {
    switch (b.t) {
      case "h": {
        const content = inlineToPM(b.kids);
        return [{ type: "heading", attrs: { level: b.level, folded: b.folded }, ...(content.length ? { content } : {}) }];
      }
      case "p": return [para(b.kids)];
      case "hr": return [{ type: "horizontalRule" }];
      case "quote": {
        const content = blocksToPM(b.blocks);
        return [{ type: "blockquote", content: content.length ? content : [{ type: "paragraph" }] }];
      }
      default: return listToPM(b);
    }
  });
}

export function docFromNote(text: string): PMNode {
  const content = blocksToPM(parseNote(text));
  return { type: "doc", content: content.length ? content : [{ type: "paragraph" }] };
}

/* ---- document → text ---- */

// outermost first: a colour or link wraps bold, bold wraps italic, and so
// on in to code — always nesting the same way keeps the text unambiguous
const ORDER = ["noteColor", "link", "bold", "italic", "underline", "strike", "code"];
const markKey = (m: PMMark) => `${m.type}:${(m.attrs?.color as string) ?? (m.attrs?.href as string) ?? ""}`;

function openMark(m: PMMark): string {
  switch (m.type) {
    case "noteColor": return `{${m.attrs?.color}}`;
    case "link": return "[";
    case "bold": return "**";
    case "italic": return "*";
    case "underline": return "++";
    case "strike": return "~~";
    case "code": return "`";
    default: return "";
  }
}
function closeMark(m: PMMark): string {
  switch (m.type) {
    case "noteColor": return "{/}";
    case "link": return `](${m.attrs?.href})`;
    default: return openMark(m);
  }
}

/** Escape what would otherwise read as markup — leaving bare links alone,
 *  so they stay clickable. */
function escapeText(s: string): string {
  let out = "";
  let last = 0;
  BARE_URL_G.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = BARE_URL_G.exec(s))) {
    out += escapePlain(s.slice(last, m.index), s[m.index - 1]) + m[0];
    last = m.index + m[0].length;
  }
  return out + escapePlain(s.slice(last), s[last - 1]);
}
function escapePlain(s: string, before?: string): string {
  let out = "";
  for (let k = 0; k < s.length; k++) {
    const ch = s[k];
    const prev = k ? s[k - 1] : before;
    if (ch === "\\" || ch === "*" || ch === "`" || ch === "[") out += "\\" + ch;
    else if (ch === "_" && !(alnum(prev) && alnum(s[k + 1]))) out += "\\_";
    else if ((ch === "~" || ch === "+") && s[k + 1] === ch) out += "\\" + ch;
    else if (ch === "{" && /^\{(?:[a-z]+|\/)\}/.test(s.slice(k))) out += "\\{";
    else out += ch;
  }
  return out;
}

/** A line that would read as a heading, list item, callout or rule when it
 *  starts a line gets its marker escaped. */
function escapeLineStart(line: string): string {
  if (/^#{1,3}\s/.test(line) || /^>/.test(line) || /^[-+]\s/.test(line) || /^-{3,}\s*$/.test(line)) return "\\" + line;
  return line.replace(/^(\d+)([.)])(\s)/, "$1\\$2$3");
}

/** Inline content → text lines (a hard break starts a new line). */
function inlineText(nodes: PMNode[] = []): string[] {
  const lines: string[] = [];
  let cur = "";
  let stack: PMMark[] = [];
  const closeAll = () => { while (stack.length) cur += closeMark(stack.pop()!); };
  for (const n of nodes) {
    if (n.type === "hardBreak") { closeAll(); lines.push(cur); cur = ""; continue; }
    if (n.type !== "text" || !n.text) continue;
    let marks = (n.marks ?? []).filter((m) => ORDER.includes(m.type));
    marks.sort((a, b) => ORDER.indexOf(a.type) - ORDER.indexOf(b.type));
    // a link whose text is its own address is written bare
    const link = marks.find((m) => m.type === "link");
    const bareLink = !!link && marks.length === 1 && n.text === link.attrs?.href && /^https?:\/\//i.test(n.text);
    if (bareLink) marks = [];
    const code = marks.some((m) => m.type === "code");
    let k = 0;
    while (k < stack.length && k < marks.length && markKey(stack[k]) === markKey(marks[k])) k++;
    while (stack.length > k) cur += closeMark(stack.pop()!);
    for (const m of marks.slice(k)) { cur += openMark(m); stack.push(m); }
    cur += bareLink ? n.text : code ? n.text.replace(/`/g, "'") : escapeText(n.text);
  }
  closeAll();
  lines.push(cur);
  return lines;
}

function inlineBlock(nodes?: PMNode[]): string[] {
  return inlineText(nodes).map(escapeLineStart);
}

function listText(node: PMNode, indent: string): string[] {
  const out: string[] = [];
  let n = (node.attrs?.start as number) || 1;
  for (const item of node.content ?? []) {
    const marker =
      node.type === "orderedList" ? `${n++}. ` : node.type === "taskList" ? `- [${item.attrs?.checked ? "x" : " "}] ` : "- ";
    const pad = indent + " ".repeat(node.type === "taskList" ? 2 : marker.length);
    let first = true;
    for (const child of item.content ?? []) {
      if (child.type === "paragraph" || child.type === "heading") {
        const lines = inlineText(child.content);
        lines.forEach((l, k) => {
          if (first && k === 0) out.push(indent + marker + l);
          else if (l) out.push(pad + escapeLineStart(l));
        });
        first = false;
      } else if (/List$/.test(child.type)) {
        if (first) { out.push(indent + marker.trimEnd()); first = false; }
        out.push(...listText(child, pad));
      } else {
        // anything else nested in an item (a callout, a rule) reads as text
        for (const l of blocksText([child])) if (l) out.push(pad + l);
      }
    }
    if (first) out.push(indent + marker.trimEnd());
  }
  return out;
}

/** Blocks → lines, a blank line between blocks. */
function blocksText(nodes: PMNode[] = []): string[] {
  const chunks: string[][] = [];
  for (const node of nodes) {
    switch (node.type) {
      case "paragraph": {
        const lines = inlineBlock(node.content);
        if (lines.some((l) => l.trim())) chunks.push(lines);
        break;
      }
      case "heading": {
        const text = inlineText(node.content).join(" ").trim();
        if (text) chunks.push([`${"#".repeat((node.attrs?.level as number) || 2)} ${text}${node.attrs?.folded ? " {folded}" : ""}`]);
        break;
      }
      case "horizontalRule": chunks.push(["---"]); break;
      case "blockquote": {
        const inner = blocksText(node.content);
        if (inner.some((l) => l.trim())) chunks.push(inner.map((l) => (l ? `> ${l}` : ">")));
        break;
      }
      case "bulletList":
      case "orderedList":
      case "taskList":
        chunks.push(listText(node, ""));
        break;
    }
  }
  return chunks.flatMap((c, k) => (k ? ["", ...c] : c));
}

export function noteFromDoc(doc: PMNode): string {
  return blocksText(doc.content).join("\n").replace(/\n{3,}/g, "\n\n").trim();
}
