// app/home.tsx
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, fonts } from "../constants/theme";

const Tab = createBottomTabNavigator();

function ScreenComponent({ title }: { title: string }) {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenTitle}>{title} Screen</Text>
    </View>
  );
}

export default function Home() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tab.Screen 
        name="Home" 
        options={{ 
          tabBarLabel: "Home",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons 
              name={focused ? "home" : "home-outline"} 
              size={size} 
              color={color} 
            />
          )
        }}
      >
        {() => <ScreenComponent title="Home" />}
      </Tab.Screen>
      
      <Tab.Screen 
        name="Find Colleges" 
        options={{ 
          tabBarLabel: "Colleges",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons 
              name={focused ? "school" : "school-outline"} 
              size={size} 
              color={color} 
            />
          )
        }}
      >
        {() => <ScreenComponent title="Find Colleges" />}
      </Tab.Screen>
      
      <Tab.Screen 
        name="Chatbot" 
        options={{ 
          tabBarLabel: "Chatbot",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons 
              name={focused ? "chatbubble" : "chatbubble-outline"} 
              size={size} 
              color={color} 
            />
          )
        }}
      >
        {() => <ScreenComponent title="Chatbot" />}
      </Tab.Screen>
      
      <Tab.Screen 
        name="Percentile Calculator" 
        options={{ 
          tabBarLabel: "Calculator",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons 
              name={focused ? "calculator" : "calculator-outline"} 
              size={size} 
              color={color} 
            />
          )
        }}
      >
        {() => <ScreenComponent title="Percentile Calculator" />}
      </Tab.Screen>
      
      <Tab.Screen 
        name="Profile" 
        options={{ 
          tabBarLabel: "Profile",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons 
              name={focused ? "person" : "person-outline"} 
              size={size} 
              color={color} 
            />
          )
        }}
      >
        {() => <ScreenComponent title="Profile" />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.textDark,
    fontFamily: fonts.semiBold,
  },
  tabBar: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
    paddingBottom: 8,
    height: 60,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 8,
  },
  tabBarLabel: {
    fontSize: 12,
    fontFamily: fonts.regular,
    marginTop: 4,
  },
});

