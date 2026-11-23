import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRecipeContext } from "@/features/recipes/recipe-context";
import { toRecipeView } from "@/features/recipes/view-model";

export default function GeneratedRecipeScreen() {
  const { result } = useRecipeContext();
  const view = toRecipeView(result);

  if (!view) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyTitle}>Inget recept att visa ännu</Text>
        <Text style={styles.emptyText}>
          Generera ett recept från råvarorna i ditt matförråd först.
        </Text>
        <Pressable
          accessibilityLabel="Generera recept"
          accessibilityRole="button"
          onPress={() => router.replace("/generate-recipe")}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Generera recept</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={styles.title}>{view.title}</Text>
      <Text style={styles.time}>⏱ {view.timeMinutes} min</Text>

      <Text style={styles.section}>Ingredienser</Text>
      {view.ingredients.map(({ id, text }) => (
        <Text key={id} style={styles.row}>• {text}</Text>
      ))}

      <Text style={styles.section}>Tillagning</Text>
      {view.steps.map((step, index) => (
        <Text key={index} style={styles.row}>{step}</Text>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 24, gap: 10 },
  title: { fontSize: 28, fontWeight: "bold" },
  time: { fontSize: 16, color: "#475569", marginBottom: 8 },
  section: { fontSize: 18, fontWeight: "600", marginTop: 12 },
  row: { fontSize: 16, color: "#1e293b", lineHeight: 24 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 12 },
  emptyTitle: { fontSize: 22, fontWeight: "bold", textAlign: "center" },
  emptyText: { fontSize: 16, color: "#475569", textAlign: "center" },
  button: {
    marginTop: 8,
    borderRadius: 12,
    backgroundColor: "#208AEF",
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
