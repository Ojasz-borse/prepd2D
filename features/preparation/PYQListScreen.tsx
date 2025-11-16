import MathText from "@/components/MathText";
import PyqQuestionCardSkeleton from "@/components/PyqQuestionCardSkeleton";
import TopHeader from "@/components/TopHeader";
import { GET_PYQS } from "@/constants/config";
import { useAuth } from "@/context/AuthContext";
import { usePYQContext } from "@/context/PYQContext";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Animated,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { SafeAreaView } from "react-native-safe-area-context";

type PYQCardProps = {
  question: any;
  index: number;
  id: string;
  router: any;
};

export interface PYQLite {
  question_year: string;
  id: number;
  pyq_content: string;
  user_resp: string | null;
}

const PYQCard = React.memo(({ question, index, id, router }: PYQCardProps) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/pyq-detail",
          params: {
            currentIndex: index.toString(),
            chapterId: id.toString(),
          },
        })
      }
      activeOpacity={0.7}
    >
      <View style={styles.cardGradient}>
        <View style={styles.cardHeader}>
          <View style={styles.questionNumber}>
            <Text style={styles.questionNumberText}>Question {index + 1}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#004aad" />
        </View>

        <View style={styles.questionContent}>
          <MathText content={question.pyq_content} />
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.optionsIndicator}>
            <Text style={styles.optionsText}>Multiple Choice • 4 Options</Text>
          </View>
          {question.user_resp && (
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <Text
                style={{ fontFamily: "SourceSans3Medium", color: "#004aad" }}
              >
                Answered
              </Text>

              <Ionicons name="checkmark-circle" size={18} color="#004aad" />
            </View>
          )}
        </View>
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

