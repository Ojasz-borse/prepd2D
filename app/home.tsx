import CustomNavbar from "@/components/CustomNavbar";
import AdmissionProcess from "@/features/admissionProcess/AdmissionProcess";
import { useAuth } from "@/context/AuthContext";
import FindColleges from "@/features/colleges/FindColleges";
import OptionForm from "@/features/OptionForm/OptionForm";
import HomeScreen from "@/features/home/HomeScreen";
import MockTestScreen from "@/features/mocktest/MockTestScreen";
import Preparation from "@/features/preparation/Preparation";
import { useRouter, useFocusEffect } from "expo-router";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { ActivityIndicator, BackHandler, Platform, StyleSheet, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../constants/theme";
import DisclaimerModal from "@/components/DisclaimerModal";
import AsyncStorage from "@react-native-async-storage/async-storage";

type TabName = "Home" | "Mock Tests" | "Colleges" | "Admission process" | "Option Form" | "Preparation";

export default function Home() {
  const router = useRouter();
  const { checkAuth } = useAuth();
  // const [isVerifying, setIsVerifying] = useState(true);
  const [activeTab, setActiveTab] = useState<TabName>("Home");
  const [initialSubTab, setInitialSubTab] = useState<string | null>(null);
  const activeTabRef = useRef(activeTab);
  const [isDisclaimerVisible, setIsDisclaimerVisible] = useState(false);

  useEffect(() => {
    const checkDisclaimer = async () => {
      try {
        const hasShown = await AsyncStorage.getItem("disclaimer_shown");
        if (!hasShown) {
          setIsDisclaimerVisible(true);
        }
      } catch (error) {
        console.error("Error reading disclaimer status:", error);
      }
    };
    checkDisclaimer();
  }, []);

  const handleCloseDisclaimer = async () => {
    try {
      await AsyncStorage.setItem("disclaimer_shown", "true");
      setIsDisclaimerVisible(false);
    } catch (error) {
      console.error("Error saving disclaimer status:", error);
      setIsDisclaimerVisible(false);
    }
  };

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
        return <HomeScreen onTabChange={(tab, subTab) => {
          setActiveTab(tab);
          if (subTab) setInitialSubTab(subTab);
        }} />;
      case "Preparation":
        return <Preparation />;
      case "Mock Tests":
        return <MockTestScreen />;
      case "Colleges":
        return <FindColleges initialTab={initialSubTab as any} />;
      case "Admission process":
        return <AdmissionProcess />;
      case "Option Form":
        return <OptionForm />;
      default:
        return <HomeScreen onTabChange={(tab, subTab) => {
          setActiveTab(tab);
          if (subTab) setInitialSubTab(subTab);
        }} />;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={['top', 'left', 'right']}>
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        {renderContent()}
      </View>

      {/* Navbar sits at the bottom */}
      <CustomNavbar activeTab={activeTab} onTabChange={(tab) => {
        setActiveTab(tab);
        setInitialSubTab(null);
      }} />

      <DisclaimerModal 
        visible={isDisclaimerVisible} 
        onClose={handleCloseDisclaimer} 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
