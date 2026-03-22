import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import FloatingLabelInput from "@/components/FloatingLabelInput";
import { CATEGORIES, LOCATIONS, BRANCHES } from "@/constants/collegeFilters";
import { formatLocationName, formatBranchName } from "@/utils/formatHelpers";
import DropdownItem from "./DropdownItem";
import SelectedLocations from "./SelectedLocations";
import SelectedBranches from "./SelectedBranches";
import { styles } from "../styles";

interface CreateCollegeFormProps {
  rank: string;
  setRank: (rank: string) => void;
  percentile: string;
  setPercentile: (percentile: string) => void;
  categories: string[];
  setCategories: (categories: string[]) => void;
  locations: string[];
  setLocations: (locations: string[]) => void;
  branches: string[];
  setBranches: (branches: string[]) => void;
  handlePercentileChange: (value: string) => void;
  handlePercentileBlur: () => void;
  moveBranch: (index: number, direction: "up" | "down") => void;
  handleSubmit: () => void;
  loading: boolean;
  isAllowed: boolean;
}

const CreateCollegeForm = ({
  rank,
  setRank,
  percentile,
  setPercentile,
  categories,
  setCategories,
  locations,
  setLocations,
  branches,
  setBranches,
  handlePercentileChange,
  handlePercentileBlur,
  moveBranch,
  handleSubmit,
  loading,
  isAllowed,
}: CreateCollegeFormProps) => (
  <View style={styles.card}>
    <Text style={styles.formTitle}>Enter Details</Text>

    <View style={{ flexDirection: "row", gap: 12, marginBottom: -14 }}>
      <View style={{ width: "48%" }}>
        <FloatingLabelInput
          label="Rank"
          value={rank}
          onChangeText={setRank}
          keyboardType="number-pad"
        />
      </View>
      <View style={{ width: "48%" }}>
        <FloatingLabelInput
          label="Percentile"
          value={percentile}
          onChangeText={handlePercentileChange}
          keyboardType="number-pad"
        />
      </View>
    </View>

    {percentile && parseFloat(percentile) > 100 && (
      <Text style={[styles.warningText, { marginTop: -20, marginBottom: 10 }]}>
        Percentile cannot exceed 100
      </Text>
    )}

    <View style={styles.inputWrapper}>
      <Dropdown
        style={styles.dropdown}
        data={CATEGORIES.map((cat) => ({ label: cat, value: cat }))}
        labelField="label"
        valueField="value"
        value={categories[0] || ""}
        onChange={(item) => setCategories([item.value])}
        placeholder="Select Category"
        placeholderStyle={styles.dropdownText}
        selectedTextStyle={styles.dropdownText}
        itemTextStyle={styles.dropdownText}
        containerStyle={styles.dropdownContainerStyle}
      />
    </View>

    <View style={styles.inputWrapper}>
      <MultiSelect
        style={styles.dropdown}
        data={LOCATIONS.map((loc) => ({
          label: formatLocationName(loc),
          value: loc,
        }))}
        labelField="label"
        valueField="value"
        placeholder="Select Locations"
        placeholderStyle={styles.dropdownText}
        selectedTextStyle={styles.dropdownText}
        itemTextStyle={styles.dropdownText}
        value={locations}
        onChange={(items) => setLocations(items as string[])}
        renderItem={(item) => {
          const isSelected = locations.includes(item.value);
          return <DropdownItem label={item.label} isSelected={isSelected} />;
        }}
        visibleSelectedItem={false}
        containerStyle={styles.dropdownContainerStyle}
      />
      {locations.length > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{locations.length}</Text>
        </View>
      )}
    </View>

    {locations.length > 0 && (
      <SelectedLocations locations={locations} setLocations={setLocations} />
    )}

    <View style={styles.inputWrapper}>
      <MultiSelect
        style={styles.dropdown}
        data={BRANCHES.map((branch) => ({
          label: formatBranchName(branch),
          value: branch,
        }))}
        labelField="label"
        valueField="value"
        placeholder="Select Branches"
        placeholderStyle={styles.dropdownText}
        selectedTextStyle={styles.dropdownText}
        itemTextStyle={styles.dropdownText}
        value={branches}
        onChange={(items) => setBranches(items as string[])}
        renderItem={(item) => {
          const isSelected = branches.includes(item.value);
          return <DropdownItem label={item.label} isSelected={isSelected} />;
        }}
        visibleSelectedItem={false}
        containerStyle={styles.dropdownContainerStyle}
      />
      {branches.length > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{branches.length}</Text>
        </View>
      )}
    </View>

    {branches.length > 0 && (
      <SelectedBranches
        branches={branches}
        setBranches={setBranches}
        moveBranch={moveBranch}
      />
    )}

    <TouchableOpacity
      style={[styles.submitButton, (loading || !isAllowed) && { opacity: 0.7 }]}
      onPress={handleSubmit}
      activeOpacity={0.8}
      disabled={loading || !isAllowed}
    >
      <Text style={styles.submitButtonText}>Generate List</Text>
    </TouchableOpacity>
  </View>
);

export default CreateCollegeForm;
