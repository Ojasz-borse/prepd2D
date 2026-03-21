import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  Dimensions,
  ScrollView,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import SearchIcon from "@/assets/icons/SearchIcon";
import { Dropdown } from "react-native-element-dropdown";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GET_COURSE_CONTENT } from "@/constants/config";
import { CACHE_COURSE_CONTENT, CACHE_TTL } from "@/constants/cacheStorageConfig";
import { useAuth } from "@/context/AuthContext";
import { fetchWithRetry } from "@/services/api";
import { Animated, Easing } from "react-native";

const { width } = Dimensions.get("window");

export interface Question {
  id: number;
  question: string;
  answers: {
    en: string;
    mr: string;
    hi: string;
  };
}

const LANGUAGES = [
  { label: "English", value: "en" },
  { label: "Marathi", value: "mr" },
  { label: "Hindi", value: "hi" },
];

const ASYNC_STORAGE_KEY = "LEARN_ADMISSION_PROGRESS";

function LearnAdmissionSkeleton() {
  const opacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const loopAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.6,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loopAnimation.start();
    return () => loopAnimation.stop();
  }, [opacity]);

  const SkeletonBox = (props: any) => (
    <Animated.View style={[styles.skeletonBox, { opacity }, props.style]} />
  );

  return (
    <View style={styles.card}>
      <SkeletonBox style={styles.badgeSkeleton} />
      <SkeletonBox style={styles.questionSkeleton} />
      <View style={styles.footerSkeleton}>
        <SkeletonBox style={styles.linkSkeleton} />
      </View>
    </View>
  );
}

interface LearnAdmissionProps {
  data: Question[];
  isLoading: boolean;
  error: string | null;
}

