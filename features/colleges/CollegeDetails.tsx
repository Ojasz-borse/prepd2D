
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
import { apiFetch } from "@/services/api";
import CollegeFees from "@/features/colleges/CollegeFees";
import { usePreventScreenCapture } from "@/hooks/usePreventScreenCapture";
import { RouteProp, useRoute } from "@react-navigation/native";
import * as ScreenCapture from "expo-screen-capture";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { useSubscriptionLock } from "@/hooks/useSubcribtion";
import SubscriptionLockSheet from "@/components/ShowLockScreen";
import { useLocalSearchParams, useRouter } from "expo-router";

type RootStackParamList = {
  CollegeDetails: {
    college_code: string;
    collegeIndex?: string;
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
  const router = useRouter();
  const { college_code, collegeIndex } = useLocalSearchParams<{
    college_code: string;
    collegeIndex?: string;
  }>();

  const [collegeDetails, setCollegeDetails] = useState<CollegeDetails | null>();
  const [collegeBranches, setCollegeBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  const { getToken } = useAuth();

  const { isAllowed } = useSubscriptionLock({
    gate: "after",
  });
  const [showLock, setShowLock] = useState(false);

  const index = collegeIndex ? parseInt(collegeIndex) : 0;

  useEffect(() => {
    if (!isAllowed && college_code !== "03012") {
      setShowLock(true);
    } else {
      setShowLock(false);
    }
  }, [isAllowed, index]);

  useEffect(() => {
    const fetchCollegeDetails = async () => {
      const GET_COLLEGE_DETAILS = `${GET_COLLEGES}/${college_code}`;

      try {
        const token = await getToken();

        const res = await apiFetch(GET_COLLEGE_DETAILS, {
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

        const res = await apiFetch(GET_COLLEGE_DETAILS_BRANCHES, {
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
    }, 100); // 2 seconds delay

    return () => clearTimeout(timer); // cleanup if component unmounts
  }, [collegeDetails]);

  usePreventScreenCapture();


  const handleOpenLink = (url: string) => {
    if (url) {
      Linking.openURL(url).catch((err) =>
        console.error("Failed to open URL:", err)
      );
    }
  };

  return (
    <LinearGradient
      colors={["#f8fafc", "#e6f1ff", "#ffffff"]}
      locations={[0, 0.5, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <TopHeader title="View College" showBackArrow={true} />

        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.whiteBox}>
            {loading ? (
              <CollegeContentSkeleton />
            ) : (
              <>
                <View style={styles.metaRow}>
                  <View style={styles.greenTag}>
                    <Text style={styles.greenTagText}>{collegeDetails?.college_code}</Text>
                  </View>

                  {collegeDetails?.status && (
                    <View style={[styles.greenTag, styles.statusAbsolute]}>
                      <Text style={styles.greenTagText}>{collegeDetails?.status}</Text>
                    </View>
                  )}
                </View>

                {/* College Name + Icon Section */}
                <View style={styles.nameSection}>
                  <View style={styles.iconCircle}>
                    <Ionicons name="school" size={20} color="#fff" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.title}>
                      {collegeDetails?.name}
                    </Text>
                  </View>
                </View>

                {/* Address */}
                {collegeDetails?.address && (
                  <View style={styles.address}>
                    <LocationPinIcon size={18} />
                    <Text style={styles.addressText}>
                      {" "}
                      {collegeDetails?.address}
                    </Text>
                  </View>
                )}

                {/* NAAC Row */}
                <View style={styles.subRow}>
                  {collegeDetails?.naac_grade && collegeDetails?.naac_score ? (
                    <View style={styles.naacGrade}>
                      <Text style={styles.naacGradeText}>
                        NAAC: {collegeDetails?.naac_grade}
                      </Text>
                      <Text style={styles.naacGradeText}>🔹</Text>
                      <Text style={styles.naacGradeText}>
                        {collegeDetails?.naac_score}/4
                      </Text>
                    </View>
                  ) : (
                    <View></View>
                  )}
                </View>

                {/* Action Buttons */}
                <View style={{ gap: 8, marginTop: 0 }}>


                  <View style={[styles.actionButtonsRow, { marginTop: 8 }]}>
                    {collegeDetails?.official_website_url && (
                      <TouchableOpacity
                        onPress={() =>
                          handleOpenLink(collegeDetails?.official_website_url || "")
                        }
                        style={styles.viewButtonLike}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.viewButtonTextLike}>Website</Text>

                      </TouchableOpacity>
                    )}
                    {collegeDetails?.placement_url && (
                      <TouchableOpacity
                        onPress={() =>
                          handleOpenLink(collegeDetails?.placement_url || "")
                        }
                        style={styles.viewButtonLike}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.viewButtonTextLike}>Placements</Text>

                      </TouchableOpacity>
                    )}

                    {collegeDetails?.tuition_fees_url_exact && (
                      <TouchableOpacity
                        onPress={() =>
                          handleOpenLink(collegeDetails?.tuition_fees_url_exact || "")
                        }
                        style={styles.viewButtonLike}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.viewButtonTextLike}>Fees</Text>

                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </>
            )}

            <View style={styles.separator} />

            {/* Fees Section */}
            <Text style={styles.sectionTitle}>Fees Structure</Text>

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
              return <CollegeDetailsBranch item={e} />;
            })}

            <View style={styles.separator} />
          </View>
        </ScrollView>

        {showLock && (
          <SubscriptionLockSheet
            visible={showLock}
            planType="after"
          // onClose={() => {
          //   setShowLock(false);
          //   if (index > 0) {
          //     router.back();
          //   }
          // }}
          />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    // backgroundColor: "#fff",
    gap: 12,
  },
  whiteBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    position: "relative",
  },

  subRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
    flexWrap: "wrap",
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
  statusAbsolute: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  statusPill: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#004aad",
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 99,
  },
  statusPillText: {
    fontSize: 12,
    color: "#004aad",
    fontFamily: "SourceSans3Medium",
  },
  typeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
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
    fontFamily: "SourceSans3SemiBold",
    color: "#004aad",
    flexWrap: "wrap",
    lineHeight: 26,
    fontSize: 18,
  },

  nameSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginVertical: 4,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: "#ff7a22",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#ff7a22",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 2,
  },

  sectionTitle: {
    fontSize: 16,
    fontFamily: "SourceSans3SemiBold",
    color: "#004aad",
  },

  address: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 2,
    marginBottom: -8,
    paddingVertical: 8,
  },

  naacGrade: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    borderWidth: 1,
    paddingHorizontal: 8,
    borderColor: "#004aad",
    color: "#004aad",
    // backgroundColor: "#004aad",
    padding: 4,
    paddingRight: 12,
    borderRadius: 99,
    flexShrink: 1,
  },
  naacGradeText: {
    fontFamily: "SourceSans3Medium",
    fontSize: 14,
    color: "#004aad",
  },

  placementUrlText: {
    fontFamily: "SourceSans3Medium",
    fontSize: 14,
    color: "#004aad",
  },

  actionButtonsRow: {
    flexDirection: "row",
    gap: 12,
  },
  placementButton: {
    backgroundColor: "#ff7a22",
    borderRadius: 12,
    marginTop: 8,
    overflow: "hidden",
  },
  placementButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 8,
  },
  placementButtonText: {
    fontFamily: "SourceSans3SemiBold",
    fontSize: 14,
    color: "#fff",
  },
  viewButtonLike: {
    backgroundColor: "#ff7a22",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 4,
  },
  viewButtonTextLike: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "SourceSans3SemiBold",
  },

  addressText: {
    fontFamily: "SourceSans3Medium",
    fontSize: 16,
    color: "#4d4d4d",
  },

  // Separators
  separator: {
    height: 1,
    backgroundColor: "#004aad",
    opacity: 0.15,
    marginVertical: 10,
    marginBottom: 20,
  },

  // Row with Text + Icon
  rowWithIcon: {
    flexDirection: "row",
    alignItems: "center",
  },
});
