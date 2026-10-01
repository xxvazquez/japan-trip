/**
 * Export a day, or the whole trip, as a standard `.ics` calendar file — each
 * plan step and travel hop becomes an event, so it lands on the phone's own
 * calendar next to everything else. Client-side only, no deps: RFC 5545 is
 * plain text, hand-rolled here the same way `tripExport.ts` hand-rolls HTML.
 *
 * Times: a plan step's `time` is free text ("11:34", "14:00–15:15", "Around
 * 18:00", or blank) — a single time or a range becomes a timed event; anything
 * else becomes an all-day event on that date, with the original text kept in
 * the description so nothing's lost. A journey's hops carry real zoned
 * timestamps (`depart`/`arrive` + `fromTz`/`toTz`) and always become timed
 * events. Every wall time is converted to a real UTC instant (DST-correct, via
 * `Intl.DateTimeFormat`) rather than trusting the reader's own timezone
 * database — nothing here relies on the calendar app recognising a bare TZID.
 */
import type { Day, Journey, Place, PlanItem, Segment, TripData } from "@/core/types";
import { addDays } from "@/lib/dates";
import { safeTz, zonedTimeToUtc } from "@/lib/tz";
import { MODE_LABEL } from "@/lib/transport";

export interface IcsOptions {
  includePrivate: boolean;
}

/* ------------------------------------------------------------------ *
 * text + line helpers
 * ------------------------------------------------------------------ */

const escText = (s: string): string =>
  s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

/** URL is a URI value, not TEXT — escaping its commas and semicolons would
 *  break the link. Only line breaks can't appear in it. */
const uriValue = (s: string): string => s.replace(/[\r\n]+/g, "");

/** RFC 5545 line folding — wraps a content line at ~74 octets so it survives
 *  parsers that reject long lines; a continuation line starts with a space. */
function foldLine(line: string): string {
  const enc = new TextEncoder();
  if (enc.encode(line).length <= 74) return line;
  const out: string[] = [];
  let rest = line;
  let first = true;
  while (enc.encode(rest).length > 74) {
    let cut = 74;
    while (cut > 0 && enc.encode(rest.slice(0, cut)).length > 74) cut--;
    const code = rest.charCodeAt(cut - 1);
    if (code >= 0xd800 && code <= 0xdbff) cut--; // never split a surrogate pair
    out.push((first ? "" : " ") + rest.slice(0, cut));
    rest = rest.slice(cut);
    first = false;
  }
  out.push((first ? "" : " ") + rest);
  return out.join("\r\n");
}

/** True when a hop's arrival, read in its own zone, is before its departure —
 *  a date typed onto the wrong day. Needs both ends to have a date and time. */
export function arrivesBeforeDeparture(seg: Segment, tripTz: string): boolean {
  const [dd, dt] = (seg.depart ?? "").split("T");
  const [ad, at] = (seg.arrive ?? "").split("T");
  if (!dt || !at) return false;
  const start = zonedTimeToUtc(dd, dt, safeTz(seg.fromTz || tripTz));
  const end = zonedTimeToUtc(ad, at, safeTz(seg.toTz || seg.fromTz || tripTz));
  return !!start && !!end && end.getTime() < start.getTime();
}

const fmtUtcStamp = (d: Date): string => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
const fmtDateStamp = (iso: string): string => iso.replace(/-/g, "");

/** "14:00–15:15" (any dash, any spacing) → ["14:00", "15:15"]; else null —
 *  same shape as `Day.tsx`'s own `splitRange`, kept local to avoid a route
 *  import from a lib module. */
function splitRange(t: string | undefined): [string, string] | null {
  const m = (t ?? "").match(/^\s*(\d{1,2}:\d{2})\s*[–—-]\s*(\d{1,2}:\d{2})\s*$/);
  return m ? [m[1], m[2]] : null;
}
const singleTime = (t: string | undefined): string | null => {
  const m = (t ?? "").match(/^\s*(\d{1,2}:\d{2})\s*$/);
  return m ? m[1] : null;
};

/* ------------------------------------------------------------------ *
 * event timing — shared between the .ics lines below and the single-event
 * Google Calendar links further down, so both read off the same clock math.
 * ------------------------------------------------------------------ */

type EventTiming =
  | { allDay: false; start: Date; end: Date }
  | { allDay: true; startDate: string; endDateExclusive: string };

