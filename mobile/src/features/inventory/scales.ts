import type { Unit } from "./units";

export type QuantityScale = {
  label: string;
  factor: number;
};

/**
 * Skalor som visas när användaren valt en basenhet. Faktorerna anger hur många
 * basenheter (g, ml eller st) en skala motsvarar. Databasen får alltid basenheter.
 */
export const QUANTITY_SCALES: Record<Unit, readonly QuantityScale[]> = {
  g: [
    { label: "mg", factor: 0.001 },
    { label: "g", factor: 1 },
    { label: "kg", factor: 1000 },
  ],
  ml: [
    { label: "ml", factor: 1 },
    { label: "dl", factor: 100 },
    { label: "L", factor: 1000 },
  ],
  qty: [
    { label: "st", factor: 1 },
    { label: "dussin", factor: 12 },
  ],
};

export function getDefaultScale(unit: Unit): QuantityScale {
  return (
    QUANTITY_SCALES[unit].find((scale) => scale.factor === 1) ??
    QUANTITY_SCALES[unit][0]
  );
}

export function convertToBaseQuantity(
  value: number,
  scale: QuantityScale,
): number {
  // Avrunda bort flyttalsbrus, t.ex. 300 * 0.001 -> 0.3.
  return Math.round(value * scale.factor * 1e6) / 1e6;
}
