import MathText from "@/components/MathText";
import TopHeader from "@/components/TopHeader";
import { UPDATE_USER_RESPONSE } from "@/constants/config";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/services/api";
import { usePYQContext } from "@/context/PYQContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePreventScreenCapture } from "@/hooks/usePreventScreenCapture";


const MemoMathText = React.memo(MathText);



import { useSubscriptionLock } from "@/hooks/useSubcribtion";
import SubscriptionLockSheet from "@/components/ShowLockScreen";

export default function PYQDetailsPage() {
  const { currentIndex, selectedYear } = useLocalSearchParams<{
    currentIndex: string;
    selectedYear: string;
  }>();

  const { user, getToken } = useAuth();
  const { pyqList, userResponses, setUserResponses } = usePYQContext();

  const { showLock, closeLock, isAllowed } = useSubscriptionLock({
    gate: "before",
    delay: 0, // Show immediately when condition met
  });

  const [localShowLock, setLocalShowLock] = useState(false);



  const filteredList = useMemo(() => {
    if (!selectedYear) return pyqList;
    return pyqList.filter(q => String(q.question_year) === selectedYear);
  }, [pyqList, selectedYear]);

  const [index, setIndex] = useState(parseInt(currentIndex || "0", 10));
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const current = filteredList[index];

  const options = useMemo(
    () => (current ? [current.a, current.b, current.c, current.d] : []),
    [current]
  );

  const correctIndex = useMemo(
    () => (current?.correct_option ? current.correct_option.trim().toLowerCase().charCodeAt(0) - 97 : 0),
    [current]
  );

  // Sync selectedOption when question changes or userResponses update
  useEffect(() => {
    if (!current) return;
    const response = userResponses[current.id.toString()];
    if (response) {
      const optionIndex = response.charCodeAt(0) - 65;
      setSelectedOption(optionIndex);
      setShowExplanation(true);
    } else {
      setSelectedOption(null);
      setShowExplanation(false);
    }
  }, [current, userResponses]);

  const sendToServer = async (questionId: string, answer: string) => {
    try {
      const token = await getToken();
      const response = await apiFetch(UPDATE_USER_RESPONSE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          user_id: user?.user_id,
          pyq_id: Number(questionId),
          response: { answer, time_taken_sec: 0 },
        }),
      });

      const data = await response.json();
      console.log("Backend Response:", data);
    } catch (err) {
      console.error("Sync Error:", err);
    }
  };

  const handleSelect = useCallback(
    async (i: number) => {
      if (selectedOption !== null || !current) return;
      setSelectedOption(i);
      setShowExplanation(true);

      const qid = current.id.toString();
      const selected = String.fromCharCode(65 + i);

      // Update Context
      setUserResponses((prev: any) => {
        const updated = { ...prev, [qid]: selected };
        current.user_resp = selected; // Local update for UI

        // Send to server immediately
        sendToServer(qid, selected);

        return updated;
      });
    },
    [selectedOption, current, setUserResponses]
  );

  const handleNext = useCallback(() => {
    if (index < filteredList.length - 1) {
      setIndex((prev) => prev + 1);
    }
  }, [index, filteredList.length]);

  const handlePrev = useCallback(() => {
    if (index > 0) {
      setIndex((prev) => prev - 1);
    }
  }, [index]);

  usePreventScreenCapture();

  // Subscription Lock Effect
  useEffect(() => {
    const isFreeContent = selectedYear === "2025" && index < 3;
    if (!isAllowed && !isFreeContent) {
      setLocalShowLock(true); 
    } else {
      setLocalShowLock(false);
    }
  }, [index, isAllowed]);

  if (!current) {
    return (
      <View style={styles.center}>
        <LinearGradient
          colors={["#667eea", "#764ba2"]}
          style={styles.errorContainer}
        >
          <Ionicons name="document-text-outline" size={48} color="#ffffff" />
          <Text style={styles.errorText}>No question data found</Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopHeader title="PYQ Section" showBackArrow={true} />
      <LinearGradient
        colors={["#f8fafc", "#e6f1ff", "#e8dcff"]}
        locations={[0, 0.5, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >

        <View style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
          >
            {/* Progress */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${((index + 1) / filteredList.length) * 100}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                Question {index + 1} of {filteredList.length}
              </Text>
            </View>

            <View style={styles.progressContainer}>
              {/* Question */}
              <View style={styles.questionCard}>
                <View style={styles.questionHeader}>
                  <View style={styles.questionBadge}>
                    <Text style={styles.questionBadgeText}>
                      Question {index + 1}
                    </Text>
                  </View>
                </View>
                <View style={styles.questionContent}>
                  <MemoMathText content={current.pyq_content} />

                </View>
              </View>

              {/* Options */}
              <View style={styles.optionsContainer}>
                {options.map((opt, i) => (
                  <MemoOptionItem
                    key={i}
                    i={i}
                    opt={opt}
                    selectedOption={selectedOption}
                    correctIndex={correctIndex}
                    onSelect={handleSelect}
                  />
                ))}
              </View>

              {/* Explanation */}
              {showExplanation && (
                <LinearGradient
                  colors={["#f8fafc", "#e6f1ff80", "#e8dcff80"]}
                  locations={[0, 0.5, 1]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.explanationBox}
                >

                  <View style={styles.explanationHeader}>
                    <Text style={styles.explanationTitle}>Explanation</Text>
                  </View>

                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={true}
                    contentContainerStyle={{ paddingVertical: 5 }}
                  >
                    <View style={{ minWidth: "100%" }}>
                      {current.explanation_content ? (
                        <MemoMathText content={current.explanation_content} />
                      ) : (
                        <Text
                          style={{
                            fontSize: 15,
                            color: "#222",
                            fontFamily: "SourceSans3Medium",
                          }}
                        >
                          No Explanation Found
                        </Text>
                      )}
                    </View>
                  </ScrollView>
                </LinearGradient>
              )}


            </View>
            <View style={{ height: 80 }} />
          </ScrollView>

          {/* Navigation */}
          <View style={styles.navContainer}>
            <TouchableOpacity
              style={[
                styles.navButton,
                styles.prevButton,
                index === 0 && styles.disabledButton,
              ]}
              disabled={index === 0}
              onPress={handlePrev}
            >
              <Ionicons
                name="chevron-back"
                size={18}
                color={index === 0 ? "#9ca3af" : "#ffffff"}
              />
              <Text
                style={[
                  styles.navButtonText,
                  index === 0 && styles.disabledButtonText,
                ]}
              >
                Prev
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.navButton,
                styles.nextButton,
                index === filteredList.length - 1 && styles.disabledButton,
              ]}
              disabled={index === filteredList.length - 1}
              onPress={handleNext}
            >
              <Text
                style={[
                  styles.navButtonText,
                  index === filteredList.length - 1 && styles.disabledButtonText,
                ]}
              >
                Next
              </Text>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={index === filteredList.length - 1 ? "#9ca3af" : "#ffffff"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {localShowLock && (
          <SubscriptionLockSheet
            visible={localShowLock}
            planType="before"
            onClose={() => {
              setLocalShowLock(false)
              if (index >= 3) {
                setIndex(2) // Jump back to safe question if they close and are still on blocked index
              }
            }}
          />
        )}
      </LinearGradient>
    </SafeAreaView>
  );
}

/* ✅ Memoized Option Component for extreme speed */
const OptionItem = ({
  i,
  opt,
  selectedOption,
  correctIndex,
  onSelect,
}: {
  i: number;
  opt: string;
  selectedOption: number | null;
  correctIndex: number;
  onSelect: (i: number) => void;
}) => {
  const isSelected = selectedOption === i;
  const isCorrect = i === correctIndex;

  const optionStyle = useMemo(() => {
    if (selectedOption === null) return styles.option;
    if (isCorrect) return [styles.option, styles.correctOption];
    if (isSelected && !isCorrect) return [styles.option, styles.wrongOption];
    return styles.option;
  }, [selectedOption, isSelected, isCorrect]);

  const icon = useMemo(() => {
    if (selectedOption === null) return "radio-button-off";
    if (isCorrect) return "checkmark-circle";
    if (isSelected && !isCorrect) return "close-circle";
    return "radio-button-off";
  }, [selectedOption, isSelected, isCorrect]);

  const iconColor = useMemo(() => {
    if (selectedOption === null) return "#667eea";
    if (isCorrect) return "#10b981";
    if (isSelected && !isCorrect) return "#ef4444";
    return "#9ca3af";
  }, [selectedOption, isSelected, isCorrect]);

  const handlePress = useCallback(() => onSelect(i), [i, onSelect]);

  return (
    <TouchableOpacity
      style={optionStyle}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.optionContent}>
        <Ionicons
          name={icon}
          size={22}
          color={iconColor}
          style={styles.optionIcon}
        />
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionLabel}>{String.fromCharCode(65 + i)}.</Text>
          <MemoMathText content={opt} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const MemoOptionItem = React.memo(OptionItem);

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, },
  progressContainer: {
    marginBottom: 10, backgroundColor: "#fff",
    borderRadius: 20,
    padding: 12, // Reduced padding to match chapters page feel
  },
  progressBar: {
    height: 8,
    backgroundColor: "#e2e8f0",
    borderRadius: 10,
    marginBottom: 8,
    overflow: "hidden",
    marginTop: 10,
  },
  progressFill: { height: "100%", backgroundColor: "#004aad", borderRadius: 3 },
  progressText: {
    fontSize: 14,
    color: "#64748b",
    fontFamily: "SourceSans3Medium",
    textAlign: "center",
  },
  questionCard: { marginBottom: 20 },
  questionHeader: { marginBottom: 12 },
  questionBadge: {
    backgroundColor: "#f0f7d4",
    borderWidth: 1,
    borderColor: "#b6cf4f",
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 2,
    alignSelf: "flex-start",
  },
  questionBadgeText: {
    fontSize: 12,
    color: "#8b9e3dff",
    fontFamily: "SourceSans3Medium",
  },
  questionContent: { minHeight: 60 },
  optionsContainer: { marginBottom: 20 },
  option: {
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#d9d9d9",
    backgroundColor: "#fff",
    marginBottom: 14,
  },
  correctOption: { borderColor: "#10b981", backgroundColor: "#f0fdf9" },
  wrongOption: { borderColor: "#ef4444", backgroundColor: "#fef2f2" },
  optionContent: { flexDirection: "row", alignItems: "flex-start" },
  optionIcon: { marginRight: 12, marginTop: 2 },
  optionTextContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  optionLabel: {
    fontSize: 16,
    fontFamily: "SourceSans3Bold",
    color: "#374151",
    marginRight: 8,
    lineHeight: 20,
  },
  explanationBox: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#004aad30",
    overflowX: "auto",


  },
  explanationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  explanationTitle: {
    color: "#004aad",
    fontSize: 18,
    fontFamily: "SourceSans3Bold",
    marginLeft: 4,
  },
  explanationContent: { marginTop: 4, width: "100%" },
  navContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 80,
    justifyContent: "center",
  },
  prevButton: { backgroundColor: "#004aad" },
  nextButton: { backgroundColor: "#004aad" },
  disabledButton: { backgroundColor: "#ffffff" },
  navButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontFamily: "SourceSans3SemiBold",
    marginHorizontal: 4,
  },
  disabledButtonText: { color: "#9ca3af" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  errorText: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "SourceSans3Medium",
    marginTop: 12,
    textAlign: "center",
  },
});
