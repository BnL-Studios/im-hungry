import type { NewInventoryItem } from "@/db/schema";
import { isUnit } from "./units";

export type IngredientField = "name" | "quantity" | "unit";

export type FieldErrors = Partial<Record<IngredientField, string>>;

export type IngredientInput = {
  name: string;
  quantity: string;
  unit: string;
};

export type ParseIngredientResult =
  | { ok: true; value: NewInventoryItem }
  | { ok: false; errors: FieldErrors };

const NAME_MAX_LENGTH = 80;
const QUANTITY_MAX = 1_000_000;
const QUANTITY_PATTERN = /^[+-]?\d+(?:[.,]\d+)?$/;

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

  const quantityText = input.quantity.trim();
  let quantity = Number.NaN;

  if (quantityText.length === 0) {
    errors.quantity = "Ange en mängd.";
  } else if (!QUANTITY_PATTERN.test(quantityText)) {
    errors.quantity = "Mängden måste vara ett tal, t.ex. 1,5.";
  } else {
    quantity = Number(quantityText.replace(",", "."));

    if (!Number.isFinite(quantity)) {
      errors.quantity = "Mängden måste vara ett tal, t.ex. 1,5.";
    } else if (quantity <= 0) {
      errors.quantity = "Mängden måste vara större än 0.";
    } else if (quantity > QUANTITY_MAX) {
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
