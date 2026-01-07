import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

export default function QuestionCardSkeleton() {
    const opacity = useRef(new Animated.Value(0.6)).current;

    useEffect(() => {
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 700,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.6,
                    duration: 700,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        );

        loop.start();
        return () => loop.stop();
    }, [opacity]);

    const Box = (props: any) => (
        <Animated.View style={[styles.box, { opacity }, props.style]} />
    );

    return (
        <View style={styles.card}>

            {/* Top Row */}
            <View style={styles.rowTop}>
                <Box style={{ width: 90, height: 14, borderRadius: 99 }} />
                <Box style={{ width: 45, height: 12, borderRadius: 4 }} />
            </View>

            {/* Question Content */}
            <View style={styles.content}>
                <Box style={{ width: "85%", height: 16, borderRadius: 6 }} />
                <Box style={{ width: "92%", height: 16, marginTop: 8, borderRadius: 6 }} />
                <Box style={{ width: "60%", height: 16, marginTop: 8, borderRadius: 6 }} />
            </View>

            {/* Bottom Row */}
            <View style={styles.rowBottom}>
                <Box style={{ width: 150, height: 12, borderRadius: 99 }} />
                <Box style={{ width: 70, height: 26, borderRadius: 999 }} />
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: "100%",
        borderRadius: 16,
        padding: 12,
        borderWidth: 1,
        borderColor: "#e2e8f0",
        backgroundColor: "#fff",
        marginBottom: 16,
    },
    rowTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    content: {
        marginTop: 6,
        marginBottom: 14,
    },
    rowBottom: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 6,
    },
    box: {
        backgroundColor: "#e0e0e0",
    },
});
