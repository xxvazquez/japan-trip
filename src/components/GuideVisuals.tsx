import { useLayoutEffect, useRef, useState, type PointerEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { Icon, type IconName } from "@/components/Icon";
import { Inline } from "@/components/GuideBlocks";
import type { GuideCompare, GuideEras, GuideEvidence, GuidePhoto } from "@/guides/types";

/** The guide's explanatory visuals — the pieces that show something rather
 *  than say it: spans of time to scale, a line lifted from the text, what's
 *  settled against what's argued, two things side by side, a pair of
 *  photos. Each sits in the article's reading column on the same quiet grey
 *  inset as the other blocks, so a read never turns into a dashboard. */

/** "14,000 BC", "AD 538" only where it'd be ambiguous, else plain "1868" */
export const yearLabel = (y: number) => (y < 0 ? `${Math.abs(y).toLocaleString("en-GB")} BC` : y < 1000 ? `AD ${y}` : String(y));

/** a box's width in CSS px, kept current as it resizes */
function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [w, setW] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.round(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}

/* ------------------------------------------------------------------ eras */

/** how long a span lasted — rounded, with "about", when its dates are
 *  themselves approximate ("c. 14,500", "10th c."), so the length never
 *  claims more precision than the dates it comes from */
function lengthLabel(s: GuideEras["spans"][number]): string {
  const n = s.to - s.from;
  if (!/c\./.test(s.when)) return `${n.toLocaleString("en-GB")} years`;
  const step = n >= 1000 ? 500 : n >= 200 ? 50 : 10;
  return `about ${(Math.round(n / step) * step).toLocaleString("en-GB")} years`;
}

/**
 * Periods drawn to scale on one band. The lengths are the point — the
 * Jōmon's ten thousand years against everything after, Edo's quarter
 * millennium against Taishō's fourteen — so a span is never widened to fit
 * its label; a narrow one is still reachable by dragging along the band
 * (the way Stocks scrubs a chart) or with the arrows. The chosen span's
 * dates and a line on it sit underneath, with a link to its chapter.
 */
export function Eras({ eras: e }: { eras: GuideEras }) {
  const { guide } = useParams();
  const [band, w] = useWidth<HTMLDivElement>();
  const [at, setAt] = useState(0);
  const from = Math.min(...e.spans.map((s) => s.from));
  const to = Math.max(...e.spans.map((s) => s.to));
  const total = to - from || 1;
  const span = e.spans[at];

  // the span under a point on the band
  const pick = (ev: PointerEvent<HTMLDivElement>) => {
    const r = ev.currentTarget.getBoundingClientRect();
    const year = from + ((ev.clientX - r.left) / r.width) * total;
    const i = e.spans.findIndex((s) => year >= s.from && year < s.to);
    if (i >= 0 && i !== at) setAt(i);
  };

  return (
    <figure className="border-y border-line py-4">
      <figcaption>
        <p className="break-words text-[15px] font-medium leading-snug text-ink">{e.title}</p>
        {e.read && <p className="mt-0.5 break-words text-[13px] leading-snug text-ink-soft"><Inline text={e.read} /></p>}
      </figcaption>

      <div
        ref={band}
        role="group"
        aria-label={e.title}
        onPointerDown={(ev) => {
          ev.currentTarget.setPointerCapture(ev.pointerId);
          pick(ev);
        }}
        onPointerMove={(ev) => ev.buttons && pick(ev)}
        className="mt-3 flex h-10 cursor-pointer touch-pan-y select-none gap-px overflow-hidden rounded-[7px]"
      >
        {e.spans.map((s, i) => {
          const px = ((s.to - s.from) / total) * w;
          const on = i === at;
          return (
            <button
              key={s.name}
              type="button"
              aria-pressed={on}
              aria-label={`${s.name}, ${s.when}`}
              onClick={() => setAt(i)}
              style={{ flexGrow: s.to - s.from, flexBasis: 0 }}
              className={`relative min-w-[2px] overflow-hidden transition-colors duration-200 ${on ? "bg-accent" : i % 2 ? "bg-ink-faint/30" : "bg-ink-faint/20"}`}
            >
              {/* a label only where it fits whole — never clipped */}
              {px > s.name.length * 6.2 + 10 && (
                <span className={`absolute inset-x-0 top-1/2 -translate-y-1/2 whitespace-nowrap text-center text-[11px] leading-none ${on ? "text-white" : "text-ink-soft"}`}>
                  {s.name}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <div className="mt-1 flex justify-between text-[11px] tabular-nums text-ink-faint">
        <span>{yearLabel(from)}</span>
        <span>{to >= new Date().getFullYear() ? "Today" : yearLabel(to)}</span>
      </div>

      <div className="mt-3 flex items-start gap-2" aria-live="polite">
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-baseline gap-x-2">
            <span className="text-[17px] leading-snug text-ink">{span.name}</span>
            {span.local && <span className="font-jp text-[15px] text-ink-soft">{span.local}</span>}
          </p>
          <p className="text-[13px] tabular-nums text-ink-faint">
            {span.when} · {lengthLabel(span)}
          </p>
          <p className="mt-1.5 break-words text-[15px] leading-[1.45] text-ink"><Inline text={span.text} /></p>
          {span.ref && (
            <Link to={`/logbook/guide/${guide}/${span.ref}`} viewTransition className="mt-1.5 inline-block text-[15px] text-accent active:opacity-60">
              Read more
            </Link>
          )}
        </div>
        <span className="flex shrink-0 gap-1">
          <StepButton icon="back" label="Earlier" disabled={at === 0} onClick={() => setAt(at - 1)} />
          <StepButton icon="chevron" label="Later" disabled={at === e.spans.length - 1} onClick={() => setAt(at + 1)} />
        </span>
      </div>
      {e.source && <p className="mt-3 break-words text-[12px] leading-snug text-ink-faint">Source: {e.source}</p>}
    </figure>
  );
}

function StepButton({ icon, label, disabled, onClick }: { icon: IconName; label: string; disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="tap grid h-8 w-8 place-items-center rounded-full bg-surface-2 text-accent transition-opacity active:opacity-60 disabled:text-ink-faint disabled:opacity-50"
    >
      <Icon name={icon} size={14} strokeWidth={2} />
    </button>
  );
}

/* ------------------------------------------------------------------ pull */

/** A line from the article itself, set large to slow the eye down — the
 *  pull quote of a magazine page. Never a quotation from someone else. */
export function Pull({ text }: { text: string }) {
  return (
    <figure className="!my-7 px-1" aria-hidden>
      <span className="block h-[3px] w-8 rounded-full bg-accent" />
      <p className="mt-3 break-words text-[22px] font-medium leading-[1.3] tracking-[-0.01em] text-ink"><Inline text={text} /></p>
    </figure>
  );
}

/* -------------------------------------------------------------- evidence */

const EVIDENCE: { key: keyof GuideEvidence; label: string; icon: IconName; tone: string }[] = [
  { key: "settled", label: "Settled", icon: "check-circle", tone: "text-matcha" },
  { key: "revised", label: "Revised", icon: "refresh", tone: "text-gold" },
  { key: "open", label: "Still argued", icon: "callout", tone: "text-ai" },
];

/** What the evidence supports, kept apart from what's been revised and
 *  what's still argued — so a confident sentence elsewhere in the read
 *  isn't mistaken for the last word. */
export function Evidence({ evidence: e }: { evidence: GuideEvidence }) {
  return (
    <section className="border-y border-line py-4" aria-label="What's known">
      <p className="text-[15px] font-medium leading-snug text-ink">What’s known</p>
      <div className="mt-2.5 space-y-3">
        {EVIDENCE.filter((g) => e[g.key]?.length).map((g) => (
          <div key={g.key}>
            <p className={`flex items-center gap-1.5 text-[13px] ${g.tone}`}>
              <Icon name={g.icon} size={15} strokeWidth={1.9} />
              {g.label}
            </p>
            <ul className="mt-1 space-y-1.5 pl-[21px]">
              {e[g.key]!.map((t) => (
                <li key={t} className="break-words text-[15px] leading-[1.45] text-ink"><Inline text={t} /></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- compare */

/** Two things, row by row. On a phone each row's label sits over its two
 *  answers, side by side, so neither column gets squeezed; on a wider
 *  screen it's a three-column table. */
export function Compare({ compare: c }: { compare: GuideCompare }) {
  return (
    <figure className="border-y border-line">
      {c.title && <figcaption className="pt-4 text-[15px] font-medium leading-snug text-ink">{c.title}</figcaption>}
      <div className="grid grid-cols-2 gap-3 pb-2 pt-3 sm:grid-cols-[7.5rem_1fr_1fr]">
        <span className="hidden sm:block" />
        <span className="text-[15px] font-medium text-ink">{c.a}</span>
        <span className="text-[15px] font-medium text-ink">{c.b}</span>
      </div>
      <dl>
        {c.rows.map((r) => (
          <div key={r.label} className="grid grid-cols-2 gap-x-3 border-t border-line py-2.5 sm:grid-cols-[7.5rem_1fr_1fr]">
            <dt className="col-span-2 mb-0.5 text-[13px] text-ink-faint sm:col-span-1 sm:mb-0 sm:pt-px">{r.label}</dt>
            <dd className="min-w-0 break-words text-[15px] leading-[1.4] text-ink"><Inline text={r.a} /></dd>
            <dd className="min-w-0 break-words text-[15px] leading-[1.4] text-ink"><Inline text={r.b} /></dd>
          </div>
        ))}
      </dl>
    </figure>
  );
}

/* --------------------------------------------------------------- figures */

/** Two photos side by side — a comparison, or one thing seen twice — each
 *  with its own caption and credit. */
export function Figures({ photos }: { photos: GuidePhoto[] }) {
  return (
    <div className="-mx-1 grid grid-cols-2 gap-2">
      {photos.map((p) => {
        const free = p.license === "CC0" || p.license === "Public domain";
        return (
          <figure key={p.src} className="min-w-0">
            <img
              src={p.src}
              alt={p.alt}
              width={p.w}
              height={p.h}
              loading="lazy"
              decoding="async"
              className="block aspect-[4/5] w-full rounded-[10px] bg-surface-2 object-cover"
            />
            <figcaption className="mt-1.5 px-0.5">
              {p.caption && <span className="block break-words text-[13px] leading-snug text-ink-soft"><Inline text={p.caption} /></span>}
              <a href={p.url} target="_blank" rel="noreferrer" className="mt-0.5 block break-words text-[11px] leading-snug text-ink-faint">
                {p.author} · {p.license}{free ? "" : ", resized"}
              </a>
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}
