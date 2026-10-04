import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Page, PageHeader } from "@/components/Page";
import { Section } from "@/components/Section";
import { Icon } from "@/components/Icon";
import { IconTile } from "@/components/IconTile";
import { INSET_DIVIDER } from "@/components/InsetRow";
import { Markdown } from "@/components/Markdown";
import { SearchField } from "@/components/SearchField";
import { HELP, helpKey, type HelpItem, type HelpTopic } from "@/lib/help";

/** lower-case, accents dropped — "cafe" finds "café" */
const fold = (s: string) => s.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** One question as a disclosure row: the question is what you scan, the
 *  answer is what you tap for — then a row that takes you there, if any. */
function QA({ item, open, onToggle, focus }: { item: HelpItem; open: boolean; onToggle: () => void; focus: boolean }) {
  const ref = useRef<HTMLLIElement>(null);
  useEffect(() => {
    if (focus) ref.current?.scrollIntoView({ block: "center" });
  }, [focus]);
  return (
    <li ref={ref} className={INSET_DIVIDER}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-3.5 py-3 text-left transition-colors active:bg-ink/[0.07]"
      >
        <span className="value min-w-0 flex-1 leading-snug text-ink">{item.q}</span>
        <Icon name="chevron" size={14} className={`shrink-0 text-ink-faint transition-transform duration-200 ${open ? "rotate-90" : ""}`} />
      </button>
      {open && (
        <div className="px-3.5 pb-3.5 motion-safe:animate-fade-in">
          <Markdown text={item.a} className="note text-ink-soft [&_p.font-semibold]:pt-1.5 [&_p.font-semibold]:font-medium [&_strong]:font-medium [&_strong]:text-ink" />
          {item.go && (
            <Link to={item.go.to} className="action mt-3 inline-flex items-center gap-1 text-[15px]">
              {item.go.label}
              <Icon name="chevron" size={12} />
            </Link>
          )}
        </div>
      )}
    </li>
  );
}

/**
 * Help — the iPhone User Guide idea, in the app: topics with an icon each,
 * short questions, answers that open in place, and a search across all of
 * it. Content lives in `src/lib/help.ts` (app search finds it too); a link
 * like `/help?open=map/where` opens straight to one answer.
 */
export default function Help() {
  const [params] = useSearchParams();
  const target = params.get("open");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<Set<string>>(() => new Set(target ? [target] : []));
  const toggle = (key: string) =>
    setOpen((s) => {
      const n = new Set(s);
      n.has(key) ? n.delete(key) : n.add(key);
      return n;
    });

  // every word has to be in the question or its answer
  const words = fold(q.trim()).split(/\s+/).filter(Boolean);
  const topics = useMemo<HelpTopic[]>(() => {
    if (!words.length) return HELP;
    return HELP.map((t) => ({
      ...t,
      items: t.items.filter((i) => {
        const text = fold(`${i.q} ${i.a}`);
        return words.every((w) => text.includes(w));
      }),
    })).filter((t) => t.items.length);
  }, [words.join(" ")]); // eslint-disable-line react-hooks/exhaustive-deps
  const searching = words.length > 0;
  const found = topics.reduce((n, t) => n + t.items.length, 0);
  // a search down to a few answers opens them, so there's nothing left to tap
  useEffect(() => {
    if (!searching || found > 4) return;
    setOpen((s) => new Set([...s, ...topics.flatMap((t) => t.items.map((i) => helpKey(t, i)))]));
  }, [topics]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Page width="form">
      <PageHeader back="/manage" title="Help" />

      <div className="mb-6">
        <SearchField value={q} onChange={setQ} placeholder="Search Help" />
      </div>

      {searching && found === 0 && (
        <div className="px-6 pt-10 text-center">
          <p className="text-lg text-ink">No Results</p>
          <p className="meta mt-1 break-words">for “{q.trim()}”</p>
        </div>
      )}

      <div className="space-y-6">
        {topics.map((t) => (
          // a plain heading, not a folding one: a search or a link must never
          // land inside a topic someone folded away last time
          <section key={t.id}>
            <h2 className="mb-2 flex items-center gap-2.5 px-1 text-[17px] font-medium text-ink">
              <IconTile name={t.icon} tone={t.tone} color={t.color} />
              {t.title}
            </h2>
            <Section>
            <ul>
              {t.items.map((i) => {
                const key = helpKey(t, i);
                return (
                  <QA
                    key={key}
                    item={i}
                    open={open.has(key)}
                    onToggle={() => toggle(key)}
                    focus={key === target}
                  />
                );
              })}
            </ul>
            </Section>
          </section>
        ))}
      </div>
    </Page>
  );
}
