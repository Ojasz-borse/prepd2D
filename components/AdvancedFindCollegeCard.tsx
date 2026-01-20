import { useSubscriptionLock } from "@/hooks/useSubcribtion";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CollegeBranch {
  branch_name: string;
  choice_code: string;
  college_code: string;
  district: string;
  is_autonomous: boolean;
  is_government: boolean;
  name: string;
  standard_cutoff_data: StandardCutoffData[];
  percentage?: number;
  tag?: string;
  req_rank?: number;
  considered_category?: string | null;
}

interface StandardCutoffData {
  rank: number;
  category: string;
  percentile: number;
}

interface Props {
  item: CollegeBranch;
  quickView?: boolean;
  onLongPress?: (choice_code: string) => void;
  selectionMode?: boolean;
  handleSelectCard?: (choice_code: string) => void;
}

const AdvancedFindCollegeCard: React.FC<Props> = ({
  item,
  quickView,
  onLongPress,
  selectionMode,
  handleSelectCard,
}) => {
  const { isAllowed } = useSubscriptionLock({
    gate: "after", // 👈 IMPORTANT
  });
  return (
    <TouchableOpacity
      key={item.choice_code}
      style={styles.cardContainer}
      onLongPress={onLongPress ? () => onLongPress(item.choice_code) : () => { }}
      // onPress={() => {
      //   if (selectionMode) {
      //     handleSelectCard && handleSelectCard(item.choice_code);
      //   } else {
      //     router.push({
      //       pathname: "../branch-details",
      //       params: { choice_code: item.choice_code },
      //     });
      //   }
      // }}
      activeOpacity={0.7}
    >
      {/* Smart Match Tags (if any) */}
      {(item.tag || item.percentage) && (
        <View style={styles.smartMatchRow}>
          {item.tag && (
            <View style={[styles.statusTag, { backgroundColor: getTagColor(item.tag) }]}>
              <Text style={styles.statusTagText}>{item.tag}</Text>
            </View>
          )}
          {item.percentage && item.percentage <= 100 && (
            <View style={styles.percentageTag}>
              <Text style={[styles.percentageText, { color: getTagColor(item.tag || "") }]}>
                {item.percentage}%
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Top Metadata Row (Greenish Pills) */}
      <View style={styles.topRow}>
        <View style={styles.greenTag}>
          <Text style={styles.greenTagText}>{item.choice_code}</Text>
        </View>
        <View style={styles.greenTag}>
          <Text style={styles.greenTagText}>
            {item.is_government ? "Govt" : "Pvt"}
          </Text>
        </View>
      </View>

      {/* Branch & View Button Row */}
      <View style={styles.titleRow}>
        <Text style={styles.branchName}>
          {item.branch_name}
        </Text>
        {!selectionMode && (
          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => {
              if (isAllowed) {
                router.push({
                  pathname: "../branch-details",
                  params: { choice_code: item.choice_code },
                })
              }
            }

            }
          >
            <Text style={styles.viewButtonText}>View</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* College Name */}
      <View style={styles.collegeRow}>
        <Text style={styles.collegePillText}>{item.name}</Text>
      </View>

      {/* Cutoff Grid */}
      {!quickView && (
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
      )}
    </TouchableOpacity>
  );
};

// Helper for tag colors
const getTagColor = (tag: string) => {
  switch (tag) {
    case "Exact": return "#2ecc71";
    case "Very Hard": return "#ef4444";
    case "Hard": return "#f97316";
    case "Easy": return "#facc15";
    case "Very Easy": return "#a3e635";
    default: return "#d3d3d3";
  }
};

export default React.memo(AdvancedFindCollegeCard);

const styles = StyleSheet.create({
  cardContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  smartMatchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
    marginTop: -4,
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusTagText: {
    color: "#fff",
    fontSize: 11,
    fontFamily: "SourceSans3Bold",
  },
  percentageTag: {
    backgroundColor: "#f2f2f2",
    borderWidth: 0.5,
    borderColor: "#d9d9d9",
    paddingHorizontal: 8,
    paddingVertical: 1,
    borderRadius: 6,
  },
  percentageText: {
    fontSize: 11,
    fontFamily: "SourceSans3Bold",
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
  collegeRow: {
    flexDirection: "row",
    marginBottom: 12,
  },

  collegePillText: {
    fontSize: 14,
    color: "#141414",
    fontFamily: "SourceSans3Medium",
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
