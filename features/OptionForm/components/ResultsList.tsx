import React from "react";
import { View, Text } from "react-native";
import { formatBranchName } from "@/utils/formatHelpers";
import { styles } from "../styles";

interface ResultsListProps {
  results: any[];
}

const ResultsList = ({ results }: ResultsListProps) => (
  <View style={styles.resultsWrapper}>
    <View style={styles.resultsHeader}>
      <Text style={styles.resultsTitle}>Generated Options</Text>
      <View style={styles.resultsCountBadge}>
        <Text style={styles.resultsCount}>{results.length}</Text>
      </View>
    </View>

    {results.map((item: any, index: number) => (
      <View key={index} style={styles.cardContainer}>
        {/* Choice code and Type Tags */}
        <View style={styles.topRow}>
          <View style={styles.greenTag}>
            <Text style={styles.greenTagText}>{index + 1}</Text>
          </View>
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
      </View>
    ))}
  </View>
);

export default ResultsList;
