import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

export default function CollegeContentSkeleton() {
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
      {/* Top Row: Choice Code + Type */}
      <View style={styles.topRow}>
        <SkeletonBox style={{ width: 60, height: 14, borderRadius: 4 }} />
        <View style={styles.typeRow}>
          <SkeletonBox style={{ width: 16, height: 16, borderRadius: 8 }} />
          <SkeletonBox style={{ width: 80, height: 14, borderRadius: 4 }} />
        </View>
      </View>

      {/* Branch Name */}
      <SkeletonBox
        style={{ width: "60%", height: 16, marginTop: 8, borderRadius: 4 }}
      />

      {/* College Name */}
      <SkeletonBox
        style={{ width: "80%", height: 14, marginTop: 6, borderRadius: 4 }}
      />

      {/* Location / District */}
      <SkeletonBox
        style={{ width: "40%", height: 12, marginTop: 6, borderRadius: 4 }}
      />

      {/* Other small info rows */}
      <View style={styles.topRow}>
        <SkeletonBox style={{ width: 100, height: 24, borderRadius: 16, marginTop: 10, }} />
        <SkeletonBox style={{ width: 100, height: 24, borderRadius: 8, marginTop: 10, }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {

  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  typeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  skeletonBox: {
    backgroundColor: "#e0e0e0",
  },
});
