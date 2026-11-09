import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Page() {
  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.title}>Hello World</Text>
        <Text style={styles.subtitle}>This is the first page of your app.</Text>
        <Link asChild href="/new">
          <Pressable style={styles.addButton}>
            <Text style={styles.addButtonText}>Lägg till råvara</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
    gap: 16,
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
  addButton: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#208AEF",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
});
