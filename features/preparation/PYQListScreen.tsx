import MathText from "@/components/MathText";
import PyqQuestionCardSkeleton from "@/components/PyqQuestionCardSkeleton";
import TopHeader from "@/components/TopHeader";
import { GET_PYQS } from "@/constants/config";
import { useAuth } from "@/context/AuthContext";
import { usePYQContext } from "@/context/PYQContext";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState, useTransition } from "react";
import {
  Animated,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type PYQCardProps = {
  question: any;
  index: number;
  id: string;
  router: any;
};

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
        </View>
      </View>
    </TouchableOpacity>
  );
});

export default function PYQListScreen() {
  const router = useRouter();
  const { id, chapter_name, title } = useLocalSearchParams<{
    id: string;
    chapter_name: string;
    title: string;
  }>();

  const [loading, setLoading] = useState(true);
  const { user, getToken } = useAuth();
  const fadeAnim = useState(new Animated.Value(0))[0];

  const { pyqList, setPYQList } = usePYQContext();

  const [selectedYear, setSelectedYear] = useState<string>("2025");
  const [isPending, startTransition] = useTransition();

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
          const normalized = json.pyqs.map((q: { question_year: any }) => ({
            ...q,
            question_year: String(q.question_year),
          }));

          setPYQList(normalized);
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
    return pyqList.filter((q) => q.question_year === selectedYear);
  }, [selectedYear, pyqList]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f2f2f2" }}>
      <TopHeader title={title} showBackArrow={true} />

      <FlatList
        key={selectedYear}
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

            {/* 🔽 Year Filter Horizontal Scroll */}
            <View style={{ marginBottom: 16 }}>
              <FlatList
                horizontal
                data={["2025", "2024", "2023", "2022", "2021", "2020", "2019"]}
                keyExtractor={(item) => item}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 10 }}
                renderItem={({ item }) => {
                  const isActive = selectedYear === item;
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        startTransition(() => {
                          setSelectedYear(item);
                        });
                      }}
                      activeOpacity={0.7}
                      style={{
                        paddingHorizontal: 20,
                        paddingVertical: 6,
                        borderRadius: 20,
                        backgroundColor: isActive ? "#004aad" : "#fff",
                        borderWidth: isActive ? 0 : 1,
                        borderColor: "#d9d9d9",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          color: isActive ? "#fff" : "#333",
                          fontFamily: "SourceSans3Medium",
                        }}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>

            {true && (
              <LinearGradient
                colors={["#3399ff", "#004aad"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.analysisTab}
              >
                <Text style={styles.analysisTabTitle}>
                  Chapter Analysis{"  "}
                  <FontAwesome5 name="magic" size={12} color="#fff" />
                </Text>
                <Text style={styles.analysisTabText}>
                  Finish the remaining questions to unlock your Chapter
                  Analysis!
                </Text>
              </LinearGradient>
            )}
          </>
        }
        ListEmptyComponent={
          loading || isPending ? (
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
    borderRadius: 14,
    padding: 10,
    marginBottom: 20,
  },
  analysisTabTitle: {
    color: "#fff",
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
});
