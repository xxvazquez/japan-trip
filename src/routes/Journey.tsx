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
import { MODE_LABEL } from "@/lib/transport";
import { splitRoute, joinRoute, routeStops, JOURNEY_KIND_LABEL } from "@/lib/journey";
import type { Journey as JourneyT, Segment, TransportMode } from "@/core/types";

const MODES: TransportMode[] = ["flight", "train", "bus", "ferry", "car", "taxi", "subway", "walk"];
const rid = () => Math.random().toString(36).slice(2, 8);

/** The from → to connector. One weight everywhere a route shows — always Inter,
 *  never the page's serif, so the Journey screen stops mixing arrow styles. */
function Arrow({ className = "" }: { className?: string }) {
  return <span className={`font-sans font-normal text-ink-faint ${className}`}>→</span>;
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

  const first = j.segments[0];
  const last = j.segments.at(-1);
  const total = fmtDuration(first?.depart, last?.arrive ?? last?.depart);
  const changes = Math.max(0, j.segments.length - 1);

  return (
    <Page>
      <PageHeader
        back="/logbook"
        eyebrow={`${JOURNEY_KIND_LABEL[j.kind]}${j.date ? ` · ${fmtDate(j.date, loc, { weekday: "long", day: "numeric", month: "long" })}` : ""}`}
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

      {(j.fare || !ro) && (
        <p className="mt-4 text-sm text-ink-soft">
          Total fare <Editable label="Total fare" value={j.fare ?? ""} placeholder="—" onCommit={(v) => patch({ fare: v || undefined })} />
        </p>
      )}

      <div className="mt-8 space-y-3.5">
      {(!ro || j.segments.length > 0) && (
        <Section
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
        {j.segments.length === 0 && <p className="text-sm text-ink-faint">No hops yet.</p>}
        {j.segments.map((s, i) => {
          const next = j.segments[i + 1];
          const rawGap = next && s.arrive && next.depart ? localMinutes(next.depart)! - localMinutes(s.arrive)! : null;
          // A negative gap means the change runs past midnight (times often lack a
          // date and get merged onto the journey day). Wrap into the next day.
          const overnight = rawGap != null && rawGap < 0;
          const gap = rawGap == null ? null : overnight ? rawGap + 1440 : rawGap;
          const meta = s.mode === "flight"
            ? fmtDuration(s.depart, s.arrive)
            : [fmtDuration(s.depart, s.arrive), s.service || s.carrier].filter(Boolean).join("  ·  ");
          const ep = segEndpoints(s, j.date, loc);
          const offDay = [
            ep.depart.date && `Departs ${ep.depart.date}`,
            ep.arrive.date && `Arrives ${ep.arrive.date}`,
          ]
            .filter(Boolean)
            .join("  ·  ");
          // flights don't have platforms
          const showPlatform = s.mode !== "flight" && (!ro || !!s.platform);
          return (
            <div key={s.id}>
              <div className="group border-t border-line py-4 first:border-t-0 first:pt-0">
                <p className="kicker">
                  <Editable label="From" value={s.from} placeholder="FROM" onCommit={(v) => setSeg(i, { from: v })} />
                  <Arrow className="mx-1.5" />
                  <Editable label="To" value={s.to} placeholder="TO" onCommit={(v) => setSeg(i, { to: v })} />
                </p>
                <p className="mt-1.5 font-display text-2xl tabular-nums leading-none">
                  <Editable as="time" label="Depart time" value={clockOf(s.depart)} placeholder="--:--" onCommit={(v) => setSeg(i, { depart: mergeTime(s.depart, j.date, v) })} />
                  {ep.depart.zone && <span className="ml-1 align-middle text-xs text-ink-faint">{ep.depart.zone}</span>}
                  <Arrow className="mx-2 align-middle text-base" />
                  <Editable as="time" label="Arrive time" value={clockOf(s.arrive)} placeholder="--:--" onCommit={(v) => setSeg(i, { arrive: mergeTime(s.arrive, j.date, v) })} />
                  {ep.arrive.zone && <span className="ml-1 align-middle text-xs text-ink-faint">{ep.arrive.zone}</span>}
                </p>
                {offDay && <p className="mt-1 text-xs text-ink-soft">{offDay}</p>}
                <p className="meta mt-2 flex flex-wrap items-center gap-x-1.5">
                  <Editable
                    as="select"
                    label="Mode"
                    value={s.mode}
                    options={MODES.map((m) => ({ value: m, label: MODE_LABEL[m] }))}
                    onCommit={(v) => setSeg(i, v === "flight" ? { mode: "flight", platform: undefined } : { mode: v as TransportMode })}
                  />
                  {meta && <span>· {meta}</span>}
                </p>
                {(!ro || showPlatform || s.seat || s.fare || s.carrier || s.service || s.bookingRef) && (
                  <p className="mt-1.5 flex flex-wrap gap-x-5 gap-y-0.5 text-xs text-ink-soft">
                    {s.mode === "flight" && (!ro || s.carrier) && <span>Airline <Editable label="Airline" value={s.carrier ?? ""} placeholder="—" onCommit={(v) => setSeg(i, { carrier: v || undefined })} /></span>}
                    {s.mode === "flight" && (!ro || s.service) && <span>Flight no. <Editable label="Flight number" value={s.service ?? ""} placeholder="—" onCommit={(v) => setSeg(i, { service: v || undefined })} /></span>}
                    {showPlatform && <span>Platform <Editable label="Platform" value={s.platform ?? ""} placeholder="—" onCommit={(v) => setSeg(i, { platform: v || undefined })} /></span>}
                    {(!ro || s.seat) && <span>Seat <Editable label="Seat" value={s.seat ?? ""} placeholder="—" onCommit={(v) => setSeg(i, { seat: v || undefined })} /></span>}
                    {(!ro || s.bookingRef) && <span>Booking ref <Editable label="Booking reference" value={s.bookingRef ?? ""} placeholder="—" onCommit={(v) => setSeg(i, { bookingRef: v || undefined })} /></span>}
                    {(!ro || s.fare) && <span>Fare <Editable label="Fare" value={s.fare ?? ""} placeholder="—" onCommit={(v) => setSeg(i, { fare: v || undefined })} /></span>}
                    {!ro && <RowDeleteButton onClick={() => patch({ segments: j.segments.filter((_, k) => k !== i) })} label="Remove hop" />}
                  </p>
                )}
              </div>
              {next && (
                <p className="border-l-2 border-dashed border-line py-1.5 pl-3 text-xs text-ink-soft">
                  {gap != null ? (
                    <span className={!overnight && gap < 20 ? "font-medium text-accent" : ""}>
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
        </Section>
      )}

      {(j.notes || !ro) && (
        <Section title="Notes">
          <div className="text-sm text-ink">
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
