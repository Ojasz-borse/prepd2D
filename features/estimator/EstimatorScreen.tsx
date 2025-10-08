import FloatingLabelInput from "@/components/FloatingLabelInput";
import TopHeader from "@/components/TopHeader";
import { useEstimator } from "@/hooks/useEstimator";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../constants/theme";

export default function EstimatorScreen() {
  const { percentile, rank, loading, error, predictPercentile, predictRank } =
    useEstimator();

  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"marks" | "rank">("marks");

  // Local input fields
  const [marks, setMarks] = useState("");
  const [inputPercentile, setInputPercentile] = useState("");

  // ===== Handlers =====
  const handleCalculatePercentile = async () => {
    if (!marks) return;
    try {
      await predictPercentile(Number(marks), "easy");
    } catch (err) {
      console.error("Error predicting percentile:", err);
    }
  };

  const handleCalculateRank = async () => {
    if (!inputPercentile) return;
    try {
      await predictRank(Number(inputPercentile));
    } catch (err) {
      console.error("Error predicting rank:", err);
    }
  };

  // ===== UI =====
  return (
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

      {/* Content */}
      <View style={styles.contentWrapper}>
        {/* --- Marks → Percentile --- */}
        {activeTab === "marks" && (
          <View style={styles.contentBox}>
            <Text style={styles.headingText}>Enter your Marks</Text>

            <FloatingLabelInput
              label="Enter Marks"
              value={marks}
              onChangeText={setMarks}
              keyboardType="number-pad"
            />

            <View style={styles.buttonWrapper}>
              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  marks && styles.confirmButtonActive,
                ]}
                onPress={handleCalculatePercentile}
                disabled={!marks || loading}
              >
                <Text
                  style={[
                    styles.confirmButtonText,
                    marks && styles.confirmButtonTextActive,
                  ]}
                >
                  {loading ? "Calculating..." : "Calculate"}
                </Text>
              </TouchableOpacity>
            </View>

            {percentile && (
              <Text style={styles.resultText}>
                🎯 Estimated Percentile: {percentile.toFixed(2)}%
              </Text>
            )}
          </View>
        )}

        {/* --- Percentile → Rank --- */}
        {activeTab === "rank" && (
          <View style={styles.contentBox}>
            <Text style={styles.headingText}>Enter your Percentile</Text>

            <FloatingLabelInput
              label="Enter Percentile"
              value={inputPercentile}
              onChangeText={setInputPercentile}
              keyboardType="number-pad"
            />

            <View style={styles.buttonWrapper}>
              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  inputPercentile && styles.confirmButtonActive,
                ]}
                onPress={handleCalculateRank}
                disabled={!inputPercentile || loading}
              >
                <Text
                  style={[
                    styles.confirmButtonText,
                    inputPercentile && styles.confirmButtonTextActive,
                  ]}
                >
                  {loading ? "Calculating..." : "Calculate"}
                </Text>
              </TouchableOpacity>
            </View>

            {rank && (
              <Text style={styles.resultText}>📊 Estimated Rank: {rank}</Text>
            )}
          </View>
        )}
      </View>

      {/* Loading or Error */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}

      {error && (
        <Text style={{ color: "red", textAlign: "center", marginTop: 10 }}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  // --- Tabs ---
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

  // --- Content ---
  contentWrapper: { flex: 1, padding: 16 },
  contentBox: { marginTop: 30 },

  headingText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 20,
    textAlign: "left",
    width: "100%",
    fontFamily: "SourceSans3Medium",
  },

  // --- Button ---
  buttonWrapper: { width: "100%", alignItems: "flex-end" },
  confirmButton: {
    backgroundColor: "#e0e0e0",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  confirmButtonActive: { backgroundColor: colors.primary },
  confirmButtonText: {
    color: "#999",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "SourceSans3Medium",
  },
  confirmButtonTextActive: { color: "#fff", fontFamily: "SourceSans3Medium" },

  // --- Result ---
  resultText: {
    marginTop: 20,
    fontSize: 16,
    fontFamily: "SourceSans3Medium",
    color: colors.textDark,
    textAlign: "center",
  },

  // --- Loader ---
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.6)",
  },
});
