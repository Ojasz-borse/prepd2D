import GovernmentCollegeIcon from "@/assets/icons/GovernmentCollegeIcon";
import PrivateCollegeIcon from "@/assets/icons/PrivateCollegeIcon";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export interface College {
  college_code: string;
  name: string;
  district: string;
  is_government: boolean;
  status: string;
}

interface NormalFindCollegeCardProps {
  college: College;
}

const NormalFindCollegeCard: React.FC<NormalFindCollegeCardProps> = ({
  college,
}) => {
  return (
    <Pressable
      key={college.college_code}
      style={styles.card3D}
      onPress={() =>
        router.push({
          pathname: "../college-details",
          params: {
            college_code: college.college_code,
          },
        })
      }
    >
      <View style={styles.subRow}>
        <Text style={styles.subText}>{college.college_code}</Text>
        <View style={styles.typeRow}>
          {college.is_government ? (
            <GovernmentCollegeIcon size={16} />
          ) : (
            <PrivateCollegeIcon size={16} />
          )}
          <Text style={styles.subText}>
            {college.is_government ? "Govt" : "Pvt"}
          </Text>
        </View>
      </View>
      <Text style={styles.collegeName}>{college.name}</Text>
      <Text style={styles.statusText}>Status: {college.status}</Text>
    </Pressable>
  );
};

export default React.memo(NormalFindCollegeCard);

const styles = StyleSheet.create({
  card3D: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#d9d9d9",
  },
  collegeName: {
    fontSize: 16,
    color: "#000",
    fontFamily: "SourceSans3Medium",
    marginTop: 2,
  },
  statusText: {
    fontSize: 12,
    color: "#888",
    fontFamily: "SourceSans3Medium",
    marginTop: 2,
  },
  subRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  typeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: 50,
    gap: 4,
  },
  subText: {
    fontSize: 14,
    color: "#004aad",
    fontFamily: "SourceSans3Medium",
  },
});