function planItemTiming(item: PlanItem, day: Day, tz: string): EventTiming {
  const range = splitRange(item.time);
  const single = range ? null : singleTime(item.time);
  if (range) {
    const start = zonedTimeToUtc(day.date, range[0], tz);
    let end = zonedTimeToUtc(day.date, range[1], tz);
    // "22:00–01:00" runs past midnight — its end is on the next day
    if (start && end && end <= start) end = zonedTimeToUtc(addDays(day.date, 1), range[1], tz);
    if (start && end) return { allDay: false, start, end };
  } else if (single) {
    const start = zonedTimeToUtc(day.date, single, tz);
    if (start) return { allDay: false, start, end: new Date(start.getTime() + 60 * 60_000) };
  }
  return { allDay: true, startDate: day.date, endDateExclusive: addDays(day.date, 1) };
}

/** `null` when the hop has no departure time to build an event from. */
function segmentTiming(seg: Segment, tripTz: string): EventTiming | null {
  // a hop with only a date set (no clock time yet) isn't an event
  if (!seg.depart?.split("T")[1]) return null;
  const fromTz = safeTz(seg.fromTz || tripTz);
  const toTz = safeTz(seg.toTz || seg.fromTz || tripTz);
  const [depDate, depTime] = seg.depart.split("T");
  const start = zonedTimeToUtc(depDate, depTime, fromTz);
  if (!start) return null;
  let end: Date | null = null;
  if (seg.arrive) {
    const [arrDate, arrTime] = seg.arrive.split("T");
    end = zonedTimeToUtc(arrDate, arrTime, toTz);
  }
  return { allDay: false, start, end: end ?? new Date(start.getTime() + 60 * 60_000) };
}

const planItemDesc = (item: PlanItem, timing: EventTiming): string[] =>
  [timing.allDay && item.time ? `Time: ${item.time}` : null, item.note].filter(Boolean) as string[];

const segmentDesc = (seg: Segment, opts: IcsOptions): string[] =>
  [
    seg.carrier && `Carrier: ${seg.carrier}`,
    seg.service && `Service: ${seg.service}`,
    seg.seat && `Seat: ${seg.seat}`,
    seg.platform && `Platform: ${seg.platform}`,
    opts.includePrivate && seg.bookingRef && `Booking ref: ${seg.bookingRef}`,
    seg.note,
  ].filter(Boolean) as string[];

/* ------------------------------------------------------------------ *
 * event builders
 * ------------------------------------------------------------------ */

function planItemEvent(item: PlanItem, day: Day, tz: string, place: Place | undefined): string[] {
  const timing = planItemTiming(item, day, tz);
  const lines = ["BEGIN:VEVENT", `UID:${item.id}@zuknesst-atlas.local`, `DTSTAMP:${fmtUtcStamp(new Date())}`];

  if (timing.allDay) {
    lines.push(`DTSTART;VALUE=DATE:${fmtDateStamp(timing.startDate)}`);
    lines.push(`DTEND;VALUE=DATE:${fmtDateStamp(timing.endDateExclusive)}`);
  } else {
    lines.push(`DTSTART:${fmtUtcStamp(timing.start)}`);
    lines.push(`DTEND:${fmtUtcStamp(timing.end)}`);
  }

  lines.push(`SUMMARY:${escText(item.text || "Untitled")}`);
  const desc = planItemDesc(item, timing);
  if (desc.length) lines.push(`DESCRIPTION:${escText(desc.join("\n"))}`);
  if (place) {
    lines.push(`LOCATION:${escText(place.name)}`);
    if (Number.isFinite(place.lat) && Number.isFinite(place.lng)) lines.push(`GEO:${place.lat};${place.lng}`);
    if (place.url) lines.push(`URL:${uriValue(place.url)}`);
  } else if (item.url) {
    lines.push(`URL:${uriValue(item.url)}`);
  }
  lines.push("END:VEVENT");
  return lines;
}

function segmentEvent(seg: Segment, tripTz: string, opts: IcsOptions): string[] | null {
  const timing = segmentTiming(seg, tripTz);
  if (!timing || timing.allDay) return null; // a hop always has real timestamps once it has a depart at all

  const lines = [
    "BEGIN:VEVENT",
    `UID:${seg.id}@zuknesst-atlas.local`,
    `DTSTAMP:${fmtUtcStamp(new Date())}`,
    `DTSTART:${fmtUtcStamp(timing.start)}`,
    `DTEND:${fmtUtcStamp(timing.end)}`,
    `SUMMARY:${escText(`${MODE_LABEL[seg.mode] ?? seg.mode}: ${seg.from} → ${seg.to}`)}`,
  ];
  const desc = segmentDesc(seg, opts);
  if (desc.length) lines.push(`DESCRIPTION:${escText(desc.join("\n"))}`);
  lines.push(`LOCATION:${escText(`${seg.from} → ${seg.to}`)}`);
  lines.push("END:VEVENT");
  return lines;
}

