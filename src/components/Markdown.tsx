import { Fragment, type ReactNode } from "react";
import { linkLabel } from "@/lib/linkLabel";
import { CheckCircle } from "./CheckCircle";
import { Icon } from "./Icon";

/**
 * A deliberately small Markdown renderer — bold, italic, underline,
 * strikethrough, inline code, links, headings, bullet / numbered lists,
 * checklist items, block quotes, rules, paragraphs. No raw HTML, no tables,
 * no images: it renders to React elements, so there is no
 * dangerouslySetInnerHTML and nothing to sanitise. Plain text renders as-is.
 *
 * A bullet written `- [ ] text` / `- [x] text` renders as a checklist row.
 * Pass `onToggleCheck` to make those rows tappable — it's called with the
 * item's source line number (into the normalised, \n-split text) so the
 * caller can flip just that line and re-commit the raw note text.
 */
export function Markdown({
  text,
  className = "",
  onToggleCheck,
}: {
  text: string;
  className?: string;
  onToggleCheck?: (line: number, checked: boolean) => void;
}) {
  const blocks = parseBlocks(text.replace(/\r\n?/g, "\n"));
  return <div className={`selectable space-y-2.5 ${className}`}>{blocks.map((b, i) => renderBlock(b, i, onToggleCheck))}</div>;
}

type ListItem = { text: string; line: number; checked?: boolean; sub?: List };
type List = { t: "ul" | "ol"; start: number; items: ListItem[] };

type Block =
  | { t: "h"; level: number; text: string }
  | { t: "p"; text: string }
  | { t: "quote"; lines: string[] }
  | List
  | { t: "hr" };

const LIST_ITEM = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/;
const indentOf = (ws: string) => ws.replace(/\t/g, "    ").length;

/** One list from line `i`, with its nested lists. An item indented past its
 *  list's own indent nests under the item above it, as in Markdown. So do
 *  bullets written straight under a numbered step with no indent at all
 *  (`2. Try a snack` then `- Senbei`) — the way a step's sub-points get
 *  typed on a phone, where indenting means typing spaces. A line that
 *  isn't a list item ends it, as does a blank line not followed by more of
 *  the list. */
function parseList(lines: string[], i: number, sameIndentBullets = false): { list: List; next: number } {
  const first = lines[i].match(LIST_ITEM)!;
  const indent = indentOf(first[1]);
  const t = /\d/.test(first[2]) ? "ol" : "ul";
  const list: List = { t, start: t === "ol" ? parseInt(first[2], 10) || 1 : 1, items: [] };
  // whether a list line belongs to this list (or nests in it)
  const continues = (m: RegExpMatchArray) => {
    const ind = indentOf(m[1]);
    const kind = /\d/.test(m[2]) ? "ol" : "ul";
    return ind > indent || (ind === indent && (kind === t || (t === "ol" && !sameIndentBullets)));
  };
  while (i < lines.length) {
    // a blank line only ends the list if what follows doesn't carry it on —
    // so steps 1–2, a few bullets, then 3–4 stay one list however spaced
    if (/^\s*$/.test(lines[i])) {
      let j = i;
      while (j < lines.length && /^\s*$/.test(lines[j])) j++;
      const after = j < lines.length ? lines[j].match(LIST_ITEM) : null;
      if (!list.items.length || !after || !continues(after)) break;
      i = j;
      continue;
    }
    const m = lines[i].match(LIST_ITEM);
    if (!m) break;
    const ind = indentOf(m[1]);
    const kind = /\d/.test(m[2]) ? "ol" : "ul";
    const last = list.items[list.items.length - 1];
    if (ind < indent) break;
    if (last && !last.sub && (ind > indent || (t === "ol" && kind === "ul" && !sameIndentBullets))) {
      const nested = parseList(lines, i, ind === indent);
      last.sub = nested.list;
      i = nested.next;
      continue;
    }
    if (ind > indent || kind !== t) break;
    const raw = m[3];
    const box = t === "ul" ? raw.match(/^\[([ xX])\]\s*(.*)$/) : null;
    list.items.push(box ? { text: box[2], line: i, checked: /x/i.test(box[1]) } : { text: raw, line: i });
    i++;
  }
  return { list, next: i };
}

function parseBlocks(src: string): Block[] {
  const lines = src.split("\n");
  const out: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (/^\s*$/.test(line)) { i++; continue; }

    const h = line.match(/^(#{1,3})\s+(.*)$/);
    if (h) { out.push({ t: "h", level: h[1].length, text: h[2].trim() }); i++; continue; }

    if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) { out.push({ t: "hr" }); i++; continue; }

    if (/^\s*>\s?/.test(line)) {
      const lines2: string[] = [];
      while (i < lines.length && /^\s*>\s?/.test(lines[i])) { lines2.push(lines[i].replace(/^\s*>\s?/, "")); i++; }
      out.push({ t: "quote", lines: lines2 });
      continue;
    }

    if (LIST_ITEM.test(line)) {
      const { list, next } = parseList(lines, i);
      out.push(list);
      i = next;
      continue;
    }

    const para: string[] = [];
    while (
      i < lines.length &&
      !/^\s*$/.test(lines[i]) &&
      !/^(#{1,3})\s+/.test(lines[i]) &&
      !/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(lines[i]) &&
      !/^\s*>\s?/.test(lines[i]) &&
      !/^\s*[-*+]\s+/.test(lines[i]) &&
      !/^\s*\d+[.)]\s+/.test(lines[i])
    ) { para.push(lines[i]); i++; }
    out.push({ t: "p", text: para.join("\n") });
  }

  return out;
}

