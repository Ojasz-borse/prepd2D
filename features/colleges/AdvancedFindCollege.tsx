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
        color={isSelected ? "#063866" : "#999"}
        style={{ marginRight: 8 }}
      />
      <Text style={[styles.itemText, isSelected && { color: "#063866" }]}>
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
    setSmartMatchEnabled(value);
    if (value) setModalVisible(true);
  };

  const handleSubmitSmartMatch = () => {
    setModalVisible(false);
    // Later: calculate scores with percentile & rank
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
        data={filteredData}
        keyExtractor={(item) => item.choice_code}
        renderItem={({ item }) => (
          <AdvancedFindCollegeCard key={item.choice_code} item={item} />
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
                    thumbColor={smartMatchEnabled ? "#063866" : "#f4f3f4"}
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
                  {/* <Ionicons name="close-circle-outline" size={16} color="#063866" /> */}
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
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              To enable Smart Match mode, please enter your Percentile & Rank
            </Text>

            <View style={{ flexDirection: "row", gap: 10 }}>
              <View style={{ width: "50%" }}>
                <FloatingLabelInput
                  label="Percentile"
                  value={percentile}
                  onChangeText={setPercentile}
                />
              </View>
              <View style={{ width: "50%" }}>
                <FloatingLabelInput
                  label="Rank"
                  value={rank}
                  onChangeText={setRank}
                />
              </View>
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
                onPress={handleSubmitSmartMatch}
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
    color: "#063866",
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
    backgroundColor: "#063866", // your given color
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
    color: "#063866",
  },

  fab: {
    position: "absolute",
    bottom: 15,
    right: 15,
    backgroundColor: "#063866", // Dark blue
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
    color: "#063866",
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
    backgroundColor: "#063866",
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
    marginBottom: 12,
  },
  flexInput: {
    flex: 1,
  },
});
