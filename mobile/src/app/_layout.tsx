import { Stack } from "expo-router";
import { DatabaseProvider } from "@/db/provider";

export default function RootLayout() {
  return (
    <DatabaseProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Matförråd" }} />
        <Stack.Screen name="new" options={{ title: "Lägg till råvara" }} />
      </Stack>
    </DatabaseProvider>
  );
}
