import GovernmentCollegeIcon from "@/assets/icons/GovernmentCollegeIcon";
import PrivateCollegeIcon from "@/assets/icons/PrivateCollegeIcon";
import TopHeader from "@/components/TopHeader";
import { GET_COLLEGES } from "@/constants/config";
import { useAuth } from "@/context/AuthContext";
import CollegeBranches from "@/features/colleges/CollegeBranches";
import CollegeFees from "@/features/colleges/CollegeFees";
import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type RootStackParamList = {
  CollegeDetails: {
    college_code: string;
  };
};
type DetailsRouteProp = RouteProp<RootStackParamList, "CollegeDetails">;

// ✅ Constant with IIT Bombay details
const IITB_DETAILS = {
  officialWebsite: "https://www.iitb.ac.in",
  address:
    "Indian Institute of Technology Bombay, Powai, Mumbai, Maharashtra, 400076",
  placementsUrl: "https://www.iitb.ac.in/en/campus-life/placement",
  feesUrl: "https://www.iitb.ac.in/newacadhome/FeeStructure.jsp",
  branches: [
    { name: "Computer Science and Engineering", intake: 110 },
    { name: "Electrical Engineering", intake: 120 },
    { name: "Mechanical Engineering", intake: 110 },
    { name: "Civil Engineering", intake: 90 },
    { name: "Chemical Engineering", intake: 100 },
    { name: "Aerospace Engineering", intake: 90 },
    { name: "Metallurgical Engineering & Materials Science", intake: 85 },
    { name: "Engineering Physics", intake: 80 },
  ],
  fees: [
    {
      category: "B.Tech (General/OBC)",
      amount: "₹2,28,000 per year (approx.)",
    },
    { category: "SC/ST/PwD", amount: "Exempted (only hostel & mess charges)" },
    { category: "Hostel Charges", amount: "₹25,000 – ₹30,000 per semester" },
  ],
  placements: {
    avgPackage: "₹20–25 LPA",
    highestPackage: "₹2+ Cr (International offers)",
    topRecruiters: [
      "Google",
      "Microsoft",
      "Apple",
      "Amazon",
      "Goldman Sachs",
      "McKinsey",
    ],
  },
};

const openUrl = async (url?: string) => {
  if (!url) return;
  try {
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) await Linking.openURL(url);
  } catch {}
};

const openMaps = async (query: string) => {
  const q = encodeURIComponent(query);
  const url = Platform.select({
    ios: `http://maps.apple.com/?q=${q}`,
    android: `geo:0,0?q=${q}`,
    default: `https://www.google.com/maps/search/?api=1&query=${q}`,
  });
  if (url) {
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) await Linking.openURL(url);
    } catch {}
  }
};

const categories = ["Open", "OBC", "SC/ST", "VJNT", "TFWS", "EWS"];
const fees = {
  open: {
    tution_fees: "21000",
    development_fees: "34000",
    other_fees: "2100",
    total: "120000",
  },
  obc: {
    tution_fees: "21000",
    development_fees: "34000",
    other_fees: "2100",
    total: "120000",
  },
  sc_st: {
    tution_fees: "21000",
    development_fees: "34000",
    other_fees: "2100",
    total: "120000",
  },
  vjnt: {
    tution_fees: "21000",
    development_fees: "34000",
    other_fees: "2100",
    total: "120000",
  },
  ews: {
    tution_fees: "21000",
    development_fees: "34000",
    other_fees: "2100",
    total: "120000",
  },
  tfws: {
    tution_fees: "21000",
    development_fees: "34000",
    other_fees: "2100",
    total: "120000",
  },
};

interface CollegeDetails {
  college_code: string;
  name: string;
  district: string;
  is_government: boolean;
  is_autonomous: boolean;
  status: string;
  address: string | null;
  fees_structure: string | null;
  naac_grade: string | null;
  naac_score: number | null;
  official_website_url: string | null;
  placement_url: string | null;
  total_intake: number | null;
  tuition_fees_json: Record<string, any> | null; // can refine if you know structure
  tuition_fees_url_exact: string | null;
  tuition_fees_url_overall: string | null;
}

