import { useState } from "react";
import { router, type RelativePathString } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  useInventoryItems,
  useRemoveIngredient,
} from "@/features/inventory/repository";
import { formatQuantity } from "@/features/inventory/units";

export default function IngredientsScreen() {
  const { data, error, updatedAt } = useInventoryItems();
  const { remove, removing } = useRemoveIngredient();
  const [actionError, setActionError] = useState<string | null>(null);
  const isLoading = updatedAt === undefined && !error;

  async function handleRemove(id: number) {
    setActionError(null);
    try {
      await remove(id);
    } catch {
      setActionError("Kunde inte ta bort råvaran. Försök igen.");
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Mina råvaror</Text>
        {/* Plain Pressable + router.push: <Link asChild> merges styles as an
            object, which drops a function style and hides this button. */}
        <Pressable
          accessibilityLabel="Lägg till råvara"
          accessibilityRole="button"
          onPress={() => router.push("/add-ingredient")}
          style={({ pressed }) => [
            styles.addButton,
            pressed ? styles.pressed : null,
          ]}
        >
          <Text style={styles.addButtonText}>+ Lägg till</Text>
        </Pressable>
      </View>

      {actionError ? <Text style={styles.error}>{actionError}</Text> : null}

      {error ? (
        <Text style={styles.error}>
          Kunde inte läsa matförrådet. Försök igen.
        </Text>
      ) : isLoading ? (
        <ActivityIndicator style={styles.loading} />
      ) : (
        <FlatList
          contentContainerStyle={styles.listContent}
          data={data}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={
            <Text style={styles.empty}>
              Du har inte lagt till några råvaror än.
            </Text>
          }
          renderItem={({ item }) => (
            <View style={styles.item}>
              <View style={styles.itemInfo}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.quantity}>
                  {formatQuantity(item.quantity, item.unit)}
                </Text>
              </View>
              <View style={styles.actions}>
                <Pressable
                  accessibilityLabel={`Ändra mängd för ${item.name}`}
                  accessibilityRole="button"
                  onPress={() =>
                    router.push(
                      `/edit-ingredient?id=${item.id}` as RelativePathString,
                    )
                  }
                  style={({ pressed }) => [
                    styles.actionButton,
                    pressed ? styles.actionPressed : null,
                  ]}
                >
                  <Text style={styles.actionText}>Ändra</Text>
                </Pressable>
                <Pressable
                  accessibilityLabel={`Ta bort ${item.name}`}
                  accessibilityRole="button"
                  disabled={removing}
                  onPress={() => void handleRemove(item.id)}
                  style={({ pressed }) => [
                    styles.actionButton,
                    pressed ? styles.actionPressed : null,
                    removing ? styles.disabled : null,
                  ]}
                >
                  <Text style={[styles.actionText, styles.removeText]}>
                    Ta bort
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#2563eb",
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 10,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    // Skugga – iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    // Skugga – Android
    elevation: 3,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  pressed: {
    backgroundColor: "#1d4ed8", // mörkare blå vid tryck
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    paddingVertical: 16,
  },
  itemInfo: {
    flexShrink: 1,
  },
  name: {
    fontSize: 16,
    flexShrink: 1,
  },
  quantity: {
    color: "#6B7280",
    fontSize: 14,
    marginTop: 2,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  actionText: {
    fontSize: 13,
    fontWeight: "600",
  },
  removeText: {
    color: "#B91C1C",
  },
  actionPressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.5,
  },
  separator: {
    height: 1,
    backgroundColor: "#E5E5E5",
  },
  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#777777",
  },
  error: {
    color: "#B91C1C",
    marginTop: 24,
    textAlign: "center",
  },
  loading: {
    alignSelf: "center",
    marginTop: 40,
  },
});