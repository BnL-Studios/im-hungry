
import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: true,
                tabBarActiveTintColor: "#2563eb",
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
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
