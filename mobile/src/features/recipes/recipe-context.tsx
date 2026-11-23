import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { RecipeResult } from "./generate";

interface RecipeContextValue {
  result: RecipeResult | null;
  save: (result: RecipeResult) => void;
  clear: () => void;
}

const RecipeContext = createContext<RecipeContextValue | null>(null);

/** Håller det senaste receptet i minnet mellan modalen och receptskärmen. */
export function RecipeProvider({ children }: { children: ReactNode }) {
  const [result, setResult] = useState<RecipeResult | null>(null);

  const value = useMemo<RecipeContextValue>(() => ({
    result,
    save: setResult,
    clear: () => setResult(null),
  }), [result]);

  return <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>;
}

export function useRecipeContext(): RecipeContextValue {
  const value = useContext(RecipeContext);
  if (!value) throw new Error("RecipeProvider saknas i rot-layouten.");
  return value;
}
