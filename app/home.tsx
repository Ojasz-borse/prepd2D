import EstimatorTabIcon from "@/assets/icons/EstimatorTabIcon";
import { ProfilePageIcon } from "@/assets/icons/ProfilePageIcon";
import SearchCollegeTabIcon from "@/assets/icons/SearchCollegeTabIcon";
import { useAuth } from "@/context/AuthContext";
import FindColleges from "@/features/colleges/FindColleges";
import EstimatorScreen from "@/features/estimator/EstimatorScreen";
import HomeScreen from "@/features/home/HomeScreen";
import ProfileScreen from "@/features/profile/ProfileScreen";
import { FontAwesome5 } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HomeTabIcon from "../assets/icons/HomeTabIcon";
import { colors } from "../constants/theme";

const Tab = createBottomTabNavigator();

export default function Home() {
  const router = useRouter();
  const { checkAuth } = useAuth();

  useEffect(() => {
    const verify = async () => {
      const isSignedIn = await checkAuth();
      if (!isSignedIn) {
        router.replace("/");
      }
    };
    verify();
  }, []);

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
          name="Estimator"
          options={{
            tabBarLabel: "Estimator",
            tabBarIcon: ({ focused, size }) => (
              <EstimatorTabIcon focused={focused} size={size} />
            ),
          }}
        >
          {() => <EstimatorScreen />}
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

        <Tab.Screen
          name="My Profile"
          options={{
            tabBarLabel: "My Profile",
            tabBarIcon: ({ focused, size }) => (
              <ProfilePageIcon focused={focused} size={size} />
            ),
          }}
        >
          {() => <ProfileScreen />}
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
          colors={["#e699ff", "#99b3ff"]}
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
