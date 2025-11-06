import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

export default function PyqQuestionCardSkeleton() {
  const opacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const loop = Animated.loop(
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
    loop.start();
    return () => loop.stop();
  }, []);

  const Skeleton = (props: any) => (
    <Animated.View style={[styles.skeletonBox, { opacity }, props.style]} />
  );

  return (
    <View style={styles.cardGradient}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={styles.questionNumber}>
          <Skeleton style={{ height: 14, width: 80, borderRadius: 4 }} />
        </View>
        <View style={styles.arrowContainer}>
          <Ionicons name="chevron-forward" size={20} color="#d0d0d0" />
        </View>
      </View>

      {/* Question content (2-3 lines fake text) */}
      <View style={styles.questionContent}>
        <Skeleton
          style={{ width: "90%", height: 12, marginBottom: 6, borderRadius: 4 }}
        />
        <Skeleton
          style={{ width: "90%", height: 12, marginBottom: 6, borderRadius: 4 }}
        />
        <Skeleton
          style={{ width: "90%", height: 12, marginBottom: 6, borderRadius: 4 }}
        />

        <Skeleton style={{ width: "70%", height: 12, borderRadius: 4 }} />
      </View>

      {/* Footer */}
      <View style={styles.cardFooter}>
        <Skeleton style={{ width: 150, height: 12, borderRadius: 4 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardGradient: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#d9d9d9",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  questionNumber: {
    backgroundColor: "transparent",
  },
  arrowContainer: {
    justifyContent: "center",
  },
  questionContent: {
    marginTop: 12,
  },
  cardFooter: {
    marginTop: 10,
  },
  skeletonBox: {
    backgroundColor: "#e0e0e0",
  },
});
