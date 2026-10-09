import { describe, expect, it } from "vitest";
import { docFromNote, noteFromDoc, noteToPlain, parseInline, parseNote, type PMNode } from "./noteFormat";

const round = (text: string) => noteFromDoc(docFromNote(text));
/** text → doc → text → doc gives the same doc: nothing lost on a save */
const stable = (text: string) => {
  const doc = docFromNote(text);
  expect(docFromNote(noteFromDoc(doc))).toEqual(doc);
};

describe("parseInline", () => {
  it("reads the basic marks", () => {
    expect(parseInline("**b** *i* _i_ ++u++ ~~s~~ `c`")).toEqual([
      { t: "b", kids: [{ t: "text", s: "b" }] },
      { t: "text", s: " " },
      { t: "i", kids: [{ t: "text", s: "i" }] },
      { t: "text", s: " " },
      { t: "i", kids: [{ t: "text", s: "i" }] },
      { t: "text", s: " " },
      { t: "u", kids: [{ t: "text", s: "u" }] },
      { t: "text", s: " " },
      { t: "s", kids: [{ t: "text", s: "s" }] },
      { t: "text", s: " " },
      { t: "code", s: "c" },
    ]);
  });

  it("nests marks, colour outermost", () => {
    expect(parseInline("{pink}**a *b***{/}")).toEqual([
      {
        t: "color",
        c: "pink",
        kids: [{ t: "b", kids: [{ t: "text", s: "a " }, { t: "i", kids: [{ t: "text", s: "b" }] }] }],
      },
    ]);
  });

  it("leaves snake_case, unknown colours and escapes alone", () => {
    expect(parseInline("snake_case_word")).toEqual([{ t: "text", s: "snake_case_word" }]);
    expect(parseInline("{red}x{/}")).toEqual([{ t: "text", s: "{red}x{/}" }]);
    expect(parseInline("\\*not\\*")).toEqual([{ t: "text", s: "*not*" }]);
  });

  it("keeps parens inside a link's url", () => {
    const [link] = parseInline("[wiki](https://en.wikipedia.org/wiki/Foo_(bar))");
    expect(link).toMatchObject({ t: "link", href: "https://en.wikipedia.org/wiki/Foo_(bar)" });
  });
});

describe("parseNote", () => {
  it("reads a folded heading", () => {
    expect(parseNote("## Backup plan {folded}\ntext")[0]).toMatchObject({ t: "h", level: 2, folded: true, line: 0 });
  });

  it("nests unindented bullets under a numbered step", () => {
    const [list] = parseNote("1. Gate\n2. Snacks\n- Senbei\n- Melon pan\n3. Temple");
    expect(list).toMatchObject({ t: "ol", items: [{}, { sub: { t: "ul" } }, {}] });
  });

  it("carries an indented line on as part of the item above", () => {
    const [list] = parseNote("- one\n  still one\n- two");
    expect(list).toMatchObject({ t: "ul", items: [{ kids: [{ s: "one" }, { t: "br" }, { s: "still one" }] }, {}] });
  });

  it("parses a callout's own blocks, keeping source lines", () => {
    const [q] = parseNote("> ⚠️ Busy\n> - [ ] book");
    expect(q).toMatchObject({ t: "quote", blocks: [{ t: "p" }, { t: "ul", items: [{ checked: false, line: 1 }] }] });
  });
});

describe("doc round trip", () => {
  it("writes back what it reads", () => {
    const text = [
      "Short street leading to the temple.",
      "",
      "1. Start at the gate",
      "2. Try a snack",
      "   - **Ningyō-yaki** — small cakes",
      "   - Senbei",
      "3. Go through",
      "",
      "## Shopping {folded}",
      "",
      "- [ ] Fan",
      "- [x] Chopsticks",
      "",
      "> ⚠️ {orange}Touristy{/} — try *Denboin-dori*",
      "",
      "---",
      "",
      "See https://example.com/a_(b) and [map](https://maps.google.com/?q=x)",
    ].join("\n");
    expect(round(text)).toBe(text);
    stable(text);
  });

  it("keeps marker characters literal", () => {
    for (const t of ["- not a list", "# not a heading", "1. not a number", "a * b * c", "2 ~~ 3", "{pink}x{/} is literal"]) {
      const doc: PMNode = { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: t }] }] };
      expect(noteToPlain(noteFromDoc(doc))).toBe(t);
    }
  });

  it("writes overlapping marks so they read back the same", () => {
    const doc: PMNode = {
      type: "doc",
      content: [{
        type: "paragraph",
        content: [
          { type: "text", text: "a", marks: [{ type: "italic" }] },
          { type: "text", text: "b", marks: [{ type: "bold" }, { type: "italic" }] },
          { type: "text", text: "c", marks: [{ type: "bold" }] },
          { type: "text", text: "d", marks: [{ type: "noteColor", attrs: { color: "blue" } }, { type: "underline" }] },
        ],
      }],
    };
    expect(docFromNote(noteFromDoc(doc))).toEqual(doc);
  });

  it("starts a style after a selected leading space", () => {
    const doc: PMNode = {
      type: "doc",
      content: [{
        type: "paragraph",
        content: [
          { type: "text", text: "Open" },
          { type: "text", text: " daily", marks: [{ type: "bold" }] },
          { type: "text", text: " except", marks: [{ type: "italic" }] },
          { type: "text", text: " Mon", marks: [{ type: "strike" }] },
        ],
      }],
    };
    expect(noteFromDoc(doc)).toBe("Open **daily** *except* ~~Mon~~");
  });

  it("keeps a lone ~ or + next to a struck or underlined word", () => {
    const doc: PMNode = {
      type: "doc",
      content: [{
        type: "paragraph",
        content: [
          { type: "text", text: "~" },
          { type: "text", text: "10 min", marks: [{ type: "strike" }] },
          { type: "text", text: " 1+" },
          { type: "text", text: "2", marks: [{ type: "underline" }] },
        ],
      }],
    };
    expect(docFromNote(noteFromDoc(doc))).toEqual(doc);
  });

  it("keeps a ] inside a link's text", () => {
    const doc: PMNode = {
      type: "doc",
      content: [{ type: "paragraph", content: [{ type: "text", text: "Menu [EN]", marks: [{ type: "link", attrs: { href: "https://e.com/m" } }] }] }],
    };
    expect(docFromNote(noteFromDoc(doc))).toEqual(doc);
  });

  it("keeps hard breaks in paragraphs and list items", () => {
    stable("line one\nline two");
    stable("- item\n  more of it\n- next");
  });

  it("normalises legacy notes without changing how they read", () => {
    const legacy = "* one\n* two\n\n__bold__ and _it_";
    expect(parseNote(round(legacy))).toEqual(parseNote(legacy));
  });

  it("gives an empty note an empty paragraph", () => {
    expect(docFromNote("")).toEqual({ type: "doc", content: [{ type: "paragraph" }] });
    expect(noteFromDoc(docFromNote(""))).toBe("");
  });
});

describe("noteToPlain", () => {
  it("drops the markup", () => {
    expect(noteToPlain("## Hi {folded}\n- [ ] {mint}**buy**{/} tea")).toBe("Hi\nbuy tea");
  });
});
