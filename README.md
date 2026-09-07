<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="public/brand/logo-256-dark.png">
    <img src="public/brand/logo-256-light.png" width="88" alt="" />
  </picture>
  <h1>Zuknesst Atlas</h1>
  <p><em>A private, offline-first travel workspace. One app, many trips.</em></p>
</div>

---

# Using the app

Everything for the trip in one place — the plan, the map, the hotels, the
luggage, the documents. It lives at:

**https://japan-trip.lauramaestuv.workers.dev**

## Getting in

1. Open the link. Sign in with **Google** — each person uses their **own**
   Google account. (Or tap **Use on this device only** to skip the account
   entirely: the trip stays on that one device and doesn't sync. **Manage →
   Trips → Sign in to sync** switches back later.)
2. New accounts start with just the read-only **Demo** trip. Make your real one
   from **Manage → New trip → Empty template**.
3. One account owns that trip. From it, go to **Manage → Sharing** and add the
   other person's email — then you both see and edit the **same trip**, and
   changes show up on the other device within a second or two.

If someone signs in before being added to the trip, they'll just see the Demo —
share the trip with that email and it appears on their next reload.

## On your phone

Open the link in Safari / Chrome → **Share → Add to Home Screen**. It then opens
like a normal app, full screen. Do this on both phones.

## The three tabs

**Plan** — the trip as a list of days, grouped by where you're staying. Each day
carries a tag — **Arrive**, **Travel**, **Depart**, **Day trip** — worked out
automatically from what you set on the day itself, never chosen by hand.
- Drag a day up or down to **reorder** it (the dates shuffle with it).
- Tap a day to open it. At the top: **Staying at** (which hotel) and **Journey**
  (link an existing one, or ＋ new — you then pick its type on the journey
  page). A **day trip** leads with how to get there and back, a checklist and
  the last train home; every day then has a **Plan** — an itinerary of steps,
  each a time and a line of text, **drag to reorder**.
  Expand a step (the **⌄**) for a note and to link it to a place on your map —
  linked steps show on the day's map. Below that, **Areas** (drop a whole
  neighbourhood's pins onto the map) and free-text **General notes**.

**Map** — your Google **My Map** pins, on a clean map.
- Switch the scope: **all places**, **today**, a **day**, a **stay**, or an
  **area** (see below).
- Filter by **category** with the coloured dots — none selected shows everything;
  tap some to narrow. Category combines with the scope, so "an area + See" shows
  only the sights in that area.
- Give a category its own **pin icon** in **Manage → Content → Category pins** —
  those places then draw as a coloured disc with the icon instead of a plain
  dot. Categories left as "Dot" are unchanged.
- **Transit** row — **Train** and **Metro** are laid over the map by default;
  tap to add **Tram**, **Bus**, **Ferry** or **Airport**, or to turn any off.
  It's read straight from the basemap, so it works in any city with no setup,
  and the choice is remembered.
- Tap a pin or a list row — they select each other and the map flies there.
- **＋ Add place** → search for somewhere, or tap the map to drop a pin.
- **Sync** re-pulls everything from your Google My Map. It replaces the imported
  pins but keeps anything you added in the app and any notes you wrote.
