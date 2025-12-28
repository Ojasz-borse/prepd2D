import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View, ViewStyle } from "react-native";

type SkeletonProps = {
    style?: ViewStyle | ViewStyle[];
};

export default function NotesCardSkeleton() {
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
                    toValue: 0.6,
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
            {/* Sub Row: Subject & Class Pills */}
            <View style={styles.subRow}>
                <SkeletonBox style={{ width: 80, height: 20, borderRadius: 99 }} />
                <SkeletonBox style={{ width: 50, height: 20, borderRadius: 99 }} />
            </View>

            {/* Title Row: Title & PDF Button */}
            <View style={styles.titleRow}>
                <SkeletonBox style={{ width: "65%", height: 16, borderRadius: 4 }} />
                <SkeletonBox style={{ width: 60, height: 24, borderRadius: 999 }} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    chapterTag: {
        width: "100%",
        borderRadius: 16,
        padding: 12,
        borderWidth: 1,
        borderColor: "#e2e8f0",
        backgroundColor: "#fff",
        marginBottom: 16,
    },
    subRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
        gap: 8,
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
