import { View, Text } from "react-native";
import { router } from "expo-router";
import { Button } from "react-native-paper";

export default function ConfirmScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>
        ✅ Number Confirmed
      </Text>
      <Text style={{ fontSize: 16, color: "gray", marginBottom: 30, textAlign: "center" }}>
        Your mobile number has been successfully verified.
      </Text>
      <Button
        mode="contained"
        onPress={() => router.replace("/home")}
        style={{ borderRadius: 8, paddingHorizontal: 20 }}
      >
        Go to Home
      </Button>
    </View>
  );
}
