import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { Dropdown } from "react-native-element-dropdown";
import { Ionicons } from "@expo/vector-icons";
import { College } from "./NormalFindCollege";
import { colors } from "@/constants/theme";
import { COMPARE_COLLEGES } from "@/constants/config";
import { fetchWithRetry } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";

interface CompareCollegesProps {
  colleges: College[];
  isAllowed: boolean;
}

interface CompareCollegeData {
  college_code: string;
  name: string;
  is_autonomous: boolean;
  is_government: boolean;
  status: string;
  district: string;
  university_name?: string | null;
  official_website_url: string;
  naac_grade: string | null;
  naac_score: string | null;
  address: string;
  total_intake: number;
  prep_score: number;
  avg_package: string | null;
  highest_package: string | null;
  placement_percentage: string | null;
  fees_structure: {
    open?: { total: number } | null;
    sc_st?: { total: number } | null;
    obc_ews?: { total: number } | null;
    jk_pmsss?: { total: number } | null;
    vjnt_sbc_tfws?: { total: number } | null;
  } | null;
  branch_and_intake: Record<string, number>;
}

export default function CompareColleges({
  colleges,
  isAllowed,
}: CompareCollegesProps) {
  const router = useRouter();
  const [college1, setCollege1] = useState<string>("");
  const [college2, setCollege2] = useState<string>("");
  const [compareResult, setCompareResult] = useState<
    CompareCollegeData[] | null
  >(null);

  const data = colleges
    .map((c) => ({
      label: c.name,
      value: c.college_code,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const { getToken } = useAuth();

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(true);

  const handleCompare = async () => {
    if (!college1 || !college2) {
      alert("Please select two colleges to compare.");
      return;
    }
    if (college1 === college2) {
      alert("Please select different colleges.");
      return;
    }

    try {
      setLoading(true);
      const token = await getToken();

      const url = `${COMPARE_COLLEGES}?clg_code1=${college1}&clg_code2=${college2}`;

      const response = await fetchWithRetry(
        url,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        },
        3,
        1000
      );

      const data = await response.json();
      if (data.success && data.colleges && data.colleges.length === 2) {
        setCompareResult(data.colleges);
        setIsEditing(false);
      } else {
        alert("Failed to get comparison data.");
      }
    } catch (error) {
      console.error("Error comparing colleges:", error);
      alert("Failed to compare colleges. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      {isEditing ? (
        <View style={styles.card}>
          <View style={styles.inputWrapper}>
            <Text style={styles.formTitle}>Select colleges</Text>
            <Dropdown
              style={styles.dropdown}
              data={data}
              search
              searchPlaceholder="Search College..."
              labelField="label"
              valueField="value"
              placeholder="Select College 1"
              value={college1}
              onChange={(item) => setCollege1(item.value)}
              placeholderStyle={styles.dropdownText}
              selectedTextStyle={styles.dropdownText}
              itemTextStyle={styles.dropdownText}
              inputSearchStyle={styles.dropdownText}
              containerStyle={styles.dropdownContainerStyle}
            />
          </View>

          <View style={styles.vsContainer}>
            <Text style={styles.vsText}>vs</Text>
          </View>

          <View style={styles.inputWrapper}>
            <Dropdown
              style={styles.dropdown}
              data={data}
              search
              searchPlaceholder="Search College..."
              labelField="label"
              valueField="value"
              placeholder="Select College 2"
              value={college2}
              onChange={(item) => setCollege2(item.value)}
              placeholderStyle={styles.dropdownText}
              selectedTextStyle={styles.dropdownText}
              itemTextStyle={styles.dropdownText}
              inputSearchStyle={styles.dropdownText}
              containerStyle={styles.dropdownContainerStyle}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.submitButton,
              (loading || !isAllowed) && { opacity: 0.7 },
            ]}
            onPress={handleCompare}
            activeOpacity={0.8}
            disabled={loading || !isAllowed}
          >
            <Text style={styles.submitButtonText}>
              {loading ? "Comparing..." : "Compare"}
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {compareResult && compareResult.length === 2 && (
        <View style={styles.resultContainer}>
          <View style={styles.tableCard}>
            <View style={styles.tableTitleRow}>
              <Text style={styles.tableTitle}>Comparison Result</Text>
              {!isEditing && (
                <TouchableOpacity
                  style={styles.editChip}
                  onPress={() => setIsEditing(true)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="pencil-outline" size={13} color="#004aad" />
                  <Text style={styles.editChipText}>Edit</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* HEADER */}
            <View style={styles.tableHeaderRow}>
              <View style={styles.featureCol}></View>
              <View style={styles.collegeCol}>
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "../college-details",
                      params: {
                        college_code: compareResult[0].college_code,
                        collegeIndex: "0",
                      },
                    })
                  }
                >
                  <Text
                    style={[
                      styles.headerText,
                      { textDecorationLine: "underline" },
                    ]}
                  >
                    {compareResult[0].name}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.collegeCol}>
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "../college-details",
                      params: {
                        college_code: compareResult[1].college_code,
                        collegeIndex: "1",
                      },
                    })
                  }
                >
                  <Text
                    style={[
                      styles.headerText,
                      { textDecorationLine: "underline" },
                    ]}
                  >
                    {compareResult[1].name}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* BASIC INFO */}
            <TableRow
              label="Type"
              val1={compareResult[0].is_government ? "Government" : "Private"}
              val2={compareResult[1].is_government ? "Government" : "Private"}
              isType
            />
            <TableRow
              label="Status"
              val1={compareResult[0].status}
              val2={compareResult[1].status}
              isStatus
            />
            <TableRow
              label="District"
              val1={compareResult[0].district}
              val2={compareResult[1].district}
              isDistrict
            />
            <TableRow
              label="University"
              val1={compareResult[0].university_name}
              val2={compareResult[1].university_name}
            />
            <TableRow
              label="Address"
              val1={compareResult[0].address}
              val2={compareResult[1].address}
              isAddress
            />

            <TableRow
              label="Website"
              val1={compareResult[0].official_website_url || "N/A"}
              val2={compareResult[1].official_website_url || "N/A"}
              isWebsite
            />

            {/* NAAC */}
            <TableRow
              label="NAAC Grade"
              val1={compareResult[0].naac_grade || "N/A"}
              val2={compareResult[1].naac_grade || "N/A"}
            />
            <TableRow
              label="NAAC Score"
              val1={compareResult[0].naac_score || "N/A"}
              val2={compareResult[1].naac_score || "N/A"}
            />

            {/* INTAKE */}
            <TableRow
              label="Total Intake"
              val1={compareResult[0].total_intake?.toString()}
              val2={compareResult[1].total_intake?.toString()}
            />

            {/* BRANCHES */}
            <TableRow
              label="Branches & Intake"
              val1={compareResult[0].branch_and_intake}
              val2={compareResult[1].branch_and_intake}
              isBranches
            />

            {/* PLACEMENTS */}
            <TableRow
              label="Avg Package"
              val1={compareResult[0].avg_package || "N/A"}
              val2={compareResult[1].avg_package || "N/A"}
            />
            <TableRow
              label="Highest Package"
              val1={compareResult[0].highest_package || "N/A"}
              val2={compareResult[1].highest_package || "N/A"}
            />
            <TableRow
              label="Placement %"
              val1={compareResult[0].placement_percentage || "N/A"}
              val2={compareResult[1].placement_percentage || "N/A"}
            />

            {/* FEES */}
            <TableRow
              label="Fees (Open)"
              val1={
                compareResult[0].fees_structure?.open?.total
                  ? `₹${compareResult[0].fees_structure.open.total.toLocaleString()}`
                  : "N/A"
              }
              val2={
                compareResult[1].fees_structure?.open?.total
                  ? `₹${compareResult[1].fees_structure.open.total.toLocaleString()}`
                  : "N/A"
              }
            />

            <TableRow
              label="Fees (OBC/EWS)"
              val1={
                compareResult[0].fees_structure?.obc_ews?.total
                  ? `₹${compareResult[0].fees_structure.obc_ews.total.toLocaleString()}`
                  : "N/A"
              }
              val2={
                compareResult[1].fees_structure?.obc_ews?.total
                  ? `₹${compareResult[1].fees_structure.obc_ews.total.toLocaleString()}`
                  : "N/A"
              }
            />

            <TableRow
              label="Fees (SC/ST)"
              val1={
                compareResult[0].fees_structure?.sc_st?.total
                  ? `₹${compareResult[0].fees_structure.sc_st.total.toLocaleString()}`
                  : "N/A"
              }
              val2={
                compareResult[1].fees_structure?.sc_st?.total
                  ? `₹${compareResult[1].fees_structure.sc_st.total.toLocaleString()}`
                  : "N/A"
              }
            />

            <TableRow
              label="Fees (TFWS/VJNT)"
              val1={
                compareResult[0].fees_structure?.vjnt_sbc_tfws?.total
                  ? `₹${compareResult[0].fees_structure.vjnt_sbc_tfws.total.toLocaleString()}`
                  : "N/A"
              }
              val2={
                compareResult[1].fees_structure?.vjnt_sbc_tfws?.total
                  ? `₹${compareResult[1].fees_structure.vjnt_sbc_tfws.total.toLocaleString()}`
                  : "N/A"
              }
            />

            <TableRow
              label="Fees (JK PMSSS)"
              val1={
                compareResult[0].fees_structure?.jk_pmsss?.total
                  ? `₹${compareResult[0].fees_structure.jk_pmsss.total.toLocaleString()}`
                  : "N/A"
              }
              val2={
                compareResult[1].fees_structure?.jk_pmsss?.total
                  ? `₹${compareResult[1].fees_structure.jk_pmsss.total.toLocaleString()}`
                  : "N/A"
              }
            />

            {/* PREP SCORE COMPARISON */}
            {(compareResult[0].prep_score != null ||
              compareResult[1].prep_score != null) && (
              <View style={[styles.tableRow, styles.noBorder]}>
                <View style={styles.featureCol} />
                <View style={styles.collegeCol}>
                  {compareResult[0].prep_score != null &&
                  compareResult[1].prep_score != null ? (
                    compareResult[0].prep_score >
                    compareResult[1].prep_score ? (
                      <View style={styles.scoreArrowWrap}>
                        <Ionicons name="arrow-up" size={16} color="#16a34a" />
                        <Text style={styles.scoreArrowTextGreen}>
                          {compareResult[0].prep_score}
                        </Text>
                      </View>
                    ) : compareResult[0].prep_score <
                      compareResult[1].prep_score ? (
                      <View style={styles.scoreArrowWrap}>
                        <Ionicons name="arrow-down" size={16} color="#dc2626" />
                        <Text style={styles.scoreArrowTextRed}>
                          {compareResult[0].prep_score}
                        </Text>
                      </View>
                    ) : (
                      <Text style={styles.rowValueText}>
                        {compareResult[0].prep_score}
                      </Text>
                    )
                  ) : (
                    <Text style={styles.rowValueText}>
                      {compareResult[0].prep_score ?? "N/A"}
                    </Text>
                  )}
                </View>
                <View style={styles.collegeCol}>
                  {compareResult[0].prep_score != null &&
                  compareResult[1].prep_score != null ? (
                    compareResult[1].prep_score >
                    compareResult[0].prep_score ? (
                      <View style={styles.scoreArrowWrap}>
                        <Ionicons name="arrow-up" size={16} color="#16a34a" />
                        <Text style={styles.scoreArrowTextGreen}>
                          {compareResult[1].prep_score}
                        </Text>
                      </View>
                    ) : compareResult[1].prep_score <
                      compareResult[0].prep_score ? (
                      <View style={styles.scoreArrowWrap}>
                        <Ionicons name="arrow-down" size={16} color="#dc2626" />
                        <Text style={styles.scoreArrowTextRed}>
                          {compareResult[1].prep_score}
                        </Text>
                      </View>
                    ) : (
                      <Text style={styles.rowValueText}>
                        {compareResult[1].prep_score}
                      </Text>
                    )
                  ) : (
                    <Text style={styles.rowValueText}>
                      {compareResult[1].prep_score ?? "N/A"}
                    </Text>
                  )}
                </View>
              </View>
            )}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const TableRow = ({
  label,
  val1,
  val2,
  isLast = false,
  isType = false,
  isStatus = false,
  isBranches = false,
  isDistrict = false,
  isAddress = false,
  isWebsite = false,
}: {
  label: string;
  val1: any;
  val2: any;
  isLast?: boolean;
  isType?: boolean;
  isStatus?: boolean;
  isBranches?: boolean;
  isDistrict?: boolean;
  isAddress?: boolean;
  isWebsite?: boolean;
}) => {
  const isEmpty = (val: any) =>
    !val ||
    val === "N/A" ||
    (typeof val === "object" && Object.keys(val).length === 0);
  if (isEmpty(val1) && isEmpty(val2)) return null;

  const renderValue = (val: any) => {
    if (!val || val === "N/A")
      return <Text style={styles.rowValueText}>N/A</Text>;

    if (isBranches) {
      const branches = Object.entries(val as Record<string, number>);
      return (
        <View style={styles.branchChipsContainer}>
          {branches.map(([name, intake], idx) => (
            <View key={idx} style={styles.branchChip}>
              <Text style={styles.branchChipText}>{`${name} — ${intake}`}</Text>
            </View>
          ))}
        </View>
      );
    }

    if (isType) {
      return (
        <View style={styles.greenTag}>
          <Text style={styles.greenTagText}>{val}</Text>
        </View>
      );
    }

    if (isStatus) {
      return <Text style={styles.statusText}>{val}</Text>;
    }

    if (isDistrict) {
      const capitalized = val
        .split(" ")
        .map(
          (w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
        )
        .join(" ");
      return <Text style={styles.rowValueText}>{capitalized}</Text>;
    }

    if (isAddress) {
      return <Text style={styles.rowValueTextLeft}>{val}</Text>;
    }

    if (isWebsite) {
      return (
        <TouchableOpacity
          onPress={() =>
            Linking.openURL(val.startsWith("http") ? val : `https://${val}`)
          }
        >
          <Text style={styles.visitText}>Visit ↗</Text>
        </TouchableOpacity>
      );
    }

    return <Text style={styles.rowValueText}>{val}</Text>;
  };

  return (
    <View
      style={[
        styles.tableRow,
        isLast && styles.noBorder,
        isBranches && { alignItems: "flex-start" },
      ]}
    >
      <View style={styles.featureCol}>
        <Text style={styles.rowLabelText}>{label}</Text>
      </View>
      <View
        style={[
          styles.collegeCol,
          (isAddress || isBranches) && styles.collegeColTop,
        ]}
      >
        {renderValue(val1)}
      </View>
      <View
        style={[
          styles.collegeCol,
          (isAddress || isBranches) && styles.collegeColTop,
        ]}
      >
        {renderValue(val2)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingVertical: 12,
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontFamily: "SourceSans3SemiBold",
    color: colors.primary,
    marginBottom: 20,
    textAlign: "center",
  },
  inputWrapper: {
    marginBottom: 8,
    width: "100%",
  },
  formTitle: {
    fontSize: 18,
    fontFamily: "SourceSans3SemiBold",
    color: colors.primary,
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontFamily: "SourceSans3SemiBold",
    fontSize: 14,
    color: "#333",
  },
  dropdown: {
    height: 55,
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d6e0f5",
  },
  dropdownText: {
    fontSize: 15,
    fontFamily: "SourceSans3Medium",
    color: "#333",
  },
  dropdownContainerStyle: {
    borderRadius: 12,
    marginTop: 4,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#d6e0f5",
  },
  vsContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    zIndex: 1,
  },
  vsText: {
    fontSize: 18,
    fontFamily: "SourceSans3Medium",
    color: colors.primary,
  },
  submitButton: {
    backgroundColor: "#ff7a22",
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 999,
    marginTop: 20,
    alignSelf: "flex-end",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "SourceSans3SemiBold",
  },
  resultContainer: {
    marginTop: 16,
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
  },
  tableCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    overflow: "hidden",
  },
  tableTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f8faff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  tableTitle: {
    fontSize: 16,
    fontFamily: "SourceSans3SemiBold",
    color: colors.primary,
  },
  tableHeaderRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    backgroundColor: "#fff",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    alignItems: "center",
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  featureCol: {
    flex: 0.7,
    padding: 10,
    backgroundColor: "#fcfdfe",
    borderRightWidth: 1,
    borderRightColor: "#e2e8f0",
    justifyContent: "center",
  },
  collegeCol: {
    flex: 1.5,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 1,
    borderRightColor: "#e2e8f0",
  },
  headerText: {
    fontFamily: "SourceSans3SemiBold",
    color: colors.primary,
    fontSize: 13,
    textAlign: "center",
  },
  rowLabelText: {
    fontFamily: "SourceSans3SemiBold",
    color: "#475569",
    fontSize: 12,
  },
  rowValueText: {
    fontFamily: "SourceSans3Medium",
    color: "#334155",
    fontSize: 13,
    textAlign: "center",
  },
  greenTag: {
    backgroundColor: "#f0f7d4",
    borderWidth: 1,
    borderColor: "#b6cf4f",
    borderRadius: 99,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  greenTagText: {
    fontSize: 10,
    color: "#8b9e3dff",
    fontFamily: "SourceSans3Medium",
    textAlign: "center",
  },
  statusText: {
    fontSize: 12,
    color: "#004aad",
    fontFamily: "SourceSans3SemiBold",
    textAlign: "center",
  },
  rowValueTextLeft: {
    fontFamily: "SourceSans3Medium",
    color: "#334155",
    fontSize: 13,
    textAlign: "left",
  },
  visitText: {
    fontSize: 12,
    color: "#004aad",
    fontFamily: "SourceSans3SemiBold",
    textDecorationLine: "underline",
    textAlign: "center",
  },
  collegeColTop: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  editChip: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    gap: 6,
    backgroundColor: "#e6effa",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
  },
  editChipText: {
    fontSize: 13,
    color: "#004aad",
    fontFamily: "SourceSans3SemiBold",
  },
  branchChipsContainer: {
    flexDirection: "column",
    gap: 4,
    alignItems: "flex-start",
    width: "100%",
    paddingVertical: 4,
  },
  branchChip: {
    backgroundColor: "#f2f2f2",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  branchChipText: {
    fontSize: 10,
    color: "#475569",
    fontFamily: "SourceSans3Medium",
  },
  scoreArrowWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  scoreArrowTextGreen: {
    fontSize: 13,
    fontFamily: "SourceSans3SemiBold",
    color: "#16a34a",
  },
  scoreArrowTextRed: {
    fontSize: 13,
    fontFamily: "SourceSans3SemiBold",
    color: "#dc2626",
  },
});
