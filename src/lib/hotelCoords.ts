import { useEffect, useRef } from "react";
import { geocode } from "./geocode";
import { mapUrlCoords } from "./maps";
import { useApp } from "@/store/useApp";
import type { Hotel } from "@/core/types";

/**
 * A hotel's coordinates, worked out with no input from anyone: taken from its
 * Maps link when that carries them (see `normalizeTrip`), otherwise looked up
 * once from its address and stored straight back on the hotel. Everything
 * that needs "where is the hotel" — the Map's city pills, the day's forecast,
 * the way back at the end of a day's plan — reads `hotel.lat`/`lng`, so this
 * runs app-wide (see `AppShell`) rather than only when the Map tab is open.
 */
async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  // drop a leading postcode ("〒105-0013 ") — Nominatim reads it as noise
  const q = address.trim().replace(/^〒?\s*\d{3}-?\d{4}[\s,]*/, "");
  let [hit] = await geocode(q);
  // retry with the latin part only — a Japanese building-name tail
  // ("… ビーサイト浜松町") often sinks the whole lookup
  if (!hit) {
    const latin = q.replace(/[^\x00-\x7F]+/g, " ").replace(/\s{2,}/g, " ").replace(/[\s,]+$/, "").trim();
    if (latin && latin !== q) [hit] = await geocode(latin);
  }
  return hit ? { lat: hit.lat, lng: hit.lng } : null;
}

/** One lookup per hotel address, spaced for Nominatim (~1 request/second). */
export function useAutoHotelCoords(enabled: boolean) {
  const hotels = useApp((s) => s.data?.hotels);
  const updateEntity = useApp((s) => s.updateEntity);
  const tried = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!enabled || !hotels) return;
    const key = (h: Hotel) => `${h.id}|${h.address?.trim()}`;
    const pending = hotels.filter(
      (h) =>
        h.address?.trim() &&
        !tried.current.has(key(h)) &&
        !(Number.isFinite(h.lat) && Number.isFinite(h.lng)) &&
        !mapUrlCoords(h.mapUrl),
    );
    if (pending.length === 0) return;
    let stop = false;
    (async () => {
      for (const h of pending) {
        if (stop) return;
        tried.current.add(key(h));
        const hit = await geocodeAddress(h.address!);
        if (hit) updateEntity<Hotel>("hotels", h.id, hit);
        await new Promise((r) => setTimeout(r, 1200));
      }
    })();
    return () => { stop = true; };
  }, [enabled, hotels, updateEntity]);
}

/** The IANA zone at a point, from Open-Meteo (the same keyless service the
 *  forecast uses — `timezone=auto` names the zone for any coordinates). */
async function zoneAt(lat: number, lng: number): Promise<string | null> {
  try {
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=weathercode&forecast_days=1&timezone=auto`);
    if (!res.ok) return null;
    const tz = ((await res.json()) as { timezone?: string }).timezone;
    if (!tz) return null;
    Intl.DateTimeFormat(undefined, { timeZone: tz }); // throws on a name the browser doesn't know
    return tz;
  } catch {
    return null;
  }
}

/**
 * A new trip starts on "UTC" as its trip time zone, which would put every
 * calendar export and hop time at the wrong hour until someone found the
 * picker on Manage. While it's still that untouched default, name the zone
 * from the first hotel that has coordinates. Once it's anything else it's
 * never touched again, so a zone picked by hand always wins.
 */
export function useAutoTripTimeZone(enabled: boolean) {
  const tripId = useApp((s) => s.activeId);
  const zone = useApp((s) => s.data?.config.tripTimeZone);
  const anchor = useApp((s) => s.data?.hotels.find((h) => Number.isFinite(h.lat) && Number.isFinite(h.lng)));
  const mutateTrip = useApp((s) => s.mutateTrip);
  const tried = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!enabled || !tripId || zone !== "UTC" || !anchor || tried.current.has(tripId)) return;
    tried.current.add(tripId);
    void zoneAt(anchor.lat!, anchor.lng!).then((tz) => {
      if (!tz) { tried.current.delete(tripId); return; } // offline — try again on a later change
      // the trip may have been switched, or its zone set by hand, meanwhile
      if (tz === "UTC" || useApp.getState().activeId !== tripId) return;
      mutateTrip((d) => { if (d.config.tripTimeZone === "UTC") d.config.tripTimeZone = tz; });
    });
  }, [enabled, tripId, zone, anchor?.lat, anchor?.lng, mutateTrip]);
}
