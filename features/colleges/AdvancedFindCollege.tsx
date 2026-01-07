import SearchIcon from "@/assets/icons/SearchIcon";
import AdvancedFindCollegeCard from "@/components/AdvancedFindCollegeCard";
import AdvancedFindCollegeCardSkeleton from "@/components/AdvancedFindCollegeCardSkeleton";
import SmartMatchModal from "@/components/SmartMatchModel";
import { CACHE_MY_COLLEGES_LIST } from "@/constants/cacheStorageConfig";
import { useMyList } from "@/hooks/useMyList";
import { usePreventScreenCapture } from "@/hooks/usePreventScreenCapture";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ScreenCapture from "expo-screen-capture";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Animated,
  FlatList,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MultiSelect } from "react-native-element-dropdown";

interface CollegeBranch {
  branch_name: string;
  choice_code: string;
  college_code: string;
  district: string;
  is_autonomous: boolean;
  is_government: boolean;
  name: string;
  standard_cutoff_data: StandardCutoffData[];
  Open: number | null;
  considered_category_open: string | null;
  OBC: number | null;
  considered_category_obc: string | null;
  TFWS: number | null;
  considered_category_tfws: string | null;
  SC_ST: number | null;
  considered_category_sc_st: string | null;
  VJ_NT: number | null;
  considered_category_vj_nt: string | null;
  percentage?: number;
  tag?: string;
  req_rank?: number;
  considered_category?: string | null;
}

interface StandardCutoffData {
  rank: number;
  category: string;
  percentile: number;
}

interface AdvancedFindCollegeProps {
  branches: CollegeBranch[];
  loading: boolean;
  error: string | null;
  isActive: boolean;
}

interface DropdownItemProps {
  label: string;
  isSelected: boolean;
}

