import type { ReactNode } from "react";
import { useParams } from "react-router-dom";
import { Page, PageHeader } from "@/components/Page";
import { Missing } from "@/components/Missing";
import { Section } from "@/components/Section";
import { Editable } from "@/components/Editable";
import { RichNote } from "@/components/RichNote";
import { Icon } from "@/components/Icon";
import { RowDeleteButton } from "@/components/RowDeleteButton";
import { useData, lookups } from "@/lib/data";
import { useApp } from "@/store/useApp";
import { useReadOnly } from "@/lib/readonly";
import { fmtDate, plural, segEndpoints } from "@/lib/dates";
import { clockOf, fmtDuration, fmtMinutes, localMinutes } from "@/lib/time";
import { MODE_LABEL, MODE_ICON, MODE_TONE } from "@/lib/transport";
import { journeyFare, fmtMoney, cleanAmount, fmtFare, currencySymbol } from "@/lib/cost";
import { splitRoute, joinRoute, routeStops, JOURNEY_KIND_LABEL } from "@/lib/journey";
import type { Journey as JourneyT, JourneyKind, Segment, TransportMode } from "@/core/types";

const MODES: TransportMode[] = ["flight", "train", "bus", "ferry", "car", "taxi", "subway", "walk"];
const KINDS: JourneyKind[] = ["arrival", "transfer", "departure"];
const rid = () => Math.random().toString(36).slice(2, 8);

/** the muted card treatment for each mode tone — literal strings so Tailwind
 *  keeps them. One tint per hop card: a thin left rule + a wash + the mode label. */
const TONE_CLASS: Record<string, { card: string; text: string }> = {
  accent: { card: "border-l-accent/70 bg-accent/[0.05]", text: "text-accent" },
  ai: { card: "border-l-ai/70 bg-ai/[0.05]", text: "text-ai" },
  gold: { card: "border-l-gold/70 bg-gold/[0.06]", text: "text-gold" },
  matcha: { card: "border-l-matcha/70 bg-matcha/[0.06]", text: "text-matcha" },
};

/** The from → to connector. One weight everywhere a route shows — always Inter,
 *  never the page's serif, so the Journey screen stops mixing arrow styles. */
function Arrow({ className = "" }: { className?: string }) {
  return <span className={`font-sans font-normal text-ink-faint ${className}`}>→</span>;
}

/** A fare amount + its currency. With one trip currency the code is just the
 *  symbol; with two or more it's a picker. Absent picked currency = primary. */
function FareField({ amount, currency, currencies, primary, onAmount, onCurrency }: {
  amount: string;
  currency: string | undefined;
  currencies: string[];
  primary: string;
  onAmount: (v: string) => void;
  onCurrency: (c: string | undefined) => void;
}) {
  const sym = currencySymbol(primary);
  return (
    <span className="inline-flex items-baseline gap-1.5">
      {currencies.length >= 2 ? (
        <select
          value={currency ?? primary}
          onChange={(e) => onCurrency(e.target.value === primary ? undefined : e.target.value)}
          aria-label="Currency"
          className="cursor-pointer bg-transparent text-[0.8125rem] text-ink-soft focus:outline-none"
        >
          {[...new Set([...currencies, currency || primary])].filter(Boolean).map((cc) => (
            <option key={cc} value={cc}>{cc}</option>
          ))}
        </select>
      ) : sym && (!amount || /^[\d.,]+$/.test(amount)) ? (
        <span className="text-[0.8125rem] text-ink-faint">{sym}</span>
      ) : null}
      <Editable as="number" label="Fare" value={amount} placeholder="—" onCommit={onAmount} />
    </span>
  );
}

/** A stored "A → B" label with the arrow rendered as markup, not a baked char. */
function RouteLabel({ label }: { label: string }) {
  const stops = routeStops(label);
  if (stops.length < 2) return <>{label}</>;
  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-2">
      {stops.map((s, i) => (
        <span key={i} className="inline-flex items-baseline gap-x-2">
          {i > 0 && <Arrow />}
          {s}
        </span>
      ))}
    </span>
  );
}

