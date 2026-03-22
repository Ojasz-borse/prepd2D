import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { formatBranchName } from "@/utils/formatHelpers";
import { styles } from "../styles";

interface ResultsListProps {
  results: any[];
  onEdit: () => void;
}

const ResultsList = ({ results, onEdit }: ResultsListProps) => (
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
      {results.map((item: any, index: number) => (
        <View key={index} style={styles.cardContainer}>
          {/* Choice code and Type Tags */}
          <View style={styles.topRow}>
            <Text style={styles.numberingText}>{index + 1}.</Text>
            {item.choice_code && (
              <View style={styles.greenTag}>
                <Text style={styles.greenTagText}>{item.choice_code}</Text>
              </View>
            )}
            {item.is_government !== undefined && (
              <View style={styles.greenTag}>
                <Text style={styles.greenTagText}>
                  {item.is_government ? "Govt" : "Pvt"}
                </Text>
              </View>
            )}
            {item.is_realistic && (
              <Ionicons name="checkmark-circle" size={18} color="#16a34a" style={{ marginLeft: 'auto' }} />
            )}
          </View>

          {/* Branch Name */}
          <View style={styles.titleRow}>
            <Text style={styles.resultBranchName}>
              {formatBranchName(item.branch)}
            </Text>
          </View>

          {/* College Name */}
          <View style={styles.collegeRow}>
            <Text style={styles.collegePillText}>{item.college}</Text>
          </View>

          {item.cutoff_percentile !== undefined && item.cutoff_percentile !== null && (
            <View style={styles.cutoffChip}>
              <Text style={styles.cutoffChipText}>
                Last year Cuttoff: {Number(item.cutoff_percentile).toFixed(2)}
              </Text>
            </View>
          )}
        </View>
      ))}
    </View>
  </View>
);

export default ResultsList;
