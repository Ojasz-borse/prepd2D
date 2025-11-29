import TopHeader from "@/components/TopHeader";
import { colors } from "@/constants/theme";
import { useMockTests } from "@/hooks/useMockTests";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MockTestList from "./MockTestList";

const MockTestScreen = () => {
  const router = useRouter();
  const { tests, loading, error } = useMockTests();
  const [activeTab, setActiveTab] = useState<"mock" | "analysis">("mock");

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > 20,

      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 50 && activeTab === "analysis") {
          setActiveTab("mock");
        } else if (gestureState.dx < -50 && activeTab === "mock") {
          setActiveTab("analysis");
        }
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      <TopHeader title="Mock Tests" showBackArrow={false} />

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "mock" && styles.activeTab]}
          onPress={() => setActiveTab("mock")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "mock" && styles.activeTabText,
            ]}
          >
            Mock Tests
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "analysis" && styles.activeTab]}
          onPress={() => setActiveTab("analysis")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "analysis" && styles.activeTabText,
            ]}
          >
            Analysis
          </Text>
        </TouchableOpacity>
      </View>

      {/* Swipeable Content Area */}
      <View style={styles.contentWrapper} {...panResponder.panHandlers}>
        {/* Mock Test Tab */}
        <View
          style={{ flex: 1, display: activeTab === "mock" ? "flex" : "none" }}
        >
          <MockTestList tests={tests} loading={loading} error={error} />
        </View>
        {/* Analysis Tab */}
        <View
          style={{
            flex: 1,
            display: activeTab === "analysis" ? "flex" : "none",
          }}
        >
          <View style={styles.centerBox}>
            <Text style={styles.analysisText}>Analysis Coming Soon</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default MockTestScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  /** Tabs */
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
  activeTab: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: colors.textDark,
    fontFamily: "SourceSans3Medium",
  },
  activeTabText: {
    color: colors.primary,
  },

  /** Content */
  contentWrapper: {
    flex: 1,
    padding: 14,
  },

  card: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 20,
    backgroundColor: "#fff",
    elevation: 3,
    marginBottom: 15,
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

  error: {
    textAlign: "center",
    color: "red",
    marginTop: 40,
  },

  centerBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  analysisText: {
    fontSize: 16,
    color: "#333",
    fontFamily: "SourceSans3Medium",
  },
});
