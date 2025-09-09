import TopHeader from "@/components/TopHeader";
import { colors } from "@/constants/theme";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AdvancedFindCollege from "./AdvancedFindCollege";
import NormalFindCollege from "./NormalFindCollege";

export default function FindColleges() {
  const [activeTab, setActiveTab] = useState<"normal" | "advanced">("normal");

  const renderContent = () => {
    if (activeTab === "normal") return <NormalFindCollege />;
    return <AdvancedFindCollege />;
  };

  return (
    <View style={styles.container}>
      <TopHeader title="Find Colleges" />

      {/* Tab Buttons */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "normal" && styles.activeTab]}
          onPress={() => setActiveTab("normal")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "normal" && styles.activeTabText,
            ]}
          >
            Normal Search
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "advanced" && styles.activeTab]}
          onPress={() => setActiveTab("advanced")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "advanced" && styles.activeTabText,
            ]}
          >
            Advanced Search
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.contentWrapper}>{renderContent()}</View>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  // Tabs
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#d3d3d3",
    backgroundColor: "#fff",
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#fff",
  },
  activeTab: { borderBottomColor: colors.primary },
  tabText: { fontSize: 16, color: colors.textDark, fontFamily: "BreeSerif" },
  activeTabText: { color: colors.primary },

  // Search + Filter Bar
  filterBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    margin: 12,
    alignItems: "center",
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: "BreeSerif",
  },
  filterButton: {
    marginLeft: 10,
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  filterText: { color: "#fff", fontWeight: "600" },

  // Picker
  pickerContainer: {
    marginHorizontal: 12,
    marginBottom: 10,
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  picker: {
    height: 48,
    width: "100%",
    color: "#000",
  },

  // Content
  contentWrapper: { flex: 1, paddingHorizontal: 12, paddingTop: 8 },
});
