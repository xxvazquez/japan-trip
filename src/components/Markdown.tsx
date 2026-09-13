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
  return <div className={`space-y-2.5 ${className}`}>{blocks.map((b, i) => renderBlock(b, i, onToggleCheck))}</div>;
}

type ListItem = { text: string; line: number; checked?: boolean };

type Block =
  | { t: "h"; level: number; text: string }
  | { t: "p"; text: string }
  | { t: "quote"; lines: string[] }
  | { t: "ul"; items: ListItem[] }
  | { t: "ol"; items: string[] }
  | { t: "hr" };

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

    if (/^\s*[-*+]\s+/.test(line)) {
      const items: ListItem[] = [];
      while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) {
        const raw = lines[i].replace(/^\s*[-*+]\s+/, "");
        const box = raw.match(/^\[([ xX])\]\s*(.*)$/);
        items.push(box ? { text: box[2], line: i, checked: /x/i.test(box[1]) } : { text: raw, line: i });
        i++;
      }
      out.push({ t: "ul", items });
      continue;
    }

    if (/^\s*\d+[.)]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) { items.push(lines[i].replace(/^\s*\d+[.)]\s+/, "")); i++; }
      out.push({ t: "ol", items });
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
      return (
        <ul key={key} className="space-y-1">
          {b.items.map((it) => (
            <li key={it.line} className={`flex gap-2 ${it.checked !== undefined ? "items-center" : ""}`}>
              {it.checked === undefined ? (
                <span className="mt-[0.5em] h-1 w-1 shrink-0 rounded-full bg-ink-faint" />
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
              <span className={`min-w-0 flex-1 ${it.checked ? "text-ink-faint line-through" : ""}`}>{inline(it.text)}</span>
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol key={key} className="space-y-1">
          {b.items.map((it, j) => (
            <li key={j} className="flex gap-2">
              <span className="shrink-0 tabular-nums text-ink-faint">{j + 1}.</span>
              <span className="min-w-0 flex-1">{inline(it)}</span>
            </li>
          ))}
        </ol>
      );
    default:
      return <p key={key} className="leading-relaxed">{withBreaks(b.text)}</p>;
  }
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
 *  `code`, [text](url), bare URLs. */
const INLINE = /(\*\*([^*]+)\*\*|__([^_]+)__|~~([^~\n]+)~~|\+\+([^+\n]+)\+\+|\*([^*\n]+)\*|_([^_\n]+)_|`([^`]+)`|\[([^\]]+)\]\(([^)\s]+)\)|(https?:\/\/[^\s<)]+))/g;

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
    <a href={safe} target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-2">
      {children}
    </a>
  );
}
