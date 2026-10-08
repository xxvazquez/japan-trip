import { useRef, type ReactNode } from "react";
import { useParams } from "react-router-dom";
import { Page, PageHeader } from "@/components/Page";
import { useLeavePage } from "@/components/NavBar";
import { Missing } from "@/components/Missing";
import { Section } from "@/components/Section";
import { InsetRow, INSET_DIVIDER } from "@/components/InsetRow";
import { Editable } from "@/components/Editable";
import { MoneyField } from "@/components/MoneyField";
import { RichNote } from "@/components/RichNote";
import { Icon, type IconName } from "@/components/Icon";
import { usePersistedOpen } from "@/lib/collapse";
import { IconTile } from "@/components/IconTile";
import { RowDeleteButton } from "@/components/RowDeleteButton";
import { SwipeToDelete } from "@/components/SwipeToDelete";
import { ConfirmButton } from "@/components/ConfirmButton";
import { useData, lookups } from "@/lib/data";
import { useApp, undoable } from "@/store/useApp";
import { useReadOnly } from "@/lib/readonly";
import { addDays, daysBetween, fmtDate, journeyDepartDate, journeyOffDay, plural, segEndpoints, todayISO } from "@/lib/dates";
import { clockOf, fmtClock, fmtDuration, fmtMinutes, minutesBetween, parseLocal } from "@/lib/time";
import { MODE_LABEL, MODE_ICON, MODE_TONE } from "@/lib/transport";
import { arrivesBeforeDeparture } from "@/lib/ics";
import { journeyFare, hopsPriced, fmtMoney, cleanAmount, fmtFare } from "@/lib/cost";
import { splitRoute, joinRoute, JOURNEY_KIND_LABEL } from "@/lib/journey";
import { Arrow, RouteLabel } from "@/components/RouteLabel";
import type { Day, Journey as JourneyT, JourneyKind, Segment, TransportMode } from "@/core/types";

const MODES: TransportMode[] = ["flight", "train", "bus", "ferry", "car", "taxi", "subway", "walk"];
const KINDS: JourneyKind[] = ["arrival", "transfer", "departure"];
const rid = () => Math.random().toString(36).slice(2, 8);

