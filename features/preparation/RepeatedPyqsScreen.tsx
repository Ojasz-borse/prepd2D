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
  InteractionManager,
  LayoutAnimation,
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
import { useSubscriptionLock } from "@/hooks/useSubcribtion";
import SubscriptionLockSheet from "@/components/ShowLockScreen";

type PYQCardProps = {
  question: any;
  index: number;
  id: string;
  router: any;
  isSolved: boolean;
};

export interface RepeatedQuestion {
  question_year: string;
  id: number;
  pyq_content: string;
  user_resp: string | null;
}

export interface RepeatedPYQGroup {
  chapter_name: string;
  subject_name: string;
  sub_topic: string;
  repeat_count: string;
  questions: RepeatedQuestion[];
}

const IndividualQuestionPreview = React.memo(({
  q,
  index,
  isSolved,
  onPress
}: {
  q: RepeatedQuestion;
  index: number;
  isSolved: boolean;
  onPress: (idx: number) => void;
}) => {
  return (
    <TouchableOpacity
      style={styles.questionPreview}
      onPress={() => onPress(index)}
      activeOpacity={0.7}
    >
      <View style={styles.questionPreviewHeader}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View style={styles.subjectTag}>
            <Text style={styles.subjectTagText}>Question {index + 1}</Text>
          </View>
          <Text style={styles.separator}>•</Text>
          <Text style={styles.questionYearText}>{q.question_year}</Text>
        </View>
        {isSolved && (
          <Text style={styles.solvedText}>Solved</Text>
        )}
      </View>
      <MathText content={q.pyq_content || "No content available"} />
    </TouchableOpacity>
  );
});

