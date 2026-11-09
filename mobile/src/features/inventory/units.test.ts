import { describe, expect, it } from "vitest";
import { formatQuantity, isUnit, UNIT_LABELS, UNITS } from "./units";

describe("units", () => {
  it("har de tre enheterna", () => {
    expect(UNITS).toEqual(["g", "ml", "qty"]);
    expect(UNIT_LABELS.qty).toBe("st");
  });

  it("känner igen bara giltiga enheter", () => {
    expect(isUnit("g")).toBe(true);
    expect(isUnit("qty")).toBe(true);
    expect(isUnit("kg")).toBe(false);
  });

  it("formaterar heltal och decimaler", () => {
    expect(formatQuantity(500, "g")).toBe("500 g");
    expect(formatQuantity(1.5, "ml")).toBe("1,5 ml");
    expect(formatQuantity(2, "qty")).toBe("2 st");
  });
});
