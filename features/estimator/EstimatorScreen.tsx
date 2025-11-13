import FloatingLabelInput from "@/components/FloatingLabelInput";
import TopHeader from "@/components/TopHeader";
import { useEstimator } from "@/hooks/useEstimator";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../constants/theme";

export default function EstimatorScreen() {
  const { percentile, rank, loading, error, predictPercentile, predictRank } =
    useEstimator();

  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"marks" | "rank">("marks");

  // Marks tab states
  const [marks, setMarks] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<any>(null);
  const [errMsgMarks, setErrMsgMarks] = useState("");

  // Rank tab states (separate so inputs don't overwrite each other)
  const [overallPercentile, setOverallPercentile] = useState("");
  const [physicsPercentile, setPhysicsPercentile] = useState("");
  const [chemistryPercentile, setChemistryPercentile] = useState("");
  const [mathsPercentile, setMathsPercentile] = useState("");
  const [errMsgRank, setErrMsgRank] = useState("");

  // Shared UI state
  const [showInfo, setShowInfo] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);

  useEffect(() => {
    if (Number(marks) < 0) {
      setErrMsgMarks("Marks should not be less than 0!");
    } else if (Number(marks) > 200) {
      setErrMsgMarks("Marks should not be greater than 200!");
    } else {
      setErrMsgMarks("");
    }
  }, [marks]);

  // Validate rank inputs (overall required; subjects optional but must be 0-100 if provided)
  useEffect(() => {
    const checkNumberRange = (val: string) => {
      if (val === "") return true;

      const num = Number(val);

      // ✅ Must be within 0–100
      if (isNaN(num) || num < 0 || num > 100) return false;

      // ✅ Allow only up to 7 digits after decimal
      const decimalCheck = /^(\d{1,2}(\.\d{1,7})?|100(\.0{1,7})?)$/;
      return decimalCheck.test(val);
    };

    if (!checkNumberRange(overallPercentile)) {
      setErrMsgRank("Percentile must be between 0 - 100, max 7 decimals.");
      return;
    }
    if (!checkNumberRange(physicsPercentile)) {
      setErrMsgRank("Percentile must be between 0 - 100, max 7 decimals.");
      return;
    }
    if (!checkNumberRange(chemistryPercentile)) {
      setErrMsgRank("Percentile must be between 0 - 100, max 7 decimals.");
      return;
    }
    if (!checkNumberRange(mathsPercentile)) {
      setErrMsgRank("Percentile must be between 0 - 100, max 7 decimals.");
      return;
    }

    setErrMsgRank("");
  }, [
    overallPercentile,
    physicsPercentile,
    chemistryPercentile,
    mathsPercentile,
  ]);

  const difficultyOptions = [
    { label: "Very Easy", value: "veryEasy" },
    { label: "Easy", value: "easy" },
    { label: "Moderate", value: "moderate" },
    { label: "Hard", value: "hard" },
    { label: "Very Hard", value: "veryHard" },
  ];

  const isMarksValid =
    Number(marks) >= 0 &&
    Number(marks) <= 200 &&
    selectedDifficulty &&
    !errMsgMarks;

  // For rank: require overallPercentile and no validation error
  const isRankValid = overallPercentile !== "" && !errMsgRank;

  const handleCalculatePercentile = async () => {
    if (!isMarksValid) return;
    await predictPercentile(Number(marks), selectedDifficulty);
    setShowResultModal(true);
  };

  const handleCalculateRank = async () => {
    if (!isRankValid) return;
    // Keep the existing predictRank call (only overall) to avoid breaking the hook.
    // If your hook supports extra fields later, you can extend this call.
    await predictRank(
      Number(overallPercentile),
      Number(physicsPercentile),
      Number(chemistryPercentile),
      Number(mathsPercentile)
    );
    setShowResultModal(true);
  };

  // Info modal content dynamically based on active tab
  const renderInfoContent = () => {
    if (activeTab === "marks") {
      return (
        <>
          <Text style={styles.modalTitle}>Marks to Percentile — Info</Text>
          <Text style={styles.modalPoint}>• Marks must be between 1 - 200</Text>
          <Text style={styles.modalPoint}>
            • Difficulty/Shift must be selected
          </Text>
          <Text style={styles.modalPoint}>
            • Predictions are estimates, not exact results
          </Text>
          <Text style={styles.modalPoint}>
            • Higher marks & easier shifts can improve percentile
          </Text>
        </>
      );
    } else {
      return (
        <>
          <Text style={styles.modalTitle}>Percentile to Rank — Info</Text>
          <Text style={styles.modalPoint}>
            • Enter your overall percentile (required).
          </Text>
          <Text style={styles.modalPoint}>
            • You may also provide Physics, Chemistry, and Mathematics
            percentiles (optional) — providing them can improve accuracy.
          </Text>
          <Text style={styles.modalPoint}>
            • Percentiles must be between 0 and 100.
          </Text>
          <Text style={styles.modalPoint}>
            • Predictions are estimates — actual rank may differ.
          </Text>
        </>
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TopHeader title="Estimator" showBackArrow={false} />

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "marks" && styles.activeTab]}
            onPress={() => setActiveTab("marks")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "marks" && styles.activeTabText,
              ]}
            >
              Marks to Percentile
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "rank" && styles.activeTab]}
            onPress={() => setActiveTab("rank")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "rank" && styles.activeTabText,
              ]}
            >
              Percentile to Rank
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contentWrapper}>
          {activeTab === "marks" && (
            <>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <View>
                  {error && <Text style={styles.errorText}>{error}</Text>}
                  {errMsgMarks && (
                    <Text style={styles.errorText}>{errMsgMarks}</Text>
                  )}
                </View>

                <TouchableOpacity
                  onPress={() => setShowInfo(true)}
                  style={{ marginBottom: 6 }}
                >
                  <Ionicons
                    name="information-circle-outline"
                    size={24}
                    color={colors.primary}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.centerContainer}>
                <View style={styles.contentBox}>
                  <Text style={styles.headingText}>Enter your Marks</Text>

                  <FloatingLabelInput
                    label="Enter Marks"
                    value={marks}
                    onChangeText={setMarks}
                    keyboardType="number-pad"
                  />

                  <Text style={styles.headingText}>
                    Select Shift Difficulty
                  </Text>

                  <Dropdown
                    style={styles.dropdown}
                    data={difficultyOptions}
                    labelField="label"
                    valueField="value"
                    value={selectedDifficulty}
                    onChange={(item) => setSelectedDifficulty(item.value)}
                    placeholder="Select Difficulty"
                    placeholderStyle={styles.dropdownText}
                    selectedTextStyle={styles.dropdownText}
                    itemTextStyle={styles.dropdownText}
                  />

                  <View style={styles.buttonWrapper}>
                    <TouchableOpacity
                      style={[
                        styles.confirmButton,
                        isMarksValid && styles.confirmButtonActive,
                      ]}
                      onPress={handleCalculatePercentile}
                      disabled={!isMarksValid || loading}
                    >
                      <Text
                        style={[
                          styles.confirmButtonText,
                          isMarksValid && styles.confirmButtonTextActive,
                        ]}
                      >
                        {loading ? "Calculating..." : "Calculate"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </>
          )}

          {activeTab === "rank" && (
            <>
              {/* Top row: info button on LEFT and errors on RIGHT */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 10,
                  alignItems: "center",
                }}
              >
                <View style={{ marginBottom: 10 }}>
                  {error && <Text style={styles.errorText}>{error}</Text>}
                  {errMsgRank && (
                    <Text style={styles.errorText}>{errMsgRank}</Text>
                  )}
                </View>
                <TouchableOpacity
                  onPress={() => setShowInfo(true)}
                  style={{ marginBottom: 6 }}
                >
                  <Ionicons
                    name="information-circle-outline"
                    size={24}
                    color={colors.primary}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.centerContainer}>
                <View style={styles.contentBox}>
                  <Text style={styles.headingText}>
                    Enter your Overall Percentile
                  </Text>

                  <FloatingLabelInput
                    label="Overall Percentile"
                    value={overallPercentile}
                    onChangeText={setOverallPercentile}
                    keyboardType="number-pad"
                  />

                  <Text style={[styles.headingText, { marginTop: 8 }]}>
                    Subject Percentiles
                  </Text>

                  <View style={{ flexDirection: "row", gap: 10 }}>
                    <View style={{ width: "30%" }}>
                      <FloatingLabelInput
                        label="Physics"
                        value={physicsPercentile}
                        onChangeText={setPhysicsPercentile}
                        keyboardType="number-pad"
                      />
                    </View>
                    <View style={{ width: "30%" }}>
                      <FloatingLabelInput
                        label="Chemistry"
                        value={chemistryPercentile}
                        onChangeText={setChemistryPercentile}
                        keyboardType="number-pad"
                      />
                    </View>
                    <View style={{ width: "34%" }}>
                      <FloatingLabelInput
                        label="Mathematics"
                        value={mathsPercentile}
                        onChangeText={setMathsPercentile}
                        keyboardType="number-pad"
                      />
                    </View>
                  </View>

                  <View style={styles.buttonWrapper}>
                    <TouchableOpacity
                      style={[
                        styles.confirmButton,
                        isRankValid && styles.confirmButtonActive,
                      ]}
                      onPress={handleCalculateRank}
                      disabled={!isRankValid || loading}
                    >
                      <Text
                        style={[
                          styles.confirmButtonText,
                          isRankValid && styles.confirmButtonTextActive,
                        ]}
                      >
                        {loading ? "Calculating..." : "Calculate"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Result Modal (same modal for both tabs) */}
        <Modal visible={showResultModal} transparent animationType="fade">
          <View style={styles.resultModalBg}>
            <View style={styles.resultBox}>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setShowResultModal(false)}
              >
                <Ionicons name="close" size={22} color="#333" />
              </TouchableOpacity>

              {percentile && activeTab === "marks" && (
                <>
                  <Text style={{ fontSize: 100, opacity: 0.8 }}>🏅</Text>
                  <Text style={styles.resultText}>{percentile.toFixed(2)}</Text>
                  <Text style={styles.resultTextSub}>Estimated Percentile</Text>
                </>
              )}

              {rank && activeTab === "rank" && (
                <Text style={styles.resultText}>📊 Estimated Rank: {rank}</Text>
              )}

              {/* If user used marks -> rank prediction (both available) show both */}
              {percentile && rank && (
                <View style={{ marginTop: 12, alignItems: "center" }}>
                  <Text style={styles.resultTextSub}>
                    Percentile: {percentile.toFixed(2)}
                  </Text>
                  <Text style={[styles.resultTextSub, { marginTop: 6 }]}>
                    Rank: {rank}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </Modal>

        {/* Info modal */}
        <Modal visible={showInfo} transparent animationType="fade">
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalBg}
            onPress={() => setShowInfo(false)}
          >
            <View style={styles.modalBox}>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setShowInfo(false)}
              >
                <Ionicons name="close" size={22} color="#717171ff" />
              </TouchableOpacity>

              {renderInfoContent()}
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

