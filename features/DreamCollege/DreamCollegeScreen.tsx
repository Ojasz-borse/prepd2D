import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import { useAuth } from "@/context/AuthContext";
import { useAdvancedColleges } from "@/hooks/useAdvancedColleges";
import { useRouter } from "expo-router";
import TopHeader from "@/components/TopHeader";
import { CATEGORY_OPTIONS, BRANCHES } from "@/constants/collegeFilters";
import { formatBranchName } from "@/utils/formatHelpers";
import { styles } from "../OptionForm/styles";
import DropdownItem from "../OptionForm/components/DropdownItem";
import { MY_DREAM_SCORE } from "@/constants/config";
import { fetchWithRetry } from "@/services/api";

export default function DreamCollegeScreen() {
  const { getToken, user } = useAuth();
  const { colleges, branches, collegesLoading } = useAdvancedColleges();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [selectedCollege, setSelectedCollege] = useState<string>("");
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  // Derive available branches for the selected college
  const availableBranches = useMemo(() => {
    if (!selectedCollege) return [];

    // Filter branches belonging to this college and get unique branch names
    const collegeSpecificBranches = branches.filter(b => b.college_code === selectedCollege);
    const uniqueBranchNames = Array.from(new Set(collegeSpecificBranches.map(b => b.branch_name)));

    return uniqueBranchNames.map(branch => ({
      label: formatBranchName(branch),
      value: branch,
    })).sort((a, b) => a.label.localeCompare(b.label));
  }, [selectedCollege, branches]);

  // Reset selected branches when college changes
  // Reset selected branch when college changes
  useEffect(() => {
    setSelectedBranch("");
    setScore(null);
  }, [selectedCollege]);

  const collegeData = useMemo(() => {
    return colleges
      .map((c) => ({
        label: c.name,
        value: c.college_code,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [colleges]);

  const handleCalculate = async () => {
    if (!selectedCollege || !selectedBranch || !selectedCategory) {
      alert("Please fill in all details");
      return;
    }

    try {
      setLoading(true);
      const token = await getToken();

      const payload = {
        user_id: user?.user_id,
        category: selectedCategory,
        college_code: selectedCollege,
        branch: selectedBranch
      };

      const response = await fetchWithRetry(
        MY_DREAM_SCORE,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify(payload),
        },
        2,
        1000
      );

      const data = await response.json();
      if (data.success) {
        setScore(data.score);
      } else {
        alert(data.message || "Failed to calculate score");
      }
    } catch (error) {
      console.error("Error calculating dream score:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const moveBranch = () => { };

  return (
    <LinearGradient
      colors={["#f8fafc", "#e6f1ff", "#e8dcff"]}
      locations={[0, 0.5, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={[styles.safeArea, { paddingTop: insets.top }]}>
        <TopHeader title="Dream Score Predictor" showBackArrow={true} />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
            keyboardShouldPersistTaps="handled"
          >
          <View style={styles.card}>
            <Text style={styles.formTitle}>Enter Details</Text>

            {/* College Dropdown */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Select College</Text>
              <Dropdown
                style={styles.dropdown}
                data={collegeData}
                search
                searchPlaceholder="Search College..."
                labelField="label"
                valueField="value"
                placeholder="Select college"
                value={selectedCollege}
                onFocus={() => setSelectedCollege("")}
                onChange={(item) => setSelectedCollege(item.value)}
                placeholderStyle={styles.dropdownText}
                selectedTextStyle={styles.dropdownText}
                itemTextStyle={styles.dropdownText}
                inputSearchStyle={styles.dropdownText}
                containerStyle={styles.dropdownContainerStyle}
              />
            </View>

            {/* Branch Dropdown */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Select Branch</Text>
              <Dropdown
                style={styles.dropdown}
                data={availableBranches}
                labelField="label"
                valueField="value"
                placeholder={selectedCollege ? "Select Branch" : "Select a college first"}
                placeholderStyle={styles.dropdownText}
                selectedTextStyle={styles.dropdownText}
                itemTextStyle={styles.dropdownText}
                search
                searchPlaceholder="Search branch..."
                inputSearchStyle={styles.dropdownText}
                value={selectedBranch}
                onFocus={() => setSelectedBranch("")}
                onChange={(item) => setSelectedBranch(item.value)}
                containerStyle={styles.dropdownContainerStyle}
                disable={!selectedCollege}
              />
            </View>

            {/* Category Dropdown */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Select Category</Text>
              <Dropdown
                style={styles.dropdown}
                data={CATEGORY_OPTIONS}
                labelField="label"
                valueField="value"
                value={selectedCategory}
                onChange={(item) => setSelectedCategory(item.value)}
                placeholder="Select Category"
                placeholderStyle={styles.dropdownText}
                selectedTextStyle={styles.dropdownText}
                itemTextStyle={styles.dropdownText}
                containerStyle={styles.dropdownContainerStyle}
              />
            </View>

            <TouchableOpacity
              style={[styles.submitButton, loading && { opacity: 0.7 }]}
              onPress={handleCalculate}
              activeOpacity={0.8}
              disabled={loading}
            >
              <Text style={styles.submitButtonText}>
                {loading ? "Calculating..." : "Calculate"}
              </Text>
            </TouchableOpacity>

          </View>

          {score !== null && (
            <View style={[styles.card, { marginTop: 4, paddingVertical: 20 }]}>
              <View style={{ alignItems: "flex-start" }}>

                <Text style={{
                  fontSize: 16,
                  fontFamily: "SourceSans3Medium",
                  color: "#475569",
                  lineHeight: 24,
                }}>
                  According to previous year cutoffs, you need to score{" "} 
                  <Text style={{ color: "#004aad", fontFamily: "SourceSans3SemiBold" }}>
                    {score}
                  </Text>
                  {" "}Marks out of 200 to get{" "}
                  <Text style={{ color: "#004aad", fontFamily: "SourceSans3SemiBold" }}>
                    {formatBranchName(selectedBranch)}
                  </Text>
                  {" "}branch in{" "}
                  <Text 
                    onPress={() => router.push({ pathname: "/college-details", params: { college_code: selectedCollege } })}
                    style={{ color: "#004aad", fontFamily: "SourceSans3SemiBold", textDecorationLine: "underline" }}>
                    {colleges.find(c => c.college_code === selectedCollege)?.name || selectedCollege}
                  </Text>
                  {" "}college.
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
    </LinearGradient>
  );
}
