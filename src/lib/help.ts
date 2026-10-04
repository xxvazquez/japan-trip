import type { IconName } from "@/components/Icon";
import type { Tone } from "./tones";

/**
 * The Help page's content — the iPhone User Guide idea: topics, short
 * questions, answers you can scan. Answers are light Markdown (bold for what's
 * on screen, numbered steps for how-tos). `go` adds a row that opens the
 * place the answer is about. App search finds these too.
 */
export interface HelpItem {
  id: string;
  q: string;
  /** the answer — a line or two of light Markdown, above any `blocks` */
  a: string;
  /** the rest of the answer as something to look at rather than read */
  blocks?: HelpBlock[];
  go?: { label: string; to: string };
}

/** one thing to know, as a Settings-style row: a coloured tile, a short
 *  title and an optional line under it */
export interface HelpRow {
  icon: IconName;
  tone?: Tone;
  title: string;
  detail?: string;
}

/** a titled group of rows, or numbered steps (inline Markdown each) */
export type HelpBlock = { title?: string; rows: HelpRow[] } | { title?: string; steps: string[] };

/** everything an answer says, as plain text — for search */
export function helpText(i: HelpItem): string {
  const parts = [i.a];
  for (const b of i.blocks ?? []) {
    if (b.title) parts.push(b.title);
    if ("rows" in b) for (const r of b.rows) parts.push(r.title, r.detail ?? "");
    else parts.push(...b.steps);
  }
  return parts.join(" ").replace(/\*\*|[*_`#>]/g, "").replace(/^\s*(\d+\.|-)\s+/gm, "");
}
export interface HelpTopic {
  id: string;
  title: string;
  icon: IconName;
  tone?: Tone;
  color?: string;
  items: HelpItem[];
}

export const HELP: HelpTopic[] = [
  {
    id: "start",
    title: "Getting started",
    icon: "person",
    tone: "accent",
    items: [
      {
        id: "join",
        q: "How do I get onto our trip?",
        a: `1. Open the app and **Sign in with Google**.
2. The trip's owner adds your email in **Manage → Sharing**.
3. Pull down to refresh — the trip appears.

Until you're added you'll only see the **Demo** trip.`,
      },
      {
        id: "install",
        q: "How do I put it on my home screen?",
        a: `- **iPhone (Chrome):** **Share** in the address bar → **Add to Home Screen**.
- **Android (Chrome):** **Install app**, or ⋮ → **Add to Home screen**.

It then opens full screen, like any other app.`,
        go: { label: "Open This device", to: "/manage/trips" },
      },
      {
        id: "switch",
        q: "How do I switch to another trip?",
        a: `Tap the **trip name** at the top left and pick one. **Manage → Trips** creates, archives and deletes trips.`,
      },
      {
        id: "demo",
        q: "What's the Demo trip?",
        a: `A read-only example to look around in. Delete it from **Manage → Trips** whenever you like — it can be added back from there too.`,
      },
    ],
  },
  {
    id: "travel",
    title: "Before & during the trip",
    icon: "plane",
    tone: "ai",
    items: [
      {
        id: "checklist",
        q: "What should we do before we leave?",
        a: `On **each phone**, on wifi:`,
        blocks: [
          {
            steps: [
              "Install the app and open the trip once.",
              "**Manage → Trips → This device** — check **Works offline** says *Ready*.",
              "Tap **Save trip maps for offline**.",
              "Tap **Save attachments for offline**.",
              "On the **Map**, tap the location arrow once and allow it.",
              "**Manage → Sharing → Download backup**, and keep the file safe.",
            ],
          },
        ],
        go: { label: "Open This device", to: "/manage/trips" },
      },
      {
        id: "offline",
        q: "Does it work with no signal?",
        a: `Yes. Once the trip has been opened on the phone, everything opens offline — the plan, places, documents and the maps you've saved.

- **Edits** wait on the phone and send when you're back online.
- **Weak signal?** After 5 seconds it opens what's on the phone and updates when it gets through.
- You **stay signed in** with no signal, even for days.`,
      },
      {
        id: "status",
        q: "What do Saving, Offline and “Couldn't save” mean?",
        a: `The label at the top right:

- **Saving…** — an edit is on its way.
- **Saved** — it reached your account.
- **Offline** — no connection; edits are kept and sent later.
- **Couldn't save — retrying** — tap it to see what's waiting and **Retry now**.

Nothing is lost in any of these.`,
      },
      {
        id: "today",
        q: "Where did the earlier days go?",
        a: `During the trip Plan opens on **today**. Days already gone are in **Past days** at the bottom — tap it to open them.`,
      },
    ],
  },
  {
    id: "plan",
    title: "Plan & days",
    icon: "calendar",
    tone: "matcha",
    items: [
      {
        id: "dates",
        q: "How do I change a day's date?",
        a: `Dates follow the order of the days — **drag the day** up or down on Plan and the dates shuffle with it. A day that must stay on its date (a booked tour) can be **pinned** from the foot of its page.`,
      },
      {
        id: "base",
        q: "How do I add a day, or a new city?",
        a: `- **Add a day** (foot of Plan) fills the first empty date, else goes after the last day.
- **Add a base** starts a new city the day after the last one, then asks for its stay.
- **Days − / +** on a base's page makes that stay shorter or longer; later days move with it.`,
      },
      {
        id: "tags",
        q: "Why can't I choose Arrive, Travel or Day trip?",
        a: `They're worked out for you: a journey on the day makes it **Arrive**, **Travel** or **Depart**. **Day trip** comes from **Make this a day trip** at the foot of the day.`,
      },
      {
        id: "step",
        q: "How do I add a time or a place to a step?",
        a: `- **Time:** tap the small clock → turn the wheels → **Done**. Ranges like *14:00–15:15* can be typed.
- **Place:** tap the grey pin and pick from the day's **Areas**. Add an area further down the day first if the list is empty.`,
      },
      {
        id: "facts",
        q: "What's Good to know?",
        a: `A quick summary of a place from guides and review sites, with its website.`,
        blocks: [
          {
            title: "Where to find it",
            rows: [
              { icon: "itinerary", tone: "accent", title: "Plan", detail: "Tap a step's icon" },
              { icon: "map", tone: "matcha", title: "Map", detail: "Tap a place" },
            ],
          },
          {
            title: "What it shows",
            rows: [
              { icon: "clock", tone: "gold", title: "Hours and closed days" },
              { icon: "wallet", tone: "gold", title: "Reservations, queue, price", detail: "Restaurants and cafés" },
              { icon: "ticket", tone: "ai", title: "Tickets, crowds, entry", detail: "Sights" },
              { icon: "link", tone: "accent", title: "Website", detail: "When the place has one" },
            ],
          },
          {
            title: "Keeping it current",
            rows: [
              { icon: "auto", tone: "matcha", title: "Fills in by itself", detail: "And refreshes every month" },
              { icon: "cloud-down", tone: "accent", title: "Refresh", detail: "On the card — checks one place now" },
              { icon: "checklist", tone: "ink-faint", title: "Check every place", detail: "Manage → Content → Good to know" },
            ],
          },
        ],
        go: { label: "Open Content", to: "/manage/content" },
      },
      {
        id: "warn",
        q: "What does the ⚠ on a step mean?",
        a: `It's marked **overwhelming** — a heads-up that a place is busy or loud. Set it from the step's **⋯**. Plan shows how many a day has.`,
      },
    ],
  },
  {
    id: "map",
    title: "Map",
    icon: "map",
    tone: "accent",
    items: [
      {
        id: "where",
        q: "How do I see where I am?",
        a: `Tap the **arrow** under the zoom buttons. The blue dot shows where you are and the map follows you; drag the map to stop following, tap the arrow to come back. GPS works without signal.`,
        go: { label: "Open the Map", to: "/map" },
      },
      {
        id: "pois",
        q: "Can I see only our own places?",
        a: `Yes — **Filters → Map → Points of interest** off hides the map's own shops, stations and parks. Turn it back on to see everything.`,
        go: { label: "Open the Map", to: "/map" },
      },
      {
        id: "area",
        q: "What's an Area, and how is it different from a category?",
        a: `- A **category** is *what* a place is — coffee, a sight, food.
- An **Area** is *where* it is — a neighbourhood you name.

Add an Area to a day and all its places land on that day's map.`,
      },
      {
        id: "city",
        q: "Why is a place under the wrong city?",
        a: `Places go to the nearest stay within about 60 km. To change it, open the place's card and set **City**.`,
      },
      {
        id: "sync",
        q: "I deleted a pin and it came back.",
        a: `It's still on the Google My Map, so **Sync** brings it back. Delete it in My Maps instead, then Sync.`,
      },
    ],
  },
  {
    id: "docs",
    title: "Documents & files",
    icon: "vault",
    tone: "gold",
    items: [
      {
        id: "where",
        q: "Where do tickets and bookings go?",
        a: `**Logbook → Documents** → a document → **Attach a file** (PDF or photo). Add fields like a booking number underneath.`,
        go: { label: "Open Documents", to: "/logbook/documents" },
      },
      {
        id: "offline",
        q: "Will files open without signal?",
        a: `Yes, once they're on the phone. A **cloud with an arrow** beside a file means it isn't yet — tap **Save attachments for offline** in **Manage → Trips → This device** to get them all.`,
        go: { label: "Open This device", to: "/manage/trips" },
      },
      {
        id: "share",
        q: "How do I send a file or save it to my phone?",
        a: `Open the file, then tap **Share** (top right) — save it to Files, print it, or send it on.`,
      },
    ],
  },
  {
    id: "money",
    title: "Money",
    icon: "wallet",
    tone: "gold",
    items: [
      {
        id: "spend",
        q: "How do I note what we spent?",
        a: `On the day: **Spending → Add an amount**, pick what it was for, then type the amount on the keypad. The currency button on the keypad switches currency.`,
      },
      {
        id: "total",
        q: "Where's the total for the whole trip?",
        a: `**Logbook → Expenses** — stays, fares and day spending by category. Tap a category to see every amount in it.`,
        go: { label: "Open Expenses", to: "/logbook/budget" },
      },
      {
        id: "combined",
        q: "What does “Combined” mean?",
        a: `With more than one currency, **Combined** converts everything into the trip's main currency at today's rate and adds it up.`,
      },
      {
        id: "modes",
        q: "How do train fares end up under “Train”?",
        a: `A category can claim travel modes in **Manage → Setup → Expense categories**. Any fare by that mode goes there automatically; the rest go to **Transport**.`,
      },
    ],
  },
  {
    id: "edit",
    title: "Editing & undo",
    icon: "pencil",
    tone: "ink-faint",
    items: [
      {
        id: "edit",
        q: "How do I edit something?",
        a: `Just **tap the text** — there's no edit mode. Dates and times open pickers, prices open a keypad.`,
      },
      {
        id: "menu",
        q: "Where are the options for a row?",
        a: `Tap its **⋯**, or **press and hold** the row (right-click on a computer).`,
      },
      {
        id: "delete",
        q: "How do I delete something — and undo it?",
        a: `- **iPhone / Android:** swipe the row left.
- **Computer:** the ✕ or the row's **⋯**.

An **Undo** bar shows for a few seconds after.`,
      },
      {
        id: "restore",
        q: "I deleted something important. Can I get it back?",
        a: `Usually, yes:

1. **Undo** right away, if the bar is still showing.
2. **Manage → Sharing → Data safety** — restore points from the last few edits and from before every delete.
3. **Recently deleted** there brings back whole trips for 90 days.`,
        go: { label: "Open Sharing", to: "/manage/sharing" },
      },
    ],
  },
  {
    id: "share",
    title: "Sharing & search",
    icon: "search",
    tone: "ai",
    items: [
      {
        id: "together",
        q: "Can we both edit at the same time?",
        a: `Yes. Changes show on the other phone within a second or two. If you both edit at the same moment, the changes are merged rather than one wiping out the other.`,
      },
      {
        id: "copy",
        q: "How do I share the plan with someone not on the app?",
        a: `**Manage → Sharing → Download web page** — one file that opens in any browser or prints to PDF. Leave **Include private details** off to hide door codes and booking numbers.`,
        go: { label: "Open Sharing", to: "/manage/sharing" },
      },
      {
        id: "search",
        q: "How do I find something fast?",
        a: `Tap **Search** (the round button by the tabs). It looks through everything — notes, steps, addresses, booking numbers, files. Words can be in any order, and accents don't matter.`,
      },
      {
        id: "version",
        q: "Is my phone on the latest version?",
        a: `The foot of **Manage** shows the version and build. Close and reopen the app to pick up a new one.`,
      },
    ],
  },
];

/** "topic/item" — the id used in links (`/help?open=…`) */
export const helpKey = (t: HelpTopic, i: HelpItem) => `${t.id}/${i.id}`;
