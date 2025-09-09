import GovernmentCollegeIcon from "@/assets/icons/GovernmentCollegeIcon";
import PrivateCollegeIcon from "@/assets/icons/PrivateCollegeIcon";
import SearchIcon from "@/assets/icons/SearchIcon";
import React, { useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";

// ----------------- TYPES -----------------
type CategoryKey = "open" | "nt" | "obc" | "sc" | "st";

interface CollegeItem {
  id: string;
  branch_name: string;
  choice_code: string;
  college_name: string;
  college_type: "Govt" | "Pvt";
  cutoff: Record<CategoryKey, string>;
}

// ----------------- DATA -----------------
const DATA: CollegeItem[] = [
  {
    id: "1",
    branch_name: "Computer Engineering",
    choice_code: "COEP-CSE-001",
    college_name: "College of Engineering Pune (COEP Tech University)",
    college_type: "Govt",
    cutoff: { open: "110", nt: "52", obc: "140", sc: "310", st: "500" },
  },
  {
    id: "2",
    branch_name: "Mechanical Engineering",
    choice_code: "VJTI-MECH-002",
    college_name: "Veermata Jijabai Technological Institute (VJTI), Mumbai",
    college_type: "Govt",
    cutoff: { open: "210", nt: "96", obc: "230", sc: "420", st: "650" },
  },
  {
    id: "3",
    branch_name: "Electronics and Telecommunication",
    choice_code: "WCE-ENTC-003",
    college_name: "Walchand College of Engineering, Sangli",
    college_type: "Govt",
    cutoff: { open: "320", nt: "141", obc: "360", sc: "520", st: "740" },
  },
  {
    id: "4",
    branch_name: "Information Technology",
    choice_code: "SPIT-IT-004",
    college_name: "Sardar Patel Institute of Technology (SPIT), Mumbai",
    college_type: "Pvt",
    cutoff: { open: "540", nt: "260", obc: "590", sc: "810", st: "990" },
  },
  {
    id: "5",
    branch_name: "Computer Engineering",
    choice_code: "PICT-CSE-005",
    college_name: "Pune Institute of Computer Technology (PICT), Pune",
    college_type: "Pvt",
    cutoff: { open: "620", nt: "300", obc: "660", sc: "890", st: "1100" },
  },
];

// ----------------- META -----------------
const TYPE_META: Record<
  string,
  { label: string; Icon: React.ComponentType<any> }
> = {
  Govt: { label: "Govt", Icon: GovernmentCollegeIcon },
  Pvt: { label: "Pvt", Icon: PrivateCollegeIcon },
};

const CATEGORY_OPTIONS: CategoryKey[] = ["open", "nt", "obc", "sc", "st"];

// Safely parse cutoff ranks (handles "", "-", "—", "1,234", etc.)
const BIG = Number.MAX_SAFE_INTEGER;
const rankOf = (raw: unknown): number => {
  if (raw === null || raw === undefined) return BIG;
  const str = String(raw).trim();
  if (!str || str === "-" || str === "—" || str.toLowerCase() === "na")
    return BIG;
  const cleaned = str.replace(/[, ]/g, ""); // remove commas/spaces
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : BIG;
};

// ----------------- COMPONENT -----------------
const AdvancedFindCollege = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>("open"); // ✅ strictly typed

  // Unique values for filters
  const branches = [...new Set(DATA.map((d) => d.branch_name))];

  // Filtering + Sorting
  const filteredData = useMemo(() => {
    const search = searchText.toLowerCase();

    const list = DATA.filter((item) => {
      const matchesSearch =
        item.college_name.toLowerCase().includes(search) ||
        item.branch_name.toLowerCase().includes(search);

      const matchesBranch =
        !selectedBranch || item.branch_name === selectedBranch;

      return matchesSearch && matchesBranch;
    });

    // Sort by selected cutoff category (ascending rank, i.e., best rank first)
    list.sort((a, b) => {
      const aRank = rankOf(a.cutoff[selectedCategory]);
      const bRank = rankOf(b.cutoff[selectedCategory]);
      if (aRank !== bRank) return aRank - bRank;
      const byCollege = a.college_name.localeCompare(b.college_name);
      if (byCollege !== 0) return byCollege;
      const byBranch = a.branch_name.localeCompare(b.branch_name);
      if (byBranch !== 0) return byBranch;
      return a.id.localeCompare(b.id);
    });

    return list;
  }, [searchText, selectedBranch, selectedCategory]);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
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
        {/* Branch Dropdown */}
        <View style={[styles.pickerWrapper, { flex: 0.7 }]}>
          <Dropdown
            style={styles.dropdown}
            data={[
              { label: "All Branches", value: "" },
              ...branches.map((b) => ({ label: b, value: b })),
            ]}
            labelField="label"
            valueField="value"
            value={selectedBranch}
            onChange={(item) => setSelectedBranch(item.value)}
            placeholder="Branches"
            placeholderStyle={styles.dropdownText}
            selectedTextStyle={styles.dropdownText}
            itemTextStyle={styles.dropdownText}
          />
        </View>

        <View style={{ marginHorizontal: 5 }} />

        {/* Category Dropdown */}
        <View style={[styles.pickerWrapper, { flex: 0.3 }]}>
          <Dropdown
            style={styles.dropdown}
            data={CATEGORY_OPTIONS.map((c) => ({
              label: c.toUpperCase(),
              value: c,
            }))}
            labelField="label"
            valueField="value"
            value={selectedCategory}
            onChange={(item) => setSelectedCategory(item.value as CategoryKey)}
            placeholder="Category"
            placeholderStyle={styles.dropdownText}
            selectedTextStyle={styles.dropdownText}
            itemTextStyle={styles.dropdownText}
          />
        </View>
      </View>

      <Text style={styles.resultCount}>
        Total Results: {filteredData.length}
      </Text>

      {/* Results */}
      {filteredData.map((item) => {
        const meta = TYPE_META[item.college_type] ?? TYPE_META.Pvt;
        const TypeIcon = meta.Icon;

        return (
          <Pressable
            key={item.id}
            style={({ pressed }) => [
              styles.card3D,
              pressed && styles.cardPressed,
            ]}
            android_ripple={{
              color: "rgba(4, 36, 84, 0.06)",
              borderless: false,
            }}
          >
            {/* Top Row */}
            <View style={styles.subRow}>
              <Text style={styles.subText}>{item.choice_code}</Text>
              <View style={styles.typeRow}>
                <TypeIcon size={16} />
                <Text style={styles.subText}>{meta.label}</Text>
              </View>
            </View>

            {/* Branch */}
            <Text style={styles.collegeName}>{item.branch_name}</Text>

            {/* College */}
            <Text style={styles.districtText}>{item.college_name}</Text>

            {/* Cutoff Grid */}
            <View style={styles.cutoffWrapper}>
              {Object.entries(item.cutoff).map(([key, value]) => {
                const isActive = key === selectedCategory;
                return (
                  <View
                    key={key}
                    style={[
                      styles.cutoffBox,
                      isActive && styles.cutoffBoxActive,
                    ]}
                  >
                    <Text style={styles.cutoffCategory}>
                      {key.toUpperCase()}
                    </Text>
                    <Text style={styles.cutoffValue}>{value}</Text>
                  </View>
                );
              })}
            </View>
          </Pressable>
        );
      })}

      {filteredData.length === 0 && (
        <Text style={styles.noResult}>No colleges found</Text>
      )}
    </ScrollView>
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
    fontFamily: "BreeSerif",
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
    fontSize: 14,
    fontFamily: "BreeSerif",
    color: "#333",
  },
  resultCount: {
    fontSize: 14,
    fontFamily: "BreeSerif",
    color: "#444",
    marginBottom: 8,
    marginLeft: 4,
    marginTop: 10,
  },
  card3D: {
    width: "100%",
    backgroundColor: "#f0f4fb",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#d6e0f5",
  },
  cardPressed: {
    transform: [{ translateY: Platform.OS === "ios" ? 1 : 0 }],
    shadowOpacity: 0.08,
    elevation: 2,
  },
  subRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  typeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  subText: {
    fontSize: 14,
    color: "#063866",
    fontFamily: "BreeSerif",
  },
  collegeName: {
    fontSize: 16,
    color: "#000",
    marginTop: 2,
    fontWeight: "600",
    fontFamily: "BreeSerif",
  },
  districtText: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
    fontFamily: "BreeSerif",
  },
  cutoffWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 12,
  },
  cutoffBox: {
    backgroundColor: "#d6e0f5",
    borderRadius: 8,
    paddingVertical: 4,
    minWidth: 50,
    alignItems: "center",
  },
  cutoffBoxActive: {
    backgroundColor: "#b8c6eb", // highlighted active category
  },
  cutoffCategory: {
    fontSize: 10,
    fontWeight: "700",
    color: "#0A5BD3",
    letterSpacing: 0.4,
    fontFamily: "BreeSerif",
  },
  cutoffValue: {
    fontSize: 12,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 2,
    fontFamily: "BreeSerif",
  },
  noResult: {
    fontSize: 16,
    color: "#777",
    fontFamily: "BreeSerif",
    textAlign: "center",
    marginTop: 20,
  },
});