const RepeatedPYQCard = React.memo(({ group, index, router, userResponses }: { group: RepeatedPYQGroup; index: number; router: any; userResponses: any }) => {
  const { setPYQList } = usePYQContext();
  const [expanded, setExpanded] = useState(false);
  const [visibleCount, setVisibleCount] = useState(2);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (expanded && visibleCount < group.questions.length) {
      timer = setTimeout(() => {
        setVisibleCount(prev => Math.min(prev + 3, group.questions.length));
      }, 50); // Fast incremental load
    }
    return () => clearTimeout(timer);
  }, [expanded, visibleCount, group.questions.length]);

  const toggleExpand = () => {
    if (!expanded) {
      setVisibleCount(2); // Start with a few
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const handleSolve = (questionIndex = 0) => {
    // Set the global pyqList to questions in this cluster
    setPYQList(group.questions as any);

    InteractionManager.runAfterInteractions(() => {
      router.push({
        pathname: "/pyq-detail",
        params: {
          currentIndex: questionIndex.toString(),
        },
      });
    });
  };

  const displayQuestions = expanded
    ? group.questions.slice(0, visibleCount)
    : [group.questions[0]];

  return (
    <View style={styles.repeatedCard}>
      <View style={styles.cardHeader}>
        <View style={styles.subjectRow}>
          <View style={styles.subjectTag}>
            <Text style={styles.subjectTagText}>{group.subject_name}</Text>
          </View>
          <Text style={styles.separator}>•</Text>
          <Text style={styles.chapterText}>{group.chapter_name}</Text>
        </View>
        <View style={styles.repeatBadge}>
          <Text style={styles.repeatBadgeText}>Repeated {group.repeat_count} Times</Text>
        </View>
      </View>

      <Text style={styles.subTopicTitle}>{group.sub_topic}</Text>

      <View style={styles.questionsContainer}>
        {displayQuestions.map((q, qIndex) => (
          <IndividualQuestionPreview
            key={q.id}
            q={q}
            index={qIndex}
            isSolved={!!userResponses[q.id.toString()] || !!q.user_resp}
            onPress={handleSolve}
          />
        ))}
        {expanded && visibleCount < group.questions.length && (
          <QuestionCardSkeleton />
        )}
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.yearList}>
          {group.questions.length > 1 && (
            <TouchableOpacity
              onPress={toggleExpand}
              style={styles.moreButton}
            >
              <Text style={styles.moreYears}>
                {expanded ? "Show Less" : `+${group.questions.length - 1} more`}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleSolve(0)}>
          <Text style={styles.actionButtonText}>Solve Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

export default function RepeatedPYQListScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { user, getToken } = useAuth();

  const { repeatedPYQList, setRepeatedPYQList, userResponses } = usePYQContext();
  const fadeAnim = useState(new Animated.Value(0))[0];

  usePreventScreenCapture();

  const { showLock } = useSubscriptionLock({ gate: "before" });

  const fetchPYQs = async () => {
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
      if (json.success) {
        setRepeatedPYQList(json.data || []);
      } else {
        setRepeatedPYQList([]);
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
      Animated.timing(fadeAnim1, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    } else if (y <= 250 && showScrollTop) {
      setShowScrollTop(false);
      Animated.timing(fadeAnim1, { toValue: 0, duration: 200, useNativeDriver: true }).start();
    }
  };

  const scrollToTop = () => {
    listRef.current?.scrollTo({ y: 0, animated: true });
  };

  const renderItem = React.useCallback(({ item, index }: { item: any, index: number }) => (
    <RepeatedPYQCard
      group={item}
      index={index}
      router={router}
      userResponses={userResponses}
    />
  ), [router, userResponses]);

  const headerComponent = useMemo(() => (
    <View style={styles.resultsContainer}>
      <View style={styles.screenHeader}>
        <Text style={styles.title}>{"Repeated PYQs"}</Text>
        <View>
          {repeatedPYQList.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {repeatedPYQList.length} Repeated Types
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  ), [repeatedPYQList.length]);

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
          {headerComponent}

          {loading ? (
            <View style={styles.resultsContainer}>
              <QuestionCardSkeleton />
              <QuestionCardSkeleton />
              <QuestionCardSkeleton />
              <QuestionCardSkeleton />
            </View>
          ) : (
            <Animated.View style={{ opacity: fadeAnim }}>
              <View style={styles.resultsContainer}>
                {/* 🧮 Result Count */}
                <View style={styles.resultRow}>
                  <Text style={styles.resultCount}>
                    Total Repeated Types: {repeatedPYQList.length}
                  </Text>
                </View>

                {repeatedPYQList.length === 0 ? (
                  <View style={styles.noResultsContainer}>
                    <Text style={styles.noResultTitle}>No Questions Found</Text>
                    <Text style={styles.noResultSub}>
                      There are no repeated PYQs available at the moment.
                    </Text>
                  </View>
                ) : (
                  repeatedPYQList.map((item, index) => (
                    <RepeatedPYQCard
                      key={index}
                      group={item}
                      index={index}
                      router={router}
                      userResponses={userResponses}
                    />
                  ))
                )}
              </View>
            </Animated.View>
          )}
        </ScrollView>
        {showScrollTop && (
          <Animated.View style={[styles.scrollTopBtn, { opacity: fadeAnim1 }]}>
            <TouchableOpacity onPress={scrollToTop} style={styles.scrollTopTouchable}>
              <Ionicons name="chevron-up" size={24} color="#000" />
            </TouchableOpacity>
          </Animated.View>
        )}

        {showLock && (
          <SubscriptionLockSheet
            visible={showLock}
            title="Before MHT-CET Plan"
            description="Unlock most repeated MHT-CET questions (2019–2025)."
            subDescription="To unlock repeated questions you must buy this plan."
            priceText="Unlock Before MHT-CET Plan - ₹199"
            upiAmount={199}
            userId={user?.user_id}
            paymentTag="before_subscription"
          />
        )}
      </LinearGradient>
    </SafeAreaView>
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
  resultRow: {
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  resultCount: {
    fontSize: 16,
    fontFamily: "SourceSans3SemiBold",
    color: "#004aad",
  },
  resultsContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 12,
    marginBottom: 20,
  },
  repeatedCard: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  subjectRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  subjectTag: {
    backgroundColor: "#f0f7d4",
    borderWidth: 1,
    borderColor: "#b6cf4f",
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  subjectTagText: {
    fontSize: 12,
    color: "#8b9e3dff",
    fontFamily: "SourceSans3Medium",
  },
  separator: {
    marginHorizontal: 6,
    color: "#94a3b8",
    fontSize: 12,
  },
  chapterText: {
    fontSize: 12,
    fontFamily: "SourceSans3Medium",
    color: "#64748b",
  },
  repeatBadge: {
    backgroundColor: "#fff2ee",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: "#ffdfd6",
  },
  repeatBadgeText: {
    fontSize: 12,
    color: "#ff5e32",
    fontFamily: "SourceSans3Medium",
  },
  subTopicTitle: {
    fontSize: 16,
    fontFamily: "SourceSans3Medium",
    color: "#1e293b",
    marginBottom: 12,
    lineHeight: 24,
  },
  questionPreview: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 12,
  },
  questionPreviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  questionYearText: {
    fontSize: 12,
    fontFamily: "SourceSans3Medium",
    color: "#64748b",
  },
  solvedText: {
    fontSize: 12,
    color: "#009933",
    fontFamily: "SourceSans3SemiBold",
  },
  questionsContainer: {
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  yearList: {
    flexDirection: "row",
    alignItems: "center",
  },
  moreButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  yearTag: {
    backgroundColor: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginRight: 6,
  },
  yearTagText: {
    fontSize: 11,
    color: "#475569",
    fontFamily: "SourceSans3SemiBold",
  },
  moreYears: {
    fontSize: 11,
    color: "#94a3b8",
    fontFamily: "SourceSans3Medium",
  },
  actionButton: {
    backgroundColor: "#ff5e32",
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 999,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "SourceSans3SemiBold",
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
