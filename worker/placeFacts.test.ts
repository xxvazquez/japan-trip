import { describe, expect, it } from "vitest";
import { findFacts, handlePlaceFacts, parseFacts } from "./placeFacts";

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
  it("drops facts the sources didn't give", () => {
    expect(parseFacts("Hours: unknown\nPrice: not stated in sources\nQueue: Often a line")).toEqual({ queue: "Often a line" });
  });
});

const fake = (answer: string, titles: string[], status = 200) => async () =>
  new Response(JSON.stringify({ answer, results: titles.map((t, i) => ({ url: `https://www.site${i}.com/x`, title: t, content: "" })) }), { status });

describe("findFacts", () => {
  const today = new Date("2026-10-03T12:00:00Z");
  it("returns the facts, when they were checked and where from", async () => {
    const facts = await findFacts("Menya Inoichi", "Kyoto", "key", fake("Queue: 45 min\nReservations: No", ["Menya Inoichi - Kyōto ramen", "Other"]), today);
    expect(facts).toEqual({ queue: "45 min", reservations: "No", checkedAt: "2026-10-03", sources: ["site0.com"] });
  });
  it("marks a sight's facts as such", async () => {
    const facts = await findFacts("Fushimi Inari", "Kyoto", "key", fake("Entry: Free", ["Fushimi Inari Taisha, Kyoto"]), today, "sight");
    expect(facts).toEqual({ price: "Free", checkedAt: "2026-10-03", sources: ["site0.com"], kind: "sight" });
  });
  it("finds nothing when the pages are about a namesake in another city", async () => {
    expect(await findFacts("Corner Coffee", "Kyoto", "key", fake("Hours: 7-15", ["Corner Coffee - Portland"]), today)).toBeNull();
  });
  it("finds nothing when no page is about the place", async () => {
    expect(await findFacts("Menya Inoichi", "Kyoto", "key", fake("Queue: 45 min", ["Ichiran Shibuya"]), today)).toBeNull();
  });
  it("throws when search can't be asked", async () => {
    await expect(findFacts("A place", undefined, "key", fake("", [], 432))).rejects.toThrow("432");
  });
});

describe("handlePlaceFacts", () => {
  it("needs a name and a key", async () => {
    expect((await handlePlaceFacts(new URL("https://x/api/place-facts"), "key")).status).toBe(400);
    expect((await handlePlaceFacts(new URL("https://x/api/place-facts?name=a"), undefined)).status).toBe(503);
  });
});
