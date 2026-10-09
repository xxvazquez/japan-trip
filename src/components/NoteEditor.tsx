import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import { Extension, Mark } from "@tiptap/core";
import type { ResolvedPos } from "@tiptap/pm/model";
import StarterKit from "@tiptap/starter-kit";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { Placeholder } from "@tiptap/extensions";
import { NOTE_COLORS, docFromNote, noteFromDoc, type NoteColor } from "@/lib/noteFormat";
import { primeKeyboard } from "@/lib/keyboard";
import { Icon } from "./Icon";
import { TextPrompt } from "./TextPrompt";
import "@/styles/note.css";

/**
 * The note editor — formatted as you type, the way Notes edits: bold shows
 * bold, a checklist shows its rings, a colour shows the colour. It reads
 * and writes the plain note format (`src/lib/noteFormat.ts`), so a note is
 * still one text field everywhere else. Markdown typed by hand still works
 * (`- ` starts a list, `**bold**` turns bold).
 *
 * Loaded on demand by <RichNote>, so the editor's code stays out of the
 * first load (it's still precached, so it works offline).
 */

/** text colour — stored by name, drawn from the `--note-*` tokens */
const NoteColorMark = Mark.create({
  name: "noteColor",
  addAttributes() {
    return {
      color: {
        default: null,
        parseHTML: (el) => el.getAttribute("data-note-color"),
        renderHTML: (a) => (a.color ? { "data-note-color": a.color, class: `note-c-${a.color}` } : {}),
      },
    };
  },
  parseHTML: () => [{ tag: "span[data-note-color]" }],
  renderHTML: ({ HTMLAttributes }) => ["span", HTMLAttributes, 0],
});

/** a heading's folded state rides along through an edit untouched */
const HeadingFold = Extension.create({
  name: "headingFold",
  addGlobalAttributes: () => [{
    types: ["heading"],
    attributes: {
      folded: {
        default: false,
        parseHTML: (el) => el.hasAttribute("data-folded"),
        renderHTML: (a) => (a.folded ? { "data-folded": "" } : {}),
      },
    },
  }],
});

const COLOR_NAME: Record<NoteColor, string> = { purple: "Purple", pink: "Pink", orange: "Orange", mint: "Mint", blue: "Blue" };

// Notes' Title / Heading / Subheading / Body, each shown in its own style
const STYLES = [
  { label: "Title", level: 1, cls: "text-[1.15rem] font-semibold" },
  { label: "Heading", level: 2, cls: "text-[1.02rem] font-semibold" },
  { label: "Subheading", level: 3, cls: "text-[0.9rem] font-semibold" },
  { label: "Body", level: 0, cls: "text-[0.9rem]" },
] as const;

// the ones a travel day reaches for — the system keyboard has the rest
const EMOJI = [
  "⚠️", "❗", "⭐", "❤️", "✅", "❌", "💡", "👀",
  "📍", "🗺️", "🚶", "🚃", "🚄", "🚌", "🚕", "✈️",
  "🏨", "🏯", "⛩️", "🌸", "🍁", "☀️", "🌧️", "📸",
  "🍜", "🍣", "🍱", "🍡", "🍵", "☕", "🍺", "🛍️",
  "🎟️", "💴", "💳", "🕐", "📞", "🎁", "🔥", "👍",
];

