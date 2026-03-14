import CustomNavbar from "@/components/CustomNavbar";
import { useAuth } from "@/context/AuthContext";
import FindColleges from "@/features/colleges/FindColleges";
import CreateCollegeList from "@/features/colleges/CreateCollegeList";
import HomeScreen from "@/features/home/HomeScreen";
import MockTestScreen from "@/features/mocktest/MockTestScreen";
import Preparation from "@/features/preparation/Preparation";
import { useRouter, useFocusEffect } from "expo-router";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { ActivityIndicator, BackHandler, Platform, StyleSheet, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../constants/theme";

type TabName = "Home" | "Mock Tests" | "Colleges" | "Admission process" | "SMart option form" | "Preparation";

export default function Home() {
  const router = useRouter();
  const { checkAuth } = useAuth();
  // const [isVerifying, setIsVerifying] = useState(true);
  const [activeTab, setActiveTab] = useState<TabName>("Home");
  const activeTabRef = useRef(activeTab);

  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  // useEffect(() => {
  //   const verify = async () => {
  //     const isSignedIn = await checkAuth();
  //     if (!isSignedIn) {
  //       router.replace("/");
  //     }
  //     else {
  //       setIsVerifying(false);
  //     }
  //   };
  //   verify();
  // }, []);

  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        if (activeTabRef.current === "Home") {
          BackHandler.exitApp();
          return true;
        } else {
          setActiveTab("Home");
          return true;
        }
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => backHandler.remove();
    }, [])
  );

  // if (isVerifying) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f2f2f2" }}>
  //       <ActivityIndicator size="large" color={colors.primary} />
  //     </View>
  //   );
  // }

  const renderContent = () => {
    switch (activeTab) {
      case "Home":
        return <HomeScreen />;
      case "Preparation":
        return <Preparation />;
      case "Mock Tests":
        return <MockTestScreen />;
      case "Colleges":
        return <FindColleges />;
      case "Admission process":
        return (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontFamily: "SourceSans3Medium", fontSize: 18, color: colors.textDark }}>
              Coming Soon
            </Text>
          </View>
        );
      case "SMart option form":
        return <CreateCollegeList />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={['top', 'left', 'right']}>
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        {renderContent()}
      </View>

      {/* Navbar sits at the bottom */}
      <CustomNavbar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* SafeAreaView bottom padding is handled automatically by the safe area view wrapper generally, 
          but if we want the navbar to extend into the safe area bottom we might need to adjust.
          Standard SafeAreaView padding is usually good. */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
