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
      {/* Fees Card Skeleton */}
      <View style={styles.card}>
        <View style={styles.fees_row}>
          {/* Tuition Fees */}
          <View>
            <SkeletonBox
              style={{
                width: 80,
                height: 10,
                borderRadius: 4,
                marginBottom: 4,
              }}
            />
            <SkeletonBox style={{ width: 60, height: 16, borderRadius: 4 }} />
          </View>

          {/* Plus sign */}
          <SkeletonBox style={{ width: 12, height: 12, borderRadius: 7 }} />

          {/* Development Fees */}
          <View>
            <SkeletonBox
              style={{
                width: 80,
                height: 10,
                borderRadius: 4,
                marginBottom: 4,
              }}
            />
            <SkeletonBox style={{ width: 60, height: 16, borderRadius: 4 }} />
          </View>

          {/* Plus sign */}
          <SkeletonBox style={{ width: 12, height: 12, borderRadius: 7 }} />

          {/* Other Fees */}
          <View>
            <SkeletonBox
              style={{
                width: 80,
                height: 10,
                borderRadius: 4,
                marginBottom: 4,
              }}
            />
            <SkeletonBox style={{ width: 60, height: 16, borderRadius: 4 }} />
          </View>
        </View>

        {/* Total Fees */}
        <SkeletonBox
          style={{ width: 100, height: 16, borderRadius: 4, marginTop: 18 }}
        />
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
    justifyContent: "flex-end",
    marginBottom: 12,
  },
  card: {
    paddingVertical: 12,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#d9d9d9",
  },
  fees_row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  skeletonBox: {
    backgroundColor: "#e0e0e0",
  },
});
