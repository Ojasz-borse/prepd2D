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
}

const MemoMathText = React.memo(MathText);

const Result = () => {
  const { data } = useLocalSearchParams<{ data: string }>();
  const userAnswers: UserAnswer[] = data
    ? JSON.parse(data).map((ua: UserAnswer) => ({
        ...ua,
        user_choice: ua.user_choice ? ua.user_choice.toUpperCase() : null,
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
                    {expanded[section] ? "Show Less" : "Show More"}
                  </Text>
                </TouchableOpacity>
                {expanded[section] && (
                  <>
                    {userAnswers
                      .filter((ua) => ua.section === section)
                      .map((ua, i) => (
                        <View
                          key={ua.id}
                          style={[
                            styles.questionCard,
                            ua.user_choice === ua.correct_option
                              ? styles.correctCard
                              : styles.wrongCard,
                          ]}
                        >
                          <Text style={styles.questionNumber}>Q{i + 1}</Text>
                          <Text style={styles.questionText}>
                            <MemoMathText content={ua.question} />
                          </Text>
                          <View style={styles.answerRow}>
                            <Text style={styles.answerLabel}>Your choice:</Text>
                            <Text
                              style={[
                                styles.answerValue,
                                ua.user_choice === ua.correct_option
                                  ? styles.correctText
                                  : styles.wrongText,
                              ]}
                            >
                              {ua.user_choice || "Not attempted"}
                            </Text>
                          </View>
                          <View style={styles.answerRow}>
                            <Text style={styles.answerLabel}>
                              Correct answer:
                            </Text>
                            <Text
                              style={[styles.answerValue, styles.correctText]}
                            >
                              {ua.correct_option}
                            </Text>
                          </View>
                          <View style={styles.statusIndicator}>
                            {ua.user_choice === ua.correct_option ? (
                              <Text
                                style={[styles.statusText, styles.correctText]}
                              >
                                Correct
                              </Text>
                            ) : ua.user_choice ? (
                              <Text
                                style={[styles.statusText, styles.wrongText]}
                              >
                                Incorrect
                              </Text>
                            ) : (
                              <Text
                                style={[
                                  styles.statusText,
                                  styles.notAttemptedText,
                                ]}
                              >
                                Not Attempted
                              </Text>
                            )}
                          </View>
                        </View>
                      ))}
                  </>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  scrollView: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
    marginTop: 8,
  },
  title: {
    fontSize: 18,
    color: "#1e293b",
    fontFamily: "SourceSans3Medium",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    fontFamily: "SourceSans3Medium",
  },
  overallCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#d9d9d9",
  },
  overallTitle: {
    fontSize: 18,
    fontFamily: "SourceSans3Medium",
    color: "#1e293b",
    textAlign: "center",
    marginBottom: 16,
  },
  accuracyContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  accuracyCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  accuracyText: {
    fontSize: 24,
    fontFamily: "SourceSans3Medium",
  },
  accuracyLabel: {
    fontSize: 12,
    fontFamily: "SourceSans3Medium",
    color: "#64748b",
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontFamily: "SourceSans3Medium",
    color: "#1e293b",
  },
  statLabel: {
    fontSize: 12,
    fontFamily: "SourceSans3Medium",
    color: "#64748b",
    marginTop: 4,
  },
  sectionCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#d9d9d9",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "SourceSans3Medium",
    color: "#1e293b",
  },
  sectionAccuracy: {
    fontSize: 16,
    fontFamily: "SourceSans3Medium",
  },
  sectionStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  sectionStat: {
    alignItems: "center",
  },
  sectionStatNumber: {
    fontSize: 16,
    fontFamily: "SourceSans3Medium",
    color: "#1e293b",
  },
  sectionStatLabel: {
    fontSize: 12,
    fontFamily: "SourceSans3Medium",
    color: "#64748b",
    marginTop: 2,
  },
  questionsContainer: {
    marginTop: 8,
  },
  questionsTitle: {
    fontSize: 16,
    fontFamily: "SourceSans3Medium",
    color: "#1e293b",
    marginBottom: 12,
  },
  questionCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  correctCard: {
    backgroundColor: "#f0fdf4",
  },
  wrongCard: {
    backgroundColor: "#fef2f2",
  },
  questionNumber: {
    fontSize: 14,
    fontFamily: "SourceSans3Medium",
    color: "#475569",
    marginBottom: 4,
  },
  questionText: {
    fontSize: 14,
    fontFamily: "SourceSans3Medium",
    color: "#1e293b",
    marginBottom: 8,
    lineHeight: 20,
  },
  answerRow: {
    width: 100,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  answerLabel: {
    fontSize: 12,
    fontFamily: "SourceSans3Medium",
    color: "#64748b",
  },
  answerValue: {
    fontSize: 12,
    fontFamily: "SourceSans3Bold",
  },
  statusIndicator: {
    marginTop: 8,
  },
  statusText: {
    fontSize: 12,
    fontFamily: "SourceSans3Medium",
  },
  correctText: {
    color: "#22c55e",
  },
  wrongText: {
    color: "#ef4444",
  },
  notAttemptedText: {
    color: "#64748b",
  },
  showToggle: {
    fontSize: 14,
    color: "#0099ff",
    textDecorationLine: "underline",
    alignSelf: "flex-start",
    fontFamily: "SourceSans3Medium",
    marginTop: -20,
    marginBottom: 10,
  },
});

export default Result;
