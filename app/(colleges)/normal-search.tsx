import TopHeader from "@/components/TopHeader";
import NormalFindCollege from "@/features/colleges/NormalFindCollege";
import { useAdvancedColleges } from "@/hooks/useAdvancedColleges";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NormalSearchScreen() {
    const {
        colleges,
        collegesLoading,
        branchesError,
    } = useAdvancedColleges();

    return (
        <SafeAreaView style={styles.container}>
            <TopHeader title="Normal Search" showBackArrow={true} />
            <View style={styles.content}>
                <NormalFindCollege
                    colleges={colleges}
                    loading={collegesLoading}
                    error={branchesError}
                    isActive={true}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    content: {
        flex: 1,
        paddingHorizontal: 12,
    },
});