export default function PYQListScreen() {
  const router = useRouter();
  const { id, chapter_name, title } = useLocalSearchParams<{
    id: string;
    chapter_name: string;
    title: string;
  }>();

  const [loading, setLoading] = useState(true);
  const { user, getToken } = useAuth();

  const [pyqListLite, setPyqListLite] = useState<PYQLite[]>([]);

  const fadeAnim = useState(new Animated.Value(0))[0];

  const { pyqList, setPYQList } = usePYQContext();

  const [selectedYear, setSelectedYear] = useState<string>("2025");

  useEffect(() => {
    const fetchPYQs = async () => {
      setPYQList([]); // ✅ reset previous chapter questions
      setLoading(true);
      const token = await getToken();

      try {
        const response = await fetch(GET_PYQS, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({ chapter_id: id, user_id: user?.user_id }),
        });

        const json = await response.json();

        if (json.success) {
          // Normalize year type → always string
          const normalized = json.pyqs.map((q: any) => ({
            id: q.id,
            question_year: String(q.question_year),
            pyq_content: q.pyq_content, // Only required field
            user_resp: q.user_resp,
          }));
          setPyqListLite(normalized);
          setPYQList(json.pyqs);
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
    fetchPYQs();
  }, [id]);

  const listRef = React.useRef<FlatList>(null);
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
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const filteredPYQs = useMemo(() => {
    return pyqListLite.filter((q) => q.question_year === selectedYear);
  }, [selectedYear, pyqListLite]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f2f2f2" }}>
      <TopHeader title={title} showBackArrow={true} />

      <FlatList
        ref={listRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        data={filteredPYQs}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <View style={styles.screenHeader}>
              <Text style={styles.title}>{chapter_name}</Text>
              <View>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {pyqList.length > 0 && pyqList.length} Questions
                  </Text>
                </View>
              </View>
            </View>

            {/* 🔽 Year Filter Dropdown */}
            <View style={{ marginBottom: 16 }}>
              <Dropdown
                style={styles.dropdown}
                labelField="label"
                valueField="value"
                placeholder="Select Year"
                placeholderStyle={styles.dropdownText}
                selectedTextStyle={styles.dropdownText}
                itemTextStyle={styles.dropdownText}
                data={[
                  { label: "2025", value: "2025" },
                  { label: "2024", value: "2024" },
                  { label: "2023", value: "2023" },
                  { label: "2022", value: "2022" },
                  { label: "2021", value: "2021" },
                  { label: "2020", value: "2020" },
                  { label: "2019", value: "2019" },
                ]}
                value={selectedYear}
                onChange={(item) => setSelectedYear(item.value)}
              />
            </View>

            {getPYQAnalysis(pyqList).answered > 0 && (
              <View style={styles.analysisTab}>
                <View style={styles.cutoffWrapper}>
                  <View
                    style={[
                      styles.cutoffBox,
                      {
                        backgroundColor: "#e6f5ff",
                        borderWidth: 1,
                        borderColor: "#0099ff80",
                      },
                    ]}
                  >
                    <Text style={[styles.cutoffCategory, { color: "#0099ff" }]}>
                      Total
                    </Text>
                    <Text style={styles.cutoffValue}>
                      {getPYQAnalysis(pyqList).total}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.cutoffBox,
                      {
                        backgroundColor: "#fffae6",
                        borderWidth: 1,
                        borderColor: "#e6b80080",
                      },
                    ]}
                  >
                    <Text style={[styles.cutoffCategory, { color: "#e6b800" }]}>
                      Answered
                    </Text>
                    <Text style={styles.cutoffValue}>
                      {getPYQAnalysis(pyqList).answered}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.cutoffBox,
                      {
                        backgroundColor: "#f0fdf9",
                        borderWidth: 1,
                        borderColor: "#10b98180",
                      },
                    ]}
                  >
                    <Text style={[styles.cutoffCategory, { color: "#10b981" }]}>
                      Correct
                    </Text>
                    <Text style={styles.cutoffValue}>
                      {getPYQAnalysis(pyqList).correct}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.cutoffBox,
                      {
                        backgroundColor: "#fff5e6",
                        borderWidth: 1,
                        borderColor: "#ff660080",
                      },
                    ]}
                  >
                    <Text style={[styles.cutoffCategory, { color: "#ff6600" }]}>
                      Correct
                    </Text>
                    <Text style={styles.cutoffValue}>
                      {getPYQAnalysis(pyqList).correct} %
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </>
        }
        ListEmptyComponent={
          loading ? (
            <>
              <PyqQuestionCardSkeleton />
              <PyqQuestionCardSkeleton />
              <PyqQuestionCardSkeleton />
              <PyqQuestionCardSkeleton />
            </>
          ) : (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultTitle}>No Questions Found</Text>
              <Text style={styles.noResultSub}>
                There are no PYQs available for this chapter yet.
              </Text>
            </View>
          )
        }
        renderItem={({ item, index }) => (
          <PYQCard question={item} index={index} id={id} router={router} />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerGradient: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  analysisTab: {
    marginBottom: 20,
  },
  analysisTabTitle: {
    color: "#004aad",
    fontSize: 16,
    fontFamily: "SourceSans3Medium",
  },
  analysisTabText: {
    color: "#ffffff",
    marginTop: 6,
    fontSize: 14,
    fontFamily: "SourceSans3Medium",
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
  dropdown: {
    height: 45,
    borderRadius: 20,
    paddingHorizontal: 16,
    backgroundColor: "#ebf0fa",
    fontFamily: "SourceSans3Medium",
  },
  dropdownText: {
    fontSize: 16,
    fontFamily: "SourceSans3Medium",
    color: "#333",
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor: "#fff",
  },
  screenHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  title: {
    fontSize: 16,
    fontFamily: "SourceSans3Medium",
    color: "#2d3748",
    maxWidth: 200,
  },
  badge: {
    backgroundColor: "#ebf0fa",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    color: "#004aad",
    fontFamily: "SourceSans3Medium",
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#d9d9d9",
  },
  cardGradient: {
    borderRadius: 20,
    padding: 14,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  questionNumber: {
    backgroundColor: "#ebf0fa",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 8,
  },
  questionNumberText: {
    fontSize: 12,
    color: "#004aad",
    fontFamily: "SourceSans3Medium",
  },
  questionContent: {
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  optionsIndicator: {
    borderWidth: 1,
    borderColor: "#d9d9d9",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  optionsText: {
    fontSize: 11,
    color: "#2d3748",
    fontFamily: "SourceSans3Regular",
  },
  separator: {
    height: 14,
  },
  noResultsContainer: {
    alignItems: "center",
    padding: 40,
    marginTop: 50,
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
    backgroundColor: "#e6e6e6", // Same blue shade used in app
    width: 46,
    height: 46,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#cccccc",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 10,
    shadowOffset: { width: 4, height: 6 },
    shadowRadius: 3,
  },

  cutoffWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cutoffBox: {
    backgroundColor: "#e6f1ff",
    borderRadius: 16,
    paddingVertical: 4,
    minWidth: 82,
    alignItems: "center",
  },
  cutoffCategory: {
    fontSize: 10,
    color: "#0A5BD3",
    letterSpacing: 0.4,
    fontFamily: "SourceSans3Medium",
  },
  cutoffValue: {
    fontSize: 16,
    color: "#0F172A",
    fontFamily: "SourceSans3SemiBold",
    marginTop: -2,
  },
});
