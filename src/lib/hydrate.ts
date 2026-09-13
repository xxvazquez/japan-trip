import { THEME_PRESETS } from "./themePresets";
import { mapUrlCoords } from "./maps";
import type { Day, Doc, DocField, ExpenseCategory, Hotel, ModuleConfig, PlanItem, ThemeTokens, TripData } from "@/core/types";

/** current TripData shape version — templates, db loads and normalize all agree on this */
export const SCHEMA_VERSION = 9;

/** Seed expense categories for a new trip. `role: "transport"` is the catch-all
 *  for any fare whose mode isn't claimed below (ferry, car, walk, or a manual
 *  journey total with no mode at all); `role: "lodging"` collects stay prices.
 *  Train / Metro & Bus / Flights / Taxi claim their own modes so a trip's
 *  transport spending doesn't land in one lump. All editable in Manage
 *  afterwards — rename, reassign modes, add, remove. */
export const DEFAULT_EXPENSE_CATEGORIES: ExpenseCategory[] = [
  { id: "cat-food", label: "Food & drink" },
  { id: "cat-train", label: "Train", modes: ["train"] },
  { id: "cat-metrobus", label: "Metro & Bus", modes: ["subway", "bus"] },
  { id: "cat-flights", label: "Flights", modes: ["flight"] },
  { id: "cat-taxi", label: "Taxi", modes: ["taxi"] },
  { id: "cat-transport", label: "Transport", role: "transport" },
  { id: "cat-lodging", label: "Accommodation", role: "lodging" },
  { id: "cat-activities", label: "Activities" },
  { id: "cat-shopping", label: "Shopping" },
  { id: "cat-other", label: "Other" },
];

const fieldId = () =>
  (globalThis.crypto?.randomUUID?.() ?? `f-${Math.random().toString(36).slice(2, 10)}`);

/** Legacy spending rows carried only a free-text label. Best-effort match it to
 *  one of the trip's categories by keyword so the Expenses grouping isn't all
 *  one bucket — the original text stays on the row as its note. Returns an
 *  "other"-ish category when nothing matches, undefined only if the list is
 *  somehow empty. */
function guessCategoryId(label: string, cats: ExpenseCategory[]): string | undefined {
  const t = label.toLowerCase();
  const has = (...w: string[]) => w.some((x) => t.includes(x));
  const byLabel = (re: RegExp, role?: ExpenseCategory["role"]) =>
    cats.find((c) => (role && c.role === role) || re.test(c.label.toLowerCase()))?.id;

  if (has("lunch", "dinner", "breakfast", "brunch", "food", "cafe", "café", "coffee", "restaurant", "meal", "snack", "drink", "bar", "izakaya", "bakery"))
    return byLabel(/food|drink|eat|meal/) ?? fallbackCategoryId(cats);
  if (has("train", "metro", "subway", "bus", "taxi", "fare", "transit", "shinkansen", "suica", "pasmo", "uber", "tram", "ferry", "flight"))
    return byLabel(/transport|travel|getting/, "transport") ?? fallbackCategoryId(cats);
  if (has("hotel", "hostel", "ryokan", "airbnb", "lodging", "accommodation", "guesthouse"))
    return byLabel(/accommodation|lodging|stay|hotel/, "lodging") ?? fallbackCategoryId(cats);
  if (has("museum", "entry", "tour", "admission", "onsen", "temple", "shrine", "activity", "experience", "show", "concert", "ticket"))
    return byLabel(/activit|thing|see|do/) ?? fallbackCategoryId(cats);
  if (has("shop", "souvenir", "gift", "store", "market", "clothes"))
    return byLabel(/shop/) ?? fallbackCategoryId(cats);
  return fallbackCategoryId(cats);
}

/** The sensible default category when a row has none to match — an "Other"/
 *  "Misc" one if there is one, else any category with no fixed role, else
 *  just the last category. Also reused by the Manage panel so deleting a
 *  category can reassign its spending instead of leaving it uncategorised. */
export const fallbackCategoryId = (cats: ExpenseCategory[]): string | undefined =>
  (cats.find((c) => /other|misc/.test(c.label.toLowerCase())) ?? cats.find((c) => !c.role) ?? cats[cats.length - 1])?.id;

const today = () => new Date().toISOString().slice(0, 10);

