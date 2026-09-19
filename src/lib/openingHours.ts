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
