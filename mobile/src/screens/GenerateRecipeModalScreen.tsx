import { router } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useGenerateRecipe } from "@/features/recipes/useGenerateRecipe";

export default function GenerateRecipeModalScreen() {
  const { generate, loading, error } = useGenerateRecipe();

  async function handleGenerate() {
    if (await generate()) router.replace("/recipe");
  }

  function handleClose() {
    if (router.canGoBack()) router.back();
    else router.replace("/");
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Generera recept</Text>
        <Pressable
          accessibilityLabel="Stäng"
          accessibilityRole="button"
          disabled={loading}
          onPress={handleClose}
          style={({ pressed }) => [styles.close, pressed ? styles.pressed : null]}
        >
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.intro}>
          Skicka råvarorna i matförrådet till AI:n och få ett recept tillbaka.
        </Text>

        <View style={styles.settings}>
          <Text style={styles.settingsTitle}>Inställningar</Text>
          <Text style={styles.settingsEmpty}>Inga inställningar ännu.</Text>
        </View>

        {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          accessibilityLabel="Generera recept"
          accessibilityRole="button"
          disabled={loading}
          onPress={() => void handleGenerate()}
          style={({ pressed }) => [styles.primary, pressed ? styles.pressed : null]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryText}>Generera recept</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  heading: { fontSize: 24, fontWeight: "bold" },
  close: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  closeText: { fontSize: 20, color: "#475569" },
  content: { padding: 24, gap: 16 },
  intro: { fontSize: 16, color: "#334155" },
  settings: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    padding: 16,
    gap: 6,
  },
  settingsTitle: { fontSize: 16, fontWeight: "600" },
  settingsEmpty: { color: "#64748b" },
  error: { color: "#b91c1c" },
  footer: { padding: 24, paddingTop: 12 },
  primary: {
    minHeight: 56,
    borderRadius: 14,
    backgroundColor: "#208AEF",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  pressed: { opacity: 0.7 },
});
