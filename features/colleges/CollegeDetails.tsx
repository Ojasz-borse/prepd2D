import ExternalLinkIcon from "@/assets/icons/ExternalLinkIcon";
import GovernmentCollegeIcon from "@/assets/icons/GovernmentCollegeIcon";
import LocationPinIcon from "@/assets/icons/LocationPinIcon";
import PrivateCollegeIcon from "@/assets/icons/PrivateCollegeIcon";
import CollegeContentSkeleton from "@/components/CollegeContentSkeleton";
import CollegeDetailsBranch from "@/components/CollegeDetailsBranch";
import CollegeDetailsBranchSkeleton from "@/components/CollegeDetailsBranchSkeleton";
import CollegeFeesSkeleton from "@/components/CollegeFeesSkeleton";
import TopHeader from "@/components/TopHeader";
import { GET_COLLEGES } from "@/constants/config";
import { useAuth } from "@/context/AuthContext";
import CollegeFees from "@/features/colleges/CollegeFees";
import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type RootStackParamList = {
  CollegeDetails: {
    college_code: string;
  };
};
type DetailsRouteProp = RouteProp<RootStackParamList, "CollegeDetails">;

interface FeeCategory {
  development_fees: number;
  other_fees: number;
  total: number;
  tuition_fees: number;
}

type FeesStructure = Record<string, FeeCategory>;

interface CollegeDetails {
  college_code: string;
  name: string;
  district: string;
  is_government: boolean;
  is_autonomous: boolean;
  status: string;
  address: string | null;
  fees_structure: FeesStructure | null; // <-- updated
  naac_grade: string | null;
  naac_score: number | null;
  official_website_url: string | null;
  placement_url: string | null;
  total_intake: number | null;
  tuition_fees_json: Record<string, any> | null;
  tuition_fees_url_exact: string | null;
  tuition_fees_url_overall: string | null;
}

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

