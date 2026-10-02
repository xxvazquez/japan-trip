<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="public/brand/logo-256-dark.png">
    <img src="public/brand/logo-256-light.png" width="88" alt="" />
  </picture>
  <h1>Zuknesst Atlas</h1>
  <p><em>A private, offline-first travel workspace. One app, many trips.</em></p>
  <p><strong><a href="https://japan-trip.lauramaestuv.workers.dev">japan-trip.lauramaestuv.workers.dev</a></strong></p>
</div>

---

Everything for a trip in one place: the plan, the map, the stays, the journeys, the luggage and the documents. It works offline, syncs between the people on the trip, and installs to a phone like a normal app.

**Contents**

- **Using the app** — [Getting started](#getting-started) · [Before you travel](#before-you-travel) · [Getting around](#getting-around) · [Search](#search) · [Plan](#plan) · [A day](#a-day) · [Journeys](#journeys) · [Map](#map) · [Areas and categories](#areas-and-categories) · [Logbook](#logbook) · [Manage](#manage) · [Editing](#editing) · [Sharing and backups](#sharing-and-backups) · [Data safety](#data-safety) · [Offline](#offline) · [Troubleshooting](#troubleshooting)
- **Technical** — [Stack](#stack) · [Running locally](#running-locally) · [How data is stored](#how-data-is-stored) · [Supabase](#supabase) · [Deploy](#deploy) · [The map background](#the-map-background) · [Project layout](#project-layout) · [Branding](#branding)

---

# Using the app

## Getting started

1. **Open the link and sign in with Google.** Each person uses their own Google account.
   Don't want an account? Tap **Use on this device only** — the trip stays on that device and doesn't sync. You can switch later with **Sign in to sync** at the top of Manage.
2. **Create your trip.** New accounts only have the read-only **Demo**. Go to **Manage → Trips → New trip** and give it a name. Then set its dates in **Manage → Setup**.
3. **Share it.** The owner opens **Manage → Sharing** and adds the other person's email. You both then edit the same trip, and changes appear on the other device within a second or two.

> If someone signs in before they've been added, they'll only see the Demo. Share the trip with their email and it appears on their next reload.

### Install it on your phone

| Phone | Steps |
|---|---|
| **iPhone** (Chrome) | Open the link → **Share** in the address bar → **Add to Home Screen** |
| **Android** (Chrome) | Open the link → **Install app** (or ⋮ → **Add to Home screen**) |

It then opens full screen like any other app. Do this on each phone. **Manage → Trips → This device** walks you through it too.

### The demo trip

Every account has a read-only **Demo** trip: a made-up example to look around in. Delete it from **Manage → Trips** whenever you like, and re-add it from the same place.

## Before you travel

Do these on each phone, on wifi, a few days before you leave:

- [ ] **Install the app** on the home screen (above) and open it once.
- [ ] **Open the trip** while online, so a copy is kept on the phone.
- [ ] **Manage → Trips → This device** — check *Works offline* says **Ready**.
- [ ] **Save trip maps for offline** (same screen) — every city's map, in one go.
- [ ] **Save attachments for offline** (same screen) — tickets and bookings open with no signal.
- [ ] **Map → location arrow** — allow location once, so the blue dot works later.
- [ ] **Manage → Sharing → Download backup** — keep the file somewhere safe.

## Getting around

The app is laid out like an iOS 26 app.

| Where | What it does |
|---|---|
| **Tab bar** (bottom) | Plan · Map · Logbook, with the round **Search** button beside it. It slides away while you type, and sheets rise above the keyboard. On a wide screen the tabs become a rail down the left. |
| **Trip name** (top left) | A menu to jump to another trip, or to manage trips. |
| **‹ Back** | Names the screen you came from (*‹ Stays*); long titles just say *‹ Back*. You can also swipe in from the left edge. With a sheet, menu or Search open, Android's back gesture (or the browser's Back) closes that first. |
| **‹ ›** on a day | Step to the previous or next day (← → on a keyboard). |
| **Account picture** (top right) | Opens Manage. |

A Logbook page pinned to the tab bar is a tab of its own, so it has no back button.

## Search

The round button beside the tab bar (top right on a wide screen, or ⌘K / Ctrl+K).

- **Searches everything in the trip** — names, plan steps, spending, notes, addresses, booking refs, document fields and file names — plus the **Help** answers, listed last.
- **Every word counts, in any order.** "ueno museum" finds a museum whose note mentions Ueno.
- **Accents, spaces and dashes are ignored.** "sensoji" finds *Sensō-ji*.
- **Shows why it matched.** When the words aren't in the name, the line they were found in shows under it, words highlighted.
- **Grouped** under Days, Places, Stays, Journeys… — each with the icon it has in its own list.
- **Recent searches** — opening a result saves what you typed (per trip, on this device). **Clear** empties the list.

## Plan

The trip as a list of days, grouped by **base** — where you're based for a run of nights (Tokyo, Kyoto). A **stay** is the place you sleep there: a hotel, an Airbnb, anything. Day trips go out from a base and back.

- **Tags.** Each day shows **Arrive**, **Travel**, **Depart** or **Day trip**. These are worked out from the day itself, never chosen by hand. A day trip stays **Day trip** with its trains on it; an arrival or departure journey still wins.
- **Reorder** by dragging a day up or down. The dates shuffle with it.
- **Pin a day** that's fixed to its date (a public holiday, a booked tour) from the foot of its page. Its drag handle becomes a pin and other days flow around it. **Unpin this day** undoes it.
- **During the trip** the list opens on today. Earlier days move to **Past days** at the bottom (closed until you open it), grouped by base. Past days can be opened, not dragged. It moves on to the new day by itself, even if the app was left open overnight.
- **After the trip** the top of Plan becomes a recap: how many days away, cities, total spent in the trip's main currency (tap it for Expenses) and stamps collected.
- **Labels** — your own tags for a day ("Chill day", "Walking"):
  - **+ Add a label** under the day's title offers labels you've used, or **New label…**.
  - ✕ removes one from the day. Tap a label to rename or delete it on every day at once.
  - All of it can be undone.

### How dates work

The days set the dates — you don't edit them separately.

- A base runs from its first day to its last.
- **Days − / +** on a base's page adds or takes off a day at its end. Everything later in the trip — days, bases, journeys, luggage dates — moves along with it. Taking a day off can be undone.
- Bases are always listed in date order. To change the order, move the days (drag them to another base).
- The trip can start or end outside its days (a flight out the evening before day one). Its dates stretch to cover a day added outside them, and only shrink when the day on the trip's first or last date is deleted.
- **Add a day** fills the earliest empty date in the trip (a gap left by a deleted day), otherwise it goes after the last day.
- **Add a base** (next to Add a day) asks for the base's name, then starts it on the day after the last day, with that day already in it, and opens it. Pick its stay there, or **New stay…** to make one named after the base.
- **Changing a base's stay** moves its days onto the new stay too, except a day you gave a different stay of its own.
- **Delete day** leaves the other days alone. Only removing a base's first or last day shortens it.
- **Delete base** at the foot of a base's page deletes its days with it. The confirm says how many; **Undo** brings them all back.
- A stay's page and the Stays list show the real check-in and check-out dates (the morning you leave, not the last night), the number of nights, and the times.

## A day

Tap a day on Plan to open it. From top to bottom:

1. **Staying at** — which hotel.
2. **Journeys** — every journey on the day (a bus, a train, a flight), in the order they leave. See [Journeys on a day](#journeys-on-a-day).
3. **Weather** — if the hotel has coordinates, the header shows the forecast ("Showers, 19–24°C"). Forecasts only reach ~16 days ahead, so later days show nothing until they're close enough.
4. **The itinerary** — the day's steps (below).
5. **Areas** — drop a whole neighbourhood's places onto the day's map.
6. **Spending** — see [Spending on a day](#spending-on-a-day).
7. **General notes.**
8. **The day's actions** — **Make this a day trip** (or **Not a day trip**), **Pin this day**, and **Delete day**.

Every section folds away from its header.

### Spending on a day

- **Add an amount** offers the day's steps to pick from, then opens the keypad in the currency you last spent in.
- **Custom…** asks for a name first; Return moves on to the keypad.
- A row left with no name and no amount goes away. A typed name is kept even with no amount yet.

### Journeys on a day

- Each row shows the route, its times and the mode. Tap it to open the journey.
- **Add a journey** links an existing one (that day's first) or makes a new one.
- Swipe a row (✕ on desktop) to take it off the day. The journey itself stays.
- A journey that runs on another date says so in red and offers to move it there.
- A journey's own page lists the days it's on (**On Plan**), or offers to add it to its departure day.

### Steps

Each step shows a tile, an optional time, the step itself and a short note.

- **Time** — a single time or a range like `14:00–15:15`. An empty time is just a small clock to tap.
- **Setting a time** — the wheels start at the last time set on an earlier step (else 9:00). **Done** saves what's showing; tapping outside or swiping the sheet down cancels.
- **Link a place** — tap the grey pin to pick a place from the day's Areas. Tap a linked name to change it; **Custom…** unlinks it.
- **Meal steps** — an unlinked step whose text mentions a meal (lunch, dinner, breakfast…), coffee or drinks gets a gold food, coffee or drink tile instead of the grey pin.
- **Reorder** by dragging.
- **The ⋯ menu** — show on map, add to Google Calendar, mark as **overwhelming** (a ⚠ sensory heads-up; the day's count shows on Plan), add a note, duplicate, add an expense, remove.
- **Notes** support bold, bullets and links. Tap to expand and edit. Empty fields stay hidden.
- **+ Add a step** sits at the foot of the list and opens the new step ready to type. Leave it blank and it goes away.
- **Each journey on the day** shows as two rows of its own: **Leave** (first departure) and **Arrive** (last arrival), slotted in by time. They follow the journey live — edit the times on the journey, tap a row to open it.

### Helpers on a step

These appear automatically when a step is linked to a place.

**Walking and transit.** One line shows two walks:

- 🚶 to the next step (if it's linked too), e.g. *≈ 9 min · 0.8 km*
- 🚆 to the nearest station, e.g. *≈ 3 min · 195 m to Ueno*

A straight-line estimate shows first and is replaced by a real walking route when one comes back (needs `VITE_ORS_API_KEY`). When the walk to the next step is over 20 minutes, a train link is added — *"Train: Ueno → Uguisudani · ≈ 24 min total"* — which opens Google Maps transit directions. The total is a rough door-to-door guess, since there's no free transit-routing API.

**Opening hours.** If the place itself has hours on OpenStreetMap (matched by its name, or tagged right on its pin — never a neighbour's), that day's hours show at the right of the row ("09:00–17:00", or "Closed"). Seasonal and weekday rules are applied; anything the app can't read is shown as written. It's for information only — nothing is flagged as a conflict.

**Back to hotel.** The last row of the day is the way home to that night's hotel (left off on a departure day). It shows the walk, or the stations to travel between for a long way, and opens Google Maps directions when tapped.

Stations and hours come from OpenStreetMap (Overpass, with Nominatim as a fallback). Results are remembered on the device.

### The map beside a day (wide screens)

At 1024px and up (a laptop, or a tablet held sideways), a day's page gets a map pane on the right.

- It shows the day's places, its areas' places (drawn more quietly) and the hotel, and follows you between days.
- Tap a pin for its name and a **Directions** link. A step's **⋯ → Show on map** zooms straight to it.
- Drag the left edge to resize; **✕** hides it and a small tab brings it back. Both are remembered.

On a phone the pane isn't downloaded at all, and **Show on map** opens the Map tab instead.

## Journeys

Open one from a day, or from **Logbook → Journeys**. A journey is one or more **hops**.

- **Each hop** is a card tinted by mode (rail, air/sea, road, on foot): route, departure and arrival times with the real duration between them, dates, and details (carrier, platform, seat, booking ref, fare).
- **Time zones are counted**, so a Beijing → Warsaw flight reads 10h, not 3h.
- **Dates** open a date picker. Moving the departure moves the arrival with it; a new hop takes the arrival date of the one before. An arrival that lands before its departure is shown in red.
- **Connections** between hops are flagged when tight or overnight.
- **Total fare** adds up the hops' fares. A journey-level fare is only used when no hop is priced (one ticket for the whole trip).

## Map

Your places on a clean map, read top to bottom: **city → filters → places**.

### Cities

- **City pills** — **All**, one per city, and **Today** while the trip is running. Picking one narrows both the map and the list. The map opens on where you are, or the first base.
- **One pill per city.** Several bases in the same city share a pill (matched by city name).
- **Which city a place belongs to** — the nearest base within about 60 km, measured from where you're staying there, else the places its days use, else the city found by name. Places further out only show under **All**. Override it on the place's card with **City**.
- **Day trips to another town** (Nara from Kyoto) get their own pill right after their base, with that town's places moved into it. The day must be marked as a day trip; the town comes from the day's name or its places.

### Places

- **＋ Add place** — search for somewhere, or tap the map to drop a pin.
- **The list** — once a city is picked, places are grouped by area (plus *No area*). On **All** it nests **city → area → place**. Groups start collapsed and remember what you opened.
- **A place's card** — name, note, areas, city, Open in Google Maps, the day it's on (or **Add to a day**), and Remove.
- **List rows** show the name and the walk to the nearest station.
- **Place names** on the map are in English / Latin script where available.

### Filters

**Filters** opens a sheet:

- **Category** — tap the coloured dots to narrow; none selected shows everything.
- **Category pins** (**Manage → Content**) set each category's icon and colour once, for every pin in it — no need to style pins one by one in My Maps.
  - A My Maps layer gets an icon guessed from its name on sync ("Coffee" → cup, "Temples" → landmark). Pick another, or **Dot** for none; a sync never overrides your pick.
  - A category colour wins over the pin's My Maps colour. **Colour from My Maps** goes back to it.
  - **Always show** keeps its pins visible when zoomed out instead of clustering them (down to about city level).
- **Transit** — Train and Metro lines are on by default; add Tram, Bus, Ferry or Airport. Works in any city with no setup.
- **Points of interest** — the map's own stations, parks, museums and shops, with their icons. Turn it off to see only your pins. Remembered on this device.

### Other controls

- **Location arrow** (under the zoom buttons) — shows where you are and follows you. Drag the map to stop following; tap again to come back. Once allowed, the dot returns by itself next time.
- **Today → crosshair** sorts the list by distance from you and narrows it to 1.5 km when that leaves anything. It asks for your location only when tapped.
- **List/map icon** switches to a full-screen list. Remembered.
- **Resize** by dragging the grabber on the phone sheet (or tap it to cycle three heights), or the divider on desktop.
- **Sync from My Maps** adds new pins and removes pins you deleted there (**Undo** brings them back). Pins still on the map pick up their new position, layer and colour (unless their category has its own), and keep everything you've edited.
- **Renaming a pin in My Maps** counts as delete + add: the old one (with its notes) goes, the new one comes in.
- **Remove place** on a pin's card deletes it in the app only — if it's still on the My Map, the next sync brings it back.

## Areas and categories

- A **category** is *what* a place is (coffee, sights, food).
- An **area** is *where* it is (Gion, a neighbourhood you name). A place can be in several areas.

**Managing areas** (all on the Map):

- **Add** — *Areas → Add area*.
- **Assign places** — from a place's card.
- **Rename, delete, or edit an area's members** — *Edit areas*.
- **Show one area** — tap its colour dot; tap the rest of the row to fold it.

**Areas on a day.** Add an area on a day's page and all its places appear on that day's map (faded). It's a live link, so later edits show up. Tap **+** to turn one into a step. The day offers areas from its own city — a day trip gets its town's areas.

**What else areas show:**

- A faint labelled ring on the map when zoomed out.
- How far the area stretches on foot ("≈ 12 min · 0.9 km walk across").
- Each place's nearest station, read from the map tiles (with a network fallback). Nothing shows if there's no station within 1 km.

### Suggest areas

When unassigned places sit close together, a **Suggest areas** link appears. Nothing is saved until you tap Create.

- **Each group is a day out.** Places within about a 45 minute walk always share an area, in any city.
- **Each city is grouped on its own**, never across two stays, into about as many areas as you spend days there. A spread-out city's areas grow up to a day by local transport (10 km across) to fit; a compact one isn't lumped together just to hit the count.
- **Places with no city yet** are only grouped at walking size.
- **New groups** are named after their neighbourhood. Rename, untick or drop places before saving.
- **A loose place that fits an existing area** is offered to it as "Add to …" instead of starting a new one.
- **Existing areas** only ever gain places — nothing is renamed or taken out.

## Logbook

The reference drawer: stays · journeys · luggage · documents · emergency numbers · packing · stamps · expenses · scratchpad, plus any lists you add. Each row shows a count, progress ("3/8") or a total.

Text isn't selectable (as in a native app), so values you might paste elsewhere have a **copy** icon.

### Stays and journeys

- Each list has an **Add a stay** / **Add a journey** row at the foot. The new one opens on its own page to fill in.
- Stays are listed in the order you sleep in them, with their check-in to check-out dates and nights under the name (a stay no base uses yet goes last); journeys are listed by when they leave.

### Documents

Tap a document to open its page: name it, attach PDFs or photos, add fields and a note.

- **Add a field** (also a stay's details and Emergency contacts) opens the new field ready to type. Leave both its name and value blank and it goes away.
- **Signed in** — files go to your account (private to the trip, 25 MB each), or to a shared Google Drive folder if set up. Drive needs its own **Connect Google Drive** tap, which lasts about an hour.
- **On this device only** — files stay on the device, and upload automatically once you sign in.
- **Opening** a file shows it inside the app, like Quick Look: PDFs page by page, photos full width. Double-tap or pinch to zoom; **Share** saves or sends it on.
- **Offline** — every attachment is kept on the device once the trip opens. A cloud with a ⇣ beside a file means it isn't on this device yet.
- **Drive files** download while Drive is connected, or all at once from **Manage → Trips → This device → Save attachments for offline**.
- **Removing** an attachment never deletes the file itself.

### Packing

Add categories and items, tick them off. With two or more travellers (Manage → Setup), each item can be assigned to a person or **Shared**.

- Categories keep their place: deleting or renaming items never reshuffles them. A new category goes at the bottom.
- **Add item** opens the new item ready to type. Leave it blank and it disappears; clear an item's name to remove it (undoable). Your own lists work the same way.
- **On your own lists**, an item's note and link only show once filled in. Add them from the item's **⋯**, which also deletes it.

**Copy from another trip** brings over its list, unticked, skipping anything already there.

### Stamps

A checklist of stamps to collect (station stamps, temple seals), laid out like a stack of wallet cards — one card per section, showing "4 / 6".

- **Open a card** to see its stamps. Tap a stamp's circle to collect it.
- **Sections** — rename, add a local-script name, add stamps or delete from its ⋯. **New section** adds one; stamps without one sit under **Ungrouped**.
- **Each stamp** has a name, an optional local-script name, a note, and a station or temple icon.
- **Search** filters across all sections. **Sort** switches between your order and A–Z.
- **Collected** lists everything you've collected. **Select** moves or deletes many at once.

### Expenses

A read-only total of every price in the trip — stays, fares and day spending — grouped by category, then by currency.

- Stays count as Accommodation. Fares go to the category that claims their mode (Train, Flights…), else Transport. Day spending goes where you put it.
- A journey's fare is counted once, never twice.
- With more than one currency, **Combined** adds everything up in the main currency using a live exchange rate (cached offline, rounded). Unsupported currencies are left out and noted.
- A bar above each currency shows the split by category.
- **Tap a category** to see every amount behind it — each stay price, fare and day's spending, by date — and open the one you want to change.
- The Logbook row shows the same total in the main currency. Before the rates have loaded once, it lists each currency instead.

## Manage

Open it from your account picture (or the foot of the sidebar on a wide screen). It starts with your account — who's signed in, sync status, Sign out or **Sign in with Google** — then a Settings-style list: **Trips**, **Setup**, **Content**, **Look**, **Sharing**, and **Help** at the bottom.

### Setup

- **Dates** — on a trip with no days yet, set the start and end directly. Once it has days, moving either date slides the whole itinerary.
- **Travellers** — used for packing assignments.
- **Time zones** — *Home* comes from the device. *On the trip* fills itself in from the first hotel with coordinates, unless you've picked one. The picker lists cities with offsets; search by city, offset or abbreviation ("kolkata", "+5:30", "JST").
- **Currencies** — the first is the default (a new trip starts on `PLN`). Prices open a keypad, with a currency switch once there's a second currency.
- **Expense categories** — rename, add, reorder or remove from ⋯. Removing one moves its spending to the next. A category can claim hop modes (so Train and Flights split out of Transport). Tap its icon to pick another from 130+.
- **Logbook sections** — hide the ones you don't need.
- **Tabs** — rename, reorder or hide Plan / Map / Logbook, and **Add tab** to pin a Logbook page (Packing, say) to the tab bar. A pinned page leaves the Logbook list, so it isn't shown twice.

### Look

Theme and trip logo. **Appearance** (light, dark or *Automatic*) is per device, not per trip.

## Editing

**Tap text to edit it.** There's no edit mode — the text stays where it is and a cursor appears. Dates and times open pickers; links, phone numbers and emails become tappable once filled in. In a list of details (a document, a stay's reference, Emergency), edit from the row's **⋯ → Edit**.

**Row menus.** Press and hold a row (right-click on desktop) to open its actions beside it — the same ones as its **⋯**. Days, stays, journeys, documents and Map places have one too:

- **Day** — make it a day trip, pin it, delete it.
- **Stay** / **Map place** — open in Google Maps, delete.
- **Journey** / **Document** — delete.

**Notes** take light formatting — `**bold**`, `*italic*`, `++underline++`, `~~strike~~`, `##` headings, `>` quotes, `-` bullets, `- [ ]` checklists, `[links](https://…)` — with a toolbar for all of it and the usual keyboard shortcuts. Checklist boxes can be ticked without opening the editor.

**Deleting.** Every delete asks first (a confirm sheet, or a second tap on a swiped row). After that, an **Undo** bar appears for a few seconds and puts back exactly what was removed. Only the last delete can be undone, and deleting a whole trip or a file can't be.

**Save status** (signed in only), top right:

| Label | Meaning |
|---|---|
| **Saving…** (grey) | An edit is on its way. |
| **Saved** (green) | It landed. |
| **Offline** (amber) | No connection. Edits queue and send when you're back. |
| **Couldn't save — retrying** (red) | You're online but the account didn't take the edit. Tap it for the list of what's waiting, Retry now, or discard one. |

If saving keeps failing:

- **After 30 seconds**, a banner under the header names the changes that haven't reached your account, with **Retry now**. They stay safe on the device and keep retrying.
- **A change the database can never accept** gets its own red banner until you dismiss it. A copy is kept on the device — nothing is dropped silently.

## Sharing and backups

All under **Manage → Sharing** unless noted.

| Option | What you get |
|---|---|
| **Download web page** | The whole trip as one `.html` file — itinerary, journeys, stays, places — that opens offline in any browser or prints to PDF. Keep **Include private details** off when sharing it (it hides door codes, booking refs and documents). Attachments are never included. |
| **Add to calendar (.ics)** | Every step and hop as calendar events. Exact times become timed events; loose ones ("Around 18:00") become all-day. Also available per day on the day's page (always with booking refs). Each step and hop also has a quick Google Calendar button. |
| **Download backup (.json)** | A complete, lossless copy of the trip, private details included — keep it somewhere safe. |
| **Restore from backup** (Manage → Trips) | Loads a backup as a **new** trip; never overwrites. Damaged, edited or newer-version files are refused. Attachments aren't inside backups. |

## Data safety

Every edit saves as you make it. On top of that, the app keeps **restore points** — complete, checksummed copies of a trip.

**When they're taken**

- Every few minutes while you edit (newest 12 kept).
- Just before every delete you make, named after what went ("Before deleting Riverton and 2 days"). These share the newest-12 list with the automatic ones.
- Before anything risky: deleting a trip, restoring, syncing offline edits, a data-reshaping update, or a save that would remove over half a device-only trip (newest 10 kept, separately).

**Where they live** — in your account (needs migration `0026`) and on the device.

**Getting one back** — **Manage → Sharing → Data safety**:

- *Restore over this trip* (asks twice; the current version is kept first) or *Restore as a new trip*.
- **Recently deleted** brings back deleted trips (kept 90 days).
- **Back up now** takes one on demand. Do this on each trip before applying a migration that rewrites data.

**Other safeguards**

- A trip is never deleted unless a restore point was made first.
- Damaged data opens a recovery screen, never a blank trip.
- A failed save keeps your changes on screen, says so, and keeps retrying — even across a reload.
- A save that would wipe a device-only trip is refused (with a **Save anyway** option).
- Two devices changing trip settings at once are merged, not overwritten.
- An older app version refuses to open data written by a newer one.

## Offline

Once the app has loaded, it works with no signal. See [Before you travel](#before-you-travel) for the one-time setup.

| What | With no signal |
|---|---|
| **The trip** | Kept on the device once opened, so the app starts with no signal. Cleared when you sign out. |
| **Edits** | Queued on the device and sent when you're back. The app then re-pulls the trip to pick up your companion's changes. |
| **Signing in** | You stay signed in, even after days away. The login renews itself once you're back. |
| **Weak signal** | If the server hasn't answered in 5 seconds, the app opens the device copy and updates once it gets through. |
| **Maps** | Areas you've viewed are kept. Save more ahead from a day's **Download offline maps**, or the whole trip from **This device**. A new area opened offline retries when you reconnect. |
| **Attachments** | Kept on the device — see [Documents](#documents). |
| **Your location** | GPS works without data; the blue dot shows on saved maps. |
| **First visit ever** | A plain "you're offline" screen that retries on its own. |

**Manage → Trips → This device**

| Row | Shows |
|---|---|
| **Works offline** | *Ready* once the app is fully saved on the device. |
| **Save trip maps for offline** | Saves the area around every day, stay and place, with progress. |
| **Save attachments for offline** | Downloads every file not on the device yet; reads *On this device* when done. |
| **Install app** / **Add to Home Screen** | Installs, or shows the two iPhone steps. Reads *Installed* once done. |

## Troubleshooting

**Something looks out of date.** Fully close the tab or app and reopen it, or pull down from the top of any page.

**Is this device on the latest version?** The foot of **Manage** shows the version, commit and build date. Compare the commit with the one you pushed.

**Help** (bottom of Manage) answers the common "how do I…" questions in short steps, grouped by topic, with its own search. The app's main Search finds those answers too.

---

# Technical

A trip-agnostic React PWA. Nothing in the code assumes a particular country, city or currency — real trips are created and edited in the app and live in Supabase. `src/templates/` only holds two generic seeds: `blank` (every new trip) and `demo` (the read-only tour).

## Stack

| Area | Tools |
|---|---|
| App | Vite · React · TypeScript · Tailwind · React Router · Zustand |
| Offline | vite-plugin-pwa (Workbox) · idb-keyval (IndexedDB) |
| Backend | Supabase — Postgres, Auth, RLS, Realtime, Storage |
| Map | MapLibre GL + Protomaps |
| Other | dnd-kit (drag) · pdf.js (attachment viewer) · Vitest |

## Running locally

```bash
npm install
npm run dev
```

| Script | What it does |
|---|---|
| `npm run dev` | Dev server at http://localhost:5173 |
| `npm run dev:demo` | Dev server, local-only, seeded with an editable Sandbox trip. No Supabase or sign-in needed. |
| `npm run build` | Production build → `dist/` |
| `npm run build:demo` | Build for the public demo site |
| `npm run preview` | Serve the build (use this to test the service worker) |
| `npm run typecheck` | `tsc --noEmit` — the main check; there's no linter |
| `npm test` | Unit tests (Vitest) — data safety, storage, sync, search and a few helpers |

### Environment (`.env.local`)

All optional — with nothing set, the app runs fully on the device.

```ini
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon / public key>
VITE_PROTOMAPS_API_KEY=<Protomaps hosted API key>
VITE_ORS_API_KEY=<OpenRouteService key>
VITE_GOOGLE_CLIENT_ID=<Google OAuth web client id>
```

| Variable | Purpose |
|---|---|
| `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` | Accounts, sync and sharing. The URL must be the **full https URL**. |
| `VITE_PROTOMAPS_API_KEY` / `VITE_MAP_TILES_URL` | Map tiles — see [The map background](#the-map-background). |
| `VITE_GOOGLE_CLIENT_ID` | Google Drive for attachments. Without it, signed-in files go to the account's own storage. |
| `VITE_ORS_API_KEY` | Real walking routes. Free, no card, 2,000 requests/day from [openrouteservice.org](https://openrouteservice.org/dev/#/signup). Without it, walks use straight-line estimates. Requests are throttled and cached per device. |

`VITE_*` values are baked in at build time — a change only takes effect on the next build.

## How data is stored

```
edit in the UI  →  TripData (in memory)  →  backend
                                            ├─ Supabase   (signed in)
                                            └─ IndexedDB  (on this device)
```

- **Supabase** (configured and signed in) — every entity (legs, days, hotels, journeys and segments, luggage, docs, packing, places, areas, notes…) is its own row, private via RLS, synced in real time and shareable. Schema in [`supabase/migrations/`](supabase/migrations/).
- **IndexedDB** — used when Supabase isn't configured, or when the user picks **Use on this device only** (`localStorage["za.localOnly"]`, honoured by `needsAuth()`).
- **Code splitting** — the Supabase client, MapLibre and the PDF viewer are separate chunks, only loaded when needed.

### What's kept on the device

| What | Where | Notes |
|---|---|---|
| The app itself | Service worker precache | Includes the PDF viewer's fonts and character maps (`/pdfjs/`, ~4 MB). |
| Trip copy + unsent edits | IndexedDB (`mirror:*`, outbox) | Cleared on sign-out. |
| Attachments | IndexedDB (`file:*`) | Copies of cloud files are listed under `file-copies` and cleared on sign-out; device-only files are kept. |
| Map tiles, fonts, icons | `map-tiles`, `map-glyphs` caches | Server answers from Supabase are never cached — the trip copy covers offline. |

### Data-safety layer (`src/lib/safety/`)

| File | Role |
|---|---|
| `validate.ts` | Shape checks at every trust boundary (save, load, backup file, restore point), item counts, content hash. |
| `snapshots.ts` | Restore points: a device ring in IndexedDB plus cloud rows in `trip_snapshots` (migration `0026`, no foreign key so they outlive a deleted trip). `ensureBackedUp` gates every delete. |
| `quarantine.ts` | Anything that fails validation is copied here first; the original is never overwritten. |
| `errors.ts` | Typed failures. `loadTrip` throws `TripLoadError` (`unavailable` / `corrupt` / `missing` / `newer`) rather than returning empty, so a failed read can't trigger seeding over real data. |
| `../storage.ts` | `get` returns `undefined` only for a truly missing key; failed reads and writes throw. The device backend validates, reads back and serialises every save, and refuses to replace a trip with nothing. |

**Supabase outbox.** Unconfirmed edits (queued and in flight) are mirrored to IndexedDB. One batch goes to the server at a time, so an older save can't land after a newer one; a batch silent for 20 s stops blocking the next. Each tab has its own outbox, and a tab that died leaves its edits for the next tab to pick up (Web Locks, with a heartbeat fallback).

## Supabase

### Setting up a project

1. Create a project at [supabase.com](https://supabase.com).
2. In the **SQL Editor**, run every file in `supabase/migrations/` **in order** (`0001` → `0034`). `0033` moves old day-trip text (getting there / back, last way back) into each day's notes — take a backup first.
3. **Authentication → Providers → Google** — enable it with a Google Cloud OAuth client id and secret. Redirect: `https://<project-ref>.supabase.co/auth/v1/callback`.
4. **Authentication → URL Configuration → Redirect URLs** — add `http://localhost:5173` and the deployed URL.
5. Copy the Project URL and anon key (**Project Settings → API**) into `.env.local`.

A new account gets the Demo trip on first sign-in; real trips are made from Manage. After a schema change, the Demo re-seeds itself on reload, and real trips are migrated by the SQL or backfilled on load (`normalizeTrip`).

### Restricting who can sign in

Google sign-in has no allowlist of its own. Strangers would only ever see their own empty trip (RLS), but it's worth locking down:

- **Quick** — in Google Cloud Console → **OAuth consent screen**, keep the app in **Testing** and list the allowed emails as **Test users**.
- **Durable** — migration `0030` adds an `allowed_signup_emails` table and a `restrict_signup` function. Set the function as **Authentication → Hooks → Before user created**, then add emails in the SQL Editor:

  ```sql
  insert into public.allowed_signup_emails (email) values
    (lower('you@example.com')),
    (lower('them@example.com'))
  on conflict do nothing;
  ```

### Useful extras

- `supabase/dump_trip.sql` — read-only query that returns one trip's content as JSON, for diffing.

## Deploy

Hosted on **Cloudflare Workers** (static assets), deployed through the Git integration on every push to `main`.

### Main site

**Cloudflare → Workers & Pages → Create → import `xxvazquez/japan-trip`:**

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Build variables | `NODE_VERSION` = `22`<br>`VITE_SUPABASE_URL` = full https URL (**no quotes**)<br>`VITE_SUPABASE_ANON_KEY` = anon key<br>plus any map / ORS keys |

After the first deploy:

- Add the `*.workers.dev` URL to Supabase's Redirect URLs, or Google sign-in fails.
- Optionally put the site behind **Cloudflare Access** (Zero Trust → Access → self-hosted app).

> **Don't add `public/_redirects`.** Workers treats the usual `/* /index.html 200` catch-all as a redirect loop. SPA routing is already handled by `not_found_handling` in [`wrangler.jsonc`](wrangler.jsonc). `public/_headers` (cache rules) still applies.

### Public demo (no login)

A second, separate Workers project that boots straight into an editable Sandbox trip. Each visitor gets their own copy in their browser; nothing touches Supabase.

| Setting | Value |
|---|---|
| Build command | `npm run build:demo` |
| Deploy command | `npx wrangler deploy -c wrangler.demo.jsonc` |
| Build variables | `NODE_VERSION` = `22` — no Supabase variables |

This works via `VITE_PUBLIC_DEMO=1` in [`.env.demo-public`](.env.demo-public) (`publicDemoMode` in [`src/lib/supabase.ts`](src/lib/supabase.ts)). [`wrangler.demo.jsonc`](wrangler.demo.jsonc) gives it its own name and URL — never point it at `wrangler.jsonc`, or it will overwrite the real site.

## The map background

[MapLibre GL](https://maplibre.org) with [Protomaps](https://protomaps.com) vector tiles (OpenStreetMap data).

> `maplibre-gl` is pinned to **5.x** — 6.x breaks pmtiles loading.

The tile source is picked at build time, first match wins:

| Priority | Source | Notes |
|---|---|---|
| 1 | `VITE_PROTOMAPS_API_KEY` | **Recommended.** Whole planet, fast everywhere, free for non-commercial use up to 1M requests/month. Tiles are cached by the service worker, so viewed areas work offline, and the offline-map downloads are available. |
| 2 | `VITE_MAP_TILES_URL` | A `.pmtiles` file you host. Covers only the region you extracted; not cached offline. |
| 3 | Nothing set | Protomaps' planet archive on Source Cooperative. Works, but first paint takes 20–30 s. |

### Hosted API setup

1. Get a key at [protomaps.com/account](https://protomaps.com/account).
2. Add `VITE_PROTOMAPS_API_KEY` to `.env.local` and to the Cloudflare build variables, then redeploy.

Tiles are cached as `map-tiles`; label fonts and the base map's icons as `map-glyphs` (`runtimeCaching` in [`vite.config.ts`](vite.config.ts)). The offline downloads ([`src/lib/offlineTiles.ts`](src/lib/offlineTiles.ts)) cap at 4,000 tiles so they never push other areas out of the 6,000-tile cache.

### Self-hosted extract

Build one with the [`pmtiles`](https://github.com/protomaps/go-pmtiles) CLI:

```bash
pmtiles extract https://data.source.coop/protomaps/openstreetmap/v4.pmtiles japan.pmtiles --region=tiles-region.geojson --maxzoom=14
```

- `tiles-region.geojson` (repo root) is a `MultiPolygon` of the boxes to keep; `--bbox=minLon,minLat,maxLon,maxLat` also works.
- `--maxzoom=15` adds building detail at about 2.5× the size.
- The host must support **HTTP range requests** and **CORS**. Netlify works for free: deploy a folder with the file and a `_headers` file containing `/*` followed by an indented `Access-Control-Allow-Origin: *`.

## Project layout

```
src/
  core/types.ts         domain types (trip-agnostic)
  store/useApp.ts       Zustand store: trips, active trip, every mutation, sync queue
  lib/                  backend, db, auth, realtime, hydrate, storage, search,
                        help (the Help page's questions and answers),
                        maps, geocode, mymaps, cost, ics, offlineTiles,
                        offlineFiles…
  lib/safety/           data-safety layer (validation, restore points, quarantine)
  components/           app shell and shared UI (Editable, Section, MapView,
                        FileViewer, Icon…)
  routes/               one file per page (Plan, Day, Journey, MapTab, Logbook,
                        Hotel, Document, Manage, Help…)
  templates/            blank + demo seed trips
  styles/index.css      colour tokens and type scale
supabase/migrations/    database schema, applied in order
supabase/dump_trip.sql  read-only trip export for diffing
scripts/make_icons.py   regenerates app icons from the logo files
```

## Branding

Run `python3 scripts/make_icons.py` to regenerate everything in `public/icons` and `public/brand` from two square source files at the repo root.

| Source | Background | Produces |
|---|---|---|
| `logo.png` | Solid dark teal | `apple-touch-icon.png` and `icon-maskable-512.png` — the two icons that need a solid backing (iOS adds a black one otherwise; maskable icons show holes). |
| `logo-mark.png` | Transparent | `favicon.png`, `icon-192.png`, `icon-512.png`, and the in-app marks (wordmark, sign-in / offline / error screens). |

Notes:

- `logo.png` has been background-corrected to remove a vignette baked into the original render, so it reads as one flat colour.
- `favicon.png` gets an extra contrast and sharpening pass after resizing (`bolden_for_favicon`), so the detail survives at 16px.
- The in-app marks use the same file for light and dark (`logo-{size}-dark/light.png`). A separate per-theme pair can be dropped in later; `useIsDark()` in `src/lib/mode.ts` already picks between them.
- The two source files come from separate renders. If either is ever redone, redo both from the same generation so they match.
- `logo-wordmark.png` / `logo-wordmark-light.png` are reference art with the name baked in, not used yet.
- Per-trip logos are uploaded in the app (**Manage → Look**).

---

<sub>Private project — not for redistribution.</sub>
