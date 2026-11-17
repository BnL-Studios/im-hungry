import type { NewInventoryItem } from "@/db/schema";
import { isUnit } from "./units";

export type IngredientField = "name" | "quantity" | "unit";

export type FieldErrors = Partial<Record<IngredientField, string>>;

export type IngredientInput = {
  name: string;
  quantity: string;
  /** Medvetet string: formulärdata är inte betrodd förrän den validerats. */
  unit: string;
  /** Faktor från vald skala (t.ex. dl → ml). Sparas alltid i basenhet. */
  scaleFactor?: number;
};

export type ParseIngredientResult =
  | { ok: true; value: NewInventoryItem }
  | { ok: false; errors: FieldErrors };

const NAME_MAX_LENGTH = 80;
const QUANTITY_MAX = 1_000_000;
const INTEGER_PATTERN = /^\d+$/;
const DECIMAL_PATTERN = /^\d+(?:[.,]\d+)?$/;

export type ParseQuantityResult =
  | { ok: true; value: number }
  | { ok: false; error: string };

/**
 * Validerar en mängd. Add-formuläret kräver heltal; redigering tillåter
 * decimaler så att befintliga värden kan sparas oförändrade.
 */
export function parseQuantityInput(
  input: string,
  options: { integerOnly?: boolean } = {},
): ParseQuantityResult {
  const text = input.trim();
  const integerOnly = options.integerOnly === true;
  const typeError = integerOnly
    ? "Mängden måste vara ett heltal, t.ex. 5."
    : "Mängden måste vara ett tal, t.ex. 1,5.";

  if (text.length === 0) {
    return { ok: false, error: "Ange en mängd." };
  }
  if (!(integerOnly ? INTEGER_PATTERN : DECIMAL_PATTERN).test(text)) {
    return { ok: false, error: typeError };
  }

  const value = Number(text.replace(",", "."));
  if (!Number.isFinite(value)) {
    return { ok: false, error: typeError };
  }
  if (value <= 0) {
    return { ok: false, error: "Mängden måste vara större än 0." };
  }
  if (value > QUANTITY_MAX) {
    return { ok: false, error: "Mängden är för stor." };
  }
  return { ok: true, value };
}

/**
 * Validerar och normaliserar råvaruformuläret. Ren funktion utan React och SQLite,
 * så att reglerna kan testas snabbt och återanvändas av fler skärmar.
 */
export function parseIngredientInput(
  input: IngredientInput,
): ParseIngredientResult {
  const errors: FieldErrors = {};

  const name = input.name.trim().replace(/\s+/g, " ");
  if (name.length === 0) {
    errors.name = "Ange ett namn på råvaran.";
  } else if (name.length > NAME_MAX_LENGTH) {
    errors.name = `Namnet får vara högst ${NAME_MAX_LENGTH} tecken.`;
  }

  const parsedQuantity = parseQuantityInput(input.quantity, {
    integerOnly: true,
  });
  let quantity = Number.NaN;

  if (!parsedQuantity.ok) {
    errors.quantity = parsedQuantity.error;
  } else {
    const factor =
      input.scaleFactor !== undefined &&
      Number.isFinite(input.scaleFactor) &&
      input.scaleFactor > 0
        ? input.scaleFactor
        : 1;
    quantity = parsedQuantity.value * factor;

    if (!Number.isFinite(quantity) || quantity > QUANTITY_MAX) {
      errors.quantity = "Mängden är för stor.";
    }
  }

  const unit = isUnit(input.unit) ? input.unit : undefined;
  if (!unit) {
    errors.unit = "Välj en enhet.";
  }

  if (!unit || Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    value: {
      name,
      quantity,
      unit,
    },
  };
}
