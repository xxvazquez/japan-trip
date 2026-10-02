import { describe, expect, it } from "vitest";
import { findTabelog, handleTabelog, nearestPrefectures, parseGeo, parseNames, parseResults, pickOsmPlaces, queries, sameName } from "./tabelog";

const result = (url: string, name: string) =>
  `<a class="list-rst__rst-name-target cpy-rst-name" target="_blank" rel="noopener" data-list-dest="item_top" href="${url}">${name}</a>`;
const page = (url: string, en: string, ja: string, lat: number, lng: number) =>
  `{"@type":"Restaurant","@id":"${url}","name":"${en}","image":""} <span class="alias">(${ja})</span>` +
  ` "geo":{"@type":"GeoCoordinates","latitude":${lat},"longitude":${lng}}`;

const A = "https://tabelog.com/en/aichi/A2301/A230101/23001424/";
const B = "https://tabelog.com/en/aichi/A2301/A230101/23000001/";

describe("parsing", () => {
  it("reads result links in order, once each", () => {
    expect(parseResults(result(A, "Inou") + result(B, "Other") + result(A, "Inou"))).toEqual([A, B]);
  });
  it("reads a page's pin and both names", () => {
    const html = page(A, "Inou Hitsumabushi ESCA Branch", "ひつまぶし 稲生 エスカ店", 35.17, 136.88);
    expect(parseGeo(html)).toEqual({ lat: 35.17, lng: 136.88 });
    expect(parseNames(html)).toBe("Inou Hitsumabushi ESCA Branch ひつまぶし 稲生 エスカ店");
  });
});

describe("matching names", () => {
  it("needs a distinctive word in common, not just the kind of food", () => {
    expect(sameName("Ichiran Shibuya", "Ichiran Shibuya ten")).toBe(true);
    expect(sameName("Sushi Dai", "Sushi Zanmai")).toBe(false);
    expect(sameName("Kyoto Gogyo", "OLIO STAGNO")).toBe(false);
  });
  it("folds long vowels in romanised names", () => {
    expect(sameName("Atsuta Horaiken Main Store", "Atsuta Houraiken Honten")).toBe(true);
    expect(sameName("Horaiken", "Hōraiken")).toBe(true);
  });
  it("compares Japanese names by character pairs, ignoring spacing", () => {
    expect(sameName("ひつまぶし稲生 エスカ店", "Inou ひつまぶし 稲生 エスカ店")).toBe(true);
    expect(sameName("あつた蓬莱軒本店", "Torikai 鳥開総本家")).toBe(false);
  });
  it("tries shorter forms of a long name", () => {
    expect(queries("Ichiran Shibuya Spain-zaka Store")).toEqual(["Ichiran Shibuya Spain-zaka Store", "Ichiran Shibuya", "Ichiran"]);
    expect(queries("AB")).toEqual(["AB"]);
  });
  it("scopes to the nearest prefectures", () => {
    expect(nearestPrefectures({ lat: 35.0116, lng: 135.7681 })[0]).toBe("kyoto");
    expect(nearestPrefectures({ lat: 35.6595, lng: 139.7005 })[0]).toBe("tokyo");
  });
});

describe("OpenStreetMap places", () => {
  const at = { lat: 35.1709, lng: 136.8803 };
  const el = (name: string, dLat: number, tags: Record<string, string> = {}) => ({ lat: at.lat + dLat, lon: at.lng, tags: { name, ...tags } });
  it("prefers places whose names share a word with ours", () => {
    const picked = pickOsmPlaces("Inou Hitsumabushi ESCA", at, [el("はなの舞", 0), el("ひつまぶし稲生 エスカ店", 0.0003, { "name:en": "Inou Hitsumabushi ESCA" })]);
    expect(picked.map((p) => p.name)).toEqual(["ひつまぶし稲生 エスカ店"]);
  });
  it("otherwise takes a place only when it's the one right at the pin", () => {
    expect(pickOsmPlaces("Atsuta Horaiken", at, [el("あつた蓬莱軒本店", 0.0001)]).map((p) => p.name)).toEqual(["あつた蓬莱軒本店"]);
    expect(pickOsmPlaces("Atsuta Horaiken", at, [el("一", 0.0001), el("二", 0.0002)])).toEqual([]);
    expect(pickOsmPlaces("Atsuta Horaiken", at, [el("遠い", 0.0005)])).toEqual([]);
  });
});

/** a fake Tabelog: search pages by query, restaurant pages by url */
function fakeFetch(searches: Record<string, string>, pages: Record<string, string>) {
  const seen: string[] = [];
  const impl = async (url: string) => {
    seen.push(url);
    if (url.includes("overpass")) return new Response(JSON.stringify({ elements: [] }));
    const q = new URL(url).searchParams.get("sw");
    const body = q !== null ? (searches[q] ?? "") : pages[url];
    return body === undefined ? new Response("", { status: 404 }) : new Response(body);
  };
  return { impl, seen };
}

describe("findTabelog", () => {
  const at = { lat: 35.1709, lng: 136.8803 };
  it("returns the result that is both nearby and the same name", async () => {
    const { impl } = fakeFetch(
      { "Inou Hitsumabushi": result(B, "Inou Hitsumabushi Far") + result(A, "Inou Hitsumabushi ESCA") },
      { [B]: page(B, "Inou Hitsumabushi Far", "", 35.3, 136.9), [A]: page(A, "Inou Hitsumabushi ESCA Branch", "", 35.1711, 136.8803) },
    );
    expect(await findTabelog("Inou Hitsumabushi", at, impl)).toBe(A);
  });
  it("rejects a nearby restaurant with a different name", async () => {
    const { impl } = fakeFetch({ "Kyoto Gogyo": result(B, "OLIO STAGNO") }, { [B]: page(B, "OLIO STAGNO", "", at.lat, at.lng) });
    expect(await findTabelog("Kyoto Gogyo", at, impl)).toBeNull();
  });
  it("throws when Tabelog turns the request away", async () => {
    const impl = async () => new Response("Just a moment", { status: 403 });
    await expect(findTabelog("Anything", at, impl)).rejects.toThrow("403");
  });
  it("keeps to its request budget", async () => {
    const { impl, seen } = fakeFetch({}, {});
    expect(await findTabelog("One Two Three Four", at, impl)).toBeNull();
    expect(seen.filter((u) => u.includes("tabelog")).length).toBeLessThanOrEqual(6);
  });
});

describe("handleTabelog", () => {
  it("rejects a request without a name or position", async () => {
    expect((await handleTabelog(new URL("https://x/api/tabelog?name=a"))).status).toBe(400);
  });
  it("reports a failed lookup as 502", async () => {
    const res = await handleTabelog(new URL("https://x/api/tabelog?name=a&lat=35&lng=136"), async () => new Response("", { status: 403 }));
    expect(res.status).toBe(502);
  });
});
