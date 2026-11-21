
import {
  ApiError,
  generateRecipe,
  isNoRecipe,
  parseIngredients,
  validateRecipe,
} from "./core.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function errorResponse(error: ApiError): Response {
  return Response.json(
    { error: { code: error.code, message: error.message } },
    { status: error.status, headers: corsHeaders },
  );
}

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return errorResponse(
      new ApiError("METHOD_NOT_ALLOWED", 405, "Use POST."),
    );
  }

  try {
    if (!request.headers.get("content-type")?.includes("application/json")) {
      throw new ApiError("INVALID_REQUEST", 400, "Expected JSON.");
    }

    const rawBody = await request.text();

    if (rawBody.length > 16_384) {
      throw new ApiError("INVALID_REQUEST", 400, "Request too large.");
    }

    let body: unknown;

    try {
      body = JSON.parse(rawBody);
    } catch {
      throw new ApiError("INVALID_REQUEST", 400, "Invalid JSON.");
    }

    const ingredients = parseIngredients(body);
    const recipe = await generateRecipe(ingredients);

    if (isNoRecipe(recipe)) {
      throw new ApiError("NO_RECIPE", 422, "No feasible recipe found.");
    }

    if (!validateRecipe(recipe, ingredients)) {
      throw new ApiError("INVALID_RECIPE", 502, "Recipe failed validation.");
    }

    return Response.json(recipe, { headers: corsHeaders });
  } catch (cause) {
    if (cause instanceof ApiError) {
      return errorResponse(cause);
    }

    console.error("Unexpected Edge Function error:", cause);
    return errorResponse(
      new ApiError("INTERNAL_ERROR", 500, "Unexpected server error."),
    );
  }
});