export default function CollegeDetails() {
  const { params } = useRoute<DetailsRouteProp>();
  const { college_code } = params;

  const [collegeDetails, setCollegeDetails] = useState<CollegeDetails | null>();
  const [loading, setLoading] = useState(true);

  const { getToken } = useAuth();

  useEffect(() => {
    const fetchCollegeDetails = async () => {
      const GET_COLLEGE_DETAILS = `${GET_COLLEGES}/${college_code}`;

      try {
        const token = await getToken();
        console.log(token);

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
          console.log("data", data.college);
        } else {
          setCollegeDetails(null);
        }
      } catch (error) {
        console.error("Error fetching news:", error);
        setCollegeDetails(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCollegeDetails();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopHeader title="View College" showBackArrow={true} />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.subRow}>
          <Text style={styles.subText}>{collegeDetails?.college_code}</Text>
          <Text style={styles.subText}>
            {collegeDetails?.is_government ? "Government" : "Private"}
          </Text>
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

        <Text style={styles.title} numberOfLines={2}>
          {collegeDetails?.name}
        </Text>

        <View style={styles.separator} />

        {/* Official */}
        <Text style={styles.sectionTitle}>Fees Structure</Text>

        <CollegeFees fees={fees} />

        <View style={styles.separator} />

        <Text style={styles.sectionTitle}>Branches & Intake</Text>

        <CollegeBranches />

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
    justifyContent: "space-around",
    width: 100,
    gap: 4,
  },
  subText: {
    fontSize: 14,
    color: "#063866",
    fontFamily: "BreeSerif",
    textAlign: "center",
  },

  // Typography
  title: {
    fontFamily: "BreeSerif",
    fontSize: 18,
    color: "#000",
  },
  sectionTitle: {
    fontFamily: "BreeSerif",
    fontSize: 16,
    color: "#000",
  },
  bodyText: {
    fontFamily: "BreeSerif",
    fontSize: 16,
    color: "#000",
  },
  metaText: {
    fontFamily: "BreeSerif",
    color: "#666",
    fontSize: 14,
  },

  tab: {
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: "#f0f0f0",
    overflow: "hidden", // keeps inner bar clipped
  },
  activeTab: {
    backgroundColor: "#063866",
  },
  tabInner: {
    paddingVertical: 4,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  tabText: {
    fontSize: 14,
    color: "#333",
    fontFamily: "BreeSerif",
  },
  activeText: {
    color: "#fff",
    fontWeight: "600",
  },

  fees_container: {
    marginTop: 6,
  },
  fees_row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  fees_label: {
    fontSize: 14,
    color: "#787878ff",
    fontFamily: "BreeSerif",
  },
  fees_value: {
    fontSize: 16,
    color: "#000",
    fontFamily: "BreeSerif",
  },
  fees_plus: {
    fontSize: 14,
    color: "#787878ff",
    fontFamily: "BreeSerif",
  },
  fees_total: {
    fontSize: 18,
    color: "#063866",
    fontFamily: "BreeSerif",
    marginTop: 10,
  },

  card3D: {
    width: "100%",
    backgroundColor: "#f0f4fb",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#d6e0f5",
  },

  collegeName: {
    marginTop: 2,
    fontSize: 16,
    color: "#000",
    fontWeight: "600",
    fontFamily: "BreeSerif",
  },

  cutoffWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 12,
  },
  cutoffBox: {
    backgroundColor: "#d6e0f5",
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
    fontFamily: "BreeSerif",
  },
  cutoffValue: {
    fontSize: 12,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 2,
    fontFamily: "BreeSerif",
  },

  // Header meta
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#063866",
    backgroundColor: "#fff",
  },
  badgeText: {
    fontFamily: "BreeSerif",
    fontSize: 12,
    color: "#063866",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#063866",
    opacity: 0.4,
  },

  // Actions
  actionsRow: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
  },
  primaryBtn: {
    backgroundColor: "#063866",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  primaryBtnText: {
    fontFamily: "BreeSerif",
    color: "#fff",
    fontSize: 16,
  },
  linkBtn: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  linkBtnText: {
    fontFamily: "BreeSerif",
    color: "#063866",
    fontSize: 16,
    textDecorationLine: "underline",
  },
  btnPressed: {
    opacity: 0.9,
    transform: [{ translateY: Platform.OS === "ios" ? 1 : 0 }],
  },
  linkBtnPressed: {
    opacity: 0.85,
  },

  // Links
  inlineLinkRow: {
    marginTop: 6,
  },
  linkLabel: {
    fontFamily: "BreeSerif",
    color: "#063866",
    fontSize: 14,
    marginBottom: 2,
  },
  linkText: {
    fontFamily: "BreeSerif",
    color: "#063866",
    fontSize: 16,
    textDecorationLine: "underline",
  },

  // Separators
  separator: {
    height: 1,
    backgroundColor: "#063866",
    opacity: 0.15,
    marginVertical: 4,
  },
});
