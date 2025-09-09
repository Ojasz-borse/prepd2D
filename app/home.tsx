// app/home.tsx
import AiChatTabIcon from "@/assets/icons/AiChatTabIcon";
import EstimatorTabIcon from "@/assets/icons/EstimatorTabIcon";
import SearchCollegeTabIcon from "@/assets/icons/SearchCollegeTabIcon";
import { useAuth } from "@/context/AuthContext";
import FindColleges from "@/features/colleges/FindColleges";
import EstimatorScreen from "@/features/estimator/EstimatorScreen";
import HomeScreen from "@/features/home/HomeScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HomeTabIcon from "../assets/icons/HomeTabIcon";
import { colors, fonts } from "../constants/theme";

const Tab = createBottomTabNavigator();

export default function Home() {
  const router = useRouter();

  const { checkAuth, logout } = useAuth();

  useEffect(() => {
    const verify = async () => {
      const isSignedIn = await checkAuth();
      if (!isSignedIn) {
        router.replace("/"); // ❌ redirect if not logged in
      }
    };
    verify();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textLight,
          tabBarStyle: {
            ...styles.tabBar,
            paddingTop: 10,
            paddingBottom: 20,
          },
          tabBarLabelStyle: styles.tabBarLabel,
        }}
      >
        <Tab.Screen
          name="Home"
          options={{
            tabBarLabel: "Home",
            tabBarIcon: ({ focused, size }) => (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  top: 2,
                }}
              >
                <HomeTabIcon focused={focused} size={size} />
              </View>
            ),
          }}
        >
          {() => <HomeScreen />}
        </Tab.Screen>

        <Tab.Screen
          name="Estimator"
          options={{
            tabBarLabel: "Estimator",
            tabBarIcon: ({ focused, size }) => (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  top: 2,
                }}
              >
                <EstimatorTabIcon focused={focused} size={size} />
              </View>
            ),
          }}
        >
          {() => <EstimatorScreen />}
        </Tab.Screen>

        <Tab.Screen
          name="Ask me"
          options={{
            tabBarLabel: "Ask me",
            tabBarIcon: ({ focused, size }) => (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  top: 2,
                }}
              >
                <AiChatTabIcon focused={focused} size={size} />
              </View>
            ),
          }}
        >
          {() => (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                top: 200,
              }}
            >
              <TouchableOpacity onPress={logout}>
                <Text>Logout</Text>
              </TouchableOpacity>
            </View>
          )}
        </Tab.Screen>

        <Tab.Screen
          name="Find Colleges"
          options={{
            tabBarLabel: "Find Colleges",
            tabBarIcon: ({ focused, size }) => (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  top: 2,
                }}
              >
                <SearchCollegeTabIcon focused={focused} size={size} />
              </View>
            ),
          }}
        >
          {() => <FindColleges />}
        </Tab.Screen>
      </Tab.Navigator>
    </SafeAreaView>
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
    paddingTop: 10,
    paddingBottom: 5,
    height: 80,
    shadowColor: "#d3d3d3",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 8,
  },
  tabBarLabel: {
    fontSize: 12,
    fontFamily: "BreeSerif",
    marginTop: 4,
  },
});
