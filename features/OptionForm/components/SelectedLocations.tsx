import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { formatLocationName } from "@/utils/formatHelpers";
import { styles } from "../styles";

interface SelectedLocationsProps {
  locations: string[];
  setLocations: (locations: string[]) => void;
}

const SelectedLocations = ({ locations, setLocations }: SelectedLocationsProps) => (
  <View style={styles.selectedSection}>
    <View style={styles.selectedSectionHeader}>
      <Text style={styles.selectedSectionTitle}>Preferred Locations</Text>
      <TouchableOpacity onPress={() => setLocations([])}>
        <Text style={styles.clearAllText}>Clear All</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.chipContainer}>
      {locations.map((loc: string) => (
        <View key={loc} style={styles.chip}>
          <Text style={styles.chipText}>{formatLocationName(loc)}</Text>
          <TouchableOpacity
            onPress={() => setLocations(locations.filter((l: string) => l !== loc))}
            style={styles.chipCloseBtn}
          >
            <Ionicons name="close-circle" size={18} color="#ff3b30" />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  </View>
);

export default SelectedLocations;
