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
import { useAuth } from "../context/AuthContext";

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
  const { user, logout } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

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

        <Text numberOfLines={1} style={styles.headerTitle}>
          {title}
        </Text>

        <View style={styles.sideContainer} />
      </View>

      {/* ===== Drawer ===== */}
      <Modal transparent visible={isDrawerOpen} animationType="none">
        <Pressable style={styles.overlay} onPress={closeDrawer} />

        <Animated.View
          style={[
            styles.drawerContainer,
            {
              transform: [{ translateX: slideAnim }],
              paddingTop: insets.top,
              paddingBottom: insets.bottom + 10,
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
              <Text style={styles.drawerName}>
                {user?.first_name} {user?.last_name}
              </Text>
              <Text style={styles.drawerEmail}>{user?.email}</Text>
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

          {/* ===== Help + Logout Section ===== */}
          <View style={styles.logoutContainer}>
            {/* ⭐ NEW — HELP BUTTON */}
            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => {
                closeDrawer();
                router.push("/help");
              }}
            >
              <Ionicons name="help-circle-outline" size={22} color="#3399ff" />
              <Text style={[styles.drawerItemText, { color: "#3399ff" }]}>
                Help & Support
              </Text>
            </TouchableOpacity>

            {/* Logout Button */}
            <TouchableOpacity
              style={[
                styles.drawerItem,
                {
                  marginTop: 6,
                  backgroundColor: "#E5393520",
                  padding: 10,
                  borderRadius: 25,
                  width: 110,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                },
              ]}
              onPress={() => {
                setShowLogoutConfirm(true); // open confirmation
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

      {/* ===== Logout Confirmation Modal ===== */}
      <Modal transparent visible={showLogoutConfirm} animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "80%",
              backgroundColor: "#fff",
              padding: 20,
              borderRadius: 16,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: "SourceSans3Medium",
                color: colors.textDark,
                marginBottom: 10,
              }}
            >
              Are you sure you want to logout?
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 20,
              }}
            >
              <TouchableOpacity
                onPress={() => setShowLogoutConfirm(false)}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 30,
                  borderRadius: 25,
                  backgroundColor: "#eee",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "SourceSans3Medium",
                    color: "#333",
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setShowLogoutConfirm(false);
                  closeDrawer();
                  logout?.();
                }}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 30,
                  borderRadius: 25,
                  backgroundColor: "#E53935",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "SourceSans3Medium",
                    color: "#fff",
                  }}
                >
                  Logout
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
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
    elevation: 4,
  },
  sideContainer: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 16,
    color: colors.textDark,
    fontFamily: "SourceSans3Medium",
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
    shadowColor: "#000",
    shadowOpacity: 0.3,
    elevation: 10,
    justifyContent: "space-between",
  },
  drawerHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
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
    fontFamily: "SourceSans3SemiBold",
    color: colors.textDark,
    width: 200,
  },
  drawerEmail: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
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
    fontFamily: "SourceSans3SemiBold",
    color: colors.textDark,
  },
  section: {
    fontSize: 12,
    color: "gray",
    marginTop: 30,
    fontFamily: "SourceSans3Medium",
  },
  logoutContainer: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
});
