"""Builds src/guides/japan/map.ts from Natural Earth 1:10m admin-1 boundaries.

1. Download ne_10m_admin_1_states_provinces.geojson from
   https://github.com/nvkelso/natural-earth-vector/tree/master/geojson
2. Keep Japan: features whose iso_a2 is "JP", as a FeatureCollection.
3. python3 scripts/build_map.py jp.geojson src/guides/japan/map.ts
"""
import json, math, sys
src, out = sys.argv[1], sys.argv[2]
d = json.load(open(src))
# ISO number -> (name, capital, region)
T = """01|Hokkaido|Sapporo|Hokkaido
02|Aomori|Aomori|Tōhoku
03|Iwate|Morioka|Tōhoku
04|Miyagi|Sendai|Tōhoku
05|Akita|Akita|Tōhoku
06|Yamagata|Yamagata|Tōhoku
07|Fukushima|Fukushima|Tōhoku
08|Ibaraki|Mito|Kantō
09|Tochigi|Utsunomiya|Kantō
10|Gunma|Maebashi|Kantō
11|Saitama|Saitama|Kantō
12|Chiba|Chiba|Kantō
13|Tokyo|Tokyo|Kantō
14|Kanagawa|Yokohama|Kantō
15|Niigata|Niigata|Chūbu
16|Toyama|Toyama|Chūbu
17|Ishikawa|Kanazawa|Chūbu
18|Fukui|Fukui|Chūbu
19|Yamanashi|Kōfu|Chūbu
20|Nagano|Nagano|Chūbu
21|Gifu|Gifu|Chūbu
22|Shizuoka|Shizuoka|Chūbu
23|Aichi|Nagoya|Chūbu
24|Mie|Tsu|Kansai
25|Shiga|Ōtsu|Kansai
26|Kyoto|Kyoto|Kansai
27|Osaka|Osaka|Kansai
28|Hyōgo|Kobe|Kansai
29|Nara|Nara|Kansai
30|Wakayama|Wakayama|Kansai
31|Tottori|Tottori|Chūgoku
32|Shimane|Matsue|Chūgoku
33|Okayama|Okayama|Chūgoku
34|Hiroshima|Hiroshima|Chūgoku
35|Yamaguchi|Yamaguchi|Chūgoku
36|Tokushima|Tokushima|Shikoku
37|Kagawa|Takamatsu|Shikoku
38|Ehime|Matsuyama|Shikoku
39|Kōchi|Kōchi|Shikoku
40|Fukuoka|Fukuoka|Kyushu
41|Saga|Saga|Kyushu
42|Nagasaki|Nagasaki|Kyushu
43|Kumamoto|Kumamoto|Kyushu
44|Ōita|Ōita|Kyushu
45|Miyazaki|Miyazaki|Kyushu
46|Kagoshima|Kagoshima|Kyushu
47|Okinawa|Naha|Okinawa"""
P = {r[0]: r[1:] for r in (l.split("|") for l in T.split("\n"))}

# projection: equirectangular scaled by cos(36°), 1 unit = 0.01° of longitude
K = math.cos(math.radians(36))
W = 1000
MAIN = dict(lng0=128.6, lng1=146.0, lat0=30.0, lat1=45.6)   # the main islands
INS = dict(lng0=122.9, lng1=130.4, lat0=24.0, lat1=28.6)    # Ryukyu / Okinawa, set as an inset
s = W / ((MAIN["lng1"] - MAIN["lng0"]) * K)
H = round((MAIN["lat1"] - MAIN["lat0"]) * s)
# the inset sits top left, in the empty sea west of Hokkaido, at a smaller scale
si = s * 1.0
IX, IY = 12, 12
def pm(lng, lat): return ((lng - MAIN["lng0"]) * K * s, (MAIN["lat1"] - lat) * s)
def pi(lng, lat): return (IX + (lng - INS["lng0"]) * K * si, IY + (INS["lat1"] - lat) * si)
IW = (INS["lng1"] - INS["lng0"]) * K * si
IH = (INS["lat1"] - INS["lat0"]) * si

