import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { styles } from "../styles";

interface QuickAccessProps {
  onTabChange: (tab: "generate") => void;
}

const QuickAccess = ({ onTabChange }: QuickAccessProps) => {
  const router = useRouter();
  
  interface QuickAccessItem {
    title: string;
    icon: string;
    tab?: "generate";
    action?: () => void;
  }

  const items: QuickAccessItem[] = [
    { title: "Generate List", icon: "create-outline", tab: "generate" },
    { title: "Saved Form", icon: "bookmark-outline", action: () => router.push("/create-college-list/saved-lists") },
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
            onPress={() => (item.action ? item.action() : onTabChange(item.tab!))}
          >
            <View
              style={[
                styles.quickIconBox,
                {
                  backgroundColor:
                    item.title === "Saved Form" ? "#b6cf4f20" : item.tab === "generate" ? "#ff7a2220" : "#004aad20",
                },
              ]}
            >
              <Ionicons
                name={item.icon as any}
                size={24}
                color={item.title === "Saved Form" ? "#b6cf4f" : item.tab === "generate" ? "#ff7a22" : "#004aad"}
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
