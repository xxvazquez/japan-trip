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

## Plan, Map, Logbook

**Plan** — the trip as a list of days, grouped by where you're staying. Each day
carries a tag — **Arrive**, **Travel**, **Depart**, **Day trip** — worked out
automatically from what you set on the day itself, never chosen by hand.
- Drag a day up or down to **reorder** it (the dates shuffle with it).
- Tap a day to open it. At the top: **Staying at** (which hotel) and **Journey**
  (link an existing one, or ＋ new — you then pick its type on the journey
  page). A **day trip** leads with a **Getting there** and a **Getting back**
  card (free text, the last way home folded into the back one), then the
  day's **Plan** — an itinerary of steps, each with a leading tile
  (the linked place's category, or a plain pin), a time on a quiet line first
  (optional — a single time or a `14:00–15:15` range), then what the step
  actually is: pick a place from the Areas you've added to this day (below) —
  past 2 linked areas, each option in the picker shows which area it's from —
  or **Custom…** for a one-off with its own text field. **Drag to reorder**.
  Underneath, its own quiet note line (bold, bullets, links) — tap to expand
  and edit; a step linked to a place shows on the day's map.
  Below that, **Areas** (drop a whole neighbourhood's pins onto the map — a
  chip's **×** asks first), a **Spending** list (a category and a whole
  number per row, plus an optional note; subtotalled and fed to Expenses),
  and free-text **General notes**. Every section here folds away from its
  header.

**Journeys** (linked from a day, or the *getting around* tab). A journey is one
or more **hops**. Each hop is a card, tinted by mode (rail, air/sea, road, on
foot), reading top to bottom: mode → route → the two times joined by a rule
with the duration on it → the details (carrier, platform, seat, booking ref,
fare — a whole number, in the trip's currency unless you pick another) as
label-and-value rows. Between hops, a note on the connection time flags a
tight or overnight change. The
**total fare** at the top adds itself up from the hops' fares; type a figure
into it to override with a single ticket price. It's the same number Expenses
uses, counted once — split by each hop's mode if a category claims it,
otherwise under the generic Transport category (a manual override total has no
single mode, so it always lands there).

**Map** — your Google **My Map** pins, on a clean map. It reads **city → area →
filters → places**, top to bottom.
- **City pills** — **All** plus one per stay (and **Today** while the trip is
  running), coloured to match the trip. Pick a city and the map and the list
  both narrow to it straight away; the app opens on wherever you are (or the
  first stay). A city's pins are the ones planned on its days, plus any imported
  pins that fall nearest to it, within about 60 km — "nearest" measured from the
  stay's **hotel** (its coordinates, taken from the pasted Maps link or geocoded
  from the address once) or, failing that, the places its days already use. A
  pin farther than that from every stay belongs to no city and shows only on
  **All**. A stay gets a pill once its hotel has coordinates, or once it has a
  pin to show.
- **＋ Add place** sits next to the pills, always one tap — search for somewhere,
  or tap the map to drop a pin.
- **Area chips** appear once a city is picked — just that city's areas that have
  a place in view. Tap to show only those; none lit means all. On **All** the
  list nests instead — **city → area → places**, each level collapsible — so a
  multi-city trip reads top to bottom without the chips.
- **Filters** — a disclosure holding **category** and **transit**, folded away
  by default:
  - **Category** — the coloured dots; none selected shows everything, tap some
    to narrow. Give a category its own **pin icon** in **Manage → Content →
    Category pins** — those places draw as a coloured disc with the icon.
  - **Transit** — **Train** and **Metro** are laid over the map by default; tap
    to add **Tram**, **Bus**, **Ferry** or **Airport**, or to turn any off.
    It's read straight from the basemap, works in any city with no setup, and
    the choice is remembered.
  - When editing, **Areas** — add one, suggest areas, or rename / delete —
    lives here too.
- Tap a pin or a list row — they select each other and the map flies there.
- While **Today** is picked, a **crosshair icon** turns the list into what's
  actually close by — asks for your location once, then sorts by distance and
  narrows to within 1.5 km if that leaves anything (a place's row shows its
  distance in place of the category dot). Nothing within range, no fix yet, or
  location denied — you still see today's full list, nearest-first once a fix
  arrives. Never asks until you tap it, and doesn't remember being on for next
  time.
- The small list/map icon next to **＋ Add place** switches to a **full-screen
  list** — no map, just the list at full width (desktop) or full height
  (phone). Handy for reorganising areas or picking through a long list; tap it
  again for the map back. Remembered next time you open the tab.
- **Sync** re-pulls everything from your Google My Map. It replaces the imported
  pins but keeps anything you added in the app and any notes you wrote.
- Place names on the map are shown in English / Latin script (falling back to
  the local name only when there's no other), so it reads the same in any
  country.

**Areas vs. categories.** A category is *what* a place is (coffee, see, food…).
An **area** is *where* it is (Gion, Higashiyama, a neighbourhood you name). A
place can sit in several areas. Create one under **Filters → Areas → Add area**
(name it and it's made), assign places from a pin's detail panel on the Map, and
rename or delete one with *Edit areas* in that same place — that's also where
place-by-place membership for a whole area is edited; Manage → Content doesn't
list areas, since the Map's own editor already covers it. The **area
chips** above the Filters row show only the areas with a place in the chosen
city — tap to show just those on the map and in the list; none lit means all.
The list itself splits into a collapsible section per area (plus a *No area*
group), so you can fold away the ones you're not looking at. Add an area to a
**day** (on the day page) and every place in it shows on that day's map — a live
link, so editing the area later updates the day too. Area places show slightly
faded and aren't added to your plan unless you tap the **+** on the area to drop
one in as a step. Zoom out and each area gets a faint labelled ring so you can
see its rough extent at a glance.

**Suggest areas.** When four or more places aren't in any area, a *Suggest
areas* link joins the Areas controls. It groups them by how close together they
are (the "close enough" distance is worked out from your own places, so it
fits a tight city or a spread-out road trip, but never past roughly a 15–20
min walk end to end — a spread-out itinerary's own places never get lumped
into one supposedly "walkable" group just because everything else that trip is
even more spread out) and names each group after the neighbourhood it sits in.
You review the groups — rename, untick, drop a place — and only the ones you
keep become real areas. It never changes an area you already have.

**Logbook** — the reference drawer. A menu of sections, each its own page:
stays · getting around · luggage · documents · emergency numbers · packing ·
expenses (a proportional bar above each currency's list shows the category
split at a glance, coloured to match each category's own icon) · a
scratchpad, plus any lists you've added yourself. **Documents** is
one card per document —
name it ("Travel insurance"), attach the PDF / photo, add whatever fields you
want, add a note. Every card is renamable, removable, and you add more from
the tab. Attachments stay only on the device they were added on (or, when
Drive is connected, a shared trip folder). In **packing** you build the
checklist right there — add a category, add items, tick them off. Categories
fold away; with two or more travellers set (Manage → Setup) each item gets an
**assign** pill (a traveller's initial, **Shared**, or **—**). **Expenses** totals
every price in the trip — a stay's price, a journey's fare, a day's spending —
**grouped by category** and then by currency (nothing is summed across
currencies, except the **Combined** total — see below). Stay prices land under
Accommodation; a fare lands under whichever category claims its hop's mode
(Train, Flights…), or under Transport if none does; each day-spending row
lands under the category you picked. A journey with a total *and* per-hop
fares counts once, not twice. If the trip uses two or more currencies, a **Combined** section at the
top adds them all together in the primary one, using an exchange rate fetched
automatically when you're online (and cached for when you're not — it just
shows the last one it fetched). Nothing is entered on this tab.

In **Manage → Setup** you name the **travellers** (used for packing
assignment), list the **currencies** the trip uses — the first is the default
(a new trip starts on `PLN`), so every price field shows its symbol and a bare
`100` counts as it without the symbol being typed; add a second currency and
every price — a stay, a fare, a spending row, a custom "Price" field — gets a
currency picker — edit the **expense categories** (reorder, rename, add,
remove — the list can't be emptied, and removing one moves its spending to
the next category rather than leaving it uncategorised; a category can also
claim specific hop modes so fares split further than one lump "Transport").
Each one's **icon** (shown on every Spending row and in Expenses) is guessed
from that mode/role, or the name — tap the icon itself to pick your own from a
grid instead. Hide the Logbook sections you don't need from the same
Setup tab. The **Tabs** panel above it reorders, renames or hides the three
main tabs (Plan, Map, Logbook) — and **Add tab** lets you pin any Logbook page
(Packing, say) straight onto the main nav as its own tab, alongside them;
hiding a pinned page's Logbook section disables its tab too, so there's never
a dead link. A **Help & FAQ** link sits at the bottom of every Manage tab —
plain-language answers to the non-obvious bits ("modes", Custom vs. a place
in Plan, Areas vs. categories, My Maps sync…), for anyone new to the app.

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
a link, phone or email is filled in it turns into the real clickable thing, with
a small pencil on the right of the row to edit it.

When you're signed in, a small label next to the header search icon shows
what's happening: **Saving…** (grey, while it's in flight), **Saved** (green,
flashes briefly once it lands), or **Offline** (amber, stays up for as long as
you're disconnected — edits keep queuing and send the moment you're back).
On-device-only trips save instantly and show nothing — there's nothing to be
behind on.

**Notes** fields (a day's General notes and Getting there/back, a stay's notes
and directions, a journey, a luggage note's detail, a map place's note, and
each of the Logbook Scratchpad's notes) take light Markdown — `**bold**`, `*italic*`,
`++underline++`, `~~strikethrough~~`, `##` headings, `>` quotes, `-` bullet
lists, `- [ ]` checklists and `[links](https://…)`. A slim B / I / U / S / H /
" / • / ☑ / link toolbar covers all of it without needing to know the syntax,
plus the usual ⌘/Ctrl-B · ⌘/Ctrl-I · ⌘/Ctrl-U · ⌘/Ctrl-Shift-X shortcuts;
bullets continue on Enter. A checklist item's box is tappable straight from
the read view — ticking it off doesn't open the editor.

## The demo trip

Every account has a read-only **Demo** trip — a made-up example with notes
explaining how each screen works. You can't edit it; it's just there to look at.
Delete it whenever from Manage → Trips (and re-add it from the same place).

**Manage** (the gear icon, top right — or its own spot at the foot of the
sidebar on a wider screen) is only for bigger structural changes — adding or
removing days, changing trip dates, theme, sharing.

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
installed app) fully and reopen it, or pull down from the top of any page to
re-pull the trip. It'll catch up.

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
  places, areas (+ area_places), scratchpad notes — is its own row, private to
  your account (RLS), synced across devices and shareable with another
  account. Schema: [`supabase/migrations/`](supabase/migrations/).
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
| `npm run dev:demo` | dev server, local-only, seeded with an editable Sandbox trip — no Supabase project or sign-in needed |
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
   (`0001` → `0025`).
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

Two source files at the repo root, both full-bleed squares, regenerated into
everything under `public/icons` and `public/brand` with
`python3 scripts/make_icons.py`:

- `logo.png` — **opaque**, one flat dark-teal background (see below — the raw
  render's own background isn't actually flat). Drives only the two icon
  outputs that genuinely need a solid background: `apple-touch-icon.png`
  (iOS forces an ugly black one behind a transparent touch icon) and
  `icon-maskable-512.png` (the OS crops it to its own shape but never adds a
  backing, so a transparent one shows through as holes — that's what
  "maskable" means in the manifest spec). There's only one — not a light/dark
  pair — since a manifest icon can't react to the OS theme anyway.
- `logo-mark.png` — **transparent**, the glyph only, no background at all.
  Drives everything that can safely stay transparent: `favicon.png`, the
  `"any"`-purpose PWA icons (`icon-192.png` / `icon-512.png` — a browser tab
  or a launcher just shows whatever's behind them) and the in-app themed marks
  (`Wordmark`, sign-in/offline/error screens), which already sit inside the
  app's own rounded, coloured container — a baked-in background there doubled
  up one rounded shape inside another. `favicon.png` alone gets an extra
  contrast/saturation/sharpen pass (`bolden_for_favicon` in the script,
  applied after the resize, not before — sharpening the full-res source and
  then shrinking just blurs it straight back out) since a browser tab shrinks
  it further still, to ~16px, where the mark's fine topographic wing lines
  would otherwise average into soft grey-green mush. Every other output stays
  a plain resize; the topo detail is fine at every size it's actually shown.

The current mark (a beetle carrying a topographic map) doesn't need a
different in-app rendering per theme — being background-less, `logo-mark.png`
already reads fine on both a light and a dark surface — so both in-app
filenames (`logo-{size}-dark/light.png`) currently render from that one file.
Swap in a genuinely different per-theme pair later if the mark ever needs one
and each will pick up its own split automatically (`useIsDark()`,
`src/lib/mode.ts`).

The raw dark render `logo.png` comes from has a rounded, lighter "card" sitting
on a visibly darker square — a vignette baked in by whatever generated it, not
a flat colour. Left as-is, that reads as a second background layer behind the
real one. Rather than a hard cutout (unreliable on this file — its background
gradient overlaps the beetle's own dark shading too closely for a clean
separation), `logo.png` is background-corrected: fit a smooth low-order
surface to the border area only, then blend every pixel toward one flat tone
in proportion to how well it matches that fitted surface — the beetle's own
sharper, higher-contrast shading doesn't fit the smooth model and survives
untouched, only the slow vignette gets ironed out.

`logo.png` and `logo-mark.png` come from two separate renders (a light-bg one
and a dark-bg one), not the same art with the background swapped — pulling a
clean background-less cutout out of the dark one wasn't reliable (its
background gradient overlaps the beetle's own dark shading too closely), so
`logo-mark.png` still comes from the light render. The two are close enough in
style that this doesn't show in practice, but if a from-scratch redo of either
ever happens, keep both renders from the same generation so they truly match.
`logo-wordmark.png` / `logo-wordmark-light.png` are reference art with the
"ZUKNESST ATLAS" wordmark baked in — not consumed anywhere yet, kept for a
future banner/share-image use. Per-trip logos are uploaded in the app
(*Manage → Look*).

---

<sub>Private project — not for redistribution.</sub>
