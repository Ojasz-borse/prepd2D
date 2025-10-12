import BookmarkIcon from "@/assets/icons/BookmarkIcon";
import SearchIcon from "@/assets/icons/SearchIcon";
import AdvancedFindCollegeCard from "@/components/AdvancedFindCollegeCard";
import AdvancedFindCollegeCardSkeleton from "@/components/AdvancedFindCollegeCardSkeleton";
import FloatingLabelInput from "@/components/FloatingLabelInput";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import * as ScreenCapture from "expo-screen-capture";
import React, { useEffect, useMemo, useState } from "react";
import {
  Animated,
  FlatList,
  Modal,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MultiSelect } from "react-native-element-dropdown";
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

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
}

interface DropdownItemProps {
  label: string;
  isSelected: boolean;
}

interface FlyingAnim {
  id: string;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
}

const FlyingCardAnimation = ({ anim }: { anim: FlyingAnim }) => {
  const translateX = useSharedValue(anim.startX);
  const translateY = useSharedValue(anim.startY);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    translateX.value = withTiming(anim.targetX, { duration: 700 });
    translateY.value = withTiming(anim.targetY, { duration: 700 });
    scale.value = withTiming(0.3, { duration: 700 });
    opacity.value = withTiming(0, { duration: 700 });
  }, []);

  const style = useAnimatedStyle(() => ({
    position: "absolute",
    left: 0,
    top: 0,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
    zIndex: 99,
  }));

  return (
    <Animated.View style={style}>
      <View
        style={{
          width: 100,
          height: 50,
          backgroundColor: "#ebf0fa",
          borderRadius: 10,
        }}
      />
    </Animated.View>
  );
};

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

  // Unique values
  const collegeBranches = [...new Set(branches.map((d) => d.branch_name))];
  const districts = [...new Set(branches.map((d) => d.district))];

  // Filtering
  const filteredData = useMemo(() => {
    const search = searchText.toLowerCase();

    return branches.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search) ||
        item.branch_name.toLowerCase().includes(search);

      const matchesBranch =
        selectedBranches.length === 0 ||
        selectedBranches.includes(item.branch_name);

      const matchesDistrict =
        selectedDistricts.length === 0 ||
        selectedDistricts.includes(item.district);

      return matchesSearch && matchesBranch && matchesDistrict;
    });
  }, [branches, searchText, selectedBranches, selectedDistricts]);

  useEffect(() => {
    // Prevent screenshot when this screen is mounted
    ScreenCapture.preventScreenCaptureAsync();
    const loadStoredColleges = async () => {
      const cached = await AsyncStorage.getItem("myList");
      if (cached) {
        const parsed = JSON.parse(cached);
        setMovedCollegesCount(parsed.length);
      } else {
        setMovedCollegesCount(0);
      }
    };
    loadStoredColleges();

    // Allow again when leaving screen
    return () => {
      ScreenCapture.allowScreenCaptureAsync();
    };
  }, []);

  const clearFilters = () => {
    setSearchText("");
    setSelectedDistricts([]);
    setSelectedBranches([]);
  };

  const handleSmartMatchToggle = (value: boolean) => {
    if (value) {
      setModalVisible(true);
    } else {
      setSmartMatchEnabled(false);
      setModalVisible(false);
    }
  };

  const handleMoveToMyList = async () => {
    console.log("calling handleMoveToMyList");
    try {
      // Get existing cached colleges
      const cached = await AsyncStorage.getItem("myList");
      console.log("cached", cached);
      let existingColleges: string[] = cached ? JSON.parse(cached) : [];

      // Extract choice codes from filtered results
      const newChoiceCodes = filteredData.map((c) => c.choice_code);

      // Merge without duplicates
      const updated = Array.from(
        new Set([...existingColleges, ...newChoiceCodes])
      );

      // Save back
      await AsyncStorage.setItem("myList", JSON.stringify(updated));

      // Update count
      setMovedCollegesCount(updated.length);
    } catch (error) {
      console.error("Error saving colleges:", error);
    }
  };

  const enrichedData = useMemo(() => {
    if (!smartMatchEnabled || !rank || !category) return filteredData;

    const userRank = parseInt(rank, 10);
    if (isNaN(userRank)) return filteredData;

    const enriched = filteredData.map((item) => {
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

      if (cutoff_rank == null) {
        return { ...item, percentage: undefined, displayPercentage: undefined };
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

      const rounded = Math.round(percentage);
      const displayPercentage = percentage > 100 ? 100 : rounded;

      let tag: string;
      if (displayPercentage >= 96 && displayPercentage <= 99) tag = "Exact";
      else if (displayPercentage >= 80 && displayPercentage < 96) tag = "Hard";
      else if (displayPercentage < 80) tag = "Very Hard";
      else if (displayPercentage > 99 && displayPercentage <= 100) tag = "Easy";
      else tag = "Very Easy";

      return {
        ...item,
        percentage: rounded,
        displayPercentage,
        tag,
        req_rank: cutoff_rank,
        considered_category,
      };
    });

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

  return (
    <>
      <FlatList
        data={enrichedData}
        keyExtractor={(item) => item.choice_code}
        renderItem={({ item }) => (
          <View key={item.choice_code} style={{ marginBottom: 15 }}>
            <AdvancedFindCollegeCard item={item} />
          </View>
        )}
        ListEmptyComponent={
          loading ? (
            <>
              <AdvancedFindCollegeCardSkeleton />
              <AdvancedFindCollegeCardSkeleton />
              <AdvancedFindCollegeCardSkeleton />
            </>
          ) : (
            <Text style={styles.noResult}>No colleges found</Text>
          )
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 4,
          paddingTop: 16,
          paddingBottom: 10,
        }}
        ListHeaderComponent={
          <>
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
                  data={collegeBranches.map((b) => ({ label: b, value: b }))}
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
                      <DropdownItem
                        label={item.label}
                        isSelected={isSelected}
                      />
                    );
                  }}
                  renderSelectedItem={() => <View style={{ height: 0 }} />}
                />
                {selectedBranches.length > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {selectedBranches.length}
                    </Text>
                  </View>
                )}
              </View>

              <View style={{ marginHorizontal: 5 }} />

              {/* District MultiSelect */}
              <View style={[styles.pickerWrapper, { flex: 0.5 }]}>
                <MultiSelect
                  style={styles.dropdown}
                  data={districts.map((d) => ({ label: d, value: d }))}
                  labelField="label"
                  valueField="value"
                  placeholder="Districts"
                  placeholderStyle={styles.dropdownText}
                  selectedTextStyle={styles.dropdownText}
                  itemTextStyle={styles.dropdownText}
                  value={selectedDistricts}
                  onChange={(items) => setSelectedDistricts(items as string[])}
                  renderItem={(item) =>
                    renderDropdownItem(item, selectedDistricts)
                  }
                  renderSelectedItem={() => <View style={{ height: 0 }} />}
                />
                {selectedDistricts.length > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {selectedDistricts.length}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Smart Match */}
            <View style={{ marginVertical: -10 }}>
              <View style={styles.smartMatchRow}>
                <View style={styles.smartMatchRow}>
                  <Text style={styles.smartMatchLabel}>Smart Match</Text>
                  <Switch
                    value={smartMatchEnabled}
                    onValueChange={handleSmartMatchToggle}
                    trackColor={{ false: "#ccc", true: "#99b3e6" }}
                    thumbColor={smartMatchEnabled ? "#004aad" : "#f4f3f4"}
                  />
                </View>
                {(searchText ||
                  selectedDistricts.length > 0 ||
                  selectedBranches.length > 0) && (
                  <TouchableOpacity onPress={handleMoveToMyList}>
                    <Text style={styles.smartMatchLabel}>Move to myList</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Result count + Clear filter */}
            <View style={styles.resultRow}>
              <Text style={styles.resultCount}>
                Total Results: {filteredData.length}
              </Text>

              {(searchText ||
                selectedDistricts.length > 0 ||
                selectedBranches.length > 0) && (
                <TouchableOpacity
                  style={styles.clearFilterBtn}
                  onPress={clearFilters}
                >
                  {/* <Ionicons name="close-circle-outline" size={16} color="#004aad" /> */}
                  <Text style={styles.clearFilterText}>Clear Filters</Text>
                </TouchableOpacity>
              )}
            </View>
          </>
        }
      />

      {(searchText ||
        selectedDistricts.length > 0 ||
        selectedBranches.length > 0) && (
        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.8}
          onPress={() => router.push("/profile")}
        >
          <BookmarkIcon size={24} />
          {movedCollegesCount && movedCollegesCount > 0 && (
            <View style={styles.fabTextContainer}>
              <Text style={styles.fabText}>{movedCollegesCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      )}

      {/* Modal for Percentile & Rank */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              To enable Smart Match mode, please enter your Percentile & Rank
            </Text>

            <View style={{ flexDirection: "row", gap: 10 }}>
              <View style={{ width: "48%" }}>
                <FloatingLabelInput
                  label="Percentile"
                  value={percentile}
                  onChangeText={setPercentile}
                />
              </View>
              <View style={{ width: "48%" }}>
                <FloatingLabelInput
                  label="Rank"
                  value={rank}
                  onChangeText={setRank}
                />
              </View>
            </View>

            <Text
              style={{
                marginTop: -14,
                marginBottom: 10,
                fontSize: 16,
                fontFamily: "SourceSans3Medium",
                color: "#004aad60",
              }}
            >
              Select category
            </Text>
            <View style={styles.groupWrapper}>
              <TouchableOpacity
                style={[
                  styles.groupOption,
                  category === "Open" && styles.groupOptionSelected,
                ]}
                onPress={() => setCategory("Open")}
              >
                <Text
                  style={[
                    styles.groupOptionText,
                    category === "Open" && styles.groupOptionTextSelected,
                  ]}
                >
                  Open
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.groupOption,
                  category === "OBC" && styles.groupOptionSelected,
                ]}
                onPress={() => setCategory("OBC")}
              >
                <Text
                  style={[
                    styles.groupOptionText,
                    category === "OBC" && styles.groupOptionTextSelected,
                  ]}
                >
                  OBC
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.groupOption,
                  category === "TFWS" && styles.groupOptionSelected,
                ]}
                onPress={() => setCategory("TFWS")}
              >
                <Text
                  style={[
                    styles.groupOptionText,
                    category === "TFWS" && styles.groupOptionTextSelected,
                  ]}
                >
                  TFWS
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.groupOption,
                  category === "SC_ST" && styles.groupOptionSelected,
                ]}
                onPress={() => setCategory("SC_ST")}
              >
                <Text
                  style={[
                    styles.groupOptionText,
                    category === "SC_ST" && styles.groupOptionTextSelected,
                  ]}
                >
                  SC/ST
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.groupOption,
                  category === "VJ_NT" && styles.groupOptionSelected,
                ]}
                onPress={() => setCategory("VJ_NT")}
              >
                <Text
                  style={[
                    styles.groupOptionText,
                    category === "VJ_NT" && styles.groupOptionTextSelected,
                  ]}
                >
                  VJNT
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalButtonCancel}
                onPress={() => {
                  setModalVisible(false);
                  setSmartMatchEnabled(false);
                }}
              >
                <Text style={styles.modalButtonTextCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButtonSubmit}
                onPress={() => {
                  setModalVisible(false);
                  setSmartMatchEnabled(true);
                }}
              >
                <Text style={styles.modalButtonTextSubmit}>Enable</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default AdvancedFindCollege;

