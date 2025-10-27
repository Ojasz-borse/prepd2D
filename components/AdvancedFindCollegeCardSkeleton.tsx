import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

export default function AdvancedFindCollegeCardSkeleton() {
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
    <View style={styles.card3D}>
      {/* Top Row: choice code + type */}
      <View style={styles.subRow}>
        <SkeletonBox style={{ width: 80, height: 14, borderRadius: 4 }} />

        <View style={styles.typeRow}>
          <SkeletonBox style={{ width: 16, height: 16, borderRadius: 8 }} />
          <SkeletonBox style={{ width: 30, height: 14, borderRadius: 4 }} />
        </View>
      </View>

      {/* Branch Name */}
      <SkeletonBox
        style={{ width: "70%", height: 16, marginTop: 8, borderRadius: 4 }}
      />

      {/* College Name */}
      <SkeletonBox
        style={{ width: "90%", height: 14, marginTop: 6, borderRadius: 4 }}
      />

      {/* Cutoff Grid */}
      <View style={styles.cutoffWrapper}>
        {Array.from({ length: 4 }).map((_, idx) => (
          <View key={idx} style={styles.cutoffBox}>
            <SkeletonBox
              style={{
                width: 40,
                height: 10,
                borderRadius: 4,
                marginBottom: 4,
              }}
            />
            <SkeletonBox
              style={{
                width: 40,
                height: 14,
                borderRadius: 4,
              }}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card3D: {
    width: "100%",
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#d9d9d9",
    backgroundColor: "#fff",
  },
  subRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  typeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  cutoffWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 12,
  },
  cutoffBox: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  skeletonBox: {
    backgroundColor: "#e0e0e0",
  },
});
