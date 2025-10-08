import { ProfilePageIcon } from "@/assets/icons/ProfilePageIcon";
import AdvancedFindCollegeCard from "@/components/AdvancedFindCollegeCard";
import AdvancedFindCollegeCardSkeleton from "@/components/AdvancedFindCollegeCardSkeleton";
import TopHeader from "@/components/TopHeader";
import { useAuth } from "@/context/AuthContext";
import { useAdvancedColleges } from "@/hooks/useAdvancedColleges";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import {
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";
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

interface CollegeBranch {
  branch_name: string;
  choice_code: string;
  college_code: string;
  district: string;
  is_autonomous: boolean;
  is_government: boolean;
  name: string;
  standard_cutoff_data: StandardCutoffData[];
}

interface StandardCutoffData {
  rank: number;
  category: string;
  percentile: number;
}

const MemoizedCard = React.memo(AdvancedFindCollegeCard);

export default function ProfileView() {
  const { user, loading } = useAuth();

  const [activeTab, setActiveTab] = useState<"My List" | "">("My List");

  const { branches, branchesLoading } = useAdvancedColleges();
  const [filteredData, setFilteredData] = useState<CollegeBranch[]>([]);
  const [saving, setSaving] = useState(false);

  // Load cached list and filter colleges in order
  useEffect(() => {
    const loadList = async () => {
      const cached = await AsyncStorage.getItem("myList");
      let existingCodes: string[] = cached ? JSON.parse(cached) : [];

      // Arrange branches in sequence of choice_code
      const sorted = existingCodes
        .map((code) => branches.find((b) => b.choice_code === code))
        .filter(Boolean) as CollegeBranch[];

      setFilteredData(sorted);
    };

    if (branches.length > 0) loadList();
  }, [branches]);

  // Save new order
  const handleSave = async () => {
    setSaving(true);
    const newOrder = filteredData.map((b) => b.choice_code);
    await AsyncStorage.setItem("myList", JSON.stringify(newOrder));
    setSaving(false);
    alert("✅ List updated!");
  };

  const renderItem = ({
    item,
    drag,
    isActive,
  }: RenderItemParams<CollegeBranch>) => {
    return (
      <Pressable onLongPress={drag}>
        <MemoizedCard item={item} onLongPress={drag} />
      </Pressable>
    );
  };

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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TopHeader title="Profile" showBackArrow={false} />
        {/* 🔹 Profile content */}
        <View style={styles.container}>
          {/* Header */}

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
          </View>

          {/* Swipeable Content */}
          <View style={styles.contentWrapper} {...panResponder.panHandlers}>
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flex: 1,
                  display: activeTab === "My List" ? "flex" : "none",
                }}
              >
                <View style={{ flex: 1 }}>
                  <DraggableFlatList
                    data={filteredData}
                    keyExtractor={(item) => item.choice_code}
                    renderItem={renderItem}
                    onDragEnd={({ data }) => setFilteredData(data)}
                    activationDistance={10} // drag starts after moving 10px
                    autoscrollSpeed={50} // helps when dragging near edges
                    autoscrollThreshold={80} // starts auto-scroll sooner
                    animationConfig={{
                      mass: 0.5,
                      damping: 20,
                      stiffness: 150,
                      overshootClamping: false,
                    }}
                    ListEmptyComponent={
                      branchesLoading ? (
                        <>
                          <AdvancedFindCollegeCardSkeleton />
                          <AdvancedFindCollegeCardSkeleton />
                          <AdvancedFindCollegeCardSkeleton />
                        </>
                      ) : (
                        <Text style={styles.noResult}>No colleges found</Text>
                      )
                    }
                    contentContainerStyle={{
                      padding: 4,
                      paddingTop: 16,
                      paddingBottom: 80, // space for button
                    }}
                  />

                  {filteredData.length > 0 && (
                    <TouchableOpacity
                      style={styles.saveBtn}
                      onPress={handleSave}
                      disabled={saving}
                    >
                      <Text style={styles.saveBtnText}>
                        {saving ? "Saving..." : "Save Order"}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          </View>
        </View>
    </GestureHandlerRootView>
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
    marginTop: 10,
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
  noResult: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#555",
  },
  saveBtn: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#063866",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
