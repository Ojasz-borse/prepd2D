import TopHeader from "@/components/TopHeader";
import Syllabus from "@/features/preparation/Syllabus";
import React from "react";
import { StyleSheet, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export default function SyllabusScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <TopHeader title="Syllabus" showBackArrow={true} />
            <View style={{ flex: 1, paddingHorizontal: 12 }}>
                <Syllabus />
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
