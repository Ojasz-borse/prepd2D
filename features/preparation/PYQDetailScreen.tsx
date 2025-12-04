import MathText from "@/components/MathText";
import TopHeader from "@/components/TopHeader";
import { UPDATE_USER_RESPONSE } from "@/constants/config";
import { useAuth } from "@/context/AuthContext";
import { usePYQContext } from "@/context/PYQContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import * as ScreenCapture from "expo-screen-capture";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MemoMathText = React.memo(MathText);

export default function PYQDetailsPage() {
  const { currentIndex, chapterId } = useLocalSearchParams<{
    currentIndex: string;
    chapterId: string;
  }>();

  const { user, getToken } = useAuth();
  const { pyqList, setUserResponses } = usePYQContext();

  const [index, setIndex] = useState(parseInt(currentIndex || "0", 10));
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    ScreenCapture.preventScreenCaptureAsync();

    return () => {
      ScreenCapture.allowScreenCaptureAsync();
    };
  }, []);

  const current = pyqList[index];

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

  const options = useMemo(
    () => [current.a, current.b, current.c, current.d],
    [current]
  );
  const correctIndex = useMemo(
    () => current.correct_option?.trim().toLowerCase().charCodeAt(0) - 97,
    [current.correct_option]
  );

  useEffect(() => {
    if (current.user_resp != null) {
      const optionIndex = current.user_resp.charCodeAt(0) - 65;
      setSelectedOption(optionIndex);
    } else {
      setSelectedOption(null);
      setShowExplanation(false);
    }
  }, [current]);

  const handleSelect = useCallback(
    (i: number) => {
      if (selectedOption !== null) return;
      setSelectedOption(i);
      setShowExplanation(true);

      const qid = current.id.toString();
      const selected = String.fromCharCode(65 + i);

      setUserResponses((prev: any) => {
        const updated = { ...prev, [qid]: selected };
        pyqList[index].user_resp = selected;

        // Delay API call to not block UI
        if (typeof requestIdleCallback !== "undefined") {
          requestIdleCallback(() => sendToServer(updated));
        } else {
          setTimeout(() => sendToServer(updated), 150);
        }
        return updated;
      });
    },
    [selectedOption, index, pyqList]
  );

  const sendToServer = async (updatedResponses: Record<string, string>) => {
    try {
      const token = await getToken();
      await fetch(UPDATE_USER_RESPONSE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          chapter_id: Number(chapterId),
          user_id: user?.user_id,
          responses: updatedResponses,
        }),
      });
    } catch {
      // fail silently to prioritize speed
    }
  };

  const handleNext = useCallback(() => {
    if (index < pyqList.length - 1) {
      setIndex((prev) => prev + 1);
    }
  }, [index, pyqList.length]);

  const handlePrev = useCallback(() => {
    if (index > 0) {
      setIndex((prev) => prev - 1);
    }
  }, [index]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopHeader title="PYQ Section" showBackArrow={true} />

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
                  { width: `${((index + 1) / pyqList.length) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              Question {index + 1} of {pyqList.length}
            </Text>
          </View>

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
              {current.img_url && (
                <Image
                  source={{ uri: current.img_url }}
                  style={{
                    width: "80%",
                    height: 200,
                    margin: "auto",
                    paddingVertical: 10,
                  }}
                  resizeMode="cover"
                />
              )}
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
            <View style={styles.explanationBox}>
  <View style={styles.explanationHeader}>
    <Ionicons name="bulb-outline" size={16} color="#f59e0b" />
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
</View>

          )}

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
              index === pyqList.length - 1 && styles.disabledButton,
            ]}
            disabled={index === pyqList.length - 1}
            onPress={handleNext}
          >
            <Text
              style={[
                styles.navButtonText,
                index === pyqList.length - 1 && styles.disabledButtonText,
              ]}
            >
              Next
            </Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={index === pyqList.length - 1 ? "#9ca3af" : "#ffffff"}
            />
          </TouchableOpacity>
        </View>
      </View>
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
  container: { flexGrow: 1, padding: 20, backgroundColor: "#fff" },
  progressContainer: { marginBottom: 10 },
  progressBar: {
    height: 6,
    backgroundColor: "#e2e8f0",
    borderRadius: 3,
    marginBottom: 8,
    overflow: "hidden",
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
    backgroundColor: "#ebf0fa",
    padding: 2,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  questionBadgeText: {
    fontSize: 12,
    color: "#004aad",
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
    backgroundColor: "#fffbeb",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#fef3c7",
    overflowX: "auto",
whiteSpace: "nowrap",


  },
  explanationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  explanationTitle: {
    color: "#92400e",
    fontSize: 16,
    fontFamily: "SourceSans3Medium",
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
