import SearchIcon from "@/assets/icons/SearchIcon";

import PyqChapterCardSkeleton from "@/components/PyqChapterCardSkeleton";
import { useAuth } from "@/context/AuthContext";
import { Chapter } from "@/hooks/usePYQS";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { usePreventScreenCapture } from "@/hooks/usePreventScreenCapture";
import React, { useEffect, useMemo, useState } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import { LinearGradient } from "expo-linear-gradient";
import LockScreen from "@/components/LockScreen";
import Reanimated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown
} from 'react-native-reanimated';



// Types
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

interface PYQProps {
  pyqs: Chapter[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

export default function PYQ({ pyqs, loading, error, reload }: PYQProps) {
  const router = useRouter();
  const { user } = useAuth();

  const [searchText, setSearchText] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [showLock, setShowLock] = useState(false);

  useEffect(() => {
    if (!loading && user && !user.is_subscribed) {
      const timer = setTimeout(() => {
        setShowLock(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [loading, user]);

  usePreventScreenCapture();

  // 🔍 Filtering logic (maps numeric subject/class IDs)
  const filteredData = useMemo(() => {
    const search = searchText.toLowerCase();

    const subjectMap: Record<number, string> = {
      1: "Physics",
      2: "Chemistry",
      3: "Maths",
    };

    const classMap: Record<number, string> = {
      1: "11th",
      2: "12th",
    };

    return pyqs.filter((chapter) => {
      const subjectName = subjectMap[chapter.subject];
      const className = classMap[chapter.class];

      const matchesSubject =
        !selectedSubject || subjectName === selectedSubject;
      const matchesClass =
        selectedClasses.length === 0 || selectedClasses.includes(className);
      const matchesSearch = chapter.chapter_name.toLowerCase().includes(search);

      return matchesSubject && matchesClass && matchesSearch;
    });
  }, [pyqs, searchText, selectedSubject, selectedClasses]);

  const listRef = React.useRef<ScrollView>(null);
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
    listRef.current?.scrollTo({ y: 0, animated: true });
  };

  const clearFilters = () => {
    setSearchText("");
    setSelectedSubject("");
    setSelectedClasses([]);
  };

  // 🧭 Navigation handler
  const handleChapterPress = (
    id: number,
    chapter_name: string,
    chapter_no: number,
    subject: number
  ) => {
    const title = `${subject === 1 ? "Physics" : subject === 2 ? "Chemistry" : "Mathematics"}`;
    router.push({
      pathname: "/pyq-list",
      params: { id: id, chapter_name: chapter_name, title },
    });
  };

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: "red", fontFamily: "SourceSans3Medium" }}>
          {error}
        </Text>
        <TouchableOpacity onPress={reload} style={styles.retryBtn}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ✅ Normal render
  return (
    <>
      <ScrollView
        ref={listRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}

      >
        {/* 🔍 Search bar */}
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

        {/* 🎓 Filters */}
        <View style={styles.filterRow}>
          <View style={[styles.pickerWrapper, { flex: 0.5 }]}>
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
              placeholderStyle={styles.dropdownText}
              selectedTextStyle={styles.dropdownText}
              itemTextStyle={styles.dropdownText}
              value={selectedClasses}
              onChange={(items) => setSelectedClasses(items as string[])}
              renderItem={(item) =>
                renderDropdownItem(item, selectedClasses)
              }
              visibleSelectedItem={false}
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

        {/* Clear Filters Button */}
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

        {/* Results Container */}
        <View style={styles.resultsContainer}>
          {/* 🧮 Result Count */}
          <View style={styles.resultRow}>
            <Text style={styles.resultCount}>
              Total Chapters: {filteredData.length}
            </Text>
          </View>

          {loading ? (
            <>
              <PyqChapterCardSkeleton />
              <PyqChapterCardSkeleton />
              <PyqChapterCardSkeleton />
              <PyqChapterCardSkeleton />
              <PyqChapterCardSkeleton />
              <PyqChapterCardSkeleton />
            </>
          ) : filteredData.length === 0 ? (
            <Text style={styles.noResult}>No chapters found</Text>
          ) : (
            filteredData.map((item) => (
              <TouchableOpacity
                key={item.id}
                // onPress={() =>
                //   handleChapterPress(
                //     item.id,
                //     item.chapter_name,
                //     item.chapter_no,
                //     item.subject
                //   )
                // }
                activeOpacity={0.7}
              >
                <View style={styles.chapterTag}>
                  <View style={styles.subRow}>
                    <View style={styles.subjectTag}>
                      <Text style={styles.subText}>
                        {item.subject === 1
                          ? "Physics"
                          : item.subject === 2
                            ? "Chemistry"
                            : "Mathematics"}
                      </Text>
                    </View>

                    <View style={styles.subjectTag}>
                      <Text style={styles.subText}>
                        {item.class === 1 ? "11th" : "12th"}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.titleRow}>
                    <Text style={styles.chapterTitle}>
                      {item.chapter_no}. {item.chapter_name}
                    </Text>
                    <View>
                      <TouchableOpacity style={styles.solveButton} onPress={() =>
                        handleChapterPress(
                          item.id,
                          item.chapter_name,
                          item.chapter_no,
                          item.subject
                        )
                      }>
                        <Text style={styles.solveButtonText}

                        >Solve</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.bottomSubRow}>
                    <View style={styles.bottomSubRowView}>
                      <Text style={styles.bottomSubRowText}>
                        Total PYQ's: {item.total_pyqs}
                      </Text>
                    </View>
                    <View style={styles.bottomSubRowView}>
                      <Text style={styles.bottomSubRowText}>
                        Weightage: {item.weightage}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
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

      {showLock && (
        <Reanimated.View
          entering={FadeIn.duration(400)}
          style={styles.lockScreenContainer}
        >
          <Reanimated.View
            entering={SlideInDown.duration(600)}
            style={styles.content}
          >
            <View style={styles.handle} />

            <View style={styles.iconContainer}>
              <View style={styles.lockCircle}>
                <Ionicons name="lock-closed" size={40} color="#fff" />
              </View>
            </View>

            <Text style={styles.title}>PYQ coming soon</Text>
            <Text style={styles.description}>
              9,000+ real MHT-CET questions from 2019 to 2025 (Chapter wise) are coming soon for your practice
            </Text>

          </Reanimated.View>
        </Reanimated.View>
      )}
    </>
  );
}

// 🧱 Styles
const styles = StyleSheet.create({
  lockScreenContainer: {
    flex: 1,
    backgroundColor: "#00000050",
    width: "110%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,

    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: "97%",
    position: "absolute",
    left: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    paddingBottom: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    marginBottom: 20,
  },
  iconContainer: {
    marginBottom: 20,
  },
  lockCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#004aad',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#004aad',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontFamily: 'SourceSans3Bold',
    color: '#004aad',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    fontFamily: 'SourceSans3Medium',
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  subscribeButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#004aad',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'SourceSans3SemiBold',
  },
  closeButton: {
    paddingVertical: 12,
  },
  closeButtonText: {
    color: '#94a3b8',
    fontSize: 16,
    fontFamily: 'SourceSans3Medium',
  },

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
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d6e0f5",
    borderRadius: 20,
    paddingHorizontal: 12,
    marginBottom: 12,
    marginTop: 20,
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
    gap: 8,
  },
  dropdown: {
    height: 45,
    borderRadius: 20,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d6e0f5",
    fontFamily: "SourceSans3Medium",
  },
  dropdownText: {
    fontSize: 16,
    fontFamily: "SourceSans3Medium",
    color: "#333",
  },
  resultRow: {
    marginBottom: 12,
  },
  resultsContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginTop: 8,
    padding: 12,
    marginBottom: 20,
  },
  resultCount: {
    fontSize: 16,
    fontFamily: "SourceSans3SemiBold",
    color: "#004aad",
  },
  clearFilterBtn: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    marginTop: 8,
    marginBottom: 8,
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
    borderColor: "#e2e8f0",
    backgroundColor: "#fff",
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  chapterTitle: {
    flex: 1,
    fontSize: 17,
    color: "#000",
    fontFamily: "SourceSans3SemiBold",
    marginRight: 8,
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
  subRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 8,
  },
  subjectTag: {
    backgroundColor: "#f0f7d4",
    borderWidth: 1,
    borderColor: "#b6cf4f",
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  subText: {
    fontSize: 12,
    color: "#8b9e3dff",
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
    marginTop: 6,
  },
  bottomSubRowView: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#004aad",
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 99,
    marginTop: 8,
  },
  bottomSubRowText: {
    fontSize: 12,
    color: "#004aad",
    fontFamily: "SourceSans3Medium",
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
