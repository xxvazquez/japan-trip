import { useEffect, useRef, useState } from "react";
import { Marker, type Map as MLMap } from "maplibre-gl";
import { Icon } from "@/components/Icon";

/** the dot comes back by itself next time, once location has been allowed */
const PREF = "za.showLocation";
const readPref = () => { try { return localStorage.getItem(PREF) === "1"; } catch { return false; } };
const writePref = (on: boolean) => { try { localStorage.setItem(PREF, on ? "1" : "0"); } catch { /* private window */ } };

/** off · waiting for a first fix · dot shown · dot shown and the map follows it */
type Mode = "off" | "locating" | "shown" | "follow";

/**
 * Where you are, the Maps way: a round glass button under the zoom controls.
 * Tap → the blue dot (with its accuracy halo) and the map moves to it and
 * follows; drag the map and it stops following (the arrow goes hollow); tap
 * again to come back. GPS works with no signal, so it does offline too.
 */
export function LocateControl({ getMap, mapKey }: { getMap: () => MLMap | null; mapKey: number }) {
  const [mode, setMode] = useState<Mode>("off");
  const [msg, setMsg] = useState("");
  const modeRef = useRef(mode);
  modeRef.current = mode;
  const watch = useRef<number | null>(null);
  const marker = useRef<Marker | null>(null);
  const halo = useRef<HTMLDivElement | null>(null);
  const fix = useRef<{ lng: number; lat: number; acc: number } | null>(null);

  /** the halo's size follows the reading's accuracy at the current zoom */
  const sizeHalo = () => {
    const m = getMap();
    const f = fix.current;
    if (!m || !f || !halo.current) return;
    const metersPerPx = (156543.03392 * Math.cos((f.lat * Math.PI) / 180)) / 2 ** m.getZoom();
    const d = Math.min(2000, Math.max(0, (2 * f.acc) / metersPerPx));
    halo.current.style.width = halo.current.style.height = `${d}px`;
  };

  const moveTo = (animate: boolean) => {
    const m = getMap();
    const f = fix.current;
    if (!m || !f) return;
    // on a phone the place list covers the lower part of the map — sit the dot in the part you can see
    const offset: [number, number] = [0, window.innerWidth < 768 ? -80 : 0];
    if (animate) m.flyTo({ center: [f.lng, f.lat], zoom: Math.max(m.getZoom(), 15), offset, duration: 800 });
    else m.easeTo({ center: [f.lng, f.lat], offset, duration: 400 });
  };

  const stop = () => {
    if (watch.current != null) navigator.geolocation.clearWatch(watch.current);
    watch.current = null;
    marker.current?.remove();
    marker.current = null;
  };

  const start = (follow: boolean) => {
    if (!("geolocation" in navigator)) {
      setMsg("This browser can’t share your location.");
      return;
    }
    stop();
    setMode(follow ? "locating" : "shown");
    let first = true;
    watch.current = navigator.geolocation.watchPosition(
      (pos) => {
        const m = getMap();
        if (!m) return;
        fix.current = { lng: pos.coords.longitude, lat: pos.coords.latitude, acc: pos.coords.accuracy };
        if (!marker.current) {
          const root = document.createElement("div");
          root.className = "user-dot";
          const h = document.createElement("div");
          h.className = "user-dot-halo";
          const dot = document.createElement("div");
          dot.className = "user-dot-core";
          root.append(h, dot);
          halo.current = h;
          marker.current = new Marker({ element: root }).setLngLat([fix.current.lng, fix.current.lat]).addTo(m);
        } else {
          marker.current.setLngLat([fix.current.lng, fix.current.lat]);
        }
        sizeHalo();
        writePref(true);
        if (first && modeRef.current === "locating") {
          setMode("follow");
          moveTo(true);
        } else if (modeRef.current === "follow") {
          moveTo(false);
        }
        first = false;
      },
      (err) => {
        stop();
        setMode("off");
        if (err.code === err.PERMISSION_DENIED) {
          writePref(false);
          setMsg("Location is turned off for this app. Allow it in your browser’s site settings.");
        } else if (follow) {
          setMsg("Couldn’t find your location just now.");
        }
      },
      { enableHighAccuracy: true, maximumAge: 10_000, timeout: 30_000 },
    );
  };

  // a drag or pinch by hand stops following; the halo resizes with the zoom
  useEffect(() => {
    const m = getMap();
    if (!m) return;
    const unfollow = (e: { originalEvent?: unknown }) => {
      if (e.originalEvent && modeRef.current === "follow") setMode("shown");
    };
    m.on("dragstart", unfollow);
    m.on("zoom", sizeHalo);
    return () => {
      m.off("dragstart", unfollow);
      m.off("zoom", sizeHalo);
    };
  }, [mapKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // shown last time and already allowed: put the dot back without asking.
  // A new map (a retry) starts over; leaving the map stops the GPS.
  useEffect(() => {
    if (readPref()) {
      void navigator.permissions?.query({ name: "geolocation" }).then(
        (p) => { if (p.state === "granted" && modeRef.current === "off") start(false); },
        () => {},
      );
    }
    return () => { stop(); setMode("off"); };
  }, [mapKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(""), 4500);
    return () => clearTimeout(t);
  }, [msg]);

  const tap = () => {
    setMsg("");
    if (mode === "off") start(true);
    else if (mode === "shown" && fix.current) { setMode("follow"); moveTo(true); }
    else if (mode === "follow") moveTo(true);
  };

  return (
    <>
      <button
        onClick={tap}
        aria-label={mode === "follow" ? "Following your location" : "Show your location"}
        aria-pressed={mode === "follow"}
        className="glass absolute right-3 top-[108px] grid h-11 w-11 place-items-center rounded-full text-accent transition-colors active:bg-ink/[0.07]"
      >
        <Icon
          name="location"
          size={18}
          filled={mode === "follow"}
          className={mode === "locating" ? "motion-safe:animate-pulse" : mode === "off" ? "text-ink" : undefined}
        />
      </button>
      {msg && (
        <div className="pointer-events-none absolute inset-x-0 top-3 flex justify-center px-16">
          <p className="glass rounded-[14px] px-3.5 py-2 text-center text-[13px] text-ink motion-safe:animate-fade-in">{msg}</p>
        </div>
      )}
    </>
  );
}
