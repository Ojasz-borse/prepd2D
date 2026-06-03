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
  Linking
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import { logUserAction } from "@/services/api";
import { UserFeature } from "@/constants/userActions";
import { useLocalSearchParams } from "expo-router";
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
import GeneratingModal from "@/components/GeneratingModal";
import CustomAlertModal from "@/components/CustomAlertModal";
import { useSavedOptionForms } from "@/hooks/useSavedOptionForms";

export default function OptionForm() {
  const [activeTab, setActiveTab] = useState<"all" | "generate">("all");

  const { getToken, user } = useAuth();
  const { generateList, loading, error } = useCreateCollegeList();

  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    title: string;
    message: string;
    type: "success" | "error" | "info";
  }>({
    visible: false,
    title: "",
    message: "",
    type: "error",
  });

  const [rank, setRank] = useState("");
  const [percentile, setPercentile] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [branches, setBranches] = useState<string[]>([]);
  const [gender, setGender] = useState<"male" | "female">("male");
  const [homeUniversityId, setHomeUniversityId] = useState<number | null>(null);
  const [tfwsPref, setTfwsPref] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [inputType, setInputType] = useState<"rank" | "percentile">("percentile");

  const { savedForms, saveForm, deleteSavedForm } = useSavedOptionForms();
  const { showSaved, savedId } = useLocalSearchParams<{ showSaved?: string; savedId?: string }>();

  useEffect(() => {
    if (savedId && savedForms.length > 0) {
      const selected = savedForms.find((f) => f.id === savedId);
      if (selected) {
        // Filter out suggestions for saved lists
        const activeOnlyResults = (selected.results || []).filter((item: any) => !item.is_suggestion);
        setResults(activeOnlyResults);
        setShowResults(true);
        setActiveTab("generate");
      }
    }
  }, [savedId, savedForms]);

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
      // ✅ Check if decimal places exceed 7
      if (value.includes(".")) {
        const parts = value.split(".");
        if (parts[1] && parts[1].length > 7) {
          return; // Stop if 8th digit after decimal
        }
      }

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
        // Use precision up to 7 decimal places, removing unnecessary trailing zeros
        const formattedValue = Number.isInteger(clampedValue)
          ? clampedValue.toString()
          : parseFloat(clampedValue.toFixed(7)).toString();
        setPercentile(formattedValue);
      }
    }
  };

  const handleSubmit = async () => {
    const isRankSelected = inputType === "rank";
    const valueToCheck = isRankSelected ? rank : percentile;

    if (!valueToCheck) {
      setAlertConfig({
        visible: true,
        title: "Missing Field",
        message: `Please enter your ${isRankSelected ? "Rank" : "Percentile"}`,
        type: "error",
      });
      return;
    }

    if (
      categories.length === 0 ||
      locations.length === 0 ||
      branches.length === 0 ||
      !homeUniversityId
    ) {
      setAlertConfig({
        visible: true,
        title: "Missing Fields",
        message: "Please select Category, Locations, Branches, and Home University",
        type: "error",
      });
      return;
    }

    const percentileNum = isRankSelected ? 0 : parseFloat(percentile);
    if (!isRankSelected && (isNaN(percentileNum) || percentileNum < 0 || percentileNum > 100)) {
      setAlertConfig({
        visible: true,
        title: "Invalid Input",
        message: "Please enter a valid percentile between 0 and 100",
        type: "error",
      });
      return;
    }

    const rankNum = isRankSelected ? Number(rank) : 0;

    const token = await getToken();
    const data = await generateList({
      rank: rankNum,
      percentile: percentileNum,
      category: categories[0],
      locations,
      branches,
      token,
      gender,
      home_university_id: homeUniversityId,
      tfws_pref: tfwsPref,
      user_id: user?.user_id,
    });

    if (data) {
      setResults(data);
      setShowResults(true);

      if (user?.user_id) {
        logUserAction(user.user_id, UserFeature.OPTION_FORM_GENERATION_BUTTON);
      }
    }

  };

  const handleSave = async () => {
    if (results.length === 0) return;
    const success = await saveForm(results);
    if (success) {
      setAlertConfig({
        visible: true,
        title: "Saved",
        message: "Your option form has been saved successfully",
        type: "success",
      });
    }
    else {
      setAlertConfig({
        visible: true,
        title: "Already Saved",
        message: "This option form is already saved",
        type: "info",
      });
    }
  };

  useEffect(() => {
    if (results.length > 0) {
      console.log("results", results);
    }
  }, [results]);

  useEffect(() => {
    if (error) {
      setAlertConfig({
        visible: true,
        title: "Limit Exceeded",
        message: error,
        type: "error",
      });
    }
  }, [error]);

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

              <QuickAccess 
                onTabChange={setActiveTab} 
              />
            </View>
          )}

          {activeTab === "generate" && (
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              bounces={false}
              keyboardShouldPersistTaps="handled"
            >
              {!showResults && (
                <TouchableOpacity
                  onPress={() => Linking.openURL("https://www.prepcet.in/terms-and-conditions.html")}
                  style={styles.infoStrip}
                >
                  <Text style={styles.infoStripText}>
                    Please{" "}
                    <Text style={styles.infoStripLink}>view this</Text>
                    {" "}before generating your option form
                  </Text>
                </TouchableOpacity>
              )}
              {!showResults ? (
                <CreateCollegeForm
                  rank={rank}
                  setRank={setRank}
                  percentile={percentile}
                  setPercentile={setPercentile}
                  inputType={inputType}
                  setInputType={setInputType}
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
                  gender={gender}
                  setGender={setGender}
                  homeUniversityId={homeUniversityId}
                  setHomeUniversityId={setHomeUniversityId}
                  tfwsPref={tfwsPref}
                  setTfwsPref={setTfwsPref}
                />
              ) : (
                <>
                  <ResultsList
                    results={results}
                    onEdit={() => setShowResults(false)}
                    onSave={handleSave}
                    isReadOnly={!!savedId}
                    onAddSuggestion={(item) => {
                      setResults((prev) =>
                        prev.map((res) =>
                          res.choice_code === item.choice_code &&
                            res.branch_name === item.branch_name
                            ? { ...res, is_suggestion: false }
                            : res
                        )
                      );
                      setAlertConfig({
                        visible: true,
                        title: "Success",
                        message: "Added to your list",
                        type: "success",
                      });
                    }}
                  />
                </>
              )}
            </ScrollView>
          )}

          <GeneratingModal visible={loading} />



          <CustomAlertModal
            visible={alertConfig.visible}
            title={alertConfig.title}
            message={alertConfig.message}
            type={alertConfig.type}
            onClose={() => setAlertConfig((prev) => ({ ...prev, visible: false }))}
          />
        </View>

        {showLock && (
          <SubscriptionLockSheet 
            visible={showLock} 
            planType="after" 
            onClose={closeLock}
          />
        )}

      </SafeAreaView>

    </LinearGradient>
  );
}