export default function Journey() {
  const data = useData();
  const { id } = useParams();
  const updateEntity = useApp((s) => s.updateEntity);
  const ro = useReadOnly();
  if (!data) return null;

  const j = lookups(data).journey(id);
  if (!j)
    return <Missing title="No journey here" body="That journey isn’t part of this trip." to="/logbook?s=getting+around" cta="See all journeys" />;

  const patch = (p: Partial<JourneyT>) => updateEntity<JourneyT>("journeys", j.id, p);
  const route = splitRoute(j.label);
  const setSeg = (i: number, sp: Partial<Segment>) => patch({ segments: j.segments.map((s, k) => (k === i ? { ...s, ...sp } : s)) });
  const loc = data.config.locale;
  const currencies = (data.config.currencies ?? []).filter(Boolean);
  const primary = currencies[0] ?? "";

  const first = j.segments[0];
  const last = j.segments.at(-1);
  const total = fmtDuration(first?.depart, last?.arrive ?? last?.depart);
  const changes = Math.max(0, j.segments.length - 1);

  // the fare adds up on its own — a manual `j.fare` wins, otherwise the hops
  const fareLines = journeyFare(j, primary);
  const fareText = fareLines.map((m) => fmtMoney(m.amount, m.currency)).join("  +  ");
  const fareDerived = !j.fare?.trim() && fareLines.length > 0;

  return (
    <Page>
      <PageHeader
        back="/logbook"
        eyebrow={
          <span className="flex items-center gap-1.5">
            {ro ? (
              JOURNEY_KIND_LABEL[j.kind]
            ) : (
              <Editable
                as="select"
                label="Journey type"
                value={j.kind}
                options={KINDS.map((k) => ({ value: k, label: JOURNEY_KIND_LABEL[k] }))}
                onCommit={(v) => patch({ kind: v as JourneyKind })}
              />
            )}
            {j.date && <span>· {fmtDate(j.date, loc, { weekday: "long", day: "numeric", month: "long" })}</span>}
          </span>
        }
        title={
          ro ? (
            <RouteLabel label={j.label} />
          ) : (
            <span className="inline-flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <Editable label="From" value={route.from} placeholder="From" onCommit={(v) => patch({ label: joinRoute(v, route.to) || j.label })} />
              <Arrow />
              <Editable label="To" value={route.to} placeholder="To" onCommit={(v) => patch({ label: joinRoute(route.from, v) || j.label })} />
            </span>
          )
        }
        meta={
          j.segments.length > 0 &&
          [total && `${total} total`, plural(j.segments.length, "hop"), changes > 0 && plural(changes, "change")]
            .filter(Boolean)
            .join("  ·  ")
        }
      />

      {j.gmapsDirections && (
        <a href={j.gmapsDirections} target="_blank" rel="noopener" className="action mt-4">
          <Icon name="map" size={14} /> Directions in Google Maps
        </a>
      )}

      {(fareText || !ro) && (
        <div className="mt-4 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
          <span className="row-label">Total fare</span>
          <span className="value">{fareText || "—"}</span>
          {fareDerived && <span className="meta text-ink-faint">summed from the hops</span>}
          {!ro && (
            <span className="meta">
              <FareField
                amount={j.fare ?? ""}
                currency={j.fareCurrency}
                currencies={currencies}
                primary={primary}
                onAmount={(v) => patch({ fare: cleanAmount(v) || undefined })}
                onCurrency={(c) => patch({ fareCurrency: c })}
              />
            </span>
          )}
        </div>
      )}

      <div className="mt-8 space-y-3.5">
      {(!ro || j.segments.length > 0) && (
        <Section
          icon="itinerary"
          title="Hops"
          action={
            !ro && (
              <button
                onClick={() => {
                  const l = j.segments.at(-1);
                  patch({ segments: [...j.segments, { id: `seg-${rid()}`, mode: l?.mode ?? "train", from: l?.to ?? "", to: "", fromTz: l?.toTz, toTz: l?.toTz }] });
                }}
                className="action text-xs"
              >
                <Icon name="plus" size={13} /> Add
              </button>
            )
          }
        >
        <div className="space-y-2.5">
        {j.segments.length === 0 && <p className="text-sm text-ink-faint">No hops yet.</p>}
        {j.segments.map((s, i) => {
          const next = j.segments[i + 1];
          const rawGap = next && s.arrive && next.depart ? localMinutes(next.depart)! - localMinutes(s.arrive)! : null;
          // A negative gap means the change runs past midnight (times often lack a
          // date and get merged onto the journey day). Wrap into the next day.
          const overnight = rawGap != null && rawGap < 0;
          const gap = rawGap == null ? null : overnight ? rawGap + 1440 : rawGap;
          const dur = fmtDuration(s.depart, s.arrive);
          const ep = segEndpoints(s, j.date, loc);
          const offDay = [
            ep.depart.date && `departs ${ep.depart.date}`,
            ep.arrive.date && `arrives ${ep.arrive.date}`,
          ]
            .filter(Boolean)
            .join("  ·  ");
          const tone = TONE_CLASS[MODE_TONE[s.mode]];
          const foot = s.mode === "walk";
          // which fields are worth offering for this mode when editing — an
          // already-filled value always shows regardless
          const rel = {
            carrier: !foot,
            service: !foot,
            platform: s.mode === "train" || s.mode === "subway",
            seat: s.mode === "train" || s.mode === "bus" || s.mode === "flight" || s.mode === "ferry",
            bookingRef: !foot,
            fare: !foot,
          };
          const show = (k: keyof typeof rel, filled: unknown) => (!ro && rel[k]) || !!filled;

          const detail = (label: string, node: ReactNode, on: boolean) =>
            on ? (
              <div className="row" key={label}>
                <span className="row-label">{label}</span>
                <span className="row-value value">{node}</span>
              </div>
            ) : null;

          const rows = [
            detail(
              s.mode === "flight" ? "Airline" : "Carrier",
              <Editable label={s.mode === "flight" ? "Airline" : "Carrier"} value={s.carrier ?? ""} placeholder="—" onCommit={(v) => setSeg(i, { carrier: v || undefined })} />,
              show("carrier", s.carrier),
            ),
            detail(
              s.mode === "flight" ? "Flight no." : "Service",
              <Editable label={s.mode === "flight" ? "Flight number" : "Service"} value={s.service ?? ""} placeholder="—" onCommit={(v) => setSeg(i, { service: v || undefined })} />,
              show("service", s.service),
            ),
            detail("Platform", <Editable label="Platform" value={s.platform ?? ""} placeholder="—" onCommit={(v) => setSeg(i, { platform: v || undefined })} />, show("platform", s.platform)),
            detail("Seat", <Editable label="Seat" value={s.seat ?? ""} placeholder="—" onCommit={(v) => setSeg(i, { seat: v || undefined })} />, show("seat", s.seat)),
            detail("Booking ref", <Editable label="Booking reference" value={s.bookingRef ?? ""} placeholder="—" onCommit={(v) => setSeg(i, { bookingRef: v || undefined })} />, show("bookingRef", s.bookingRef)),
            detail(
              "Fare",
              ro ? fmtFare(s.fare, s.fareCurrency || primary) : (
                <FareField
                  amount={s.fare ?? ""}
                  currency={s.fareCurrency}
                  currencies={currencies}
                  primary={primary}
                  onAmount={(v) => setSeg(i, { fare: cleanAmount(v) || undefined })}
                  onCurrency={(c) => setSeg(i, { fareCurrency: c })}
                />
              ),
              show("fare", s.fare),
            ),
          ].filter(Boolean);

          return (
            <div key={s.id}>
              <div className={`group rounded border border-line border-l-2 py-3 pl-3.5 pr-3 ${tone.card}`}>
                {/* mode */}
                <p className={`flex items-center gap-1.5 ${tone.text}`}>
                  <Icon name={MODE_ICON[s.mode]} size={15} className="shrink-0" />
                  {ro ? (
                    <span className="text-2xs font-medium uppercase tracking-[0.12em]">{MODE_LABEL[s.mode]}</span>
                  ) : (
                    <Editable
                      as="select"
                      label="Mode"
                      value={s.mode}
                      options={MODES.map((m) => ({ value: m, label: MODE_LABEL[m] }))}
                      onCommit={(v) => setSeg(i, v === "flight" ? { mode: "flight", platform: undefined } : { mode: v as TransportMode })}
                      className="text-2xs font-medium uppercase tracking-[0.12em]"
                    />
                  )}
                </p>

                {/* route */}
                <p className="lead mt-1.5">
                  <Editable label="From" value={s.from} placeholder="From" onCommit={(v) => setSeg(i, { from: v })} />
                  <Arrow className="mx-2" />
                  <Editable label="To" value={s.to} placeholder="To" onCommit={(v) => setSeg(i, { to: v })} />
                </p>

                {/* times on a line, duration on a rule beneath */}
                <div className="mt-3 flex items-baseline justify-between gap-3">
                  <span className="font-display text-2xl tabular-nums leading-none">
                    <Editable as="time" label="Depart time" value={clockOf(s.depart)} placeholder="--:--" onCommit={(v) => setSeg(i, { depart: mergeTime(s.depart, j.date, v) })} />
                    {ep.depart.zone && <span className="ml-1 align-middle text-xs text-ink-faint">{ep.depart.zone}</span>}
                  </span>
                  <span className="font-display text-2xl tabular-nums leading-none">
                    <Editable as="time" label="Arrive time" value={clockOf(s.arrive)} placeholder="--:--" onCommit={(v) => setSeg(i, { arrive: mergeTime(s.arrive, j.date, v) })} />
                    {ep.arrive.zone && <span className="ml-1 align-middle text-xs text-ink-faint">{ep.arrive.zone}</span>}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2.5">
                  <span className="h-px flex-1 bg-line" />
                  <span className="meta shrink-0">{dur || "—"}</span>
                  <span className="h-px flex-1 bg-line" />
                </div>
                {offDay && <p className="meta mt-1 text-center text-ink-faint">{offDay}</p>}

                {/* secondary details as label ↔ value rows */}
                {rows.length > 0 && <div className="mt-3 border-t border-line pt-0.5">{rows}</div>}
                {!ro && (
                  <div className="mt-2 flex justify-end">
                    <RowDeleteButton onClick={() => patch({ segments: j.segments.filter((_, k) => k !== i) })} label="Remove hop" />
                  </div>
                )}
              </div>
              {next && (
                <p className="ml-3.5 border-l-2 border-dashed border-line py-1.5 pl-3 text-xs text-ink-soft">
                  {gap != null ? (
                    <span className={!overnight && gap < 20 ? "font-medium text-ink" : ""}>
                      {fmtMinutes(gap)} to change{s.to ? ` at ${s.to}` : ""}{overnight ? " — overnight" : gap < 20 ? " — tight" : ""}
                    </span>
                  ) : (
                    <span>change{s.to ? ` at ${s.to}` : ""}</span>
                  )}
                </p>
              )}
            </div>
          );
        })}
        </div>
        </Section>
      )}

      {(j.notes || !ro) && (
        <Section icon="list" title="Notes">
          <div className="note">
            <RichNote value={j.notes ?? ""} onCommit={(v) => patch({ notes: v || undefined })} placeholder="Backup routes, reminders…" />
          </div>
        </Section>
      )}
      </div>
    </Page>
  );
}

function mergeTime(existing: string | undefined, fallbackDate: string | undefined, hhmm: string): string | undefined {
  if (!hhmm) return undefined;
  const date = existing?.split("T")[0] || fallbackDate || new Date().toISOString().slice(0, 10);
  return `${date}T${hhmm}`;
}