function renderBlock(b: Block, key: number, onToggleCheck?: (line: number, checked: boolean) => void): ReactNode {
  switch (b.t) {
    case "h": {
      // sized in em so a heading tracks the note's own prose size (.note);
      // semibold (not the old serif) is what sets it apart from the prose now
      const cls = b.level === 1 ? "text-[1.15em]" : b.level === 2 ? "text-[1.05em]" : "text-[0.95em]";
      return <p key={key} className={`font-semibold leading-snug text-ink ${cls}`}>{inline(b.text)}</p>;
    }
    case "hr":
      return <hr key={key} className="border-line" />;
    case "quote":
      return (
        <blockquote key={key} className="border-l-2 border-line pl-3 text-ink-soft">
          {withBreaks(b.lines.join("\n"))}
        </blockquote>
      );
    case "ul":
    case "ol":
      return renderList(b, key, 0, onToggleCheck);
    default:
      return <p key={key} className="leading-relaxed">{withBreaks(b.text)}</p>;
  }
}

/** A list and its nested lists. A nested list sits in its parent item's
 *  text column, so it indents under the words, not the marker; nested
 *  bullets are hollow, as Notes draws a second level. */
function renderList(b: List, key: number, depth: number, onToggleCheck?: (line: number, checked: boolean) => void): ReactNode {
  const nested = depth > 0 ? "mt-1" : "";
  const sub = (it: ListItem) => it.sub && renderList(it.sub, 0, depth + 1, onToggleCheck);
  if (b.t === "ol") {
    return (
      <ol key={key} className={`space-y-1 ${nested}`}>
        {b.items.map((it, j) => (
          <li key={it.line} className="flex gap-2">
            <span className="shrink-0 tabular-nums text-ink-faint">{b.start + j}.</span>
            <div className="min-w-0 flex-1">{inline(it.text)}{sub(it)}</div>
          </li>
        ))}
      </ol>
    );
  }
  return (
    <ul key={key} className={`space-y-1 ${nested}`}>
      {b.items.map((it) => (
        <li key={it.line} className={`flex gap-2 ${it.checked !== undefined && !it.sub ? "items-center" : ""}`}>
          {it.checked === undefined ? (
            <span className={`mt-[0.5em] h-[5px] w-[5px] shrink-0 rounded-full ${depth > 0 ? "border border-ink-faint" : "bg-ink-faint"}`} />
          ) : onToggleCheck ? (
            <span onClick={(e) => e.stopPropagation()} className="shrink-0">
              <CheckCircle checked={it.checked} onChange={(v) => onToggleCheck(it.line, v)} label={it.text || "Checklist item"} />
            </span>
          ) : (
            <span
              className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border-2 ${
                it.checked ? "border-accent bg-accent text-white" : "border-line text-transparent"
              }`}
            >
              <Icon name="check" size={10} strokeWidth={3} />
            </span>
          )}
          <div className={`min-w-0 flex-1 ${it.checked ? "text-ink-faint line-through" : ""}`}>{inline(it.text)}{sub(it)}</div>
        </li>
      ))}
    </ul>
  );
}

function withBreaks(text: string): ReactNode {
  const parts = text.split("\n");
  return parts.map((p, i) => (
    <Fragment key={i}>
      {inline(p)}
      {i < parts.length - 1 && <br />}
    </Fragment>
  ));
}

/** Inline spans: **bold**, *italic* / _italic_, ~~strikethrough~~, ++underline++,
 *  `code`, [text](url), bare URLs. The url part allows one level of balanced
 *  parens (`(...)`) inside it — real links often carry them, e.g. a Wikipedia
 *  page or a "#:~:text=" fragment like "…(¥400 for groups)…" — so it isn't
 *  cut off at the first `)` it meets. */
const BALANCED_URL = "(?:[^\\s()<]|\\([^\\s()]*\\))+";
const INLINE = new RegExp(
  `(\\*\\*([^*]+)\\*\\*|__([^_]+)__|~~([^~\\n]+)~~|\\+\\+([^+\\n]+)\\+\\+|\\*([^*\\n]+)\\*|_([^_\\n]+)_|\`([^\`]+)\`|\\[([^\\]]+)\\]\\((${BALANCED_URL})\\)|(https?:\\/\\/${BALANCED_URL}))`,
  "g",
);

function inline(text: string): ReactNode {
  const nodes: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  INLINE.lastIndex = 0;
  let k = 0;
  while ((m = INLINE.exec(text))) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const [, , b1, b2, strike, underline, i1, i2, code, linkText, linkUrl, url] = m;
    if (b1 || b2) nodes.push(<strong key={k++} className="font-semibold text-ink">{b1 || b2}</strong>);
    else if (strike) nodes.push(<s key={k++} className="text-ink-faint">{strike}</s>);
    else if (underline) nodes.push(<span key={k++} className="underline underline-offset-2">{underline}</span>);
    else if (i1 || i2) nodes.push(<em key={k++}>{i1 || i2}</em>);
    else if (code) nodes.push(<code key={k++} className="rounded bg-surface-2 px-1 py-0.5 text-[0.9em]">{code}</code>);
    else if (linkText && linkUrl) nodes.push(<Anchor key={k++} href={linkUrl}>{linkText}</Anchor>);
    else if (url) nodes.push(<Anchor key={k++} href={url}>{linkLabel(url)}</Anchor>);
    last = m.index + m[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function Anchor({ href, children }: { href: string; children: ReactNode }) {
  const safe = /^https?:\/\//i.test(href) ? href : `https://${href}`;
  return (
    <a href={safe} target="_blank" rel="noopener noreferrer" className="text-accent">
      {children}
    </a>
  );
}
