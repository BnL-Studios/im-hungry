import { describe, expect, it } from "vitest";
import {
  parseIngredientInput,
  parseQuantityInput,
  type IngredientInput,
  type ParseIngredientResult,
} from "./validation";

function parse(
  name: string,
  quantity: string,
  unit: IngredientInput["unit"] = "g",
  scaleFactor = 1,
): ParseIngredientResult {
  return parseIngredientInput({ name, quantity, unit, scaleFactor });
}

function expectValue(result: ParseIngredientResult) {
  if (!result.ok) {
    throw new Error(
      `Förväntade ett giltigt resultat, fick ${JSON.stringify(result.errors)}`,
    );
  }

  return result.value;
}

function expectError(
  result: ParseIngredientResult,
  field: "name" | "quantity" | "unit",
) {
  if (result.ok) {
    throw new Error("Förväntade ett valideringsfel");
  }

  return result.errors[field];
}

describe("parseIngredientInput", () => {
  it("accepterar en giltig råvara", () => {
    expect(expectValue(parse("Mjöl", "500"))).toEqual({
      name: "Mjöl",
      quantity: 500,
      unit: "g",
    });
  });

  it("trimmar namn och kollapsar mellanslag", () => {
    expect(expectValue(parse("  Mjöl   special  ", "5", "ml"))).toEqual({
      name: "Mjöl special",
      quantity: 5,
      unit: "ml",
    });
  });

  it("avvisar decimaler i add-formuläret", () => {
    expect(expectError(parse("Mjöl", "1,5"), "quantity")).toBe(
      "Mängden måste vara ett heltal, t.ex. 5.",
    );
  });

  it("räknar om vald skala till basenhet", () => {
    expect(expectValue(parse("Mjöl", "5", "ml", 100)).quantity).toBe(500);
  });

  it("avrundar flyttalsbrus för 300 mg", () => {
    expect(expectValue(parse("Salt", "300", "g", 0.001)).quantity).toBe(0.3);
  });

  it("avvisar tomt namn", () => {
    expect(expectError(parse("", "1"), "name")).toBe(
      "Ange ett namn på råvaran.",
    );
  });

  it("avvisar namn med bara mellanslag", () => {
    expect(expectError(parse("   ", "1"), "name")).toBe(
      "Ange ett namn på råvaran.",
    );
  });

  it("avvisar för långt namn", () => {
    expect(expectError(parse("a".repeat(81), "1"), "name")).toBe(
      "Namnet får vara högst 80 tecken.",
    );
  });

  it("accepterar namn på exakt 80 tecken", () => {
    expect(expectValue(parse("a".repeat(80), "1")).name).toHaveLength(80);
  });

  it("avvisar tom mängd", () => {
    expect(expectError(parse("Mjöl", ""), "quantity")).toBe("Ange en mängd.");
  });

  it("avvisar noll och negativ mängd", () => {
    expect(expectError(parse("Mjöl", "0"), "quantity")).toBe(
      "Mängden måste vara större än 0.",
    );
    expect(expectError(parse("Mjöl", "-1"), "quantity")).toBe(
      "Mängden måste vara ett heltal, t.ex. 5.",
    );
  });

  it("avvisar text och exponentnotation", () => {
    expect(expectError(parse("Mjöl", "abc"), "quantity")).toBe(
      "Mängden måste vara ett heltal, t.ex. 5.",
    );
    expect(expectError(parse("Mjöl", "1e3"), "quantity")).toBe(
      "Mängden måste vara ett heltal, t.ex. 5.",
    );
  });

  it("avvisar okänd enhet", () => {
    expect(expectError(parse("Mjöl", "1", "kg"), "unit")).toBe(
      "Välj en enhet.",
    );
  });

  it("avvisar orimligt stor mängd", () => {
    expect(expectError(parse("Mjöl", "1000001"), "quantity")).toBe(
      "Mängden är för stor.",
    );
  });
});

describe("parseQuantityInput", () => {
  it("tillåter decimaler vid redigering", () => {
    expect(parseQuantityInput("1,5")).toEqual({ ok: true, value: 1.5 });
  });

  it("kräver heltal när add-formuläret begär det", () => {
    expect(parseQuantityInput("1,5", { integerOnly: true })).toEqual({
      ok: false,
      error: "Mängden måste vara ett heltal, t.ex. 5.",
    });
  });

  it("avvisar tom mängd och noll", () => {
    expect(parseQuantityInput("")).toEqual({
      ok: false,
      error: "Ange en mängd.",
    });
    expect(parseQuantityInput("0")).toEqual({
      ok: false,
      error: "Mängden måste vara större än 0.",
    });
  });
});
