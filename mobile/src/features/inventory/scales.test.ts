import { describe, expect, it } from "vitest";
import {
  convertToBaseQuantity,
  getDefaultScale,
  QUANTITY_SCALES,
} from "./scales";
import { UNITS } from "./units";

describe("QUANTITY_SCALES", () => {
  it("har en standardskala med faktor 1 för varje enhet", () => {
    for (const unit of UNITS) {
      expect(getDefaultScale(unit).factor).toBe(1);
      expect(QUANTITY_SCALES[unit].length).toBeGreaterThan(1);
    }
  });

  it("räknar om skala till basenhet", () => {
    const liter = QUANTITY_SCALES.ml.find((scale) => scale.label === "L");
    expect(liter).toBeDefined();
    expect(convertToBaseQuantity(2, liter!)).toBe(2000);
  });
});
