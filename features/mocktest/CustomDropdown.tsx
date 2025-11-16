import { Ionicons } from "@expo/vector-icons"; // ✅ Expo icon library
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface Option {
  label: string;
  value: "physics" | "chemistry" | "maths";
}

interface CustomDropdownProps {
  data: Option[];
  value: Option["value"];
  onChange: (item: Option) => void;
  width?: number;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  data,
  value,
  onChange,
  width = 140,
}) => {
  const [open, setOpen] = useState(false);

  const selectedItem = data.find((i) => i.value === value);

  // Option order to restrict going back
  const order = ["physics", "chemistry", "maths"];

  const [highestIndex, setHighestIndex] = useState(order.indexOf(value));

  const handleSelect = (item: Option) => {
    const currentIndex = order.indexOf(value);
    const newIndex = order.indexOf(item.value);

    // Update the highest reached index
    if (newIndex > highestIndex) {
      setHighestIndex(newIndex);
    }

    // If trying to go back below highest reached index, show alert
    if (newIndex < highestIndex) {
      Alert.alert(
        "Cannot go back",
        `You cannot go back from ${value} to ${item.value}`
      );
      setOpen(false);
      return;
    }

    onChange(item);
    setOpen(false);
  };

  return (
    <TouchableWithoutFeedback onPress={() => setOpen(false)}>
      <View style={[styles.wrapper, { width }]}>
        {/* Dropdown box */}
        <TouchableOpacity
          style={styles.box}
          activeOpacity={0.8}
          onPress={(e) => {
            e.stopPropagation?.();
            setOpen(!open);
          }}
        >
          <Text style={styles.boxText}>
            {selectedItem ? selectedItem.label : "Select"}
          </Text>
          <Ionicons
            name={open ? "chevron-up" : "chevron-down"}
            size={16}
            color="#333"
          />
        </TouchableOpacity>

        {/* Dropdown items */}
        {open && (
          <View style={[styles.dropdown, { width }]}>
            <FlatList
              data={data}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.itemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CustomDropdown;

const styles = StyleSheet.create({
  wrapper: { position: "relative", backgroundColor: "#fff", zIndex: 9999 },
  box: {
    height: 25,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 8,
    backgroundColor: "#fff",
    zIndex: 9999,
  },
  boxText: { fontSize: 12, color: "#333" },
  dropdown: {
    position: "absolute",
    top: 35,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    maxHeight: 140,
    zIndex: 9999,
    elevation: 5,
  },
  item: { paddingVertical: 8, paddingHorizontal: 10 },
  itemText: { fontSize: 12, color: "#333" },
});
