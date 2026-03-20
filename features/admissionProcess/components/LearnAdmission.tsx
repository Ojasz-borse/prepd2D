import React, { useState, useMemo, useEffect } from "react";
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
import courseData from "../../../dataConfig/course.json";

const { width } = Dimensions.get("window");

interface Question {
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

export default function LearnAdmission() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [language, setLanguage] = useState<"en" | "mr" | "hi">("en");
  const [doneQuestions, setDoneQuestions] = useState<Set<number>>(new Set());

  // Load progress from AsyncStorage
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const saved = await AsyncStorage.getItem(ASYNC_STORAGE_KEY);
        if (saved) {
          setDoneQuestions(new Set(JSON.parse(saved)));
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
    return (courseData as Question[]).filter((q) =>
      q.question.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const totalQuestions = (courseData as Question[]).length;
  const progressPercent = (doneQuestions.size / totalQuestions) * 100;

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

        <Text style={styles.cardQuestion} numberOfLines={2}>
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
        data={filteredQuestions}
        renderItem={({ item, index }) => (
          <View style={styles.columnWrapper}>
            <View style={styles.itemContainer}>
              {renderCard({ item, index })}
            </View>
            {/* Logic for 2 columns handle if odd results */}
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={<View style={styles.listFooter} />}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.flatListColumnWrapper}
        showsVerticalScrollIndicator={true}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyState}>
              <Feather name="search" size={48} color="#cbd5e1" />
              <Text style={styles.emptyText}>No questions found matching your search.</Text>
            </View>
          </View>
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
  flatListColumnWrapper: {
    backgroundColor: "#fff",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#e2e8f0",
    paddingHorizontal: 16,
  },
  columnWrapper: {
    flex: 1,
    marginBottom: 16,
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
    width: "95%",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    height: 145,
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
});
