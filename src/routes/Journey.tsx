import { useState, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Page, PageHeader } from "@/components/Page";
import { Missing } from "@/components/Missing";
import { Section } from "@/components/Section";
import { InsetRow, INSET_DIVIDER } from "@/components/InsetRow";
import { Editable } from "@/components/Editable";
import { MoneyField } from "@/components/MoneyField";
import { RichNote } from "@/components/RichNote";
import { Icon, type IconName } from "@/components/Icon";
import { IconTile } from "@/components/IconTile";
import { RowDeleteButton } from "@/components/RowDeleteButton";
import { SwipeToDelete } from "@/components/SwipeToDelete";
import { ConfirmButton } from "@/components/ConfirmButton";
import { useData, lookups } from "@/lib/data";
import { useApp, undoable } from "@/store/useApp";
import { useReadOnly } from "@/lib/readonly";
import { fmtDate, plural, segEndpoints } from "@/lib/dates";
import { clockOf, fmtDuration, fmtMinutes, localMinutes } from "@/lib/time";
import { MODE_LABEL, MODE_ICON, MODE_TONE } from "@/lib/transport";
import { journeyFare, fmtMoney, cleanAmount, fmtFare } from "@/lib/cost";
import { splitRoute, joinRoute, JOURNEY_KIND_LABEL } from "@/lib/journey";
import { Arrow, RouteLabel } from "@/components/RouteLabel";
import type { Journey as JourneyT, JourneyKind, Segment, TransportMode } from "@/core/types";

const MODES: TransportMode[] = ["flight", "train", "bus", "ferry", "car", "taxi", "subway", "walk"];
const KINDS: JourneyKind[] = ["arrival", "transfer", "departure"];
const rid = () => Math.random().toString(36).slice(2, 8);

/** In edit mode, a fare calculated from the hops showed a blank input with no
 *  hint of the total behind it. Show the derived sum (same as read-only) until
 *  tapped; only then does it drop to a real, editable amount. Once the trip
 *  fare's overridden by hand, the field just stays a normal MoneyField. */
function TotalFareField({
  j,
  fareDerived,
  fareText,
  onAmount,
  onCurrency,
}: {
  j: JourneyT;
  fareDerived: boolean;
  fareText: string;
  onAmount: (v: string) => void;
  onCurrency: (c: string | undefined) => void;
}) {
  const [overriding, setOverriding] = useState(false);
  if (fareDerived && !overriding) {
    return (
      <button type="button" onClick={() => setOverriding(true)} className="value text-right tabular-nums">
        {fareText}
        <span className="ml-2 font-normal text-ink-faint">from hops</span>
      </button>
    );
  }
  return (
    <MoneyField
      label="Total fare"
      amount={j.fare ?? ""}
      currency={j.fareCurrency}
      onAmount={onAmount}
      onCurrency={onCurrency}
    />
  );
}

