import MathText from "@/components/MathText";
import TopHeader from "@/components/TopHeader";
import { GET_PYQS, GET_REPEATED_PYQS } from "@/constants/config";
import { useAuth } from "@/context/AuthContext";
import { usePYQContext } from "@/context/PYQContext";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import QuestionCardSkeleton from "@/components/QuestionCardSkeleton";
import { usePreventScreenCapture } from "@/hooks/usePreventScreenCapture";

type PYQCardProps = {
  question: any;
  index: number;
  id: string;
  router: any;
  isSolved: boolean;
};

export interface PYQLite {
  question_year: string;
  id: number;
  pyq_content: string;
  user_resp: string | null;
}

const PYQCard = React.memo(({ question, index, id, router, isSolved }: PYQCardProps) => {
  const handleSolve = () => {
    router.push({
      pathname: "/pyq-detail",
      params: {
        currentIndex: index.toString(),
        chapterId: id.toString(),
      },
    });
  };

  return (
    <TouchableOpacity
      style={styles.chapterTag}
      onPress={handleSolve}
      activeOpacity={0.7}
    >
      <View style={styles.titleRow}>
        <View style={styles.questionTag}>
          <Text style={styles.questionTagText}>Question {index + 1}</Text>
        </View>

        <View><Text style={{
          fontSize: 12,
          color: "#009933",
          fontFamily: "SourceSans3SemiBold",
        }}>{isSolved && "Solved"}</Text></View>
      </View>

      <View style={styles.questionContent}>
        <MathText
          content={question.pyq_content}
        // baseStyle={styles.questionText}
        />
      </View>

      <View style={styles.bottomSubRow}>
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 12 }}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Multiple Choice • 4 Options</Text>
          </View>

        </View>
        <TouchableOpacity style={styles.solveButton} onPress={handleSolve}>
          <Text style={styles.solveButtonText}>Solve</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
});

interface AnalysisResult {
  total: number;
  answered: number;
  correct: number;
  accuracy: number;
}

export interface PYQItem {
  question_year: string;
  id: number;
  pyq_content: string;
  a: string;
  b: string;
  c: string;
  d: string;
  correct_option: string;
  explanation_content: string;
  user_resp: string | null;
}

export const getPYQAnalysis = (pyqList: PYQItem[]): AnalysisResult => {
  const total = pyqList.length;

  const answered = pyqList.filter(
    (q) => q.user_resp !== null && q.user_resp !== ""
  ).length;

  const correct = pyqList.filter(
    (q) =>
      q.user_resp &&
      q.user_resp.trim().toLowerCase() === q.correct_option.trim().toLowerCase()
  ).length;

  const accuracy = answered > 0 ? (correct / answered) * 100 : 0;

  return {
    total,
    answered,
    correct,
    accuracy: Number(accuracy.toFixed(2)),
  };
};

