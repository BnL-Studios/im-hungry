import { expect, it } from "vitest";
import { toRecipeView } from "./view-model";
import type { RecipeResult } from "./generate";

const result: RecipeResult = {
  snapshot: [
    { id: 1, name: "Kokt ris", quantity: 500, unit: "g" },
    { id: 2, name: "Ägg", quantity: 4, unit: "qty" },
  ],
  recipe: {
    title: "Stekt kokt ris med ägg",
    ingredients: [
      { id: 1, quantity: 200, unit: "g" },
      { id: 2, quantity: 2, unit: "qty" },
    ],
    steps: ["Stek riset.", "Blanda i ägget."],
    estimatedCookingTime: 15,
  },
};

it("visar de fyra fälten med namn från snapshoten", () => {
  expect(toRecipeView(result)).toEqual({
    title: "Stekt kokt ris med ägg",
    timeMinutes: 15,
    ingredients: [
      { id: 1, text: "Kokt ris · 200 g" },
      { id: 2, text: "Ägg · 2 st" },
    ],
    steps: ["1. Stek riset.", "2. Blanda i ägget."],
  });
});

it("döljer råvaror utan namn i snapshoten eller med ogiltig mängd", () => {
  const broken: RecipeResult = {
    ...result,
    recipe: {
      ...result.recipe,
      ingredients: [
        { id: 1, quantity: 200, unit: "g" },
        { id: 2, quantity: 0, unit: "qty" },
        { id: 3, quantity: 10, unit: "g" },
      ],
    },
  };

  expect(toRecipeView(broken)?.ingredients).toEqual([
    { id: 1, text: "Kokt ris · 200 g" },
  ]);
});

it("ger inget recept när inget har genererats", () => {
  expect(toRecipeView(null)).toBeNull();
});
