// components/TopHeader.tsx
import { ProfileTabIcon } from "@/assets/icons/ProfileTabIcon";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../constants/theme";

interface TopHeaderProps {
  title: string;
}

const TopHeader: React.FC<TopHeaderProps> = ({ title }) => {
  const router = useRouter();

  return (
    <View style={styles.topHeader}>
      <Text style={styles.headerTitle}>{title}</Text>

      <TouchableOpacity
        style={styles.profileIconContainer}
        onPress={() => router.push("/profile")}
      >
        <ProfileTabIcon size={28} focused={false} />
      </TouchableOpacity>
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
  headerTitle: {
    fontSize: 16,
    color: colors.textDark,
    textAlign: "center",
    flex: 1,
    fontFamily: "BreeSerif",
  },
  profileIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
});
