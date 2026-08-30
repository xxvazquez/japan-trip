<div align="center">
  <img src="public/brand/logo-256.png" width="88" alt="" />
  <h1>Zukness Atlas</h1>
  <p><em>A private, offline-first travel workspace. One app, many trips.</em></p>
</div>

---

## What it is

A visual planner for real trips. Each trip is its own little book — dates,
itinerary, hotels, transport, places, packing, notes. Everything is edited **in
place** by tapping a value; there is no separate admin screen for day-to-day
changes.

Nothing in the code assumes a country, a transport system, or a style of travel.
A trip to Iceland or a European road trip works exactly the same as Japan.

| Module | |
|---|---|
| **Today** | Where you are, days left, and what's next — the next train, the next bed, the reservation to book, where the luggage is. |
| **Itinerary** | A colour-banded ribbon of every day → tap a day for the hour-by-hour plan. |
| **Places** | Stays, transport, luggage. Each hotel lists its nearest station / shop / pharmacy / ATM / courier, each opening in Google Maps. |
| **Explore** | Collections to browse like a magazine, plus a guide page per day trip. |
| **Vault** | Documents, packing, notes. |
| **Manage** | Structural stuff only: create / duplicate / archive / switch trips, dates & timezones, theme, branding, which modules show. |

Installs to the home screen. Works with no signal once loaded.

## How data is stored

```
edit in the UI  →  TripData (in memory)  →  backend
                                            ├─ Supabase   (signed in)
                                            └─ IndexedDB  (local, offline)
```

- **With Supabase** (`VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` set): every
  entity — legs, days, journeys, segments, places, hotels, luggage, day trips,
  collections, reservations, packing, docs, expenses — is its own row, private
  to your account (RLS), synced across devices. Schema:
  [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql).
- **Without it**: everything stays in the browser. No sign-in.

The Supabase client is code-split — it's never downloaded unless a project is
configured.

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

### `.env.local` (all optional)

```ini
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_GMAPS_EMBED_KEY=    # Maps Embed API key — restrict by HTTP referrer
VITE_MYMAP_MID=          # a shared Google "My Map" id
```

## Setting up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. **SQL Editor** → run `supabase/migrations/0001_init.sql`.
3. **Authentication → Providers → Google** → enable, paste a Google Cloud OAuth
   client id/secret, and set the redirect to
   `https://<project-ref>.supabase.co/auth/v1/callback`.
4. **Authentication → URL Configuration → Redirect URLs** → add every origin the
   app runs on (`http://localhost:5173`, your deployed URL).
5. Put the URL + anon key (Project Settings → API) in `.env.local`.

On first sign-in the app seeds your first trip into the database automatically.

## Deploy

**Cloudflare Pages** — build `npm run build`, output `dist`. Gate it with
**Cloudflare Access** (Zero Trust → Access → self-hosted app, allow your emails).
Add the deployed origin to the Supabase redirect URLs. `public/_redirects` and
`public/_headers` handle SPA routing and caching.

## Project layout

```
src/
  core/types.ts        domain types — trip-agnostic
  lib/                  backend · db · auth · storage · dates · time · maps · theme
  store/useApp.ts       trips + active trip + every mutation
  components/           shell + reusable primitives (Editable, Signal, TimelineRibbon…)
  routes/               one file per page
  templates/            seed data for a new trip (blank, or a worked example)
supabase/migrations/   database schema
scripts/make_icons.py  regenerates icons from logo.png
```

## Branding

`logo.png` (and `logo-wordmark.png`) at the repo root are the source. Regenerate
every icon size with `python3 scripts/make_icons.py`. Per-trip logos and covers
are uploaded in the app (*Manage → Media*).

---

<sub>Private project — not for redistribution.</sub>
