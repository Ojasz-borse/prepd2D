import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const MockTestScreen = () => {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: "/mock-test",
      params: { testid: "1" },
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.card} onPress={handlePress}>
        <Text style={styles.title}>Mock Test 1</Text>
        <Text style={styles.subtitle}>Tap to start the test</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MockTestScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  card: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
});
