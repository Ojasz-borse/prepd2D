import React from "react";
import { StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

interface Option {
  label: string;
  value: string;
}

interface CustomSelectProps {
  data: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  data,
  value,
  onChange,
  placeholder = "Select",
}) => {
  return (
    <Dropdown
      style={styles.dropdown}
      placeholderStyle={styles.placeholder}
      selectedTextStyle={styles.selectedText}
      data={data}
      maxHeight={220}
      labelField="label"
      valueField="value"
      placeholder={placeholder}
      value={value}
      onChange={(item) => onChange(item.value)}
    />
  );
};

export default CustomSelect;

const styles = StyleSheet.create({
  dropdown: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: "#e6f1ff",
    marginBottom: 12,
  },
  placeholder: {
    fontSize: 14,
    color: "#777",
    fontFamily: "BreeSerif", // ✅ custom font
  },
  selectedText: {
    fontSize: 14,
    color: "#000",
    fontFamily: "BreeSerif", // ✅ custom font
  },
});
