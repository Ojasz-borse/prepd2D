import SearchIcon from "@/assets/icons/SearchIcon";
import AdvancedFindCollegeCard from "@/components/AdvancedFindCollegeCard";
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
import { MultiSelect } from "react-native-element-dropdown";

// ----------------- TYPES -----------------
interface CollegeItem {
  id: string;
  branch_name: string;
  choice_code: string;
  college_name: string;
  college_type: "Govt" | "Pvt";
  district: string;
  cutoff: {
    open: string;
    obc: string;
    nt_sc: string;
  };
}

// ----------------- DATA -----------------
const DATA: CollegeItem[] = [
  {
    id: "1",
    branch_name: "Computer Engineering",
    choice_code: "COEP-CSE-001",
    college_name: "College of Engineering Pune (COEP Tech University)",
    college_type: "Govt",
    district: "Pune",
    cutoff: { open: "110", obc: "140", nt_sc: "52" },
  },
  {
    id: "2",
    branch_name: "Mechanical Engineering",
    choice_code: "VJTI-MECH-002",
    college_name: "Veermata Jijabai Technological Institute (VJTI), Mumbai",
    college_type: "Govt",
    district: "Mumbai",
    cutoff: { open: "210", obc: "230", nt_sc: "96" },
  },
  {
    id: "3",
    branch_name: "Electronics and Telecommunication",
    choice_code: "WCE-ENTC-003",
    college_name: "Walchand College of Engineering, Sangli",
    college_type: "Govt",
    district: "Sangli",
    cutoff: { open: "320", obc: "360", nt_sc: "141" },
  },
  {
    id: "4",
    branch_name: "Information Technology",
    choice_code: "SPIT-IT-004",
    college_name: "Sardar Patel Institute of Technology (SPIT), Mumbai",
    college_type: "Pvt",
    district: "Mumbai",
    cutoff: { open: "540", obc: "590", nt_sc: "260" },
  },
  {
    id: "5",
    branch_name: "Computer Engineering",
    choice_code: "PICT-CSE-005",
    college_name: "Pune Institute of Computer Technology (PICT), Pune",
    college_type: "Pvt",
    district: "Pune",
    cutoff: { open: "620", obc: "660", nt_sc: "300" },
  },
];

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
const AdvancedFindCollege = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);

  // Unique values
  const branches = [...new Set(DATA.map((d) => d.branch_name))];
  const districts = [...new Set(DATA.map((d) => d.district))];

  // Filtering
  const filteredData = useMemo(() => {
    const search = searchText.toLowerCase();

    return DATA.filter((item) => {
      const matchesSearch =
        item.college_name.toLowerCase().includes(search) ||
        item.branch_name.toLowerCase().includes(search);

      const matchesBranch =
        selectedBranches.length === 0 ||
        selectedBranches.includes(item.branch_name);

      const matchesDistrict =
        selectedDistricts.length === 0 ||
        selectedDistricts.includes(item.district);

      return matchesSearch && matchesBranch && matchesDistrict;
    });
  }, [searchText, selectedBranches, selectedDistricts]);

  const clearFilters = () => {
    setSearchText("");
    setSelectedDistricts([]);
    setSelectedBranches([]);
  };

  return (
    <FlatList
      data={filteredData}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <AdvancedFindCollegeCard key={item.id} item={item} />
      )}
      ListEmptyComponent={
        <Text style={styles.noResult}>No colleges found</Text>
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
                data={branches.map((b) => ({ label: b, value: b }))}
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
  );
};

export default AdvancedFindCollege;

const styles = StyleSheet.create({
  container: {
    padding: 4,
    paddingTop: 16,
    paddingBottom: 10,
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
});
