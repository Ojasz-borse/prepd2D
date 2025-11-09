import ChecklistIcon from "@/assets/icons/CheckListIcon";
import EstimatorTabIcon from "@/assets/icons/EstimatorTabIcon";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../constants/theme";
import { useAuth } from "../context/AuthContext"; // adjust path if needed

// Add this just below imports
const avatarColors = ["#F06292", "#64B5F6", "#81C784", "#FFD54F", "#BA68C8"];

const getAvatarColor = (name?: string) => {
  if (!name) return avatarColors[0];
  const index = name.toUpperCase().charCodeAt(0) % avatarColors.length;
  return avatarColors[index];
};

const SCREEN_WIDTH = Dimensions.get("window").width;

interface TopHeaderProps {
  title: string;
  showBackArrow: boolean;
}

const TopHeader: React.FC<TopHeaderProps> = ({ title, showBackArrow }) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, logout } = useAuth(); // assuming logout is provided
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-SCREEN_WIDTH * 0.8)).current;

  const initials = (user?.first_name?.[0] || "") + (user?.last_name?.[0] || "");

  const openDrawer = () => {
    setIsDrawerOpen(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeDrawer = () => {
    Animated.timing(slideAnim, {
      toValue: -SCREEN_WIDTH * 0.8,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsDrawerOpen(false);
    });
  };

  return (
    <>
      {/* ===== Top Header ===== */}
      <View style={styles.topHeader}>
        {/* Left side — Profile Icon or Back Arrow */}
        <View style={styles.sideContainer}>
          {showBackArrow ? (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginLeft: -10 }}
            >
              <Ionicons name="arrow-back" size={22} color={colors.textDark} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.profileButton} onPress={openDrawer}>
              <View
                style={[
                  styles.profileCircle,
                  { backgroundColor: getAvatarColor(user?.first_name) },
                ]}
              >
                <Text style={styles.profileInitials}>
                  {initials.toUpperCase()}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* Center Title */}
        <Text numberOfLines={1} style={styles.headerTitle}>
          {title}
        </Text>

        {/* Right Empty Side */}
        <View style={styles.sideContainer} />
      </View>

      {/* ===== Drawer Modal ===== */}

      <Modal
        transparent
        visible={isDrawerOpen}
        animationType="none"
        onRequestClose={closeDrawer}
      >
        {/* Overlay */}
        <Pressable style={styles.overlay} onPress={closeDrawer} />

        {/* Animated Drawer */}
        <Animated.View
          style={[
            styles.drawerContainer,
            {
              transform: [{ translateX: slideAnim }],
              paddingTop: insets.top,
              paddingBottom: insets.bottom + 10, // extra for bottom nav
            },
          ]}
        >
          {/* Drawer Header */}
          <View style={styles.drawerHeader}>
            <View
              style={[
                styles.drawerProfileCircle,
                { backgroundColor: getAvatarColor(user?.first_name) },
              ]}
            >
              <Text style={styles.drawerProfileInitials}>
                {initials.toUpperCase()}
              </Text>
            </View>
            <View style={{ marginLeft: 12 }}>
              <Text
                style={styles.drawerName}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {user?.first_name} {user?.last_name}
              </Text>
              <Text
                style={styles.drawerEmail}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {user?.email}
              </Text>
            </View>
          </View>

          {/* Drawer Content */}
          <View style={styles.drawerContent}>
            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => {
                closeDrawer();
                router.push("/my-list");
              }}
            >
              <ChecklistIcon size={22} />
              <Text style={styles.drawerItemText}>My List</Text>
            </TouchableOpacity>

            <Text style={styles.section}>Tools</Text>

            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => {
                closeDrawer();
                router.push("/estimator");
              }}
            >
              <EstimatorTabIcon size={18} focused={false} />
              <Text style={styles.drawerItemText}>Estimator</Text>
            </TouchableOpacity>
          </View>

          {/* Logout Button */}
          <View style={styles.logoutContainer}>
            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => {
                closeDrawer();
                logout?.();
              }}
            >
              <Ionicons name="log-out-outline" size={22} color="#E53935" />
              <Text style={[styles.drawerItemText, { color: "#E53935" }]}>
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Modal>
    </>
  );
};

export default TopHeader;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f2f2f2" },
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
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 16,
    color: colors.textDark,
    textAlign: "center",
    fontFamily: "SourceSans3Medium",
    flexShrink: 1,
  },
  profileButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  profileCircle: {
    width: 36,
    height: 36,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  profileInitials: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "SourceSans3SemiBold",
  },
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  drawerContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: SCREEN_WIDTH * 0.8,
    backgroundColor: "#fff",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 2, height: 0 },
    shadowRadius: 4,
    justifyContent: "space-between",
  },
  drawerHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  drawerProfileCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  drawerProfileInitials: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "SourceSans3SemiBold",
  },
  drawerName: {
    fontSize: 16,
    color: colors.textDark,
    fontFamily: "SourceSans3SemiBold",
    width: 200,
  },
  drawerEmail: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
    fontFamily: "SourceSans3Medium",
    width: 200,
  },
  drawerContent: {
    padding: 16,
    flexGrow: 1,
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 8,
  },
  drawerItemText: {
    fontSize: 15,
    color: colors.textDark,
    fontFamily: "SourceSans3SemiBold",
  },
  section: {
    fontSize: 12,
    color: "gray",
    fontFamily: "SourceSans3Medium",
    marginTop: 30,
  },
  logoutContainer: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
});
