import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function Button({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: "#063866",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  text: { color: "white", fontSize: 16, fontWeight: "bold",     fontFamily:"BeerSerif",
 },
});
