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

**Updates install themselves** — no need to reinstall:
- The app looks for a new version when it opens, when you come back to it (at most every 5 minutes), and every half hour while it's open.
- Found at launch: it restarts into it straight away. Found mid-use: an *Updating…* note shows at the top, then **New version · Restart**. It also restarts on its own next time you leave the app.
- To get it now: **Manage → Refresh**. The launch screen (logo and spinner) covers the app while it fetches the newest version, saves any pending edit and reopens. Pulling down from the top of any page also checks.

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
- **Reorder** — hold a day, then drag it up or down (on a computer, just drag it). The dates shuffle with it. Holding without moving opens the day's menu instead.
- **Pin a day** that's fixed to its date (a public holiday, a booked tour) from the foot of its page:
  - It shows a pin and can't be dragged.
  - Other days flow around it — when you drag, and when an earlier base gains or loses a day.
  - A journey or luggage note on that date stays with it.
  - **Unpin this day** undoes it.
- **During the trip** the list opens on today. Earlier days move to **Past days** at the bottom (closed until you open it), grouped by base. Past days can be opened, not dragged. It moves on to the new day by itself, even if the app was left open overnight.
- **After the trip** the top of Plan becomes a recap: how many days away, cities, total spent in the trip's main currency (tap it for Expenses) and stamps collected.
- **Labels** — your own tags for a day ("Chill day", "Walking"):
  - They show as one grey line under the day's title, like on Plan.
  - Tap that line, or ⋯ → **Labels…**, for a checklist of every label in the trip. Tap one to put it on or take it off the day; **New Label…** makes another.
  - Hold a label in that list (right-click on a computer) to rename or delete it on every day at once.
  - All of it can be undone.

### How dates work

The days set the dates — you don't edit them separately.

- A base runs from its first day to its last.
- **Days − / +** on a base's page adds or takes off a day at its end:
  - Everything later in the trip — days, bases, journeys, luggage dates — moves along with it.
  - A pinned day keeps its date.
  - Taking a day off can be undone.
- Bases are always listed in date order. To change the order, move the days (drag them to another base).
- The trip can start or end outside its days (a flight out the evening before day one). Its dates stretch to cover a day added outside them, and only shrink when the day on the trip's first or last date is deleted.
- **Add a day** at the foot of a base's list adds a day at that base's end, like its **Days +**.
- The **＋** at the top of Plan offers **Add a day** and **Add a base**. Its Add a day fills the earliest empty date in the trip (a gap left by a deleted day), otherwise it goes after the last day.
- **Add a base** asks for the base's name, then starts it on the day after the last day, with that day already in it, and opens it. Pick its stay there, or **New stay…** to make one named after the base.
- **Changing a base's stay** moves its days onto the new stay too, except a day you gave a different stay of its own.
- **Delete day** leaves the other days alone. Only removing a base's first or last day shortens it.
- **Delete base** at the foot of a base's page deletes its days with it. The confirm says how many; **Undo** brings them all back.
- A stay's page, the Stays list and each base's header on Plan show the real check-in and check-out dates (the morning you leave, not the last night), the number of nights, and the times.

## A day

Tap a day on Plan to open it. From top to bottom:

