import { useMemo, useState, type ReactNode } from "react";
import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
import { Page, PageHeader } from "@/components/Page";
import { Section } from "@/components/Section";
import { Icon, type IconName } from "@/components/Icon";
import { IconTile } from "@/components/IconTile";
import { INSET_DIVIDER } from "@/components/InsetRow";
import { SearchField } from "@/components/SearchField";
import { HelpPreview } from "@/components/HelpPreview";
import { HELP, helpKey, helpText, type HelpBlock, type HelpItem, type HelpTopic } from "@/lib/help";

/** a grouped row's hairline, its left edge set per block */
const DIVIDER = INSET_DIVIDER.replace("after:left-3.5 ", "");

/** lower-case, accents dropped — "cafe" finds "café" */
const fold = (s: string) => s.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** Help's inline markup: `**bold**` (what's on screen), `*italic*`, and
 *  `{icon}` — a button's own symbol, sitting in the sentence */
function Inline({ text }: { text: string }) {
  const out: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\*(.+?)\*|\{([a-z-]+)\}/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1]) out.push(<strong key={m.index} className="font-medium text-ink">{m[1]}</strong>);
    else if (m[2]) out.push(<em key={m.index}>{m[2]}</em>);
    else out.push(<Icon key={m.index} name={m[3] as IconName} size={16} className="mx-0.5 inline-block align-[-3px] text-accent" />);
    last = re.lastIndex;
  }
  out.push(text.slice(last));
  return <>{out}</>;
}

/** a question as a row that opens its answer */
function QuestionRow({ topic, item }: { topic: HelpTopic; item: HelpItem }) {
  return (
    <li className={INSET_DIVIDER}>
      <Link
        to={`/help/${helpKey(topic, item)}`}
        className="flex items-center gap-3 px-3.5 py-3 transition-colors duration-150 hover:bg-surface-2/40 active:bg-ink/[0.07]"
      >
        <span className="value min-w-0 flex-1 break-words leading-snug text-ink">{item.q}</span>
        <Icon name="chevron" size={14} className="shrink-0 text-ink-faint" />
      </Link>
    </li>
  );
}

/**
 * Help — the iPhone User Guide idea: topics, each a list of questions, and
 * every answer on its own page (`/help/:topic/:item`). Content lives in
 * `src/lib/help.ts`; app search finds it too.
 */
export default function Help() {
  const { topic, item } = useParams();
  const [params] = useSearchParams();
  // links from before answers had pages
  const old = params.get("open");
  if (old) return <Navigate to={`/help/${old}`} replace />;
  if (topic && item) return <Answer key={`${topic}/${item}`} topicId={topic} itemId={item} />;
  return <HelpIndex />;
}

function HelpIndex() {
  const [q, setQ] = useState("");
  // every word has to be in the question or its answer
  const words = fold(q.trim()).split(/\s+/).filter(Boolean);
  const topics = useMemo<HelpTopic[]>(() => {
    if (!words.length) return HELP;
    return HELP.map((t) => ({
      ...t,
      items: t.items.filter((i) => {
        const text = fold(`${i.q} ${helpText(i)}`);
        return words.every((w) => text.includes(w));
      }),
    })).filter((t) => t.items.length);
  }, [words.join(" ")]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Page width="form">
      <PageHeader back="/manage" title="Help" />

      <div className="mb-6">
        <SearchField value={q} onChange={setQ} placeholder="Search Help" />
      </div>

      {words.length > 0 && topics.length === 0 && (
        <div className="px-6 pt-10 text-center">
          <p className="text-lg text-ink">No Results</p>
          <p className="meta mt-1 break-words">for “{q.trim()}”</p>
        </div>
      )}

      <div className="space-y-6">
        {topics.map((t) => (
          <section key={t.id}>
            <h2 className="mb-2 flex items-center gap-2.5 px-1 text-[17px] font-medium text-ink">
              <IconTile name={t.icon} tone={t.tone} color={t.color} />
              {t.title}
            </h2>
            <Section>
              <ul>
                {t.items.map((i) => (
                  <QuestionRow key={i.id} topic={t} item={i} />
                ))}
              </ul>
            </Section>
          </section>
        ))}
      </div>
    </Page>
  );
}

/** one answer, on its own page: the question as the title, a line or two,
 *  a picture of the screen, then rows or steps — and the rest of its topic */
function Answer({ topicId, itemId }: { topicId: string; itemId: string }) {
  const topic = HELP.find((t) => t.id === topicId);
  const item = topic?.items.find((i) => i.id === itemId);
  if (!topic || !item) return <Navigate to="/help" replace />;
  const more = topic.items.filter((i) => i !== item);

  return (
    <Page width="form">
      <PageHeader back="/help" eyebrow={topic.title} title={item.q} className="!mb-3" />

      <p className="mb-7 text-[17px] leading-relaxed text-ink-soft">
        <Inline text={item.a} />
      </p>

      {item.preview && <HelpPreview id={item.preview} />}

      <div className="space-y-6">
        {item.blocks?.map((b, n) => <Block key={n} block={b} />)}
      </div>

      {item.go && (
        <Section className="mt-8">
          <ul>
            <li>
              <Link
                to={item.go.to}
                className="flex items-center justify-between gap-3 px-3.5 py-3 text-[17px] text-accent transition-colors duration-150 hover:bg-surface-2/40 active:bg-ink/[0.07]"
              >
                {item.go.label}
                <Icon name="chevron" size={14} className="shrink-0 text-ink-faint" />
              </Link>
            </li>
          </ul>
        </Section>
      )}

      {more.length > 0 && (
        <div className="mt-10">
          <p className="kicker mb-2 px-1 text-ink-faint">More in {topic.title}</p>
          <Section>
            <ul>
              {more.map((i) => (
                <QuestionRow key={i.id} topic={topic} item={i} />
              ))}
            </ul>
          </Section>
        </div>
      )}
    </Page>
  );
}

/** rows behind a symbol, or numbered steps — each a grouped-inset card
 *  under a section label, as Settings sets out any list, with the hairline
 *  starting past the symbol or number */
function Block({ block }: { block: HelpBlock }) {
  return (
    <div>
      {block.title && <p className="kicker mb-2 px-1 text-ink-faint">{block.title}</p>}
      <Section>
        {"rows" in block ? (
          <ul>
            {block.rows.map((r) => (
              <li key={r.title} className={`${DIVIDER} after:left-[3.75rem] flex items-center gap-3.5 px-3.5 py-3`}>
                <span className="grid w-7 shrink-0 place-items-center text-accent">
                  <Icon name={r.icon} size={24} strokeWidth={1.7} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block break-words text-[17px] leading-snug text-ink">{r.title}</span>
                  {r.detail && (
                    <span className="mt-0.5 block break-words text-[15px] leading-snug text-ink-faint">
                      <Inline text={r.detail} />
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <ol>
            {block.steps.map((step, n) => (
              <li key={n} className={`${DIVIDER} after:left-[3.25rem] flex items-baseline gap-3 px-3.5 py-3 text-[17px] leading-snug text-ink`}>
                <span className="w-6 shrink-0 text-right tabular-nums text-ink-faint">{n + 1}.</span>
                <span className="min-w-0 flex-1 break-words">
                  <Inline text={step} />
                </span>
              </li>
            ))}
          </ol>
        )}
      </Section>
    </div>
  );
}
