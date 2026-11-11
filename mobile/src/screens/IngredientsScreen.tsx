
import { FlatList, StyleSheet, Text, View } from "react-native";
import type { InventoryItem } from "@/db/schema";

type Props = {
    ingredients: InventoryItem[];
};

export default function IngredientsScreen({ ingredients }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.heading}>My Ingredients</Text>

            <FlatList
                data={ingredients}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.quantity}>
                            {item.quantity} {item.unit === "qty" ? "pcs" : item.unit}
                        </Text>
                    </View>
                )}
                ItemSeparatorComponent={() => (
                    <View style={styles.separator} />
                )}
                ListEmptyComponent={
                    <Text style={styles.empty}>
                        You haven't added any ingredients yet.
                    </Text>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    heading: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    item: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 16,
    },
    name: {
        fontSize: 16,
        flexShrink: 1,
    },
    quantity: {
        fontSize: 16,
        marginLeft: 12,
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
});
