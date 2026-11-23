
import { router, Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: true,
                tabBarActiveTintColor: "#208AEF",
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Hem",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? "home" : "home-outline"}
                            size={size}
                            color={typeof color === "string" ? color : "#64748b"}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="generate"
                options={{
                    title: "Generate Recipe",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? "sparkles" : "sparkles-outline"}
                            size={size}
                            color={typeof color === "string" ? color : "#64748b"}
                        />
                    ),
                }}
                listeners={{
                    tabPress: (event) => {
                        event.preventDefault();
                        router.push("/generate-recipe");
                    },
                }}
            />

            <Tabs.Screen
                name="ingredients"
                options={{
                    title: "Råvaror",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? "basket" : "basket-outline"}
                            size={size}
                            color={typeof color === "string" ? color : "#64748b"}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
