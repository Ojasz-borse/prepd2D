import MathText from "@/components/MathText";
import { router, useLocalSearchParams } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import React, { useEffect } from "react";
import {
  BackHandler,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface UserAnswer {
  id: number;
  section: "physics" | "chemistry" | "maths";
  question: string;
  options: { a: string; b: string; c: string; d: string };
  correct_option: string;
  user_choice: string | null;
  explanation: string;
}

const MemoMathText = React.memo(MathText);

const QuestionItem = ({ ua, index }: { ua: UserAnswer; index: number }) => {
  const [showWhy, setShowWhy] = React.useState(false);
  const isCorrect = ua.user_choice === ua.correct_option;
  const options = [
    { label: "A", text: ua.options.a },
    { label: "B", text: ua.options.b },
    { label: "C", text: ua.options.c },
    { label: "D", text: ua.options.d },
  ];

  return (
    <View
      style={[
        styles.questionCard,
        isCorrect ? styles.correctCard : styles.wrongCard,
      ]}
    >
      <View style={styles.questionHeaderRow}>
        <Text style={styles.questionNumber}>Q{index + 1}</Text>
        <View style={styles.statusBadge}>
          {isCorrect ? (
            <Text style={[styles.statusText, styles.correctText]}>Correct</Text>
          ) : ua.user_choice ? (
            <Text style={[styles.statusText, styles.wrongText]}>Incorrect</Text>
          ) : (
            <Text style={[styles.statusText, styles.notAttemptedText]}>
              Not Attempted
            </Text>
          )}
        </View>
      </View>

      <Text style={styles.questionText}>
        <MemoMathText content={ua.question || ""} />
      </Text>

      <View style={styles.optionsList}>
        {options.map((opt) => {
          const isSelected = ua.user_choice === opt.label;
          const isRight = ua.correct_option === opt.label;
          return (
            <View
              key={opt.label}
              style={[
                styles.optionRowDetail,
                isRight && styles.correctOptionDetail,
                isSelected && !isRight && styles.wrongOptionDetail,
              ]}
            >
              <Text style={styles.optionLabelDetail}>
                {opt.label}.
              </Text>
              <View style={styles.optionTextDetail}>
                <MemoMathText content={opt.text || ""} />
              </View>
            </View>
          );
        })}
      </View>

      {!isCorrect && (
        <View style={styles.explanationContainer}>
          <TouchableOpacity
            style={styles.whyButton}
            onPress={() => setShowWhy(!showWhy)}
          >
            <Text style={styles.whyButtonText}>
              {showWhy ? "Hide Explanation" : "Why Wrong?"}
            </Text>
          </TouchableOpacity>

          {showWhy && (
            <View style={styles.explanationContent}>
              <Text style={styles.explanationLabel}>Explanation:</Text>
              <MemoMathText content={ua.explanation || "No explanation available."} />
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const Result = () => {
  const { data } = useLocalSearchParams<{ data: string }>();
  const userAnswers: UserAnswer[] = data
    ? JSON.parse(data).map((ua: UserAnswer) => ({
      ...ua,
      user_choice: ua.user_choice ? ua.user_choice.toUpperCase() : null,
      correct_option: ua.correct_option ? ua.correct_option.toUpperCase() : "",
    }))
    : [];

  // Lock orientation to portrait
  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);

    // Handle hardware back button
    const backAction = () => {
      router.replace("/home"); // Go to home
      return true; // Prevent default back
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => {
      backHandler.remove();
    };
  }, []);

  // Compute stats
  const stats = {
    physics: { total: 50, answered: 0, correct: 0, wrong: 0 },
    chemistry: { total: 50, answered: 0, correct: 0, wrong: 0 },
    maths: { total: 50, answered: 0, correct: 0, wrong: 0 },
  };

  userAnswers.forEach((ua) => {
    const s = stats[ua.section];
    if (ua.user_choice) s.answered += 1;
    if (ua.user_choice === ua.correct_option) s.correct += 1;
    else if (ua.user_choice) s.wrong += 1;
  });

  const overall = {
    total: Object.values(stats).reduce((a, s) => a + s.total, 0),
    answered: Object.values(stats).reduce((a, s) => a + s.answered, 0),
    correct: Object.values(stats).reduce((a, s) => a + s.correct, 0),
    wrong: Object.values(stats).reduce((a, s) => a + s.wrong, 0),
    accuracy: Math.round(
      (Object.values(stats).reduce((a, s) => a + s.correct, 0) /
        Math.max(
          Object.values(stats).reduce((a, s) => a + s.answered, 0),
          1
        )) *
      100
    ),
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return "#22c55e";
    if (accuracy >= 60) return "#eab308";
    if (accuracy >= 40) return "#f97316";
    return "#ef4444";
  };

  const [expanded, setExpanded] = React.useState({
    physics: false,
    chemistry: false,
    maths: false,
  });

  const toggleSection = (section: "physics" | "chemistry" | "maths") => {
    setExpanded((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Test Results</Text>
          <Text style={styles.subtitle}>Detailed performance analysis</Text>
        </View>

        {/* Overall Stats Card */}
        <View style={styles.overallCard}>
          <Text style={styles.overallTitle}>Overall Performance</Text>
          <View style={styles.accuracyContainer}>
            <View
              style={[
                styles.accuracyCircle,
                { borderColor: getAccuracyColor(overall.accuracy) },
              ]}
            >
              <Text
                style={[
                  styles.accuracyText,
                  { color: getAccuracyColor(overall.accuracy) },
                ]}
              >
                {overall.accuracy}%
              </Text>
              <Text style={styles.accuracyLabel}>Accuracy</Text>
            </View>
          </View>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{overall.total}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{overall.answered}</Text>
              <Text style={styles.statLabel}>Answered</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, styles.correctText]}>
                {overall.correct}
              </Text>
              <Text style={styles.statLabel}>Correct</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, styles.wrongText]}>
                {overall.wrong}
              </Text>
              <Text style={styles.statLabel}>Wrong</Text>
            </View>
          </View>
        </View>

        {/* Section-wise Performance */}
        {(["physics", "chemistry", "maths"] as const).map((section) => {
          const sectionStats = stats[section];
          const sectionAccuracy =
            sectionStats.answered > 0
              ? Math.round((sectionStats.correct / sectionStats.answered) * 100)
              : 0;

          return (
            <View key={section} style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </Text>
                <Text
                  style={[
                    styles.sectionAccuracy,
                    { color: getAccuracyColor(sectionAccuracy) },
                  ]}
                >
                  {sectionAccuracy}%
                </Text>
              </View>

              <View style={styles.sectionStats}>
                <View style={styles.sectionStat}>
                  <Text style={styles.sectionStatNumber}>
                    {sectionStats.total}
                  </Text>
                  <Text style={styles.sectionStatLabel}>Total</Text>
                </View>
                <View style={styles.sectionStat}>
                  <Text style={styles.sectionStatNumber}>
                    {sectionStats.answered}
                  </Text>
                  <Text style={styles.sectionStatLabel}>Answered</Text>
                </View>
                <View style={styles.sectionStat}>
                  <Text style={[styles.sectionStatNumber, styles.correctText]}>
                    {sectionStats.correct}
                  </Text>
                  <Text style={styles.sectionStatLabel}>Correct</Text>
                </View>
                <View style={styles.sectionStat}>
                  <Text style={[styles.sectionStatNumber, styles.wrongText]}>
                    {sectionStats.wrong}
                  </Text>
                  <Text style={styles.sectionStatLabel}>Wrong</Text>
                </View>
              </View>

              {/* Questions List */}
              <View style={styles.questionsContainer}>
                <TouchableOpacity onPress={() => toggleSection(section)}>
                  <Text style={styles.showToggle}>
                    {expanded[section] ? "Hide Analysis" : "Analyze Questions"}
                  </Text>
                </TouchableOpacity>
                {expanded[section] && (
                  <>
                    {userAnswers
                      .filter((ua) => ua.section === section)
                      .map((ua, i) => (
                        <QuestionItem key={ua.id} ua={ua} index={i} />
                      ))}
                  </>
                )}
              </View>
            </View>
          );
        })}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
    marginTop: 8,
  },
  title: {
    fontSize: 22,
    color: "#0f172a",
    fontFamily: "SourceSans3Bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    fontFamily: "SourceSans3Medium",
  },
  overallCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  overallTitle: {
    fontSize: 18,
    fontFamily: "SourceSans3SemiBold",
    color: "#1e293b",
    textAlign: "center",
    marginBottom: 20,
  },
  accuracyContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  accuracyCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  accuracyText: {
    fontSize: 28,
    fontFamily: "SourceSans3Bold",
  },
  accuracyLabel: {
    fontSize: 12,
    fontFamily: "SourceSans3SemiBold",
    color: "#64748b",
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontFamily: "SourceSans3Bold",
    color: "#0f172a",
  },
  statLabel: {
    fontSize: 12,
    fontFamily: "SourceSans3Medium",
    color: "#64748b",
    marginTop: 4,
  },
  sectionCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 19,
    fontFamily: "SourceSans3Bold",
    color: "#1e293b",
  },
  sectionAccuracy: {
    fontSize: 16,
    fontFamily: "SourceSans3Bold",
  },
  sectionStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  sectionStat: {
    alignItems: "center",
  },
  sectionStatNumber: {
    fontSize: 17,
    fontFamily: "SourceSans3Bold",
    color: "#1e293b",
  },
  sectionStatLabel: {
    fontSize: 11,
    fontFamily: "SourceSans3Medium",
    color: "#64748b",
    marginTop: 2,
  },
  questionsContainer: {
    marginTop: 4,
  },
  showToggle: {
    fontSize: 15,
    color: "#004aad",
    fontFamily: "SourceSans3SemiBold",
    textAlign: "center",
    paddingVertical: 8,
  },
  questionCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  correctCard: {
    backgroundColor: "#f0fdf4",
    borderColor: "#b9f6ca",
  },
  wrongCard: {
    backgroundColor: "#fff5f5",
    borderColor: "#fed7d7",
  },
  questionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  questionNumber: {
    fontSize: 14,
    fontFamily: "SourceSans3Bold",
    color: "#64748b",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontFamily: "SourceSans3Bold",
  },
  correctText: { color: "#16a34a" },
  wrongText: { color: "#dc2626" },
  notAttemptedText: { color: "#64748b" },
  questionText: {
    fontSize: 15,
    fontFamily: "SourceSans3Medium",
    color: "#1e293b",
    marginBottom: 20,
    lineHeight: 22,
  },
  optionsList: {
    gap: 10,
  },
  optionRowDetail: {
    flexDirection: "row",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    alignItems: "center",
  },
  correctOptionDetail: {
    borderColor: "#16a34a",
  },
  wrongOptionDetail: {
    borderColor: "#dc2626",
  },
  optionLabelDetail: {
    fontSize: 14,
    fontFamily: "SourceSans3Bold",
    color: "#64748b",
    width: 24,
  },
  optionTextDetail: {
    flex: 1,
  },
  explanationContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#fee2e2",
  },
  whyButton: {
    alignSelf: "flex-start",

  },
  whyButtonText: {
    fontSize: 13,
    color: "#3399ff",
    fontFamily: "SourceSans3SemiBold",
  },
  explanationContent: {
    marginTop: 12,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  explanationLabel: {
    fontSize: 14,
    fontFamily: "SourceSans3Bold",
    color: "#1e293b",
    marginBottom: 6,
  },
});

export default Result;
