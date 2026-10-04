import type { IconName } from "@/components/Icon";
import type { Tone } from "./tones";

/**
 * The Help content — the iPhone User Guide idea: topics, short questions,
 * and an answer page for each that shows rather than tells. An answer is
 * one or two short lines (`a`), an optional picture of the real screen
 * (`preview`, drawn by `HelpPreview`), then `blocks` — rows behind a symbol,
 * or numbered steps. App search finds all of it.
 *
 * Text is inline markup only: `**bold**` for what's on screen, `*italic*`,
 * and `{icon}` for a button's symbol in the sentence ("tap {more}").
 */
export interface HelpItem {
  id: string;
  q: string;
  /** the answer's opening — a line or two */
  a: string;
  preview?: HelpPreview;
  blocks?: HelpBlock[];
  go?: { label: string; to: string };
}

/** one thing to know: a symbol, a short title and an optional line under it */
export interface HelpRow {
  icon: IconName;
  title: string;
  detail?: string;
}

/** a titled group of rows, or numbered steps */
export type HelpBlock = { title?: string; rows: HelpRow[] } | { title?: string; steps: string[] };

/** the pictures `HelpPreview` can draw */
export type HelpPreview =
  | "placeCard"
  | "syncStates"
  | "mapControls"
  | "stepRow"
  | "swipeDelete"
  | "rowMenu"
  | "keypad"
  | "searchButton"
  | "dayOrder"
  | "pastDays"
  | "fileOffline"
  | "areaCategory"
  | "warning";

export interface HelpTopic {
  id: string;
  title: string;
  icon: IconName;
  tone?: Tone;
  color?: string;
  items: HelpItem[];
}

/** markup off — "**Map**" and "{more}" read as "Map" and "" */
const plain = (s: string) => s.replace(/\*\*|\*|\{[a-z-]+\}/g, "").replace(/\s+/g, " ").trim();

