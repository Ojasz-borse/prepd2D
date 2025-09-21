import TopHeader from "@/components/TopHeader";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function BranchDetails() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopHeader title="View Branch" showBackArrow={true} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    gap: 12,
  },
});
