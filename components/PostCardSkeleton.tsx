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
      {/* Row: Profile + Posted by + Time */}
      <View style={styles.headerRow}>
        <SkeletonCircle style={{ width: 40, height: 40 }} />
        <View style={styles.headerTextContainer}>
          <SkeletonBox style={{ width: 120, height: 14 }} />
          <SkeletonBox style={{ width: 80, height: 12, marginTop: 5 }} />
        </View>
      </View>

      {/* Title */}
      <SkeletonBox style={{ width: "80%", height: 16, marginBottom: 8 }} />

      {/* Post text (3 lines) */}
      <SkeletonBox style={{ width: "100%", height: 12, marginBottom: 5 }} />
      <SkeletonBox style={{ width: "95%", height: 12, marginBottom: 5 }} />
      <SkeletonBox style={{ width: "70%", height: 12, marginBottom: 8 }} />

      {/* Bottom row */}
      <View style={styles.bottomRow}>
        <View style={styles.linkRow}>
          <SkeletonBox style={{ width: 60, height: 14 }} />
          <SkeletonCircle style={{ width: 16, height: 16 }} />
        </View>
        <SkeletonCircle style={{ width: 20, height: 20 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    backgroundColor: "#fff",
    padding: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: "#d3d3d3",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  headerTextContainer: {
    flexDirection: "column",
    marginLeft: 10,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  skeletonBox: {
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
  },
  skeletonCircle: {
    backgroundColor: "#e0e0e0",
    borderRadius: 50,
  },
});
