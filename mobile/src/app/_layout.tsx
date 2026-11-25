
import { Stack } from "expo-router";
import { DatabaseProvider } from "@/db/provider";
import { RecipeProvider } from "@/features/recipes/recipe-context";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  return (
    <DatabaseProvider>
      <RecipeProvider>
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="add-ingredient"
            options={{
              presentation: "modal",
              title: "Lägg till råvara",
            }}
          />
          <Stack.Screen
            name="edit-ingredient"
            options={{
              presentation: "modal",
              title: "Ändra mängd",
            }}
          />
          <Stack.Screen
            name="generate-recipe"
            options={{
              presentation: "modal",
              title: "Generera recept",
            }}
          />
          <Stack.Screen
            name="recipe"
            options={{ title: "Ditt recept" }}
          />
        </Stack>
      </RecipeProvider>
    </DatabaseProvider>
  );
}