export default function RepeatedPYQListScreen() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const { user, getToken } = useAuth();

  const { pyqList, setPYQList, userResponses } = usePYQContext();
  const fadeAnim = useState(new Animated.Value(0))[0];

  usePreventScreenCapture();



  const fetchPYQs = async () => {
    // If already in cache, just update the context and lite list


    setLoading(true);
    const token = await getToken();

    try {
      const response = await fetch(GET_REPEATED_PYQS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          user_id: user?.user_id,
        }),
      });

      const json = await response.json();

      console.log("Repeated PYQs", json);

      if (json.success) {

        console.log("Success")
        const fullData = json.pyqs || [];



        // Update active context for details screen
        setPYQList(fullData);
      } else {
        // Handle case where year has no data

        setPYQList([]);
      }
    } catch (err) {
      console.error("Error fetching PYQs", err);
    } finally {
      setLoading(false);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  };



  // Effect for year change (after initial)
  useEffect(() => {

    fetchPYQs();

  }, []);

  const listRef = React.useRef<ScrollView>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const fadeAnim1 = React.useRef(new Animated.Value(0)).current;

  const handleScroll = (e: any) => {
    const y = e.nativeEvent.contentOffset.y;
    if (y > 250 && !showScrollTop) {
      setShowScrollTop(true);
      Animated.timing(fadeAnim1, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else if (y <= 250 && showScrollTop) {
      setShowScrollTop(false);
      Animated.timing(fadeAnim1, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  const scrollToTop = () => {
    listRef.current?.scrollTo({ y: 0, animated: true });
  };

  const filteredPYQs = useMemo(() => {
    return pyqList || [];
  }, [pyqList]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <LinearGradient
        colors={["#f8fafc", "#e6f1ff", "#e8dcff"]}
        locations={[0, 0.5, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        <TopHeader title="Repeated PYQs" showBackArrow={true} />

        <ScrollView
          ref={listRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        >
          <View style={styles.resultsContainer}>
            <View style={styles.screenHeader}>
              <Text style={styles.title}>{"Repeated PYQs"}</Text>
              <View>
                {
                  pyqList.length > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>
                        {pyqList.length} Questions
                      </Text>
                    </View>
                  )
                }

              </View>
            </View>
          </View>




          {/* Results Container Wrapper */}
          <View style={styles.resultsContainer}>
            {/* 🧮 Result Count */}
            <View style={styles.resultRow}>
              <Text style={styles.resultCount}>
                Total Questions: {filteredPYQs.length}
              </Text>
            </View>

            {loading ? (
              <View style={{ paddingVertical: 0 }}>
                <QuestionCardSkeleton />
                <QuestionCardSkeleton />
                <QuestionCardSkeleton />
                <QuestionCardSkeleton />
              </View>
            ) : filteredPYQs.length === 0 ? (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultTitle}>No Questions Found</Text>
                <Text style={styles.noResultSub}>
                  There are no repeated PYQs available at the moment.
                </Text>
              </View>
            ) : (
              filteredPYQs.map((item, index) => (
                <PYQCard
                  key={item.id}
                  question={item}
                  index={index}
                  id={item.id.toString()}
                  router={router}
                  isSolved={!!userResponses[item.id.toString()] || !!item.user_resp}
                />
              ))
            )}
          </View>
        </ScrollView>
        {showScrollTop && (
          <Animated.View style={[styles.scrollTopBtn, { opacity: fadeAnim1 }]}>
            <TouchableOpacity
              onPress={scrollToTop}
              style={styles.scrollTopTouchable}
            >
              <Ionicons name="chevron-up" size={24} color="#000" />
            </TouchableOpacity>
          </Animated.View>
        )}
      </LinearGradient>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  screenHeader: {
    flexDirection: "row",
    justifyContent: "space-between",

  },
  title: {
    fontSize: 18,
    fontFamily: "SourceSans3SemiBold",
    color: "#004aad",
    maxWidth: 200,
  },
  badge: {
    borderWidth: 1,
    borderColor: "#d9d9d9",
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 12,
    color: "#151515",
    fontFamily: "SourceSans3Medium",
  },
  filterRow: {
    marginHorizontal: 0, // Negative margin to allow chips to scroll to edges
  },
  yearChipsContainer: {

    gap: 10,

  },
  yearChip: {
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 99,
    borderWidth: 1.5,
    minWidth: 80,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  activeYearChip: {
    backgroundColor: "#ff5e32",
    borderColor: "#ff5e32",
  },
  inactiveYearChip: {
    borderColor: "#d9d9d9",
  },
  yearChipText: {
    fontSize: 15,
    fontFamily: "SourceSans3SemiBold",
  },
  activeYearChipText: {
    color: "#fff",
  },
  inactiveYearChipText: {
    color: "#404040",
  },
  clearFilterBtn: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    marginTop: 0,
    marginBottom: 12,
  },
  clearFilterText: {
    fontSize: 14,
    fontFamily: "SourceSans3SemiBold",
    color: "#99b3e6",
    marginLeft: 2,
  },
  resultsContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 12, // Reduced padding to match chapters page feel

    marginBottom: 20,
  },
  resultRow: {
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  resultCount: {
    fontSize: 16,
    fontFamily: "SourceSans3SemiBold",
    color: "#004aad",
  },
  chapterTag: {
    width: "100%",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#fff",
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  questionTag: {
    backgroundColor: "#f0f7d4",
    borderWidth: 1,
    borderColor: "#b6cf4f",
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  questionTagText: {
    fontSize: 12,
    color: "#8b9e3dff",
    fontFamily: "SourceSans3Medium",
  },
  solveButton: {
    backgroundColor: "#ff5e32",
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 999,
  },
  solveButtonText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "SourceSans3SemiBold",
  },
  questionContent: {
    marginBottom: 12,
    marginTop: 8,
  },
  questionText: {
    fontSize: 17,
    color: "#000",
    fontFamily: "SourceSans3SemiBold",
  },
  bottomSubRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  analysisTab: {
    marginBottom: 20,
    marginTop: 10,
  },
  cutoffWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  cutoffBox: {
    borderRadius: 12,
    paddingVertical: 6,
    minWidth: 70,
    flex: 1,
    alignItems: "center",
  },
  cutoffCategory: {
    fontSize: 10,
    letterSpacing: 0.4,
    fontFamily: "SourceSans3Medium",
  },
  cutoffValue: {
    fontSize: 16,
    color: "#0F172A",
    fontFamily: "SourceSans3SemiBold",
    marginTop: -2,
  },
  noResultsContainer: {
    alignItems: "center",
    padding: 40,
    marginTop: 20,
  },
  noResultTitle: {
    fontSize: 20,
    color: "#444",
    fontFamily: "SourceSans3Bold",
    marginTop: 16,
    textAlign: "center",
  },
  noResultSub: {
    fontSize: 15,
    color: "#777",
    fontFamily: "SourceSans3Regular",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 22,
  },
  scrollTopBtn: {
    position: "absolute",
    bottom: 20,
    right: 20,
    elevation: 5,
  },
  scrollTopTouchable: {
    backgroundColor: "#e6e6e6",
    width: 46,
    height: 46,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#cccccc",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 4, height: 6 },
    shadowRadius: 3,
  },
});
