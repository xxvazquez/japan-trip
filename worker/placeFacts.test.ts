import { describe, expect, it } from "vitest";
import { agree, agreed, findFacts, handlePlaceFacts, parseFacts, pickWebsite, VARIES } from "./placeFacts";

describe("parseFacts", () => {
  it("reads one fact per line", () => {
    const answer = "Known for: hitsumabushi (grilled eel over rice)\nHours: 11:30-14:00 and 16:30-20:30\nClosed: Wednesdays\nReservations: Phone only\nQueue: Up to 90 minutes\nPrice: ¥4,000-¥5,999 per person.";
    expect(parseFacts(answer)).toEqual({
      knownFor: "hitsumabushi (grilled eel over rice)",
      hours: "11:30-14:00 and 16:30-20:30",
      closed: "Wednesdays",
      reservations: "Phone only",
      queue: "Up to 90 minutes",
      price: "¥4,000-¥5,999 per person",
    });
  });
  it("reads facts run together on one line, keeping commas inside a value", () => {
    const answer = "Known for: okonomiyaki, praised by Michelin, Hours: 11:00-22:00 daily, Closed: no regular closed days, Reservations: No";
    expect(parseFacts(answer)).toEqual({
      knownFor: "okonomiyaki, praised by Michelin",
      hours: "11:00-22:00 daily",
      closed: "no regular closed days",
      reservations: "No",
    });
  });
  it("reads a sight's labels into the same slots", () => {
    const answer = "Known for: thousands of torii gates\nHours: Open 24 hours\nTickets: Not needed\nCrowds: Busy midday, quiet before 8am\nEntry: Free";
    expect(parseFacts(answer, "sight")).toEqual({
      knownFor: "thousands of torii gates",
      hours: "Open 24 hours",
      reservations: "Not needed",
      queue: "Busy midday, quiet before 8am",
      price: "Free",
    });
  });
  it("ends a fact at a website line the summary adds unasked", () => {
    expect(parseFacts("Closed: Mondays Website: https://example.jp\nEntry: Free", "sight")).toEqual({ closed: "Mondays", price: "Free" });
    expect(parseFacts("Price: ¥1,000, Official website: https://x.jp")).toEqual({ price: "¥1,000" });
  });
  it("drops facts the sources didn't give", () => {
    expect(parseFacts("Hours: unknown\nPrice: not stated in sources\nQueue: Often a line")).toEqual({ queue: "Often a line" });
  });
});

describe("pickWebsite", () => {
  const r = (url: string, title = "") => ({ url, title });
  it("takes the site named like the place in its address, at its home page", () => {
    expect(pickWebsite("Kiyomizu-dera", "Kyoto", [r("https://www.japan-guide.com/e/e3901.html"), r("https://www.kiyomizudera.or.jp/en/location?lang=en#top")])).toBe(
      "https://www.kiyomizudera.or.jp/en/",
    );
  });
  it("folds long vowels in the address the way names are", () => {
    expect(pickWebsite("Tōfuku-ji", "Kyoto", [r("https://tofukuji.jp/access/map.html")])).toBe("https://tofukuji.jp/");
  });
  it("doesn't take a page only because it calls itself official", () => {
    expect(pickWebsite("Nakamise Shopping Street", "Tokyo", [r("https://hoteltavinos.com/en/asakusa", "Official site | Hotel near Nakamise")])).toBeUndefined();
  });
  it("never takes a listing or guide site, even one calling itself official", () => {
    expect(pickWebsite("Ichiran", "Tokyo", [r("https://tabelog.com/ichiran", "Ichiran official"), r("https://ichiran-travel-blog.com/")])).toBeUndefined();
  });
  it("isn't fooled by the city's name or a kind of sight in the place's name", () => {
    expect(pickWebsite("Kyoto Tower", "Kyoto", [r("https://kyoto.jp/"), r("https://www.towerrecords.jp/")])).toBeUndefined();
  });
  it("takes the site the summary names as official when it's among the pages", () => {
    const pages = [r("https://www.gotokyo.org/en/spot/12/"), r("https://www.yokoso.metro.tokyo.lg.jp/en/tenbou/index.html")];
    expect(pickWebsite("North Observation Deck", "Tokyo", pages, "https://www.yokoso.metro.tokyo.lg.jp/en/tenbou/")).toBe("https://www.yokoso.metro.tokyo.lg.jp/en/");
  });
  it("doesn't take a summary's site that no page read was from, or a listing", () => {
    expect(pickWebsite("North Observation Deck", "Tokyo", [r("https://www.gotokyo.org/x")], "https://www.yokoso.metro.tokyo.lg.jp/")).toBeUndefined();
    expect(pickWebsite("North Observation Deck", "Tokyo", [r("https://www.tripadvisor.com/x")], "https://www.tripadvisor.com/y")).toBeUndefined();
  });
  it("finds nothing when no page is the place's own", () => {
    expect(pickWebsite("Fushimi Inari", "Kyoto", [r("https://example.com/kyoto-sights", "Best sights")])).toBeUndefined();
  });
});

