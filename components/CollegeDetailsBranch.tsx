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
      style={styles.card3D}
      onPress={() =>
        router.push({
          pathname: "../branch-details",
          params: { choice_code: item.choice_code },
        })
      }
      activeOpacity={0.7}
    >
      {/* Top Row */}
      <View style={styles.subRow}>
        <Text style={styles.subText}>{item.choice_code}</Text>
        <View style={styles.typeRow}>
          <Text style={styles.subText}>Intake: 120</Text>
        </View>
      </View>

      {/* Branch */}
      <Text style={styles.collegeName}>{item.branch_name}</Text>

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
  card3D: {
    width: "100%",
    borderRadius: 16,
    padding: 12,
    marginBottom: 2,
    borderWidth: 1,
    borderColor: "#d9d9d9",
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
    color: "#004aad",
    fontFamily: "SourceSans3Medium",
  },
  collegeName: {
    fontSize: 16,
    color: "#000",
    marginTop: 2,
    fontWeight: "600",
    fontFamily: "SourceSans3Medium",
  },
  districtText: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
    fontFamily: "SourceSans3Medium",
  },
  cutoffWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 12,
  },
  cutoffBox: {
    backgroundColor: "#e6f1ff",
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
  rankValue: {
    fontSize: 10,
    fontFamily: "SourceSans3SemiBold",
    color: "#666",
    marginTop: -2,
  },
});
