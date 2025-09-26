import GovernmentCollegeIcon from "@/assets/icons/GovernmentCollegeIcon";
import PrivateCollegeIcon from "@/assets/icons/PrivateCollegeIcon";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface CollegeBranch {
  branch_name: string;
  choice_code: string;
  college_code: string;
  district: string;
  is_autonomous: boolean;
  is_government: boolean;
  name: string;
  standard_cutoff_data: StandardCutoffData[];
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
}

const AdvancedFindCollegeCard: React.FC<Props> = ({ item }) => {
  const meta = item.is_government ? TYPE_META.Govt : TYPE_META.Pvt;
  const TypeIcon = meta.Icon;

  return (
    <Pressable
      key={item.choice_code}
      style={styles.card3D}
      onPress={() =>
        router.push({
          pathname: "../branch-details",
          params: {
            id: item.choice_code,
          },
        })
      }
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
      <Text style={styles.districtText}>{item.name}</Text>

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

        <View style={{ marginLeft: "auto" }}>
          <View style={styles.chance}>
            <Text style={styles.chanceText}>99%</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default React.memo(AdvancedFindCollegeCard);

const styles = StyleSheet.create({
  card3D: {
    width: "100%",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
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
    color: "#063866",
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
    alignItems: "center",
  },
  cutoffBox: {
    backgroundColor: "#f0f4fb",
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
});
