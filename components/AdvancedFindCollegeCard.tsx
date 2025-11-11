import GovernmentCollegeIcon from "@/assets/icons/GovernmentCollegeIcon";
import PrivateCollegeIcon from "@/assets/icons/PrivateCollegeIcon";
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

// ----------------- META -----------------
const TYPE_META: Record<
  string,
  { label: string; Icon: React.ComponentType<any> }
> = {
  Govt: { label: "Govt", Icon: GovernmentCollegeIcon },
  Pvt: { label: "Pvt", Icon: PrivateCollegeIcon },
};

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
  const meta = item.is_government ? TYPE_META.Govt : TYPE_META.Pvt;
  const TypeIcon = meta.Icon;

  return (
    <TouchableOpacity
      key={item.choice_code}
      style={styles.card3D}
      onLongPress={onLongPress ? () => onLongPress(item.choice_code) : () => {}}
      onPress={() => {
        if (selectionMode) {
          handleSelectCard && handleSelectCard(item.choice_code);
        } else {
          router.push({
            pathname: "../branch-details",
            params: { choice_code: item.choice_code },
          });
        }
      }}
      activeOpacity={0.7}
    >
      {(item.tag || item.percentage) && (
        <View style={styles.smartMatch}>
          {item.tag && (
            <Text
              style={[
                styles.smartMatchText,
                {
                  backgroundColor:
                    item.tag === "Exact"
                      ? "#2ecc71"
                      : item.tag === "Very Hard"
                      ? "#ef4444"
                      : item.tag === "Hard"
                      ? "#f97316"
                      : item.tag === "Easy"
                      ? "#facc15"
                      : item.tag === "Very Easy"
                      ? "#a3e635"
                      : "#d3d3d3", // fallback
                },
              ]}
            >
              {item.tag}
            </Text>
          )}

          {item.percentage && item.percentage <= 100 && (
            <Text
              style={[
                styles.smartMatchNormalText,
                {
                  color:
                    item.tag === "Exact"
                      ? "#2ecc71"
                      : item.tag === "Very Hard"
                      ? "#ef4444"
                      : item.tag === "Hard"
                      ? "#f97316"
                      : item.tag === "Easy"
                      ? "#facc15"
                      : item.tag === "Very Easy"
                      ? "#a3e635"
                      : "#000000", // fallback
                },
              ]}
            >
              {item.percentage}%
            </Text>
          )}
        </View>
      )}
      {/* Top Row */}
      <View style={styles.subRow}>
        <Text style={styles.subText}>{item.choice_code}</Text>
        <View style={styles.typeRow}>
          {!quickView && (
            <>
              <TypeIcon size={16} />
              <Text style={styles.subText}>{meta.label}</Text>
            </>
          )}
        </View>
      </View>

      {/* Branch */}
      <Text style={styles.collegeName}>{item.branch_name}</Text>

      {/* College */}
      {!quickView && <Text style={styles.districtText}>{item.name}</Text>}

      {quickView && (
        <Text style={styles.districtText}>
          {item.name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase()}
        </Text>
      )}

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

export default React.memo(AdvancedFindCollegeCard);

const styles = StyleSheet.create({
  card3D: {
    width: "100%",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#d9d9d9",
    backgroundColor: "#fff",
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
    marginTop: 8,
    alignItems: "center",
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
  chance: {
    backgroundColor: "#e6b800",
    borderRadius: 25,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  chanceText: {
    color: "#fff",
    fontSize: 9,
    fontFamily: "SourceSans3SemiBold",
  },
  smartMatch: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: -22,
    marginBottom: 5,
    marginLeft: 2,
    marginRight: 2,
    gap: 10,
  },
  smartMatchText: {
    color: "#ffffff",
    paddingHorizontal: 8,
    borderRadius: 6,
    fontFamily: "SourceSans3Bold",
    fontSize: 12,
  },
  smartMatchNormalText: {
    color: "#ccc",
    backgroundColor: "#f2f2f2",
    borderWidth: 0.5,
    borderColor: "#d9d9d9",
    paddingHorizontal: 8,
    borderRadius: 6,
    fontFamily: "SourceSans3Medium",
    fontSize: 12,
  },
});
