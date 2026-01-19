import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

export default function PostCardSkeleton() {
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

  const SkeletonBox = (props: any) => (
    <Animated.View style={[styles.skeletonBox, { opacity }, props.style]} />
  );

  const SkeletonCircle = (props: any) => (
    <Animated.View style={[styles.skeletonCircle, { opacity }, props.style]} />
  );

  return (
    <View style={styles.container}>
      {/* Title */}
      <SkeletonBox style={{ width: "70%", height: 18, marginBottom: 12, borderRadius: 6 }} />

      {/* Post text (3 lines) */}
      <SkeletonBox style={{ width: "100%", height: 14, marginBottom: 8, borderRadius: 4 }} />
      <SkeletonBox style={{ width: "95%", height: 14, marginBottom: 8, borderRadius: 4 }} />
      <SkeletonBox style={{ width: "60%", height: 14, marginBottom: 4, borderRadius: 4 }} />

      {/* Bottom row */}
      <View style={styles.bottomRow}>
        <SkeletonCircle style={{ width: 18, height: 18, marginRight: 16 }} />
        <SkeletonCircle style={{ width: 18, height: 18 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 12,
  },
  skeletonBox: {
    backgroundColor: "#f1f5f9",
    borderRadius: 4,
  },
  skeletonCircle: {
    backgroundColor: "#f1f5f9",
    borderRadius: 50,
  },
});