/* STYLES — kept all your font families, widths and alignment intact */
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f2f2f2" },
  container: { flex: 1, backgroundColor: "#fff" },

  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#d3d3d3",
    backgroundColor: "#fff",
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#fff",
  },
  activeTab: { borderBottomColor: colors.primary },
  tabText: {
    fontSize: 16,
    color: colors.textDark,
    fontFamily: "SourceSans3Medium",
  },
  activeTabText: { color: colors.primary },

  contentWrapper: { flex: 1, padding: 16 },

  /* center content vertically */
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    marginTop: -40,
  },

  contentBox: { marginBottom: 20 },

  errorText: {
    color: "red",
    textAlign: "right",
    marginRight: 20,
    marginTop: 4,
    fontSize: 14,
    fontFamily: "SourceSans3Medium",
  },
  headingText: {
    fontSize: 16,
    color: "#000",
    marginBottom: 18,
    fontFamily: "SourceSans3Medium",
  },

  dropdown: {
    width: "100%",
    height: 60,
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  dropdownText: {
    fontSize: 16,
    fontFamily: "SourceSans3Medium",
    color: "#333",
  },

  buttonWrapper: { width: "100%", alignItems: "flex-end" },
  confirmButton: {
    backgroundColor: "#e0e0e0",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 60,
  },
  confirmButtonActive: { backgroundColor: colors.primary },
  confirmButtonText: {
    color: "#999",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "SourceSans3Medium",
  },
  confirmButtonTextActive: { color: "#fff" },

  /* RESULT MODAL */
  resultModalBg: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  resultBox: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 12,
    alignItems: "center",
    position: "relative",
  },
  resultText: {
    fontSize: 30,
    fontFamily: "SourceSans3Medium",
    color: colors.primary,
    textAlign: "center",
    marginTop: 8,
  },
  resultTextSub: {
    fontSize: 16,
    fontFamily: "SourceSans3Medium",
    color: "#333",
  },
  closeBtn: { position: "absolute", top: 12, right: 12, padding: 6 },

  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 12,
    position: "relative",
  },
  modalTitle: {
    fontFamily: "SourceSans3Medium",
    color: colors.primary,
    fontSize: 18,
    marginBottom: 20,
  },
  modalPoint: {
    fontSize: 16,
    fontFamily: "SourceSans3Medium",
    marginBottom: 6,
    color: "#333",
  },
});
