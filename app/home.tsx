import BookTabIcon from "@/assets/icons/BookTabIcon";
import MockTestTabIcon from "@/assets/icons/MockTestTabIcon";
import SearchCollegeTabIcon from "@/assets/icons/SearchCollegeTabIcon";
import { useAuth } from "@/context/AuthContext";
import FindColleges from "@/features/colleges/FindColleges";
import HomeScreen from "@/features/home/HomeScreen";
import MockTestScreen from "@/features/mocktest/MockTestScreen";
import Preparation from "@/features/preparation/Preparation";
import { FontAwesome5 } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { Platform, StyleSheet, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HomeTabIcon from "../assets/icons/HomeTabIcon";
import { colors } from "../constants/theme";

const Tab = createBottomTabNavigator();

export default function Home() {
  const router = useRouter();
  const { checkAuth } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);
  
  useEffect(() => {
    const verify = async () => {
      const isSignedIn = await checkAuth();
      if (!isSignedIn) {
        router.replace("/");
      }
      else{
        setIsVerifying(false);
      }
    };
    verify();
  }, []);

  if (isVerifying) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f2f2f2" }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f2f2f2" }}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textLight,
          tabBarStyle: {
            ...styles.tabBar,
            paddingTop: 5,
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
              <HomeTabIcon focused={focused} size={size} />
            ),
          }}
        >
          {() => <HomeScreen />}
        </Tab.Screen>

        <Tab.Screen
          name="Preparation"
          options={{
            tabBarLabel: "Preparation",
            tabBarIcon: ({ focused, size }) => (
              <BookTabIcon focused={focused} size={size} />
            ),
          }}
        >
          {() => <Preparation />}
        </Tab.Screen>

        {/* ✨ Middle Circular “Prep AI” Button */}
        <Tab.Screen
          name="PrepAI"
          component={HomeScreen}
          options={{
            tabBarLabel: "",
            tabBarButton: () => <PrepAIMiddleButton />,
          }}
        />

        <Tab.Screen
          name="Mock Tests"
          options={{
            tabBarLabel: "Mock Tests",
            tabBarIcon: ({ focused, size }) => (
              <MockTestTabIcon focused={focused} size={size} />
            ),
          }}
        >
          {() => <MockTestScreen />}
        </Tab.Screen>

        <Tab.Screen
          name="Colleges"
          options={{
            tabBarLabel: "Colleges",
            tabBarIcon: ({ focused, size }) => (
              <SearchCollegeTabIcon focused={focused} size={size} />
            ),
          }}
        >
          {() => <FindColleges />}
        </Tab.Screen>
      </Tab.Navigator>
    </SafeAreaView>
  );
}

// ✅ Custom middle button component
const PrepAIMiddleButton = () => {
  const router = useRouter();
  return (
    <View style={styles.middleButtonContainer}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => router.push("/ai-chat")}
      >
        <LinearGradient
          colors={["#3399ff", "#004aad"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.middleButton}
        >
          <FontAwesome5 name="magic" size={20} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#fff",
    height: 65,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    shadowColor: "#d3d3d3",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 8,
    paddingTop: -20,
  },
  tabBarLabel: {
    fontSize: 12,
    fontFamily: "SourceSans3SemiBold",
    marginTop: 0,
  },
  // 🔮 Prep AI button styling
  middleButtonContainer: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 20 : 10,
    alignSelf: "center",
  },
  middleButton: {
    width: 60,
    height: 60,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    shadowColor: "#999",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
});
