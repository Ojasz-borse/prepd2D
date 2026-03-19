import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

export default function CollegeDetailsBranchSkeleton() {
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

  const SkeletonBox = (props: any) => (
    <Animated.View style={[styles.skeletonBox, { opacity }, props.style]} />
  );

  return (
    <View style={styles.cardContainer}>
      {/* Top Metadata Row: Choice Code */}
      <View style={styles.topRow}>
        <SkeletonBox style={{ width: 70, height: 20, borderRadius: 99 }} />
      </View>

      {/* Branch & View Button Row */}
      <View style={styles.titleRow}>
        <SkeletonBox style={{ flex: 1, height: 20, borderRadius: 4 }} />
        <SkeletonBox style={styles.viewButtonSkeleton} />
      </View>

      {/* Cutoff Grid */}
      <View style={styles.cutoffWrapper}>
        {Array.from({ length: 4 }).map((_, idx) => (
          <SkeletonBox key={idx} style={styles.cutoffBox} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    gap: 8,
    height: 20,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    gap: 12,
    height: 32,
  },
  viewButtonSkeleton: {
    width: 60,
    height: 32,
    borderRadius: 999,
  },
  cutoffWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
    marginTop: 4,
  },
  cutoffBox: {
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    height: 35,
    width: 60,
  },
  skeletonBox: {
    backgroundColor: "#e0e0e0",
  },
});
