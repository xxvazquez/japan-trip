<div align="center">
  <img src="public/brand/logo-256.png" width="88" alt="" />
  <h1>Zukness Atlas</h1>
  <p><em>A private, offline-first travel workspace. One app, many trips.</em></p>
</div>

---

# Using the app

Everything for the trip in one place — the plan, the map, the hotels, the
luggage, the documents. It lives at:

**https://japan-trip.lauramaestuv.workers.dev**

## Getting in

1. Open the link. Sign in with **Google** — each person uses their **own**
   Google account.
2. One account owns the trip. From that account, go to **Manage → share** and
   add the other person's email.
3. After that you both see and edit the **same trip**, and changes show up on the
   other device within a second or two.

If someone signs in before being added to the trip, they'll just see an empty
account — share the trip with that email and it appears on their next reload.

## On your phone

Open the link in Safari / Chrome → **Share → Add to Home Screen**. It then opens
like a normal app, full screen. Do this on both phones.

## The three tabs

**Plan** — the trip as a list of days, grouped by where you're staying.
- Drag a day up or down to **reorder** it (the dates shuffle with it).
- Tap a day to open it: write what the day is about, add a few places (a name +
  a Google Maps link), and for day trips add how to get there / back and the
  last train home.

**Map** — your Google **My Map** pins, on a clean map.
- Filter by category (coffee, see, food…) with the coloured dots.
- Switch the scope: **all places**, **today**, a specific **day**, or a whole
  **stay**.
- Tap a pin or a list row — they select each other and the map flies there.
- **＋ Add place** → search for somewhere, or tap the map to drop a pin.
- **Sync** re-pulls everything from your Google My Map. It replaces the imported
  pins but keeps anything you added in the app and any notes you wrote.

**Logbook** — the reference drawer. Use the menu at the top to jump between:
stays · getting around · luggage · emergency numbers · documents · packing ·
notes. In **documents** you can attach the actual PDFs / photos (passport scans,
insurance, tickets) — those stay only on the device they were added on.

## Editing anything

Tap almost any piece of text and it becomes editable on the spot. Type, tap
away, done. There's no separate "edit mode".

**Manage** (the gear icon, top right) is only for bigger structural changes —
adding or removing days, changing trip dates, theme, sharing.

## Offline

Once the app has loaded on the plane / hotel wifi, it keeps working with no
signal — on the flight, on the metro, inside temples. The one thing that needs
data is the **map background** itself; your pins and the whole plan work offline.

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
  places — is its own row, private to your account (RLS), synced across devices
  and shareable with another account. Schema:
  [`supabase/migrations/`](supabase/migrations/).
- **Without it**: everything stays in the browser. No sign-in.

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
```

Both optional — with nothing set the app runs fully local. `VITE_SUPABASE_URL`
must be the **full https URL**, not just the project ref.

## Setting up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. **SQL Editor** → run every file in `supabase/migrations/` **in order**
   (`0001` → `0010`).
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
  routes/              one file per page (Plan, Day, Journey, MapTab, Logbook,
                       Hotel, Manage)
  templates/           seed data for a new trip (blank, or a worked example)
supabase/migrations/   database schema, applied in order
scripts/make_icons.py  regenerates icons from logo.png
```

The map uses [MapLibre GL](https://maplibre.org) with free
[Protomaps](https://protomaps.com) vector tiles — no key, no billing account.
`maplibre-gl` is pinned to 5.x (6.x breaks pmtiles tile loading).

## Branding

`logo.png` / `logo-wordmark.png` at the repo root are the source. Regenerate
icons with `python3 scripts/make_icons.py`. Per-trip logos and covers are
uploaded in the app (*Manage → Media*).

---

<sub>Private project — not for redistribution.</sub>
