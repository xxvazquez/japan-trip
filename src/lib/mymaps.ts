/**
 * Google "My Maps" import. A public My Map exports its full contents as KML at
 *   https://www.google.com/maps/d/kml?mid=<MID>&forcekml=1
 * The endpoint is CORS-open, so the browser can fetch it directly. We pull out
 * exactly what the format reliably carries: name, coordinates, layer, colour.
 * Nothing here assumes a particular map's layers or country.
 */

export interface ImportedPlace {
  name: string;
  lat: number;
  lng: number;
  category?: string;
  color?: string;
}

export interface MyMapImport {
  mapName: string;
  places: ImportedPlace[];
}

/** Pull the `mid` out of any My Maps link (edit / view / embed / share). */
export function myMapId(url?: string): string | undefined {
  return url?.match(/[?&]mid=([^&#]+)/)?.[1];
}

export function kmlUrl(mid: string): string {
  return `https://www.google.com/maps/d/kml?mid=${encodeURIComponent(mid)}&forcekml=1`;
}

export async function fetchMyMap(url: string): Promise<MyMapImport> {
  const mid = myMapId(url);
  if (!mid) throw new Error("That doesn't look like a Google My Maps link (no mid=).");
  const res = await fetch(kmlUrl(mid));
  if (!res.ok) throw new Error(`Couldn't fetch the map (${res.status}). Is it public?`);
  return parseKml(await res.text());
}

/** ABGR hex (`ff485579`) → `#RRGGBB`. */
function abgrToHex(abgr?: string | null): string | undefined {
  if (!abgr || abgr.length < 8) return undefined;
  const b = abgr.slice(2, 4), g = abgr.slice(4, 6), r = abgr.slice(6, 8);
  return `#${r}${g}${b}`.toLowerCase();
}

export function parseKml(xml: string): MyMapImport {
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  if (doc.querySelector("parsererror")) throw new Error("The map export wasn't valid KML.");

  // style id -> colour. My Maps style ids look like `icon-1534-795548-nodesc`;
  // the 6-hex chunk is the colour the user picked. Fall back to <IconStyle><color>.
  const styleColor = new Map<string, string>();
  doc.querySelectorAll("Style").forEach((st) => {
    const id = st.getAttribute("id") ?? "";
    const fromId = id.match(/-([0-9A-Fa-f]{6})-/)?.[1];
    const fromColor = abgrToHex(st.querySelector("IconStyle > color")?.textContent?.trim());
    const c = fromId ? `#${fromId.toLowerCase()}` : fromColor;
    if (c) styleColor.set(id, c);
  });
  const colorFor = (styleUrl?: string | null): string | undefined => {
    const ref = styleUrl?.replace(/^#/, "");
    if (!ref) return undefined;
    // styleUrl points at a StyleMap; resolve to its "normal" Style, else try direct
    return styleColor.get(ref) ?? styleColor.get(`${ref}-normal`) ?? styleColor.get(`${ref}`);
  };

  const mapName = doc.querySelector("Document > name")?.textContent?.trim() || "My Map";
  const places: ImportedPlace[] = [];

  const readPlacemark = (pm: Element, category?: string) => {
    const coords = pm.querySelector("Point > coordinates")?.textContent?.trim();
    if (!coords) return; // skip lines / polygons / folder-less containers
    const [lng, lat] = coords.split(",").map(Number);
    if (!isFinite(lat) || !isFinite(lng)) return;
    places.push({
      name: pm.querySelector("name")?.textContent?.trim() || "Untitled",
      lat,
      lng,
      category,
      color: colorFor(pm.querySelector("styleUrl")?.textContent?.trim()),
    });
  };

  const folders = doc.querySelectorAll("Document > Folder");
  folders.forEach((f) => {
    const cat = f.querySelector(":scope > name")?.textContent?.trim() || undefined;
    f.querySelectorAll(":scope > Placemark").forEach((pm) => readPlacemark(pm, cat));
  });
  // placemarks sitting directly on the Document (no layer)
  doc.querySelectorAll("Document > Placemark").forEach((pm) => readPlacemark(pm));

  return { mapName, places };
}
