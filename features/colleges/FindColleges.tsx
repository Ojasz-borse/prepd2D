import TopHeader from "@/components/TopHeader";
import { colors } from "@/constants/theme";
import { useAdvancedColleges } from "@/hooks/useAdvancedColleges";
import React, { useRef, useState, useEffect } from "react";
import {
  LayoutChangeEvent,
  PanResponder,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  UIManager,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import Animated, {
  FadeIn,
  SlideInDown,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import AdvancedFindCollege from "./AdvancedFindCollege";
import NormalFindCollege from "./NormalFindCollege";
import { useSubscriptionLock } from "@/hooks/useSubcribtion";
import SubscriptionLockSheet from "@/components/ShowLockScreen";
import CompareColleges from "./CompareColleges";

if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const QuickAccess = ({
  onTabChange,
}: {
  onTabChange: (tab: "colleges" | "branches" | "compare") => void;
}) => {
  const router = useRouter();

  interface QuickAccessItem {
    title: string;
    icon: string;
    tab?: "colleges" | "branches" | "compare";
    action?: () => void;
  }

  const items: QuickAccessItem[] = [
    { title: "Colleges", icon: "school-outline", tab: "colleges" },
    { title: "Branches", icon: "filter-outline", tab: "branches" },
    { 
      title: "Compare", 
      icon: "git-compare-outline", 
      tab: "compare" 
    },
  ];

  return (
    <View style={styles.quickCard}>
      <Text style={styles.quickHeading}>Quick Access</Text>
      <View style={styles.quickGrid}>
        {items.map((item, i) => (
          <TouchableOpacity
            key={i}
            activeOpacity={0.7}
            style={[
              styles.quickItem,
              item.tab === "compare" && { width: "100%" },
            ]}
            onPress={() => item.action ? item.action() : onTabChange(item.tab!)}
          >
            <View
              style={[
                styles.quickIconBox,
                {
                  backgroundColor:
                    item.tab === "colleges"
                      ? "#004aad20"
                      : item.tab === "branches"
                      ? "#b6cf4f20"
                      : "#ff7a2220",
                },
              ]}
            >
              <Ionicons
                name={item.icon as any}
                size={24}
                color={
                  item.tab === "colleges"
                    ? "#004aad"
                    : item.tab === "branches"
                    ? "#b6cf4f"
                    : "#ff7a22"
                }
              />
            </View>
            <Text style={styles.quickTitle}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default function FindColleges() {
  const [activeTab, setActiveTab] = useState<
    "all" | "colleges" | "branches" | "compare"
  >("all");

  const { user } = useAuth();
  const {
    colleges,
    collegesLoading,
    branches,
    branchesLoading,
    branchesError,
  } = useAdvancedColleges();

  const { isAllowed, showLock, closeLock } = useSubscriptionLock({
    gate: "after", // 👈 IMPORTANT
    delay: 3000,
    condition: !branchesLoading && activeTab !== "all",
  });

  // The hook internalizes the locking effect based on the condition now.

  // Indicator animation
  const [tabMeasurements, setTabMeasurements] = useState<{
    [key: string]: { x: number; width: number };
  }>({});
  const indicatorX = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);

  useEffect(() => {
    const m = tabMeasurements[activeTab];
    if (m) {
      indicatorX.value = withTiming(m.x, { duration: 180 });
      indicatorWidth.value = withTiming(m.width, { duration: 180 });
    }
  }, [activeTab, tabMeasurements]);

  const onTabLayout = (tab: string, e: LayoutChangeEvent) => {
    const { x, width } = e.nativeEvent.layout;
    setTabMeasurements((prev) => ({ ...prev, [tab]: { x, width } }));
  };

  const indicatorStyle = useAnimatedStyle(() => ({
    width: indicatorWidth.value,
    transform: [{ translateX: indicatorX.value }],
  }));

  // Swipe handler
  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 20,
      onPanResponderRelease: (_, g) => {
        if (g.dx < -50) {
          if (activeTab === "all") setActiveTab("colleges");
          else if (activeTab === "colleges") setActiveTab("branches");
          else if (activeTab === "branches") setActiveTab("compare");
        }
        if (g.dx > 50) {
          if (activeTab === "compare") setActiveTab("branches");
          else if (activeTab === "branches") setActiveTab("colleges");
          else if (activeTab === "colleges") setActiveTab("all");
        }
      },
    })
  ).current;

  return (
    <LinearGradient
      colors={["#f8fafc", "#e6f1ff", "#e8dcff"]}
      locations={[0, 0.5, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <TopHeader title="Find Colleges" showBackArrow={false} />

      {/* Tabs */}
      <View style={styles.tabBar}>
        <Animated.View style={[styles.indicatorContainer, indicatorStyle]}>
          <View style={styles.indicator} />
        </Animated.View>

        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab("all")}
          onLayout={(e) => onTabLayout("all", e)}
        >
          <Text
            style={[
              styles.tabLabel,
              activeTab === "all" && styles.tabLabelActive,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab("colleges")}
          onLayout={(e) => onTabLayout("colleges", e)}
        >
          <Text
            style={[
              styles.tabLabel,
              activeTab === "colleges" && styles.tabLabelActive,
            ]}
          >
            Colleges
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab("branches")}
          onLayout={(e) => onTabLayout("branches", e)}
        >
          <Text
            style={[
              styles.tabLabel,
              activeTab === "branches" && styles.tabLabelActive,
            ]}
          >
            Branches
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab("compare")}
          onLayout={(e) => onTabLayout("compare", e)}
        >
          <Text
            style={[
              styles.tabLabel,
              activeTab === "compare" && styles.tabLabelActive,
            ]}
          >
            Compare
          </Text>
        </TouchableOpacity>
      </View>

      {/* Swipeable content */}
      <View style={styles.contentArea} {...pan.panHandlers}>
        {activeTab === "all" && (
          <View style={{ paddingHorizontal: 16, flex: 1 }}>
            {/* Banner same as Prep */}
            <LinearGradient
              colors={["#004aad", "#0073e6"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.banner}
            >
              <View style={styles.bannerRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.bannerHead}>Find Best Colleges!</Text>
                  <Text style={styles.bannerSub}>
                    Explore colleges and branches quickly and easily.
                  </Text>
                </View>
                <View style={styles.bannerIconWrap}>
                  <Feather name="search" size={34} color="#fff" />
                </View>
              </View>
            </LinearGradient>

            <QuickAccess onTabChange={setActiveTab} />
          </View>
        )}

        {activeTab === "colleges" && (
          <View style={{ paddingHorizontal: 12 }}>
            <NormalFindCollege
              colleges={colleges}
              loading={collegesLoading}
              error={branchesError}
              isActive={true}
            />
          </View>
        )}

        {activeTab === "branches" && (
          <View style={{ paddingHorizontal: 12 }}>
            <AdvancedFindCollege
              branches={branches}
              loading={branchesLoading}
              error={branchesError}
              isActive={true}
            />
          </View>
        )}

        {activeTab === "compare" && (
          <View style={{ paddingHorizontal: 12, flex: 1 }}>
            <CompareColleges colleges={colleges} isAllowed={isAllowed} />
          </View>
        )}

        {showLock && (
          <SubscriptionLockSheet
            visible={showLock}
            planType="after"
            // onClose={closeLock}
          />
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  contentArea: {
    flex: 1,
    paddingTop: 8,
  },

  container: { flex: 1 },

  /* Tab Bar like Preparation.tsx */
  tabBar: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginTop: -10,
    gap: 28,
    borderBottomWidth: 1,
    borderBottomColor: "#d3d3d350",
    position: "relative",
    justifyContent: "flex-start",
    backgroundColor: "#fff",
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 4,
    zIndex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: {
    fontSize: 17,
    fontFamily: "SourceSans3SemiBold",
    color: "#737373",
  },
  tabLabelActive: {
    color: colors.primary,
  },

  indicatorContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: 3,
    zIndex: 0,
  },
  indicator: {
    height: 3,
    width: "100%",
    backgroundColor: colors.primary,
    borderRadius: 2,
  },

  /* Banner like Preparation.tsx */
  banner: {
    borderRadius: 20,
    padding: 20,
    marginTop: 12,
    marginBottom: 6,
  },
  bannerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bannerHead: {
    fontSize: 20,
    fontFamily: "SourceSans3Bold",
    color: "#fff",
    marginBottom: 4,
  },
  bannerSub: {
    fontSize: 14,
    fontFamily: "SourceSans3Medium",
    color: "#e6f1ff",
    lineHeight: 20,
    paddingRight: 10,
  },
  bannerIconWrap: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 10,
    borderRadius: 15,
  },

  /* Quick Access Card same as Prep */
  quickCard: {
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 18,
    padding: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  quickHeading: {
    fontSize: 18,
    fontFamily: "SourceSans3SemiBold",
    color: "#004aad",
    marginBottom: 16,
  },
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  quickItem: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  quickIconBox: {
    padding: 12,
    borderRadius: 12,
  },
  quickTitle: {
    fontSize: 16,
    fontFamily: "SourceSans3SemiBold",
    color: "#2E2E32",
  },

  lockScreenContainer: {
    flex: 1,
    backgroundColor: "#00000050",
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    bottom: -2,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  content: {
    width: "100%",
    position: "absolute",
    left: 0,
    bottom: -10,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    paddingBottom: 40,
    alignItems: "center",
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#e2e8f0",
    borderRadius: 2,
    marginBottom: 20,
  },
  iconContainer: {
    marginBottom: 20,
  },
  lockCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#004aad",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#004aad",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontFamily: "SourceSans3Bold",
    color: "#004aad",
    marginBottom: 12,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    fontFamily: "SourceSans3Medium",
    color: "#64748b",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
});
