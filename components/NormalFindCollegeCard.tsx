import { useSubscriptionLock } from "@/hooks/useSubcribtion";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export interface College {
  college_code: string;
  name: string;
  district: string;
  is_government: boolean;
  status?: string;
}

interface NormalFindCollegeCardProps {
  college: College;
}

const NormalFindCollegeCard: React.FC<NormalFindCollegeCardProps> = ({
  college,
}) => {
  const { isAllowed } = useSubscriptionLock({
    gate: "after", // 👈 IMPORTANT
  });
  return (
    <TouchableOpacity
      key={college.college_code}
      style={styles.cardContainer}
      // onPress={() =>
      //   router.push({
      //     pathname: "../college-details",
      //     params: {
      //       college_code: college.college_code,
      //     },
      //   })
      // }
      activeOpacity={0.7}
    >
      {/* Top Metadata Row (Greenish Pills) */}
      <View style={styles.topRow}>
        <View style={styles.greenTag}>
          <Text style={styles.greenTagText}>{college.college_code}</Text>
        </View>
        <View style={styles.greenTag}>
          <Text style={styles.greenTagText}>
            {college.is_government ? "Govt" : "Pvt"}
          </Text>
        </View>
      </View>

      {/* Title & View Button Row */}
      <View style={styles.titleRow}>
        <Text style={styles.collegeName}>
          {college.name}
        </Text>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => {
            if (isAllowed) {
              router.push({
                pathname: "../college-details",
                params: { college_code: college.college_code },
              })
            }

          }
          }
        >
          <Text style={styles.viewButtonText}>View</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Status (Blue Pill) */}
      <View style={styles.bottomRow}>
        <View style={styles.statusPill}>
          <Text style={styles.statusPillText}>{college.status || "N/A"}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(NormalFindCollegeCard);

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
    marginBottom: 16,
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
    marginBottom: 4,
    gap: 12,
  },
  collegeName: {
    flex: 1,
    fontSize: 17,
    color: "#000",
    fontFamily: "SourceSans3SemiBold",
  },
  viewButton: {
    backgroundColor: "#ff5e32",
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 999,
  },
  viewButtonText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "SourceSans3SemiBold",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 12,
  },
  statusPill: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#004aad",
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 99,
    marginTop: 8,
  },
  statusPillText: {
    fontSize: 12,
    color: "#004aad",
    fontFamily: "SourceSans3Medium",
  },
});
