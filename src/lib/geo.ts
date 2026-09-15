import { useEffect, useState } from "react";

/** Great-circle distance between two lat/lng points, in kilometres. */
export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const toR = Math.PI / 180;
  const dLat = (lat2 - lat1) * toR;
  const dLng = (lng2 - lng1) * toR;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * toR) * Math.cos(lat2 * toR) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

/** under 1 km in rounded metres, otherwise one decimal of km. */
export function fmtDistanceKm(km: number): string {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
}

export type GeoState =
  | { status: "idle" }
  | { status: "pending" }
  | { status: "ready"; lat: number; lng: number }
  | { status: "error" };

/**
 * The device's one-shot position, fetched only while `active` — no permission
 * prompt until the caller actually wants it. Approximate (no watch, no high
 * accuracy) is enough for "what's nearby", and it degrades to `"error"` on
 * denial or an unsupported browser, letting the caller fall back to an
 * unfiltered view rather than blocking on it.
 */
export function useGeolocation(active: boolean): GeoState {
  const [state, setState] = useState<GeoState>({ status: "idle" });
  useEffect(() => {
    if (!active) {
      setState({ status: "idle" });
      return;
    }
    if (!("geolocation" in navigator)) {
      setState({ status: "error" });
      return;
    }
    let cancelled = false;
    setState({ status: "pending" });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (!cancelled) setState({ status: "ready", lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        if (!cancelled) setState({ status: "error" });
      },
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 60_000 },
    );
    return () => {
      cancelled = true;
    };
  }, [active]);
  return state;
}
