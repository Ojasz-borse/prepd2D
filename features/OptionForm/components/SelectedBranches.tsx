import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/theme";
import { formatBranchName } from "@/utils/formatHelpers";
import { styles } from "../styles";

interface SelectedBranchesProps {
  branches: string[];
  setBranches: (branches: string[]) => void;
  moveBranch: (index: number, direction: "up" | "down") => void;
}

const SelectedBranches = ({ branches, setBranches, moveBranch }: SelectedBranchesProps) => (
  <View style={styles.selectedSection}>
    <View style={styles.selectedSectionHeader}>
      <Text style={styles.selectedSectionTitle}>Branches Preferrence</Text>
      <TouchableOpacity onPress={() => setBranches([])}>
        <Text style={styles.clearAllText}>Clear All</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.branchesContainer}>
      {branches.map((branch: string, index: number) => (
        <View key={branch} style={styles.branchCard}>
          <View style={styles.branchInfo}>
            <View style={styles.branchNumber}>
              <Text style={styles.branchNumberText}>{index + 1}</Text>
            </View>
            <Text style={styles.branchName}>
              {formatBranchName(branch)}
            </Text>
          </View>

          <View style={styles.branchActions}>
            <TouchableOpacity
              onPress={() => moveBranch(index, "up")}
              disabled={index === 0}
              style={[styles.actionButton, index === 0 && styles.disabledButton]}
            >
              <Ionicons name="chevron-up" size={20} color={index === 0 ? "#ccc" : colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => moveBranch(index, "down")}
              disabled={index === branches.length - 1}
              style={[styles.actionButton, index === branches.length - 1 && styles.disabledButton]}
            >
              <Ionicons name="chevron-down" size={20} color={index === branches.length - 1 ? "#ccc" : colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setBranches(branches.filter((b: string) => b !== branch))}
              style={styles.actionButton}
            >
              <Ionicons name="close-circle" size={20} color="#ff3b30" />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  </View>
);

export default SelectedBranches;
