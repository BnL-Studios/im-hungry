export const UNITS = ["g", "ml", "qty"] as const;

export type Unit = (typeof UNITS)[number];

export const UNIT_LABELS: Record<Unit, string> = {
  g: "g",
  ml: "ml",
  qty: "st",
};

export function isUnit(value: string): value is Unit {
  return (UNITS as readonly string[]).includes(value);
}

export function formatQuantity(quantity: number, unit: Unit): string {
  const amount = Number.isInteger(quantity)
    ? String(quantity)
    : String(quantity).replace(".", ",");

  return `${amount} ${UNIT_LABELS[unit]}`;
}
