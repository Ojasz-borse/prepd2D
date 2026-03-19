import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

export default function CollegeFeesSkeleton() {
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
    <View style={styles.container}>
      {/* Dropdown Skeleton */}
      <View style={styles.dropdownWrapper}>
        <View style={styles.rightGroup}>
          <SkeletonBox style={styles.dropdownSkeleton} />
        </View>
      </View>

      {/* Fees Card Skeleton */}
      <View style={styles.card}>
        <View style={styles.feesWrapper}>
          <SkeletonBox style={styles.feeBox} />
          <SkeletonBox style={styles.feeBox} />
          <SkeletonBox style={styles.feeBox} />
        </View>

        {/* Total Fees */}
        <View style={styles.totalRow}>
          <SkeletonBox style={{ width: 80, height: 16, borderRadius: 4 }} />
          <SkeletonBox style={styles.totalPill} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  dropdownWrapper: {
    flexDirection: "row",
    marginBottom: 10,
    marginTop: -45,
  },
  rightGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "auto",
  },
  dropdownSkeleton: {
    width: 100,
    height: 30,
    borderRadius: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  feesWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
  },
  feeBox: {
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 2,
    alignItems: "center",
    flex: 1,
    height: 48,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  totalPill: {
    width: 100,
    height: 32,
    borderRadius: 20,
  },
  skeletonBox: {
    backgroundColor: "#e0e0e0",
  },
});