const DropdownItem: React.FC<DropdownItemProps> = ({ label, isSelected }) => {
  return (
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
};

const renderDropdownItem = (
  item: { label: string; value: string },
  selectedValues: string[]
) => {
  const isSelected = selectedValues.includes(item.value);
  return <DropdownItem label={item.label} isSelected={isSelected} />;
};

// ----------------- COMPONENT -----------------
const AdvancedFindCollege: React.FC<AdvancedFindCollegeProps> = ({
  branches,
  loading,
  error,
  isActive,
}) => {
  const [searchText, setSearchText] = useState("");
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [movedCollegesCount, setMovedCollegesCount] = useState<number>();

  // Smart Match
  const [smartMatchEnabled, setSmartMatchEnabled] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [percentile, setPercentile] = useState("");
  const [rank, setRank] = useState("");
  const [category, setCategory] = useState<
    "Open" | "OBC" | "TFWS" | "SC_ST" | "VJ_NT" | null
  >(null);

  // Selection state (same as MyList component)
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);

  // Use your custom hook
  const { saveList, saving } = useMyList();

  // Unique values
  const collegeBranches = [
    ...new Set(branches.map((d) => d.branch_name.toLowerCase())),
  ].sort((a, b) => a.localeCompare(b));

  const districts = [
    ...new Set(branches.map((d) => d.district.toLowerCase())),
  ].sort((a, b) => a.localeCompare(b));

  // Filtering
  const filteredData = useMemo(() => {
    const search = searchText.toLowerCase();

    return branches.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search) ||
        item.branch_name.toLowerCase().includes(search);

      const matchesBranch =
        selectedBranches.length === 0 ||
        selectedBranches.includes(item.branch_name.toLowerCase());

      const matchesDistrict =
        selectedDistricts.length === 0 ||
        selectedDistricts.includes(item.district.toLowerCase());

      return matchesSearch && matchesBranch && matchesDistrict;
    });
  }, [branches, searchText, selectedBranches, selectedDistricts]);

  useEffect(() => {
    const loadStoredColleges = async () => {
      const cached = await AsyncStorage.getItem(CACHE_MY_COLLEGES_LIST);
      if (cached) {
        const parsed = JSON.parse(cached);
        setMovedCollegesCount(parsed.data.length);
      } else {
        setMovedCollegesCount(0);
      }
    };
    loadStoredColleges();
  }, []);

  usePreventScreenCapture();


  const listRef = React.useRef<FlatList<CollegeBranch>>(null);
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
    setSelectedDistricts([]);
    setSelectedBranches([]);
    // Clear selection when clearing filters
    setSelectedCards([]);
    setSelectionMode(false);
  };

  const handleSmartMatchToggle = (value: boolean) => {
    if (value) {
      setModalVisible(true);
    } else {
      setSmartMatchEnabled(false);
      setModalVisible(false);
      setPercentile("");
      setRank("");
      setCategory(null);
    }
  };

  // Selection functions (same as MyList component)
  const handleLongPress = (choiceCode: string) => {
    setSelectionMode(true);
    setSelectedCards((prev) =>
      prev.includes(choiceCode) ? prev : [...prev, choiceCode]
    );
  };

  const handleSelectCard = (choiceCode: string) => {
    if (!selectionMode) return;
    setSelectedCards((prev) =>
      prev.includes(choiceCode)
        ? prev.filter((code) => code !== choiceCode)
        : [...prev, choiceCode]
    );
  };

  // Toggle Select All functionality
  const handleToggleSelectAll = () => {
    if (selectedCards.length === enrichedData.length) {
      // If all are selected, deselect all
      setSelectedCards([]);
    } else {
      // If not all are selected, select all
      const allChoiceCodes = enrichedData.map((item) => item.choice_code);
      setSelectedCards(allChoiceCodes);
    }
  };

  const handleSaveSelectedColleges = async () => {
    if (selectedCards.length === 0) return;

    // Show confirmation alert
    Alert.alert(
      "Save Colleges",
      `Are you sure you want to save ${selectedCards.length} college(s) to your list?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Save",
          onPress: saveCollegesToStorage,
        },
      ]
    );
  };

  const saveCollegesToStorage = async () => {
    try {
      // Get existing cached colleges
      const cached = await AsyncStorage.getItem(CACHE_MY_COLLEGES_LIST);

      let existingColleges: string[] = [];

      if (cached) {
        const parsed = JSON.parse(cached);
        existingColleges = Array.isArray(parsed.data) ? parsed.data : [];
      }

      // Add new selected colleges to existing ones
      const updated = Array.from(
        new Set([...existingColleges, ...selectedCards])
      );

      // Use the hook's saveList function instead of direct AsyncStorage
      await saveList(updated);

      // Update count
      setMovedCollegesCount(updated.length);

      // Clear selection after saving
      setSelectedCards([]);
      setSelectionMode(false);

      // Show success message
      Alert.alert(
        "Success",
        `${selectedCards.length} college(s) saved to your list!`
      );
    } catch (error) {
      console.error("Error saving colleges:", error);
      Alert.alert("Error", "Failed to save colleges. Please try again.");
    }
  };

  const cancelSelection = () => {
    setSelectedCards([]);
    setSelectionMode(false);
  };

  useEffect(() => {
    if (selectedCards.length === 0) setSelectionMode(false);
  }, [selectedCards]);

  const enrichedData = useMemo(() => {
    if (!smartMatchEnabled || !rank || !category) return filteredData;

    const userRank = parseInt(rank, 10);
    if (isNaN(userRank)) return filteredData;

    const mappedData = filteredData.map((item) => {
      let cutoff_rank: number | null = null;
      let considered_category: string | null = null;

      switch (category) {
        case "Open":
          cutoff_rank = item.Open;
          considered_category = item.considered_category_open;
          break;
        case "OBC":
          cutoff_rank = item.OBC;
          considered_category = item.considered_category_obc;
          break;
        case "TFWS":
          cutoff_rank = item.TFWS;
          considered_category = item.considered_category_tfws;
          break;
        case "SC_ST":
          cutoff_rank = item.SC_ST;
          considered_category = item.considered_category_sc_st;
          break;
        case "VJ_NT":
          cutoff_rank = item.VJ_NT;
          considered_category = item.considered_category_vj_nt;
          break;
      }

      if (cutoff_rank == null || Math.abs(cutoff_rank - userRank) > 2000) {
        return { ...item, percentage: undefined };
      }

      let percentage: number;
      if (userRank === cutoff_rank) {
        percentage = 99;
      } else if (userRank > cutoff_rank) {
        const diff = userRank - cutoff_rank;
        percentage = 99 - diff / 10;
      } else {
        const diff = cutoff_rank - userRank;
        percentage = 99 + diff / 10;
      }

      let tag: string;
      if (percentage >= 96 && percentage <= 102) tag = "Exact";
      else if (percentage >= 80 && percentage < 96) tag = "Hard";
      else if (percentage < 80) tag = "Very Hard";
      else if (percentage > 102 && percentage <= 120) tag = "Easy";
      else tag = "Very Easy";

      return {
        ...item,
        percentage: percentage,
        tag,
        req_rank: cutoff_rank,
        considered_category,
      };
    });

    const enriched = mappedData.filter((item) => item.percentage !== undefined);

    // Sort safely
    return enriched.sort((a, b) => {
      const aPerc = a.percentage ?? -Infinity; // undefined → lowest
      const bPerc = b.percentage ?? -Infinity;

      const aAbove100 = aPerc > 100;
      const bAbove100 = bPerc > 100;

      if (aAbove100 && !bAbove100) return 1;
      if (!aAbove100 && bAbove100) return -1;

      return bPerc - aPerc; // descending
    });
  }, [filteredData, smartMatchEnabled, rank, category]);

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  const renderHeader = () => (
    <View style={styles.headerContent}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchIcon size={18} focused={false} />
        <TextInput
          style={styles.searchBar}
          placeholder="Search by college or branch"
          placeholderTextColor="#777"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Filters Row */}
      <View style={styles.filterRow}>
        {/* Branch MultiSelect */}
        <View style={[styles.pickerWrapper, { flex: 0.5 }]}>
          <MultiSelect
            style={styles.dropdown}
            data={collegeBranches.map((b) => ({
              label: b.charAt(0).toUpperCase() + b.slice(1).toLowerCase(),
              value: b,
            }))}
            labelField="label"
            valueField="value"
            placeholder="Branches"
            placeholderStyle={styles.dropdownText}
            selectedTextStyle={styles.dropdownText}
            itemTextStyle={styles.dropdownText}
            value={selectedBranches}
            onChange={(items) => setSelectedBranches(items as string[])}
            renderItem={(item) => {
              const isSelected = selectedBranches.includes(item.value);
              return (
                <DropdownItem label={item.label} isSelected={isSelected} />
              );
            }}
            visibleSelectedItem={false}
          />
          {selectedBranches.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{selectedBranches.length}</Text>
            </View>
          )}
        </View>

        {/* District MultiSelect */}
        <View style={[styles.pickerWrapper, { flex: 0.5 }]}>
          <MultiSelect
            style={styles.dropdown}
            data={districts.map((d) => ({
              label: d.charAt(0).toUpperCase() + d.slice(1).toLowerCase(),
              value: d,
            }))}
            labelField="label"
            valueField="value"
            placeholder="Districts"
            placeholderStyle={styles.dropdownText}
            selectedTextStyle={styles.dropdownText}
            itemTextStyle={styles.dropdownText}
            value={selectedDistricts}
            onChange={(items) => setSelectedDistricts(items as string[])}
            renderItem={(item) => renderDropdownItem(item, selectedDistricts)}
            visibleSelectedItem={false}
          />
          {selectedDistricts.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{selectedDistricts.length}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Smart Match and Select All in same card */}
      <View style={styles.smartMatchCard}>
        <View style={styles.smartMatchToggle}>
          <Text style={styles.smartMatchLabel}>Smart Match</Text>
          <Switch
            value={smartMatchEnabled}
            onValueChange={handleSmartMatchToggle}
            trackColor={{ false: "#ccc", true: "#99b3e6" }}
            thumbColor={smartMatchEnabled ? "#004aad" : "#f4f3f4"}
            disabled={true}
          />
        </View>

        {/* Select All Button */}
        {selectionMode && (
          <TouchableOpacity
            style={styles.selectAllButton}
            onPress={handleToggleSelectAll}
          >
            <Ionicons
              name={
                selectedCards.length === enrichedData.length
                  ? "checkbox"
                  : "square-outline"
              }
              size={20}
              color="#004aad"
            />
            <Text style={styles.selectAllText}>Select All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Clear filter */}
      {(searchText ||
        selectedDistricts.length > 0 ||
        selectedBranches.length > 0) && (
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

      {/* Result Count (styled as top of card) */}
      <View style={styles.resultCountContainer}>
        <Text style={styles.resultCount}>
          Total Results: {enrichedData.length}
        </Text>
      </View>
    </View>
  );

  return (
    <>
      <FlatList
        ref={listRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        data={enrichedData}
        keyExtractor={(item) => item.choice_code}
        renderItem={({ item }) => (
          <View
            style={[
              styles.cardContainer,
              selectedCards.includes(item.choice_code) &&
              styles.selectedCardContainer,
            ]}
          >
            <AdvancedFindCollegeCard
              item={item}
              onLongPress={handleLongPress}
              selectionMode={selectionMode}
              handleSelectCard={handleSelectCard}
            />
          </View>
        )}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={<View style={styles.listFooter} />}
        ListEmptyComponent={
          loading ? (
            <View style={styles.resultsContainerSkeleton}>
              <AdvancedFindCollegeCardSkeleton />
              <AdvancedFindCollegeCardSkeleton />
              <AdvancedFindCollegeCardSkeleton />
            </View>
          ) : (
            <View style={styles.resultsContainerSkeleton}>
              <Text style={styles.noResult}>No colleges found</Text>
            </View>
          )
        }
        // Optimization props
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />

      {/* Bottom Save Button */}
      {selectionMode && selectedCards.length > 0 && (
        <View style={styles.bottomSaveWrapper}>
          <TouchableOpacity
            style={styles.bottomSaveBtn}
            onPress={handleSaveSelectedColleges}
            disabled={saving}
          >
            <Ionicons name="checkmark" size={20} color="#fff" />
            <Text style={styles.bottomSaveText}>
              {saving ? "Saving..." : `Save`}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal for Percentile & Rank */}
      <SmartMatchModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        setSmartMatchEnabled={setSmartMatchEnabled}
        percentile={percentile}
        setPercentile={setPercentile}
        rank={rank}
        setRank={setRank}
        category={category}
        setCategory={setCategory}
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
};

export default AdvancedFindCollege;

const styles = StyleSheet.create({
  listContainer: {

  },
  headerContent: {
    marginBottom: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    fontFamily: "SourceSans3Medium",
    color: "#ff3b30",
    textAlign: "center",
    marginBottom: 20,
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
    marginTop: 8,
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
    marginBottom: 8,
    gap: 8,
  },
  pickerWrapper: { marginHorizontal: 0 },
  dropdown: {
    height: 45,
    borderRadius: 20,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d6e0f5",
  },
  dropdownText: {
    fontSize: 16,
    fontFamily: "SourceSans3Medium",
    color: "#333",
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
  resultsContainerSkeleton: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 20,
  },
  resultCountContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: "#fff",

  },
  listFooter: {
    height: 40,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: "#fff",
  },
  resultRow: {
    marginBottom: 12,
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
    marginTop: 4,
    marginBottom: 8,
  },
  clearFilterText: {
    fontSize: 14,
    fontFamily: "SourceSans3SemiBold",
    color: "#99b3e6",
    marginLeft: 2,
  },
  badge: {
    position: "relative",
    top: -32,
    left: "60%",
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
  noResult: {
    fontSize: 16,
    color: "#777",
    fontFamily: "SourceSans3Medium",
    textAlign: "center",
    marginTop: 20,
  },

  // Smart Match Card
  smartMatchCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 2,
    marginVertical: 12,
    marginBottom: 20,
  },
  smartMatchToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  smartMatchLabel: {
    fontSize: 16,
    fontFamily: "SourceSans3Medium",
    color: "#004aad",
  },

  // Select All Button
  selectAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  selectAllText: {
    fontSize: 14,
    fontFamily: "SourceSans3Medium",
    color: "#004aad",
  },

  // Card Container with Blue Border
  cardContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#fff",
    marginTop: -9
  },
  selectedCardContainer: {
    borderRadius: 16,
    backgroundColor: "#ebf0fa",
  },

  // Bottom Save Button (same as MyList component)
  bottomSaveWrapper: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: "center",
  },
  bottomSaveBtn: {
    backgroundColor: "#004aad",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  bottomSaveText: {
    color: "white",
    fontSize: 16,
    fontFamily: "SourceSans3SemiBold",
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
