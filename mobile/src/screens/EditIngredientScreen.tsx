import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import {
  useInventoryItems,
  useUpdateIngredient,
} from "@/features/inventory/repository";
import { formatQuantity } from "@/features/inventory/units";
import { parseQuantityInput } from "@/features/inventory/validation";

export default function EditIngredientScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const itemId = Number(id);
  const { data, error, updatedAt } = useInventoryItems();
  const item = data.find((entry) => entry.id === itemId);
  const { updateQuantity, saving } = useUpdateIngredient();

  const [draftQuantity, setDraftQuantity] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const quantity = draftQuantity ?? (item ? String(item.quantity) : null);

  async function handleSave() {
    if (!item || saving || quantity === null) {
      return;
    }

    const parsed = parseQuantityInput(quantity);
    if (!parsed.ok) {
      setFormError(parsed.error);
      return;
    }

    setFormError(null);
    try {
      await updateQuantity(item.id, parsed.value);

      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/ingredients");
      }
    } catch {
      setFormError("Kunde inte spara ändringen. Försök igen.");
    }
  }

  const isLoading = updatedAt === undefined && !error;

  if (isLoading || quantity === null) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error || !item) {
    return (
      <View style={styles.centered}>
        <Text style={styles.message}>
          {error
            ? "Kunde inte läsa matförrådet. Försök igen."
            : "Råvaran hittades inte."}
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.screen}
    >
      <View style={styles.content}>
        <Text style={styles.heading}>Ändra mängd</Text>
        <Text style={styles.subheading}>
          {item.name} · {formatQuantity(item.quantity, item.unit)}
        </Text>

        <Text style={styles.label}>Ny mängd</Text>
        <TextInput
          accessibilityLabel="Ny mängd"
          autoFocus
          inputMode="decimal"
          keyboardType="decimal-pad"
          onChangeText={(value) => {
            setDraftQuantity(value);
            setFormError(null);
          }}
          onSubmitEditing={handleSave}
          returnKeyType="done"
          style={styles.input}
          value={quantity}
        />
        {formError ? (
          <Text accessibilityLiveRegion="polite" style={styles.error}>
            {formError}
          </Text>
        ) : null}

        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: saving }}
          disabled={saving}
          onPress={handleSave}
          style={({ pressed }) => [
            styles.saveButton,
            pressed ? styles.pressed : null,
            saving ? styles.disabled : null,
          ]}
        >
          {saving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.saveButtonText}>Spara ändring</Text>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    alignSelf: "center",
    gap: 12,
    maxWidth: 520,
    padding: 24,
    width: "100%",
  },
  centered: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subheading: {
    color: "#6B7280",
    fontSize: 16,
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
  input: {
    borderColor: "#D1D5DB",
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  error: {
    color: "#B91C1C",
    fontSize: 14,
  },
  saveButton: {
    alignItems: "center",
    backgroundColor: "#208AEF",
    borderRadius: 12,
    justifyContent: "center",
    marginTop: 8,
    minHeight: 52,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.7,
  },
  message: {
    color: "#6B7280",
    fontSize: 16,
    textAlign: "center",
  },
});
