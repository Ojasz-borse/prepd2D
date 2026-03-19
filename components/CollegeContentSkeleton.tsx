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
      {/* Meta Row: Code + Status */}
      <View style={styles.metaRow}>
        <SkeletonBox style={{ width: 70, height: 22, borderRadius: 99 }} />
        <SkeletonBox style={{ width: 80, height: 22, borderRadius: 99, position: 'absolute', right: 0 }} />
      </View>

      {/* College Name + Icon Section */}
      <View style={styles.nameSection}>
        <SkeletonBox style={styles.iconCircle} />
        <View style={{ flex: 1, gap: 6 }}>
          <SkeletonBox style={{ width: "90%", height: 20, borderRadius: 4 }} />
          <SkeletonBox style={{ width: "70%", height: 20, borderRadius: 4 }} />
        </View>
      </View>

      {/* Address */}
      <View style={styles.address}>
        <SkeletonBox style={{ width: 18, height: 18, borderRadius: 4 }} />
        <SkeletonBox style={{ width: "80%", height: 16, borderRadius: 4 }} />
      </View>

      {/* NAAC Row */}
      <View style={styles.subRow}>
        <SkeletonBox style={{ width: 120, height: 28, borderRadius: 99 }} />
      </View>

      {/* Action Buttons Row */}
      <View style={styles.actionButtonsRow}>
        <SkeletonBox style={styles.viewButtonLike} />
        <SkeletonBox style={styles.viewButtonLike} />
        <SkeletonBox style={styles.viewButtonLike} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    gap: 12,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
    flexWrap: "wrap",
    position: 'relative',
    height: 22,
  },
  nameSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginVertical: 4,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: "#e0e0e0",
    marginTop: 2,
  },
  address: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 2,
    marginBottom: -8,
    paddingVertical: 8,
  },
  subRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 30,
    marginTop: 4,
  },
  actionButtonsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  viewButtonLike: {
    backgroundColor: "#e0e0e0",
    height: 32,
    borderRadius: 999,
    flex: 1,
  },
  skeletonBox: {
    backgroundColor: "#e0e0e0",
  },
});
