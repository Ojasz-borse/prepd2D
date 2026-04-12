import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useSavedOptionForms, SavedForm } from "@/hooks/useSavedOptionForms";
import { useRouter } from "expo-router";
import TopHeader from "@/components/TopHeader";
import { LinearGradient } from "expo-linear-gradient";

const SavedListsScreen = () => {
  const { savedForms, deleteSavedForm } = useSavedOptionForms();
  const router = useRouter();

  const handleSelect = (form: SavedForm) => {
    router.push({
      pathname: "/create-college-list",
      params: { savedId: form.id },
    });
  };

  return (
    <LinearGradient
      colors={["#f8fafc", "#e6f1ff", "#e8dcff"]}
      locations={[0, 0.5, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <TopHeader title="Saved Option Forms" showBackArrow={true} />

        <View style={styles.content}>
          <View style={styles.whiteContainer}>
            {savedForms.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No saved forms found</Text>
                <TouchableOpacity
                  style={styles.createBtn}
                  onPress={() => router.push("/create-college-list")}
                >
                  <Text style={styles.createBtnText}>Generate New List</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={savedForms}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.formItem}
                    onPress={() => handleSelect(item)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.formIcon}>
                      <Ionicons name="document-text-outline" size={24} color="#004aad" />
                    </View>
                    <View style={styles.formInfo}>
                      <Text style={styles.formName}>{item.name}</Text>
                      <View style={styles.metaRow}>
                        {/* <Text style={styles.formDate}>{item.date}</Text>
                        <View style={styles.dot} /> */}
                        <Text style={styles.formCount}>
                          {item.results?.length || 0} Colleges
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => deleteSavedForm(item.id)}
                      style={styles.deleteBtn}
                    >
                      <Feather name="trash-2" size={18} color="#ef4444" />
                    </TouchableOpacity>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  whiteContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    overflow: "hidden",
    marginTop: 14,
  },
  listContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  formItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  formIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#e6f0ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  formInfo: {
    flex: 1,
  },
  formName: {
    fontSize: 17,
    fontFamily: "SourceSans3Bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  formDate: {
    fontSize: 13,
    fontFamily: "SourceSans3Medium",
    color: "#64748b",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#cbd5e1",
    marginHorizontal: 8,
  },
  formCount: {
    fontSize: 13,
    fontFamily: "SourceSans3SemiBold",
    color: "#004aad",
  },
  deleteBtn: {
    padding: 10,
    backgroundColor: "#fee2e2",
    borderRadius: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: "SourceSans3Medium",
    color: "#64748b",
    marginTop: 16,
    marginBottom: 24,
  },
  createBtn: {
    backgroundColor: "#ff7a22",
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 999,
  },
  createBtnText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "SourceSans3SemiBold",
  },
});

export default SavedListsScreen;
