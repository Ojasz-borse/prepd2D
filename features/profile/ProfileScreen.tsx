import { ProfilePageIcon } from "@/assets/icons/ProfilePageIcon";
import TopHeader from "@/components/TopHeader";
import { useAuth } from "@/context/AuthContext";
import React, { useRef, useState } from "react";
import {
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Circle, Defs, RadialGradient, Stop, Svg } from "react-native-svg";
import { colors } from "../../constants/theme";

// 🔹 GlowBall Component
function GlowBall({
  bottom,
  right,
  top,
  left,
}: {
  bottom?: number;
  right?: number;
  top?: number;
  left?: number;
}) {
  const size = 800; // glow size
  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        bottom,
        right,
        top,
        left,
        width: size,
        height: size,
        zIndex: 0, // keep glow behind everything
      }}
    >
      <Svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <RadialGradient id="glow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#063866" stopOpacity="0.6" />
            <Stop offset="40%" stopColor="#063866" stopOpacity="0.3" />
            <Stop offset="100%" stopColor="#063866" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Circle cx={size / 2} cy={size / 2} r={size / 2} fill="url(#glow)" />
      </Svg>
    </View>
  );
}

export default function ProfileView() {
  const { user, loading } = useAuth();

  const [activeTab, setActiveTab] = useState<"My List" | "">("My List");

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // only trigger if horizontal swipe
        return Math.abs(gestureState.dx) > 20;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 50 && activeTab === "My List") {
          // swipe right → go back to normal
          setActiveTab("My List");
        } else if (gestureState.dx < -50 && activeTab === "") {
          // swipe left → go to advanced
          setActiveTab("");
        }
      },
    })
  ).current;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <GlowBall bottom={-400} right={-400} />

      {/* 🔹 Profile content */}
      <View style={styles.container}>
        {/* Header */}
        <TopHeader title="Profile" showBackArrow={true} />

        <View style={styles.profileSection}>
          {/* Profile Icon on Left */}
          <View style={styles.profileWrapper}>
            <ProfilePageIcon size={100} focused={false} />
          </View>

          {/* User Info on Right */}
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>
              {!loading && user?.first_name + " " + user?.last_name}
            </Text>
            <Text style={styles.userEmail}>{user?.email}</Text>

            <View style={styles.groupBadge}>
              <Text style={styles.groupText}>{user?.group}</Text>
            </View>
          </View>
        </View>

        {/* Custom Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "My List" && styles.activeTab]}
            onPress={() => setActiveTab("My List")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "My List" && styles.activeTabText,
              ]}
            >
              My List
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "" && styles.activeTab]}
            onPress={() => setActiveTab("")}
          >
            <Text
              style={[styles.tabText, activeTab === "" && styles.activeTabText]}
            ></Text>
          </TouchableOpacity>
        </View>

        {/* Swipeable Content */}
        <View style={styles.contentWrapper} {...panResponder.panHandlers}>
          <View style={{ flex: 1 }}>
            <View
              style={{
                flex: 1,
                display: activeTab === "My List" ? "flex" : "none",
              }}
            ></View>
            <View
              style={{
                flex: 1,
                display: activeTab === "" ? "flex" : "none",
              }}
            ></View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "" },

  profileSection: {
    flexDirection: "row", // side by side
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 20,
  },

  profileWrapper: {
    marginRight: 16, // space between icon and text
  },

  profileInfo: {
    flex: 1,
    alignItems: "flex-start", // left aligned
  },

  userName: {
    fontSize: 18,
    color: colors.textDark,
    fontFamily: "SourceSans3Medium",
  },

  userEmail: {
    fontSize: 16,
    color: colors.textLight,
    fontFamily: "SourceSans3Medium",
  },

  groupBadge: {
    backgroundColor: "#063866",
    paddingVertical: 1,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginTop: 8,
    alignSelf: "flex-start", // keeps badge left-aligned
  },

  groupText: {
    color: "#fff",
    fontFamily: "SourceSans3Medium",
    fontSize: 12,
  },
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
