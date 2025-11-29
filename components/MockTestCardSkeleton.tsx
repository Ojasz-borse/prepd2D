import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

export default function MockTestCardSkeleton() {
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
    <View style={styles.card}>
      {/* Title */}
      <SkeletonBox
        style={{ width: "70%", height: 18, borderRadius: 6, marginBottom: 10 }}
      />

      {/* Bottom Row */}
      <View style={styles.row}>
        {/* Shift Time */}
        <SkeletonBox
          style={{
            width: 80,
            height: 20,
            borderRadius: 8,
          }}
        />

        {/* Shift Date */}
        <SkeletonBox
          style={{
            width: 100,
            height: 20,
            borderRadius: 8,
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#d9d9d9",
    backgroundColor: "#fff",
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  skeletonBox: {
    backgroundColor: "#e0e0e0",
  },
});
