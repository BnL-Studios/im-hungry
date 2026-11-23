import { useRef, useState } from "react";
import { useDatabase } from "@/db/client";
import { readInventory } from "@/features/inventory/repository";
import { generateFromInventory } from "./generate";
import { useRecipeContext } from "./recipe-context";

/** Genererar från nuvarande saldo och sparar resultatet för receptskärmen. */
export function useGenerateRecipe() {
  const db = useDatabase();
  const { save } = useRecipeContext();
  const pending = useRef(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate(): Promise<boolean> {
    if (pending.current) return false;
    pending.current = true;
    setLoading(true);
    setError("");
    try {
      save(await generateFromInventory(() => readInventory(db)));
      return true;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Kunde inte generera recept.");
      return false;
    } finally {
      pending.current = false;
      setLoading(false);
    }
  }

  return { generate, loading, error };
}
