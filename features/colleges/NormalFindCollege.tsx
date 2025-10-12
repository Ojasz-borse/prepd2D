import SearchIcon from "@/assets/icons/SearchIcon";
import NormalFindCollegeCard from "@/components/NormalFindCollegeCard";
import NormalFindCollegeCardSkeleton from "@/components/NormalFindCollegeCardSkeleton";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
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
  status: string;
}

interface NormalFindCollegeProps {
  colleges: College[];
  loading: boolean;
  error: string | null;
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

  const districts = [...new Set(colleges.map((item) => item.district))];

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

  return (
    <FlatList
      data={filteredData}
      keyExtractor={(item) => item.college_code}
      renderItem={({ item }) => <NormalFindCollegeCard college={item} />}
      ListEmptyComponent={
        loading ? (
          <>
            <NormalFindCollegeCardSkeleton />
            <NormalFindCollegeCardSkeleton />
            <NormalFindCollegeCardSkeleton />
            <NormalFindCollegeCardSkeleton />
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
            <View style={{ width: 8 }} />
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
                placeholderStyle={styles.dropdownText}
                selectedTextStyle={styles.dropdownText}
                itemTextStyle={styles.dropdownText}
              />
            </View>
          </View>

          {/* Result count + Clear filter */}
          <View style={styles.resultRow}>
            <Text style={styles.resultCount}>
              Total Results: {filteredData.length}
            </Text>

            {(searchText || selectedDistricts.length > 0 || selectedType) && (
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
  );
};

export default NormalFindCollege;

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
  dropdown: {
    height: 45,
    borderRadius: 20,
    paddingHorizontal: 16,
    backgroundColor: "#ebf0fa",
    fontFamily: "SourceSans3Medium",
    textTransform: "capitalize",
  },
  dropdownText: {
    fontSize: 16,
    fontFamily: "SourceSans3Medium",
    color: "#333",
    textTransform: "capitalize",
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
});