const DEFAULT_MODULES: ModuleConfig[] = [
  { id: "plan", kind: "plan", label: "Plan", icon: "itinerary", enabled: true },
  { id: "map", kind: "map", label: "Map", icon: "map", enabled: true },
  { id: "logbook", kind: "logbook", label: "Logbook", icon: "vault", enabled: true },
];

const ENTITY_KEYS = ["legs", "days", "hotels", "journeys", "luggage", "packing", "docs", "places", "areas"] as const;

function fixTheme(t: Partial<ThemeTokens> | undefined): ThemeTokens {
  const base = THEME_PRESETS[0].tokens;
  return {
    light: { ...base.light, ...(t?.light ?? {}) },
    dark: { ...base.dark, ...(t?.dark ?? {}) },
  };
}

/**
 * Backfill anything a loaded trip is missing so the UI can't crash on partial
 * data — an older seed, a trip written before a field existed, a half-synced
 * row. Never overwrites values that are present.
 */
export function normalizeTrip<T extends Partial<TripData>>(data: T | null | undefined): T {
  const d = (data ?? {}) as Record<string, unknown> & Partial<TripData>;
  const cfg = (d.config ?? {}) as Record<string, unknown>;
  const meta = (d.meta ?? {}) as Record<string, unknown>;

  d.v = typeof d.v === "number" ? d.v : SCHEMA_VERSION;

  d.config = {
    branding: "",
    tagline: "",
    locale: "en-GB",
    homeTimeZone: "UTC",
    tripTimeZone: "UTC",
    travellers: "",
    themePreset: THEME_PRESETS[0].id,
    ...cfg,
    people: Array.isArray(cfg.people) ? (cfg.people as TripData["config"]["people"]) : [],
    expenseCategories:
      Array.isArray(cfg.expenseCategories) && (cfg.expenseCategories as unknown[]).length
        ? (cfg.expenseCategories as ExpenseCategory[]).map((c) => ({
            id: c.id || `cat-${fieldId()}`,
            label: c.label ?? "",
            ...(c.role ? { role: c.role } : {}),
            ...(Array.isArray(c.modes) && c.modes.length ? { modes: c.modes } : {}),
            ...(c.icon ? { icon: c.icon } : {}),
          }))
        : DEFAULT_EXPENSE_CATEGORIES.map((c) => ({ ...c })),
    theme: fixTheme(cfg.theme as Partial<ThemeTokens> | undefined),
    modules:
      Array.isArray(cfg.modules) && (cfg.modules as unknown[]).length
        ? (cfg.modules as ModuleConfig[])
        : DEFAULT_MODULES,
  } as TripData["config"];

  // currencies: the ordered list drives the per-row picker; `currency` (the
  // bare-number assumption used all over) is kept as its first entry. Older
  // trips only have `currency` — seed the list from it.
  const ccy = [
    ...(typeof cfg.currency === "string" ? [cfg.currency] : []),
    ...(Array.isArray(cfg.currencies) ? (cfg.currencies as unknown[]) : []),
  ].map((c) => String(c).trim().toUpperCase()).filter(Boolean);
  d.config.currencies = [...new Set(ccy)];
  d.config.currency = d.config.currencies[0] || undefined;

  // one-time: move trips off a retired preset (or nothing set) onto Ink & Moss
  // — the app default. A live named preset or a hand-tuned "custom" palette is a
  // deliberate choice and left alone.
  const RETIRED_PRESETS = ["mist", "paper", "olive", "rosewood", "indigo"];
  if (!cfg.themePreset || RETIRED_PRESETS.includes(cfg.themePreset as string)) {
    d.config.themePreset = "ink-moss";
    d.config.theme = structuredClone(THEME_PRESETS[0].tokens);
  }

  // early trips stored the Map tab's icon as "places" (a house glyph, since
  // removed) — never a deliberate choice and there's no UI to change it, so
  // pin it to the map glyph on load
  for (const m of d.config.modules) {
    if (m.kind === "map" && m.icon === "places") m.icon = "map";
  }

  // four of the five presets' light `gold` were too pale to clear WCAG's 3:1
  // non-text contrast against their own bg — it's the keyboard focus ring's
  // only colour. Remap the known old values to the darker ones now in
  // themePresets.ts; a hand-picked custom gold (Settings → Theme → every
  // colour) never matches these exactly, so it's left alone.
  const GOLD_FIX: Record<string, string> = {
    "#9a8f7a": "#8f8571", // mist
    "#9d8a4e": "#94824a", // olive
    "#8f8570": "#8c826e", // indigo
    "#9c8a73": "#93826c", // rosewood
  };
  const goldNow = d.config.theme.light.gold?.toLowerCase();
  if (goldNow && goldNow in GOLD_FIX) d.config.theme.light.gold = GOLD_FIX[goldNow];

  // Mist's light ink / ink-soft / ink-faint / line had drifted from the values
  // in index.css they're supposed to mirror exactly — ink-faint measured
  // 2.80:1 against its own bg, under WCAG's 3:1 non-text minimum. Remap the
  // known old values to the current ones; a hand-picked custom colour never
  // matches these exactly, so it's left alone.
  const INK_FIX: Record<"ink" | "ink-soft" | "ink-faint" | "line", Record<string, string>> = {
    ink: { "#1e252b": "#1a2026" },
    "ink-soft": { "#4c565d": "#3d474f" },
    "ink-faint": { "#8b949c": "#747e86" },
    line: { "#dbe0e5": "#d2d8de" },
  };
  for (const key of ["ink", "ink-soft", "ink-faint", "line"] as const) {
    const now = d.config.theme.light[key]?.toLowerCase();
    const fix = now && INK_FIX[key][now];
    if (fix) d.config.theme.light[key] = fix;
  }

  // Every preset's dark `surface` / `surface-2` sat only ~8 levels above its
  // `bg`, so a card barely lifted off the page. Deepen the lift, and nudge dark
  // `ink-faint` up to hold WCAG against the lighter surface. Known old values
  // only — a hand-tuned custom palette won't match and is left alone.
  const DARK_FIX: Record<"surface" | "surface-2" | "ink-faint", Record<string, string>> = {
    surface: {
      "#1b2126": "#22282d", // ink & moss / mist
      "#1c1a15": "#23211c", // paper
      "#1d1d15": "#24241c", // olive
      "#181b2a": "#1f2332", // indigo
      "#1f1a1b": "#262122", // rosewood
    },
    "surface-2": {
      "#252c33": "#2d343b",
      "#26231d": "#2e2b25",
      "#27271d": "#2f2f25",
      "#222636": "#2a2e3f",
      "#2a2325": "#322b2d",
    },
    "ink-faint": {
      "#7b858e": "#878f98",
      "#8a8474": "#948e7e",
      "#86867a": "#909084",
      "#7b8398": "#878fa4",
      "#8e8583": "#988f8d",
    },
  };
  for (const key of ["surface", "surface-2", "ink-faint"] as const) {
    const now = d.config.theme.dark[key]?.toLowerCase();
    const fix = now && DARK_FIX[key][now];
    if (fix) d.config.theme.dark[key] = fix;
  }

  d.meta = {
    title: (meta.title as string) || (d.config.branding as string) || "Trip",
    start: (meta.start as string) || today(),
    end: (meta.end as string) || (meta.start as string) || today(),
  } as TripData["meta"];

  d.media = (d.media as TripData["media"]) ?? { gallery: [] };
  if (!Array.isArray((d.media as TripData["media"]).gallery)) (d.media as TripData["media"]).gallery = [];

  for (const k of ENTITY_KEYS) {
    if (!Array.isArray((d as Record<string, unknown>)[k])) (d as Record<string, unknown>)[k] = [];
  }

  // v4: Day.plan went string[] → PlanItem[], and the separate Day.places list
  // folded into the plan. Once `plan` is an array of objects the day is on the
  // new shape — leave it alone (and drop any stale `places` so a lingering DB
  // column can't be re-folded on the next load).
  const LEADING_TIME = /^\s*(\d{1,2}:\d{2}(?:\s*[–—-]\s*\d{1,2}:\d{2})?)\s+(.+)$/;
  for (const day of d.days as Day[]) {
    const raw = day as unknown as { plan?: unknown; places?: unknown[] };
    const planIsNew = Array.isArray(raw.plan) && typeof raw.plan[0] === "object" && raw.plan[0] !== null;
    if (planIsNew) {
      day.plan = (raw.plan as Partial<PlanItem>[]).map((it): PlanItem => ({
        id: it.id || `pi-${fieldId()}`,
        text: it.text ?? "",
        time: it.time || undefined,
        note: it.note || undefined,
        placeId: it.placeId || undefined,
        url: it.url || undefined,
      }));
    } else {
      const fromStrings = (Array.isArray(raw.plan) ? (raw.plan as unknown[]) : [])
        .filter((s): s is string => typeof s === "string")
        .map((s): PlanItem => {
          const m = LEADING_TIME.exec(s);
          return m
            ? { id: `pi-${fieldId()}`, time: m[1].replace(/\s+/g, ""), text: m[2].trim() }
            : { id: `pi-${fieldId()}`, text: s.trim() };
        });
      const fromPlaces = (Array.isArray(raw.places) ? (raw.places as { label?: string; url?: string; placeId?: string }[]) : [])
        .filter((p) => (p.label ?? "").trim() || p.placeId)
        .map((p): PlanItem => ({
          id: `pi-${fieldId()}`,
          text: (p.label ?? "").trim() || "Place",
          placeId: p.placeId || undefined,
          url: p.url || undefined,
        }));
      day.plan = [...fromStrings, ...fromPlaces].filter((it) => it.text);
    }
    delete raw.places;
    const cats = d.config.expenseCategories ?? [];
    day.costs = Array.isArray(day.costs)
      ? day.costs.map((c) => ({
          id: c.id || fieldId(),
          categoryId: c.categoryId || guessCategoryId(c.label ?? "", cats),
          label: c.label ?? "",
          amount: c.amount ?? "",
          ...(c.currency ? { currency: c.currency } : {}),
        }))
      : [];
  }

  // every doc has a `fields` array, and every field a stable id (older rows and
  // hand-authored seeds predate the id). `kind` collapsed to contact | other —
  // insurance / flight / reservation are just plain cards now.
  for (const doc of d.docs as Doc[]) {
    doc.fields = Array.isArray(doc.fields)
      ? doc.fields.map((f): DocField => ({ id: f.id || fieldId(), label: f.label ?? "", value: f.value ?? "" }))
      : [];
    if ((doc.kind as string) !== "contact") doc.kind = "other";
  }

  // hotels: the old fixed reference columns (phone / booking ref / website /
  // wifi / door code) fold into the free `fields` list so nothing is lost —
  // they become ordinary user rows. Price + mapUrl stay dedicated (Expenses +
  // the map button parse them). Runs once: a hotel already carrying `fields`
  // that came from a legacy column keeps them; only unmigrated columns move.
  const HOTEL_LEGACY: [keyof Hotel, string][] = [
    ["reservationRef", "Booking ref"],
    ["phone", "Phone"],
    ["url", "Website"],
    ["wifi", "Wifi"],
    ["doorCode", "Door code"],
  ];
  for (const hotel of d.hotels as Hotel[]) {
    if (!Array.isArray(hotel.fields)) hotel.fields = [];
    hotel.fields = hotel.fields.map((f) => ({ id: f.id || fieldId(), label: f.label ?? "", value: f.value ?? "" }));
    for (const [key, label] of HOTEL_LEGACY) {
      const v = hotel[key];
      if (typeof v === "string" && v.trim() && !hotel.fields.some((f) => f.label === label)) {
        hotel.fields.push({ id: fieldId(), label, value: v });
      }
      delete (hotel as unknown as Record<string, unknown>)[key];
    }
    // coords anchor the Map's city pills — keep a valid explicit pair, else lift
    // one out of the pasted Maps link; the address geocode (Map tab) fills the
    // rest and writes back here.
    const lat = Number(hotel.lat);
    const lng = Number(hotel.lng);
    if (Number.isFinite(lat) && Number.isFinite(lng) && (lat !== 0 || lng !== 0)) {
      hotel.lat = lat;
      hotel.lng = lng;
    } else {
      const c = mapUrlCoords(hotel.mapUrl);
      if (c) { [hotel.lat, hotel.lng] = c; }
      else { delete hotel.lat; delete hotel.lng; }
    }
  }

  // the Logbook "Emergency" tab shows the one doc with kind "contact" — but
  // that kind isn't a selectable Document type (it's meant to be a
  // singleton), so there's no way to create one by hand. Every trip needs
  // exactly one, or the tab is a permanent dead end.
  if (!(d.docs as Doc[]).some((doc) => doc.kind === "contact")) {
    (d.docs as Doc[]).push({ id: `docs-${fieldId()}`, title: "Emergency contacts", kind: "contact", fields: [] });
  }

  return d as T;
}
