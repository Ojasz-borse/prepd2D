import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { formatBranchName } from "@/utils/formatHelpers";
import { styles } from "../styles";
import { useRouter } from "expo-router";

interface ResultsListProps {
  results: any[];
  onEdit: () => void;
  onAddSuggestion?: (item: any) => void;
  onSave?: () => void;
  isReadOnly?: boolean;
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

const ResultsList = ({ results, onEdit, onAddSuggestion, onSave, isReadOnly }: ResultsListProps) => {
  const router = useRouter();

  const handleCardPress = (item: any, index: number) => {
    // Assuming college_code is available or can be derived from choice_code
    const collegeCode = item.college_code || item.choice_code?.substring(0, 4);

    if (collegeCode) {
      router.push({
        pathname: "/college-details",
        params: { 
          college_code: collegeCode,
          collegeIndex: index.toString()
        },
      });
    }
  };

  return (
    <View style={styles.resultsWrapper}>
      <View style={styles.resultsHeader}>
        <View style={styles.titleWithCount}>
          <Text style={styles.resultsTitle}>Generated Options</Text>
          <View style={styles.resultsCountBadge}>
            <Text style={styles.resultsCount}>{results.filter(item => !item.is_suggestion).length}</Text>
          </View>
        </View>
        {!isReadOnly && (
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity
              style={[styles.editChip, { backgroundColor: '#004aad15', borderColor: '#004aad' }]}
              onPress={onSave}
              activeOpacity={0.7}
            >
              <Ionicons name="bookmark-outline" size={13} color="#004aad" />
              <Text style={styles.editChipText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.editChip}
              onPress={onEdit}
              activeOpacity={0.7}
            >
              <Ionicons name="pencil-outline" size={13} color="#004aad" />
              <Text style={styles.editChipText}>Edit</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Probability Legend */}
      <View style={styles.legendWrapper}>
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#9333ea" }]} />
            <Text style={styles.legendText}>Dream</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#3b82f6" }]} />
            <Text style={styles.legendText}>Realistic</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#f59e0b" }]} />
            <Text style={styles.legendText}>Target</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#22c55e" }]} />
            <Text style={styles.legendText}>Safe</Text>
          </View>
          {!isReadOnly && (
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { borderStyle: 'dashed', borderWidth: 1, borderColor: '#64748b', backgroundColor: '#f8fafc' }]} />
              <Text style={styles.legendText}>AI Suggested</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.resultsListContainer}>
        {(() => {
          let currentNumber = 0;
          return results.map((item: any, index: number) => {
            const isSuggestion = item.is_suggestion === true;
            if (!isSuggestion) currentNumber++;

            const isTFWS = item.choice_code?.endsWith("T");

            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.9}
                onPress={() => handleCardPress(item, index)}
                style={[styles.cardContainer, isSuggestion && styles.suggestionCard]}
              >
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
                      onPress={(e) => {
                        e.stopPropagation();
                        onAddSuggestion?.(item);
                      }}
                      activeOpacity={0.7}
                    >
                      <Feather name="plus" size={14} color="#fff" />
                      <Text style={styles.addSuggestionBtnText}>Add</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            );
          });
        })()}
      </View>
    </View>
  );
};

export default ResultsList;
