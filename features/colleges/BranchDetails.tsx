import GovernmentCollegeIcon from "@/assets/icons/GovernmentCollegeIcon";
import PrivateCollegeIcon from "@/assets/icons/PrivateCollegeIcon";
import TopHeader from "@/components/TopHeader";
import { GET_COLLEGE_BRANCHES } from "@/constants/config";
import { useAuth } from "@/context/AuthContext";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ---------- ✅ Types ----------
interface CutoffEntry {
  rank: number;
  percentile: number;
}

interface CutoffData {
  hu_hu: Record<string, CutoffEntry>;
  state: Record<string, CutoffEntry>;
  hu_ohu: Record<string, CutoffEntry>;
  ohu_ohu: Record<string, CutoffEntry>;
}

interface CollegeBranchDetails {
  college_code: string;
  name: string;
  is_autonomous: boolean;
  is_government: boolean;
  district: string;
  branch_name: string;
  choice_code: string;
  cutoff_data: CutoffData;
}

interface BranchResponse {
  success: boolean;
  college?: CollegeBranchDetails;
}

export default function BranchDetails() {
  const { getToken } = useAuth();
  const { choice_code } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [collegeDetails, setCollegeDetails] =
    useState<CollegeBranchDetails | null>(null);

  useEffect(() => {
    if (!choice_code) return;

    // console.log("choice code", choice_code);

    const fetchBranchDetails = async () => {
      const GET_BRANCH_DETAILS_URL = `${GET_COLLEGE_BRANCHES}/${choice_code}`;

      try {
        const token = await getToken();
        const res = await fetch(GET_BRANCH_DETAILS_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        const data: BranchResponse = await res.json();
        if (data.success && data.college) {
          setCollegeDetails(data.college);
        } else {
          setCollegeDetails(null);
        }
      } catch (error) {
        console.error("Error fetching branch:", error);
        setCollegeDetails(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBranchDetails();
  }, [choice_code]);

  // ---------- ✅ UI ----------
  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading branch details...</Text>
      </SafeAreaView>
    );
  }

  if (!collegeDetails) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>No data available for this branch.</Text>
      </SafeAreaView>
    );
  }

  const renderCutoffSection = (
    title: string,
    data: Record<string, CutoffEntry>
  ) => {
    const entries = Object.entries(data);
    if (!entries.length) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.cutoffWrapper}>
          {entries.map(([category, { percentile, rank }]) => (
            <View key={category} style={styles.cutoffBox}>
              <Text style={styles.cutoffCategory}>{category}</Text>
              <Text style={styles.cutoffValue}>
                {percentile?.toFixed(2) ?? "--"}
              </Text>
              {rank && <Text style={styles.rankValue}>R: {rank}</Text>}
            </View>
          ))}
        </View>
        <View style={styles.separator} />
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopHeader title="Branch Details" showBackArrow={true} />
      <ScrollView style={styles.container}>
        <View style={styles.subRow}>
          <Text style={styles.subText}>{collegeDetails?.choice_code}</Text>

          <View style={styles.typeRow}>
            {collegeDetails?.is_autonomous ? (
              <GovernmentCollegeIcon size={16} />
            ) : (
              <PrivateCollegeIcon size={16} />
            )}
            <Text style={styles.subText}>
              {collegeDetails?.is_autonomous ? "Autonomous" : "Non-Autonomous"}
            </Text>
          </View>
        </View>

        <Text style={styles.title}>{collegeDetails?.branch_name}</Text>

        {/* Address */}
        <View style={styles.address}>
          <Text style={styles.addressText}>{collegeDetails?.name}</Text>
        </View>
        <View style={styles.separator} />

        {/* -------- Cutoff Sections -------- */}
        {renderCutoffSection("State Cutoff", collegeDetails?.cutoff_data.state)}

        {renderCutoffSection("HU-HU", collegeDetails?.cutoff_data.hu_hu)}

        {renderCutoffSection("HU-OHU", collegeDetails?.cutoff_data.hu_ohu)}

        {renderCutoffSection("OHU-OHU", collegeDetails?.cutoff_data.ohu_ohu)}
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------- ✅ Styles ----------
const styles = StyleSheet.create({
  container: {
    padding: 16,
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
    justifyContent: "flex-end",
    width: 140,
    gap: 4,
  },
  subText: {
    fontSize: 14,
    color: "#004aad",
    fontFamily: "SourceSans3Medium",
    textAlign: "center",
  },

  // Typography
  title: {
    fontFamily: "SourceSans3Medium",
    fontSize: 18,
    color: "#000",
    flexWrap: "wrap",
    marginBottom: -8,
  },

  sectionTitle: {
    fontFamily: "SourceSans3Medium",
    fontSize: 16,
    color: "#000",
  },

  address: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginBottom: 8,
    marginTop: 12,
  },
  addressText: {
    fontFamily: "SourceSans3Medium",
    fontSize: 16,
    color: "#4d4d4d",
  },
  separator: {
    height: 1,
    backgroundColor: "#004aad",
    opacity: 0.15,
    marginVertical: 4,
  },

  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#555",
    marginTop: 4,
  },
  metaText: {
    fontSize: 13,
    color: "#888",
    marginTop: 2,
  },
  section: {
    marginTop: 20,
  },

  cutoffWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  cutoffBox: {
    backgroundColor: "#e6f1ff",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    minWidth: 70,
    alignItems: "center",
  },
  cutoffCategory: {
    fontSize: 11,
    color: "#0A5BD3",
    fontFamily: "SourceSans3SemiBold",
  },
  cutoffValue: {
    fontSize: 13,
    color: "#0F172A",
    fontFamily: "SourceSans3Bold",
    marginTop: -2,
  },
  rankValue: {
    fontSize: 10,
    fontFamily: "SourceSans3SemiBold",
    color: "#666",
    marginTop: -1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
