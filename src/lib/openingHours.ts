/**
 * Narrows an OpenStreetMap `opening_hours` value to the one date you're
 * asking about — "Nov-Mar 09:00-17:00; Apr-Oct Tu-Su 09:00-19:00; Apr-Oct Mo
 * 09:00-17:00; Dec 29 off" on 19 Oct (a Monday) becomes "09:00–17:00", not the
 * whole year's schedule.
 *
 * Covers the common core of the syntax: `;`-separated rules, each with an
 * optional month range / day-of-month / weekday selector followed by time
 * ranges, `off`/`closed` or `24/7`; later rules override earlier ones for the
 * days they match (OSM's own rule). Anything outside that (holiday rules
 * aside, which are skipped — a public holiday can't be told from a date
 * alone) makes the whole value unparseable, and the caller gets the raw text
 * back rather than a confident wrong answer.
 */
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const M = MONTHS.join("|");
const D = DAYS.join("|");

const MONTH_RE = new RegExp(`\\b(${M})(?:\\s+(\\d{1,2}))?(?:\\s*-\\s*(?:(${M})(?:\\s+(\\d{1,2}))?|(\\d{1,2})\\b))?`, "g");
const DAY_RE = new RegExp(`\\b(${D})(?:\\s*-\\s*(${D}))?\\b`, "g");
const TIMES_RE = /^\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2}(?:\s*,\s*\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2})*$/;
// selector, then what the rule says
const RULE_RE = /^(.*?)\s*(\d{1,2}:\d{2}\s*-.*|off|closed|open|24\/7)$/i;

type Verdict = { skip: true } | { matches: boolean; value: string };

function judgeRule(rule: string, month: number, day: number, weekday: number): Verdict | "unparseable" {
  const m = RULE_RE.exec(rule.trim());
  if (!m) return "unparseable";
  let selector = m[1];
  const tail = m[2].trim();

  let value: string;
  if (/^(off|closed)$/i.test(tail)) value = "Closed";
  else if (tail === "24/7") value = "Open 24 hours";
  else if (/^open$/i.test(tail)) return "unparseable";
  else if (TIMES_RE.test(tail)) value = tail.replace(/\s*-\s*/g, "–").replace(/\s*,\s*/g, ", ");
  else return "unparseable";

  if (/\b(PH|SH)\b/.test(selector)) return { skip: true };

  let monthSpec = false, monthHit = false;
  const ord = month * 100 + day;
  selector = selector.replace(MONTH_RE, (_all, m1: string, d1?: string, m2?: string, d2?: string, dOnly?: string) => {
    monthSpec = true;
    const sm = MONTHS.indexOf(m1) + 1;
    const start = sm * 100 + (d1 ? +d1 : 1);
    let end: number;
    if (m2) end = (MONTHS.indexOf(m2) + 1) * 100 + (d2 ? +d2 : 31);
    else if (dOnly) end = sm * 100 + +dOnly;
    else end = d1 ? start : sm * 100 + 31;
    if (start <= end ? ord >= start && ord <= end : ord >= start || ord <= end) monthHit = true;
    return " ";
  });

  let dayHit = false;
  const hadDays = new RegExp(`\\b(${D})\\b`).test(selector);
  selector = selector.replace(DAY_RE, (_all, d1: string, d2?: string) => {
    const a = DAYS.indexOf(d1), b = d2 ? DAYS.indexOf(d2) : a;
    if (a <= b ? weekday >= a && weekday <= b : weekday >= a || weekday <= b) dayHit = true;
    return " ";
  });

  // anything left over (weeks, sunrise, a stray token…) isn't something we can judge
  if (selector.replace(/[\s,]/g, "")) return "unparseable";

  return { matches: (!monthSpec || monthHit) && (!hadDays || dayHit), value };
}

/** The hours that apply on `iso` (YYYY-MM-DD): the text to show, or `null`
 *  when no rule covers that date (out of season, a closed weekday). Falls
 *  back to `raw` untouched when the value can't be read reliably. */
