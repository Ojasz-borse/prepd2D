import SearchIcon from "@/assets/icons/SearchIcon";
import NormalFindCollegeCard from "@/components/NormalFindCollegeCard";
import NormalFindCollegeCardSkeleton from "@/components/NormalFindCollegeCardSkeleton";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

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

const NormalFindCollege: React.FC<NormalFindCollegeProps> = ({
  colleges,
  loading,
  error,
}) => {
  const [searchText, setSearchText] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const filteredData = colleges.filter((item) => {
    const search = searchText.toLowerCase();

    const matchesSearch =
      item.name.toLowerCase().includes(search) ||
      item.college_code.toLowerCase().includes(search) ||
      (item.is_government && "government".startsWith(search)) ||
      (!item.is_government && "private".startsWith(search));

    const matchesDistrict =
      !selectedDistrict || item.district === selectedDistrict;
    const matchesType =
      !selectedType ||
      (selectedType === "Govt" && item.is_government) ||
      (selectedType === "Pvt" && !item.is_government);

    return matchesSearch && matchesDistrict && matchesType;
  });

  const districts = [...new Set(colleges.map((item) => item.district))];

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
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
        <View style={{ flex: 0.7 }}>
          <Dropdown
            style={styles.dropdown}
            data={[
              { label: "Districts", value: "" },
              ...districts.map((d) => ({ label: d, value: d })),
            ]}
            labelField="label"
            valueField="value"
            value={selectedDistrict}
            onChange={(item) => setSelectedDistrict(item.value)}
            placeholderStyle={styles.dropdownText}
            selectedTextStyle={styles.dropdownText}
            itemTextStyle={styles.dropdownText}
          />
        </View>
        <View style={{ width: 8 }} />
        <View style={{ flex: 0.3 }}>
          <Dropdown
            style={styles.dropdown}
            data={[
              { label: "Types", value: "" },
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

      <Text style={styles.resultCount}>
        Total Results: {filteredData.length}
      </Text>

      {loading && (
        <View>
          <NormalFindCollegeCardSkeleton />
          <NormalFindCollegeCardSkeleton />
          <NormalFindCollegeCardSkeleton />
          <NormalFindCollegeCardSkeleton />
        </View>
      )}

      {/* College list */}
      {filteredData.map((item) => (
        <NormalFindCollegeCard key={item.college_code} college={item} />
      ))}

      {!loading && filteredData.length === 0 && (
        <Text style={styles.noResult}>No colleges found</Text>
      )}
    </ScrollView>
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
    fontFamily: "WixMadeforTextMedium",
    color: "#063866",
  },
  errorText: {
    fontSize: 16,
    fontFamily: "WixMadeforTextMedium",
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
    fontFamily: "WixMadeforTextMedium",
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
    fontFamily: "WixMadeforTextMedium",
  },
  dropdownText: {
    fontSize: 16,
    fontFamily: "WixMadeforTextMedium",
    color: "#333",
    textTransform: "capitalize",
  },
  resultCount: {
    fontSize: 14,
    fontFamily: "WixMadeforTextBold",
    color: "#444",
    marginBottom: 8,
    marginLeft: 4,
    marginTop: 10,
  },
  noResult: {
    fontSize: 16,
    color: "#777",
    fontFamily: "WixMadeforTextBold",
    textAlign: "center",
    marginTop: 20,
  },
});
