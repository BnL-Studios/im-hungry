import { useRef, useState } from "react";
import { Button, ScrollView, StyleSheet, Text } from "react-native";
import { useDatabase } from "@/db/client";
import { readInventory } from "@/features/inventory/repository";
import { formatQuantity } from "@/features/inventory/units";
import { generateFromInventory, type RecipeResult } from "@/features/recipes/generate";

export default function Page() {
  const db = useDatabase();
  const pending = useRef(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<RecipeResult | null>(null);

  async function generate() {
    if (pending.current) return;
    pending.current = true;
    setLoading(true);
    setResult(null);
    setError("");
    try {
      setResult(await generateFromInventory(() => readInventory(db)));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Kunde inte generera recept.");
    } finally {
      pending.current = false;
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={styles.heading}>Le Chef</Text>
      <Text>Skicka råvarorna i ditt matförråd till Gemini för att få ett recept.</Text>
      <Button title={loading ? "Genererar…" : "Generera recept"} disabled={loading} onPress={generate} />
      {error ? <Text accessibilityRole="alert">{error}</Text> : null}
      {result && <>
        <Text style={styles.heading}>{result.recipe.title}</Text>
        <Text>{result.recipe.estimatedCookingTime} min</Text>
        {result.recipe.ingredients.map(({ id, quantity, unit }) => (
          <Text key={id}>{result.snapshot.find(item => item.id === id)?.name} · {formatQuantity(quantity, unit)}</Text>
        ))}
        {result.recipe.steps.map((step, i) => <Text key={i}>{i + 1}. {step}</Text>)}
      </>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 24, gap: 14 },
  heading: { fontSize: 26, fontWeight: "bold" },
});
