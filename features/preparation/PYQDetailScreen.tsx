import MathText from "@/components/MathText";
import TopHeader from "@/components/TopHeader";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface PYQItem {
  id: number;
  pyq_content: string;
  a: string;
  b: string;
  c: string;
  d: string;
  correct_option: string;
  explanation_content: string;
}

export default function PYQDetailsPage() {
  const { data, currentIndex } = useLocalSearchParams<{
    data: string;
    currentIndex: string;
  }>();

  const allQuestions: PYQItem[] = JSON.parse(data || "[]");
  const [index, setIndex] = useState(parseInt(currentIndex || "0", 10));

  const current = allQuestions[index];

  const handleNext = () => {
    if (index < allQuestions.length - 1) setIndex(index + 1);
  };

  const handlePrev = () => {
    if (index > 0) setIndex(index - 1);
  };

  if (!current) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#555" }}>No question data found</Text>
      </View>
    );
  }

  const options = [current.a, current.b, current.c, current.d];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopHeader title="PYQ Section" showBackArrow={true} />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.qTitle}>
          <MathText content={current.pyq_content} />
        </Text>

        {options.map((opt, i) => (
          <View key={i} style={styles.option}>
            <Text style={styles.optionText}>
              {String.fromCharCode(65 + i)}. <MathText content={opt} />
            </Text>
          </View>
        ))}

        <Text style={styles.explanation}>
          <MathText content={current.explanation_content} />
        </Text>

        <View style={styles.navRow}>
          <TouchableOpacity
            style={[styles.navBtn, index === 0 && styles.disabledBtn]}
            disabled={index === 0}
            onPress={handlePrev}
          >
            <Text style={styles.navText}>Previous</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.navBtn,
              index === allQuestions.length - 1 && styles.disabledBtn,
            ]}
            disabled={index === allQuestions.length - 1}
            onPress={handleNext}
          >
            <Text style={styles.navText}>Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  qTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#111",
    lineHeight: 24,
    marginBottom: 14,
    fontFamily: "SourceSans3Medium",
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    fontFamily: "SourceSans3Medium",
  },
  optionText: { fontSize: 15, color: "#333", fontFamily: "SourceSans3Medium" },
  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  navBtn: {
    backgroundColor: "#004aad",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  disabledBtn: {
    backgroundColor: "#999",
  },
  navText: { color: "#fff", fontSize: 15 },
  explanation: {
    backgroundColor: "#ebf8ff",
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    fontSize: 14,
    color: "#004aad",
    fontFamily: "SourceSans3Medium",
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
