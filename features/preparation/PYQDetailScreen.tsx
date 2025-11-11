import MathText from "@/components/MathText";
import TopHeader from "@/components/TopHeader";
import { UPDATE_USER_RESPONSE } from "@/constants/config";
import { useAuth } from "@/context/AuthContext";
import { usePYQContext } from "@/context/PYQContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
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

  interface UserResponseMap {
    [question_id: string]: string; // { "101": "A" }
  }

  const { user, getToken } = useAuth();

  const { pyqList, userResponses, setUserResponses } = usePYQContext();

  const [index, setIndex] = useState(parseInt(currentIndex || "0", 10));
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

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

  const options = [current.a, current.b, current.c, current.d];
  const correctIndex =
    current.correct_option?.trim().toLowerCase().charCodeAt(0) - 97;

  useEffect(() => {
    if (current.user_resp != null) {
      const optionIndex =
        current.user_resp == "A"
          ? 0
          : current.user_resp == "B"
          ? 1
          : current.user_resp == "C"
          ? 2
          : 3;
      setSelectedOption(optionIndex);
    }
  }, [current]);

  const handleSelect = async (i: number) => {
    if (selectedOption !== null) return;

    setSelectedOption(i);
    setShowExplanation(true);

    const qid = current.id.toString();
    const selected = String.fromCharCode(65 + i);

    // ✅ Update only one key, but keep full object

    setUserResponses((prev: any) => {
      const updated = { ...prev, [qid]: selected };

      pyqList[index].user_resp = selected;
      setTimeout(() => sendToServer(updated), 100);

      return updated;
    });
  };

  const sendToServer = async (updatedResponses: UserResponseMap) => {
    console.log("Calling API...");
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
        responses: updatedResponses, // ✅ sending full updated data
      }),
    });
  };

  const handleNext = () => {
    if (index < pyqList.length - 1) {
      setIndex(index + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    }
  };

  const handlePrev = () => {
    if (index > 0) {
      setIndex(index - 1);
      setSelectedOption(null);
      setShowExplanation(false);
    }
  };

  const getOptionStyle = (i: number) => {
    if (selectedOption === null) return styles.option;
    if (i === correctIndex) return [styles.option, styles.correctOption];
    if (i === selectedOption && i !== correctIndex)
      return [styles.option, styles.wrongOption];
    return styles.option;
  };

  const getOptionIcon = (i: number) => {
    if (selectedOption === null) return "radio-button-off";
    if (i === correctIndex) return "checkmark-circle";
    if (i === selectedOption && i !== correctIndex) return "close-circle";
    return "radio-button-off";
  };

  const getOptionIconColor = (i: number) => {
    if (selectedOption === null) return "#667eea";
    if (i === correctIndex) return "#10b981";
    if (i === selectedOption && i !== correctIndex) return "#ef4444";
    return "#9ca3af";
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopHeader title="PYQ Section" showBackArrow={true} />

      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* Progress Indicator */}
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

          {/* Question Card */}
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
              <TouchableOpacity
                key={i}
                style={getOptionStyle(i)}
                onPress={() => handleSelect(i)}
                activeOpacity={0.8}
              >
                <View style={styles.optionContent}>
                  <Ionicons
                    name={getOptionIcon(i)}
                    size={22}
                    color={getOptionIconColor(i)}
                    style={styles.optionIcon}
                  />
                  <View style={styles.optionTextContainer}>
                    <Text style={styles.optionLabel}>
                      {String.fromCharCode(65 + i)}.
                    </Text>
                    <MemoMathText content={opt} />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Explanation */}
          {showExplanation && (
            <View style={styles.explanationBox}>
              <View style={styles.explanationHeader}>
                <Ionicons name="bulb-outline" size={16} color="#f59e0b" />
                <Text style={styles.explanationTitle}>Explanation</Text>
              </View>

              <View style={styles.explanationContent}>
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
            </View>
          )}

          <View style={{ height: 80 }} />
        </ScrollView>

        {/* Floating Navigation Buttons */}
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

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#ffffff",
  },

  progressContainer: {
    marginBottom: 10,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#e2e8f0",
    borderRadius: 3,
    marginBottom: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#004aad",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    color: "#64748b",
    fontFamily: "SourceSans3Medium",
    textAlign: "center",
  },
  questionCard: {
    marginBottom: 20,
  },
  questionHeader: {
    marginBottom: 12,
  },
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
  questionContent: {
    minHeight: 60,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  option: {
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#d9d9d9",
    backgroundColor: "#fff",
    marginBottom: 14,
  },
  correctOption: {
    borderColor: "#10b981",
    backgroundColor: "#f0fdf9",
  },
  wrongOption: {
    borderColor: "#ef4444",
    backgroundColor: "#fef2f2",
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  optionIcon: {
    marginRight: 12,
    marginTop: 2,
  },
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
  explanationContent: {
    marginTop: 4,
    width: "100%",
  },
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
  prevButton: {
    backgroundColor: "#004aad",
    borderWidth: 1,
    borderColor: "#d9d9d9",
  },
  nextButton: {
    backgroundColor: "#004aad",
    borderWidth: 1,
    borderColor: "#d9d9d9",
  },
  disabledButton: {
    backgroundColor: "#ffffff",
  },
  navButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontFamily: "SourceSans3SemiBold",
    marginHorizontal: 4,
  },
  disabledButtonText: {
    color: "#9ca3af",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
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
