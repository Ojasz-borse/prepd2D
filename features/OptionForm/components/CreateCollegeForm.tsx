import React from "react";
import { View, Text, TouchableOpacity, Switch } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, Feather } from "@expo/vector-icons";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import FloatingLabelInput from "@/components/FloatingLabelInput";
import { CATEGORY_OPTIONS, LOCATIONS, BRANCHES, HOME_UNIVERSITIES } from "@/constants/collegeFilters";
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
  inputType: "rank" | "percentile";
  setInputType: (type: "rank" | "percentile") => void;
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
  gender: "male" | "female";
  setGender: (gender: "male" | "female") => void;
  homeUniversityId: number | null;
  setHomeUniversityId: (id: number | null) => void;
  tfwsPref: boolean;
  setTfwsPref: (pref: boolean) => void;
}

const CreateCollegeForm = ({
  rank,
  setRank,
  percentile,
  setPercentile,
  inputType,
  setInputType,
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
  gender,
  setGender,
  homeUniversityId,
  setHomeUniversityId,
  tfwsPref,
  setTfwsPref,
}: CreateCollegeFormProps) => (
  <View style={styles.card}>
    <Text style={styles.formTitle}>Enter Details</Text>

    {/* Input Type Selection (Radio Buttons) */}
    <View style={styles.radioContainer}>
      <TouchableOpacity
        style={styles.radioButton}
        onPress={() => {
          setInputType("percentile");
          setRank("");
        }}
        activeOpacity={0.7}
      >
        <View style={styles.radioCircle}>
          {inputType === "percentile" && <View style={styles.radioDot} />}
        </View>
        <Text style={styles.radioLabel}>Percentile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.radioButton}
        onPress={() => {
          setInputType("rank");
          setPercentile("");
        }}
        activeOpacity={0.7}
      >
        <View style={styles.radioCircle}>
          {inputType === "rank" && <View style={styles.radioDot} />}
        </View>
        <Text style={styles.radioLabel}>Rank</Text>
      </TouchableOpacity>
    </View>

    <View>
      {inputType === "rank" ? (
        <FloatingLabelInput
          label="Enter Your Rank"
          value={rank}
          onChangeText={(val) => setRank(val.replace(/[^0-9]/g, ""))}
          keyboardType="number-pad"
        />
      ) : (
        <>
          <FloatingLabelInput
            label="Enter Your Percentile"
            value={percentile}
            onChangeText={handlePercentileChange}
            onBlur={handlePercentileBlur}
            keyboardType="number-pad"
            maxLength={
              percentile.includes(".") ? percentile.indexOf(".") + 8 : 4
            }
          />
          {percentile && parseFloat(percentile) > 100 && (
            <Text style={[styles.warningText, { marginTop: -25, marginBottom: 15 }]}>
              Percentile cannot exceed 100
            </Text>
          )}
        </>
      )}
    </View>

    <View style={styles.inputWrapper}>
      <Dropdown
        style={styles.dropdown}
        data={CATEGORY_OPTIONS}
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
        search
        searchPlaceholder="Search location..."
        inputSearchStyle={styles.dropdownText}
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
        search
        searchPlaceholder="Search branch..."
        inputSearchStyle={styles.dropdownText}
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

    {/* Home University Dropdown */}
    <View style={styles.inputWrapper}>
      <Dropdown
        style={styles.dropdown}
        data={HOME_UNIVERSITIES.map((u) => ({ label: u.name, value: u.id }))}
        labelField="label"
        valueField="value"
        value={homeUniversityId}
        onChange={(item) => setHomeUniversityId(item.value)}
        search
        searchPlaceholder="Search university..."
        inputSearchStyle={styles.dropdownText}
        placeholder="Select Home University"
        placeholderStyle={styles.dropdownText}
        selectedTextStyle={styles.dropdownText}
        itemTextStyle={styles.dropdownText}
        containerStyle={styles.dropdownContainerStyle}
      />
    </View>

    {/* Gender Selection */}
    <View style={styles.genderContainer}>
      <TouchableOpacity
        style={[
          styles.genderButton,
          gender === "male" && styles.genderButtonActive,
        ]}
        onPress={() => setGender("male")}
        activeOpacity={0.7}
      >
        <Ionicons
          name="male"
          size={18}
          color={gender === "male" ? "#004aad" : "#737373"}
        />
        <Text
          style={[
            styles.genderText,
            gender === "male" && styles.genderTextActive,
          ]}
        >
          Male
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.genderButton,
          gender === "female" && styles.genderButtonActive,
        ]}
        onPress={() => setGender("female")}
        activeOpacity={0.7}
      >
        <Ionicons
          name="female"
          size={18}
          color={gender === "female" ? "#004aad" : "#737373"}
        />
        <Text
          style={[
            styles.genderText,
            gender === "female" && styles.genderTextActive,
          ]}
        >
          Female
        </Text>
      </TouchableOpacity>
    </View>

    {/* TFWS Preference Switch */}
    <View style={styles.switchWrapper}>
      <Text style={styles.switchLabel}>TFWS Preference</Text>
      <Switch
        onValueChange={() => setTfwsPref(!tfwsPref)}
        value={tfwsPref}
        trackColor={{ false: "#d1d5db", true: "#004aad60" }}
        thumbColor={tfwsPref ? "#004aad" : "#f4f4f5"}
      />
    </View>


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
