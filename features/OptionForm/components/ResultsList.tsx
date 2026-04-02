import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { formatBranchName } from "@/utils/formatHelpers";
import { styles } from "../styles";

interface ResultsListProps {
  results: any[];
  onEdit: () => void;
  onAddSuggestion?: (item: any) => void;
}

const getProbabilityColor = (prob?: string) => {
  switch (prob?.toLowerCase()) {
    case "dream": return "#9333ea"; // Purple
    case "safe": return "#22c55e"; // Green
    case "realistic": return "#3b82f6"; // Blue
    case "target": return "#f59e0b"; // Amber/Orange
    default: return "#cbd5e1";
  }
};

const ResultsList = ({ results, onEdit, onAddSuggestion }: ResultsListProps) => (
  <View style={styles.resultsWrapper}>
    <View style={styles.resultsHeader}>
      <View style={styles.titleWithCount}>
        <Text style={styles.resultsTitle}>Generated Options</Text>
        <View style={styles.resultsCountBadge}>
          <Text style={styles.resultsCount}>{results.length}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.editChip}
        onPress={onEdit}
        activeOpacity={0.7}
      >
        <Ionicons name="pencil-outline" size={13} color="#004aad" />
        <Text style={styles.editChipText}>Edit</Text>
      </TouchableOpacity>
    </View>

    <View style={styles.resultsListContainer}>
      {(() => {
        let currentNumber = 0;
        return results.map((item: any, index: number) => {
          const isSuggestion = item.is_suggestion === true;
          if (!isSuggestion) currentNumber++;

          const isTFWS = item.choice_code?.endsWith("T");

          return (
            <View key={index} style={[styles.cardContainer, isSuggestion && styles.suggestionCard]}>
              {/* Top Right Probability Dot */}
              {item.probability && (
                <View
                  style={[
                    styles.probabilityDot,
                    { backgroundColor: getProbabilityColor(item.probability) },
                  ]}
                />
              )}

              <View style={isSuggestion ? styles.suggestionWrapper : null}>
                {/* Choice code and Type Tags */}
                <View style={styles.topRow}>
                  {!isSuggestion && (
                    <Text style={styles.numberingText}>{currentNumber}.</Text>
                  )}
                  {item.choice_code && (
                    <View style={styles.greenTag}>
                      <Text style={styles.greenTagText}>{item.choice_code}</Text>
                    </View>
                  )}
                  {isTFWS && (
                    <View style={styles.tfwsTag}>
                      <Text style={styles.tfwsTagText}>TFWS</Text>
                    </View>
                  )}
                </View>

                {/* Branch Name */}
                <View style={styles.titleRow}>
                  <Text style={styles.resultBranchName}>
                    {formatBranchName(item.branch_name || "")}
                  </Text>
                </View>

                {/* College Name */}
                <View style={styles.collegeRow}>
                  <Text style={styles.collegePillText}>{item.college_name}</Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginTop: 10, }}>
                  {item.considered_percentile !== undefined && item.considered_percentile !== null && (
                    <View style={styles.cutoffChip}>
                      <Text style={styles.cutoffChipText}>
                        Last year Cutoff: {Number(item.considered_percentile).toFixed(2)}
                      </Text>
                    </View>
                  )}

                </View>
              </View>

              {isSuggestion && (
                <View style={styles.suggestionInfo}>
                  <View style={{ flex: 1, opacity: 0.55 }}>
                    <Text style={styles.suggestionInfoText}>
                      This branch is suggested based on your preference.
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.addSuggestionBtn}
                    onPress={() => onAddSuggestion?.(item)}
                    activeOpacity={0.7}
                  >
                    <Feather name="plus" size={14} color="#fff" />
                    <Text style={styles.addSuggestionBtnText}>Add</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        });
      })()}
    </View>
  </View>
);

export default ResultsList;
