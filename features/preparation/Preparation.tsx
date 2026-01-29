import TopHeader from "@/components/TopHeader";
import { colors } from "@/constants/theme";
import React, { useRef, useState, useEffect } from "react";
import {
  LayoutChangeEvent,
  PanResponder,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}
import PYQ from "./PYQ";
import Syllabus from "./Syllabus";
import Notes from "./Notes";
import { usePYQS } from "@/hooks/usePYQS";

import { Ionicons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSubscriptionLock } from "@/hooks/useSubcribtion";
import SubscriptionLockSheet from "@/components/ShowLockScreen";
import { useAuth } from "@/context/AuthContext";

const PopularSearches = ({ onTabChange }: { onTabChange: (tab: "notes" | "pyq" | "syllabus") => void }) => {
  const router = useRouter();

  const items = [
    { title: "Notes", icon: "document-text-outline", tab: "notes" as const },
    { title: "PYQ", icon: "book-outline", tab: "pyq" as const },
    { title: "Syllabus", icon: "clipboard-outline", tab: "syllabus" as const },
  ];

  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Quick Access</Text>

      <View style={styles.gridContainer}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.7}
            style={styles.gridItem}
            onPress={() => onTabChange(item.tab)}
          >
            <View style={[
              styles.iconBox,
              {
                backgroundColor:
                  item.title === "Notes" ? "#ff5e3220" :
                    item.title === "PYQ" ? "#004aad20" :
                      item.title === "Syllabus" ? "#b6cf4f20" :
                        "#fff",
              },
            ]}>
              <Ionicons name={item.icon as any} size={24} color={
                item.title === "Notes" ? "#ff5e32" :
                  item.title === "PYQ" ? "#004aad" :
                    "#b6cf4f"
              } />
            </View>
            <Text style={styles.gridTitle}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const QuestionBank = () => {
  const router = useRouter();
  const items = [
    {
      title: "Most Repeating Questions",
      subTitle: "150 PYQ's",
      icon: "repeat-outline",
      color: "#FF9800",
      route: "/repeated-pyqs",

    },
    { title: "Top Easy Questions", subTitle: "150 PYQ's", icon: "rocket-outline", color: "#4CAF50", route: "/difficulty-pyqs", params: { difficulty: "Easy" } },
    { title: "Top Hard Questions", subTitle: "150 PYQ's", icon: "flame-outline", color: "#F44336", route: "/difficulty-pyqs", params: { difficulty: "Hard" } },
  ];

  return (
    <View style={[styles.card, { marginTop: 16, marginBottom: 16 }]}>
      <Text style={styles.heading}>Question Bank</Text>

      <View style={{ gap: 12 }}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.7}
            style={[styles.gridItem, { width: "100%" }]}
            onPress={() => {
              if (item.route) {
                router.push({
                  pathname: item.route as any,
                  params: item.params
                });
              }
            }}
          >
            <View style={[
              styles.iconBox,
              {
                backgroundColor: item.color + "20",
              },
            ]}>
              <Ionicons name={item.icon as any} size={24} color={item.color} />
            </View>
            <Text style={styles.gridTitle}>{item.title}</Text>
            <Text style={styles.gridSubTitle}>{item.subTitle}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default function Preparation() {
  const [activeTab, setActiveTab] = useState<
    "all" | "notes" | "pyq" | "syllabus"
  >("all");
  const { pyqs, loading, error, reload } = usePYQS();

  const { user } = useAuth();

  const { isAllowed } = useSubscriptionLock({
    gate: "before",
  });
  const [showLock, setShowLock] = useState(false);

  useEffect(() => {
    const isLockedTab = activeTab === "pyq";
    const isLoading = loading;

    if (!isLoading && !isAllowed && isLockedTab) {
      const timer = setTimeout(() => {
        setShowLock(true);
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      setShowLock(false);
    }
  }, [activeTab, loading, isAllowed]);

  // Store layout for each tab { x, width }
  const [tabMeasurements, setTabMeasurements] = useState<{ [key: string]: { x: number; width: number } }>({});

  const indicatorX = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);

  // Map tabs to keys
  const tabs: ("all" | "notes" | "pyq" | "syllabus")[] = ["all", "notes", "pyq", "syllabus"];

  useEffect(() => {
    const measurement = tabMeasurements[activeTab];
    if (measurement) {
      indicatorX.value = withSpring(measurement.x, { mass: 0.5, stiffness: 120, damping: 15 });
      indicatorWidth.value = withSpring(measurement.width, { mass: 0.5, stiffness: 120, damping: 15 });
    }
  }, [activeTab, tabMeasurements]);

  const onTabLayout = (tab: string, event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;
    setTabMeasurements((prev) => {
      // Only update if changed to avoid loop (though layout usually stable)
      if (prev[tab]?.x === x && prev[tab]?.width === width) return prev;
      return { ...prev, [tab]: { x, width } };
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > 20,
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 50) {
          if (activeTab === "syllabus") setActiveTab("pyq");
          else if (activeTab === "pyq") setActiveTab("notes");
          else if (activeTab === "notes") setActiveTab("all");
        } else if (gestureState.dx < -50) {
          if (activeTab === "all") setActiveTab("notes");
          else if (activeTab === "notes") setActiveTab("pyq");
          else if (activeTab === "pyq") setActiveTab("syllabus");
        }
      },
    })
  ).current;

  const handleTabChange = (tab: "all" | "notes" | "pyq" | "syllabus") => {
    setActiveTab(tab);
  };

  const indicatorStyle = useAnimatedStyle(() => {
    return {
      width: indicatorWidth.value,
      transform: [{ translateX: indicatorX.value }],
    };
  });

  return (
    <LinearGradient
      colors={["#f8fafc", "#e6f1ff", "#e8dcff"]}
      locations={[0, 0.5, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Keep Top Header */}
      <TopHeader title="Preparation" />

      <View style={styles.tabContainer}>
        {/* Animated Indicator */}
        {/* Only render indicator if we have measurement for at least the first tab or active tab to avoid jumping from 0 */}
        <Animated.View style={[
          styles.movingIndicatorContainer,
          indicatorStyle
        ]}>
          <View style={styles.movingIndicator} />
        </Animated.View>

        <TouchableOpacity
          style={styles.tab}
          onPress={() => handleTabChange("all")}
          onLayout={(e) => onTabLayout("all", e)}
        >
          <Text
            style={[styles.tabText, activeTab === "all" && styles.activeTabText]}
          >
            All
          </Text>
        </TouchableOpacity>


        <TouchableOpacity
          style={styles.tab}
          onPress={() => handleTabChange("syllabus")}
          onLayout={(e) => onTabLayout("syllabus", e)}
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

        <TouchableOpacity
          style={styles.tab}
          onPress={() => handleTabChange("notes")}
          onLayout={(e) => onTabLayout("notes", e)}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "notes" && styles.activeTabText,
            ]}
          >
            Notes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tab}
          onPress={() => handleTabChange("pyq")}
          onLayout={(e) => onTabLayout("pyq", e)}
        >
          <Text
            style={[styles.tabText, activeTab === "pyq" && styles.activeTabText]}
          >
            PYQ
          </Text>
        </TouchableOpacity>

      </View>

      {/* Content */}
      <View style={styles.contentWrapper} {...panResponder.panHandlers}>
        {activeTab === "all" && (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            showsVerticalScrollIndicator={true}
          >
            {/* Banner */}
            <LinearGradient
              colors={["#004aad", "#0073e6"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.banner}
            >
              <View style={styles.bannerContent}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.bannerTitle}>Start Your Prep!</Text>
                  <Text style={styles.bannerSubtitle}>
                    Access Notes, PYQs, and Syllabus all in one place.
                  </Text>
                </View>
                <View style={styles.bannerIcon}>
                  <Feather name="book-open" size={36} color="#fff" />
                </View>
              </View>
            </LinearGradient>

            <PopularSearches onTabChange={handleTabChange} />
            <QuestionBank />
          </ScrollView>
        )}
        {activeTab === "notes" && (
          <View style={{ paddingHorizontal: 12 }}>
            <Notes pyqs={pyqs} loading={loading} error={error} reload={reload} />
          </View>
        )}
        {activeTab === "pyq" && (
          <View style={{ flex: 1, paddingHorizontal: 12 }}>
            <PYQ pyqs={pyqs} loading={loading} error={error} reload={reload} />
          </View>
        )}
        {activeTab === "syllabus" && (
          <View style={{ paddingHorizontal: 12 }}>
            <Syllabus />
          </View>
        )}

        {showLock && (
          <SubscriptionLockSheet
            visible={showLock}
            title="Before MHT-CET Plan"
            description="Unlock 9,000+ real MHT-CET questions (2019–2025)."
            subDescription="To unlock PYQs you must buy this plan."
            priceText="Unlock Before MHT-CET Plan - ₹199"
            upiAmount={199}
            userId={user?.user_id}
            paymentTag="before_subscription"
          />
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  mainTitle: {
    fontSize: 22,
    fontFamily: "SourceSans3Bold",
    color: colors.textDark,
    paddingHorizontal: 16,
  },

  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#d3d3d350",
    backgroundColor: "#fff",
    marginTop: -10,
    paddingHorizontal: 16,
    gap: 24, // Restored gap
    position: 'relative',
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
    // flex: 1 removed
    zIndex: 1,
  },
  movingIndicatorContainer: {
    position: "absolute",
    bottom: 0,
    left: 0, // start from far left
    height: 3,
    // alignItems: 'center', // removed, let width handle it
    // justifyContent: 'center',
    zIndex: 0,
  },
  movingIndicator: {
    height: 3,
    width: "100%", // Fill the animated width
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  tabText: {
    fontSize: 17,
    color: "#737373",
    fontFamily: "SourceSans3SemiBold",
  },
  activeTabText: { color: colors.primary },

  /* Content */
  contentWrapper: {
    flex: 1,
  },



  card: {
    backgroundColor: "#fff",
    width: "100%",
    alignSelf: "center",
    borderRadius: 18,
    padding: 12,
    marginTop: 16,

  },
  heading: {
    fontSize: 18,
    fontFamily: "SourceSans3SemiBold",
    color: "#004aad",
    marginBottom: 16,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,

  },
  gridItem: {
    width: "48%", // 2 in a row
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  iconBox: {
    padding: 12,
    borderRadius: 12,
  },
  gridTitle: {
    fontSize: 16,
    fontFamily: "SourceSans3SemiBold",
    color: "#2E2E32",
  },
  gridSubTitle: {
    fontSize: 14,
    fontFamily: "SourceSans3Medium",
    color: "#a7a7a7",
    marginLeft: "auto",
    paddingRight: 12,
  },
  banner: {
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    marginBottom: 4,
  },
  bannerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bannerTitle: {
    fontSize: 20,
    fontFamily: "SourceSans3Bold",
    color: "#fff",
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 14,
    fontFamily: "SourceSans3Medium",
    color: "#e6f1ff",
    lineHeight: 20,
    paddingRight: 10,
  },
  bannerIcon: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 10,
    borderRadius: 15,
  },
});
