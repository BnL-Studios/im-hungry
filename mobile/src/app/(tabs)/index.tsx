import { ScrollView, StyleSheet, Text } from "react-native";

export default function Page() {
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={styles.heading}>Im hungry</Text>
      <Text style={styles.text}>Så gör du:</Text>
      <Text style={styles.step}>1. Lägg till råvaror i fliken Råvaror.</Text>
      <Text style={styles.step}>2. Tryck på Generate Recipe i navigeringsfältet.</Text>
      <Text style={styles.step}>3. Tryck på Generera recept för att få ett förslag.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 24, gap: 14 },
  heading: { fontSize: 26, fontWeight: "bold" },
  text: { fontSize: 16, fontWeight: "600", color: "#334155" },
  step: { fontSize: 16, color: "#334155" },
});
