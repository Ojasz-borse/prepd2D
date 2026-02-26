import MathText from "@/components/MathText";
import TopHeader from "@/components/TopHeader";
import { GET_DIFFICULTY_PYQS } from "@/constants/config";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/services/api";
import { usePYQContext } from "@/context/PYQContext";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  FlatList,
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

/* =========================
   PYQ CARD (UNCHANGED UI)
========================= */
const PYQCard = React.memo(
  ({ question, index, id, router, isSolved }: any) => {
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
            <Text style={styles.questionTagText}>
              Question {index + 1}
            </Text>
          </View>

          <Text
            style={{
              fontSize: 12,
              color: "#009933",
              fontFamily: "SourceSans3SemiBold",
            }}
          >
            {isSolved && "Solved"}
          </Text>
        </View>

        <View style={styles.questionContent}>
          <MathText content={question.pyq_content} />
        </View>

        <View style={styles.bottomSubRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              Multiple Choice • 4 Options
            </Text>
          </View>

          <TouchableOpacity
            style={styles.solveButton}
            onPress={handleSolve}
          >
            <Text style={styles.solveButtonText}>Solve</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }
);

/* =========================
   SCREEN
========================= */
export default function DifficultyPYQScreen() {
  const router = useRouter();
  const { difficulty } =
    useLocalSearchParams<{ difficulty: string }>();

  const { user, getToken } = useAuth();
  const {
    difficultyPYQList,
    setDifficultyPYQList,
    setPYQList,
    userResponses,
  } = usePYQContext();

  const [loading, setLoading] = useState(true);
  const listRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const fadeScrollBtn = useRef(new Animated.Value(0)).current;
  const [showScrollTop, setShowScrollTop] = useState(false);

  usePreventScreenCapture();
  
  const { isAllowed } = useSubscriptionLock({
    gate: "before",
  });
  const [showLock, setShowLock] = useState(false);
  
  useEffect(() => {
      if (!isAllowed) {
        setShowLock(true);
      } else {
        setShowLock(false);
      }
    }, [isAllowed]);

  /* =========================
     FETCH (UNCHANGED LOGIC)
  ========================= */
  const fetchPYQs = async () => {
    setLoading(true);
    const token = await getToken();

    try {
      const response = await apiFetch(GET_DIFFICULTY_PYQS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          user_id: user?.user_id,
          difficulty: difficulty || "Easy",
        }),
      });

      const json = await response.json();
      const data = json.success ? json.pyqs || [] : [];

      setDifficultyPYQList(data);
      setPYQList(data);
    } catch (e) {
      console.error("Error fetching PYQs", e);
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
    if (difficulty) fetchPYQs();
  }, [difficulty]);

  /* =========================
     MEMOIZED DATA (SAFE)
  ========================= */
  const filteredPYQs = useMemo(
    () => difficultyPYQList || [],
    [difficultyPYQList]
  );

  const handleScroll = useCallback(
    (e: any) => {
      const y = e.nativeEvent.contentOffset.y;

      if (y > 250 && !showScrollTop) {
        setShowScrollTop(true);
        Animated.timing(fadeScrollBtn, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      } else if (y <= 250 && showScrollTop) {
        setShowScrollTop(false);
        Animated.timing(fadeScrollBtn, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    },
    [showScrollTop]
  );

  const renderItem = useCallback(
    ({ item, index }: any) => (
      <PYQCard
        question={item}
        index={index}
        id={item.id}
        router={router}
        isSolved={
          !!userResponses[item.id.toString()] ||
          !!item.user_resp ||
          !!(item as any).user_response
        }
      />
    ),
    [userResponses]
  );

  const scrollToTop = useCallback(() => {
    listRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  }, []);

  const ListHeaderComponent = useCallback(() => (
    <View style={styles.resultsContainer}>
      <View style={styles.screenHeader}>
        <Text style={styles.title}>{`${difficulty || "Easy"} PYQs`}</Text>
        <View>
          {difficultyPYQList.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {difficultyPYQList.length} Questions
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  ), [difficulty, difficultyPYQList.length]);

  const ListEmptyComponent = useCallback(() => (
    <View style={styles.noResultsContainer}>
      <Text style={styles.noResultTitle}>No Questions Found</Text>
      <Text style={styles.noResultSub}>
        There are no difficulty PYQs available at the moment.
      </Text>
    </View>
  ), []);

  /* =========================
     UI (COMPLETE FROM OLD CODE)
  ========================= */
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <LinearGradient
        colors={["#f8fafc", "#e6f1ff", "#e8dcff"]}
        locations={[0, 0.5, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        <TopHeader
          title={`${difficulty || "Easy"} PYQs`}
          showBackArrow={true}
        />

        <ScrollView
          ref={listRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        >
          <ListHeaderComponent />

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
              </View>
            ) : filteredPYQs.length === 0 ? (
              <ListEmptyComponent />
            ) : (
              filteredPYQs.map((item, index) => (
                <PYQCard
                  key={item.id}
                  question={item}
                  index={index}
                  id={item.id}
                  router={router}
                  isSolved={
                    !!userResponses[item.id.toString()] ||
                    !!item.user_resp ||
                    !!(item as any).user_response
                  }
                />
              ))
            )}
          </View>
        </ScrollView>

        {showScrollTop && (
          <Animated.View
            style={[
              styles.scrollTopBtn,
              { opacity: fadeScrollBtn },
            ]}
          >
            <TouchableOpacity
              onPress={scrollToTop}
              style={styles.scrollTopTouchable}
            >
              <Ionicons
                name="chevron-up"
                size={24}
                color="#000"
              />
            </TouchableOpacity>
          </Animated.View>
        )}

        {showLock && (
          <SubscriptionLockSheet
            visible={showLock}
            planType="before"
            // onClose={closeLock}
          />
        )}
      </LinearGradient>
    </SafeAreaView>
  );
}

/* =========================
   STYLES (FROM OLD CODE - COMPLETE)
========================= */
const styles = StyleSheet.create({
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  screenHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  resultsContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 12,
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
  bottomSubRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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