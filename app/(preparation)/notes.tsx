import TopHeader from "@/components/TopHeader";
import Notes from "@/features/preparation/Notes";
import React from "react";
import { StyleSheet, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export default function NotesScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <TopHeader title="Notes" showBackArrow={true} />
            <View style={{ flex: 1, paddingHorizontal: 12 }}>
                <Notes />
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
