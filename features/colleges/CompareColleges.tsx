import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Dropdown } from "react-native-element-dropdown";
import { Ionicons } from "@expo/vector-icons";
import { College } from "./NormalFindCollege";
import { colors } from "@/constants/theme";
import { COMPARE_COLLEGES } from "@/constants/config";
import { fetchWithRetry } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

interface CompareCollegesProps {
    colleges: College[];
}

interface CompareCollegeData {
    college_code: string;
    name: string;
    is_autonomous: boolean;
    is_government: boolean;
    status: string;
    district: string;
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

export default function CompareColleges({ colleges }: CompareCollegesProps) {
    const [college1, setCollege1] = useState<string>("");
    const [college2, setCollege2] = useState<string>("");
    const [compareResult, setCompareResult] = useState<CompareCollegeData[] | null>(null);

    const data = colleges.map(c => ({
        label: c.name,
        value: c.college_code
    })).sort((a, b) => a.label.localeCompare(b.label));

    const { getToken } = useAuth();

    const [loading, setLoading] = useState(false);

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
                        "Authorization": token ? `Bearer ${token}` : "",
                    }
                },
                3,
                1000
            );

            const data = await response.json();
            if (data.success && data.colleges && data.colleges.length === 2) {
                setCompareResult(data.colleges);
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
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
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
                        onChange={item => setCollege1(item.value)}
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
                        onChange={item => setCollege2(item.value)}
                        placeholderStyle={styles.dropdownText}
                        selectedTextStyle={styles.dropdownText}
                        itemTextStyle={styles.dropdownText}
                        inputSearchStyle={styles.dropdownText}
                        containerStyle={styles.dropdownContainerStyle}
                    />
                </View>

                <TouchableOpacity
                    style={[styles.submitButton, loading && { opacity: 0.7 }]}
                    onPress={handleCompare}
                    activeOpacity={0.8}
                    disabled={loading}
                >
                    <Text style={styles.submitButtonText}>Compare</Text>
                </TouchableOpacity>
            </View>

            {compareResult && compareResult.length === 2 && (
                <View style={styles.resultContainer}>
                    <View style={styles.tableCard}>
                        <Text style={styles.tableTitle}>Comparison Result</Text>

                        <View style={styles.tableHeaderRow}>
                            <View style={styles.featureCol}></View>
                            <View style={styles.collegeCol}>
                                <Text style={styles.headerText}>{compareResult[0].name}</Text>
                            </View>
                            <View style={styles.collegeCol}>
                                <Text style={styles.headerText}>{compareResult[1].name}</Text>
                            </View>
                        </View>

                        <TableRow label="Type" val1={compareResult[0].is_government ? "Government" : "Private"} val2={compareResult[1].is_government ? "Government" : "Private"} isType />
                        <TableRow label="Status" val1={compareResult[0].status} val2={compareResult[1].status} isStatus />
                        <TableRow label="NAAC Grade" val1={compareResult[0].naac_grade || "N/A"} val2={compareResult[1].naac_grade || "N/A"} />
                        <TableRow label="Prep Score" val1={compareResult[0].prep_score?.toString() || "N/A"} val2={compareResult[1].prep_score?.toString() || "N/A"} />
                        <TableRow label="Branches" val1={compareResult[0].branch_and_intake} val2={compareResult[1].branch_and_intake} isBranches />
                        <TableRow label="Fees (Open)" val1={compareResult[0].fees_structure?.open?.total ? `₹${compareResult[0].fees_structure.open.total.toLocaleString()}` : "N/A"} val2={compareResult[1].fees_structure?.open?.total ? `₹${compareResult[1].fees_structure.open.total.toLocaleString()}` : "N/A"} />
                        <TableRow label="Fees (OBC/EWS)" val1={compareResult[0].fees_structure?.obc_ews?.total ? `₹${compareResult[0].fees_structure.obc_ews.total.toLocaleString()}` : "N/A"} val2={compareResult[1].fees_structure?.obc_ews?.total ? `₹${compareResult[1].fees_structure.obc_ews.total.toLocaleString()}` : "N/A"} />
                        <TableRow label="Fees (SC/ST)" val1={compareResult[0].fees_structure?.sc_st?.total ? `₹${compareResult[0].fees_structure.sc_st.total.toLocaleString()}` : "N/A"} val2={compareResult[1].fees_structure?.sc_st?.total ? `₹${compareResult[1].fees_structure.sc_st.total.toLocaleString()}` : "N/A"} isLast />
                    </View>
                </View>
            )}
        </ScrollView>
    );
}

const TableRow = ({ label, val1, val2, isLast = false, isType = false, isStatus = false, isBranches = false }: { label: string, val1: any, val2: any, isLast?: boolean, isType?: boolean, isStatus?: boolean, isBranches?: boolean }) => {
    const renderValue = (val: any) => {
        if (!val || val === "N/A") return <Text style={styles.rowValueText}>N/A</Text>;

        if (isBranches) {
            const branches = Object.entries(val as Record<string, number>);
            return (
                <View style={styles.branchChipsContainer}>
                    {branches.map(([name, intake], idx) => (
                        <View key={idx} style={styles.branchChip}>
                            <Text style={styles.branchChipText}>{`${name} - ${intake}`}</Text>
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
            return (
                <View style={styles.statusPill}>
                    <Text style={styles.statusPillText}>{val}</Text>
                </View>
            );
        }

        return <Text style={styles.rowValueText}>{val}</Text>;
    };

    return (
        <View style={[styles.tableRow, isLast && styles.noBorder]}>
            <View style={styles.featureCol}>
                <Text style={styles.rowLabelText}>{label}</Text>
            </View>
            <View style={styles.collegeCol}>
                {renderValue(val1)}
            </View>
            <View style={styles.collegeCol}>
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
        width: '100%',
        maxWidth: 500,
        alignSelf: 'center',
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
        width: '100%',
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
        alignSelf: 'flex-end',
    },
    submitButtonText: {
        color: "#fff",
        fontSize: 14,
        fontFamily: "SourceSans3SemiBold",
    },
    resultContainer: {
        marginTop: 16,
        width: '100%',
        maxWidth: 600,
        alignSelf: 'center',
    },
    tableCard: {
        backgroundColor: "#fff",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#e2e8f0",
        overflow: 'hidden',
    },
    tableTitle: {
        fontSize: 16,
        fontFamily: "SourceSans3SemiBo1ld",
        color: colors.primary,
        padding: 16,
        backgroundColor: "#f8faff",
        borderBottomWidth: 1,
        borderBottomColor: "#e2e8f0",
        textAlign: "center",
    },
    tableHeaderRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: "#e2e8f0",
        backgroundColor: "#fff",
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: "#f1f5f9",
        alignItems: 'center',
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
        justifyContent: 'center',
    },
    collegeCol: {
        flex: 1.5,
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 1,
        borderRightColor: "#e2e8f0",
    },
    headerText: {
        fontFamily: "SourceSans3SemiBold",
        color: colors.primary,
        fontSize: 13,
        textAlign: 'center',
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
        textAlign: 'center',
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
    statusPill: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#004aad",
        paddingVertical: 2,
        paddingHorizontal: 8,
        borderRadius: 99,
    },
    statusPillText: {
        fontSize: 11,
        color: "#004aad",
        fontFamily: "SourceSans3Medium",
        textAlign: "center",
    },
    branchChipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        justifyContent: 'center',
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
});
