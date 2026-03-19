import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/theme";
import { styles } from "../styles";

interface EditButtonProps {
  onPress: () => void;
}

const EditButton = ({ onPress }: EditButtonProps) => (
  <TouchableOpacity style={styles.editButton} onPress={onPress} activeOpacity={0.8}>
    <LinearGradient
      colors={[colors.primary, '#002a6e']}
      style={styles.editButtonGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <Ionicons name="create-outline" size={20} color="#fff" />
      <Text style={styles.editButtonText}>Edit Form</Text>
    </LinearGradient>
  </TouchableOpacity>
);

export default EditButton;
