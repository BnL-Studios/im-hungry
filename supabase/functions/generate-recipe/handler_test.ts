import { handle } from "./handler.ts";
import { ApiError } from "./core.ts";

const url = "http://127.0.0.1:8787/functions/v1/generate-recipe";
const stock = [{ id: 1, name: "Ägg", quantity: 2, unit: "qty" }];
const recipe = {
  title: "Ägg",
  ingredients: [{ id: 1, quantity: 1, unit: "qty" }],
  steps: ["Tillaga."],
  estimatedCookingTime: 5,
};
const request = (body: string, origin = "http://localhost:8081") =>
  new Request(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: origin },
    body,
  });

Deno.test("demo handler validates both directions and preserves provider errors", async () => {
  const previous = Deno.env.get("RECIPE_LOCAL_DEMO");
  try {
    Deno.env.delete("RECIPE_LOCAL_DEMO");
    if ((await handle(request("{}"))).status !== 403) {
      throw Error("Expected disabled");
    }
    Deno.env.set("RECIPE_LOCAL_DEMO", "1");
    if ((await handle(request("{}", "https://example.com"))).status !== 403) {
      throw Error("Expected forbidden origin");
    }
    for (const body of ["{", "x".repeat(17000), "{}"]) {
      if ((await handle(request(body))).status !== 400) {
        throw Error("Expected invalid request");
      }
    }
    const req = () => request(JSON.stringify({ ingredients: stock }));
    const result = await handle(req(), () => Promise.resolve(recipe));
    if (
      result.status !== 200 ||
      JSON.stringify(await result.json()) !== JSON.stringify(recipe)
    ) throw Error("Expected validated response");
    for (
      const [generate, status] of [
        [() => Promise.resolve({ ...recipe, steps: [] }), 502],
        [
          () =>
            Promise.resolve({
              title: "",
              ingredients: [],
              steps: [],
              estimatedCookingTime: 0,
            }),
          422,
        ],
        [() => Promise.reject(new ApiError("TIMEOUT", 504, "Timed out")), 504],
      ] as const
    ) {
      if ((await handle(req(), generate)).status !== status) {
        throw Error("Unexpected error status");
      }
    }
  } finally {
    if (previous === undefined) Deno.env.delete("RECIPE_LOCAL_DEMO");
    else Deno.env.set("RECIPE_LOCAL_DEMO", previous);
  }
});