function dayEvents(day: Day, journeys: Map<string, Journey>, places: Map<string, Place>, tz: string, opts: IcsOptions): string[] {
  const lines: string[] = [];
  for (const item of day.plan ?? []) {
    lines.push(...planItemEvent(item, day, tz, item.placeId ? places.get(item.placeId) : undefined));
  }
  for (const id of day.journeyIds ?? []) {
    const journey = journeys.get(id);
    if (!journey) continue;
    for (const seg of journey.segments) {
      const evt = segmentEvent(seg, tz, opts);
      if (evt) lines.push(...evt);
    }
  }
  return lines;
}

/* ------------------------------------------------------------------ *
 * calendar assembly + download
 * ------------------------------------------------------------------ */

const slug = (s: string): string => s.trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").slice(0, 60) || "trip";

function wrapCalendar(title: string, eventLines: string[]): string {
  const body = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Zuknesst Atlas//Trip Export//EN",
    "CALSCALE:GREGORIAN",
    `X-WR-CALNAME:${escText(title)}`,
    ...eventLines,
    "END:VCALENDAR",
  ];
  return body.map(foldLine).join("\r\n") + "\r\n";
}

export function buildDayIcs(trip: TripData, day: Day, opts: IcsOptions): string {
  const tz = safeTz(trip.config.tripTimeZone);
  const journeys = new Map(trip.journeys.map((j) => [j.id, j] as const));
  const places = new Map(trip.places.map((p) => [p.id, p] as const));
  return wrapCalendar(day.title || trip.meta.title || "Trip", dayEvents(day, journeys, places, tz, opts));
}

export function buildTripIcs(trip: TripData, opts: IcsOptions): string {
  const tz = safeTz(trip.config.tripTimeZone);
  const journeys = new Map(trip.journeys.map((j) => [j.id, j] as const));
  const places = new Map(trip.places.map((p) => [p.id, p] as const));
  const lines = trip.days.flatMap((d) => dayEvents(d, journeys, places, tz, opts));
  return wrapCalendar(trip.meta.title || "Trip", lines);
}

/** Build the file and hand it to the browser as a download. */
export function downloadIcs(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".ics") ? filename : `${slug(filename)}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* ------------------------------------------------------------------ *
 * per-event Google Calendar links — one click, no file, no app-switch.
 * Google-only (Apple Calendar / Outlook users still want the .ics export
 * above); additive, not a replacement. Always written as if for your own
 * phone (booking refs included) — same as the per-day .ics button, since
 * opening a compose link isn't something you'd hand to someone else anyway.
 * ------------------------------------------------------------------ */

function googleCalendarDates(t: EventTiming): string {
  return t.allDay
    ? `${fmtDateStamp(t.startDate)}/${fmtDateStamp(t.endDateExclusive)}`
    : `${fmtUtcStamp(t.start)}/${fmtUtcStamp(t.end)}`;
}

function googleCalendarUrl(title: string, timing: EventTiming, description?: string, location?: string): string {
  const params = new URLSearchParams({ action: "TEMPLATE", text: title, dates: googleCalendarDates(timing) });
  if (description) params.set("details", description);
  if (location) params.set("location", location);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function googleCalendarUrlForPlanItem(item: PlanItem, day: Day, tz: string | undefined, place: Place | undefined): string {
  const timing = planItemTiming(item, day, safeTz(tz));
  const desc = planItemDesc(item, timing).join("\n");
  return googleCalendarUrl(item.text || "Untitled", timing, desc || undefined, place?.name);
}

/** `null` when the hop has no departure time — nothing to add yet. */
export function googleCalendarUrlForSegment(seg: Segment, tripTz: string): string | null {
  const timing = segmentTiming(seg, tripTz);
  if (!timing) return null;
  const desc = segmentDesc(seg, { includePrivate: true }).join("\n");
  return googleCalendarUrl(`${MODE_LABEL[seg.mode] ?? seg.mode}: ${seg.from} → ${seg.to}`, timing, desc || undefined, `${seg.from} → ${seg.to}`);
}