const fake = (answer: string, titles: string[], status = 200) => async () =>
  new Response(JSON.stringify({ answer, results: titles.map((t, i) => ({ url: `https://www.site${i}.com/x`, title: t, content: "" })) }), { status });

describe("findFacts", () => {
  const today = new Date("2026-10-03T12:00:00Z");
  it("returns the facts, when they were checked and where from", async () => {
    const facts = await findFacts("Menya Inoichi", "Kyoto", { tavily: "key" }, fake("Queue: 45 min\nReservations: No", ["Menya Inoichi - Kyōto ramen", "Other"]), today);
    expect(facts).toEqual({ queue: "45 min", reservations: "No", checkedAt: "2026-10-03", sources: ["site0.com"] });
  });
  it("marks a sight's facts as such", async () => {
    const facts = await findFacts("Fushimi Inari", "Kyoto", { tavily: "key" }, fake("Entry: Free", ["Fushimi Inari Taisha, Kyoto"]), today, "sight");
    expect(facts).toEqual({ price: "Free", checkedAt: "2026-10-03", sources: ["site0.com"], kind: "sight" });
  });
  it("returns the place's own website among the pages", async () => {
    const res = async () =>
      new Response(JSON.stringify({ answer: "Entry: Free", results: [{ url: "https://inari.jp/en/", title: "Fushimi Inari Taisha, Kyoto", content: "" }] }));
    const facts = await findFacts("Fushimi Inari", "Kyoto", { tavily: "key" }, res, today, "sight");
    expect(facts).toMatchObject({ price: "Free", website: "https://inari.jp/en/" });
  });
  it("keeps the website when the summary gave no facts", async () => {
    const res = async () =>
      new Response(JSON.stringify({ answer: "Hours: unknown", results: [{ url: "https://inari.jp/", title: "Fushimi Inari Taisha, Kyoto", content: "" }] }));
    expect(await findFacts("Fushimi Inari", "Kyoto", { tavily: "key" }, res, today, "sight")).toMatchObject({ website: "https://inari.jp/" });
  });
  it("reads the official website the summary names", async () => {
    const res = async () =>
      new Response(JSON.stringify({ answer: "Entry: Free\nWebsite: https://www.yokoso.metro.tokyo.lg.jp/en/tenbou/", results: [{ url: "https://www.yokoso.metro.tokyo.lg.jp/en/tenbou/", title: "North Observation Deck, Tokyo", content: "" }] }));
    expect(await findFacts("North Observation Deck", "Tokyo", { tavily: "key" }, res, today, "sight")).toMatchObject({ price: "Free", website: "https://www.yokoso.metro.tokyo.lg.jp/en/" });
  });
  it("finds nothing when the pages are about a namesake in another city", async () => {
    expect(await findFacts("Corner Coffee", "Kyoto", { tavily: "key" }, fake("Hours: 7-15", ["Corner Coffee - Portland"]), today)).toBeNull();
  });
  it("takes a page naming the stay's city by its own word, not the whole phrase", async () => {
    const res = fake("Hours: 24 hours", ["Chureito Pagoda - a short walk from Kawaguchiko"]);
    expect(await findFacts("Chureito Pagoda", "Lake Kawaguchiko", { tavily: "key" }, res, today, "sight")).toMatchObject({ hours: "24 hours" });
  });
  it("finds nothing when no page is about the place", async () => {
    expect(await findFacts("Menya Inoichi", "Kyoto", { tavily: "key" }, fake("Queue: 45 min", ["Ichiran Shibuya"]), today)).toBeNull();
  });
  it("throws when search can't be asked", async () => {
    await expect(findFacts("A place", undefined, { tavily: "key" }, fake("", [], 432))).rejects.toThrow("432");
    const res = await handlePlaceFacts(new URL("https://x/api/place-facts?name=A%20place"), { tavily: "key" }, fake("", [], 432));
    expect(res.status).toBe(429);
    expect(await res.json()).toMatchObject({ limit: "used-up" });
  });
  it("tells asking too fast from a month used up", async () => {
    const res = await handlePlaceFacts(new URL("https://x/api/place-facts?name=A%20place"), { tavily: "key" }, fake("", [], 429));
    expect(res.status).toBe(429);
    expect(await res.json()).toMatchObject({ limit: "busy" });
    expect((await handlePlaceFacts(new URL("https://x/api/place-facts?name=A%20place"), { tavily: "key" }, fake("", [], 500))).status).toBe(502);
  });
});

