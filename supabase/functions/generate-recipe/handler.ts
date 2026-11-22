import {
  ApiError,
  generateRecipe,
  isNoRecipe,
  parseIngredients,
  validateRecipe,
} from "./core.ts";

const demoOrigin = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

async function readBody(request: Request) {
  const reader = request.body?.getReader();
  if (!reader) throw new ApiError("INVALID_REQUEST", 400, "Expected JSON.");
  const decoder = new TextDecoder();
  let text = "";
  let bytes = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.length;
    if (bytes > 16384) {
      await reader.cancel();
      throw new ApiError("INVALID_REQUEST", 400, "Request too large.");
    }
    text += decoder.decode(value, { stream: true });
  }
  try {
    return JSON.parse(text + decoder.decode());
  } catch {
    throw new ApiError("INVALID_REQUEST", 400, "Invalid JSON.");
  }
}

export async function handle(request: Request, generate = generateRecipe) {
  const origin = request.headers.get("origin");
  const headers = {
    "Access-Control-Allow-Origin": origin ?? "http://localhost",
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
  // Require the local demo runner. Hosted Supabase must fail closed.
  if (
    Deno.env.get("RECIPE_LOCAL_DEMO") !== "1" ||
    Deno.env.get("DENO_DEPLOYMENT_ID") ||
    !demoOrigin.test(new URL(request.url).origin) ||
    (origin && !demoOrigin.test(origin))
  ) {
    return new Response(null, { status: 403 });
  }
  if (new URL(request.url).pathname !== "/functions/v1/generate-recipe") {
    return new Response(null, { status: 404 });
  }
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }
  try {
    if (request.method !== "POST") {
      throw new ApiError("METHOD_NOT_ALLOWED", 405, "Use POST.");
    }
    if (
      request.headers.get("content-type")?.split(";")[0].trim() !==
        "application/json"
    ) {
      throw new ApiError("INVALID_REQUEST", 400, "Expected JSON.");
    }
    const inventory = parseIngredients(await readBody(request));
    const recipe = await generate(inventory);
    if (isNoRecipe(recipe)) {
      throw new ApiError("NO_RECIPE", 422, "No feasible recipe.");
    }
    if (!validateRecipe(recipe, inventory)) {
      throw new ApiError("INVALID_RECIPE", 502, "Invalid recipe.");
    }
    return Response.json(recipe, { headers });
  } catch (cause) {
    const error = cause instanceof ApiError
      ? cause
      : new ApiError("INTERNAL_ERROR", 500, "Unexpected server error.");
    return Response.json({
      error: { code: error.code, message: error.message },
    }, { status: error.status, headers });
  }
}