export function hoursForDate(raw: string, iso: string): string | null {
  const parts = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!parts) return raw;
  const [y, mo, d] = [+parts[1], +parts[2], +parts[3]];
  const weekday = (new Date(Date.UTC(y, mo - 1, d)).getUTCDay() + 6) % 7; // Mo = 0

  let result: string | null = null;
  for (const rule of raw.split(";")) {
    if (!rule.trim()) continue;
    const verdict = judgeRule(rule, mo, d, weekday);
    if (verdict === "unparseable") return raw;
    if ("skip" in verdict) continue;
    if (verdict.matches) result = verdict.value; // a later match overrides an earlier one
  }
  return result;
}

const toMin = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

/** Whether a step planned at `start` (and, for a range, until `end`) fits
 *  the place's hours that day — `day` is what `hoursForDate` gave back. A
 *  short warning when it doesn't ("Not open yet · opens 10:00"), else null.
 *  Null too when the hours can't be read, rather than a guess. */
export function hoursConflict(day: string, start?: string, end?: string): string | null {
  if (day === "Closed") return "Closed this day";
  if (!TIMES_RE.test(day.replace(/–/g, "-"))) return null;
  if (!start || !/^\d{1,2}:\d{2}$/.test(start)) return null;
  const ranges = day.split(",").map((r) => {
    const [a, b] = r.split("–").map((t) => t.trim());
    const from = toMin(a);
    let to = toMin(b);
    if (to <= from) to += 24 * 60; // closes after midnight
    return { from, to, a, b };
  });
  let s = toMin(start);
  // a small-hours step can fall in the tail of a session that opened before midnight
  const late = ranges.find((r) => r.to > 24 * 60 && s + 24 * 60 < r.to);
  if (late) s += 24 * 60;
  const open = ranges.find((r) => s >= r.from && s < r.to);
  if (open) {
    if (end && /^\d{1,2}:\d{2}$/.test(end)) {
      let e = toMin(end);
      while (e <= s) e += 24 * 60;
      if (e > open.to) return `Closes at ${open.b}`;
    }
    return null;
  }
  const next = ranges.find((r) => r.from > s);
  if (!next) return `Closed by then · closes ${ranges[ranges.length - 1].b}`;
  return next === ranges[0] ? `Not open yet · opens ${next.a}` : `Closed then · reopens ${next.a}`;
}

/* ---------------------------------------------- "Good to know" phrases */

const DAY_NAMES: [RegExp, string][] = [
  [/\bmon(?:day)?s?\b\.?/gi, "Mo"],
  [/\btue(?:s(?:day)?)?s?\b\.?/gi, "Tu"],
  [/\bwed(?:nesday)?s?\b\.?/gi, "We"],
  [/\bthu(?:r(?:s(?:day)?)?)?s?\b\.?/gi, "Th"],
  [/\bfri(?:day)?s?\b\.?/gi, "Fr"],
  [/\bsat(?:urday)?s?\b\.?/gi, "Sa"],
  [/\bsun(?:day)?s?\b\.?/gi, "Su"],
  [/\bweekdays?\b/gi, "Mo-Fr"],
  [/\bweekends?\b/gi, "Sa-Su"],
];

/** weekday names, "Mon to Fri", "Sat & Sun" → OSM's "Mo-Fr", "Sa,Su" */
function osmDays(s: string): string {
  for (const [re, to] of DAY_NAMES) s = s.replace(re, to);
  return s
    .replace(new RegExp(`\\b(${D})\\s*(?:-|–|—|~|to|through|thru|until)\\s*(${D})\\b`, "gi"), "$1-$2")
    .replace(new RegExp(`\\b(${D})\\s*(?:,|&|\\band\\b)\\s*(?=(?:${D})\\b)`, "g"), "$1,");
}

const T12 = String.raw`(\d{1,2})(?:[:.](\d{2}))?(?:\s*([ap])\.?\s?m\b\.?)?`;
const RANGE_12 = new RegExp(`(?<![\\d:])${T12}\\s*(?:-|–|—|~|\\bto\\b|\\buntil\\b)\\s*${T12}`, "gi");

/** "11am–3pm", "5–10 p.m.", "11:30 – 22:00" → "11:00-15:00"… A pair with
 *  neither a colon nor an am/pm ("2–3") is left alone — it could be anything. */
