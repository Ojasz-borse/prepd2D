import SearchIcon from "@/assets/icons/SearchIcon";
import NormalFindCollegeCard from "@/components/NormalFindCollegeCard";
import NormalFindCollegeCardSkeleton from "@/components/NormalFindCollegeCardSkeleton";
import { usePreventScreenCapture } from "@/hooks/usePreventScreenCapture";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ScreenCapture from "expo-screen-capture";
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

export interface College {
  college_code: string;
  name: string;
  district: string;
  is_government: boolean;
  status?: string;
}

interface NormalFindCollegeProps {
  colleges: College[];
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
const NormalFindCollege: React.FC<NormalFindCollegeProps> = ({
  colleges,
  loading,
  error,
  isActive,
}) => {
  const [searchText, setSearchText] = useState("");
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState("");

  const filteredData = useMemo(() => {
    const search = searchText.toLowerCase();

    return colleges.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search) ||
        item.college_code.toLowerCase().includes(search) ||
        (item.is_government && "government".startsWith(search)) ||
        (!item.is_government && "private".startsWith(search));

      const matchesDistrict =
        selectedDistricts.length === 0 ||
        selectedDistricts.includes(item.district);

      const matchesType =
        !selectedType ||
        (selectedType === "Govt" && item.is_government) ||
        (selectedType === "Pvt" && !item.is_government);

      return matchesSearch && matchesDistrict && matchesType;
    });
  }, [colleges, searchText, selectedDistricts, selectedType]);

  const districts = [
    ...new Set(colleges.map((item) => item.district.toLowerCase())),
  ].sort((a, b) => a.localeCompare(b));

  const listRef = React.useRef<FlatList>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  usePreventScreenCapture();

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
    setSelectedType("");
  };

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  const renderHeader = () => (
    <View style={styles.headerContent}>
      {/* Search bar */}
      <View style={styles.searchContainer}>
        <SearchIcon size={18} focused={false} />
        <TextInput
          style={styles.searchBar}
          placeholder="Search by name, code, or type"
          placeholderTextColor="#777"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Filters */}
      <View style={styles.filterRow}>
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
            renderItem={(item) =>
              renderDropdownItem(item, selectedDistricts)
            }
            visibleSelectedItem={false}
          />
          {selectedDistricts.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {selectedDistricts.length}
              </Text>
            </View>
          )}
        </View>

        <View style={{ flex: 0.5 }}>
          <Dropdown
            style={styles.dropdown}
            data={[
              { label: "College Type", value: "" },
              { label: "Govt", value: "Govt" },
              { label: "Pvt", value: "Pvt" },
            ]}
            labelField="label"
            valueField="value"
            value={selectedType}
            onChange={(item) => setSelectedType(item.value)}
            placeholder="College Type"
            placeholderStyle={styles.dropdownText}
            selectedTextStyle={styles.dropdownText}
            itemTextStyle={styles.dropdownText}
          />
        </View>
      </View>

      {/* Clear filter button (moved inside header view) */}
      {(searchText || selectedDistricts.length > 0 || selectedType) && (
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
          Total Results: {filteredData.length}
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
        data={filteredData}
        keyExtractor={(item) => item.college_code}
        renderItem={({ item, index }) => (
          <View style={styles.itemWrapper}>
            <NormalFindCollegeCard college={item} index={index} />
          </View>
        )}
        ListHeaderComponent={renderHeader()}
        ListFooterComponent={<View style={styles.listFooter} />}
        ListEmptyComponent={
          loading ? (
            <View style={styles.resultsContainer}>
              <NormalFindCollegeCardSkeleton />
              <NormalFindCollegeCardSkeleton />
              <NormalFindCollegeCardSkeleton />
              <NormalFindCollegeCardSkeleton />
            </View>
          ) : (
            <View style={styles.resultsContainer}>
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
        stickyHeaderIndices={[]} // Optional: set to [0] if you want the search bar to stick
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

export default NormalFindCollege;

const styles = StyleSheet.create({
  listContainer: {

  },
  headerContent: {
    marginBottom: 8,
  },
  itemWrapper: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#fff",
    marginTop: -9,
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
  resultsContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginTop: -10,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  resultCountContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: "#fff", // Match side borders
  },
  resultCount: {
    fontSize: 16,
    fontFamily: "SourceSans3SemiBold",
    color: "#004aad",
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
  noResult: {
    fontSize: 16,
    color: "#777",
    fontFamily: "SourceSans3Medium",
    textAlign: "center",
    marginTop: 20,
  },
  scrollTopBtn: {
    position: "absolute",
    bottom: 20,
    right: 20,
    elevation: 5,
  },
  scrollTopTouchable: {
    backgroundColor: "#e6e6e6",
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
