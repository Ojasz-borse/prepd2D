import TopHeader from "@/components/TopHeader";
import { colors } from "@/constants/theme";
import { useAdvancedColleges } from "@/hooks/useAdvancedColleges";
import { useNormalColleges } from "@/hooks/useNormalColleges";
import React, { useRef, useState } from "react";
import {
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AdvancedFindCollege from "./AdvancedFindCollege";
import NormalFindCollege from "./NormalFindCollege";

export default function FindColleges() {
  const [activeTab, setActiveTab] = useState<"normal" | "advanced">("normal");
  const { colleges, loading, error } = useNormalColleges();
  const { branches, branchesLoading, branchesError } = useAdvancedColleges();

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // only trigger if horizontal swipe
        return Math.abs(gestureState.dx) > 20;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 50 && activeTab === "advanced") {
          // swipe right → go back to normal
          setActiveTab("normal");
        } else if (gestureState.dx < -50 && activeTab === "normal") {
          // swipe left → go to advanced
          setActiveTab("advanced");
        }
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      <TopHeader title="Find Colleges" showBackArrow={false} />

      {/* Custom Tabs */}
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

      {/* Swipeable Content */}
      <View style={styles.contentWrapper} {...panResponder.panHandlers}>
        <View style={{ flex: 1 }}>
          <View
            style={{
              flex: 1,
              display: activeTab === "normal" ? "flex" : "none",
            }}
          >
            <NormalFindCollege
              colleges={colleges}
              loading={loading}
              error={error}
            />
          </View>
          <View
            style={{
              flex: 1,
              display: activeTab === "advanced" ? "flex" : "none",
            }}
          >
            <AdvancedFindCollege
              branches={branches}
              loading={branchesLoading}
              error={branchesError}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#d3d3d3",
    backgroundColor: "#fff",
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
    fontFamily: "SourceSans3Medium",
  },
  activeTabText: { color: colors.primary },

  contentWrapper: { flex: 1, paddingHorizontal: 12, paddingTop: 8 },
});
