import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View, ViewStyle } from "react-native";

type SkeletonProps = {
    style?: ViewStyle | ViewStyle[];
};

export default function ResourceCardSkeleton() {
    const opacity = useRef(new Animated.Value(0.6)).current;

    useEffect(() => {
        const loopAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 800,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.8,
                    duration: 800,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        );
        loopAnimation.start();

        return () => loopAnimation.stop();
    }, [opacity]);

    const SkeletonBox = ({ style }: SkeletonProps) => (
        <Animated.View style={[styles.skeletonBox, { opacity }, style]} />
    );

    return (
        <View style={styles.chapterTag}>
            {/* Date Pill */}
            <View style={styles.subRow}>
                <SkeletonBox style={{ width: 90, height: 22, borderRadius: 99 }} />
            </View>

            {/* Title + Description & PDF Button */}
            <View style={styles.titleRow}>
                <View style={{ flex: 1, paddingRight: 16 }}>
                    <SkeletonBox style={{ width: "80%", height: 20, borderRadius: 4, marginBottom: 8 }} />
                    <SkeletonBox style={{ width: "100%", height: 16, borderRadius: 4, marginBottom: 4 }} />
                    <SkeletonBox style={{ width: "90%", height: 16, borderRadius: 4 }} />
                </View>
                <SkeletonBox style={{ width: 65, height: 32, borderRadius: 999 }} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    chapterTag: {
        width: "100%",
        borderRadius: 16,
        padding: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#e2e8f0",
        backgroundColor: "#fff",
    },
    subRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    titleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    skeletonBox: {
        backgroundColor: "#e0e0e0",
    },
});
