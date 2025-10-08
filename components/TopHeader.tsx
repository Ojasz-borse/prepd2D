import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../constants/theme";

interface TopHeaderProps {
  title: string;
  showBackArrow: boolean;
}

const TopHeader: React.FC<TopHeaderProps> = ({ title, showBackArrow }) => {
  const router = useRouter();

  return (
    <View style={styles.topHeader}>
      {/* Left Side (Back Arrow or Placeholder for Alignment) */}
      <View style={styles.sideContainer}>
        {showBackArrow ? (
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={colors.textDark} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 22 }} /> // Keeps spacing consistent
        )}
      </View>

      {/* Center Title */}
      <Text numberOfLines={1} style={styles.headerTitle}>
        {title}
      </Text>

      {/* Right Floating Button */}
      <View style={styles.sideContainer}>
        {/* <View>
          <TouchableOpacity
            style={{ borderRadius: 20, overflow: "hidden" }}
            onPress={() => router.push("/ai-chat")}
          >
            <LinearGradient
              colors={["#e699ff", "#99b3ff"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.sendButton}
            >
              <Text style={styles.sendButtonText}>Prep AI</Text>
              <FontAwesome5 name="magic" size={15} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View> */}
      </View>
    </View>
  );
};

export default TopHeader;

const styles = StyleSheet.create({
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: "#fff",
    shadowColor: "#d3d3d3",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
    zIndex: 10,
  },
  sideContainer: {
    width: 70, // Fixed width ensures title stays centered
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 16,
    color: colors.textDark,
    textAlign: "center",
    fontFamily: "SourceSans3Medium",
    flexShrink: 1,
  },
  sendButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  sendButtonText: {
    color: "#fff",
    fontFamily: "SourceSans3Medium",
    fontSize: 15,
  },
});
