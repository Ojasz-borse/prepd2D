import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function CollegeBranches() {
  return (
    <View>
      <View style={styles.card3D}>
        <View style={styles.subRow}>
          <Text style={styles.subText}>CE20927172</Text>
          <Text style={styles.subText}>Intake: 250</Text>
        </View>
        <Text style={styles.collegeName}>Computer Engineering</Text>
        <View style={styles.cutoffWrapper}>
          <View style={[styles.cutoffBox]}>
            <Text style={styles.cutoffCategory}>OPEN</Text>
            <Text style={styles.cutoffValue}>34.88</Text>
          </View>
          <View style={[styles.cutoffBox]}>
            <Text style={styles.cutoffCategory}>OBC</Text>
            <Text style={styles.cutoffValue}>34.88</Text>
          </View>
          <View style={[styles.cutoffBox]}>
            <Text style={styles.cutoffCategory}>SC/ST</Text>
            <Text style={styles.cutoffValue}>34.88</Text>
          </View>
          <View style={[styles.cutoffBox]}>
            <Text style={styles.cutoffCategory}>VJNT</Text>
            <Text style={styles.cutoffValue}>34.88</Text>
          </View>
        </View>
      </View>

      <View style={styles.card3D}>
        <View style={styles.subRow}>
          <Text style={styles.subText}>CE20927172</Text>
          <Text style={styles.subText}>Intake: 250</Text>
        </View>
        {/* Branch */}
        <Text style={styles.collegeName}>College of engineering pune</Text>

        {/* Cutoff Grid */}
        <View style={styles.cutoffWrapper}>
          <View style={[styles.cutoffBox]}>
            <Text style={styles.cutoffCategory}>OPEN</Text>
            <Text style={styles.cutoffValue}>34.88</Text>
          </View>
          <View style={[styles.cutoffBox]}>
            <Text style={styles.cutoffCategory}>OBC</Text>
            <Text style={styles.cutoffValue}>34.88</Text>
          </View>
          <View style={[styles.cutoffBox]}>
            <Text style={styles.cutoffCategory}>SC/ST</Text>
            <Text style={styles.cutoffValue}>34.88</Text>
          </View>
          <View style={[styles.cutoffBox]}>
            <Text style={styles.cutoffCategory}>VJNT</Text>
            <Text style={styles.cutoffValue}>34.88</Text>
          </View>
        </View>
      </View>

      <View style={styles.card3D}>
        <View style={styles.subRow}>
          <Text style={styles.subText}>CE20927172</Text>
          <Text style={styles.subText}>Intake: 250</Text>
        </View>
        {/* Branch */}
        <Text style={styles.collegeName}>College of engineering pune</Text>

        {/* Cutoff Grid */}
        <View style={styles.cutoffWrapper}>
          <View style={[styles.cutoffBox]}>
            <Text style={styles.cutoffCategory}>OPEN</Text>
            <Text style={styles.cutoffValue}>34.88</Text>
          </View>
          <View style={[styles.cutoffBox]}>
            <Text style={styles.cutoffCategory}>OBC</Text>
            <Text style={styles.cutoffValue}>34.88</Text>
          </View>
          <View style={[styles.cutoffBox]}>
            <Text style={styles.cutoffCategory}>SC/ST</Text>
            <Text style={styles.cutoffValue}>34.88</Text>
          </View>
          <View style={[styles.cutoffBox]}>
            <Text style={styles.cutoffCategory}>VJNT</Text>
            <Text style={styles.cutoffValue}>34.88</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  subRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  typeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: 100,
    gap: 4,
  },
  subText: {
    fontSize: 14,
    color: "#004aad",
    fontFamily: "BreeSerif",
  },

  card3D: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#d9d9d9",
  },

  collegeName: {
    marginTop: 2,
    fontSize: 16,
    color: "#000",
    fontWeight: "600",
    fontFamily: "BreeSerif",
  },

  cutoffWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 12,
  },
  cutoffBox: {
    backgroundColor: "#e6f1ff",
    borderRadius: 8,
    paddingVertical: 4,
    minWidth: 50,
    alignItems: "center",
  },

  cutoffCategory: {
    fontSize: 10,
    fontWeight: "700",
    color: "#0A5BD3",
    letterSpacing: 0.4,
    fontFamily: "BreeSerif",
  },
  cutoffValue: {
    fontSize: 12,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 2,
    fontFamily: "BreeSerif",
  },
});
