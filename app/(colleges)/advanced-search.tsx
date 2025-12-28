import TopHeader from "@/components/TopHeader";
import AdvancedFindCollege from "@/features/colleges/AdvancedFindCollege";
import { useAdvancedColleges } from "@/hooks/useAdvancedColleges";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AdvancedSearchScreen() {
    const {
        branches,
        branchesLoading,
        branchesError,
    } = useAdvancedColleges();

    return (
        <SafeAreaView style={styles.container}>
            <TopHeader title="Advanced Search" showBackArrow={true} />
            <View style={styles.content}>
                <AdvancedFindCollege
                    branches={branches}
                    loading={branchesLoading}
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