- Place names on the map are shown in English / Latin script (falling back to
  the local name only when there's no other), so it reads the same in any
  country.

**Areas vs. categories.** A category is *what* a place is (coffee, see, food…).
An **area** is *where* it is (Gion, Higashiyama, a neighbourhood you name). A
place can sit in several areas. Create one from the *+ Add area* row under the
map list (name it and it's made), assign places from a pin's detail panel on
the Map, and rename or delete one with *Edit areas* in that same row
(place-by-place membership for a whole area lives in Manage → Content →
Areas). Once areas exist, an **Areas** row of chips sits with
the category and transit filters — tap to show just those areas on the map (and
in the list); none lit means all. On the **All places** view the list itself
splits into a collapsible section per area (plus a *No area* group), so you can
fold away the ones you're not looking at. Add an area to a **day** (on the day
page) and every place in it shows on that day's map — a live link, so editing
the area later updates the day too. Area places show slightly faded and aren't
added to your plan unless you tap the **+** on the area to drop one in as a
step. Zoom out
on **All places** or an area scope and each area gets a faint labelled ring so
you can see its rough extent at a glance.

**Suggest areas.** When four or more places aren't in any area, a *Suggest
areas* link joins that row. It groups them by how close together they are (the
"close enough" distance is worked out from your own places, so it fits a tight
city or a spread-out road trip) and names each group after the neighbourhood it
sits in. You review the groups — rename, untick, drop a place — and only the
ones you keep become real areas. It never changes an area you already have.

**Logbook** — the reference drawer. Tabs along the top: stays · getting around ·
luggage · documents · emergency numbers · packing · budget · a scratchpad, plus
any lists you've added yourself. **Documents** is one card per document —
name it ("Travel insurance"), attach the PDF / photo, add whatever fields you
want, add a note. Every card is renamable, removable, and you add more from
the tab. Attachments stay only on the device they were added on (or, when
Drive is connected, a shared trip folder). In **packing** you build the
checklist right there —
add a category, add items under it, tick them off as you go. **Budget** totals
every price in the trip — a stay's price, a journey's fare, a day's spending —
grouped by currency (nothing is summed across currencies). A journey with a
total *and* per-hop fares counts once, not twice. Bare numbers count as the
trip currency (Manage → Setup). Nothing is entered on this tab.

In **Manage → Setup** you name the **travellers** (used for packing
assignment), set a **trip currency** so a bare `100` in a price means `100`
of that currency, hide the Logbook sections you don't need, and **add your
own** — a title plus a list of things (name, note, link). Handy for
"Restaurants to try", "Gifts to bring back", and so on.

## Sharing a copy

**Manage → Sharing → Download web page** builds the whole trip as one
self-contained `.html` file — itinerary, journeys, stays and the place list, all
styled, no internet needed. Open it in any browser, or print it (print-to-PDF for
a PDF). Send it to whoever you're travelling with.

Leave **Include private details** off for anything you share: a stay's own
reference fields (door codes, wifi, booking refs…), a segment's booking ref and
the whole documents section are held back. Turn it on for your own copy.
Document *attachments* are never included.

## Editing anything

Tap almost any piece of text and it becomes editable on the spot. Type, tap
away, done. There's no separate "edit mode". Dates and times open a picker; once
a link is filled in it turns into a normal clickable link (with a small "edit").

When you're signed in, a small dot next to the header search icon shows edits
saving (grey), saved (green, briefly), or held for later if you're offline
(amber). On-device-only trips save instantly and show nothing.

**Notes** fields (a day's General notes, a stay, a journey, and the Logbook's Scratchpad) take
light Markdown — `**bold**`, `*italic*`, `-` bullet lists, `>` quotes, headings
and `[links](https://…)`. A slim B / I / • / link toolbar and the usual
⌘/Ctrl-B · ⌘/Ctrl-I shortcuts are there while editing; bullets continue on Enter.

## The demo trip

Every account has a read-only **Demo** trip — a made-up example with notes
explaining how each screen works. You can't edit it; it's just there to look at.
Delete it whenever from Manage → Trips (and re-add it from the same place).

**Manage** (the gear icon, top right) is only for bigger structural changes —
adding or removing days, changing trip dates, theme, sharing.

## Offline

Once the app has loaded on the plane / hotel wifi, it keeps working with no
signal — on the flight, on the metro, inside temples. The one thing that needs
data is the **map background** itself; your pins and the whole plan work offline.
Map areas you've already looked at are cached, so they still draw with no
signal; open a fresh area offline and the map says so and offers a retry
(which fires automatically the moment you're back online).

Edits you make while offline (or during a dropped connection) are held and
retried automatically once you're back on signal, as long as the tab stays open.
When the connection returns, the app also re-pulls the trip so a travel
companion's changes made in the meantime show up.

Opening the app for the very first time on a device with no signal (before
anything's cached) shows a plain "you're offline" screen instead of hanging on
the loading spinner — it retries on its own once you're back on signal, or tap
Try again.

## If something looks out of date

After an update the app can briefly show an old version. Close the tab (or the
installed app) fully and reopen it, or pull down to refresh. It'll catch up.

---

# Technical

A trip-agnostic React PWA. Nothing in the code assumes Japan — a future trip is a
new template folder, no source changes.

## Stack

Vite + React + TypeScript · Tailwind · React Router · Zustand · vite-plugin-pwa
(Workbox) · Supabase (Postgres + Auth + RLS + Realtime) · MapLibre GL + Protomaps
vector tiles · dnd-kit · idb-keyval.

## How data is stored

```
edit in the UI  →  TripData (in memory)  →  backend
                                            ├─ Supabase   (signed in)
                                            └─ IndexedDB  (local, offline)
```

- **With Supabase** (`VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` set): every
  entity — legs, days, hotels, journeys (+ segments), luggage, docs, packing,
  places, areas (+ area_places) — is its own row, private to your account (RLS),
  synced across devices and shareable with another account. Schema:
  [`supabase/migrations/`](supabase/migrations/).
- **Without it**: everything stays in the browser. No sign-in.
- **With it, but "Use on this device only"** (the link on the sign-in screen):
  same local browser storage as above, no account — a per-device
  `localStorage["za.localOnly"]` flag that `needsAuth()` honours. **Manage →
  Trips** has the way back.

The Supabase client is code-split — never downloaded unless a project is
configured. So is the MapLibre bundle (only the Map section pulls it in).

## Getting started

```bash
npm install
npm run dev            # http://localhost:5173
```

| Script | |
|---|---|
| `npm run dev` | dev server |
| `npm run build` | production build → `dist/` |
| `npm run preview` | serve the build |
| `npm run typecheck` | `tsc --noEmit` |

### `.env.local`

```ini
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<the anon / public key>
VITE_PROTOMAPS_API_KEY=<a Protomaps hosted-API key>
```

All optional — with nothing set the app runs fully local. `VITE_SUPABASE_URL`
must be the **full https URL**, not just the project ref. The map tile settings
(`VITE_PROTOMAPS_API_KEY`, `VITE_MAP_TILES_URL`) are covered under
[The map background](#the-map-background).

## Setting up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. **SQL Editor** → run every file in `supabase/migrations/` **in order**
   (`0001` → `0021`).
3. **Authentication → Providers → Google** → enable, paste a Google Cloud OAuth
   client id / secret, redirect
   `https://<project-ref>.supabase.co/auth/v1/callback`.
4. **Authentication → URL Configuration → Redirect URLs** → add
   `http://localhost:5173` and the deployed URL.
5. Put the Project URL + anon key (**Project Settings → API**) in `.env.local`.

On first sign-in the app seeds your first trip automatically. After a schema
change, delete the trip and reload to re-seed from the template.

## Deploy

Runs on **Cloudflare Workers** (static assets) via the Git integration.

- [`wrangler.jsonc`](wrangler.jsonc) points the Worker at `./dist` and turns on
  SPA routing (`not_found_handling: "single-page-application"`).
- There is **no `public/_redirects`** — the Workers asset pipeline rejects the
  usual `/*  /index.html  200` catch-all as a redirect loop, and `wrangler.jsonc`
  already covers it. `public/_headers` (cache rules) still applies.

**Cloudflare dashboard → Workers & Pages → Create → import `xxvazquez/japan-trip`:**

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Build variables | `NODE_VERSION` = `22`<br>`VITE_SUPABASE_URL` = `https://<project-ref>.supabase.co` (full URL, **no quotes**)<br>`VITE_SUPABASE_ANON_KEY` = the anon key |

`VITE_*` values are inlined by Vite at build time, so a changed build variable
**only takes effect on the next build** — editing a variable does not redeploy on
its own.

After the first deploy: add the `*.workers.dev` URL to the Supabase Redirect URLs
(step 4 above), or Google sign-in fails. Optionally gate the site with
**Cloudflare Access** (Zero Trust → Access → self-hosted app → allow your emails).

## Project layout

```
src/
  core/types.ts        domain types — trip-agnostic
  lib/                 backend · db · auth · storage · dates · maps ·
                       mapStyle · mymaps (KML import) · geocode (Nominatim)
  store/useApp.ts      trips + active trip + every mutation
  components/          shell + primitives (Editable, MapView, BackBar, Icon…)
  routes/              one file per page (Plan, Day, Leg, Journey, MapTab,
                       Logbook, Hotel, Manage)
  templates/           seed data for a new trip (blank, or a worked example)
supabase/migrations/   database schema, applied in order
supabase/dump_trip.sql read-only: one trip's whole content as JSON, for diffing
scripts/make_icons.py  regenerates icons from logo.png
```

## The map background

The map uses [MapLibre GL](https://maplibre.org) with
[Protomaps](https://protomaps.com) vector tiles (OpenStreetMap data).
`maplibre-gl` is pinned to 5.x (6.x breaks pmtiles tile loading).

The tile source is chosen at build time, in this priority order:

### 1. Protomaps hosted API — `VITE_PROTOMAPS_API_KEY` (recommended)

The **whole planet**, CDN-cached, fast to first paint anywhere on Earth — so a
future trip to anywhere just works, no rebuild. Free for non-commercial use up
to 1M tile requests/month; a personal trip app uses a tiny fraction of that.

1. Sign up at [protomaps.com/account](https://protomaps.com/account) and issue a key.
2. Put it in `.env.local` as `VITE_PROTOMAPS_API_KEY=` (just the key) and in the
   Cloudflare project's build variables, then redeploy.

Tiles come back as plain `200`s, so the service worker caches them
([`vite.config.ts`](vite.config.ts) → `runtimeCaching` → `map-tiles`): an area
you've opened once then paints instantly and works fully offline. Only
brand-new regions touch the network. Label fonts are cached the same way
(`map-glyphs`).

### 2. Self-hosted extract — `VITE_MAP_TILES_URL`

A single `.pmtiles` file you host yourself. Only covers the geographic box you
extracted, and range requests (`206`) aren't service-worker cached — but needs
no third-party account. The host must support **HTTP range requests** and send
permissive **CORS**.

Build one with the [`pmtiles`](https://github.com/protomaps/go-pmtiles) CLI:

```bash
pmtiles extract https://data.source.coop/protomaps/openstreetmap/v4.pmtiles japan.pmtiles \
  --region=tiles-region.geojson --maxzoom=14
```

`tiles-region.geojson` (repo root) is a GeoJSON `MultiPolygon` of the boxes to
keep; a single `--bbox=minLon,minLat,maxLon,maxLat` also works. `--maxzoom=15`
gives building-level detail at ~2.5× the size. **Netlify** hosts it free with no
payment card (deploy a folder containing the file plus a `_headers` file whose
body is `/*` then an indented `Access-Control-Allow-Origin: *`). Cloudflare R2
also works but needs a card on file to activate.

### 3. Nothing set

Falls back to Protomaps' entire-planet archive on Source Cooperative. Works
everywhere, but first paint takes 20–30 s — every tile walks a directory inside
a 130 GB file on a bucket with no edge cache. The Map screen shows the loading
spinner meanwhile.

## Branding

`logo.png` (dark) / `logo-light.png` at the repo root are the source — both
full-bleed square marks, no padding. Regenerate everything under
`public/icons` and `public/brand` with `python3 scripts/make_icons.py`.
PWA icons are static (a manifest can't react to the OS theme) so they use the
dark mark; in-app marks (`Wordmark`, sign-in/offline/error screens) switch
between the dark/light PNGs at runtime via `useIsDark()` (`src/lib/mode.ts`).
`logo-wordmark.png` / `logo-wordmark-light.png` are reference art with the
"ZUKNESST ATLAS" wordmark baked in — not consumed anywhere yet, kept for a
future banner/share-image use. Per-trip logos and covers are uploaded in the
app (*Manage → Appearance*).

---

<sub>Private project — not for redistribution.</sub>
