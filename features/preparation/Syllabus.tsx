import SearchIcon from "@/assets/icons/SearchIcon";
import syllabusData from "@/dataConfig/chapters.json";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Animated,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";

interface Chapter {
  id: number;
  chapter_no: number;
  chapter_name: string;
  weightage: number;
  topics: { topic: string; sub_topic: string[] }[];
  subject: number;
  class: number;
}

interface DropdownItemProps {
  label: string;
  isSelected: boolean;
}

const DropdownItem: React.FC<DropdownItemProps> = ({ label, isSelected }) => (
  <View style={styles.itemRow}>
    <Ionicons
      name={isSelected ? "checkbox" : "square-outline"}
      size={20}
      color={isSelected ? "#004aad" : "#999"}
      style={{ marginRight: 8 }}
    />
    <Text style={[styles.itemText, isSelected && { color: "#004aad" }]}>
      {label}
    </Text>
  </View>
);

const renderDropdownItem = (
  item: { label: string; value: string },
  selectedValues: string[]
) => {
  const isSelected = selectedValues.includes(item.value);
  return <DropdownItem label={item.label} isSelected={isSelected} />;
};

export default function Syllabus() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [chaptersData, setChaptersData] = useState<Chapter[]>([]);

  useEffect(() => {
    setChaptersData(syllabusData);
  }, []);

  const filteredData = useMemo(() => {
    const search = searchText.toLowerCase();
    const subjectMap: Record<number, string> = {
      1: "Physics",
      2: "Chemistry",
      3: "Maths",
    };
    const classMap: Record<number, string> = { 1: "11th", 2: "12th" };

    return chaptersData.filter((chapter) => {
      const subjectName = subjectMap[chapter.subject];
      const className = classMap[chapter.class];

      const matchesSubject =
        !selectedSubject || subjectName === selectedSubject;
      const matchesClass =
        selectedClasses.length === 0 || selectedClasses.includes(className);
      const matchesSearch = chapter.chapter_name.toLowerCase().includes(search);

      return matchesSubject && matchesClass && matchesSearch;
    });
  }, [chaptersData, searchText, selectedSubject, selectedClasses]);

  const listRef = React.useRef<FlatList>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  const handleScroll = (e: any) => {
    const y = e.nativeEvent.contentOffset.y;
    if (y > 250 && !showScrollTop) {
      setShowScrollTop(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else if (y <= 250 && showScrollTop) {
      setShowScrollTop(false);
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  const scrollToTop = () => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const clearFilters = () => {
    setSearchText("");
    setSelectedSubject("");
    setSelectedClasses([]);
  };

  const handleChapterPress = (chapter: Chapter) => {
    const title = `${chapter.chapter_no}. ${
      chapter.subject === 1
        ? "Physics"
        : chapter.subject === 2
        ? "Chemistry"
        : "Mathematics"
    }`;
    router.push({
      pathname: "/chapter-details",
      params: { id: chapter.id.toString() },
    });
  };

  return (
    <>
      <FlatList
        ref={listRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleChapterPress(item)}>
            <View style={styles.chapterTag}>
              <View style={styles.subRow}>
                <Text style={styles.subText}>
                  {item.subject === 1
                    ? "Physics"
                    : item.subject === 2
                    ? "Chemistry"
                    : "Mathematics"}
                </Text>
                <Text style={styles.subText}>
                  {item.class === 1 ? "11th" : "12th"}
                </Text>
              </View>

              <Text style={styles.chapterText}>
                {item.chapter_no}. {item.chapter_name}
              </Text>

              <View style={styles.bottomSubRow}>
                <View style={styles.bottomSubRowView}>
                  <Text style={styles.bottomSubRowText}>
                    Weightage: {item.weightage}
                  </Text>
                </View>
              </View>

              <View style={styles.topicContainer}>
                {item.topics
                  .slice(0, 5)
                  .map((e: { topic: string }, i: number) => (
                    <View key={i} style={styles.topic}>
                      <Text style={styles.topicText}>{e.topic}</Text>
                    </View>
                  ))}

                {item.topics.length > 5 && (
                  <View style={styles.topic}>
                    <Text style={[styles.topicText, { color: "#007BFF" }]}>
                      +{item.topics.length - 5} more
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.noResult}>No chapters found</Text>
        }
        contentContainerStyle={{
          padding: 4,
          paddingTop: 16,
          paddingBottom: 10,
        }}
        ListHeaderComponent={
          <>
            <View style={styles.searchContainer}>
              <SearchIcon size={18} focused={false} />
              <TextInput
                style={styles.searchBar}
                placeholder="Search by chapter name"
                placeholderTextColor="#777"
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>

            <View style={styles.filterRow}>
              <View style={{ flex: 0.5 }}>
                <Dropdown
                  style={styles.dropdown}
                  data={[
                    { label: "Physics", value: "Physics" },
                    { label: "Chemistry", value: "Chemistry" },
                    { label: "Maths", value: "Maths" },
                  ]}
                  labelField="label"
                  valueField="value"
                  value={selectedSubject}
                  placeholder="Subject"
                  onChange={(item) => setSelectedSubject(item.value)}
                  placeholderStyle={styles.dropdownText}
                  selectedTextStyle={styles.dropdownText}
                  itemTextStyle={styles.dropdownText}
                />
              </View>

              <View style={{ width: 8 }} />

              <View style={{ flex: 0.5 }}>
                <MultiSelect
                  style={styles.dropdown}
                  data={[
                    { label: "11th", value: "11th" },
                    { label: "12th", value: "12th" },
                  ]}
                  labelField="label"
                  valueField="value"
                  placeholder="Select Class"
                  value={selectedClasses}
                  onChange={(items) => setSelectedClasses(items as string[])}
                  renderItem={(item) =>
                    renderDropdownItem(item, selectedClasses)
                  }
                  visibleSelectedItem={false}
                  placeholderStyle={styles.dropdownText}
                  selectedTextStyle={styles.dropdownText}
                  itemTextStyle={styles.dropdownText}
                />
                {selectedClasses.length > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {selectedClasses.length}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.resultCount}>
                Total Chapters: {filteredData.length}
              </Text>

              {(searchText ||
                selectedClasses.length > 0 ||
                selectedSubject) && (
                <TouchableOpacity
                  style={styles.clearFilterBtn}
                  onPress={clearFilters}
                >
                  <MaterialCommunityIcons
                    name="filter-off"
                    size={16}
                    color="#99b3e6"
                  />
                  <Text style={styles.clearFilterText}>Clear Filters</Text>
                </TouchableOpacity>
              )}
            </View>
          </>
        }
      />
      {showScrollTop && (
        <Animated.View style={[styles.scrollTopBtn, { opacity: fadeAnim }]}>
          <TouchableOpacity
            onPress={scrollToTop}
            style={styles.scrollTopTouchable}
          >
            <Ionicons name="chevron-up" size={24} color="#000" />
          </TouchableOpacity>
        </Animated.View>
      )}
    </>
  );
}

// 🧱 Styles
const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  retryBtn: {
    backgroundColor: "#004aad",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 10,
  },
  retryText: {
    color: "#fff",
    fontFamily: "SourceSans3Medium",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ebf0fa",
    borderRadius: 20,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchBar: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    fontFamily: "SourceSans3Medium",
    marginLeft: 8,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
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
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    marginHorizontal: 4,
    marginTop: 10,
  },
  resultCount: {
    fontSize: 14,
    fontFamily: "SourceSans3SemiBold",
    color: "#444",
  },
  clearFilterBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 4,
  },
  clearFilterText: {
    fontSize: 14,
    fontFamily: "SourceSans3SemiBold",
    color: "#99b3e6",
    marginLeft: 2,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 12,
  },
  itemText: {
    fontSize: 16,
    color: "#333",
    fontFamily: "SourceSans3Medium",
  },
  pickerWrapper: { marginHorizontal: 0 },
  badge: {
    position: "relative",
    top: -32,
    left: 110,
    backgroundColor: "#004aad",
    borderRadius: 9999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: "flex-start",
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontFamily: "SourceSans3Medium",
  },
  chapterTag: {
    width: "100%",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#d9d9d9",
    marginBottom: 16,
  },
  chapterText: {
    fontSize: 16,
    color: "#000",
    marginTop: 2,
    fontWeight: "600",
    fontFamily: "SourceSans3Medium",
  },
  subRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subText: {
    fontSize: 14,
    color: "#004aad",
    fontFamily: "SourceSans3Medium",
  },
  noResult: {
    fontSize: 16,
    color: "#777",
    fontFamily: "SourceSans3Medium",
    textAlign: "center",
    marginTop: 20,
  },
  bottomSubRow: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  bottomSubRowView: {
    backgroundColor: "#ebf0fa",
    padding: 2,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  bottomSubRowText: {
    fontSize: 12,
    color: "#004aad",
    fontFamily: "SourceSans3Medium",
  },
  topicContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    gap: 6,
    marginTop: 10,
  },
  topic: {
    borderWidth: 1,
    borderColor: "#d9d9d9",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  topicText: {
    width: "auto",
    fontSize: 11,
    color: "#2d3748",
    fontFamily: "SourceSans3Regular",
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
