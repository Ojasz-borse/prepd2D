import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

export default function NormalFindCollegeCardSkeleton() {
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
      {/* Top row: College code + type */}
      <View style={styles.subRow}>
        <SkeletonBox style={{ width: 60, height: 14, borderRadius: 4 }} />

        <View style={styles.typeRow}>
          <SkeletonBox style={{ width: 16, height: 16, borderRadius: 8 }} />
          <SkeletonBox style={{ width: 30, height: 14, borderRadius: 4 }} />
        </View>
      </View>

      {/* College name */}
      <SkeletonBox
        style={{ width: "80%", height: 16, marginTop: 6, borderRadius: 4 }}
      />
      <SkeletonBox
        style={{ width: "80%", height: 16, marginTop: 6, borderRadius: 4 }}
      />

      {/* Status */}
      <SkeletonBox
        style={{ width: "50%", height: 12, marginTop: 6, borderRadius: 4 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card3D: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#d9d9d9",
  },
  subRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  typeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: 50,
    gap: 6,
  },
  skeletonBox: {
    backgroundColor: "#e0e0e0",
  },
});
