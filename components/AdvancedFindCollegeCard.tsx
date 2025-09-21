import GovernmentCollegeIcon from "@/assets/icons/GovernmentCollegeIcon";
import PrivateCollegeIcon from "@/assets/icons/PrivateCollegeIcon";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface CollegeItem {
  id: string;
  branch_name: string;
  choice_code: string;
  college_name: string;
  college_type: "Govt" | "Pvt";
  district: string;
  cutoff: {
    open: string;
    obc: string;
    nt_sc: string;
  };
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
  item: CollegeItem;
}

const AdvancedFindCollegeCard: React.FC<Props> = ({ item }) => {
  const meta = TYPE_META[item.college_type] ?? TYPE_META.Pvt;
  const TypeIcon = meta.Icon;

  return (
    <Pressable
      key={item.id}
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
      <Text style={styles.districtText}>{item.college_name}</Text>

      {/* Cutoff Grid */}
      <View style={styles.cutoffWrapper}>
        {Object.entries(item.cutoff).map(([key, value]) => (
          <View key={key} style={styles.cutoffBox}>
            <Text style={styles.cutoffCategory}>{key.toUpperCase()}</Text>
            <Text style={styles.cutoffValue}>{value}</Text>
          </View>
        ))}
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
    fontWeight: "700",
    color: "#0A5BD3",
    letterSpacing: 0.4,
    fontFamily: "SourceSans3Medium",
  },
  cutoffValue: {
    fontSize: 12,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 2,
    fontFamily: "SourceSans3Medium",
  },
});
