import { ProfilePageIcon } from "@/assets/icons/ProfilePageIcon";
import TopHeader from "@/components/TopHeader";
import { useAuth } from "@/context/AuthContext";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <GlowBall bottom={-400} right={-400} />

      {/* 🔹 Profile content */}
      <View style={styles.container}>
        {/* Header */}
        <TopHeader title="Profile" showBackArrow={true} />

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileWrapper}>
            <ProfilePageIcon size={150} focused={false} />
          </View>

          <Text style={styles.userName}>
            {!loading && user?.first_name + " " + user?.last_name}
          </Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.groupBadge}>
            <Text style={styles.groupText}>{user?.group}</Text>
          </View>
        </View>

        <View style={styles.horizontalLine} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textDark,
    fontFamily: "BreeSerif",
  },

  profileSection: {
    alignItems: "center",
    marginTop: 30,
  },
  profileWrapper: {
    position: "relative",
  },
  profilePic: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 3,
    borderColor: colors.primary,
  },

  userName: {
    fontSize: 26,
    color: colors.textDark,
    marginTop: 12,
    fontFamily: "BreeSerif",
  },
  userEmail: {
    fontSize: 16,
    color: colors.textLight,
    marginTop: 4,
    fontFamily: "BreeSerif",
  },

  infoSection: {
    marginTop: 40,
    paddingHorizontal: 24,
  },
  infoRow: {
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "BreeSerif",
  },

  label: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 4,
    fontFamily: "BreeSerif",
  },
  value: {
    fontSize: 16,
    color: colors.textDark,
    fontWeight: "500",
    fontFamily: "BreeSerif",
  },
  groupBadge: {
    backgroundColor: "#063866",
    paddingVertical: 2,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginTop: 10,
  },
  groupText: {
    color: "#fff",
    fontFamily: "BreeSerif",
    fontSize: 14,
  },
  horizontalLine: {
    height: 1.5,
    backgroundColor: colors.border,
    marginHorizontal: 30,
    marginTop: 8,
  },
});