describe("handlePlaceFacts", () => {
  it("needs a name and a key", async () => {
    expect((await handlePlaceFacts(new URL("https://x/api/place-facts"), { tavily: "key" })).status).toBe(400);
    expect((await handlePlaceFacts(new URL("https://x/api/place-facts?name=a"), {})).status).toBe(503);
  });
});

describe("agree", () => {
  it("matches the same hours however they're written", () => {
    expect(agree("hours", "10:00-18:00", "10am to 6pm daily")).toBe(true);
    expect(agree("hours", "10:00-18:00", "9:00-17:00")).toBe(false);
  });
  it("matches closed days by the days named", () => {
    expect(agree("closed", "Mondays", "Closed on Monday")).toBe(true);
    expect(agree("closed", "Tue-Thu", "Tuesday, Wednesday and Thursday")).toBe(true);
    expect(agree("closed", "Mondays", "Wednesdays")).toBe(false);
    expect(agree("closed", "None", "Open every day")).toBe(true);
  });
  it("matches prices that overlap", () => {
    expect(agree("price", "¥1,000–¥2,000", "about ¥1,500 per person")).toBe(true);
    expect(agree("price", "¥1,000", "¥3,000–¥4,000")).toBe(false);
    expect(agree("price", "Free", "Free entry")).toBe(true);
  });
  it("matches what a reservation or queue answer comes down to", () => {
    expect(agree("reservations", "Not needed", "No reservations, walk-in only")).toBe(true);
    expect(agree("reservations", "Required", "Not accepted")).toBe(false);
    expect(agree("queue", "Long, up to an hour", "Very busy at lunch")).toBe(true);
  });
});

describe("agreed", () => {
  it("keeps what both say, flags what they don't, drops what one lacks", () => {
    expect(agreed(
      { hours: "11:00-21:00", closed: "Mondays", price: "¥1,000", knownFor: "tonkatsu" },
      { hours: "11am-9pm", closed: "Tuesdays", queue: "Long" },
    )).toEqual({ hours: "11:00-21:00", closed: VARIES });
  });
});

describe("findFacts asks twice", () => {
  it("keeps only what both searches agree on", async () => {
    const answers = ["Hours: 10:00-18:00\nPrice: ¥800\nQueue: short", "Hours: 10am-6pm\nPrice: ¥2,000\nReservations: No"];
    let n = 0;
    const res = async () => new Response(JSON.stringify({ answer: answers[n++], results: [{ url: "https://a.com/x", title: "Cafe Kitsune Kyoto", content: "" }] }));
    expect(await findFacts("Cafe Kitsune", "Kyoto", { tavily: "key" }, res, new Date("2026-10-08T00:00:00Z"))).toEqual({
      hours: "10:00-18:00",
      price: VARIES,
      checkedAt: "2026-10-08",
      sources: ["a.com"],
    });
  });
});

describe("agree, on answers the searches really gave", () => {
  it("Ichiran Shibuya", () => {
    expect(agree("closed", "Open year‑round; no regular closed days", "Open 365 days (no closed days)")).toBe(true);
    expect(agree("hours", "Open 24 hours (24 / 7)", "Open 24 hours")).toBe(true);
    expect(agree("price", "≈¥1,500‑¥2,000 per person; basic ramen ¥1,080", "Basic ramen ¥1,080 (10 % surcharge 22:00‑06:00)")).toBe(true);
    expect(agree("queue", "40‑80 min peak, 10‑15 min off‑peak", "Can be long line‑ups; wait may be notable")).toBe(true);
  });
  it("Sensō-ji", () => {
    expect(agree("hours", "Main Hall 6:00‑5:00 PM (6:30 AM Oct‑Mar); grounds open 24 h", "Grounds 24 h; main hall 6 am‑5 pm")).toBe(true);
    expect(agree("reservations", "No tickets needed; free entry", "no tickets required")).toBe(true);
    expect(agree("queue", "Busy weekends/festivals; peak 10:30‑3 PM", "Very crowded during Golden Week; less crowded in fall/winter")).toBe(true);
  });
  it("still tells real differences apart", () => {
    expect(agree("hours", "10:00-18:00", "10:00-20:00")).toBe(false);
    expect(agree("queue", "Up to 90 min", "Rarely a wait, under 10 min")).toBe(false);
  });
});

describe("agree, more real phrasings", () => {
  it("reads 'no advance booking' and free entry as not needed", () => {
    expect(agree("reservations", "free entry, no advance booking mentioned", "Free entry; no advance booking required")).toBe(true);
    expect(agree("reservations", "No tickets needed; free entry", "Free admission, just walk in")).toBe(true);
  });
});
