import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  LayoutChangeEvent,
  PanResponder,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import { useCreateCollegeList } from "@/hooks/useCreateCollegeList";
import { useSubscriptionLock } from "@/hooks/useSubcribtion";
import SubscriptionLockSheet from "@/components/ShowLockScreen";
import TopHeader from "@/components/TopHeader";
import { usePreventScreenCapture } from "@/hooks/usePreventScreenCapture";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import QuickAccess from "./components/QuickAccess";
import CreateCollegeForm from "./components/CreateCollegeForm";
import ResultsList from "./components/ResultsList";
import { styles } from "./styles";
import { colors } from "@/constants/theme";
import GeneratingModal from "@/components/GeneratingModal";

export default function OptionForm() {
  const [activeTab, setActiveTab] = useState<"all" | "generate">("all");

  const { getToken } = useAuth();
  const { generateList, loading } = useCreateCollegeList();

  const [rank, setRank] = useState("");
  const [percentile, setPercentile] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [branches, setBranches] = useState<string[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  const { isAllowed, showLock, closeLock } = useSubscriptionLock({
    gate: "after",
    delay: 3000,
    condition: activeTab === "generate",
  });

  usePreventScreenCapture();

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
          if (activeTab === "all") setActiveTab("generate");
        }
        if (g.dx > 50) {
          if (activeTab === "generate") setActiveTab("all");
        }
      },
    })
  ).current;

  const moveBranch = (index: number, direction: "up" | "down") => {
    const updated = [...branches];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= updated.length) return;

    [updated[index], updated[swapIndex]] = [updated[swapIndex], updated[index]];

    setBranches(updated);
  };

  const handlePercentileChange = (value: string) => {
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && numValue > 100) {
        setPercentile("100");
      } else {
        setPercentile(value);
      }
    }
  };

  const handlePercentileBlur = () => {
    if (percentile) {
      const numValue = parseFloat(percentile);
      if (!isNaN(numValue)) {
        const clampedValue = Math.min(Math.max(numValue, 0), 100);
        const formattedValue = Number.isInteger(clampedValue)
          ? clampedValue.toString()
          : clampedValue.toFixed(2);
        setPercentile(formattedValue);
      }
    }
  };

  const handleSubmit = async () => {
    if (
      !rank ||
      !percentile ||
      categories.length === 0 ||
      locations.length === 0 ||
      branches.length === 0
    ) {
      Alert.alert("Missing Fields", "Please fill all fields");
      return;
    }

    const percentileNum = parseFloat(percentile);
    if (isNaN(percentileNum) || percentileNum < 0 || percentileNum > 100) {
      Alert.alert(
        "Invalid Input",
        "Please enter a valid percentile between 0 and 100"
      );
      return;
    }

    const token = await getToken();
    const data = await generateList({
      rank: Number(rank),
      percentile: percentileNum,
      category: categories[0],
      locations,
      branches,
      token,
    });

    if (data) {
      setResults(data);
      setShowResults(true);
    }
  };

  useEffect(() => {
    console.log("results", results);
  }, [results]);

  return (
    <LinearGradient
      colors={["#f8fafc", "#e6f1ff", "#e8dcff"]}
      locations={[0, 0.5, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <TopHeader title="Option Form" showBackArrow={false} />

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
            onPress={() => setActiveTab("generate")}
            onLayout={(e) => onTabLayout("generate", e)}
          >
            <Text
              style={[
                styles.tabLabel,
                activeTab === "generate" && styles.tabLabelActive,
              ]}
            >
              Generate
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
                    <Text style={styles.bannerHead}>Generate Option Form!</Text>
                    <Text style={styles.bannerSub}>
                      Create your perfect college preference list easily.
                    </Text>
                  </View>
                  <View style={styles.bannerIconWrap}>
                    <Feather name="list" size={34} color="#fff" />
                  </View>
                </View>
              </LinearGradient>

              <QuickAccess onTabChange={setActiveTab} />
            </View>
          )}

          {activeTab === "generate" && (
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              {!showResults ? (
                <CreateCollegeForm
                  rank={rank}
                  setRank={setRank}
                  percentile={percentile}
                  setPercentile={setPercentile}
                  categories={categories}
                  setCategories={setCategories}
                  locations={locations}
                  setLocations={setLocations}
                  branches={branches}
                  setBranches={setBranches}
                  handlePercentileChange={handlePercentileChange}
                  handlePercentileBlur={handlePercentileBlur}
                  moveBranch={moveBranch}
                  handleSubmit={handleSubmit}
                  loading={loading}
                  isAllowed={isAllowed}
                />
              ) : (
                <>
                  <ResultsList
                    results={results}
                    onEdit={() => setShowResults(false)}
                    onAddSuggestion={(item) => {
                      setResults((prev) =>
                        prev.map((res) =>
                          res.choice_code === item.choice_code &&
                            res.branch === item.branch
                            ? { ...res, isSuggestion: false }
                            : res
                        )
                      );
                      Alert.alert("Success", "Added to your list");
                    }}
                  />
                </>
              )}
            </ScrollView>
          )}

          <GeneratingModal visible={loading} />

          {showLock && (
            <SubscriptionLockSheet visible={showLock} planType="after" />
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
