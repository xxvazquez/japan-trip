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

Everything for the trip in one place — the plan, the map, the hotels, the luggage, the documents. It
lives at:

**https://japan-trip.lauramaestuv.workers.dev**

## Getting in

1. Open the link. Sign in with **Google** — each person uses their **own** Google account. (Or tap
   **Use on this device only** to skip the account entirely: the trip stays on that one device and
   doesn't sync. **Manage → Trips → Sign in to sync** switches back later.)
2. New accounts start with just the read-only **Demo** trip. Make your real one from **Manage → New
   trip → Empty template**.
3. One account owns that trip. From it, go to **Manage → Sharing** and add the other person's email
   — then you both see and edit the **same trip**, and changes show up on the other device within a
   second or two.

If someone signs in before being added to the trip, they'll just see the Demo — share the trip with
that email and it appears on their next reload.

## On your phone

Open the link in Safari / Chrome → **Share → Add to Home Screen**. It then opens like a normal app,
full screen. Do this on both phones.

## Plan, Map, Logbook

### Plan

The trip as a list of days, grouped by where you're staying. Each day carries a tag — **Arrive**,
**Travel**, **Depart**, **Day trip** — worked out automatically from what you set on the day itself,
never chosen by hand.

- **On a wide screen** (a laptop, or a tablet held sideways — 1024px and up) a **day's page** gets a
  **map beside it** showing that day's own places — the ones its steps are tied to, the places of its
  areas (drawn more quietly) and the hotel you're staying at — and it moves as you go between days.
  Tap a pin for its name and a **Directions** link. A step's **⋯ → Show on map** jumps that pane
  straight to its pin, already zoomed in — no manual panning to find it. The Plan itself stays a plain
  list of days, and on a phone or a narrower window nothing changes at all: the map isn't even
  downloaded — there, **Show on map** opens the Map tab instead, centred on that pin. The Map tab is
  still where you filter, search and edit places.
- Drag a day up or down to **reorder** it (the dates shuffle with it).
- Tap a day to open it. At the top: **Staying at** (which hotel) and **Journey** (link an existing
  one, or ＋ new — you then pick its type on the journey page).
- If that day's hotel has coordinates, its header line shows the day's forecast (e.g. "Showers,
  19–24°C") — free, no key needed (Open-Meteo). Forecasts only exist for the next ~16 days, so a day
  further out just shows nothing yet rather than a guess; it starts appearing on its own as the trip
  gets closer.
- A **day trip** leads with a **Getting there** and a **Getting back** card (free text, the last way
  home folded into the back one).
- Then the day's **Plan** — an itinerary of steps. Each step has:
  - a leading tile (the linked place's category, or a plain pin)
  - a time on a quiet line first (optional — a single time or a `14:00–15:15` range)
  - the step itself: pick a place from the Areas you've added to this day (below) — past 2 linked
    areas, each option in the picker shows which area it's from — or **Custom…** for a one-off with
    its own text field
  - **drag to reorder**, and one **⋯** menu with show on map, add to Google Calendar, mark/unmark as
    **overwhelming** (a small ⚠ next to the tile when it's on — a sensory heads-up, e.g. for autism —
    and the Plan section header shows the day's total at a glance), **duplicate** (dropped right after
    the original — handy for the same stop twice on a long day), add an expense and remove — kept
    behind one button so the step's own text gets the room
  - its own quiet note line underneath (bold, bullets, links) — tap to expand and edit
  - a link to the map, if the step is tied to a place
  - if the step is tied to a place, one quiet line with two walks side by side, each spelled out
    rather than left to the icon alone: 🚶 "Walk to &lt;next step&gt; ≈ 9 min · 0.8 km" (when that one
    is tied to a place too), and 🚆 "Walk to &lt;station&gt; ≈ 3 min · 195 m" — the walk to the nearest
    metro/train station from here, using the same station lookup the Map tab uses. Time and distance
    always show together: a straight-line estimate first, replaced by an actual walking route once
    that comes back (or kept if there's no routing key). On a narrow phone the two wrap as whole
    pieces rather than clip. The station comes from OpenStreetMap (Overpass, then Nominatim if that
    fails), which sometimes drops a request — a miss is retried once, and a found station is
    remembered on the device. A step that isn't tied to a place has no position to measure from, so
    it shows neither figure. Once the walk to the next step passes 20 minutes, a third piece appears:
    "Train: Ueno → Uguisudani · ≈ 24 min total" — a link that opens Google Maps transit directions
    between the nearest station at each end, labelled with a rough door-to-door estimate (both walks
    plus a straight-line guess at the ride itself, since there's no free keyless transit-routing API
    to ask instead) — the same long-walk-to-transit swap as the **Back to &lt;hotel&gt;** row below.
  - if the linked place has opening hours tagged on OpenStreetMap, the hours **for that day** sit at
    the right end of the tile/time row (e.g. "09:00–17:00") — always in the same spot. The app reads
    the place's tagged schedule (from Overpass, or from a Nominatim search by the place's name when Overpass fails) and picks the rule that covers the day's date (its month and
    weekday), so a seasonal or weekday-only schedule shows just what applies, "Closed" on an
    explicit closed date, and nothing when no rule covers that date. Anything it can't read
    reliably (holiday rules aside, which are skipped) shows the tagged text as-is instead. An FYI
    to replan by eye, not a warning: nothing is flagged as a conflict, and plenty of places simply
    aren't tagged, so this is a bonus when it's there, not something to rely on.
  - the day closes with a **Back to <hotel>** row under the last step — the way home to wherever you're
    staying that day (the day's own hotel, else its stay's), left off on a departure day. When the last step is tied to a place it
    shows the walk there (time and distance, e.g. "≈ 1h 37min · 7.7 km") and, once that's a long
    walk, the two stations to head between ("Tsukiji → Asakusa"); the hotel's
    coordinates come from its address automatically. Tapping the row opens Google Maps directions — transit for a
    long way, walking for a short one — so the actual best route, lines and transfers included, is
    Google's own (there's no free no-card transit-routing API to do it in the app). If the last step
    is a free-text one, the row still shows and opens directions from wherever you are.
  - **+ Add a step** at the foot of the list — so a long day's plan doesn't need a scroll back to
    the top to add the next thing.
- Below the itinerary: **Areas** (drop a whole neighbourhood's pins onto the map — a chip's **×**
  asks first; **+ Add area** offers just the areas in this day's own city, so a multi-city trip
  doesn't dump every area into one list), a **Spending** list (a category and a whole number per row, plus an optional note;
  subtotalled and fed to Expenses), and free-text **General notes**.
- Every section on the day page folds away from its header.

### Journeys

Linked from a day, or the *getting around* tab. A journey is one or more **hops**.

- Each hop is a card, tinted by mode (rail, air/sea, road, on foot), reading top to bottom: mode →
  route → the two times joined by a rule with the duration on it → the details (carrier, platform,
  seat, booking ref, fare — a whole number, in the trip's currency unless you pick another) as
  label-and-value rows.
- Between hops, a note on the connection time flags a tight or overnight change.
- The **total fare** at the top adds itself up from the hops' fares; type a figure into it to
  override with a single ticket price.
- It's the same number Expenses uses, counted once — split by each hop's mode if a category claims
  it. A manual override total follows the same rule when every hop shares one mode (a single flight,
  say); only a genuinely mixed-mode journey falls to the generic Transport category.

### Map

Your Google **My Map** pins, on a clean map. It reads **city → filters → places**, top to bottom —
places grouped and foldable by area once a city's picked.

- **City pills** — **All** plus one per stay (and **Today** while the trip is running), coloured to
  match the trip. Pick a city and the map and the list both narrow to it straight away; the app opens
  on wherever you are (or the first stay). A city's pins are the ones planned on its days, plus any
  imported pins that fall nearest to it, within about 60 km — "nearest" measured from the stay's
  **hotel** (its coordinates, worked out automatically — taken from its Maps link when that carries them, otherwise geocoded from the address once, wherever you are in the app; nothing to set by hand) or,
  failing that, the places its days already use. A pin farther than that from every stay belongs to
  no city and shows only on **All** — or if a stay has no hotel and no days yet, it has nothing to
  measure from and can't claim any pins at all. Either way, open the pin's card and set **City** by
  hand (**Auto** or a specific stay) to fix it. A stay gets a pill once its hotel has coordinates, or
  once it has a pin to show.
- **＋ Add place** sits next to the pills, always one tap — search for somewhere, or tap the map to
  drop a pin.
- Once a city is picked, its areas list below as their own rows — tap a row to fold or unfold its
  places, tap the **colour dot** to show only that area on the map and in the list; no dot picked
  shows all. On **All** the list nests instead — **city → area → places**, each level collapsible —
  so a multi-city trip reads top to bottom the same way. Areas **start collapsed** and only a tap on
  their own row opens or shuts them; what you've opened is remembered for next time (per trip), and
  picking a pin on the map never springs an area open.
- Tapping a place — in the list or on the map — puts it in a **card at the top of the list**, in
  iOS-style rows: its name, a note, the **Areas** it belongs to (tap for a checklist), its **City**
  (**Auto** by default; pick a stay to override the automatic guess), Open in Google Maps, the day
  it's on (or **Add to a day**), and Remove. Rows in the list stay two lines: the name and how far it
  is to the nearest station.
- The map's resize handles are visible: a grabber on the phone sheet (drag it, or tap to step through
  the three heights) and a grip on the divider of the desktop panel.
- **Filters** opens a sheet with **category** and **transit** — real filtering, so it overlays the
  list instead of shrinking it:
  - **Category** — the coloured dots; none selected shows everything, tap some to narrow. Give a
    category its own **pin icon** in **Manage → Content → Category pins** — those places draw as a
    coloured disc with the icon. Switch **Always show** on for a category (your hotel's, say) and
    its pins stay on the map when you zoom far out — bigger, on top of everything, named once you're
    close — instead of being folded into a numbered cluster. It holds in every city, while you're
    browsing that city (about zoom 9 and closer); zoom out to a region or the country and the pins go
    away, so you never see another city's.
  - **Transit** — **Train** and **Metro** are laid over the map by default; tap to add **Tram**,
    **Bus**, **Ferry** or **Airport**, or to turn any off. It's read straight from the basemap, works
    in any city with no setup, and the choice is remembered.
- **Areas**, next to Filters, is its own disclosure — area upkeep (add, suggest, rename, delete) is
  separate from filtering, so it folds away on its own instead of sharing the Filters label.
- Tap a pin or a list row — they select each other and the map flies there.
- While **Today** is picked, a **crosshair icon** turns the list into what's actually close by — asks
  for your location once, then sorts by distance and narrows to within 1.5 km if that leaves anything
  (a place's row shows its distance in place of the category dot). Nothing within range, no fix yet,
  or location denied — you still see today's full list, nearest-first once a fix arrives. Never asks
  until you tap it, and doesn't remember being on for next time.
- The small list/map icon next to **＋ Add place** switches to a **full-screen list** — no map, just
  the list at full width (desktop) or full height (phone). Handy for reorganising areas or picking
  through a long list; tap it again for the map back. Remembered next time you open the tab.
- **Sync** only ever adds — any pin already imported (its notes, city, area membership) is left
  exactly as it is, and nothing already in the trip is removed even if it's gone from the My Map
  itself. Re-run it after adding new pins to your My Map and only the new ones come in.
- Place names on the map are shown in English / Latin script (falling back to the local name only
  when there's no other), so it reads the same in any country.

### Areas vs. categories

A **category** is *what* a place is (coffee, see, food…). An **area** is *where* it is (Gion,
Higashiyama, a neighbourhood you name). A place can sit in several areas.

- Create an area under **Areas → Add area** (name it and it's made).
- Assign places to it from a pin's detail panel on the Map.
- Rename or delete an area with *Edit areas* in that same place — that's also where place-by-place
  membership for a whole area is edited. Manage → Content doesn't list areas, since the Map's own
  editor already covers it.
- Once a city's picked, the list splits into a collapsible section per area (plus a *No area* group).
  Tap a section's **colour dot** to show just that area on the map and in the list — no dot picked
  shows all; tap the rest of the row to fold it away instead.
- Add an area to a **day** (on the day page) and every place in it shows on that day's map — a live
  link, so editing the area later updates the day too. Area places show slightly faded and aren't
  added to your plan unless you tap the **+** on the area to drop one in as a step.
- Zoom out and each area gets a faint labelled ring so you can see its rough extent at a glance.
- An area's section header shows roughly how far it stretches on foot (e.g. "≈ 12 min · 0.9 km walk
  across") between its two farthest-apart places, not a tour of everywhere in it — a straight-line
  estimate at first, swapped for a real walking route (actual streets, via OpenRouteService — see
  `VITE_ORS_API_KEY` above) when that comes back.
- Each place in the list shows its nearest metro/train station with the walking time and distance
  (e.g. "≈ 3 min · 195 m to Ueno"), read straight from the map's own tiles — no extra request, since
  it's the same station data the Train/Metro overlay already draws. A place whose map tile hasn't
  loaded yet falls back to a network lookup — the free OpenStreetMap Overpass API first (one request
  at a time, retried and mirrored when the public server is busy), then OpenStreetMap's Nominatim
  search when Overpass fails outright, so a station line doesn't depend on one public server being
  up; a found station is remembered on the device. Nothing shows if there's genuinely no station
  within a kilometre. A place's distance from
  you (the Nearby list) reads the same way — time and distance together.

### Suggest areas

When four or more places aren't in any area, a *Suggest areas* link joins the Areas controls.

- It groups them by how close together they are (the "close enough" distance is worked out from your
  own places, so it fits a tight city or a spread-out road trip, but never past roughly a 15–20 min
  walk end to end — a spread-out itinerary's own places never get lumped into one supposedly
  "walkable" group just because everything else that trip is even more spread out) and names each
  group after the neighbourhood it sits in.
- You review the groups — rename, untick, drop a place — and only the ones you keep become real
  areas.
- It never changes an area you already have.

### Logbook

The reference drawer. A menu of sections, each its own page: stays · getting around · luggage ·
documents · emergency numbers · packing · stamps · expenses · a scratchpad, plus any lists you've added
yourself. Each row shows at a glance how much is in it — a count, packing progress ("3/8"), or
the total spent — and nothing when it's empty.

- **Documents** — one card per document. Name it ("Travel insurance"), attach the PDF / photo, add
  whatever fields you want, add a note. Every card is renamable, removable, and you add more from the
  tab. Signed in, attachments are saved to your account (private, shared with everyone on the trip;
  25 MB per file) — or to a shared Google Drive folder when Drive is connected. Signed out / "this
  device only", they stay on the device. Files that were added on a device earlier are uploaded to
  your account automatically the next time the trip opens, and the device copy is kept. Removing an
  attachment only removes it from the card; the file itself is never deleted.
- **Packing** — build the checklist right there: add a category, add items, tick them off. Categories
  fold away; with two or more travellers set (Manage → Setup) each item gets an **assign** pill (a
  traveller's initial, **Shared**, or **—**).
- **Stamps** — a checklist of stamps to collect (station stamps, temple seals, castle stamps).
  The summary card at the top shows a progress ring, "12 of 78 collected" and the next one up. Each
  stamp has a name, a note for where to find it and what it costs, and a seal you tap to press it —
  it inks in when collected. Group them into sections of your own: tap a section's name to rename it,
  **New section** adds one, and a stamp's ⋯ menu moves it to another section (or out of any).
  **Select** lets you tick many stamps and move or delete them together. A stamp can also carry a
  name in the local script, shown beside the English one. Stamps are part of the trip, so anyone the
  trip is shared with sees the same list and the same ticks. Nothing is looked up for you.
- **Expenses** — totals every price in the trip (a stay's price, a journey's fare, a day's spending),
  **grouped by category** and then by currency (nothing is summed across currencies, except the
  **Combined** total). Nothing is entered on this tab — it's read-only.
  - Stay prices land under Accommodation.
  - A fare lands under whichever category claims its hop's mode (Train, Flights…), or under Transport
    if none does.
  - Each day-spending row lands under the category you picked.
  - A journey with a total *and* per-hop fares counts once, not twice.
  - If the trip uses two or more currencies, a **Combined** section at the top adds them all together
    in the primary one, using an exchange rate fetched automatically when you're online (and cached
    for when you're not — it just shows the last one it fetched). A currency the rate source doesn't
    cover is left out of the blend, and a line under the total says so.
  - A proportional bar above each currency's list shows the category split at a glance, coloured to
    match each category's own icon.

### Manage → Setup

- Name the **travellers** (used for packing assignment).
- **Time zones**: *Home* is taken from the device; *On the trip* starts on `UTC` and fills itself in
  from the first hotel that has coordinates, so calendar exports and hop times land at the right
  hour. It only does this while the zone is still `UTC` — pick one by hand and it's never changed.
  Tapping a zone opens a picker that lists cities with their UTC offset ("Tokyo · GMT+9"): tap a
  region chip and scroll, or search by city, offset or abbreviation ("kolkata", "+5:30", "JST").
- List the **currencies** the trip uses — the first is the default (a new trip starts on `PLN`), so
  every price field shows its symbol and a bare `100` counts as it without the symbol being typed;
  add a second currency and every price — a stay, a fare, a spending row, a custom "Price" field —
  gets a currency picker.
- Edit the **expense categories**: reorder, rename, add, remove — the list can't be emptied, and
  removing one moves its spending to the next category rather than leaving it uncategorised. A
  category can also claim specific hop modes so fares split further than one lump "Transport". Each
  one's **icon** (shown on every Spending row and in Expenses) is guessed from that mode/role, or the
  name — tap the icon itself to pick your own instead, from a searchable grid of 130+ icons grouped
  into categories (Food & drink, Transport, Weather…).
- **Local-script font** (under Map & format) sets the typeface for a hotel/stay's local-script name
  (Manage → Content, or the hotel/stay page itself) — paste a CSS font stack, e.g. `Hiragino Sans, Yu
  Gothic, sans-serif` for Japanese, or `Noto Sans KR, sans-serif` for Korean. Leave it blank to use
  the app's regular font.
- Hide the Logbook sections you don't need, from the same Setup tab.
- The **Tabs** panel above it reorders, renames or hides the three main tabs (Plan, Map, Logbook) —
  and **Add tab** lets you pin any Logbook page (Packing, say) straight onto the main nav as its own
  tab, alongside them; hiding a pinned page's Logbook section disables its tab too, so there's never a
  dead link.
- A **Help & FAQ** link sits at the bottom of every Manage tab — plain-language answers to the
  non-obvious bits ("modes", Custom vs. a place in Plan, Areas vs. categories, My Maps sync…), for
  anyone new to the app.

## Sharing a copy

**Download web page** (Manage → Sharing) builds the whole trip as one self-contained `.html` file —
itinerary, journeys, stays and the place list, all styled, no internet needed. Open it in any browser,
or print it (print-to-PDF for a PDF). Send it to whoever you're travelling with.

- Leave **Include private details** off for anything you share: a stay's own reference fields (door
  codes, wifi, booking refs…), a segment's booking ref and the whole documents section are held back.
  Turn it on for your own copy.
- Document *attachments* are never included, either way.

**Add to calendar (.ics)** sits right below it — every plan step and travel hop as a standard calendar
event, so the trip lands on your phone's own calendar next to everything else.

- Import the whole trip from **Manage → Sharing**, or just one day from the **Add to calendar**
  button at the top of that Day page.
- A step's time ("11:34", a "14:00–15:15" range) becomes a timed event; anything looser ("Around
  18:00", or blank) becomes an all-day event instead, with the original text kept in the description.
- A day's linked journey adds its own hop events from the segment's real departure / arrival times.
- The per-day button always includes booking references — it's building an event for your own
  calendar, not something you're handing to someone else.
- Each individual plan step and journey hop also has its own small calendar icon (tap to reveal it on
  a plan row) that opens Google Calendar directly with just that one event — no file, no app-switching.
  Google-only; the `.ics` buttons above still cover Apple Calendar, Outlook, and everything else.

### Backup and restore

**Download backup (.json)** (Manage → Sharing → Backup) saves the whole trip as one file — unlike the
web page it's lossless: every stay, day, place and setting, *including* private details, so keep it
somewhere you trust. It's the way to keep a safe copy of a trip that lives only on this device, or to
move one to another device.

**Restore from backup** (Manage → Trips) reads that file back in as a **new trip** and opens it. It
never overwrites a trip you already have; if the name is taken the copy is called "… (restored)". A
file that isn't a backup, is empty, was cut off or edited after it was saved (each backup carries a
checksum), or was made by a newer version of the app, is refused with a message — and a backup is
read back and checked before the download is offered, so you never get a file that can't be restored.
Attached document files aren't inside the backup: ones in your account or Google Drive still open
from anywhere, ones saved only on a device stay on that device.

### Data safety

Every edit saves as you make it. On top of that the app keeps **restore points** — complete,
checksummed copies of a trip — so a crash, a bad save or a wrong tap never costs you the trip.

- **When they're taken.** Automatically while you edit (at most every few minutes; the newest 12 are
  kept), and always *before* something risky: deleting a trip, restoring over one, syncing offline
  edits onto the server, and — for a device-only trip — an app update that reshapes your data or a
  save that would remove more than half the trip. Those "before…" ones are kept separately (newest
  10) so a burst of edits can't push them out.
- **Where they live.** In your account (Supabase, so they survive losing the phone — and outlive the
  trip itself; needs migration `0026` applied) and on the device (works offline, and is the only kind
  a device-only trip has).
- **Get one back.** **Manage → Sharing → Data safety** lists them: *Restore over this trip* puts it
  back exactly as it was (what was there is kept as a restore point first), *Restore as a new trip*
  adds it alongside and touches nothing. **Recently deleted** lists trips you deleted, with a Restore.
  **Back up now** takes one on demand.
- **Deleting a trip** first makes a restore point that outlives it; if one can't be made, the trip is
  not deleted. Restore points of a deleted trip are kept for 90 days, then cleared.
- **If a trip's data is damaged** the app opens a recovery screen instead of an empty trip: it keeps a
  copy of the damaged data, offers the newest good restore point, and lets you open another trip. It
  never replaces your data with a blank or default trip.
- **Closing the tab right after an edit** (device-only trips): as the page hides, a synchronous copy
  of anything not yet saved is stashed, and the next open adopts it if it's exactly the next version
  of what's stored — the version it replaces is kept as a restore point.
- **If a save fails** (out of storage, a dropped connection) your changes stay on screen and a banner
  or the header says so; the app keeps retrying, and edits that hadn't reached the server survive a
  reload or a closed tab.
- **A save that would wipe a device-only trip entirely is refused outright**, not just flagged — a copy
  of the last good version is kept and the banner offers **Save anyway** if that's really what you meant.
- **Two devices editing the same trip's settings** (theme, currencies, tabs, photos…): each save is
  merged with what the other device saved instead of replacing it — different settings both keep
  their change, two photos added at once both stay, and if you both changed the very same value
  yours stands. (Days, stays, places and the rest are saved row by row and already didn't clash.)
- **Newer data, older app.** An older version of the app refuses to open a trip a newer one has
  written ("reload to update") rather than rewriting it in a shape it doesn't understand.

Before applying a migration that rewrites existing data, use **Back up now** on each trip.

### Offline and installing

**Manage → Trips → This device** shows two things. **Works offline** turns to *Ready* once the
service worker has saved the whole app on the device — from then on it opens with no signal (it reads
*Getting ready…* for the first moments of a first visit, and *Not available here* in development,
where there's no service worker). A trip kept on this device is fully offline; if you sign in to
sync, open the trip once while online before travelling. Map areas you've already looked at are
saved too.

The second row is about installing to the home screen. Where the browser offers it (Android, desktop
Chrome) there's an **Install app** button that opens the browser's own install dialog. On iPhone
there's no such dialog, so the row says *Share → Add to Home Screen*. Once it's running installed,
the row reads *Installed*. The same answers are in **Help & FAQ** under "Offline & installing".

## Editing anything

Tap almost any piece of text and it becomes editable on the spot. Type, tap away, done. There's no
separate "edit mode". Dates and times open a picker; once a link, phone or email is filled in it turns
into the real clickable thing, with a small pencil on the right of the row to edit it.

**Deleted something by mistake?** Removing a plan step, an expense, a packing item, a list item, a
journey hop or a detail — or deleting a whole day, stay, journey, place, area, document or note —
brings up an **Undo** bar above the tab bar for a few seconds. Tap it and exactly what was removed
comes back, in its old spot; anything else you edited in the meantime is left alone. It covers the
last delete only, and deleting a whole trip or a file attachment isn't undoable.

When you're signed in, a small label next to the header search icon shows what's happening:
**Saving…** (grey, while it's in flight), **Saved** (green, flashes briefly once it lands), or
**Offline** (amber, stays up for as long as you're disconnected — edits keep queuing and send the
moment you're back). On-device-only trips save instantly and show nothing — there's nothing to be
behind on.

**Notes** fields (a day's General notes and Getting there/back, a stay's notes and directions, a
journey, a luggage note's detail, a map place's note, and each of the Logbook Scratchpad's notes) take
light Markdown — `**bold**`, `*italic*`, `++underline++`, `~~strikethrough~~`, `##` headings, `>`
quotes, `-` bullet lists, `- [ ]` checklists and `[links](https://…)`. A slim B / I / U / S / H / " /
• / ☑ / link toolbar covers all of it without needing to know the syntax, plus the usual ⌘/Ctrl-B ·
⌘/Ctrl-I · ⌘/Ctrl-U · ⌘/Ctrl-Shift-X shortcuts; bullets continue on Enter. A checklist item's box is
tappable straight from the read view — ticking it off doesn't open the editor.

## The demo trip

Every account has a read-only **Demo** trip — a made-up example with notes explaining how each screen
works. You can't edit it; it's just there to look at. Delete it whenever from Manage → Trips (and
re-add it from the same place).

**Manage** (the gear icon, top right — or its own spot at the foot of the sidebar on a wider screen)
is only for bigger structural changes — adding or removing days, changing trip dates, theme, sharing.

## Offline

Once the app has loaded on the plane / hotel wifi, it keeps working with no signal — on the flight, on
the metro, inside temples. The one thing that needs data is the **map background** itself; your pins
and the whole plan work offline.

- Map areas you've already looked at are cached, so they still draw with no signal; open a fresh area
  offline and the map says so and offers a retry (which fires automatically the moment you're back
  online).
- Edits you make while offline (or during a dropped connection) are held and retried automatically
  once you're back on signal, as long as the tab stays open. When the connection returns, the app also
  re-pulls the trip so a travel companion's changes made in the meantime show up.
- Once a trip has opened on a device while signed in, that device keeps a copy of it (and the trip
  list), so the app opens with no signal at all — and edits made that way are held and sent when you're
  back. The copy is cleared when you sign out, and another account on the same device never sees it.
- Opening the app for the very first time on a device with no signal (before anything's been opened
  there) shows a plain "you're offline" screen instead of hanging on the loading spinner — it retries
  on its own once you're back on signal, or tap Try again.

## If something looks out of date

After an update the app can briefly show an old version. Close the tab (or the installed app) fully
and reopen it, or pull down from the top of any page to re-pull the trip. It'll catch up. To tell
whether a device has the latest deploy, the foot of **Manage** shows the build it's running — the
app version (which goes up with every commit), the short commit and the date it was built — to compare against the commit you pushed.

---

# Technical

A trip-agnostic React PWA. Nothing in the code assumes Japan — a future trip is a new template folder,
no source changes.

## Stack

Vite + React + TypeScript · Tailwind · React Router · Zustand · vite-plugin-pwa (Workbox) · Supabase
(Postgres + Auth + RLS + Realtime) · MapLibre GL + Protomaps vector tiles · dnd-kit · idb-keyval.

## How data is stored

```
edit in the UI  →  TripData (in memory)  →  backend
                                            ├─ Supabase   (signed in)
                                            └─ IndexedDB  (local, offline)
```

- **With Supabase** (`VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` set): every entity — legs, days,
  hotels, journeys (+ segments), luggage, docs, packing, places, areas (+ area_places), scratchpad
  notes — is its own row, private to your account (RLS), synced across devices and shareable with
  another account. Schema: [`supabase/migrations/`](supabase/migrations/).
- **Without it**: everything stays in the browser. No sign-in.
- **With it, but "Use on this device only"** (the link on the sign-in screen): same local browser
  storage as above, no account — a per-device `localStorage["za.localOnly"]` flag that `needsAuth()`
  honours. **Manage → Trips** has the way back.

The Supabase client is code-split — never downloaded unless a project is configured. So is the
MapLibre bundle (only the Map section pulls it in).

**Data-safety layer** (`src/lib/safety/`, used by the store and both backends):

- `validate.ts` — shape checks at every trust boundary (before a save, after a load, on a backup file,
  on a restore point), item counts, a content hash.
- `snapshots.ts` — restore points: a device ring in IndexedDB and cloud rows in `trip_snapshots`
  (migration `0026`, no foreign key to `trips` so they outlive a deleted trip). Also `ensureBackedUp`,
  the "no delete without a backup" gate.
- `quarantine.ts` — anything that fails validation is copied here before it's touched; a load never
  deletes or overwrites the original.
- `errors.ts` — typed failures. A backend's `loadTrip` throws `TripLoadError` (`unavailable` /
  `corrupt` / `missing` / `newer`) instead of returning `null` or a default, so "couldn't read it"
  can never look like "empty" and trigger seeding over real data.
- `storage.ts` — `get` returns `undefined` only when a key is truly absent; a failed or unparseable
  read, or a failed write (quota), throws. The device backend validates every save, refuses to
  replace a trip with nothing, reads each write back, serialises saves per trip, and keeps a restore
  point of anything it's about to replace that another tab changed.
- The Supabase outbox (unconfirmed edits, mirrored to IndexedDB) covers batches *in flight* as well as
  queued ones, and its writes are ordered so a stale write can't resurrect synced ops. Each open tab
  keeps its own outbox; edits left behind by a tab that closed or died are picked up by the next tab
  that opens the trip (Web Locks tell a dead tab from a live one, with a heartbeat as the fallback).

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
| `npm test` | `vitest run` — unit tests for the data-safety layer (`src/lib/safety/`) |

### `.env.local`

```ini
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<the anon / public key>
VITE_PROTOMAPS_API_KEY=<a Protomaps hosted-API key>
VITE_ORS_API_KEY=<an OpenRouteService key>
```

All optional — with nothing set the app runs fully local. `VITE_SUPABASE_URL` must be the **full
https URL**, not just the project ref. The map tile settings (`VITE_PROTOMAPS_API_KEY`,
`VITE_MAP_TILES_URL`) are covered under [The map background](#the-map-background).
`VITE_ORS_API_KEY` is a free key (no card) from
[openrouteservice.org/dev/#/signup](https://openrouteservice.org/dev/#/signup) — 2,000 requests/day
— that powers the real walking-route estimates (an area's width on the Map, a plan step's walk to
the next one). Without it, those two features fall back to a straight-line estimate; everything else works the same.
Requests are spaced out to stay under the free per-minute limit, pause for a minute if the service
pushes back, and every route is remembered on the device, so a page only asks for what it hasn't seen.

## Setting up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. **SQL Editor** → run every file in `supabase/migrations/` **in order** (`0001` → `0029`).
3. **Authentication → Providers → Google** → enable, paste a Google Cloud OAuth client id / secret,
   redirect `https://<project-ref>.supabase.co/auth/v1/callback`.
4. **Authentication → URL Configuration → Redirect URLs** → add `http://localhost:5173` and the
   deployed URL.
5. Put the Project URL + anon key (**Project Settings → API**) in `.env.local`.

On first sign-in the app seeds your first trip automatically. After a schema change, delete the trip
and reload to re-seed from the template.

## Deploy

Runs on **Cloudflare Workers** (static assets) via the Git integration.

- [`wrangler.jsonc`](wrangler.jsonc) points the Worker at `./dist` and turns on SPA routing
  (`not_found_handling: "single-page-application"`).
- There is **no `public/_redirects`** — the Workers asset pipeline rejects the usual
  `/*  /index.html  200` catch-all as a redirect loop, and `wrangler.jsonc` already covers it.
  `public/_headers` (cache rules) still applies.

**Cloudflare dashboard → Workers & Pages → Create → import `xxvazquez/japan-trip`:**

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Build variables | `NODE_VERSION` = `22`<br>`VITE_SUPABASE_URL` = `https://<project-ref>.supabase.co` (full URL, **no quotes**)<br>`VITE_SUPABASE_ANON_KEY` = the anon key |

`VITE_*` values are inlined by Vite at build time, so a changed build variable **only takes effect on
the next build** — editing a variable does not redeploy on its own.

After the first deploy: add the `*.workers.dev` URL to the Supabase Redirect URLs (step 4 above), or
Google sign-in fails. Optionally gate the site with **Cloudflare Access** (Zero Trust → Access →
self-hosted app → allow your emails).

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

The map uses [MapLibre GL](https://maplibre.org) with [Protomaps](https://protomaps.com) vector tiles
(OpenStreetMap data). `maplibre-gl` is pinned to 5.x (6.x breaks pmtiles tile loading).

The tile source is chosen at build time, in this priority order:

### 1. Protomaps hosted API — `VITE_PROTOMAPS_API_KEY` (recommended)

The **whole planet**, CDN-cached, fast to first paint anywhere on Earth — so a future trip to anywhere
just works, no rebuild. Free for non-commercial use up to 1M tile requests/month; a personal trip app
uses a tiny fraction of that.

1. Sign up at [protomaps.com/account](https://protomaps.com/account) and issue a key.
2. Put it in `.env.local` as `VITE_PROTOMAPS_API_KEY=` (just the key) and in the Cloudflare project's
   build variables, then redeploy.

Tiles come back as plain `200`s, so the service worker caches them
([`vite.config.ts`](vite.config.ts) → `runtimeCaching` → `map-tiles`): an area you've opened once then
paints instantly and works fully offline. Only brand-new regions touch the network. Label fonts are
cached the same way (`map-glyphs`).

A day page's **Areas** section has a **Download offline maps** action that walks every tile the day's
places (its areas, its own plan steps, its hotel) cover — padded ~700m, at the zoom levels the map
actually renders — so that corner of the map works offline before you've ever panned around it
([`src/lib/offlineTiles.ts`](src/lib/offlineTiles.ts)). Only shows up with the hosted API configured:
the self-hosted/fallback pmtiles sources read byte ranges out of one archive, not separate cacheable
requests, so there's nothing to pre-fetch.

### 2. Self-hosted extract — `VITE_MAP_TILES_URL`

A single `.pmtiles` file you host yourself. Only covers the geographic box you extracted, and range
requests (`206`) aren't service-worker cached — but needs no third-party account. The host must
support **HTTP range requests** and send permissive **CORS**.

Build one with the [`pmtiles`](https://github.com/protomaps/go-pmtiles) CLI:

```bash
pmtiles extract https://data.source.coop/protomaps/openstreetmap/v4.pmtiles japan.pmtiles \
  --region=tiles-region.geojson --maxzoom=14
```

`tiles-region.geojson` (repo root) is a GeoJSON `MultiPolygon` of the boxes to keep; a single
`--bbox=minLon,minLat,maxLon,maxLat` also works. `--maxzoom=15` gives building-level detail at ~2.5×
the size. **Netlify** hosts it free with no payment card (deploy a folder containing the file plus a
`_headers` file whose body is `/*` then an indented `Access-Control-Allow-Origin: *`). Cloudflare R2
also works but needs a card on file to activate.

### 3. Nothing set

Falls back to Protomaps' entire-planet archive on Source Cooperative. Works everywhere, but first
paint takes 20–30 s — every tile walks a directory inside a 130 GB file on a bucket with no edge
cache. The Map screen shows the loading spinner meanwhile.

## Branding

Two source files at the repo root, both full-bleed squares, regenerated into everything under
`public/icons` and `public/brand` with `python3 scripts/make_icons.py`.

### `logo.png` — opaque

One flat dark-teal background. Drives only the two icon outputs that genuinely need a solid
background:

- `apple-touch-icon.png` (iOS forces an ugly black one behind a transparent touch icon)
- `icon-maskable-512.png` (the OS crops it to its own shape but never adds a backing, so a transparent
  one shows through as holes — that's what "maskable" means in the manifest spec)

There's only one — not a light/dark pair — since a manifest icon can't react to the OS theme anyway.

The raw dark render this comes from has a rounded, lighter "card" sitting on a visibly darker square —
a vignette baked in by whatever generated it, not a flat colour. Left as-is, that reads as a second
background layer behind the real one. Rather than a hard cutout (unreliable on this file — its
background gradient overlaps the beetle's own dark shading too closely for a clean separation),
`logo.png` is background-corrected: fit a smooth low-order surface to the border area only, then blend
every pixel toward one flat tone in proportion to how well it matches that fitted surface — the
beetle's own sharper, higher-contrast shading doesn't fit the smooth model and survives untouched,
only the slow vignette gets ironed out.

### `logo-mark.png` — transparent

The glyph only, no background at all. Drives everything that can safely stay transparent:

- `favicon.png`
- the `"any"`-purpose PWA icons (`icon-192.png` / `icon-512.png` — a browser tab or a launcher just
  shows whatever's behind them)
- the in-app themed marks (`Wordmark`, sign-in/offline/error screens), which already sit inside the
  app's own rounded, coloured container — a baked-in background there doubled up one rounded shape
  inside another

`favicon.png` alone gets an extra contrast/saturation/sharpen pass (`bolden_for_favicon` in the
script, applied after the resize, not before — sharpening the full-res source and then shrinking just
blurs it straight back out) since a browser tab shrinks it further still, to ~16px, where the mark's
fine topographic wing lines would otherwise average into soft grey-green mush. Every other output
stays a plain resize; the topo detail is fine at every size it's actually shown.

### Light/dark in-app marks

The current mark (a beetle carrying a topographic map) doesn't need a different in-app rendering per
theme — being background-less, `logo-mark.png` already reads fine on both a light and a dark surface —
so both in-app filenames (`logo-{size}-dark/light.png`) currently render from that one file. Swap in a
genuinely different per-theme pair later if the mark ever needs one and each will pick up its own
split automatically (`useIsDark()`, `src/lib/mode.ts`).

### Notes

- `logo.png` and `logo-mark.png` come from two separate renders (a light-bg one and a dark-bg one),
  not the same art with the background swapped — pulling a clean background-less cutout out of the
  dark one wasn't reliable (its background gradient overlaps the beetle's own dark shading too
  closely), so `logo-mark.png` still comes from the light render. The two are close enough in style
  that this doesn't show in practice, but if a from-scratch redo of either ever happens, keep both
  renders from the same generation so they truly match.
- `logo-wordmark.png` / `logo-wordmark-light.png` are reference art with the "ZUKNESST ATLAS" wordmark
  baked in — not consumed anywhere yet, kept for a future banner/share-image use.
- Per-trip logos are uploaded in the app (*Manage → Look*).

---

<sub>Private project — not for redistribution.</sub>
