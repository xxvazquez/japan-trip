import { describe, it, expect } from "vitest";
import { expenseCategoryForGlyph, fmtMoney, moneyParts, parseMoney } from "./cost";
import { normalizeTrip } from "./hydrate";
import { buildBlank } from "@/templates/blank";

const cats = normalizeTrip(buildBlank()).config.expenseCategories ?? [];
const label = (glyph: string | undefined) => cats.find((c) => c.id === expenseCategoryForGlyph(glyph, cats))?.label;

describe("expenseCategoryForGlyph", () => {
  it("files a spend by what the place's icon says it is", () => {
    expect(label("coffee")).toBe("Food & drink");
    expect(label("food")).toBe("Food & drink");
    expect(label("museum")).toBe("Activities");
    expect(label("shop")).toBe("Shopping");
    expect(label("hotel")).toBe("Accommodation");
  });
  it("leaves it uncategorised when the icon says nothing", () => {
    expect(expenseCategoryForGlyph(undefined, cats)).toBeUndefined();
    expect(expenseCategoryForGlyph("star", cats)).toBeUndefined();
    expect(expenseCategoryForGlyph("food", [])).toBeUndefined();
  });
});

describe("fmtMoney", () => {
  const nb = (s: string) => s.replace(/ /g, " ");
  it("puts the symbol where the currency's own country does", () => {
    expect(nb(fmtMoney(15, "PLN"))).toBe("15 zł");
    expect(nb(fmtMoney(1945.64, "PLN"))).toBe("1,945.64 zł");
    expect(nb(fmtMoney(200, "CZK"))).toBe("200 Kč");
    expect(fmtMoney(42000, "JPY")).toBe("¥42,000");
    expect(fmtMoney(18, "EUR")).toBe("€18");
    expect(fmtMoney(18, "GBP")).toBe("£18");
  });
  it("splits the same way for an editable amount", () => {
    expect(moneyParts(15, "PLN")).toEqual({ before: "", number: "15", after: " zł" });
    expect(moneyParts(0, "EUR")).toEqual({ before: "€", number: "0", after: "" });
  });
});

describe("parseMoney", () => {
  it("finds a currency code anywhere in the text, not just the first word", () => {
    expect(parseMoney("18 for two EUR")).toEqual({ amount: 18, currency: "EUR" });
    expect(parseMoney("18 for two", "PLN")).toEqual({ amount: 18, currency: "PLN" });
  });
});
