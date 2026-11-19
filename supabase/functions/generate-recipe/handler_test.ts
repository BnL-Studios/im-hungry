import { handle } from "./handler.ts";
import { ApiError } from "./core.ts";

const url = "https://example.supabase.co/generate-recipe";
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

Deno.test("public handler validates both directions and preserves provider errors", async () => {
  const preflight = await handle(new Request(url, { method: "OPTIONS" }));
  if (
    preflight.status !== 204 ||
    preflight.headers.get("Access-Control-Allow-Origin") !== "*"
  ) throw Error("Expected public preflight");
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
});
