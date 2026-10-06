import { Fragment, useState, type ReactNode } from "react";
import { linkLabel } from "@/lib/linkLabel";
import { parseNote, type Block, type Inline, type List, type ListItem } from "@/lib/noteFormat";
import { CheckCircle } from "./CheckCircle";
import { Icon } from "./Icon";
import "@/styles/note.css";

/**
 * Renders a note (the format is in `src/lib/noteFormat.ts`): marks, colours,
 * links, headings, lists, checklists, callouts, rules. It renders to React
 * elements, so there is no dangerouslySetInnerHTML and nothing to sanitise.
 * Plain text renders as-is. Styling is `note.css`, shared with the editor.
 *
 * A heading with anything under it gets a disclosure chevron, as Notes
 * does: tapping it folds the section away. Pass `onToggleFold` to save that
 * into the note (it's called with the heading's source line); without it the
 * fold only lasts while the note is on screen.
 *
 * Pass `onToggleCheck` to make checklist rows tappable — called with the
 * item's source line number (into the normalised, \n-split text) so the
 * caller can flip just that line and re-commit the raw note text.
 */
export function Markdown({
  text,
  className = "",
  onToggleCheck,
  onToggleFold,
}: {
  text: string;
  className?: string;
  onToggleCheck?: (line: number, checked: boolean) => void;
  onToggleFold?: (line: number, folded: boolean) => void;
}) {
  // a fold flipped here shows at once, before (or without) a save
  const [folds, setFolds] = useState<Record<number, boolean>>({});
  const ctx: Ctx = {
    onToggleCheck,
    isFolded: (b) => folds[b.line] ?? b.folded,
    toggleFold: (b) => {
      const next = !(folds[b.line] ?? b.folded);
      setFolds((f) => ({ ...f, [b.line]: next }));
      onToggleFold?.(b.line, next);
    },
  };
  return <div className={`note-doc selectable ${className}`}>{renderBlocks(parseNote(text), ctx)}</div>;
}

type HeadingBlock = Extract<Block, { t: "h" }>;
type Ctx = {
  onToggleCheck?: (line: number, checked: boolean) => void;
  isFolded: (b: HeadingBlock) => boolean;
  toggleFold: (b: HeadingBlock) => void;
};

/** Blocks, with each heading owning what follows it up to the next heading
 *  of the same or a higher level — that's the part its chevron folds. */
function renderBlocks(bs: Block[], ctx: Ctx): ReactNode[] {
  const out: ReactNode[] = [];
  let i = 0;
  while (i < bs.length) {
    const b = bs[i];
    if (b.t !== "h") { out.push(renderBlock(b, i, ctx)); i++; continue; }
    let j = i + 1;
    while (j < bs.length && !((bs[j] as Block).t === "h" && (bs[j] as HeadingBlock).level <= b.level)) j++;
    const body = bs.slice(i + 1, j);
    const folded = body.length > 0 && ctx.isFolded(b);
    out.push(
      <div key={i} className="note-fold">
        <p className={`note-h note-h${b.level} ${body.length ? "flex items-start gap-1.5" : ""}`}>
          {body.length > 0 && (
            <button
              type="button"
              aria-expanded={!folded}
              aria-label={folded ? "Expand section" : "Collapse section"}
              onClick={(e) => { e.stopPropagation(); ctx.toggleFold(b); }}
              className="tap -ml-0.5 mt-[0.2em] shrink-0 text-ink-faint transition-colors hover:text-ink-soft"
            >
              <Icon name="chevron" size={13} className={`transition-transform duration-200 ${folded ? "" : "rotate-90"}`} />
            </button>
          )}
          <span className="min-w-0">{inline(b.kids)}</span>
        </p>
        {!folded && renderBlocks(body, ctx)}
      </div>,
    );
    i = j;
  }
  return out;
}

function renderBlock(b: Block, key: number, ctx: Ctx): ReactNode {
  switch (b.t) {
    case "hr":
      return <hr key={key} />;
    case "quote":
      return <div key={key} className="note-callout">{renderBlocks(b.blocks, ctx)}</div>;
    case "ul":
    case "ol":
      return <Fragment key={key}>{renderList(b, ctx)}</Fragment>;
    case "p":
      return <p key={key}>{inline(b.kids)}</p>;
    default:
      return null;
  }
}

/** A list and its nested lists, as real <ul>/<ol> so the markers line up
 *  with the editor's. A bullet list that mixes plain and checklist items is
 *  drawn as runs of each, the way the editor holds them. */
function renderList(b: List, ctx: Ctx): ReactNode {
  const body = (it: ListItem) => <>{inline(it.kids)}{it.sub && renderList(it.sub, ctx)}</>;
  if (b.t === "ol") {
    return (
      <ol start={b.start}>
        {b.items.map((it) => <li key={it.line}>{body(it)}</li>)}
      </ol>
    );
  }
  const runs: ListItem[][] = [];
  for (const it of b.items) {
    const prev = runs[runs.length - 1];
    if (prev && (prev[0].checked === undefined) === (it.checked === undefined)) prev.push(it);
    else runs.push([it]);
  }
  return runs.map((run) =>
    run[0].checked === undefined ? (
      <ul key={run[0].line}>
        {run.map((it) => <li key={it.line}>{body(it)}</li>)}
      </ul>
    ) : (
      <ul key={run[0].line} className="note-tasks">
        {run.map((it) => (
          <li key={it.line} className={`note-task ${it.checked ? "is-done" : ""}`}>
            {ctx.onToggleCheck ? (
              <span onClick={(e) => e.stopPropagation()} className="flex shrink-0 pt-[0.06em]">
                <CheckCircle checked={!!it.checked} onChange={(v) => ctx.onToggleCheck!(it.line, v)} label={plain(it.kids) || "Checklist item"} />
              </span>
            ) : (
              <span
                className={`mt-[0.12em] grid h-[1.25em] w-[1.25em] shrink-0 place-items-center rounded-full border-2 ${
                  it.checked ? "border-accent bg-accent text-white" : "border-line text-transparent"
                }`}
              >
                <Icon name="check" size={10} strokeWidth={3} />
              </span>
            )}
            <div>{body(it)}</div>
          </li>
        ))}
      </ul>
    ),
  );
}

function plain(ns: Inline[]): string {
  return ns.map((n) => (n.t === "text" || n.t === "code" ? n.s : n.t === "br" ? " " : plain(n.kids))).join("");
}

function inline(ns: Inline[]): ReactNode[] {
  return ns.map((n, k) => {
    switch (n.t) {
      case "text": return <Fragment key={k}>{n.s}</Fragment>;
      case "br": return <br key={k} />;
      case "code": return <code key={k}>{n.s}</code>;
      case "b": return <strong key={k}>{inline(n.kids)}</strong>;
      case "i": return <em key={k}>{inline(n.kids)}</em>;
      case "u": return <u key={k}>{inline(n.kids)}</u>;
      case "s": return <s key={k}>{inline(n.kids)}</s>;
      case "color": return <span key={k} data-note-color={n.c} className={`note-c-${n.c}`}>{inline(n.kids)}</span>;
      case "link": {
        const bare = n.kids.length === 1 && n.kids[0].t === "text" && n.kids[0].s === n.href;
        return <Anchor key={k} href={n.href}>{bare ? linkLabel(n.href) : inline(n.kids)}</Anchor>;
      }
    }
  });
}

function Anchor({ href, children }: { href: string; children: ReactNode }) {
  const safe = /^https?:\/\//i.test(href) ? href : `https://${href}`;
  return (
    <a href={safe} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
      {children}
    </a>
  );
}
