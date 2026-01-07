import TopHeader from "@/components/TopHeader";
import Notes from "@/features/preparation/Notes";
import { usePYQS } from "@/hooks/usePYQS";
import React from "react";
import { StyleSheet, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export default function NotesScreen() {
    const { pyqs, loading, error, reload } = usePYQS();
    return (
        <SafeAreaView style={styles.container}>
            <TopHeader title="Notes" showBackArrow={true} />
            <View style={{ flex: 1, paddingHorizontal: 12 }}>
                <Notes pyqs={pyqs} loading={loading} error={error} reload={reload} />
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
