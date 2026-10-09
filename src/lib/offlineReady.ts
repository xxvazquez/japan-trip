import { useEffect, useState } from "react";
import type { TripData } from "@/core/types";
import { useApp } from "@/store/useApp";
import { canPrefetchTiles, mapSaveStatus, tripMapPoints, tripOfflineGroups, type MapSaveStatus } from "./offlineTiles";
import { remoteFiles, useOnDevice } from "./offlineFiles";
import { hasFacts, wantsFacts } from "./placeFacts";
import { useInstallState } from "./pwa";
import { touchDevice } from "./device";
import { plural } from "./dates";
import type { IconName } from "@/components/Icon";

/** one thing not yet ready for a trip with no signal, and where it's fixed */
export interface NotReady {
  key: "maps" | "files" | "facts" | "install";
  icon: IconName;
  title: string;
  detail: string;
  /** the page (and the section on it) that fixes it */
  to: string;
}

/**
 * What this device still needs before the trip works with no signal — the
 * trip's maps, its attachments, Good to know for its places, the app on the
 * home screen. Read from the device only (the map cache, the file store),
 * never the network. Null while it's still being read, so nothing flashes.
 */
export function useOfflineReadiness(data: TripData | null): NotReady[] | null {
  const activeId = useApp((s) => s.activeId);
  const install = useInstallState();
  const groups = data && canPrefetchTiles ? tripOfflineGroups(data) : [];
  const sig = JSON.stringify(groups);
  const [maps, setMaps] = useState<MapSaveStatus | null | undefined>(undefined);
  useEffect(() => {
    if (!activeId || !data || sig === "[]") { setMaps(null); return; }
    let live = true;
    const t = setTimeout(() => {
      void mapSaveStatus(activeId, groups, tripMapPoints(data)).then((s) => live && setMaps(s), () => live && setMaps(null));
    }, 400);
    return () => { live = false; clearTimeout(t); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId, sig]);
  const remote = data ? remoteFiles(data.docs) : [];
  const onDevice = useOnDevice(remote);

  if (!data || maps === undefined || (remote.length && !onDevice)) return null;
  const out: NotReady[] = [];
  if (maps?.missing) {
    out.push({
      key: "maps",
      icon: "map",
      title: maps.none ? "Save the trip’s maps" : maps.placesMissing ? `Save maps for ${plural(maps.placesMissing, "new place")}` : "Finish saving the trip’s maps",
      detail: `About ${maps.missingMB} MB — best on wifi`,
      to: "/manage/trips#this-device",
    });
  }
  const filesLeft = onDevice ? remote.filter((f) => !onDevice.has(f.id)).length : 0;
  if (filesLeft) {
    out.push({ key: "files", icon: "cloud-down", title: `Save ${plural(filesLeft, "attachment")}`, detail: "So documents open with no signal", to: "/manage/trips#this-device" });
  }
  const noFacts = data.places.filter((p) => wantsFacts(p, data) && !hasFacts(p.facts)).length;
  if (noFacts) {
    out.push({ key: "facts", icon: "info", title: `Look up ${plural(noFacts, "place")}`, detail: "Good to know isn’t filled in yet", to: "/manage/map#good-to-know" });
  }
  // the home-screen app is the one that opens offline; only asked on a phone
  if (touchDevice && (install.kind === "ios" || install.kind === "prompt")) {
    out.push({ key: "install", icon: "download", title: "Add the app to your Home Screen", detail: "It opens with no signal from there", to: "/manage/trips#this-device" });
  }
  return out;
}