const styles = StyleSheet.create({
  container: {
    padding: 4,
    paddingTop: 16,
    paddingBottom: 10,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: "SourceSans3Medium",
    color: "#004aad",
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
  pickerWrapper: { marginHorizontal: 0 },
  dropdown: {
    height: 45,
    borderRadius: 20,
    paddingHorizontal: 16,
    backgroundColor: "#ebf0fa",
  },
  dropdownText: {
    fontSize: 16,
    fontFamily: "SourceSans3Medium",
    color: "#333",
  },
  item: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    fontFamily: "SourceSans3Medium",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 12,
  },

  removeText: {
    fontSize: 14,
    color: "#721c24",
    fontWeight: "bold",
  },
  itemText: {
    fontSize: 16,
    color: "#333",
    fontFamily: "SourceSans3Medium",
  },

  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
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
  },
  clearFilterText: {
    fontSize: 14,
    fontFamily: "SourceSans3SemiBold",
    color: "#99b3e6",
    marginLeft: 4,
  },

  badge: {
    position: "relative",
    top: -32,
    left: 110,
    backgroundColor: "#004aad", // your given color
    borderRadius: 9999, // full rounded
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
  smartMatchRow: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  smartMatchLabel: {
    fontSize: 16,
    fontFamily: "SourceSans3Medium",
    color: "#004aad",
  },

  fab: {
    position: "absolute",
    bottom: 15,
    right: 15,
    backgroundColor: "#004aad", // Dark blue
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },

  fabTextContainer: {
    position: "absolute",
    top: 0,
    left: 35,
    backgroundColor: "#ff6600", // dark blue
    borderRadius: 12,
    minWidth: 24,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
    zIndex: 10,
  },
  fabText: {
    color: "white",
    fontSize: 12,
    fontFamily: "SourceSans3Medium",
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 30,
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: "SourceSans3Medium",
    marginBottom: 16,
    color: "#004aad",
    textAlign: "center",
  },

  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  modalButtonCancel: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 14,
  },
  modalButtonSubmit: {
    backgroundColor: "#004aad",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 14,
  },
  modalButtonTextCancel: {
    fontSize: 15,
    color: "#999",
    fontFamily: "SourceSans3Medium",
  },
  modalButtonTextSubmit: {
    fontSize: 15,
    color: "#fff",
    fontFamily: "SourceSans3Medium",
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  flexInput: {
    flex: 1,
  },

  groupWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    gap: 8,
  },
  groupOption: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  groupOptionSelected: {
    borderColor: "#004aad",
    borderWidth: 2,
    backgroundColor: "#f8fbff",
  },
  groupOptionText: {
    fontSize: 12,
    color: "#777",
    fontFamily: "SourceSans3Medium",
  },
  groupOptionTextSelected: { color: "#004aad", fontWeight: "600" },
});
