import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  LayoutChangeEvent,
  PanResponder,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import TopHeader from "@/components/TopHeader";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import QuickAccess from "./components/QuickAccess";
import Timeline from "./components/Timeline";
import LearnAdmission from "./components/LearnAdmission";
import { styles } from "./styles";
import { colors } from "@/constants/theme";

export default function AdmissionProcess() {
  const [activeTab, setActiveTab ] = useState<"all" | "timeline" | "learn">("all");

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
          if (activeTab === "all") setActiveTab("timeline");
          else if (activeTab === "timeline") setActiveTab("learn");
        }
        if (g.dx > 50) {
          if (activeTab === "learn") setActiveTab("timeline");
          else if (activeTab === "timeline") setActiveTab("all");
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
      <SafeAreaView style={styles.safeArea}>
        <TopHeader title="Admission Process" showBackArrow={false} />

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
            onPress={() => setActiveTab("timeline")}
            onLayout={(e) => onTabLayout("timeline", e)}
          >
            <Text
              style={[
                styles.tabLabel,
                activeTab === "timeline" && styles.tabLabelActive,
              ]}
            >
              Timeline
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tab}
            onPress={() => setActiveTab("learn")}
            onLayout={(e) => onTabLayout("learn", e)}
          >
            <Text
              style={[
                styles.tabLabel,
                activeTab === "learn" && styles.tabLabelActive,
              ]}
            >
              Learn
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content Area */}
        <View style={styles.contentArea} {...pan.panHandlers}>
          {activeTab === "all" && (
            <View style={{ paddingHorizontal: 16, flex: 1 }}>
              {/* Banner */}
              <LinearGradient
                colors={["#004aad", "#0073e6"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.banner}
              >
                <View style={styles.bannerRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.bannerHead}>Admission Guide</Text>
                    <Text style={styles.bannerSub}>
                      Understand every step of your college admission journey.
                    </Text>
                  </View>
                  <View style={styles.bannerIconWrap}>
                    <Feather name="info" size={34} color="#fff" />
                  </View>
                </View>
              </LinearGradient>

              <QuickAccess onTabChange={setActiveTab} />
            </View>
          )}

          {activeTab === "timeline" && (
            <Timeline />
          )}

          {activeTab === "learn" && (
            <LearnAdmission />
          )}

        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
