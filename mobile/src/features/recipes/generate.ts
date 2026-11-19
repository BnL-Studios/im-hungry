import {
  parseIngredients, validateRecipe, type Ingredient, type Recipe,
} from "../../../../supabase/functions/_shared/recipe";

export interface RecipeResult {
  recipe: Recipe;
  snapshot: Ingredient[];
}

const messages: Record<string, string> = {
  NO_RECIPE: "Det går inte att laga ett recept med de här råvarorna.",
  RATE_LIMITED: "AI-tjänstens kvot är nådd. Försök igen senare.",
  TIMEOUT: "Det tog för lång tid att generera receptet.",
  INVALID_RECIPE: "Receptet stämde inte med ditt matförråd.",
};

export async function generateFromInventory(
  readInventory: () => Ingredient[] | Promise<Ingredient[]>,
  endpoint: string | undefined,
  request = fetch,
): Promise<RecipeResult> {
  if (!endpoint || !/^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?\/functions\/v1\/generate-recipe$/.test(endpoint)) {
    throw new Error("Den lokala recepttjänsten är inte konfigurerad.");
  }
  const rows = await readInventory();
  if (!rows.length) throw new Error("Lägg till råvaror i matförrådet först.");
  let snapshot: Ingredient[];
  try {
    snapshot = parseIngredients({ ingredients: rows.map(({ id, name, quantity, unit }) => ({ id, name, quantity, unit })) });
  } catch {
    throw new Error("Kontrollera råvarorna. Högst 50 råvaror kan skickas.");
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 50000);
  let body;
  try {
    const response = await request(endpoint, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingredients: snapshot }), signal: controller.signal,
    });
    body = await response.json();
    if (!response.ok) throw new Error(messages[body?.error?.code] ?? "Recepttjänsten kunde inte generera ett recept.");
  } catch (error) {
    if (controller.signal.aborted) throw new Error(messages.TIMEOUT);
    if (error instanceof TypeError) throw new Error("Kunde inte nå den lokala recepttjänsten.");
    if (error instanceof SyntaxError) throw new Error(messages.INVALID_RECIPE);
    throw error;
  } finally {
    clearTimeout(timer);
  }
  if (!validateRecipe(body, snapshot)) throw new Error(messages.INVALID_RECIPE);
  const current = await readInventory();
  if (!validateRecipe(body, current) || body.ingredients.some(({ id }) =>
    current.find(item => item.id === id)?.name.trim() !== snapshot.find(item => item.id === id)?.name
  )) throw new Error("Matförrådet har ändrats. Generera ett nytt recept.");
  return { recipe: body, snapshot };
}
