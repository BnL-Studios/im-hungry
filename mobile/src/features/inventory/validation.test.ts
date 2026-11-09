import { describe, expect, it } from "vitest";
import {
  parseIngredientInput,
  type IngredientInput,
  type ParseIngredientResult,
} from "./validation";

function parse(
  name: string,
  quantity: string,
  unit: IngredientInput["unit"] = "g",
): ParseIngredientResult {
  return parseIngredientInput({ name, quantity, unit });
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
    expect(expectValue(parse("  Mjöl   special  ", "1,5", "ml"))).toEqual({
      name: "Mjöl special",
      quantity: 1.5,
      unit: "ml",
    });
  });

  it("accepterar decimal med punkt", () => {
    expect(expectValue(parse("Mjöl", "1.5")).quantity).toBe(1.5);
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
      "Mängden måste vara större än 0.",
    );
  });

  it("avvisar text och exponentnotation", () => {
    expect(expectError(parse("Mjöl", "abc"), "quantity")).toBe(
      "Mängden måste vara ett tal, t.ex. 1,5.",
    );
    expect(expectError(parse("Mjöl", "1e3"), "quantity")).toBe(
      "Mängden måste vara ett tal, t.ex. 1,5.",
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
