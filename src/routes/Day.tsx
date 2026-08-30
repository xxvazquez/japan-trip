import { useParams, Link } from "react-router-dom";
import { Hero } from "@/components/Hero";
import { Editable } from "@/components/Editable";
import { ActivityEditor } from "@/components/ActivityEditor";
import { ChecklistEditor } from "@/components/ChecklistEditor";
import { Icon } from "@/components/Icon";
import { useData, lookups } from "@/lib/data";
import { useApp } from "@/store/useApp";
import { fmtDate } from "@/lib/dates";
import { legHex } from "@/lib/legColors";
import type { Activity, Day as DayT } from "@/core/types";

export default function Day() {
  const data = useData();
  const { date } = useParams();
  const updateEntity = useApp((s) => s.updateEntity);
  if (!data) return null;

  const L = lookups(data);
  const day = L.day(date);
  if (!day)
    return (
      <div className="mx-auto max-w-reading px-5 py-16 text-center">
        <p className="font-display text-3xl text-ink-faint">迷</p>
        <p className="mt-3">No day for {date}.</p>
        <Link to="/itinerary" className="mt-4 inline-block text-accent">Back to the itinerary</Link>
      </div>
    );

  const patch = (p: Partial<DayT>) => updateEntity<DayT>("days", day.id, p);
  const setEntries = (next: Activity[]) => patch({ entries: next });

  const leg = L.leg(day.legId);
  const hotel = L.hotel(day.hotelId);
  const cover = data.media.cover?.dataUrl;
  const legImg = L.image(leg?.image)?.src;
  const hasTemp = day.tempLo != null && day.tempHi != null;

  const lastTime = (day.entries ?? [])
    .map((a) => a.time)
    .filter(Boolean)
    .sort()
    .at(-1);
  const runsLate = day.sunset && lastTime ? lastTime > day.sunset : false;

  const showChecklist = day.checklist != null;
  const showPacking = day.packingReminder != null;

  return (
    <div className="relative z-10 pb-28 md:pb-14">
      <Hero src={legImg ?? cover} alt={leg?.base ?? day.city} color={legHex(leg?.color)} height="clamp(11rem, 34vw, 17rem)">
        <p className="text-2xs font-semibold uppercase tracking-[0.14em] text-white/70">
          {fmtDate(day.date, data.config.locale, { weekday: "long", day: "numeric", month: "long" })}
        </p>
        <h1 className="mt-1 font-display text-display text-white drop-shadow-sm">
          <Editable label="Day title" value={day.title ?? ""} placeholder={fmtDate(day.date, data.config.locale)} onCommit={(v) => patch({ title: v || undefined })} />
        </h1>
        <p className="text-sm text-white/80">
          <Editable label="City" value={day.city} placeholder="City" onCommit={(v) => patch({ city: v })} />
        </p>
      </Hero>

      <div className="mx-auto max-w-reading px-5 pt-6 sm:px-7">
        <p className="text-lg leading-relaxed text-ink-soft">
          <Editable as="textarea" label="Day summary" value={day.summary ?? ""} placeholder="A line about the shape of the day…" onCommit={(v) => patch({ summary: v || undefined })} />
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          {hotel && <Chip icon="bed" to={`/hotel/${hotel.id}`}>{hotel.name}</Chip>}
          {day.journeyId && <Chip icon="train" to={`/journey/${day.journeyId}`}>Transport</Chip>}
          {day.dayTripId && <Chip icon="explore" to={`/day-trip/${day.dayTripId}`}>Day-trip guide</Chip>}
        </div>

        <div className={`mt-4 flex flex-wrap items-center gap-x-6 gap-y-1.5 rounded-xl border px-4 py-3 text-sm ${runsLate ? "border-accent/40 bg-accent/5" : "border-line"}`}>
          <span>
            <span className="text-ink-faint">Sunset </span>
            <Editable label="Sunset" value={day.sunset ?? ""} placeholder="—:—" onCommit={(v) => patch({ sunset: v || undefined })} />
          </span>
          <span>
            <span className="text-ink-faint">Temp </span>
            <Editable
              label="Temperature range, e.g. 10–18"
              value={hasTemp ? `${day.tempLo}–${day.tempHi}` : ""}
              placeholder="lo–hi"
              onCommit={(v) => {
                const m = v.match(/(-?\d+)\s*[–-]\s*(-?\d+)/);
                patch(m ? { tempLo: Number(m[1]), tempHi: Number(m[2]) } : { tempLo: undefined, tempHi: undefined });
              }}
            />
            {hasTemp && <span className="text-ink-faint"> °C</span>}
          </span>
          {runsLate && <span className="w-full text-accent">Heads up — a plan runs past sunset ({lastTime}).</span>}
        </div>

        <ActivityEditor label="Plan" items={day.entries ?? []} onChange={setEntries} />

        {showChecklist && (
          <ChecklistEditor
            items={day.checklist ?? []}
            onChange={(next) => patch({ checklist: next })}
            onRemoveSection={() => patch({ checklist: undefined })}
          />
        )}

        {showPacking && (
          <section className="mt-6">
            <div className="mb-1 flex items-center justify-between">
              <span className="kicker">Packing reminder</span>
              <button onClick={() => patch({ packingReminder: undefined })} className="text-ink-faint hover:text-accent" aria-label="Hide packing reminder">
                <Icon name="close" size={14} />
              </button>
            </div>
            <p className="text-accent">
              <Editable value={day.packingReminder ?? ""} label="Packing reminder" placeholder="What to pack or set aside" onCommit={(v) => patch({ packingReminder: v })} />
            </p>
          </section>
        )}

        <section className="mt-6">
          <h2 className="kicker mb-2">Notes</h2>
          <div className="rounded-xl border border-line px-4 py-3 text-sm leading-relaxed">
            <Editable as="textarea" label="Day notes" value={day.notes ?? ""} placeholder="Anything else for this day…" onCommit={(v) => patch({ notes: v || undefined })} />
          </div>
        </section>

        {(!showChecklist || !showPacking) && (
          <div className="mt-5 flex flex-wrap gap-2 text-sm text-ink-faint">
            {!showChecklist && (
              <button onClick={() => patch({ checklist: [] })} className="flex items-center gap-1 rounded-full border border-dashed border-line px-3 py-1 hover:text-accent">
                <Icon name="plus" size={13} /> Checklist
              </button>
            )}
            {!showPacking && (
              <button onClick={() => patch({ packingReminder: "" })} className="flex items-center gap-1 rounded-full border border-dashed border-line px-3 py-1 hover:text-accent">
                <Icon name="plus" size={13} /> Packing reminder
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Chip({ icon, to, children }: { icon: Parameters<typeof Icon>[0]["name"]; to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1 text-sm hover:bg-surface-2">
      <Icon name={icon} size={14} className="text-ink-faint" />
      {children}
    </Link>
  );
}
