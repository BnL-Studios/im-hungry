import { formatQuantity } from "@/features/inventory/units";
import type { RecipeResult } from "./generate";

export interface RecipeIngredientRow {
  id: number;
  text: string;
}

export interface RecipeView {
  title: string;
  timeMinutes: number;
  ingredients: RecipeIngredientRow[];
  steps: string[];
}

/**
 * Visar bara de fyra kontraktsfälten. Namnen kommer från snapshoten och
 * rader utan giltigt namn/mängd presenteras aldrig som lagliga att laga.
 */
export function toRecipeView(result: RecipeResult | null | undefined): RecipeView | null {
  if (!result) return null;

  const { recipe, snapshot } = result;
  const names = new Map(snapshot.map(item => [item.id, item.name.trim()]));

  return {
    title: recipe.title,
    timeMinutes: recipe.estimatedCookingTime,
    ingredients: recipe.ingredients.flatMap(({ id, quantity, unit }) => {
      const name = names.get(id);
      if (!name || !Number.isFinite(quantity) || quantity <= 0) return [];
      return [{ id, text: `${name} · ${formatQuantity(quantity, unit)}` }];
    }),
    steps: recipe.steps.map((step, index) => `${index + 1}. ${step}`),
  };
}
