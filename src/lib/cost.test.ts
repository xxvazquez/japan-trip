import { describe, it, expect } from "vitest";
import { expenseCategoryForGlyph } from "./cost";
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
