import TopHeader from "@/components/TopHeader";
import { colors } from "@/constants/theme";
import React, { useRef, useState } from "react";
import {
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PYQ from "./PYQ";
import Syllabus from "./Syllabus";

export default function Preparation() {
  const [activeTab, setActiveTab] = useState<"pyq" | "syllabus">("pyq");

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 20;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 50) {
          // swipe right
          if (activeTab === "syllabus") setActiveTab("pyq");
        } else if (gestureState.dx < -50) {
          // swipe left
          if (activeTab === "pyq") setActiveTab("syllabus");
        }
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      <TopHeader title="Preparation" showBackArrow={false} />

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "pyq" && styles.activeTab]}
          onPress={() => setActiveTab("pyq")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "pyq" && styles.activeTabText,
            ]}
          >
            PYQ
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "syllabus" && styles.activeTab]}
          onPress={() => setActiveTab("syllabus")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "syllabus" && styles.activeTabText,
            ]}
          >
            Syllabus
          </Text>
        </TouchableOpacity>
      </View>

      {/* Swipeable Content */}
      <View style={styles.contentWrapper} {...panResponder.panHandlers}>
        <View style={{ flex: 1 }}>
          <View
            style={{ flex: 1, display: activeTab === "pyq" ? "flex" : "none" }}
          >
            <PYQ />
          </View>

          <View
            style={{
              flex: 1,
              display: activeTab === "syllabus" ? "flex" : "none",
            }}
          >
            <Syllabus />
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
