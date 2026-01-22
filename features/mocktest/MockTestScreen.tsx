import TopHeader from "@/components/TopHeader";
import { colors } from "@/constants/theme";
import { useMockTests } from "@/hooks/useMockTests";
import { useRouter } from "expo-router";
import React, { useRef, useState, useEffect } from "react";
import {
  LayoutChangeEvent,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  SlideInDown,
} from "react-native-reanimated";
import MockTestList from "./MockTestList";
import SubscriptionLockSheet from "@/components/ShowLockScreen";

const MockTestLanding = ({ onTabChange }: { onTabChange: (tab: "mock") => void }) => {
  const items = [
    { title: "Mock Tests", icon: "clipboard-outline", tab: "mock" as const },
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
                backgroundColor: "#004aad20",
              },
            ]}>
              <Ionicons name={item.icon as any} size={24} color="#004aad" />
            </View>
            <Text style={styles.gridTitle}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const MockTestScreen = () => {
  const { user } = useAuth();
  const { tests, loading, error } = useMockTests();
  const [activeTab, setActiveTab] = useState<"all" | "mock">("all");
  const [showLock, setShowLock] = useState(false);

  useEffect(() => {
    if (!loading && user && !user.is_subscribed_before && activeTab === "mock") {
      const timer = setTimeout(() => {
        setShowLock(true);
      }, 2000);
      return () => clearTimeout(timer);
    } else if (activeTab !== "mock") {
      setShowLock(false);
    }
  }, [loading, user, activeTab]);

  // Tab Measurement Logic
  const [tabMeasurements, setTabMeasurements] = useState<{ [key: string]: { x: number; width: number } }>({});
  const indicatorX = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);

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
      if (prev[tab]?.x === x && prev[tab]?.width === width) return prev;
      return { ...prev, [tab]: { x, width } };
    });
  };

  const indicatorStyle = useAnimatedStyle(() => {
    return {
      width: indicatorWidth.value,
      transform: [{ translateX: indicatorX.value }],
    };
  });

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > 20,
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 50 && activeTab === "mock") {
          setActiveTab("all");
        } else if (gestureState.dx < -50 && activeTab === "all") {
          setActiveTab("mock");
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
      <TopHeader title="Mock Tests" showBackArrow={false} />

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <Animated.View style={[styles.movingIndicatorContainer, indicatorStyle]}>
          <View style={styles.movingIndicator} />
        </Animated.View>

        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab("all")}
          onLayout={(e) => onTabLayout("all", e)}
        >
          <Text style={[styles.tabText, activeTab === "all" && styles.activeTabText]}>
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab("mock")}
          onLayout={(e) => onTabLayout("mock", e)}
        >
          <Text style={[styles.tabText, activeTab === "mock" && styles.activeTabText]}>
            Mock Tests
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.contentWrapper} {...panResponder.panHandlers}>
        {activeTab === "all" ? (
          <View style={{ paddingHorizontal: 16 }}>
            <LinearGradient
              colors={["#004aad", "#0073e6"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.banner}
            >
              <View style={styles.bannerContent}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.bannerTitle}>Crack the Exam!</Text>
                  <Text style={styles.bannerSubtitle}>
                    Complete set of MHT-CET Mock Tests for your practice.
                  </Text>
                </View>
                <View style={styles.bannerIcon}>
                  <Feather name="file-text" size={36} color="#fff" />
                </View>
              </View>
            </LinearGradient>

            <MockTestLanding onTabChange={setActiveTab} />
          </View>
        ) : (
          <View style={{ flex: 1, paddingHorizontal: 14 }}>
            <MockTestList tests={tests} loading={loading} error={error} />
          </View>
        )}

        {showLock && (
          <SubscriptionLockSheet
            visible={showLock}
            title="Before MHT-CET Plan"
            description="Unlock 60+ real Mock Test with real MHT_CET exam experience."
            subDescription="To unlock Mock Test section you must buy this plan."
            priceText="Unlock Before MHT-CET Plan - ₹199"
            upiAmount={199}
            userId={user?.user_id}
            paymentTag="before_subscription"
          />

        )}
      </View>
    </LinearGradient>
  );
};

export default MockTestScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#d3d3d350",
    backgroundColor: "#fff",
    marginTop: -10,
    paddingHorizontal: 16,
    gap: 24,
    position: 'relative',
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  movingIndicatorContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: 3,
    zIndex: 0,
  },
  movingIndicator: {
    height: 3,
    width: "100%",
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  tabText: {
    fontSize: 17,
    color: "#737373",
    fontFamily: "SourceSans3SemiBold",
  },
  activeTabText: { color: colors.primary },

  contentWrapper: {
    flex: 1,
  },

  card: {
    backgroundColor: "#fff",
    width: "100%",
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
    gap: 12,
  },
  gridItem: {
    width: "48.5%",
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
  lockScreenContainer: {
    flex: 1,
    backgroundColor: "#00000050",
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  content: {
    width: "100%",
    position: "absolute",
    left: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    paddingBottom: 40,
    alignItems: 'center',

  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#e2e8f0',
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
    backgroundColor: '#004aad',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#004aad',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontFamily: 'SourceSans3Bold',
    color: '#004aad',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    fontFamily: 'SourceSans3Medium',
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  subscribeButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#004aad',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'SourceSans3SemiBold',
  },
  closeButton: {
    paddingVertical: 12,
  },
  closeButtonText: {
    color: '#94a3b8',
    fontSize: 16,
    fontFamily: 'SourceSans3Medium',
  },
});
