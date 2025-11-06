import MathText from "@/components/MathText";
import PyqQuestionCardSkeleton from "@/components/PyqQuestionCardSkeleton";
import TopHeader from "@/components/TopHeader";
import { GET_PYQS } from "@/constants/config";
import { useAuth } from "@/context/AuthContext";
import { usePYQContext } from "@/context/PYQContext";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Animated,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PYQListScreen() {
  const router = useRouter();
  const { id, chapter_name, title } = useLocalSearchParams<{
    id: string;
    chapter_name: string;
    title: string;
  }>();

  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();
  const fadeAnim = useState(new Animated.Value(0))[0];

  const { pyqList, setPYQList } = usePYQContext();

  const [lastProgress, setLastProgress] = useState<number | null>(null);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const data = await AsyncStorage.getItem("PYQ_PROGRESS");
        const progress = data ? JSON.parse(data) : {};
        const chapterProgress = progress[id]; // current chapterId
        if (chapterProgress !== undefined) setLastProgress(chapterProgress);
      } catch (err) {
        console.error("Error loading progress", err);
      }
    };
    loadProgress();
  }, []);

  useEffect(() => {
    const fetchPYQs = async () => {
      const token = await getToken();
      try {
        const response = await fetch(GET_PYQS, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({ chapter_id: id }),
        });

        const json = await response.json();
        if (json.success) setPYQList(json.pyqs);
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f2f2f2" }}>
      <LinearGradient
        colors={["#004aad", "#004aad"]}
        style={styles.headerGradient}
      >
        <TopHeader title={title} showBackArrow={true} />
      </LinearGradient>

      <FlatList
        data={pyqList}
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
            {lastProgress !== null && (
              <View style={styles.analysisTab}>
                <Text style={styles.analysisTabTitle}>
                  Q. {lastProgress} of {pyqList.length > 0 && pyqList.length}{" "}
                  Completed
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/pyq-detail",
                      params: { currentIndex: lastProgress.toString() },
                    })
                  }
                >
                  <Text style={styles.analysisTabTitle}>
                    Continue from Q. {lastProgress + 1}{" "}
                    <Ionicons name="arrow-forward" size={14} color="#b38f00" />
                  </Text>
                </TouchableOpacity>
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
                  <Text style={styles.questionNumberText}>
                    Question {index + 1}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#004aad" />
              </View>

              <View style={styles.questionContent}>
                <MathText content={item.pyq_content} />
              </View>

              <View style={styles.cardFooter}>
                <View style={styles.optionsIndicator}>
                  <Text style={styles.optionsText}>
                    Multiple Choice • 4 Options
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
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
    borderWidth: 1,
    borderColor: "#ffe680",
    backgroundColor: "#fff5cc",
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  analysisTabTitle: {
    color: "#b38f00",
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
});
