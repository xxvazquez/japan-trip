import { Link } from "react-router-dom";
import { Hero } from "@/components/Hero";
import { Editable } from "@/components/Editable";
import { Icon, type IconName } from "@/components/Icon";
import { useData, lookups } from "@/lib/data";
import { useApp } from "@/store/useApp";
import type { Day } from "@/core/types";
import {
  tripClock,
  fmtDate,
  nextJourney,
  bookendJourney,
  upcomingReservations,
  legForDate,
  fmtInZone,
  daysBetween,
} from "@/lib/dates";

export default function Today() {
  const data = useData();
  const mutate = useApp((s) => s.mutateTrip);
  const setNote = useApp((s) => s.setNote);
  if (!data) return null;

  const { config, meta, media } = data;
  const L = lookups(data);
  const c = tripClock(data);
  const loc = config.locale;

  const leg = L.leg(c.currentLegId) ?? legForDate(data, c.todayISO);
  const transfer = nextJourney(data, c.todayISO, ["transfer"]);
  const bookend = bookendJourney(data, c.phase);
  const res = upcomingReservations(data, c.todayISO)[0];
  const nextHotel = transfer ? L.hotel(L.leg(transfer.toLegId)?.hotelId) : undefined;
  const season = L.seasonal(c.todayISO);
  const noteKey = `today:${c.todayISO}`;

  return (
    <div className="relative z-10 pb-28 md:pb-14">
      <Hero src={media.cover?.dataUrl} alt={config.branding}>
        <p className="text-2xs font-semibold uppercase tracking-[0.14em] text-white/70">
          {c.phase === "before"
            ? `${c.daysUntilStart} days to go`
            : c.phase === "during"
              ? `Day ${c.dayNumber} of ${c.totalDays} · ${c.daysRemaining} left`
              : "Home"}
        </p>
        <h1 className="mt-1 font-display text-display-lg text-white drop-shadow-sm">{config.branding}</h1>
        <p className="mt-0.5 text-sm text-white/80">
          <Editable
            label="Trip tagline"
            value={config.tagline}
            placeholder="Add dates or a subtitle"
            onCommit={(v) => mutate((d) => { d.config.tagline = v; })}
          />
        </p>
      </Hero>

      <div className="mx-auto max-w-reading px-5 pt-7 sm:px-7">
        {!media.cover && (
          <Link to="/manage" className="mb-5 flex items-center gap-2 text-xs text-ink-faint hover:text-accent">
            <Icon name="plus" size={14} /> Add a cover image in Manage → Media
          </Link>
        )}

        <p className="text-lg leading-relaxed text-ink-soft">
          {c.phase === "before" && (
            <>We leave {fmtDate(meta.start, loc, { weekday: "long", day: "numeric", month: "long" })}. Everything's coming together below.</>
          )}
          {c.phase === "during" && <>{c.today?.summary ?? `${leg?.base} — day ${c.dayNumber}.`}</>}
          {c.phase === "after" && <>{daysBetween(meta.start, meta.end) + 1} days, {data.legs.length} bases. Everything's still here to look back on.</>}
        </p>

        <div className="mt-7 space-y-2.5">
          {c.phase === "during" && c.today && (
            <NextCard
              to={`/day/${c.today.date}`}
              icon="today"
              label="Today's plan"
              title={c.today.title ?? fmtDate(c.today.date, loc)}
              meta={firstActivity(c.today)}
            />
          )}

          {res && (
            <NextCard
              to="/vault"
              icon="check"
              label={res.bookBy ? `Book by ${fmtDate(res.bookBy, loc, { day: "numeric", month: "short" })}` : "Reservation"}
              title={res.title}
              meta={res.bookBy ? `${Math.max(0, daysBetween(c.todayISO, res.bookBy))} days left` : res.when}
              urgent={res.bookBy ? daysBetween(c.todayISO, res.bookBy) <= 7 : false}
            />
          )}

          {transfer && (
            <NextCard
              to={`/journey/${transfer.id}`}
              icon="train"
              label="Next transfer"
              title={transfer.label}
              meta={transfer.date ? fmtDate(transfer.date, loc, { weekday: "long", day: "numeric", month: "short" }) : undefined}
            />
          )}

          {nextHotel && (
            <NextCard to={`/hotel/${nextHotel.id}`} icon="bed" label="Next stay" title={nextHotel.name} meta={leg && `after ${leg.base}`} />
          )}

          {bookend && bookend.segments.length > 0 && (
            <NextCard
              to={`/journey/${bookend.id}`}
              icon="external"
              label={c.phase === "before" ? "Getting there" : "Getting home"}
              title={bookend.label}
              meta={bookend.segments
                .map((s) => fmtInZone(s.depart, s.fromTz ?? config.tripTimeZone, loc))
                .filter(Boolean)
                .join("  →  ")}
            />
          )}

          {data.luggage.length > 0 && (
            <NextCard
              to="/places/luggage"
              icon="places"
              label="Luggage"
              title={`${data.luggage.length} ${data.luggage.length === 1 ? "shipment" : "shipments"}`}
              meta={data.luggage.map((l) => l.status).join(" · ")}
            />
          )}
        </div>

        {season && (
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-1 rounded-xl border border-line px-4 py-3 text-sm">
            <span><span className="text-ink-faint">Sunset </span>{season.sunset}</span>
            <span><span className="text-ink-faint">Temp </span>{season.tempC[0]}–{season.tempC[1]} °C</span>
          </div>
        )}

        <div className="mt-6">
          <p className="kicker mb-1.5">Note to self</p>
          <div className="rounded-xl border border-line px-4 py-3 text-sm leading-relaxed">
            <Editable
              as="textarea"
              label="Note for today"
              value={data.notes[noteKey] ?? ""}
              placeholder="Anything for today…"
              onCommit={(v) => setNote(noteKey, v)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function firstActivity(day: Day): string | undefined {
  const a = day.morning?.[0] ?? day.afternoon?.[0] ?? day.evening?.[0];
  return a ? `${a.time ? a.time + " · " : ""}${a.title}` : undefined;
}

function NextCard({
  to,
  icon,
  label,
  title,
  meta,
  urgent,
}: {
  to: string;
  icon: IconName;
  label: string;
  title: string;
  meta?: string | false;
  urgent?: boolean;
}) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3.5 rounded-xl border px-4 py-3.5 transition-colors hover:bg-surface-2 ${
        urgent ? "border-accent/40 bg-accent/5" : "border-line"
      }`}
    >
      <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${urgent ? "bg-accent/15 text-accent" : "bg-surface-2 text-ink-soft"}`}>
        <Icon name={icon} size={17} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="kicker">{label}</span>
        <span className="mt-0.5 block font-medium leading-snug [overflow-wrap:anywhere]">{title}</span>
        {meta && <span className="mt-0.5 block truncate text-sm text-ink-faint">{meta}</span>}
      </span>
      <Icon name="chevron" size={16} className="shrink-0 text-ink-faint" />
    </Link>
  );
}
