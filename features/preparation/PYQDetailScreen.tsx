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
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const current = allQuestions[index];
  if (!current) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#555" }}>No question data found</Text>
      </View>
    );
  }

  const options = [current.a, current.b, current.c, current.d];
  const correctIndex =
    current.correct_option?.trim().toLowerCase().charCodeAt(0) - 97; // "a"→0, "b"→1, etc.

  const handleSelect = (i: number) => {
    if (selectedOption !== null) return; // prevent re-select
    setSelectedOption(i);
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (index < allQuestions.length - 1) {
      setIndex(index + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    }
  };

  const handlePrev = () => {
    if (index > 0) {
      setIndex(index - 1);
      setSelectedOption(null);
      setShowExplanation(false);
    }
  };

  const getOptionStyle = (i: number) => {
    if (selectedOption === null) return styles.option;
    if (i === correctIndex) return [styles.option, styles.correctOption];
    if (i === selectedOption && i !== correctIndex)
      return [styles.option, styles.wrongOption];
    return styles.option;
  };

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
          <TouchableOpacity
            key={i}
            style={getOptionStyle(i)}
            onPress={() => handleSelect(i)}
            activeOpacity={0.8}
          >
            <Text style={styles.optionText}>
              {String.fromCharCode(65 + i)}. <MathText content={opt} />
            </Text>
          </TouchableOpacity>
        ))}

        {showExplanation && (
          <View style={styles.explanationBox}>
            <Text style={styles.explanationTitle}>Explanation:</Text>
            <MathText content={current.explanation_content} />
          </View>
        )}

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
  container: { flexGrow: 1, padding: 16, backgroundColor: "#fff" },
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
  },
  correctOption: {
    borderColor: "green",
  },
  wrongOption: {
    borderColor: "red",
  },
  optionText: { fontSize: 15, color: "#333", fontFamily: "SourceSans3Medium" },
  explanationBox: {
    backgroundColor: "#ebf8ff",
    marginTop: 14,
    padding: 10,
    borderRadius: 8,
  },
  explanationTitle: {
    color: "#004aad",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 6,
    fontFamily: "SourceSans3Medium",
  },
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
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
