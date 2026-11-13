
import { Stack } from "expo-router";
import { DatabaseProvider } from "@/db/provider";

export default function RootLayout() {
  return (
    <DatabaseProvider>
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
      </Stack>
    </DatabaseProvider>
  );
}