/** everything an answer says, as plain text — for search */
export function helpText(i: HelpItem): string {
  const parts = [i.a];
  for (const b of i.blocks ?? []) {
    if (b.title) parts.push(b.title);
    if ("rows" in b) for (const r of b.rows) parts.push(r.title, r.detail ?? "");
    else parts.push(...b.steps);
  }
  return plain(parts.join(" "));
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
        a: "Until you're added you'll only see the **Demo** trip.",
        blocks: [
          {
            steps: [
              "Open the app and tap **Sign in with Google**.",
              "The trip's owner adds your email in **Manage → Sharing**.",
              "Pull down on Plan to refresh — the trip appears.",
            ],
          },
        ],
      },
      {
        id: "install",
        q: "How do I put it on my home screen?",
        a: "Once it's there it opens full screen, like any other app.",
        blocks: [
          {
            title: "iPhone",
            steps: ["Open the app in **Chrome**.", "Tap {share} **Share** in the address bar.", "Tap **Add to Home Screen**."],
          },
          {
            title: "Android",
            steps: ["Open the app in **Chrome**.", "Tap **Install app**, or ⋮ → **Add to Home screen**."],
          },
        ],
        go: { label: "Open This device", to: "/manage/trips" },
      },
      {
        id: "switch",
        q: "How do I switch to another trip?",
        a: "Tap the **trip name** at the top left and pick one.",
        blocks: [
          {
            rows: [
              { icon: "plus", title: "New trip", detail: "Manage → Trips" },
              { icon: "list", title: "Archive or delete a trip", detail: "Manage → Trips → the trip's {more}" },
            ],
          },
        ],
        go: { label: "Open Trips", to: "/manage/trips" },
      },
      {
        id: "demo",
        q: "What's the Demo trip?",
        a: "A read-only example trip to look around in.",
        blocks: [
          {
            rows: [
              { icon: "eye", title: "Look, don't edit", detail: "Nothing in it can be changed" },
              { icon: "trash", title: "Remove it any time", detail: "Manage → Trips — it can be added back there too" },
            ],
          },
        ],
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
        a: "Do this on **each phone**, on wifi.",
        blocks: [
          {
            steps: [
              "Install the app and open the trip once.",
              "In **Manage → Trips → This device**, check **Works offline** says *Ready*.",
              "Tap **Save trip maps for offline**.",
              "Tap **Save attachments for offline**.",
              "On the **Map**, tap {location} once and allow location.",
              "In **Manage → Sharing**, tap **Download backup** and keep the file safe.",
            ],
          },
        ],
        go: { label: "Open This device", to: "/manage/trips" },
      },
      {
        id: "offline",
        q: "Does it work with no signal?",
        a: "Yes. Once the trip has been opened on the phone, it all works offline.",
        blocks: [
          {
            title: "Works offline",
            rows: [
              { icon: "itinerary", title: "Plan, places and notes" },
              { icon: "vault", title: "Documents", detail: "Once they're saved to the phone" },
              { icon: "map", title: "Maps", detail: "The ones you've saved for offline" },
            ],
          },
          {
            title: "Good to know",
            rows: [
              { icon: "pencil", title: "Edits wait on the phone", detail: "And send when you're back online" },
              { icon: "clock", title: "Weak signal?", detail: "After 5 seconds it opens what's on the phone" },
              { icon: "person", title: "You stay signed in", detail: "Even with no signal for days" },
            ],
          },
        ],
      },
      {
        id: "status",
        q: "What do Saving, Offline and “Couldn't save” mean?",
        a: "The label at the top right shows where your edits are. Nothing is lost in any of these.",
        preview: "syncStates",
        blocks: [
          {
            rows: [
              { icon: "up", title: "Saving…", detail: "An edit is on its way" },
              { icon: "check", title: "Saved", detail: "It reached your account" },
              { icon: "cloud-down", title: "Offline", detail: "Edits are kept and sent later" },
              { icon: "alert", title: "Couldn't save — retrying", detail: "Tap it to see what's waiting, then **Retry now**" },
            ],
          },
        ],
      },
      {
        id: "today",
        q: "Where did the earlier days go?",
        a: "During the trip, Plan opens on **today**. Days already gone are in **Past days** at the bottom.",
        preview: "pastDays",
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
        a: "Dates follow the order of the days — move a day and the dates move with it.",
        preview: "dayOrder",
        blocks: [
          {
            steps: ["On **Plan**, hold {grip} beside the day.", "Drag it up or down.", "Let go — the dates shuffle to match."],
          },
          {
            rows: [{ icon: "pushpin", title: "Keep a day on its date", detail: "**Pin** it at the foot of its page — for a booked tour" }],
          },
        ],
      },
      {
        id: "base",
        q: "How do I add a day, or a new city?",
        a: "Both are at the foot of **Plan**.",
        blocks: [
          {
            rows: [
              { icon: "plus", title: "Add a day", detail: "Fills the first empty date, else goes after the last day" },
              { icon: "bed", title: "Add a base", detail: "A new city the day after the last one — then asks for its stay" },
              { icon: "calendar", title: "Days − / +", detail: "On a base's page: a shorter or longer stay, later days move with it" },
            ],
          },
        ],
      },
      {
        id: "tags",
        q: "Why can't I choose Arrive, Travel or Day trip?",
        a: "They're worked out for you.",
        blocks: [
          {
            rows: [
              { icon: "train", title: "Arrive, Travel, Depart", detail: "From a journey on that day" },
              { icon: "route", title: "Day trip", detail: "From **Make this a day trip** at the foot of the day" },
            ],
          },
        ],
      },
      {
        id: "step",
        q: "How do I add a time or a place to a step?",
        a: "The time is on the left of the step; its icon picks the place.",
        preview: "stepRow",
        blocks: [
          {
            title: "Time",
            steps: ["Tap {clock} on the left of the step.", "Turn the wheels.", "Tap **Done**."],
          },
          {
            title: "Place",
            steps: ["Tap the step's grey {pin} icon.", "Pick a place from the day's **Areas**."],
          },
          {
            rows: [
              { icon: "pencil", title: "A time range", detail: "Like *14:00–15:15* — type it" },
              { icon: "pin", title: "No places to pick?", detail: "Add an area further down the day first" },
              { icon: "info", title: "About the place", detail: "Tap the step's name for its place card" },
            ],
          },
        ],
      },
      {
        id: "facts",
        q: "What's Good to know?",
        a: "A quick summary of a place from guides and review sites — with its website.",
        preview: "placeCard",
        blocks: [
          {
            title: "Where to find it",
            rows: [
              { icon: "itinerary", title: "Plan", detail: "Tap a step's name" },
              { icon: "map", title: "Map", detail: "Tap a place" },
            ],
          },
          {
            title: "What it shows",
            rows: [
              { icon: "clock", title: "Hours and closed days" },
              { icon: "wallet", title: "Reservations, queue, price", detail: "Restaurants and cafés" },
              { icon: "ticket", title: "Tickets, crowds, entry", detail: "Sights" },
              { icon: "link", title: "Website", detail: "When the place has one" },
            ],
          },
          {
            title: "Keeping it current",
            rows: [
              { icon: "auto", title: "Fills in by itself", detail: "And refreshes every month" },
              { icon: "cloud-down", title: "Refresh", detail: "On the card — checks one place now" },
              { icon: "checklist", title: "Check every place", detail: "Manage → Content → Good to know" },
            ],
          },
        ],
        go: { label: "Open Content", to: "/manage/content" },
      },
      {
        id: "warn",
        q: "What does Overwhelming on a step mean?",
        a: "A heads-up that a place is busy or loud.",
        preview: "warning",
        blocks: [
          {
            rows: [
              { icon: "more", title: "Set it", detail: "With the switch on its place card" },
              { icon: "alert", title: "See how many", detail: "Plan shows the count for each day" },
            ],
          },
        ],
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
        a: "Tap {location} under the zoom buttons. GPS works without signal.",
        preview: "mapControls",
        blocks: [
          {
            rows: [
              { icon: "location", title: "Follow me", detail: "The blue dot is you; the map follows" },
              { icon: "map", title: "Stop following", detail: "Drag the map" },
              { icon: "locate", title: "Come back", detail: "Tap {location} again" },
            ],
          },
        ],
        go: { label: "Open the Map", to: "/map" },
      },
      {
        id: "pois",
        q: "Can I see only our own places?",
        a: "Yes — hide the map's own shops, stations and parks.",
        blocks: [
          {
            steps: ["On the **Map**, tap **Filters**.", "Under **Map**, turn **Points of interest** off."],
          },
        ],
        go: { label: "Open the Map", to: "/map" },
      },
      {
        id: "area",
        q: "What's an Area, and how is it different from a category?",
        a: "A category is *what* a place is. An Area is *where* it is.",
        preview: "areaCategory",
        blocks: [
          {
            rows: [{ icon: "calendar", title: "Add an Area to a day", detail: "All its places land on that day's map" }],
          },
        ],
      },
      {
        id: "city",
        q: "Why is a place under the wrong city?",
        a: "Places go to the nearest stay within about 60 km.",
        blocks: [
          {
            steps: ["Open the place's card.", "Set **City**."],
          },
        ],
      },
      {
        id: "sync",
        q: "I deleted a pin and it came back.",
        a: "It's still on the Google My Map, so **Sync** brings it back.",
        blocks: [
          {
            steps: ["Delete the pin in **Google My Maps**.", "Back in the app, tap **Sync**."],
          },
        ],
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
        a: "In **Logbook → Documents** — a PDF or a photo, with its details underneath.",
        blocks: [
          {
            steps: ["Open **Logbook → Documents**.", "Open a document, or add one.", "Tap **Attach a file**.", "Add fields like a booking number underneath."],
          },
        ],
        go: { label: "Open Documents", to: "/logbook/documents" },
      },
      {
        id: "offline",
        q: "Will files open without signal?",
        a: "Yes, once they're saved on the phone. {cloud-down} beside a file means it isn't yet.",
        preview: "fileOffline",
        blocks: [
          {
            steps: ["Open **Manage → Trips → This device**.", "Tap **Save attachments for offline**."],
          },
        ],
        go: { label: "Open This device", to: "/manage/trips" },
      },
      {
        id: "share",
        q: "How do I send a file or save it to my phone?",
        a: "Open the file, then tap {share} **Share** at the top right.",
        blocks: [
          {
            rows: [
              { icon: "download", title: "Save to Files" },
              { icon: "copy", title: "Print" },
              { icon: "share", title: "Send it on" },
            ],
          },
        ],
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
        a: "On the day's page, under **Spending**.",
        preview: "keypad",
        blocks: [
          {
            steps: ["Tap **Add an amount**.", "Pick what it was for.", "Type the amount on the keypad."],
          },
          {
            rows: [{ icon: "wallet", title: "Another currency?", detail: "Tap the currency on the keypad" }],
          },
        ],
      },
      {
        id: "total",
        q: "Where's the total for the whole trip?",
        a: "In **Logbook → Expenses** — stays, fares and day spending, by category.",
        blocks: [
          {
            rows: [{ icon: "list", title: "See every amount", detail: "Tap a category" }],
          },
        ],
        go: { label: "Open Expenses", to: "/logbook/budget" },
      },
      {
        id: "combined",
        q: "What does “Combined” mean?",
        a: "With more than one currency, **Combined** turns everything into the trip's main currency at today's rate, and adds it up.",
      },
      {
        id: "modes",
        q: "How do train fares end up under “Train”?",
        a: "A category can claim travel modes. Fares by those modes go there; the rest go to **Transport**.",
        blocks: [
          {
            steps: ["Open **Manage → Setup → Expense categories**.", "Open a category and pick its travel modes."],
          },
        ],
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
        a: "Just **tap the text** — there's no edit mode.",
        blocks: [
          {
            rows: [
              { icon: "pencil", title: "Text", detail: "Tap it and type" },
              { icon: "calendar", title: "Dates and times", detail: "Open a picker" },
              { icon: "wallet", title: "Prices", detail: "Open a keypad" },
            ],
          },
        ],
      },
      {
        id: "menu",
        q: "Where are the options for a row?",
        a: "Tap its {more}, or **press and hold** the row.",
        preview: "rowMenu",
        blocks: [
          {
            rows: [{ icon: "settings", title: "On a computer", detail: "Right-click the row" }],
          },
        ],
      },
      {
        id: "delete",
        q: "How do I delete something — and undo it?",
        a: "An **Undo** bar shows for a few seconds after every delete.",
        preview: "swipeDelete",
        blocks: [
          {
            rows: [
              { icon: "back", title: "iPhone and Android", detail: "Swipe the row left" },
              { icon: "close", title: "Computer", detail: "The {close} or the row's {more}" },
            ],
          },
        ],
      },
      {
        id: "restore",
        q: "I deleted something important. Can I get it back?",
        a: "Usually, yes. Try these in order.",
        blocks: [
          {
            steps: [
              "Tap **Undo**, if the bar is still showing.",
              "In **Manage → Sharing → Data safety**, pick a restore point — from the last few edits, or from before each delete.",
              "For a whole trip, use **Recently deleted** there — it keeps trips for 90 days.",
            ],
          },
        ],
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
        a: "Yes. Changes show on the other phone within a second or two.",
        blocks: [
          {
            rows: [{ icon: "copy", title: "Editing the same thing at once?", detail: "The changes are merged — neither wipes out the other" }],
          },
        ],
      },
      {
        id: "copy",
        q: "How do I share the plan with someone not on the app?",
        a: "Download it as one web page that opens in any browser, or prints to PDF.",
        blocks: [
          {
            steps: ["Open **Manage → Sharing**.", "Tap **Download web page**."],
          },
          {
            rows: [{ icon: "eye-off", title: "Include private details", detail: "Leave it off to hide door codes and booking numbers" }],
          },
        ],
        go: { label: "Open Sharing", to: "/manage/sharing" },
      },
      {
        id: "search",
        q: "How do I find something fast?",
        a: "Tap {search} beside the tabs. It looks through everything.",
        preview: "searchButton",
        blocks: [
          {
            rows: [
              { icon: "list", title: "Everything", detail: "Notes, steps, addresses, booking numbers, files" },
              { icon: "check", title: "Forgiving", detail: "Words in any order; accents don't matter" },
            ],
          },
        ],
      },
      {
        id: "version",
        q: "Is my phone on the latest version?",
        a: "The foot of **Manage** shows the version and build.",
        blocks: [
          {
            rows: [{ icon: "download", title: "Get the newest", detail: "Close the app and open it again" }],
          },
        ],
      },
    ],
  },
];

/** "topic/item" — the answer's address under `/help/` */
export const helpKey = (t: HelpTopic, i: HelpItem) => `${t.id}/${i.id}`;