1. **Staying at** — which hotel, with a row under it to open that stay.
2. **Journeys** — every journey on the day (a bus, a train, a flight), in the order they leave. See [Journeys on a day](#journeys-on-a-day).
3. **Weather** — if the hotel has coordinates, the header shows the forecast ("Showers, 19–24°C"). Forecasts only reach ~16 days ahead, so later days show nothing until they're close enough.
4. **The itinerary** — the day's steps (below).
5. **Nearby** — saved places close to the day's stops, kept out of the plan. Starts shut, like Areas; open or shut, it stays that way on every day. See [Nearby on a day](#nearby-on-a-day).
6. **Areas** — drop a whole neighbourhood's places onto the day's map.
7. **Spending** — see [Spending on a day](#spending-on-a-day).
8. **General notes.**
9. **The day's actions** — **Make this a day trip** (or **Not a day trip**), **Pin this day**, and **Delete day**.

Every section folds away from its header. Scroll down and the bar at the top keeps the day's title with its date under it.

### Nearby on a day

Suggestions from the trip's own saved places — nothing is looked up from outside, so it works offline. They never go into the plan until you add one.

- **What shows** — places within about 10 minutes' walk of a linked step, under the stop they're closest to ("Near Sensō-ji"), up to 4 per stop, nearest first.
- **Left out** — anything already on the day's plan, the trip's stays, stations and other transport, and a place closed that day.
- **Planned elsewhere** — a place on another day's plan still shows, marked **Planned Wed 14 Oct**, so you can spot a better fit.
- **Meals** — around a lunch (11:30–14:30) or dinner (18:00–21:00) the plan leaves open, somewhere to eat comes first, marked **For lunch** / **For dinner**. One that's known to be shut then isn't moved up.
- **＋** adds a place right after its stop (Undo on the toast takes it back).
- **Tap a row** for its card: the walk from the stop and that day's hours, **Google Maps**, Tabelog for a restaurant in Japan, **Map**, its note and Good to know, then **Add after …** and, if another day has it, **Move here from …** (takes it off that day) and a link to that day.
- **On a stop's place card** — the same short list sits under Good to know, as **Nearby** — shut each time the card opens; tap it to show the places.

### Spending on a day

- **Add an amount** offers the day's steps to pick from, then opens the keypad in the currency you last spent in.
- A step picked there (or **Add an expense** in its ⋯) starts in the category its icon suggests — a café under Food & drink, a museum under Activities.
- **Custom…** asks for a name first; Return moves on to the keypad.
- A row left with no name and no amount goes away. A typed name is kept even with no amount yet.
- **Tap the grey category** under an amount to change it.

### Journeys on a day

- Each row shows the route, its times and the mode. Tap it to open the journey.
- The section only shows on a day that has a journey. Add the first from the day's **＋** → **Add a journey**.
- **Add a journey** links an existing one (that day's first) or makes a new one.
- Swipe a row (✕ on desktop) to take it off the day. The journey itself stays.
- A journey that runs on another date says so in red and offers to move it there.
- A journey's own page lists the days it's on (**On Plan**), or offers to add it to its departure day.

### Steps

The day reads as one route, like a route's stops in Maps: times in a column on the left, a thin line joining every stop, each stop's icon sitting on it. The hotel you start from, steps, journeys and the way back to the hotel all sit on that line. No hairlines between rows.

Each step shows its name, then its note in smaller, lighter grey (folded after 2 lines, with **more**). A red line under the name only appears when it changes the plan: the step's time doesn't fit the place's hours (see below) or it's marked **Overwhelming**.

On a day that spans more than one part, the plan is split into **Morning** (before 12:00), **Afternoon** (until 18:00) and **Evening**, each starting with a tinted band across the timeline. A step with no exact time stays in the part before it. Bands only move forward through the day — never an earlier one twice.

A stop and the way on to the next one stay together: the walk or train sits under the stop it leaves from, never under a Morning/Afternoon band.

- **Time** — a single time, or a range like `14:00–15:15` stacked as 14:00 over 15:15. An empty time is left blank — tap the gap to set one.
- **Setting a time** — the wheels start at the last time set on an earlier step (else 9:00). **Done** saves what's showing; tapping outside or swiping the sheet down cancels.
- **12- or 24-hour** — follows the phone's own clock setting, for the times shown and for the wheels.
- **Link or change a place** — tap a step's icon to pick a place: the day's Areas first, then the rest of that city, then elsewhere (search when the list is long). **More → Change Place** on its place card does the same; **Custom…** unlinks it.
- **Note on an unlinked step** — tap its name to edit it and an **Add a note** line shows under it, as in Reminders. A linked step's note is on its place card.
- **Meal steps** — an unlinked step whose text mentions a meal (lunch, dinner, breakfast…), coffee or drinks gets a gold food, coffee or drink tile instead of the grey pin.
- **Time order** — steps keep themselves in time order. Set or change a step's time and it moves to its place in the day.
- **Untimed steps** — drag the small ≡ on the right (shown on hover on a computer) to place one. It then stays with the step above it. A loose time ("Around noon") counts as untimed.
- **Pin a step** from its menu (**Pin this step**) to lock its time, e.g. a booking — it shows a pin, and tapping its time or the pin offers **Unpin** or **Unpin and change time**. It still sits where its time puts it. **Unpin this step** in the menu, or **More → Pin Time** on its place card, unlocks it too. Only a step with a time can be pinned.
- **Mark as optional** from a step's menu, or **More → Optional** on its place card, for something nice to do but not a must: an ochre ◌ Optional tag shows under its name. **Make this a must** undoes it.
- **The place card** — tap a linked step's name or note, as you'd tap a place in Maps. ✕ or a drag down closes it.
  - **Top:** the name, a red line if it clashes with the place's hours, and a grey line if it's Optional, pinned or Overwhelming.
  - **Buttons**, up to five across: **Google Maps** (filled), Tabelog (restaurants in Japan), **Menu**, **Website**, **Show on Map** (phone), **Share** and **Search Web** (when there's no website). What doesn't fit goes under **More**.
  - **Share** opens the Share sheet; where there isn't one, it copies the name and map link.
  - **Below:** the step's note, Good to know and **Nearby** (see [Nearby on a day](#nearby-on-a-day)).
- **On a computer** the card opens as a popover with its arrow on the place's name — beside the name, or under it when a long name leaves no room — and the map pane flies to the place at the same time.
- **More** on the place card holds everything else, as Maps does:
  - Whatever didn't fit in the row, and **Add to Calendar**. Show on Map is phone only — on a computer the map is already beside you.
  - **Optional**, **Pin Time** (a step with a time) and **Overwhelming**, ticked when on.
  - **Change Place**, **Add an Expense**, **Duplicate** and **Move to Another Day**.
  - **Remove Step**, last.
- **Walk and train lines** under a step open Google Maps directions; only a tap on the line itself does.
- **Open in Google Maps** is also the first item when you hold a step (or right-click it on a computer).
- **The step's menu** — long-press a step on a phone, or right-click it on a computer (an unlinked step also has a ⋯ on hover there): add to Google Calendar, mark as **overwhelming** (a ⚠ on its grey line; the day's count shows on Plan), add a note, pin, mark as optional, **add a step below**, duplicate, add an expense, remove.
- **Move to another day** — from a step's menu or its place card: pick the day and the step leaves this one, keeping its time, pin and note. Undo brings it back.
- **Delete** — swipe a step left on a phone.
- **Notes** support bold, bullets and links. Tap to edit. Empty fields stay hidden.
- **+ Add a step** sits at the foot of the list. It asks what the step is first, from the same place list: pick a place and its time wheel opens; **Custom…** opens a step ready to type. Leave that blank and it goes away.
- **＋ on a Morning / Afternoon / Evening band** adds a step at the end of that part of the day.
- **An empty day** still shows where it starts and ends (the hotel rows), so it looks like every other day.
- **＋** at the top of the day (where Plan has its ＋) offers **Add a step** — the same list, from anywhere on the page, so a long day needs no scroll — or **Add a journey**. A step with a time moves into place.
- **Each journey on the day** shows as two rows of its own: **Leave** (first departure) and **Arrive** (last arrival), slotted in by time. They follow the journey live — edit the times on the journey, tap a row to open it.

### Helpers on a step

These appear automatically when a step is linked to a place.

**Getting to the next step.** Between two steps tied to places, quiet grey captions sit on the line — travel between things you do, the way Calendar shows travel time. Each opens its own Google Maps directions:

- Always the walk all the way, with its distance, e.g. *🚶 22 min · 1.8 km*.
- Past a 15-minute walk, a train line under it, read like a Maps transit route: the door-to-door time first, then walk to the station › ride › walk from the station, e.g. *🚆 15 min · 🚶 6 min › Shibuya → Harajuku › 🚶 5 min*.
- *By train* past a 30-minute walk when no stations are found.
- Left out when a journey's own row already sits between the two.

A straight-line estimate shows first and is replaced by a real walking route when one comes back (needs `VITE_ORS_API_KEY`). The train time is a guess, since there's no free transit-routing API.

**Opening hours.** The hours to read are the **Hours** row in Good to know. A step's time is checked against that day's hours, with seasonal and weekday rules applied:

- The hours come from Good to know's **Hours** and **Closed** rows first ("Tue–Sun 11am–3pm", "Mondays"), else from OpenStreetMap (matched by the place's name, or tagged right on its pin — never a neighbour's).
- **Closed this day** — the place doesn't open that date (a closed weekday, or a day its hours don't cover).
- **Not open yet · opens 10:00** / **Closed then · reopens 17:00** / **Closed by then · closes 17:00** — the start time falls outside the hours.
- **Closes at 17:00** — a time range runs past closing.
- Nothing shows when it fits, or when the hours or the time (e.g. "Around noon") can't be read.

**Tabelog link.** A restaurant or café in Japan gets its Tabelog page found automatically:

- It happens the first time the step shows, or its card opens on the Map. Online only; the link is then saved with the place.
- It's found through a web search (Tavily): a Tabelog page in the same or a neighbouring prefecture whose title has the same name (English, or the Japanese name OpenStreetMap has for the pin).
- Needs `TAVILY_API_KEY` on the server (see [Deploy](#deploy)); without it, every restaurant just gets **Search Tabelog**.
- Signed in only — on *Use on this device only* the lookup isn't available.
- Found: **Tabelog** in the step's place card button row, the same on the Map card.
- Not found: the same button offers **Search Tabelog** instead. A miss isn't retried on that device for 30 days, unless the name or pin changes.
- "Restaurant" means the category's icon is from *Food & drink* (or its name says food, café, bar…).
- **Manage → Content → Tabelog links** finds them for every restaurant at once.

**Good to know.** A short summary of a place from guides and review sites, plus its own website — anywhere, not just Japan. Each fact has its own coloured icon (a red one for **Closed**, whose day reads red too). Very short pairs share a row in two columns — **Hours** beside **Closed**, **Reservations** beside **Queue** (or Tickets beside Crowds) — and anything longer gets the full width.

| Place | Shows |
| --- | --- |
| Restaurant or café | **Known for**, **Hours**, **Closed**, **Reservations**, **Queue**, **Price**, **Website**, **Menu** |
| Anything else on a day's plan | **Known for**, **Hours**, **Closed**, **Tickets**, **Crowds**, **Entry**, **Website** |

Where to find it:
- **Plan** — tap a step's name; it's in the place card, under the buttons.
- **Map** — in the place's card, under the note.

How it fills in:
- **By itself** — the first time a place shows, again once it's a month old, and after a rename or a category change. Nothing to run.
- The ↻ icon beside **Good to know** checks again now. **Manage → Content → Good to know** does every place at once (one search each).
- **When it can't check, it says why** — offline, the server refused it (signed out, or the Worker's sign-in variables are missing), lookups not set up (no search key), or the search service failing. The card and Manage's **Last check** both show it.
- **By hand** — tap any fact to correct it; **Add details** opens the empty ones to fill in. Works when the search found nothing or the wrong place. Clear a wrong one to hide it.
- What you type always wins: a later lookup (automatic, ↻ or Manage) never overwrites it. Typing back what the lookup found drops your version.
- Saved with the place, so it works offline.
- Not for your own hotel, or places filed as lodging or transport (a hot spring still counts).

What to expect:
- Each fact is a short phrase; anything the sources don't mention is left out.
- **Website** comes from OpenStreetMap's tag for the place at its pin, else the site the search summary names as official (when it's one of the pages read), else a search result whose address carries the place's name. Never a listing or guide site (Tabelog, Tripadvisor…). On a step's place card it's a button up top rather than a row (in **More** when the row is already full). None when nothing is found — common for small cafés, viewpoints and streets.
- **Menu** is the place's own menu page when OpenStreetMap has one tagged, else the menu tab of its Tabelog page — a button on a step's place card. None without either. Google Maps menus aren't available without a paid API.
- A result only counts if its pages name the place and its city, so a namesake elsewhere isn't picked up.
- The city is the place's stay: the one it's filed under, else its day's, else the nearest (as on the Map). "Kawaguchiko" is enough for "Lake Kawaguchiko".
- A place over 30 km from that stay's hotel gets its day trip's town instead (Osaka, not Kyoto), or no city at all if it's in no town on the plan.
- When it was checked and which sites it came from are on the ↻ icon's tooltip, not a row of their own.
- It can be out of date — check hours with the place before a long trip across town.
- Needs `TAVILY_API_KEY` (see [Environment variables](#environment-envlocal)).

**Wake up and Breakfast.** Every day opens with these two rows, above the hotel you leave from.

- Each has its own time on the same wheel as a step's (needs migration `0041`). The wheel starts at 07:00 for Wake up, and at the wake-up time (else 07:30) for Breakfast.
- They sit in time order with any step timed before you leave, and always under Morning.

**From the hotel.** The day starts from the hotel you slept at the night before, so a moving day starts from the old one. Left off on the trip's first day and on an arrival day. The way to the next step sits under it.

- Its time (when you leave) is set on the same wheel as a step's (needs migration `0040`), and falls under Morning / Afternoon like any step.
- It sits where that time puts it: a step timed earlier comes above it. With no time set, it opens the day.
- The wheel starts at a suggestion: the first step's time less the way there (the walk, or the train past a 30-minute walk), rounded down to 5 minutes.
- Tapping the name opens the hotel.

**Back to hotel.** That night's hotel closes the day (left off on a departure day). The way there sits on the line above it, with the same pills as between steps.

- Its time is set on the same wheel as a step's (needs migration `0039`). It falls under Morning / Afternoon / Evening like any step, so back at 19:00 closes the day under **Evening**.
- It sits where its time puts it: a step timed later (a drink near the hotel) follows it, with the walk from the hotel above it. With no time set, it stays last.
- Tapping the name opens Google Maps directions.

Stations and hours come from OpenStreetMap (Overpass, with Nominatim as a fallback). Results are remembered on the device.

### The map beside a day (wide screens)

At 1024px and up (a laptop, or a tablet held sideways), a day's page gets a map pane on the right.

- It shows the day's places, its areas' places (drawn more quietly) and the hotel, and follows you between days.
- Tap a pin for its name, **Google Maps** (the place itself) and **Directions**. Opening a step's place card zooms straight to it.
- Drag the left edge to resize; **✕** hides it and a small tab brings it back. Both are remembered.

On a phone the pane isn't downloaded at all; **More → Show on Map** on a place card opens the Map tab instead.

## Journeys

Open one from a day, or from **Logbook → Journeys**. A journey is one or more **hops**.

- **Each hop** is a card tinted by mode (rail, air/sea, road, on foot): route, departure and arrival times with the real duration between them, dates, and details (carrier, platform, seat, booking ref, fare).
- **Add a hop** under the last one starts from where it ended, by the same mode.
- **Time zones are counted**, so a Beijing → Warsaw flight reads 10h, not 3h.
- **Dates** open a date picker. Moving the departure moves the arrival with it; a new hop takes the arrival date of the one before. An arrival that lands before its departure is shown in red.
- **Connections** between hops are flagged when tight or overnight.
- **Total fare** adds up the hops' fares. A journey-level fare is only used when no hop is priced (one ticket for the whole trip).

## Map

Your places on a clean map, read top to bottom: **search → city pills → places**. Everything else is in the **⋯** menu beside the pills.

### Cities

- **City pills** — **All**, one per city, and **Today** while the trip is running. Picking one narrows both the map and the list. The map opens on where you are, or the first base.
- **One pill per city.** Several bases in the same city share a pill (matched by city name).
- **Which city a place belongs to** — the nearest base within about 60 km, measured from where you're staying there, else the places its days use, else the city found by name. Places further out only show under **All**. Override it on the place's card with **City**.
- **Day trips to another town** (Nara from Kyoto) get their own pill right after their base, with that town's places moved into it. The day must be marked as a day trip; the town comes from the day's name or its places.

### Places

- **＋ Add place** — search for somewhere, or tap the map to drop a pin.
- **The list** — once a city is picked, places are grouped by area (plus *No area*). On **All** it nests **city → area → place**.
- **Search** — the field at the top of the list finds areas by name and places by name, category or note, across the whole trip. The map shows only what it finds; on a phone the sheet pulls up while you type.
- **Areas fold open in place**, like folders in Files — tap an area row to show its places under it, and the map moves to show them. They start collapsed and remember what you opened.
- **The map frames what's listed** in the part showing above the sheet. A tapped place is centred there too.
- **Tapping a place** swaps the list for its card, as Apple Maps does; ✕ goes back to the list where you left it.
- **A place's card** — laid out like a step's place card:
  - **Top:** the name (tap to rename) and the walk to the nearest station.
  - **Buttons**, up to five across: **Google Maps** (filled), Tabelog (restaurants in Japan), **Menu**, **Website**, **Share**, **Search Web** (when there's no website), and the day it's on or **Add to Day**. What doesn't fit goes under **More**.
  - Google Maps searches at the pin, so a chain opens the right branch.
  - **Below:** **Note**, then **Good to know** — folded until you tap it, so filing a place stays quick (see [Helpers on a step](#helpers-on-a-step)) — then its areas, category and city, and last **Remove**.
  - **Category:** a pin added in the app can move into any category and takes on its colour; a My Maps pin's comes from its layer.
- **List rows** show the name and the walk to the nearest station.
- **Place names** on the map are in English / Latin script where available.

### Filters

**⋯ → Filters** opens a sheet (the **⋯** button turns tinted while a category filter is on):

- **Category** — tap the coloured dots to narrow; none selected shows everything.
- **My Maps layers** (**Manage → Content**) — pick which category each layer goes into ("Coffee & tea" → coffee), or **New Category…**. Every sync then files that layer's pins there, with that category's colour and icon.
  - A new layer shows **Not set up** (and the Map's sync line names it) until you choose; meanwhile its pins come in under the layer's own name.
  - Names are matched exactly — nothing is guessed between look-alike names.
- **Category pins** (**Manage → Content**) set each category's icon and colour once, for every pin in it — no need to style pins one by one in My Maps.
  - A new category gets an icon guessed from its name on sync ("Coffee" → cup, "Temples" → landmark). Pick another, or **Dot** for none; a sync never overrides your pick.
  - A category colour wins over the pin's My Maps colour. **Colour from My Maps** goes back to it.
  - **Always show** keeps its pins visible when zoomed out instead of clustering them (down to about city level).
- **Transit** — Train and Metro lines are on by default; add Tram, Bus, Ferry or Airport. Works in any city with no setup.
- **Points of interest** — the map's own stations, parks, museums and shops, with their icons. Turn it off to see only your pins. Remembered on this device.

### Other controls

- **Location arrow** (under the zoom buttons) — shows where you are and follows you. Drag the map to stop following; tap again to come back. Once allowed, the dot returns by itself next time.
- **Today → crosshair** sorts the list by distance from you and narrows it to 1.5 km when that leaves anything. It asks for your location only when tapped.
- **⋯ → Show List Only** switches to a full-screen list (**Show Map** goes back). Remembered.
- **Resize** by dragging the grabber on the phone sheet (or tap it to cycle three heights), or the divider on desktop.
- **⋯ → Sync with My Maps** adds new pins and removes pins you deleted there (**Undo** brings them back). Pins still on the map pick up their new position, layer and colour (unless their category has its own), and keep everything you've edited.
- **One pin per place.** A place saved twice on the map (same name, within 150 m) comes in once; a chain's branches further apart stay separate. A pin you added in the app for the same place becomes the map's pin, keeping its steps, areas, note and links.
- **Renaming a pin in My Maps** counts as delete + add: the old one (with its notes) goes, the new one comes in.
- **Remove place** on a My Maps pin hides it from every sync, even though it's still on the My Map (the app can't edit the map itself). **Undo** brings it straight back.
- **Hidden pins** (**Manage → Content → My Maps layers**) lists them; tap one to show it again. A hidden pin you then delete from the My Map drops off the list, so adding it there again brings it back.
- **The foot of the list** shows when it last synced and how many pins came from My Maps.

## Areas and categories

- A **category** is *what* a place is (coffee, sights, food). Names always show in lower case, even when a My Maps layer is capitalised ("Stations" → stations); the stored name doesn't change.
- An **area** is *where* it is (Gion, a neighbourhood you name). A place can be in several areas.

**Managing areas** (all on the Map):

- **Add** — *⋯ → New Area*.
- **Assign places** — from a place's card.
- **Rename, delete, or merge duplicates** — *⋯ → Edit Areas*.
- **Show one area** — tap its icon; tap the rest of the row to fold it.

**Areas on a day.** Add an area on a day's page and all its places appear on that day's map (faded). It's a live link, so later edits show up. Its row's ⋯ (or a long-press) adds its places to the plan or removes it from the day. The day offers areas from its own city — a day trip gets its town's areas.

**What else areas show:**

- A faint labelled ring on the map when zoomed out.
- How far the area stretches on foot ("Spans 0.9 km · 12 min walk").
- Each place's nearest station, read from the map tiles (with a network fallback). Nothing shows if there's no station within 1 km.

### Suggest areas

When unassigned places sit close together, **⋯ → Suggest Areas** appears. Nothing is saved until you tap Create.

- **Each group is a day out.** Places within about a 45 minute walk always share an area, in any city.
- **Each city is grouped on its own**, never across two stays, into about as many areas as you spend days there. A spread-out city's areas grow up to a day by local transport (10 km across) to fit; a compact one isn't lumped together just to hit the count.
- **Places with no city yet** are only grouped at walking size.
- **New groups** are named after their neighbourhood. Rename, untick or drop places before saving.
- **A loose place that fits an existing area** is offered to it as "Add to …" instead of starting a new one.
- **Existing areas** only ever gain places — nothing is renamed or taken out.

### Neighbourhoods preview

*⋯ → Neighbourhoods* sorts your places into the neighbourhoods OpenStreetMap puts them in, city by city — to compare with the areas you made yourself. It only reads your places — it never changes your areas.

- **Areas vs neighbourhoods** — areas are yours (you name them and pick their places); neighbourhoods are the official names, worked out for you.
- A neighbourhood with 3 or more places is its own group; smaller ones join their district, then their ward or city.
- Names come from OpenStreetMap, looked up once per place (about one a second) and kept on the device. The lookup keeps going while the app is open, even after you leave the page.
- **Search** neighbourhoods and places, and sort by **Most places** or **A–Z**.
- **Group the Map by neighbourhood** — the switch at the top (or *⋯ → Group by Neighbourhood* on the Map) makes the Map list and its outlines use neighbourhoods instead of your areas. Switch back any time.
- **Your areas are never changed by it.** A place keeps the areas you gave it, and its card's Areas row still edits them; switching back shows every area exactly as you left it.
- While grouped by neighbourhood, *New Area*, *Suggest Areas* and *Edit Areas* are put away, and places not looked up yet sit under *No area*. A day's Areas still use your own areas.
- Open a neighbourhood to see its places; a place shows its area only when that's named differently. Tap a place to see it on the Map.
- Under each city: how many neighbourhoods it has, how many areas you made, and how many places aren't in one.

## Logbook

The reference drawer: stays · journeys · luggage · documents · emergency numbers · packing · stamps · expenses · scratchpad, plus any lists you add. Each row shows a count, progress ("3/8") or a total.

Text isn't selectable (as in a native app), so values you might paste elsewhere have a **copy** icon.

### Stays and journeys

- Each list has an **Add a stay** / **Add a journey** row at the foot. The new one opens on its own page to fill in.
- Stays are listed in the order you sleep in them, with their check-in to check-out dates and nights under the name (a stay no base uses yet goes last); journeys are listed by when they leave.
- A stay's page opens with the same four buttons every time, as a contact card does: **Directions** (Google Maps, from where you are), **Call**, **Website** and **Share**.
- **Share** sends its name, address (the local one when set) and pin.
- Call and Website stay grey until the stay has a detail named Phone / Website (or a value that's a phone number or a link).

### Documents

Tap a document to open its page: name it, attach PDFs or photos, add fields and a note.

- **Icons** come from the name: a flight shows a plane, insurance a shield, a QR code or ticket a ticket, a hotel booking a bed, a passport or visa a person. Anything else is a plain page.
- **Emergency** contacts show the name with the number under it, as Phone's favourites do, with an icon from the name: police, ambulance / fire, embassy. Anything else is a phone.
- **Add a field** (also a stay's details and Emergency contacts) opens the new field ready to type. Leave both its name and value blank and it goes away.
- **Signed in** — files go to your account (private to the trip, 25 MB each), or to a shared Google Drive folder if set up. Drive needs its own **Connect Google Drive** tap, which lasts about an hour.
- **On this device only** — files stay on the device, and upload automatically once you sign in.
- **Opening** a file shows it inside the app, like Quick Look: PDFs page by page, photos full width. Double-tap or pinch to zoom; **Share** saves or sends it on.
- **Photos** show a preview under their name, from the copy on the device when there is one.
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

Open it from your account picture (or the foot of the sidebar on a wide screen). It starts with your account — who's signed in, sync status, Sign out or **Sign in with Google** — then a Settings-style list: **Trips**, **Setup**, **Content**, **Look**, **Sharing**, and **Help** and **Refresh** at the bottom.

### Setup

- **Dates** — on a trip with no days yet, set the start and end directly. Once it has days, moving either date slides the whole itinerary — Undo puts it back.
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

**Notes** edit in place and show their formatting as you type, like Apple Notes. The toolbar above a note:

| Button | What it does |
| --- | --- |
| **Aa** | Title / Heading / Subheading / Body, bold, italic, underline, strikethrough, and five text colours |
| Checklist · bullets · numbers | Lists; indent nests them |
| Callout | A tinted box to make one line stand out |
| ☺ | A short set of travel emoji (the keyboard has the rest) |
| Link | Add a link, or remove the one under the cursor |
| **Done** | Save (tapping away saves too; Esc cancels) |

- Markdown typed by hand still works: `- ` starts a list, `## ` a heading, `> ` a callout, `[ ] ` a checklist item.
- A heading with anything under it gets a chevron that folds the section away. The fold is saved with the note.
- Checklist rings can be ticked without opening the editor.
- Bullets written straight under a numbered step nest under that step.
- Under the hood a note is still plain text (Markdown plus `{orange}…{/}` for colour and `{folded}` on a folded heading), so sync, backups and search are unchanged.

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
- **The database is missing a column** (a migration not applied yet) — the banner names the column and says retrying won't help until it's added. Run the missing migration, then **Retry now**.
- **A change the database can never accept** gets its own red banner until you dismiss it. A copy is kept on the device — nothing is dropped silently.

## Sharing and backups

All under **Manage → Sharing** unless noted.

| Option | What you get |
|---|---|
| **Download web page** | The whole trip as one `.html` file — itinerary, journeys, stays, places — that opens offline in any browser or prints to PDF. Keep **Include private details** off when sharing it (it hides door codes, booking refs and documents). Attachments are never included. |
| **Add to calendar (.ics)** | Every step and hop as calendar events. Exact times become timed events; loose ones ("Around 18:00") become all-day. Also available per day from the ⋯ beside the day's title (always with booking refs). Each step and hop also has a quick Google Calendar button. |
| **Download backup (.json)** | A complete, lossless copy of the trip, private details included — keep it somewhere safe. |
| **Restore from backup** (Manage → Trips) | Loads a backup as a **new** trip; never overwrites. Damaged, edited or newer-version files are refused. Attachments aren't inside backups. |

- On the iPhone, the web page and backup open the Share sheet — pick **Save to Files**. Android and desktop download them.

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
| **Weather** | A day keeps the last forecast it showed. |
| **Your location** | GPS works without data; the blue dot shows on saved maps. |
| **First visit ever** | A plain "you're offline" screen that retries on its own. |

**Manage → Trips → This device**

| Row | Shows |
|---|---|
| **Works offline** | *Ready* once the app is fully saved on the device. |
| **Save trip maps for offline** | Saves the area around every day, stay and place, the zoomed-out view of the whole trip, and the map's labels and icons for light and dark mode, with progress. Shows roughly how much it'll download — a few hundred MB for a multi-city trip, so do it on Wi-Fi. |
| **Trip maps ✓ Saved** | Replaces the save row once everything is saved. Add places later and it reads *Save N new places for offline* with the size of just those. |
| **Save attachments for offline** | Downloads every file not on the device yet; reads *On this device* when done. |
| **Install app** / **Add to Home Screen** | Installs, or shows the two iPhone steps. Reads *Installed* once done. |

## Troubleshooting

**Something looks out of date.** Pull down from the top of any page — it re-pulls the trip and picks up a new version of the app if there is one. Or **Manage → Refresh**.

**Is this device on the latest version?** The foot of **Manage** shows the version, commit and build date. Compare the commit with the one you pushed.

**Help** (bottom of Manage) answers the common "how do I…" questions:
- Questions are grouped by topic, with their own search. The app's main Search finds them too.
- Each answer opens on its own page: a line or two, a picture of the real screen with the part to tap ringed, then steps or short rows.
- **More in…** at the foot lists the topic's other questions.
- Content lives in `src/lib/help.ts`; the pictures are in `src/components/HelpPreview.tsx`.

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
TAVILY_API_KEY=<Tavily API key>
```

| Variable | Purpose |
|---|---|
| `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` | Accounts, sync and sharing. The URL must be the **full https URL**. |
| `VITE_PROTOMAPS_API_KEY` / `VITE_MAP_TILES_URL` | Map tiles — see [The map background](#the-map-background). |
| `VITE_GOOGLE_CLIENT_ID` | Google Drive for attachments. Without it, signed-in files go to the account's own storage. |
| `VITE_ORS_API_KEY` | Real walking routes. Free, no card, 2,000 requests/day from [openrouteservice.org](https://openrouteservice.org/dev/#/signup). Without it, walks use straight-line estimates. Requests are throttled and cached per device. |
| `TAVILY_API_KEY` | Tabelog links and Good to know, in `npm run dev` / `preview`. Free, no card, 1,000 searches/month from [tavily.com](https://app.tavily.com). Server-side only (no `VITE_` prefix), so it never reaches the bundle. In production it's a Worker secret — see [Deploy](#deploy). |

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
| The app itself | Service worker precache | Everything it runs on, ~6 MB: every screen, the sign-in library, MapLibre, the PDF viewer and its fonts and character maps (`/pdfjs/`). |
| Trip copy + unsent edits | IndexedDB (`mirror:*`, outbox) | Cleared on sign-out. |
| Attachments | IndexedDB (`file:*`) | Copies of cloud files are listed under `file-copies` and cleared on sign-out; device-only files are kept. |
| Map tiles, fonts, icons | `map-tiles`, `map-glyphs` caches | What you've browsed; capped, oldest dropped first. Server answers from Supabase are never cached — the trip copy covers offline. |
| Saved trip maps | `trip-maps:<trip id>` cache, one per trip | Never trimmed; dropped when the trip is gone from the account. |

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
2. In the **SQL Editor**, run every file in `supabase/migrations/` **in order** (`0001` → `0041`).
   - `0033` moves old day-trip text (getting there / back, last way back) into each day's notes — take a backup first.
   - `0035` drops the retired day columns. On an existing project, run it only once the build with it is live — an older build still writes `journey_id`, and its day saves would fail.
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

- A small Worker script ([`worker/index.ts`](worker/index.ts)) answers `/api/*` only — today `/api/tabelog` and `/api/place-facts`, the place lookups. Everything else is served as static files without touching it (`run_worker_first` in [`wrangler.jsonc`](wrangler.jsonc)).
- In `npm run dev` / `preview` the same handler runs as Vite middleware, so the lookup works locally too.
- The lookup searches with [Tavily](https://app.tavily.com) (Tabelog blocks requests from Cloudflare's servers, so it can't be read directly). Its key goes in **Worker → Settings → Variables and Secrets → Add → Secret**, named `TAVILY_API_KEY`. Takes effect without a rebuild.
- **Only signed-in accounts can use `/api/*`** — anyone else gets *Sign in to use this*, so strangers can't spend the Tavily searches. The app sends its sign-in with each call and the Worker checks it with Supabase ([`worker/auth.ts`](worker/auth.ts)). For that the Worker needs two more entries under **Variables and Secrets**, as plain text: `SUPABASE_URL` and `SUPABASE_ANON_KEY` (the same values as `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`). Without them every lookup is refused.
- `keep_vars` in `wrangler.jsonc` keeps those dashboard variables across deploys. Without it every push wiped them, and Good to know silently stopped looking anything up.
- In `npm run dev` the check uses `.env.local`'s Supabase values; `npm run dev:demo` skips it (no sign-in there).
- The public demo has no Worker script; there the Tabelog row just opens a search.

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

- Browsed tiles are cached as `map-tiles` (6,000 tiles); label fonts and icons as `map-glyphs` (`runtimeCaching` in [`vite.config.ts`](vite.config.ts)). No age limit.
- Saved trip maps ([`src/lib/offlineTiles.ts`](src/lib/offlineTiles.ts)) go in their own `trip-maps:<trip id>` cache, so browsing can never push them out. Both runtime rules fall back to it before the network.
- A save only downloads what isn't saved yet, and moves tiles already browsed over without the network. Its requests carry `?save=1` so the service worker doesn't keep a second copy.
- One trip's save caps at 4,000 street-level tiles plus 150 zoomed-out ones (~90 KB a tile).

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
worker/                 the Worker script — /api/* only (Tabelog link, Good to know)
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
