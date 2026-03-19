import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles";

interface QuickAccessProps {
  onTabChange: (tab: "generate") => void;
}

const QuickAccess = ({ onTabChange }: QuickAccessProps) => {
  const items = [
    { title: "Generate List", icon: "create-outline", tab: "generate" as const },
  ];

  return (
    <View style={styles.quickCard}>
      <Text style={styles.quickHeading}>Quick Access</Text>
      <View style={styles.quickGrid}>
        {items.map((item, i) => (
          <TouchableOpacity
            key={i}
            activeOpacity={0.7}
            style={styles.quickItem}
            onPress={() => onTabChange(item.tab)}
          >
            <View
              style={[
                styles.quickIconBox,
                {
                  backgroundColor:
                    item.tab === "generate" ? "#ff7a2220" : "#004aad20",
                },
              ]}
            >
              <Ionicons
                name={item.icon as any}
                size={24}
                color={item.tab === "generate" ? "#ff7a22" : "#004aad"}
              />
            </View>
            <Text style={styles.quickTitle}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default QuickAccess;
