import TopHeader from "@/components/TopHeader";
import { colors } from "@/constants/theme";
import { useNormalColleges } from "@/hooks/useNormalColleges";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AdvancedFindCollege from "./AdvancedFindCollege";
import NormalFindCollege from "./NormalFindCollege";

export default function FindColleges() {
  const [activeTab, setActiveTab] = useState<"normal" | "advanced">("normal");
  const { colleges, loading, error } = useNormalColleges();
  const renderContent = () => {
    if (activeTab === "normal")
      return (
        <NormalFindCollege
          colleges={colleges}
          loading={loading}
          error={error}
        />
      );
    return <AdvancedFindCollege />;
  };

  return (
    <View style={styles.container}>
      <TopHeader title="Find Colleges" showBackArrow={false} />

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
  tabText: {
    fontSize: 16,
    color: colors.textDark,
    fontFamily: "WixMadeforTextMedium",
  },
  activeTabText: { color: colors.primary },

  // Content
  contentWrapper: { flex: 1, paddingHorizontal: 12, paddingTop: 8 },
});
