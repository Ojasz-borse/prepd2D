import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles";

interface QuickAccessProps {
  onTabChange: (tab: "timeline" | "learn") => void;
}

const QuickAccess = ({ onTabChange }: QuickAccessProps) => {

  interface QuickAccessItem {
    title: string;
    icon: string;
    color: string;
    tab?: "timeline" | "learn";
    action?: () => void;
  }

  const items: QuickAccessItem[] = [
    { 
      title: "Timeline", 
      icon: "time-outline", 
      tab: "timeline",
      color: "#004aad"
    },
    { 
      title: "Learn", 
      icon: "book-outline", 
      tab: "learn",
      color: "#b6cf4f"
    },
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
            onPress={() => item.action ? item.action() : onTabChange(item.tab!)}
          >
            <View
              style={[
                styles.quickIconBox,
                {
                  backgroundColor: `${item.color}20`,
                },
              ]}
            >
              <Ionicons
                name={item.icon as any}
                size={24}
                color={item.color}
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