def rdp(pts, eps):
    if len(pts) < 3: return pts
    a, b = pts[0], pts[-1]
    dx, dy = b[0]-a[0], b[1]-a[1]; L = math.hypot(dx, dy) or 1e-9
    i, m = 0, -1
    for k in range(1, len(pts)-1):
        p = pts[k]; dd = abs(dy*(p[0]-a[0]) - dx*(p[1]-a[1])) / L
        if dd > m: i, m = k, dd
    if m > eps: return rdp(pts[:i+1], eps)[:-1] + rdp(pts[i:], eps)
    return [a, b]
def area(r): return abs(sum(r[i][0]*r[i-1][1] - r[i-1][0]*r[i][1] for i in range(len(r)))) / 2

def ring_path(r, proj, eps, min_area):
    pts = [proj(*c) for c in r]
    if area(pts) < min_area: return None
    # a ring starts and ends on the same point: split it at the point
    # farthest from the start and simplify each half
    far = max(range(len(pts)), key=lambda k: (pts[k][0]-pts[0][0])**2 + (pts[k][1]-pts[0][1])**2)
    q = rdp(pts[:far+1], eps)[:-1] + rdp(pts[far:], eps)
    if len(q) < 4: return None
    out = []
    for x, y in q[:-1]:
        out.append((round(x, 1), round(y, 1)))
    return out

prefs = []
for f in d["features"]:
    pr = f["properties"]; code = pr["iso_3166_2"].split("-")[1]
    name, capital, region = P[code]
    g = f["geometry"]; polys = g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]
    main, inset = [], []
    for poly in polys:
        outer = poly[0]
        lat = sum(c[1] for c in outer) / len(outer); lng = sum(c[0] for c in outer) / len(outer)
        if lat >= MAIN["lat0"] - 0.1 and MAIN["lng0"] - 0.5 <= lng <= MAIN["lng1"]:
            r = ring_path(outer, pm, 0.6, 1.5)
            if r: main.append(r)
        elif INS["lat0"] <= lat <= INS["lat1"] and INS["lng0"] <= lng <= INS["lng1"]:
            r = ring_path(outer, pi, 0.5, 0.6)
            if r: inset.append(r)
        # anything else (Ogasawara, Minamitorishima, Okinotorishima) is left off
    lx, ly = (pi if code == "47" else pm)(pr["longitude"], pr["latitude"])
    prefs.append(dict(code=int(code), name=name, local=pr["name_ja"], capital=capital, region=region,
                      rings=main, inset=inset, label=[round(lx, 1), round(ly, 1)]))
prefs.sort(key=lambda p: p["code"])

def ringstr(r): return " ".join(f"{x},{y}" for x, y in r)
lines = []
lines.append("// Generated from Natural Earth 1:10m admin-1 boundaries (public domain),")
lines.append("// simplified. Each ring is \"x,y x,y …\" in the map's own units.")
lines.append("import type { CountryMap } from \"../map\";")
lines.append("")
lines.append("export const japanMap: CountryMap = {")
lines.append(f"  width: {W}, height: {H},")
lines.append(f"  main: {{ lng0: {MAIN['lng0']}, lat1: {MAIN['lat1']}, scale: {round(s, 4)}, k: {round(K, 6)} }},")
lines.append(f"  inset: {{ x: {IX}, y: {IY}, w: {round(IW, 1)}, h: {round(IH, 1)}, lng0: {INS['lng0']}, lat1: {INS['lat1']}, scale: {round(si, 4)} }},")
lines.append("  unit: { one: \"prefecture\", many: \"prefectures\" },")
lines.append("  areas: [")
for p in prefs:
    rings = ", ".join(json.dumps(ringstr(r)) for r in p["rings"])
    ins = ", ".join(json.dumps(ringstr(r)) for r in p["inset"])
    lines.append(f"    {{ code: {p['code']}, name: {json.dumps(p['name'], ensure_ascii=False)}, local: {json.dumps(p['local'], ensure_ascii=False)}, capital: {json.dumps(p['capital'], ensure_ascii=False)}, region: {json.dumps(p['region'], ensure_ascii=False)}, label: [{p['label'][0]}, {p['label'][1]}],")
    lines.append(f"      rings: [{rings}],")
    if ins: lines.append(f"      inset: [{ins}],")
    lines.append("    },")
lines.append("  ],")
lines.append("};")
open(out, "w").write("\n".join(lines) + "\n")
print("H", H, "points", sum(len(r) for p in prefs for r in p["rings"] + p["inset"]), "rings", sum(len(p["rings"]) + len(p["inset"]) for p in prefs))