export default function Journey() {
  const data = useData();
  const { id } = useParams();
  const leave = useLeavePage();
  const updateEntity = useApp((s) => s.updateEntity);
  const removeEntity = useApp((s) => s.removeEntity);
  const ro = useReadOnly();
  // Hops folds like every other titled section (its hops are separate
  // cards, so it can't be a `Section` itself)
  const [hopsOpen, setHopsOpen] = usePersistedOpen("hops", true);
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
  // dated by when it leaves, same as the Journeys list — an overnight
  // flight is attached to the day it lands
  const day = journeyDepartDate(j);
  const total = fmtDuration(first?.depart, last?.arrive ?? last?.depart, first?.fromTz, last?.arrive ? last?.toTz : last?.fromTz);
  const changes = Math.max(0, j.segments.length - 1);

  // the total adds itself up from the hops' fares; only a journey with no
  // priced hop takes a hand-entered total (one ticket for the whole trip)
  const fareLines = journeyFare(j, primary);
  const fareText = fareLines.map((m) => fmtMoney(m.amount, m.currency)).join(" + ");
  const fareDerived = hopsPriced(j);
  const onDays = data.days.filter((d) => d.journeyIds?.includes(j.id));
  const departDay = day ? data.days.find((d) => d.date === day) : undefined;

  return (
    <Page>
      <PageHeader
        back="/logbook/getting-around"
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
            {day && <span>· {fmtDate(day, loc, { weekday: "long", day: "numeric", month: "long" })}</span>}
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

      {(j.gmapsDirections || fareText || !ro || onDays.length > 0) && (
        <Section className="mt-5">
          <ul>
            {/* which day on Plan this journey sits on — and whether that
                matches when it actually runs */}
            {onDays.map((d) => (
              <InsetRow key={d.id} label="On Plan" to={`/day/${d.id}`}>
                <span className={journeyOffDay(j, d.date) ? "text-danger" : undefined}>
                  {fmtDate(d.date, loc)}
                  {journeyOffDay(j, d.date) && " · not its date"}
                </span>
              </InsetRow>
            ))}
            {onDays.length === 0 && !ro && (
              <InsetRow label="On Plan">
                {departDay ? (
                  <button
                    type="button"
                    onClick={() => updateEntity<Day>("days", departDay.id, { journeyIds: [...(departDay.journeyIds ?? []), j.id] })}
                    className="text-accent"
                  >
                    Add to {fmtDate(departDay.date, loc)}
                  </button>
                ) : (
                  <span className="text-ink-faint">Not on any day</span>
                )}
              </InsetRow>
            )}
            {j.gmapsDirections && (
              <li className={INSET_DIVIDER}>
                <a href={j.gmapsDirections} target="_blank" rel="noopener" className="flex items-center justify-between gap-3 px-3.5 py-3">
                  <span className="flex items-center gap-2 text-sm text-accent">
                    <Icon name="map" size={15} /> Directions in Google Maps
                  </span>
                  <Icon name="chevron" size={14} className="-mr-1 shrink-0 text-ink-faint" />
                </a>
              </li>
            )}
            {(fareText || !ro) && (
              <InsetRow label="Total fare">
                {ro || fareDerived ? (
                  <span className="tabular-nums">
                    {fareText || "—"}
                    {fareDerived && <span className="ml-2 text-ink-soft">from hops</span>}
                  </span>
                ) : (
                  <MoneyField
                    label="Total fare"
                    amount={j.fare ?? ""}
                    currency={j.fareCurrency}
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
        {/* the same quiet kicker every other section on the page uses; adding
            sits under the last hop, as a group's closing "Add …" row does */}
        <h2 className={`kicker flex items-center gap-1.5 px-1 ${hopsOpen ? "mb-1.5" : ""}`}>
          <button
            type="button"
            onClick={() => setHopsOpen((was) => !was)}
            aria-expanded={hopsOpen}
            className="tap -m-1 shrink-0 p-1 text-ink-faint transition-colors hover:text-ink-soft"
          >
            <Icon name="chevron" size={13} className={`transition-transform ${hopsOpen ? "rotate-90" : ""}`} />
            <span className="sr-only">{hopsOpen ? "Collapse" : "Expand"} section</span>
          </button>
          Hops
        </h2>
        <div className={`grid transition-[grid-template-rows] duration-300 ease-paper ${hopsOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="min-h-0 overflow-hidden">
        <div className="space-y-2.5">
        {j.segments.map((s, i) => {
          const next = j.segments[i + 1];
          const rawGap = next ? minutesBetween(s.arrive, next.depart, s.toTz, next.fromTz) : null;
          // A negative gap means the change runs past midnight (times often lack a
          // date and get merged onto the journey day). Wrap into the next day.
          const overnight = rawGap != null && rawGap < 0;
          const gap = rawGap == null ? null : overnight ? rawGap + 1440 : rawGap;
          const dur = fmtDuration(s.depart, s.arrive, s.fromTz, s.toTz);
          const ep = segEndpoints(s, day, loc);
          // the date each end falls on: a hop's own, else carried from the hop
          // before it (or the journey's day) so a new time lands on the right day
          const prevDate = parseLocal(j.segments[i - 1]?.arrive)?.date ?? parseLocal(j.segments[i - 1]?.depart)?.date;
          const departDate = parseLocal(s.depart)?.date;
          const arriveDate = parseLocal(s.arrive)?.date;
          const departFallback = departDate ?? prevDate ?? day ?? j.date;
          const arriveFallback = arriveDate ?? departFallback;
          // moving the departure day moves the arrival with it, so the hop keeps its length
          const setDepartDate = (v: string) => {
            if (!v) return;
            const delta = departDate ? daysBetween(departDate, v) : 0;
            setSeg(i, {
              depart: `${v}${clockOf(s.depart) ? `T${clockOf(s.depart)}` : ""}`,
              ...(arriveDate && delta ? { arrive: `${addDays(arriveDate, delta)}${clockOf(s.arrive) ? `T${clockOf(s.arrive)}` : ""}` } : {}),
            });
          };
          const setArriveDate = (v: string) => {
            if (v) setSeg(i, { arrive: `${v}${clockOf(s.arrive) ? `T${clockOf(s.arrive)}` : ""}` });
          };
          // the arrival day only shows when it isn't the departure day (an
          // overnight hop), or while editing a hop that already has an arrival
          const backwards = arrivesBeforeDeparture(s, data.config.tripTimeZone);
          const showArriveDate = !!arriveDate && (arriveDate !== departDate || !ro || backwards);
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
                      <p className="eyebrow text-ink-soft">{MODE_LABEL[s.mode]}</p>
                    ) : (
                      <Editable
                        as="select"
                        label="Mode"
                        value={s.mode}
                        options={MODES.map((m) => ({ value: m, label: MODE_LABEL[m] }))}
                        onCommit={(v) => setSeg(i, v === "flight" ? { mode: "flight", platform: undefined } : { mode: v as TransportMode })}
                        className="eyebrow tap"
                      />
                    )}
                    <p className="mt-0.5 font-display text-sm leading-snug text-ink">
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
                      {clockOf(s.depart) && (
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
                        fmtClock(clockOf(s.depart)) || "--:--"
                      ) : (
                        <Editable as="time" label="Depart time" value={clockOf(s.depart)} placeholder="--:--" onCommit={(v) => setSeg(i, { depart: mergeTime(s.depart, departFallback, v) })} />
                      )}
                      {ep.depart.zone && <span className="ml-1 align-middle text-xs text-ink-soft">{ep.depart.zone}</span>}
                    </span>
                    {(departDate || !ro) && (
                      <HopDate label="Departure date" value={departDate ?? ""} fallback={departFallback} loc={loc} ro={ro} onCommit={setDepartDate} />
                    )}
                    {ro && s.from && <p className="meta mt-1 text-ink-soft">{s.from}</p>}
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
                        fmtClock(clockOf(s.arrive)) || "--:--"
                      ) : (
                        <Editable as="time" label="Arrive time" value={clockOf(s.arrive)} placeholder="--:--" onCommit={(v) => setSeg(i, { arrive: mergeTime(s.arrive, arriveFallback, v) })} />
                      )}
                      {ep.arrive.zone && <span className="ml-1 align-middle text-xs text-ink-soft">{ep.arrive.zone}</span>}
                    </span>
                    {showArriveDate && (
                      <HopDate label="Arrival date" value={arriveDate} fallback={arriveDate} loc={loc} ro={ro} onCommit={setArriveDate} align="right" danger={backwards} />
                    )}
                    {ro && s.to && <p className="meta mt-1 text-ink-soft">{s.to}</p>}
                  </div>
                </div>

                {backwards && <p className="meta mt-1.5 text-right text-danger">Arrives before it leaves — check the date</p>}

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
                              <div className="eyebrow text-ink-soft">{c.label}</div>
                              <div className="value mt-0.5 text-sm leading-tight [overflow-wrap:anywhere]">{c.value}</div>
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
        {!ro && (
          <div className="overflow-hidden rounded-[12px] bg-surface">
            <button
              type="button"
              onClick={() => {
                // a new hop starts where the last one ended, by the same mode
                const l = j.segments.at(-1);
                patch({ segments: [...j.segments, { id: crypto.randomUUID?.() ?? `seg-${rid()}`, mode: l?.mode ?? "train", from: l?.to ?? "", to: "", fromTz: l?.toTz, toTz: l?.toTz }] });
              }}
              className="action w-full px-3.5 py-2.5 text-xs transition-colors duration-150 active:bg-ink/[0.07]"
            >
              <Icon name="plus" size={14} /> Add a hop
            </button>
          </div>
        )}
        </div>
        </div>
        </div>
        </section>
      )}

      {(j.notes || !ro) && (
        <Section title="Notes">
          <div className="note px-3.5 py-3">
            <RichNote value={j.notes ?? ""} onCommit={(v) => patch({ notes: v || undefined })} placeholder="Backup routes, reminders…" />
          </div>
        </Section>
      )}

      {!ro && (
        <Section>
          <ConfirmButton
            onConfirm={() => undoable("Journey deleted", () => { removeEntity("journeys", j.id); leave("/logbook/getting-around"); })}
            label="Delete journey"
            message="This journey and its hops will be deleted."
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

/** A hop end's date under its time — "Fri 30 Oct". Editing opens the native
 *  date picker (a transparent input over the label), never a text field. */
function HopDate({ label, value, fallback, loc, ro, onCommit, align = "left", danger = false }: {
  label: string;
  value: string;
  fallback?: string;
  loc: string;
  ro: boolean;
  onCommit: (v: string) => void;
  align?: "left" | "right";
  danger?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const shown = value || fallback;
  const text = shown ? fmtDate(shown, loc, { weekday: "short", day: "numeric", month: "short" }) : "Add date";
  const cls = `meta mt-1 block tabular-nums ${align === "right" ? "text-right" : ""} ${danger ? "!text-danger" : ""}`;
  if (ro) return <span className={cls}>{text}</span>;
  return (
    <span className={`${cls} relative ${value ? "" : "text-ink-faint"}`}>
      {text}
      <input
        ref={ref}
        type="date"
        aria-label={label}
        value={value || fallback || ""}
        onClick={() => { try { ref.current?.showPicker?.(); } catch { /* the tap itself opens it where showPicker isn't allowed */ } }}
        onChange={(e) => e.target.value !== value && onCommit(e.target.value)}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      />
    </span>
  );
}

function mergeTime(existing: string | undefined, fallbackDate: string | undefined, hhmm: string): string | undefined {
  if (!hhmm) return undefined;
  const date = existing?.split("T")[0] || fallbackDate || todayISO();
  return `${date}T${hhmm}`;
}
