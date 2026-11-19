import {
  ApiError,
  generateRecipe,
  type Ingredient,
  parseIngredients,
  validateRecipe,
} from "./core.ts";

function assert(
  condition: unknown,
  message = "Assertion failed",
): asserts condition {
  if (!condition) throw new Error(message);
}

async function expectError(
  action: () => Promise<unknown>,
  code: string,
) {
  try {
    await action();
  } catch (error) {
    assert(error instanceof ApiError, "Expected ApiError");
    assert(error.code === code, `Expected ${code}, got ${error.code}`);
    return;
  }

  throw new Error(`Expected ${code}, but no error occurred`);
}

const inventory: Ingredient[] = [
  { id: 1, name: "Kokt ris", quantity: 500, unit: "g" },
  { id: 2, name: "Ägg", quantity: 4, unit: "qty" },
];

const recipe = {
  title: "Stekt ris",
  ingredients: [
    { id: 1, quantity: 300, unit: "g" },
    { id: 2, quantity: 2, unit: "qty" },
  ],
  steps: ["Stek riset.", "Tillsätt äggen."],
  estimatedCookingTime: 15,
};

function geminiResponse(value: unknown): Response {
  return Response.json({
    candidates: [{
      content: {
        parts: [{ text: JSON.stringify(value) }],
      },
    }],
  });
}

Deno.test("Valid inventory is accepted", () => {
  const result = parseIngredients({ ingredients: inventory });
  assert(result.length === 2);
});

Deno.test("Duplicate inventory IDs are rejected", () => {
  try {
    parseIngredients({
      ingredients: [inventory[0], inventory[0]],
    });
    throw new Error("Expected rejection");
  } catch (error) {
    assert(error instanceof ApiError);
    assert(error.code === "INVALID_REQUEST");
  }
});

Deno.test("Valid recipe passes validation", () => {
  assert(validateRecipe(recipe, inventory));
});

Deno.test("Unknown ingredient IDs are rejected", () => {
  const invalid = {
    ...recipe,
    ingredients: [{ id: 999, quantity: 1, unit: "qty" }],
  };

  assert(!validateRecipe(invalid, inventory));
});

Deno.test("Recipes cannot exceed stock", () => {
  const invalid = {
    ...recipe,
    ingredients: [{ id: 2, quantity: 6, unit: "qty" }],
  };

  assert(!validateRecipe(invalid, inventory));
});

Deno.test("Wrong units are rejected", () => {
  const invalid = {
    ...recipe,
    ingredients: [{ id: 1, quantity: 300, unit: "ml" }],
  };

  assert(!validateRecipe(invalid, inventory));
});

Deno.test("Duplicate recipe ingredients are rejected", () => {
  const invalid = {
    ...recipe,
    ingredients: [
      { id: 1, quantity: 200, unit: "g" },
      { id: 1, quantity: 200, unit: "g" },
    ],
  };

  assert(!validateRecipe(invalid, inventory));
});

Deno.test("Malformed recipes are rejected", () => {
  assert(!validateRecipe({ title: "Rice" }, inventory));
  assert(!validateRecipe(null, inventory));
  assert(!validateRecipe({ ...recipe, estimatedCookingTime: -5 }, inventory));
});

Deno.test("Retries a temporary 503 and then succeeds", async () => {
  let calls = 0;

  const result = await generateRecipe(inventory, {
    apiKey: "test-key",
    model: "primary",
    backupModel: "primary",
    delay: async () => {},
    fetcher: () => {
      calls++;
      return Promise.resolve(
        calls === 1
          ? new Response(null, { status: 503 })
          : geminiResponse(recipe),
      );
    },
  });

  assert(calls === 2);
  assert(validateRecipe(result, inventory));
});

Deno.test("Uses the backup only after primary failures", async () => {
  const urls: string[] = [];

  await generateRecipe(inventory, {
    apiKey: "test-key",
    model: "primary",
    backupModel: "backup",
    delay: async () => {},
    fetcher: (url) => {
      urls.push(url);

      return Promise.resolve(
        urls.length < 3
          ? new Response(null, { status: 503 })
          : geminiResponse(recipe),
      );
    },
  });

  assert(urls.length === 3);
  assert(urls[0].includes("/primary:generateContent"));
  assert(urls[1].includes("/primary:generateContent"));
  assert(urls[2].includes("/backup:generateContent"));
});

Deno.test("Does not retry quota errors", async () => {
  let calls = 0;

  await expectError(
    () =>
      generateRecipe(inventory, {
        apiKey: "test-key",
        model: "primary",
        backupModel: "backup",
        delay: async () => {},
        fetcher: () => {
          calls++;
          return Promise.resolve(new Response(null, { status: 429 }));
        },
      }),
    "RATE_LIMITED",
  );

  assert(calls === 1);
});

Deno.test("Stops after the maximum attempts", async () => {
  let calls = 0;

  await expectError(
    () =>
      generateRecipe(inventory, {
        apiKey: "test-key",
        model: "primary",
        backupModel: "backup",
        delay: async () => {},
        fetcher: () => {
          calls++;
          return Promise.resolve(new Response(null, { status: 503 }));
        },
      }),
    "MODEL_UNAVAILABLE",
  );

  assert(calls === 3);
});
