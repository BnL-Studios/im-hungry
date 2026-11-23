export type Unit = "g" | "ml" | "qty";

export type Ingredient = {
  id: number;
  name: string;
  quantity: number;
  unit: Unit;
};

export type Recipe = {
  title: string;
  ingredients: { id: number; quantity: number; unit: Unit }[];
  steps: string[];
  estimatedCookingTime: number;
};

export class ApiError extends Error {
  constructor(
    public code: string,
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" &&
    value !== null &&
    !Array.isArray(value);
}

function hasKeys(value: Record<string, unknown>, keys: string[]): boolean {
  const actual = Object.keys(value);
  return actual.length === keys.length &&
    actual.every((key) => keys.includes(key));
}

function isUnit(value: unknown): value is Unit {
  return value === "g" || value === "ml" || value === "qty";
}

export function parseIngredients(body: unknown): Ingredient[] {
  if (
    !isObject(body) ||
    !hasKeys(body, ["ingredients"]) ||
    !Array.isArray(body.ingredients) ||
    body.ingredients.length < 1 ||
    body.ingredients.length > 50
  ) {
    throw new ApiError("INVALID_REQUEST", 400, "Invalid ingredient list.");
  }

  const result: Ingredient[] = [];
  const seen = new Set<number>();

  for (const item of body.ingredients) {
    if (!isObject(item) || !hasKeys(item, ["id", "name", "quantity", "unit"])) {
      throw new ApiError("INVALID_REQUEST", 400, "Invalid ingredient.");
    }

    const { id, name, quantity, unit } = item;

    if (
      typeof id !== "number" ||
      !Number.isSafeInteger(id) ||
      id <= 0 ||
      seen.has(id) ||
      typeof name !== "string" ||
      name.trim().length < 1 ||
      name.length > 80 ||
      typeof quantity !== "number" ||
      !Number.isFinite(quantity) ||
      quantity <= 0 ||
      quantity > 1_000_000 ||
      !isUnit(unit)
    ) {
      throw new ApiError("INVALID_REQUEST", 400, "Invalid ingredient.");
    }

    seen.add(id);
    result.push({ id, name: name.trim(), quantity, unit });
  }

  return result;
}

export function isNoRecipe(value: unknown): boolean {
  return isObject(value) &&
    hasKeys(value, ["title", "ingredients", "steps", "estimatedCookingTime"]) &&
    value.title === "" &&
    Array.isArray(value.ingredients) &&
    value.ingredients.length === 0 &&
    Array.isArray(value.steps) &&
    value.steps.length === 0 &&
    value.estimatedCookingTime === 0;
}

export function validateRecipe(
  value: unknown,
  inventory: Ingredient[],
): value is Recipe {
  if (
    !isObject(value) ||
    !hasKeys(value, ["title", "ingredients", "steps", "estimatedCookingTime"])
  ) {
    return false;
  }

  const { title, ingredients, steps, estimatedCookingTime } = value;

  if (
    typeof title !== "string" ||
    title.trim().length < 1 ||
    title.length > 120 ||
    typeof estimatedCookingTime !== "number" ||
    !Number.isInteger(estimatedCookingTime) ||
    estimatedCookingTime < 1 ||
    estimatedCookingTime > 480 ||
    !Array.isArray(steps) ||
    steps.length < 1 ||
    steps.length > 20 ||
    !steps.every((s: unknown) =>
      typeof s === "string" && s.trim().length > 0 && s.length <= 500
    ) ||
    !Array.isArray(ingredients) ||
    ingredients.length < 1 ||
    ingredients.length > inventory.length
  ) {
    return false;
  }

  const stock = new Map(inventory.map((item) => [item.id, item]));
  const seen = new Set<number>();

  for (const item of ingredients) {
    if (!isObject(item) || !hasKeys(item, ["id", "quantity", "unit"])) {
      return false;
    }

    const { id, quantity, unit } = item;

    if (
      typeof id !== "number" ||
      !Number.isSafeInteger(id) ||
      seen.has(id) ||
      typeof quantity !== "number" ||
      !Number.isFinite(quantity) ||
      quantity <= 0 ||
      !isUnit(unit)
    ) {
      return false;
    }

    const available = stock.get(id);

    if (
      !available ||
      available.unit !== unit ||
      quantity > available.quantity
    ) {
      return false;
    }

    seen.add(id);
  }

  return true;
}
