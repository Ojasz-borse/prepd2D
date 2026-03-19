import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/theme";
import { styles } from "../styles";

interface DropdownItemProps {
  label: string;
  isSelected: boolean;
}

const DropdownItem: React.FC<DropdownItemProps> = ({ label, isSelected }) => (
  <View style={styles.itemRow}>
    <Ionicons
      name={isSelected ? "checkbox" : "square-outline"}
      size={20}
      color={isSelected ? colors.primary : "#999"}
      style={{ marginRight: 8 }}
    />
    <Text style={[styles.itemText, isSelected && { color: colors.primary }]}>
      {label}
    </Text>
  </View>
);

export default DropdownItem;
