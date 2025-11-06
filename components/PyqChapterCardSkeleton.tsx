import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View, ViewStyle } from "react-native";

type SkeletonProps = {
  style?: ViewStyle | ViewStyle[];
};

export default function PyqChapterCardSkeleton() {
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
      {/* Subject + Class */}
      <View style={styles.subRow}>
        <SkeletonBox style={{ width: 70, height: 12 }} />
        <SkeletonBox style={{ width: 40, height: 12 }} />
      </View>

      {/* Chapter name */}
      <SkeletonBox style={{ width: "85%", height: 14, marginVertical: 6 }} />

      {/* Bottom row */}
      <View style={styles.bottomSubRow}>
        <SkeletonBox style={{ width: 110, height: 12 }} />
        <SkeletonBox style={{ width: 90, height: 12 }} />
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
    borderColor: "#d9d9d9",
    backgroundColor: "#fff",
  },
  subRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  bottomSubRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  skeletonBox: {
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
  },
});
