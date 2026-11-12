
import IngredientsScreen from "@/screens/IngredientsScreen";
import type { InventoryItem } from "@/db/schema";

// Temporary preview data — remove when SQLite is connected.
const previewIngredients: InventoryItem[] = [
    { id: 1, name: "Chicken", quantity: 500, unit: "g" },
    { id: 2, name: "Milk", quantity: 750, unit: "ml" },
    { id: 3, name: "Eggs", quantity: 6, unit: "qty" },
];

export default function Index() {
    return <IngredientsScreen ingredients={previewIngredients} />;
}
