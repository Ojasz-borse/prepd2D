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

export default function CompareColleges({ colleges }: CompareCollegesProps) {
    const [college1, setCollege1] = useState<string>("");
    const [college2, setCollege2] = useState<string>("");

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

            const response = await fetchWithRetry(url, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token ? `Bearer ${token}` : "",
                }
            });

            console.log(response)

            const data = await response.json();
            console.log("Compare Response:", data);
        } catch (error) {
            console.error("Error comparing colleges:", error);
            alert("Failed to compare colleges. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <LinearGradient
                colors={["#ffffff", "#f8faff"]}
                style={styles.card}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
            >
                <View style={styles.inputWrapper}>
                    <Text style={styles.label}>Select First College</Text>
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
                    <Text style={styles.label}>Select Second College</Text>
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
                    <LinearGradient
                        colors={['#ff7a22', '#e66a1f']}
                        style={styles.submitButtonGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <Text style={styles.submitButtonText}>Compare</Text>
                        <Ionicons name="git-compare-outline" size={20} color="#fff" />
                    </LinearGradient>
                </TouchableOpacity>
            </LinearGradient>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        paddingVertical: 12,
        alignItems: "center",
    },
    card: {
        borderRadius: 16,
        padding: 24,
        width: '100%',
        maxWidth: 500,
        alignSelf: 'center',
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
        marginTop: 20,
        borderRadius: 30,
        overflow: 'hidden',
        width: '100%',
    },
    submitButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 24,
        gap: 8,
        width: '100%',
    },
    submitButtonText: {
        color: "#fff",
        fontFamily: "SourceSans3SemiBold",
        fontSize: 16,
    },
});
