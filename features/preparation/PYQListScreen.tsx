import MathText from "@/components/MathText";
import NormalFindCollegeCardSkeleton from "@/components/NormalFindCollegeCardSkeleton";
import TopHeader from "@/components/TopHeader";
import { GET_PYQS } from "@/constants/config";
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface PYQItem {
  id: number;
  pyq_content: string;
  a: string;
  b: string;
  c: string;
  d: string;
  correct_option: string;
  explanation_content: string;
}

const { width } = Dimensions.get("window");

export default function PYQListScreen() {
  const router = useRouter();
  const { id, chapter_name } = useLocalSearchParams<{
    id: string;
    chapter_name: string;
  }>();

  const [data, setData] = useState<PYQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();
  const fadeAnim = useState(new Animated.Value(0))[0];

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
        if (json.success) setData(json.pyqs);
      } catch (err) {
        console.error("Error fetching PYQs", err);
      } finally {
        setLoading(false);
        // Start fade animation when data is loaded
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }
    };
    fetchPYQs();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Loading Questions...</Text>
      </View>
    );
  }

  if (data.length === 0) {
    return (
      <View style={styles.center}>
        <LinearGradient
          colors={["#004aad", "#004aad"]}
          style={styles.emptyContainer}
        >
          <Ionicons name="document-text-outline" size={64} color="#ffffff" />
          <Text style={styles.emptyTitle}>No Questions Found</Text>
          <Text style={styles.emptySubtitle}>
            There are no PYQs available for this chapter yet.
          </Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={["#004aad", "#004aad"]}
        style={styles.headerGradient}
      >
        <TopHeader title={id || "PYQs"} showBackArrow={true} />
      </LinearGradient>

      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{chapter_name}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{data.length} Questions</Text>
          </View>
        </View>

        <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
          <FlatList
            data={data}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={
              loading ? (
                <>
                  <NormalFindCollegeCardSkeleton />
                  <NormalFindCollegeCardSkeleton />
                  <NormalFindCollegeCardSkeleton />
                  <NormalFindCollegeCardSkeleton />
                </>
              ) : (
                <View style={styles.noResultsContainer}>
                  <Ionicons name="search-outline" size={48} color="#999" />
                  <Text style={styles.noResult}>No PYQs found</Text>
                </View>
              )
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() =>
                  router.push({
                    pathname: "/pyq-detail",
                    params: {
                      data: JSON.stringify(data),
                      currentIndex: index.toString(),
                    },
                  })
                }
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={["#ffffff", "#f8f9fa"]}
                  style={styles.cardGradient}
                >
                  <View style={styles.cardHeader}>
                    <View style={styles.questionNumber}>
                      <Text style={styles.questionNumberText}>
                        Question {index + 1}
                      </Text>
                    </View>
                    <View style={styles.arrowContainer}>
                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color="#004aad"
                      />
                    </View>
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
                </LinearGradient>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    // backgroundColor: "#f5f7ff",
  },
  headerGradient: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontFamily: "SourceSans3Medium",
    color: "#2d3748",
    flex: 1,
  },
  badge: {
    backgroundColor: "#ebf0fa",
    padding: 2,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    color: "#004aad",
    fontFamily: "SourceSans3Medium",
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#d9d9d9",
    marginBottom: 4,
  },
  cardGradient: {
    borderRadius: 20,
    padding: 14,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  questionNumber: {
    backgroundColor: "#ebf0fa",
    padding: 2,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  questionNumberText: {
    fontSize: 12,
    color: "#004aad",
    fontFamily: "SourceSans3Medium",
  },
  arrowContainer: {
    padding: 0,
  },
  questionContent: {
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionsIndicator: {
    backgroundColor: "#e2e8f0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  optionsText: {
    color: "#4a5568",
    fontSize: 11,
    fontFamily: "SourceSans3Regular",
  },
  separator: {
    height: 12,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#0000",
    fontSize: 16,
    fontFamily: "SourceSans3Medium",
    marginTop: 12,
  },
  emptyContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyTitle: {
    color: "#ffffff",
    fontSize: 24,
    fontFamily: "SourceSans3Bold",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "SourceSans3Regular",
    textAlign: "center",
    opacity: 0.9,
    lineHeight: 22,
  },
  noResultsContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  noResult: {
    fontSize: 16,
    color: "#777",
    fontFamily: "SourceSans3Medium",
    textAlign: "center",
    marginTop: 12,
  },
});