export default function LearnAdmission({ data, isLoading, error }: LearnAdmissionProps) {
  const [courseData, setCourseData] = useState<Question[]>(data || []);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [language, setLanguage] = useState<"en" | "mr" | "hi">("en");
  const [doneQuestions, setDoneQuestions] = useState<Set<number>>(new Set());

  // Set course data from props
  useEffect(() => {
    if (data && data.length > 0) {
      setCourseData(data);
    }
  }, [data]);

  // Load progress
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const savedProgress = await AsyncStorage.getItem(ASYNC_STORAGE_KEY);
        if (savedProgress) {
          setDoneQuestions(new Set(JSON.parse(savedProgress)));
        }
      } catch (e) {
        console.error("Failed to load progress", e);
      }
    };
    loadProgress();
  }, []);

  const markAsDone = async (id: number) => {
    try {
      const newDone = new Set(doneQuestions);
      if (newDone.has(id)) {
        newDone.delete(id);
      } else {
        newDone.add(id);
      }
      setDoneQuestions(newDone);
      await AsyncStorage.setItem(ASYNC_STORAGE_KEY, JSON.stringify(Array.from(newDone)));
      setSelectedQuestion(null);
    } catch (e) {
      console.error("Failed to save progress", e);
    }
  };

  const filteredQuestions = useMemo(() => {
    return courseData.filter((q) =>
      q.question.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, courseData]);

  const totalQuestions = courseData.length;
  const progressPercent = totalQuestions > 0 ? (doneQuestions.size / totalQuestions) * 100 : 0;

  const renderCard = ({ item, index }: { item: Question, index: number }) => {
    const isDone = doneQuestions.has(item.id);
    return (
      <TouchableOpacity
        style={[styles.card, isDone && styles.cardDone]}
        activeOpacity={0.7}
        onPress={() => setSelectedQuestion(item)}
      >
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{index + 1}</Text>
        </View>

        <Text style={styles.cardQuestion} numberOfLines={1}>
          {item.question}
        </Text>

        <View style={styles.cardFooter}>
          <View style={styles.readMoreContainer}>
            <Text style={styles.readMore}>{isDone ? "Review" : "Read Answer"}</Text>
            <Feather name="arrow-right" size={14} color="#004aad" />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View style={styles.headerContent}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchIcon size={18} focused={false} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by questions..."
          placeholderTextColor="#777"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")} style={styles.clearSearch}>
            <Feather name="x" size={18} color="#94a3b8" />
          </TouchableOpacity>
        )}
      </View>

      {/* Progress Bar Area */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Course Progress</Text>
          <Text style={styles.progressValue}>{Math.round(progressPercent)}%</Text>
        </View>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
        </View>
      </View>

      {/* Result Count - Top of the white container */}
      <View style={styles.resultCountContainer}>
        <Text style={styles.resultCount}>
          Total Results: {filteredQuestions.length}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.mainWrapper}>
      <FlatList
        data={(isLoading && filteredQuestions.length === 0) ? ([1, 2, 3, 4] as any) : filteredQuestions}
        renderItem={({ item, index }) => {
          if (isLoading && filteredQuestions.length === 0) {
            return (
              <View style={styles.rowWrapper}>
                <LearnAdmissionSkeleton />
              </View>
            );
          }
          return (
            <View style={styles.rowWrapper}>
              {renderCard({ item: item as Question, index })}
            </View>
          );
        }}
        keyExtractor={(item, index) => (isLoading && filteredQuestions.length === 0 ? `skeleton-${index}` : (item as Question).id?.toString())}
        numColumns={1}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={<View style={styles.listFooter} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={true}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyState}>
                <Feather name="search" size={48} color="#cbd5e1" />
                <Text style={styles.emptyText}>No questions found matching your search.</Text>
              </View>
            </View>
          ) : null
        }
      />

      {/* Answer Modal */}
      <Modal
        visible={!!selectedQuestion}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedQuestion(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Top row with Dropdown */}
            <View style={styles.modalTopRow}>
              <Dropdown
                style={styles.dropdown}
                data={LANGUAGES}
                labelField="label"
                valueField="value"
                value={language}
                onChange={(item) => setLanguage(item.value as any)}
                placeholder="Language"
                placeholderStyle={styles.dropdownText}
                selectedTextStyle={styles.dropdownText}
                itemTextStyle={styles.dropdownText}
              />
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <Text style={styles.modalFullQuestion}>{selectedQuestion?.question}</Text>

              <View style={styles.answerContainer}>
                <Text style={styles.answerHeader}>Answer:</Text>
                <Text style={styles.answerText}>
                  {selectedQuestion?.answers[language] || "Answer not available in this language."}
                </Text>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setSelectedQuestion(null)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.markDoneButton}
                onPress={() => selectedQuestion && markAsDone(selectedQuestion.id)}
              >
                <Text style={styles.markDoneText}>
                  {selectedQuestion && doneQuestions.has(selectedQuestion.id) ? "Mark Undone" : "Mark Done"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    paddingHorizontal: 16,
  },
  headerContent: {
    marginBottom: 0,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d6e0f5",
    borderRadius: 20,
    paddingHorizontal: 12,
    marginBottom: 16,
    marginTop: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    fontFamily: "SourceSans3Medium",
    marginLeft: 8,
    color: "#333",
  },
  clearSearch: {
    padding: 2,
  },
  // Progress Bar Styles
  progressSection: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  progressLabel: {
    fontSize: 14,
    color: "#64748b",
    fontFamily: "SourceSans3SemiBold",
  },
  progressValue: {
    fontSize: 14,
    color: "#004aad",
    fontFamily: "SourceSans3Bold",
  },
  progressBarBg: {
    height: 8,
    backgroundColor: "#f1f5f9",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#10b981", // Success green
    borderRadius: 4,
  },
  resultCountContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: "#e2e8f0",
  },
  resultCount: {
    fontSize: 16,
    fontFamily: "SourceSans3SemiBold",
    color: "#004aad",
  },
  listContent: {
    paddingBottom: 24,
  },
  rowWrapper: {
    backgroundColor: "#fff",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#e2e8f0",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  itemContainer: {
    flex: 1,
  },
  listFooter: {
    height: 40,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: "#e2e8f0",
  },
  card: {
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    height: 110,
    justifyContent: "space-between",
  },
  cardDone: {
    borderColor: "#b6cf4f", // Green border from badge
    borderWidth: 1,
    backgroundColor: "#f0f7d460",
  },
  badge: {
    backgroundColor: "#f0f7d4",
    borderWidth: 1,
    borderColor: "#b6cf4f",
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 2,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 12,
    color: "#8b9e3dff",
    fontFamily: "SourceSans3Medium",
  },
  cardQuestion: {
    fontSize: 15,
    fontFamily: "SourceSans3SemiBold",
    color: "#000",
    lineHeight: 18,
    flex: 1,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  readMoreContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  readMore: {
    fontSize: 14,
    fontFamily: "SourceSans3SemiBold",
    color: "#004aad",
    marginRight: 4,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 24,
    maxHeight: "90%",
    overflow: "hidden",
  },
  modalTopRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  dropdown: {
    height: 40,
    width: 130,
    borderRadius: 20,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d6e0f5",
  },
  dropdownText: {
    fontSize: 14,
    fontFamily: "SourceSans3Medium",
    color: "#333",
  },
  modalBody: {
    padding: 20,
  },
  modalFullQuestion: {
    fontSize: 18,
    fontFamily: "SourceSans3Bold",
    color: "#000",
    marginBottom: 20,
    lineHeight: 24,
  },
  answerHeader: {
    fontSize: 16,
    fontFamily: "SourceSans3SemiBold",
    color: "#64748b",
    marginBottom: 8,
  },
  answerContainer: {
    backgroundColor: "#fff",
  },
  answerText: {
    fontSize: 16,
    fontFamily: "SourceSans3Regular",
    color: "#334155",
    lineHeight: 24,
  },
  modalFooter: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  cancelButton: {
    paddingHorizontal: 18,
    paddingVertical: 6,
  },
  cancelText: {
    color: "#64748b",
    fontSize: 14,
    fontFamily: "SourceSans3SemiBold",
  },
  markDoneButton: {
    backgroundColor: "#ff7a22",
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 999,
  },
  markDoneText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "SourceSans3SemiBold",
  },
  emptyContainer: {
    backgroundColor: "#fff",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#e2e8f0",
    paddingBottom: 40,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: "SourceSans3Regular",
    color: "#94a3b8",
    marginTop: 12,
    textAlign: "center",
    paddingHorizontal: 40,
  },
  skeletonBox: {
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
  },
  badgeSkeleton: {
    width: 30,
    height: 18,
    borderRadius: 12,
    marginBottom: 12,
  },
  questionSkeleton: {
    width: "80%",
    height: 18,
    marginBottom: 12,
  },
  footerSkeleton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  linkSkeleton: {
    width: 100,
    height: 14,
  },
});