export default function CollegeDetails() {
  const { params } = useRoute<DetailsRouteProp>();
  const { college_code } = params;

  const [collegeDetails, setCollegeDetails] = useState<CollegeDetails | null>();
  const [collegeBranches, setCollegeBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  const { getToken } = useAuth();

  useEffect(() => {
    const fetchCollegeDetails = async () => {
      const GET_COLLEGE_DETAILS = `${GET_COLLEGES}/${college_code}`;

      try {
        const token = await getToken();

        const res = await fetch(GET_COLLEGE_DETAILS, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        const data = await res.json();

        if (data.success) {
          setCollegeDetails(data.college);
        } else {
          setCollegeDetails(null);
        }
      } catch (error) {
        console.error("Error fetching college:", error);
        setCollegeDetails(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCollegeDetails();
  }, []);

  useEffect(() => {
    if (!collegeDetails) return;

    const timer = setTimeout(async () => {
      const GET_COLLEGE_DETAILS_BRANCHES = `${GET_COLLEGES}/cutoffs/${college_code}`;
      try {
        const token = await getToken();

        const res = await fetch(GET_COLLEGE_DETAILS_BRANCHES, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        const data = await res.json();
        if (data.success) {
          console.log("branches", data.college.branches);
          setCollegeBranches(data.college.branches || []);
        } else {
          setCollegeBranches([]);
        }
      } catch (error) {
        console.error("Error fetching branches:", error);
        setCollegeBranches([]);
      }
    }, 10000); // 10 seconds delay

    return () => clearTimeout(timer); // cleanup if component unmounts
  }, [collegeDetails]);

  const handleOpenLink = (url: string) => {
    if (url) {
      Linking.openURL(url).catch((err) =>
        console.error("Failed to open URL:", err)
      );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopHeader title="View College" showBackArrow={true} />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <CollegeContentSkeleton />
        ) : (
          <>
            <View style={styles.subRow}>
              <Text style={styles.subText}>{collegeDetails?.college_code}</Text>

              <View style={styles.typeRow}>
                {collegeDetails?.is_autonomous ? (
                  <GovernmentCollegeIcon size={16} />
                ) : (
                  <PrivateCollegeIcon size={16} />
                )}
                <Text style={styles.subText}>
                  {collegeDetails?.is_autonomous
                    ? "Autonomous"
                    : "Non-Autonomous"}
                </Text>
              </View>
            </View>

            {/* College Name + Link */}
            <TouchableOpacity
              onPress={() =>
                handleOpenLink(collegeDetails?.official_website_url || "")
              }
            >
              <Text style={styles.title}>
                <Text>{collegeDetails?.name + " "}</Text>
                <Text>
                  <ExternalLinkIcon size={14} />
                </Text>
              </Text>
            </TouchableOpacity>

            {/* Address */}
            <View style={styles.address}>
              <LocationPinIcon size={18} />
              <Text style={styles.addressText}> {collegeDetails?.address}</Text>
            </View>

            <View>
              <Text style={styles.addressText}> {collegeDetails?.status}</Text>
            </View>

            {/* NAAC + Placement */}
            <View style={styles.subRow}>
              <View style={styles.naacGrade}>
                <Text style={styles.naacGradeText}>🎗️</Text>
                <Text style={styles.naacGradeText}>
                  NAAC: {collegeDetails?.naac_grade}
                </Text>
                <Text style={styles.naacGradeText}>-</Text>
                <Text style={styles.naacGradeText}>
                  {collegeDetails?.naac_score}/4
                </Text>
              </View>

              <TouchableOpacity
                onPress={() =>
                  handleOpenLink(collegeDetails?.placement_url || "")
                }
                style={styles.placementUrl}
              >
                <View style={styles.rowWithIcon}>
                  <Text style={styles.placementUrlText}>View placements</Text>
                  <View style={{ marginLeft: 4 }}>
                    <ExternalLinkIcon size={12} />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </>
        )}

        <View style={styles.separator} />

        {/* Fees Section */}
        <TouchableOpacity
          onPress={() =>
            handleOpenLink(collegeDetails?.tuition_fees_url_exact || "")
          }
        >
          <View style={styles.rowWithIcon}>
            <Text style={styles.sectionTitle}>Fees Structure</Text>
            <View style={{ marginLeft: 4 }}>
              <ExternalLinkIcon size={12} />
            </View>
          </View>
        </TouchableOpacity>

        {loading ? (
          <CollegeFeesSkeleton />
        ) : (
          <CollegeFees fees={collegeDetails?.fees_structure as FeesStructure} />
        )}

        <View style={styles.separator} />

        {/* Branches Section */}
        <Text style={styles.sectionTitle}>Branches & Intake</Text>

        {collegeBranches.length == 0 && (
          <>
            <CollegeDetailsBranchSkeleton />
            <CollegeDetailsBranchSkeleton />
            <CollegeDetailsBranchSkeleton />
          </>
        )}
        {collegeBranches.map((e) => {
          return <CollegeDetailsBranch key={e.choice_code} item={e} />;
        })}

        <View style={styles.separator} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    gap: 12,
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
    color: "#063866",
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
    marginBottom: -8,
  },

  naacGrade: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    borderWidth: 1,
    paddingHorizontal: 8,
    borderColor: "#063866",
    backgroundColor: "#063866",
    padding: 4,
    paddingRight: 12,
    borderRadius: 99,
    flexShrink: 1,
  },
  naacGradeText: {
    fontFamily: "SourceSans3Medium",
    fontSize: 14,
    color: "#fff",
  },

  placementUrl: {
    paddingHorizontal: 12,
    backgroundColor: "#f2f2f2",
    maxWidth: 300,
    padding: 4,
    borderRadius: 10,
  },
  placementUrlText: {
    fontFamily: "SourceSans3Medium",
    fontSize: 14,
    color: "#063866",
  },

  addressText: {
    fontFamily: "SourceSans3Medium",
    fontSize: 16,
    color: "#4d4d4d",
  },

  // Separators
  separator: {
    height: 1,
    backgroundColor: "#063866",
    opacity: 0.15,
    marginVertical: 4,
  },

  // Row with Text + Icon
  rowWithIcon: {
    flexDirection: "row",
    alignItems: "center",
  },
});
