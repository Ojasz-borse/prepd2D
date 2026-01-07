import TopHeader from "@/components/TopHeader";
import PYQ from "@/features/preparation/PYQ";
import { usePYQS } from "@/hooks/usePYQS";
import React from "react";
import { StyleSheet, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export default function PyqScreen() {
    const { pyqs, loading, error, reload } = usePYQS();
    return (
        <SafeAreaView style={styles.container}>
            <TopHeader title="Previous Year Questions" showBackArrow={true} />
            <View style={{ flex: 1, paddingHorizontal: 12 }}>
                <PYQ pyqs={pyqs} loading={loading} error={error} reload={reload} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
});
