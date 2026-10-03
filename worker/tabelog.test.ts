import { describe, expect, it } from "vitest";
import { findTabelog, handleTabelog, nearestPrefectures, parsePage, pickOsmPlaces, pickResult, queries, sameName } from "./tabelog";

const A = "https://tabelog.com/en/aichi/A2301/A230101/23001424/";
const B = "https://tabelog.com/en/aichi/A2301/A230101/23000001/";

describe("parsing", () => {
  it("reads any link to a restaurant as its English page", () => {
    expect(parsePage("https://tabelog.com/aichi/A2301/A230101/23001424/dtlrvwlst/")).toEqual({ pref: "aichi", href: A });
    expect(parsePage("https://tabelog.com/zh-TW/aichi/A2301/A230101/23001424/")?.href).toBe(A);
    expect(parsePage("https://tabelog.com/en/aichi/rstLst/")).toBeNull();
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

describe("pickResult", () => {
  const r = (url: string, title: string) => ({ url, title });
  it("takes the closest-named page in a nearby prefecture", () => {
    const results = [r(B, "Inou - Nagoya/Unagi | Tabelog"), r(A, "<strong>Inou Hitsumabushi</strong> ESCA - Nagoya | Tabelog")];
    expect(pickResult(results, ["Inou Hitsumabushi ESCA"], ["aichi", "gifu"])).toBe(A);
  });
  it("skips pages in other prefectures and other names", () => {
    const far = "https://tabelog.com/en/tokyo/A1303/A130301/13000001/";
    expect(pickResult([r(far, "Inou Hitsumabushi | Tabelog")], ["Inou Hitsumabushi"], ["aichi", "gifu"])).toBeNull();
    expect(pickResult([r(A, "Sushi Zanmai | Tabelog")], ["Sushi Dai"], ["aichi"])).toBeNull();
  });
  it("matches a Japanese page by the local name", () => {
    expect(pickResult([r(A, "ひつまぶし稲生 エスカ店 (名古屋/うなぎ) - 食べログ")], ["Inou ESCA", "ひつまぶし稲生 エスカ店"], ["aichi"])).toBe(A);
  });
});

/** a fake search: results by query */
function fakeSearch(byQuery: Record<string, { url: string; title: string }[]>, status = 200) {
  const seen: string[] = [];
  const fetchImpl = async (url: string, init?: RequestInit) => {
    if (url.includes("overpass")) return new Response(JSON.stringify({ elements: [] }));
    const { query } = JSON.parse(String(init?.body)) as { query: string };
    seen.push(query);
    return new Response(JSON.stringify({ results: byQuery[query] ?? [] }), { status });
  };
  return { fetchImpl, seen };
}

describe("findTabelog", () => {
  const at = { lat: 35.1709, lng: 136.8803 };
  it("finds the page by name", async () => {
    const { fetchImpl } = fakeSearch({ "Inou Hitsumabushi": [{ url: A, title: "Inou Hitsumabushi ESCA | Tabelog" }] });
    expect(await findTabelog("Inou Hitsumabushi", at, "key", fetchImpl)).toBe(A);
  });
  it("tries a shorter name when the full one finds nothing", async () => {
    const { fetchImpl, seen } = fakeSearch({ "Inou Hitsumabushi": [{ url: A, title: "Inou Hitsumabushi | Tabelog" }] });
    expect(await findTabelog("Inou Hitsumabushi ESCA Branch", at, "key", fetchImpl)).toBe(A);
    expect(seen).toEqual(["Inou Hitsumabushi ESCA Branch", "Inou Hitsumabushi"]);
  });
  it("keeps to its search budget", async () => {
    const { fetchImpl, seen } = fakeSearch({});
    expect(await findTabelog("One Two Three Four", at, "key", fetchImpl)).toBeNull();
    expect(seen.length).toBeLessThanOrEqual(3);
  });
  it("throws when search can't be asked", async () => {
    const { fetchImpl } = fakeSearch({}, 401);
    await expect(findTabelog("Anything", at, "key", fetchImpl)).rejects.toThrow("401");
  });
});

describe("handleTabelog", () => {
  it("rejects a request without a name or position", async () => {
    expect((await handleTabelog(new URL("https://x/api/tabelog?name=a"), "key")).status).toBe(400);
  });
  it("says so when there's no search key", async () => {
    expect((await handleTabelog(new URL("https://x/api/tabelog?name=a&lat=35&lng=136"), undefined)).status).toBe(503);
  });
  it("reports a failed lookup as 502", async () => {
    const res = await handleTabelog(new URL("https://x/api/tabelog?name=a&lat=35&lng=136"), "key", fakeSearch({}, 432).fetchImpl);
    expect(res.status).toBe(502);
  });
});
