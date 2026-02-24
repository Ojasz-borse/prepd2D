import TopHeader from "@/components/TopHeader";
import PYQ from "@/features/preparation/PYQ";
import { usePYQS } from "@/hooks/usePYQS";
import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useSubscriptionLock } from "@/hooks/useSubcribtion";
import SubscriptionLockSheet from "@/components/ShowLockScreen";

import { SafeAreaView } from "react-native-safe-area-context";

export default function PyqScreen() {
    const { pyqs, loading, error, reload } = usePYQS();
    const { user } = useAuth();

    // const { isAllowed } = useSubscriptionLock({
    //     gate: "before",
    // });
    // const [showLock, setShowLock] = useState(false);

    // useEffect(() => {
    //     if (!loading && !isAllowed) {
    //         const timer = setTimeout(() => {
    //             setShowLock(true);
    //         }, 2000);

    //         return () => clearTimeout(timer);
    //     } else {
    //         setShowLock(false);
    //     }
    // }, [loading, isAllowed]);

    return (
        <SafeAreaView style={styles.container}>
            <TopHeader title="Previous Year Questions" showBackArrow={true} />
            <View style={{ flex: 1, paddingHorizontal: 12 }}>
                <PYQ pyqs={pyqs} loading={loading} error={error} reload={reload} />
            </View>

            {/* {showLock && (
                <SubscriptionLockSheet
                    visible={showLock}
                    planType="before"
                    onClose={() => setShowLock(false)}
                />
            )} */}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
});