function osmTimes(s: string): string {
  return s.replace(RANGE_12, (all, h1: string, m1 = "", p1 = "", h2: string, m2 = "", p2 = "") => {
    if (!m1 && !m2 && !p1 && !p2) return all;
    let a = p1.toLowerCase(), b = p2.toLowerCase();
    const to24 = (h: number, p: string) => (p === "a" ? h % 12 : p === "p" ? (h % 12) + 12 : h);
    if (b && !a) a = to24(+h1, b) > to24(+h2, b) ? "a" : b; // "11–3pm" is 11am
    if (a && !b) b = to24(+h2, a) <= to24(+h1, a) ? "p" : a;
    const fmt = (h: number, m: string) => `${String(h).padStart(2, "0")}:${m || "00"}`;
    return `${fmt(to24(+h1, a), m1)}-${fmt(to24(+h2, b), m2)}`;
  });
}

/** what a guide's phrase can't be read as a weekly pattern from — "2nd and
 *  4th Wednesdays", "Mondays in winter" */
const NOT_WEEKLY = new RegExp(
  `\\b(\\d+(st|nd|rd|th)|first|second|third|fourth|fifth|last|alternate|every other|some|occasional\\w*|irregular\\w*|varies|winter|summer|spring|autumn|fall|season\\w*|january|february|march|april|june|july|august|september|october|november|december|${MONTHS.join("|")})\\b`,
  "i",
);

/** Whether a "Closed" phrase ("Mondays", "Tue & Wed (open on holidays)")
 *  names that weekday (Mo = 0). Undefined when it can't be told. */
function closedOn(text: string, weekday: number): boolean | undefined {
  if (/^\s*(unknown|n\/a|not stated)/i.test(text) || NOT_WEEKLY.test(text)) return undefined;
  const t = text.replace(/\([^)]*\)/g, " ");
  let hit = false, any = false;
  osmDays(t).replace(DAY_RE, (_all, d1: string, d2?: string) => {
    any = true;
    const a = DAYS.indexOf(d1), b = d2 ? DAYS.indexOf(d2) : a;
    if (a <= b ? weekday >= a && weekday <= b : weekday >= a || weekday <= b) hit = true;
    return "";
  });
  return any ? hit : undefined;
}

/** The place's "Good to know" Hours and Closed lines, read for `iso` the
 *  way `hoursForDate` reads OSM's tag: "Closed" when the closed days name
 *  that weekday, else the hours that apply that day. Undefined when the
 *  phrases can't be read reliably — never a guess. */
export function factsHoursForDate(hours: string | undefined, closed: string | undefined, iso: string): string | undefined {
  const parts = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!parts) return undefined;
  const weekday = (new Date(Date.UTC(+parts[1], +parts[2] - 1, +parts[3])).getUTCDay() + 6) % 7;
  if (closed && closedOn(closed, weekday)) return "Closed";
  if (!hours || /^\s*(unknown|n\/a|not stated)/i.test(hours)) return undefined;

  // a last order / entry is inside the hours, not a session of its own
  let s = hours.replace(/[,;.]?\s*\(?\s*(last (order|entry|admission)|l\.?o\.?)\b[^,;)]*\)?/gi, " ");
  // a season in brackets still changes the hours, so it's checked first
  if (NOT_WEEKLY.test(s)) return undefined;
  s = s
    .replace(/\([^)]*\)/g, " ")
    .replace(/\bnoon\b/gi, "12pm")
    .replace(/\bmidnight\b/gi, "12am")
    .replace(/\b(open )?24 ?(hours|hrs|h)\b/gi, "24/7");
  s = osmDays(osmTimes(s))
    .replace(/\b(open|daily|every ?day|all week|hours)\b:?/gi, " ")
    .replace(new RegExp(`\\bclosed\\s+((?:(?:${D})[\\s,-]*)+)`, "gi"), "$1 off")
    .replace(/\s+(?:and|&)\s+(?=\d)/gi, ", ")
    // "Mo-Fr 11:00-22:00, Sa-Su 10:00-22:00" is two rules
    .replace(new RegExp(`(\\d:\\d{2}|\\boff)\\s*[,;]?\\s*(?=(?:${D})\\b)`, "g"), "$1; ")
    .replace(/[,;]\s*$/, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!s) return undefined;
  const day = hoursForDate(s, iso);
  if (day === s) return undefined; // couldn't be read
  return day ?? "Closed";
}