export default function Journey() {
  const data = useData();
  const { id } = useParams();
  const navigate = useNavigate();
  const updateEntity = useApp((s) => s.updateEntity);
  const removeEntity = useApp((s) => s.removeEntity);
  const ro = useReadOnly();
  if (!data) return null;

  const j = lookups(data).journey(id);
  if (!j)
    return <Missing title="No journey here" body="That journey isn’t part of this trip." to="/logbook/getting-around" cta="See all journeys" />;

  const patch = (p: Partial<JourneyT>) => updateEntity<JourneyT>("journeys", j.id, p);
  const route = splitRoute(j.label);
  const setSeg = (i: number, sp: Partial<Segment>) => patch({ segments: j.segments.map((s, k) => (k === i ? { ...s, ...sp } : s)) });
  const loc = data.config.locale;
  const primary = (data.config.currencies ?? []).filter(Boolean)[0] ?? "";

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

      {(j.gmapsDirections || fareText || !ro) && (
        <Section className="mt-5">
          <ul>
            {j.gmapsDirections && (
              <li className={INSET_DIVIDER}>
                <a href={j.gmapsDirections} target="_blank" rel="noopener" className="flex items-center justify-between gap-3 px-3.5 py-3">
                  <span className="flex items-center gap-2 text-[0.9375rem] text-accent">
                    <Icon name="map" size={15} /> Directions in Google Maps
                  </span>
                  <Icon name="chevron" size={14} className="-mr-1 shrink-0 text-ink-faint" />
                </a>
              </li>
            )}
            {(fareText || !ro) && (
              <InsetRow label="Total fare">
                {ro ? (
                  <>
                    {fareText || "—"}
                    {fareDerived && <span className="ml-2 font-normal text-ink-faint">from hops</span>}
                  </>
                ) : (
                  <TotalFareField
                    j={j}
                    fareDerived={fareDerived}
                    fareText={fareText}
                    onAmount={(v) => patch({ fare: cleanAmount(v) || undefined })}
                    onCurrency={(c) => patch({ fareCurrency: c })}
                  />
                )}
              </InsetRow>
            )}
          </ul>
        </Section>
      )}

      <div className="mt-6 space-y-6">
      {(!ro || j.segments.length > 0) && (
        <section>
        <div className="mb-2 flex items-baseline justify-between px-1">
          <h2 className="eyebrow flex items-center gap-1.5 text-ink-faint">
            <Icon name="itinerary" size={12} className="-translate-y-px" /> Hops
          </h2>
          {!ro && (
            <button
              onClick={() => {
                const l = j.segments.at(-1);
                patch({ segments: [...j.segments, { id: crypto.randomUUID?.() ?? `seg-${rid()}`, mode: l?.mode ?? "train", from: l?.to ?? "", to: "", fromTz: l?.toTz, toTz: l?.toTz }] });
              }}
              className="action text-xs"
            >
              <Icon name="plus" size={13} /> Add
            </button>
          )}
        </div>
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
                <span className="row-value">{node}</span>
              </div>
            ) : null;

          // read-only: the filled-in details as a compact icon strip
          type Cell = { icon: IconName; label: string; value: string };
          const stripCells: Cell[] = ro
            ? [
                s.carrier && { icon: MODE_ICON[s.mode], label: s.mode === "flight" ? "Airline" : "Carrier", value: s.carrier },
                s.service && { icon: "route" as const, label: s.mode === "flight" ? "Flight" : "Service", value: s.service },
                s.platform && { icon: "door" as const, label: "Platform", value: s.platform },
                s.seat && { icon: "seat" as const, label: "Seat", value: s.seat },
                s.bookingRef && { icon: "copy" as const, label: "Ref", value: s.bookingRef },
                s.fare && { icon: "ticket" as const, label: "Fare", value: fmtFare(s.fare, s.fareCurrency || primary) },
              ].filter((c): c is Cell => !!c)
            : [];

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
                <MoneyField
                  label="Fare"
                  amount={s.fare ?? ""}
                  currency={s.fareCurrency}
                  onAmount={(v) => setSeg(i, { fare: cleanAmount(v) || undefined })}
                  onCurrency={(c) => setSeg(i, { fareCurrency: c })}
                />
              ),
              show("fare", s.fare),
            ),
          ].filter(Boolean);

          const dotBg = MODE_TONE[s.mode] === "matcha" ? "bg-matcha" : "bg-ai";
          const pillCls =
            MODE_TONE[s.mode] === "matcha" ? "bg-matcha/[0.14] text-matcha" : "bg-ai/[0.14] text-ai";

          return (
            <div key={s.id} className="group">
              <Section>
              <SwipeToDelete undoLabel="Hop removed" onDelete={ro ? undefined : () => patch({ segments: j.segments.filter((_, k) => k !== i) })} label="Remove hop">
              <div className="p-4">
                {/* header — mode tile, route, and (read-only) the service as a pill */}
                <div className="flex items-start gap-2.5">
                  <IconTile size="md" name={MODE_ICON[s.mode]} tone={MODE_TONE[s.mode]} />
                  <div className="min-w-0 flex-1">
                    {ro ? (
                      <p className="eyebrow text-ink-faint">{MODE_LABEL[s.mode]}</p>
                    ) : (
                      <Editable
                        as="select"
                        label="Mode"
                        value={s.mode}
                        options={MODES.map((m) => ({ value: m, label: MODE_LABEL[m] }))}
                        onCommit={(v) => setSeg(i, v === "flight" ? { mode: "flight", platform: undefined } : { mode: v as TransportMode })}
                        className="eyebrow"
                      />
                    )}
                    <p className="mt-0.5 font-display text-[1.0625rem] leading-snug text-ink">
                      {ro ? (
                        <>{s.from || "—"}<Arrow className="mx-1.5" />{s.to || "—"}</>
                      ) : (
                        <>
                          <Editable label="From" value={s.from} placeholder="From" onCommit={(v) => setSeg(i, { from: v })} />
                          <Arrow className="mx-1.5" />
                          <Editable label="To" value={s.to} placeholder="To" onCommit={(v) => setSeg(i, { to: v })} />
                        </>
                      )}
                    </p>
                  </div>
                  {ro && s.service && (
                    <span className={`shrink-0 rounded-[8px] px-2.5 py-0.5 text-xs font-medium ${pillCls}`}>{s.service}</span>
                  )}
                  {(s.depart || !ro) && (
                    <div className="flex shrink-0 items-center gap-0.5">
                      {s.depart && (
                        <button
                          type="button"
                          onClick={() => {
                            // open synchronously in the same click (see Day.tsx's
                            // addToGoogleCalendar) so the popup blocker doesn't
                            // treat the dynamic import's resolution as unrequested
                            const w = window.open("", "_blank");
                            import("@/lib/ics").then(({ googleCalendarUrlForSegment }) => {
                              const url = googleCalendarUrlForSegment(s, data.config.tripTimeZone);
                              if (!w) return;
                              if (url) w.location.href = url; else w.close();
                            });
                          }}
                          aria-label={`Add ${s.from} to ${s.to} to Google Calendar`}
                          title="Add to Google Calendar"
                          className="tap shrink-0 p-1 text-ink-faint opacity-60 transition-opacity hover:text-accent active:text-accent [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100"
                        >
                          <Icon name="calendar" size={14} />
                        </button>
                      )}
                      {!ro && <RowDeleteButton undoLabel="Hop removed" onClick={() => patch({ segments: j.segments.filter((_, k) => k !== i) })} label="Remove hop" />}
                    </div>
                  )}
                </div>

                {/* times, joined by one connector line with the duration above it */}
                <div className="mt-3.5 flex items-start gap-3">
                  <div className="shrink-0">
                    <span className="font-display text-[1.3125rem] font-medium tabular-nums leading-none">
                      {ro ? (
                        clockOf(s.depart) || "--:--"
                      ) : (
                        <Editable as="time" label="Depart time" value={clockOf(s.depart)} placeholder="--:--" onCommit={(v) => setSeg(i, { depart: mergeTime(s.depart, j.date, v) })} />
                      )}
                      {ep.depart.zone && <span className="ml-1 align-middle text-xs text-ink-faint">{ep.depart.zone}</span>}
                    </span>
                    {ro && s.from && <p className="meta mt-1 text-ink-faint">{s.from}</p>}
                  </div>
                  <div className="relative mt-[0.6rem] h-2 flex-1">
                    <span className="absolute inset-x-[3px] top-1/2 h-px -translate-y-1/2 bg-line" />
                    <span className={`absolute left-0 top-1/2 h-[5px] w-[5px] -translate-y-1/2 rounded-full ${dotBg}`} />
                    <span className={`absolute right-0 top-1/2 h-[5px] w-[5px] -translate-y-1/2 rounded-full ${dotBg}`} />
                    {dur && (
                      <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-[1.15rem] whitespace-nowrap text-[0.75rem] text-ink-soft">
                        {dur}
                      </span>
                    )}
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="font-display text-[1.3125rem] font-medium tabular-nums leading-none">
                      {ro ? (
                        clockOf(s.arrive) || "--:--"
                      ) : (
                        <Editable as="time" label="Arrive time" value={clockOf(s.arrive)} placeholder="--:--" onCommit={(v) => setSeg(i, { arrive: mergeTime(s.arrive, j.date, v) })} />
                      )}
                      {ep.arrive.zone && <span className="ml-1 align-middle text-xs text-ink-faint">{ep.arrive.zone}</span>}
                    </span>
                    {ro && s.to && <p className="meta mt-1 text-ink-faint">{s.to}</p>}
                  </div>
                </div>
                {offDay && <p className="meta mt-1.5 text-center text-ink-faint">{offDay}</p>}

                {/* details — an icon strip read-only, editable rows when editing */}
                {ro
                  ? stripCells.length > 0 && (
                      <div className="mt-3.5 overflow-hidden rounded-[10px] bg-surface-2">
                        <div className="flex">
                          {stripCells.map((c, ci) => (
                            <div
                              key={c.label}
                              className={`relative flex-1 px-1.5 py-3 text-center ${ci > 0 ? "before:absolute before:left-0 before:top-[22%] before:bottom-[22%] before:w-px before:bg-line before:content-['']" : ""}`}
                            >
                              <IconTile ghost size="sm" name={c.icon} className="mx-auto mb-1.5" />
                              <div className="eyebrow text-ink-faint">{c.label}</div>
                              <div className="value mt-0.5 text-[0.9375rem] leading-tight [overflow-wrap:anywhere]">{c.value}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  : rows.length > 0 && <div className="mt-3 border-t border-line pt-0.5">{rows}</div>}
              </div>
              </SwipeToDelete>
              </Section>
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
        </section>
      )}

      {(j.notes || !ro) && (
        <Section icon="list" title="Notes">
          <div className="note px-3.5 py-3">
            <RichNote value={j.notes ?? ""} onCommit={(v) => patch({ notes: v || undefined })} placeholder="Backup routes, reminders…" />
          </div>
        </Section>
      )}

      {!ro && (
        <Section>
          <ConfirmButton
            onConfirm={() => undoable("Journey deleted", () => { removeEntity("journeys", j.id); navigate("/logbook"); })}
            label="Delete journey"
            className="w-full justify-center px-3.5 py-3 text-sm text-danger"
          >
            Delete journey
          </ConfirmButton>
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
