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

          return (
            <View key={index} style={[styles.cardContainer, isSuggestion && styles.suggestionCard]}>
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
                  {item.probability && (
                    <View style={[styles.greenTag, { backgroundColor: item.probability === 'Dream' ? '#eef2ff' : '#f0fdf4', borderColor: item.probability === 'Dream' ? '#c7d2fe' : '#bbf7d0' }]}>
                      <Text style={[styles.greenTagText, { color: item.probability === 'Dream' ? '#4338ca' : '#15803d' }]}>
                        {item.probability}
                      </Text>
                    </View>
                  )}
                  {item.probability === 'Realistic' && (
                    <Ionicons name="checkmark-circle" size={18} color="#16a34a" style={{ marginLeft: 'auto' }} />
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

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                  {item.considered_percentile !== undefined && item.considered_percentile !== null && (
                    <View style={styles.cutoffChip}>
                      <Text style={styles.cutoffChipText}>
                        Last year Cutoff: {Number(item.considered_percentile).toFixed(2)}
                      </Text>
                    </View>
                  )}
                  {item.fees && (
                    <Text style={{ fontSize: 13, color: '#64748b', fontFamily: 'SourceSans3SemiBold' }}>
                      Fees: ₹{item.fees.toLocaleString()}
                    </Text>
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