export function NoteEditor({
  value,
  placeholder,
  className = "",
  onDone,
  onSave,
  onCancel,
}: {
  value: string;
  placeholder: string;
  className?: string;
  /** editing ended with a save — the note's new text (maybe unchanged) */
  onDone: (text: string) => void;
  /** the text so far, saved while editing carries on */
  onSave?: (text: string) => void;
  onCancel: () => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  // while the link prompt is up the editor loses focus, but isn't done
  const holdBlur = useRef(false);
  const ended = useRef(false);
  // the latest document, kept so an edit still saves if the editor goes
  // away mid-edit (Back tapped while typing)
  const lastDoc = useRef<ReturnType<NonNullable<typeof editor>["getJSON"]> | null>(null);
  const [tray, setTray] = useState<"format" | "emoji" | null>(null);
  const [linkPrompt, setLinkPrompt] = useState(false);

  // the editor's own handlers are set up once; read the latest props here
  const props = useRef({ onDone, onSave, onCancel });
  props.current = { onDone, onSave, onCancel };
  const finish = (save: boolean) => {
    if (ended.current || !editor) return;
    ended.current = true;
    if (save) props.current.onDone(noteFromDoc(lastDoc.current ?? editor.getJSON()));
    else props.current.onCancel();
  };

  const editor = useEditor({
    immediatelyRender: true,
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        trailingNode: false,
        heading: { levels: [1, 2, 3] },
        link: { openOnClick: false, autolink: true, linkOnPaste: true },
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
      NoteColorMark,
      HeadingFold,
      Placeholder.configure({ placeholder }),
    ],
    content: docFromNote(value),
    onUpdate: ({ editor: e }) => { lastDoc.current = e.getJSON(); },
    editorProps: {
      attributes: { class: "note-doc selectable", "aria-label": "Note" },
      handleKeyDown: (_view, e) => {
        if (e.key === "Escape") { finish(false); return true; }
        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { finish(true); return true; }
        return false;
      },
    },
    // done once focus has really left — checked a beat later, since focus
    // can blink out and back while the editor mounts or a tray opens
    onBlur: () => {
      setTimeout(() => {
        if (holdBlur.current || !wrapRef.current?.isConnected) return;
        if (wrapRef.current.contains(document.activeElement)) return;
        finish(true);
      }, 0);
    },
  });

  // focus straight away, inside the tap that opened the editor — iOS only
  // raises the keyboard for that (RichNote primes it in case this is late)
  useLayoutEffect(() => {
    editor?.commands.focus("end");
  }, [editor]);

  // leaving the page mid-edit saves, like closing a note in Notes. Checked
  // a beat later, so a remount in place (React's dev double-mount) isn't one
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      setTimeout(() => {
        if (mounted.current || ended.current) return;
        ended.current = true;
        if (lastDoc.current) props.current.onDone(noteFromDoc(lastDoc.current));
        else props.current.onCancel();
      }, 0);
    };
  }, []);

  // switching to another app saves what's typed so far — the phone may close
  // the app in the background — and leaves the note open for coming back
  useEffect(() => {
    const save = () => {
      if (document.hidden && !ended.current && lastDoc.current) props.current.onSave?.(noteFromDoc(lastDoc.current));
    };
    document.addEventListener("visibilitychange", save);
    return () => document.removeEventListener("visibilitychange", save);
  }, []);

  const s = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e.isActive("bold"),
      italic: e.isActive("italic"),
      underline: e.isActive("underline"),
      strike: e.isActive("strike"),
      level: (e.isActive("heading") ? (e.getAttributes("heading").level as 1 | 2 | 3) : 0) as 0 | 1 | 2 | 3,
      bullet: e.isActive("bulletList"),
      ordered: e.isActive("orderedList"),
      task: e.isActive("taskList"),
      callout: e.isActive("blockquote"),
      link: e.isActive("link"),
      color: (e.getAttributes("noteColor").color as NoteColor | undefined) ?? null,
    }),
  });

  if (!editor || !s) return null;
  const chain = () => editor.chain().focus();

  // with nothing selected, Notes formats the word the caret sits in, and
  // taking a style off takes it off the whole run around the caret. At a
  // word's edge it only changes what's typed next
  const format = (name: string, op: "toggle" | "set" | "unset", attrs?: Record<string, unknown>) => {
    const apply = (c: ReturnType<typeof chain>) =>
      op === "toggle" ? c.toggleMark(name, attrs) : op === "set" ? c.setMark(name, attrs) : c.unsetMark(name);
    const sel = editor.state.selection;
    if (!sel.empty) return apply(chain()).run();
    const $at = sel.$from;
    const type = editor.schema.marks[name];
    const inRun = !!($at.nodeBefore && $at.nodeAfter && type.isInSet($at.nodeBefore.marks) && type.isInSet($at.nodeAfter.marks));
    const removing = op === "unset" || (op === "toggle" && editor.isActive(name));
    if (removing && inRun) return chain().extendMarkRange(name).unsetMark(name).setTextSelection(sel.from).run();
    const word = wordAround($at);
    if (word) return apply(chain().setTextSelection(word)).setTextSelection(sel.from).run();
    return apply(chain()).run();
  };

  const onLink = () => {
    if (s.link) { chain().extendMarkRange("link").unsetLink().run(); return; }
    holdBlur.current = true;
    primeKeyboard();
    setLinkPrompt(true);
  };
  const addLink = (raw: string) => {
    const url = raw.trim();
    const href = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    if (url) {
      if (editor.state.selection.empty) chain().insertContent({ type: "text", text: url, marks: [{ type: "link", attrs: { href } }] }).run();
      else chain().setLink({ href }).run();
    }
  };
  const closeLink = () => {
    setLinkPrompt(false);
    holdBlur.current = false;
    editor.commands.focus();
  };

  return (
    <div ref={wrapRef} className={className}>
      <Toolbar>
        <Tool label="Text style" on={() => setTray(tray === "format" ? null : "format")} active={tray === "format"}>
          <span className={`text-[0.95rem] font-medium tracking-tight ${s.color ? `note-c-${s.color}` : ""}`}>Aa</span>
        </Tool>
        <Tool label="Checklist" on={() => chain().toggleTaskList().run()} active={s.task}><Icon name="checklist" size={17} /></Tool>
        <Tool label="Bulleted list" on={() => chain().toggleBulletList().run()} active={s.bullet}><Icon name="list" size={17} /></Tool>
        <Tool label="Numbered list" on={() => chain().toggleOrderedList().run()} active={s.ordered}><Icon name="list-ordered" size={17} /></Tool>
        <Tool label="Callout" on={() => chain().toggleBlockquote().run()} active={s.callout}><Icon name="callout" size={17} /></Tool>
        <Tool label="Emoji" on={() => setTray(tray === "emoji" ? null : "emoji")} active={tray === "emoji"}><Icon name="smile" size={17} /></Tool>
        <Tool label={s.link ? "Remove link" : "Link"} on={onLink} active={s.link}><Icon name="link" size={17} /></Tool>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => finish(true)}
          className="tap sticky right-0 ml-auto shrink-0 bg-surface pl-3 pr-1 text-xs font-medium text-accent"
        >
          Done
        </button>
      </Toolbar>

      {/* the Notes "Aa" panel: paragraph style, then marks and colour */}
      {tray === "format" && (
        <Tray>
          <div className="-mx-1 flex items-baseline gap-1 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {STYLES.map((st) => (
              <button
                key={st.label}
                type="button"
                aria-pressed={s.level === st.level}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => (st.level ? chain().setHeading({ level: st.level }).run() : chain().setParagraph().run())}
                className={`tap shrink-0 rounded-[8px] px-2.5 py-1 text-ink transition-colors ${st.cls} ${
                  s.level === st.level ? "bg-ink/[0.08]" : "hover:bg-ink/[0.05]"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-0.5 gap-y-2">
            <Tool label="Bold" on={() => format("bold", "toggle")} active={s.bold}><span className="text-[0.95rem] font-bold">B</span></Tool>
            <Tool label="Italic" on={() => format("italic", "toggle")} active={s.italic}><span className="font-serif text-[0.95rem] italic">I</span></Tool>
            <Tool label="Underline" on={() => format("underline", "toggle")} active={s.underline}><span className="text-[0.95rem] underline underline-offset-2">U</span></Tool>
            <Tool label="Strikethrough" on={() => format("strike", "toggle")} active={s.strike}><span className="text-[0.95rem] line-through">S</span></Tool>
            <div className="flex w-full items-center gap-1.5">
              <Swatch label="Default colour" active={!s.color} on={() => format("noteColor", "unset")}>
                <span className="h-full w-full rounded-full bg-ink" />
              </Swatch>
              {NOTE_COLORS.map((c) => (
                <Swatch key={c} label={COLOR_NAME[c]} active={s.color === c} on={() => format("noteColor", "set", { color: c })}>
                  <span className={`h-full w-full rounded-full bg-current note-c-${c}`} />
                </Swatch>
              ))}
            </div>
          </div>
        </Tray>
      )}
      {tray === "emoji" && (
        <Tray>
          <div className="grid grid-cols-8 gap-y-0.5">
            {EMOJI.map((em) => (
              <button
                key={em}
                type="button"
                aria-label={em}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => chain().insertContent(em).run()}
                className="grid h-10 place-items-center rounded-[8px] text-[1.35rem] leading-none active:bg-ink/[0.07]"
              >
                {em}
              </button>
            ))}
          </div>
        </Tray>
      )}

      <EditorContent editor={editor} className="pt-1.5" />

      <TextPrompt
        open={linkPrompt}
        title="Add Link"
        placeholder="https://"
        action="Add"
        onSubmit={addLink}
        onClose={closeLink}
      />
    </div>
  );
}

const WORD = /[\p{L}\p{N}'’_-]/u;

/** The word the caret is inside (not at either edge of), as a range. */
function wordAround($at: ResolvedPos): { from: number; to: number } | null {
  const block = $at.parent;
  // one character per leaf, so offsets in this text match the block's own
  const text = block.textBetween(0, block.content.size, undefined, "\n");
  let a = $at.parentOffset;
  let b = a;
  if (!WORD.test(text[a - 1] ?? "") || !WORD.test(text[b] ?? "")) return null;
  while (a > 0 && WORD.test(text[a - 1])) a--;
  while (b < text.length && WORD.test(text[b])) b++;
  return { from: $at.start() + a, to: $at.start() + b };
}

function Toolbar({ children }: { children: ReactNode }) {
  // one row that scrolls sideways on a narrow card rather than wrapping
  return (
    <div className="-mx-1 flex items-center gap-0.5 overflow-x-auto border-b border-line px-1 pb-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {children}
    </div>
  );
}

function Tray({ children }: { children: ReactNode }) {
  return <div className="border-b border-line py-1.5 animate-fade-up">{children}</div>;
}

/** a toolbar button that never takes focus from the text */
function Tool({ label, on, active, children }: { label: string; on: () => void; active?: boolean; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onMouseDown={(e) => e.preventDefault()}
      onClick={on}
      className={`tap grid h-8 w-8 shrink-0 place-items-center rounded-[8px] transition-colors ${
        active ? "bg-ink/[0.08] text-ink" : "text-ink-soft hover:bg-ink/[0.05] hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

function Swatch({ label, active, on, children }: { label: string; active: boolean; on: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onMouseDown={(e) => e.preventDefault()}
      onClick={on}
      className={`tap grid h-7 w-7 shrink-0 place-items-center rounded-full p-[3px] ring-2 transition-shadow ${active ? "ring-accent" : "ring-transparent"}`}
    >
      {children}
    </button>
  );
}

