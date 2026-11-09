import { useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
  type TextInputInstance,
} from "react-native";
import { router } from "expo-router";
import { useAddIngredient } from "@/features/inventory/repository";
import { UNIT_LABELS, UNITS, type Unit } from "@/features/inventory/units";
import {
  parseIngredientInput,
  type FieldErrors,
  type IngredientField,
} from "@/features/inventory/validation";

const palettes = {
  light: {
    background: "#FFFFFF",
    text: "#111827",
    muted: "#6B7280",
    border: "#D1D5DB",
    field: "#F9FAFB",
    chip: "#F3F4F6",
    chipSelected: "#E0EDFB",
    primary: "#208AEF",
    onPrimary: "#FFFFFF",
    error: "#B91C1C",
  },
  dark: {
    background: "#0B0F14",
    text: "#F9FAFB",
    muted: "#9CA3AF",
    border: "#374151",
    field: "#111827",
    chip: "#111827",
    chipSelected: "#123A5C",
    primary: "#208AEF",
    onPrimary: "#FFFFFF",
    error: "#F87171",
  },
} as const;

type Palette = (typeof palettes)[keyof typeof palettes];

export default function AddIngredientScreen() {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const colors = palettes[scheme];
  const styles = useMemo(() => createStyles(colors), [colors]);

  const { add, saving } = useAddIngredient();

  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState<Unit>("g");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  const quantityRef = useRef<TextInputInstance>(null);

  function clearError(field: IngredientField) {
    setErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  async function handleSubmit() {
    if (saving) {
      return;
    }

    setFormError(null);

    const result = parseIngredientInput({ name, quantity, unit });
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }

    setErrors({});

    try {
      await add(result.value);

      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/");
      }
    } catch {
      setFormError("Kunde inte spara råvaran. Försök igen.");
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={[styles.screen, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.intro}>
          Ange vad du har hemma. Mängden måste vara större än 0.
        </Text>

        <View style={styles.field}>
          <Text style={styles.label}>Namn</Text>
          <TextInput
            accessibilityLabel="Råvarans namn"
            autoCapitalize="sentences"
            autoCorrect
            maxLength={80}
            onChangeText={(value) => {
              setName(value);
              clearError("name");
            }}
            onSubmitEditing={() => quantityRef.current?.focus()}
            placeholder="t.ex. Mjöl"
            placeholderTextColor={colors.muted}
            returnKeyType="next"
            selectionColor={colors.primary}
            style={[
              styles.input,
              { backgroundColor: colors.field, color: colors.text },
              errors.name ? styles.inputInvalid : null,
            ]}
            value={name}
          />
          {errors.name ? (
            <Text accessibilityLiveRegion="polite" style={styles.error}>
              {errors.name}
            </Text>
          ) : null}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Mängd</Text>
          <TextInput
            accessibilityLabel="Mängd"
            inputMode="decimal"
            keyboardType="decimal-pad"
            onChangeText={(value) => {
              setQuantity(value);
              clearError("quantity");
            }}
            onSubmitEditing={handleSubmit}
            placeholder="t.ex. 500"
            placeholderTextColor={colors.muted}
            ref={quantityRef}
            returnKeyType="done"
            selectionColor={colors.primary}
            style={[
              styles.input,
              { backgroundColor: colors.field, color: colors.text },
              errors.quantity ? styles.inputInvalid : null,
            ]}
            value={quantity}
          />
          {errors.quantity ? (
            <Text accessibilityLiveRegion="polite" style={styles.error}>
              {errors.quantity}
            </Text>
          ) : null}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Enhet</Text>
          <View accessibilityRole="radiogroup" style={styles.units}>
            {UNITS.map((option) => {
              const selected = unit === option;

              return (
                <Pressable
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  key={option}
                  onPress={() => {
                    setUnit(option);
                    clearError("unit");
                  }}
                  style={({ pressed }) => [
                    styles.unit,
                    {
                      backgroundColor: selected ? colors.chipSelected : colors.chip,
                      borderColor: selected ? colors.primary : colors.border,
                    },
                    pressed ? styles.pressed : null,
                  ]}
                >
                  <Text
                    style={[
                      styles.unitText,
                      { color: selected ? colors.primary : colors.text },
                    ]}
                  >
                    {UNIT_LABELS[option]}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          {errors.unit ? (
            <Text accessibilityLiveRegion="polite" style={styles.error}>
              {errors.unit}
            </Text>
          ) : null}
        </View>

        {formError ? (
          <Text accessibilityLiveRegion="polite" style={styles.formError}>
            {formError}
          </Text>
        ) : null}

        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: saving }}
          disabled={saving}
          onPress={handleSubmit}
          style={({ pressed }) => [
            styles.submit,
            { backgroundColor: colors.primary },
            pressed ? styles.pressed : null,
            saving ? styles.submitDisabled : null,
          ]}
        >
          {saving ? (
            <ActivityIndicator color={colors.onPrimary} />
          ) : (
            <Text style={[styles.submitText, { color: colors.onPrimary }]}>
              Spara råvara
            </Text>
          )}
        </Pressable>

        <Text style={styles.note}>Råvaran sparas lokalt på telefonen.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function createStyles(colors: Palette) {
  return StyleSheet.create({
    screen: {
      flex: 1,
    },
    content: {
      alignSelf: "center",
      gap: 20,
      maxWidth: 520,
      padding: 24,
      width: "100%",
    },
    intro: {
      color: colors.muted,
      fontSize: 16,
      lineHeight: 22,
    },
    field: {
      gap: 8,
    },
    label: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "600",
    },
    input: {
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
      fontSize: 18,
      paddingHorizontal: 14,
      paddingVertical: 12,
    },
    inputInvalid: {
      borderColor: colors.error,
    },
    units: {
      flexDirection: "row",
      gap: 10,
    },
    unit: {
      alignItems: "center",
      borderRadius: 10,
      borderWidth: 1,
      flex: 1,
      paddingVertical: 12,
    },
    unitText: {
      fontSize: 17,
      fontWeight: "600",
    },
    error: {
      color: colors.error,
      fontSize: 14,
    },
    formError: {
      color: colors.error,
      fontSize: 15,
    },
    submit: {
      alignItems: "center",
      borderRadius: 12,
      justifyContent: "center",
      minHeight: 52,
      paddingHorizontal: 20,
    },
    submitDisabled: {
      opacity: 0.7,
    },
    submitText: {
      fontSize: 17,
      fontWeight: "700",
    },
    pressed: {
      opacity: 0.8,
    },
    note: {
      color: colors.muted,
      fontSize: 13,
      textAlign: "center",
    },
  });
}
