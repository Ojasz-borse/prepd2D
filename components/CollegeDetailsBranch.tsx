import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface StandardCutoffData {
  rank: number;
  category: string;
  percentile: number;
}

interface Branch {
  branch_name: string;
  choice_code: string;
  standard_cutoff_data: StandardCutoffData[];
}

interface Props {
  item: Branch;
}

const CollegeDetailsBranch: React.FC<Props> = ({ item }) => {
  return (
    <TouchableOpacity
      key={item.choice_code}
      style={styles.cardContainer}
      onPress={() =>
        router.push({
          pathname: "../branch-details",
          params: { choice_code: item.choice_code },
        })
      }
      activeOpacity={0.7}
    >
      {/* Top Metadata Row (Greenish Pills) */}
      <View style={styles.topRow}>
        <View style={styles.greenTag}>
          <Text style={styles.greenTagText}>{item.choice_code}</Text>
        </View>
        <View style={styles.greenTag}>
          <Text style={styles.greenTagText}>Intake: 120</Text>
        </View>
      </View>

      {/* Branch & View Button Row */}
      <View style={styles.titleRow}>
        <Text style={styles.branchName}>{item.branch_name}</Text>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() =>
            router.push({
              pathname: "../branch-details",
              params: { choice_code: item.choice_code },
            })
          }
        >
          <Text style={styles.viewButtonText}>View</Text>
        </TouchableOpacity>
      </View>

      {/* Cutoff Grid */}
      <View style={styles.cutoffWrapper}>
        {item.standard_cutoff_data.map((cutoff, idx) => (
          <View key={idx} style={styles.cutoffBox}>
            <Text style={styles.cutoffCategory}>{cutoff.category}</Text>
            <Text style={styles.cutoffValue}>
              {cutoff.percentile.toFixed(2)}
            </Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(CollegeDetailsBranch);

const styles = StyleSheet.create({
  cardContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    gap: 8,
  },
  greenTag: {
    backgroundColor: "#f0f7d4",
    borderWidth: 1,
    borderColor: "#b6cf4f",
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  greenTagText: {
    fontSize: 12,
    color: "#8b9e3dff",
    fontFamily: "SourceSans3Medium",
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    gap: 12,
  },
  branchName: {
    flex: 1,
    fontSize: 17,
    color: "#000",
    fontFamily: "SourceSans3SemiBold",
  },
  viewButton: {
    backgroundColor: "#ff5e32",
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 99,
  },
  viewButtonText: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "SourceSans3SemiBold",
  },
  cutoffWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
    marginTop: 4,
  },
  cutoffBox: {
    backgroundColor: "#f8fafc",
    borderColor: "#e2e8f0",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 4,
    minWidth: 50,
    alignItems: "center",
  },
  cutoffCategory: {
    fontSize: 10,
    color: "#0A5BD3",
    letterSpacing: 0.4,
    fontFamily: "SourceSans3SemiBold",
  },
  cutoffValue: {
    fontSize: 12,
    color: "#0F172A",
    fontFamily: "SourceSans3Bold",
    marginTop: -2,
  },
});
