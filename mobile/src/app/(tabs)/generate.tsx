import { Redirect } from "expo-router";

/** Webbfallback: tabBarButton används bara på native, så öppna modulen här. */
export default function GenerateTabRoute() {
  return <Redirect href="/generate-recipe" />;
}
