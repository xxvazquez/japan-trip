import { useState } from "react";
import type { LatLng } from "@/core/types";
import { Icon } from "./Icon";
import { appleMapsLink, googleMapsLink, myMapEmbedUrl, placeEmbedUrl, searchEmbedUrl } from "@/lib/maps";

type Target = { loc?: LatLng; query?: string; name?: string };

/** A pair of "open in maps" links. Always works, even offline. */
export function OpenInMaps({ target, className = "" }: { target: Target; className?: string }) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <a href={googleMapsLink(target)} target="_blank" rel="noopener" className="btn-sm">
        <Icon name="map" size={14} /> Google Maps
      </a>
      <a href={appleMapsLink(target)} target="_blank" rel="noopener" className="btn-sm">
        <Icon name="map" size={14} /> Apple Maps
      </a>
    </div>
  );
}

/**
 * A focused map for one place. Uses the Google Embed API when a key is present;
 * otherwise shows the "open in maps" links (which always work). Falls back to
 * the same when offline.
 */
export function PlaceMap({
  target,
  search,
  height = 200,
}: {
  target: Target;
  /** when set, embeds a search (multiple pins) instead of a single place */
  search?: string;
  height?: number;
}) {
  const online = typeof navigator === "undefined" ? true : navigator.onLine;
  const url = search ? searchEmbedUrl(search) : placeEmbedUrl(target);

  return (
    <div className="overflow-hidden rounded-xl border border-line">
      {url && online ? (
        <iframe
          src={url}
          title={target.name ?? "Map"}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full"
          style={{ height, border: 0 }}
        />
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5">
          <p className="flex items-center gap-2 text-sm text-ink-faint">
            <Icon name="map" size={16} />
            {url ? "Map needs a connection" : "Add a Google Maps key for an inline map"}
          </p>
          <OpenInMaps target={target} />
        </div>
      )}
    </div>
  );
}

/** The user's Google "My Map", if one is configured. */
export function MyMapEmbed({ height = 320 }: { height?: number }) {
  const url = myMapEmbedUrl();
  const [failed, setFailed] = useState(false);
  const online = typeof navigator === "undefined" ? true : navigator.onLine;

  if (!url) {
    return (
      <div className="rounded-xl border border-dashed border-line px-4 py-6 text-sm text-ink-faint">
        Add a Google&nbsp;“My&nbsp;Map” to see your saved pins here — set <code>VITE_MYMAP_MID</code> to its
        shared id (the map must be “anyone with the link”).
      </div>
    );
  }
  if (!online || failed) {
    return (
      <div className="rounded-xl border border-line px-4 py-6 text-center text-sm text-ink-faint">
        Your map needs a connection.{" "}
        <a href={`https://www.google.com/maps/d/viewer?mid=${import.meta.env.VITE_MYMAP_MID}`} target="_blank" rel="noopener" className="text-accent">
          Open it in Google Maps
        </a>
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-xl border border-line">
      <iframe src={url} title="My Map" loading="lazy" onError={() => setFailed(true)} className="w-full" style={{ height, border: 0 }} />
    </div>
  );
}
